/**
 * /**
 * Determines whether an object has a property with the specified name.
 *
 * Safe for use on user-supplied data.
 *
 * @param obj The object that will be checked.
 * @param v A property name.
 * @returns `true` if the object has a property with the specified name,
 * otherwise false.
 */
export declare const hasOwn: <X extends unknown, Y extends string | number | symbol>(obj: X, prop: Y) => obj is X extends Record<Y, infer I> ? X & Required<Record<Y, I>> : never;
//# sourceMappingURL=has-own.d.ts.map