"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const utils_1 = require("@ganache/utils");
class Address extends utils_1.Data {
    /**
     *
     * @param value
     * @param byteLength the exact length the value represents when encoded as
     * Ethereum JSON-RPC DATA.
     */
    constructor(value) {
        super(value, Address.ByteLength);
    }
    static from(value) {
        return new Address(value);
    }
}
exports.Address = Address;
Address.ByteLength = 20;
//# sourceMappingURL=index.js.map