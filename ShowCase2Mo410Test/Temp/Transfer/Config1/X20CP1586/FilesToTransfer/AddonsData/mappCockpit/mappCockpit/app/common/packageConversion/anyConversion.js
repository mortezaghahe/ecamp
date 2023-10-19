var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./enum/dataTypeEnum", "./meta", "./package"], function (require, exports, dataTypeEnum_1, meta_1, package_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnyConversion = void 0;
    /**
     * The base class for all conversions of package entries.
     *
     * @class AnyConversion
     * @implements {IPackageEntryConversion}
     */
    let AnyConversion = class AnyConversion {
        /**
         * Creates an instance of AnyConversion.
         *
         * @param {Array<string>} settingKey The keys to be addressed in the settings data by this conversion.
         * @param {Array<string>} packageKey The keys to be addressed in the package data by this conversion.
         * @memberof AnyConversion
         */
        constructor(settingKey, packageKey) {
            this.settingKey = settingKey;
            this.packageKey = packageKey;
            this.dataType = dataTypeEnum_1.DataType.ANY;
        }
        /**
         * Returns the datatype which can be handled by this conversion.
         *
         * @returns {DataType}
         * @memberof AnyConversion
         */
        getDataType() {
            return this.dataType;
        }
        /**
         * Handles the basic procedure and checks for the conversion of a package entry to a settings entry and applies it.
         *
         * @param {Settings} setting
         * @param {IPackage} packet
         * @returns {Settings}
         * @memberof AnyConversion
         */
        convertFrom(setting, packet) {
            // extract the metadata of the (in the packageKey array) specified keys from the package
            let meta = this.packageKey.map((key) => { return package_1.Package.getPackageKeyMeta(packet, key); });
            //check if the meta data is valid and the contained data type supported by this conversion
            if (!this.checkMetaDataType(meta)) {
                throw new Error("wrong meta type");
            }
            //check if the additional meta data is supported by this conversion
            if (!this.checkAdditionalMetaInfos(meta)) {
                throw new Error("wrong additional meta info");
            }
            // extract the data of the (in the packageKey array) specified keys from the package
            let data = this.packageKey.map((key) => { return package_1.Package.getPackageKeyData(packet, key); });
            // check if the data types of the data are supported by this conversion
            if (!this.checkDataTypes(data)) {
                throw new Error("wrong data type");
            }
            // run the conversion of the data
            let settingsData = this.convertDataFrom(data);
            // check if the number of converted data entries matches the provided settings keys
            if (settingsData.length !== this.settingKey.length) {
                throw new Error("amount of data and keys inconsistent");
            }
            // add each converted data entry to the setting
            settingsData.forEach((item, i) => {
                if (item !== undefined) { // only add the converted data if it is valid/exists
                    setting.setValue(this.settingKey[i], item);
                }
            });
            return setting;
        }
        /**
         * Handles the basic procedure and checks for the conversion of a settings entry to a package entry and applies it.
         *
         * @param {Settings} setting
         * @param {IPackage} packet
         * @returns {IPackage}
         * @memberof AnyConversion
         */
        convertTo(setting, packet) {
            // extract the data of the (in the settingKey array) specified keys from the setting
            let data = this.settingKey.map((key) => { return this.getSettingsKey(setting, key); });
            // run the conversion of the data
            let packageData = this.convertDataTo(data);
            // add each converted data entry to the package
            packageData.forEach((item, i) => {
                if (!package_1.Package.isInvalid(item)) { // only add the converted data if it is valid
                    package_1.Package.setPackageKey(packet, this.packageKey[i], item);
                }
            });
            return packet;
        }
        /**
         * Retrieves the data of a key of from a setting.
         *
         * @protected
         * @template T
         * @param {Settings} setting
         * @param {string} key
         * @returns {T}
         * @memberof AnyConversion
         */
        getSettingsKey(setting, key) {
            return setting.getValue(key);
        }
        /**
         * Checks if the dataType contained in the IMeta data is correct for this conversion.
         *
         * @param {Array<IMeta>} meta
         * @returns {boolean} Returns true if check was successful.
         * @memberof AnyConversion
         */
        checkMetaDataType(meta) {
            return meta.every((meta) => { return !meta_1.Meta.isInvalid(meta) && meta.dataType === this.dataType; });
        }
        /**
         * Checks if the additional meta infos contained in the IMeta data is correct for this conversion.
         *
         * @param {Array<IMeta>} meta
         * @returns {boolean} Returns true if check was succesful.
         * @memberof AnyConversion
         */
        checkAdditionalMetaInfos(meta) {
            return true;
        }
        /**
         * Checks if the datatypes of the data are correct for this conversion.
         *
         * @param {Array<any>} data
         * @returns {boolean} Returns true if check was successful.
         * @memberof AnyConversion
         */
        checkDataTypes(data) {
            return true;
        }
        /**
         * Converts the data from package to settings format.
         *
         * @param {Array<any>} data
         * @returns {Array<any>}
         * @memberof AnyConversion
         */
        convertDataFrom(data) {
            return data;
        }
        /**
         * Converts the data from settings to package format.
         *
         * @param {Array<any>} data
         * @returns {Array<IPackage>}
         * @memberof AnyConversion
         */
        convertDataTo(data) {
            return data.map((item) => { return new package_1.Package(new meta_1.Meta(this.dataType), item); });
        }
    };
    AnyConversion = __decorate([
        mco.role()
    ], AnyConversion);
    exports.AnyConversion = AnyConversion;
});
