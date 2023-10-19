var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../model/triggerGroup"], function (require, exports, triggerGroup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigTriggerTreeGridCellEditEvents = void 0;
    let TraceConfigTriggerTreeGridCellEditEvents = class TraceConfigTriggerTreeGridCellEditEvents {
        beginEdit(args) {
            if (args.columnIndex != 1) {
                // Only value column cells can be edited
                args.cancel = true;
                return;
            }
            if (args.data.item instanceof triggerGroup_1.TriggerGroup) {
                // supress editing of trigger group value
                args.cancel = true;
                return;
            }
        }
        endEdit(args) {
            if (args.columnObject.field == "displayValue") {
                let value = args.value;
                let componentParameter = args.data.componentParameter;
                if (componentParameter.enumType.values != undefined) {
                    for (let i = 0; i < componentParameter.enumType.values.length; i++) {
                        let enumItem = componentParameter.enumType.values[i];
                        if (enumItem.displayValue == args.value) {
                            value = enumItem.value;
                            break;
                        }
                    }
                }
                let triggerGroup = args.data.parentItem.item;
                let triggerParameter = args.data.item;
                triggerGroup.setValue(triggerParameter.id, value);
            }
        }
    };
    TraceConfigTriggerTreeGridCellEditEvents = __decorate([
        mco.role()
    ], TraceConfigTriggerTreeGridCellEditEvents);
    exports.TraceConfigTriggerTreeGridCellEditEvents = TraceConfigTriggerTreeGridCellEditEvents;
});
