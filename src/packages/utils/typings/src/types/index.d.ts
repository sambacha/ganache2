/// <reference types="node" />
export * from "./connector";
export * from "./provider";
export * from "./api";
export declare type KnownKeys<T> = {
    [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends {
    [_ in keyof T]: infer U;
} ? U : never;
declare global {
    interface JSON {
        parse(text: string | Buffer, reviver?: (key: any, value: any) => any): any;
    }
}
declare type Has4Overloads<T> = T extends {
    (...o: infer U): void;
    (...o: infer U2): void;
    (...o: infer U3): void;
    (...o: infer U4): void;
} ? unknown[] extends U ? [] : true : false;
declare type Has3Overloads<T> = false extends Has4Overloads<T> ? T extends {
    (...o: infer U): void;
    (...o: infer U2): void;
    (...o: infer U3): void;
} ? unknown[] extends U ? [] : true : false : false;
declare type Has2Overloads<T> = false extends Has4Overloads<T> ? false extends Has3Overloads<T> ? T extends {
    (...o: infer U): void;
    (...o: infer U2): void;
} ? unknown[] extends U ? [] : true : false : false : false;
declare type Has1Overload<T> = false extends Has4Overloads<T> ? false extends Has3Overloads<T> ? false extends Has2Overloads<T> ? T extends {
    (...o: infer U): void;
} ? unknown[] extends U ? [] : true : false : false : false : false;
export declare type OverloadedParameters<T> = false extends Has1Overload<T> ? false extends Has2Overloads<T> ? false extends Has3Overloads<T> ? false extends Has4Overloads<T> ? [] : T extends {
    (...o: infer U): void;
    (...o: infer U1): void;
    (...o: infer U2): void;
    (...o: infer U3): void;
} ? U | U1 | U2 | U3 : never : T extends {
    (...o: infer U): void;
    (...o: infer U1): void;
    (...o: infer U2): void;
} ? U | U1 | U2 : never : T extends {
    (...o: infer U): void;
    (...o: infer U1): void;
} ? U | U1 : never : T extends {
    (...o: infer U): void;
} ? U : never;
//# sourceMappingURL=index.d.ts.map