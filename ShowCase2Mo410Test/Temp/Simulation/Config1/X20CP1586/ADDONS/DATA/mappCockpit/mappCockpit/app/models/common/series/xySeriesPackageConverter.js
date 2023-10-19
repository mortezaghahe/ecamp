var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/packageConversion/basePackageConverter", "../../../common/packageConversion/enum/objectTypeEnum", "../../../common/packageConversion/stringConversion", "../../../common/packageConversion/subPackageConversion", "../../../common/packageConversion/arrayConversion", "../../../common/persistence/settings"], function (require, exports, basePackageConverter_1, objectTypeEnum_1, stringConversion_1, subPackageConversion_1, arrayConversion_1, settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XYSeriesPackageConverter = void 0;
    /**
     * The package converter handling the xy series setting.
     *
     * @class XYSeriesPackageConverter
     * @extends {BasePackageConverter}
     */
    let XYSeriesPackageConverter = class XYSeriesPackageConverter extends basePackageConverter_1.BasePackageConverter {
        /**
         * Creates an instance of XYSeriesPackageConverter.
         *
         * @memberof XYSeriesPackageConverter
         */
        constructor() {
            super(objectTypeEnum_1.ObjectType.XYSERIES, "XYSeries");
            this.conversionInfoContainer.addConversion("1.0", 1, [
                new stringConversion_1.StringConversion(["id", "name", "color"], ["id", "name", "color"]),
                new subPackageConversion_1.SubPackageConversion(["calculationData"], ["calculationData"])
            ]);
            this.conversionInfoContainer.addConversion("1.1", 2, [
                new stringConversion_1.StringConversion(["id", "name", "color"], ["id", "name", "color"]),
                new subPackageConversion_1.SubPackageConversion(["calculationData"], ["calculationData"]),
                new arrayConversion_1.ArrayConversion(["errorInfo"], ["errorInfo"], new stringConversion_1.StringConversion([], []))
            ]);
            this.settingsUpgradeMap.set(1, this.upgradeSettingsV1.bind(this));
        }
        /**
         * Upgrades the xy series setting from version 1.0 to version 1.1
         *
         * @private
         * @param {ISettings} settingsData
         * @returns {ISettings}
         * @memberof XYSeriesPackageConverter
         */
        upgradeSettingsV1(settingsData) {
            let setting = settings_1.Settings.create(settingsData);
            let upgradedSettings = new settings_1.Settings(this.settingsType, "1.1");
            // set id field to updated setting without changes
            let id = setting.getValue("id");
            upgradedSettings.setValue("id", id);
            // set name field to updated setting without changes
            let name = setting.getValue("name");
            upgradedSettings.setValue("name", name);
            // set color field to updated setting without changes
            let color = setting.getValue("color");
            upgradedSettings.setValue("color", color);
            // set calculationData field to updated setting without changes
            let calculationData = setting.getValue("calculationData");
            upgradedSettings.setValue("calculationData", calculationData);
            // set errorInfo field to updated setting with the default value of an empty array 
            // field didnt exist on old settings version
            upgradedSettings.setValue("errorInfo", []);
            return upgradedSettings;
        }
    };
    XYSeriesPackageConverter = __decorate([
        mco.role()
    ], XYSeriesPackageConverter);
    exports.XYSeriesPackageConverter = XYSeriesPackageConverter;
});
