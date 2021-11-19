/// <reference types="node" />
import Blockchain from "../blockchain";
import { FilterArgs, RangeFilterArgs } from "@ganache/ethereum-utils";
export declare function parseFilterDetails(filter: Pick<FilterArgs, "address" | "topics">): {
    addresses: Buffer[];
    topics: (string | string[])[];
};
export declare function parseFilterRange(filter: Omit<RangeFilterArgs, "address" | "topics">, blockchain: Blockchain): {
    fromBlock: import("@ganache/utils/typings").Quantity;
    toBlock: import("@ganache/utils/typings").Quantity;
    toBlockNumber: number;
};
export declare function parseFilter(filter: RangeFilterArgs, blockchain: Blockchain): {
    addresses: Buffer[];
    fromBlock: import("@ganache/utils/typings").Quantity;
    toBlock: import("@ganache/utils/typings").Quantity;
    toBlockNumber: number;
    topics: (string | string[])[];
};
//# sourceMappingURL=filter-parsing.d.ts.map