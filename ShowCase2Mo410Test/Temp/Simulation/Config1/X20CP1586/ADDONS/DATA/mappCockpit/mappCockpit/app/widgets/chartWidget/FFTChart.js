var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../models/chartManagerDataModel/chartManagerChart", "./BasicChart", "./cursor/CursorHandler", "../common/states/cursorType"], function (require, exports, chartManagerChart_1, BasicChart_1, CursorHandler_1, cursorType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FFTChart = void 0;
    let FFTChart = class FFTChart extends BasicChart_1.BasicChart {
        constructor(parentView, name, type, scales) {
            super(parentView, name, scales);
            this.primaryXAxisName = "PrimaryFrequencyAxis";
            this.primaryYAxisName = "Scale_1";
            this.widgetName = name;
            this.type = type;
            this.addWidgetToView(parentView);
        }
        initializeCursorHandlers() {
            if (this.cursorHandler == undefined) {
                this.cursorHandler = new CursorHandler_1.CursorHandler(this.mainDiv, this.chart.getChartArea());
                this.cursorHandler.enableLineCursor = true;
                this.cursorHandler.enableCrosshairCursor = true;
            }
        }
        /**
         * Internal method for actually moving the cursors. Pass the x and y
         * position on the property and this method will figure out where to
         * place the cursors and update the states accordingly
         *
         * @protected
         * @param {number} x
         * @param {number} y
         * @returns
         * @memberof ChartBase
         */
        setCursor(x, y) {
            if (!this.series.length) {
                return;
            }
            this.cursorsStates.setLastCursorTypeSelected(cursorType_1.CursorType.frequencyDomain);
            let hoveredCursorIndex = this.cursorsStates.getHoveredCursorIndex();
            if (hoveredCursorIndex > -1) { // Set selected cursor when hovered cursor was found
                this.cursorsStates.setSelected(hoveredCursorIndex, true);
            }
            else {
                this.cursorsStates.setSelected(this.cursorsStates.getSelectedCursorIndex(), true);
            }
            this.updateSelectedCursor(x, y);
        }
        /**
         * Get min x value from all series in the chart
         *
         * @param {*} traceChartList
         * @returns {(number|undefined)}
         * @memberof FFTChart
         */
        getTotalMinX(traceChartList) {
            let minX = undefined;
            for (let i = 0; i < traceChartList.length; i++) {
                let chart = traceChartList[i];
                for (let j = 0; j < chart.series.length; j++) {
                    if (chart.series[j] !== undefined && chart.type == chartManagerChart_1.ChartType.FFTChart) {
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
         * @memberof FFTChart
         */
        getTotalMaxX(traceChartList) {
            let maxX = undefined;
            for (let i = 0; i < traceChartList.length; i++) {
                let chart = traceChartList[i];
                for (let j = 0; j < chart.series.length; j++) {
                    if (chart.series[j] !== undefined && chart.type == chartManagerChart_1.ChartType.FFTChart) {
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
         * @memberof FFTChart
         */
        getUsedCursorStates() {
            return this.cursorsStates.getFrequencyStates();
        }
    };
    FFTChart = __decorate([
        mco.role()
    ], FFTChart);
    exports.FFTChart = FFTChart;
});
