var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./anyConversion", "./enum/dataTypeEnum", "./meta", "./package"], function (require, exports, anyConversion_1, dataTypeEnum_1, meta_1, package_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberOrStringToStringConversion = void 0;
    /**
     * The conversion handling the type string.
     *
     * @class StringConversion
     * @extends {AnyConversion}
     */
    let NumberOrStringToStringConversion = class NumberOrStringToStringConversion extends anyConversion_1.AnyConversion {
        /**
         * Creates an instance of StringConversion.
         *
         * @param {Array<string>} settingKey The keys to be addressed in the settings data by this conversion.
         * @param {Array<string>} packageKey The keys to be addressed in the package data by this conversion.
         * @memberof StringConversion
         */
        constructor(settingKey, packageKey) {
            super(settingKey, packageKey);
            this.dataType = dataTypeEnum_1.DataType.STRING;
        }
        /**
         * Checks if the data type is number.
         *
         * @param {Array<any>} data
         * @returns {boolean}
         * @memberof StringConversion
         */
        checkDataTypes(data) {
            return data.every((item) => { return typeof item === "string" || typeof item === "number"; });
        }
        /**
         * Converts the data from settings to package format via the string constructor.
         *
         * @param {Array<any>} data
         * @returns {Array<IPackage>}
         * @memberof StringConversion
         */
        convertDataTo(data) {
            return data.map((item) => { return new package_1.Package(new meta_1.Meta(this.dataType), new String(item).valueOf()); });
        }
        /**
         * Converts the data from package to settings format.
         *
         * @param {Array<any>} data
         * @returns {Array<any>}
         * @memberof StringConversion
         */
        convertDataFrom(data) {
            return data.map((item) => { return new String(item).valueOf(); });
        }
    };
    NumberOrStringToStringConversion = __decorate([
        mco.role()
    ], NumberOrStringToStringConversion);
    exports.NumberOrStringToStringConversion = NumberOrStringToStringConversion;
});
