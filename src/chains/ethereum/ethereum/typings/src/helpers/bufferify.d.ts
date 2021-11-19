/// <reference types="node" />
/**
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) Buffer
 * (utf-8 encoded).
 *
 * This is a hack. It:
 *  * Does not support circular references.
 *  * Does not support double quotes within Object keys; only alphanumerics are
 *    considered safe to use
 *  * Probably doesn't support non-ASCII characters
 *  * Is only tested on transaction traces
 *
 * Only useful if the `JSON.stringify`ed version would create a string larger
 * than what the JavaScript engine can handle.
 *
 * What is the maximum string size in Node/V8? It depends on the version! Some
 * versions are 256MB, some are ~1GB, and others are ~0.5GB.
 * See: https://stackoverflow.com/a/47781288/160173
 *
 * CAUTION: This method is approx 3 - 20 times slower than using:
 * `Buffer.from(JSON.stringify(value), "utf-8")`
 *
 * @param value A JavaScript value, usually an object or array, to be converted.
 * @param nameOrIndex JSON.stringify calls an object's toJSON method, and this
 * property is used by internal recursive calls to bufferify.
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior
 */
export declare function bufferify(value: any, nameOrIndex: string): Generator<Buffer>;
//# sourceMappingURL=bufferify.d.ts.map