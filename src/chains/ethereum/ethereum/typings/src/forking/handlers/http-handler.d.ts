import { EthereumInternalOptions } from "@ganache/ethereum-options";
import { AbortSignal } from "abort-controller";
import { BaseHandler } from "./base-handler";
import { Handler } from "../types";
export declare class HttpHandler extends BaseHandler implements Handler {
    private agent;
    private url;
    private _request;
    constructor(options: EthereumInternalOptions, abortSignal: AbortSignal);
    private handleLengthedResponse;
    private handleChunkedResponse;
    request<T>(method: string, params: unknown[], options?: {
        disableCache: boolean;
    }): Promise<T>;
}
//# sourceMappingURL=http-handler.d.ts.map