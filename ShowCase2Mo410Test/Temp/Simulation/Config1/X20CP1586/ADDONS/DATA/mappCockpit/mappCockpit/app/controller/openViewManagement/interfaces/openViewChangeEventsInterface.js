var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../framework/events"], function (require, exports, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventViewDeleted = exports.EventViewAdded = exports.EventViewDeactivated = exports.EventViewActivated = void 0;
    let EventViewActivated = class EventViewActivated extends events_1.TypedEvent {
    };
    EventViewActivated = __decorate([
        mco.role()
    ], EventViewActivated);
    exports.EventViewActivated = EventViewActivated;
    ;
    let EventViewDeactivated = class EventViewDeactivated extends events_1.TypedEvent {
    };
    EventViewDeactivated = __decorate([
        mco.role()
    ], EventViewDeactivated);
    exports.EventViewDeactivated = EventViewDeactivated;
    ;
    let EventViewAdded = class EventViewAdded extends events_1.TypedEvent {
    };
    EventViewAdded = __decorate([
        mco.role()
    ], EventViewAdded);
    exports.EventViewAdded = EventViewAdded;
    ;
    let EventViewDeleted = class EventViewDeleted extends events_1.TypedEvent {
    };
    EventViewDeleted = __decorate([
        mco.role()
    ], EventViewDeleted);
    exports.EventViewDeleted = EventViewDeleted;
    ;
});
