"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOwn = void 0;
const _hasOwn = {}.hasOwnProperty.call.bind({}.hasOwnProperty);
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
const hasOwn = (obj, prop) => {
    return obj != null && _hasOwn(obj, prop);
};
exports.hasOwn = hasOwn;
//# sourceMappingURL=has-own.js.map