import type { DefaultStateManager, StateManager } from "@ethereumjs/vm/dist/state";
/**
 * Puts the precompile accounts into the state tree
 * @param stateManager
 */
export declare const activatePrecompiles: (stateManager: StateManager) => Promise<void>;
/**
 * Puts the precompile accounts into the warmed addresses
 * @param stateManager
 */
export declare const warmPrecompiles: (stateManager: DefaultStateManager) => Promise<void>;
//# sourceMappingURL=precompiles.d.ts.map