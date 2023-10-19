var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigTimingTreeGridCellEditEvents = void 0;
    let TraceConfigTimingTreeGridCellEditEvents = class TraceConfigTimingTreeGridCellEditEvents {
        beginEdit(args) {
            // Only value column can be edited (TODO: use column id instead of index)
            if (args.columnIndex != 1) {
                args.cancel = true;
            }
        }
        endEdit(args, dataModel) {
            if (args.columnObject.field == "displayValue") {
                dataModel.setValue(args.data.item, args.value);
                /*if(args.value != args.data.item.componentParameter.value) {
                    args.rowElement[0].children[0].style.fontWeight = "bold";
                }
                else{
                    args.rowElement[0].children[0].style.fontWeight = "normal";
                }*/
            }
        }
    };
    TraceConfigTimingTreeGridCellEditEvents = __decorate([
        mco.role()
    ], TraceConfigTimingTreeGridCellEditEvents);
    exports.TraceConfigTimingTreeGridCellEditEvents = TraceConfigTimingTreeGridCellEditEvents;
});
