import { EthereumInternalOptions } from "@ganache/ethereum-options";
import { BaseHandler } from "./base-handler";
import { Handler } from "../types";
import { AbortSignal } from "abort-controller";
export declare class ProviderHandler extends BaseHandler implements Handler {
    private _request;
    constructor(options: EthereumInternalOptions, abortSignal: AbortSignal);
    request<T>(method: string, params: unknown[], options?: {
        disableCache: boolean;
    }): Promise<T>;
}
//# sourceMappingURL=provider-handler.d.ts.map