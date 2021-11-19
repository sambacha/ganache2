import Emittery from "emittery";
import EthereumApi from "./api";
import { Executor, KnownKeys, Provider, JsonRpcRequest, JsonRpcResponse, JsonRpcError, Quantity, Data, OverloadedParameters } from "@ganache/utils";
import { EthereumProviderOptions, EthereumInternalOptions, EthereumLegacyProviderOptions } from "@ganache/ethereum-options";
import { ITraceData } from "@ganache/ethereum-utils";
import { DataEvent, VmAfterTransactionEvent, VmBeforeTransactionEvent, VmStepEvent } from "./provider-events";
declare type RequestMethods = KnownKeys<EthereumApi>;
declare type Primitives = string | number | null | undefined | symbol | bigint;
declare type Clean<X> = X extends Primitives ? X : X extends Quantity | Data | ITraceData ? string : {
    [N in keyof X]: Clean<X[N]>;
};
declare type cleanAndMergePromiseGenerics<Type> = Promise<Type extends Promise<infer X> ? Clean<X> : never>;
interface Callback {
    (err?: Error, response?: JsonRpcResponse | JsonRpcError): void;
}
interface BatchedCallback {
    (err?: Error, response?: (JsonRpcResponse | JsonRpcError)[]): void;
}
declare type RequestParams<Method extends RequestMethods> = {
    readonly method: Method;
    readonly params: OverloadedParameters<EthereumApi[Method]> | undefined;
};
export default class EthereumProvider extends Emittery.Typed<{
    message: MessageEvent;
    data: DataEvent;
    error: Error;
    "ganache:vm:tx:step": VmStepEvent;
    "ganache:vm:tx:before": VmBeforeTransactionEvent;
    "ganache:vm:tx:after": VmAfterTransactionEvent;
}, "connect" | "disconnect"> implements Provider<EthereumApi> {
    #private;
    constructor(options: EthereumProviderOptions | EthereumLegacyProviderOptions, executor: Executor);
    initialize(): Promise<void>;
    /**
     * Returns the options, including defaults and generated, used to start Ganache.
     */
    getOptions(): EthereumInternalOptions;
    /**
     * Returns the unlocked accounts
     */
    getInitialAccounts(): Record<string, {
        unlocked: boolean;
        secretKey: string;
        balance: bigint;
    }>;
    /**
     * Remove an event subscription
     */
    removeListener: {
        <Name extends "ganache:vm:tx:step" | "ganache:vm:tx:before" | "ganache:vm:tx:after" | "data" | "error" | "message">(eventName: Name, listener: (eventData: {
            message: MessageEvent;
            data: DataEvent;
            error: Error;
            "ganache:vm:tx:step": VmStepEvent;
            "ganache:vm:tx:before": VmBeforeTransactionEvent;
            "ganache:vm:tx:after": VmAfterTransactionEvent;
        }[Name]) => void): void;
        <Name_1 extends "connect" | "disconnect">(eventName: Name_1, listener: () => void): void;
    };
    /**
     * @param method - the params
     * @param params - the params
     * @ignore Non standard! Do not use.
     */
    send<Method extends RequestMethods>(method: Method, params?: OverloadedParameters<EthereumApi[typeof method]>): cleanAndMergePromiseGenerics<ReturnType<EthereumApi[typeof method]>>;
    /**
     * @param payload - payload
     * @param callback - callback
     * @deprecated Use the `request` method
     */
    send<Method extends KnownKeys<EthereumApi>>(payload: JsonRpcRequest<EthereumApi, Method>, callback?: Callback): undefined;
    /**
     * Legacy callback style API
     * @param payloads - JSON-RPC payload
     * @param callback - callback
     * @deprecated Batch transactions have been deprecated. Send payloads
     * individually via the `request` method.
     */
    send<Method extends KnownKeys<EthereumApi>>(payloads: JsonRpcRequest<EthereumApi, Method>[], callback?: BatchedCallback): undefined;
    /**
     * Legacy callback style API
     * @param payload - JSON-RPC payload
     * @param callback - callback
     * @deprecated Use the `request` method.
     */
    /**
     * @param payload - payload
     * @param callback - callback
     * @deprecated Use the `request` method
     */
    sendAsync<Method extends KnownKeys<EthereumApi>>(payload: JsonRpcRequest<EthereumApi, Method>, callback?: Callback): undefined;
    /**
     * Legacy callback style API
     * @param payloads - JSON-RPC payload
     * @param callback - callback
     * @deprecated Batch transactions have been deprecated. Send payloads
     * individually via the `request` method.
     */
    sendAsync<Method extends KnownKeys<EthereumApi>>(payloads: JsonRpcRequest<EthereumApi, Method>[], callback?: BatchedCallback): undefined;
    /**
     * EIP-1193 style request method
     * @param args - the args
     * @returns A Promise that resolves with the method's result or rejects with a CodedError
     * @EIP [1193](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md)
     */
    request<Method extends RequestMethods>(args: RequestParams<Method>): cleanAndMergePromiseGenerics<ReturnType<EthereumApi[Method]>>;
    /**
     * INTERNAL. Used when the caller wants to access the original `PromiEvent`,
     * which would otherwise be flattened into a regular Promise through the
     * Promise chain.
     * @param request - the request
     */
    _requestRaw<Method extends RequestMethods>({ method, params }: RequestParams<Method>): Promise<{
        value: Promise<ReturnType<EthereumApi[Method]> extends Promise<infer X> ? Clean<X> : never>;
    }>;
    disconnect: () => Promise<void>;
}
export {};
//# sourceMappingURL=provider.d.ts.map