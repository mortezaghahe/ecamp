var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../models/chartManagerDataModel/chartManagerChart"], function (require, exports, chartManagerChart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartRangeHelper = exports.SF_axisResolution = void 0;
    //smalles resolution that SF can display on an axis
    exports.SF_axisResolution = 1e-12;
    let ChartRangeHelper = class ChartRangeHelper {
        /**
         *  Set all X-Axis ranges to the smallest range possbile without hiding data
         *
         * @param {ITraceChart[]} traceChartList
         * @memberof ChartRangeHelper
         */
        resetXRangesAllChartTypes(traceChartList) {
            this.resetXRangesYT(traceChartList);
            this.resetXRangesXY(traceChartList);
            this.resetXRangesFFT(traceChartList);
        }
        /**
         * Set all Y-Axis ranges to the smallest range possbile without hiding data
         *
         * @param {ITraceChart[]} traceChartList
         * @memberof ChartRangeHelper
         */
        resetYRangesAllChartTypes(traceChartList) {
            for (let chart of traceChartList) {
                for (let yAxis of chart.getYScales()) {
                    let axisMinValue = chart.getSeriesMinYForScale(yAxis);
                    let axisMaxValue = chart.getSeriesMaxYForScale(yAxis);
                    if (axisMinValue != undefined && axisMaxValue != undefined) {
                        chart.updateRangeY(yAxis, axisMinValue, axisMaxValue);
                    }
                }
            }
        }
        /**
         *Set the X-Axis ranges of all YT-Charts to the smallest range possbile without hiding data
         *
         * @param {ITraceChart[]} traceChartList
         * @memberof ChartRangeHelper
         */
        resetXRangesYT(traceChartList) {
            let ytChartList = this.getYTCharts(traceChartList);
            let minX = this.getTotalMinX(ytChartList);
            let maxX = this.getTotalMaxX(ytChartList);
            for (let ytChart of ytChartList) {
                if (minX != undefined && maxX != undefined) {
                    ytChart.updateChartRangeX(minX, maxX);
                }
            }
        }
        /**
         *Set the X-Axis ranges of all XY-Charts to the smallest range possbile without hiding data
         *
         * @param {ITraceChart[]} traceChartList
         * @memberof ChartRangeHelper
         */
        resetXRangesXY(traceChartList) {
            let xyChartList = this.getXYCharts(traceChartList);
            for (let xyChart of xyChartList) {
                let minX = this.getTotalMinX([xyChart]);
                let maxX = this.getTotalMaxX([xyChart]);
                if (minX != undefined && maxX != undefined) {
                    xyChart.updateChartRangeX(minX, maxX);
                }
            }
        }
        /**
         *Set the X-Axis ranges of all FFT-Charts to the smallest range possbile without hiding data
         *
         * @param {ITraceChart[]} traceChartList
         * @memberof ChartRangeHelper
         */
        resetXRangesFFT(traceChartList) {
            let fftChartList = this.getFFTCharts(traceChartList);
            let minX = this.getTotalMinX(fftChartList);
            let maxX = this.getTotalMaxX(fftChartList);
            for (let fftChart of fftChartList) {
                if (minX != undefined && maxX != undefined) {
                    fftChart.updateChartRangeX(minX, maxX);
                }
            }
        }
        /**
         * return axis display offset
         *
         * @param {number} axisRange
         * @param {number} axisPixelRange
         * @returns {number}
         * @memberof ChartRangeHelper
         */
        getAxisOffset(axisRange, axisPixelRange) {
            let clcOffset = 0;
            clcOffset = (axisRange / axisPixelRange) * 10;
            let minOffset = exports.SF_axisResolution; // compansate for smallest resolution of syncfution axis
            return Math.max(clcOffset, minOffset);
        }
        /**
         * return axis display offset if the only signal inside the chart is a line
         *
         * @param {number} lineValue
         * @returns {number}
         * @memberof ChartRangeHelper
         */
        getAxisOffsetForStraightLines(lineValue) {
            let clcOffset = Math.abs(lineValue) * 0.1;
            let minOffset = exports.SF_axisResolution; // compansate for smallest resolution of syncfution axis
            return Math.max(clcOffset, minOffset);
        }
        /**
        * Get the minimum x-Value from the given Charts
        *
        * @param {*} traceChartList
        * @returns {(number|undefined)}
        * @memberof YTChart
        */
        getTotalMinX(traceChartList) {
            let minX = undefined;
            //put all series in one array
            let allSeries = new Array();
            for (let chart of traceChartList) {
                for (let series of chart.series) {
                    allSeries.push(series);
                }
            }
            //loop through all series and calculate the minimum X-Value
            for (let series of allSeries) {
                if (series.minX != undefined && (minX == undefined || series.minX < minX)) {
                    minX = series.minX;
                }
            }
            return minX;
        }
        /**
         * Get the maximum x-Value from the given Charts
         *
         * @param {*} traceChartList
         * @returns {(number|undefined)}
         * @memberof YTChart
         */
        getTotalMaxX(traceChartList) {
            let maxX = undefined;
            //put all series in one array
            let allSeries = new Array();
            for (let chart of traceChartList) {
                for (let series of chart.series) {
                    allSeries.push(series);
                }
            }
            //loop through all series and calculate the maximum X-Value
            for (let series of allSeries)
                if (series.maxX != undefined && (maxX == undefined || series.maxX > maxX)) {
                    maxX = series.maxX;
                }
            return maxX;
        }
        /**
         * Return all Charts in an ChartArray that are from Type YTChart
         *
         * @param {ITraceChart[]} traceChartList
         * @returns {ITraceChart[]}
         * @memberof ChartRangeHelper
         */
        getYTCharts(traceChartList) {
            let ytCharts = [];
            for (let chart of traceChartList) {
                if (chart.type == chartManagerChart_1.ChartType.YTChart) {
                    ytCharts.push(chart);
                }
            }
            return ytCharts;
        }
        /**
         * Return all Charts in an ChartArray that are from Type YTChart
         *
         * @param {ITraceChart[]} traceChartList
         * @returns {ITraceChart[]}
         * @memberof ChartRangeHelper
         */
        getFFTCharts(traceChartList) {
            let fftCharts = [];
            for (let chart of traceChartList) {
                if (chart.type == chartManagerChart_1.ChartType.FFTChart) {
                    fftCharts.push(chart);
                }
            }
            return fftCharts;
        }
        /**
         * Return all Charts in an ChartArray that are from Type XYChart
         *
         * @param {ITraceChart[]} traceChartList
         * @returns {ITraceChart[]}
         * @memberof ChartRangeHelper
         */
        getXYCharts(traceChartList) {
            let xyCharts = [];
            for (let chart of traceChartList) {
                if (chart.type == chartManagerChart_1.ChartType.XYChart) {
                    xyCharts.push(chart);
                }
            }
            return xyCharts;
        }
    };
    ChartRangeHelper = __decorate([
        mco.role()
    ], ChartRangeHelper);
    exports.ChartRangeHelper = ChartRangeHelper;
});
