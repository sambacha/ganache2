import { OverloadedParameters } from "../types";
/**
 * Responsible for managing global concurrent requests.
 */
export declare class RequestCoordinator {
    #private;
    /**
     * The number of concurrent requests. Set to null for no limit.
     */
    limit: number;
    /**
     * The pending requests. You can't do anything with this array.
     */
    readonly pending: ((...args: any) => Promise<any>)[];
    /**
     * The number of tasks currently being processed.
     */
    runningTasks: number;
    get paused(): boolean;
    /**
     * Promise-based FIFO queue.
     * @param limit The number of requests that can be processed at a time.
     * Default value is is no limit (`0`).
     */
    constructor(limit: number);
    /**
     * Pause processing. This will *not* cancel any promises that are currently
     * running.
     */
    pause: () => void;
    /**
     * Resume processing.
     */
    resume: () => void;
    /**
     * Insert a new function into the queue.
     */
    queue: <T extends (...args: unknown[]) => unknown>(fn: T, thisArgument: any, argumentsList: OverloadedParameters<T>) => Promise<{
        value: ReturnType<T>;
    }>;
}
//# sourceMappingURL=request-coordinator.d.ts.map