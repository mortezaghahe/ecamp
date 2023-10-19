var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var NwctVirtAxHelper_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctVirtAxHelper = void 0;
    /**
     *  This class is used to encapsulate the annomalities when dealing with virtual axis (node number handling and channel number handling)
     *
     * The number of virtual axis can exceed the maximum number of channels (255)
     * To handle that, in the binary ring buffer, the node number (which is irrelevant in this case) is misused to carry additional information
     *
     * A virtual axis can be dedected based on the
     *
     * The channel number is calculated by the following formula:
     * channelNumber = channelNumber + max(256(cfg_rec.node_nr- 1),0)
     *
     * The node number is also changed to 0 as this is more correct
     * nodeNo = 0
     *
     * @export
     * @abstract
     * @class NwctVirtAxHelper
     */
    let NwctVirtAxHelper = NwctVirtAxHelper_1 = class NwctVirtAxHelper {
        /**
         * Get node number (taking virtual axis anomalities into account)
         *
         * @static
         * @param {NwctDataEntryWrapper} wDataEntry
         * @memberof NwctVirtAxHelper
         */
        static getNodeNumber(wDataEntry) {
            // get the configuration entry
            let configEntry = NwctVirtAxHelper_1.nwctConfigEntry(wDataEntry);
            // check for invalid entry
            if (configEntry === undefined) {
                return -1;
            }
            // further input data checks
            if (!configEntry.datagramEncodingId.valid || !configEntry.nodeNumberOfDrive.valid) {
                return -1;
            }
            // check for virtual axis
            if (configEntry.datagramEncodingId.value === NwctVirtAxHelper_1.DATAGRAM_ENCODING_ID_VIRTUAL_AXIS) {
                return 0;
            }
            return configEntry.nodeNumberOfDrive.value;
        }
        /**
         * Get channel number (taking virtual axis anomalities into account)
         *
         * @static
         * @param {NwctDataEntryWrapper} wDataEntry
         * @returns {number}
         * @memberof NwctVirtAxHelper
         */
        static getChannelNumber(wDataEntry) {
            // get the configuration entry
            let configEntry = NwctVirtAxHelper_1.nwctConfigEntry(wDataEntry);
            // check for invalid entry
            if (configEntry === undefined) {
                return -1;
            }
            // further input data checks
            if (!configEntry.datagramEncodingId.valid || !wDataEntry.dataEntry.channelIndex.valid || !configEntry.nodeNumberOfDrive.valid) {
                return -1;
            }
            // check for virtual axis
            if (configEntry.datagramEncodingId.value === NwctVirtAxHelper_1.DATAGRAM_ENCODING_ID_VIRTUAL_AXIS) {
                let channelNumber = wDataEntry.dataEntry.channelIndex.value;
                let nodeNumber = configEntry.nodeNumberOfDrive.value;
                // the additional information transferred via node no. is calculated into the channel number
                return channelNumber + Math.max(256 * (nodeNumber - 1), 0);
            }
            // a normal non virtual axis
            return wDataEntry.dataEntry.channelIndex.value;
        }
        /**
         * internal helper class to access the config records
         *
         * @private
         * @static
         * @param {NwctDataEntryWrapper} wDataEntry
         * @returns {(INwctConfigEntry | undefined)}
         * @memberof NwctVirtAxHelper
         */
        static nwctConfigEntry(wDataEntry) {
            var _a;
            return (_a = wDataEntry.wConfigEntry) === null || _a === void 0 ? void 0 : _a.configEntry;
        }
    };
    NwctVirtAxHelper.DATAGRAM_ENCODING_ID_VIRTUAL_AXIS = 1; // this encoding id (also called display_function in some documents) with this value means that a virtual axis is in play
    NwctVirtAxHelper = NwctVirtAxHelper_1 = __decorate([
        mco.role()
    ], NwctVirtAxHelper);
    exports.NwctVirtAxHelper = NwctVirtAxHelper;
});
