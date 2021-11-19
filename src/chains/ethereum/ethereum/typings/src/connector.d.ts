/// <reference types="node" />
import Emittery from "emittery";
import EthereumApi from "./api";
import { Connector as IConnector, Executor, JsonRpcRequest, JsonRpcResponse, KnownKeys } from "@ganache/utils";
import EthereumProvider from "./provider";
import { RecognizedString, WebSocket, HttpRequest } from "@trufflesuite/uws-js-unofficial";
import { EthereumProviderOptions, EthereumLegacyProviderOptions } from "@ganache/ethereum-options";
declare type ProviderOptions = EthereumProviderOptions | EthereumLegacyProviderOptions;
export declare type Provider = EthereumProvider;
export declare const Provider: typeof EthereumProvider;
export declare class Connector<R extends JsonRpcRequest<EthereumApi, KnownKeys<EthereumApi>> = JsonRpcRequest<EthereumApi, KnownKeys<EthereumApi>>> extends Emittery.Typed<undefined, "ready" | "close"> implements IConnector<EthereumApi, R | R[], JsonRpcResponse> {
    #private;
    static BUFFERIFY_THRESHOLD: number;
    get provider(): EthereumProvider;
    constructor(providerOptions: ProviderOptions, executor: Executor);
    BUFFERIFY_THRESHOLD: number;
    connect(): Promise<void>;
    parse(message: Buffer): R;
    handle(payload: R | R[], connection: HttpRequest | WebSocket): Promise<{
        value: Promise<string | number | boolean | any[] | [] | string[] | [string, string, string] | {
            address: string;
            blockHash: string;
            blockNumber: string;
            data: string | string[];
            logIndex: string;
            removed: boolean;
            topics: string | string[];
            transactionHash: string;
            transactionIndex: string;
        }[] | {
            gas: number;
            structLogs: {
                depth: number;
                error: string;
                gas: number;
                gasCost: number;
                memory: string[];
                op: string;
                pc: number;
                stack: string[];
                storage: {
                    toJSON: {};
                    clear: {};
                    delete: {};
                    forEach: {};
                    get: {};
                    has: {};
                    set: {};
                    readonly size: number;
                    entries: {};
                    keys: {};
                    values: {};
                };
            }[];
            returnValue: string;
            storage: {
                [x: string]: {
                    key: string;
                    value: string;
                };
            };
        } | {
            nextKey: string;
            storage: {
                [x: string]: {
                    key: string;
                    value: string;
                };
            };
        } | {
            size: string;
            transactions: (string | {
                hash: string;
                type?: string;
                nonce: string;
                blockHash: string;
                blockNumber: string;
                transactionIndex: string;
                from: string;
                to: string;
                value: string;
                gas: string;
                gasPrice: string;
                input: string;
                v: string;
                r: string;
                s: string;
            } | {
                hash: string;
                type: string;
                chainId: string;
                nonce: string;
                blockHash: string;
                blockNumber: string;
                transactionIndex: string;
                from: string;
                to: string;
                value: string;
                gas: string;
                gasPrice: string;
                input: string;
                accessList: {
                    address: string;
                    storageKeys: string[];
                }[];
                v: string;
                r: string;
                s: string;
            } | {
                hash: string;
                type: string;
                chainId: string;
                nonce: string;
                blockHash: string;
                blockNumber: string;
                transactionIndex: string;
                from: string;
                to: string;
                value: string;
                maxPriorityFeePerGas: string;
                maxFeePerGas: string;
                gasPrice: string;
                gas: string;
                input: string;
                accessList: {
                    address: string;
                    storageKeys: string[];
                }[];
                v: string;
                r: string;
                s: string;
            })[];
            uncles: string[];
            parentHash: string;
            sha3Uncles: string;
            miner: string;
            stateRoot: string;
            transactionsRoot: string;
            receiptsRoot: string;
            logsBloom: string;
            difficulty: string;
            totalDifficulty: string;
            number: string;
            gasLimit: string;
            gasUsed: string;
            timestamp: string;
            extraData: string;
            mixHash: string;
            nonce: string;
            baseFeePerGas?: string;
            hash: string;
        } | {
            hash: string;
            type?: string;
            nonce: string;
            blockHash: string;
            blockNumber: string;
            transactionIndex: string;
            from: string;
            to: string;
            value: string;
            gas: string;
            gasPrice: string;
            input: string;
            v: string;
            r: string;
            s: string;
        } | {
            transactionHash: string;
            transactionIndex: string;
            blockNumber: string;
            blockHash: string;
            from: string;
            to: string;
            cumulativeGasUsed: string;
            gasUsed: string;
            contractAddress: string;
            logs: {
                address: string;
                blockHash: string;
                blockNumber: string;
                data: string | string[];
                logIndex: string;
                removed: boolean;
                topics: string | string[];
                transactionHash: string;
                transactionIndex: string;
            }[];
            logsBloom: string;
            status: string;
            type?: string;
            chainId?: string;
            accessList?: {
                address: string;
                storageKeys: string[];
            }[];
            effectiveGasPrice: string;
        } | {
            readonly eth: "1.0";
            readonly net: "1.0";
            readonly rpc: "1.0";
            readonly web3: "1.0";
            readonly evm: "1.0";
            readonly personal: "1.0";
        }>;
    }>;
    format(result: any, payload: R): RecognizedString | Generator<RecognizedString>;
    format(result: any, payload: R): RecognizedString;
    format(results: any[], payloads: R[]): RecognizedString;
    formatError(error: Error & {
        code: number;
    }, payload: R): RecognizedString;
    close(): Promise<void>;
}
export {};
//# sourceMappingURL=connector.d.ts.map