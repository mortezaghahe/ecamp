var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventSignalManagerDataChangedArgs = exports.SignalManagerAction = void 0;
    // specify the action of the model change
    var SignalManagerAction;
    (function (SignalManagerAction) {
        SignalManagerAction[SignalManagerAction["add"] = 0] = "add";
        SignalManagerAction[SignalManagerAction["remove"] = 1] = "remove";
        SignalManagerAction[SignalManagerAction["valueChanged"] = 2] = "valueChanged";
        SignalManagerAction[SignalManagerAction["clearAll"] = 3] = "clearAll";
        SignalManagerAction[SignalManagerAction["colorChanged"] = 4] = "colorChanged";
    })(SignalManagerAction = exports.SignalManagerAction || (exports.SignalManagerAction = {}));
    /**
     * Define the event args of the signal manager
     *
     * @class EventSignalManagerDataChangedArgs
     */
    let EventSignalManagerDataChangedArgs = class EventSignalManagerDataChangedArgs {
        constructor(action, data, oldData = undefined) {
            this.action = action;
            this.data = data;
            this.oldData = oldData;
        }
    };
    EventSignalManagerDataChangedArgs = __decorate([
        mco.role()
    ], EventSignalManagerDataChangedArgs);
    exports.EventSignalManagerDataChangedArgs = EventSignalManagerDataChangedArgs;
});
