import { Definitions } from "@ganache/options";
export declare type LoggingConfig = {
    options: {
        /**
         * An object, like `console`, that implements a `log` function.
         *
         * Defaults to `console` (logs to stdout).
         *
         * @example
         * ```typescript
         * {
         * 	log: (message: any) => {
         * 		// handle `message`
         * 	}
         * }
         * ```
         */
        readonly logger: {
            type: {
                log(message?: any, ...optionalParams: any[]): void;
            };
            hasDefault: true;
        };
    };
};
export declare const LoggingOptions: Definitions<LoggingConfig>;
//# sourceMappingURL=logging-options.d.ts.map