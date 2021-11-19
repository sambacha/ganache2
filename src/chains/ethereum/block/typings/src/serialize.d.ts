/// <reference types="node" />
import { TypedDatabaseTransaction, GanacheRawBlockTransactionMetaData } from "@ganache/ethereum-transaction";
export declare type GanacheRawBlockExtras = [
    totalDifficulty: Buffer,
    transactionMetaData: GanacheRawBlockTransactionMetaData[],
    ethereumRawBlockSize: Buffer
];
export declare type EthereumRawBlockHeader = [
    parentHash: Buffer,
    sha3Uncles: Buffer,
    miner: Buffer,
    stateRoot: Buffer,
    transactionsRoot: Buffer,
    receiptsRoot: Buffer,
    logsBloom: Buffer,
    difficulty: Buffer,
    number: Buffer,
    gasLimit: Buffer,
    gasUsed: Buffer,
    timestamp: Buffer,
    extraData: Buffer,
    mixHash: Buffer,
    nonce: Buffer,
    baseFeePerGas?: Buffer
];
export declare type EthereumRawBlock = [
    rawHeader: EthereumRawBlockHeader,
    rawTransactions: TypedDatabaseTransaction[],
    uncles: []
];
declare type Head<T extends any[]> = T extends [...infer Head, any] ? Head : any[];
export declare type GanacheRawBlock = [...EthereumRawBlock, ...GanacheRawBlockExtras];
export declare function serialize(raw: Head<GanacheRawBlock>): {
    serialized: Buffer;
    size: number;
};
export {};
//# sourceMappingURL=serialize.d.ts.map