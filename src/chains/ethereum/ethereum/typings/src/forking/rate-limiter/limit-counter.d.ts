export declare class LimitCounter {
    private counters;
    private windowLength;
    private lastEvict;
    constructor(windowLength: number);
    private evict;
    increment(currentWindow: number): void;
    get(currentWindow: number, previousWindow: number): number[];
}
//# sourceMappingURL=limit-counter.d.ts.map