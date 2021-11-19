/// <reference types="node" />
import Emittery from "emittery";
import Blockchain from "./blockchain";
import { Heap } from "@ganache/utils";
import { Data } from "@ganache/utils";
import { EthereumInternalOptions } from "@ganache/ethereum-options";
import { Executables } from "./miner/executables";
import { TypedTransaction } from "@ganache/ethereum-transaction";
/**
 * Used to track a transaction's placement in the transaction pool based off
 * of the its nonce.
 */
export declare enum TriageOption {
    /**
     * Default value. A tx will be added to the future queue if it is not yet
     * executable based off of the transaction's nonce.
     */
    FutureQueue = 0,
    /**
     * The transaction is currently executable based off the transaction's nonce.
     */
    Executable = 1,
    /**
     * The transaction is currently executable, has the same nonce as a pending
     * transaction of the same origin, and has a gas price that is high enough to
     * replace the currently pending transaction.
     */
    ReplacesPendingExecutable = 2,
    /**
     * The transaction is not currently executable but has the same nonce as a
     * future queued transaction of the same origin and has a gas price that is
     * high enough to replace the future queued transaction.
     */
    ReplacesFutureTransaction = 3
}
export default class TransactionPool extends Emittery.Typed<{}, "drain"> {
    #private;
    constructor(options: EthereumInternalOptions["miner"], blockchain: Blockchain, origins?: Map<string, Heap<TypedTransaction>>);
    readonly executables: Executables;
    /**
     * Inserts a transaction into the pending queue, if executable, or future pool
     * if not.
     *
     * @param transaction
     * @param secretKey
     * @returns data that can be used to drain the queue
     */
    prepareTransaction(transaction: TypedTransaction, secretKey?: Data): Promise<boolean>;
    clear(): void;
    /**
     * Returns the transaction matching the given hash.
     *
     * This isn't the fastest thing... but querying for pending transactions is
     * likely rare, so leaving this slow so other code paths can be faster might
     * be okay.
     *
     * @param transactionHash
     */
    find(transactionHash: Buffer): TypedTransaction;
    readonly drain: () => void;
}
//# sourceMappingURL=transaction-pool.d.ts.map