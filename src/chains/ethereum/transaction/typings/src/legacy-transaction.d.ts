/// <reference types="node" />
/// <reference types="bn.js" />
import { Data, Quantity } from "@ganache/utils";
import { Address } from "@ganache/ethereum-address";
import type Common from "@ethereumjs/common";
import { BN } from "ethereumjs-util";
import { RuntimeTransaction } from "./runtime-transaction";
import { TypedRpcTransaction } from "./rpc-transaction";
import { EIP2930AccessListDatabasePayload, GanacheRawExtraTx, LegacyDatabasePayload, TypedDatabaseTransaction } from "./raw";
import { Capability, LegacyTransactionJSON } from "./transaction-types";
export declare class LegacyTransaction extends RuntimeTransaction {
    gasPrice: Quantity;
    type: Quantity;
    constructor(data: LegacyDatabasePayload | TypedRpcTransaction, common: Common, extra?: GanacheRawExtraTx);
    toJSON(common?: Common): LegacyTransactionJSON;
    static fromTxData(data: LegacyDatabasePayload | TypedRpcTransaction, common: Common, extra?: GanacheRawExtraTx): LegacyTransaction;
    static fromEIP2930AccessListTransaction(data: EIP2930AccessListDatabasePayload | TypedRpcTransaction, common: Common): LegacyTransaction;
    toVmTransaction(): {
        hash: () => Buffer;
        nonce: BN;
        gasPrice: BN;
        gasLimit: BN;
        to: {
            buf: Buffer;
            equals: (a: {
                buf: Buffer;
            }) => boolean;
        };
        value: BN;
        data: Buffer;
        getSenderAddress: () => {
            buf: Buffer;
            equals: (a: {
                buf: Buffer;
            }) => boolean;
        };
        /**
         * the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)
         */
        getBaseFee: () => BN;
        getUpfrontCost: () => BN;
        supports: (capability: Capability) => boolean;
    };
    /**
     * sign a transaction with a given private key, then compute and set the `hash`.
     *
     * @param privateKey - Must be 32 bytes in length
     */
    signAndHash(privateKey: Buffer): void;
    toEthRawTransaction(v: Buffer, r: Buffer, s: Buffer): LegacyDatabasePayload;
    computeIntrinsics(v: Quantity, raw: TypedDatabaseTransaction, chainId: number): {
        from: Address;
        hash: Data;
        serialized: Buffer;
        encodedData: import("@ganache/rlp/typings").EncodedPart;
        encodedSignature: import("@ganache/rlp/typings").EncodedPart;
    };
    updateEffectiveGasPrice(): void;
}
//# sourceMappingURL=legacy-transaction.d.ts.map