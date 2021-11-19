import { Data, Quantity } from "@ganache/utils";
import { Address } from "@ganache/ethereum-address";
import { Definitions } from "@ganache/options";
export declare type MinerConfig = {
    options: {
        /**
         * Sets the `blockTime` in seconds for automatic mining. A blockTime of `0`
         * (default) enables "instamine mode", where new executable transactions
         * will be mined instantly.
         *
         * Using the `blockTime` option is discouraged unless you have tests which
         * require a specific mining interval.
         *
         * @defaultValue 0 // "instamine mode"
         */
        blockTime: {
            type: number;
            hasDefault: true;
            legacy: {
                /**
                 * @deprecated Use miner.blockTime instead
                 */
                blockTime: number;
            };
        };
        /**
         * Sets the default gas price in WEI for transactions if not otherwise specified.
         *
         * @defaultValue 2_000_000
         */
        defaultGasPrice: {
            type: Quantity;
            rawType: string | number | bigint;
            hasDefault: true;
            legacy: {
                /**
                 * @deprecated Use miner.gasPrice instead
                 */
                gasPrice: string | number | bigint;
            };
            cliType: string;
        };
        /**
         * Sets the block difficulty
         *
         * @defaultValue 1
         */
        difficulty: {
            type: Quantity;
            rawType: string | number | bigint;
            hasDefault: true;
            cliType: string;
        };
        /**
         * Sets the block gas limit in WEI.
         *
         * @defaultValue 12_000_000
         */
        blockGasLimit: {
            type: Quantity;
            rawType: string | number | bigint;
            hasDefault: true;
            legacy: {
                /**
                 * @deprecated Use miner.blockGasLimit instead
                 */
                gasLimit: string | number | bigint;
            };
            cliType: string;
        };
        /**
         * Sets the default transaction gas limit in WEI. Set to `"estimate"` to
         * use an estimate (slows down transaction execution by 40%+).
         *
         * @defaultValue 90_000
         */
        defaultTransactionGasLimit: {
            type: Quantity;
            rawType: "estimate" | string | number | bigint;
            hasDefault: true;
            cliType: string;
        };
        /**
         * Sets the transaction gas limit in WEI for `eth_call` and
         * eth_estimateGas` calls.
         *
         * @defaultValue 9_007_199_254_740_991 // 2**53 - 1
         */
        callGasLimit: {
            type: Quantity;
            rawType: string | number | bigint;
            hasDefault: true;
            legacy: {
                /**
                 * @deprecated Use miner.callGasLimit instead
                 */
                callGasLimit: string | number | bigint;
            };
            cliType: string;
        };
        /**
         * Enables legacy instamine mode, where transactions are fully mined before
         * the transaction's hash is returned to the caller. If `legacyInstamine` is
         * `true`, `blockTime` must be `0` (default).
         *
         * @defaultValue false
         * @deprecated Will be removed in v4
         */
        legacyInstamine: {
            type: boolean;
            hasDefault: true;
            legacy: {
                /**
                 * @deprecated Use miner.legacyInstamine instead. Will be removed in v4.
                 */
                legacyInstamine: boolean;
            };
        };
        /**
         * Sets the address where mining rewards will go.
         *
         * * `{string}` hex-encoded address
         * * `{number}` index of the account returned by `eth_getAccounts`
         *
         * @defaultValue "0x0000000000000000000000000000000000000000"
         */
        coinbase: {
            rawType: string | number;
            type: Address | number;
            hasDefault: true;
        };
        /**
         * Set the extraData block header field a miner can include.
         *
         * @defaultValue ""
         */
        extraData: {
            rawType: string;
            type: Data;
            hasDefault: true;
        };
    };
};
export declare const MinerOptions: Definitions<MinerConfig>;
//# sourceMappingURL=miner-options.d.ts.map