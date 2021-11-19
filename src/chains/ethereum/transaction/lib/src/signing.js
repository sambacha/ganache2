"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeIntrinsicsFeeMarketTx = exports.computeIntrinsicsAccessListTx = exports.computeIntrinsicsLegacyTx = exports.computeFromAddress = exports.publicKeyConvert = exports.ecdsaRecover = exports.isValidSigRecovery = void 0;
const utils_1 = require("@ganache/utils");
const rlp_1 = require("@ganache/rlp");
const ethereum_address_1 = require("@ganache/ethereum-address");
const secp256k1_1 = __importDefault(require("@ganache/secp256k1"));
const intToBuffer = (value) => value === 0 ? utils_1.BUFFER_EMPTY : utils_1.uintToBuffer(value);
/**
 * Copies `length` bytes from `source` to the `target`, filling remaining
 * bytes beyond `length - source.length` with `0`. Fills to the left.
 *
 * ```typescript
 * const source = Buffer.from([1, 2, 3]);
 * const target = Buffer.from([9, 9, 9, 9, 9, 9]);
 * copyOrFill(source, target, 1, 4);
 * // target.equals(Buffer.from([9, 0, 1, 2, 3, 9]));
 * //                               ^  ^  ^  ^
 * ```
 *
 * @param source A Buffer to copy from.
 * @param target A Buffer to copy into.
 * @param targetStart The offset within `target` at which to begin writing.
 * @param length The amount of bytes to copy or fill into the `target`.
 */
function copyOrFill(source, target, targetStart, length) {
    if (source.byteLength > length)
        throw new Error("Invalid signature");
    // first, copy zeroes
    const numZeroes = length - source.byteLength;
    const endZeroes = targetStart + numZeroes;
    let i = targetStart;
    for (; i < endZeroes; i++) {
        target[i] = 0;
    }
    // then copy the source into the target:
    let end = targetStart + length;
    const sourceOffset = targetStart + numZeroes;
    for (; i < end; i++) {
        target[i] = source[i - sourceOffset];
    }
}
const isValidSigRecovery = (recovery) => {
    return recovery === 1 || recovery === 0;
};
exports.isValidSigRecovery = isValidSigRecovery;
/**
 *
 * @param sharedBuffer A Buffer, where bytes 0 - 97 are to be used by this function
 * @param r
 * @param s
 * @param msgHash
 * @param recovery
 */
const ecdsaRecover = (partialRlp, sharedBuffer, v, chainId, rBuf, sBuf) => {
    let data;
    let recid;
    const eip155V = chainId * 2 + 35;
    const isEip155 = v === eip155V || v === eip155V + 1;
    if (isEip155) {
        const chainBuf = intToBuffer(chainId);
        const extras = [chainBuf, utils_1.BUFFER_EMPTY, utils_1.BUFFER_EMPTY];
        const epilogue = rlp_1.encodeRange(extras, 0, 3);
        data = rlp_1.digest([partialRlp.output, epilogue.output], partialRlp.length + epilogue.length);
        recid = v - eip155V;
    }
    else {
        data = rlp_1.digest([partialRlp.output], partialRlp.length);
        recid = v - 27;
    }
    return _ecdsaRecover(data, sharedBuffer, rBuf, sBuf, recid);
};
exports.ecdsaRecover = ecdsaRecover;
function _ecdsaRecover(data, sharedBuffer, rBuf, sBuf, recid) {
    if (!exports.isValidSigRecovery(recid)) {
        throw new Error("Invalid signature v value");
    }
    const message = utils_1.keccak(data);
    const signature = sharedBuffer.slice(0, 64);
    copyOrFill(rBuf, signature, 0, 32);
    copyOrFill(sBuf, signature, 32, 32);
    const output = sharedBuffer.slice(0, 33);
    const success = secp256k1_1.default.ecdsaRecover(output, signature, recid, message);
    if (success !== 0) {
        throw new Error("Invalid Signature");
    }
    return output;
}
/**
 *
 * @param sharedBuffer A Buffer, bytes 0 - 65 will be overwritten
 * @param senderPubKey
 */
const publicKeyConvert = (sharedBuffer, senderPubKey) => {
    const publicKey = sharedBuffer.slice(0, 65);
    const result = secp256k1_1.default.publicKeyConvert(publicKey, senderPubKey);
    if (result !== 0) {
        throw new Error("Invalid Signature");
    }
    return publicKey;
};
exports.publicKeyConvert = publicKeyConvert;
/**
 * A Buffer that can be reused by `computeFromAddress`.
 */
const SHARED_BUFFER = Buffer.allocUnsafe(65);
const computeFromAddress = (partialRlp, v, rBuf, sBuf, chainId) => {
    const senderPubKey = exports.ecdsaRecover(partialRlp, SHARED_BUFFER, v, chainId, rBuf, sBuf);
    const publicKey = exports.publicKeyConvert(SHARED_BUFFER, senderPubKey);
    return ethereum_address_1.Address.from(utils_1.keccak(publicKey.slice(1)).slice(-20));
};
exports.computeFromAddress = computeFromAddress;
const computeIntrinsicsLegacyTx = (v, raw, chainId) => {
    const encodedData = rlp_1.encodeRange(raw, 0, 6);
    const encodedSignature = rlp_1.encodeRange(raw, 6, 3);
    const serialized = rlp_1.digest([encodedData.output, encodedSignature.output], encodedData.length + encodedSignature.length);
    return {
        from: exports.computeFromAddress(encodedData, v.toNumber(), raw[7], raw[8], chainId),
        hash: utils_1.Data.from(utils_1.keccak(serialized), 32),
        serialized,
        encodedData,
        encodedSignature
    };
};
exports.computeIntrinsicsLegacyTx = computeIntrinsicsLegacyTx;
const computeIntrinsicsAccessListTx = (v, raw) => {
    const typeBuf = raw[0];
    const encodedData = rlp_1.encodeRange(raw, 1, 8);
    const encodedSignature = rlp_1.encodeRange(raw, 9, 3);
    const serialized = Buffer.concat([
        typeBuf,
        rlp_1.digest([encodedData.output, encodedSignature.output], encodedData.length + encodedSignature.length)
    ]);
    const data = Buffer.concat([
        typeBuf,
        rlp_1.digest([encodedData.output], encodedData.length)
    ]);
    const senderPubKey = _ecdsaRecover(data, SHARED_BUFFER, raw[10], raw[11], v.toNumber());
    const publicKey = exports.publicKeyConvert(SHARED_BUFFER, senderPubKey);
    const from = ethereum_address_1.Address.from(utils_1.keccak(publicKey.slice(1)).slice(-20));
    return {
        from: from,
        hash: utils_1.Data.from(utils_1.keccak(serialized), 32),
        serialized,
        encodedData,
        encodedSignature
    };
};
exports.computeIntrinsicsAccessListTx = computeIntrinsicsAccessListTx;
const computeIntrinsicsFeeMarketTx = (v, raw) => {
    const typeBuf = raw[0];
    const encodedData = rlp_1.encodeRange(raw, 1, 9);
    const encodedSignature = rlp_1.encodeRange(raw, 10, 3);
    const serialized = Buffer.concat([
        typeBuf,
        rlp_1.digest([encodedData.output, encodedSignature.output], encodedData.length + encodedSignature.length)
    ]);
    const data = Buffer.concat([
        typeBuf,
        rlp_1.digest([encodedData.output], encodedData.length)
    ]);
    const senderPubKey = _ecdsaRecover(data, SHARED_BUFFER, raw[11], raw[12], v.toNumber());
    const publicKey = exports.publicKeyConvert(SHARED_BUFFER, senderPubKey);
    const from = ethereum_address_1.Address.from(utils_1.keccak(publicKey.slice(1)).slice(-20));
    return {
        from: from,
        hash: utils_1.Data.from(utils_1.keccak(serialized), 32),
        serialized,
        encodedData,
        encodedSignature
    };
};
exports.computeIntrinsicsFeeMarketTx = computeIntrinsicsFeeMarketTx;
//# sourceMappingURL=signing.js.map