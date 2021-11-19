import { Data, Quantity } from "@ganache/utils";
import { Address } from "@ganache/ethereum-address";
import type Common from "@ethereumjs/common";
import { GanacheRawExtraTx } from "./raw";
/**
 * Compute the 'intrinsic gas' for a message with the given data.
 * @param data - The transaction's data
 * @param hasToAddress - boolean,
 * @param common - The Common use to determine gas costs
 * @returns The absolute minimum amount of gas this transaction will consume,
 * or `-1` if the data in invalid (gas consumption would exceed `MAX_UINT64`
 * (`(2n ** 64n) - 1n`).
 */
export declare const calculateIntrinsicGas: (data: Data, hasToAddress: boolean, common: Common) => bigint;
export declare class BaseTransaction {
    type: Quantity;
    nonce: Quantity;
    gas: Quantity;
    to: Address | null;
    value: Quantity;
    data: Data;
    v: Quantity | null;
    r: Quantity | null;
    s: Quantity | null;
    effectiveGasPrice: Quantity;
    from: Data | null;
    common: Common;
    index: Quantity;
    hash: Data;
    blockNumber: Quantity;
    blockHash: Data;
    constructor(common: Common, extra?: GanacheRawExtraTx);
    setExtra(raw: GanacheRawExtraTx): void;
    calculateIntrinsicGas(): bigint;
}
//# sourceMappingURL=base-transaction.d.ts.map