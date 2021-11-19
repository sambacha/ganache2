"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ancestry = void 0;
const utils_1 = require("@ganache/utils");
const tree_1 = require("./tree");
class Ancestry {
    constructor(db, parent) {
        /**
         * Prevents fetching the same key from the database simultaneously.
         */
        this.cacheLock = new Map();
        this.db = db;
        if (parent == null) {
            this.next = null;
            this.knownAncestors = new Set();
        }
        else {
            this.next = parent.closestKnownAncestor.equals(utils_1.BUFFER_EMPTY)
                ? null
                : parent.closestKnownAncestor;
            this.knownAncestors = new Set([parent.hash.toString("hex")]);
        }
    }
    async loadNextAncestor(next) {
        const k = next.toString("hex");
        if (this.cacheLock.has(k)) {
            throw new Error("couldn't load next ancestor as it is locked");
        }
        let resolver;
        this.cacheLock.set(k, new Promise(resolve => {
            resolver = resolve;
        }));
        const value = await this.db.get(next);
        const node = tree_1.Tree.deserialize(next, value);
        this.next = node.closestKnownAncestor.equals(utils_1.BUFFER_EMPTY)
            ? null
            : node.closestKnownAncestor;
        this.knownAncestors.add(node.hash.toString("hex"));
        this.cacheLock.delete(k);
        resolver();
    }
    async has(key) {
        const strKey = key.toString("hex");
        if (this.knownAncestors.has(strKey)) {
            return true;
        }
        else if (this.next) {
            const cacheLock = this.cacheLock.get(this.next.toString("hex"));
            if (cacheLock) {
                await cacheLock;
                return this.has(key);
            }
            await this.loadNextAncestor(this.next);
            return this.has(key);
        }
        else {
            return false;
        }
    }
}
exports.Ancestry = Ancestry;
//# sourceMappingURL=ancestry.js.map