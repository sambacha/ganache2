/*!
 * @ganache/secp256k1
 *
 * @author David Murdoch
 * @license MIT
 */
/// <reference types="node" />
declare let secp256k1: {
    ecdsaRecover: (output: Uint8Array, signature: Uint8Array, recid: number, message: Uint8Array) => 0 | 1;
    publicKeyConvert: (output: Uint8Array, senderPubKey: Uint8Array) => 0 | 1 | 2;
    publicKeyCreate: (output: Uint8Array, secretKey: Buffer) => 0 | 1 | 2;
    privateKeyTweakAdd: (output: Uint8Array, secretKey: Buffer) => 0 | 1 | 2;
    ecdsaSign: (output: {
        signature: Uint8Array;
        recid: number;
    }, msgHash: Uint8Array, privateKey: Uint8Array) => 0 | 1;
};
export default secp256k1;
//# sourceMappingURL=index.d.ts.map