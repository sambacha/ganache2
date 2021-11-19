/// <reference types="node" />
import { Quantity } from "@ganache/utils";
import type { LevelUp } from "levelup";
import Blockchain from "../blockchain";
import { GanacheTrie } from "../helpers/trie";
export declare class ForkTrie extends GanacheTrie {
    private accounts;
    private address;
    private isPreForkBlock;
    private forkBlockNumber;
    blockNumber: Quantity;
    private metadata;
    constructor(db: LevelUp | null, root: Buffer, blockchain: Blockchain);
    set root(value: Buffer);
    get root(): Buffer;
    checkpoint(): void;
    commit(): Promise<void>;
    revert(): Promise<void>;
    setContext(stateRoot: Buffer, address: Buffer, blockNumber: Quantity): void;
    put(key: Buffer, val: Buffer): Promise<void>;
    /**
     * Removes saved metadata from the given block range (inclusive)
     * @param startBlockNumber (inclusive)
     * @param endBlockNumber (inclusive)
     */
    revertMetaData(startBlockNumber: Quantity, endBlockNumber: Quantity): Promise<void>;
    private createDelKey;
    /**
     * Checks if the key was deleted (locally -- not on the fork)
     * @param key
     */
    private keyWasDeleted;
    del(key: Buffer): Promise<void>;
    /**
     * Gets an account from the fork/fallback.
     *
     * @param address the address of the account
     * @param blockNumber the block number at which to query the fork/fallback.
     * @param stateRoot the state root at the given blockNumber
     */
    private accountFromFallback;
    private storageFromFallback;
    get(key: Buffer): Promise<Buffer>;
    /**
     * Returns a copy of the underlying trie with the interface of ForkTrie.
     * @param includeCheckpoints - If true and during a checkpoint, the copy will
     * contain the checkpointing metadata and will use the same scratch as
     * underlying db.
     */
    copy(includeCheckpoints?: boolean): ForkTrie;
}
//# sourceMappingURL=trie.d.ts.map