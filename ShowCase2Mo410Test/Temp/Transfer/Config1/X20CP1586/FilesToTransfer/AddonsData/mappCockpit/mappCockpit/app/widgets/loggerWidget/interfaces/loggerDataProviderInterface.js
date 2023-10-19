var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../framework/events"], function (require, exports, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventDataLoadingProgress = exports.EventDataAvailable = void 0;
    let EventDataAvailable = class EventDataAvailable extends events_1.TypedEvent {
    };
    EventDataAvailable = __decorate([
        mco.role()
    ], EventDataAvailable);
    exports.EventDataAvailable = EventDataAvailable;
    ;
    let EventDataLoadingProgress = class EventDataLoadingProgress extends events_1.TypedEvent {
    };
    EventDataLoadingProgress = __decorate([
        mco.role()
    ], EventDataLoadingProgress);
    exports.EventDataLoadingProgress = EventDataLoadingProgress;
    ;
});
