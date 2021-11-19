"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistentCache = void 0;
const tree_1 = require("./tree");
const fs_1 = require("fs");
const env_paths_1 = __importDefault(require("env-paths"));
const levelup_1 = __importDefault(require("levelup"));
const leveldown_1 = __importDefault(require("leveldown"));
const subleveldown_1 = __importDefault(require("subleveldown"));
const encoding_down_1 = __importDefault(require("encoding-down"));
const lexico = __importStar(require("../lexicographic-key-codec"));
const utils_1 = require("@ganache/utils");
const ancestry_1 = require("./ancestry");
const helpers_1 = require("./helpers");
const levelupOptions = {
    keyEncoding: "binary",
    valueEncoding: "binary"
};
const leveldownOpts = { prefix: "" };
/**
 * A leveldb-backed cache that enables associating immutable data as it existed
 * at a specific height on a blockchain.
 *
 * The design affords faster db reads (one read to get known closest ancestors
 * and descendants) and fast db writes (one write per node in a relationship).
 */
class PersistentCache {
    constructor() {
        this.version = utils_1.BUFFER_ZERO;
        /**
         * `reBalancePromise` is used at shutdown to ensure we are done balancing the
         * tree
         *
         */
        this._reBalancePromise = null;
        this.status = "open";
    }
    static async deleteDb(dbSuffix) {
        return new Promise((resolve, reject) => {
            const directory = PersistentCache.getDbDirectory(dbSuffix);
            leveldown_1.default.destroy(directory, err => {
                if (err)
                    return void reject(err);
                resolve(void 0);
            });
        });
    }
    /**
     * Serializes the entire database world state into a JSON tree
     */
    static async serializeDb(dbSuffix) {
        const cache = await PersistentCache.create(dbSuffix);
        return await new Promise(async (resolve) => {
            const rs = cache.ancestorDb.createReadStream({
                gte: utils_1.BUFFER_ZERO,
                keys: true,
                values: true
            });
            const tree = {};
            const collection = {};
            for await (const data of rs) {
                const { key, value } = data;
                const node = tree_1.Tree.deserialize(key, value);
                node.height = node.decodeKey().height.toNumber();
                const keyHex = key.toString("hex");
                const parentKeyHex = node.closestKnownAncestor.toString("hex");
                collection[keyHex] = node;
                if (node.closestKnownAncestor.length === 0) {
                    tree[keyHex] = node;
                }
                else {
                    const descendants = collection[parentKeyHex].descendants || {};
                    descendants[keyHex] = node;
                    collection[parentKeyHex].descendants = descendants;
                }
                node.hash = utils_1.Data.from(node.hash).toString();
                node.parent =
                    node.closestKnownAncestor.length > 0
                        ? utils_1.Data.from(collection[parentKeyHex].hash).toString()
                        : null;
                delete node.key;
                // delete node.hash;
                delete node.closestKnownDescendants;
                delete node.closestKnownAncestor;
            }
            await cache.close();
            resolve(JSON.parse(JSON.stringify(tree)));
        });
    }
    static getDbDirectory(suffix = "") {
        const { data: directory } = env_paths_1.default("Ganache/db", {
            suffix
        });
        return directory;
    }
    static async create(dbSuffix) {
        const cache = new PersistentCache();
        const directory = PersistentCache.getDbDirectory(dbSuffix);
        await fs_1.promises.mkdir(directory, { recursive: true });
        const store = encoding_down_1.default(leveldown_1.default(directory, leveldownOpts), levelupOptions);
        const db = await new Promise((resolve, reject) => {
            const db = levelup_1.default(store, (err) => {
                if (err)
                    return void reject(err);
                resolve(db);
            });
        });
        cache.db = db;
        cache.cacheDb = subleveldown_1.default(db, "c", levelupOptions);
        cache.ancestorDb = subleveldown_1.default(db, "a", levelupOptions);
        await cache.cacheDb.open();
        await cache.ancestorDb.open();
        await helpers_1.setDbVersion(cache.db, cache.version);
        return cache;
    }
    async initialize(height, hash, request) {
        this.hash = hash;
        this.request = request;
        const { targetBlock, closestAncestor, previousClosestAncestor } = await helpers_1.resolveTargetAndClosestAncestor(this.ancestorDb, this.request, height, hash);
        this.ancestry = new ancestry_1.Ancestry(this.ancestorDb, closestAncestor);
        const atomicBatch = this.ancestorDb.batch();
        // if we changed closest ancestors remove our targetBlock from the previous
        // ancestor so our target block doesn't appear in the database more than
        // once, and update our targetBlock to point to this new ancestor
        if (previousClosestAncestor &&
            !previousClosestAncestor.key.equals(closestAncestor.key)) {
            targetBlock.closestKnownAncestor = closestAncestor.key;
            const index = previousClosestAncestor.closestKnownDescendants.findIndex(buf => buf.equals(targetBlock.key));
            previousClosestAncestor.closestKnownDescendants.splice(index, 1);
            atomicBatch.put(previousClosestAncestor.key, previousClosestAncestor.serialize());
        }
        let allKnownDescendants = [...targetBlock.closestKnownDescendants];
        // if we don't have a closestAncestor it because the target block is block 0
        if (closestAncestor == null) {
            atomicBatch.put(targetBlock.key, targetBlock.serialize());
        }
        else {
            const ancestorsDescendants = [targetBlock.key];
            await Promise.all(closestAncestor.closestKnownDescendants.map(async (descendantKey) => {
                // don't match ourself
                if (descendantKey.equals(targetBlock.key))
                    return;
                const { height: descendantHeight } = tree_1.Tree.decodeKey(descendantKey);
                // if the block number is less than our own it can't be our descendant
                if (descendantHeight.toBigInt() <= height.toBigInt()) {
                    ancestorsDescendants.push(descendantKey);
                    return;
                }
                const descendantValue = await this.ancestorDb.get(descendantKey);
                const descendantNode = tree_1.Tree.deserialize(descendantKey, descendantValue);
                const descendantRawBlock = await this.getBlock(descendantHeight);
                // if the block doesn't exist on our chain, it can't be our child,
                // keep it in the parent
                if (descendantRawBlock == null ||
                    descendantRawBlock.hash !==
                        utils_1.Data.from(descendantNode.hash, 32).toString()) {
                    ancestorsDescendants.push(descendantKey);
                }
                else {
                    targetBlock.closestKnownDescendants.push(descendantNode.key);
                    // keep track of *all* known descendants so we don't bother
                    // checking if they are a known closest descendant later on
                    allKnownDescendants.push(...descendantNode.closestKnownDescendants);
                    descendantNode.closestKnownAncestor = targetBlock.key;
                    // update the descendant node with its newly assigned
                    // closestKnownAncestor
                    atomicBatch.put(descendantNode.key, descendantNode.serialize());
                }
            }));
            closestAncestor.closestKnownDescendants = ancestorsDescendants;
            atomicBatch.put(closestAncestor.key, closestAncestor.serialize());
        }
        // TODO(perf): we always re-save the targetBlock but could optimize to only
        // resave if it is needed.
        atomicBatch.put(targetBlock.key, targetBlock.serialize());
        await atomicBatch.write();
        // we DO want to re-balance the descendants, but we don't want to wait for
        // it because it can't effect our current fork block's cache results since
        // these caches will be for blocks higher than our own fork block
        // Do not `await` this.
        this._reBalancePromise = this.reBalanceDescendantTree(height, targetBlock, allKnownDescendants)
            // we don't care if it fails because this is an optimization that only
            // matters for _future_ runs of ganache for blocks beyond our current fork
            // block
            .catch(_ => { })
            .finally(() => {
            this._reBalancePromise = null;
        });
    }
    async getBlock(height) {
        return await helpers_1.getBlockByNumber(this.request, height);
    }
    async reBalanceDescendantTree(height, targetBlock, allKnownDescendants) {
        const atomicBatch = this.ancestorDb.batch();
        const closestKnownDescendants = targetBlock.closestKnownDescendants;
        const startSize = closestKnownDescendants.length;
        for await (const maybeDescendant of helpers_1.findClosestDescendants(this.ancestorDb, this.request, height)) {
            const key = maybeDescendant.key;
            // don't match with our own self
            if (targetBlock.key.equals(key))
                continue;
            // this possibleDescendent's descendants can't be our direct descendants
            // because trees can't merge
            allKnownDescendants.push(...maybeDescendant.closestKnownDescendants);
            // if this already is a descendent of ours we can skip it
            if (closestKnownDescendants.some(d => d.equals(key)))
                continue;
            // if this already is a descendent of one of our descendants skip it
            if (allKnownDescendants.some(d => d.equals(key)))
                continue;
            // move the descendant from the parent to the target
            const parentTree = tree_1.Tree.deserialize(maybeDescendant.closestKnownAncestor, await this.ancestorDb.get(maybeDescendant.closestKnownAncestor));
            parentTree.closestKnownDescendants.splice(parentTree.closestKnownDescendants.findIndex(d => d.equals(key)), 1);
            maybeDescendant.closestKnownAncestor = targetBlock.key;
            closestKnownDescendants.push(maybeDescendant.key);
            atomicBatch.put(parentTree.key, parentTree.serialize());
            atomicBatch.put(maybeDescendant.key, maybeDescendant.serialize());
            // if the cache has been closed stop doing work so we can flush what we
            // have to the database; descendant resolution shouldn't prevent us from
            // fulling closing.
            if (this.status === "closed") {
                break;
            }
        }
        // only write if we have changes to write
        if (startSize !== closestKnownDescendants.length) {
            atomicBatch.put(targetBlock.key, targetBlock.serialize());
            // check `this.ancestorDb.isOpen()` as we don't need to try to write if
            // the db was shutdown in the meantime. This can happen if ganache was
            // closed while we were still updating the descendants
            if (atomicBatch.length > 0 && this.ancestorDb.isOpen())
                await atomicBatch.write();
        }
    }
    async get(method, params, key) {
        const blockNumber = helpers_1.getBlockNumberFromParams(method, params);
        if (blockNumber == null)
            return;
        const height = utils_1.Quantity.from(blockNumber);
        const bufKey = Buffer.from(key);
        const start = lexico.encode([height.toBuffer(), bufKey]);
        const end = lexico.encode([
            utils_1.Quantity.from(height.toBigInt() + 1n).toBuffer()
        ]);
        const readStream = this.cacheDb.createReadStream({
            gt: start,
            lt: end,
            keys: true,
            values: true
        });
        const hashBuf = this.hash.toBuffer();
        for await (const data of readStream) {
            const { key: k, value } = data;
            const [_height, _key, blockHash] = lexico.decode(k);
            // if our key no longer matches make sure we don't keep searching
            if (!_key.equals(bufKey))
                return;
            if (hashBuf.equals(blockHash) || (await this.ancestry.has(blockHash))) {
                return value;
            }
        }
    }
    async put(method, params, key, value) {
        const blockNumber = helpers_1.getBlockNumberFromParams(method, params);
        if (blockNumber == null)
            return false;
        const height = utils_1.Quantity.from(blockNumber);
        const dbKey = lexico.encode([
            height.toBuffer(),
            Buffer.from(key),
            this.hash.toBuffer()
        ]);
        await this.cacheDb.put(dbKey, value);
        return true;
    }
    async close() {
        if (this.status === "closed")
            return;
        this.status = "closed";
        if (this.cacheDb) {
            await this.cacheDb.close();
        }
        if (this.ancestorDb) {
            await this._reBalancePromise;
            await this.ancestorDb.close();
        }
        if (this.db) {
            await this.db.close();
        }
    }
}
exports.PersistentCache = PersistentCache;
//# sourceMappingURL=persistent-cache.js.map