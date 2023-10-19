var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseFormatterHelper = void 0;
    /**
     * This class provides static formatter helper functions
     * that can be used in all formatters.
     *
     * @static
     * @class BaseFormatterHelper
     */
    let BaseFormatterHelper = class BaseFormatterHelper {
        /**
         * Creates an instance of BaseFormatterHelper.
         * @memberof BaseFormatterHelper
         */
        constructor() { }
        ;
        /**
         * Adapt the argument.length to the lenght given, as long the length > argument.length
         *
         * @static
         * @param {string} argument
         * @param {number} length
         * @param {boolean} appendOnFront // true: fillchar is append on front; false: fillchar is append on back
         * @param {string} [fillChar]
         * @return {*}  {string}
         * @memberof BaseFormatterHelper
         */
        static extendArgumentToLength(argument, length, appendOnFront, fillChar) {
            if (appendOnFront) {
                argument = argument.padStart(length, fillChar);
            }
            else {
                argument = argument.padEnd(length, fillChar);
            }
            return argument;
        }
        /**
         * Return always sign to numerical outputs
         *
         * @static
         * @param {string} argument
         * @return {*}  {string}
         * @memberof BaseFormatterHelper
         */
        static getSignAlwaysOutput(signHolder) {
            return signHolder.getSign();
        }
        /**
         * Only for negative numbers a sign get returned
         * otherwise space is returned
         *
         * @static
         * @param {string} argument
         * @return {*}  {string}
         * @memberof BaseFormatterHelper
         */
        static getSignOnlyNegativeOutput(signHolder) {
            let sign = signHolder.getSign();
            if (sign === "+") {
                sign = " ";
            }
            return sign;
        }
        /**
         * Parse a String to Integer.
         * The string need to contain a save Integer to be parsed successfully.
         * If the string does not contain a save Integer NaN gets returned.
         *
         * @static
         * @param {string} valueStr
         * @return {number}
         * @memberof EditStringHelper
         */
        static parseStringToInt(valueStr) {
            let value = parseFloat(valueStr);
            if (!Number.isSafeInteger(value)) {
                value = NaN;
            }
            return value;
        }
    };
    BaseFormatterHelper = __decorate([
        mco.role()
    ], BaseFormatterHelper);
    exports.BaseFormatterHelper = BaseFormatterHelper;
});
