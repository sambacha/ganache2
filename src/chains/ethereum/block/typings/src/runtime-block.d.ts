/// <reference types="node" />
/// <reference types="bn.js" />
import { Data, Quantity } from "@ganache/utils";
import { BN } from "ethereumjs-util";
import { EthereumRawBlockHeader } from "./serialize";
import { Address } from "@ganache/ethereum-address";
import { Block } from "./block";
import { TypedTransaction } from "@ganache/ethereum-transaction";
import { StorageKeys } from "@ganache/ethereum-utils";
/**
 * BN, but with an extra `buf` property that caches the original Buffer value
 * we pass in.
 */
declare class BnExtra extends BN {
    buf: Buffer;
    constructor(number: Buffer);
}
export declare type BlockHeader = {
    parentHash: Data;
    sha3Uncles: Data;
    miner: Data;
    stateRoot: Data;
    transactionsRoot: Data;
    receiptsRoot: Data;
    logsBloom: Data;
    difficulty: Quantity;
    totalDifficulty: Quantity;
    number: Quantity;
    gasLimit: Quantity;
    gasUsed: Quantity;
    timestamp: Quantity;
    extraData: Data;
    mixHash: Data;
    nonce: Data;
    baseFeePerGas?: Quantity;
};
/**
 * Returns the size of the serialized data as it would have been calculated had
 * we stored things geth does, i.e., `totalDfficulty` is not usually stored in
 * the block header.
 *
 * @param serialized
 * @param totalDifficulty
 */
export declare function getBlockSize(serialized: Buffer, totalDifficulty: Buffer): number;
export declare function makeHeader(raw: EthereumRawBlockHeader, totalDifficulty: Buffer): BlockHeader;
/**
 * A minimal block that can be used by the EVM to run transactions.
 */
export declare class RuntimeBlock {
    private serializeBaseFeePerGas;
    readonly header: {
        parentHash: Buffer;
        difficulty: BnExtra;
        totalDifficulty: Buffer;
        coinbase: {
            buf: Buffer;
            toBuffer: () => Buffer;
        };
        number: BnExtra;
        gasLimit: BnExtra;
        gasUsed: BnExtra;
        timestamp: BnExtra;
        baseFeePerGas?: BnExtra;
    };
    constructor(number: Quantity, parentHash: Data, coinbase: Address, gasLimit: Buffer, gasUsed: Buffer, timestamp: Quantity, difficulty: Quantity, previousBlockTotalDifficulty: Quantity, baseFeePerGas?: bigint);
    /**
     * Returns the serialization of all block data, the hash of the block header,
     * and a map of the hashed and raw storage keys
     */
    finalize(transactionsTrie: Buffer, receiptTrie: Buffer, bloom: Buffer, stateRoot: Buffer, gasUsed: bigint, extraData: Data, transactions: TypedTransaction[], storageKeys: StorageKeys): {
        block: Block;
        serialized: Buffer;
        storageKeys: StorageKeys;
        transactions: TypedTransaction[];
    };
}
export {};
//# sourceMappingURL=runtime-block.d.ts.map