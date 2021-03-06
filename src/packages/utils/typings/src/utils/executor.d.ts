import { KnownKeys, Api, OverloadedParameters } from "../types";
import { RequestCoordinator } from "./request-coordinator";
export declare class Executor {
    #private;
    /**
     * The Executor handles execution of methods on the given API
     */
    constructor(requestCoordinator: RequestCoordinator);
    /**
     * Executes the method with the given methodName on the API
     * @param methodName The name of the JSON-RPC method to execute.
     * @param params The params to pass to the JSON-RPC method.
     */
    execute<T extends Api, M extends KnownKeys<T>>(api: T, methodName: M, params: OverloadedParameters<T[M]>): Promise<{
        value: ReturnType<T[M]>;
    }>;
}
//# sourceMappingURL=executor.d.ts.map