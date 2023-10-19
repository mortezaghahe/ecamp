var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./signal"], function (require, exports, signal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.YTSignal = void 0;
    /**
     * Represents an YT signal.
     *
     * @class YTSignal
     * @extends {Signal}
     */
    let YTSignal = class YTSignal extends signal_1.Signal {
        /**
         * Creates an instance of YTSignal.
         *
         * @param {string} name
         * @param {Array<Sample>} items
         * @memberof YTSignal
         */
        constructor(name, items) {
            super(name, items);
        }
        get name() {
            return this._name;
        }
        get items() {
            return this._items;
        }
    };
    YTSignal = __decorate([
        mco.role()
    ], YTSignal);
    exports.YTSignal = YTSignal;
});
