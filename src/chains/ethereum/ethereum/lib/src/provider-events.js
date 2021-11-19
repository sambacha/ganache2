"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeStepEvent = void 0;
const utils_1 = require("@ganache/utils");
function normalizeEvent(event) {
    const { account, memory: originalMemory, opcode } = event;
    const memoryLength = originalMemory.length;
    // We need to copy some buffers so the user can't mutate them on us:
    // Instead of making a bunch of individual buffers, we just make 1 and then
    // fill it in as needed.
    const sharedBuffer = Buffer.allocUnsafe(104 + memoryLength);
    account.stateRoot.copy(sharedBuffer, 0, 0, 32); // always 32 bytes
    account.codeHash.copy(sharedBuffer, 32, 0, 32); // always 32 bytes
    event.address.buf.copy(sharedBuffer, 64, 0, 20); // always 20 bytes
    event.codeAddress.buf.copy(sharedBuffer, 84, 0, 20); // always 20 bytes
    const stateRoot = sharedBuffer.slice(0, 32);
    const codeHash = sharedBuffer.slice(32, 64);
    const address = sharedBuffer.slice(64, 84);
    const codeAddress = sharedBuffer.slice(84, 104);
    let memory;
    if (memoryLength !== 0) {
        originalMemory.copy(sharedBuffer, 104, 0, memoryLength);
        memory = sharedBuffer.slice(104, 104 + memoryLength);
    }
    else {
        memory = utils_1.BUFFER_ZERO;
    }
    return {
        account: {
            nonce: utils_1.Quantity.from(account.nonce.toArrayLike(Buffer)).toBigInt(),
            balance: utils_1.Quantity.from(account.balance.toArrayLike(Buffer)).toBigInt(),
            stateRoot,
            codeHash
        },
        address,
        codeAddress,
        depth: BigInt(event.depth),
        gasLeft: utils_1.Quantity.from(event.gasLeft.toArrayLike(Buffer)).toBigInt(),
        gasRefund: utils_1.Quantity.from(event.gasRefund.toArrayLike(Buffer)).toBigInt(),
        memory,
        memoryWordCount: utils_1.Quantity.from(event.memoryWordCount.toArrayLike(Buffer)).toBigInt(),
        opcode: {
            name: opcode.name,
            fee: opcode.fee
        },
        pc: BigInt(event.pc),
        returnStack: event.returnStack.map(rs => rs.toArrayLike(Buffer)),
        stack: event.stack.map(s => s.toArrayLike(Buffer))
    };
}
function makeStepEvent(context, event) {
    return {
        context,
        data: normalizeEvent(event)
    };
}
exports.makeStepEvent = makeStepEvent;
//# sourceMappingURL=provider-events.js.map