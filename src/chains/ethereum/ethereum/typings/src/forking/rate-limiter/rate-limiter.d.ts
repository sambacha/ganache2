import { AbortSignal } from "abort-controller";
declare type PromiseFn<T> = (...args: unknown[]) => Promise<{
    response: {
        result: any;
    } | {
        error: {
            message: string;
            code: number;
        };
    };
    raw: T;
}>;
/**
 * A sliding window rate limiter.
 *
 * Rate estimation from
 * https://blog.cloudflare.com/counting-things-a-lot-of-different-things/
 *
 * Let's say we set a limit of 50 requests per minute. The counter can be
 * thought of like this:
 *
 * ```ascii
 *         ╔══════════════════════════════════╗
 *         ║   sampling period: 60 seconds    ║
 * ╭───────╫────────────────────────┬─────────╫──────────────────────╮
 * │       ║previous minute         │         current minute         │
 * │       ║  42 requests           │         ║18 requests           │
 * ╰───────╫────────────────────────┼─────────╫──────────────────────╯
 *         ║         45 secs        │ 15 secs ║
 *         ╚════════════════════════╧═════════╝
 * ```
 *
 * In this situation, we did 18 requests during the current minute, which
 * started 15 seconds ago, and 42 requests during the entire previous minute.
 * Based on this information, the rate approximation is calculated like this:
 *
 * ```javascript
 * rate = (42 * (45 / 60)) + 18
 *      = (42 * 0.75) + 18
 *      = 49.5 // requests
 *
 *      = 59.5 // requests
 * ```
 *
 * One more request during the next second and the rate limiter will kick in.
 *
 * This algorithm assumes a constant rate of requests during the previous
 * sampling period (which can be any time span), so the result is only
 * an approximation of the actual rate, but it is quick to calculate and
 * lightweight.
 */
export default class RateLimiter {
    private requestLimit;
    private windowSizeMs;
    private limitCounter;
    private abortSignal;
    private sem;
    private take;
    constructor(requestLimit: number, windowSizeMs: number, abortSignal: AbortSignal);
    /**
     * @param now
     * @param currentWindow
     * @returns the current request rate and the allowed execution time of the
     * next request
     */
    status(now: number, currentWindow: number): {
        rate: number;
        next: number;
    };
    /**
     * Executes the given fn within the confines of the configured rate limit. If
     * the function's return value is a JSON-RPC LIMIT_EXCEEDED error, it will
     * automatically retry with the given `backoff_seconds`
     * @param fn
     */
    handle<T>(fn: PromiseFn<T>): Promise<{
        response: {
            result: any;
        } | {
            error: {
                message: string;
                code: number;
            };
        };
        raw: T;
    }>;
    mustBackoff: Promise<void> | null;
    counter: number;
    private schedule;
}
export {};
//# sourceMappingURL=rate-limiter.d.ts.map