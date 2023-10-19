var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./nwctConfigEntries", "./nwctDataEntries", "./nwctPropNames"], function (require, exports, nwctConfigEntries_1, nwctDataEntries_1, nwctPropNames_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctRoot = void 0;
    /**
     * allows to access nwct data record entries
     *
     * @export
     * @class NwctRoot
     */
    let NwctRoot = class NwctRoot {
        /**
         *Creates an instance of NwctRoot.
         * @param {NwctBinParser} input
         * @memberof NwctRoot
         */
        constructor(input) {
            this._input = input;
            // objects for retrieving content are created, but parsing is only done on demand
            this._configEntries = new nwctConfigEntries_1.NwctConfigEntries(this._input, [nwctPropNames_1.NwctPropNames.configEntries]);
            this._dataEntries = new nwctDataEntries_1.NwctDataEntries(this._input, [nwctPropNames_1.NwctPropNames.dataEntries], this._configEntries);
        }
        /**
         * returns a list of data entries
         *
         * @readonly
         * @type {INwctDataEntries}
         * @memberof NwctRoot
         */
        get dataEntries() {
            return this._dataEntries;
        }
        /**
         * returns a list of config entries
         *
         * @readonly
         * @type {INwctConfigEntries}
         * @memberof NwctRoot
         */
        get configEntries() {
            return this._configEntries;
        }
    };
    NwctRoot = __decorate([
        mco.role()
    ], NwctRoot);
    exports.NwctRoot = NwctRoot;
});
