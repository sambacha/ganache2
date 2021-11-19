/// <reference types="node" />
/// <reference types="bn.js" />
import { Data, Quantity } from "@ganache/utils";
import { Address } from "@ganache/ethereum-address";
import type Common from "@ethereumjs/common";
import { BN } from "ethereumjs-util";
import { TypedRpcTransaction } from "./rpc-transaction";
import { RuntimeTransaction } from "./runtime-transaction";
import { EIP1559FeeMarketDatabasePayload, EIP1559FeeMarketDatabaseTx, GanacheRawExtraTx, TypedDatabaseTransaction } from "./raw";
import { AccessList, AccessListBuffer } from "@ethereumjs/tx";
import { Capability, EIP1559FeeMarketTransactionJSON } from "./transaction-types";
export declare class EIP1559FeeMarketTransaction extends RuntimeTransaction {
    chainId: Quantity;
    maxPriorityFeePerGas: Quantity;
    maxFeePerGas: Quantity;
    accessList: AccessListBuffer;
    accessListJSON: AccessList;
    type: Quantity;
    constructor(data: EIP1559FeeMarketDatabasePayload | TypedRpcTransaction, common: Common, extra?: GanacheRawExtraTx);
    toJSON(_common?: Common): EIP1559FeeMarketTransactionJSON;
    static fromTxData(data: EIP1559FeeMarketDatabasePayload | TypedRpcTransaction, common: Common, extra?: GanacheRawExtraTx): EIP1559FeeMarketTransaction;
    toVmTransaction(): {
        hash: () => Buffer;
        nonce: BN;
        maxPriorityFeePerGas: BN;
        maxFeePerGas: BN;
        gasLimit: BN;
        to: {
            buf: Buffer;
            equals: (a: {
                buf: Buffer;
            }) => boolean;
        };
        value: BN;
        data: Buffer;
        AccessListJSON: AccessList;
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
        getUpfrontCost: (baseFee?: BN) => BN;
        supports: (capability: Capability) => boolean;
    };
    /**
     * sign a transaction with a given private key, then compute and set the `hash`.
     *
     * @param privateKey - Must be 32 bytes in length
     */
    signAndHash(privateKey: Buffer): void;
    toEthRawTransaction(v: Buffer, r: Buffer, s: Buffer): EIP1559FeeMarketDatabaseTx;
    computeIntrinsics(v: Quantity, raw: TypedDatabaseTransaction): {
        from: Address;
        hash: Data;
        serialized: Buffer;
        encodedData: import("@ganache/rlp/typings").EncodedPart;
        encodedSignature: import("@ganache/rlp/typings").EncodedPart;
    };
    updateEffectiveGasPrice(baseFeePerGas: Quantity): void;
}
//# sourceMappingURL=eip1559-fee-market-transaction.d.ts.map