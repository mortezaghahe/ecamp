var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../libs/math/mathjs"], function (require, exports, math) {
    "use strict";
    var MathjsHtmlConverter_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MathjsHtmlConverter = void 0;
    /**
     * Helper class for calculator to convert the value to html and back with mathjs.
     *
     * @class MathjsHtmlConverter
     */
    let MathjsHtmlConverter = MathjsHtmlConverter_1 = class MathjsHtmlConverter {
        /**
         *Creates an instance of MathjsHtmlConverter.
         * @param {string} [ignoredValue=""] for ignored value the converter don't execute
         * @memberof MathjsHtmlConverter
         */
        constructor(ignoredValue = "") {
            this._ignoredValue = ignoredValue;
        }
        /**
         * Convert text formular to HTML code
         *
         * @public
         * @static
         * @param {string} value
         * @returns {string}
         * @memberof MathjsHtmlConverter
         */
        getValueFromRawValue(rawValue) {
            if (this._ignoredValue !== rawValue) {
                try {
                    let code = math.parse(rawValue);
                    //Transform to html string for user output
                    let nodeHTML = code.toHTML();
                    //Add the color information to the html transformed formular
                    rawValue = MathjsHtmlConverter_1.htmlColorCode + nodeHTML;
                }
                catch (error) {
                    //If an error occure while parsing then give back the unchanged htmlValue
                    return rawValue;
                }
            }
            return rawValue;
        }
    };
    //Color information for html output that enables the syntax higlighting
    MathjsHtmlConverter.htmlColorCode = `<style> 
            .math-number, .math-imaginary-symbol{ 
                color: #006666; 
                font-family: monospace; 
            } 
            .math-string{ 
                color: #990000; 
                font-family: monospace; 
            } 
            .math-symbol, .math-boolean, .math-undefined, .math-null-symbol, .math-nan-symbol, .math-infinity-symbol{ 
                color: black; 
                font-family: monospace; 
            } 
            .math-function{ 
                color: purple; 
                font-family: monospace; 
                font-weight: bold; 
            } 
            .math-parameter, .math-property{ 
                color: black; 
                font-family: monospace; 
            } 
            .math-operator, .math-parenthesis, .math-separator{ 
                color: black; 
                font-family: monospace; 
            } 
        </style>`;
    MathjsHtmlConverter = MathjsHtmlConverter_1 = __decorate([
        mco.role()
    ], MathjsHtmlConverter);
    exports.MathjsHtmlConverter = MathjsHtmlConverter;
});
