/// <reference types="node" />
import { Account, QUANTITY, Tag } from "@ganache/ethereum-utils";
import { Quantity, Data } from "@ganache/utils";
import { Address } from "@ganache/ethereum-address";
import Blockchain from "../blockchain";
export default class AccountManager {
    #private;
    constructor(blockchain: Blockchain);
    get(address: Address, blockNumber?: Buffer | Tag): Promise<Account | null>;
    getRaw(address: Address, blockNumber?: string | Buffer | Tag): Promise<Buffer | null>;
    getStorageAt(address: Address, key: Buffer, blockNumber?: Buffer | Tag): Promise<Buffer>;
    getNonce(address: Address, blockNumber?: QUANTITY | Buffer | Tag): Promise<Quantity>;
    getBalance(address: Address, blockNumber?: QUANTITY | Buffer | Tag): Promise<Quantity>;
    getCode(address: Address, blockNumber?: QUANTITY | Buffer | Tag): Promise<Data>;
}
//# sourceMappingURL=account-manager.d.ts.map