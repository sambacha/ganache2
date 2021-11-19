import { ConnectorsByName } from "@ganache/flavors";
import { ProviderOptions, ServerOptions } from "./src/options";
import Server from "./src/server";
export { Server, ServerStatus, _DefaultServerOptions } from "./src/server";
export type { Provider } from "@ganache/flavors";
export type { ProviderOptions, ServerOptions } from "./src/options";
/**
 * @public
 */
declare const Ganache: {
    /**
     * Creates a Ganache server instance that creates and
     * serves an underlying Ganache provider. Initialization
     * doesn't begin until `server.listen(...)` is called.
     * `server.listen(...)` returns a promise that resolves
     * when initialization is finished.
     *
     * @param options - Configuration options for the server;
     * `options` includes provider based options as well.
     * @returns A provider instance for the flavor
     * `options.flavor` which defaults to `ethereum`.
     */
    server: <T extends "ethereum" | "filecoin" = "ethereum">(options?: ServerOptions<T>) => Server<T>;
    /**
     * Initializes a Web3 provider for a Ganache instance.
     * This function starts an asynchronous task, but does not
     * finish it by the time the function returns. Listen to
     * `provider.on("connect", () => {...})` or wait for
     * `await provider.once("connect")` for initialization to
     * finish. You may start sending requests to the provider
     * before initialization finishes however; these requests
     * will start being consumed after initialization finishes.
     *
     * @param options - Configuration options for the provider.
     * @returns A provider instance for the flavor
     * `options.flavor` which defaults to `ethereum`.
     */
    provider: <T_1 extends "ethereum" | "filecoin" = "ethereum">(options?: import("@ganache/flavors/typings").Options<T_1>) => ConnectorsByName[T_1]["provider"];
};
export declare const server: <T extends "ethereum" | "filecoin" = "ethereum">(options?: ServerOptions<T>) => Server<T>;
export declare const provider: <T extends "ethereum" | "filecoin" = "ethereum">(options?: import("@ganache/flavors/typings").Options<T>) => ConnectorsByName[T]["provider"];
/**
 * @public
 */
export default Ganache;
//# sourceMappingURL=index.d.ts.map