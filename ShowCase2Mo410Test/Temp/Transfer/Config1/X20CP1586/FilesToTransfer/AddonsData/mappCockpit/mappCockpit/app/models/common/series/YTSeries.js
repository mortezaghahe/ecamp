var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../widgets/chartWidget/chartExtensions/chartDataOptimizer", "../../../common/math/mathX", "./seriesType", "../../../common/persistence/settings", "../calculatorProvider/calculationDataInfo", "./settingIds", "./baseSeries"], function (require, exports, chartDataOptimizer_1, mathX_1, seriesType_1, settings_1, calculationDataInfo_1, settingIds_1, baseSeries_1) {
    "use strict";
    var YTSeries_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.YTSeries = void 0;
    let YTSeries = YTSeries_1 = class YTSeries extends baseSeries_1.BaseSeries {
        /**
         * Creates an instance of YTSeries
         * @param {ISignal} signal
         * @param {string} name
         * @param {string} color
         * @param {ISeriesProvider} seriesProvider
         * @param {string} [uniqueId=""]
         * @memberof YTSeries
         */
        constructor(signal, name, color, seriesProvider, uniqueId, errorInfo) {
            super(signal, name, color, seriesProvider, uniqueId, errorInfo);
            this.type = seriesType_1.SeriesType.timeSeries;
            this.rawPoints = this.signal.rawPoints;
            this.updateTimestamps();
            this.getRange();
            this.simplifySignal(this.rawPoints);
        }
        /**
         * Creates an instance of YTSeries with the given settings
         *
         * @static
         * @param {ISettings} settings
         * @param {ISeriesProvider} seriesProvider
         * @returns {YTSeries}
         * @memberof YTSeries
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
            let newYTSeries = new YTSeries_1(signal, name, color, seriesProvider, id, errorInfo);
            // set calculation informations if available
            let calculationDataInfo = settingsObj.getValue(settingIds_1.SettingIds.SeriesCalculationData);
            if (calculationDataInfo != undefined) {
                newYTSeries.calculationDataInfo = new calculationDataInfo_1.CalculationDataInfo();
                newYTSeries.calculationDataInfo.setSettings(calculationDataInfo);
            }
            return newYTSeries;
        }
        /**
         * Simplifies series data points
         *
         * @memberof YTSeries
         */
        simplifySignal(seriesPoints) {
            // retrieve x and y values
            const xValues = seriesPoints.map((point) => { return point.x; });
            let yValues = seriesPoints.map((point) => { return point.y; });
            // get the min max values
            const xMin = mathX_1.MathX.min(xValues);
            const xMax = mathX_1.MathX.max(xValues);
            const yMin = mathX_1.MathX.min(yValues);
            const yMax = mathX_1.MathX.max(yValues);
            // create the simplified points. For yt they are just the min max edge points for initializing the chart area. 
            let reducedSeriesPoints = [];
            reducedSeriesPoints.push(new chartDataOptimizer_1.ChartPoint(0, true, xMin, yMin));
            reducedSeriesPoints.push(new chartDataOptimizer_1.ChartPoint(1, true, xMax, yMax));
            // update simplified series with min/max yt points
            this.data = reducedSeriesPoints;
        }
        /**
         * Get max X value from a serie
         *
         * @protected
         * @returns {(number | undefined)}
         * @memberof YTSeries
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
         * @memberof YTSeries
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
         * @memberof YTSeries
         */
        updateTimestamps() {
            if (this.rawPoints.length > 0) {
                this._timestamps = this.rawPoints.map((rawPoint) => { return rawPoint.x; });
            }
        }
    };
    YTSeries = YTSeries_1 = __decorate([
        mco.role()
    ], YTSeries);
    exports.YTSeries = YTSeries;
});
