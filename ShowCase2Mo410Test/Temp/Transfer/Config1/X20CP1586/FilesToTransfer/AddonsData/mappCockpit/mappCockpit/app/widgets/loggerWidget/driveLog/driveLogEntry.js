var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./driveLogEntryAdditionalData", "./driveLogEntryHelper"], function (require, exports, driveLogEntryAdditionalData_1, driveLogEntryHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DriveLogEntry = void 0;
    /**
     * Represents one network command trace logger entry
     *
     * @export
     * @class DriveLogEntry
     * @implements {IDriveLogEntry}
     */
    let DriveLogEntry = class DriveLogEntry {
        /**
         * Creates an instance of DriveLogEntry with a nwctEntry or driveLogEntryExport data
         * @param {INwctEntry} parsedEntry
         * @param {(NwctTextProvider|undefined)} nwctTextProvider
         * @memberof DriveLogEntry
         */
        constructor(parsedEntry, exportData = undefined) {
            this._parsedEntry = parsedEntry;
            if (exportData != undefined) {
                this.setExportData(exportData);
                return;
            }
            if (this._parsedEntry != undefined) {
                let record = this._parsedEntry;
                this._recordType = record.entryType;
                this._recordTypeName = record.entryTypeName;
                if (record.responseEntry != undefined) {
                    this._linkedRecordType = record.responseEntry.entryType;
                    this._linkedRecordTypeName = record.responseEntry.entryTypeName;
                    this._isLinkedRecordValid = record.parId == record.responseEntry.parId;
                }
                else {
                    // Default values if no response is available
                    this._linkedRecordType = -1;
                    this._linkedRecordTypeName = "";
                    this._isLinkedRecordValid = true;
                }
                return;
            }
            if (this._parsedEntry == undefined) {
                console.error("No entry data available!");
            }
        }
        /**
         * Returns the export data of this entry
         *
         * @returns {IDriveLogEntryExportData}
         * @memberof DriveLogEntry
         */
        getExportData() {
            // Get mandatory export data
            let exportData = this.getMandatoryData();
            // Add additional export data
            let unit = this.getUnit();
            if (unit != "") {
                exportData["parUnit"] = unit;
            }
            if (this._linkedRecordType != undefined && this._linkedRecordType != -1) {
                // linked record available
                exportData["linkedRecType"] = this._linkedRecordType;
                if (this._isLinkedRecordError != undefined && this._isLinkedRecordError == true) {
                    exportData["isLinkedRecError"] = this._isLinkedRecordError;
                }
                if (this._linkedRecordTypeName != "") {
                    exportData["linkedRecTypeName"] = this._linkedRecordTypeName;
                }
                if (this._errorResponseParId != undefined && this._errorResponseParId != -1) {
                    exportData["linkedRecParId"] = this._errorResponseParId;
                }
                if (this._errorResponseParName != undefined && this._errorResponseParName != "") {
                    exportData["linkedRecParName"] = this._errorResponseParName;
                }
            }
            if (this.responseTime != "") {
                exportData["linkedRecDelay"] = this.responseTime;
            }
            if (this._additionalData != undefined && this._additionalData.mergedData != undefined) {
                exportData["parGroup"] = this._additionalData.getParGroupExportData();
                exportData["errorInfo"] = this._additionalData.getErrorInfoExportData();
                exportData["bitPattern"] = this._additionalData.getBitPatternExportData();
            }
            return exportData;
        }
        /**
         * Retruns the mandatory export data
         *
         * @private
         * @returns {IDriveLogEntryExportData}
         * @memberof DriveLogEntry
         */
        getMandatoryData() {
            return { recNumber: this.recordNumber,
                recType: this._recordType,
                recTypeName: this._recordTypeName,
                time: this.time,
                modInterface: this.getModuleInterface(),
                modType: this.getModuleType(),
                modChannel: this.getModuleChannel(),
                applObject: this.objectName,
                parId: this._parId,
                parName: this.getDescriptionText(),
                parValue: this.getValue(), };
        }
        /**
         * Sets the export data to this entry
         *
         * @param {IDriveLogEntryExportDataOptional} exportData
         * @memberof DriveLogEntry
         */
        setExportData(exportData) {
            this.setMandatoryData(exportData);
            // Set additional export data or default values if not available
            this._additionalData = driveLogEntryAdditionalData_1.AdditionalData.create(exportData.parGroup, exportData.errorInfo, exportData.bitPattern);
            this._responseTime = exportData.linkedRecDelay;
            if (this._responseTime == undefined) {
                this._responseTime = "";
            }
            this._unit = exportData.parUnit;
            if (this._unit == undefined) {
                this._unit = "";
            }
            this.setLinkedRecordData(exportData);
            this._isRecordError = false;
            if (this._additionalData != undefined) {
                if (this._additionalData.mergedData != undefined) {
                    if (this._additionalData.mergedData.errorInfo != undefined) {
                        if (this._linkedRecordType == undefined || this._linkedRecordType == -1 || this._linkedRecordType == 5) { // 5 => "RD_RSP" 
                            if (this._recordType != 4) // 4 => "RD_REQ"; 
                             {
                                // If error info is available but no linked record it must be a record error(no response error)
                                this._isRecordError = true;
                            }
                            else {
                                // Read Request but no ReadResponse (_linkedRecordType) available => Could not be an error record, only a request with a missing response
                                // Remove wrong saved errorInfo
                                this._additionalData.mergedData.errorInfo = undefined;
                            }
                        }
                    }
                }
            }
            this._isBitPattern = false;
            if (this._additionalData != undefined) {
                if (this._additionalData.mergedData != undefined) {
                    if (this._additionalData.mergedData.bitPattern != undefined) {
                        this._isBitPattern = true;
                    }
                }
            }
            this._descriptionError = this.getDescriptionError();
        }
        /**
         *  Set mandatory export data
         *
         * @private
         * @param {IDriveLogEntryExportDataOptional} exportData
         * @memberof DriveLogEntry
         */
        setMandatoryData(exportData) {
            this._recordNumber = exportData.recNumber;
            this._recordType = exportData.recType;
            this._recordTypeName = exportData.recTypeName;
            this._time = exportData.time;
            this._moduleInterface = exportData.modInterface;
            this._moduleType = exportData.modType;
            this._moduleChannel = exportData.modChannel;
            this._objectName = exportData.applObject;
            this._parId = exportData.parId;
            this._descriptionText = exportData.parName;
            this._value = exportData.parValue;
        }
        /**
         * Set linked RecordData
         *
         * @private
         * @param {IDriveLogEntryExportDataOptional} exportData
         * @memberof DriveLogEntry
         */
        setLinkedRecordData(exportData) {
            this._linkedRecordType = exportData.linkedRecType;
            if (this._linkedRecordType == undefined) {
                this.setDefaultValuesForLinkedRecord();
            }
            else {
                this._linkedRecordTypeName = exportData.linkedRecTypeName;
                if (this._linkedRecordTypeName == undefined) {
                    this._linkedRecordTypeName = "";
                }
                this._isLinkedRecordValid = true;
                if (exportData.linkedRecParName != undefined && exportData.linkedRecParName != exportData.parName) {
                    this._isLinkedRecordValid = false;
                }
                this._isLinkedRecordError = exportData.isLinkedRecError;
                if (this._isLinkedRecordError == undefined) {
                    this._isLinkedRecordError = false;
                }
                this._errorResponseParName = exportData.linkedRecParName;
                if (this._errorResponseParName == undefined) {
                    this._errorResponseParName = "";
                }
                this._errorResponseParId = exportData.linkedRecParId;
                if (this._errorResponseParId == undefined) {
                    this._errorResponseParId = -1;
                }
            }
        }
        /**
         * Sets the default data of a linked record
         *
         * @private
         * @memberof DriveLogEntry
         */
        setDefaultValuesForLinkedRecord() {
            // Set default values for linkedRecord if not available
            this._linkedRecordType = -1;
            this._linkedRecordTypeName = "";
            this._isLinkedRecordValid = true;
            this._isLinkedRecordError = false;
            this._errorResponseParName = "";
            this._errorResponseParId = -1;
        }
        /**
         * Returns the unique number of the logger entry
         *
         * @readonly
         * @type {string}
         * @memberof DriveLogEntry
         */
        get recordNumber() {
            if (this._recordNumber == undefined) {
                this._recordNumber = this._parsedEntry.index;
            }
            return this._recordNumber;
        }
        /**
         * Returns the module description for this logger entry (e.g. PLK: SL1.IF2.ST1 (CHAN 2))
         *
         * @readonly
         * @type {string}
         * @memberof DriveLogEntry
         */
        get module() {
            if (this._module == undefined) {
                this._module = this.getModuleFormated(this.getModuleInterface(), this.getModuleType(), this.getModuleChannel());
            }
            return this._module;
        }
        /**
         * Returns the name of the object (e.g. gAxis01)
         *
         * @readonly
         * @type {string}
         * @memberof DriveLogEntry
         */
        get objectName() {
            if (this._objectName == undefined) {
                this._objectName = this._parsedEntry.componentName;
            }
            return this._objectName;
        }
        /**
         * Retruns the info which is used for the description column for the search and filtering(texts without styling)
         *
         * @readonly
         * @type {string}
         * @memberof DriveLogEntry
         */
        get descriptionRawData() {
            if (this._descriptionRawData == undefined) {
                this._descriptionRawData = this.getDescriptionRawData(this.getDescriptionText(), this.getDescriptionValueWithUnit(), this.getAdditionalSearchInfo());
            }
            return this._descriptionRawData;
        }
        /**
         * Returns the id of the icon which one should be shown for this record
         * If response and request is available and valid the ids will be added with a "_" between -> "id1_id2")
         * If response of request is invalid a postfix will be added -> "_invalid" e.g. id1_invalid
         *
         * @type {string}
         * @memberof DriveLogEntry
         */
        getDescriptionIconId() {
            if (this._descriptionIconId == undefined) {
                let invalidLinkedRecord = false;
                if (this.isResponseAvailable()) {
                    invalidLinkedRecord = !this.isResponseParIdValid();
                }
                this._descriptionIconId = driveLogEntryHelper_1.DriveLogEntryHelper.generateIconId(this._recordType, this._linkedRecordType, invalidLinkedRecord);
            }
            return this._descriptionIconId;
        }
        /**
         * Returns only the description text without the value
         * @type {string}
         * @memberof DriveLogEntry
         */
        getDescriptionText() {
            if (this._descriptionText == undefined) {
                this._descriptionText = this.getDescriptionTextFromRecord();
            }
            return this._descriptionText;
        }
        /**
         * Returns only the formated description text (e.g. red font color) without the value
         *
         * @type {string}
         * @memberof DriveLogEntry
         */
        getDescriptionTextFormated() {
            if (this._descriptionTextFormated == undefined) {
                if (this.isErrorRecord()) {
                    this._descriptionTextFormated = driveLogEntryHelper_1.DriveLogEntryHelper.setStyleError(this.getDescriptionText());
                }
                else {
                    this._descriptionTextFormated = this.getDescriptionText();
                }
            }
            return this._descriptionTextFormated;
        }
        /**
         * Retruns the formated value (e.g. red font color) with the unit
         *
         * @type {string}
         * @memberof DriveLogEntry
         */
        getDescriptionValueWithUnitFormated() {
            if (this._descriptionValueWithUnitFormated == undefined) {
                // only show value in red if responsError and read request
                if (this.isResponseError() && this._recordType == 4) { // 4 -> readRequest
                    this._descriptionValueWithUnitFormated = driveLogEntryHelper_1.DriveLogEntryHelper.setStyleError(this.getDescriptionValueWithUnit());
                }
                else {
                    this._descriptionValueWithUnitFormated = this.getDescriptionValueWithUnit();
                }
            }
            return this._descriptionValueWithUnitFormated;
        }
        /**
         * Returns the formated error description
         *
         * @type {string}
         * @memberof DriveLogEntry
         */
        getDescriptionErrorFormated() {
            return driveLogEntryHelper_1.DriveLogEntryHelper.setStyleError(this.descriptionError());
        }
        /**
         * Returns the tooltip text for the description text and value
         *
         * @readonly
         * @type {string}
         * @memberof DriveLogEntry
         */
        get descriptionTooltip() {
            if (this._descriptionTooltip == undefined) {
                this._descriptionTooltip = this.getDescriptionTooltip();
            }
            return this._descriptionTooltip;
        }
        /**
         * Returns the time of the logger entry
         *
         * @readonly
         * @type {string}
         * @memberof DriveLogEntry
         */
        get time() {
            if (this._time == undefined) {
                this._time = this._parsedEntry.time.toFixed(4).toString();
            }
            return this._time;
        }
        /**
         * Returns the time delay between the request and the response
         *
         * @readonly
         * @type {string}
         * @memberof DriveLogEntry
         */
        get responseTime() {
            if (this._responseTime == undefined) {
                this._responseTime = "";
                if (this._parsedEntry.responseEntry != undefined) {
                    this._responseTime = ((this._parsedEntry.responseEntry.time - this._parsedEntry.time) * 1000).toFixed(3).toString();
                }
            }
            return this._responseTime;
        }
        /**
         * is the entry a error record
         *
         * @private
         * @returns {boolean}
         * @memberof DriveLogEntry
         */
        isErrorRecord() {
            if (this._isRecordError == undefined) {
                this._isRecordError = false; // Default false
                let record = this._parsedEntry;
                if (record != undefined) {
                    this._isRecordError = record.isErrorRecord;
                }
            }
            return this._isRecordError;
        }
        /**
         * is the entry response error record(response available but response par id not valid)
         *
         * @private
         * @returns {boolean}
         * @memberof DriveLogEntry
         */
        isResponseError() {
            if (this._isResponseError == undefined) {
                this._isResponseError = this.isResponseAvailable() && !this.isResponseParIdValid();
            }
            return this._isResponseError;
        }
        /**
         * Returns the module string( interface, type, channel,...)
         *
         * @private
         * @param {string} moduleInterface
         * @param {string} modulType
         * @param {number} modulChannel
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getModuleFormated(moduleInterface, modulType, modulChannel) {
            let moduleFormated = moduleInterface;
            if (modulType != "") {
                moduleFormated += " (" + modulType + " " + modulChannel + ")";
            }
            return moduleFormated;
        }
        /**
         * Retruns the interface name incl. nodenumber
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getModuleInterface() {
            if (this._moduleInterface == undefined) {
                this._moduleInterface = this.getModuleInterfaceFromRecord();
            }
            return this._moduleInterface;
        }
        /**
         * Returns the type of the module
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getModuleType() {
            if (this._moduleType == undefined) {
                this._moduleType = this.getModuleTypeFromRecord();
            }
            return this._moduleType;
        }
        /**
         * Returns the channel of the module
         *
         * @private
         * @returns {number}
         * @memberof DriveLogEntry
         */
        getModuleChannel() {
            if (this._moduleChannel == undefined) {
                this._moduleChannel = this.getModuleChannelFromRecord();
            }
            return this._moduleChannel;
        }
        /**
         * Returns the interfacename incl. nodenumber from nwct entry
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getModuleInterfaceFromRecord() {
            return this._parsedEntry.networkInterface + this.getNodeNumber();
        }
        /**
         * Returns the description raw data, needed for search an filtering; e.g  param name, param value, additional info like errornumber, ...)
         *
         * @private
         * @param {(string|undefined)} descriptionText
         * @param {(string|undefined)} descriptionValue
         * @param {string} additionalSearchInfo
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getDescriptionRawData(descriptionText, descriptionValue, additionalSearchInfo) {
            if (descriptionText == undefined) {
                descriptionText = "";
            }
            if (descriptionValue == undefined) {
                descriptionValue = "";
            }
            return descriptionText + " " + descriptionValue + " " + additionalSearchInfo;
        }
        /**
         * Returns only the value without the description
         *
         * @type {string}
         * @memberof DriveLogEntry
         */
        getDescriptionValueWithUnit() {
            if (this._descriptionValueWithUnit == undefined) {
                this._descriptionValueWithUnit = driveLogEntryHelper_1.DriveLogEntryHelper.combineValueWithUnit(this.getValue(), this.getUnit());
            }
            return this._descriptionValueWithUnit;
        }
        /**
         * Holds the error description without formating
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        descriptionError() {
            var _a;
            if (this._descriptionError == undefined) {
                this._descriptionError = "";
                if (this.isResponseError()) {
                    let record = this._parsedEntry;
                    this._errorResponseParName = record.responseEntry.parIdName;
                    this._errorResponseParId = (_a = record === null || record === void 0 ? void 0 : record.responseEntry) === null || _a === void 0 ? void 0 : _a.parId;
                }
                this._descriptionError = this.getDescriptionError();
            }
            return this._descriptionError;
        }
        /**
         * Returns the description error
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getDescriptionError() {
            if (this._errorResponseParName != undefined && this._errorResponseParName != "") {
                if (this.isResponseErrorRec()) {
                    return this._errorResponseParName; // Only return the parameter name if response error
                }
                // if response par id is different to request par id -> show special error
                return "(Error: RespParID=" + this._errorResponseParName + ")";
            }
            return "";
        }
        /**
         * Returns the description text without the value(with or without styling)
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getDescriptionTextFromRecord() {
            let record = this._parsedEntry;
            if (record != undefined) {
                return record.parIdName;
            }
            return "";
        }
        /**
         * Retruns the par id
         *
         * @private
         * @returns {number}
         * @memberof DriveLogEntry
         */
        getParId() {
            if (this._parId == undefined) {
                let record = this._parsedEntry;
                this._parId = record.parId;
            }
            return this._parId;
        }
        /**
         * Returns only the value
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getValue() {
            if (this._value == undefined) {
                this._value = this.getValueFromRecord();
            }
            return this._value;
        }
        /**
         * Returns only the unit
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getUnit() {
            if (this._unit == undefined) {
                this._unit = this.getUnitFromRecord();
            }
            return this._unit;
        }
        /**
         * Returns true if the parameter is a bitPattern and has some bitPattern infos available
         *
         * @private
         * @returns {boolean}
         * @memberof DriveLogEntry
         */
        isBitPattern() {
            if (this._isBitPattern == undefined) {
                let record = this._parsedEntry;
                this._isBitPattern = record.isBitPattern;
            }
            return this._isBitPattern;
        }
        /**
         * Returns the value which should be shown for the given record
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getValueFromRecord() {
            let record = this._parsedEntry;
            if (this.isResponseAvailable()) {
                let returnValue = "";
                if (this._linkedRecordType == 5) { // "RD_RSP" => ReadResponse => show the value from the response and not from the request
                    let formatedValue = record.responseEntry.formatedValue;
                    returnValue = formatedValue;
                }
                else {
                    returnValue = record.formatedValue;
                }
                return returnValue;
            }
            else {
                if (record.isResponse && this._recordType == 3) { // "WR_RSP" => WriteResponse => don't show the value because it is only shown in the write request
                    return "";
                }
                else if (this._recordType == 4) { // "RD_REQ" => ReadRequest => don't show the value because it is only a read request (and not the already read value from the response)
                    return "";
                }
            }
            return record.formatedValue;
        }
        /**
         * Returns the unit from the nwct enry which should be shown for the given record
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getUnitFromRecord() {
            let record = this._parsedEntry;
            if (this.isResponseAvailable()) {
                let returnValue = "";
                if (this._linkedRecordType == 5) { // "RD_RSP" => ReadResponse => show the value/unit from the response and not from the request
                    returnValue = record.responseEntry.unit;
                }
                else {
                    returnValue = record.unit;
                }
                return returnValue;
            }
            else {
                if (record.isResponse && this._recordType == 3) { // "WR_RSP" => WriteResponse => don't show the value/unit because it is only shown in the write request
                    return "";
                }
                else if (this._recordType == 4) { // "RD_REQ" => ReadRequest => don't show the value/unit because it is only a read request (and not the already read value from the response)
                    return "";
                }
            }
            return record.unit;
        }
        /**
         * Returns some text which should also be used for the search/filter mechanisms(e.g. errorNumber, error description)
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getAdditionalSearchInfo() {
            var _a, _b;
            let errorNumber = (_b = (_a = this.getAddtionalData().mergedData) === null || _a === void 0 ? void 0 : _a.errorInfo) === null || _b === void 0 ? void 0 : _b.errorNumber;
            let additionalData = "";
            if (errorNumber != undefined && errorNumber != -1) {
                additionalData = errorNumber.toString();
            }
            if (this.descriptionError() != "") {
                // Add error description to search info
                if (additionalData != "") {
                    additionalData += " ";
                }
                additionalData += this.descriptionError();
            }
            return additionalData;
        }
        /**
         * Returns a description tooltip text
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getDescriptionTooltip() {
            let tooltip = driveLogEntryHelper_1.DriveLogEntryHelper.getMainDescriptionTooltip(this.getMergedRecordTypeName(), this.getParId());
            // Add parameter name and value if available
            tooltip += this.getDescriptionTextFormated();
            // add value only if it is not a bitpattern value
            if (this.getDescriptionValueWithUnitFormated() != "" && !this.isBitPattern()) {
                tooltip += " = " + this.getDescriptionValueWithUnitFormated();
            }
            // Format the additionalData(paramGroups data, bitmask data, ...)
            let tooltipForRecord = driveLogEntryHelper_1.DriveLogEntryHelper.getAdditionalDescriptionTooltip(this.getAddtionalData().mergedData);
            if (tooltipForRecord != "") {
                tooltip += "<br/>";
                tooltip += tooltipForRecord;
            }
            return tooltip;
        }
        /**
         * Returns the additional data for this entry(e.g. error info, param group info, bit mask info)
         *
         * @private
         * @returns {AdditionalData}
         * @memberof DriveLogEntry
         */
        getAddtionalData() {
            if (this._additionalData == undefined) {
                let record = this._parsedEntry;
                let additionalData = new driveLogEntryAdditionalData_1.AdditionalData();
                // Add tooltip info of request if available
                if ((!this.isErrorRecord() && this._recordType != 4) || (!this.isResponseAvailable())) {
                    // show info if no response is available or
                    // show info if it is not an read error request => for read error request the data will be used from the response
                    let data = this.getAdditionalDataForRecord(record);
                    if (data != undefined) {
                        if (!this.isResponseAvailable() && this._recordType == 4) // Don't use errorInfo from request if ReadRequest with no response data is available
                         {
                            data.errorInfo = undefined;
                        }
                        additionalData.addData(data);
                    }
                }
                // Add tooltip info of response if available
                if (this.isResponseAvailable() && (this._recordType != 2 || this.isResponseErrorRec())) { //"WR_REQ" write value already shown from request data; only show error data if available
                    let data = this.getAdditionalDataForRecord(record.responseEntry);
                    if (data != undefined) {
                        additionalData.addData(data);
                    }
                }
                this._additionalData = additionalData;
            }
            return this._additionalData;
        }
        /**
         * Get tooltip data for the given record(request or response)
         *
         * @private
         * @param {INwctEntry} record
         * @returns {(IAdditionalData|undefined)}
         * @memberof DriveLogEntry
         */
        getAdditionalDataForRecord(record) {
            let parGroup;
            let errorInfo;
            let bitPattern;
            if (record.isParameterGroup && record.entryType != 4) { // Don't show parametergroup/error info if entryType=4 (read request)
                // Show parameterGroup info in case of parameter group
                let parGroupDescriptionData = record.parameterGroupDescription;
                if (Array.isArray(parGroupDescriptionData)) {
                    parGroup = parGroupDescriptionData;
                }
                else {
                    errorInfo = parGroupDescriptionData;
                }
            }
            if (record.isBitPattern) {
                // Add parameter name in case of bitpattern
                bitPattern = record.bitPatternDescription;
            }
            if (parGroup == undefined && bitPattern == undefined && errorInfo == undefined) {
                return undefined;
            }
            let data = { parGroup: parGroup, errorInfo: errorInfo, bitPattern: bitPattern };
            return data;
        }
        /**
         * Returns the node number to which the logger entry belongs to
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getNodeNumber() {
            let nodeNumber = this._parsedEntry.nodeNumber.toString();
            if (nodeNumber == "0") { // if node number is 0 don't show => e.g. NCMAN
                return "";
            }
            return ".ST" + nodeNumber;
        }
        /**
         * Returns the channel of the object
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getModuleChannelFromRecord() {
            return this._parsedEntry.channelNumber;
        }
        /**
         * Returns the object type (e.g. AXIS, VAXIS, ...)
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getModuleTypeFromRecord() {
            return this._parsedEntry.componentType;
        }
        /**
         * Returns the tooltip text for the record type(e.g. "Write Request", ..)
         *
         * @private
         * @returns {string}
         * @memberof DriveLogEntry
         */
        getMergedRecordTypeName() {
            if (this._mergedRecordTypeName == undefined) {
                if (this.isResponseAvailable()) {
                    // Response is available -> Show request/response merged text
                    let responseText = this._linkedRecordTypeName;
                    let diffCharIndex = driveLogEntryHelper_1.DriveLogEntryHelper.findFirstDifferentChar(this._recordTypeName, responseText);
                    if (diffCharIndex > 0) {
                        responseText = responseText.substr(diffCharIndex);
                    }
                    // show response text in red and add error if response is invalid
                    this._mergedRecordTypeName = this._recordTypeName + "/" + responseText;
                }
                else {
                    this._mergedRecordTypeName = this._recordTypeName;
                }
            }
            if (this.isResponseError()) {
                let responseStartIndex = this._mergedRecordTypeName.indexOf("/");
                if (responseStartIndex != -1) {
                    let requestText = this._mergedRecordTypeName.substr(0, responseStartIndex + 1);
                    let responseText = this._mergedRecordTypeName.substr(responseStartIndex + 1);
                    responseText = driveLogEntryHelper_1.DriveLogEntryHelper.setStyleError(responseText + " Error");
                    return requestText + responseText;
                }
                else {
                    return this._mergedRecordTypeName;
                }
            }
            return this._mergedRecordTypeName;
        }
        /**
         * Returns true if a response is available for the given request
         *
         * @private
         * @returns {boolean}
         * @memberof DriveLogEntry
         */
        isResponseAvailable() {
            if (this._linkedRecordType != undefined) {
                if (this._linkedRecordType != -1) {
                    return true;
                }
            }
            return false;
        }
        /**
         * Returns true if the given response is valid for the given request(same command/parameterId for request and response)
         *
         * @private
         * @returns {boolean}
         * @memberof DriveLogEntry
         */
        isResponseParIdValid() {
            if (this._isLinkedRecordValid != undefined) {
                return this._isLinkedRecordValid;
            }
            return true;
        }
        /**
         * Retruns true if a response error, else false
         *
         * @private
         * @returns {boolean}
         * @memberof DriveLogEntry
         */
        isResponseErrorRec() {
            if (this._isLinkedRecordError == undefined) {
                let record = this._parsedEntry;
                this._isLinkedRecordError = record.responseEntry.isErrorRecord;
            }
            return this._isLinkedRecordError;
        }
    };
    DriveLogEntry = __decorate([
        mco.role()
    ], DriveLogEntry);
    exports.DriveLogEntry = DriveLogEntry;
});
