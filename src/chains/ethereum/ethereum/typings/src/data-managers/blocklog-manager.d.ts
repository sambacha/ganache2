/// <reference types="node" />
import { BlockLogs, FilterArgs } from "@ganache/ethereum-utils";
import { LevelUp } from "levelup";
import Manager from "./manager";
import { Quantity } from "@ganache/utils";
import Blockchain from "../blockchain";
export default class BlockLogManager extends Manager<BlockLogs> {
    #private;
    constructor(base: LevelUp, blockchain: Blockchain);
    get(key: string | Buffer): Promise<BlockLogs>;
    getLogs(filter: FilterArgs): Promise<{
        address: import("@ganache/ethereum-address/typings").Address;
        blockHash: import("@ganache/utils/typings").Data;
        blockNumber: Quantity;
        data: import("@ganache/utils/typings").Data | import("@ganache/utils/typings").Data[];
        logIndex: Quantity;
        removed: boolean;
        topics: import("@ganache/utils/typings").Data | import("@ganache/utils/typings").Data[];
        transactionHash: import("@ganache/utils/typings").Data;
        transactionIndex: Quantity;
    }[]>;
}
//# sourceMappingURL=blocklog-manager.d.ts.map