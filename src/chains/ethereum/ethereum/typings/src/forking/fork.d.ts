import { EthereumInternalOptions } from "@ganache/ethereum-options";
import { Data, Quantity } from "@ganache/utils";
import Common from "@ethereumjs/common";
import { Block } from "@ganache/ethereum-block";
import { Account } from "@ganache/ethereum-utils";
export declare class Fork {
    #private;
    common: Common;
    blockNumber: Quantity;
    stateRoot: Data;
    block: Block;
    constructor(options: EthereumInternalOptions, accounts: Account[]);
    initialize(): Promise<void>;
    private initCache;
    request<T = unknown>(method: string, params: unknown[], options?: {
        disableCache: boolean;
    }): Promise<T>;
    abort(): void;
    close(): Promise<void>;
    isValidForkBlockNumber(blockNumber: Quantity): boolean;
    selectValidForkBlockNumber(blockNumber: Quantity): Quantity;
}
//# sourceMappingURL=fork.d.ts.map