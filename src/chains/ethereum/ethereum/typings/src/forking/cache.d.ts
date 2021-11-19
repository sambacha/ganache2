import { Account, Address as EJS_Address } from "ethereumjs-util";
import Cache from "@ethereumjs/vm/dist/state/cache";
import { GanacheTrie } from "../helpers/trie";
export declare class ForkCache extends Cache {
    constructor(trie: GanacheTrie);
    /**
     * Looks up address in underlying trie.
     * @param address - Address of account
     */
    _lookupAccount: (address: EJS_Address) => Promise<Account>;
}
//# sourceMappingURL=cache.d.ts.map