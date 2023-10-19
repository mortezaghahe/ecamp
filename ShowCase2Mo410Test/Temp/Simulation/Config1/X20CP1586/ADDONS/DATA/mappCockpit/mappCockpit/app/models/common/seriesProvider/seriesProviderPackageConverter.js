var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/packageConversion/basePackageConverter", "../../../common/packageConversion/enum/objectTypeEnum", "../../../common/packageConversion/arrayConversion", "../../../common/packageConversion/subPackageConversion", "../../../common/packageConversion/generateFromConversion", "./seriesProvider", "../../../common/packageConversion/packageConversionController", "../../../common/packageConversion/package"], function (require, exports, basePackageConverter_1, objectTypeEnum_1, arrayConversion_1, subPackageConversion_1, generateFromConversion_1, seriesProvider_1, packageConversionController_1, package_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesProviderPackageConverter = void 0;
    /**
     * The package converter handling the series provider setting.
     *
     * @class SeriesProviderPackageConverter
     * @extends {BasePackageConverter}
     */
    let SeriesProviderPackageConverter = class SeriesProviderPackageConverter extends basePackageConverter_1.BasePackageConverter {
        /**
         * Creates an instance of SeriesProviderPackageConverter.
         *
         * @memberof SeriesProviderPackageConverter
         */
        constructor() {
            super(objectTypeEnum_1.ObjectType.SERIESPROVIDER, "SeriesProvider");
            this.conversionInfoContainer.addConversion("1.0", 1, [
                new arrayConversion_1.ArrayConversion(["series"], ["series"], new subPackageConversion_1.SubPackageConversion([], [])),
                new generateFromConversion_1.GenerateFromConversion(["seriesIds"], ["series"], this.generateSeriesIds)
            ]);
        }
        /**
         * Function for generating seriesIds out of the serie packages identified by given package link ids.
         *
         * @private
         * @param {Array<any>} data
         * @returns {Array<any>}
         * @memberof SeriesProviderPackageConverter
         */
        generateSeriesIds(data) {
            //get instance of package conversion controller
            let controller = packageConversionController_1.PackageConversionController.getInstance();
            let newData = data.map((linkIds) => {
                //get packages identified by link ids
                let packageArray = linkIds.map((linkId) => { return controller.getPackageById(linkId); });
                //remove invalid packages
                packageArray = packageArray.filter((packet) => { return !package_1.Package.isInvalid(packet); });
                //get ids of series
                let idArray = packageArray.map((packet) => {
                    let id = package_1.Package.getPackageKeyData(packet, "id");
                    return (id !== undefined) ? id : "";
                });
                //remove invalid ids
                idArray = idArray.filter((id) => { return id !== ""; });
                //get series provider key
                let seriesProviderComponentID = "SeriesProvider";
                //generate series ids of series
                let seriesIdArray = idArray.map((id) => { return seriesProvider_1.SeriesProvider.getSeriesPersistingIdForComponent(id, seriesProviderComponentID); });
                return seriesIdArray;
            });
            return newData;
        }
    };
    SeriesProviderPackageConverter = __decorate([
        mco.role()
    ], SeriesProviderPackageConverter);
    exports.SeriesProviderPackageConverter = SeriesProviderPackageConverter;
});
