/// <reference types="node" />
import { Quantity } from "@ganache/utils";
import { LevelUp } from "levelup";
import { SecureTrie } from "merkle-patricia-tree";
import Blockchain from "../blockchain";
export declare class GanacheTrie extends SecureTrie {
    readonly blockchain: Blockchain;
    constructor(db: LevelUp | null, root: Buffer, blockchain: Blockchain);
    setContext(stateRoot: Buffer, address: Buffer, blockNumber: Quantity): void;
    /**
     * Returns a copy of the underlying trie with the interface of GanacheTrie.
     * @param includeCheckpoints - If true and during a checkpoint, the copy will contain the checkpointing metadata and will use the same scratch as underlying db.
     */
    copy(includeCheckpoints?: boolean): GanacheTrie;
}
//# sourceMappingURL=trie.d.ts.map