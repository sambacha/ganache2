/// <reference types="node" />
import { RuntimeError, TransactionLog } from "@ganache/ethereum-utils";
import { Data, Quantity } from "@ganache/utils";
import { TypedRpcTransaction } from "./rpc-transaction";
import type Common from "@ethereumjs/common";
import { GanacheRawExtraTx, TypedDatabasePayload, TypedDatabaseTransaction } from "./raw";
import type { RunTxResult } from "@ethereumjs/vm/dist/runTx";
import { EncodedPart } from "@ganache/rlp";
import { BaseTransaction } from "./base-transaction";
import { TransactionReceipt } from "./transaction-receipt";
import { Address } from "@ganache/ethereum-address";
export declare const toValidLengthAddress: (address: string, fieldName: string) => Address;
export declare const hasPartialSignature: (data: TypedRpcTransaction) => data is (Readonly<{
    from: string;
    nonce?: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
}> & {
    readonly gasPrice?: string;
    readonly chainId?: never;
    readonly accessList?: never;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from: string;
    nonce?: string;
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
}> & {
    readonly gasPrice?: string;
    readonly chainId?: never;
    readonly accessList?: never;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from: string;
    nonce?: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    input?: string;
    data?: never;
}> & {
    readonly gasPrice?: string;
    readonly chainId?: never;
    readonly accessList?: never;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from: string;
    nonce?: string;
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    input?: string;
    data?: never;
}> & {
    readonly gasPrice?: string;
    readonly chainId?: never;
    readonly accessList?: never;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from?: string;
    nonce: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
    v: string;
    r: string;
    s: string;
}> & {
    readonly gasPrice?: string;
    readonly chainId?: never;
    readonly accessList?: never;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from?: string;
    nonce: string;
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
    v: string;
    r: string;
    s: string;
}> & {
    readonly gasPrice?: string;
    readonly chainId?: never;
    readonly accessList?: never;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from?: string;
    nonce: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    input?: string;
    data?: never;
    v: string;
    r: string;
    s: string;
}> & {
    readonly gasPrice?: string;
    readonly chainId?: never;
    readonly accessList?: never;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from?: string;
    nonce: string;
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    input?: string;
    data?: never;
    v: string;
    r: string;
    s: string;
}> & {
    readonly gasPrice?: string;
    readonly chainId?: never;
    readonly accessList?: never;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from: string;
    nonce?: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from: string;
    nonce?: string;
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from: string;
    nonce?: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    input?: string;
    data?: never;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from: string;
    nonce?: string;
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    input?: string;
    data?: never;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from?: string;
    nonce: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
    v: string;
    r: string;
    s: string;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from?: string;
    nonce: string;
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
    v: string;
    r: string;
    s: string;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from?: string;
    nonce: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    input?: string;
    data?: never;
    v: string;
    r: string;
    s: string;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from?: string;
    nonce: string;
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    input?: string;
    data?: never;
    v: string;
    r: string;
    s: string;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
    readonly maxPriorityFeePerGas?: never;
    readonly maxFeePerGas?: never;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from: string;
    nonce?: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: never;
    readonly maxPriorityFeePerGas?: string;
    readonly maxFeePerGas?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from: string;
    nonce?: string;
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: never;
    readonly maxPriorityFeePerGas?: string;
    readonly maxFeePerGas?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from: string;
    nonce?: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    input?: string;
    data?: never;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: never;
    readonly maxPriorityFeePerGas?: string;
    readonly maxFeePerGas?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from: string;
    nonce?: string;
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    input?: string;
    data?: never;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: never;
    readonly maxPriorityFeePerGas?: string;
    readonly maxFeePerGas?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from?: string;
    nonce: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
    v: string;
    r: string;
    s: string;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: never;
    readonly maxPriorityFeePerGas?: string;
    readonly maxFeePerGas?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from?: string;
    nonce: string;
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    data?: string;
    input?: never;
    v: string;
    r: string;
    s: string;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: never;
    readonly maxPriorityFeePerGas?: string;
    readonly maxFeePerGas?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from?: string;
    nonce: string;
    gas?: string;
    gasLimit?: never;
    to?: string;
    value?: string;
    input?: string;
    data?: never;
    v: string;
    r: string;
    s: string;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: never;
    readonly maxPriorityFeePerGas?: string;
    readonly maxFeePerGas?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
}) | (Readonly<{
    from?: string;
    nonce: string;
    gasLimit?: string;
    gas?: never;
    to?: string;
    value?: string;
    input?: string;
    data?: never;
    v: string;
    r: string;
    s: string;
}> & {
    readonly type: "0x1" | "0x2" | "0x3" | "0x4" | "0x5" | "0x6" | "0x7" | "0x0" | "0x8" | "0x9" | "0xa" | "0xb" | "0xc" | "0xd" | "0xe" | "0xf" | "0x11" | "0x12" | "0x13" | "0x14" | "0x15" | "0x16" | "0x17" | "0x10" | "0x18" | "0x19" | "0x1a" | "0x1b" | "0x1c" | "0x1d" | "0x1e" | "0x1f" | "0x21" | "0x22" | "0x23" | "0x24" | "0x25" | "0x26" | "0x27" | "0x20" | "0x28" | "0x29" | "0x2a" | "0x2b" | "0x2c" | "0x2d" | "0x2e" | "0x2f" | "0x31" | "0x32" | "0x33" | "0x34" | "0x35" | "0x36" | "0x37" | "0x30" | "0x38" | "0x39" | "0x3a" | "0x3b" | "0x3c" | "0x3d" | "0x3e" | "0x3f" | "0x41" | "0x42" | "0x43" | "0x44" | "0x45" | "0x46" | "0x47" | "0x40" | "0x48" | "0x49" | "0x4a" | "0x4b" | "0x4c" | "0x4d" | "0x4e" | "0x4f" | "0x51" | "0x52" | "0x53" | "0x54" | "0x55" | "0x56" | "0x57" | "0x50" | "0x58" | "0x59" | "0x5a" | "0x5b" | "0x5c" | "0x5d" | "0x5e" | "0x5f" | "0x61" | "0x62" | "0x63" | "0x64" | "0x65" | "0x66" | "0x67" | "0x60" | "0x68" | "0x69" | "0x6a" | "0x6b" | "0x6c" | "0x6d" | "0x6e" | "0x6f" | "0x71" | "0x72" | "0x73" | "0x74" | "0x75" | "0x76" | "0x77" | "0x70" | "0x78" | "0x79" | "0x7a" | "0x7b" | "0x7c" | "0x7d" | "0x7e" | "0x7f";
    readonly chainId?: string;
    readonly gasPrice?: never;
    readonly maxPriorityFeePerGas?: string;
    readonly maxFeePerGas?: string;
    readonly accessList?: import("@ethereumjs/tx").AccessList;
} & {
    from?: string;
    v?: string;
    r?: string;
    s?: string;
});
declare type TransactionFinalization = {
    status: "confirmed";
    error?: Error;
} | {
    status: "rejected";
    error: Error;
};
/**
 * A RuntimeTransaction can be changed; its hash is not finalized and it is not
 * yet part of a block.
 */
export declare abstract class RuntimeTransaction extends BaseTransaction {
    hash: Data | null;
    /**
     * used by the miner to mark if this transaction is eligible for reordering or
     * removal
     */
    locked: boolean;
    logs: TransactionLog[];
    receipt: TransactionReceipt;
    execException: RuntimeError;
    raw: TypedDatabaseTransaction | null;
    serialized: Buffer;
    encodedData: EncodedPart;
    encodedSignature: EncodedPart;
    private finalizer;
    private finalized;
    constructor(data: TypedDatabasePayload | TypedRpcTransaction, common: Common, extra?: GanacheRawExtraTx);
    /**
     * sign a transaction with a given private key, then compute and set the `hash`.
     *
     * @param privateKey - Must be 32 bytes in length
     */
    protected abstract signAndHash(privateKey: Buffer): any;
    serializeForDb(blockHash: Data, blockNumber: Quantity, transactionIndex: Quantity): Buffer;
    abstract toJSON(common: Common): any;
    /**
     * Initializes the receipt and logs
     * @param result
     * @returns RLP encoded data for use in a transaction trie
     */
    fillFromResult(result: RunTxResult, cumulativeGasUsed: bigint): Buffer;
    getReceipt(): TransactionReceipt;
    getLogs(): TransactionLog[];
    validateAndSetSignature: (data: TypedRpcTransaction) => void;
    /**
     * Returns a Promise that is resolved with the confirmation status and, if
     * appropriate, an error property.
     *
     * Note: it is possible to be confirmed AND have an error
     *
     * @param event "finalized"
     */
    once(_event: "finalized"): Promise<TransactionFinalization>;
    /**
     * Mark this transaction as finalized, notifying all past and future
     * "finalized" event subscribers.
     *
     * Note:
     *
     * @param status
     * @param error
     */
    finalize(status: "confirmed" | "rejected", error?: Error): void;
    protected abstract toEthRawTransaction(v: Buffer, r: Buffer, s: Buffer): TypedDatabaseTransaction;
    protected abstract computeIntrinsics(v: Quantity, raw: TypedDatabaseTransaction, chainId: number): any;
    protected abstract toVmTransaction(): any;
    protected abstract updateEffectiveGasPrice(baseFeePerGas?: Quantity): any;
}
export {};
//# sourceMappingURL=runtime-transaction.d.ts.map