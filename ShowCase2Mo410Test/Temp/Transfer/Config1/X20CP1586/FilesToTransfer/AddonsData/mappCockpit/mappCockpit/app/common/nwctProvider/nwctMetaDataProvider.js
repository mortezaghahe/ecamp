var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./nwctStaticMetaData"], function (require, exports, nwctStaticMetaData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctMetaDataProvider = void 0;
    let NwctMetaDataProvider = class NwctMetaDataProvider {
        byteCount(type) {
            let number = this._byteCounts.get(type);
            if (number == undefined) {
                if (type.startsWith("BYTES") || type.startsWith("STR")) {
                    number = 4;
                }
                else {
                    number = 0;
                }
            }
            return number;
        }
        /**
         * Creates an instance of TextProvider
         * @memberof NwctMetaDataProvider
         */
        constructor() {
            /**
             * Holds the network interface definitions
             *
             * @private
             * @memberof NwctMetaDataProvider
             */
            this._networkInterfaceDefinitions = new Array();
            /**
             * Holds the component definitions
             *
             * @private
             * @memberof NwctMetaDataProvider
             */
            this._componentDefinitions = new Array();
            /**
             * Holds the data record type definitions
             *
             * @private
             * @memberof NwctMetaDataProvider
             */
            this._dataRecordTypeDefinitions = new Array();
            /**
             * Holds the nc object definitions
             *
             * @private
             * @memberof NwctMetaDataProvider
             */
            this._ncObjectTypeDefinitions = new Array();
            /**
             * Holds the acopos parameter definitions
             *
             * @private
             * @memberof NwctMetaDataProvider
             */
            this._parameterDefinitions = new Array();
            /**
             * Holds the error infos definitions
             *
             * @private
             * @memberof NwctMetaDataProvider
             */
            this._errorInfoDefinitions = new Array();
            /**
             * Holds the info how many bytes should be used(interpreted for the UI) for the given type
             *
             * @private
             * @type {Map<string, number>}
             * @memberof NwctMetaDataProvider
             */
            this._byteCounts = new Map();
            this.initializeDefinitions();
        }
        /**
         * Set some static metaDataInfos(E.g. acopos parameter definitions, error info definitions...)
         *
         * @param {NwctStaticMetaData} staticMetaData
         * @memberof NwctMetaDataProvider
         */
        setStaticMetaData(staticMetaData) {
            if (staticMetaData == undefined) {
                staticMetaData = new nwctStaticMetaData_1.NwctStaticMetaData(undefined, undefined);
            }
            this._acoposFubParIdDefinitions = staticMetaData.acoposFubParIdDefinitions;
            this._parameterDefinitions = staticMetaData.parameterDefinitions;
            this._errorInfoDefinitions = staticMetaData.errorInfoDefinitions;
            // Generate fub par id defines from the given data
            this._acoposFubParIdDefinitions.acoposFubParIdRange1Max = this._acoposFubParIdDefinitions.min + this._acoposFubParIdDefinitions.range - 1;
            this._acoposFubParIdDefinitions.acoposFubParIdPLCopenMin = this._acoposFubParIdDefinitions.min + this._acoposFubParIdDefinitions.offsetPLCopen;
            this._acoposFubParIdDefinitions.acoposFubParIdPLCopenMax = this._acoposFubParIdDefinitions.acoposFubParIdPLCopenMin + this._acoposFubParIdDefinitions.range - 1;
        }
        /**
         * Set some dynamic metaDataInfos(E.g. network interface definitions, component definitions, ...)
         *
         * @param {NwctDynamicMetaData} dynamicMetaData
         * @memberof NwctMetaDataProvider
         */
        setDynamicMetaData(dynamicMetaData) {
            if (dynamicMetaData == undefined) {
                // Reset data
                this._networkInterfaceDefinitions = new Array();
                this._componentDefinitions = new Array();
                this._ncObjectTypeDefinitions = new Array();
            }
            else {
                // Use given meta data 
                this._networkInterfaceDefinitions = dynamicMetaData.networkInterfaces;
                this._componentDefinitions = dynamicMetaData.mappMotionObjects;
                this._ncObjectTypeDefinitions = dynamicMetaData.mappMotionObjectTypes;
            }
        }
        /**
         * Returns the NetworkInterfaceName by network interface id and index
         *
         * @param {number} networkInterfaceTypeId
         * @param {number} networkInterfaceIndex
         * @returns {string}
         * @memberof NwctMetaDataProvider
         */
        getNetworkInterfaceName(networkInterfaceTypeId, networkInterfaceIndex) {
            if (this._networkInterfaceDefinitions != undefined) {
                let networkInterfaceDefinition = this._networkInterfaceDefinitions.find(definition => definition.id == networkInterfaceTypeId && definition.idx == networkInterfaceIndex);
                if (networkInterfaceDefinition != undefined) {
                    return networkInterfaceDefinition.name;
                }
            }
            return "NwIfTypId: " + networkInterfaceTypeId.toString() + "; NwIfIdx: " + networkInterfaceIndex.toString();
        }
        /**
         * Returns the componentName by config id
         *
         * @param {number} configId
         * @returns {string}
         * @memberof NwctMetaDataProvider
         */
        getComponentName(netIfTypeID, netIfIdx, node, objTypeID, channelNr) {
            if (this._componentDefinitions != undefined) {
                let componentDefinition = this._componentDefinitions.find(definition => definition.netIfTyp == netIfTypeID && definition.netIfIdx == netIfIdx
                    && definition.node == node && definition.objTyp == objTypeID
                    // show component name also if channel number is defined with 0
                    && (definition.channel == channelNr || definition.channel == 0));
                if (componentDefinition != undefined) {
                    return componentDefinition.name;
                }
            }
            return "";
        }
        /**
         * Returns the ncObjectType name for the given id
         *
         * @param {number} ncObjectTypeId
         * @returns {string}
         * @memberof NwctMetaDataProvider
         */
        getNcObjectTypeName(ncObjectTypeId) {
            if (this._ncObjectTypeDefinitions != undefined) {
                let ncObjectTypeDefinition = this._ncObjectTypeDefinitions.find(definition => definition.id == ncObjectTypeId);
                if (ncObjectTypeDefinition != undefined) {
                    return ncObjectTypeDefinition.name;
                }
            }
            return "ELE" + ncObjectTypeId.toString();
        }
        /**
         * Returns the constant name for the given par id
         *
         * @param {number} parId
         * @param {(IAcoposParameterDefinition|undefined)} parameterDefinition if undefined, the definition will be found automatically(performance!)
         * @returns {string}
         * @memberof NwctMetaDataProvider
         */
        getParIdName(parId, parameterDefinition) {
            let parIdConst = parId.toString();
            let parIdDefinition = parameterDefinition;
            if (parIdDefinition == undefined) {
                parIdDefinition = this.getParameterDefinition(parId);
            }
            if (parIdDefinition != undefined) {
                parIdConst = parIdDefinition.const;
            }
            // check if it is maybe a FUB par id
            if (parId >= this._acoposFubParIdDefinitions.min && parId <= this._acoposFubParIdDefinitions.acoposFubParIdRange1Max) {
                // find instance number
                let instanceNumber = parId % this._acoposFubParIdDefinitions.instances;
                return parIdConst + "+" + instanceNumber; // Add FUB instance number
            }
            // check if it is maybe a plcOpen FUB par id
            else if (parId >= this._acoposFubParIdDefinitions.acoposFubParIdPLCopenMin && parId <= this._acoposFubParIdDefinitions.acoposFubParIdPLCopenMax) {
                // find instance number
                let instanceNumber = parId % this._acoposFubParIdDefinitions.instances;
                let parIdName = "PLCopen: " + parIdConst;
                parIdName = parIdName + "+" + instanceNumber; // Add FUB instance number;
                return parIdName;
            }
            return parIdConst;
        }
        /**
         * Is the given parameter id an error record
         *
         * @param {number} parId
         * @param {(IAcoposParameterDefinition|undefined)} parameterDefinition
         * @returns {boolean}
         * @memberof NwctMetaDataProvider
         */
        isErrorRec(parId, parameterDefinition) {
            let parIdDefinition = parameterDefinition;
            if (parIdDefinition == undefined) {
                parIdDefinition = this.getParameterDefinition(parId);
            }
            if (parIdDefinition != undefined) {
                if (parIdDefinition.attr != undefined) {
                    if (parIdDefinition.attr.find(attr => attr == "err") != undefined) {
                        return true;
                    }
                }
            }
            return false;
        }
        /**
         * Returns the original par id if the par id is a (plcOpen) FUB instance
         *
         * @private
         * @param {number} parId
         * @returns {number}
         * @memberof NwctMetaDataProvider
         */
        getOriginalParIdFromFUBParId(parId) {
            if (parId >= this._acoposFubParIdDefinitions.min && parId <= this._acoposFubParIdDefinitions.acoposFubParIdRange1Max) {
                // return original parId for this FUB par id
                let instanceNumber = parId % this._acoposFubParIdDefinitions.instances;
                return parId - instanceNumber;
            }
            if (parId >= this._acoposFubParIdDefinitions.acoposFubParIdPLCopenMin && parId <= this._acoposFubParIdDefinitions.acoposFubParIdPLCopenMax) {
                // return original parId for this plcOpen FUB par id
                let instanceNumber = parId % this._acoposFubParIdDefinitions.instances;
                return (parId - instanceNumber) - this._acoposFubParIdDefinitions.offsetPLCopen;
            }
            return parId;
        }
        /**
         * Returns the parameter definition for the given parameter id
         *
         * @param {number} parId
         * @returns {(IAcoposParameterDefinition|undefined)}
         * @memberof NwctMetaDataProvider
         */
        getParameterDefinition(parId) {
            let originalParId = this.getOriginalParIdFromFUBParId(parId);
            return this._parameterDefinitions.find(definition => definition.id == originalParId);
        }
        /**
         * Returns the dataRecordType definition for the given record type
         *
         * @param {number} recordType
         * @returns {(IDataRecordTypeDefinition|undefined)}
         * @memberof NwctMetaDataProvider
         */
        getDataRecordTypeDefinition(recordType) {
            return this._dataRecordTypeDefinitions.find(definition => definition.id == recordType);
        }
        /**
         * Retruns the datatype for the info of the given errornumber
         *
         * @param {number} errorNumber
         * @returns {string}
         * @memberof NwctMetaDataProvider
         */
        getErrorInfoDataType(errorNumber) {
            let errorInfoDefinition = this._errorInfoDefinitions.find(errorInfo => errorInfo.id == errorNumber);
            if (errorInfoDefinition != undefined) {
                return errorInfoDefinition.typ;
            }
            return "";
        }
        /**
         * Returns the default formatter for the given type
         *
         * @param {string} type
         * @returns {string}
         * @memberof NwctMetaDataProvider
         */
        getDefaultFormatterForType(type) {
            switch (type) {
                case "BOOL":
                case "I1":
                case "I2":
                case "I4":
                case "UI1":
                case "UI2":
                case "UI4":
                case "PARID":
                    return "{1}";
                case "R4":
                case "R8":
                    return "{1|g}";
                case "X1":
                case "X2":
                case "X4":
                    let minCharacterCount = Number(type.slice(1)) * 2;
                    return "0x{1|0" + minCharacterCount + "X}"; // e.g. "0x{1|02X}" or "0x{1|04X}"
                case "BP8":
                case "BP16":
                case "BP32":
                    let byteCount = Number(type.slice(2)) / 8;
                    let formatString = "";
                    let seperator = " ";
                    for (let i = byteCount; i > 0; i--) {
                        formatString += "{" + i + "|08b}";
                        if (i > 1) {
                            formatString += seperator;
                        }
                    }
                    return formatString;
                case "BYTES6":
                    return "{1|02X} {2|02X} {3|02X} {4|02X} {5|02X} {6|02X}";
                case "T5":
                    return "{1}:{2|02}:{3|02}.{4|02} {5|02}.{6|02}.{7}";
            }
            if (type == "DATA" || type == "BRMOD" || type.startsWith("BYTES") || type.startsWith("STR")) {
                return "{1}";
            }
            return "";
        }
        /**
         * Get all the meta data definitions
         *
         * @private
         * @memberof NwctMetaDataProvider
         */
        initializeDefinitions() {
            this.initializeByteCount();
            this.initializeDataRecordTypeDefinitions();
        }
        /**
         * Initialize the _byteCounts map
         *
         * @private
         * @memberof NwctMetaDataProvider
         */
        initializeByteCount() {
            this._byteCounts.set("BOOL", 1);
            this._byteCounts.set("I1", 1);
            this._byteCounts.set("I2", 2);
            this._byteCounts.set("I4", 4);
            this._byteCounts.set("UI1", 1);
            this._byteCounts.set("UI2", 2);
            this._byteCounts.set("UI4", 4);
            this._byteCounts.set("X1", 1);
            this._byteCounts.set("X2", 2);
            this._byteCounts.set("X4", 4);
            this._byteCounts.set("BP8", 1);
            this._byteCounts.set("BP16", 2);
            this._byteCounts.set("BP32", 4);
            this._byteCounts.set("R4", 4);
            this._byteCounts.set("T5", 5);
            this._byteCounts.set("STR6", 6);
            this._byteCounts.set("BYTES6", 6);
            this._byteCounts.set("DATA", 4);
            this._byteCounts.set("BRMOD", 4);
        }
        /**
         * Initialize the DataRecordTypeDefinitions
         *
         * @private
         * @memberof NwctMetaDataProvider
         */
        initializeDataRecordTypeDefinitions() {
            // Set some dummy meta data info
            this._dataRecordTypeDefinitions.push({ id: 1, const: "BRD_COM", name: "", isResponse: false });
            this._dataRecordTypeDefinitions.push({ id: 2, const: "WR_REQ", name: "Write Request", isResponse: false });
            this._dataRecordTypeDefinitions.push({ id: 3, const: "WR_RSP", name: "Write Response", isResponse: true });
            this._dataRecordTypeDefinitions.push({ id: 4, const: "RD_REQ", name: "Read Request", isResponse: false });
            this._dataRecordTypeDefinitions.push({ id: 5, const: "RD_RSP", name: "Read Response", isResponse: true });
            this._dataRecordTypeDefinitions.push({ id: 6, const: "STAT", name: "Drive Status", isResponse: false });
            this._dataRecordTypeDefinitions.push({ id: 7, const: "INFO", name: "Info", isResponse: false });
        }
    };
    NwctMetaDataProvider = __decorate([
        mco.role()
    ], NwctMetaDataProvider);
    exports.NwctMetaDataProvider = NwctMetaDataProvider;
});
