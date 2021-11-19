import { Connector as EthereumConnector, Provider as EthereumProvider } from "@ganache/ethereum";
import type { Connector as FilecoinConnector, Provider as FilecoinProvider } from "@ganache/filecoin";
import { EthereumProviderOptions, EthereumLegacyProviderOptions } from "@ganache/ethereum-options";
import { FilecoinProviderOptions, FilecoinLegacyProviderOptions } from "@ganache/filecoin-options";
import "@ganache/options";
import { Executor } from "@ganache/utils";
export declare const EthereumFlavorName = "ethereum";
export declare const FilecoinFlavorName = "filecoin";
export declare const DefaultFlavor = "ethereum";
export declare const DefaultOptionsByName: {
    ethereum: import("@ganache/options/typings").Defaults<{
        chain: import("@ganache/ethereum-options/typings").ChainConfig;
        database: import("@ganache/ethereum-options/typings").DatabaseConfig;
        logging: import("@ganache/ethereum-options/typings").LoggingConfig;
        miner: import("@ganache/ethereum-options/typings").MinerConfig;
        wallet: import("@ganache/ethereum-options/typings").WalletConfig;
        fork: import("@ganache/ethereum-options/typings").ForkConfig;
    }>;
    filecoin: import("@ganache/options/typings").Defaults<{
        chain: import("@ganache/filecoin-options/src/chain-options").ChainConfig;
        database: import("@ganache/filecoin-options/src/database-options").DatabaseConfig;
        logging: import("@ganache/filecoin-options/src/logging-options").LoggingConfig;
        miner: import("@ganache/filecoin-options/src/miner-options").MinerConfig;
        wallet: import("@ganache/filecoin-options/src/wallet-options").WalletConfig;
    }>;
};
export declare type ConnectorsByName = {
    [EthereumFlavorName]: EthereumConnector;
    [FilecoinFlavorName]: FilecoinConnector;
};
export declare type OptionsByName = {
    [EthereumFlavorName]: EthereumProviderOptions;
    [FilecoinFlavorName]: FilecoinProviderOptions;
};
export declare type FlavorName = keyof ConnectorsByName;
export declare type Connector = {
    [K in keyof ConnectorsByName]: ConnectorsByName[K];
}[keyof ConnectorsByName];
export declare function GetConnector<T extends FlavorName>(flavor: T, providerOptions: Options<typeof flavor>, executor: Executor): ConnectorsByName[T];
/**
 * @public
 */
export declare type Provider = EthereumProvider | FilecoinProvider;
declare type EthereumOptions<T = "ethereum"> = {
    flavor?: T;
} & (EthereumProviderOptions | EthereumLegacyProviderOptions);
declare type FilecoinOptions<T = "filecoin"> = {
    flavor: T;
} & (FilecoinProviderOptions | FilecoinLegacyProviderOptions);
export declare type Options<T extends "filecoin" | "ethereum"> = T extends "filecoin" ? FilecoinOptions<T> : T extends "ethereum" ? EthereumOptions<T> : never;
export {};
//# sourceMappingURL=index.d.ts.map