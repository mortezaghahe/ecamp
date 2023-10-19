var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventDatapointArgs = exports.DatapointAction = void 0;
    // specify the direction of the model change
    var DatapointAction;
    (function (DatapointAction) {
        DatapointAction[DatapointAction["add"] = 0] = "add";
        DatapointAction[DatapointAction["replace"] = 1] = "replace";
    })(DatapointAction || (DatapointAction = {}));
    exports.DatapointAction = DatapointAction;
    /**
     *
     *
     * @class EventModelChangedArgs
     */
    let EventDatapointArgs = class EventDatapointArgs {
        constructor(caller, action, dataPointInfo) {
            this.caller = caller;
            this.action = action;
            this.dataPointInfo = dataPointInfo;
        }
    };
    EventDatapointArgs = __decorate([
        mco.role()
    ], EventDatapointArgs);
    exports.EventDatapointArgs = EventDatapointArgs;
});
