"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const lexico = __importStar(require("../lexicographic-key-codec"));
const utils_1 = require("@ganache/utils");
const rlp = __importStar(require("@ganache/rlp"));
/**
 * A tree: https://en.wikipedia.org/wiki/Rose_tree
 * One parent, multiple children
 */
class Tree {
    constructor(height, hash, closestKnownAncestor = utils_1.BUFFER_EMPTY) {
        this.closestKnownDescendants = [];
        this.key = Tree.encodeKey(height, hash);
        this.hash = hash.toBuffer();
        this.closestKnownAncestor = closestKnownAncestor;
    }
    serialize() {
        return rlp.encode([
            this.hash,
            this.closestKnownAncestor,
            this.closestKnownDescendants
        ]);
    }
    decodeKey() {
        return Tree.decodeKey(this.key);
    }
    static decodeKey(key) {
        const [height, hash] = lexico.decode(key);
        return {
            height: utils_1.Quantity.from(height),
            hash: utils_1.Data.from(hash)
        };
    }
    static deserialize(key, value) {
        const [hash, parent, children] = rlp.decode(value);
        const tree = Object.create(Tree.prototype);
        tree.key = key;
        tree.hash = hash;
        tree.closestKnownAncestor = parent;
        tree.closestKnownDescendants = children;
        return tree;
    }
    static encodeKey(height, hash) {
        return lexico.encode([height.toBuffer(), hash.toBuffer()]);
    }
}
exports.Tree = Tree;
//# sourceMappingURL=tree.js.map