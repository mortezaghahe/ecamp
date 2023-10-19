var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./anyConversion", "./enum/dataTypeEnum", "./package", "./meta"], function (require, exports, anyConversion_1, dataTypeEnum_1, package_1, meta_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberConversion = void 0;
    /**
     * This conversion handles the type number.
     *
     * @class NumberConversion
     * @extends {AnyConversion}
     */
    let NumberConversion = class NumberConversion extends anyConversion_1.AnyConversion {
        /**
         * Creates an instance of NumberConversion.
         *
         * @param {Array<string>} settingKey The keys to be addressed in the settings data by this conversion.
         * @param {Array<string>} packageKey The keys to be addressed in the package data by this conversion.
         * @memberof NumberConversion
         */
        constructor(settingKey, packageKey) {
            super(settingKey, packageKey);
            this.dataType = dataTypeEnum_1.DataType.NUMBER;
        }
        /**
         * Checks if the data type is number.
         *
         * @param {Array<any>} data
         * @returns {boolean}
         * @memberof NumberConversion
         */
        checkDataTypes(data) {
            return data.every((item) => { return typeof item === "number"; });
        }
        /**
         * Converts the data from settings to package format via the number constructor.
         *
         * @param {Array<any>} data
         * @returns {Array<IPackage>}
         * @memberof NumberConversion
         */
        convertDataTo(data) {
            return data.map((item) => { return new package_1.Package(new meta_1.Meta(this.dataType), new Number(item).valueOf()); });
        }
        /**
         * Converts the data from package to settings format.
         *
         * @param {Array<any>} data
         * @returns {Array<any>}
         * @memberof NumberConversion
         */
        convertDataFrom(data) {
            return data.map((item) => { return new Number(item).valueOf(); });
        }
    };
    NumberConversion = __decorate([
        mco.role()
    ], NumberConversion);
    exports.NumberConversion = NumberConversion;
});
