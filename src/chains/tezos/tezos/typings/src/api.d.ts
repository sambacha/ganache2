import { Api } from "@ganache/utils";
export default class TezosApi implements Api {
    readonly [index: string]: (...args: any) => Promise<any>;
    version(): Promise<string>;
}
//# sourceMappingURL=api.d.ts.map