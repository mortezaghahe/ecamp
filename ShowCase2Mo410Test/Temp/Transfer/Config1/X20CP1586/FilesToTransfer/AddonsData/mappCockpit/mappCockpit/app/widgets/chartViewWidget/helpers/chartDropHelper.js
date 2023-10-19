var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../chartWidget/ChartBase", "../../../models/chartManagerDataModel/chartManagerChart", "../../common/SerieChartTypeHelper"], function (require, exports, ChartBase_1, chartManagerChart_1, SerieChartTypeHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartDropHelper = exports.ChartDropHelperChangedHint = void 0;
    var ChartDropHelperChangedHint;
    (function (ChartDropHelperChangedHint) {
        ChartDropHelperChangedHint[ChartDropHelperChangedHint["createChart"] = 0] = "createChart";
        ChartDropHelperChangedHint[ChartDropHelperChangedHint["addSerie"] = 1] = "addSerie";
        ChartDropHelperChangedHint[ChartDropHelperChangedHint["createXYSerie"] = 2] = "createXYSerie";
        ChartDropHelperChangedHint[ChartDropHelperChangedHint["createFFTSerie"] = 3] = "createFFTSerie";
    })(ChartDropHelperChangedHint = exports.ChartDropHelperChangedHint || (exports.ChartDropHelperChangedHint = {}));
    let ChartDropHelper = class ChartDropHelper {
        constructor(chartManagerDataModel, chartView) {
            this.chartManagerDataModel = chartManagerDataModel;
            this.chartViewWidget = chartView;
        }
        /**
         * Returns true if a chart can be added
         *
         * @returns {boolean}
         * @memberof ChartDropHelper
         */
        canAddChart() {
            if (this.chartManagerDataModel != undefined) {
                if (this.chartManagerDataModel.canAddChart() == true) {
                    return true;
                }
            }
            return false;
        }
        /**
         * add the dropped serie to the correct place
         *
         * @param {*} currentTarget
         * @param {(ITraceChart | undefined)} targetChart
         * @param {Array<BaseSeries>} series
         * @param {(ChartViewLayoutManager | undefined)} layoutManager
         * @memberof ChartDropHelper
         */
        addSeries(currentTarget, targetChart, series, layoutManager) {
            let serieChartType = SerieChartTypeHelper_1.SerieChartTypeHelper.getSerieChartType(series[0].type);
            let chartViewChartSplitterLastPaneId = layoutManager.chartSplitter.getLastPaneId();
            let areaXY = document.getElementById(chartViewChartSplitterLastPaneId + "_XY");
            let areaYT = document.getElementById(chartViewChartSplitterLastPaneId + "_YT");
            if (targetChart && serieChartType == targetChart.type) {
                this.addSeriesToExistingChart(targetChart, series);
            }
            else if (targetChart && serieChartType != targetChart.type) {
                this.addYTSeriesToDifferentChart(targetChart, series);
            }
            else if (currentTarget == areaXY || currentTarget.parentElement == areaXY) {
                this.createNewChart(chartManagerChart_1.ChartType.XYChart, series);
            }
            else if (currentTarget == areaYT || currentTarget.parentElement == areaYT) {
                this.createNewChart(chartManagerChart_1.ChartType.YTChart, series);
            }
            else {
                this.createNewChart(chartManagerChart_1.ChartType.FFTChart, series);
            }
        }
        /**
         * add the dropped serie to an existing chart
         *
         * @private
         * @param {ITraceChart} targetChart
         * @memberof ChartDropHelper
         */
        addSeriesToExistingChart(targetChart, series) {
            // get chart/axis information
            let data = {
                targetChart: targetChart,
                chart: this.chartManagerDataModel.getChart(targetChart.widgetName),
                series: series
            };
            //raise event to traceViewWidget
            this.chartViewWidget.eventDropHelper.raise(this.chartManagerDataModel, { hint: ChartDropHelperChangedHint.addSerie, data: data });
        }
        addYTSeriesToDifferentChart(targetChart, series) {
            // get chart/axis information
            let data = {
                targetChart: targetChart,
                chart: this.chartManagerDataModel.getChart(targetChart.widgetName),
                series: series
            };
            //raise event to traceViewWidget
            if (targetChart.type == chartManagerChart_1.ChartType.XYChart) {
                this.chartViewWidget.eventDropHelper.raise(this.chartManagerDataModel, { hint: ChartDropHelperChangedHint.createXYSerie, data: data });
            }
            else if (targetChart.type == chartManagerChart_1.ChartType.FFTChart) {
                this.chartViewWidget.eventDropHelper.raise(this.chartManagerDataModel, { hint: ChartDropHelperChangedHint.createFFTSerie, data: data });
            }
        }
        /**
         * create a new chart where serie will be dropped
         *
         * @private
         * @param {ChartType} newChartType
         * @param {Array<BaseSeries>} series
         * @memberof ChartDropHelper
         */
        createNewChart(newChartType, series) {
            let data = {
                type: newChartType,
                series: series
            };
            //raise event to traceViewWidget
            this.chartViewWidget.eventDropHelper.raise(this.chartManagerDataModel, { hint: ChartDropHelperChangedHint.createChart, data: data });
        }
        /**
         * Return a DropLocationType for the current drop position or DropLocationType.invalid if drop not possible
         *
         * @param {ChartBase} chart
         * @param {Array<BaseSeries>} series
         * @returns {DropLocationType}
         * @memberof ChartDropHelper
         */
        getDropLocationType(currentTarget, chart, series) {
            if (this.chartManagerDataModel != undefined) {
                let chartManagerChart = this.chartManagerDataModel.getChart(chart.widgetName);
                if (chartManagerChart != undefined) {
                    if (chartManagerChart.dropPossible || chartManagerChart.childs[0].dropPossible) {
                        return chart.getDropLocationType(currentTarget);
                    }
                }
            }
            return ChartBase_1.DropLocationType.invalid;
        }
    };
    ChartDropHelper = __decorate([
        mco.role()
    ], ChartDropHelper);
    exports.ChartDropHelper = ChartDropHelper;
});
