var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../models/chartManagerDataModel/chartManagerChart", "./BasicChart", "./cursor/CursorHandler"], function (require, exports, chartManagerChart_1, BasicChart_1, CursorHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.YTChart = void 0;
    let YTChart = class YTChart extends BasicChart_1.BasicChart {
        constructor(parentView, name, type, scale) {
            super(parentView, name, scale);
            this.primaryXAxisName = "PrimaryTimeAxis";
            this.primaryYAxisName = "Scale_1";
            this.cursorHandler = undefined;
            this.widgetName = name;
            this.type = type;
            this.addWidgetToView(parentView);
        }
        initializeCursorHandlers() {
            if (this.cursorHandler == undefined) {
                this.cursorHandler = new CursorHandler_1.CursorHandler(this.mainDiv, this.chart.getChartArea());
                this.cursorHandler.enableCrosshairCursor = true;
                this.cursorHandler.enableLineCursor = true;
            }
        }
        /**
         * Get min x value from all series in the chart
         *
         * @param {*} traceChartList
         * @returns {(number|undefined)}
         * @memberof YTChart
         */
        getTotalMinX(traceChartList) {
            let minX = undefined;
            for (let i = 0; i < traceChartList.length; i++) {
                let chart = traceChartList[i];
                for (let j = 0; j < chart.series.length; j++) {
                    if (chart.series[j] !== undefined && chart.type == chartManagerChart_1.ChartType.YTChart) {
                        if (minX == undefined || chart.series[j].minX < minX) {
                            minX = chart.series[j].minX;
                        }
                    }
                }
            }
            return minX;
        }
        /**
         * Get max x value from all series in the chart
         *
         * @param {*} traceChartList
         * @returns {(number|undefined)}
         * @memberof YTChart
         */
        getTotalMaxX(traceChartList) {
            let maxX = undefined;
            for (let i = 0; i < traceChartList.length; i++) {
                let chart = traceChartList[i];
                for (let j = 0; j < chart.series.length; j++) {
                    if (chart.series[j] !== undefined && chart.type == chartManagerChart_1.ChartType.YTChart) {
                        if (maxX == undefined || chart.series[j].maxX > maxX) {
                            maxX = chart.series[j].maxX;
                        }
                    }
                }
            }
            return maxX;
        }
        /**
         * Get used cursor states
         *
         * @protected
         * @returns {Array<ICursorState>}
         * @memberof YTChart
         */
        getUsedCursorStates() {
            return this.cursorsStates.getTimeStates();
        }
    };
    YTChart = __decorate([
        mco.role()
    ], YTChart);
    exports.YTChart = YTChart;
});
