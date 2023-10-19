var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/math/lineReductionAlgorithm/rdp", "../../../common/math/mathX", "./seriesType", "../../../common/persistence/settings", "../calculatorProvider/calculationDataInfo", "./settingIds", "./baseSeries", "../../../widgets/chartWidget/chartExtensions/chartDataOptimizer"], function (require, exports, rdp_1, mathX_1, seriesType_1, settings_1, calculationDataInfo_1, settingIds_1, baseSeries_1, chartDataOptimizer_1) {
    "use strict";
    var XYSeries_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XYSeries = void 0;
    let XYSeries = XYSeries_1 = class XYSeries extends baseSeries_1.BaseSeries {
        /**
         * Creates an instance of XYSeries
         * @param {ISignal} signal
         * @param {string} name
         * @param {string} color
         * @param {ISeriesProvider} seriesProvider
         * @param {string} [uniqueId=""]
         * @memberof XYSeries
         */
        constructor(signal, name, color, seriesProvider, uniqueId, errorInfo) {
            super(signal, name, color, seriesProvider, uniqueId, errorInfo);
            this.type = seriesType_1.SeriesType.xySeries;
            this.rawPoints = this.signal.rawPoints;
            this.updateTimestamps();
            this.getRange();
            this.simplifySignal(this.rawPoints);
        }
        /**
         * Creates an instance of XYSeries with the given settings
         *
         * @static
         * @param {ISettings} settings
         * @param {ISeriesProvider} seriesProvider
         * @returns {XYSeries}
         * @memberof XYSeries
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
            let newXYSeries = new XYSeries_1(signal, name, color, seriesProvider, id, errorInfo);
            // set calculation informations if available
            let calculationDataInfo = settingsObj.getValue(settingIds_1.SettingIds.SeriesCalculationData);
            if (calculationDataInfo != undefined) {
                newXYSeries.calculationDataInfo = new calculationDataInfo_1.CalculationDataInfo();
                newXYSeries.calculationDataInfo.setSettings(calculationDataInfo);
            }
            return newXYSeries;
        }
        /**
         * Calculates an initial line simplification
         *
         * @param {IPoint[]} seriesPoints
         * @memberof XYSeries
         */
        simplifySignal(seriesPoints) {
            const lineOptimization = new rdp_1.RDP();
            const xValues = seriesPoints.map((point) => { return point.x; });
            let yValues = seriesPoints.map((point) => { return point.y; });
            const xMin = mathX_1.MathX.min(xValues);
            const xMax = mathX_1.MathX.max(xValues);
            const yMin = mathX_1.MathX.min(yValues);
            const yMax = mathX_1.MathX.max(yValues);
            // calculate series ranges
            const xRange = xMax - xMin;
            const yRange = yMax - yMin;
            // calculate unit per pixel ratios
            let xRatio = xRange / 10000;
            let yRatio = yRange / 10000;
            // the units/pixel ratio must not be 0 
            xRatio = xRatio > 0 ? xRatio : Number.MIN_VALUE;
            yRatio = yRatio > 0 ? yRatio : Number.MIN_VALUE;
            // set required simplification precision
            const precision = 1;
            // create chart points from the raw points
            let rawPoints = seriesPoints.map((point, i) => { return new chartDataOptimizer_1.ChartPoint(i, true, point.x, point.y); });
            // calculate the reduced point set
            let reducedSeriesPoints = lineOptimization.simplify(rawPoints, precision, xRatio, yRatio, true);
            // update simplified series view points and reduction ratios
            this.data = reducedSeriesPoints;
            this.data.pixelRatioX = xRatio;
            this.data.pixelRatioY = yRatio;
        }
        /**
         * Get max X value from a serie
         *
         * @protected
         * @returns {(number | undefined)}
         * @memberof XYSeries
         */
        getMaxX() {
            let maxX;
            if (this.rawPoints.length > 0) {
                for (let i = 0; i < this.rawPoints.length; i++) {
                    if (maxX == undefined || this.rawPoints[i].x > maxX) {
                        maxX = this.rawPoints[i].x;
                    }
                }
            }
            return maxX;
        }
        /**
         * Get min X value from a serie
         *
         * @protected
         * @returns {(number | undefined)}
         * @memberof XYSeries
         */
        getMinX() {
            let minX;
            if (this.rawPoints.length > 0) {
                for (let i = 0; i < this.rawPoints.length; i++) {
                    if (minX == undefined || this.rawPoints[i].x < minX) {
                        minX = this.rawPoints[i].x;
                    }
                }
            }
            return minX;
        }
        /**
         * Updates the timestamps baseon the available series
         *
         * @private
         * @memberof XYSeries
         */
        updateTimestamps() {
            if (this.calculationDataInfo != undefined) {
                if (this.calculationDataInfo.inputData.length > 0) {
                    // we use the x values from the input 0 as the timestamps source
                    this._timestamps = this.calculationDataInfo.inputData[0].getData().map((inputDataPoint) => { return inputDataPoint.x; });
                }
            }
        }
        /**
         * Called whenever the seris data has changed
         *
         * @private
         * @param {IPoint[]} data
         * @memberof XYSeries
         */
        onSerieDataChanged(seriesData) {
            if (seriesData && seriesData.length > 0) {
                this.simplifySignal(seriesData);
            }
        }
    };
    XYSeries = XYSeries_1 = __decorate([
        mco.role()
    ], XYSeries);
    exports.XYSeries = XYSeries;
});
