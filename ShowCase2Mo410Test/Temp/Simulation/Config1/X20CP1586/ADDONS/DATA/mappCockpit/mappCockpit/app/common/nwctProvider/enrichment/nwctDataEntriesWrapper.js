var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var NwctDataEntriesWrapper_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctDataEntriesWrapper = void 0;
    let NwctDataEntriesWrapper = NwctDataEntriesWrapper_1 = class NwctDataEntriesWrapper {
        constructor(dataEntries = new Array()) {
            this._wDataEntriesSorted = new Array();
            this._wDataEntries = dataEntries;
        }
        addDataEntry(dataEntry) {
            this._wDataEntries.push(dataEntry);
        }
        get wDataEntries() {
            return this._wDataEntries;
        }
        /**
         * sorts the data entries by ID
         *
         * @private
         * @memberof NwctDataEntriesWrapper
         */
        sortByIndex() {
            // do only once
            if (this.isSortedByIndex) {
                return;
            }
            this._wDataEntriesSorted = this._wDataEntries.sort(this.compareIndex);
        }
        // checks if the entries were already sorted
        get isSortedByIndex() {
            return this.wDataEntries.length === this._wDataEntriesSorted.length;
        }
        compareIndex(a, b) {
            // undefined should be set to the end
            if (!a.dataEntry.index.valid) {
                return 1; // positive number --> change order --> b,a
            }
            if (!b.dataEntry.index.valid) {
                return -1; // negative number --> nothing to do --> a,b
            }
            // 
            return a.dataEntry.index.value - b.dataEntry.index.value;
        }
        /**
         * Find the response to a given request
         *
         * Prerequisits:
         * - All probed data entries all fullfill: configId(probe) == configId(request) +1
         *
         * @param {NwctDataEntryWrapper} request
         * @returns {(NwctDataEntryWrapper | undefined)}
         * @memberof NwctDataEntriesWrapper
         */
        findResponse(request, maxIndex) {
            // validate input data
            if (request.wConfigEntry === undefined) {
                return undefined;
            }
            // prepare return data
            let response = undefined;
            // begin the search with the first entry that has a higher index number
            let searchIndex = this._wDataEntriesSorted.findIndex(probe => probe.dataEntry.index.value > request.dataEntry.index.value);
            // check if there is no next element available --> exit
            if (searchIndex === -1) {
                return undefined;
            }
            let isMatch = false;
            let abort = false;
            // search for the first match, but stop at the end of the array
            while (searchIndex < this._wDataEntriesSorted.length && !isMatch && !abort) {
                // fetch next entry
                let probe = this._wDataEntriesSorted[searchIndex];
                // check for abort criteria
                abort = NwctDataEntriesWrapper_1.isAbortCriteriaMet(probe, maxIndex);
                // if(abort){
                //     console.debug("abort criteria met: request: index="+request.dataEntry.index.value.toString()+"; abortIndex="+maxIndex.toString());
                // }
                // does entry match?
                isMatch = NwctDataEntriesWrapper_1.isResponse(probe, request);
                if (isMatch && !abort) {
                    // set return values
                    response = probe;
                }
                // increment search index
                searchIndex++;
            }
            return response;
        }
        /**
         * checks if the search for a response should be stopped because the abort criteria is met
         *
         * @private
         * @static
         * @param {NwctDataEntryWrapper} probedDataEntry
         * @param {number} maxIndex
         * @returns {boolean}
         * @memberof NwctDataEntriesWrapper
         */
        static isAbortCriteriaMet(probedDataEntry, maxIndex) {
            if (probedDataEntry == undefined || !probedDataEntry.dataEntry.index.valid) {
                return true;
            }
            return probedDataEntry.dataEntry.index.value >= maxIndex;
        }
        /**
         * Find the next request to a given request
         *  used to stop the search for response
         *
         * Prerequisits:
         * - All probed data entries all fullfill: configId(probe) == configId(request)
         *
         * @param {NwctDataEntryWrapper} request
         * @returns {(NwctDataEntryWrapper | undefined)}
         * @memberof NwctDataEntriesWrapper
         */
        findNextRequest(request) {
            // validate input data
            if (request.wConfigEntry === undefined) {
                return undefined;
            }
            // prepare return data
            let nextRequest = undefined;
            // begin the search with the first entry that has a higher index number
            let searchIndex = this._wDataEntriesSorted.findIndex(probe => probe.dataEntry.index.value > request.dataEntry.index.value);
            // no next entry found
            if (searchIndex === -1) {
                return undefined;
            }
            let isMatch = false;
            let abort = false;
            // search for the first match, but stop at the end of the array
            while (searchIndex < this._wDataEntriesSorted.length && !isMatch && !abort) {
                // fetch next entry
                let probe = this._wDataEntriesSorted[searchIndex];
                // does entry match?
                isMatch = NwctDataEntriesWrapper_1.isNextRequest(probe, request);
                if (isMatch) {
                    // set return values
                    nextRequest = probe;
                }
                // increment search index
                searchIndex++;
            }
            return nextRequest;
        }
        /**
         * Check response to a given reqeust
         *
         * Prerequisits:
         * - The probed data entries all fullfill: configId(probe) == configId(request) +1
         * - The probed data entries have been inserted after the request
         *
         * @private
         * @static
         * @param {NwctDataEntryWrapper} probedDataEntry
         * @param {NwctDataEntryWrapper} request
         * @returns {boolean}
         * @memberof NwctDataEntriesWrapper
         */
        static isResponse(probedDataEntry, request) {
            if (probedDataEntry == undefined || request == undefined) {
                console.error("nwctProvider: probedDataEntry or request undefined!");
                return false;
            }
            // criteria 1: parCnt has to be identical
            let criteria1 = probedDataEntry.dataEntry.parCnt.valid &&
                request.dataEntry.parCnt.valid &&
                probedDataEntry.dataEntry.parCnt.value === request.dataEntry.parCnt.value;
            // criteria 2: ChannelIndex(Response) == Channelndex(Request)                                 
            let criteria2 = probedDataEntry.dataEntry.channelIndex.valid &&
                request.dataEntry.channelIndex.valid &&
                probedDataEntry.dataEntry.channelIndex.value === request.dataEntry.channelIndex.value;
            // all criteria must be met
            return criteria1 && criteria2;
        }
        /**
         * checks if the probe is the next request
         *
         * Prerequisits:
         * - The probed data entries all fullfill: configId(probe) == configId(request)
         * - The probed data entries have been inserted after the request
         *
         * @private
         * @static
         * @memberof NwctDataEntriesWrapper
         */
        static isNextRequest(probedDataEntry, request) {
            if (probedDataEntry == undefined || request == undefined) {
                console.error("nwctProvider: probedDataEntry or request undefined!");
                return false;
            }
            // criteria 1: parCnt has to be identical --> ParCnt(Request2) == ParCnt(Request1)
            let criteria1 = probedDataEntry.dataEntry.parCnt.valid &&
                request.dataEntry.parCnt.valid &&
                probedDataEntry.dataEntry.parCnt.value === request.dataEntry.parCnt.value;
            // criteria 2: ChannelIndex(Request2) == Channelndex(Request1)                             
            let criteria2 = probedDataEntry.dataEntry.channelIndex.valid &&
                request.dataEntry.channelIndex.valid &&
                probedDataEntry.dataEntry.channelIndex.value === request.dataEntry.channelIndex.value;
            // all criteria must be met
            return criteria1 && criteria2;
        }
    };
    NwctDataEntriesWrapper = NwctDataEntriesWrapper_1 = __decorate([
        mco.role()
    ], NwctDataEntriesWrapper);
    exports.NwctDataEntriesWrapper = NwctDataEntriesWrapper;
});
