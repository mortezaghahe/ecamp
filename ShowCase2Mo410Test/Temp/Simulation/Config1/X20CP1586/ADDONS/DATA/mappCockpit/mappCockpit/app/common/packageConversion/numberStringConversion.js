var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./anyConversion", "./enum/dataTypeEnum", "./package", "./meta"], function (require, exports, anyConversion_1, dataTypeEnum_1, package_1, meta_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberStringConversion = void 0;
    /**
     * This conversion handles the translation of a number in settings format to a string in package format.
     * This is used to provide readable text instead of number enums in the package format.
     *
     * @class NumberStringConversion
     * @extends {AnyConversion}
     */
    let NumberStringConversion = class NumberStringConversion extends anyConversion_1.AnyConversion {
        /**
         * Creates an instance of NumberStringConversion.
         *
         * @param {Array<string>} settingKey The keys to be addressed in the settings data by this conversion.
         * @param {Array<string>} packageKey The keys to be addressed in the package data by this conversion.
         * @param {Map<number, string>} substitutionMap The map used for matching the numbers to their replacement texts and vice versa.
         * @memberof NumberStringConversion
         */
        constructor(settingKey, packageKey, substitutionMap) {
            super(settingKey, packageKey);
            this.dataType = dataTypeEnum_1.DataType.STRING;
            this.substitutionMap = substitutionMap;
        }
        /**
         * Checks if the dataType contained in the IMeta data is correct for this conversion.
         *
         * @param {Array<IMeta>} meta
         * @returns {boolean}
         * @memberof NumberStringConversion
         */
        checkMetaDataType(meta) {
            return meta.every((meta) => {
                return !meta_1.Meta.isInvalid(meta) && (meta.dataType === this.dataType || meta.dataType === "number");
            }); // or equals number is for backwards compatibility of scale package
        }
        /**
         * Checks if the data type of the data is string.
         *
         * @param {Array<any>} data
         * @returns {boolean}
         * @memberof NumberStringConversion
         */
        checkDataTypes(data) {
            return data.every((item) => { return typeof item === "string"; });
        }
        /**
         * Converts the data from package to settings format using the provided map.
         *
         * @param {Array<any>} data
         * @returns {Array<any>}
         * @memberof NumberStringConversion
         */
        convertDataFrom(data) {
            return data.map((item) => { return this.substituteFrom(item); });
        }
        /**
         * Converts the data from settings to package format using the provided map.
         *
         * @param {Array<any>} data
         * @returns {Array<IPackage>}
         * @memberof NumberStringConversion
         */
        convertDataTo(data) {
            return data.map((item) => {
                return new package_1.Package(new meta_1.Meta(this.dataType), this.substituteTo(item));
            });
        }
        /**
         * Maps the number to a string using the provided map.
         *
         * @private
         * @param {number} data
         * @returns {string}
         * @memberof NumberStringConversion
         */
        substituteTo(data) {
            let substitute = this.substitutionMap.get(data);
            if (substitute !== undefined) {
                return substitute;
            }
            throw new Error("No text to substitute this number available");
        }
        /**
         * Maps the string to a number using the provided map.
         *
         * @private
         * @param {string} data
         * @returns {number}
         * @memberof NumberStringConversion
         */
        substituteFrom(data) {
            let substitute = undefined;
            this.substitutionMap.forEach((val, key) => {
                if (data === val && substitute === undefined) {
                    substitute = key;
                }
            });
            if (substitute !== undefined) {
                return substitute;
            }
            throw new Error("No number for this text available");
        }
    };
    NumberStringConversion = __decorate([
        mco.role()
    ], NumberStringConversion);
    exports.NumberStringConversion = NumberStringConversion;
});
