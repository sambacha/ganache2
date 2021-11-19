/// <reference types="node" />
import { Account } from "@ganache/ethereum-utils";
import { Data, Quantity } from "@ganache/utils";
import crypto from "crypto";
import { EthereumInternalOptions } from "@ganache/ethereum-options";
import { Address } from "@ganache/ethereum-address";
declare type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
declare type EncryptType = ThenArg<ReturnType<Wallet["encrypt"]>>;
export default class Wallet {
    #private;
    readonly addresses: string[];
    readonly initialAccounts: Account[];
    readonly knownAccounts: Set<string>;
    readonly encryptedKeyFiles: Map<string, {
        crypto: {
            cipher: string;
            ciphertext: Data;
            cipherparams: {
                iv: Data;
            };
            kdf: string;
            kdfParams: {
                salt: Data;
                dklen: 32;
                n: 1024;
                p: 8;
                r: 1;
            };
            mac: Data;
        };
        id: string;
        version: number;
    }>;
    readonly unlockedAccounts: Map<string, Data>;
    readonly lockTimers: Map<string, NodeJS.Timeout>;
    constructor(opts: EthereumInternalOptions["wallet"]);
    encrypt(privateKey: Data, passphrase: string): Promise<{
        crypto: {
            cipher: string;
            ciphertext: Data;
            cipherparams: {
                iv: Data;
            };
            kdf: string;
            kdfParams: {
                salt: Data;
                dklen: 32;
                n: 1024;
                p: 8;
                r: 1;
            };
            mac: Data;
        };
        id: string;
        version: number;
    }>;
    decrypt(keyfile: EncryptType, passphrase: crypto.BinaryLike): Promise<Buffer>;
    static createAccount(balance: Quantity, privateKey: Data, address: Address): Account;
    static createAccountFromPrivateKey(privateKey: Data): Account;
    createRandomAccount(): Account;
    unlockAccount(lowerAddress: string, passphrase: string, duration: number): Promise<boolean>;
    unlockUnknownAccount(lowerAddress: string, duration: number): Promise<boolean>;
    lockAccount(lowerAddress: string): boolean;
}
export {};
//# sourceMappingURL=wallet.d.ts.map