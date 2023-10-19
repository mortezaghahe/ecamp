var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../framework/events"], function (require, exports, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventModelChangedArgs = exports.ModelChangeType = exports.EventModelInitialized = exports.EventModelItemsChanged = exports.EventModelChanged = void 0;
    // specify the direction of the model change
    var ModelChangeType;
    (function (ModelChangeType) {
        ModelChangeType[ModelChangeType["updateTarget"] = 0] = "updateTarget";
        ModelChangeType[ModelChangeType["updateSource"] = 1] = "updateSource";
    })(ModelChangeType || (ModelChangeType = {}));
    exports.ModelChangeType = ModelChangeType;
    /**
     *
     *
     * @class EventModelChangedArgs
     */
    let EventModelChangedArgs = class EventModelChangedArgs {
        /**
         *Creates an instance of EventModelChangedArgs.
         * @param {*} caller instance which invoked the change
         * @param {ModelChangeType} changeType the change direction
         * @param {*} hint additional info describing what has changed
         * @param {*} data additional data describing/containing the changed data
         * @memberof EventModelChangedArgs
         */
        constructor(caller, changeType, hint = {}, data = {}) {
            this.caller = caller;
            this.changeType = changeType;
            this.data = data;
            this.hint = hint;
        }
    };
    EventModelChangedArgs = __decorate([
        mco.role()
    ], EventModelChangedArgs);
    exports.EventModelChangedArgs = EventModelChangedArgs;
    // Declare the model changed event
    let EventModelChanged = class EventModelChanged extends events_1.TypedEvent {
    };
    EventModelChanged = __decorate([
        mco.role()
    ], EventModelChanged);
    exports.EventModelChanged = EventModelChanged;
    ;
    let EventModelItemsChanged = class EventModelItemsChanged extends events_1.TypedEvent {
    };
    EventModelItemsChanged = __decorate([
        mco.role()
    ], EventModelItemsChanged);
    exports.EventModelItemsChanged = EventModelItemsChanged;
    ;
    let EventModelInitialized = class EventModelInitialized extends events_1.TypedEvent {
    };
    EventModelInitialized = __decorate([
        mco.role()
    ], EventModelInitialized);
    exports.EventModelInitialized = EventModelInitialized;
    ;
});
