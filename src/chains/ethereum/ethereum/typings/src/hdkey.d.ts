/// <reference types="node" />
export declare type HDKey = {
    privateKey: Buffer;
    publicKey: Buffer;
    chainCode: Buffer;
};
export declare function createAccountGeneratorFromSeedAndPath(seedBuffer: Buffer, hdPath: string[]): (index: number) => HDKey;
export declare function createAccountFromSeed(seedBuffer: Buffer): HDKey;
export declare function deriveFromPath(fullPath: string[], child: HDKey): HDKey;
export declare function deriveFromIndex(index: number, child: HDKey): HDKey;
//# sourceMappingURL=hdkey.d.ts.map