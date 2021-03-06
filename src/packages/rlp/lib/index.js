"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encodeLength = exports.encode = exports.digest = exports.encodeRange = exports.getLength = void 0;
const rlp_1 = require("rlp");
Object.defineProperty(exports, "getLength", { enumerable: true, get: function () { return rlp_1.getLength; } });
const utils_1 = require("@ganache/utils");
/**
 * Begin RLP encoding of `items`, from `start` until `length`. Call `RLP.digest` to
 * finish encoding.
 *
 * @param input
 **/
function encodeRange(items, start, length) {
    let count = 0;
    const end = start + length;
    const output = [];
    for (var i = start; i < end; i++) {
        const item = items[i];
        const encoded = encode(item);
        count += encoded.length;
        output.push(encoded);
    }
    return { length: count, output };
}
exports.encodeRange = encodeRange;
/**
 * Finishes encoding started by `encodeRange`.
 *
 * @param ranges
 * @returns returns a Buffer of encoded data
 */
function digest(ranges, length) {
    const encodedLength = encodeLength(length, 192);
    const lengthEncodedLength = encodedLength.length;
    const buf = Buffer.allocUnsafe(lengthEncodedLength + length);
    encodedLength.copy(buf, 0, 0, lengthEncodedLength);
    let offset = lengthEncodedLength;
    for (let i = 0, l = ranges.length; i < l; i++) {
        const range = ranges[i];
        for (let j = 0, m = range.length; j < m; j++) {
            const entry = range[j];
            const size = entry.length;
            entry.copy(buf, offset, 0, size);
            offset += size;
        }
    }
    return buf;
}
exports.digest = digest;
/**
 * RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP
 * @param input
 * @returns returns a Buffer of encoded data
 **/
function encode(input) {
    if (Array.isArray(input)) {
        let length = 0;
        const output = [];
        for (let i = 0, l = input.length; i < l; i++) {
            const enc = encode(input[i]);
            length += enc.length;
            output.push(enc);
        }
        const buf = Buffer.concat(output, length);
        const encodedLength = encodeLength(length, 192);
        return Buffer.concat([encodedLength, buf], encodedLength.length + length);
    }
    else {
        if (input == null) {
            const buf = Buffer.allocUnsafe(1);
            buf[0] = 128;
            return buf;
        }
        else {
            const length = input.length;
            if (length === 1 && input[0] < 128) {
                return input;
            }
            else {
                const encLength = encodeLength(length, 128);
                return Buffer.concat([encLength, input], encLength.length + length);
            }
        }
    }
}
exports.encode = encode;
function encodeLength(len, offset) {
    if (len < 56) {
        const buf = Buffer.allocUnsafe(1);
        buf[0] = len + offset;
        return buf;
    }
    else {
        const hexLength = utils_1.uintToBuffer(len);
        const lLength = hexLength.length;
        const firstByte = utils_1.uintToBuffer(offset + 55 + lLength);
        return Buffer.concat([firstByte, hexLength], firstByte.length + lLength);
    }
}
exports.encodeLength = encodeLength;
function decode(input) {
    return rlp_1.decode(input);
}
exports.decode = decode;
//# sourceMappingURL=index.js.map