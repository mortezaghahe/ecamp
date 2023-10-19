var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./mean"], function (require, exports, mean_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StandardDeviation = void 0;
    let StandardDeviation = class StandardDeviation {
        constructor() {
            this._data = [];
        }
        set data(data) {
            if (data instanceof Array) {
                this._data = data;
            }
            else {
                this._data.push(data);
            }
        }
        get data() {
            return this._data;
        }
        set mean(mean) {
            this._mean = mean;
        }
        get mean() {
            return this._mean;
        }
        calculate() {
            //If there is no mean calculated we do the mean calculation first, as we need this for the calculation
            //of the standard deviation
            if (!this._mean) {
                let mean = new mean_1.Mean();
                mean.data = this._data;
                this._mean = mean.calculate();
            }
            let cumstd = 0;
            for (let i = 0; i < this._data.length; i++) {
                cumstd += Math.pow((this._data[i] - this._mean), 2);
            }
            return Math.sqrt(cumstd / this._data.length);
        }
    };
    StandardDeviation = __decorate([
        mco.role()
    ], StandardDeviation);
    exports.StandardDeviation = StandardDeviation;
});
