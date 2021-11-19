/// <reference types="node" />
import { Tree } from "./tree";
import { LevelUp } from "levelup";
import { Data, Quantity } from "@ganache/utils";
import { Ancestry } from "./ancestry";
import { Request } from "./helpers";
import { AbstractIterator, AbstractLevelDOWN } from "abstract-leveldown";
/**
 * A leveldb-backed cache that enables associating immutable data as it existed
 * at a specific height on a blockchain.
 *
 * The design affords faster db reads (one read to get known closest ancestors
 * and descendants) and fast db writes (one write per node in a relationship).
 */
export declare class PersistentCache {
    readonly version: Buffer;
    protected db: LevelUp<AbstractLevelDOWN, AbstractIterator<Buffer, Buffer>>;
    protected cacheDb: LevelUp<AbstractLevelDOWN, AbstractIterator<Buffer, Buffer>>;
    protected ancestorDb: LevelUp<AbstractLevelDOWN, AbstractIterator<Buffer, Buffer>>;
    protected ancestry: Ancestry;
    protected hash: Data;
    protected request: Request;
    constructor();
    static deleteDb(dbSuffix?: string): Promise<unknown>;
    /**
     * Serializes the entire database world state into a JSON tree
     */
    static serializeDb(dbSuffix?: string): Promise<Record<string, {
        descendants: Record<string, any>;
    }>>;
    static getDbDirectory(suffix?: string): string;
    static create(dbSuffix?: string): Promise<PersistentCache>;
    initialize(height: Quantity, hash: Data, request: Request): Promise<void>;
    /**
     * `reBalancePromise` is used at shutdown to ensure we are done balancing the
     * tree
     *
     */
    _reBalancePromise: Promise<void>;
    getBlock(height: Quantity): Promise<any>;
    reBalanceDescendantTree(height: Quantity, targetBlock: Tree, allKnownDescendants: Buffer[]): Promise<void>;
    get(method: string, params: any[], key: string): Promise<Buffer>;
    put(method: string, params: any[], key: string, value: Buffer): Promise<boolean>;
    private status;
    close(): Promise<void>;
}
//# sourceMappingURL=persistent-cache.d.ts.map