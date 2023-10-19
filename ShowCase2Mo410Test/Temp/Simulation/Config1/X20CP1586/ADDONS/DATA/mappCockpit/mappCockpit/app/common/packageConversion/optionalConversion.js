var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./anyConversion"], function (require, exports, anyConversion_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OptionalConversion = void 0;
    /**
     * The conversion handling optional conversions.
     * Should be used for keys that may or may not exist.
     *
     * @class OptionalConversion
     * @extends {AnyConversion}
     */
    let OptionalConversion = class OptionalConversion extends anyConversion_1.AnyConversion {
        /**
         * Creates an instance of OptionalConversion.
         *
         * @param {Array<string>} settingKey The keys to be addressed in the settings data by this conversion.
         * @param {Array<string>} packageKey The keys to be addressed in the package data by this conversion.
         * @param {AnyConversion} conversion The conversion that should be used, if possible.
         * @memberof OptionalConversion
         */
        constructor(settingKey, packageKey, conversion) {
            super(settingKey, packageKey);
            this.dataType = conversion.getDataType();
            this.conversion = conversion;
        }
        /**
         * Runs the provided conversion from package to settings format.
         * If the provided conversion fails, it returns to the state before the execution of the provided conversion.
         *
         * @param {Settings} setting
         * @param {IPackage} packet
         * @returns {Settings}
         * @memberof OptionalConversion
         */
        convertFrom(setting, packet) {
            let changedSetting = setting;
            try {
                changedSetting = super.convertFrom(setting, packet);
            }
            catch (e) {
                //Do nothing, just erase error.
            }
            return changedSetting;
        }
        /**
         * Runs the provided conversion from settings to package format.
         * If the provided conversion fails, it returns to the state before the execution of the provided conversion.
         *
         * @param {Settings} setting
         * @param {IPackage} packet
         * @returns {IPackage}
         * @memberof OptionalConversion
         */
        convertTo(setting, packet) {
            let changedPacket = packet;
            try {
                changedPacket = super.convertTo(setting, packet);
            }
            catch (e) {
                //Do nothing, just erase error.
            }
            return changedPacket;
        }
        /**
         * Checks if the IMeta data type is valid for the provided conversion.
         *
         * @param {Array<IMeta>} meta
         * @returns {boolean}
         * @memberof OptionalConversion
         */
        checkMetaDataType(meta) {
            return this.conversion.checkMetaDataType(meta);
        }
        /**
         * Checks if the additional meta info of the IMeta data is valid for the provided conversion.
         *
         * @param {Array<IMeta>} meta
         * @returns {boolean}
         * @memberof OptionalConversion
         */
        checkAdditionalMetaInfos(meta) {
            return this.conversion.checkAdditionalMetaInfos(meta);
        }
        /**
         * Checks if the data type is valid for the provided conversion.
         *
         * @param {Array<any>} data
         * @returns {boolean}
         * @memberof OptionalConversion
         */
        checkDataTypes(data) {
            return this.conversion.checkDataTypes(data);
        }
        /**
         * Converts the data from package to settings format using the provided conversion.
         *
         * @param {Array<any>} data
         * @returns {Array<any>}
         * @memberof OptionalConversion
         */
        convertDataFrom(data) {
            return this.conversion.convertDataFrom(data);
        }
        /**
         * Converts the data from settings to package format using the provided conversion.
         *
         * @param {Array<any>} data
         * @returns {Array<IPackage>}
         * @memberof OptionalConversion
         */
        convertDataTo(data) {
            return this.conversion.convertDataTo(data);
        }
    };
    OptionalConversion = __decorate([
        mco.role()
    ], OptionalConversion);
    exports.OptionalConversion = OptionalConversion;
});
