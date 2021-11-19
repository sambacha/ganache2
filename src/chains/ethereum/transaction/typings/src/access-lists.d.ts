import { AccessList, AccessListBuffer } from "@ethereumjs/tx";
export declare class AccessLists {
    static getAccessListData(accessList: AccessListBuffer | AccessList): {
        AccessListJSON: AccessList;
        accessList: AccessListBuffer;
        dataFeeEIP2930: bigint;
    };
}
//# sourceMappingURL=access-lists.d.ts.map