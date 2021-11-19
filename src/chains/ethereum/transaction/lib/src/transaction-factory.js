"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionFactory = exports.TransactionType = void 0;
const utils_1 = require("@ganache/utils");
const legacy_transaction_1 = require("./legacy-transaction");
const eip2930_access_list_transaction_1 = require("./eip2930-access-list-transaction");
const rlp_1 = require("@ganache/rlp");
const ethereum_utils_1 = require("@ganache/ethereum-utils");
const eip1559_fee_market_transaction_1 = require("./eip1559-fee-market-transaction");
const UNTYPED_TX_START_BYTE = 0xc0; // all txs with first byte >= 0xc0 are untyped
var TransactionType;
(function (TransactionType) {
    TransactionType[TransactionType["Legacy"] = 0] = "Legacy";
    TransactionType[TransactionType["EIP2930AccessList"] = 1] = "EIP2930AccessList";
    TransactionType[TransactionType["EIP1559AccessList"] = 2] = "EIP1559AccessList";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
class TransactionFactory {
    constructor(raw, common) {
        const [txData, extra] = rlp_1.decode(raw);
        this.tx = TransactionFactory.fromDatabaseTx(txData, common, extra);
    }
    static _fromData(txData, txType, common, extra) {
        // if tx type envelope isn't available yet on this HF,
        // return legacy txs as is and convert typed txs to legacy
        if (!common.isActivatedEIP(2718)) {
            return legacy_transaction_1.LegacyTransaction.fromTxData(txData, common, extra);
        }
        else if (!common.isActivatedEIP(1559)) {
            if (txType === TransactionType.Legacy) {
                return legacy_transaction_1.LegacyTransaction.fromTxData(txData, common, extra);
            }
            else if (txType === TransactionType.EIP2930AccessList) {
                if (common.isActivatedEIP(2930)) {
                    return eip2930_access_list_transaction_1.EIP2930AccessListTransaction.fromTxData(txData, common, extra);
                }
                else {
                    // TODO: I believe this is unreachable with current architecture.
                    // If 2718 is supported, so is 2930.
                    throw new ethereum_utils_1.CodedError(`EIP 2930 is not activated.`, utils_1.JsonRpcErrorCode.INVALID_PARAMS);
                }
            }
            else if (txType === TransactionType.EIP1559AccessList) {
                throw new ethereum_utils_1.CodedError(`EIP 1559 is not activated.`, utils_1.JsonRpcErrorCode.INVALID_PARAMS);
            }
        }
        // eip 1559, 2930, and 2718 are activated
        else {
            // we can assume that all database transactions came from us, so
            // the type doesn't need to be normalized.
            if (Array.isArray(txData)) {
                if (txType === TransactionType.Legacy) {
                    return legacy_transaction_1.LegacyTransaction.fromTxData(txData, common, extra);
                }
                else if (txType === TransactionType.EIP2930AccessList) {
                    return eip2930_access_list_transaction_1.EIP2930AccessListTransaction.fromTxData(txData, common, extra);
                }
                else if (txType === TransactionType.EIP1559AccessList) {
                    return eip1559_fee_market_transaction_1.EIP1559FeeMarketTransaction.fromTxData(txData, common, extra);
                }
            }
            else {
                const toEIP1559 = (txType === TransactionType.Legacy ||
                    txType === TransactionType.EIP2930AccessList) &&
                    txData.gasPrice === undefined;
                if (txType === TransactionType.EIP1559AccessList || toEIP1559) {
                    const tx = eip1559_fee_market_transaction_1.EIP1559FeeMarketTransaction.fromTxData(txData, common, extra);
                    if (toEIP1559) {
                        // they didn't specify the type as eip-1559 (type 2), so we are
                        // upgrading it. BUT, there's still a chance they sent us this data,
                        // so we don't want to overwrite it.
                        if (!txData.maxFeePerGas) {
                            tx.maxFeePerGas = utils_1.Quantity.from(null);
                        }
                        if (!txData.maxPriorityFeePerGas) {
                            tx.maxPriorityFeePerGas = utils_1.RPCQUANTITY_ZERO;
                        }
                    }
                    return tx;
                }
                else if (txType === TransactionType.Legacy) {
                    return legacy_transaction_1.LegacyTransaction.fromTxData(txData, common, extra);
                }
                else if (txType === TransactionType.EIP2930AccessList) {
                    // if no access list is provided, we convert to legacy
                    if (txData.accessList === undefined) {
                        return legacy_transaction_1.LegacyTransaction.fromTxData(txData, common, extra);
                    }
                    else {
                        return eip2930_access_list_transaction_1.EIP2930AccessListTransaction.fromTxData(txData, common, extra);
                    }
                }
            }
        }
        throw new ethereum_utils_1.CodedError(`Tx instantiation with supplied type not supported`, utils_1.JsonRpcErrorCode.METHOD_NOT_FOUND);
    }
    /**
     * Create a transaction from a `txData` object
     *
     * @param txData - The rpc transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)
     * @param common - Options to pass on to the constructor of the transaction
     */
    static fromRpc(txData, common, extra) {
        const txType = this.typeOfRPC(txData);
        return this._fromData(txData, txType, common, extra);
    }
    /**
     * Create a transaction from a `txData` object
     *
     * @param txData - The raw transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)
     * @param common - Options to pass on to the constructor of the transaction
     */
    static fromDatabaseTx(txData, common, extra) {
        const txType = this.typeOfRaw(txData);
        switch (txType) {
            case TransactionType.EIP1559AccessList:
                return eip1559_fee_market_transaction_1.EIP1559FeeMarketTransaction.fromTxData(txData.slice(1), common, extra);
            case TransactionType.Legacy:
                return legacy_transaction_1.LegacyTransaction.fromTxData(txData, common, extra);
            case TransactionType.EIP2930AccessList:
                return eip2930_access_list_transaction_1.EIP2930AccessListTransaction.fromTxData(txData.slice(1), common, extra);
            default:
                throw new ethereum_utils_1.CodedError(`Transactions with supplied type ${txType} not supported`, utils_1.JsonRpcErrorCode.METHOD_NOT_FOUND);
        }
    }
    /**
     * Create a transaction from a `txData` object
     *
     * When transaction types are activated (EIP 2718) the txData will be checked
     * for a transaction envelope (first byte < 192) before determining the
     * decoding strategy, otherwise it will be decoded as a Legacy Transaction. If
     * the transaction contains a transaction envelop, but EIP 2718 is not active
     * decoding will fail and an exception will be thrown.
     *
     * @param txData - The raw hex string transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)
     * @param common - Options to pass on to the constructor of the transaction
     */
    static fromString(txData, common) {
        let data = utils_1.Data.from(txData).toBuffer();
        const type = data[0];
        const txType = this.typeOf(type);
        if (common.isActivatedEIP(2718)) {
            let raw;
            try {
                raw = rlp_1.decode(txType === TransactionType.Legacy ? data : data.slice(1));
            }
            catch (e) {
                throw new Error("Could not decode transaction: " + e.message);
            }
            return this._fromData(raw, txType, common);
        }
        else {
            let raw;
            try {
                raw = rlp_1.decode(data);
            }
            catch (e) {
                throw new Error("Could not decode transaction: " + e.message);
            }
            return this._fromData(raw, TransactionType.Legacy, common);
        }
    }
    static typeOf(type) {
        if (type === TransactionType.EIP1559AccessList ||
            type === TransactionType.EIP2930AccessList) {
            return type;
        }
        else if (type >= UNTYPED_TX_START_BYTE ||
            type === TransactionType.Legacy ||
            type === undefined) {
            return TransactionType.Legacy;
        }
        else {
            throw new Error(`Invalid transaction type: ${type}`);
        }
    }
    static typeOfRaw(raw) {
        // LegacyTransactions won't have the type up front to parse
        if (raw.length === 9) {
            return TransactionType.Legacy;
        }
        const type = raw[0][0];
        return this.typeOf(type);
    }
    static typeOfRPC(rpc) {
        if (!("type" in rpc) || rpc.type === undefined) {
            return TransactionType.Legacy;
        }
        else {
            // The type must be a hex value
            const txType = parseInt(rpc.type, 16);
            return this.typeOf(txType);
        }
    }
}
exports.TransactionFactory = TransactionFactory;
//# sourceMappingURL=transaction-factory.js.map