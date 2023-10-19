var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./signal"], function (require, exports, signal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XYSignal = void 0;
    /**
     * Represents an XY signal and the YT signals it is made of.
     *
     * @class XYSignal
     * @extends {Signal}
     */
    let XYSignal = class XYSignal extends signal_1.Signal {
        /**
         * Creates an instance of XYSignal.
         *
         * @param {string} name
         * @param {Array<Point>} items
         * @param {YTSignal} xSource YT signal on X axis
         * @param {YTSignal} ySource YT signal on Y axis
         * @memberof XYSignal
         */
        constructor(name, items, xSource, ySource) {
            super(name, items);
            this._xSource = xSource;
            this._ySource = ySource;
        }
        get name() {
            return this._name;
        }
        get items() {
            return this._items;
        }
        get xSource() {
            return this._xSource;
        }
        get ySource() {
            return this._ySource;
        }
    };
    XYSignal = __decorate([
        mco.role()
    ], XYSignal);
    exports.XYSignal = XYSignal;
});
