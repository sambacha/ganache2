export declare const BlockParams: {
    /**
     *  Base fee per gas for blocks without a parent containing a base fee per gas.
     */
    INITIAL_BASE_FEE_PER_GAS: 1000000000n;
    /**
     * Divisor used to set a block's target gas usage.
     */
    ELASTICITY: 2n;
    /**
     * Divisor used to limit the amount the base fee per gas can change from one block to another.
     */
    BASE_FEE_MAX_CHANGE_DENOMINATOR: 8n;
};
//# sourceMappingURL=block-params.d.ts.map