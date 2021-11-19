/// <reference types="node" />
import { AccessListBuffer } from "@ethereumjs/tx";
/**
 * The raw data for an ethereum transaction.
 */
declare type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];
declare type TxType = [type: Buffer];
export declare type LegacyDatabasePayload = [
    nonce: Buffer,
    gasPrice: Buffer,
    gas: Buffer,
    to: Buffer,
    value: Buffer,
    data: Buffer,
    v: Buffer,
    r: Buffer,
    s: Buffer
];
export declare type EIP2930AccessListDatabasePayload = [
    chainId: Buffer,
    nonce: Buffer,
    gasPrice: Buffer,
    gas: Buffer,
    to: Buffer,
    value: Buffer,
    data: Buffer,
    accessList: AccessListBuffer,
    v: Buffer,
    r: Buffer,
    s: Buffer
];
export declare type EIP1559FeeMarketDatabasePayload = [
    chainId: Buffer,
    nonce: Buffer,
    maxPriorityFeePerGas: Buffer,
    maxFeePerGas: Buffer,
    gas: Buffer,
    to: Buffer,
    value: Buffer,
    data: Buffer,
    accessList: AccessListBuffer,
    v: Buffer,
    r: Buffer,
    s: Buffer
];
export declare type EIP2930AccessListDatabaseTx = Concat<TxType, EIP2930AccessListDatabasePayload>;
export declare type EIP1559FeeMarketDatabaseTx = Concat<TxType, EIP1559FeeMarketDatabasePayload>;
export declare type TypedDatabaseTransaction = LegacyDatabasePayload | EIP2930AccessListDatabaseTx | EIP1559FeeMarketDatabaseTx;
export declare type TypedDatabasePayload = LegacyDatabasePayload | EIP2930AccessListDatabasePayload | EIP1559FeeMarketDatabasePayload;
/**
 * Extra data Ganache stores as part of a transaction in order to support
 * account masquerading and quick lookups for transactions, blocks, and receipts.
 */
export declare type GanacheRawExtraTx = [
    from: Buffer,
    hash: Buffer,
    blockHash: Buffer,
    blockNumber: Buffer,
    index: Buffer,
    effectiveGasPrice?: Buffer
];
/**
 * Meta data Ganache stores as part of a transaction *in a block*
 */
export declare type GanacheRawBlockTransactionMetaData = [from: Buffer, hash: Buffer];
export {};
//# sourceMappingURL=raw.d.ts.map