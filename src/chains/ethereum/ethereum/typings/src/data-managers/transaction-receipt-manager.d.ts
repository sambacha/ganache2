/// <reference types="node" />
import { LevelUp } from "levelup";
import Manager from "./manager";
import Blockchain from "../blockchain";
import { TransactionReceipt } from "@ganache/ethereum-transaction";
export default class TransactionReceiptManager extends Manager<TransactionReceipt> {
    #private;
    constructor(base: LevelUp, blockchain: Blockchain);
    get(key: string | Buffer): Promise<TransactionReceipt>;
}
//# sourceMappingURL=transaction-receipt-manager.d.ts.map