import { ServerOptions } from "./options";
import { Connector, ConnectorsByName, DefaultFlavor, FlavorName } from "@ganache/flavors";
import Emittery from "emittery";
export declare type Provider = Connector["provider"];
export declare type Callback = (err: Error | null) => void;
/**
 * Server ready state constants.
 *
 * These are bit flags. This means that you can check if the status is:
 *  * ready: `status === Status.ready` or `status & Status.ready !== 0`
 *  * opening: `status === Status.opening` or `status & Status.opening !== 0`
 *  * open: `status === Status.open` or `status & Status.open !== 0`
 *  * opening || open: `status & Status.openingOrOpen !== 0` or `status & (Status.opening | Status.open) !== 0`
 *  * closing: `status === Status.closing` or `status & Status.closing !== 0`
 *  * closed: `status === Status.closed` or `status & Status.closed !== 0`
 *  * closing || closed: `status & Status.closingOrClosed !== 0` or `status & (Status.closing | Status.closed) !== 0`
 */
export declare enum ServerStatus {
    /**
     * The Server is in an unknown state; perhaps construction didn't succeed
     */
    unknown = 0,
    /**
     * The Server has been constructed and is ready to be opened.
     */
    ready = 1,
    /**
     * The Server has started to open, but has not yet finished initialization.
     */
    opening = 2,
    /**
     * The Server is open and ready for connection.
     */
    open = 4,
    /**
     * The Server is either opening or is already open
     */
    openingOrOpen = 6,
    /**
     * The Server is in the process of closing.
     */
    closing = 8,
    /**
     * The Server is closed and not accepting new connections.
     */
    closed = 16,
    /**
     * The Server is either opening or is already open
     */
    closingOrClosed = 24
}
/**
 * For private use. May change in the future.
 * I don't don't think these options should be held in this `core` package.
 * @ignore
 */
export declare const _DefaultServerOptions: import("@ganache/options/typings").Defaults<import("./options").Options>;
/**
 * @public
 */
export declare class Server<T extends FlavorName = typeof DefaultFlavor> extends Emittery<{
    open: undefined;
    close: undefined;
}> {
    #private;
    get provider(): ConnectorsByName[T]["provider"];
    get status(): number;
    constructor(providerAndServerOptions?: ServerOptions<T>);
    private initialize;
    listen(port: number): Promise<void>;
    listen(port: number, host: string): Promise<void>;
    listen(port: number, callback: Callback): void;
    listen(port: number, host: string, callback: Callback): void;
    close(): Promise<void>;
}
export default Server;
//# sourceMappingURL=server.d.ts.map