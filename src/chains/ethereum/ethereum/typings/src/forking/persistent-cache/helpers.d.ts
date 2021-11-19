/// <reference types="node" />
import { Tag } from "@ganache/ethereum-utils";
import { Data, Quantity } from "@ganache/utils";
import { LevelUp } from "levelup";
import { Tree } from "./tree";
export declare type Request = (method: string, params: any[]) => Promise<any>;
export declare type FindOptions = ({
    gte: Buffer;
    lt?: Buffer;
} | {
    gt: Buffer;
    lt?: Buffer;
} | {
    gt: Buffer;
    lte?: Buffer;
} | {
    gte: Buffer;
    lte?: Buffer;
} | {
    gte?: Buffer;
    lt: Buffer;
} | {
    gt?: Buffer;
    lt: Buffer;
} | {
    gt?: Buffer;
    lte: Buffer;
} | {
    gte?: Buffer;
    lte: Buffer;
}) & {
    reverse?: boolean;
};
export declare function getBlockNumberFromParams(method: string, params: any[]): any;
export declare function setDbVersion(db: LevelUp, version: Buffer): Promise<void>;
export declare function resolveTargetAndClosestAncestor(db: LevelUp, request: Request, targetHeight: Quantity, targetHash: Data): Promise<{
    targetBlock: Tree;
    closestAncestor: Tree;
    previousClosestAncestor: Tree;
}>;
export declare function findRelated(db: LevelUp, request: Request, options: FindOptions): AsyncGenerator<Tree, void, unknown>;
/**
 *
 * @param height Search only before this block height (exclusive)
 * @param upTo Search up to this key (inclusive)
 * @returns the closest known ancestor, or `upTo` if we know of no ancestors
 */
export declare function findClosestAncestor(db: LevelUp, request: Request, height: Quantity, upTo: Buffer): Promise<void | Tree>;
/**
 *
 * @param height Search only after this block height (exclusive)
 * @returns the closest known descendants, or null
 */
export declare function findClosestDescendants(db: LevelUp, request: Request, height: Quantity): AsyncGenerator<Tree, void, unknown>;
export declare function getBlockByNumber(request: Request, blockNumber: Quantity | Tag): Promise<any>;
//# sourceMappingURL=helpers.d.ts.map