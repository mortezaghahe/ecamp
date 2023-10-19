var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../editStringHelper", "../formatter/baseFormatterHelper", "./formatSpecificationFlag", "./formatSpecificationPrecision", "./formatSpecificationType"], function (require, exports, editStringHelper_1, baseFormatterHelper_1, formatSpecificationFlag_1, formatSpecificationPrecision_1, formatSpecificationType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatSpecificationWidth = void 0;
    /**
     * This class provides static FormatSpecificationWidth functions
     *
     * @static
     * @class FormatSpecificationWidth
     */
    let FormatSpecificationWidth = class FormatSpecificationWidth {
        /**
         * Constructor set to private FormatSpecificationWidth class should only provide static functions.
         * Creates an instance of FormatSpecificationWidth.
         * @memberof FormatSpecificationWidth
         */
        constructor() { }
        ;
        /**
         * Gets the width from the input string as number and set it in the IFormatSpecification.width
         * If there is no match no width is set
         *
         * @static
         * @param {IFormatSpecification} formatSpecification
         * @param {string} textFormatSpecification
         * @return {IFormatSpecification}
         * @memberof FormatSpecificationWidth
         */
        static getFormatSpecificationWidth(formatSpecification, textFormatSpecification) {
            // get width string from the FormatSpecification string
            let flagSeperator = formatSpecificationFlag_1.FormatSpecificationFlag.getFlagsSeperator(textFormatSpecification);
            let widthSeperator = this.getWidthSeperator(textFormatSpecification);
            let widthStr = textFormatSpecification.substring(flagSeperator, widthSeperator);
            // get width from the width string
            let width = baseFormatterHelper_1.BaseFormatterHelper.parseStringToInt(widthStr);
            if (!isNaN(width)) {
                formatSpecification.width = width;
            }
            return formatSpecification;
        }
        /**
         * Returns the position of the textFormatSpecification that shows the end of the width
         *
         *
         * @static
         * @param {string} textFormatSpecification
         * @return {*}  {number}
         * @memberof FormatSpecificationType
         */
        static getWidthSeperator(textFormatSpecification) {
            //get the position of "."
            let widthSeperator = formatSpecificationPrecision_1.FormatSpecificationPrecision.getPrecisionSeperator(textFormatSpecification);
            //if there is no "." then get the type position
            if (!editStringHelper_1.EditStringHelper.indexIsValid(widthSeperator)) {
                widthSeperator = formatSpecificationType_1.FormatSpecificationType.getTypeSeperator(textFormatSpecification);
            }
            return widthSeperator;
        }
    };
    FormatSpecificationWidth = __decorate([
        mco.role()
    ], FormatSpecificationWidth);
    exports.FormatSpecificationWidth = FormatSpecificationWidth;
});
