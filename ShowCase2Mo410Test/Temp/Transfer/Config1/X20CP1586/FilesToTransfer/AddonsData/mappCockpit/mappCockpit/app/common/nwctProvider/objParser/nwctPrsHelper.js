var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctPrsHelper = void 0;
    /**
     * Contains all helper functions when parsing or processing the parsed items
     *
     * @export
     * @class NwctPrsHelper
     */
    let NwctPrsHelper = class NwctPrsHelper {
        /**
         * This class can not be instantiated, all methods are static
         * @memberof NwctPrsHelper
         */
        constructor() { }
        ;
        /**
        * Returns true if all contained parsed items are valid
        *
        * @static
        * @param {Array<INwctPrsItem>} prsItems
        * @returns
        * @memberof NwctPrsHelper
        */
        static areAllValid(prsItems) {
            // extract valid property
            let validStates = prsItems.map(propObj => propObj.valid);
            // result is only true if all properties are valid
            let result = validStates.reduce((tmpResult, currentValue) => tmpResult && currentValue);
            return result;
        }
    };
    NwctPrsHelper = __decorate([
        mco.role()
    ], NwctPrsHelper);
    exports.NwctPrsHelper = NwctPrsHelper;
});
