/// <reference types="node" />
import { createCipheriv, createDecipheriv } from "browserify-aes";
declare const scrypt: (password: string, salt: string, keylen: number, options: {
    N?: number;
    r?: number;
    p?: number;
}, callback: (err: Error | null, derivedKey: Buffer) => void) => void;
import { createHmac, createHash, pseudoRandomBytes, randomBytes } from "crypto-browserify";
declare const _default: {
    scrypt: (password: string, salt: string, keylen: number, options: {
        N?: number;
        r?: number;
        p?: number;
    }, callback: (err: Error, derivedKey: Buffer) => void) => void;
    createHmac: any;
    createHash: any;
    pseudoRandomBytes: any;
    randomBytes: any;
    createCipheriv: any;
    createDecipheriv: any;
};
export default _default;
export { scrypt, createHmac, createHash, pseudoRandomBytes, randomBytes, createCipheriv, createDecipheriv };
//# sourceMappingURL=browser-crypto.d.ts.map