/// <reference types="node" />
import type Common from "@ethereumjs/common";
import { TypedRpcTransaction } from "./rpc-transaction";
import { GanacheRawExtraTx, TypedDatabaseTransaction } from "./raw";
import { TypedTransaction } from "./transaction-types";
export declare enum TransactionType {
    Legacy = 0,
    EIP2930AccessList = 1,
    EIP1559AccessList = 2
}
export declare class TransactionFactory {
    tx: TypedTransaction;
    constructor(raw: Buffer, common: Common);
    private static _fromData;
    /**
     * Create a transaction from a `txData` object
     *
     * @param txData - The rpc transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)
     * @param common - Options to pass on to the constructor of the transaction
     */
    static fromRpc(txData: TypedRpcTransaction, common: Common, extra?: GanacheRawExtraTx): TypedTransaction;
    /**
     * Create a transaction from a `txData` object
     *
     * @param txData - The raw transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)
     * @param common - Options to pass on to the constructor of the transaction
     */
    static fromDatabaseTx(txData: TypedDatabaseTransaction, common: Common, extra?: GanacheRawExtraTx): TypedTransaction;
    /**
     * Create a transaction from a `txData` object
     *
     * When transaction types are activated (EIP 2718) the txData will be checked
     * for a transaction envelope (first byte < 192) before determining the
     * decoding strategy, otherwise it will be decoded as a Legacy Transaction. If
     * the transaction contains a transaction envelop, but EIP 2718 is not active
     * decoding will fail and an exception will be thrown.
     *
     * @param txData - The raw hex string transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)
     * @param common - Options to pass on to the constructor of the transaction
     */
    static fromString(txData: string, common: Common): TypedTransaction;
    private static typeOf;
    static typeOfRaw(raw: TypedDatabaseTransaction): TransactionType;
    static typeOfRPC(rpc: TypedRpcTransaction): TransactionType;
}
//# sourceMappingURL=transaction-factory.d.ts.map