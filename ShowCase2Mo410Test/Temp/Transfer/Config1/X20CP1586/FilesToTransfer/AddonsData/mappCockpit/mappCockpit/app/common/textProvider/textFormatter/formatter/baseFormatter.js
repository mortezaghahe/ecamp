var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../formatSpecification/formatSpecificationFlag", "./alternativeFormatting", "./baseFormatterHelper", "./signHolder"], function (require, exports, formatSpecificationFlag_1, alternativeFormatting_1, baseFormatterHelper_1, signHolder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseFormatter = void 0;
    /**
     * The BaseFormatter defines the control flow of the format function,
     * which has some parts that are need to be overriden by the subFormatters
     *
     * @export
     * @class BaseFormatter
     * @implements {ISubFormatter}
     */
    let BaseFormatter = class BaseFormatter {
        /**
         * Defines the process of the subformatters
         *
         * @param {(string | number)} argument
         * @param {IFormatSpecification} formatSpecification
         * @param {string} engineeringUnit
         * @return {*}  {string}
         * @memberof BaseFormatter
         */
        format(argument, formatSpecification, engineeringUnit) {
            let formattedArgument;
            let signHolder = new signHolder_1.SignHolder();
            if (typeof argument === 'number') {
                argument = signHolder.getUnsigendArgument(argument);
            }
            formattedArgument = this.useFormatSpecificationPrecisionAndType(argument, formatSpecification.precision, formatSpecification.type);
            formattedArgument = this.useFormatSpecificationFlags(formattedArgument, formatSpecification.flags, formatSpecification.width, formatSpecification.type, signHolder);
            formattedArgument = this.useFormatSpecificationWidth(formattedArgument, formatSpecification.width);
            formattedArgument += engineeringUnit;
            return formattedArgument;
        }
        /**
         * Need to be overriden by the subformatters
         * The respective subformatter adapt the precision and type information to the argument
         *
         * @protected
         * @param {(number | string)} argument
         * @param {number} precision
         * @param {FormatSpecificationTypes} type
         * @return {*}  {string}
         * @memberof BaseFormatter
         */
        useFormatSpecificationPrecisionAndType(argument, precision, type) {
            return argument.toString();
        }
        /**
         * Choose the right action for the set flags of the format Item
         *
         * @private
         * @param {string} argument
         * @param {Array<FormatSpecificationFlags>} flags
         * @param {number} width
         * @param {FormatSpecificationTypes} type
         * @return {string}
         * @memberof BaseFormatter
         */
        useFormatSpecificationFlags(argument, flags, width, type, signHolder) {
            let formattedArgument = argument;
            let frontPart = "";
            // Only for float and int input arguments 
            // Only one Flag of these three is used even when others are set -> the order shows the priorities of the flags!
            if (flags.includes(formatSpecificationFlag_1.FormatSpecificationFlags.alternativeFormtting)) {
                frontPart = alternativeFormatting_1.AlternativeFormatting.get(type);
            }
            else if (flags.includes(formatSpecificationFlag_1.FormatSpecificationFlags.signAlwaysOutput)) {
                frontPart = baseFormatterHelper_1.BaseFormatterHelper.getSignAlwaysOutput(signHolder);
            }
            else if (flags.includes(formatSpecificationFlag_1.FormatSpecificationFlags.signOnlyNegativeOutput)) {
                frontPart = baseFormatterHelper_1.BaseFormatterHelper.getSignOnlyNegativeOutput(signHolder);
            }
            else {
                if (signHolder.getSign() === "-") {
                    frontPart = signHolder.getSign();
                }
            }
            width -= frontPart.length;
            // Used for formatting the output
            // Again only one Flag of these two flags is used even when the other one is set -> the order shows the priorities of the flags!
            if (flags.includes(formatSpecificationFlag_1.FormatSpecificationFlags.leftAlignedOutput)) {
                formattedArgument = baseFormatterHelper_1.BaseFormatterHelper.extendArgumentToLength(argument, width, false);
            }
            else if (flags.includes(formatSpecificationFlag_1.FormatSpecificationFlags.fillOutputWithNull)) {
                formattedArgument = this.fillItemWithNull(argument, width);
            }
            return frontPart + formattedArgument;
        }
        /**
         * The width of the argument needs to be at least the defined width.
         * If the width is undfined the argument stays the same.
         * if the argument width is shorter than spaces are add.
         *
         * @private
         * @param {string} argument
         * @param {number} width
         * @return {string}
         * @memberof BaseFormatter
         */
        useFormatSpecificationWidth(argument, width) {
            return baseFormatterHelper_1.BaseFormatterHelper.extendArgumentToLength(argument, width, true);
        }
        /**
         * Fills the difference between width and the argument length with nulls
         *
         * @private
         * @param {string} argument
         * @param {number} width
         * @return {string}
         * @memberof BaseFormatter
         */
        fillItemWithNull(argument, width) {
            return baseFormatterHelper_1.BaseFormatterHelper.extendArgumentToLength(argument, width, true, "0");
        }
    };
    BaseFormatter = __decorate([
        mco.role()
    ], BaseFormatter);
    exports.BaseFormatter = BaseFormatter;
});
