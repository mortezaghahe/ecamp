var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PackageConversionInfoContainer = void 0;
    /**
     * Container for all necessary information to pick the correct conversion for each version of setting and package data
     *
     * @class PackageConversionInfoContainer
     */
    let PackageConversionInfoContainer = class PackageConversionInfoContainer {
        /**
         * Creates an instance of PackageConversionInfoContainer.
         *
         * @memberof PackageConversionInfoContainer
         */
        constructor() {
            this.conversions = new Array();
        }
        /**
         * Adds a set of conversion and the version numbers supported on each side of the conversion.
         *
         * @param {string} settingsVersion The settings version supported by this set of conversion.
         * @param {number} packageVersion The package version supported by this set of conversion.
         * @param {Array<IPackageEntryConversion>} conversions The list of conversions between setting and package format.
         * @memberof PackageConversionInfoContainer
         */
        addConversion(settingsVersion, packageVersion, conversions) {
            this.conversions.push({
                settingsVersion: settingsVersion,
                packageVersion: packageVersion,
                conversions: conversions
            });
        }
        /**
         * Gets the most recent set of conversions that are compatible for this settings version.
         *
         * @param {string} settingsVersion
         * @returns {PackageConversionInfo}
         * @memberof PackageConversionInfoContainer
         */
        getNewestConversionForSettingsVersion(settingsVersion) {
            let candidates = this.conversions.filter((conversionInfo) => { return conversionInfo.settingsVersion === settingsVersion; });
            let reducer = { settingsVersion: "-1.0", packageVersion: -1, conversions: [] }; // intialize a reducer
            let newest = candidates.reduce((prev, current) => { return (current.packageVersion > prev.packageVersion) ? current : prev; }, reducer);
            if (reducer === newest) {
                throw new Error("no package conversion info found");
            }
            return newest;
        }
        /**
         * Gets the most recent set of conversions that are compatible for this package version.
         *
         * @param {number} packageVersion
         * @returns {PackageConversionInfo}
         * @memberof PackageConversionInfoContainer
         */
        getNewestConversionForPackageVersion(packageVersion) {
            let candidates = this.conversions.filter((conversionInfo) => { return conversionInfo.packageVersion === packageVersion; });
            let reducer = { settingsVersion: "-1.0", packageVersion: -1, conversions: [] };
            let newest = candidates.reduce((prev, current) => { return (Number(current.settingsVersion) > Number(prev.settingsVersion)) ? current : prev; }, reducer);
            if (reducer === newest) {
                throw new Error("no package conversion info found");
            }
            return newest;
        }
        /**
         * Gets the overall most recent supported settings version in this container.
         *
         * @returns {string}
         * @memberof PackageConversionInfoContainer
         */
        getMaxSupportedSettingsVersion() {
            let reducer = "-1.0";
            return this.conversions.reduce((prev, curr) => { return (Number(curr.settingsVersion) > Number(prev)) ? curr.settingsVersion : prev; }, reducer);
        }
    };
    PackageConversionInfoContainer = __decorate([
        mco.role()
    ], PackageConversionInfoContainer);
    exports.PackageConversionInfoContainer = PackageConversionInfoContainer;
});
