"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderHandler = void 0;
const base_handler_1 = require("./base-handler");
class ProviderHandler extends base_handler_1.BaseHandler {
    constructor(options, abortSignal) {
        super(options, abortSignal);
        const provider = options.fork.provider;
        if (typeof provider.request === "function") {
            this._request = async (method, params) => {
                try {
                    const result = await provider.request({ method, params });
                    const response = { result };
                    return { response, raw: JSON.stringify(response) };
                }
                catch (error) {
                    // if this doesn't appear to be a JSON-RPC "coded" error it might be
                    // a network level error, or something else we don't know how to
                    // handle. Throw so stack traces are preserved.
                    if (typeof error.code !== "number")
                        throw error;
                    return {
                        response: { error },
                        raw: null
                    };
                }
            };
        }
        else if (typeof provider.send === "function") {
            // TODO: remove support for legacy providers' legacy `.send`
            console.warn("WARNING: Ganache forking only supports EIP-1193-compliant providers. Legacy support for send is currently enabled, but will be removed in a future version _without_ a breaking change. To remove this warning, switch to an EIP-1193 provider. This error is probably caused by an old version of Web3's HttpProvider (or ganache < v7)");
            this._request = async (method, params) => {
                return await new Promise((resolve, reject) => {
                    const request = {
                        id: this.id++,
                        jsonrpc: "2.0",
                        method,
                        params
                    };
                    provider.send(request, (err, response) => {
                        if (err)
                            return void reject(err);
                        resolve({
                            response,
                            raw: JSON.stringify(response)
                        });
                    });
                });
            };
        }
        else {
            throw new Error("Forking `provider` must be EIP-1193 compatible");
        }
    }
    async request(method, params, options = { disableCache: false }) {
        // format params via JSON stringification because the params might
        // be Quantity or Data, which aren't valid as `params` themselves,
        // but when JSON stringified they are
        const strParams = JSON.stringify(params);
        return await this.queueRequest(method, params, `${method}:${strParams}`, () => this._request(method, JSON.parse(strParams)), options);
    }
}
exports.ProviderHandler = ProviderHandler;
//# sourceMappingURL=provider-handler.js.map