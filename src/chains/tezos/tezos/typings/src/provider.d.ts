import { Provider } from "@ganache/utils";
import TezosApi from "./api";
import Emittery from "emittery";
export default class TezosProvider extends Emittery.Typed<undefined, "ready" | "close"> implements Provider<TezosApi> {
    constructor(providerOptions?: any);
    getOptions(): void;
    getInitialAccounts(): void;
    close(): Promise<void>;
}
//# sourceMappingURL=provider.d.ts.map