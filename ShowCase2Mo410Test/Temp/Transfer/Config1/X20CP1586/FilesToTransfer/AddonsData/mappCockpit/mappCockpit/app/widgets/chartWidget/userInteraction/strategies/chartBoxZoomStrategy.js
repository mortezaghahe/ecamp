var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../userInteractionController", "../../ChartBase"], function (require, exports, userInteractionController_1, ChartBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartBoxZoomStrategy = void 0;
    let ChartBoxZoomStrategy = class ChartBoxZoomStrategy {
        constructor(userInteractionController) {
            this.dragIsActive = false;
            this.userInteractionController = userInteractionController;
        }
        onMouseHover(chart) {
        }
        onClick(chart) {
        }
        onMouseDown(chart, chartObjectTypeUnderMouse, mousePoint) {
            if (chartObjectTypeUnderMouse.chartObjectType == ChartBase_1.ChartObjectType.cursor) {
                this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.togglePanning, chart, { boxZoomEnabled: false }));
                this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.toggleBoxZoom, chart, { panningEnabled: false }));
                this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.setCursorOnPointerPosition, chart, { cursorIndex: chartObjectTypeUnderMouse.args.cursorIndex, mousePoint: mousePoint }));
            }
            return chartObjectTypeUnderMouse;
        }
        onDrag(chart, args) {
            if (args.objectUnderMouse.chartObjectType != ChartBase_1.ChartObjectType.cursor && args.objectUnderMouse.chartObjectType != ChartBase_1.ChartObjectType.axis || this.dragIsActive == true) {
                this.dragIsActive = true;
            }
        }
        onDragEnd(chart) {
            this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.endCursorDrag, chart, {}));
            this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.toggleBoxZoom, chart, { boxZoomEnabled: true }));
            this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.togglePanning, chart, { panningEnabled: false }));
            this.dragIsActive = false;
        }
    };
    ChartBoxZoomStrategy = __decorate([
        mco.role()
    ], ChartBoxZoomStrategy);
    exports.ChartBoxZoomStrategy = ChartBoxZoomStrategy;
});
