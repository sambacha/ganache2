/// <reference types="node" />
import Manager from "./manager";
import TransactionPool from "../transaction-pool";
import { EthereumInternalOptions } from "@ganache/ethereum-options";
import { LevelUp } from "levelup";
import Blockchain from "../blockchain";
import type Common from "@ethereumjs/common";
import { Data } from "@ganache/utils";
import { TypedTransaction } from "@ganache/ethereum-transaction";
declare class NoOp {
}
export default class TransactionManager extends Manager<NoOp> {
    #private;
    readonly transactionPool: TransactionPool;
    constructor(options: EthereumInternalOptions["miner"], common: Common, blockchain: Blockchain, base: LevelUp);
    fromFallback: (transactionHash: Buffer) => Promise<Buffer>;
    getRaw(transactionHash: Buffer): Promise<Buffer>;
    get(key: string | Buffer): Promise<TypedTransaction>;
    /**
     * Adds the transaction to the transaction pool.
     *
     * Returns a promise that is only resolved in the order it was added.
     *
     * @param transaction
     * @param secretKey
     * @returns `true` if the `transaction` is immediately executable, `false` if
     * it may be valid in the future. Throws if the transaction is invalid.
     */
    add(transaction: TypedTransaction, secretKey?: Data): Promise<boolean>;
    /**
     * Immediately ignores all transactions that were in the process of being
     * added to the pool. These transactions' `push` promises will be resolved
     * immediately with the value `false` and will _not_ be added to the pool.
     *
     * Also clears all transactions that were already added to the pool.
     *
     * Transactions that are currently in the process of being mined may still be
     * mined.
     */
    clear(): void;
    /**
     * Stop processing _new_ transactions; puts new requests in a queue. Has no
     * affect if already paused.
     */
    pause(): Promise<void>;
    /**
     * Resume processing transactions. Has no effect if not paused.
     */
    resume: () => void;
}
export {};
//# sourceMappingURL=transaction-manager.d.ts.map