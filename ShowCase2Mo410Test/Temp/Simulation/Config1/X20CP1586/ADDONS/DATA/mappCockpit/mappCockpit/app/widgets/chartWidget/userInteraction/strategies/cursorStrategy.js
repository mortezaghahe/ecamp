var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../userInteractionController", "../../ChartBase"], function (require, exports, userInteractionController_1, ChartBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorInteractionStrategy = void 0;
    let CursorInteractionStrategy = class CursorInteractionStrategy {
        constructor(userInteractionController, index) {
            this.index = 0;
            this.dragIsActive = false;
            this.userInteractionController = userInteractionController;
            this.index = index;
        }
        onMouseHover(chart, args, mousePoint) {
            this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.checkCursorHovering, chart, { mousePoint: mousePoint }));
        }
        onClick(chart, chartObjectUnderMouse, mousePoint) {
            if (chartObjectUnderMouse.chartObjectType == ChartBase_1.ChartObjectType.cursor) {
                this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.setCursorOnPointerPosition, chart, { cursorIndex: chartObjectUnderMouse.args.cursorIndex, mousePoint: mousePoint }));
            }
            else if (chartObjectUnderMouse.chartObjectType == ChartBase_1.ChartObjectType.chartSpace) {
                this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.setCursorOnPointerPosition, chart, { cursorIndex: this.index, mousePoint: mousePoint }));
            }
            chartObjectUnderMouse.chartObjectType = ChartBase_1.ChartObjectType.cursor;
            return chartObjectUnderMouse;
        }
        onDrag(chart) {
        }
        onDragEnd(chart) {
        }
        onMouseDown(chart, chartObjectUnderMouse, mousePoint) {
            if (chartObjectUnderMouse.chartObjectType == ChartBase_1.ChartObjectType.cursor) {
                this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.setCursorOnPointerPosition, chart, { cursorIndex: chartObjectUnderMouse.args.cursorIndex, mousePoint: mousePoint }));
            }
            else if (chartObjectUnderMouse.chartObjectType == ChartBase_1.ChartObjectType.chartSpace) {
                this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.setCursorOnPointerPosition, chart, { cursorIndex: this.index, mousePoint: mousePoint }));
                chartObjectUnderMouse.args.cursorIndex = this.index;
                chartObjectUnderMouse.chartObjectType = ChartBase_1.ChartObjectType.cursor;
            }
            return chartObjectUnderMouse;
        }
    };
    CursorInteractionStrategy = __decorate([
        mco.role()
    ], CursorInteractionStrategy);
    exports.CursorInteractionStrategy = CursorInteractionStrategy;
});
