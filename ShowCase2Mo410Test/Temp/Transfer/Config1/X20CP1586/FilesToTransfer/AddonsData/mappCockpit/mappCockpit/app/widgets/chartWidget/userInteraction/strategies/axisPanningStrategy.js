var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../userInteractionController", "../../ChartBase"], function (require, exports, userInteractionController_1, ChartBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AxisPanningStrategy = void 0;
    let AxisPanningStrategy = class AxisPanningStrategy {
        constructor(userInteractionController) {
            this.dragIsActive = false;
            this.currentDragChart = undefined;
            this.userInteractionController = userInteractionController;
        }
        onMouseHover(chart, chartObjectTypeUnderMouse) {
            //TODO: remove direct chart access and move this to setCursor Method in Chart
            let chartDiv = $(chart.mainDiv);
            let canvasDiv = chartDiv.find("#" + chartDiv[0].id + "_canvas");
            if (chartObjectTypeUnderMouse.chartObjectType == ChartBase_1.ChartObjectType.axis) {
                chartDiv.css("cursor", "pointer");
                canvasDiv.css("cursor", "pointer");
            }
            else {
                chartDiv.css("cursor", "default");
                canvasDiv.css("cursor", "default");
            }
        }
        onClick(chart) {
        }
        onMouseDown(chart, chartObjectTypeUnderMouse) {
            if (this.dragIsActive == false) {
                if (chartObjectTypeUnderMouse.args.axis != undefined) {
                    this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.togglePanning, chart, { boxZoomEnabled: false }));
                    this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.toggleBoxZoom, chart, { panningEnabled: false }));
                    this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.selectPanningAxes, chart, { zoomAxes: chartObjectTypeUnderMouse.args.axis }));
                }
            }
            return chartObjectTypeUnderMouse;
        }
        onDrag(chart, args) {
            if (this.currentDragChart == undefined || chart == this.currentDragChart) {
                if (args.objectUnderMouse.chartObjectType == ChartBase_1.ChartObjectType.axis || this.dragIsActive == true) {
                    this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.panChart, chart, { args: args }));
                    this.dragIsActive = true;
                    this.currentDragChart = chart;
                }
            }
            if (this.dragIsActive == false) {
                if (args.objectUnderMouse.args.axis != undefined) {
                    this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.selectPanningAxes, chart, { zoomAxes: args.chartObjectUnderMouse.args.axis }));
                }
            }
        }
        onDragEnd(chart) {
            this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.endCursorDrag, chart, {}));
            this.dragIsActive = false;
            this.currentDragChart = undefined;
            this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.resetDragPosition, null, {}));
        }
    };
    AxisPanningStrategy = __decorate([
        mco.role()
    ], AxisPanningStrategy);
    exports.AxisPanningStrategy = AxisPanningStrategy;
});
