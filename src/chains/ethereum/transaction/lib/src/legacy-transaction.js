"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyTransaction = void 0;
const utils_1 = require("@ganache/utils");
const ethereum_address_1 = require("@ganache/ethereum-address");
const ethereumjs_util_1 = require("ethereumjs-util");
const rlp_1 = require("@ganache/rlp");
const ethereumjs_util_2 = require("ethereumjs-util");
const runtime_transaction_1 = require("./runtime-transaction");
const signing_1 = require("./signing");
class LegacyTransaction extends runtime_transaction_1.RuntimeTransaction {
    constructor(data, common, extra) {
        super(data, common, extra);
        this.type = utils_1.Quantity.from("0x0");
        if (Array.isArray(data)) {
            this.nonce = utils_1.Quantity.from(data[0]);
            this.gasPrice = this.effectiveGasPrice = utils_1.Quantity.from(data[1]);
            this.gas = utils_1.Quantity.from(data[2]);
            this.to = data[3].length == 0 ? utils_1.RPCQUANTITY_EMPTY : ethereum_address_1.Address.from(data[3]);
            this.value = utils_1.Quantity.from(data[4]);
            this.data = utils_1.Data.from(data[5]);
            this.v = utils_1.Quantity.from(data[6]);
            this.r = utils_1.Quantity.from(data[7]);
            this.s = utils_1.Quantity.from(data[8]);
            this.raw = data;
            if (!extra) {
                // TODO(hack): Transactions that come from the database must not be
                // validated since they may come from a fork.
                const { from, serialized, hash, encodedData, encodedSignature } = this.computeIntrinsics(this.v, this.raw, this.common.chainId());
                this.from = from;
                this.serialized = serialized;
                this.hash = hash;
                this.encodedData = encodedData;
                this.encodedSignature = encodedSignature;
            }
        }
        else {
            this.gasPrice = this.effectiveGasPrice = utils_1.Quantity.from(data.gasPrice);
            this.validateAndSetSignature(data);
        }
    }
    toJSON(common) {
        const json = {
            hash: this.hash,
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
            v: this.v,
            r: this.r,
            s: this.s
        };
        if ((this.common || common).isActivatedEIP(2718)) {
            json.type = this.type;
        }
        return json;
    }
    static fromTxData(data, common, extra) {
        return new LegacyTransaction(data, common, extra);
    }
    static fromEIP2930AccessListTransaction(data, common) {
        if (Array.isArray(data)) {
            // remove 1st item, chainId, and 7th item, accessList
            return new LegacyTransaction(data.slice(1, 7).concat(data.slice(8)), common);
        }
        return new LegacyTransaction(data, common);
    }
    toVmTransaction() {
        const sender = this.from.toBuffer();
        const to = this.to.toBuffer();
        const data = this.data.toBuffer();
        return {
            hash: () => utils_1.BUFFER_32_ZERO,
            nonce: new ethereumjs_util_2.BN(this.nonce.toBuffer()),
            gasPrice: new ethereumjs_util_2.BN(this.gasPrice.toBuffer()),
            gasLimit: new ethereumjs_util_2.BN(this.gas.toBuffer()),
            to: to.length === 0
                ? null
                : { buf: to, equals: (a) => to.equals(a.buf) },
            value: new ethereumjs_util_2.BN(this.value.toBuffer()),
            data,
            getSenderAddress: () => ({
                buf: sender,
                equals: (a) => sender.equals(a.buf)
            }),
            /**
             * the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)
             */
            getBaseFee: () => {
                const fee = this.calculateIntrinsicGas();
                return new ethereumjs_util_2.BN(utils_1.Quantity.from(fee).toBuffer());
            },
            getUpfrontCost: () => {
                const { gas, gasPrice, value } = this;
                try {
                    const c = gas.toBigInt() * gasPrice.toBigInt() + value.toBigInt();
                    return new ethereumjs_util_2.BN(utils_1.Quantity.from(c).toBuffer());
                }
                catch (e) {
                    throw e;
                }
            },
            supports: (capability) => {
                return false;
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
        const chainId = this.common.chainId();
        const raw = this.toEthRawTransaction(utils_1.Quantity.from(chainId).toBuffer(), utils_1.BUFFER_EMPTY, utils_1.BUFFER_EMPTY);
        const data = rlp_1.encodeRange(raw, 0, 6);
        const dataLength = data.length;
        const ending = rlp_1.encodeRange(raw, 6, 3);
        const msgHash = utils_1.keccak(rlp_1.digest([data.output, ending.output], dataLength + ending.length));
        const sig = ethereumjs_util_1.ecsign(msgHash, privateKey, chainId);
        this.v = utils_1.Quantity.from(sig.v);
        this.r = utils_1.Quantity.from(sig.r);
        this.s = utils_1.Quantity.from(sig.s);
        raw[6] = this.v.toBuffer();
        raw[7] = this.r.toBuffer();
        raw[8] = this.s.toBuffer();
        this.raw = raw;
        const encodedSignature = rlp_1.encodeRange(raw, 6, 3);
        this.serialized = rlp_1.digest([data.output, encodedSignature.output], dataLength + encodedSignature.length);
        this.hash = utils_1.Data.from(utils_1.keccak(this.serialized));
        this.encodedData = data;
        this.encodedSignature = encodedSignature;
    }
    toEthRawTransaction(v, r, s) {
        return [
            this.nonce.toBuffer(),
            this.gasPrice.toBuffer(),
            this.gas.toBuffer(),
            this.to.toBuffer(),
            this.value.toBuffer(),
            this.data.toBuffer(),
            v,
            r,
            s
        ];
    }
    computeIntrinsics(v, raw, chainId) {
        return signing_1.computeIntrinsicsLegacyTx(v, raw, chainId);
    }
    updateEffectiveGasPrice() { }
}
exports.LegacyTransaction = LegacyTransaction;
//# sourceMappingURL=legacy-transaction.js.map