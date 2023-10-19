var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../chartCommandBase"], function (require, exports, chartCommandBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EndCursorDragCommand = void 0;
    let EndCursorDragCommand = class EndCursorDragCommand extends chartCommandBase_1.ChartCommandBase {
        onExecuteChartCommand(sender, args) {
            //TODO: get rid of typecast
            // (args.traceChart as ChartBase).refCursorsSetDragFlag(false);
        }
    };
    EndCursorDragCommand = __decorate([
        mco.role()
    ], EndCursorDragCommand);
    exports.EndCursorDragCommand = EndCursorDragCommand;
});
