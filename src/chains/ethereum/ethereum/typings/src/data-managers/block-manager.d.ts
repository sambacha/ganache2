/// <reference types="node" />
import Manager from "./manager";
import { Tag, QUANTITY } from "@ganache/ethereum-utils";
import { LevelUp } from "levelup";
import { Quantity, Data } from "@ganache/utils";
import type Common from "@ethereumjs/common";
import Blockchain from "../blockchain";
import { Block } from "@ganache/ethereum-block";
export default class BlockManager extends Manager<Block> {
    #private;
    /**
     * The earliest block
     */
    earliest: Block;
    /**
     * The latest block
     */
    latest: Block;
    /**
     * The next block
     */
    pending: Block;
    static initialize(blockchain: Blockchain, common: Common, blockIndexes: LevelUp, base: LevelUp): Promise<BlockManager>;
    constructor(blockchain: Blockchain, common: Common, blockIndexes: LevelUp, base: LevelUp);
    static rawFromJSON(json: any, common: Common): Buffer;
    fromFallback: (tagOrBlockNumber: string | Quantity) => Promise<Buffer>;
    getBlockByTag(tag: Tag): Block;
    getEffectiveNumber(tagOrBlockNumber?: QUANTITY | Buffer | Tag): Quantity;
    getNumberFromHash(hash: string | Buffer | Tag): Promise<Buffer>;
    getByHash(hash: string | Buffer | Tag): Promise<Block>;
    getRawByBlockNumber(blockNumber: Quantity): Promise<Buffer>;
    get(tagOrBlockNumber: QUANTITY | Buffer | Tag): Promise<Block>;
    /**
     * Writes the block object to the underlying database.
     * @param block
     */
    putBlock(number: Buffer, hash: Data, serialized: Buffer): Promise<void>;
    updateTaggedBlocks(): Promise<Block>;
}
//# sourceMappingURL=block-manager.d.ts.map