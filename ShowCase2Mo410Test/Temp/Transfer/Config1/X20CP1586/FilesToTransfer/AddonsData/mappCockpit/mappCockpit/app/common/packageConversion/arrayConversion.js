var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./anyConversion", "./enum/dataTypeEnum", "./enum/additionalMetaKeys", "./package", "./meta"], function (require, exports, anyConversion_1, dataTypeEnum_1, additionalMetaKeys_1, package_1, meta_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArrayConversion = void 0;
    /**
     * The conversion handling arrays.
     *
     * @class ArrayConversion
     * @extends {AnyConversion}
     */
    let ArrayConversion = class ArrayConversion extends anyConversion_1.AnyConversion {
        /**
         * Creates an instance of ArrayConversion.
         *
         * @param {Array<string>} settingKey The keys to be addressed in the settings data by this conversion.
         * @param {Array<string>} packageKey The keys to be addressed in the package data by this conversion.
         * @param {AnyConversion} contentConversion The conversion to be used for the array elements.
         * @memberof ArrayConversion
         */
        constructor(settingKey, packageKey, contentConversion) {
            super(settingKey, packageKey);
            this.dataType = dataTypeEnum_1.DataType.ARRAY;
            this.contentConversion = contentConversion;
        }
        /**
         * Checks if the additional meta infos contains the correct arrayType for the provided content conversion.
         *
         * @param {Array<IMeta>} meta
         * @returns {boolean}
         * @memberof ArrayConversion
         */
        checkAdditionalMetaInfos(meta) {
            let contentDataType = this.contentConversion.getDataType();
            return meta.every((meta) => { return !meta_1.Meta.isInvalid(meta) && (meta[additionalMetaKeys_1.AdditionalMetaKeys.ARRAYTYPE] === contentDataType || meta[additionalMetaKeys_1.AdditionalMetaKeys.ARRAYTYPE] === dataTypeEnum_1.DataType.INVALID); });
        }
        /**
         * Checks if the data types of the array elements match with the provided content conversion
         *
         * @param {Array<any>} data
         * @returns {boolean}
         * @memberof ArrayConversion
         */
        checkDataTypes(data) {
            return data.every((item) => { return Array.isArray(item) && this.contentConversion.checkDataTypes(item); });
        }
        /**
         * Performs the conversion from package to setting format of the content conversion for each array element.
         *
         * @param {Array<any>} data
         * @returns {Array<any>}
         * @memberof ArrayConversion
         */
        convertDataFrom(data) {
            return data.map((item) => { return this.contentConversion.convertDataFrom(item); });
        }
        /**
         * Performs the conversion from setting to package format of the content conversion for each array element.
         *
         * @param {Array<any>} data
         * @returns {Array<IPackage>}
         * @memberof ArrayConversion
         */
        convertDataTo(data) {
            let packageArray;
            let contentDataType = this.contentConversion.getDataType();
            if (contentDataType === dataTypeEnum_1.DataType.INVALID) { // If the content conversion IMeta datatype is of type INVALID, for each key an invalid package should be returned instead of an array.
                packageArray = data.map(() => { return package_1.Package.createInvalid(); });
            }
            else { // for every else IMeta datatype, an array package should be returned for each key.
                packageArray = data.map((item) => { return new package_1.Package(new meta_1.Meta(this.dataType, [{ key: additionalMetaKeys_1.AdditionalMetaKeys.ARRAYTYPE, value: contentDataType }]), this.contentConversion.convertDataTo(item).map((elem) => { return elem.data; })); });
            }
            return packageArray;
        }
    };
    ArrayConversion = __decorate([
        mco.role()
    ], ArrayConversion);
    exports.ArrayConversion = ArrayConversion;
});
