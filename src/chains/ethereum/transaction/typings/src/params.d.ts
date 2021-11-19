export declare const Params: {
    /**
     *  Per transaction not creating a contract. NOTE: Not payable on data of calls between transactions.
     */
    TRANSACTION_GAS: bigint;
    /**
     * Per byte of data attached to a transaction that is not equal to zero. NOTE: Not payable on data of calls between transactions.
     */
    TRANSACTION_DATA_NON_ZERO_GAS: Map<"constantinople" | "byzantium" | "petersburg" | "istanbul" | "muirGlacier" | "berlin" | "london", bigint>;
    /**
     * Per byte of data attached to a transaction that equals zero. NOTE: Not payable on data of calls between transactions.
     */
    TRANSACTION_DATA_ZERO_GAS: bigint;
    /**
     * Fee for creation a transaction
     */
    TRANSACTION_CREATION: bigint;
    /**
     * Gas cost per address in an EIP-2930 Access List transaction
     */
    ACCESS_LIST_ADDRESS_GAS: number;
    /**
     * Gas cost per storage key in an EIP-2930 Access List transaction
     */
    ACCESS_LIST_STORAGE_KEY_GAS: number;
};
//# sourceMappingURL=params.d.ts.map