import { Definitions } from "@ganache/options";
export declare type ChainConfig = {
    options: {
        /**
         * The IPFS simulator host name/address to listen on.
         *
         * @defaultValue "127.0.0.1"
         */
        readonly ipfsHost: {
            type: string;
            hasDefault: true;
        };
        /**
         * The IPFS simulator port.
         *
         * @defaultValue 5001
         */
        readonly ipfsPort: {
            type: number;
            hasDefault: true;
        };
        /**
         * When set to `false` only one request will be processed at a time.
         *
         * @defaultValue true
         */
        readonly asyncRequestProcessing: {
            type: boolean;
            hasDefault: true;
        };
    };
};
export declare const ChainOptions: Definitions<ChainConfig>;
//# sourceMappingURL=chain-options.d.ts.map