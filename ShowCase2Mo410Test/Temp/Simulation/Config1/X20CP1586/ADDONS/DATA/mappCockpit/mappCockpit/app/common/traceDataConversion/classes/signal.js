var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Signal = void 0;
    /**
     * Represents a generic signal made of value paris and a name.
     *
     * @class Signal
     * @implements {ISignal}
     */
    let Signal = class Signal {
        /**
         * Creates an instance of Signal.
         *
         * @param {string} name
         * @param {Array<IValuePair<number, number>>} items
         * @memberof Signal
         */
        constructor(name, items) {
            this._name = name;
            this._items = items;
        }
        get name() {
            return this._name;
        }
        get items() {
            return this._items;
        }
    };
    Signal = __decorate([
        mco.role()
    ], Signal);
    exports.Signal = Signal;
});
