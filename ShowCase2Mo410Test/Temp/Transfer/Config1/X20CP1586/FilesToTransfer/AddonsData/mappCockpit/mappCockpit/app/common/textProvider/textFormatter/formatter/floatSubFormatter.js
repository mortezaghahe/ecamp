var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./baseFormatter", "../formatSpecification/formatSpecificationType"], function (require, exports, baseFormatter_1, formatSpecificationType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FloatSubFormatter = void 0;
    /**
     * Subformatter for processing float input arguments
     *
     * @export
     * @class FloatSubFormatter
     * @extends {BaseFormatter}
     */
    let FloatSubFormatter = class FloatSubFormatter extends baseFormatter_1.BaseFormatter {
        constructor() {
            super(...arguments);
            // due to c++ Foramtter the default digits after the decimal point is 6
            this._defaultPrecision = 6;
        }
        /**
         * Adapt the argument to the type with the passed precision
         *
         * @override
         * @param {(number | string)} inputArgument
         * @param {number} precision
         * @param {FormatSpecificationTypes} type
         * @return {*}  {string}
         * @memberof FloatSubFormatter
         */
        useFormatSpecificationPrecisionAndType(inputArgument, precision, type) {
            let argument = inputArgument;
            if (isNaN(precision)) {
                precision = this._defaultPrecision;
            }
            let precisedArgument = argument.toFixed(precision);
            if (type === formatSpecificationType_1.FormatSpecificationTypes.scientificERepresentationLowerCase || type === formatSpecificationType_1.FormatSpecificationTypes.scientificERepresentationUpperCase) {
                precisedArgument = this.getExponentialOutput(argument, precision, type);
            }
            if (type === formatSpecificationType_1.FormatSpecificationTypes.lengthOptimizedOutput) {
                precisedArgument = this.getLengthOptimizedOutput(argument, precision);
            }
            return precisedArgument;
        }
        /**
         * Converts the argument to a scientific E-representation
         *
         * @private
         * @param {number} argument
         * @param {number} precision
         * @param {FormatSpecificationTypes} type
         * @return {*}  {string}
         * @memberof FloatSubFormatter
         */
        getExponentialOutput(argument, precision, type) {
            let precisedArgument = "";
            if (type === formatSpecificationType_1.FormatSpecificationTypes.scientificERepresentationLowerCase) {
                precisedArgument = argument.toExponential(precision);
                precisedArgument = precisedArgument.toLowerCase();
            }
            if (type === formatSpecificationType_1.FormatSpecificationTypes.scientificERepresentationUpperCase) {
                precisedArgument = argument.toExponential(precision);
                precisedArgument = precisedArgument.toUpperCase();
            }
            return precisedArgument;
        }
        /**
         * The length optimized output removes unnecessary digits after the decimal point
         * or adapt the number of digits to the passed precision
         *
         * @private
         * @param {number} argument
         * @param {number} precision
         * @return {*}  {string}
         * @memberof FloatSubFormatter
         */
        getLengthOptimizedOutput(argument, precision) {
            let precisedArgument;
            // get the digits before and after comma
            let decimalContainer = argument.toString().split(".", 1);
            // when the precision is smaller than the digits before the comma, exponential output is needed
            if (precision < decimalContainer[0].length) {
                precisedArgument = argument.toExponential(precision - 1);
            }
            //Ohterwise decimal output gets returned
            else {
                precisedArgument = argument.toPrecision(precision);
                argument = parseFloat(precisedArgument);
                precisedArgument = argument.toString();
            }
            return precisedArgument;
        }
    };
    FloatSubFormatter = __decorate([
        mco.role()
    ], FloatSubFormatter);
    exports.FloatSubFormatter = FloatSubFormatter;
});
