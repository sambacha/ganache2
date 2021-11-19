export interface TmpNameOptions {
    dir?: string;
    name?: string;
    postfix?: string;
    prefix?: string;
    template?: string;
    tmpdir?: string;
    tries?: number;
}
export interface DirOptions extends TmpNameOptions {
    keep?: boolean;
    mode?: number;
    unsafeCleanup?: boolean;
}
/**
 * Creates a temporary directory.
 *
 * @param {(Options)} opts the options
 */
export declare function dir(options: DirOptions): Promise<{
    path: any;
    cleanup: () => Promise<void>;
}>;
/**
 * Sets the graceful cleanup.
 *
 * If graceful cleanup is set, tmp will remove all controlled temporary objects on process exit, otherwise the
 * temporary objects will remain in place, waiting to be cleaned up on system restart or otherwise scheduled temporary
 * object removals.
 */
export declare function setGracefulCleanup(): void;
//# sourceMappingURL=browser-tmp-promise.d.ts.map