"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
const serializable_object_1 = require("./serializable-object");
const { version: GanacheFilecoinVersion } = { "version": "0.1.1-alpha.2" };
// https://pkg.go.dev/github.com/filecoin-project/lotus@v1.4.0/api#Version
function createBinarySemverVersion(version) {
    const versionParts = version.split(".");
    const majorVersion = versionParts.length > 0 ? parseInt(versionParts[0], 10) : 0;
    const minorVersion = versionParts.length > 1 ? parseInt(versionParts[1], 10) : 0;
    const patchVersion = versionParts.length > 2 ? parseInt(versionParts[2], 10) : 0;
    const binaryVersion = (majorVersion << 16) | (minorVersion << 8) | patchVersion;
    return binaryVersion;
}
class Version extends serializable_object_1.SerializableObject {
    constructor(options) {
        super();
        this.version = super.initializeValue(this.config.version, options);
        this.apiVersion = super.initializeValue(this.config.apiVersion, options);
        this.blockDelay = super.initializeValue(this.config.blockDelay, options);
    }
    get config() {
        return {
            version: {
                deserializedName: "version",
                serializedName: "Version",
                defaultValue: `@ganache/filecoin v${GanacheFilecoinVersion}`
            },
            apiVersion: {
                deserializedName: "apiVersion",
                serializedName: "APIVersion",
                // Version determined by what we're using for at https://pkg.go.dev/github.com/filecoin-project/lotus/api
                defaultValue: createBinarySemverVersion("1.4.0")
            },
            blockDelay: {
                deserializedName: "blockDelay",
                serializedName: "BlockDelay",
                defaultValue: literal => (literal ? BigInt(literal) : 0n)
            }
        };
    }
}
exports.Version = Version;
//# sourceMappingURL=version.js.map