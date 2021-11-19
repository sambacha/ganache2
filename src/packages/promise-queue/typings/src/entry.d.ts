export default class Entry<T> {
    readonly promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    value: T | Promise<T>;
    queue: Entry<T>[];
    resolved: boolean;
    onSetteled: (queue: Entry<T>[], entry: Entry<T>) => void;
    constructor(promise: Promise<T>, queue: Entry<T>[], onSetteled: (queue: Entry<T>[], entry: Entry<T>) => void);
}
//# sourceMappingURL=entry.d.ts.map