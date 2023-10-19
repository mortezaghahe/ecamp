var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatSpecificationType = exports.FormatSpecificationTypes = void 0;
    var FormatSpecificationTypes;
    (function (FormatSpecificationTypes) {
        FormatSpecificationTypes["noType"] = "no type";
        FormatSpecificationTypes["signedInteger"] = "d o. i";
        FormatSpecificationTypes["unsignedInteger"] = "u";
        FormatSpecificationTypes["binaryNumber"] = "b";
        FormatSpecificationTypes["octalNumber"] = "o";
        FormatSpecificationTypes["hexadecimalLowercase"] = "x";
        FormatSpecificationTypes["hexadecimalUppercase"] = "X";
        FormatSpecificationTypes["decimalOutput"] = "f";
        FormatSpecificationTypes["scientificERepresentationLowerCase"] = "e";
        FormatSpecificationTypes["scientificERepresentationUpperCase"] = "E";
        FormatSpecificationTypes["lengthOptimizedOutput"] = "g o. G";
    })(FormatSpecificationTypes = exports.FormatSpecificationTypes || (exports.FormatSpecificationTypes = {}));
    /**
     * This class provides static formatSpecificationType functions
     *
     * @static
     * @class FormatSpecificationType
     */
    let FormatSpecificationType = class FormatSpecificationType {
        /**
         * Constructor set to private FormatSpecificationType class should only provide static functions.
         * Creates an instance of FormatSpecificationType.
         * @memberof FormatSpecificationType
         */
        constructor() { }
        ;
        /**
         * Check if the type string match to an IFormatSpecificationType and returns that
         * If there is no the IFormatSpecifaction.type is set to undefined
         *
         * @static
         * @param {IFormatSpecification} formatSpecification
         * @param {string} type
         * @return {IFormatSpecification}
         * @memberof FormatSpecificationType
         */
        static getFormatSpecificationType(formatSpecification, type) {
            // get the type or undefined
            let formatSpecificationType = this._typeMap.get(type);
            if (formatSpecificationType === undefined) {
                formatSpecificationType = FormatSpecificationTypes.noType;
            }
            formatSpecification.type = formatSpecificationType;
            return formatSpecification;
        }
        /**
         * Returns either the position from the textFormatSpecification before the type information
         * or the last position of the string when there is no type
         *
         * @static
         * @param {string} textFormatSpecification
         * @return {*}  {number}
         * @memberof FormatSpecificationType
         */
        static getTypeSeperator(textFormatSpecification) {
            let typeSeperator = textFormatSpecification.length - 1;
            if (this._typeMap.get(textFormatSpecification[typeSeperator]) === undefined) {
                ++typeSeperator;
            }
            return typeSeperator;
        }
    };
    FormatSpecificationType._typeMap = new Map([
        ["d", FormatSpecificationTypes.signedInteger],
        ["i", FormatSpecificationTypes.signedInteger],
        ["u", FormatSpecificationTypes.unsignedInteger],
        ["o", FormatSpecificationTypes.octalNumber],
        ["b", FormatSpecificationTypes.binaryNumber],
        ["x", FormatSpecificationTypes.hexadecimalLowercase],
        ["X", FormatSpecificationTypes.hexadecimalUppercase],
        ["f", FormatSpecificationTypes.decimalOutput],
        ["e", FormatSpecificationTypes.scientificERepresentationLowerCase],
        ["E", FormatSpecificationTypes.scientificERepresentationUpperCase],
        ["g", FormatSpecificationTypes.lengthOptimizedOutput],
        ["G", FormatSpecificationTypes.lengthOptimizedOutput]
    ]);
    FormatSpecificationType = __decorate([
        mco.role()
    ], FormatSpecificationType);
    exports.FormatSpecificationType = FormatSpecificationType;
});
