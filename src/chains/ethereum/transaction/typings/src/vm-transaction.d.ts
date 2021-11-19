/// <reference types="bn.js" />
/// <reference types="node" />
import type { BN } from "ethereumjs-util";
export declare type VmTransaction = {
    nonce: BN;
    gasPrice?: BN;
    gasLimit: BN;
    maxPriorityFeePerGas?: never;
    maxFeePerGas?: never;
    to: {
        buf: Buffer;
    };
    value: BN;
    data: Buffer;
    getSenderAddress: () => {
        buf: Buffer;
    };
    getBaseFee: () => BN;
    getUpfrontCost: () => BN;
} | {
    nonce: BN;
    gasPrice?: never;
    gasLimit: BN;
    maxPriorityFeePerGas?: BN;
    maxFeePerGas?: BN;
    to: {
        buf: Buffer;
    };
    value: BN;
    data: Buffer;
    getSenderAddress: () => {
        buf: Buffer;
    };
    getBaseFee: () => BN;
    getUpfrontCost: () => BN;
};
//# sourceMappingURL=vm-transaction.d.ts.map