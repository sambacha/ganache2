/// <reference types="node" />
import { Data, Quantity } from "@ganache/utils";
import { GanacheRawBlockTransactionMetaData, TypedDatabaseTransaction, TypedTransaction } from "@ganache/ethereum-transaction";
import type Common from "@ethereumjs/common";
import { BlockHeader } from "./runtime-block";
import { EthereumRawBlockHeader } from "./serialize";
export declare type BaseFeeHeader = BlockHeader & Required<Pick<BlockHeader, "baseFeePerGas">>;
export declare class Block {
    /**
     *  Base fee per gas for blocks without a parent containing a base fee per gas.
     */
    static readonly INITIAL_BASE_FEE_PER_GAS: 1000000000n;
    protected _size: number;
    protected _raw: EthereumRawBlockHeader;
    protected _common: Common;
    protected _rawTransactions: TypedDatabaseTransaction[];
    protected _rawTransactionMetaData: GanacheRawBlockTransactionMetaData[];
    header: BlockHeader;
    constructor(serialized: Buffer, common: Common);
    private _hash;
    hash(): Data;
    getTransactions(): TypedTransaction[];
    toJSON(includeFullTransactions?: boolean): {
        size: Quantity;
        transactions: (Data | import("@ganache/ethereum-transaction/typings").LegacyTransactionJSON | import("@ganache/ethereum-transaction/typings").EIP2930AccessListTransactionJSON | import("@ganache/ethereum-transaction/typings").EIP1559FeeMarketTransactionJSON)[];
        uncles: string[];
        parentHash: Data;
        sha3Uncles: Data;
        miner: Data;
        stateRoot: Data;
        transactionsRoot: Data;
        receiptsRoot: Data;
        logsBloom: Data;
        difficulty: Quantity;
        totalDifficulty: Quantity;
        number: Quantity;
        gasLimit: Quantity;
        gasUsed: Quantity;
        timestamp: Quantity;
        extraData: Data;
        mixHash: Data;
        nonce: Data;
        baseFeePerGas?: Quantity;
        hash: Data;
    };
    getTxFn(include?: boolean): (tx: TypedTransaction) => ReturnType<TypedTransaction["toJSON"]> | Data;
    static fromParts(rawHeader: EthereumRawBlockHeader, txs: TypedDatabaseTransaction[], totalDifficulty: Buffer, extraTxs: GanacheRawBlockTransactionMetaData[], size: number, common: Common): Block;
    static calcNextBaseFeeBigInt(parentHeader: BaseFeeHeader): bigint;
    static calcNBlocksMaxBaseFee(blocks: number, parentHeader: BaseFeeHeader): bigint;
    static calcNextBaseFee(parentBlock: Block): bigint;
}
//# sourceMappingURL=block.d.ts.map