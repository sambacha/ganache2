"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsHandler = void 0;
const ethereum_utils_1 = require("@ganache/ethereum-utils");
const ws_1 = __importDefault(require("ws"));
const base_handler_1 = require("./base-handler");
const deferred_1 = __importDefault(require("../deferred"));
const { JSONRPC_PREFIX } = base_handler_1.BaseHandler;
class WsHandler extends base_handler_1.BaseHandler {
    constructor(options, abortSignal) {
        super(options, abortSignal);
        this.inFlightRequests = new Map();
        const { url, origin } = options.fork;
        this.connection = new ws_1.default(url.toString(), {
            origin,
            headers: this.headers
        });
        // `nodebuffer` is already the default, but I just wanted to be explicit
        // here because when `nodebuffer` is the binaryType the `message` event's
        // data type is guaranteed to be a `Buffer`. We don't need to check for
        // different types of data.
        // I mention all this because if `arraybuffer` or `fragment` is used for the
        // binaryType the `"message"` event's `data` may end up being
        // `ArrayBuffer | Buffer`, or `Buffer[] | Buffer`, respectively.
        // If you need to change this, you probably need to change our `onMessage`
        // handler too.
        this.connection.binaryType = "nodebuffer";
        this.open = this.connect(this.connection);
        this.connection.onclose = () => {
            // try to connect again...
            // TODO: backoff and eventually fail
            this.open = this.connect(this.connection);
        };
        this.abortSignal.addEventListener("abort", () => {
            this.connection.onclose = null;
            this.connection.close(1000);
        });
        this.connection.onmessage = this.onMessage.bind(this);
    }
    async request(method, params, options = { disableCache: false }) {
        await this.open;
        if (this.abortSignal.aborted)
            return Promise.reject(new ethereum_utils_1.AbortError());
        const key = JSON.stringify({ method, params });
        const send = () => {
            if (this.abortSignal.aborted)
                return Promise.reject(new ethereum_utils_1.AbortError());
            const messageId = this.id++;
            const deferred = deferred_1.default();
            // TODO: timeout an in-flight request after some amount of time
            this.inFlightRequests.set(messageId, deferred);
            this.connection.send(`${JSONRPC_PREFIX}${messageId},${key.slice(1)}`);
            return deferred.promise.finally(() => this.requestCache.delete(key));
        };
        return await this.queueRequest(method, params, key, send, options);
    }
    onMessage(event) {
        if (event.type !== "message")
            return;
        // data is always a `Buffer` because the websocket's binaryType is set to
        // `nodebuffer`
        const raw = event.data;
        // TODO: handle invalid JSON (throws on parse)?
        const response = JSON.parse(raw);
        const id = response.id;
        const prom = this.inFlightRequests.get(id);
        if (prom) {
            this.inFlightRequests.delete(id);
            prom.resolve({ response, raw: raw });
        }
    }
    connect(connection) {
        let open = new Promise((resolve, reject) => {
            connection.onopen = resolve;
            connection.onerror = reject;
        });
        open.then(() => {
            connection.onopen = null;
            connection.onerror = null;
        }, err => {
            console.log(err);
        });
        return open;
    }
    async close() {
        await super.close();
        this.connection.close();
    }
}
exports.WsHandler = WsHandler;
//# sourceMappingURL=ws-handler.js.map