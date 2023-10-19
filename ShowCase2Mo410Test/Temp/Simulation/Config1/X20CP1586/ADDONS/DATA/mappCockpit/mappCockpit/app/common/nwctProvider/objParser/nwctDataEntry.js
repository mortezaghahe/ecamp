var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./nwctPrsPropertyNumber", "./nwctPropNames", "./nwctPrsItemBase", "./nwctPrsPayloadBytes"], function (require, exports, nwctPrsPropertyNumber_1, nwctPropNames_1, nwctPrsItemBase_1, nwctPrsPayloadBytes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctDataEntry = void 0;
    /**
     * Parses a single data entry comming from the nwct kaitai parser
     * Gives strictly typed access to the content of the entry
     *
     * @export
     * @class NwctDataEntry
     */
    let NwctDataEntry = class NwctDataEntry extends nwctPrsItemBase_1.NwctPrsItemBase {
        /**
         * Creates an instance of NwctDataEntry.
         * @param {*} input expexts the data comming from the kaitai generated parser
         * @param {NwctConfigEntries} objParsRoot
         * @param {NwctDataEntries} dataEntries
         * @memberof NwctDataEntry
         */
        constructor(input, dataEntries, configEntries) {
            super(input);
            this._configEntry = undefined; // this is teh configuration record that was referenced by the config record id
            this._dataEntries = dataEntries;
            this._configEntries = configEntries;
            this._parId = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.dataAcopos, nwctPropNames_1.NwctPropNames.dataParId]);
            this._time = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.dataTime]);
            this._index = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.dataNo]);
            this._parCnt = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.dataAcopos, nwctPropNames_1.NwctPropNames.dataCnt]);
            this._channelIndex = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.dataChannelIndex]);
            this._ncObjectType = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.ncObjectType]);
            this._configId = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.dataConfigEntryId]);
            this._payload = new nwctPrsPayloadBytes_1.NwctPrsPayloadBytes(input, [nwctPropNames_1.NwctPropNames.dataAcopos, nwctPropNames_1.NwctPropNames.dataPayload]);
            // create list of all contained parse items to be able to compute the sum of the states
            this._prsItems = new Array();
            this._prsItems.push(this._parId);
            this._prsItems.push(this._time);
            this._prsItems.push(this._index);
            this._prsItems.push(this._parCnt);
            this._prsItems.push(this._channelIndex);
            this._prsItems.push(this._ncObjectType);
            this._prsItems.push(this._configId);
            this._prsItems.push(this._payload);
        }
        /**
        * Returns true if all contained properties are valid
        * ATTENTION: Processing all properties can consume a long time
        *
        * @readonly
        * @memberof NwctConfigEntry
        */
        get valid() {
            // extract valid property
            let validStates = this._prsItems.map(propObj => propObj.valid);
            // result is only true if all properties are valid
            let result = validStates.reduce((tmpResult, currentValue) => tmpResult && currentValue);
            return result;
        }
        /**
         * reutuns the ParID
         *
         * @readonly
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctDataEntry
         */
        get parId() {
            return this._parId;
        }
        /**
         * returns the time in seconds
         *
         * @readonly
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctDataEntry
         */
        get time() {
            return this._time;
        }
        /**
         * returns the index (which represents the order of entries beeing written into the logbook)
         *
         * @readonly
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctDataEntry
         */
        get index() {
            return this._index;
        }
        /**
         *
         *
         * @readonly
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctDataEntry
         */
        get parCnt() {
            return this._parCnt;
        }
        /**
         * returns the channel index
         *
         * @readonly
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctDataEntry
         */
        get channelIndex() {
            return this._channelIndex;
        }
        /**
         * returns the nc obejct type
         *
         * @readonly
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctDataEntry
         */
        get ncObjectType() {
            return this._ncObjectType;
        }
        /**
         * The configuration id is used to retrieve the information from the configuration record and to find the response <--> request connection
         *
         * @readonly
         * @private
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctDataEntry
         */
        get configId() {
            return this._configId;
        }
        /**
         * returns all payload arguments (the number and type of the arguements depends on the ParID)
         *
         * @readonly
         * @type {Array<NwctPrsPayloadArgument>}
         * @memberof NwctDataEntry
         */
        get payloadBytes() {
            return this._payload;
        }
    };
    NwctDataEntry = __decorate([
        mco.role()
    ], NwctDataEntry);
    exports.NwctDataEntry = NwctDataEntry;
});
