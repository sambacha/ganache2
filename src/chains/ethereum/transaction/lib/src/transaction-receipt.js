"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _gasUsed, _init;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionReceipt = void 0;
const ethereum_utils_1 = require("@ganache/ethereum-utils");
const rlp_1 = require("@ganache/rlp");
const utils_1 = require("@ganache/utils");
const utils_2 = require("@ganache/utils");
const STATUSES = [utils_2.RPCQUANTITY_ZERO, utils_2.RPCQUANTITY_ONE];
class TransactionReceipt {
    constructor(data) {
        _gasUsed.set(this, void 0);
        _init.set(this, (status, cumulativeGasUsed, logsBloom, logs, gasUsed, contractAddress = null, type = null) => {
            this.raw = [status, cumulativeGasUsed, logsBloom, logs];
            this.contractAddress = contractAddress;
            __classPrivateFieldSet(this, _gasUsed, gasUsed);
            this.txType = type;
        });
        if (data) {
            const decoded = rlp_1.decode(data);
            __classPrivateFieldGet(this, _init).call(this, decoded[0], decoded[1], decoded[2], decoded[3], decoded[4], decoded[5]);
        }
    }
    static fromValues(status, cumulativeGasUsed, logsBloom, logs, gasUsed, contractAddress, type = null) {
        const receipt = new TransactionReceipt();
        __classPrivateFieldGet(receipt, _init).call(receipt, status, cumulativeGasUsed, logsBloom, logs, gasUsed, contractAddress, type);
        return receipt;
    }
    serialize(all) {
        if (this.encoded == null) {
            this.encoded = rlp_1.encodeRange(this.raw, 0, 4);
        }
        if (all) {
            // the database format includes gasUsed and the contractAddress:
            const extras = [
                __classPrivateFieldGet(this, _gasUsed),
                this.contractAddress
            ];
            const epilogue = rlp_1.encodeRange(extras, 0, 2);
            return rlp_1.digest([this.encoded.output, epilogue.output], this.encoded.length + epilogue.length);
        }
        else {
            // receipt trie format:
            const serialized = rlp_1.digest([this.encoded.output], this.encoded.length);
            return this.txType
                ? Buffer.concat([this.txType.toBuffer(), serialized])
                : serialized;
        }
    }
    toJSON(block, transaction, common) {
        const raw = this.raw;
        const contractAddress = this.contractAddress.length === 0
            ? null
            : utils_1.Data.from(this.contractAddress);
        const blockHash = block.hash();
        const blockNumber = block.header.number;
        const blockLog = ethereum_utils_1.BlockLogs.create(blockHash);
        const transactionHash = transaction.hash;
        const transactionIndex = transaction.index;
        blockLog.blockNumber = blockNumber;
        raw[3].forEach(l => blockLog.append(transactionIndex, transactionHash, l));
        const logs = [...blockLog.toJSON()];
        if (block.header.baseFeePerGas) {
            transaction.updateEffectiveGasPrice(block.header.baseFeePerGas);
        }
        const json = {
            transactionHash,
            transactionIndex,
            blockNumber,
            blockHash,
            from: transaction.from,
            to: contractAddress ? null : transaction.to,
            cumulativeGasUsed: utils_1.Quantity.from(raw[1]),
            gasUsed: utils_1.Quantity.from(__classPrivateFieldGet(this, _gasUsed)),
            contractAddress,
            logs,
            logsBloom: utils_1.Data.from(raw[2], 256),
            status: STATUSES[raw[0][0]],
            effectiveGasPrice: transaction.effectiveGasPrice
        };
        if (transaction.type && common.isActivatedEIP(2718)) {
            json.type = transaction.type;
        }
        return json;
    }
}
exports.TransactionReceipt = TransactionReceipt;
_gasUsed = new WeakMap(), _init = new WeakMap();
//# sourceMappingURL=transaction-receipt.js.map