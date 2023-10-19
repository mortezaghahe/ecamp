var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctPrsItemBase = void 0;
    /**
     * This is the base for all obj parser parts
     *
     * @export
     * @abstract
     * @class NwctPrsItemBase
     * @implements {INwctPrsItem}
     */
    let NwctPrsItemBase = class NwctPrsItemBase {
        /**
         *Creates an instance of NwctPrsItemBase.
         * @param {*} input
         * @param {Array<string>} [location]
         * @memberof NwctPrsItemBase
         */
        constructor(input, location) {
            // retrieve property if location is provided
            if (location !== undefined && location.length >= 1) {
                this._input = this.getUntypedPropertyByName(input, location);
            }
            else { // input is at the right position already
                this._input = input;
            }
        }
        /**
         * retrives an untyped property via the name
         *
         * @protected
         * @param {*} input
         * @param {Array<string>} locationOfPropertyInInput
         * @returns {*}
         * @memberof NwctPrsItemBase
         */
        getUntypedPropertyByName(input, locationOfPropertyInInput) {
            let property = input;
            // resolve the protperty that might be a inside of a property, e.g. ["acoposData", "payload", "ctn"] -> "acoposData.payload.ctn"
            locationOfPropertyInInput.forEach(nameOfProperty => {
                property !== undefined ? property = property[nameOfProperty] : property = undefined;
            });
            return property;
        }
    };
    NwctPrsItemBase = __decorate([
        mco.role()
    ], NwctPrsItemBase);
    exports.NwctPrsItemBase = NwctPrsItemBase;
});
