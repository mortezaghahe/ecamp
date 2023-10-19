var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../models/chartManagerDataModel/chartManagerChart", "../../models/common/series/seriesType"], function (require, exports, chartManagerChart_1, seriesType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SerieChartTypeHelper = void 0;
    let SerieChartTypeHelper = class SerieChartTypeHelper {
        static getSerieChartType(type) {
            if (type == seriesType_1.SeriesType.timeSeries) {
                return chartManagerChart_1.ChartType.YTChart;
            }
            else if (type == seriesType_1.SeriesType.xySeries) {
                return chartManagerChart_1.ChartType.XYChart;
            }
            else {
                return chartManagerChart_1.ChartType.FFTChart;
            }
        }
        static setDropPossibleAreas(chart, series, serieChartType, sameGroup) {
            if (!chart.hasSeries(series) && chart.canSeriesBeDropped(series, serieChartType, sameGroup)) {
                chart.childs.forEach(yAxis => {
                    yAxis.dropPossible = true;
                });
                //Not possible to drop serie in chart name if is XY chart
                if (chart.canAddYAxis() && chart.chartType != chartManagerChart_1.ChartType.XYChart) {
                    chart.dropPossible = true;
                }
            }
        }
        /**
         * Return series that will be added
         *
         * @param {Array<BaseSeries>} seriesInChart
         * @param {Array<BaseSeries>} droppedSeries
         * @returns {Array<BaseSeries>}
         * @memberof ChartManagerWidget
         */
        static getDroppableSeries(seriesInChart, droppedSeries) {
            for (let i = 0; i < seriesInChart.length; i++) {
                for (let j = 0; j < droppedSeries.length; j++) {
                    if (seriesInChart[i] == droppedSeries[j]) {
                        droppedSeries.splice(j, 1);
                        break;
                    }
                    //Check calculated input data for FFT charts if YT signals are dragged
                    if (seriesInChart[i].type == seriesType_1.SeriesType.fftSeries && droppedSeries[j].type == seriesType_1.SeriesType.timeSeries) {
                        let inputSerieId = undefined;
                        let calculationDataInfo = seriesInChart[i].calculationDataInfo;
                        if (calculationDataInfo != undefined) {
                            inputSerieId = calculationDataInfo.inputSeriesIds[0];
                        }
                        if (inputSerieId == droppedSeries[j].id) {
                            droppedSeries.splice(j, 1);
                            break;
                        }
                    }
                }
            }
            return droppedSeries;
        }
    };
    SerieChartTypeHelper = __decorate([
        mco.role()
    ], SerieChartTypeHelper);
    exports.SerieChartTypeHelper = SerieChartTypeHelper;
});
