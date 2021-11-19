"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EIP2930AccessListTransaction = void 0;
const utils_1 = require("@ganache/utils");
const ethereum_address_1 = require("@ganache/ethereum-address");
const ethereumjs_util_1 = require("ethereumjs-util");
const rlp_1 = require("@ganache/rlp");
const runtime_transaction_1 = require("./runtime-transaction");
const access_lists_1 = require("./access-lists");
const signing_1 = require("./signing");
const secp256k1_1 = __importDefault(require("@ganache/secp256k1"));
const ethereum_utils_1 = require("@ganache/ethereum-utils");
function ecsign(msgHash, privateKey) {
    const object = { signature: new Uint8Array(64), recid: null };
    const status = secp256k1_1.default.ecdsaSign(object, msgHash, privateKey);
    if (status === 0) {
        const buffer = object.signature.buffer;
        const r = Buffer.from(buffer, 0, 32);
        const s = Buffer.from(buffer, 32, 32);
        return { r, s, v: object.recid };
    }
    else {
        throw new Error("The nonce generation function failed, or the private key was invalid");
    }
}
const CAPABILITIES = [2718, 2930];
class EIP2930AccessListTransaction extends runtime_transaction_1.RuntimeTransaction {
    constructor(data, common, extra) {
        super(data, common, extra);
        this.type = utils_1.Quantity.from("0x1");
        if (Array.isArray(data)) {
            this.chainId = utils_1.Quantity.from(data[0]);
            this.nonce = utils_1.Quantity.from(data[1]);
            this.gasPrice = this.effectiveGasPrice = utils_1.Quantity.from(data[2]);
            this.gas = utils_1.Quantity.from(data[3]);
            this.to = data[4].length == 0 ? utils_1.RPCQUANTITY_EMPTY : ethereum_address_1.Address.from(data[4]);
            this.value = utils_1.Quantity.from(data[5]);
            this.data = utils_1.Data.from(data[6]);
            const accessListData = access_lists_1.AccessLists.getAccessListData(data[7]);
            this.accessList = accessListData.accessList;
            this.accessListJSON = accessListData.AccessListJSON;
            this.accessListDataFee = accessListData.dataFeeEIP2930;
            this.v = utils_1.Quantity.from(data[8]);
            this.r = utils_1.Quantity.from(data[9]);
            this.s = utils_1.Quantity.from(data[10]);
            this.raw = [this.type.toBuffer(), ...data];
            if (!extra) {
                // TODO(hack): we use the presence of `extra` to determine if this data
                // come from the "database" or not. Transactions that come from the
                // database must not be validated since they may come from a fork.
                if (common.chainId() !== this.chainId.toNumber()) {
                    throw new ethereum_utils_1.CodedError(`Invalid chain id (${this.chainId.toNumber()}) for chain with id ${common.chainId()}.`, utils_1.JsonRpcErrorCode.INVALID_INPUT);
                }
                const { from, serialized, hash, encodedData, encodedSignature } = this.computeIntrinsics(this.v, this.raw);
                this.from = from;
                this.serialized = serialized;
                this.hash = hash;
                this.encodedData = encodedData;
                this.encodedSignature = encodedSignature;
            }
        }
        else {
            if (data.chainId) {
                this.chainId = utils_1.Quantity.from(data.chainId);
                if (this.common.chainId() !== this.chainId.toNumber()) {
                    throw new ethereum_utils_1.CodedError(`Invalid chain id (${this.chainId.toNumber()}) for chain with id ${common.chainId()}.`, utils_1.JsonRpcErrorCode.INVALID_INPUT);
                }
            }
            else {
                this.chainId = utils_1.Quantity.from(common.chainIdBN().toArrayLike(Buffer));
            }
            this.gasPrice = this.effectiveGasPrice = utils_1.Quantity.from(data.gasPrice);
            const accessListData = access_lists_1.AccessLists.getAccessListData(data.accessList);
            this.accessList = accessListData.accessList;
            this.accessListJSON = accessListData.AccessListJSON;
            this.accessListDataFee = accessListData.dataFeeEIP2930;
            this.validateAndSetSignature(data);
        }
    }
    toJSON(_common) {
        return {
            hash: this.hash,
            type: this.type,
            chainId: this.chainId,
            nonce: this.nonce,
            blockHash: this.blockHash ? this.blockHash : null,
            blockNumber: this.blockNumber ? this.blockNumber : null,
            transactionIndex: this.index ? this.index : null,
            from: this.from,
            to: this.to.isNull() ? null : this.to,
            value: this.value,
            gas: this.gas,
            gasPrice: this.gasPrice,
            input: this.data,
            accessList: this.accessListJSON,
            v: this.v,
            r: this.r,
            s: this.s
        };
    }
    static fromTxData(data, common, extra) {
        return new EIP2930AccessListTransaction(data, common, extra);
    }
    toVmTransaction() {
        const sender = this.from.toBuffer();
        const to = this.to.toBuffer();
        const data = this.data.toBuffer();
        return {
            hash: () => utils_1.BUFFER_32_ZERO,
            nonce: new ethereumjs_util_1.BN(this.nonce.toBuffer()),
            gasPrice: new ethereumjs_util_1.BN(this.gasPrice.toBuffer()),
            gasLimit: new ethereumjs_util_1.BN(this.gas.toBuffer()),
            to: to.length === 0
                ? null
                : { buf: to, equals: (a) => to.equals(a.buf) },
            value: new ethereumjs_util_1.BN(this.value.toBuffer()),
            data,
            AccessListJSON: this.accessListJSON,
            getSenderAddress: () => ({
                buf: sender,
                equals: (a) => sender.equals(a.buf)
            }),
            /**
             * the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)
             */
            getBaseFee: () => {
                const fee = this.calculateIntrinsicGas();
                return new ethereumjs_util_1.BN(utils_1.Quantity.from(fee + this.accessListDataFee).toBuffer());
            },
            getUpfrontCost: () => {
                const { gas, gasPrice, value } = this;
                try {
                    const c = gas.toBigInt() * gasPrice.toBigInt() + value.toBigInt();
                    return new ethereumjs_util_1.BN(utils_1.Quantity.from(c).toBuffer());
                }
                catch (e) {
                    throw e;
                }
            },
            supports: (capability) => {
                return CAPABILITIES.includes(capability);
            }
        };
    }
    /**
     * sign a transaction with a given private key, then compute and set the `hash`.
     *
     * @param privateKey - Must be 32 bytes in length
     */
    signAndHash(privateKey) {
        if (this.v != null) {
            throw new Error("Internal Error: RuntimeTransaction `sign` called but transaction has already been signed");
        }
        const typeBuf = this.type.toBuffer();
        const raw = this.toEthRawTransaction(utils_1.BUFFER_ZERO, utils_1.BUFFER_ZERO, utils_1.BUFFER_ZERO);
        const data = rlp_1.encodeRange(raw, 1, 8);
        const dataLength = data.length;
        const msgHash = utils_1.keccak(Buffer.concat([typeBuf, rlp_1.digest([data.output], dataLength)]));
        const sig = ecsign(msgHash, privateKey);
        this.v = utils_1.Quantity.from(sig.v);
        this.r = utils_1.Quantity.from(sig.r);
        this.s = utils_1.Quantity.from(sig.s);
        raw[9] = this.v.toBuffer();
        raw[10] = this.r.toBuffer();
        raw[11] = this.s.toBuffer();
        this.raw = raw;
        const encodedSignature = rlp_1.encodeRange(raw, 9, 3);
        // raw data is type concatenated with the rest of the data rlp encoded
        this.serialized = Buffer.concat([
            typeBuf,
            rlp_1.digest([data.output, encodedSignature.output], dataLength + encodedSignature.length)
        ]);
        this.hash = utils_1.Data.from(utils_1.keccak(this.serialized));
        this.encodedData = data;
        this.encodedSignature = encodedSignature;
    }
    toEthRawTransaction(v, r, s) {
        return [
            this.type.toBuffer(),
            this.chainId.toBuffer(),
            this.nonce.toBuffer(),
            this.gasPrice.toBuffer(),
            this.gas.toBuffer(),
            this.to.toBuffer(),
            this.value.toBuffer(),
            this.data.toBuffer(),
            this.accessList,
            v,
            r,
            s
        ];
    }
    computeIntrinsics(v, raw) {
        return signing_1.computeIntrinsicsAccessListTx(v, raw);
    }
    updateEffectiveGasPrice() { }
}
exports.EIP2930AccessListTransaction = EIP2930AccessListTransaction;
//# sourceMappingURL=eip2930-access-list-transaction.js.map