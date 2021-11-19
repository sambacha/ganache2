/*!
 * @ganache/filecoin-options
 *
 * @author Tim Coulter
 * @license MIT
 */
export { FilecoinInternalOptions, FilecoinOptionsConfig, FilecoinProviderOptions, FilecoinDefaults, FilecoinLegacyProviderOptions } from "./src";
declare const _default: {
    FilecoinDefaults: import("@ganache/options/typings").Defaults<{
        chain: import("./src/chain-options").ChainConfig;
        database: import("./src/database-options").DatabaseConfig;
        logging: import("./src/logging-options").LoggingConfig;
        miner: import("./src/miner-options").MinerConfig;
        wallet: import("./src/wallet-options").WalletConfig;
    }>;
    FilecoinOptionsConfig: import("@ganache/options/typings").OptionsConfig<{
        chain: import("./src/chain-options").ChainConfig;
        database: import("./src/database-options").DatabaseConfig;
        logging: import("./src/logging-options").LoggingConfig;
        miner: import("./src/miner-options").MinerConfig;
        wallet: import("./src/wallet-options").WalletConfig;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map