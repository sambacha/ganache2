import { ChainConfig } from "./chain-options";
import { DatabaseConfig } from "./database-options";
import { LoggingConfig } from "./logging-options";
import { MinerConfig } from "./miner-options";
import { WalletConfig } from "./wallet-options";
import { Base, Defaults, ExternalConfig, InternalConfig, Legacy, LegacyOptions, OptionName, OptionRawType, OptionsConfig } from "@ganache/options";
declare type FilecoinConfig = {
    chain: ChainConfig;
    database: DatabaseConfig;
    logging: LoggingConfig;
    miner: MinerConfig;
    wallet: WalletConfig;
};
export declare const FilecoinDefaults: Defaults<FilecoinConfig>;
declare type MakeLegacyOptions<C extends Base.Config> = UnionToIntersection<{
    [K in OptionName<C>]: K extends LegacyOptions<C> ? Legacy<C, K> : Record<K, OptionRawType<C, K>>;
}[OptionName<C>]>;
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export declare type FilecoinLegacyProviderOptions = Partial<MakeLegacyOptions<ChainConfig> & MakeLegacyOptions<LoggingConfig> & MakeLegacyOptions<MinerConfig> & MakeLegacyOptions<WalletConfig>>;
export declare type FilecoinProviderOptions = Partial<{
    [K in keyof FilecoinConfig]: ExternalConfig<FilecoinConfig[K]>;
}>;
export declare type FilecoinInternalOptions = {
    [K in keyof FilecoinConfig]: InternalConfig<FilecoinConfig[K]>;
};
export declare const FilecoinOptionsConfig: OptionsConfig<FilecoinConfig>;
export {};
//# sourceMappingURL=index.d.ts.map