import { DefaultFlavor, FlavorName } from "@ganache/flavors";
import { ServerOptions } from "@ganache/core";
declare type CliOptions = {
    host: string;
    port: number;
};
export declare type Argv = ServerOptions<FlavorName> & {
    _: [FlavorName];
    server: CliOptions;
};
export declare type CliSettings = {
    host: string;
    port: number;
};
export declare type Command = FlavorName | ["$0", typeof DefaultFlavor];
export {};
//# sourceMappingURL=types.d.ts.map