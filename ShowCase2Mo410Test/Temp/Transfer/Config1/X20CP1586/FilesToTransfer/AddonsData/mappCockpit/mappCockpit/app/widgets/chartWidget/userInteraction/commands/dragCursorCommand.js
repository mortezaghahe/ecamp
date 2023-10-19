var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../chartCommandBase"], function (require, exports, chartCommandBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DragCursorCommand = void 0;
    let DragCursorCommand = class DragCursorCommand extends chartCommandBase_1.ChartCommandBase {
        onExecuteChartCommand(sender, args) {
            if (args.traceChart != null) {
                this.chartViewChartManager.dragCursorAlongLine(args.traceChart, args.data.movementX, args.data.movementY);
            }
        }
    };
    DragCursorCommand = __decorate([
        mco.role()
    ], DragCursorCommand);
    exports.DragCursorCommand = DragCursorCommand;
});
