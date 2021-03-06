/// <reference types="node" />
import { Data } from "@ganache/utils";
export declare class Address extends Data {
    static ByteLength: number;
    /**
     *
     * @param value
     * @param byteLength the exact length the value represents when encoded as
     * Ethereum JSON-RPC DATA.
     */
    constructor(value: string | Buffer);
    static from<T extends string | Buffer = string | Buffer>(value: T): Address;
}
//# sourceMappingURL=index.d.ts.map