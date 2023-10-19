var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../signalManagerWidget"], function (require, exports, signalManagerWidget_1) {
    "use strict";
    var SmTreeGridCellEditEvents_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SmTreeGridCellEditEvents = void 0;
    let SmTreeGridCellEditEvents = SmTreeGridCellEditEvents_1 = class SmTreeGridCellEditEvents {
        beginEdit(args, widget) {
            let colorColumnIndex = SmTreeGridCellEditEvents_1.getColumnIndex(signalManagerWidget_1.SignalManagerWidget.colorColumnId, args.model);
            let valueColumnIndex = SmTreeGridCellEditEvents_1.getColumnIndex(signalManagerWidget_1.SignalManagerWidget.valueColumnId, args.model);
            if (args.columnIndex == colorColumnIndex) {
                if (args.data.item.color == undefined) {
                    // Only color setting can be edited if available
                    args.cancel = true;
                }
            }
            else if (args.columnIndex == valueColumnIndex) {
                if (args.data.item.value != undefined) {
                }
                else {
                    args.cancel = true;
                }
            }
            else {
                args.cancel = true;
            }
            // Remove dragging support to avoid problems with selecting parts of the edit cell
            if (!args.cancel) {
                widget.removeDraggingSupport();
            }
        }
        endEdit(args, widget) {
            // Add dragging support (removed in beginEdit)
            widget.addDraggingSupport();
            if (args.columnObject.field == signalManagerWidget_1.SignalManagerWidget.colorColumnId) {
                if (args.data.item.color != undefined) {
                    // update signal icon with correct color
                    widget.refresh();
                }
            }
        }
        static getColumnIndex(columnId, dataModel) {
            for (let index = 0; index < dataModel.columns.length; index++) {
                if (dataModel.columns[index].field == columnId) {
                    return index;
                }
            }
            // Default column
            return 1;
        }
    };
    SmTreeGridCellEditEvents = SmTreeGridCellEditEvents_1 = __decorate([
        mco.role()
    ], SmTreeGridCellEditEvents);
    exports.SmTreeGridCellEditEvents = SmTreeGridCellEditEvents;
});
