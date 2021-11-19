import { Tag, DATA, WhisperPostObject, BaseFilterArgs, FilterArgs, QUANTITY, RangeFilterArgs, StorageRangeResult, SubscriptionId, SubscriptionName, TransactionTraceOptions, TraceTransactionResult } from "@ganache/ethereum-utils";
import { TypedRpcTransaction } from "@ganache/ethereum-transaction";
import { TypedData as NotTypedData, signTypedData_v4 } from "eth-sig-util";
import { Data, Quantity, PromiEvent, Api } from "@ganache/utils";
import Blockchain from "./blockchain";
import { EthereumInternalOptions } from "@ganache/ethereum-options";
import Wallet from "./wallet";
import { Address } from "@ganache/ethereum-address";
declare type TypedData = Exclude<Parameters<typeof signTypedData_v4>[1]["data"], NotTypedData>;
export default class EthereumApi implements Api {
    #private;
    readonly [index: string]: (...args: any) => Promise<any>;
    /**
     * This is the Ethereum API that the provider interacts with.
     * The only methods permitted on the prototype are the supported json-rpc
     * methods.
     * @param options
     * @param wallet
     * @param emitter
     */
    constructor(options: EthereumInternalOptions, wallet: Wallet, blockchain: Blockchain);
    /**
     * Stores a string in the local database.
     *
     * @param dbName - Database name.
     * @param key - Key name.
     * @param value - String to store.
     * @returns returns true if the value was stored, otherwise false.
     * @example
     * ```javascript
     * console.log(await provider.send("db_putString", ["testDb", "testKey", "testValue"] ));
     * ```
     */
    db_putString(dbName: string, key: string, value: string): Promise<boolean>;
    /**
     * Returns string from the local database.
     *
     * @param dbName - Database name.
     * @param key - Key name.
     * @returns The previously stored string.
     * @example
     * ```javascript
     * console.log(await provider.send("db_getString", ["testDb", "testKey"] ));
     * ```
     */
    db_getString(dbName: string, key: string): Promise<string>;
    /**
     * Stores binary data in the local database.
     *
     * @param dbName - Database name.
     * @param key - Key name.
     * @param data - Data to store.
     * @returns true if the value was stored, otherwise false.
     * @example
     * ```javascript
     * console.log(await provider.send("db_putHex", ["testDb", "testKey", "0x0"] ));
     * ```
     */
    db_putHex(dbName: string, key: string, data: DATA): Promise<boolean>;
    /**
     * Returns binary data from the local database.
     *
     * @param dbName - Database name.
     * @param key - Key name.
     * @returns The previously stored data.
     * @example
     * ```javascript
     * console.log(await provider.send("db_getHex", ["testDb", "testKey"] ));
     * ```
     */
    db_getHex(dbName: string, key: string): Promise<string>;
    /**
     * Returns the kademlia table in a readable table format.
     * @returns Returns the kademlia table in a readable table format.
     * @example
     * ```javascript
     * console.log(await provider.send("bzz_hive"));
     * ```
     */
    bzz_hive(): Promise<any[]>;
    /**
     * Returns details about the swarm node.
     * @returns Returns details about the swarm node.
     * @example
     * ```javascript
     * console.log(await provider.send("bzz_info"));
     * ```
     */
    bzz_info(): Promise<any[]>;
    /**
     * Force a single block to be mined.
     *
     * Mines a block independent of whether or not mining is started or stopped.
     * Will mine an empty block if there are no available transactions to mine.
     *
     * @param timestamp - the timestamp the block should be mined with.
     * EXPERIMENTAL: Optionally, specify an `options` object with `timestamp`
     * and/or `blocks` fields. If `blocks` is given, it will mine exactly `blocks`
     *  number of blocks, regardless of any other blocks mined or reverted during it's
     * operation. This behavior is subject to change!
     *
     * @returns The string `"0x0"`. May return additional meta-data in the future.
     *
     * @example
     * ```javascript
     * console.log("start", await provider.send("eth_blockNumber"));
     * await provider.send("evm_mine", [{blocks: 5}] ); // mines 5 blocks
     * console.log("end", await provider.send("eth_blockNumber"));
     * ```
     */
    evm_mine(timestamp: number): Promise<"0x0">;
    evm_mine(options: {
        timestamp?: number;
        blocks?: number;
    }): Promise<"0x0">;
    /**
     * Sets the given account's nonce to the specified value. Mines a new block
     * before returning.
     *
     * Warning: this will result in an invalid state tree.
     *
     * @param address - The account address to update.
     * @param nonce - The nonce value to be set.
     * @returns `true` if it worked, otherwise `false`.
     * @example
     * ```javascript
     * const nonce = "0x3e8";
     * const [address] = await provider.request({ method: "eth_accounts", params: [] });
     * const result = await provider.send("evm_setAccountNonce", [address, nonce] );
     * console.log(result);
     * ```
     */
    evm_setAccountNonce(address: DATA, nonce: QUANTITY): Promise<boolean>;
    /**
     * Jump forward in time by the given amount of time, in seconds.
     * @param seconds Number of seconds to jump forward in time by. Must be greater than or equal to `0`.
     * @returns Returns the total time adjustment, in seconds.
     * @example
     * ```javascript
     * const seconds = 10;
     * const timeAdjustment = await provider.send("evm_increaseTime", [seconds] );
     * console.log(timeAdjustment);
     * ```
     */
    evm_increaseTime(seconds: number | QUANTITY): Promise<number>;
    /**
     * Sets the internal clock time to the given timestamp.
     *
     * Warning: This will allow you to move *backwards* in time, which may cause
     * new blocks to appear to be mined before old blocks. This is will result in
     * an invalid state.
     *
     * @param time JavaScript timestamp (millisecond precision).
     * @returns The amount of *seconds* between the given timestamp and now.
     * @example
     * ```javascript
     * const currentDate = Date.now();
     * setTimeout(async () => {
     *   const time = await provider.send("evm_setTime", [currentDate] );
     *   console.log(time); // should be about two seconds ago
     * }, 1000);
     * ```
     */
    evm_setTime(time: number | QUANTITY | Date): Promise<number>;
    /**
     * Revert the state of the blockchain to a previous snapshot. Takes a single
     * parameter, which is the snapshot id to revert to. This deletes the given
     * snapshot, as well as any snapshots taken after (e.g.: reverting to id 0x1
     * will delete snapshots with ids 0x1, 0x2, etc.)
     *
     * @param snapshotId The snapshot id to revert.
     * @returns `true` if a snapshot was reverted, otherwise `false`.
     *
     * @example
     * ```javascript
     * const [from, to] = await provider.send("eth_accounts");
     * const startingBalance = BigInt(await provider.send("eth_getBalance", [from] ));
     *
     * // take a snapshot
     * const snapshotId = await provider.send("evm_snapshot");
     *
     * // send value to another account (over-simplified example)
     * await provider.send("eth_subscribe", ["newHeads"] );
     * await provider.send("eth_sendTransaction", [{from, to, value: "0xffff"}] );
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     *
     * // ensure balance has updated
     * const newBalance = await provider.send("eth_getBalance", [from] );
     * assert(BigInt(newBalance) < startingBalance);
     *
     * // revert the snapshot
     * const isReverted = await provider.send("evm_revert", [snapshotId] );
     * assert(isReverted);
     * console.log({isReverted: isReverted});
     *
     * // ensure balance has reverted
     * const endingBalance = await provider.send("eth_getBalance", [from] );
     * const isBalanceReverted = assert.strictEqual(BigInt(endingBalance), startingBalance);
     * console.log({isBalanceReverted: isBalanceReverted});
     * ```
     */
    evm_revert(snapshotId: QUANTITY): Promise<boolean>;
    /**
     * Snapshot the state of the blockchain at the current block. Takes no
     * parameters. Returns the id of the snapshot that was created. A snapshot can
     * only be reverted once. After a successful `evm_revert`, the same snapshot
     * id cannot be used again. Consider creating a new snapshot after each
     * `evm_revert` if you need to revert to the same point multiple times.
     *
     * @returns The hex-encoded identifier for this snapshot.
     *
     * @example
     * ```javascript
     * const provider = ganache.provider();
     * const [from, to] = await provider.send("eth_accounts");
     * const startingBalance = BigInt(await provider.send("eth_getBalance", [from] ));
     *
     * // take a snapshot
     * const snapshotId = await provider.send("evm_snapshot");
     *
     * // send value to another account (over-simplified example)
     * await provider.send("eth_subscribe", ["newHeads"] );
     * await provider.send("eth_sendTransaction", [{from, to, value: "0xffff"}] );
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     *
     * // ensure balance has updated
     * const newBalance = await provider.send("eth_getBalance", [from] );
     * assert(BigInt(newBalance) < startingBalance);
     *
     * // revert the snapshot
     * const isReverted = await provider.send("evm_revert", [snapshotId] );
     * assert(isReverted);
     *
     * // ensure balance has reverted
     * const endingBalance = await provider.send("eth_getBalance", [from] );
     * const isBalanceReverted = assert.strictEqual(BigInt(endingBalance), startingBalance);
     * console.log({isBalanceReverted: isBalanceReverted});
     * ```
     */
    evm_snapshot(): Promise<Quantity>;
    /**
     * Unlocks any unknown account.
     *
     * Note: accounts known to the `personal` namespace and accounts returned by
     * `eth_accounts` cannot be unlocked using this method.
     *
     * @param address The address of the account to unlock.
     * @param duration (Default: disabled) Duration in seconds how long the account
     * should remain unlocked for. Set to 0 to disable automatic locking.
     * @returns `true` if the account was unlocked successfully, `false` if the
     * account was already unlocked. Throws an error if the account could not be
     * unlocked.
     * @example
     * ```javascript
     * const address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
     * const result = await provider.send("evm_unlockUnknownAccount", [address] );
     * console.log(result);
     * ```
     */
    evm_unlockUnknownAccount(address: DATA, duration?: number): Promise<boolean>;
    /**
     * Locks any unknown account.
     *
     * Note: accounts known to the `personal` namespace and accounts returned by
     * `eth_accounts` cannot be locked using this method.
     *
     * @param address The address of the account to lock.
     * @returns `true` if the account was locked successfully, `false` if the
     * account was already locked. Throws an error if the account could not be
     * locked.
     * @example
     * ```javascript
     * const address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
     * const result = await provider.send("evm_lockUnknownAccount", [address] );
     * console.log(result);
     * ```
     */
    evm_lockUnknownAccount(address: DATA): Promise<boolean>;
    /**
     * Resume the CPU mining process with the given number of threads.
     *
     * Note: `threads` is ignored.
     * @param threads Number of threads to resume the CPU mining process with.
     * @returns `true`.
     * @example
     * ```javascript
     * await provider.send("miner_stop");
     * // check that eth_mining returns false
     * console.log(await provider.send("eth_mining"));
     * await provider.send("miner_start");
     * // check that eth_mining returns true
     * console.log(await provider.send("eth_mining"));
     * ```
     */
    miner_start(threads?: number): Promise<boolean>;
    /**
     * Stop the CPU mining operation.
     * @returns `true`.
     * @example
     * ```javascript
     * // check that eth_mining returns true
     * console.log(await provider.send("eth_mining"));
     * await provider.send("miner_stop");
     * // check that eth_mining returns false
     * console.log(await provider.send("eth_mining"));
     * ```
     */
    miner_stop(): Promise<boolean>;
    /**
     * Sets the default accepted gas price when mining transactions.
     * Any transactions that don't specify a gas price will use this amount.
     * Transactions that are below this limit are excluded from the mining process.
     * @param number Default accepted gas price.
     * @returns `true`.
     * @example
     * ```javascript
     * console.log(await provider.send("miner_setGasPrice", [300000] ));
     * ```
     */
    miner_setGasPrice(number: QUANTITY): Promise<boolean>;
    /**
     * Sets the etherbase, where mining rewards will go.
     * @param address The address where the mining rewards will go.
     * @returns `true`.
     * @example
     * ```javascript
     * const [account] = await provider.request({ method: "eth_accounts", params: [] });
     * console.log(await provider.send("miner_setEtherbase", [account] ));
     * ```
     */
    miner_setEtherbase(address: DATA): Promise<boolean>;
    /**
     * Set the extraData block header field a miner can include.
     * @param extra The `extraData` to include.
     * @returns If successfully set returns `true`, otherwise returns an error.
     * @example
     * ```javascript
     * console.log(await provider.send("miner_setExtra", ["0x0"] ));
     * ```
     */
    miner_setExtra(extra: DATA): Promise<boolean>;
    /**
     * Returns the current client version.
     * @returns The current client version.
     * @example
     * ```javascript
     * console.log(await provider.send("web3_clientVersion"));
     * ```
     */
    web3_clientVersion(): Promise<string>;
    /**
     * Returns Keccak-256 (not the standardized SHA3-256) of the given data.
     * @param data - the data to convert into a SHA3 hash.
     * @returns The SHA3 result of the given string.
     * @example
     * ```javascript
     * const data = "hello trufflers";
     * const sha3 = await provider.send("web3_sha3", [data] );
     * console.log(sha3);
     * ```
     */
    web3_sha3(data: DATA): Promise<Data>;
    /**
     * Returns the current network id.
     * @returns The current network id. This value should NOT be JSON-RPC
     * Quantity/Data encoded.
     * @example
     * ```javascript
     * console.log(await provider.send("net_version"));
     * ```
     */
    net_version(): Promise<string>;
    /**
     * Returns `true` if client is actively listening for network connections.
     * @returns `true` when listening, otherwise `false`.
     * @example
     * ```javascript
     * console.log(await provider.send("net_listening"));
     * ```
     */
    net_listening(): Promise<boolean>;
    /**
     * Returns number of peers currently connected to the client.
     * @returns Number of connected peers.
     * @example
     * ```javascript
     * console.log(await provider.send("net_peerCount"));
     * ```
     */
    net_peerCount(): Promise<Quantity>;
    /**
     * Generates and returns an estimate of how much gas is necessary to allow the
     * transaction to complete. The transaction will not be added to the
     * blockchain. Note that the estimate may be significantly more than the
     * amount of gas actually used by the transaction, for a variety of reasons
     * including EVM mechanics and node performance.
     *
     * Transaction call object:
     * * `from`: `DATA`, 20 bytes (optional) - The address the transaction is sent from.
     * * `to`: `DATA`, 20 bytes - The address the transaction is sent to.
     * * `gas`: `QUANTITY` (optional) - Integer of the maximum gas allowance for the transaction.
     * * `gasPrice`: `QUANTITY` (optional) - Integer of the price of gas in wei.
     * * `value`: `QUANTITY` (optional) - Integer of the value in wei.
     * * `data`: `DATA` (optional) - Hash of the method signature and the ABI encoded parameters.
     *
     * @param transaction The transaction call object as seen in source.
     * @param blockNumber Integer block number, or the string "latest", "earliest"
     *  or "pending".
     *
     * @returns The amount of gas used.
     *
     * @example
     * ```javascript
     * const [from, to] = await provider.request({ method: "eth_accounts", params: [] });
     * const gasEstimate = await provider.request({ method: "eth_estimateGas", params: [{ from, to }, "latest" ] });
     * console.log(gasEstimate);
     * ```
     */
    eth_estimateGas(transaction: TypedRpcTransaction, blockNumber?: QUANTITY | Tag): Promise<Quantity>;
    /**
     * Returns the current ethereum protocol version.
     * @returns The current ethereum protocol version.
     * @example
     * ```javascript
     * const version = await provider.request({ method: "eth_protocolVersion", params: [] });
     * console.log(version);
     * ```
     */
    eth_protocolVersion(): Promise<Data>;
    /**
     * Returns an object containing data about the sync status or `false` when not syncing.
     *
     * @returns An object with sync status data or `false`, when not syncing.
     *
     * * `startingBlock`: {bigint} The block at which the import started (will
     *     only be reset, after the sync reached his head).
     * * `currentBlock`: {bigint} The current block, same as `eth_blockNumber`.
     * * `highestBlock`: {bigint} The estimated highest block.
     *
     * @example
     * ```javascript
     * const result = await provider.request({ method: "eth_syncing", params: [] });
     * console.log(result);
     * ```
     */
    eth_syncing(): Promise<boolean>;
    /**
     * Returns the client coinbase address.
     * @returns The current coinbase address.
     * @example
     * ```javascript
     * const coinbaseAddress = await provider.request({ method: "eth_coinbase" });
     * console.log(coinbaseAddress);
     * ```
     */
    eth_coinbase(): Promise<Address>;
    /**
     * Returns information about a block by block number.
     * @param number Integer of a block number, or the string "earliest", "latest" or "pending", as in the
     * default block parameter.
     * @param transactions If `true` it returns the full transaction objects, if `false` only the hashes of the
     * transactions.
     * @returns The block, `null` if the block doesn't exist.
     *
     * * `hash`: `DATA`, 32 Bytes - Hash of the block. `null` when pending.
     * * `parentHash`: `DATA`, 32 Bytes - Hash of the parent block.
     * * `sha3Uncles`: `DATA`, 32 Bytes - SHA3 of the uncles data in the block.
     * * `miner`: `DATA`, 20 Bytes -  Address of the miner.
     * * `stateRoot`: `DATA`, 32 Bytes - The root of the state trie of the block.
     * * `transactionsRoot`: `DATA`, 32 Bytes - The root of the transaction trie of the block.
     * * `receiptsRoot`: `DATA`, 32 Bytes - The root of the receipts trie of the block.
     * * `logsBloom`: `DATA`, 256 Bytes - The bloom filter for the logs of the block. `null` when pending.
     * * `difficulty`: `QUANTITY` - Integer of the difficulty of this block.
     * * `number`: `QUANTITY` - The block number. `null` when pending.
     * * `gasLimit`: `QUANTITY` - The maximum gas allowed in the block.
     * * `gasUsed`: `QUANTITY` - Total gas used by all transactions in the block.
     * * `timestamp`: `QUANTITY` - The unix timestamp for when the block was collated.
     * * `extraData`: `DATA` - Extra data for the block.
     * * `mixHash`: `DATA`, 256 Bytes - Hash identifier for the block.
     * * `nonce`: `DATA`, 8 Bytes - Hash of the generated proof-of-work. `null` when pending.
     * * `totalDifficulty`: `QUANTITY` - Integer of the total difficulty of the chain until this block.
     * * `size`: `QUANTITY` - Integer the size of the block in bytes.
     * * `transactions`: `Array` - Array of transaction objects or 32 Bytes transaction hashes depending on the last parameter.
     * * `uncles`: `Array` - Array of uncle hashes.
     *
     * @example
     * ```javascript
     * const block = await provider.request({ method: "eth_getBlockByNumber", params: ["0x0", false] });
     * console.log(block);
     * ```
     */
    eth_getBlockByNumber(number: QUANTITY | Tag, transactions?: boolean): Promise<{
        size: Quantity;
        transactions: (Data | import("@ganache/ethereum-transaction/typings").LegacyTransactionJSON | import("@ganache/ethereum-transaction/typings").EIP2930AccessListTransactionJSON | import("@ganache/ethereum-transaction/typings").EIP1559FeeMarketTransactionJSON)[];
        uncles: string[];
        parentHash: Data;
        sha3Uncles: Data;
        miner: Data;
        stateRoot: Data;
        transactionsRoot: Data;
        receiptsRoot: Data;
        logsBloom: Data;
        difficulty: Quantity;
        totalDifficulty: Quantity;
        number: Quantity;
        gasLimit: Quantity;
        gasUsed: Quantity;
        timestamp: Quantity;
        extraData: Data;
        mixHash: Data;
        nonce: Data;
        baseFeePerGas?: Quantity;
        hash: Data;
    }>;
    /**
     * Returns information about a block by block hash.
     * @param hash Hash of a block.
     * @param transactions If `true` it returns the full transaction objects, if `false` only the hashes of the
     * transactions.
     * @returns The block, `null` if the block doesn't exist.
     *
     * * `hash`: `DATA`, 32 Bytes - Hash of the block. `null` when pending.
     * * `parentHash`: `DATA`, 32 Bytes - Hash of the parent block.
     * * `sha3Uncles`: `DATA`, 32 Bytes - SHA3 of the uncles data in the block.
     * * `miner`: `DATA`, 20 Bytes -  Address of the miner.
     * * `stateRoot`: `DATA`, 32 Bytes - The root of the state trie of the block.
     * * `transactionsRoot`: `DATA`, 32 Bytes - The root of the transaction trie of the block.
     * * `receiptsRoot`: `DATA`, 32 Bytes - The root of the receipts trie of the block.
     * * `logsBloom`: `DATA`, 256 Bytes - The bloom filter for the logs of the block. `null` when pending.
     * * `difficulty`: `QUANTITY` - Integer of the difficulty of this block.
     * * `number`: `QUANTITY` - The block number. `null` when pending.
     * * `gasLimit`: `QUANTITY` - The maximum gas allowed in the block.
     * * `gasUsed`: `QUANTITY` - Total gas used by all transactions in the block.
     * * `timestamp`: `QUANTITY` - The unix timestamp for when the block was collated.
     * * `extraData`: `DATA` - Extra data for the block.
     * * `mixHash`: `DATA`, 256 Bytes - Hash identifier for the block.
     * * `nonce`: `DATA`, 8 Bytes - Hash of the generated proof-of-work. `null` when pending.
     * * `totalDifficulty`: `QUANTITY` - Integer of the total difficulty of the chain until this block.
     * * `size`: `QUANTITY` - Integer the size of the block in bytes.
     * * `transactions`: `Array` - Array of transaction objects or 32 Bytes transaction hashes depending on the last parameter.
     * * `uncles`: `Array` - Array of uncle hashes.
     *
     * @example
     * ```javascript
     * // Simple.sol
     * // // SPDX-License-Identifier: MIT
     * //  pragma solidity ^0.7.4;
     * //
     * //  contract Simple {
     * //      uint256 public value;
     * //      constructor() payable {
     * //          value = 5;
     * //      }
     * //  }
     * const simpleSol = "0x6080604052600560008190555060858060196000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633fa4f24514602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000548156fea26469706673582212200897f7766689bf7a145227297912838b19bcad29039258a293be78e3bf58e20264736f6c63430007040033";
     * const [from] = await provider.request({ method: "eth_accounts", params: [] });
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const txHash = await provider.request({ method: "eth_sendTransaction", params: [{ from, gas: "0x5b8d80", data: simpleSol }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     * const txReceipt = await provider.request({ method: "eth_getTransactionReceipt", params: [txHash] });
     * const block = await provider.request({ method: "eth_getBlockByHash", params: [txReceipt.blockHash, true] });
     * console.log(block);
     * ```
     */
    eth_getBlockByHash(hash: DATA, transactions?: boolean): Promise<{
        size: Quantity;
        transactions: (Data | import("@ganache/ethereum-transaction/typings").LegacyTransactionJSON | import("@ganache/ethereum-transaction/typings").EIP2930AccessListTransactionJSON | import("@ganache/ethereum-transaction/typings").EIP1559FeeMarketTransactionJSON)[];
        uncles: string[];
        parentHash: Data;
        sha3Uncles: Data;
        miner: Data;
        stateRoot: Data;
        transactionsRoot: Data;
        receiptsRoot: Data;
        logsBloom: Data;
        difficulty: Quantity;
        totalDifficulty: Quantity;
        number: Quantity;
        gasLimit: Quantity;
        gasUsed: Quantity;
        timestamp: Quantity;
        extraData: Data;
        mixHash: Data;
        nonce: Data;
        baseFeePerGas?: Quantity;
        hash: Data;
    }>;
    /**
     * Returns the number of transactions in a block from a block matching the given block number.
     * @param number Integer of a block number, or the string "earliest", "latest" or "pending", as in the
     * default block parameter.
     * @returns Integer of the number of transactions in the block.
     * @example
     * ```javascript
     * const txCount = await provider.request({ method: "eth_getBlockTransactionCountByNumber", params: ["0x0"] });
     * console.log(txCount);
     * ```
     */
    eth_getBlockTransactionCountByNumber(blockNumber: QUANTITY | Tag): Promise<Quantity>;
    /**
     * Returns the number of transactions in a block from a block matching the given block hash.
     * @param hash Hash of a block.
     * @returns Number of transactions in the block.
     * @example
     * ```javascript
     * // Simple.sol
     * // // SPDX-License-Identifier: MIT
     * //  pragma solidity ^0.7.4;
     * //
     * //  contract Simple {
     * //      uint256 public value;
     * //      constructor() payable {
     * //          value = 5;
     * //      }
     * //  }
     * const simpleSol = "0x6080604052600560008190555060858060196000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633fa4f24514602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000548156fea26469706673582212200897f7766689bf7a145227297912838b19bcad29039258a293be78e3bf58e20264736f6c63430007040033";
     * const [from] = await provider.request({ method: "eth_accounts", params: [] });
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const txHash = await provider.request({ method: "eth_sendTransaction", params: [{ from, gas: "0x5b8d80", data: simpleSol }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     * const txReceipt = await provider.request({ method: "eth_getTransactionReceipt", params: [txHash] });
     * const txCount = await provider.request({ method: "eth_getBlockTransactionCountByHash", params: [txReceipt.blockHash] });
     * console.log(txCount);
     * ```
     */
    eth_getBlockTransactionCountByHash(hash: DATA): Promise<Quantity>;
    /**
     * Returns a list of available compilers.
     * @returns List of available compilers.
     * @example
     * ```javascript
     * const compilers = await provider.send("eth_getCompilers");
     * console.log(compilers);
     * ```
     */
    eth_getCompilers(): Promise<string[]>;
    /**
     * Returns information about a transaction by block hash and transaction index position.
     * @param hash Hash of a block.
     * @param index Integer of the transaction index position.
     * @returns The transaction object or `null` if no transaction was found.
     *
     * * `hash`: `DATA`, 32 Bytes - The transaction hash.
     * * `nonce`: `QUANTITY` - The number of transactions made by the sender prior to this one.
     * * `blockHash`: `DATA`, 32 Bytes - The hash of the block the transaction is in. `null` when pending.
     * * `blockNumber`: `QUANTITY` - The number of the block the transaction is in. `null` when pending.
     * * `transactionIndex`: `QUANTITY` - The index position of the transaction in the block.
     * * `from`: `DATA`, 20 Bytes - The address the transaction is sent from.
     * * `to`: `DATA`, 20 Bytes - The address the transaction is sent to.
     * * `value`: `QUANTITY` - The value transferred in wei.
     * * `gas`: `QUANTITY` - The gas provided by the sender.
     * * `gasPrice`: `QUANTITY` - The price of gas in wei.
     * * `input`: `DATA` - The data sent along with the transaction.
     * * `v`: `QUANTITY` - ECDSA recovery id.
     * * `r`: `DATA`, 32 Bytes - ECDSA signature r.
     * * `s`: `DATA`, 32 Bytes - ECDSA signature s.
     *
     * @example
     * ```javascript
     * const [from, to] = await provider.request({ method: "eth_accounts", params: [] });
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const txHash = await provider.request({ method: "eth_sendTransaction", params: [{ from, to, gas: "0x5b8d80" }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     * const { blockHash, transactionIndex } = await provider.request({ method: "eth_getTransactionReceipt", params: [txHash] });
     *
     * const tx = await provider.request({ method: "eth_getTransactionByBlockHashAndIndex", params: [ blockHash, transactionIndex ] });
     * console.log(tx);
     * ```
     */
    eth_getTransactionByBlockHashAndIndex(hash: DATA, index: QUANTITY): Promise<import("@ganache/ethereum-transaction/typings").LegacyTransactionJSON>;
    /**
     * Returns information about a transaction by block number and transaction index position.
     * @param number A block number, or the string "earliest", "latest" or "pending".
     * @param index Integer of the transaction index position.
     * @returns The transaction object or `null` if no transaction was found.
     *
     * * `hash`: `DATA`, 32 Bytes - The transaction hash.
     * * `nonce`: `QUANTITY` - The number of transactions made by the sender prior to this one.
     * * `blockHash`: `DATA`, 32 Bytes - The hash of the block the transaction is in. `null` when pending.
     * * `blockNumber`: `QUANTITY` - The number of the block the transaction is in. `null` when pending.
     * * `transactionIndex`: `QUANTITY` - The index position of the transaction in the block.
     * * `from`: `DATA`, 20 Bytes - The address the transaction is sent from.
     * * `to`: `DATA`, 20 Bytes - The address the transaction is sent to.
     * * `value`: `QUANTITY` - The value transferred in wei.
     * * `gas`: `QUANTITY` - The gas provided by the sender.
     * * `gasPrice`: `QUANTITY` - The price of gas in wei.
     * * `input`: `DATA` - The data sent along with the transaction.
     * * `v`: `QUANTITY` - ECDSA recovery id.
     * * `r`: `DATA`, 32 Bytes - ECDSA signature r.
     * * `s`: `DATA`, 32 Bytes - ECDSA signature s.
     *
     * @example
     * ```javascript
     * const [from, to] = await provider.request({ method: "eth_accounts", params: [] });
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const txHash = await provider.request({ method: "eth_sendTransaction", params: [{ from, to, gas: "0x5b8d80" }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     * const { transactionIndex } = await provider.request({ method: "eth_getTransactionReceipt", params: [txHash] });
     *
     * const tx = await provider.request({ method: "eth_getTransactionByBlockNumberAndIndex", params: [ "latest", transactionIndex ] });
     * console.log(tx);
     * ```
     */
    eth_getTransactionByBlockNumberAndIndex(number: QUANTITY | Tag, index: QUANTITY): Promise<import("@ganache/ethereum-transaction/typings").LegacyTransactionJSON>;
    /**
     * Returns the number of uncles in a block from a block matching the given block hash.
     * @param hash Hash of a block.
     * @returns The number of uncles in a block.
     * @example
     * ```javascript
     * const blockHash = await provider.send("eth_getBlockByNumber", ["latest"] );
     * const uncleCount = await provider.send("eth_getUncleCountByBlockHash", [blockHash] );
     * console.log(uncleCount);
     * ```
     */
    eth_getUncleCountByBlockHash(hash: DATA): Promise<Quantity>;
    /**
     * Returns the number of uncles in a block from a block matching the given block hash.
     * @param blockNumber A block number, or the string "earliest", "latest" or "pending".
     * @returns The number of uncles in a block.
     * @example
     * ```javascript
     * const uncleCount = await provider.send("eth_getUncleCountByBlockNumber", ["latest"] );
     * console.log(uncleCount);
     * ```
     */
    eth_getUncleCountByBlockNumber(blockNumber: QUANTITY | Tag): Promise<Quantity>;
    /**
     * Returns information about a uncle of a block by hash and uncle index position.
     *
     * @param hash Hash of a block.
     * @param index The uncle's index position.
     * @returns A block object or `null` when no block is found.
     *
     * * `hash`: `DATA`, 32 Bytes - Hash of the block. `null` when pending.
     * * `parentHash`: `DATA`, 32 Bytes - Hash of the parent block.
     * * `sha3Uncles`: `DATA`, 32 Bytes - SHA3 of the uncles data in the block.
     * * `miner`: `DATA`, 20 Bytes -  Address of the miner.
     * * `stateRoot`: `DATA`, 32 Bytes - The root of the state trie of the block.
     * * `transactionsRoot`: `DATA`, 32 Bytes - The root of the transaction trie of the block.
     * * `receiptsRoot`: `DATA`, 32 Bytes - The root of the receipts trie of the block.
     * * `logsBloom`: `DATA`, 256 Bytes - The bloom filter for the logs of the block. `null` when pending.
     * * `difficulty`: `QUANTITY` - Integer of the difficulty of this block.
     * * `number`: `QUANTITY` - The block number. `null` when pending.
     * * `gasLimit`: `QUANTITY` - The maximum gas allowed in the block.
     * * `gasUsed`: `QUANTITY` - Total gas used by all transactions in the block.
     * * `timestamp`: `QUANTITY` - The unix timestamp for when the block was collated.
     * * `extraData`: `DATA` - Extra data for the block.
     * * `mixHash`: `DATA`, 256 Bytes - Hash identifier for the block.
     * * `nonce`: `DATA`, 8 Bytes - Hash of the generated proof-of-work. `null` when pending.
     * * `totalDifficulty`: `QUANTITY` - Integer of the total difficulty of the chain until this block.
     * * `size`: `QUANTITY` - Integer the size of the block in bytes.
     * * `transactions`: `Array` - Array of transaction objects or 32 Bytes transaction hashes depending on the last parameter.
     * * `uncles`: `Array` - Array of uncle hashes.
     *
     * @example
     * ```javascript
     * const blockHash = await provider.send("eth_getBlockByNumber", ["latest"] );
     * const block = await provider.send("eth_getUncleByBlockHashAndIndex", [blockHash, "0x0"] );
     * console.log(block);
     * ```
     */
    eth_getUncleByBlockHashAndIndex(hash: DATA, index: QUANTITY): Promise<{
        size: Quantity;
        transactions: (Data | import("@ganache/ethereum-transaction/typings").LegacyTransactionJSON | import("@ganache/ethereum-transaction/typings").EIP2930AccessListTransactionJSON | import("@ganache/ethereum-transaction/typings").EIP1559FeeMarketTransactionJSON)[];
        uncles: string[];
        parentHash: Data;
        sha3Uncles: Data;
        miner: Data;
        stateRoot: Data;
        transactionsRoot: Data;
        receiptsRoot: Data;
        logsBloom: Data;
        difficulty: Quantity;
        totalDifficulty: Quantity;
        number: Quantity;
        gasLimit: Quantity;
        gasUsed: Quantity;
        timestamp: Quantity;
        extraData: Data;
        mixHash: Data;
        nonce: Data;
        baseFeePerGas?: Quantity;
        hash: Data;
    }>;
    /**
     * Returns information about a uncle of a block by hash and uncle index position.
     *
     * @param blockNumber A block number, or the string "earliest", "latest" or "pending".
     * @param uncleIndex The uncle's index position.
     * @returns A block object or `null` when no block is found.
     *
     * * `hash`: `DATA`, 32 Bytes - Hash of the block. `null` when pending.
     * * `parentHash`: `DATA`, 32 Bytes - Hash of the parent block.
     * * `sha3Uncles`: `DATA`, 32 Bytes - SHA3 of the uncles data in the block.
     * * `miner`: `DATA`, 20 Bytes -  Address of the miner.
     * * `stateRoot`: `DATA`, 32 Bytes - The root of the state trie of the block.
     * * `transactionsRoot`: `DATA`, 32 Bytes - The root of the transaction trie of the block.
     * * `receiptsRoot`: `DATA`, 32 Bytes - The root of the receipts trie of the block.
     * * `logsBloom`: `DATA`, 256 Bytes - The bloom filter for the logs of the block. `null` when pending.
     * * `difficulty`: `QUANTITY` - Integer of the difficulty of this block.
     * * `number`: `QUANTITY` - The block number. `null` when pending.
     * * `gasLimit`: `QUANTITY` - The maximum gas allowed in the block.
     * * `gasUsed`: `QUANTITY` - Total gas used by all transactions in the block.
     * * `timestamp`: `QUANTITY` - The unix timestamp for when the block was collated.
     * * `extraData`: `DATA` - Extra data for the block.
     * * `mixHash`: `DATA`, 256 Bytes - Hash identifier for the block.
     * * `nonce`: `DATA`, 8 Bytes - Hash of the generated proof-of-work. `null` when pending.
     * * `totalDifficulty`: `QUANTITY` - Integer of the total difficulty of the chain until this block.
     * * `size`: `QUANTITY` - Integer the size of the block in bytes.
     * * `transactions`: `Array` - Array of transaction objects or 32 Bytes transaction hashes depending on the last parameter.
     * * `uncles`: `Array` - Array of uncle hashes.
     *
     * @example
     * ```javascript
     * const block = await provider.send("eth_getUncleByBlockNumberAndIndex", ["latest", "0x0"] );
     * console.log(block);
     * ```
     */
    eth_getUncleByBlockNumberAndIndex(blockNumber: QUANTITY | Tag, uncleIndex: QUANTITY): Promise<{
        size: Quantity;
        transactions: (Data | import("@ganache/ethereum-transaction/typings").LegacyTransactionJSON | import("@ganache/ethereum-transaction/typings").EIP2930AccessListTransactionJSON | import("@ganache/ethereum-transaction/typings").EIP1559FeeMarketTransactionJSON)[];
        uncles: string[];
        parentHash: Data;
        sha3Uncles: Data;
        miner: Data;
        stateRoot: Data;
        transactionsRoot: Data;
        receiptsRoot: Data;
        logsBloom: Data;
        difficulty: Quantity;
        totalDifficulty: Quantity;
        number: Quantity;
        gasLimit: Quantity;
        gasUsed: Quantity;
        timestamp: Quantity;
        extraData: Data;
        mixHash: Data;
        nonce: Data;
        baseFeePerGas?: Quantity;
        hash: Data;
    }>;
    /**
     * Returns: An Array with the following elements
     * 1: `DATA`, 32 Bytes - current block header pow-hash
     * 2: `DATA`, 32 Bytes - the seed hash used for the DAG.
     * 3: `DATA`, 32 Bytes - the boundary condition ("target"), 2^256 / difficulty.
     *
     * @param filterId A filter id.
     * @returns The hash of the current block, the seedHash, and the boundary condition to be met ("target").
     * @example
     * ```javascript
     * console.log(await provider.send("eth_getWork", ["0x0"] ));
     *  ```
     */
    eth_getWork(filterId: QUANTITY): Promise<[] | [string, string, string]>;
    /**
     * Used for submitting a proof-of-work solution.
     *
     * @param nonce The nonce found (64 bits).
     * @param powHash The header's pow-hash (256 bits).
     * @param digest The mix digest (256 bits).
     * @returns `true` if the provided solution is valid, otherwise `false`.
     * @example
     * ```javascript
     * const nonce = "0xe0df4bd14ab39a71";
     * const powHash = "0x0000000000000000000000000000000000000000000000000000000000000001";
     * const digest = "0xb2222a74119abd18dbcb7d1f661c6578b7bbeb4984c50e66ed538347f606b971";
     * const result = await provider.request({ method: "eth_submitWork", params: [nonce, powHash, digest] });
     * console.log(result);
     * ```
     */
    eth_submitWork(nonce: DATA, powHash: DATA, digest: DATA): Promise<boolean>;
    /**
     * Used for submitting mining hashrate.
     *
     * @param hashRate A hexadecimal string representation (32 bytes) of the hash rate.
     * @param clientID A random hexadecimal(32 bytes) ID identifying the client.
     * @returns `true` if submitting went through succesfully and `false` otherwise.
     * @example
     * ```javascript
     * const hashRate = "0x0000000000000000000000000000000000000000000000000000000000000001";
     * const clientId = "0xb2222a74119abd18dbcb7d1f661c6578b7bbeb4984c50e66ed538347f606b971";
     * const result = await provider.request({ method: "eth_submitHashrate", params: [hashRate, clientId] });
     * console.log(result);
     * ```
     */
    eth_submitHashrate(hashRate: DATA, clientID: DATA): Promise<boolean>;
    /**
     * Returns `true` if client is actively mining new blocks.
     * @returns returns `true` if the client is mining, otherwise `false`.
     * @example
     * ```javascript
     * const isMining = await provider.request({ method: "eth_mining", params: [] });
     * console.log(isMining);
     * ```
     */
    eth_mining(): Promise<boolean>;
    /**
     * Returns the number of hashes per second that the node is mining with.
     * @returns Number of hashes per second.
     * @example
     * ```javascript
     * const hashrate = await provider.request({ method: "eth_hashrate", params: [] });
     * console.log(hashrate);
     * ```
     */
    eth_hashrate(): Promise<Quantity>;
    /**
     * Returns the current price per gas in wei.
     * @returns Integer of the current gas price in wei.
     * @example
     * ```javascript
     * const gasPrice = await provider.request({ method: "eth_gasPrice", params: [] });
     * console.log(gasPrice);
     * ```
     */
    eth_gasPrice(): Promise<Quantity>;
    /**
     * Returns a list of addresses owned by client.
     * @returns Array of 20 Bytes - addresses owned by the client.
     * @example
     * ```javascript
     * const accounts = await provider.request({ method: "eth_accounts", params: [] });
     * console.log(accounts);
     * ```
     */
    eth_accounts(): Promise<string[]>;
    /**
     * Returns the number of the most recent block.
     * @returns The current block number the client is on.
     * @example
     * ```javascript
     * const blockNumber = await provider.request({ method: "eth_blockNumber" });
     * console.log(blockNumber);
     * ```
     */
    eth_blockNumber(): Promise<Quantity>;
    /**
     * Returns the currently configured chain id, a value used in
     * replay-protected transaction signing as introduced by EIP-155.
     * @returns The chain id as a string.
     * @EIP [155 – Simple replay attack protection](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md)
     *
     * @example
     * ```javascript
     * const chainId = await provider.send("eth_chainId");
     * console.log(chainId);
     * ```
     */
    eth_chainId(): Promise<Quantity>;
    /**
     * Returns the balance of the account of given address.
     * @param address Address to check for balance.
     * @param blockNumber Integer block number, or the string "latest", "earliest"
     *  or "pending".
     *
     * @returns Integer of the account balance in wei.
     *
     * @example
     * ```javascript
     * const accounts = await provider.request({ method: "eth_accounts", params: [] });
     * const balance = await provider.request({ method: "eth_getBalance", params: [accounts[0], "latest"] });
     * console.log(balance);
     * ```
     */
    eth_getBalance(address: DATA, blockNumber?: QUANTITY | Tag): Promise<Quantity>;
    /**
     * Returns code at a given address.
     *
     * @param address Address.
     * @param blockNumber Integer block number, or the string "latest", "earliest" or "pending".
     * @returns The code from the given address.
     * @example
     * ```javascript
     * // Simple.sol
     * // // SPDX-License-Identifier: MIT
     * //  pragma solidity ^0.7.4;
     * //
     * //  contract Simple {
     * //      uint256 public value;
     * //      constructor() payable {
     * //          value = 5;
     * //      }
     * //  }
     * const simpleSol = "0x6080604052600560008190555060858060196000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633fa4f24514602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000548156fea26469706673582212200897f7766689bf7a145227297912838b19bcad29039258a293be78e3bf58e20264736f6c63430007040033";
     * const [from] = await provider.request({ method: "eth_accounts", params: [] });
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const txHash = await provider.request({ method: "eth_sendTransaction", params: [{ from, gas: "0x5b8d80", data: simpleSol }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     * const txReceipt = await provider.request({ method: "eth_getTransactionReceipt", params: [txHash] });
     * const code = await provider.request({ method: "eth_getCode", params: [txReceipt.contractAddress, "latest"] });
     * console.log(code);
     * ```
     */
    eth_getCode(address: DATA, blockNumber?: QUANTITY | Tag): Promise<Data>;
    /**
     * Returns the value from a storage position at a given address.
     * @param address Address of the storage.
     * @param position Integer of the position in the storage.
     * @param blockNumber Integer block number, or the string "latest", "earliest"
     *  or "pending".
     * @returns The value in storage at the requested position.
     * @example
     * ```javascript
     * // Simple.sol
     * // // SPDX-License-Identifier: MIT
     * //  pragma solidity ^0.7.4;
     * //
     * //  contract Simple {
     * //      uint256 public value;
     * //      constructor() payable {
     * //          value = 5;
     * //      }
     * //  }
     * const simpleSol = "0x6080604052600560008190555060858060196000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633fa4f24514602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000548156fea26469706673582212200897f7766689bf7a145227297912838b19bcad29039258a293be78e3bf58e20264736f6c63430007040033";
     * const [from] = await provider.request({ method: "eth_accounts", params: [] });
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const txHash = await provider.request({ method: "eth_sendTransaction", params: [{ from, gas: "0x5b8d80", data: simpleSol }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     * const txReceipt = await provider.request({ method: "eth_getTransactionReceipt", params: [txHash] });
     * const storageValue = await provider.request({ method: "eth_getStorageAt", params: [txReceipt.contractAddress, "0x0", "latest"] });
     * console.log(storageValue);
     * ```
     */
    eth_getStorageAt(address: DATA, position: QUANTITY, blockNumber?: QUANTITY | Tag): Promise<Data>;
    /**
     * Returns the information about a transaction requested by transaction hash.
     *
     * @param transactionHash Hash of a transaction.
     * @returns The transaction object or `null` if no transaction was found.
     *
     * * `hash`: `DATA`, 32 Bytes - The transaction hash.
     * * `nonce`: `QUANTITY` - The number of transactions made by the sender prior to this one.
     * * `blockHash`: `DATA`, 32 Bytes - The hash of the block the transaction is in. `null` when pending.
     * * `blockNumber`: `QUANTITY` - The number of the block the transaction is in. `null` when pending.
     * * `transactionIndex`: `QUANTITY` - The index position of the transaction in the block.
     * * `from`: `DATA`, 20 Bytes - The address the transaction is sent from.
     * * `to`: `DATA`, 20 Bytes - The address the transaction is sent to.
     * * `value`: `QUANTITY` - The value transferred in wei.
     * * `gas`: `QUANTITY` - The gas provided by the sender.
     * * `gasPrice`: `QUANTITY` - The price of gas in wei.
     * * `input`: `DATA` - The data sent along with the transaction.
     * * `v`: `QUANTITY` - ECDSA recovery id.
     * * `r`: `DATA`, 32 Bytes - ECDSA signature r.
     * * `s`: `DATA`, 32 Bytes - ECDSA signature s.
     *
     * @example
     * ```javascript
     * const [from, to] = await provider.request({ method: "eth_accounts", params: [] });
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const txHash = await provider.request({ method: "eth_sendTransaction", params: [{ from, to, gas: "0x5b8d80" }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     *
     * const tx = await provider.request({ method: "eth_getTransactionByHash", params: [ txHash ] });
     * console.log(tx);
     * ```
     */
    eth_getTransactionByHash(transactionHash: DATA): Promise<import("@ganache/ethereum-transaction/typings").LegacyTransactionJSON>;
    /**
     * Returns the receipt of a transaction by transaction hash.
     *
     * Note: The receipt is not available for pending transactions.
     *
     * @param transactionHash Hash of a transaction.
     * @returns Returns the receipt of a transaction by transaction hash.
     * @example
     * ```javascript
     * const [from, to] = await provider.request({ method: "eth_accounts", params: [] });
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const txHash = await provider.request({ method: "eth_sendTransaction", params: [{ from, to, gas: "0x5b8d80" }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     *
     * const txReceipt = await provider.request({ method: "eth_getTransactionReceipt", params: [ txHash ] });
     * console.log(txReceipt);
     * ```
     */
    eth_getTransactionReceipt(transactionHash: DATA): Promise<import("@ganache/ethereum-transaction/typings").TransactionReceiptJSON>;
    /**
     * Creates new message call transaction or a contract creation, if the data field contains code.
     *
     * Transaction call object:
     * * `from`: `DATA`, 20 bytes (optional) - The address the transaction is sent from.
     * * `to`: `DATA`, 20 bytes - The address the transaction is sent to.
     * * `gas`: `QUANTITY` (optional) - Integer of the maximum gas allowance for the transaction.
     * * `gasPrice`: `QUANTITY` (optional) - Integer of the price of gas in wei.
     * * `value`: `QUANTITY` (optional) - Integer of the value in wei.
     * * `data`: `DATA` (optional) - Hash of the method signature and the ABI encoded parameters.
     *
     * @param transaction - The transaction call object as seen in source.
     * @returns The transaction hash.
     * @example
     * ```javascript
     * const [from, to] = await provider.request({ method: "eth_accounts", params: [] });
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const txHash = await provider.request({ method: "eth_sendTransaction", params: [{ from, to, gas: "0x5b8d80" }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     * console.log(txHash);
     * ```
     */
    eth_sendTransaction(transaction: TypedRpcTransaction): Promise<Data>;
    /**
     * Signs a transaction that can be submitted to the network at a later time using `eth_sendRawTransaction`.
     *
     * Transaction call object:
     * * `from`: `DATA`, 20 bytes (optional) - The address the transaction is sent from.
     * * `to`: `DATA`, 20 bytes - The address the transaction is sent to.
     * * `gas`: `QUANTITY` (optional) - Integer of the maximum gas allowance for the transaction.
     * * `gasPrice`: `QUANTITY` (optional) - Integer of the price of gas in wei.
     * * `value`: `QUANTITY` (optional) - Integer of the value in wei.
     * * `data`: `DATA` (optional) - Hash of the method signature and the ABI encoded parameters.
     *
     * @param transaction - The transaction call object as seen in source.
     * @returns The raw, signed transaction.
     * @example
     * ```javascript
     * const [from, to] = await provider.request({ method: "eth_accounts", params: [] });
     * const signedTx = await provider.request({ method: "eth_signTransaction", params: [{ from, to }] });
     * console.log(signedTx)
     * ```
     */
    eth_signTransaction(transaction: TypedRpcTransaction): Promise<string>;
    /**
     * Creates new message call transaction or a contract creation for signed transactions.
     * @param transaction The signed transaction data.
     * @returns The transaction hash.
     * @example
     * ```javascript
     * const [from, to] = await provider.request({ method: "eth_accounts", params: [] });
     * const signedTx = await provider.request({ method: "eth_signTransaction", params: [{ from, to, gas: "0x5b8d80" }] });
     * const txHash = await provider.send("eth_sendRawTransaction", [signedTx] );
     * console.log(txHash);
     * ```
     */
    eth_sendRawTransaction(transaction: string): Promise<Data>;
    /**
     * The sign method calculates an Ethereum specific signature with:
     * `sign(keccak256("\x19Ethereum Signed Message:\n" + message.length + message)))`.
     *
     * By adding a prefix to the message makes the calculated signature
     * recognizable as an Ethereum specific signature. This prevents misuse where a malicious DApp can sign arbitrary data
     *  (e.g. transaction) and use the signature to impersonate the victim.
     *
     * Note the address to sign with must be unlocked.
     *
     * @param address Address to sign with.
     * @param message Message to sign.
     * @returns Signature - a hex encoded 129 byte array
     * starting with `0x`. It encodes the `r`, `s`, and `v` parameters from
     * appendix F of the [yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf)
     *  in big-endian format. Bytes 0...64 contain the `r` parameter, bytes
     * 64...128 the `s` parameter, and the last byte the `v` parameter. Note
     * that the `v` parameter includes the chain id as specified in [EIP-155](https://eips.ethereum.org/EIPS/eip-155).
     * @example
     * ```javascript
     * const [account] = await provider.request({ method: "eth_accounts", params: [] });
     * const msg = "0x307866666666666666666666";
     * const signature = await provider.request({ method: "eth_sign", params: [account, msg] });
     * console.log(signature);
     * ```
     */
    eth_sign(address: DATA, message: DATA): Promise<string>;
    /**
     * Identical to eth_signTypedData_v4.
     *
     * @param address Address of the account that will sign the messages.
     * @param typedData Typed structured data to be signed.
     * @returns Signature. As in `eth_sign`, it is a hex encoded 129 byte array
     * starting with `0x`. It encodes the `r`, `s`, and `v` parameters from
     * appendix F of the [yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf)
     *  in big-endian format. Bytes 0...64 contain the `r` parameter, bytes
     * 64...128 the `s` parameter, and the last byte the `v` parameter. Note
     * that the `v` parameter includes the chain id as specified in [EIP-155](https://eips.ethereum.org/EIPS/eip-155).
     * @EIP [712](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md)
     * @example
     * ```javascript
     * const [account] = await provider.request({ method: "eth_accounts", params: [] });
     * const typedData = {
     *  types: {
     *    EIP712Domain: [
     *      { name: 'name', type: 'string' },
     *      { name: 'version', type: 'string' },
     *      { name: 'chainId', type: 'uint256' },
     *      { name: 'verifyingContract', type: 'address' },
     *    ],
     *    Person: [
     *      { name: 'name', type: 'string' },
     *      { name: 'wallet', type: 'address' }
     *    ],
     *    Mail: [
     *      { name: 'from', type: 'Person' },
     *      { name: 'to', type: 'Person' },
     *      { name: 'contents', type: 'string' }
     *    ],
     *  },
     *  primaryType: 'Mail',
     *  domain: {
     *    name: 'Ether Mail',
     *    version: '1',
     *    chainId: 1,
     *    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
     *  },
     *  message: {
     *    from: {
     *      name: 'Cow',
     *      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
     *    },
     *    to: {
     *      name: 'Bob',
     *      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
     *    },
     *    contents: 'Hello, Bob!',
     *  },
     * };
     * const signature = await provider.request({ method: "eth_signTypedData", params: [account, typedData] });
     * console.log(signature);
     * ```
     */
    eth_signTypedData(address: DATA, typedData: TypedData): Promise<string>;
    /**
     *
     * @param address Address of the account that will sign the messages.
     * @param typedData Typed structured data to be signed.
     * @returns Signature. As in `eth_sign`, it is a hex encoded 129 byte array
     * starting with `0x`. It encodes the `r`, `s`, and `v` parameters from
     * appendix F of the [yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf)
     *  in big-endian format. Bytes 0...64 contain the `r` parameter, bytes
     * 64...128 the `s` parameter, and the last byte the `v` parameter. Note
     * that the `v` parameter includes the chain id as specified in [EIP-155](https://eips.ethereum.org/EIPS/eip-155).
     * @EIP [712](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md)
     * @example
     * ```javascript
     * const [account] = await provider.request({ method: "eth_accounts", params: [] });
     * const typedData = {
     *  types: {
     *    EIP712Domain: [
     *      { name: 'name', type: 'string' },
     *      { name: 'version', type: 'string' },
     *      { name: 'chainId', type: 'uint256' },
     *      { name: 'verifyingContract', type: 'address' },
     *    ],
     *    Person: [
     *      { name: 'name', type: 'string' },
     *      { name: 'wallet', type: 'address' }
     *    ],
     *    Mail: [
     *      { name: 'from', type: 'Person' },
     *      { name: 'to', type: 'Person' },
     *      { name: 'contents', type: 'string' }
     *    ],
     *  },
     *  primaryType: 'Mail',
     *  domain: {
     *    name: 'Ether Mail',
     *    version: '1',
     *    chainId: 1,
     *    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
     *  },
     *  message: {
     *    from: {
     *      name: 'Cow',
     *      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
     *    },
     *    to: {
     *      name: 'Bob',
     *      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
     *    },
     *    contents: 'Hello, Bob!',
     *  },
     * };
     * const signature = await provider.request({ method: "eth_signTypedData_v4", params: [account, typedData] });
     * console.log(signature);
     * ```
     */
    eth_signTypedData_v4(address: DATA, typedData: TypedData): Promise<string>;
    /**
     * Starts a subscription to a particular event. For every event that matches
     * the subscription a JSON-RPC notification with event details and
     * subscription ID will be sent to a client.
     *
     * @param subscriptionName Name for the subscription.
     * @returns A subscription id.
     * @example
     * ```javascript
     * const subscriptionId = await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * console.log(subscriptionId);
     * ```
     */
    eth_subscribe(subscriptionName: SubscriptionName): PromiEvent<Quantity>;
    /**
     * Starts a subscription to a particular event. For every event that matches
     * the subscription a JSON-RPC notification with event details and
     * subscription ID will be sent to a client.
     *
     * @param subscriptionName
     * @param options Filter options:
     *  * `address`: either an address or an array of addresses. Only logs that
     *    are created from these addresses are returned
     *  * `topics`, only logs which match the specified topics
     * @returns A subscription id.
     */
    eth_subscribe(subscriptionName: Extract<SubscriptionName, "logs">, options: BaseFilterArgs): PromiEvent<Quantity>;
    /**
     * Cancel a subscription to a particular event. Returns a boolean indicating
     * if the subscription was successfully cancelled.
     *
     * @param subscriptionId The ID of the subscription to unsubscribe to.
     * @returns `true` if subscription was cancelled successfully, otherwise `false`.
     * @example
     * ```javascript
     * const subscriptionId = await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const result = await provider.request({ method: "eth_unsubscribe", params: [subscriptionId] });
     * console.log(result);
     * ```
     */
    eth_unsubscribe(subscriptionId: SubscriptionId): Promise<boolean>;
    /**
     * Creates a filter in the node, to notify when a new block arrives. To check
     * if the state has changed, call `eth_getFilterChanges`.
     *
     * @returns A filter id.
     * @example
     * ```javascript
     * const filterId = await provider.request({ method: "eth_newBlockFilter", params: [] });
     * console.log(filterId);
     * ```
     */
    eth_newBlockFilter(): Promise<Quantity>;
    /**
     * Creates a filter in the node, to notify when new pending transactions
     * arrive. To check if the state has changed, call `eth_getFilterChanges`.
     *
     * @returns A filter id.
     * @example
     * ```javascript
     * const filterId = await provider.request({ method: "eth_newPendingTransactionFilter", params: [] });
     * console.log(filterId);
     * ```
     */
    eth_newPendingTransactionFilter(): Promise<Quantity>;
    /**
     * Creates a filter object, based on filter options, to notify when the state
     * changes (logs). To check if the state has changed, call
     * `eth_getFilterChanges`.
     *
     * If the from `fromBlock` or `toBlock` option are equal to "latest" the
     * filter continually append logs for whatever block is seen as latest at the
     * time the block was mined, not just for the block that was "latest" when the
     * filter was created.
     *
     * ### A note on specifying topic filters:
     * Topics are order-dependent. A transaction with a log with topics [A, B]
     * will be matched by the following topic filters:
     *  * `[]` “anything”
     *  * `[A]` “A in first position (and anything after)”
     *  * `[null, B]` “anything in first position AND B in second position (and
     * anything after)”
     *  * `[A, B]` “A in first position AND B in second position (and anything
     * after)”
     *  * `[[A, B], [A, B]]` “(A OR B) in first position AND (A OR B) in second
     * position (and anything after)”
     *
     * Filter options:
     * * `fromBlock`: `QUANTITY | TAG` (optional) - Integer block number, or the string "latest", "earliest"
     * or "pending".
     * * `toBlock`: `QUANTITY | TAG` (optional) - Integer block number, or the string "latest", "earliest"
     * or "pending".
     * * `address`: `DATA | Array` (optional) - Contract address or a list of addresses from which the logs should originate.
     * * `topics`: `Array of DATA` (optional) - Array of 32 Bytes `DATA` topcis. Topics are order-dependent. Each topic can also
     * be an array of `DATA` with "or" options.
     *
     * @param filter The filter options as seen in source.
     *
     * @returns A filter id.
     * @example
     * ```javascript
     * const filterId = await provider.request({ method: "eth_newFilter", params: [] });
     * console.log(filterId);
     * ```
     */
    eth_newFilter(filter?: RangeFilterArgs): Promise<Quantity>;
    /**
     * Polling method for a filter, which returns an array of logs, block hashes,
     * or transaction hashes, depending on the filter type, which occurred since
     * last poll.
     *
     * @param filterId The filter id.
     * @returns An array of logs, block hashes, or transaction hashes, depending
     * on the filter type, which occurred since last poll.
     *
     * For filters created with `eth_newBlockFilter` the return are block hashes (`DATA`, 32 Bytes).
     *
     * For filters created with `eth_newPendingTransactionFilter` the return are transaction hashes (`DATA`, 32 Bytes).
     *
     * For filters created with `eth_newFilter` the return are log objects with the following parameters:
     * * `removed`: `TAG` - `true` when the log was removed, `false` if its a valid log.
     * * `logIndex`: `QUANTITY` - Integer of the log index position in the block. `null` when pending.
     * * `transactionIndex`: `QUANTITY` - Integer of the transactions index position. `null` when pending.
     * * `transactionHash`: `DATA`, 32 Bytes - Hash of the transaction where the log was. `null` when pending.
     * * `blockHash`: `DATA`, 32 Bytes - Hash of the block where the log was. `null` when pending.
     * * `blockNumber`: `QUANTITY` - The block number where the log was in. `null` when pending.
     * * `address`: `DATA`, 20 Bytes - The address from which the log originated.
     * * `data`: `DATA` - Contains one or more 32 Bytes non-indexed arguments of the log.
     * * `topics`: `Array of DATA` - Array of 0 to 4 32 Bytes `DATA` of indexed log arguments.
     *
     * @example
     * ```javascript
     * // Logs.sol
     * // // SPDX-License-Identifier: MIT
     * // pragma solidity ^0.7.4;
     * // contract Logs {
     * //   event Event(uint256 indexed first, uint256 indexed second);
     * //   constructor() {
     * //     emit Event(1, 2);
     * //   }
     * //
     * //   function logNTimes(uint8 n) public {
     * //     for (uint8 i = 0; i < n; i++) {
     * //       emit Event(i, i);
     * //     }
     * //   }
     * // }
     *
     * const logsContract = "0x608060405234801561001057600080fd5b50600260017f34e802e5ebd1f132e05852c5064046c1b535831ec52f1c4997fc6fdc4d5345b360405160405180910390a360e58061004f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80635e19e69f14602d575b600080fd5b605960048036036020811015604157600080fd5b81019080803560ff169060200190929190505050605b565b005b60005b8160ff168160ff16101560ab578060ff168160ff167f34e802e5ebd1f132e05852c5064046c1b535831ec52f1c4997fc6fdc4d5345b360405160405180910390a38080600101915050605e565b505056fea26469706673582212201af9c13c7b00e2b628c1258d45f9f62d2aad8cd32fc32fd9515d8ad1e792679064736f6c63430007040033";
     * const [from] = await provider.send("eth_accounts");
     * const filterId = await provider.send("eth_newFilter");
     *
     * const subscriptionId = await provider.send("eth_subscribe", ["newHeads"]);
     * await provider.send("eth_sendTransaction", [{ from, data: logsContract, gas: "0x5b8d80" }] );
     * await provider.once("message");
     *
     * const changes = await provider.request({ method: "eth_getFilterChanges", params: [filterId] });
     * console.log(changes);
     *
     * await provider.send("eth_unsubscribe", [subscriptionId]);
     * ```
     */
    eth_getFilterChanges(filterId: QUANTITY): Promise<Data[]>;
    /**
     * Uninstalls a filter with given id. Should always be called when watch is
     * no longer needed.
     *
     * @param filterId The filter id.
     * @returns `true` if the filter was successfully uninstalled, otherwise
     * `false`.
     * @example
     * ```javascript
     * const filterId = await provider.request({ method: "eth_newFilter", params: [] });
     * const result = await provider.request({ method: "eth_uninstallFilter", params: [filterId] });
     * console.log(result);
     * ```
     */
    eth_uninstallFilter(filterId: QUANTITY): Promise<boolean>;
    /**
     * Returns an array of all logs matching filter with given id.
     *
     * @param filterId The filter id.
     * @returns Array of log objects, or an empty array.
     * @example
     * ```javascript
     * // Logs.sol
     * // // SPDX-License-Identifier: MIT
     * // pragma solidity ^0.7.4;
     * // contract Logs {
     * //   event Event(uint256 indexed first, uint256 indexed second);
     * //   constructor() {
     * //     emit Event(1, 2);
     * //   }
     * //
     * //   function logNTimes(uint8 n) public {
     * //     for (uint8 i = 0; i < n; i++) {
     * //       emit Event(i, i);
     * //     }
     * //   }
     * // }
     *
     * const logsContract = "0x608060405234801561001057600080fd5b50600260017f34e802e5ebd1f132e05852c5064046c1b535831ec52f1c4997fc6fdc4d5345b360405160405180910390a360e58061004f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80635e19e69f14602d575b600080fd5b605960048036036020811015604157600080fd5b81019080803560ff169060200190929190505050605b565b005b60005b8160ff168160ff16101560ab578060ff168160ff167f34e802e5ebd1f132e05852c5064046c1b535831ec52f1c4997fc6fdc4d5345b360405160405180910390a38080600101915050605e565b505056fea26469706673582212201af9c13c7b00e2b628c1258d45f9f62d2aad8cd32fc32fd9515d8ad1e792679064736f6c63430007040033";
     * const [from] = await provider.send("eth_accounts");
     * const filterId = await provider.send("eth_newFilter");
     *
     * await provider.send("eth_subscribe", ["newHeads"]);
     * await provider.send("eth_sendTransaction", [{ from, data: logsContract, gas: "0x5b8d80" }] );
     * await provider.once("message");
     *
     * const logs = await provider.request({ method: "eth_getFilterLogs", params: [filterId] });
     * console.log(logs);
     * ```
     */
    eth_getFilterLogs(filterId: QUANTITY): Promise<{
        address: Address;
        blockHash: Data;
        blockNumber: Quantity;
        data: Data | Data[];
        logIndex: Quantity;
        removed: boolean;
        topics: Data | Data[]; /**
         * This is the Ethereum API that the provider interacts with.
         * The only methods permitted on the prototype are the supported json-rpc
         * methods.
         * @param options
         * @param wallet
         * @param emitter
         */
        transactionHash: Data;
        transactionIndex: Quantity;
    }[]>;
    /**
     * Returns an array of all logs matching a given filter object.
     *
     * Filter options:
     * * `fromBlock`: `QUANTITY | TAG` (optional) - Integer block number, or the string "latest", "earliest"
     * or "pending".
     * * `toBlock`: `QUANTITY | TAG` (optional) - Integer block number, or the string "latest", "earliest"
     * or "pending".
     * * `address`: `DATA | Array` (optional) - Contract address or a list of addresses from which the logs should originate.
     * * `topics`: `Array of DATA` (optional) - Array of 32 Bytes `DATA` topcis. Topics are order-dependent. Each topic can also
     * be an array of `DATA` with "or" options.
     * * `blockHash`: `DATA`, 32 Bytes (optional) - Hash of the block to restrict logs from. If `blockHash` is present,
     * then neither `fromBlock` or `toBlock` are allowed.
     *
     * @param filter The filter options as seen in source.
     * @returns Array of log objects, or an empty array.
     * @example
     * ```javascript
     * // Logs.sol
     * // // SPDX-License-Identifier: MIT
     * // pragma solidity ^0.7.4;
     * // contract Logs {
     * //   event Event(uint256 indexed first, uint256 indexed second);
     * //   constructor() {
     * //     emit Event(1, 2);
     * //   }
     * //
     * //   function logNTimes(uint8 n) public {
     * //     for (uint8 i = 0; i < n; i++) {
     * //       emit Event(i, i);
     * //     }
     * //   }
     * // }
     *
     * const logsContract = "0x608060405234801561001057600080fd5b50600260017f34e802e5ebd1f132e05852c5064046c1b535831ec52f1c4997fc6fdc4d5345b360405160405180910390a360e58061004f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80635e19e69f14602d575b600080fd5b605960048036036020811015604157600080fd5b81019080803560ff169060200190929190505050605b565b005b60005b8160ff168160ff16101560ab578060ff168160ff167f34e802e5ebd1f132e05852c5064046c1b535831ec52f1c4997fc6fdc4d5345b360405160405180910390a38080600101915050605e565b505056fea26469706673582212201af9c13c7b00e2b628c1258d45f9f62d2aad8cd32fc32fd9515d8ad1e792679064736f6c63430007040033";
     * const [from] = await provider.send("eth_accounts");
     *
     * await provider.send("eth_subscribe", ["newHeads"]);
     * const txHash = await provider.send("eth_sendTransaction", [{ from, data: logsContract, gas: "0x5b8d80" }] );
     * await provider.once("message");
     *
     * const { contractAddress } = await provider.send("eth_getTransactionReceipt", [txHash] );
     *
     * const logs = await provider.request({ method: "eth_getLogs", params: [{ address: contractAddress }] });
     * console.log(logs);
     * ```
     */
    eth_getLogs(filter: FilterArgs): Promise<{
        address: Address;
        blockHash: Data;
        blockNumber: Quantity;
        data: Data | Data[];
        logIndex: Quantity;
        removed: boolean;
        topics: Data | Data[]; /**
         * This is the Ethereum API that the provider interacts with.
         * The only methods permitted on the prototype are the supported json-rpc
         * methods.
         * @param options
         * @param wallet
         * @param emitter
         */
        transactionHash: Data;
        transactionIndex: Quantity;
    }[]>;
    /**
     * Returns the number of transactions sent from an address.
     *
     * @param address `DATA`, 20 Bytes - The address to get number of transactions sent from
     * @param blockNumber Integer block number, or the string "latest", "earliest"
     * or "pending".
     * @returns Number of transactions sent from this address.
     * @example
     * ```javascript
     * const [from, to] = await provider.request({ method: "eth_accounts", params: [] });
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * await provider.request({ method: "eth_sendTransaction", params: [{ from, to, gas: "0x5b8d80" }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     *
     * const txCount = await provider.request({ method: "eth_getTransactionCount", params: [ from, "latest" ] });
     * console.log(txCount);
     * ```
     */
    eth_getTransactionCount(address: DATA, blockNumber?: QUANTITY | Tag): Promise<Quantity>;
    /**
     * Executes a new message call immediately without creating a transaction on the block chain.
     *
     * Transaction call object:
     * * `from`: `DATA`, 20 bytes (optional) - The address the transaction is sent from.
     * * `to`: `DATA`, 20 bytes - The address the transaction is sent to.
     * * `gas`: `QUANTITY` (optional) - Integer of the maximum gas allowance for the transaction.
     * * `gasPrice`: `QUANTITY` (optional) - Integer of the price of gas in wei.
     * * `value`: `QUANTITY` (optional) - Integer of the value in wei.
     * * `data`: `DATA` (optional) - Hash of the method signature and the ABI encoded parameters.
     *
     * @param transaction - The transaction call object as seen in source.
     * @param blockNumber Integer block number, or the string "latest", "earliest"
     *  or "pending".
     *
     * @returns The return value of executed contract.
     * @example
     * ```javascript
     * // Simple.sol
     * // // SPDX-License-Identifier: MIT
     * //  pragma solidity ^0.7.4;
     * //
     * //  contract Simple {
     * //      uint256 public value;
     * //      constructor() payable {
     * //          value = 5;
     * //      }
     * //  }
     * const simpleSol = "0x6080604052600560008190555060858060196000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633fa4f24514602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000548156fea26469706673582212200897f7766689bf7a145227297912838b19bcad29039258a293be78e3bf58e20264736f6c63430007040033";
     * const [from] = await provider.request({ method: "eth_accounts", params: [] });
     * const txObj = { from, gas: "0x5b8d80", gasPrice: "0x1dfd14000", value:"0x0", data: simpleSol };
     * const result = await provider.request({ method: "eth_call", params: [txObj, "latest"] });
     * console.log(result);
     * ```
     */
    eth_call(transaction: any, blockNumber?: QUANTITY | Tag): Promise<Data>;
    /**
     * Attempt to run the transaction in the exact same manner as it was executed
     * on the network. It will replay any transaction that may have been executed
     * prior to this one before it will finally attempt to execute the transaction
     * that corresponds to the given hash.
     *
     * In addition to the hash of the transaction you may give it a secondary
     * optional argument, which specifies the options for this specific call.
     * The possible options are:
     *
     * * `disableStorage`: \{boolean\} Setting this to `true` will disable storage capture (default = `false`).
     * * `disableMemory`: \{boolean\} Setting this to `true` will disable memory capture (default = `false`).
     * * `disableStack`: \{boolean\} Setting this to `true` will disable stack capture (default = `false`).
     *
     * @param transactionHash Hash of the transaction to trace.
     * @param options - See options in source.
     * @returns Returns the `gas`, `structLogs`, and `returnValue` for the traced transaction.
     *
     * The `structLogs` are an array of logs, which contains the following fields:
     * * `depth`: The execution depth.
     * * `error`: Information about an error, if one occurred.
     * * `gas`: The number of gas remaining.
     * * `gasCost`: The cost of gas in wei.
     * * `memory`: An array containing the contract's memory data.
     * * `op`: The current opcode.
     * * `pc`: The current program counter.
     * * `stack`: The EVM execution stack.
     * * `storage`: An object containing the contract's storage data.
     *
     * @example
     * ```javascript
     * // Simple.sol
     * // // SPDX-License-Identifier: MIT
     * //  pragma solidity ^0.7.4;
     * //
     * //  contract Simple {
     * //      uint256 public value;
     * //      constructor() payable {
     * //          value = 5;
     * //      }
     * //  }
     * const simpleSol = "0x6080604052600560008190555060858060196000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633fa4f24514602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000548156fea26469706673582212200897f7766689bf7a145227297912838b19bcad29039258a293be78e3bf58e20264736f6c63430007040033";
     * const [from] = await provider.request({ method: "eth_accounts", params: [] });
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const txHash = await provider.request({ method: "eth_sendTransaction", params: [{ from, gas: "0x5b8d80", data: simpleSol }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     * const transactionTrace = await provider.request({ method: "debug_traceTransaction", params: [txHash] });
     * console.log(transactionTrace);
     * ```
     */
    debug_traceTransaction(transactionHash: DATA, options?: TransactionTraceOptions): Promise<TraceTransactionResult>;
    /**
     * Attempts to replay the transaction as it was executed on the network and
     * return storage data given a starting key and max number of entries to return.
     *
     * @param blockHash Hash of a block.
     * @param transactionIndex Integer of the transaction index position.
     * @param contractAddress Address of the contract.
     * @param startKey Hash of the start key for grabbing storage entries.
     * @param maxResult Integer of maximum number of storage entries to return.
     * @returns Returns a storage object with the keys being keccak-256 hashes of the storage keys,
     * and the values being the raw, unhashed key and value for that specific storage slot. Also
     * returns a next key which is the keccak-256 hash of the next key in storage for continuous downloading.
     * @example
     * ```javascript
     * // Simple.sol
     * // // SPDX-License-Identifier: MIT
     * //  pragma solidity ^0.7.4;
     * //
     * //  contract Simple {
     * //      uint256 public value;
     * //      constructor() payable {
     * //          value = 5;
     * //      }
     * //  }
     * const simpleSol = "0x6080604052600560008190555060858060196000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633fa4f24514602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000548156fea26469706673582212200897f7766689bf7a145227297912838b19bcad29039258a293be78e3bf58e20264736f6c63430007040033";
     * const [from] = await provider.request({ method: "eth_accounts", params: [] });
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const initialTxHash = await provider.request({ method: "eth_sendTransaction", params: [{ from, gas: "0x5b8d80", data: simpleSol }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     *
     * const {contractAddress} = await provider.request({ method: "eth_getTransactionReceipt", params: [initialTxHash] });
     *
     * // set value to 19
     * const data = "0x552410770000000000000000000000000000000000000000000000000000000000000019";
     * const txHash = await provider.request({ method: "eth_sendTransaction", params: [{ from, to: contractAddress, data }] });
     * await provider.once("message"); // Note: `await provider.once` is non-standard
     *
     * const { blockHash, transactionIndex } = await provider.request({ method: "eth_getTransactionReceipt", params: [txHash] });
     * const storage = await provider.request({ method: "debug_storageRangeAt", params: [blockHash, transactionIndex, contractAddress, "0x01", 1] });
     * console.log(storage);
     * ```
     */
    debug_storageRangeAt(blockHash: DATA, transactionIndex: number, contractAddress: DATA, startKey: DATA, maxResult: number): Promise<StorageRangeResult>;
    /**
     * Returns all the Ethereum account addresses of all keys that have been
     * added.
     * @returns The Ethereum account addresses of all keys that have been added.
     * @example
     * ```javascript
     * console.log(await provider.send("personal_listAccounts"));
     * ```
     */
    personal_listAccounts(): Promise<string[]>;
    /**
     * Generates a new account with private key. Returns the address of the new
     * account.
     * @param passphrase The passphrase to encrypt the private key with.
     * @returns The new account's address.
     * @example
     * ```javascript
     * const passphrase = "passphrase";
     * const address = await provider.send("personal_newAccount", [passphrase] );
     * console.log(address);
     * ```
     */
    personal_newAccount(passphrase: string): Promise<Address>;
    /**
     * Imports the given unencrypted private key (hex string) into the key store, encrypting it with the passphrase.
     *
     * @param rawKey The raw, unencrypted private key to import.
     * @param passphrase The passphrase to encrypt with.
     * @returns Returns the address of the new account.
     * @example
     * ```javascript
     * const rawKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
     * const passphrase = "passphrase";
     *
     * const address = await provider.send("personal_importRawKey",[rawKey, passphrase] );
     * console.log(address);
     * ```
     */
    personal_importRawKey(rawKey: DATA, passphrase: string): Promise<Address>;
    /**
     * Locks the account. The account can no longer be used to send transactions.
     * @param address The account address to be locked.
     * @returns Returns `true` if the account was locked, otherwise `false`.
     * @example
     * ```javascript
     * const [account] = await provider.send("personal_listAccounts");
     * const isLocked = await provider.send("personal_lockAccount", [account] );
     * console.log(isLocked);
     * ```
     */
    personal_lockAccount(address: DATA): Promise<boolean>;
    /**
     * Unlocks the account for use.
     *
     * The unencrypted key will be held in memory until the unlock duration
     * expires. The unlock duration defaults to 300 seconds. An explicit duration
     * of zero seconds unlocks the key until geth exits.
     *
     * The account can be used with `eth_sign` and `eth_sendTransaction` while it is
     * unlocked.
     * @param address - 20 Bytes - The address of the account to unlock.
     * @param passphrase - Passphrase to unlock the account.
     * @param duration - (default: 300) Duration in seconds how long the account
     * should remain unlocked for. Set to 0 to disable automatic locking.
     * @returns `true` if it worked. Throws an error or returns `false` if it did not.
     * @example
     * ```javascript
     * // generate an account
     * const passphrase = "passphrase";
     * const newAccount = await provider.send("personal_newAccount", [passphrase] );
     * const isUnlocked = await provider.send("personal_unlockAccount", [newAccount, passphrase] );
     * console.log(isUnlocked);
     * ```
     */
    personal_unlockAccount(address: DATA, passphrase: string, duration?: number): Promise<boolean>;
    /**
     * Validate the given passphrase and submit transaction.
     *
     * The transaction is the same argument as for `eth_sendTransaction` and
     * contains the from address. If the passphrase can be used to decrypt the
     * private key belonging to `tx.from` the transaction is verified, signed and
     * send onto the network. The account is not unlocked globally in the node
     * and cannot be used in other RPC calls.
     *
     * Transaction call object:
     * * `from`: `DATA`, 20 bytes (optional) - The address the transaction is sent from.
     * * `to`: `DATA`, 20 bytes - The address the transaction is sent to.
     * * `gas`: `QUANTITY` (optional) - Integer of the maximum gas allowance for the transaction.
     * * `gasPrice`: `QUANTITY` (optional) - Integer of the price of gas in wei.
     * * `value`: `QUANTITY` (optional) - Integer of the value in wei.
     * * `data`: `DATA` (optional) - Hash of the method signature and the ABI encoded parameters.
     *
     * @param txData - The transaction call object as seen in source.
     * @param passphrase - The passphrase to decrpyt the private key belonging to `tx.from`.
     * @returns The transaction hash or if unsuccessful an error.
     * @example
     * ```javascript
     * const passphrase = "passphrase";
     * const newAccount = await provider.send("personal_newAccount", [passphrase] );
     * const [to] = await provider.send("personal_listAccounts");
     *
     * // use account and passphrase to send the transaction
     * const txHash = await provider.send("personal_sendTransaction", [{ from: newAccount, to, gasLimit: "0x5b8d80" }, passphrase] );
     * console.log(txHash);
     * ```
     */
    personal_sendTransaction(transaction: TypedRpcTransaction, passphrase: string): Promise<Data>;
    /**
     * Validates the given passphrase and signs a transaction that can be
     * submitted to the network at a later time using `eth_sendRawTransaction`.
     *
     * The transaction is the same argument as for `eth_signTransaction` and
     * contains the from address. If the passphrase can be used to decrypt the
     * private key belonging to `tx.from` the transaction is verified and signed.
     * The account is not unlocked globally in the node and cannot be used in other RPC calls.
     *
     * Transaction call object:
     * * `from`: `DATA`, 20 bytes (optional) - The address the transaction is sent from.
     * * `to`: `DATA`, 20 bytes - The address the transaction is sent to.
     * * `gas`: `QUANTITY` (optional) - Integer of the maximum gas allowance for the transaction.
     * * `gasPrice`: `QUANTITY` (optional) - Integer of the price of gas in wei.
     * * `value`: `QUANTITY` (optional) - Integer of the value in wei.
     * * `data`: `DATA` (optional) - Hash of the method signature and the ABI encoded parameters.
     *
     * @param transaction - The transaction call object as seen in source.
     * @returns The raw, signed transaction.
     * @example
     * ```javascript
     * const [to] = await provider.request({ method: "eth_accounts", params: [] });
     * const passphrase = "passphrase";
     * const from = await provider.send("personal_newAccount", [passphrase] );
     * await provider.request({ method: "eth_subscribe", params: ["newHeads"] });
     * const signedTx = await provider.request({ method: "personal_signTransaction", params: [{ from, to }, passphrase] });
     * console.log(signedTx)
     * ```
     */
    personal_signTransaction(transaction: TypedRpcTransaction, passphrase: string): Promise<string>;
    /**
     * Returns object of RPC modules.
     * @returns RPC modules.
     * @example
     * ```javascript
     * console.log(await provider.send("rpc_modules"));
     * ```
     */
    rpc_modules(): Promise<{
        readonly eth: "1.0";
        readonly net: "1.0";
        readonly rpc: "1.0";
        readonly web3: "1.0";
        readonly evm: "1.0";
        readonly personal: "1.0";
    }>;
    /**
     * Creates new whisper identity in the client.
     *
     * @returns - The address of the new identity.
     * @example
     * ```javascript
     * console.log(await provider.send("shh_newIdentity"));
     * ```
     */
    shh_newIdentity(): Promise<string>;
    /**
     * Checks if the client hold the private keys for a given identity.
     *
     * @param address - The identity address to check.
     * @returns Returns `true` if the client holds the private key for that identity, otherwise `false`.
     * @example
     * ```javascript
     * console.log(await provider.send("shh_hasIdentity", ["0x0"] ));
     * ```
     */
    shh_hasIdentity(address: DATA): Promise<boolean>;
    /**
     * Creates a new group.
     *
     * @returns The address of the new group.
     */
    shh_newGroup(): Promise<string>;
    /**
     * Adds a whisper identity to the group.
     *
     * @param address - The identity address to add to a group.
     * @returns `true` if the identity was successfully added to the group, otherwise `false`.
     * @example
     * ```javascript
     * console.log(await provider.send("shh_addToGroup", ["0x0"] ));
     * ```
     */
    shh_addToGroup(address: DATA): Promise<boolean>;
    /**
     * Creates filter to notify, when client receives whisper message matching the filter options.
     *
     * @param to - (optional) Identity of the receiver. When present it will try to decrypt any incoming message
     *  if the client holds the private key to this identity.
     * @param topics - Array of topics which the incoming message's topics should match.
     * @returns Returns `true` if the identity was successfully added to the group, otherwise `false`.
     * @example
     * ```javascript
     * console.log(await provider.send("shh_newFilter", ["0x0", []] ));
     * ```
     */
    shh_newFilter(to: DATA, topics: DATA[]): Promise<boolean>;
    /**
     * Uninstalls a filter with given id. Should always be called when watch is no longer needed.
     * Additionally filters timeout when they aren't requested with `shh_getFilterChanges` for a period of time.
     *
     * @param id - The filter id. Ex: "0x7"
     * @returns `true` if the filter was successfully uninstalled, otherwise `false`.
     * @example
     * ```javascript
     * console.log(await provider.send("shh_uninstallFilter", ["0x0"] ));
     * ```
     */
    shh_uninstallFilter(id: QUANTITY): Promise<boolean>;
    /**
     * Polling method for whisper filters. Returns new messages since the last call of this method.
     *
     * @param id - The filter id. Ex: "0x7"
     * @returns More Info: https://github.com/ethereum/wiki/wiki/JSON-RPC#shh_getfilterchanges
     * @example
     * ```javascript
     * console.log(await provider.send("shh_getFilterChanges", ["0x0"] ));
     * ```
     */
    shh_getFilterChanges(id: QUANTITY): Promise<any[]>;
    /**
     * Get all messages matching a filter. Unlike shh_getFilterChanges this returns all messages.
     *
     * @param id - The filter id. Ex: "0x7"
     * @returns See: `shh_getFilterChanges`.
     * @example
     * ```javascript
     * console.log(await provider.send("shh_getMessages", ["0x0"] ));
     * ```
     */
    shh_getMessages(id: QUANTITY): Promise<boolean>;
    /**
     * Creates a whisper message and injects it into the network for distribution.
     *
     * @param postData
     * @returns Returns `true` if the message was sent, otherwise `false`.
     * @example
     * ```javascript
     * console.log(await provider.send("shh_post", [{}] ));
     * ```
     */
    shh_post(postData: WhisperPostObject): Promise<boolean>;
    /**
     * Returns the current whisper protocol version.
     *
     * @returns The current whisper protocol version.
     * @example
     * ```javascript
     * console.log(await provider.send("shh_version"));
     * ```
     */
    shh_version(): Promise<string>;
}
export {};
//# sourceMappingURL=api.d.ts.map