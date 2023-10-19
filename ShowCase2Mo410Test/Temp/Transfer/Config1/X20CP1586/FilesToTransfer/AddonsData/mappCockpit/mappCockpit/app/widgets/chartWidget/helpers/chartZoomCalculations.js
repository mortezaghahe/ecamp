var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../core/interfaces/components/ui/chart/chartInterface", "../chartWrapper/SFChartAxis"], function (require, exports, chartInterface_1, SFChartAxis_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartZoomCalculations = void 0;
    let ChartZoomCalculations = class ChartZoomCalculations {
        /**
         * Returns an numberarray with the min and the max range value
         *
         * @param {ITraceChart} traceChart
         * @param {IChartAxis} chartAxis
         * @param {number} zoomStep
         * @param {*} mouseX
         * @param {*} mouseY
         * @returns {number[]}
         * @memberof ChartZoomCalculations
         */
        calculateAxisZoomRanges(traceChart, chartAxis, zoomStep, mouseX, mouseY) {
            let axisRange = chartAxis.getAxisRange();
            let currentAxisMin = axisRange.min;
            let currentAxisMax = axisRange.max;
            try {
                let axisMin = Big(currentAxisMin);
                let axisMax = Big(currentAxisMax);
                let axisRange = axisMax.minus(axisMin);
                let chartCoordinate = traceChart.getChartCoordinateFromPixel(traceChart.primaryXAxisName, chartAxis.getAxisID(), mouseX, mouseY);
                let axisValue;
                if (chartAxis.getAxisOrientation() == chartInterface_1.AxisOrientation.horizontal) {
                    axisValue = Big(chartCoordinate.x);
                }
                else {
                    axisValue = Big(chartCoordinate.y);
                }
                if (axisValue != undefined && Number(axisRange.toString()) != 0) { // Avoid division by zero
                    let axisValuePercentage = (axisValue.minus(axisMin)).div(axisRange);
                    let newAxisRange = axisRange.times(zoomStep);
                    let newAxisMin = Big(axisValue.minus(newAxisRange.times(axisValuePercentage)));
                    let newAxisMax = newAxisMin.plus(newAxisRange);
                    let minString = newAxisMin.toString();
                    let maxString = newAxisMax.toString();
                    let newAxisMinNumber = Number(minString);
                    let newAxisMaxNumber = Number(maxString);
                    // Use max values if new calculated values are infinity
                    newAxisMinNumber = SFChartAxis_1.SFChartAxis.changeInfinityToMaxValue(newAxisMinNumber);
                    newAxisMaxNumber = SFChartAxis_1.SFChartAxis.changeInfinityToMaxValue(newAxisMaxNumber);
                    return [newAxisMinNumber, newAxisMaxNumber];
                }
            }
            catch (e) {
                // Error occured => Infinity values not working with Big.js
                // Return current range values
            }
            console.log("axis value not defined or out of range");
            return [currentAxisMin, currentAxisMax];
        }
    };
    ChartZoomCalculations = __decorate([
        mco.role()
    ], ChartZoomCalculations);
    exports.ChartZoomCalculations = ChartZoomCalculations;
});
