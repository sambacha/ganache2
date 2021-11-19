import { RuntimeBlock } from "@ganache/ethereum-block";
import { Quantity, Data } from "@ganache/utils";
import { Address } from "@ganache/ethereum-address";
import VM from "@ethereumjs/vm";
export declare type SimulationTransaction = {
    /**
     * The address the transaction is sent from.
     */
    from: Address;
    /**
     * The address the transaction is directed to.
     */
    to?: Address;
    /**
     * Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.
     */
    gas: Quantity;
    /**
     * Integer of the gasPrice used for each paid gas
     */
    gasPrice: Quantity;
    /**
     * Integer of the value sent with this transaction
     */
    value?: Quantity;
    /**
     * Hash of the method signature and encoded parameters. For details see Ethereum Contract ABI in the Solidity documentation
     */
    data?: Data;
    block: RuntimeBlock;
};
/**
 * Executes a message/transaction against the vm.
 * @param vm
 * @param transaction
 * @param gasLeft
 * @returns
 */
export declare function runCall(vm: VM, transaction: SimulationTransaction, gasLeft: bigint): Promise<import("@ethereumjs/vm/dist/evm/evm").EVMResult>;
//# sourceMappingURL=run-call.d.ts.map