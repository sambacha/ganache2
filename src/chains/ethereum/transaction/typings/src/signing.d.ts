/// <reference types="node" />
import { Data, Quantity } from "@ganache/utils";
import { LegacyDatabasePayload } from "./raw";
import { Address } from "@ganache/ethereum-address";
export declare const isValidSigRecovery: (recovery: number) => boolean;
/**
 *
 * @param sharedBuffer A Buffer, where bytes 0 - 97 are to be used by this function
 * @param r
 * @param s
 * @param msgHash
 * @param recovery
 */
export declare const ecdsaRecover: (partialRlp: {
    output: Buffer[] | Readonly<Buffer[]>;
    length: number;
}, sharedBuffer: Buffer, v: number, chainId: number, rBuf: Buffer, sBuf: Buffer) => Buffer;
/**
 *
 * @param sharedBuffer A Buffer, bytes 0 - 65 will be overwritten
 * @param senderPubKey
 */
export declare const publicKeyConvert: (sharedBuffer: Buffer, senderPubKey: Buffer) => Buffer;
export declare const computeFromAddress: (partialRlp: {
    output: Buffer[] | Readonly<Buffer[]>;
    length: number;
}, v: number, rBuf: Buffer, sBuf: Buffer, chainId: number) => Address;
export declare const computeIntrinsicsLegacyTx: (v: Quantity, raw: LegacyDatabasePayload, chainId: number) => {
    from: Address;
    hash: Data;
    serialized: Buffer;
    encodedData: import("@ganache/rlp/typings").EncodedPart;
    encodedSignature: import("@ganache/rlp/typings").EncodedPart;
};
export declare const computeIntrinsicsAccessListTx: (v: Quantity, raw: [type: Buffer, chainId: Buffer, nonce: Buffer, gasPrice: Buffer, gas: Buffer, to: Buffer, value: Buffer, data: Buffer, accessList: import("@ethereumjs/tx").AccessListBuffer, v: Buffer, r: Buffer, s: Buffer]) => {
    from: Address;
    hash: Data;
    serialized: Buffer;
    encodedData: import("@ganache/rlp/typings").EncodedPart;
    encodedSignature: import("@ganache/rlp/typings").EncodedPart;
};
export declare const computeIntrinsicsFeeMarketTx: (v: Quantity, raw: [type: Buffer, chainId: Buffer, nonce: Buffer, maxPriorityFeePerGas: Buffer, maxFeePerGas: Buffer, gas: Buffer, to: Buffer, value: Buffer, data: Buffer, accessList: import("@ethereumjs/tx").AccessListBuffer, v: Buffer, r: Buffer, s: Buffer]) => {
    from: Address;
    hash: Data;
    serialized: Buffer;
    encodedData: import("@ganache/rlp/typings").EncodedPart;
    encodedSignature: import("@ganache/rlp/typings").EncodedPart;
};
//# sourceMappingURL=signing.d.ts.map