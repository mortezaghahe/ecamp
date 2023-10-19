var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../formatSpecification/formatSpecificationType", "./baseFormatter", "./baseFormatterHelper"], function (require, exports, formatSpecificationType_1, baseFormatter_1, baseFormatterHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IntSubFormatter = void 0;
    /**
     * Subformatter for processing integer input arguments
     *
     * @export
     * @class IntSubFormatter
     * @extends {BaseFormatter}
     */
    let IntSubFormatter = class IntSubFormatter extends baseFormatter_1.BaseFormatter {
        /**
         * Adapt the argument to the type with the passed precision
         *
         * @override
         * @param {(number | string)} inputArgument
         * @param {number} precision
         * @param {(FormatSpecificationTypes} type
         * @return {*}  {string}
         * @memberof IntSubFormatter
         */
        useFormatSpecificationPrecisionAndType(inputArgument, precision, type) {
            let argument = inputArgument;
            let formattedArgument = this.adaptType(argument, type);
            formattedArgument = this.preciseArgument(formattedArgument, precision);
            return formattedArgument;
        }
        /**
         * Adapt the argument to the type if there is a suitable type
         * else convert the argument from number to string
         *
         * @private
         * @param {number} argument
         * @param {FormatSpecificationTypes} [formatSpecificationType]
         * @return {*}  {string}
         * @memberof IntSubFormatter
         */
        adaptType(argument, formatSpecificationType) {
            let addaptedArgument = argument.toString();
            if (formatSpecificationType === formatSpecificationType_1.FormatSpecificationTypes.binaryNumber) {
                addaptedArgument = argument.toString(2);
            }
            if (formatSpecificationType === formatSpecificationType_1.FormatSpecificationTypes.octalNumber) {
                addaptedArgument = argument.toString(8);
            }
            if (formatSpecificationType === formatSpecificationType_1.FormatSpecificationTypes.hexadecimalLowercase) {
                addaptedArgument = argument.toString(16);
                addaptedArgument = addaptedArgument.toLowerCase();
            }
            if (formatSpecificationType === formatSpecificationType_1.FormatSpecificationTypes.hexadecimalUppercase) {
                addaptedArgument = argument.toString(16);
                addaptedArgument = addaptedArgument.toUpperCase();
            }
            return addaptedArgument;
        }
        /**
         * As long the precision > argument.length, "0" are appended on front of the argument
         *
         * @private
         * @param {string} argument
         * @param {number} precision
         * @return {*}  {string}
         * @memberof IntSubFormatter
         */
        preciseArgument(argument, precision) {
            return baseFormatterHelper_1.BaseFormatterHelper.extendArgumentToLength(argument, precision, true, "0");
        }
    };
    IntSubFormatter = __decorate([
        mco.role()
    ], IntSubFormatter);
    exports.IntSubFormatter = IntSubFormatter;
});
