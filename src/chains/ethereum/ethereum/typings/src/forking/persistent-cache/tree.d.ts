/// <reference types="node" />
import { Data, Quantity } from "@ganache/utils";
/**
 * A tree: https://en.wikipedia.org/wiki/Rose_tree
 * One parent, multiple children
 */
export declare class Tree {
    key: Buffer;
    hash: Buffer;
    closestKnownAncestor: Buffer;
    closestKnownDescendants: Buffer[];
    constructor(height: Quantity, hash: Data, closestKnownAncestor?: Buffer);
    serialize(): Buffer;
    decodeKey(): {
        height: Quantity;
        hash: Data;
    };
    static decodeKey(key: Buffer): {
        height: Quantity;
        hash: Data;
    };
    static deserialize(key: Buffer, value: Buffer): Tree;
    static encodeKey(height: Quantity, hash: Data): Buffer;
}
//# sourceMappingURL=tree.d.ts.map