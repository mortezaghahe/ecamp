var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/packageConversion/basePackageConverter", "../../common/packageConversion/enum/objectTypeEnum", "../../common/packageConversion/stringConversion", "../../common/packageConversion/booleanConversion", "../../common/packageConversion/subPackageConversion", "../../common/packageConversion/arrayConversion", "../../common/packageConversion/numberStringConversion"], function (require, exports, basePackageConverter_1, objectTypeEnum_1, stringConversion_1, booleanConversion_1, subPackageConversion_1, arrayConversion_1, numberStringConversion_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartPackageConverter = void 0;
    /**
     * The package converter handling the chart setting.
     *
     * @class ChartPackageConverter
     * @extends {BasePackageConverter}
     */
    let ChartPackageConverter = class ChartPackageConverter extends basePackageConverter_1.BasePackageConverter {
        /**
         * Creates an instance of ChartPackageConverter.
         *
         * @memberof ChartPackageConverter
         */
        constructor() {
            super(objectTypeEnum_1.ObjectType.CHART, "Chart");
            // the substitution map to map the chart type enum to human readable values.
            let substitutionMap = new Map();
            substitutionMap.set(0, "yt");
            substitutionMap.set(1, "xy");
            substitutionMap.set(2, "fft");
            this.conversionInfoContainer.addConversion("1.0", 1, [
                new numberStringConversion_1.NumberStringConversion(["type"], ["type"], substitutionMap),
                new stringConversion_1.StringConversion(["name"], ["name"]),
                new booleanConversion_1.BooleanConversion(["expandState"], ["expandState"]),
                new arrayConversion_1.ArrayConversion(["scales"], ["scales"], new subPackageConversion_1.SubPackageConversion([], []))
            ]);
        }
    };
    ChartPackageConverter = __decorate([
        mco.role()
    ], ChartPackageConverter);
    exports.ChartPackageConverter = ChartPackageConverter;
});
