"use strict";
/*!
 * @ganache/secp256k1
 *
 * @author David Murdoch
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
let secp256k1;
try {
    // TODO: find a better way :-)
    // use `eval` to make `ganache`'s webpack ignore this
    const nodeRequire = eval("require");
    const path = nodeRequire.resolve("secp256k1/package.json");
    const dir = path_1.dirname(path);
    const nodeGypBuild = require("node-gyp-build");
    // load native secp256k1
    const { Secp256k1 } = nodeGypBuild(dir);
    secp256k1 = new Secp256k1();
}
catch {
    // on error use the JS fallback
    secp256k1 = require("secp256k1/lib/elliptic");
}
exports.default = secp256k1;
//# sourceMappingURL=index.js.map