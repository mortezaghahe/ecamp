var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./nwctConfigEntriesWrapper", "./nwctConfigEntryWrapper", "./nwctDataEntriesWrapper", "./nwctDataEntryWrapper"], function (require, exports, nwctConfigEntriesWrapper_1, nwctConfigEntryWrapper_1, nwctDataEntriesWrapper_1, nwctDataEntryWrapper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctPreProcess = void 0;
    /**
     * This class adds further information to the raw NWCT ringbuffer data, such as links between entries,...
     *
     * Input expectaction: strongly typed nwct record entries and data entries
     *
     * @export
     * @class NwctPreProcess
     */
    let NwctPreProcess = class NwctPreProcess {
        constructor(root) {
            // wrap all data entries
            let wDataEntries = root.dataEntries.sortedDataEntries.map(entry => new nwctDataEntryWrapper_1.NwctDataEntryWrapper(entry));
            this._wDataEntries = new nwctDataEntriesWrapper_1.NwctDataEntriesWrapper(wDataEntries);
            // wrap all config entries
            let configEntries = root.configEntries.configEntries.map(entry => new nwctConfigEntryWrapper_1.NwctConfigEntryWrapper(entry));
            this._wConfigEntries = new nwctConfigEntriesWrapper_1.NwctConfigEntriesWrapper(configEntries);
            //*********************************************************************************************************************** */
            // prepare config entries 
            //*********************************************************************************************************************** */
            this._wConfigEntries.preprocess();
            // match all data-entries with the responses and store the link on both sides
            this.mapDataEntriesAndConfigEntries();
            // for each config entry: sort the links to data entries by the data entry index
            this.sortDataReferencesInConfigEntries();
            // map responses to requests
            this.mapResponses();
        }
        /**
         * maps all responses to requests
         *
         * @private
         * @memberof NwctPreProcess
         */
        mapResponses() {
            // add the information to the config entries, which data entries they refer to
            // retrieve all request entries
            let requests = this._wDataEntries.wDataEntries.filter(wDataEntry => wDataEntry.isRequest);
            // link all responses
            requests.forEach(wDataEntry => {
                // get index of next request (this is the criteria to stop searching)
                let maxIndex = this.findIndexOfNextRequest(wDataEntry);
                wDataEntry.response = this.findResponse(wDataEntry, maxIndex);
                if (wDataEntry.response != undefined) {
                    // Set request entry within the response entry
                    wDataEntry.response.request = wDataEntry;
                }
            });
        }
        /**
         * This method maps data entries and config entries in both directions
         * One config entry hold an array of references to data entries
         *
         * config entry             data entry
         * ----------               ----------
         * |        |               |        |
         * |        | 1          n  |        |
         * |        |---------------|        |
         * |        |               |        |
         * ----------               ----------
         *
         * @private
         * @memberof NwctPreProcess
         */
        mapDataEntriesAndConfigEntries() {
            this._wDataEntries.wDataEntries.forEach(wDataEntry => wDataEntry.wConfigEntry = this._wConfigEntries.linkDataEntry2ConfigEntry(wDataEntry));
        }
        /**
         * This method iterates through all config entries and sorts the array of references to the data entries.
         *
         * @private
         * @memberof NwctPreProcess
         */
        sortDataReferencesInConfigEntries() {
            this._wConfigEntries.wConfigEntires.forEach(wConfigEntry => wConfigEntry.wDataEntries.sortByIndex());
        }
        /**
         * Searches for the response to an request entry stops the search when index >= maxIndex
         *
         * @private
         * @param {NwctDataEntryWrapper} wDataEntry
         * @returns {(NwctDataEntryWrapper | undefined)}
         * @memberof NwctPreProcess
         */
        findResponse(wDataEntry, maxIndex) {
            // the configId has to be the configId of the data entry +1
            let expectedConfigId = wDataEntry.dataEntry.configId.value + 1;
            // get the config entry that we are looking for
            let configEntry = this._wConfigEntries.getConfigEntry(expectedConfigId);
            // get all possible data entries (these are linke to the config entry)
            if (configEntry === undefined) { // only if there is a linked config entry
                return undefined;
            }
            let probes = configEntry.wDataEntries;
            // find response
            if (probes === undefined) { // only if there are probes
                return undefined;
            }
            let response = probes.findResponse(wDataEntry, maxIndex);
            return response;
        }
        /**
         * When searching for a response, the search has to be stopped when detecting the next response
         * This function returns the index of the next relevant request entry
         *
         * @private
         * @param {NwctDataEntryWrapper} wDataEntry
         * @returns {number}
         * @memberof NwctPreProcess
         */
        findIndexOfNextRequest(wDataEntry) {
            // the configId has to be the configId of the data entry +1
            let expectedConfigId = wDataEntry.dataEntry.configId.value;
            // get the config entry that we are looking for
            let configEntry = this._wConfigEntries.getConfigEntry(expectedConfigId);
            // get all possible data entries (these are linke to the config entry)
            if (configEntry === undefined) { // only if there is a linked config entry
                return 0; // no reply available
            }
            let probes = configEntry.wDataEntries;
            // find response
            if (probes === undefined) { // only if there are probes
                return 0; // no reply available
            }
            let nextRequest = probes.findNextRequest(wDataEntry);
            if (nextRequest === undefined || !nextRequest.dataEntry.index.valid) {
                return Number.MAX_SAFE_INTEGER; // no criteria to stop the serach found
            }
            return nextRequest.dataEntry.index.value;
        }
        get dataEntries() {
            return this._wDataEntries;
        }
    };
    NwctPreProcess = __decorate([
        mco.role()
    ], NwctPreProcess);
    exports.NwctPreProcess = NwctPreProcess;
});
