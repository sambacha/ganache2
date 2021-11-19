"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _abortController, _handler, _options, _accounts, _hardfork, _setCommonFromChain, _setBlockDataFromChainAndOptions, _syncAccounts;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fork = void 0;
const utils_1 = require("@ganache/utils");
const abort_controller_1 = __importDefault(require("abort-controller"));
const common_1 = __importDefault(require("@ethereumjs/common"));
const http_handler_1 = require("./handlers/http-handler");
const ws_handler_1 = require("./handlers/ws-handler");
const ethereum_utils_1 = require("@ganache/ethereum-utils");
const ethereum_block_1 = require("@ganache/ethereum-block");
const block_manager_1 = __importDefault(require("../data-managers/block-manager"));
const provider_handler_1 = require("./handlers/provider-handler");
const persistent_cache_1 = require("./persistent-cache/persistent-cache");
async function fetchChainId(fork) {
    const chainIdHex = await fork.request("eth_chainId", []);
    return parseInt(chainIdHex, 16);
}
async function fetchNetworkId(fork) {
    const networkIdStr = await fork.request("net_version", []);
    return parseInt(networkIdStr, 10);
}
function fetchBlockNumber(fork) {
    // {disableCache: true} required so we never cache the blockNumber, as forking
    // shouldn't ever cache a method that can change!
    return fork.request("eth_blockNumber", [], { disableCache: true });
}
function fetchBlock(fork, blockNumber) {
    return fork.request("eth_getBlockByNumber", [blockNumber, true]);
}
async function fetchNonce(fork, address, blockNumber) {
    const nonce = await fork.request("eth_getTransactionCount", [
        address,
        blockNumber
    ]);
    return utils_1.Quantity.from(nonce);
}
class Fork {
    constructor(options, accounts) {
        _abortController.set(this, new abort_controller_1.default());
        _handler.set(this, void 0);
        _options.set(this, void 0);
        _accounts.set(this, void 0);
        _hardfork.set(this, void 0);
        _setCommonFromChain.set(this, async (chainIdPromise) => {
            const [chainId, networkId] = await Promise.all([
                chainIdPromise,
                fetchNetworkId(this)
            ]);
            this.common = common_1.default.forCustomChain(utils_1.KNOWN_CHAINIDS.has(chainId) ? chainId : 1, {
                name: "ganache-fork",
                defaultHardfork: __classPrivateFieldGet(this, _hardfork),
                networkId,
                chainId,
                comment: "Local test network fork"
            });
            this.common.on = () => { };
        });
        _setBlockDataFromChainAndOptions.set(this, async (chainIdPromise) => {
            const options = __classPrivateFieldGet(this, _options);
            if (options.blockNumber === ethereum_utils_1.Tag.LATEST) {
                const [latestBlock, chainId] = await Promise.all([
                    fetchBlock(this, ethereum_utils_1.Tag.LATEST),
                    chainIdPromise
                ]);
                let blockNumber = parseInt(latestBlock.number, 16);
                const effectiveBlockNumber = utils_1.KNOWN_CHAINIDS.has(chainId)
                    ? Math.max(blockNumber - options.preLatestConfirmations, 0)
                    : blockNumber;
                let block;
                if (effectiveBlockNumber !== blockNumber) {
                    block = await fetchBlock(this, utils_1.Quantity.from(effectiveBlockNumber));
                }
                else {
                    block = latestBlock;
                }
                options.blockNumber = effectiveBlockNumber;
                this.blockNumber = utils_1.Quantity.from(effectiveBlockNumber);
                this.stateRoot = utils_1.Data.from(block.stateRoot);
                await __classPrivateFieldGet(this, _syncAccounts).call(this, this.blockNumber);
                return block;
            }
            else if (typeof options.blockNumber === "number") {
                const blockNumber = utils_1.Quantity.from(options.blockNumber);
                const [block] = await Promise.all([
                    fetchBlock(this, blockNumber).then(async (block) => {
                        this.stateRoot = block.stateRoot;
                        await __classPrivateFieldGet(this, _syncAccounts).call(this, blockNumber);
                        return block;
                    }),
                    fetchBlockNumber(this).then((latestBlockNumberHex) => {
                        const latestBlockNumberInt = parseInt(latestBlockNumberHex, 16);
                        // if our block number option is _after_ the current block number
                        // throw, as it likely wasn't intentional and doesn't make sense.
                        if (options.blockNumber > latestBlockNumberInt) {
                            throw new Error(`\`fork.blockNumber\` (${options.blockNumber}) must not be greater than the current block number (${latestBlockNumberInt})`);
                        }
                        else {
                            this.blockNumber = blockNumber;
                        }
                    })
                ]);
                return block;
            }
            else {
                throw new Error(`Invalid value for \`fork.blockNumber\` option: "${options.blockNumber}". Must be a positive integer or the string "latest".`);
            }
        });
        _syncAccounts.set(this, (blockNumber) => {
            return Promise.all(__classPrivateFieldGet(this, _accounts).map(async (account) => {
                const nonce = await fetchNonce(this, account.address, blockNumber);
                account.nonce = nonce;
            }));
        });
        const forkingOptions = (__classPrivateFieldSet(this, _options, options.fork));
        __classPrivateFieldSet(this, _hardfork, options.chain.hardfork);
        __classPrivateFieldSet(this, _accounts, accounts);
        const { url } = forkingOptions;
        if (url) {
            const { protocol } = url;
            switch (protocol) {
                case "ws:":
                case "wss:":
                    __classPrivateFieldSet(this, _handler, new ws_handler_1.WsHandler(options, __classPrivateFieldGet(this, _abortController).signal));
                    break;
                case "http:":
                case "https:":
                    __classPrivateFieldSet(this, _handler, new http_handler_1.HttpHandler(options, __classPrivateFieldGet(this, _abortController).signal));
                    break;
                default: {
                    throw new Error(`Unsupported protocol: ${protocol}`);
                }
            }
        }
        else if (forkingOptions.provider) {
            __classPrivateFieldSet(this, _handler, new provider_handler_1.ProviderHandler(options, __classPrivateFieldGet(this, _abortController).signal));
        }
    }
    async initialize() {
        let cacheProm;
        const options = __classPrivateFieldGet(this, _options);
        if (options.deleteCache)
            await persistent_cache_1.PersistentCache.deleteDb();
        if (options.disableCache === false) {
            // ignore cache start up errors as it is possible there is an `open`
            // conflict if another ganache fork is running at the time this one is
            // started. The cache isn't required (though performance will be
            // degraded without it)
            cacheProm = persistent_cache_1.PersistentCache.create().catch(_e => null);
        }
        else {
            cacheProm = null;
        }
        const chainIdPromise = fetchChainId(this);
        const [block, cache] = await Promise.all([
            __classPrivateFieldGet(this, _setBlockDataFromChainAndOptions).call(this, chainIdPromise),
            cacheProm,
            __classPrivateFieldGet(this, _setCommonFromChain).call(this, chainIdPromise)
        ]);
        this.block = new ethereum_block_1.Block(block_manager_1.default.rawFromJSON(block, this.common), this.common);
        if (cache)
            await this.initCache(cache);
    }
    async initCache(cache) {
        await cache.initialize(this.block.header.number, this.block.hash(), this.request.bind(this));
        __classPrivateFieldGet(this, _handler).setCache(cache);
    }
    request(method, params, options = { disableCache: false }) {
        return __classPrivateFieldGet(this, _handler).request(method, params, options);
    }
    abort() {
        return __classPrivateFieldGet(this, _abortController).abort();
    }
    close() {
        return __classPrivateFieldGet(this, _handler).close();
    }
    isValidForkBlockNumber(blockNumber) {
        return blockNumber.toBigInt() <= this.blockNumber.toBigInt();
    }
    selectValidForkBlockNumber(blockNumber) {
        return this.isValidForkBlockNumber(blockNumber)
            ? blockNumber
            : this.blockNumber;
    }
}
exports.Fork = Fork;
_abortController = new WeakMap(), _handler = new WeakMap(), _options = new WeakMap(), _accounts = new WeakMap(), _hardfork = new WeakMap(), _setCommonFromChain = new WeakMap(), _setBlockDataFromChainAndOptions = new WeakMap(), _syncAccounts = new WeakMap();
//# sourceMappingURL=fork.js.map