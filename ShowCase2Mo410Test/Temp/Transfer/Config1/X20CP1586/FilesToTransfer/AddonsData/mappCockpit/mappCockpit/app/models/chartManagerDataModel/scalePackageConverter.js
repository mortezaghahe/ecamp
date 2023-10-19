var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/packageConversion/basePackageConverter", "../../common/packageConversion/enum/objectTypeEnum", "../../common/packageConversion/stringConversion", "../../common/packageConversion/booleanConversion", "../../common/packageConversion/numberConversion", "../../common/packageConversion/arrayConversion"], function (require, exports, basePackageConverter_1, objectTypeEnum_1, stringConversion_1, booleanConversion_1, numberConversion_1, arrayConversion_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScalePackageConverter = void 0;
    /**
     * The package converter handling the scale setting
     *
     * @class ScalePackageConverter
     * @extends {BasePackageConverter}
     */
    let ScalePackageConverter = class ScalePackageConverter extends basePackageConverter_1.BasePackageConverter {
        /**
         * Creates an instance of ScalePackageConverter.
         *
         * @memberof ScalePackageConverter
         */
        constructor() {
            super(objectTypeEnum_1.ObjectType.SCALE, "Scale");
            this.conversionInfoContainer.addConversion("1.0", 1, [
                new stringConversion_1.StringConversion(["id", "name"], ["id", "name"]),
                new booleanConversion_1.BooleanConversion(["expandState"], ["expandState"]),
                new numberConversion_1.NumberConversion(["minXValue", "maxXValue", "minYValue", "maxYValue"], ["minXValue", "maxXValue", "minYValue", "maxYValue"]),
                new arrayConversion_1.ArrayConversion(["seriesIds"], ["seriesIds"], new stringConversion_1.StringConversion([], []))
            ]);
        }
    };
    ScalePackageConverter = __decorate([
        mco.role()
    ], ScalePackageConverter);
    exports.ScalePackageConverter = ScalePackageConverter;
});
