import { Options as ProviderOptions } from "@ganache/flavors";
declare const _default: {
    initialize: <T extends "ethereum" | "filecoin" = "ethereum">(options?: ProviderOptions<T>) => {
        connector: import("@ganache/flavors/typings").ConnectorsByName[T];
        promise: Promise<void>;
    };
};
/**
 * Loads the connector specified by the given `flavor`
 */
export default _default;
//# sourceMappingURL=connector-loader.d.ts.map