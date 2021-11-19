export declare enum Tag {
    EARLIEST = "earliest",
    LATEST = "latest",
    PENDING = "pending"
}
declare enum _Tag {
    earliest = 0,
    latest = 1,
    pending = 2
}
export declare namespace Tag {
    function normalize(tag: keyof typeof _Tag | Tag): Tag;
}
export {};
//# sourceMappingURL=tags.d.ts.map