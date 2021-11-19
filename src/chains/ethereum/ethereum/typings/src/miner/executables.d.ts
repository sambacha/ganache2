import { TypedTransaction } from "@ganache/ethereum-transaction";
import { Heap } from "@ganache/utils";
export declare type Executables = {
    inProgress: Set<TypedTransaction>;
    pending: Map<string, Heap<TypedTransaction>>;
};
//# sourceMappingURL=executables.d.ts.map