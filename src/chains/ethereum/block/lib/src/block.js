"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const utils_1 = require("@ganache/utils");
const ethereum_transaction_1 = require("@ganache/ethereum-transaction");
const rlp_1 = require("@ganache/rlp");
const runtime_block_1 = require("./runtime-block");
const utils_2 = require("@ganache/utils");
const block_params_1 = require("./block-params");
class Block {
    constructor(serialized, common) {
        this._common = common;
        if (serialized) {
            const deserialized = rlp_1.decode(serialized);
            this._raw = deserialized[0];
            this._rawTransactions = deserialized[1] || [];
            // TODO: support actual uncle data (needed for forking!)
            // Issue: https://github.com/trufflesuite/ganache/issues/786
            // const uncles = deserialized[2];
            const totalDifficulty = deserialized[3];
            this.header = runtime_block_1.makeHeader(this._raw, totalDifficulty);
            this._rawTransactionMetaData = deserialized[4] || [];
            this._size = utils_1.Quantity.from(deserialized[5]).toNumber();
        }
    }
    hash() {
        return (this._hash || (this._hash = utils_1.Data.from(utils_2.keccak(rlp_1.encode(this._raw)), 32)));
    }
    getTransactions() {
        const common = this._common;
        return this._rawTransactions.map((raw, index) => {
            const [from, hash] = this._rawTransactionMetaData[index];
            const extra = [
                from,
                hash,
                this.hash().toBuffer(),
                this.header.number.toBuffer(),
                utils_1.Quantity.from(index).toBuffer()
            ];
            return ethereum_transaction_1.TransactionFactory.fromDatabaseTx(raw, common, extra);
        });
    }
    toJSON(includeFullTransactions = false) {
        const hash = this.hash();
        const txFn = this.getTxFn(includeFullTransactions);
        const hashBuffer = hash.toBuffer();
        const header = this.header;
        const number = header.number.toBuffer();
        const common = this._common;
        const jsonTxs = this._rawTransactions.map((raw, index) => {
            const [from, hash] = this._rawTransactionMetaData[index];
            const extra = [
                from,
                hash,
                hashBuffer,
                number,
                utils_1.Quantity.from(index).toBuffer()
            ];
            const tx = ethereum_transaction_1.TransactionFactory.fromDatabaseTx(raw, common, extra);
            // we could either parse the raw data to check if the tx is type 2,
            // get the maxFeePerGas and maxPriorityFeePerGas, use those to calculate
            // the effectiveGasPrice and add it to `extra` above, or we can just
            // leave it out of extra and update the effectiveGasPrice after like this
            tx.updateEffectiveGasPrice(header.baseFeePerGas);
            return txFn(tx);
        });
        return {
            hash,
            ...header,
            size: utils_1.Quantity.from(this._size),
            transactions: jsonTxs,
            uncles: [] // this.value.uncleHeaders.map(function(uncleHash) {return to.hex(uncleHash)})
        };
    }
    getTxFn(include = false) {
        if (include) {
            return (tx) => tx.toJSON(this._common);
        }
        else {
            return (tx) => tx.hash;
        }
    }
    static fromParts(rawHeader, txs, totalDifficulty, extraTxs, size, common) {
        const block = new Block(null, common);
        block._raw = rawHeader;
        block._rawTransactions = txs;
        block.header = runtime_block_1.makeHeader(rawHeader, totalDifficulty);
        block._rawTransactionMetaData = extraTxs;
        block._size = size;
        return block;
    }
    static calcNextBaseFeeBigInt(parentHeader) {
        let nextBaseFee;
        const header = parentHeader;
        const parentGasTarget = header.gasLimit.toBigInt() / block_params_1.BlockParams.ELASTICITY;
        const parentGasUsed = header.gasUsed.toBigInt();
        const baseFeePerGas = header.baseFeePerGas
            ? header.baseFeePerGas.toBigInt()
            : block_params_1.BlockParams.INITIAL_BASE_FEE_PER_GAS;
        if (parentGasTarget === parentGasUsed) {
            // If the parent gasUsed is the same as the target, the baseFee remains unchanged.
            nextBaseFee = baseFeePerGas;
        }
        else if (parentGasUsed > parentGasTarget) {
            // If the parent block used more gas than its target, the baseFee should increase.
            const gasUsedDelta = parentGasUsed - parentGasTarget;
            const adjustedFeeDelta = (baseFeePerGas * gasUsedDelta) /
                parentGasTarget /
                block_params_1.BlockParams.BASE_FEE_MAX_CHANGE_DENOMINATOR;
            if (adjustedFeeDelta > 1n) {
                nextBaseFee = baseFeePerGas + adjustedFeeDelta;
            }
            else {
                nextBaseFee = baseFeePerGas + 1n;
            }
        }
        else {
            // Otherwise if the parent block used less gas than its target, the baseFee should decrease.
            const gasUsedDelta = parentGasTarget - parentGasUsed;
            const adjustedFeeDelta = (baseFeePerGas * gasUsedDelta) /
                parentGasTarget /
                block_params_1.BlockParams.BASE_FEE_MAX_CHANGE_DENOMINATOR;
            nextBaseFee = baseFeePerGas - adjustedFeeDelta;
        }
        return nextBaseFee;
    }
    static calcNBlocksMaxBaseFee(blocks, parentHeader) {
        const { BASE_FEE_MAX_CHANGE_DENOMINATOR } = block_params_1.BlockParams;
        let maxPossibleBaseFee = this.calcNextBaseFeeBigInt(parentHeader);
        // we must calculate each future block's max base fee individually because
        // each block's base fee must be appropriately "floored" (Math.floor) before
        // the following block's base fee is calculated. If we don't do this we'll
        // end up with compounding rounding errors.
        // FYI: the more performant, but rounding error-prone, way is:
        // return lastMaxBlockBaseFee + (lastMaxBlockBaseFee * ((BASE_FEE_MAX_CHANGE_DENOMINATOR-1)**(blocks-1)) / ((BASE_FEE_MAX_CHANGE_DENOMINATOR)**(blocks-1)))
        while (--blocks) {
            maxPossibleBaseFee +=
                maxPossibleBaseFee / BASE_FEE_MAX_CHANGE_DENOMINATOR;
        }
        return maxPossibleBaseFee;
    }
    static calcNextBaseFee(parentBlock) {
        const header = parentBlock.header;
        if (header.baseFeePerGas === undefined) {
            return undefined;
        }
        else {
            return this.calcNextBaseFeeBigInt(header);
        }
    }
}
exports.Block = Block;
/**
 *  Base fee per gas for blocks without a parent containing a base fee per gas.
 */
Block.INITIAL_BASE_FEE_PER_GAS = block_params_1.BlockParams.INITIAL_BASE_FEE_PER_GAS;
//# sourceMappingURL=block.js.map