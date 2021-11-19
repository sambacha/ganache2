/// <reference types="node" />
import Emittery from "emittery";
import { Connector, Executor } from "@ganache/utils";
import Provider from "./src/provider";
import TezosApi from "./src/api";
import { HttpRequest } from "@trufflesuite/uws-js-unofficial";
export declare type TezosProvider = Provider;
export declare const TezosProvider: typeof Provider;
export declare class TezosConnector extends Emittery.Typed<undefined, "ready" | "close"> implements Connector<TezosApi, unknown, unknown> {
    #private;
    provider: Provider;
    constructor(providerOptions: any, requestCoordinator: Executor);
    connect(): Promise<void>;
    format(result: any): string;
    formatError(error: any): string;
    parse(message: Buffer): any;
    handle(payload: any, _connection: HttpRequest): Promise<any>;
    close(): {};
}
//# sourceMappingURL=index.d.ts.map