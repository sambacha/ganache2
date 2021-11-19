import { DefaultFlavor, FlavorName, Options as FlavorOptions } from "@ganache/flavors";
import { ServerConfig } from "./server-options";
import { Defaults, Definitions, ExternalConfig, InternalConfig, OptionsConfig } from "@ganache/options";
export declare type ProviderOptions<T extends FlavorName> = FlavorOptions<T>;
export declare type Options = {
    server: ServerConfig;
};
export declare type ServerOptions<T extends FlavorName = typeof DefaultFlavor> = Partial<{
    [K in keyof Options]: ExternalConfig<Options[K]>;
}> & ProviderOptions<T>;
export declare type InternalOptions = {
    [K in keyof Options]: InternalConfig<Options[K]>;
};
export declare type ServerDefaults = {
    [K in keyof Options]: Definitions<Options[K]>;
};
export declare const serverDefaults: Defaults<Options>;
export declare const serverOptionsConfig: OptionsConfig<Options>;
//# sourceMappingURL=index.d.ts.map