var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./seriesType", "../../../common/persistence/settings", "../calculatorProvider/calculationDataInfo", "./settingIds", "./baseSeries"], function (require, exports, seriesType_1, settings_1, calculationDataInfo_1, settingIds_1, baseSeries_1) {
    "use strict";
    var FFTSeries_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FFTSeries = void 0;
    let FFTSeries = FFTSeries_1 = class FFTSeries extends baseSeries_1.BaseSeries {
        /**
         * Creates an instance of FFTSeries
         * @param {ISignal} signal
         * @param {string} name
         * @param {string} color
         * @param {ISeriesProvider} seriesProvider
         * @param {string} [uniqueId=""]
         * @memberof FFTSeries
         */
        constructor(signal, name, color, seriesProvider, uniqueId, errorInfo) {
            super(signal, name, color, seriesProvider, uniqueId, errorInfo);
            this.type = seriesType_1.SeriesType.fftSeries;
            this.rawPoints = this.signal.rawPoints;
            this.updateTimestamps();
            this.getRange();
        }
        /**
         * Creates an instance of FFTSeries with the given settings
         *
         * @static
         * @param {ISettings} settings
         * @param {ISeriesProvider} seriesProvider
         * @returns {FFTSeries}
         * @memberof FFTSeries
         */
        static create(settings, seriesProvider) {
            // get info from persistingdata
            let settingsObj = settings_1.Settings.create(settings);
            let id = settingsObj.getValue(settingIds_1.SettingIds.SeriesId);
            let name = settingsObj.getValue(settingIds_1.SettingIds.SeriesName);
            let color = settingsObj.getValue(settingIds_1.SettingIds.SeriesColor);
            let signalData = settingsObj.getValue(settingIds_1.SettingIds.SeriesSignalData);
            let errorInfo = settingsObj.getValue(settingIds_1.SettingIds.SeriesErrorInfo);
            if (errorInfo == undefined) {
                errorInfo = new Array();
            }
            // create signal with the given signalData
            let signal = this.createSignal(signalData);
            // create series with the given data
            let newYTSeries = new FFTSeries_1(signal, name, color, seriesProvider, id, errorInfo);
            // set calculation informations if available
            let calculationDataInfo = settingsObj.getValue(settingIds_1.SettingIds.SeriesCalculationData);
            if (calculationDataInfo != undefined) {
                newYTSeries.calculationDataInfo = new calculationDataInfo_1.CalculationDataInfo();
                newYTSeries.calculationDataInfo.setSettings(calculationDataInfo);
            }
            return newYTSeries;
        }
        /**
         * Get max X value from a serie
         *
         * @protected
         * @returns {(number | undefined)}
         * @memberof FFTSeries
         */
        getMaxX() {
            if (this.rawPoints.length > 0) {
                return this.rawPoints[this.rawPoints.length - 1].x;
            }
            return undefined;
        }
        /**
         * Get min X value from a serie
         *
         * @protected
         * @returns {(number | undefined)}
         * @memberof FFTSeries
         */
        getMinX() {
            if (this.rawPoints.length > 0) {
                return this.rawPoints[0].x;
            }
            return undefined;
        }
        /**
         * Updates the timestamps baseon the available series
         *
         * @private
         * @memberof FFTSeries
         */
        updateTimestamps() {
            if (this.rawPoints.length > 0) {
                this._timestamps = this.rawPoints.map((rawPoint) => { return rawPoint.x; });
            }
        }
    };
    FFTSeries = FFTSeries_1 = __decorate([
        mco.role()
    ], FFTSeries);
    exports.FFTSeries = FFTSeries;
});
