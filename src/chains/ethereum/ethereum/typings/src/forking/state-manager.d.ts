/// <reference types="node" />
import { Address as EJS_Address } from "ethereumjs-util";
import StateManager from "@ethereumjs/vm/dist/state/stateManager";
import { ForkCache } from "./cache";
import Common from "@ethereumjs/common";
import { ForkTrie } from "./trie";
/**
 * Options for constructing a [[StateManager]].
 */
export interface DefaultStateManagerOpts {
    /**
     * Parameters of the chain ([`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common))
     */
    common: Common;
    /**
     * An [`merkle-patricia-tree`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie) instance
     */
    trie: ForkTrie;
}
/**
 * Interface for getting and setting data from an underlying
 * state trie.
 */
export declare class ForkStateManager extends StateManager {
    _cache: ForkCache;
    private accounts;
    /**
     * Instantiate the StateManager interface.
     */
    constructor(opts: DefaultStateManagerOpts);
    /**
     * Copies the current instance of the `StateManager`
     * at the last fully committed point, i.e. as if all current
     * checkpoints were reverted.
     */
    copy(): StateManager;
    /**
     * Creates a storage trie from the primary storage trie
     * for an account and saves this in the storage cache.
     * @private
     */
    _lookupStorageTrie(address: EJS_Address): Promise<ForkTrie>;
    /**
     * Gets the storage value associated with the provided `address` and `key`.
     * This method returns the shortest representation of the stored value.
     * @param address - Address of the account to get the storage for
     * @param key - Key in the account's storage to get the value for. Must be 32
     * bytes long.
     * @returns {Promise<Buffer>} - The storage value for the account
     * corresponding to the provided address at the provided key. If this does not
     * exist an empty `Buffer` is returned.
     */
    getContractStorage(address: EJS_Address, key: Buffer): Promise<Buffer>;
}
//# sourceMappingURL=state-manager.d.ts.map