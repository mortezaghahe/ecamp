var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./anyConversion", "./enum/dataTypeEnum", "./package", "./meta", "../../widgets/common/states/settingIds", "./enum/additionalMetaKeys"], function (require, exports, anyConversion_1, dataTypeEnum_1, package_1, meta_1, settingIds_1, additionalMetaKeys_1) {
    "use strict";
    var CursorStateConversion_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorStateConversion = void 0;
    var DataIds;
    (function (DataIds) {
        DataIds["TimeCursorStates"] = "timeCursorStates";
        DataIds["FrequencyCursorStates"] = "frequencyCursorStates";
        DataIds["FrequencyCursorStates_OLD"] = "fftCursorStates";
        DataIds["Position"] = "position";
        DataIds["Active"] = "active";
    })(DataIds || (DataIds = {}));
    /**
     * The conversion handling the cursor state data, specific for the CursorStatePackageConverter.
     *
     * @class CursorStateConversion
     * @extends {AnyConversion}
     */
    let CursorStateConversion = CursorStateConversion_1 = class CursorStateConversion extends anyConversion_1.AnyConversion {
        /**
         * Creates an instance of CursorStateConversion.
         * Only to be used in CursorStatePackageConverter, as it sets the used keys itself.
         *
         * @memberof CursorStateConversion
         */
        constructor() {
            let settingKeys = [
                settingIds_1.SettingIds.TimeCursorActiveState,
                settingIds_1.SettingIds.TimeCursorPositions,
                settingIds_1.SettingIds.FftCursorActiveState,
                settingIds_1.SettingIds.FftCursorPositions
            ];
            let packageKeys = [
                DataIds.TimeCursorStates,
                DataIds.FrequencyCursorStates,
                DataIds.FrequencyCursorStates_OLD
            ];
            super(settingKeys, packageKeys);
            this.dataType = dataTypeEnum_1.DataType.ARRAY;
        }
        /**
         * Converts the cursor state data from package to settings format.
         *
         * @param {Array<any>} data
         * @returns {Array<any>}
         * @memberof CursorStateConversion
         */
        convertDataFrom(data) {
            let timeCursorSates = data[0];
            let frequencyCursorSates = data[1];
            if (frequencyCursorSates === undefined) { //backwards compatibility for when frequencyCursorStates were named fftCursorStates
                frequencyCursorSates = data[2];
            }
            let settingsData = new Array();
            settingsData.push(timeCursorSates.map((elem) => { return elem.active; }));
            settingsData.push(timeCursorSates.map((elem) => { return elem.position; }));
            settingsData.push(frequencyCursorSates.map((elem) => { return elem.active; }));
            settingsData.push(frequencyCursorSates.map((elem) => { return elem.position; }));
            return settingsData;
        }
        /**
         * Converts the cursor state data from settings to package format.
         *
         * @param {Array<any>} data
         * @returns {Array<IPackage>}
         * @memberof CursorStateConversion
         */
        convertDataTo(data) {
            let timeCursorActiveStates = data[0];
            let timeCursorPositions = data[1];
            let frequencyCursorActiveStates = data[2];
            let frequencyCursorPositions = data[3];
            let timeCursorStates = this.buildcursorStateDataObjectArray(timeCursorPositions, timeCursorActiveStates);
            let timeCursorStatesPackage = new package_1.Package(new meta_1.Meta(this.dataType, [{ key: additionalMetaKeys_1.AdditionalMetaKeys.ARRAYTYPE, value: CursorStateConversion_1.cursorStateDataObjectType }]), timeCursorStates);
            let frequencyCursorStates = this.buildcursorStateDataObjectArray(frequencyCursorPositions, frequencyCursorActiveStates);
            let frequencyCursorStatesPackage = new package_1.Package(new meta_1.Meta(this.dataType, [{ key: additionalMetaKeys_1.AdditionalMetaKeys.ARRAYTYPE, value: CursorStateConversion_1.cursorStateDataObjectType }]), frequencyCursorStates);
            return [timeCursorStatesPackage, frequencyCursorStatesPackage];
        }
        /**
         * Builds CursorStateDataObjects from the given position and activestate arrays.
         *
         * @private
         * @param {Array<number>} cursorPositionArray
         * @param {Array<boolean>} cursorActiveStateArray
         * @returns {Array<CursorStateDataObject>}
         * @memberof CursorStateConversion
         */
        buildcursorStateDataObjectArray(cursorPositionArray, cursorActiveStateArray) {
            let cursorStateDataObjectArray = new Array();
            for (let i = 0; i < cursorPositionArray.length && i < cursorActiveStateArray.length; i++) {
                let cursorStateDataObject = {};
                cursorStateDataObject[DataIds.Position] = cursorPositionArray[i];
                cursorStateDataObject[DataIds.Active] = cursorActiveStateArray[i];
                cursorStateDataObjectArray.push(cursorStateDataObject);
            }
            return cursorStateDataObjectArray;
        }
        /**
         * Checks if the  IMeta data is correct for this conversion.
         *
         * @param {Array<IMeta>} meta
         * @returns {boolean}
         * @memberof CursorStateConversion
         */
        checkMetaDataType(meta) {
            let isValid = meta.length === 3;
            //check if timeCursorStates meta data is valid and contained data types supported by this conversion
            if ((!meta_1.Meta.isInvalid(meta[0])) && (meta[0].dataType === this.dataType && meta[0][additionalMetaKeys_1.AdditionalMetaKeys.ARRAYTYPE] === CursorStateConversion_1.cursorStateDataObjectType)) {
                isValid = isValid && true;
            }
            else {
                isValid = false;
            }
            //check if frequencyCursorStates meta data is valid and contained data types supported by this conversion
            if ((!meta_1.Meta.isInvalid(meta[1])) && (meta[1].dataType === this.dataType && meta[1][additionalMetaKeys_1.AdditionalMetaKeys.ARRAYTYPE] === CursorStateConversion_1.cursorStateDataObjectType)) {
                isValid = isValid && true;
            }
            //check if fftCursorStates meta data is valid and contained data types supported by this conversion (for backwards compatibility)
            else if ((!meta_1.Meta.isInvalid(meta[2])) && (meta[2].dataType === this.dataType && meta[2][additionalMetaKeys_1.AdditionalMetaKeys.ARRAYTYPE] === CursorStateConversion_1.cursorStateDataObjectType)) {
                isValid = isValid && true;
            }
            else {
                isValid = false;
            }
            return isValid;
        }
    };
    CursorStateConversion.cursorStateDataObjectType = "cursorstatedata";
    CursorStateConversion = CursorStateConversion_1 = __decorate([
        mco.role()
    ], CursorStateConversion);
    exports.CursorStateConversion = CursorStateConversion;
});
