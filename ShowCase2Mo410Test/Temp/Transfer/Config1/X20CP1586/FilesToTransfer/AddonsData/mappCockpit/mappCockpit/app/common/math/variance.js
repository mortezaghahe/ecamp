var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./standardDeviation"], function (require, exports, standardDeviation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Variance = void 0;
    let Variance = class Variance {
        constructor() {
            this._std = 0;
        }
        /**
         * @method setData
         * This method takes the average and calculates the variance from it
         * 1. If an array is given the data only has to be added once.
         * 2. If a number is given, it will be assumed to be the standard devation, and will be used to calculate the variance
         */
        set data(data) {
            this._data = data;
        }
        get data() {
            return this._data;
        }
        /**
         * @method calculate
         */
        calculate() {
            if (this._data instanceof Array) {
                let std = new standardDeviation_1.StandardDeviation();
                std.data = this._data;
                this._std = std.calculate();
            }
            else {
                this._std = this._data;
            }
            return Math.pow(this._std, 2);
        }
    };
    Variance = __decorate([
        mco.role()
    ], Variance);
    exports.Variance = Variance;
});
