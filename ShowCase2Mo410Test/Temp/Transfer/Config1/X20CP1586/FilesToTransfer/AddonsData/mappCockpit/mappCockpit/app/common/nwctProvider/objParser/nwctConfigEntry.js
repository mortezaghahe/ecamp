var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./nwctPrsItemBase", "./nwctPrsPropertyNumber", "./nwctPropNames"], function (require, exports, nwctPrsItemBase_1, nwctPrsPropertyNumber_1, nwctPropNames_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctConfigEntry = void 0;
    /**
     * Stongly typed access to a parsed config entry
     *
     * @export
     * @class NwctConfigEntry
     * @extends {NwctPrsItemBase}
     * @implements {INwctConfigEntry}
     */
    let NwctConfigEntry = class NwctConfigEntry extends nwctPrsItemBase_1.NwctPrsItemBase {
        /**
         * Creates an instance of NwctConfigEntry and expects the parsed object containing one configuration record comming from the kaitai parser
         * @param {*} input
         * @memberof NwctConfigEntry
         */
        constructor(input) {
            super(input);
            // create all properties
            this._configurationRecordId = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.configRecordId]);
            this._networkType = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.configNetworkType]);
            this._networkInterfaceIndex = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.configNetworkInterfaceIndex]);
            this._nodeNumberOfDrive = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.configNodeNo]);
            this._datagramType = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.configDatagramType]);
            this._datagramEncodingId = new nwctPrsPropertyNumber_1.NwctPrsPropertyNumber(input, [nwctPropNames_1.NwctPropNames.configDatagramEncodingId]);
            // create list of all contained parse items to be able to compute the sum of the states
            this._prsItems = new Array();
            this._prsItems.push(this._configurationRecordId);
            this._prsItems.push(this._networkType);
            this._prsItems.push(this._networkInterfaceIndex);
            this._prsItems.push(this._nodeNumberOfDrive);
            this._prsItems.push(this._datagramType);
            this._prsItems.push(this._datagramEncodingId);
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
         * Returns the id of the configuration record
         *
         * @readonly
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctConfigEntry
         */
        get configurationRecordId() {
            return this._configurationRecordId;
        }
        /**
         * Returns the network type id
         *
         * @readonly
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctConfigEntry
         */
        get networkType() {
            return this._networkType;
        }
        /**
         * Returns the index of the network interface
         *
         * @readonly
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctConfigEntry
         */
        get networkInterfaceIndex() {
            return this._networkInterfaceIndex;
        }
        /**
         * Returns the node number of the drive
         *
         * @readonly
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctConfigEntry
         */
        get nodeNumberOfDrive() {
            return this._nodeNumberOfDrive;
        }
        /**
         * Returns the datagram type id
         *
         * @readonly
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctConfigEntry
         */
        get datagramType() {
            return this._datagramType;
        }
        /**
         * Returns the datagram encoding id
         *
         * @readonly
         * @type {INwctPrsPropertyNumber}
         * @memberof NwctConfigEntry
         */
        get datagramEncodingId() {
            return this._datagramEncodingId;
        }
    };
    NwctConfigEntry = __decorate([
        mco.role()
    ], NwctConfigEntry);
    exports.NwctConfigEntry = NwctConfigEntry;
});
