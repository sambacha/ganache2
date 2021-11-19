/// <reference types="node" />
import { Address } from "@ganache/ethereum-address";
import { TransactionLog } from "@ganache/ethereum-utils";
import { Data, Quantity } from "@ganache/utils";
import { AccessList } from "@ethereumjs/tx";
import Common from "@ethereumjs/common";
import { TypedTransaction } from "./transaction-types";
declare type EthereumRawReceipt = [
    status: Buffer,
    cumulativeGasUsed: Buffer,
    logsBloom: Buffer,
    logs: TransactionLog[]
];
export interface TransactionReceiptJSON {
    transactionHash: Data;
    transactionIndex: Quantity;
    blockNumber: Quantity;
    blockHash: Data;
    from: Data;
    to: Address;
    cumulativeGasUsed: Quantity;
    gasUsed: Quantity;
    contractAddress: Data;
    logs: {
        address: Address;
        blockHash: Data;
        blockNumber: Quantity;
        data: Data | Data[];
        logIndex: Quantity;
        removed: boolean;
        topics: Data | Data[];
        transactionHash: Data;
        transactionIndex: Quantity;
    }[];
    logsBloom: Data;
    status: Quantity;
    type?: Quantity;
    chainId?: Quantity;
    accessList?: AccessList;
    effectiveGasPrice: Quantity;
}
export declare class TransactionReceipt {
    #private;
    contractAddress: Buffer;
    raw: EthereumRawReceipt;
    encoded: {
        length: number;
        output: Buffer[];
    };
    txType: Quantity;
    constructor(data?: Buffer);
    static fromValues(status: Buffer, cumulativeGasUsed: Buffer, logsBloom: Buffer, logs: TransactionLog[], gasUsed: Buffer, contractAddress: Buffer, type?: Quantity): TransactionReceipt;
    serialize(all: boolean): Buffer;
    toJSON(block: {
        hash(): Data;
        header: {
            number: Quantity;
            baseFeePerGas?: Quantity;
        };
    }, transaction: TypedTransaction, common: Common): TransactionReceiptJSON;
}
export {};
//# sourceMappingURL=transaction-receipt.d.ts.map