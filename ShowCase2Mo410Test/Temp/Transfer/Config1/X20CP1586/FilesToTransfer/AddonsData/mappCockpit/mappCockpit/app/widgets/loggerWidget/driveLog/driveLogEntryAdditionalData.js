var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var AdditionalData_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AdditionalData = void 0;
    let AdditionalData = AdditionalData_1 = class AdditionalData {
        /**
         * Create an instance with the given export data
         *
         * @static
         * @param {(Array<INwctParamGroupInfo>|undefined)} parGroupData
         * @param {(INwctErrorInfo|undefined)} errorInfoData
         * @param {(Array<INwctBitDefinition>|undefined)} bitPatternData
         * @returns {(AdditionalData|undefined)}
         * @memberof AdditionalData
         */
        static create(parGroupData, errorInfoData, bitPatternData) {
            let newObj = new AdditionalData_1();
            if (parGroupData != undefined || errorInfoData != undefined || bitPatternData != undefined) {
                // create real objects with the given import data 
                let bitPattern = this.createBitPattern(bitPatternData);
                let errorInfo = this.createErrorInfo(errorInfoData);
                let parGroup = this.createParGroup(parGroupData);
                newObj.mergedData = { parGroup: parGroup, errorInfo: errorInfo, bitPattern: bitPattern };
            }
            return newObj;
        }
        /**
         * Add some additional data (bitpattern, param group, error info)
         *
         * @param {(IAdditionalData|undefined)} dataToMerge
         * @returns
         * @memberof AdditionalData
         */
        addData(dataToMerge) {
            if (this.mergedData == undefined) {
                this.mergedData = dataToMerge;
                return;
            }
            if (dataToMerge != undefined) {
                if (dataToMerge.bitPattern != undefined) {
                    this.mergedData.bitPattern = dataToMerge.bitPattern;
                }
                if (dataToMerge.errorInfo != undefined) {
                    this.mergedData.errorInfo = dataToMerge.errorInfo;
                }
                if (dataToMerge.parGroup != undefined) {
                    this.mergedData.parGroup = dataToMerge.parGroup;
                }
            }
        }
        /**
         * Returns the parameter group data for export
         *
         * @returns {(Array<INwctParamGroupInfo>|undefined)}
         * @memberof AdditionalData
         */
        getParGroupExportData() {
            if (this.mergedData != undefined && this.mergedData.parGroup != undefined) {
                let onlyExportData = new Array();
                this.mergedData.parGroup.forEach(element => {
                    let onlyExportDataElement = { parId: element.parId,
                        parName: element.parName,
                        parType: undefined,
                        parValue: element.parValue,
                        parUnit: element.parUnit,
                        bitPattern: element.bitPattern };
                    onlyExportData.push(onlyExportDataElement);
                });
                return onlyExportData;
            }
            return undefined;
        }
        /**
         * Returns the bitpattern data for export
         *
         * @returns {(Array<INwctBitDefinition>|undefined)}
         * @memberof AdditionalData
         */
        getBitPatternExportData() {
            if (this.mergedData != undefined && this.mergedData.bitPattern != undefined) {
                let onlyExportData = new Array();
                this.mergedData.bitPattern.forEach(element => {
                    let isSet = undefined;
                    if (element.isSet == true) {
                        isSet = true;
                    }
                    let isModified = undefined;
                    if (element.isModified == true) {
                        isModified = true;
                    }
                    onlyExportData.push({ bit: element.bit, name: element.name, isSet: isSet, isModified: isModified });
                });
                return onlyExportData;
            }
            return undefined;
        }
        /**
         * Returns the error info data for export
         *
         * @returns {(INwctErrorInfo|undefined)}
         * @memberof AdditionalData
         */
        getErrorInfoExportData() {
            if (this.mergedData != undefined && this.mergedData.errorInfo != undefined) {
                let errorValue = this.mergedData.errorInfo.errorValue;
                if (errorValue == "") {
                    errorValue = undefined;
                }
                let errorValueType = this.mergedData.errorInfo.errorValueType;
                if (errorValueType == "") {
                    errorValueType = undefined;
                }
                let errorValueUnit = this.mergedData.errorInfo.errorValueUnit;
                if (errorValueUnit == "") {
                    errorValueUnit = undefined;
                }
                let onlyExportData = { errorNumber: this.mergedData.errorInfo.errorNumber,
                    errorValue: errorValue,
                    errorValueType: errorValueType,
                    errorValueUnit: errorValueUnit,
                    errorMessage: this.mergedData.errorInfo.errorMessage,
                };
                return onlyExportData;
            }
            return undefined;
        }
        /**
         * create real object with the given import data, and some converting if needed
         *
         * @private
         * @static
         * @param {*} errorInfoData
         * @returns {(INwctErrorInfo|undefined)}
         * @memberof AdditionalData
         */
        static createErrorInfo(errorInfoData) {
            if (errorInfoData != undefined) {
                let errorInfo;
                let errorValue = errorInfoData.errorValue;
                if (errorValue == undefined) {
                    errorValue = "";
                }
                let errorValueType = errorInfoData.errorValueType;
                if (errorValueType == undefined) {
                    errorValueType = "";
                }
                let errorValueUnit = errorInfoData.errorValueUnit;
                if (errorValueUnit == undefined) {
                    errorValueUnit = "";
                }
                errorInfo = { errorNumber: errorInfoData.errorNumber, errorValue: errorValue, errorValueType: errorValueType,
                    errorValueUnit: errorValueUnit, errorMessage: errorInfoData.errorMessage };
                return errorInfo;
            }
            return undefined;
        }
        /**
         * create real object with the given import data, and some converting if needed
         *
         * @private
         * @static
         * @param {*} bitPatternData
         * @returns {(Array<INwctBitDefinition>|undefined)}
         * @memberof AdditionalData
         */
        static createBitPattern(bitPatternData) {
            if (bitPatternData != undefined) {
                let bitPattern = new Array();
                bitPatternData.forEach(element => {
                    let isSet = element.isSet;
                    if (isSet == undefined) {
                        isSet = false;
                    }
                    let isModified = element.isModified;
                    if (isModified == undefined) {
                        isModified = false;
                    }
                    bitPattern.push({ bit: element.bit, name: element.name, isSet: isSet, isModified: isModified });
                });
                return bitPattern;
            }
            return undefined;
        }
        /**
         * create real object with the given import data, and some converting if needed
         *
         * @private
         * @static
         * @param {*} parGroupData
         * @returns {(Array<INwctParamGroupInfo>|undefined)}
         * @memberof AdditionalData
         */
        static createParGroup(parGroupData) {
            if (parGroupData != undefined) {
                let parGroup = new Array();
                parGroupData.forEach(element => {
                    parGroup.push({ parId: element.parId, parName: element.parName, parValue: element.parValue, parType: element.parType, parUnit: element.parUnit, bitPattern: element.bitPattern });
                });
                return parGroup;
            }
            return undefined;
        }
    };
    AdditionalData = AdditionalData_1 = __decorate([
        mco.role()
    ], AdditionalData);
    exports.AdditionalData = AdditionalData;
});
