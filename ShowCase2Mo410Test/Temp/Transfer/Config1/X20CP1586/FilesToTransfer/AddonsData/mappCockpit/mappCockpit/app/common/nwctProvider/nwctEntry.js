var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./nwctPayloadBytesHelper", "../textProvider/textFormatter/formatterInputArguments/formatterInputArgumentList", "../textProvider/textFormatter/textFormatter", "../textProvider/textFormatter/formatterInputArguments/formatterInputArgumentInt", "../textProvider/textFormatter/formatterInputArguments/formatterInputArgumentFloat", "../textProvider/textFormatter/formatterInputArguments/formatterInputArgumentString", "./interfaces/metaData/acoposParameterDefinition", "./nwctVirtAxHelper"], function (require, exports, nwctPayloadBytesHelper_1, formatterInputArgumentList_1, textFormatter_1, formatterInputArgumentInt_1, formatterInputArgumentFloat_1, formatterInputArgumentString_1, acoposParameterDefinition_1, nwctVirtAxHelper_1) {
    "use strict";
    var NwctEntry_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctEntry = void 0;
    let NwctEntry = NwctEntry_1 = class NwctEntry {
        /**
         * Creates an instance of NwctEntry
         * @param {NwctDataEntryWrapper} wDataEntry
         * @param {NwctMetaDataProvider} nwctMetaDataProvider
         * @param {(NwctTextProvider|undefined)} nwctTextProvider
         * @memberof NwctEntry
         */
        constructor(wDataEntry, nwctMetaDataProvider, nwctTextProvider) {
            /**
             * Last value of bit pattern if available for this parId on this interface/node/type/channel
             *
             * @type {string}
             * @memberof NwctEntry
             */
            this.lastBitPatternValue = undefined;
            this._wDataEntry = wDataEntry;
            this._nwctMetaDataProvider = nwctMetaDataProvider;
            this._nwctTextProvider = nwctTextProvider;
            this._parameterDefinition = this._nwctMetaDataProvider.getParameterDefinition(this.parId);
            this._dataRecordTypeDefinition = this._nwctMetaDataProvider.getDataRecordTypeDefinition(this.entryType);
        }
        /**
         * Returns the index of this entry
         *
         * @readonly
         * @type {number}
         * @memberof NwctEntry
         */
        get index() {
            return this.dataEntry.index.value;
        }
        /**
         * Returns the network interface name (e.g. "PLK: IF3")
         *
         * @readonly
         * @type {string}
         * @memberof NwctEntry
         */
        get networkInterface() {
            let networkInterfaceName = "";
            let configEntry = this.nwctConfigEntry;
            if (configEntry != undefined) {
                let networkInterfaceTypeId = configEntry.networkType.value;
                let networkInterfaceIndex = configEntry.networkInterfaceIndex.value;
                networkInterfaceName = this._nwctMetaDataProvider.getNetworkInterfaceName(networkInterfaceTypeId, networkInterfaceIndex);
            }
            return networkInterfaceName;
        }
        /**
         * Returns the nodenumber of the recipient
         *
         * @readonly
         * @type {number}
         * @memberof NwctEntry
         */
        get nodeNumber() {
            // the node number is processed prior to passing it, to account for the tricks with virtual axis
            return nwctVirtAxHelper_1.NwctVirtAxHelper.getNodeNumber(this._wDataEntry);
        }
        /**
         * Returns the nc object type
         *
         * @readonly
         * @type {number}
         * @memberof NwctEntry
         */
        get ncObjectType() {
            return this.dataEntry.ncObjectType.value;
        }
        /**
         * Retruns the channel number on the recipient
         *
         * @readonly
         * @type {number}
         * @memberof NwctEntry
         */
        get channelNumber() {
            // the channel number is processed prior to passing it, to account for the tricks with virtual axis
            return nwctVirtAxHelper_1.NwctVirtAxHelper.getChannelNumber(this._wDataEntry);
        }
        /**
         * Returns the name of the component (e.g. "gAxis1")
         *
         * @readonly
         * @type {string}
         * @memberof NwctEntry
         */
        get componentName() {
            let configEntry = this.nwctConfigEntry;
            if (configEntry != undefined) {
                return this._nwctMetaDataProvider.getComponentName(configEntry.networkType.value, configEntry.networkInterfaceIndex.value, this.nodeNumber, this.dataEntry.ncObjectType.value, this.channelNumber);
            }
            return "";
        }
        /**
         * Returns the component type (e.g. "AX", "VAX", "CHAN", ...)
         *
         * @readonly
         * @type {string}
         * @memberof NwctEntry
         */
        get componentType() {
            let ncObjectTypeId = this.dataEntry.ncObjectType.value;
            return this._nwctMetaDataProvider.getNcObjectTypeName(ncObjectTypeId);
        }
        /**
         * Returns the entry type (e.g. 2 => "write request", 7 => "Info")
         *
         * @readonly
         * @type {number}
         * @memberof NwctEntry
         */
        get entryType() {
            let configEntry = this.nwctConfigEntry;
            let dataRecordType = -1;
            if (configEntry != undefined)
                dataRecordType = configEntry.datagramType.value;
            return dataRecordType;
        }
        /**
         * Is this entry a response entry
         *
         * @readonly
         * @type {boolean}
         * @memberof NwctEntry
         */
        get isResponse() {
            if (this._dataRecordTypeDefinition != undefined) {
                return this._dataRecordTypeDefinition.isResponse;
            }
            return false;
        }
        /**
         * Returns the name for the entry type(e.g "Write Response", "Read Request", ..)
         *
         * @returns {string}
         * @memberof NwctEntry
         */
        get entryTypeName() {
            if (this._dataRecordTypeDefinition != undefined) {
                return this._dataRecordTypeDefinition.name;
            }
            return "";
        }
        /**
         * Is this entry a parameter with bitpattern information
         *
         * @readonly
         * @type {boolean}
         * @memberof NwctEntry
         */
        get isBitPattern() {
            let type = "";
            if (this._parameterDefinition != undefined) {
                type = this._parameterDefinition.typ;
            }
            // TODO: change to has bit pattern definition or additionally
            if (type == "BP8" || type == "BP16" || type == "BP32") {
                return true;
            }
            return false;
        }
        /**
         * Is this entry a parameter with parameter group information
         *
         * @readonly
         * @type {boolean}
         * @memberof NwctEntry
         */
        get isParameterGroup() {
            let type = "";
            if (this._parameterDefinition != undefined) {
                type = this._parameterDefinition.typ;
            }
            if (type == "PG") {
                return true;
            }
            return false;
        }
        /**
         * Returns the relativ time in seconds
         *
         * @readonly
         * @type {number}
         * @memberof NwctEntry
         */
        get time() {
            return this.dataEntry.time.value;
        }
        /**
         * Returns the parId
         *
         * @readonly
         * @type {number}
         * @memberof NwctEntry
         */
        get parId() {
            return this.dataEntry.parId.value;
        }
        /**
         * Returns the name of the par id(language independent short name)
         *
         * @readonly
         * @type {string}
         * @memberof NwctEntry
         */
        get parIdName() {
            if (this._parIdName != undefined) {
                return this._parIdName;
            }
            this._parIdName = this._nwctMetaDataProvider.getParIdName(this.parId, this._parameterDefinition);
            return this._parIdName;
        }
        /**
         * Returns the formated value (corresponding to the type of the parameter) for this entry
         *
         * @readonly
         * @type {string}
         * @memberof NwctEntry
         */
        get formatedValue() {
            if (this._formatedValue != undefined) {
                return this._formatedValue;
            }
            let paramDef = this._parameterDefinition;
            if (paramDef == undefined) {
                // No parameter definition!
                console.error("No parameter definition!");
                paramDef = acoposParameterDefinition_1.AcoposParameterDefinition.create(-1, "", "");
            }
            let ref = { notUsedPayloadBytes: new Uint8Array() };
            this._formatedValue = this.getFormatedValue(this.dataEntry.payloadBytes.value, paramDef, ref);
            return this._formatedValue;
        }
        /**
         * Returns the unit corresponding to the value of this entry
         *
         * @returns {string}
         * @memberof NwctEntry
         */
        get unit() {
            let paramDef = this._parameterDefinition;
            if (paramDef != undefined) {
                return this.getUnit(paramDef);
            }
            return "";
        }
        /**
         * Returns the definitions of the single bits of the bitpattern, or undefined if no bit pattern
         *
         * @readonly
         * @private
         * @type {(Array<IBitDefinitionInfo>|undefined)}
         * @memberof NwctEntry
         */
        get bitPatternDefinitions() {
            if (this._parameterDefinition != undefined) {
                return this._parameterDefinition.bits;
            }
            return undefined;
        }
        /**
         * Returns the dataType of the parameter from this entry (e.g. UI4,X2,R4,...)
         *
         * @readonly
         * @private
         * @type {string}
         * @memberof NwctEntry
         */
        get entryValueDataType() {
            if (this._parameterDefinition != undefined) {
                return this._parameterDefinition.typ;
            }
            return "";
        }
        /**
         * Returns the formated value for the given payload data for the given acoposParameterDefinition
         *
         * @private
         * @param {Uint8Array} payloadBytes
         * @param {IAcoposParameterDefinition} paramDefinition
         * @param {{notUsedPayloadBytes: Uint8Array}} ref
         * @returns {string}
         * @memberof NwctEntry
         */
        getFormatedValue(payloadBytes, paramDefinition, ref) {
            let value = payloadBytes.toString();
            let byteLengthForType = this._nwctMetaDataProvider.byteCount(paramDefinition.typ);
            // get inputData
            let inputData = this.getInputData(payloadBytes, paramDefinition);
            // format input data if available to value string 
            if (inputData != undefined) {
                value = this.formatInputData(inputData, paramDefinition.typ, paramDefinition);
            }
            else {
                value = "";
            }
            // Get unused bytes of payload(needed for parameter group interpretation)
            ref.notUsedPayloadBytes = payloadBytes.slice(byteLengthForType);
            // Find an enum/string representation for the given value/number
            let formatedValue = this.getEnumForValueIfAvailable(value, paramDefinition);
            return formatedValue;
        }
        /**
         * get unit from parameter definition
         *
         * @private
         * @param {IAcoposParameterDefinition} paramDefinition
         * @returns {string}
         * @memberof NwctEntry
         */
        getUnit(paramDefinition) {
            // Output of value with unit and type
            if (paramDefinition.unit != undefined && paramDefinition.unit != "") {
                return paramDefinition.unit;
            }
            return "";
        }
        /**
         * Returns the inputData for the given payloadBytes
         *
         * @private
         * @param {Uint8Array} payloadBytes
         * @param {IAcoposParameterDefinition} paramDefinition
         * @returns {(number|Array<number>|string|undefined)}
         * @memberof NwctEntry
         */
        getInputData(payloadBytes, paramDefinition) {
            return nwctPayloadBytesHelper_1.NwctPayloadBytesHelper.getKaitaiParsedTypes(payloadBytes, paramDefinition.typ);
        }
        /**
         * Formats the inputData into a formated value string
         *
         * @private
         * @param {(number|Array<number>|string)} inputData
         * @param {string} type
         * @param {IAcoposParameterDefinition} paramDefinition
         * @returns {string}
         * @memberof NwctEntry
         */
        formatInputData(inputData, type, paramDefinition) {
            let formatterString = this._nwctMetaDataProvider.getDefaultFormatterForType(type);
            if (paramDefinition.id >= 0) {
                // Check for special formatter for the given parameter definition
                if (paramDefinition.formatter != undefined) {
                    formatterString = paramDefinition.formatter;
                }
            }
            return this.getAsFormatedString(inputData, formatterString);
        }
        /**
         * Returns the enum/const name for the given value
         *
         * @private
         * @param {string} value
         * @param {IAcoposParameterDefinition} paramDefinition
         * @returns {string}
         * @memberof NwctEntry
         */
        getEnumForValueIfAvailable(value, paramDefinition) {
            if (paramDefinition.values != undefined) {
                let valueDefinition = paramDefinition.values.find(def => def.val == +value);
                if (valueDefinition != undefined) {
                    return valueDefinition.name; // Returns the enum name vor the given value
                }
            }
            return value;
        }
        /**
         * Returns a formated string for the given value in the given format
         *
         * @private
         * @param {(number|Array<number>|string)} data
         * @param {string} format
         * @returns {string}
         * @memberof NwctEntry
         */
        getAsFormatedString(data, format) {
            let inputArguments = new formatterInputArgumentList_1.FormatterInputArgumentList();
            if (data instanceof Array) {
                data.forEach(num => {
                    inputArguments.push(new formatterInputArgumentInt_1.FormatterInputArgumentInt(num));
                });
            }
            else {
                if (typeof data == "string") {
                    inputArguments.push(new formatterInputArgumentString_1.FormatterInputArgumentString(data));
                }
                else if (Number.isSafeInteger(data)) {
                    inputArguments.push(new formatterInputArgumentInt_1.FormatterInputArgumentInt(data));
                }
                else {
                    inputArguments.push(new formatterInputArgumentFloat_1.FormatterInputArgumentFloat(data));
                }
            }
            return textFormatter_1.TextFormatter.formatArgument(format, inputArguments);
        }
        /**
         * Returns the parameter group infos
         *
         * @private
         * @returns {Array<INwctParamGroupInfo>}
         * @memberof NwctEntry
         */
        getParameterGroupInfos() {
            let payloadBytes = this.dataEntry.payloadBytes.value;
            let payloadTempBytes = payloadBytes;
            let nwctParamGroupInfos = new Array();
            if (this._parameterDefinition != undefined) {
                let pg_ids = this._parameterDefinition.pg_ids;
                if (pg_ids != undefined) {
                    pg_ids.forEach(pg_id => {
                        let pgIdDefinition = this._nwctMetaDataProvider.getParameterDefinition(pg_id);
                        if (pgIdDefinition != undefined) {
                            let ref = { notUsedPayloadBytes: new Uint8Array() };
                            let type = pgIdDefinition.typ;
                            // If this is a error record parameter group and the current par id is the second one of the group(error info) get the type for the errorinfo
                            let formatedValue = "";
                            let unit = "";
                            if (this.isErrorRecord == true && pg_id == pg_ids[1]) {
                                let errorNumber = nwctPayloadBytesHelper_1.NwctPayloadBytesHelper.getNumber(payloadBytes, 2); // get the errornumber from the first two bytes of payload
                                type = this.getErrorInfoDataType(errorNumber); // get error info type for the given errorNumber
                                let paraDef = acoposParameterDefinition_1.AcoposParameterDefinition.create(-1, "", type);
                                formatedValue = this.getFormatedValue(payloadTempBytes, paraDef, ref);
                                unit = this.getUnit(paraDef);
                            }
                            else {
                                formatedValue = this.getFormatedValue(payloadTempBytes, pgIdDefinition, ref);
                                unit = this.getUnit(pgIdDefinition);
                            }
                            // Add bitmask infos
                            let bitPattern = undefined;
                            if (pgIdDefinition.typ.startsWith("BP") && pgIdDefinition.bits != undefined) {
                                bitPattern = this.getBitMaskDescription(pgIdDefinition.bits, nwctPayloadBytesHelper_1.NwctPayloadBytesHelper.getBPnumber(payloadTempBytes, type));
                            }
                            nwctParamGroupInfos.push({ parId: pg_id, parName: pgIdDefinition.const, parValue: formatedValue, parType: type, parUnit: unit, bitPattern: bitPattern });
                            payloadTempBytes = ref.notUsedPayloadBytes;
                        }
                    });
                }
            }
            return nwctParamGroupInfos;
        }
        /**
         * Returns true if this entry is from type error record
         *
         * @readonly
         * @type {boolean}
         * @memberof NwctEntry
         */
        get isErrorRecord() {
            if (this._isErrorRecord == undefined) {
                if (this._parameterDefinition != undefined && this.entryType != 4) { // if entryType is 4(ReadRequest) it is no error record
                    this._isErrorRecord = this._nwctMetaDataProvider.isErrorRec(this._parameterDefinition.id, this._parameterDefinition);
                }
                else {
                    this._isErrorRecord = false;
                }
            }
            return this._isErrorRecord;
        }
        /**
         * Returns the error number if available or -1 if this is no error record
         *
         * @returns {number}
         * @memberof NwctEntry
         */
        get errorNumber() {
            if (this._errorNumber == undefined) {
                this._errorNumber = -1;
                if (this.isErrorRecord) {
                    // Use payloadBytes from response
                    if (this.responseEntry != undefined) {
                        if (this.responseEntry._parameterDefinition != undefined) {
                            let payloadBytes = this.responseEntry.dataEntry.payloadBytes.value;
                            let ref = { notUsedPayloadBytes: new Uint8Array() };
                            let pg_ids = this.responseEntry._parameterDefinition.pg_ids;
                            if (pg_ids != undefined && pg_ids.length > 0) {
                                let pgIdDefinition = this._nwctMetaDataProvider.getParameterDefinition(pg_ids[0]);
                                if (pgIdDefinition != undefined) {
                                    let formatedValue = this.getFormatedValue(payloadBytes, pgIdDefinition, ref);
                                    this._errorNumber = Number(formatedValue);
                                    return this._errorNumber;
                                }
                            }
                        }
                    }
                }
            }
            return this._errorNumber;
        }
        /**
         * Returns a corresponding response entry if available, else undefined
         *
         * @readonly
         * @type {(NwctEntry | undefined)}
         * @memberof NwctEntry
         */
        get responseEntry() {
            if (this._wDataEntry.response === undefined) {
                return undefined;
            }
            return new NwctEntry_1(this._wDataEntry.response, this._nwctMetaDataProvider, this._nwctTextProvider);
        }
        /**
         * Returns a corresponding request entry if available, else undefined
         *
         * @readonly
         * @type {(NwctEntry | undefined)}
         * @memberof NwctEntry
         */
        get requestEntry() {
            if (this._wDataEntry.request === undefined) {
                return undefined;
            }
            return new NwctEntry_1(this._wDataEntry.request, this._nwctMetaDataProvider, this._nwctTextProvider);
        }
        /**
         * Returns the description for a bitpattern
         *
         * @readonly
         * @type {(Array<INwctBitDefinition>|undefined)}
         * @memberof NwctEntry
         */
        get bitPatternDescription() {
            let bitMaskDescription;
            if (this.bitPatternDefinitions != undefined) {
                let bitPatternValue = this.bitPatternNumber;
                bitMaskDescription = this.getBitMaskDescription(this.bitPatternDefinitions, bitPatternValue);
            }
            return bitMaskDescription;
        }
        /**
         * Returns the bit pattern number/value
         *
         * @readonly
         * @type {number}
         * @memberof NwctEntry
         */
        get bitPatternNumber() {
            return nwctPayloadBytesHelper_1.NwctPayloadBytesHelper.getBPnumber(this.payload, this.entryValueDataType);
        }
        /**
         * Returns the configuration entry
         *
         * @readonly
         * @type {(INwctConfigEntry | undefined)}
         * @memberof NwctEntry
         */
        get nwctConfigEntry() {
            var _a;
            return (_a = this._wDataEntry.wConfigEntry) === null || _a === void 0 ? void 0 : _a.configEntry;
        }
        /**
         * Returns a bit mask description in a string array representation
         *
         * @private
         * @param {Array<IBitDefinitionInfo>} bitDefinitions
         * @param {number} data
         * @returns {Array<string>}
         * @memberof NwctEntry
         */
        getBitMaskDescription(bitDefinitions, data) {
            let description = new Array();
            bitDefinitions.forEach(element => {
                let isBitSet = NwctEntry_1.isBitSet(data, element.bit);
                let lastValueIsBitSet = isBitSet;
                if (this.lastBitPatternValue != undefined) {
                    lastValueIsBitSet = NwctEntry_1.isBitSet(this.lastBitPatternValue, element.bit);
                }
                let isBitModified = false;
                if (lastValueIsBitSet != isBitSet) {
                    isBitModified = true;
                }
                description.push({ bit: element.bit, name: element.name, isSet: isBitSet, isModified: isBitModified });
            });
            return description;
        }
        /**
         * Returns a description for a parameter group (also error record)
         *
         * @readonly
         * @type {Array<any>}
         * @memberof NwctEntry
         */
        get parameterGroupDescription() {
            let pgInfos = this.getParameterGroupInfos();
            if (this.isErrorRecord) {
                // Show error record tooltip info(a error record is a special parameter group with error number and additional info)
                let errorNumber = pgInfos[0].parValue;
                let errorValue = pgInfos[1].parValue;
                let errorValueType = pgInfos[1].parType;
                if (errorValueType == undefined) {
                    errorValueType = "";
                }
                let unit = "";
                let prefix = "Warning ";
                if (this.isError(Number(errorNumber))) {
                    prefix = "Error ";
                }
                prefix += errorNumber + ": ";
                let eventLogId = this.getEventLogId(Number(errorNumber));
                let errorText = "";
                if (this._nwctTextProvider != undefined) {
                    // if valueType is PARID => replace par id by par name
                    if (errorValueType == "PARID") {
                        let parName = this._nwctMetaDataProvider.getParIdName(Number(errorValue), undefined);
                        errorValue = parName;
                        errorValueType = ""; // Change type to string("" is used for string by default)
                    }
                    errorText = prefix + this._nwctTextProvider.getFormattedText(eventLogId, errorValue, errorValueType, unit);
                }
                else { // TextProvider not available => show only error info
                    errorText = prefix + "Info: " + errorValue + unit;
                }
                return { errorNumber: Number(errorNumber), errorValue: errorValue, errorValueType: errorValueType, errorValueUnit: unit, errorMessage: errorText };
            }
            return pgInfos;
        }
        /**
         * Returns the datatype of the additional info for the given errorNumber
         *
         * @private
         * @param {number} errorNumber
         * @returns {string}
         * @memberof NwctEntry
         */
        getErrorInfoDataType(errorNumber) {
            return this._nwctMetaDataProvider.getErrorInfoDataType(errorNumber);
        }
        /**
         * Returns the payload data
         *
         * @readonly
         * @private
         * @type {Uint8Array}
         * @memberof NwctEntry
         */
        get payload() {
            return this.dataEntry.payloadBytes.value;
        }
        /**
         * Returns the event log id for the geiven acp10 error number
         *
         * @private
         * @param {number} errorNumber
         * @returns {string}
         * @memberof NwctEntry
         */
        getEventLogId(errorNumber) {
            let textId = "";
            //0x0061 0000 => Acopos Facility ID
            //0xC000 0000 => Error
            //0x8000 0000 => Warning
            //0xFFFF FFFF 0000 0000 => - for event log ids
            if (this.isError(errorNumber)) {
                textId = (errorNumber + -1067384832).toString(); // => add FFFF FFFF C061 0000 for errors
            }
            else {
                textId = (errorNumber + -2141126656).toString(); // => add FFFF FFFF 8061 0000 for warnings
            }
            return textId;
        }
        /**
         * Is the given ACP10 error number an error or a warning
         *
         * @private
         * @param {number} errorNumber
         * @returns
         * @memberof NwctEntry
         */
        isError(errorNumber) {
            if (errorNumber <= 32767 || errorNumber == 65535) {
                return true;
            }
            return false;
        }
        /**
         * Returns the value of the bit for the given index
         *
         * @private
         * @static
         * @param {number} num
         * @param {number} bit
         * @returns {boolean}
         * @memberof NwctEntry
         */
        static isBitSet(num, bit) {
            return ((num >> bit) % 2 != 0);
        }
        /**
         * Returns the data entry
         *
         * @readonly
         * @private
         * @type {INwctDataEntry}
         * @memberof NwctEntry
         */
        get dataEntry() {
            return this._wDataEntry.dataEntry;
        }
    };
    NwctEntry = NwctEntry_1 = __decorate([
        mco.role()
    ], NwctEntry);
    exports.NwctEntry = NwctEntry;
});
