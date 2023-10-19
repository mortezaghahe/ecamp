var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/packageConversion/basePackageConverter", "../../../common/packageConversion/enum/objectTypeEnum", "../../../common/packageConversion/stringConversion", "../../../common/packageConversion/arrayConversion", "../../../common/packageConversion/numberConversion", "../../../common/persistence/settings"], function (require, exports, basePackageConverter_1, objectTypeEnum_1, stringConversion_1, arrayConversion_1, numberConversion_1, settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalPackageConverter = void 0;
    /**
     * The package converter handling the signal setting.
     *
     * @class SignalPackageConverter
     * @extends {BasePackageConverter}
     */
    let SignalPackageConverter = class SignalPackageConverter extends basePackageConverter_1.BasePackageConverter {
        /**
         * Creates an instance of SignalPackageConverter.
         *
         * @memberof SignalPackageConverter
         */
        constructor() {
            super(objectTypeEnum_1.ObjectType.SIGNAL, "Signal");
            this.conversionInfoContainer.addConversion("2.0", 1, [
                new stringConversion_1.StringConversion(["name"], ["name"]),
                new arrayConversion_1.ArrayConversion(["rawPointsX", "rawPointsY"], ["xValues", "yValues"], new numberConversion_1.NumberConversion([], []))
            ]);
            this.settingsUpgradeMap.set(1, this.upgradeSettingsV1.bind(this));
        }
        /**
         * Upgrades the signal setting from version 1.0 to version 2.0
         *
         * @private
         * @param {ISettings} settingsData
         * @returns {ISettings}
         * @memberof SignalPackageConverter
         */
        upgradeSettingsV1(settingsData) {
            let setting = settings_1.Settings.create(settingsData);
            let upgradedSettings = new settings_1.Settings(this.settingsType, "2.0");
            // set name field to updated setting without changes
            let name = setting.getValue("name");
            upgradedSettings.setValue("name", name);
            // set rawPointsX and rawPointsX field to updated setting with data extracted from obsolet points field of previous version.
            // fields didnt exist on old settings version
            let points = setting.getValue("points");
            let pointsX = points.map((s) => { return Number(s.split(";")[0]); });
            let pointsY = points.map((s) => { return Number(s.split(";")[1]); });
            upgradedSettings.setValue("rawPointsX", pointsX);
            upgradedSettings.setValue("rawPointsY", pointsY);
            return upgradedSettings;
        }
    };
    SignalPackageConverter = __decorate([
        mco.role()
    ], SignalPackageConverter);
    exports.SignalPackageConverter = SignalPackageConverter;
});
