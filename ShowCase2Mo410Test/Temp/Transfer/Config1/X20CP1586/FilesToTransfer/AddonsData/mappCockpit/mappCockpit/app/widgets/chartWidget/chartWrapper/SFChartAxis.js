var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../core/interfaces/components/ui/chart/chartInterface", "../../../core/types/AxisBounds"], function (require, exports, chartInterface_1, AxisBounds_1) {
    "use strict";
    var SFChartAxis_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SFChartAxis = void 0;
    let SFChartAxis = SFChartAxis_1 = class SFChartAxis {
        constructor(axis, eventAxisRangeChanged, sfChart) {
            this._chartAxis = axis;
            this.eventAxisRangeChanged = eventAxisRangeChanged;
            this.sfChart = sfChart;
        }
        setAxisRange(newRange, forceRedraw = false, syncAxis = false) {
            let axis = this._chartAxis;
            this.setChartAxisRange(newRange.min, newRange.max);
            let eventAxisRangeChangedArgs = new chartInterface_1.EventAxisRangeChangedArgs([axis.name], forceRedraw, syncAxis);
            this.eventAxisRangeChanged.raise(this, eventAxisRangeChangedArgs);
        }
        setChartAxisRange(minValue, maxValue) {
            /*The following lines fix the bug in syncfusion source code, where the axis range is not set,
            when the chart is zoomed in before setting the range by manualy setting all given ranges */
            this._chartAxis._range.min = minValue;
            this._chartAxis._range.max = maxValue;
            this._chartAxis.range.min = minValue;
            this._chartAxis.range.max = maxValue;
            this._chartAxis._initialRange.min = minValue;
            this._chartAxis._initialRange.max = maxValue;
            this._chartAxis.visibleRange.max = maxValue;
            this._chartAxis.visibleRange.min = minValue;
        }
        getAxisRange() {
            let axis = this._chartAxis;
            axis.visibleRange.min = SFChartAxis_1.changeInfinityToMaxValue(axis.visibleRange.min);
            axis.visibleRange.max = SFChartAxis_1.changeInfinityToMaxValue(axis.visibleRange.max);
            return { min: axis.visibleRange.min, max: axis.visibleRange.max, delta: axis.visibleRange.delta };
        }
        /**
         * Change the value to min/max value if it is -inf/+inf
         *
         * @static
         * @param {number} value
         * @returns {number}
         * @memberof SFChartAxis
         */
        static changeInfinityToMaxValue(value) {
            if (value == Number.NEGATIVE_INFINITY) {
                value = Number.MIN_VALUE;
            }
            else if (value == Number.POSITIVE_INFINITY) {
                value = Number.MAX_VALUE;
            }
            return value;
        }
        getAxisRangeInPixel() {
            let axis = this._chartAxis;
            let pixelRange;
            if (axis.orientation == "horizontal") {
                pixelRange = { max: axis.width, min: 0 };
            }
            else {
                pixelRange = { max: axis.length, min: 0 };
            }
            return pixelRange;
        }
        getAxisOrientation() {
            if (this._chartAxis.orientation == "horizontal") {
                return chartInterface_1.AxisOrientation.horizontal;
            }
            else {
                return chartInterface_1.AxisOrientation.vertical;
            }
        }
        getAxisID() {
            return this._chartAxis.name;
        }
        getAxisBounds() {
            let axisBounds;
            let chartArea = this.sfChart.getChartArea();
            let currentAxis = this._chartAxis;
            if (currentAxis.orientation == "horizontal") {
                let x = currentAxis.x;
                let y = currentAxis.y;
                let width = currentAxis.width;
                let height = this.sfChart._SFChart.svgHeight - y;
                axisBounds = new AxisBounds_1.AxisBounds(currentAxis, x, y, width, height);
            }
            else {
                if (currentAxis.x <= chartArea.x) {
                    let width = currentAxis.AxisMaxWidth;
                    let height = currentAxis.height;
                    let x = currentAxis.x - width;
                    let y = currentAxis.y;
                    axisBounds = new AxisBounds_1.AxisBounds(currentAxis, x, y, width, height);
                }
                else {
                    let width = currentAxis.AxisMaxWidth;
                    let height = currentAxis.height;
                    let x = currentAxis.x;
                    let y = currentAxis.y;
                    axisBounds = new AxisBounds_1.AxisBounds(currentAxis, x, y, width, height);
                }
            }
            return axisBounds;
        }
    };
    SFChartAxis = SFChartAxis_1 = __decorate([
        mco.role()
    ], SFChartAxis);
    exports.SFChartAxis = SFChartAxis;
});
