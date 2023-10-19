var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var ObjectCompare_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComparisonResult = exports.ObjectCompare = void 0;
    /**
     * Contains utility for object comparison.
     *
     * @class ObjectCompare
     */
    let ObjectCompare = ObjectCompare_1 = class ObjectCompare {
        /**
         * TypeGuard for type Primitive which representates (number | string | boolean | null | undefined).
         * Matches on everything which is not Object or derived from Object.
         *
         * @private
         * @static
         * @param {*} x
         * @returns {x is Primitive}
         * @memberof ObjectCompare
         */
        static isPrimitive(x) {
            return !(x instanceof Object);
        }
        /**
         * TypeGuard for type Date
         *
         * @private
         * @static
         * @param {*} x
         * @returns {x is Date}
         * @memberof ObjectCompare
         */
        static isDate(x) {
            return (x instanceof Date);
        }
        /**
         * TypeGuard for type Array.
         * Matches on all Arrays regardless of types contained as Array<any>.
         *
         * @private
         * @static
         * @param {*} x
         * @returns {x is Array<any>}
         * @memberof ObjectCompare
         */
        static isArray(x) {
            return Array.isArray(x);
        }
        /**
         * TypeGuard for type Object.
         * Also matches for all extensions of Object (every class).
         *
         * @private
         * @static
         * @param {*} x
         * @returns {x is Object}
         * @memberof ObjectCompare
         */
        static isObject(x) {
            return (x instanceof Object);
        }
        /**
         * TypeGuard for type number
         *
         * @private
         * @static
         * @param {*} x
         * @returns {x is number}
         * @memberof ObjectCompare
         */
        static isNumber(x) {
            return (typeof x === "number");
        }
        /**
         * Generic deep comparison.
         * Use to compare interface data.
         *
         * Performs a deep comparison to validate if the structure and values of the argument "expected" are contained in the argument "actual".
         * argument "expected" needs to be a pure data object at all layers (but can contain nested objects and arrays).
         * Dates are compared via timestamp.
         *
         * @static
         * @param {*} actual
         * @param {*} expected
         * @returns {boolean}
         * @memberof ObjectCompare
         */
        static isContained(actual, expected) {
            let result = ObjectCompare_1.contains(actual, expected);
            return result.success;
        }
        /**
         * Generic deep comparison.
         * Use to compare interface data.
         *
         * Performs a deep comparison to validate if the structure and values of the argument "expected" are contained in the argument "actual".
         * argument "expected" needs to be a pure data object at all layers (but can contain nested objects and arrays).
         * Dates are compared via timestamp.
         *
         * @static
         * @param {*} actual
         * @param {*} expected
         * @returns {ComparisonResult}
         * @memberof ObjectCompare
         */
        static contains(actual, expected) {
            let result = new ComparisonResult(false, "actual < " + actual + " > and expected < " + expected + " > are not the same type.");
            if (ObjectCompare_1.isPrimitive(actual) && ObjectCompare_1.isPrimitive(expected)) { //Primitive
                result = ObjectCompare_1.comparePrimitives(actual, expected);
            }
            else if (ObjectCompare_1.isDate(actual) && ObjectCompare_1.isDate(expected)) { //Date
                result = ObjectCompare_1.compareDate(actual, expected);
            }
            else if (ObjectCompare_1.isArray(actual) && ObjectCompare_1.isArray(expected)) { //Array
                result = ObjectCompare_1.containsArray(actual, expected);
            }
            else if (ObjectCompare_1.isObject(actual) && ObjectCompare_1.isObject(expected)) { // Object
                result = ObjectCompare_1.containsObject(actual, expected);
            }
            return result;
        }
        /**
         * Compares two primitives typesafe.
         *
         * @private
         * @static
         * @param {Primitive} actual
         * @param {Primitive} expected
         * @returns {ComparisonResult}
         * @memberof ObjectCompare
         */
        static comparePrimitives(actual, expected) {
            let isEqual = false;
            if (ObjectCompare_1.isNumber(actual) && ObjectCompare_1.isNumber(expected)) { //check numbers seperatly to cover NaN values
                isEqual = ((actual === expected) || (Number.isNaN(actual) && Number.isNaN(expected)));
            }
            else { //other primitives, undefined and null
                isEqual = (actual === expected);
            }
            return new ComparisonResult(isEqual, "actual value <" + actual + "> does not match expected value <" + expected + ">");
        }
        /**
         * Compares two Dates based on timestamp.
         *
         * @private
         * @static
         * @param {Date} actual
         * @param {Date} expected
         * @returns {ComparisonResult}
         * @memberof ObjectCompare
         */
        static compareDate(actual, expected) {
            //extract timestamps
            let actualTimeStamp = actual.getTime();
            let expectedTimeStamp = expected.getTime();
            return new ComparisonResult((actualTimeStamp === expectedTimeStamp), "actual timestamp <" + actualTimeStamp + "> does not match expected timestamp <" + expectedTimeStamp + ">");
        }
        /**
         * Generic deep comparison of Arrays.
         *
         * Performs a deep comparison to validate if the structure and values of the argument "expected" are contained in the argument "actual".
         * argument "expected" needs to be a pure data object at all layers (but can contain nested objects and arrays).
         * Dates are compared via timestamp.
         *
         * @private
         * @static
         * @param {Array<any>} actual
         * @param {Array<any>} expected
         * @returns {ComparisonResult}
         * @memberof ObjectCompare
         */
        static containsArray(actual, expected) {
            let result = new ComparisonResult(true, "empty");
            //loop through all entries
            for (let i = 0; (i < expected.length) && result.success; i += 1) {
                result = ObjectCompare_1.contains(actual[i], expected[i]);
            }
            return result;
        }
        /**
         * Generic deep comparison of Objects.
         *
         * Performs a deep comparison to validate if the structure and values of the argument "expected" are contained in the argument "actual".
         * argument "expected" needs to be a pure data object at all layers (but can contain nested objects and arrays).
         * Dates are compared via timestamp.
         *
         * @private
         * @static
         * @template T
         * @param {T} actual
         * @param {T} expected
         * @returns {ComparisonResult}
         * @memberof ObjectCompare
         */
        static containsObject(actual, expected) {
            let result = new ComparisonResult(true, "empty");
            //loop through all member
            for (let key in expected) {
                result = ObjectCompare_1.contains(actual[key], expected[key]);
                if (!result.success) {
                    break;
                }
            }
            return result;
        }
        /**
         * Generic deep copy.
         * Use to copy interface data.
         *
         * Performs a deep copy of the given structure in argument source. Copies the values of the argument "source" to the the argument "target".
         * Argument "source" needs to be a pure data object at all layers (but can contain nested objects and arrays).
         * Dates are copied via timestamp.
         *
         * @static
         * @template T
         * @param {T} target
         * @param {T} source
         * @returns {T}
         * @memberof ObjectCompare
         */
        static deepCopy(target, source) {
            if (ObjectCompare_1.isDate(target) && ObjectCompare_1.isDate(source)) { //Date
                target.setTime(source.getTime());
            }
            else if (ObjectCompare_1.isArray(target) && ObjectCompare_1.isArray(source)) { //Array
                ObjectCompare_1.deepCopyArray(target, source);
            }
            else { // Object
                ObjectCompare_1.deepCopyObject(target, source);
            }
            return target;
        }
        /**
         * Generic deep copy of an Array.
         *
         * Performs a deep copy of the given structure in argument source. Copies the values of the argument "source" to the argument "target".
         * Argument "source" needs to be a pure data object at all layers (but can contain nested objects and arrays).
         * Dates are copied via timestamp.
         *
         * @private
         * @static
         * @param {Array<any>} target
         * @param {Array<any>} source
         * @memberof ObjectCompare
         */
        static deepCopyArray(target, source) {
            //loop through all entries
            for (let i = 0; i < source.length; i += 1) {
                if (ObjectCompare_1.isPrimitive(target[i]) && ObjectCompare_1.isPrimitive(source[i])) { //Primitive entry
                    target[i] = source[i];
                }
                else { // complex entry
                    ObjectCompare_1.deepCopy(target[i], source[i]);
                }
            }
        }
        /**
         * Generic deep copy of an Object.
         *
         * Performs a deep copy of the given structure in argument source. Copies the values of the argument "source" to the the argument "target".
         * Argument "source" needs to be a pure data object at all layers (but can contain nested objects and arrays).
         * Dates are copied via timestamp.
         *
         * @private
         * @static
         * @param {Object} target
         * @param {Object} source
         * @memberof ObjectCompare
         */
        static deepCopyObject(target, source) {
            //loop through member
            for (let key in source) {
                if (ObjectCompare_1.isPrimitive(target[key]) && ObjectCompare_1.isPrimitive(target[key])) { //Primitive member
                    target[key] = source[key];
                }
                else { // complex member
                    ObjectCompare_1.deepCopy(target[key], source[key]);
                }
            }
        }
        /**
         * Generic deep comparison.
         * Use to compare interface data.
         *
         * Performs a deep comparison to validate if the structure and values of the argument "expected" are equal in the argument "actual".
         * arguments "expected" and "actual" need to be pure data objects at all layers (but can contain nested objects and arrays).
         * Dates are compared via timestamp.
         *
         * @static
         * @param {*} actual
         * @param {*} expected
         * @returns {boolean}
         * @memberof ObjectCompare
         */
        static isEqual(actual, expected) {
            let result = ObjectCompare_1.equals(actual, expected);
            return result.success;
        }
        /**
         * Generic deep comparison.
         * Use to compare interface data.
         *
         * Performs a deep comparison to validate if the structure and values of the argument "expected" are equal in the argument "actual".
         * arguments "expected" and "actual" need to be pure data objects at all layers (but can contain nested objects and arrays).
         * Dates are compared via timestamp.
         *
         * @static
         * @param {*} actual
         * @param {*} expected
         * @returns {ComparisonResult}
         * @memberof ObjectCompare
         */
        static equals(actual, expected) {
            let result = new ComparisonResult(false, "actual < " + actual + " > and expected < " + expected + " > are not the same type.");
            if (ObjectCompare_1.isPrimitive(actual) && ObjectCompare_1.isPrimitive(expected)) { //Primitive
                result = ObjectCompare_1.comparePrimitives(actual, expected);
            }
            else if (ObjectCompare_1.isDate(actual) && ObjectCompare_1.isDate(expected)) { //Date
                result = ObjectCompare_1.compareDate(actual, expected);
            }
            else if (ObjectCompare_1.isArray(actual) && ObjectCompare_1.isArray(expected)) { //Array
                result = ObjectCompare_1.equalsArray(actual, expected);
            }
            else if (ObjectCompare_1.isObject(actual) && ObjectCompare_1.isObject(expected)) { // Object
                result = ObjectCompare_1.equalsObject(actual, expected);
            }
            return result;
        }
        /**
         * Generic deep comparison of Arrays.
         *
         * Performs a deep comparison to validate if the structure and values of the argument "expected" are equal in the argument "actual".
         * arguments "expected" and "actual" need to be pure data objects at all layers (but can contain nested objects and arrays).
         * Dates are compared via timestamp.
         *
         * @static
         * @param {Array<any>} actual
         * @param {Array<any>} expected
         * @returns {ComparisonResult}
         * @memberof ObjectCompare
         */
        static equalsArray(actual, expected) {
            let result = new ComparisonResult(false, "actual array < " + actual + " > and expected array < " + expected + " > do not have the same length");
            if (actual.length === expected.length) {
                result = new ComparisonResult(true, "empty arrays");
                //loop through all entries
                for (let i = 0; (i < expected.length) && result.success; i += 1) {
                    result = ObjectCompare_1.equals(actual[i], expected[i]);
                }
            }
            return result;
        }
        /**
         * Generic deep comparison of Objects.
         *
         * Performs a deep comparison to validate if the structure and values of the argument "expected" are equal in the argument "actual".
         * arguments "expected" and "actual" need to be pure data objects at all layers (but can contain nested objects and arrays).
         * Dates are compared via timestamp.
         *
         * @static
         * @template T
         * @param {T} actual
         * @param {T} expected
         * @returns {ComparisonResult}
         * @memberof ObjectCompare
         */
        static equalsObject(actual, expected) {
            let result = new ComparisonResult(false, "actual object < " + actual + " > and expected object < " + expected + " > do not have the same keys");
            let keysAreEqual = false;
            let actualKeys = Object.keys(actual).sort();
            let expectedKeys = Object.keys(expected).sort();
            if (actualKeys.length === expectedKeys.length) { // same number of keys?
                keysAreEqual = true;
            }
            for (let i = 0; keysAreEqual && (i < expectedKeys.length); i++) { //same keys?
                keysAreEqual = actualKeys[i] === expectedKeys[i];
            }
            if (keysAreEqual) { // same content of keys?
                result = new ComparisonResult(true, "empty objects");
                //loop through all member
                for (let key in expected) {
                    result = ObjectCompare_1.equals(actual[key], expected[key]);
                    if (!result.success) {
                        break;
                    }
                }
            }
            return result;
        }
    };
    ObjectCompare = ObjectCompare_1 = __decorate([
        mco.role()
    ], ObjectCompare);
    exports.ObjectCompare = ObjectCompare;
    /**
     * Describes the result of an comparison
     *
     * @class ComparisonResult
     */
    let ComparisonResult = class ComparisonResult {
        constructor(isSuccess, failureMessage = "Message decribing reason of failure was not defined") {
            this._isSuccess = isSuccess;
            this._failureMessage = failureMessage;
        }
        /**
         * Returns the reason of failure of the described comparison
         *
         * @returns {string}
         * @memberof ComparisonResult
         */
        get failureMessage() {
            return this._failureMessage;
        }
        /**
         * Return a boolean representating the success of the described comparison
         *
         * @returns {boolean}
         * @memberof ComparisonResult
         */
        get success() {
            return this._isSuccess;
        }
    };
    ComparisonResult = __decorate([
        mco.role()
    ], ComparisonResult);
    exports.ComparisonResult = ComparisonResult;
});
