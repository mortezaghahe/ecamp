var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./baseFormatter"], function (require, exports, baseFormatter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StringSubFormatter = void 0;
    /**
     * Subformatter for processing string input arguments
     *
     * @export
     * @class StringSubFormatter
     * @extends {BaseFormatter}
     */
    let StringSubFormatter = class StringSubFormatter extends baseFormatter_1.BaseFormatter {
        /**
         * If there is a precision passed, the argument string gets cutted to the precision.
         * Else the string stays the same
         *
         * @override
         * @param {(number | string)} inputArgument
         * @param {(number)} precision
         * @param {FormatSpecificationTypes} type
         * @return {*}  {string}
         * @memberof StringSubFormatter
         */
        useFormatSpecificationPrecisionAndType(inputArgument, precision, type) {
            let precisedArgument = inputArgument;
            if (!isNaN(precision)) {
                precisedArgument = precisedArgument.substring(0, precision);
            }
            return precisedArgument;
        }
    };
    StringSubFormatter = __decorate([
        mco.role()
    ], StringSubFormatter);
    exports.StringSubFormatter = StringSubFormatter;
});
