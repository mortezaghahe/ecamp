var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../persistence/settings", "./enum/additionalMetaKeys", "./package", "./meta", "./enum/dataTypeEnum", "./packageConversionInfoContainer"], function (require, exports, settings_1, additionalMetaKeys_1, package_1, meta_1, dataTypeEnum_1, packageConversionInfoContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BasePackageConverter = void 0;
    /**
     * The base class for all package converters.
     *
     * @class BasePackageConverter
     */
    let BasePackageConverter = class BasePackageConverter {
        /**
         * Creates an instance of BasePackageConverter.
         *
         * @param {ObjectType} objectType The object type of the package that can be handled by this converter.
         * @param {string} settingsType The settings type that can be handled by this converter.
         * @memberof BasePackageConverter
         */
        constructor(objectType, settingsType) {
            this.conversionInfoContainer = new packageConversionInfoContainer_1.PackageConversionInfoContainer();
            this.settingsUpgradeMap = new Map();
            this.objectType = objectType;
            this.settingsType = settingsType;
        }
        /**
         * Returns the object type with which this converter can work.
         *
         * @returns {ObjectType}
         * @memberof BasePackageConverter
         */
        getObjectType() {
            return this.objectType;
        }
        /**
         * Returns the settings type with which this converter can work.
         *
         * @returns {string}
         * @memberof BasePackageConverter
         */
        getSettingsType() {
            return this.settingsType;
        }
        /**
         * Handles the basic procedure of converting a setting to a package.
         *
         * @param {Settings} setting The settings object to be converted to a package
         * @param {number} id The id of the resulting package
         * @param {string} [key=""] The key of the resulting package
         * @returns {IPackage}
         * @memberof BasePackageConverter
         */
        convertTo(setting, id, key = "") {
            setting = this.upgradeSetting(setting);
            //retrieve the appropriate conversions for the given setting version
            let conversionInfo = this.conversionInfoContainer.getNewestConversionForSettingsVersion(setting.version);
            let conversions = conversionInfo.conversions;
            //build the additional meta info for the setting
            let additionalMetaInfo = this.buildAdditionalMetaInfo(id, key, conversionInfo.packageVersion);
            let packet = new package_1.Package(new meta_1.Meta(dataTypeEnum_1.DataType.OBJECT, additionalMetaInfo));
            if (conversions.length !== 0) { // only run conversions if there are some (version is supported)
                conversions.forEach((conversion) => { packet = conversion.convertTo(setting, packet); });
            }
            else { // no conversions means the version is unsupported -> throw an error
                throw new Error("unsupported version");
            }
            return packet;
        }
        /**
         * Upgrades a Setting to its newest supported version.
         *
         * @private
         * @param {Settings} setting The settings to be upgraded
         * @returns {Settings}
         * @memberof BasePackageConverter
         */
        upgradeSetting(setting) {
            let upgradedSetting = setting;
            let currentVersion = Number(upgradedSetting.version);
            let maxVersion = Number(this.conversionInfoContainer.getMaxSupportedSettingsVersion());
            while (currentVersion < maxVersion) { // upgrade the setting until the current version and the max supported version match
                let upgrade = this.settingsUpgradeMap.get(currentVersion);
                if (upgrade === undefined) { // if an upgrade inbetween is missing, the setting cannot be updated to newest version -> unsupported version error
                    throw new Error("unsupported version");
                }
                upgradedSetting = upgrade(upgradedSetting);
                currentVersion = Number(upgradedSetting.version);
            }
            return settings_1.Settings.create(upgradedSetting);
        }
        /**
         * Handles the basic procedure of converting a package to a setting
         *
         * @param {IPackage} packet
         * @returns {ISettings}
         * @memberof BasePackageConverter
         */
        convertFrom(packet) {
            let packageVersion = this.getPackageVersion(packet);
            //retrieve the appropriate conversions for the given package version
            let conversionsInfo = this.conversionInfoContainer.getNewestConversionForPackageVersion(packageVersion);
            let conversions = conversionsInfo.conversions;
            let setting = new settings_1.Settings(this.settingsType, conversionsInfo.settingsVersion);
            if (conversions.length !== 0) { // only run conversions if there are some (version is supported)
                conversions.forEach((conversion) => { setting = conversion.convertFrom(setting, packet); });
                setting = this.upgradeSetting(setting);
            }
            else { // no conversions means the version is unsupported -> throw an error
                throw new Error("unsupported version");
            }
            return setting;
        }
        /**
         * Builds the additional meta information for a converter.
         *
         * @private
         * @param {number} id
         * @param {string} key
         * @returns {Array<KeyValue>}
         * @memberof BasePackageConverter
         */
        buildAdditionalMetaInfo(id, key, version) {
            let additionalMetaInfo = new Array();
            additionalMetaInfo.push({ key: additionalMetaKeys_1.AdditionalMetaKeys.OBJECTTYPE, value: this.objectType });
            additionalMetaInfo.push({ key: additionalMetaKeys_1.AdditionalMetaKeys.VERSION, value: version });
            if (!Number.isNaN(id)) { // add id only if there is one
                additionalMetaInfo.push({ key: additionalMetaKeys_1.AdditionalMetaKeys.ID, value: id });
            }
            if (key !== "") { // add key only if there is one
                additionalMetaInfo.push({ key: additionalMetaKeys_1.AdditionalMetaKeys.KEY, value: key });
            }
            return additionalMetaInfo;
        }
        /**
         * Returns the version number of the provided package.
         *
         * @private
         * @param {Package} packet
         * @returns {number} Version number or NaN if no version number found
         * @memberof BasePackageConverter
         */
        getPackageVersion(packet) {
            return Number(packet.meta[additionalMetaKeys_1.AdditionalMetaKeys.VERSION]);
        }
    };
    BasePackageConverter = __decorate([
        mco.role()
    ], BasePackageConverter);
    exports.BasePackageConverter = BasePackageConverter;
});
