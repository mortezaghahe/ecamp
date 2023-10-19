var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/packageConversion/basePackageConverter", "../../common/packageConversion/enum/objectTypeEnum", "../../common/packageConversion/numberConversion", "../../common/packageConversion/stringConversion", "../../common/packageConversion/arrayConversion", "../../common/packageConversion/optionalConversion"], function (require, exports, basePackageConverter_1, objectTypeEnum_1, numberConversion_1, stringConversion_1, arrayConversion_1, optionalConversion_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SerieGroupPackageConverter = void 0;
    /**
     * The package converter handling the series group setting.
     *
     * @class SerieGroupPackageConverter
     * @extends {BasePackageConverter}
     */
    let SerieGroupPackageConverter = class SerieGroupPackageConverter extends basePackageConverter_1.BasePackageConverter {
        /**
         * Creates an instance of SerieGroupPackageConverter.
         *
         * @memberof SerieGroupPackageConverter
         */
        constructor() {
            super(objectTypeEnum_1.ObjectType.SERIEGROUP, "SerieGroup");
            this.conversionInfoContainer.addConversion("1.0", 1, [
                new optionalConversion_1.OptionalConversion(["containerName"], ["containerName"], new stringConversion_1.StringConversion([], [])),
                new numberConversion_1.NumberConversion(["startTriggerTime"], ["startTriggerTime"]),
                new arrayConversion_1.ArrayConversion(["seriesIds"], ["seriesIds"], new stringConversion_1.StringConversion([], []))
            ]);
        }
    };
    SerieGroupPackageConverter = __decorate([
        mco.role()
    ], SerieGroupPackageConverter);
    exports.SerieGroupPackageConverter = SerieGroupPackageConverter;
});
