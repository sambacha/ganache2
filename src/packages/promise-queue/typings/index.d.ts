import Emittery from "emittery";
declare const emitteryMethods: readonly ["emit", "once"];
/**
 * Creates a FIFO queue that ensures promises are _resolved_ in the order
 * they were added.
 *
 * This is different than a FIFO queue that _executes_ functions that
 * return promises; this queue is for the promises themselves.
 *
 * @example
 * ```javascript
 * const queue = new PromiseQueue();
 *
 * const slow = new Promise(resolve => setTimeout(resolve, 1000, "slow"));
 * const fast = Promise.resolve("fast");
 *
 * await Promise.race([
 *   queue.add(slow),
 *   queue.add(fast)
 * ]); // returns "slow"
 *
 * // Additionally, the queued promise chain can be cleared via `queue.clear(value)`.
 * // This will cause the chain of promises to all resolve immediately with the
 * // given value. *
 * //
 * // * note: whatever the promise starting doing when it was created will still
 * // happen, no promises are aborted; rather, the return value is ignored.
 * ```
 */
declare class PromiseQueue<T> {
    #private;
    /**
     * Returns true if there are promises pending in the queue
     */
    isBusy(): boolean;
    /**
     * Adds the promise to the end of the queue.
     * @param promise
     * @returns a promise that resolves with the given promise's result. If the
     * queue was `clear`ed before the promise could be shifted off the return
     * value will be the `value` passed to `clear`.
     */
    add(promise: Promise<T>): Promise<T>;
    /**
     * Clears all promises from the queue and sets their resolved values to the
     * given value.
     */
    clear(value: T): void;
}
interface PromiseQueue<T> extends Pick<Emittery, typeof emitteryMethods[number]> {
    emittery: Emittery;
}
export default PromiseQueue;
//# sourceMappingURL=index.d.ts.map