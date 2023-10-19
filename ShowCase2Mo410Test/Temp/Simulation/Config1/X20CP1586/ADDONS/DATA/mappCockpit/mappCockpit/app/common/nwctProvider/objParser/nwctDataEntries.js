var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./nwctDataEntry", "./nwctPrsHelper", "./nwctPrsItemBase"], function (require, exports, nwctDataEntry_1, nwctPrsHelper_1, nwctPrsItemBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctDataEntries = void 0;
    let NwctDataEntries = class NwctDataEntries extends nwctPrsItemBase_1.NwctPrsItemBase {
        /**
         * Creates an instance of NwctDataEntries
         * Requires the part of the untyped nwct object (comming from the kaitai parser) that contains all data entries
         * @param {*} input
         * @param {NwctConfigEntries} configEntries
         * @memberof NwctDataEntries
         */
        constructor(input, location, configEntries) {
            super(input, location);
            this._parsed = false;
            this._sortedDataEntries = new Array();
            this._configEntries = configEntries;
        }
        /**
         * returns the sorted data entries
         * sorting order is with increasing index (this is equivalent to sort by increasing time)
         *
         * @readonly
         * @type {Array<INwctDataEntry>}
         * @memberof NwctDataEntries
         */
        get sortedDataEntries() {
            this.parse();
            return this._sortedDataEntries;
        }
        /**
         *
         *
         * @readonly
         * @type {Array<NwctDataEntry>}
         * @memberof NwctRoot
         */
        parse() {
            // only parse once
            if (this._parsed) {
                return;
            }
            this._parsed = true;
            // check availability of input data 
            if (!Array.isArray(this._input)) {
                this._sortedDataEntries = new Array(); // create empty array
                return;
            }
            // good case (input data available) --> map array elements
            let unsortedDataEntries = this._input.map(untypedEntry => {
                // create a data entry for each untyped array element
                let dataEntry = new nwctDataEntry_1.NwctDataEntry(untypedEntry, this, this._configEntries);
                return dataEntry;
            });
            // set sorted entries with ascending index
            this._sortedDataEntries = unsortedDataEntries.sort(this.compareIndex);
        }
        /**
         * Compare function to sort by growing index (for sorting)
         *
         * @private
         * @param {INwctDataEntry} a
         * @param {INwctDataEntry} b
         * @returns {number}
         * @memberof NwctDataEntries
         */
        compareIndex(a, b) {
            // undefined should be set to the end
            if (!a.index.valid) {
                return 1; // positive number --> change order --> b,a
            }
            if (!b.index.valid) {
                return -1; // negative number --> nothing to do --> a,b
            }
            // 
            return a.index.value - b.index.value;
        }
        /**
         *  Returns true if all items are valid
         *  ATTENTION: This can take a long time to process!
         *
         * @readonly
         * @type {boolean}
         * @memberof NwctDataEntries
         */
        get valid() {
            return nwctPrsHelper_1.NwctPrsHelper.areAllValid(this.sortedDataEntries);
        }
    };
    NwctDataEntries = __decorate([
        mco.role()
    ], NwctDataEntries);
    exports.NwctDataEntries = NwctDataEntries;
});
