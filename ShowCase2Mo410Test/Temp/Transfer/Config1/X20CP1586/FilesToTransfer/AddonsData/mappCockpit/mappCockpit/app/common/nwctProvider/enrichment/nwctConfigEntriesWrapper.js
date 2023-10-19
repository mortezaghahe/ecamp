var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../utilities/binSearch"], function (require, exports, binSearch_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctConfigEntriesWrapper = void 0;
    let NwctConfigEntriesWrapper = class NwctConfigEntriesWrapper {
        constructor(configEntries) {
            this._wConfigEntriesSorted = new Array();
            this._configIDsSorted = new Array();
            this._preprocessingCompleted = false;
            this._wConfigEntries = configEntries;
        }
        get configEntry() {
            return this._wConfigEntries;
        }
        /**
         * perform all preprocessing tasks to allow a fast search
         *
         * @returns
         * @memberof NwctConfigEntriesWrapper
         */
        preprocess() {
            // only do once
            if (this._preprocessingCompleted) {
                return;
            }
            this._preprocessingCompleted = true;
            this.sortById(); // only executed once anyway
            this.setConfigIDsSorted(); // only executed once anyway
        }
        /**
         * Sets the sorted entries array (sorted by ascending configRecordID)
         *
         * @private
         * @memberof NwctConfigEntriesWrapper
         */
        sortById() {
            this._wConfigEntriesSorted = this._wConfigEntries.sort(this.compareConfigId);
        }
        /**
         * used to sort the config entries based on configRecordID
         *
         * @private
         * @param {INwctConfigEntry} a
         * @param {INwctConfigEntry} b
         * @returns {number}
         * @memberof NwctConfigEntriesWrapper
         */
        compareConfigId(a, b) {
            // undefined should be set to the end
            if (!a.configEntry.configurationRecordId.valid) {
                return 1; // positive number --> change order --> b,a
            }
            if (!b.configEntry.configurationRecordId.valid) {
                return -1; // negative number --> nothing to do --> a,b
            }
            return a.configEntry.configurationRecordId.value - b.configEntry.configurationRecordId.value;
        }
        /**
         * creates an array that only contains the config IDs (for use in binary search)
         *
         * @private
         * @memberof NwctConfigEntriesWrapper
         */
        setConfigIDsSorted() {
            this._configIDsSorted = this._wConfigEntriesSorted.map(wConfigEntrie => wConfigEntrie.configEntry.configurationRecordId.value);
        }
        /**
         *
         *
         * @private
         * @param {number} p
         * @param {number} q
         * @returns {number}
         * @memberof NwctConfigEntriesWrapper
         */
        cmpBinSearchNumber(p, q) {
            return p - q;
        }
        /**
         * This method should be used to get the config entry for a specific config id
         * It returns undefined if it can't be found
         *
         * @param {number} id
         * @returns {(INwctConfigEntry | undefined)}
         * @memberof NwctConfigEntriesWrapper
         */
        getConfigEntry(id) {
            this.preprocess();
            // return the config entry with the correct id or undifined
            let arrayIndex = binSearch_1.BinSearch.findExactMatch(this._configIDsSorted, id, this.cmpBinSearchNumber);
            return this._wConfigEntriesSorted[arrayIndex];
        }
        /**
         * Searches for the matching config entry
         *  if it can be found, then:
         *      - the link to the data entry will be stored in the config entry
         *      - the config entry is returned
         *
         * @param {NwctDataEntryWrapper} wDataEntry
         * @memberof NwctConfigEntriesWrapper
         */
        linkDataEntry2ConfigEntry(wDataEntry) {
            // check for valid config ID
            if (!wDataEntry.dataEntry.configId.valid) {
                return undefined;
            }
            let configId = wDataEntry.dataEntry.configId.value;
            let configEntry = this.getConfigEntry(configId);
            // config could not be found
            if (configEntry === undefined) {
                return undefined;
            }
            // config available
            configEntry.addDataEntryRef(wDataEntry);
            return configEntry;
        }
        // for performance comparison only
        getConfigEntryDeprivcated(id) {
            this.preprocess();
            return this._wConfigEntries.find(entry => entry.configEntry.valid && entry.configEntry.configurationRecordId.value === id);
        }
        /**
         * return all config entries
         *
         * @readonly
         * @type {Array<NwctConfigEntryWrapper>}
         * @memberof NwctConfigEntriesWrapper
         */
        get wConfigEntires() {
            return this._wConfigEntries;
        }
    };
    NwctConfigEntriesWrapper = __decorate([
        mco.role()
    ], NwctConfigEntriesWrapper);
    exports.NwctConfigEntriesWrapper = NwctConfigEntriesWrapper;
});
