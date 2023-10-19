var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./nwctPrsItemBase"], function (require, exports, nwctPrsItemBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctPrsPayloadBytes = void 0;
    /**
     * This class retrieves the payload argurments as an uninterpreted byte array
     *
     * @export
     * @class NwctPrsPayloadBytes
     */
    let NwctPrsPayloadBytes = class NwctPrsPayloadBytes extends nwctPrsItemBase_1.NwctPrsItemBase {
        /**
         *Creates an instance of NwctPrsPayloadBytes.
         * @param {*} input
         * @param {string[]} location
         * @memberof NwctPrsPayloadBytes
         */
        constructor(input, location) {
            super(input, location);
        }
        /**
         * Dynamically parse all properties of the payload (the number of properties depends on the parId)
         *
         * @readonly
         * @type {Array<NwctPrsPayloadArgument>}
         * @memberof NwctPrsPayloadBytes
         */
        get value() {
            return this._input;
        }
        /**
        * Returns true, as the returned bytes can not be invalid
        *
        * @readonly
        * @memberof NwctPrsPayloadBytes
        */
        get valid() {
            return true;
        }
    };
    NwctPrsPayloadBytes = __decorate([
        mco.role()
    ], NwctPrsPayloadBytes);
    exports.NwctPrsPayloadBytes = NwctPrsPayloadBytes;
});
