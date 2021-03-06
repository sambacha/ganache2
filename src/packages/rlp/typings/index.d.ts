/// <reference types="node" />
import { getLength } from "rlp";
import type { Decoded } from "rlp";
import type { RangeOf, Remainders } from "./types";
export { getLength, Decoded };
export declare type Input = Buffer | Buffer[] | List;
export interface List extends Array<Input> {
}
export declare type EncodingInput = Buffer[] | EncodingList;
export interface EncodingList extends Array<EncodingInput | Buffer> {
}
export declare type EncodedPart = {
    length: number;
    output: Buffer[];
};
/**
 * Begin RLP encoding of `items`, from `start` until `length`. Call `RLP.digest` to
 * finish encoding.
 *
 * @param input
 **/
export declare function encodeRange<T extends EncodingInput | Readonly<EncodingInput>, Start extends RangeOf<T["length"]>>(items: T, start: Start, length: Exclude<Remainders<T["length"], Start>, 0>): EncodedPart;
/**
 * Finishes encoding started by `encodeRange`.
 *
 * @param ranges
 * @returns returns a Buffer of encoded data
 */
export declare function digest(ranges: Readonly<Buffer[]>[], length: number): Buffer;
/**
 * RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP
 * @param input
 * @returns returns a Buffer of encoded data
 **/
export declare function encode(input: Input | Readonly<Input>): Buffer;
export declare function encodeLength(len: number, offset: number): Buffer;
export declare function decode(input: Buffer[]): Buffer[];
export declare function decode(input: Buffer): Buffer;
export declare function decode<T>(input: Buffer | Buffer[]): T;
//# sourceMappingURL=index.d.ts.map