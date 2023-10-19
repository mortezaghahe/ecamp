var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../chartCommandBase", "../../helpers/chartZoomCalculations", "../../../../models/chartManagerDataModel/chartManagerChart", "../../../../core/interfaces/components/ui/chart/chartInterface", "../../helpers/chartRangeHelper"], function (require, exports, chartCommandBase_1, chartZoomCalculations_1, chartManagerChart_1, chartInterface_1, chartRangeHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZoomChartCommand = void 0;
    let ZoomChartCommand = class ZoomChartCommand extends chartCommandBase_1.ChartCommandBase {
        onExecuteChartCommand(sender, args) {
            let chart = args.traceChart;
            if (chart != null) {
                if (args.data.axes.length == 0) {
                    args.data.axes = this.chartViewChartManager.getZoomAxesInChart(chart, args.data.zoomDirection);
                }
                let zoomCalculator = new chartZoomCalculations_1.ChartZoomCalculations();
                for (let i = 0; i < args.data.axes.length; i++) {
                    let axis = args.data.axes[i];
                    let newRange = zoomCalculator.calculateAxisZoomRanges(chart, axis, args.data.zoomStep, args.data.mousePoint.x, args.data.mousePoint.y);
                    //limit the axis range to Precision 11 to prevent syncfusion chart from failing
                    let distance = newRange[1] - newRange[0];
                    if (distance > chartRangeHelper_1.SF_axisResolution) {
                        if (axis.getAxisOrientation() == chartInterface_1.AxisOrientation.horizontal) {
                            let scale = chart.getScaleByScaleId(chart.scales[i].id);
                            if (scale != undefined) {
                                chart.setScaleRange(scale, newRange[0], newRange[1], scale.minYValue, scale.maxYValue, "horizontal");
                            }
                        }
                        else {
                            let scale = chart.getScaleByScaleId(axis.getAxisID());
                            if (scale != undefined) {
                                chart.setScaleRange(scale, scale.minXValue, scale.maxXValue, newRange[0], newRange[1]);
                            }
                        }
                    }
                }
                //Workaround!: Redraw charts except XY or just the XY chart we are zooming
                if (chart.type != chartManagerChart_1.ChartType.XYChart) {
                    this.chartViewChartManager.redrawCharts(false);
                }
                else {
                    chart.redrawChart();
                }
            }
        }
    };
    ZoomChartCommand = __decorate([
        mco.role()
    ], ZoomChartCommand);
    exports.ZoomChartCommand = ZoomChartCommand;
});
