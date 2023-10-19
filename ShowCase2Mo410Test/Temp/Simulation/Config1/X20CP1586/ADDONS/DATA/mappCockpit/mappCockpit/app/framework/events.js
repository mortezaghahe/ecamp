var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypedEvent = void 0;
    /**
     * The event class implements a typed event base.
     *
     * @class Event
     * @template SENDER  specifies the type of the event sender
     * @template DATA specifies the type of the event data
     */
    let TypedEvent = class TypedEvent {
        constructor() {
            this._eventHandlers = [];
        }
        /**
         * Attaches an event handler
         *
         * @param {EventHandler<SENDER,DATA>} eventHandler
         * @returns {EventHandler<SENDER,DATA>} the attached handler
         * @memberof Event
         */
        attach(eventHandler) {
            if (!this.isAttached(eventHandler)) {
                this._eventHandlers.push(eventHandler);
            }
            return eventHandler;
        }
        /**
         * Detaches an event handler
         *
         * @param {EventHandler<SENDER, DATA>} eventHandler
         * @returns {EventHandler<SENDER, DATA>} the detached handler
         * @memberof Event
         */
        detach(eventHandler) {
            var i = this._eventHandlers.indexOf(eventHandler);
            if (i > -1) {
                this._eventHandlers.splice(i, 1);
            }
            return eventHandler;
        }
        /**
         * Dispatches an event to all attached handlers
         *
         * @param {SENDER} eventSender
         * @param {DATA} eventData
         * @memberof Event
         */
        raise(eventSender, eventData) {
            this._eventHandlers.forEach((eventHandler) => eventHandler(eventSender, eventData));
        }
        /**
         * Checks if the passed event handler is already attached
         *
         * @param {EventHandler<SENDER, DATA>} eventHandler
         * @returns {boolean} true if the handler is attached
         * @memberof Event
         */
        isAttached(eventHandler) {
            return this._eventHandlers.indexOf(eventHandler) > -1;
        }
    };
    TypedEvent = __decorate([
        mco.role()
    ], TypedEvent);
    exports.TypedEvent = TypedEvent;
});
