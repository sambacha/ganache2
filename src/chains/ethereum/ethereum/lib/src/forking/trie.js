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
exports.ForkTrie = void 0;
const ethereum_address_1 = require("@ganache/ethereum-address");
const utils_1 = require("@ganache/utils");
const trie_1 = require("../helpers/trie");
const subleveldown_1 = __importDefault(require("subleveldown"));
const checkpointDb_1 = require("merkle-patricia-tree/dist/checkpointDb");
const lexico = __importStar(require("./lexicographic-key-codec"));
const rlp_1 = require("@ganache/rlp");
const ethereum_utils_1 = require("@ganache/ethereum-utils");
const ethereumjs_util_1 = require("ethereumjs-util");
const DELETED_VALUE = Buffer.allocUnsafe(1).fill(1);
const GET_CODE = "eth_getCode";
const GET_NONCE = "eth_getTransactionCount";
const GET_BALANCE = "eth_getBalance";
const GET_STORAGE_AT = "eth_getStorageAt";
const MetadataSingletons = new WeakMap();
const LEVELDOWN_OPTIONS = {
    keyEncoding: "binary",
    valueEncoding: "binary"
};
function isEqualKey(encodedKey, address, key) {
    const decodedKey = lexico.decode(encodedKey);
    const [_, keyAddress, deletedKey] = decodedKey;
    return keyAddress.equals(address) && deletedKey.equals(key);
}
class ForkTrie extends trie_1.GanacheTrie {
    constructor(db, root, blockchain) {
        super(db, root, blockchain);
        this.address = null;
        this.isPreForkBlock = false;
        /**
         * Gets an account from the fork/fallback.
         *
         * @param address the address of the account
         * @param blockNumber the block number at which to query the fork/fallback.
         * @param stateRoot the state root at the given blockNumber
         */
        this.accountFromFallback = async (address, blockNumber) => {
            const { fallback } = this.blockchain;
            const number = this.blockchain.fallback.selectValidForkBlockNumber(blockNumber);
            // get nonce, balance, and code from the fork/fallback
            const codeProm = fallback.request(GET_CODE, [address, number]);
            const promises = [
                fallback.request(GET_NONCE, [address, number]),
                fallback.request(GET_BALANCE, [address, number]),
                null
            ];
            // create an account so we can serialize everything later
            const account = new ethereum_utils_1.Account(address);
            // because code requires additional asynchronous processing, we await and
            // process it ASAP
            try {
                const codeHex = await codeProm;
                if (codeHex !== "0x") {
                    const code = utils_1.Data.from(codeHex).toBuffer();
                    // the codeHash is just the keccak hash of the code itself
                    account.codeHash = utils_1.keccak(code);
                    if (!account.codeHash.equals(ethereumjs_util_1.KECCAK256_NULL)) {
                        // insert the code directly into the database with a key of `codeHash`
                        promises[2] = this.db.put(account.codeHash, code);
                    }
                }
            }
            catch (e) {
                // Since we fired off some promises that may throw themselves we need to
                // catch these errors and discard them.
                Promise.all(promises).catch(e => { });
                throw e;
            }
            // finally, set the `nonce` and `balance` on the account before returning
            // the serialized data
            const [nonce, balance] = await Promise.all(promises);
            account.nonce =
                nonce === "0x0" ? utils_1.RPCQUANTITY_EMPTY : utils_1.Quantity.from(nonce, true);
            account.balance =
                balance === "0x0" ? utils_1.RPCQUANTITY_EMPTY : utils_1.Quantity.from(balance);
            return account.serialize();
        };
        this.storageFromFallback = async (address, key, blockNumber) => {
            const result = await this.blockchain.fallback.request(GET_STORAGE_AT, [
                `0x${address.toString("hex")}`,
                `0x${key.toString("hex")}`,
                this.blockchain.fallback.selectValidForkBlockNumber(blockNumber)
            ]);
            if (!result)
                return null;
            // remove the `0x` and all leading 0 pairs:
            const compressed = result.replace(/^0x(00)*/, "");
            const buf = Buffer.from(compressed, "hex");
            return rlp_1.encode(buf);
        };
        this.accounts = blockchain.accounts;
        this.blockNumber = this.blockchain.fallback.blockNumber;
        this.forkBlockNumber = this.blockNumber.toBigInt();
        if (MetadataSingletons.has(db)) {
            this.metadata = new checkpointDb_1.CheckpointDB(MetadataSingletons.get(db));
        }
        else {
            const metadataDb = subleveldown_1.default(db, "f", LEVELDOWN_OPTIONS);
            MetadataSingletons.set(db, metadataDb);
            this.metadata = new checkpointDb_1.CheckpointDB(metadataDb);
        }
    }
    set root(value) {
        this._root = value;
    }
    get root() {
        return this._root;
    }
    checkpoint() {
        super.checkpoint();
        this.metadata.checkpoint(this.root);
    }
    async commit() {
        await Promise.all([super.commit(), this.metadata.commit()]);
    }
    async revert() {
        await Promise.all([super.revert(), this.metadata.revert()]);
    }
    setContext(stateRoot, address, blockNumber) {
        this._root = stateRoot;
        this.address = address;
        this.blockNumber = blockNumber;
        this.isPreForkBlock = blockNumber.toBigInt() < this.forkBlockNumber;
    }
    async put(key, val) {
        return super.put(key, val);
    }
    /**
     * Removes saved metadata from the given block range (inclusive)
     * @param startBlockNumber (inclusive)
     * @param endBlockNumber (inclusive)
     */
    async revertMetaData(startBlockNumber, endBlockNumber) {
        const db = this.metadata._leveldb;
        const stream = db.createKeyStream({
            gte: lexico.encode([startBlockNumber.toBuffer()]),
            lt: lexico.encode([
                utils_1.Quantity.from(endBlockNumber.toBigInt() + 1n).toBuffer()
            ])
        });
        const batch = db.batch();
        for await (const key of stream)
            batch.del(key);
        await batch.write();
    }
    createDelKey(key) {
        const blockNum = this.blockNumber.toBuffer();
        return lexico.encode([blockNum, this.address, key]);
    }
    /**
     * Checks if the key was deleted (locally -- not on the fork)
     * @param key
     */
    async keyWasDeleted(key) {
        const selfAddress = this.address === null ? utils_1.BUFFER_EMPTY : this.address;
        // check the uncommitted checkpoints for deleted keys before
        // checking the database itself
        // TODO(perf): there is probably a better/faster way of doing this for the
        // common case.
        const checkpoints = this.metadata.checkpoints;
        for (let i = checkpoints.length - 1; i >= 0; i--) {
            for (let [encodedKeyStr, value] of checkpoints[i].keyValueMap.entries()) {
                if (!value || !value.equals(DELETED_VALUE))
                    continue;
                const encodedKey = Buffer.from(encodedKeyStr, "binary");
                if (isEqualKey(encodedKey, selfAddress, key))
                    return true;
            }
        }
        // since we didn't find proof of deletion in a checkpoint let's check the
        // database for it.
        // We start searching from our database key (blockNum + address + key)
        // down to the earliest block we know about.
        // TODO(perf): this is just going to be slow once we get lots of keys
        // because it just checks every single key we've ever deleted (before this
        // one).
        const stream = this.metadata._leveldb.createReadStream({
            lte: this.createDelKey(key),
            reverse: true
        });
        for await (const data of stream) {
            const { key: encodedKey, value } = data;
            if (!value || !value.equals(DELETED_VALUE))
                continue;
            if (isEqualKey(encodedKey, selfAddress, key))
                return true;
        }
        // we didn't find proof of deletion so we return `false`
        return false;
    }
    async del(key) {
        await this.lock.wait();
        // we only track if the key was deleted (locally) for state tries _after_
        // the fork block because we can't possibly delete keys _before_ the fork
        // block, since those happened before ganache was even started
        // This little optimization can cut debug_traceTransaction time _in half_.
        if (!this.isPreForkBlock) {
            const delKey = this.createDelKey(key);
            const metaDataPutPromise = this.metadata.put(delKey, DELETED_VALUE);
            const hash = utils_1.keccak(key);
            const { node, stack } = await this.findPath(hash);
            if (node)
                await this._deleteNode(hash, stack);
            await metaDataPutPromise;
        }
        else {
            const hash = utils_1.keccak(key);
            const { node, stack } = await this.findPath(hash);
            if (node)
                await this._deleteNode(hash, stack);
        }
        this.lock.signal();
    }
    async get(key) {
        const value = await super.get(key);
        if (value != null)
            return value;
        // since we don't have this key in our local trie check if we've have
        // deleted it (locally)
        // we only check if the key was deleted (locally) for state tries _after_
        // the fork block because we can't possibly delete keys _before_ the fork
        // block, since those happened before ganache was even started
        // This little optimization can cut debug_traceTransaction time _in half_.
        if (!this.isPreForkBlock && (await this.keyWasDeleted(key)))
            return null;
        if (this.address === null) {
            // if the trie context's address isn't set, our key represents an address:
            return this.accountFromFallback(ethereum_address_1.Address.from(key), this.blockNumber);
        }
        else {
            // otherwise the key represents storage at the given address:
            return this.storageFromFallback(this.address, key, this.blockNumber);
        }
    }
    /**
     * Returns a copy of the underlying trie with the interface of ForkTrie.
     * @param includeCheckpoints - If true and during a checkpoint, the copy will
     * contain the checkpointing metadata and will use the same scratch as
     * underlying db.
     */
    copy(includeCheckpoints = true) {
        const db = this.db.copy();
        const secureTrie = new ForkTrie(db._leveldb, this.root, this.blockchain);
        secureTrie.accounts = this.accounts;
        secureTrie.address = this.address;
        secureTrie.blockNumber = this.blockNumber;
        if (includeCheckpoints && this.isCheckpoint) {
            secureTrie.db.checkpoints = [...this.db.checkpoints];
            // Our `metadata.checkpoints` needs to be the same reference to the
            // parent's metadata.checkpoints so that we can continue to track these
            // changes on this copy, otherwise deletions made to a contract's storage
            // may not be tracked.
            // Note: db.checkpoints don't need this same treatment because of the way
            // the statemanager uses a contract's trie: it doesn't ever save to it.
            // Instead, it saves to its own internal cache, which eventually gets
            // reverted or committed (flushed). Our metadata doesn't utilize a central
            // cache.
            secureTrie.metadata.checkpoints = this.metadata.checkpoints;
        }
        return secureTrie;
    }
}
exports.ForkTrie = ForkTrie;
//# sourceMappingURL=trie.js.map