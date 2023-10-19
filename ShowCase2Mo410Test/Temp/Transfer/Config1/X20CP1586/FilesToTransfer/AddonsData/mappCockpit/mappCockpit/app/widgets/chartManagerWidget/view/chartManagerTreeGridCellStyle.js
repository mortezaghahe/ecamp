var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartManagerTreeGridCellStyle = void 0;
    let ChartManagerTreeGridCellStyle = class ChartManagerTreeGridCellStyle {
        setCellStyle(args) {
            if (args.column.field == "name" && (args.data.level == 0 || args.data.level == 1)) {
                // Show root nodes always bold => also if they have no childs
                args.cellElement.style.fontWeight = "bold";
                if (args.data.dropPossible == true) {
                    args.cellElement.classList.add("dropLocationArea");
                }
            }
            /*if (args.data.level == 0 && args.data.isDisabled == true ||             // Set different style for chart if chart is disabled
                args.data.level == 1 && args.data.parentItem.isDisabled == true){   // Set different style for series if parent chart is disabled
                
                $(args.cellElement).css("color", "rgba(128, 128, 128, 0.5)");
            }*/
        }
    };
    ChartManagerTreeGridCellStyle = __decorate([
        mco.role()
    ], ChartManagerTreeGridCellStyle);
    exports.ChartManagerTreeGridCellStyle = ChartManagerTreeGridCellStyle;
});
