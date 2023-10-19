var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatSpecificationFlag = exports.FormatSpecificationFlags = void 0;
    var FormatSpecificationFlags;
    (function (FormatSpecificationFlags) {
        FormatSpecificationFlags["leftAlignedOutput"] = "-";
        FormatSpecificationFlags["signAlwaysOutput"] = "+";
        FormatSpecificationFlags["signOnlyNegativeOutput"] = " ";
        FormatSpecificationFlags["fillOutputWithNull"] = "0";
        FormatSpecificationFlags["alternativeFormtting"] = "#";
    })(FormatSpecificationFlags = exports.FormatSpecificationFlags || (exports.FormatSpecificationFlags = {}));
    /**
     * This class provides static flag functions
     *
     * @static
     * @class FormatSpecificationFlag
     */
    let FormatSpecificationFlag = class FormatSpecificationFlag {
        /**
         * Constructor set to private FormatSpecificationFlag class should only provide static functions.
         * Creates an instance of FormatSpecificationFlag.
         * @memberof FormatSpecificationFlag
         */
        constructor() { }
        ;
        /**
         * Get the included IFormatSpecificationFlag from the passed string.
         * If there is no match IFormatSpecification.flags an empty array
         *
         * @static
         * @param {IFormatSpecification} formatSpecification
         * @param {string} textFormatSpecification
         * @return {*}  {Array<IFormatSpecificationFlag>}
         * @memberof FormatSpecificationFlag
         */
        static getFormatSpecificationFlag(formatSpecification, textFormatSpecification) {
            let flagSeperator = this.getFlagsSeperator(textFormatSpecification);
            let flagString = textFormatSpecification.substring(0, flagSeperator);
            let flagItem;
            for (let i = 0; i < flagString.length; i++) {
                // get the IFormatSpecificationFlag from the given position
                flagItem = this._flagMap.get(flagString[i]);
                // check if the flag is allready in the array
                if (flagItem !== undefined && !formatSpecification.flags.includes(flagItem)) {
                    formatSpecification.flags.push(flagItem);
                }
            }
            return formatSpecification;
        }
        /**
         * Returns the amount of flag symbols in the formatSpecification string
         *
         * @static
         * @param {string} textFormatSpecification
         * @return {*}  {number}
         * @memberof FormatSpecificationFlag
         */
        static getFlagsSeperator(textFormatSpecification) {
            let cnt = 0;
            let flagItem;
            // counts up every time a flag is found, if no flag is found break up
            do {
                flagItem = this._flagMap.get(textFormatSpecification[cnt]);
                ++cnt;
            } while (flagItem !== undefined);
            return cnt - 1;
        }
    };
    /**
     * Maps the string flag to the enum flag
     *
     * @private
     * @static
     * @type {Map<string, FormatSpecificationFlags>}
     * @memberof FormatSpecificationFlag
     */
    FormatSpecificationFlag._flagMap = new Map([
        ["-", FormatSpecificationFlags.leftAlignedOutput],
        ["+", FormatSpecificationFlags.signAlwaysOutput],
        [" ", FormatSpecificationFlags.signOnlyNegativeOutput],
        ["0", FormatSpecificationFlags.fillOutputWithNull],
        ["#", FormatSpecificationFlags.alternativeFormtting]
    ]);
    FormatSpecificationFlag = __decorate([
        mco.role()
    ], FormatSpecificationFlag);
    exports.FormatSpecificationFlag = FormatSpecificationFlag;
});
