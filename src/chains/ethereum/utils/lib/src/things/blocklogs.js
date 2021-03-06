"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockLogs = void 0;
const utils_1 = require("@ganache/utils");
const utils_2 = require("@ganache/utils");
const rlp_1 = require("@ganache/rlp");
const ethereum_address_1 = require("@ganache/ethereum-address");
const _raw = Symbol("raw");
const _logs = Symbol("logs");
const filterByTopic = (expectedTopics, logTopics) => {
    // Exclude log if its number of topics is less than the number expected
    if (expectedTopics.length > logTopics.length)
        return false;
    // for every expectedTopic, we must much the log topic in the same position
    return expectedTopics.every((expectedTopic, logPosition) => {
        // a `null` topic means "anything"
        if (expectedTopic === null)
            return true;
        let expectedTopicSet;
        if (!Array.isArray(expectedTopic)) {
            return logTopics[logPosition].equals(utils_1.Data.from(expectedTopic).toBuffer());
        }
        // an empty rule set means "anything"
        if (expectedTopic.length === 0)
            return true;
        expectedTopicSet = expectedTopic;
        const logTopic = logTopics[logPosition];
        // "OR" logic, e.g., [[A, B]] means log topic in the first position matching either "A" OR "B":
        return expectedTopicSet.some(expectedTopic => logTopic.equals(utils_1.Data.from(expectedTopic).toBuffer()));
    });
};
class BlockLogs {
    constructor(data) {
        if (data) {
            const decoded = rlp_1.decode(data);
            this[_raw] = decoded;
        }
    }
    /**
     *
     * @param blockHash Creates an BlogLogs entity with an empty internal logs
     * array.
     */
    static create(blockHash) {
        const blockLog = Object.create(BlockLogs.prototype);
        blockLog[_raw] = [blockHash.toBuffer(), []];
        return blockLog;
    }
    /**
     * rlpEncode's the blockHash and logs array for db storage
     */
    serialize() {
        return rlp_1.encode(this[_raw]);
    }
    /**
     * Appends the data to the internal logs array
     * @param transactionIndex
     * @param transactionHash
     * @param log
     */
    append(
    /*removed: boolean, */ transactionIndex, transactionHash, log) {
        this[_raw][1].push([
            utils_2.BUFFER_ZERO,
            transactionIndex.toBuffer(),
            transactionHash.toBuffer(),
            log[0],
            log[1],
            log[2] // `data`
        ]);
    }
    /**
     * Returns the number of logs in the internal logs array.
     */
    get length() {
        return this[_raw][1].length;
    }
    static fromJSON(json) {
        if (!json || json.length === 0) {
            return null;
        }
        const blockHash = json[0].blockHash;
        const blockNumber = json[0].blockNumber;
        const blockLogs = BlockLogs.create(utils_1.Data.from(blockHash, 32));
        blockLogs.blockNumber = utils_1.Quantity.from(blockNumber);
        json.forEach(log => {
            const address = ethereum_address_1.Address.from(log.address);
            const blockNumber = log.blockNumber;
            const data = Array.isArray(log.data)
                ? log.data.map(d => utils_1.Data.from(d).toBuffer())
                : utils_1.Data.from(log.data).toBuffer();
            const logIndex = log.logIndex;
            const removed = log.removed === false ? utils_2.BUFFER_ZERO : utils_2.RPCQUANTITY_ONE.toBuffer();
            const topics = Array.isArray(log.topics)
                ? log.topics.map(t => utils_1.Data.from(t, 32).toBuffer())
                : utils_1.Data.from(log.topics, 32).toBuffer();
            const transactionHash = utils_1.Data.from(log.transactionHash, 32);
            const transactionIndex = utils_1.Quantity.from(log.transactionIndex);
            blockLogs.append(transactionIndex, transactionHash, [
                address.toBuffer(),
                topics,
                data
            ]);
        });
        return blockLogs;
    }
    toJSON() {
        return this[_logs]().toJSON();
    }
    [_logs]() {
        const blockNumber = this.blockNumber;
        const raw = this[_raw];
        const logs = raw[1];
        const l = this.length;
        const blockHash = utils_1.Data.from(raw[0]);
        return {
            toJSON() {
                return {
                    *[Symbol.iterator]() {
                        for (let i = 0; i < l; i++) {
                            yield BlockLogs.logToJSON(logs[i], utils_1.Quantity.from(i), blockHash, blockNumber);
                        }
                    }
                };
            },
            *[Symbol.iterator]() {
                for (let i = 0; i < l; i++) {
                    const log = logs[i];
                    const address = log[3];
                    const topics = log[4];
                    yield {
                        address,
                        topics,
                        toJSON: () => BlockLogs.logToJSON(log, utils_1.Quantity.from(i), blockHash, blockNumber)
                    };
                }
            }
        };
    }
    /**
     *
     * @param log
     * @param logIndex The index this log appears in the block
     * @param blockHash The hash of the block
     * @param blockNumber The block number
     */
    static logToJSON(log, logIndex, blockHash, blockNumber) {
        const topics = log[4];
        const data = log[5];
        return {
            address: ethereum_address_1.Address.from(log[3]),
            blockHash,
            blockNumber,
            data: Array.isArray(data)
                ? data.map(d => utils_1.Data.from(d, d.length))
                : utils_1.Data.from(data, data.length),
            logIndex,
            removed: log[0].equals(utils_2.BUFFER_ZERO) ? false : true,
            topics: Array.isArray(topics)
                ? topics.map(t => utils_1.Data.from(t, 32))
                : utils_1.Data.from(topics, 32),
            transactionHash: utils_1.Data.from(log[2], 32),
            transactionIndex: utils_1.Quantity.from(log[1])
        };
    }
    /**
     * Note: you must set `this.blockNumber: Quantity` first!
     *
     * Topics are order-dependent. A transaction with a log with topics [A, B] will be matched by the following topic
     * filters:
     *  ??? [] "anything"
     *  ??? [A] "A in first position (and anything after)"
     *  ??? [null, B] "anything in first position AND B in second position (and anything after)"
     *  ??? [A, B] "A" in first position AND B in second position (and anything after)"
     *  ??? [[A, B], [A, B]] "(A OR B) in first position AND (A OR B) in second position (and anything after)"
     * @param expectedAddresses
     * @param expectedTopics
     * @returns JSON representation of the filtered logs
     */
    *filter(expectedAddresses, expectedTopics) {
        const logs = this[_logs]();
        if (expectedAddresses.length !== 0) {
            if (expectedTopics.length === 0) {
                for (const log of logs) {
                    if (expectedAddresses.some(address => address.equals(log.address)))
                        yield log.toJSON();
                }
            }
            else {
                for (const log of logs) {
                    if (!expectedAddresses.some(address => address.equals(log.address)))
                        continue;
                    if (filterByTopic(expectedTopics, log.topics))
                        yield log.toJSON();
                }
            }
        }
        else if (expectedTopics.length !== 0) {
            for (const log of logs) {
                if (filterByTopic(expectedTopics, log.topics))
                    yield log.toJSON();
            }
        }
        else {
            yield* logs.toJSON();
        }
    }
}
exports.BlockLogs = BlockLogs;
//# sourceMappingURL=blocklogs.js.map