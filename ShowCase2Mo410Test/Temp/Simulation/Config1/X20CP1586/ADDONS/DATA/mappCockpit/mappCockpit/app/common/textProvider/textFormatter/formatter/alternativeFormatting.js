var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../formatSpecification/formatSpecificationType"], function (require, exports, formatSpecificationType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AlternativeFormatting = void 0;
    /**
     * A class for using alternative formats
     *
     * @export
     * @static
     * @class AlternativeFormatting
     */
    let AlternativeFormatting = class AlternativeFormatting {
        /**
         * Creates an instance of AlternativeFormatting.
         * @memberof AlternativeFormatting
         */
        constructor() { }
        ;
        /**
         * Gives the opportunity to add specific string inforamtions for a formatspecification type in front of the argument.
         * The spcific string information need to be set in the "alternativeFormattingMap" with the type key first.
         *
         * @private
         * @static
         * @param {FormatSpecificationTypes} type
         * @return {*}  {string}
         * @memberof BaseFormatter
         */
        static get(type) {
            // get the specific string for the alterantive formatting 
            let alternativeFormatting = this._alternativeFormattingMap.get(type);
            if (alternativeFormatting === undefined) {
                alternativeFormatting = "";
            }
            return alternativeFormatting;
        }
    };
    /**
     * Mapping formatspecificationtype to strings for an alternative format
     *
     * @private
     * @type {(Map<FormatSpecificationTypes>, string>)}
     * @memberof BaseFormatter
     */
    AlternativeFormatting._alternativeFormattingMap = new Map([
        [formatSpecificationType_1.FormatSpecificationTypes.octalNumber, "0"],
        [formatSpecificationType_1.FormatSpecificationTypes.hexadecimalLowercase, "0x"],
        [formatSpecificationType_1.FormatSpecificationTypes.hexadecimalUppercase, "0X"]
    ]);
    AlternativeFormatting = __decorate([
        mco.role()
    ], AlternativeFormatting);
    exports.AlternativeFormatting = AlternativeFormatting;
});
