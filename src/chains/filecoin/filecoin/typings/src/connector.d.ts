/// <reference types="node" />
import Emittery from "emittery";
import FilecoinApi from "./api";
import { Executor, Connector as IConnector, JsonRpcRequest, JsonRpcResponse, KnownKeys } from "@ganache/utils";
import FilecoinProvider from "./provider";
import { RecognizedString, HttpRequest, WebSocket } from "@trufflesuite/uws-js-unofficial";
export { StorageDealStatus } from "./types/storage-deal-status";
export declare type Provider = FilecoinProvider;
export declare const Provider: typeof FilecoinProvider;
export declare class Connector<R extends JsonRpcRequest<FilecoinApi, KnownKeys<FilecoinApi>> = JsonRpcRequest<FilecoinApi, KnownKeys<FilecoinApi>>> extends Emittery.Typed<{}, "ready" | "close"> implements IConnector<FilecoinApi, R, JsonRpcResponse> {
    #private;
    get provider(): FilecoinProvider<JsonRpcRequest<FilecoinApi, import("./types/subscriptions").SubscriptionMethod.ChannelClosed | "initialize" | "stop" | "Filecoin.Version" | "Filecoin.ID" | "Filecoin.ChainGetGenesis" | "Filecoin.ChainHead" | "Filecoin.ChainNotify" | "Filecoin.ChainGetTipSet" | "Filecoin.ChainGetTipSetByHeight" | "Filecoin.ChainGetBlock" | "Filecoin.ChainGetBlockMessages" | "Filecoin.ChainGetMessage" | "Filecoin.MpoolGetNonce" | "Filecoin.MpoolPush" | "Filecoin.MpoolBatchPush" | "Filecoin.MpoolPushMessage" | "Filecoin.MpoolBatchPushMessage" | "Filecoin.MpoolClear" | "Filecoin.MpoolPending" | "Filecoin.MpoolSelect" | "Filecoin.ActorAddress" | "Filecoin.StateListMiners" | "Filecoin.StateMinerPower" | "Filecoin.StateMinerInfo" | "Filecoin.WalletDefaultAddress" | "Filecoin.WalletSetDefault" | "Filecoin.WalletBalance" | "Filecoin.WalletNew" | "Filecoin.WalletList" | "Filecoin.WalletHas" | "Filecoin.WalletDelete" | "Filecoin.WalletExport" | "Filecoin.WalletImport" | "Filecoin.WalletSign" | "Filecoin.WalletSignMessage" | "Filecoin.WalletVerify" | "Filecoin.WalletValidateAddress" | "Filecoin.ClientStartDeal" | "Filecoin.ClientListDeals" | "Filecoin.ClientGetDealInfo" | "Filecoin.ClientGetDealStatus" | "Filecoin.ClientGetDealUpdates" | "Filecoin.ClientFindData" | "Filecoin.ClientHasLocal" | "Filecoin.ClientRetrieve" | "Ganache.MineTipset" | "Ganache.EnableMiner" | "Ganache.DisableMiner" | "Ganache.MinerEnabled" | "Ganache.MinerEnabledNotify" | "Ganache.GetDealById">>;
    constructor(providerOptions: Partial<{
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
    connect(): Promise<void>;
    parse(message: Buffer): R;
    handle(payload: R, _connection: HttpRequest | WebSocket): Promise<any>;
    format(result: any, payload: R): RecognizedString;
    formatError(error: Error & {
        code: number;
    }, payload: R): RecognizedString;
    close(): Promise<void>;
}
//# sourceMappingURL=connector.d.ts.map