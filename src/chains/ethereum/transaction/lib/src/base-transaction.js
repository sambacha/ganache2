"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTransaction = exports.calculateIntrinsicGas = void 0;
const utils_1 = require("@ganache/utils");
const ethereum_address_1 = require("@ganache/ethereum-address");
const params_1 = require("./params");
const MAX_UINT64 = 1n << (64n - 1n);
/**
 * Compute the 'intrinsic gas' for a message with the given data.
 * @param data - The transaction's data
 * @param hasToAddress - boolean,
 * @param common - The Common use to determine gas costs
 * @returns The absolute minimum amount of gas this transaction will consume,
 * or `-1` if the data in invalid (gas consumption would exceed `MAX_UINT64`
 * (`(2n ** 64n) - 1n`).
 */
const calculateIntrinsicGas = (data, hasToAddress, common) => {
    const hardfork = common.hardfork();
    // Set the starting gas for the raw transaction
    let gas = params_1.Params.TRANSACTION_GAS;
    // if it doesn't have a "to" address this is a contract creation and it costs
    // `TRANSACTION_CREATION` more gas.
    if (!hasToAddress)
        gas += params_1.Params.TRANSACTION_CREATION;
    if (data) {
        const input = data.toBuffer();
        // Bump the required gas by the amount of transactional data
        const dataLength = input.byteLength;
        if (dataLength > 0) {
            const TRANSACTION_DATA_NON_ZERO_GAS = params_1.Params.TRANSACTION_DATA_NON_ZERO_GAS.get(hardfork);
            const TRANSACTION_DATA_ZERO_GAS = params_1.Params.TRANSACTION_DATA_ZERO_GAS;
            // Zero and non-zero bytes are priced differently
            let nonZeroBytes = 0n;
            for (const b of input) {
                if (b !== 0) {
                    nonZeroBytes++;
                }
            }
            // Make sure we don't exceed uint64 for all data combinations.
            // TODO: make sure these upper-bound checks are safe to remove, then
            // remove if so.
            // NOTE: This is an upper-bounds limit ported from geth that doesn't
            // make sense for Ethereum, as exceeding the upper bound would require
            // something like 200+ Petabytes of data.
            // https://github.com/ethereum/go-ethereum/blob/cf856ea1ad96ac39ea477087822479b63417036a/core/state_transition.go#L106-L141
            //
            // explanation:
            // `(MAX_UINT64 - gas) / TRANSACTION_DATA_NON_ZERO_GAS` is the maximum
            // number of "non-zero bytes" geth can handle.
            if ((MAX_UINT64 - gas) / TRANSACTION_DATA_NON_ZERO_GAS < nonZeroBytes) {
                return -1n;
            }
            gas += nonZeroBytes * TRANSACTION_DATA_NON_ZERO_GAS;
            const zeroBytes = BigInt(dataLength) - nonZeroBytes;
            // explanation:
            // `(MAX_UINT64 - gas) / TRANSACTION_DATA_ZERO_GAS` is the maximum number
            // of "zero bytes" geth can handle after subtracting out the cost of
            // the "non-zero bytes"
            if ((MAX_UINT64 - gas) / TRANSACTION_DATA_ZERO_GAS < zeroBytes) {
                return -1n;
            }
            gas += zeroBytes * TRANSACTION_DATA_ZERO_GAS;
        }
    }
    return gas;
};
exports.calculateIntrinsicGas = calculateIntrinsicGas;
class BaseTransaction {
    constructor(common, extra) {
        this.common = common;
        if (extra) {
            this.setExtra(extra);
        }
    }
    setExtra(raw) {
        const [from, hash, blockHash, blockNumber, index, effectiveGasPrice] = raw;
        this.from = ethereum_address_1.Address.from(from);
        this.hash = utils_1.Data.from(hash, 32);
        this.blockHash = utils_1.Data.from(blockHash, 32);
        this.blockNumber = utils_1.Quantity.from(blockNumber);
        this.index = utils_1.Quantity.from(index);
        this.effectiveGasPrice = utils_1.Quantity.from(effectiveGasPrice);
    }
    calculateIntrinsicGas() {
        const hasToAddress = this.to != null && !this.to.toBuffer().equals(utils_1.BUFFER_EMPTY);
        return exports.calculateIntrinsicGas(this.data, hasToAddress, this.common);
    }
}
exports.BaseTransaction = BaseTransaction;
//# sourceMappingURL=base-transaction.js.map