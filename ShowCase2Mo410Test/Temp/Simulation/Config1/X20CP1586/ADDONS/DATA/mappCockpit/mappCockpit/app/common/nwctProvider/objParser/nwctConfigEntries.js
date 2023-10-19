var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./nwctConfigEntry", "./nwctPrsHelper", "./nwctPrsItemBase"], function (require, exports, nwctConfigEntry_1, nwctPrsHelper_1, nwctPrsItemBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctConfigEntries = void 0;
    /**
     * This class provides type safe access to a configuration records
     *
     * @export
     * @class NwctConfigEntries
     * @extends {NwctPrsItemBase}
     */
    let NwctConfigEntries = class NwctConfigEntries extends nwctPrsItemBase_1.NwctPrsItemBase {
        /**
         *Creates an instance of NwctConfigEntries.
         * @param {*} input
         * @param {string[]} location
         * @memberof NwctConfigEntries
         */
        constructor(input, location) {
            super(input, location);
            this._preprocessingCompleted = false; // is true after setting the config ID array once
            this._configEntries = new Array();
        }
        /**
         * returns all config entries unsorted
         *
         * @readonly
         * @type {Array<INwctConfigEntry>}
         * @memberof NwctConfigEntries
         */
        get configEntries() {
            this.preprocess();
            return this._configEntries;
        }
        /**
         * Allows to control when the time intensive parsing and sorting is done (also from the outside)
         *
         * @memberof NwctConfigEntries
         */
        preprocess() {
            // only do once
            if (this._preprocessingCompleted) {
                return;
            }
            this._preprocessingCompleted = true;
            this.parse(); // is only executed once anyway        
        }
        /**
        * Returns a list of all configuration entries
        *
        * @readonly
        * @private
        * @memberof NwctRoot
        */
        // private get configEntries(){      
        //     this.parse();
        //     return this._configEntries;
        // }
        /**
         * This method parses the untyped object
         * It takes care that parsing is done only once
         *
         * @private
         * @returns
         * @memberof NwctConfigEntries
         */
        parse() {
            // check availability of input data 
            if (!Array.isArray(this._input)) {
                this._configEntries = new Array(); // no items available --> create empty array
                return;
            }
            // good case (input data available) --> map array elements
            this._configEntries = this._input.map(untypedEntry => {
                // create a data entry for each untyped array element
                let dataEntry = new nwctConfigEntry_1.NwctConfigEntry(untypedEntry);
                return dataEntry;
            });
        }
        /**
         * Returns true if all contained items are valid
         * ATTENTION: Processing all items can consume a long time
         *
         * @readonly
         * @memberof NwctConfigEntry
         */
        get valid() {
            return nwctPrsHelper_1.NwctPrsHelper.areAllValid(this._configEntries);
        }
    };
    NwctConfigEntries = __decorate([
        mco.role()
    ], NwctConfigEntries);
    exports.NwctConfigEntries = NwctConfigEntries;
});
