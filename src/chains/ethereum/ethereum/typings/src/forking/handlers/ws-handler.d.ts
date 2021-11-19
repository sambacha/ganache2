import { EthereumInternalOptions } from "@ganache/ethereum-options";
import { AbortSignal } from "abort-controller";
import WebSocket from "ws";
import { Handler } from "../types";
import { BaseHandler } from "./base-handler";
export declare class WsHandler extends BaseHandler implements Handler {
    private open;
    private connection;
    private inFlightRequests;
    constructor(options: EthereumInternalOptions, abortSignal: AbortSignal);
    request<T>(method: string, params: unknown[], options?: {
        disableCache: boolean;
    }): Promise<T>;
    onMessage(event: WebSocket.MessageEvent): void;
    private connect;
    close(): Promise<void>;
}
//# sourceMappingURL=ws-handler.d.ts.map