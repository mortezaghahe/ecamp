var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./anyConversion", "./package", "./meta", "./enum/dataTypeEnum"], function (require, exports, anyConversion_1, package_1, meta_1, dataTypeEnum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GenerateFromConversion = void 0;
    /**
     * The conversion for generating data for settings keys based on data from package keys.
     * No conversion happens from setting to package format.
     *
     * @class GenerateFromConversion
     * @extends {AnyConversion}
     */
    let GenerateFromConversion = class GenerateFromConversion extends anyConversion_1.AnyConversion {
        /**
         * Creates an instance of GenerateFromConversion.
         *
         * @param {Array<string>} settingKey The keys to be addressed in the settings data by this conversion.
         * @param {Array<string>} packageKey The keys to be addressed in the package data by this conversion.
         * @param {(data: Array<any>) => Array<any>} generateFrom The function that is called to generate data for settings keys based on data read from package keys
         * @memberof GenerateFromConversion
         */
        constructor(settingKey, packageKey, generateFrom) {
            super(settingKey, packageKey);
            this.dataType = dataTypeEnum_1.DataType.INVALID;
            this.generateFrom = generateFrom;
        }
        /**
         * Checks if the IMeta data is invalid.
         *
         * @param {Array<IMeta>} meta
         * @returns {boolean}
         * @memberof GenerateFromConversion
         */
        checkMetaDataType(meta) {
            return meta.every((meta) => { return !meta_1.Meta.isInvalid(meta); });
        }
        /**
         * Converts the data from package to settings format.
         * Uses the provided function for data generation.
         *
         * @param {Array<any>} data
         * @returns {Array<any>}
         * @memberof GenerateFromConversion
         */
        convertDataFrom(data) {
            return this.generateFrom(data);
        }
        /**
         * Creates invalid packages as no conversion from setting to package format should happen.
         *
         * @param {Array<any>} data
         * @returns {Array<IPackage>}
         * @memberof GenerateFromConversion
         */
        convertDataTo(data) {
            return data.map(() => { return package_1.Package.createInvalid(); });
        }
    };
    GenerateFromConversion = __decorate([
        mco.role()
    ], GenerateFromConversion);
    exports.GenerateFromConversion = GenerateFromConversion;
});
