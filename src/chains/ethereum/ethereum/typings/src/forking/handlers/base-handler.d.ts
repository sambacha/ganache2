/// <reference types="node" />
import { EthereumInternalOptions } from "@ganache/ethereum-options";
import { AbortSignal } from "abort-controller";
import { OutgoingHttpHeaders } from "http";
import RateLimiter from "../rate-limiter/rate-limiter";
import LRU from "lru-cache";
import { PersistentCache } from "../persistent-cache/persistent-cache";
declare type Headers = OutgoingHttpHeaders & {
    authorization?: string;
};
export declare class BaseHandler {
    static JSONRPC_PREFIX: "{\"jsonrpc\":\"2.0\",\"id\":";
    protected id: number;
    protected requestCache: Map<string, Promise<unknown>>;
    protected valueCache: LRU<string, string | Buffer>;
    protected limiter: RateLimiter;
    protected headers: Headers;
    protected abortSignal: AbortSignal;
    private persistentCache;
    constructor(options: EthereumInternalOptions, abortSignal: AbortSignal);
    setCache(cache: PersistentCache): void;
    /**
     * Adds Authorization headers from the given options to the provided `headers`
     * object. Overwrites an existing `Authorization` header value.
     *
     * @param options
     * @param headers
     */
    static setAuthHeaders(options: EthereumInternalOptions["fork"], headers: Headers): void;
    /**
     * Adds user provided headers to the provided `headers`
     * object.
     *
     * If the headers already contain an existing `Authorization` header
     * value and the incoming values have compatible schemes
     * (Bearer===Bearer, Basic===Basic) the values are merged. Note: if the
     * `permitMultiAuth` option is `false` Bearer tokens can not be merged.
     *
     * @param options
     * @param headers
     * @param permitMultiAuth
     */
    static setUserHeaders(options: EthereumInternalOptions["fork"], headers: Headers, permitMultiAuth: boolean): void;
    getFromMemCache<T>(key: string): T | Promise<T>;
    getFromSlowCache<T>(method: string, params: any[], key: string): Promise<{
        result: T;
        raw: any;
    }>;
    queueRequest<T>(method: string, params: any[], key: string, send: (...args: unknown[]) => Promise<{
        response: {
            result: any;
        } | {
            error: {
                message: string;
                code: number;
            };
        };
        raw: string | Buffer;
    }>, options?: {
        disableCache: boolean;
    }): Promise<T>;
    private fireForget;
    close(): Promise<void>;
}
export {};
//# sourceMappingURL=base-handler.d.ts.map