/// <reference types="node" />
import { Data, Quantity } from "@ganache/utils";
import { Address } from "@ganache/ethereum-address";
export declare type TransactionLog = [
    address: Buffer,
    topics: Buffer[],
    data: Buffer | Buffer[]
];
export declare type BlockLog = [
    removed: Buffer,
    transactionIndex: Buffer,
    transactionHash: Buffer,
    address: TransactionLog[0],
    topics: TransactionLog[1],
    data: TransactionLog[2]
];
declare const _raw: unique symbol;
declare const _logs: unique symbol;
export declare class BlockLogs {
    [_raw]: [blockHash: Buffer, blockLog: BlockLog[]];
    constructor(data: Buffer);
    /**
     *
     * @param blockHash Creates an BlogLogs entity with an empty internal logs
     * array.
     */
    static create(blockHash: Data): BlockLogs;
    /**
     * rlpEncode's the blockHash and logs array for db storage
     */
    serialize(): Buffer;
    /**
     * Appends the data to the internal logs array
     * @param transactionIndex
     * @param transactionHash
     * @param log
     */
    append(transactionIndex: Quantity, transactionHash: Data, log: TransactionLog): void;
    /**
     * Returns the number of logs in the internal logs array.
     */
    get length(): number;
    blockNumber: Quantity;
    static fromJSON(json: any[] | null): BlockLogs;
    toJSON(): {
        [Symbol.iterator](): Generator<{
            address: Address;
            blockHash: Data;
            blockNumber: Quantity;
            data: Data | Data[];
            logIndex: Quantity;
            removed: boolean;
            topics: Data | Data[];
            transactionHash: Data;
            transactionIndex: Quantity;
        }, void, unknown>;
    };
    [_logs](): {
        toJSON(): {
            [Symbol.iterator](): Generator<{
                address: Address;
                blockHash: Data;
                blockNumber: Quantity;
                data: Data | Data[];
                logIndex: Quantity;
                removed: boolean;
                topics: Data | Data[];
                transactionHash: Data;
                transactionIndex: Quantity;
            }, void, unknown>;
        };
        [Symbol.iterator](): Generator<{
            address: Buffer;
            topics: Buffer[];
            toJSON: () => {
                address: Address;
                blockHash: Data;
                blockNumber: Quantity;
                data: Data | Data[];
                logIndex: Quantity;
                removed: boolean;
                topics: Data | Data[];
                transactionHash: Data;
                transactionIndex: Quantity;
            };
        }, void, unknown>;
    };
    /**
     *
     * @param log
     * @param logIndex The index this log appears in the block
     * @param blockHash The hash of the block
     * @param blockNumber The block number
     */
    protected static logToJSON(log: BlockLog, logIndex: Quantity, blockHash: Data, blockNumber: Quantity): {
        address: Address;
        blockHash: Data;
        blockNumber: Quantity;
        data: Data | Data[];
        logIndex: Quantity;
        removed: boolean;
        topics: Data | Data[];
        transactionHash: Data;
        transactionIndex: Quantity;
    };
    /**
     * Note: you must set `this.blockNumber: Quantity` first!
     *
     * Topics are order-dependent. A transaction with a log with topics [A, B] will be matched by the following topic
     * filters:
     *  ??? [] "anything"
     *  ??? [A] "A in first position (and anything after)"
     *  ??? [null, B] "anything in first position AND B in second position (and anything after)"
     *  ??? [A, B] "A" in first position AND B in second position (and anything after)"
     *  ??? [[A, B], [A, B]] "(A OR B) in first position AND (A OR B) in second position (and anything after)"
     * @param expectedAddresses
     * @param expectedTopics
     * @returns JSON representation of the filtered logs
     */
    filter(expectedAddresses: Buffer[], expectedTopics: (string | string[])[]): Generator<{
        address: Address;
        blockHash: Data;
        blockNumber: Quantity;
        data: Data | Data[];
        logIndex: Quantity;
        removed: boolean;
        topics: Data | Data[];
        transactionHash: Data;
        transactionIndex: Quantity;
    }, void, unknown>;
}
export {};
//# sourceMappingURL=blocklogs.d.ts.map