/// <reference types="node" />
import { Definitions } from "@ganache/options";
import { Tag } from "@ganache/ethereum-utils";
import { URL } from "url";
declare type HeaderRecord = {
    name: string;
    value: string;
};
declare type ForkUrl = URL & {
    _blockNumber?: number | Tag.LATEST;
};
export declare type ForkConfig = {
    options: {
        /**
         * Fork from another currently running Ethereum client. Input should be the
         * URL of the node, e.g. http://localhost:8545. You can optionally specify
         * the block to fork from using an @ sign: http://localhost:8545@1599200
         *
         * You can specify Basic Authentication credentials in the URL as well. e.g.,
         * wss://user:password@example.com/. If you need to use an Infura Project
         * Secret, you would use it like this: wss://:{YOUR-PROJECT-SECRET}@mainnet.infura.com/...
         *
         * Alternatively, you can use the `fork.username` and `fork.password` options.
         */
        url: {
            type: ForkUrl;
            rawType: string;
            legacy: {
                /**
                 * @deprecated Use fork.url instead
                 */
                fork: string | object;
            };
        };
        /**
         * Specify an EIP-1193 provider to use instead of a url.
         */
        provider: {
            type: {
                request: (args: {
                    readonly method: string;
                    readonly params?: readonly unknown[] | object;
                }) => Promise<unknown>;
            };
            legacy: {
                /**
                 * @deprecated Use fork.provider instead
                 */
                fork: {
                    readonly method: string;
                    readonly params?: readonly unknown[] | object;
                };
            };
        };
        /**
         * Block number the provider should fork from.
         */
        blockNumber: {
            type: number | Tag.LATEST;
            hasDefault: true;
            legacy: {
                /**
                 * @deprecated Use fork.blockNumber instead
                 */
                fork_block_number: number | Tag.LATEST;
            };
        };
        /**
         * When the `fork.blockNumber` is set to "latest" (default), the number of
         * blocks before the remote node's "latest" block to fork from.
         */
        preLatestConfirmations: {
            type: number;
            hasDefault: true;
        };
        /**
         * Username to use for Basic Authentication. Does not require setting `fork.password`.
         *
         * When combined with `fork.password`, is shorthand for `fork: { headers: { "Authorization": "Basic {ENCODED-BASIC-HEADER}" } }`
         *
         * If the `fork.headers` option specifies an "Authorization" header, it will be be inserted _after_ this Basic token.
         */
        username: {
            type: string;
            hasDefault: true;
        };
        /**
         * Password to use for Basic Authentication. Does not require setting `fork.username`.
         *
         * When combined with `fork.username`, is shorthand for `fork: { headers: { "Authorization": "Basic {ENCODED-BASIC-HEADER}" } }`
         *
         * If the `fork.headers` option specifies an "Authorization" header, it will be be inserted _after_ this Basic token.
         */
        password: {
            type: string;
            hasDefault: true;
        };
        /**
         * _Encoded_ JSON Web Token (JWT) used for authenticating to some servers.
         *
         * Shorthand for `fork: { headers: { "Authorization": "Bearer {YOUR-ENCODED-JWT}" } }`
         *
         * If the `fork.headers` option specifies an "Authorization" header, it will be be inserted _after_ the JWT Bearer token.
         */
        jwt: {
            type: string;
        };
        /**
         * The User-Agent header sent to the fork on each request.
         *
         * Sent as Api-User-Agent when used in the browser.
         *
         * Will be overridden by a `"User-Agent"` value defined in the `fork.headers` option, if provided.
         *
         * @default "Ganache/VERSION (https://www.trufflesuite.com/ganache; ganache???trufflesuite.com) ???ganache/ethereum/VERSION"
         */
        userAgent: {
            type: string;
            hasDefault: true;
        };
        /**
         * The Origin header sent to the fork on each request.
         *
         * Ignored in the browser.
         *
         * Will be overridden by an `"Origin"` value defined in the `fork.headers` option, if provided.
         */
        origin: {
            type: string;
        };
        /**
         * Headers to supply on each request to the forked provider.
         *
         * Headers set here override headers set by other options, unless otherwise specified.
         *
         * @default
         * ```json
         * [{
         *   "name": "User-Agent",
         *   "value": "Ganache/VERSION (https://www.trufflesuite.com/ganache; ganache<at>trufflesuite.com)"
         * }]
         * ```
         */
        headers: {
            type: HeaderRecord[];
            cliType: string[];
        };
        /**
         * Limit the number of requests per second sent to the fork provider. `0` means no limit is applied.
         *
         * @default 0
         */
        requestsPerSecond: {
            type: number;
            hasDefault: true;
        };
        /**
         * Disables caching of all forking requests.
         *
         * @default false
         */
        disableCache: {
            type: boolean;
            hasDefault: true;
        };
        /**
         * Deletes the persistent cache on start up.
         *
         * @default false
         */
        deleteCache: {
            type: boolean;
            hasDefault: true;
        };
    };
};
export declare const ForkOptions: Definitions<ForkConfig>;
export {};
//# sourceMappingURL=fork-options.d.ts.map