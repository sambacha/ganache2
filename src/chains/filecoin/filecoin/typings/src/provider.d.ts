import Emittery from "emittery";
import { Executor, PromiEvent, Provider, JsonRpcRequest, KnownKeys } from "@ganache/utils";
import FilecoinApi from "./api";
import { Schema } from "@filecoin-shipyard/lotus-client-schema";
import Blockchain from "./blockchain";
import { FilecoinInternalOptions } from "@ganache/filecoin-options";
export default class FilecoinProvider<R extends JsonRpcRequest<FilecoinApi, KnownKeys<FilecoinApi>> = JsonRpcRequest<FilecoinApi, KnownKeys<FilecoinApi>>> extends Emittery.Typed<{}, "connect" | "disconnect"> implements Provider<FilecoinApi> {
    #private;
    readonly blockchain: Blockchain;
    static readonly Schema: Schema;
    constructor(options: Partial<{
        chain: Partial<{
            ipfsHost: string;
            ipfsPort: number;
            asyncRequestProcessing: boolean;
        }>;
        database: Partial<{
            db: string | object;
            dbPath?: undefined;
        }> | Partial<{
            dbPath: string;
            db?: undefined;
        }>;
        logging: Partial<{
            logger: {
                log(message?: any, ...optionalParams: any[]): void;
            };
        }>;
        miner: Partial<{
            blockTime: number;
            mine: boolean;
        }>;
        wallet: Partial<{
            deterministic: boolean;
            seed?: undefined;
            totalAccounts: number;
            defaultBalance: number;
        }> | Partial<{
            seed: string;
            deterministic?: undefined;
            totalAccounts: number;
            defaultBalance: number;
        }>;
    }> | undefined, executor: Executor);
    initialize(): Promise<void>;
    /**
     * Returns the options, including defaults and generated, used to start Ganache.
     */
    getOptions(): FilecoinInternalOptions;
    /**
     * Returns the unlocked accounts
     */
    getInitialAccounts(): Promise<Record<string, {
        unlocked: boolean;
        secretKey: string;
        balance: bigint;
    }>>;
    connect(): Promise<void>;
    send(payload: R): Promise<any>;
    _requestRaw<Method extends keyof FilecoinApi = keyof FilecoinApi>(payload: R): Promise<{
        value: PromiEvent<any>;
    } | {
        value: PromiseLike<ReturnType<FilecoinApi[Method]>>;
    }>;
    sendHttp(): Promise<void>;
    sendWs(): Promise<void>;
    sendSubscription(payload: R, schemaMethod: {
        subscription?: boolean;
    }, subscriptionCallback: (data: any) => void): Promise<(Promise<string | null> | (() => void))[]>;
    receive(): Promise<void>;
    import(): Promise<void>;
    destroy(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=provider.d.ts.map