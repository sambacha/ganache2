/// <reference types="node" />
import { LevelUp } from "levelup";
import { Tree } from "./tree";
export declare class Ancestry {
    private db;
    private next;
    private knownAncestors;
    /**
     * Prevents fetching the same key from the database simultaneously.
     */
    private cacheLock;
    constructor(db: LevelUp, parent: Tree);
    private loadNextAncestor;
    has(key: Buffer): any;
}
//# sourceMappingURL=ancestry.d.ts.map