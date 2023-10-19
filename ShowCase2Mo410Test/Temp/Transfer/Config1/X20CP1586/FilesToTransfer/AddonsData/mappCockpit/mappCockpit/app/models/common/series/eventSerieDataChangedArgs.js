var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventSerieDataChangedArgs = exports.SerieAction = void 0;
    var SerieAction;
    (function (SerieAction) {
        SerieAction[SerieAction["rename"] = 0] = "rename";
        SerieAction[SerieAction["dataPointsChanged"] = 1] = "dataPointsChanged";
        SerieAction[SerieAction["colorChanged"] = 2] = "colorChanged";
        SerieAction[SerieAction["startTriggerTimeChanged"] = 3] = "startTriggerTimeChanged";
    })(SerieAction = exports.SerieAction || (exports.SerieAction = {}));
    /**
     * Defines the event args of the signal
     *
     * @class EventSerieDataChangedArgs
     */
    let EventSerieDataChangedArgs = class EventSerieDataChangedArgs {
        constructor(action, data, oldData = undefined) {
            this.action = action;
            this.data = data;
            this.oldData = oldData;
        }
    };
    EventSerieDataChangedArgs = __decorate([
        mco.role()
    ], EventSerieDataChangedArgs);
    exports.EventSerieDataChangedArgs = EventSerieDataChangedArgs;
});
