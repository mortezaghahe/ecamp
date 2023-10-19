var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumericHelper = void 0;
    let NumericHelper = class NumericHelper {
        /**
         * Converts a numeric string to a better formated numeric string for the given datatype (e.g. float and double to Precision(7))
         *
         * @static
         * @param {string} numericString
         * @param {string} dataTypeName
         * @returns {string}
         * @memberof NumericHelper
         */
        static convertNumericString(numericString, dataTypeName) {
            if (dataTypeName == "Float") {
                let floatValue = parseFloat(numericString);
                return floatValue.toPrecision(7);
            }
            /*else if (dataTypeName == "Double"){
                let floatValue =  parseFloat(numericString);
                return floatValue.toPrecision(7);
            }*/
            return numericString;
        }
    };
    NumericHelper = __decorate([
        mco.role()
    ], NumericHelper);
    exports.NumericHelper = NumericHelper;
});
