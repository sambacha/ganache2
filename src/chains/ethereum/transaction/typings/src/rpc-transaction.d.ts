import { AccessList } from "@ethereumjs/tx";
declare type oneThroughSeven = "1" | "2" | "3" | "4" | "5" | "6" | "7";
declare type HexChar = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f";
declare type HexPair = `${oneThroughSeven}${HexChar}`;
declare type TxType = `0x${HexChar}` | `0x${HexPair}`;
export declare type TypedRpcTransaction = LegacyRpcTransaction | EIP2930AccessListRpcTransaction | EIP1559FeeMarketRpcTransaction;
export declare type LegacyRpcTransaction = Readonly<RpcTransaction> & {
    readonly gasPrice?: string;
    readonly chainId?: never;
    readonly accessList?: never;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
};
export declare type EIP2930AccessListRpcTransaction = Readonly<RpcTransaction> & {
    readonly type: TxType;
    readonly chainId?: string;
    readonly gasPrice?: string;
    readonly accessList?: AccessList;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
};
export declare type EIP1559FeeMarketRpcTransaction = Readonly<RpcTransaction> & {
    readonly type: TxType;
    readonly chainId?: string;
    readonly gasPrice?: never;
    readonly maxPriorityFeePerGas?: string;
    readonly maxFeePerGas?: string;
    readonly accessList?: AccessList;
};
export declare type RpcTransaction = {
    from: string;
    nonce?: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
} | {
    from: string;
    nonce?: string;
    /**
     * Alias for `gas`
     */
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
} | {
    from: string;
    nonce?: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    /**
     * Alias for `data`
     */
    input?: string;
    data?: never;
} | {
    from: string;
    nonce?: string;
    /**
     * Alias for `gas`
     */
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    /**
     * Alias for `data`
     */
    input?: string;
    data?: never;
} | {
    from?: string;
    nonce: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
    v: string;
    r: string;
    s: string;
} | {
    from?: string;
    nonce: string;
    /**
     * Alias for `gas`
     */
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
    v: string;
    r: string;
    s: string;
} | {
    from?: string;
    nonce: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    /**
     * Alias for `data`
     */
    input?: string;
    data?: never;
    v: string;
    r: string;
    s: string;
} | {
    from?: string;
    nonce: string;
    /**
     * Alias for `gas`
     */
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    /**
     * Alias for `data`
     */
    input?: string;
    data?: never;
    v: string;
    r: string;
    s: string;
};
export {};
//# sourceMappingURL=rpc-transaction.d.ts.map