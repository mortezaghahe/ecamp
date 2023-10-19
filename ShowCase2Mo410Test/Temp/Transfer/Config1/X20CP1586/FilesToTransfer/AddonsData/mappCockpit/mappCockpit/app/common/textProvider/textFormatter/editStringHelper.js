var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../interface/formatterInputArgumentInterface", "../errorHandling/textSystemErrorTypes", "./formatItemIdentifier", "./formatSpecification/formatSpecification", "./formatSpecification/formatSpecificationFlag", "./formatSpecification/formatSpecificationPrecision", "./formatSpecification/formatSpecificationType", "./formatSpecification/formatSpecificationWidth", "./formatter/baseFormatterHelper", "./formatterInputArguments/formatterInputArgumentString"], function (require, exports, formatterInputArgumentInterface_1, textSystemErrorTypes_1, formatItemIdentifier_1, formatSpecification_1, formatSpecificationFlag_1, formatSpecificationPrecision_1, formatSpecificationType_1, formatSpecificationWidth_1, baseFormatterHelper_1, formatterInputArgumentString_1) {
    "use strict";
    var EditStringHelper_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EditStringHelper = void 0;
    /**
     * This class provides static string editation functions needed for the formatter
     *
     * @static
     * @class EditStringHelper
     */
    let EditStringHelper = EditStringHelper_1 = class EditStringHelper {
        /**
         * Constructor set to private string edit class should only provide static functions.
         * Creates an instance of EditStringHelper.
         * @memberof EditStringHelper
         */
        constructor() { }
        ;
        /**
         * Get a formatspecification type from text
         *
         * @param {string} textFormatSpecification
         * @param  {FormatterInputArgumentList | undefined} argumentList
         * @return {IFormatSpecification}
         * @memberof IFormatSpecification
         */
        static getFormatSpecificationFromText(textFormatSpecification, argumentList) {
            let formatSpecification = new formatSpecification_1.FormatSpecification();
            // adapt the string in case of a width reference ("*")
            textFormatSpecification = this.includeWidthReference(textFormatSpecification, argumentList);
            // get type -> type is always on last position of the formatSpecification
            formatSpecification = formatSpecificationType_1.FormatSpecificationType.getFormatSpecificationType(formatSpecification, textFormatSpecification[textFormatSpecification.length - 1]);
            // get flags -> flags are always in the front of the formatSpecification
            formatSpecification = formatSpecificationFlag_1.FormatSpecificationFlag.getFormatSpecificationFlag(formatSpecification, textFormatSpecification);
            // get precision -> precision is always after "."
            formatSpecification = formatSpecificationPrecision_1.FormatSpecificationPrecision.getFormatSpecificationPrecision(formatSpecification, textFormatSpecification, argumentList);
            // get width -> if there is a "." then the width is till then, else till the end of the string without the possible type
            formatSpecification = formatSpecificationWidth_1.FormatSpecificationWidth.getFormatSpecificationWidth(formatSpecification, textFormatSpecification);
            return formatSpecification;
        }
        /**
         * Format item {1|*2} specifies that the first argument (source) should
         * be output with at least the number of characters specified in the second argument.
         * Entering a negative value, e.g. -30, results in left-aligned output with at least 30 characters.
         * Conseqently this function should adapt the foramtspecificationtext before flag and width get interpreted.
         *
         * @private
         * @static
         * @param {string} textFormatSpecification
         * @param {number} endIndex
         * @param {FormatterInputArgumentList | undefined} argumentList
         * @return {*}  {string}
         * @memberof EditStringHelper
         */
        static includeWidthReference(textFormatSpecification, argumentList) {
            // get position of width reference "*"
            let indexOfFormatSpecificationWidthReference = textFormatSpecification.indexOf(formatItemIdentifier_1.FormatItemIdentifier.formatSpecificationReference);
            // if there is no width reference "*", or the index shows a precision reference ".*", then return the same formatSpecification
            if (!this.indexIsValid(indexOfFormatSpecificationWidthReference) || textFormatSpecification[indexOfFormatSpecificationWidthReference - 1] === formatItemIdentifier_1.FormatItemIdentifier.formatSpecificationPrecision) {
                return textFormatSpecification;
            }
            // get the string with the included width reference information
            let endIndex = formatSpecificationWidth_1.FormatSpecificationWidth.getWidthSeperator(textFormatSpecification);
            let widthReferenceItem = textFormatSpecification.substring(indexOfFormatSpecificationWidthReference + 1, endIndex);
            // get the referenced item, when sth wents wrong the widthReferenceItem is replaced
            let referencedWidthArg = this.getReferencedIntArgumentValueFromText(widthReferenceItem, argumentList);
            widthReferenceItem = referencedWidthArg.argument.toString();
            // replace the referenced item by the input argument in the formatSpecification string 
            return textFormatSpecification.substring(0, indexOfFormatSpecificationWidthReference) + widthReferenceItem + textFormatSpecification.substring(endIndex, textFormatSpecification.length);
        }
        /**
         * Get the referenced integer input argument of the argument list for formatSpecification precision or width
         * If sth went wrong an empty string argument is returned
         *
         * @static
         * @param {string} dataSource
         * @param {FormatterInputArgumentList | undefined} argumentList
         * @return {*}  {IFormatterInputArgument}
         * @memberof EditStringHelper
         */
        static getReferencedIntArgumentValueFromText(dataSource, argumentList) {
            let referencedInputArg;
            let checkedInputArgument = EditStringHelper_1.getInputArgumentFromText(dataSource, argumentList);
            // check if the referenced argument is from type integer
            if (checkedInputArgument.error === textSystemErrorTypes_1.TextSystemErrorTypes.NoError && checkedInputArgument.inputArgument.inputType === formatterInputArgumentInterface_1.FormatterArgumentTypes.Integer) {
                referencedInputArg = checkedInputArgument.inputArgument;
            }
            else {
                referencedInputArg = new formatterInputArgumentString_1.FormatterInputArgumentString("");
            }
            return referencedInputArg;
        }
        /**
         * The function receives a string and convert it to an index for the passed argument list.
         * If the index is accessed succesfully the input argument is returned
         * If sth went wrong, an error is set and the input argument is an empty string argument
         *
         * @private
         * @static
         * @param {string} dataSource
         * @param {FormatterInputArgumentList | undefined} argumentList
         * @return {*}  {CheckedInputArgument}
         * @memberof EditStringHelper
         */
        static getInputArgumentFromText(dataSource, argumentList) {
            // declaring default values
            let checkedInputArgument = {
                inputArgument: new formatterInputArgumentString_1.FormatterInputArgumentString(""),
                error: 0
            };
            // check if there is a argumentlist
            if (argumentList === undefined) {
                checkedInputArgument.error = textSystemErrorTypes_1.TextSystemErrorTypes.NoPassedArgumentlist;
            }
            else {
                let index = baseFormatterHelper_1.BaseFormatterHelper.parseStringToInt(dataSource);
                let inputArgument = argumentList.get(index);
                // check if an input argument is found
                if (inputArgument !== undefined) {
                    checkedInputArgument.inputArgument = inputArgument;
                }
                else {
                    checkedInputArgument.error = textSystemErrorTypes_1.TextSystemErrorTypes.InvalidIndexForArgumentList;
                }
            }
            return checkedInputArgument;
        }
        /**
         * The String.indexOf(symbol) function returns -1 in case that no symbol is found
         * Because of that this function checks if the index is valid or not
         *
         * @static
         * @param {number} index
         * @return {*}  {boolean}
         * @memberof EditStringHelper
         */
        static indexIsValid(index) {
            if (index === -1) {
                return false;
            }
            return true;
        }
    };
    EditStringHelper = EditStringHelper_1 = __decorate([
        mco.role()
    ], EditStringHelper);
    exports.EditStringHelper = EditStringHelper;
});
