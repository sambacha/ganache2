import Emittery from "emittery";
import Blockchain from "./blockchain";
import { EthereumInternalOptions } from "@ganache/ethereum-options";
import type { LevelUp } from "levelup";
export default class Database extends Emittery {
    #private;
    readonly blockchain: Blockchain;
    directory: string;
    db: LevelUp;
    blocks: LevelUp;
    blockIndexes: LevelUp;
    blockLogs: LevelUp;
    transactions: LevelUp;
    transactionReceipts: LevelUp;
    storageKeys: LevelUp;
    trie: LevelUp;
    readonly initialized: boolean;
    /**
     * The Database handles the creation of the database, and all access to it.
     * Once the database has been fully initialized it will emit a `ready`
     * event.
     * @param options Supports one of two options: `db` (a leveldown compliant
     * store instance) or `dbPath` (the path to store/read the db instance)
     * @param blockchain
     */
    constructor(options: EthereumInternalOptions["database"], blockchain: Blockchain);
    initialize: () => Promise<void>;
    /**
     * Call `batch` to batch `put` and `del` operations within the same
     * event loop tick of the provided function. All db operations within the
     * batch _must_ be executed synchronously.
     * @param fn Within this function's event loop tick, all `put` and
     * `del` database operations are applied in a single atomic operation. This
     * provides a single write call and if any individual put/del's fail the
     * entire operation fails and no modifications are made.
     * @returns a Promise that resolves to the return value
     * of the provided function.
     */
    batch<T>(fn: () => T): Promise<T>;
    /**
     * Gracefully closes the database and cleans up the file system and waits for
     * it to fully shut down. Emits a `close` event once complete.
     * Note: only emits `close` once.
     */
    close(): Promise<void>;
}
//# sourceMappingURL=database.d.ts.map