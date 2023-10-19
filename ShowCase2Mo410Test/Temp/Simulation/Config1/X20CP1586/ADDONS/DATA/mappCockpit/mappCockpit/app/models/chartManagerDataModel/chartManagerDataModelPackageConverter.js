var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/packageConversion/basePackageConverter", "../../common/packageConversion/enum/objectTypeEnum", "../../common/packageConversion/subPackageConversion", "../../common/packageConversion/arrayConversion"], function (require, exports, basePackageConverter_1, objectTypeEnum_1, subPackageConversion_1, arrayConversion_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartManagerDataModelPackageConverter = void 0;
    /**
     * The package converter handling the chart manager data model setting.
     *
     * @class ChartManagerDataModelPackageConverter
     * @extends {BasePackageConverter}
     */
    let ChartManagerDataModelPackageConverter = class ChartManagerDataModelPackageConverter extends basePackageConverter_1.BasePackageConverter {
        /**
         * Creates an instance of ChartManagerDataModelPackageConverter.
         *
         * @memberof ChartManagerDataModelPackageConverter
         */
        constructor() {
            super(objectTypeEnum_1.ObjectType.CHARTMANAGERDATAMODEL, "ChartManagerDataModel");
            this.conversionInfoContainer.addConversion("1.0", 1, [
                new arrayConversion_1.ArrayConversion(["dataModel"], ["dataModel"], new subPackageConversion_1.SubPackageConversion([], []))
            ]);
        }
    };
    ChartManagerDataModelPackageConverter = __decorate([
        mco.role()
    ], ChartManagerDataModelPackageConverter);
    exports.ChartManagerDataModelPackageConverter = ChartManagerDataModelPackageConverter;
});
