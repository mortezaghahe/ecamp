var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../userInteractionController", "../../ChartBase"], function (require, exports, userInteractionController_1, ChartBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorDragStrategy = void 0;
    let CursorDragStrategy = class CursorDragStrategy {
        constructor(userInteractionController, index) {
            this.dragIsActive = false;
            this.activeCursorIndex = -1;
            this.userInteractionController = userInteractionController;
        }
        onMouseHover(chart, args, mousePoint) {
            this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.checkCursorHovering, chart, { mousePoint: mousePoint }));
        }
        onClick(chart, chartObjectTypeUnderMouse) {
            this.dragIsActive = false;
        }
        onDrag(chart, args) {
            //set the index of the cursor that is currently beeing dragged
            if (args.objectUnderMouse.args.cursorIndex != undefined && this.dragIsActive == false) {
                this.activeCursorIndex = args.objectUnderMouse.args.cursorIndex;
            }
            this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.dragCursor, chart, {
                cursorIndex: this.activeCursorIndex,
                movementX: args.mousePointChart.x,
                movementY: args.mousePointChart.y,
            }));
            this.dragIsActive = true;
        }
        onDragEnd(chart) {
            this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.endCursorDrag, chart, {}));
            this.dragIsActive = false;
            this.userInteractionController.executeCommand(new userInteractionController_1.EventExecuteChartCommandArgs(this, userInteractionController_1.ChartCommandType.resetDragPosition, null, {}));
        }
        onMouseDown(chart, chartObjectUnderMouse) {
            if (chartObjectUnderMouse.chartObjectType == ChartBase_1.ChartObjectType.cursor) {
                this.dragIsActive = true;
                this.activeCursorIndex = chartObjectUnderMouse.args.cursorIndex;
            }
            return chartObjectUnderMouse;
        }
    };
    CursorDragStrategy = __decorate([
        mco.role()
    ], CursorDragStrategy);
    exports.CursorDragStrategy = CursorDragStrategy;
});
