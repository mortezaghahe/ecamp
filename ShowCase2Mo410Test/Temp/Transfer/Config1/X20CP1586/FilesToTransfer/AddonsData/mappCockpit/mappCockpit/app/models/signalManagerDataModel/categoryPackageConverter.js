var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/packageConversion/basePackageConverter", "../../common/packageConversion/enum/objectTypeEnum", "../../common/packageConversion/stringConversion", "../../common/packageConversion/arrayConversion", "../../common/packageConversion/subPackageConversion"], function (require, exports, basePackageConverter_1, objectTypeEnum_1, stringConversion_1, arrayConversion_1, subPackageConversion_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CategoryPackageConverter = void 0;
    /**
     * The package converter handling the category setting.
     *
     * @class CategoryPackageConverter
     * @extends {BasePackageConverter}
     */
    let CategoryPackageConverter = class CategoryPackageConverter extends basePackageConverter_1.BasePackageConverter {
        /**
         * Creates an instance of CategoryPackageConverter.
         *
         * @memberof CategoryPackageConverter
         */
        constructor() {
            super(objectTypeEnum_1.ObjectType.CATEGORY, "category");
            this.conversionInfoContainer.addConversion("1.0", 1, [
                new stringConversion_1.StringConversion(["id"], ["id"]),
                new arrayConversion_1.ArrayConversion(["serieGroups"], ["serieGroups"], new subPackageConversion_1.SubPackageConversion([], []))
            ]);
        }
    };
    CategoryPackageConverter = __decorate([
        mco.role()
    ], CategoryPackageConverter);
    exports.CategoryPackageConverter = CategoryPackageConverter;
});
