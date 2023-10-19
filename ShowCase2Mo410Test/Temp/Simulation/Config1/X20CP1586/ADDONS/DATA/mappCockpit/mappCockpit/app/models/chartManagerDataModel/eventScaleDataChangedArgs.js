var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventScaleDataChangedArgs = exports.ScaleAction = void 0;
    var ScaleAction;
    (function (ScaleAction) {
        ScaleAction[ScaleAction["yRangeChanged"] = 0] = "yRangeChanged";
        ScaleAction[ScaleAction["xRangeChanged"] = 1] = "xRangeChanged";
    })(ScaleAction = exports.ScaleAction || (exports.ScaleAction = {}));
    /**
     * Defines the event args of the signal
     *
     * @class EventSerieDataChangedArgs
     */
    let EventScaleDataChangedArgs = class EventScaleDataChangedArgs {
        constructor(action, data, oldData = undefined) {
            this.action = action;
            this.data = data;
            this.oldData = oldData;
        }
    };
    EventScaleDataChangedArgs = __decorate([
        mco.role()
    ], EventScaleDataChangedArgs);
    exports.EventScaleDataChangedArgs = EventScaleDataChangedArgs;
});
