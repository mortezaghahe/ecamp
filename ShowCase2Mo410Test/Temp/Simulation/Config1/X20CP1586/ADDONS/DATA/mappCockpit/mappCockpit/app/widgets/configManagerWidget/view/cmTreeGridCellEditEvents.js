var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../configManagerWidget"], function (require, exports, configManagerWidget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CmTreeGridCellEditEvents = void 0;
    let CmTreeGridCellEditEvents = class CmTreeGridCellEditEvents {
        beginEdit(args, dataModel) {
            // index 1 is modified value and index 2 is value
            // modified value can only be changed if user with write access is logged in
            let writeAccess = false;
            if (dataModel != undefined) {
                writeAccess = dataModel.writeAccess;
            }
            let item = args.data.item;
            if (args.columnIndex != 1 || (writeAccess == false || item.isReadOnly == true || args.data.element.componentParameter == undefined)) {
                args.cancel = true;
            }
        }
        endEdit(args, dataModel) {
            if (args.columnObject.field == configManagerWidget_1.ConfigManagerWidget.displayModifiedValueColumnId) {
                if (dataModel != undefined) {
                    dataModel.setValue(args.data.element, args.value);
                }
            }
        }
    };
    CmTreeGridCellEditEvents = __decorate([
        mco.role()
    ], CmTreeGridCellEditEvents);
    exports.CmTreeGridCellEditEvents = CmTreeGridCellEditEvents;
});
