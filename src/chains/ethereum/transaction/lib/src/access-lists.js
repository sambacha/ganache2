"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessLists = void 0;
const tx_1 = require("@ethereumjs/tx");
const utils_1 = require("@ganache/utils");
const params_1 = require("./params");
class AccessLists {
    static getAccessListData(accessList) {
        let AccessListJSON;
        let bufferAccessList;
        let slots = 0;
        const accessListStorageKeyCost = params_1.Params.ACCESS_LIST_STORAGE_KEY_GAS;
        const accessListAddressCost = params_1.Params.ACCESS_LIST_ADDRESS_GAS;
        if (accessList && tx_1.isAccessList(accessList)) {
            AccessListJSON = accessList;
            const newAccessList = [];
            for (let i = 0; i < accessList.length; i++) {
                const item = accessList[i];
                const addressBuffer = utils_1.Data.from(item.address, 32).toBuffer();
                const storageItems = [];
                const storageKeysLength = item.storageKeys.length;
                slots += storageKeysLength;
                for (let index = 0; index < storageKeysLength; index++) {
                    storageItems.push(utils_1.Data.from(item.storageKeys[index]).toBuffer());
                }
                newAccessList.push([addressBuffer, storageItems]);
            }
            bufferAccessList = newAccessList;
        }
        else {
            bufferAccessList = accessList ? accessList : [];
            // build the JSON
            const json = [];
            for (let i = 0; i < bufferAccessList.length; i++) {
                const data = bufferAccessList[i];
                const address = utils_1.Data.from(data[0], 32).toString();
                const storageKeys = [];
                const storageKeysLength = data[1].length;
                slots += storageKeysLength;
                for (let item = 0; item < storageKeysLength; item++) {
                    storageKeys.push(utils_1.Data.from(data[1][item], 32).toString());
                }
                const jsonItem = {
                    address,
                    storageKeys
                };
                json.push(jsonItem);
            }
            AccessListJSON = json;
        }
        const dataFee = BigInt(bufferAccessList.length * accessListAddressCost +
            slots * accessListStorageKeyCost);
        return {
            AccessListJSON,
            accessList: bufferAccessList,
            dataFeeEIP2930: dataFee
        };
    }
}
exports.AccessLists = AccessLists;
//# sourceMappingURL=access-lists.js.map