"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockByNumber = exports.findClosestDescendants = exports.findClosestAncestor = exports.findRelated = exports.resolveTargetAndClosestAncestor = exports.setDbVersion = exports.getBlockNumberFromParams = void 0;
const ethereum_utils_1 = require("@ganache/ethereum-utils");
const utils_1 = require("@ganache/utils");
const tree_1 = require("./tree");
function getBlockNumberFromParams(method, params) {
    // get the request's block number
    switch (method) {
        case "eth_getBlockByNumber":
            return params[0];
        case "eth_getTransactionCount":
        case "eth_getCode":
        case "eth_getBalance":
            return params[1];
        case "eth_getStorageAt":
            return params[2];
        default:
            return null;
    }
}
exports.getBlockNumberFromParams = getBlockNumberFromParams;
async function setDbVersion(db, version) {
    // set the version if the DB was just created, or error if we already have
    // a version, but it isn't what we expected
    try {
        const recordedVersion = await db.get("version");
        if (!version.equals(recordedVersion)) {
            // in the future this is where database migrations would go
            throw new Error(`Persistent cache version "${version.toString()}"" is not understood.`);
        }
    }
    catch (e) {
        if (!e.notFound)
            throw e;
        // if we didn't have a `version` key we need to set one
        await db.put("version", version);
    }
}
exports.setDbVersion = setDbVersion;
async function resolveTargetAndClosestAncestor(db, request, targetHeight, targetHash) {
    let targetBlock;
    let closestAncestor;
    let previousClosestAncestor;
    try {
        const key = tree_1.Tree.encodeKey(targetHeight, targetHash);
        targetBlock = tree_1.Tree.deserialize(key, await db.get(key));
        if (targetBlock.closestKnownAncestor.equals(utils_1.BUFFER_EMPTY)) {
            // we are the genesis/earliest block
            closestAncestor = null;
            previousClosestAncestor = null;
        }
        else {
            previousClosestAncestor = tree_1.Tree.deserialize(targetBlock.closestKnownAncestor, await db.get(targetBlock.closestKnownAncestor));
            // check if we are still the closest known ancestor
            closestAncestor =
                (await findClosestAncestor(db, request, targetHeight, previousClosestAncestor.key)) || previousClosestAncestor;
        }
    }
    catch (e) {
        // something bad happened (I/O failure?), bail
        if (!e.notFound)
            throw e;
        previousClosestAncestor = null;
        // we couldn't find our target block in the database so we need to figure
        // out it's relationships via the blockchain.
        // In order to avoid requesting the "earliest" block unnecessarily, we
        // assume the "earliest" block can't be before block 0 (which seems like a
        // reasonable assumption to me!).
        // If our target is block `0` then we can't have a closest ancestor since
        // we are the first block
        if (targetHeight.toBigInt() === 0n) {
            closestAncestor = null;
            targetBlock = new tree_1.Tree(targetHeight, targetHash);
        }
        else {
            const earliestBlock = await getBlockByNumber(request, ethereum_utils_1.Tag.EARLIEST);
            if (!earliestBlock)
                throw new Error('Could not find "earliest" block.');
            const { hash: earliestHash, number: earliestNumber } = earliestBlock;
            const hash = utils_1.Data.from(earliestHash, 32);
            const earliest = new tree_1.Tree(utils_1.Quantity.from(earliestNumber), hash);
            closestAncestor =
                (await findClosestAncestor(db, request, targetHeight, earliest.key)) ||
                    earliest;
            targetBlock = new tree_1.Tree(targetHeight, targetHash, closestAncestor.key);
        }
    }
    return {
        targetBlock,
        closestAncestor,
        previousClosestAncestor
    };
}
exports.resolveTargetAndClosestAncestor = resolveTargetAndClosestAncestor;
async function* findRelated(db, request, options) {
    const readStream = db.createReadStream({
        keys: true,
        values: true,
        ...options
    });
    for await (const pair of readStream) {
        const { key, value } = pair;
        const node = tree_1.Tree.deserialize(key, value);
        const { height: candidateHeight } = node.decodeKey();
        const block = await getBlockByNumber(request, candidateHeight);
        // if the chain has a block at this height, and the hash of the
        // block is the same as the one in the db we've found our closest
        // ancestor!
        if (block != null && block.hash === utils_1.Data.from(node.hash).toString()) {
            yield node;
        }
    }
}
exports.findRelated = findRelated;
/**
 *
 * @param height Search only before this block height (exclusive)
 * @param upTo Search up to this key (inclusive)
 * @returns the closest known ancestor, or `upTo` if we know of no ancestors
 */
async function findClosestAncestor(db, request, height, upTo) {
    const generator = findRelated(db, request, {
        gte: upTo,
        lt: tree_1.Tree.encodeKey(height, utils_1.DATA_EMPTY),
        reverse: true
    });
    const first = await generator.next();
    await generator.return();
    return first.value;
}
exports.findClosestAncestor = findClosestAncestor;
/**
 *
 * @param height Search only after this block height (exclusive)
 * @returns the closest known descendants, or null
 */
async function* findClosestDescendants(db, request, height) {
    const generator = findRelated(db, request, {
        gte: tree_1.Tree.encodeKey(utils_1.Quantity.from(height.toBigInt() + 1n), utils_1.DATA_EMPTY),
        reverse: false
    });
    for await (const node of generator) {
        yield node;
    }
}
exports.findClosestDescendants = findClosestDescendants;
async function getBlockByNumber(request, blockNumber) {
    return await request("eth_getBlockByNumber", [blockNumber.toString(), false]);
}
exports.getBlockByNumber = getBlockByNumber;
//# sourceMappingURL=helpers.js.map