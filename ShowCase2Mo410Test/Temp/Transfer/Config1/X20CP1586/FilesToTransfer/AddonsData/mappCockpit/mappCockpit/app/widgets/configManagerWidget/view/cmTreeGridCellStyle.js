var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/domHelper", "../configManagerWidget"], function (require, exports, domHelper_1, configManagerWidget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CmTreeGridCellStyle = void 0;
    let CmTreeGridCellStyle = class CmTreeGridCellStyle {
        setCellStyle(args, dataModel) {
            if (args.column.field == configManagerWidget_1.ConfigManagerWidget.displayModifiedValueColumnId) {
                let writeAccess = false;
                if (dataModel != undefined) {
                    writeAccess = dataModel.writeAccess;
                }
                let writeAccessDisabled = !writeAccess;
                if (args.cellElement.classList != undefined) {
                    let item = args.data.item;
                    // Show ReadOnly cells with other color
                    let disableTreeCellClassName = "treeCellDisabled";
                    if (writeAccessDisabled == true || item.isReadOnly == true) {
                        args.cellElement.classList.add(disableTreeCellClassName);
                    }
                    else {
                        args.cellElement.classList.remove(disableTreeCellClassName);
                    }
                }
                // Set all cells disabled in the targetValue column
                domHelper_1.DomHelper.disableElement(args.cellElement, writeAccessDisabled);
            }
            if (args.column.field == configManagerWidget_1.ConfigManagerWidget.displayValueColumnId) {
                if (args.cellElement.classList != undefined) {
                    // Show all cells read only in the targetValue column
                    let disableTreeCellClassName = "treeCellDisabled";
                    args.cellElement.classList.add(disableTreeCellClassName);
                }
                // Set all cells disabled in the targetValue column
                domHelper_1.DomHelper.disableElement(args.cellElement, true);
            }
        }
    };
    CmTreeGridCellStyle = __decorate([
        mco.role()
    ], CmTreeGridCellStyle);
    exports.CmTreeGridCellStyle = CmTreeGridCellStyle;
});
