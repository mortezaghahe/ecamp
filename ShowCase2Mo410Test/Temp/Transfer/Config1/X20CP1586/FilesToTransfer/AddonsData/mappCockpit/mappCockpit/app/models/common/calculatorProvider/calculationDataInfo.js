var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/persistence/settings", "./calculationDataInfoSettingIds"], function (require, exports, settings_1, calculationDataInfoSettingIds_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CalculationDataInfo = void 0;
    let CalculationDataInfo = class CalculationDataInfo {
        get uniqueId() {
            return this._uniqueId;
        }
        constructor(uniqueId = "") {
            this.inputSeriesIds = [];
            this._uniqueId = uniqueId;
            this._inputData = [];
            this._inputDataValues = [];
            this._inputDataIds = [];
            this._type = "";
        }
        getSettings() {
            let settings = new settings_1.Settings("CalculationDataInfo", "2.0");
            settings.setValue(calculationDataInfoSettingIds_1.SettingIds.Type, this.type);
            settings.setValue(calculationDataInfoSettingIds_1.SettingIds.InputDataValues, this.inputDataValues);
            settings.setValue(calculationDataInfoSettingIds_1.SettingIds.InputDataIds, this.inputDataIds);
            settings.setValue(calculationDataInfoSettingIds_1.SettingIds.UniqueId, this.uniqueId);
            return settings;
        }
        setSettings(settings) {
            let settingsObj = settings_1.Settings.create(settings);
            this.type = settingsObj.getValue(calculationDataInfoSettingIds_1.SettingIds.Type);
            this.inputDataValues = settingsObj.getValue(calculationDataInfoSettingIds_1.SettingIds.InputDataValues);
            this.inputDataIds = settingsObj.getValue(calculationDataInfoSettingIds_1.SettingIds.InputDataIds);
            if (this.inputDataIds == undefined) {
                this.inputDataIds = new Array();
            }
            this._uniqueId = settingsObj.getValue(calculationDataInfoSettingIds_1.SettingIds.UniqueId);
        }
        get type() {
            return this._type;
        }
        set type(type) {
            this._type = type;
        }
        get inputData() {
            return this._inputData;
        }
        set inputData(inputData) {
            this._inputData = inputData;
        }
        get inputDataValues() {
            return this._inputDataValues;
        }
        set inputDataValues(value) {
            this._inputDataValues = value;
        }
        get inputDataIds() {
            return this._inputDataIds;
        }
        set inputDataIds(value) {
            this._inputDataIds = value;
        }
    };
    CalculationDataInfo = __decorate([
        mco.role()
    ], CalculationDataInfo);
    exports.CalculationDataInfo = CalculationDataInfo;
});
