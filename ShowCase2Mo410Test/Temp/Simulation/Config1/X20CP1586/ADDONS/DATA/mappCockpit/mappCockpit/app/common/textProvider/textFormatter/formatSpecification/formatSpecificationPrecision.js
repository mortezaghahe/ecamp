var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../interface/formatterInputArgumentInterface", "../editStringHelper", "../formatItemIdentifier", "../formatter/baseFormatterHelper", "./formatSpecificationType"], function (require, exports, formatterInputArgumentInterface_1, editStringHelper_1, formatItemIdentifier_1, baseFormatterHelper_1, formatSpecificationType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatSpecificationPrecision = void 0;
    /**
     * This class provides static FormatSpecificationPrecision functions
     *
     * @static
     * @class FormatSpecificationPrecision
     */
    let FormatSpecificationPrecision = class FormatSpecificationPrecision {
        /**
         * Constructor set to private FormatSpecificationPrecision class should only provide static functions.
         * Creates an instance of FormatSpecificationPrecision.
         * @memberof FormatSpecificationPrecision
         */
        constructor() { }
        ;
        /**
         * Gets the precision from the input string as number and set it in the IFormatSpecification.precision
         * If there is no match NaN gets set to IFormatSpecification.precision
         *
         * @static
         * @param {IFormatSpecification} formatSpecification
         * @param {string} textFormatSpecification
         * @param  {FormatterInputArgumentList | undefined} argumentList
         * @return {IFormatSpecification}
         * @memberof FormatSpecificationPrecision
         */
        static getFormatSpecificationPrecision(formatSpecification, textFormatSpecification, argumenlist) {
            let precision = NaN;
            let precisionSeperator = this.getPrecisionSeperator(textFormatSpecification);
            // check if there is a precision
            if (editStringHelper_1.EditStringHelper.indexIsValid(precisionSeperator)) {
                let precisionStr = textFormatSpecification.substring(precisionSeperator + 1, formatSpecificationType_1.FormatSpecificationType.getTypeSeperator(textFormatSpecification));
                // check if there is a referenced precision "*"
                if (precisionStr[0] === formatItemIdentifier_1.FormatItemIdentifier.formatSpecificationReference) {
                    // get the referenced precision value from argument list
                    precisionStr = precisionStr.substring(1, precisionStr.length);
                    let referencedPrecisionArg = editStringHelper_1.EditStringHelper.getReferencedIntArgumentValueFromText(precisionStr, argumenlist);
                    // if an integer argument is found it is assigned to the precision
                    if (referencedPrecisionArg.inputType === formatterInputArgumentInterface_1.FormatterArgumentTypes.Integer) {
                        precision = referencedPrecisionArg.argument;
                    }
                }
                else {
                    // get the precision from string
                    precision = baseFormatterHelper_1.BaseFormatterHelper.parseStringToInt(precisionStr);
                }
            }
            formatSpecification.precision = Math.abs(precision);
            return formatSpecification;
        }
        /**
         * Returns either the position from the textFormatSpecification before the precision (".")
         * or -1 to signalize that there is no precision
         *
         * @static
    
         * @param {string} textFormatSpecification
         * @return {*}  {number}
         * @memberof FormatSpecificationType
         */
        static getPrecisionSeperator(textFormatSpecification) {
            // search the index of "." from the formatspecification string
            return textFormatSpecification.indexOf(formatItemIdentifier_1.FormatItemIdentifier.formatSpecificationPrecision);
        }
    };
    FormatSpecificationPrecision = __decorate([
        mco.role()
    ], FormatSpecificationPrecision);
    exports.FormatSpecificationPrecision = FormatSpecificationPrecision;
});
