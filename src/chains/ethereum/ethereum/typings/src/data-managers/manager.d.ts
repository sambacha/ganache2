/// <reference types="node" />
import { LevelUp } from "levelup";
export declare type Instantiable<T> = {
    new (...args: any[]): T;
};
export default class Manager<T> {
    #private;
    protected base: LevelUp;
    constructor(base: LevelUp, type: Instantiable<T>, options?: ConstructorParameters<Instantiable<T>>[1]);
    getRaw(key: string | Buffer): Promise<Buffer>;
    get(key: string | Buffer): Promise<T>;
    set(key: Buffer, value: Buffer): Promise<void>;
    del(key: Buffer): Promise<void>;
}
//# sourceMappingURL=manager.d.ts.map