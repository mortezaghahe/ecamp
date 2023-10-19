var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./signal"], function (require, exports, signal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FFTSignal = void 0;
    /**
     * Represents a FFT signal and the YT signal it is calculated from.
     *
     * @class FFTSignal
     * @extends {Signal}
     */
    let FFTSignal = class FFTSignal extends signal_1.Signal {
        /**
         * Creates an instance of FFTSignal.
         *
         * @param {string} name
         * @param {Array<FrequencyAmplitude>} items
         * @param {YTSignal} source original YT signal
         * @memberof FFTSignal
         */
        constructor(name, items, source) {
            super(name, items);
            this._source = source;
        }
        get name() {
            return this._name;
        }
        get items() {
            return this._items;
        }
        get source() {
            return this._source;
        }
    };
    FFTSignal = __decorate([
        mco.role()
    ], FFTSignal);
    exports.FFTSignal = FFTSignal;
});
