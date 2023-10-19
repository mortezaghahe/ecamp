var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventSignalDataChangedArgs = exports.SignalAction = void 0;
    var SignalAction;
    (function (SignalAction) {
        SignalAction[SignalAction["rename"] = 0] = "rename";
        SignalAction[SignalAction["dataPointsChanged"] = 1] = "dataPointsChanged";
        SignalAction[SignalAction["colorChanged"] = 2] = "colorChanged";
        SignalAction[SignalAction["startTriggerTimeChanged"] = 3] = "startTriggerTimeChanged";
    })(SignalAction = exports.SignalAction || (exports.SignalAction = {}));
    /**
     * Defines the event args of the signal
     *
     * @class EventSignalDataChangedArgs
     */
    let EventSignalDataChangedArgs = class EventSignalDataChangedArgs {
        constructor(action, data, oldData = undefined) {
            this.action = action;
            this.data = data;
            this.oldData = oldData;
        }
    };
    EventSignalDataChangedArgs = __decorate([
        mco.role()
    ], EventSignalDataChangedArgs);
    exports.EventSignalDataChangedArgs = EventSignalDataChangedArgs;
});
