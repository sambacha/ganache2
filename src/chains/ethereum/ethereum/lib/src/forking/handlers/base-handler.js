"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHandler = void 0;
const utils_1 = require("@ganache/utils");
const rate_limiter_1 = __importDefault(require("../rate-limiter/rate-limiter"));
const lru_cache_1 = __importDefault(require("lru-cache"));
const ethereum_utils_1 = require("@ganache/ethereum-utils");
const INVALID_RESPONSE = "Invalid response from fork provider: ";
const INVALID_AUTH_ERROR = "Authentication via both username/password (Basic) and JWT (Bearer) is not possible";
const WINDOW_SECONDS = 30;
class BaseHandler {
    constructor(options, abortSignal) {
        this.id = 1;
        this.requestCache = new Map();
        this.fireForget = new Set();
        const forkingOptions = options.fork;
        const { requestsPerSecond, url, userAgent, origin } = forkingOptions;
        this.abortSignal = abortSignal;
        this.limiter = new rate_limiter_1.default(
        // convert `requestsPerSecond` to "requests per window"
        requestsPerSecond * WINDOW_SECONDS, WINDOW_SECONDS * 1000, abortSignal);
        this.valueCache = new lru_cache_1.default({
            max: 1073741824,
            length: (value, key) => {
                return value.length + key.length;
            }
        });
        // we don't need header-related things if we are using a provider
        // instead of a url since we aren't in charge of sending requests at the
        // header level.
        if (url) {
            const headers = {
                "user-agent": userAgent
            };
            if (origin) {
                headers["origin"] = origin;
            }
            // we set our own Authentication headers, so username and password must be
            // removed from the url. (The values have already been copied to the options)
            url.password = url.username = "";
            const isInfura = url.host.endsWith(".infura.io");
            BaseHandler.setAuthHeaders(forkingOptions, headers);
            BaseHandler.setUserHeaders(forkingOptions, headers, !isInfura);
            this.headers = headers;
        }
    }
    setCache(cache) {
        this.persistentCache = cache;
    }
    /**
     * Adds Authorization headers from the given options to the provided `headers`
     * object. Overwrites an existing `Authorization` header value.
     *
     * @param options
     * @param headers
     */
    static setAuthHeaders(options, headers) {
        if (options.username != null || options.password != null) {
            if (options.jwt != null)
                throw new Error(INVALID_AUTH_ERROR);
            headers.authorization = `Basic ${Buffer.from(`${options.username || ""}:${options.password || ""}`).toString("base64")}`;
        }
        else if (options.jwt) {
            headers.authorization = `Bearer ${options.jwt}`;
        }
    }
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
    static setUserHeaders(options, headers, permitMultiAuth) {
        // copy the user-provided headers over to the connection's headers
        const userHeaders = options.headers;
        if (userHeaders) {
            for (let i = 0, l = userHeaders.length; i < l; i++) {
                let { name, value } = userHeaders[i];
                const key = name.toLowerCase();
                // if the user specified multiple Authentication headers (.e.g, via
                // username/password or the jwt field) we need to join them when
                // they are both of the same scheme, otherwise we throw an exception.
                if (key === "authorization" && "authorization" in headers) {
                    if (!permitMultiAuth) {
                        throw new Error(`Authentication with multiple auth-params is not allowed.`);
                    }
                    const currentScheme = headers.authorization.split(" ", 1)[0];
                    const [incomingScheme, authParams] = value.split(/\.(?:.+)/);
                    if (incomingScheme.toLowerCase() === currentScheme.toLowerCase()) {
                        headers.authorization += "," + authParams;
                    }
                    else {
                        throw new Error(`Authentication via both ${currentScheme} and ${incomingScheme} is not allowed.`);
                    }
                }
                else {
                    headers[key] = value;
                }
            }
        }
    }
    getFromMemCache(key) {
        const cachedRequest = this.requestCache.get(key);
        if (cachedRequest !== undefined)
            return cachedRequest;
        const cachedValue = this.valueCache.get(key);
        if (cachedValue !== undefined)
            return JSON.parse(cachedValue).result;
    }
    async getFromSlowCache(method, params, key) {
        if (!this.persistentCache)
            return;
        const raw = await this.persistentCache.get(method, params, key).catch(e => {
            if (e.notFound)
                return null;
            // I/O or other error, throw as things are getting weird and the cache may
            // have lost integrity
            throw e;
        });
        if (raw != null)
            return { result: JSON.parse(raw).result, raw };
    }
    async queueRequest(method, params, key, send, options = { disableCache: false }) {
        if (!options.disableCache) {
            const memCached = this.getFromMemCache(key);
            if (memCached !== undefined)
                return memCached;
            const diskCached = await this.getFromSlowCache(method, params, key);
            if (diskCached !== undefined) {
                this.valueCache.set(key, Buffer.from(diskCached.raw));
                return diskCached.result;
            }
        }
        const promise = this.limiter
            .handle(send)
            .then(async ({ response, raw }) => {
            if (this.abortSignal.aborted)
                return Promise.reject(new ethereum_utils_1.AbortError());
            if (utils_1.hasOwn(response, "result")) {
                if (!options.disableCache) {
                    // cache non-error responses only
                    this.valueCache.set(key, raw);
                    // swallow errors for the persistentCache, since it's not vital that
                    // it always works
                    if (this.persistentCache) {
                        const prom = this.persistentCache
                            .put(method, params, key, typeof raw === "string" ? Buffer.from(raw) : raw)
                            .catch(_ => {
                            // the cache.put may fail if the db is closed while a request
                            // is in flight. This is a "fire and forget" method.
                        });
                        // track these unawaited `puts`
                        this.fireForget.add(prom);
                        // clean up once complete
                        prom.finally(() => {
                            this.fireForget.delete(prom);
                        });
                    }
                }
                return response.result;
            }
            else if (utils_1.hasOwn(response, "error") && response.error != null) {
                const { error } = response;
                throw new ethereum_utils_1.CodedError(error.message, error.code);
            }
            throw new Error(`${INVALID_RESPONSE}\`${JSON.stringify(response)}\``);
        });
        this.requestCache.set(key, promise);
        return await promise;
    }
    async close() {
        await Promise.all(this.fireForget.keys());
        this.persistentCache && (await this.persistentCache.close());
    }
}
exports.BaseHandler = BaseHandler;
BaseHandler.JSONRPC_PREFIX = '{"jsonrpc":"2.0","id":';
//# sourceMappingURL=base-handler.js.map