var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./anyConversion", "./enum/dataTypeEnum", "./meta", "./package"], function (require, exports, anyConversion_1, dataTypeEnum_1, meta_1, package_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BooleanConversion = void 0;
    /**
     * The conversion handling booleans.
     *
     * @class BooleanConversion
     * @extends {AnyConversion}
     */
    let BooleanConversion = class BooleanConversion extends anyConversion_1.AnyConversion {
        /**
         * Creates an instance of BooleanConversion.
         *
         * @param {Array<string>} settingKey The keys to be addressed in the settings data by this conversion.
         * @param {Array<string>} packageKey The keys to be addressed in the package data by this conversion.
         * @memberof BooleanConversion
         */
        constructor(settingKey, packageKey) {
            super(settingKey, packageKey);
            this.dataType = dataTypeEnum_1.DataType.BOOLEAN;
        }
        /**
         * Checks if the data type of the data is boolean.
         *
         * @param {Array<any>} data
         * @returns {boolean}
         * @memberof BooleanConversion
         */
        checkDataTypes(data) {
            return data.every((item) => { return typeof item === "boolean"; });
        }
        /**
         * Converts the data from settings to package format via the boolean constructor.
         *
         * @param {Array<any>} data
         * @returns {Array<IPackage>}
         * @memberof BooleanConversion
         */
        convertDataTo(data) {
            return data.map((item) => { return new package_1.Package(new meta_1.Meta(this.dataType), new Boolean(item).valueOf()); });
        }
        /**
         * Converts the data from package to settings format.
         *
         * @param {Array<any>} data
         * @returns {Array<any>}
         * @memberof BooleanConversion
         */
        convertDataFrom(data) {
            return data.map((item) => { return new Boolean(item).valueOf(); });
        }
    };
    BooleanConversion = __decorate([
        mco.role()
    ], BooleanConversion);
    exports.BooleanConversion = BooleanConversion;
});
