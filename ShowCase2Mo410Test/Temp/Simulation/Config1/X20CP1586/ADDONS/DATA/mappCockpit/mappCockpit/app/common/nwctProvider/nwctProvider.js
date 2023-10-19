var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../libs/dataparsing/Nwct", "../../libs/dataparsing/kaitai-struct/KaitaiStream", "./objParser/nwctRoot", "./enrichment/nwctPreProcess", "./nwctEntry", "../../framework/events", "./nwctTextProvider"], function (require, exports, NwctBinParser, KaitaiStream, nwctRoot_1, nwctPreProcess_1, nwctEntry_1, events_1, nwctTextProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctProvider = void 0;
    let NamespacesLoaded = class NamespacesLoaded extends events_1.TypedEvent {
    };
    NamespacesLoaded = __decorate([
        mco.role()
    ], NamespacesLoaded);
    ;
    /**
     * this class allows to retrieve nwct data from a single snapshot
     *
     * @export
     * @class NwctProvider
     */
    let NwctProvider = class NwctProvider {
        get nwctTextProvider() {
            return this._nwctTextProvider;
        }
        /**
         * Creates an instance of NwctProvider
         * @param {ArrayBuffer} binaryData
         * @memberof NwctProvider
         */
        constructor(binaryData, nwctMetaDataProvider) {
            /**
             * Holds the nwct entries
             *
             * @private
             * @type {INwctEntry[]}
             * @memberof NwctProvider
             */
            this._entries = new Array();
            /**
             * Handler for the namespaces loaded event from the nwctTextProvider
             *
             * @private
             * @memberof NwctProvider
             */
            this._namespacesLoadedHandler = (sender, args) => this.onNamespacesLoaded(sender, args);
            /**
             * Holds the last bit mask values for the available nodes
             * key   ...... networktype + networkInterfaceIndex + nodeNumber + datagramType + ncObjectType + channelNumber + parId
             * value ...... 7 -> 00000111
             *
             * @private
             * @memberof NwctProvider
             */
            this._lastBitMaskValue = new Map();
            /**
             * Event will be raised after loading of namespaces was finished
             *
             * @memberof NwctProvider
             */
            this.eventNamespacesLoaded = new NamespacesLoaded();
            this._input = binaryData;
            this._nwctMetaDataProvider = nwctMetaDataProvider;
        }
        /**
         * Loads the needed namespace into textProvider
         *
         * @param {Array<string>} namespaces
         * @memberof NwctProvider
         */
        loadTextSystemNamespaces(namespaces) {
            this._nwctTextProvider = new nwctTextProvider_1.NwctTextProvider();
            this._nwctTextProvider.eventNamespacesLoaded.attach(this._namespacesLoadedHandler);
            this._nwctTextProvider.loadNamespaces(namespaces);
        }
        /**
         * Retruns a list with the entries
         *
         * @readonly
         * @type {Array<INwctEntry>}
         * @memberof NwctProvider
         */
        get entries() {
            if (this._entries.length === 0) {
                this.retrieveData();
            }
            return this._entries;
        }
        /**
         * Raised when the namespaces loading is finished
         *
         * @private
         * @param {NwctTextProvider} sender
         * @param {*} args
         * @memberof NwctProvider
         */
        onNamespacesLoaded(sender, args) {
            sender.eventNamespacesLoaded.detach(this._namespacesLoadedHandler);
            this.eventNamespacesLoaded.raise(this, undefined);
        }
        /**
         * Deconde the binary ring buffer to an untyped object (NwctBinParser)
         *
         * @private
         * @param {*} binaryData
         * @returns {NwctBinParser} This return value contains the parsed binary data
         * @memberof NwctProvider
         */
        retrieveData() {
            // create a KaitaiStream and pass the binary data
            let kaitaiStream = new KaitaiStream(this._input);
            // pass the structure declaration and encode the binary data
            let untypedObject = new NwctBinParser(kaitaiStream);
            // set the type secure root object to access the nwct data
            let typedEntries = new nwctRoot_1.NwctRoot(untypedObject);
            // resolve:
            // - links between config entries and data entries
            // - links between requests and responses
            let processor = new nwctPreProcess_1.NwctPreProcess(typedEntries);
            // Reset _lastBitMaskValue data
            this._lastBitMaskValue = new Map();
            // reacre new array of entries and push all converted entries into the array
            this._entries = new Array();
            processor.dataEntries.wDataEntries.forEach(wDataEntry => {
                let entry = new nwctEntry_1.NwctEntry(wDataEntry, this._nwctMetaDataProvider, this._nwctTextProvider);
                if (entry.isBitPattern) {
                    entry.lastBitPatternValue = this.getLastBitPatternValue(entry);
                }
                this._entries.push(entry);
            });
        }
        /**
         * Returns the last bit mask value for the given node(networktype + networkInterfaceIndex + nodeNumber + datagramType + ncObjectType + channelNumber + parId)
         * if available, else undefined
         *
         * @private
         * @param {NwctEntry} entry
         * @returns {(number|undefined)}
         * @memberof NwctProvider
         */
        getLastBitPatternValue(entry) {
            let key = entry.nwctConfigEntry.networkType.value.toString() + entry.nwctConfigEntry.networkInterfaceIndex.value.toString() + entry.nodeNumber.toString() +
                entry.nwctConfigEntry.datagramType.value.toString() + entry.ncObjectType.toString() + entry.channelNumber.toString() + entry.parId.toString();
            let lastBitMaskValue = undefined;
            if (this._lastBitMaskValue.has(key)) {
                // value for key available -> return old available value and set new one
                lastBitMaskValue = this._lastBitMaskValue.get(key);
                this._lastBitMaskValue.set(key, entry.bitPatternNumber);
            }
            else {
                // no value available -> only set the current value
                this._lastBitMaskValue.set(key, entry.bitPatternNumber);
            }
            return lastBitMaskValue;
        }
    };
    NwctProvider = __decorate([
        mco.role()
    ], NwctProvider);
    exports.NwctProvider = NwctProvider;
});
