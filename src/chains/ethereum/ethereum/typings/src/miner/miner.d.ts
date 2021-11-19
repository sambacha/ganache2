/// <reference types="node" />
import { StorageKeys } from "@ganache/ethereum-utils";
import { BaseTrie as Trie } from "merkle-patricia-tree";
import Emittery from "emittery";
import VM from "@ethereumjs/vm";
import { EthereumInternalOptions } from "@ganache/ethereum-options";
import { TypedTransaction } from "@ganache/ethereum-transaction";
import { Executables } from "./executables";
import { Block, RuntimeBlock } from "@ganache/ethereum-block";
import { VmAfterTransactionEvent, VmBeforeTransactionEvent, VmStepEvent } from "../provider-events";
/**
 * How many transactions should be in the block.
 */
export declare enum Capacity {
    /**
     * Keep mining transactions until there are no more transactions that can fit
     * in the block, or there are no transactions left to mine.
     */
    FillBlock = -1,
    /**
     * Mine an empty block, even if there are executable transactions available to
     * mine.
     */
    Empty = 0,
    /**
     * Mine a block with a single transaction, or empty if there are no executable
     * transactions available to mine.
     */
    Single = 1
}
export declare type BlockData = {
    blockTransactions: TypedTransaction[];
    transactionsTrie: Trie;
    receiptTrie: Trie;
    gasUsed: bigint;
    timestamp: Buffer;
    extraData: string;
};
export default class Miner extends Emittery.Typed<{
    block: {
        block: Block;
        serialized: Buffer;
        storageKeys: StorageKeys;
        transactions: TypedTransaction[];
    };
    "ganache:vm:tx:step": VmStepEvent;
    "ganache:vm:tx:before": VmBeforeTransactionEvent;
    "ganache:vm:tx:after": VmAfterTransactionEvent;
}, "idle"> {
    #private;
    pause(): Promise<void>;
    resume(): void;
    constructor(options: EthereumInternalOptions["miner"], executables: Executables, vm: VM, createBlock: (previousBlock: Block) => RuntimeBlock);
    /**
     * @param maxTransactions: maximum number of transactions per block. If `-1`,
     * unlimited.
     * @param onlyOneBlock: set to `true` if only 1 block should be mined.
     *
     * @returns the transactions mined in the _first_ block
     */
    mine(block: RuntimeBlock, maxTransactions?: number | Capacity, onlyOneBlock?: boolean): Promise<TypedTransaction[]>;
    toggleStepEvent(enable: boolean): void;
}
//# sourceMappingURL=miner.d.ts.map