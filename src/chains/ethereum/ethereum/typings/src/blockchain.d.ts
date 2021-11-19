import { Capacity } from "./miner/miner";
import Database from "./database";
import Emittery from "emittery";
import { BlockLogs, Account, StorageRangeResult, StructLog, TransactionTraceOptions } from "@ganache/ethereum-utils";
import Common from "@ethereumjs/common";
import VM from "@ethereumjs/vm";
import { EthereumInternalOptions } from "@ganache/ethereum-options";
import { Quantity, Data } from "@ganache/utils";
import AccountManager from "./data-managers/account-manager";
import BlockManager from "./data-managers/block-manager";
import BlockLogManager from "./data-managers/blocklog-manager";
import TransactionManager from "./data-managers/transaction-manager";
import { Fork } from "./forking/fork";
import { Address } from "@ganache/ethereum-address";
import { TypedTransaction } from "@ganache/ethereum-transaction";
import { Block } from "@ganache/ethereum-block";
import { SimulationTransaction } from "./helpers/run-call";
import { GanacheTrie } from "./helpers/trie";
import { ForkTrie } from "./forking/trie";
import TransactionReceiptManager from "./data-managers/transaction-receipt-manager";
import { VmAfterTransactionEvent, VmBeforeTransactionEvent, VmStepEvent } from "./provider-events";
export declare enum Status {
    started = 1,
    starting = 2,
    stopped = 4,
    stopping = 8,
    paused = 16
}
declare type BlockchainTypedEvents = {
    block: Block;
    blockLogs: BlockLogs;
    pendingTransaction: TypedTransaction;
    "ganache:vm:tx:step": VmStepEvent;
    "ganache:vm:tx:before": VmBeforeTransactionEvent;
    "ganache:vm:tx:after": VmAfterTransactionEvent;
};
declare type BlockchainEvents = "ready" | "stop";
interface Logger {
    log(message?: any, ...optionalParams: any[]): void;
}
export declare type BlockchainOptions = {
    db?: string | object;
    db_path?: string;
    initialAccounts?: Account[];
    hardfork?: string;
    allowUnlimitedContractSize?: boolean;
    gasLimit?: Quantity;
    time?: Date;
    blockTime?: number;
    coinbase: Account;
    chainId: number;
    common: Common;
    legacyInstamine: boolean;
    vmErrorsOnRPCResponse: boolean;
    logger: Logger;
};
export default class Blockchain extends Emittery.Typed<BlockchainTypedEvents, BlockchainEvents> {
    #private;
    blocks: BlockManager;
    blockLogs: BlockLogManager;
    transactions: TransactionManager;
    transactionReceipts: TransactionReceiptManager;
    storageKeys: Database["storageKeys"];
    accounts: AccountManager;
    vm: VM;
    trie: GanacheTrie;
    common: Common;
    fallback: Fork;
    /**
     * Initializes the underlying Database and handles synchronization between
     * the API and the database.
     *
     * Emits a `ready` event once the database and all dependencies are fully
     * initialized.
     * @param options
     */
    constructor(options: EthereumInternalOptions, coinbase: Address, fallback?: Fork);
    initialize(initialAccounts: Account[]): Promise<void>;
    coinbase: Address;
    isStarted: () => boolean;
    mine: (maxTransactions: number | Capacity, timestamp?: number, onlyOneBlock?: boolean) => Promise<TypedTransaction[]>;
    pause(): void;
    resume(_threads?: number): Promise<TypedTransaction[]>;
    createVmFromStateTrie: (stateTrie: GanacheTrie | ForkTrie, allowUnlimitedContractSize: boolean, activatePrecompile: boolean) => Promise<VM>;
    /**
     * @param seconds
     * @returns the total time offset *in milliseconds*
     */
    increaseTime(seconds: number): number;
    /**
     * @param seconds
     * @returns the total time offset *in milliseconds*
     */
    setTime(timestamp: number): number;
    snapshot(): number;
    revert(snapshotId: Quantity): Promise<boolean>;
    queueTransaction(transaction: TypedTransaction, secretKey?: Data): Promise<Data>;
    simulateTransaction(transaction: SimulationTransaction, parentBlock: Block): Promise<Data>;
    /**
     * traceTransaction
     *
     * Run a previously-run transaction in the same state in which it occurred at the time it was run.
     * This will return the vm-level trace output for debugging purposes.
     *
     * Strategy:
     *
     *  1. Find block where transaction occurred
     *  2. Set state root of that block
     *  3. Rerun every transaction in that block prior to and including the requested transaction
     *  4. Send trace results back.
     *
     * @param transactionHash
     * @param options
     */
    traceTransaction(transactionHash: string, options: TransactionTraceOptions): Promise<{
        gas: number;
        structLogs: StructLog[];
        returnValue: string;
        storage: Record<string, {
            key: Data;
            value: Data;
        }>;
    }>;
    /**
     * storageRangeAt
     *
     * Returns a contract's storage given a starting key and max number of
     * entries to return.
     *
     * Strategy:
     *
     *  1. Find block where transaction occurred
     *  2. Set state root of that block
     *  3. Use contract address storage trie to get the storage keys from the transaction
     *  4. Sort and filter storage keys using the startKey and maxResult
     *  5. Rerun every transaction in that block prior to and including the requested transaction
     *  6. Send storage results back
     *
     * @param blockHash
     * @param txIndex
     * @param contractAddress
     * @param startKey
     * @param maxResult
     */
    storageRangeAt(blockHash: string, txIndex: number, contractAddress: string, startKey: string, maxResult: number): Promise<StorageRangeResult>;
    toggleStepEvent(enable: boolean): void;
    /**
     * Gracefully shuts down the blockchain service and all of its dependencies.
     */
    stop(): Promise<void>;
}
export {};
//# sourceMappingURL=blockchain.d.ts.map