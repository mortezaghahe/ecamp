var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./valuePair"], function (require, exports, valuePair_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FrequencyAmplitude = void 0;
    /**
     * Represents a amplitude at a certain frequency.
     *
     * @class FrequencyAmplitude
     * @extends {ValuePair<number, number>}
     * @implements {IFrequencyAmplitude}
     */
    let FrequencyAmplitude = class FrequencyAmplitude extends valuePair_1.ValuePair {
        /**
         * Creates an instance of FrequencyAmplitude.
         *
         * @param {number} f
         * @param {number} a
         * @memberof FrequencyAmplitude
         */
        constructor(f, a) {
            super(f, a);
        }
        get f() {
            return this._value1;
        }
        get a() {
            return this._value2;
        }
    };
    FrequencyAmplitude = __decorate([
        mco.role()
    ], FrequencyAmplitude);
    exports.FrequencyAmplitude = FrequencyAmplitude;
});
