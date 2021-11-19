declare type UnknownFn = (this: unknown, ...args: any[]) => unknown;
declare type FunctionPropertyDescriptor<T extends UnknownFn> = TypedPropertyDescriptor<T>;
export declare function assertArgLength(min: number, max?: number): <O extends Object, T extends UnknownFn>(target: O, propertyKey: keyof O, descriptor: FunctionPropertyDescriptor<T>) => FunctionPropertyDescriptor<T>;
export {};
//# sourceMappingURL=assert-arg-length.d.ts.map