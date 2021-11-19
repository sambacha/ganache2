/// <reference types="node" />
import { Definitions } from "@ganache/options";
export declare type OptionsAccount = {
    balance: string | number | bigint | Buffer;
    secretKey?: string;
};
export declare type WalletConfig = {
    options: {
        /**
         * Number of accounts to generate at startup.
         *
         * @defaultValue 10
         */
        totalAccounts: {
            type: number;
            hasDefault: true;
        };
        /**
         * Use pre-defined, deterministic seed.
         */
        deterministic: {
            type: boolean;
            hasDefault: true;
        };
        /**
         * Seed to use to generate a mnemonic.
         */
        seed: {
            type: string;
            hasDefault: true;
        };
        /**
         * The default account balance, specified in FIL.
         *
         * @defaultValue 100 // FIL
         */
        defaultBalance: {
            type: number;
            hasDefault: true;
        };
    };
    exclusiveGroups: [["deterministic", "seed"]];
};
export declare const WalletOptions: Definitions<WalletConfig>;
//# sourceMappingURL=wallet-options.d.ts.map