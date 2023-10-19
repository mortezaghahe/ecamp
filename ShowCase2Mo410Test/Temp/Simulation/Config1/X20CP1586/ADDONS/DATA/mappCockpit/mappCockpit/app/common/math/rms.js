var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./squaredsum"], function (require, exports, squaredsum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RootMeanSquare = void 0;
    let RootMeanSquare = class RootMeanSquare {
        constructor() {
            this._data = [];
            this._ss = new squaredsum_1.SquaredSum();
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
        calculate() {
            let rms = 0, ss = 0;
            this._ss.data = this._data;
            ss = this._ss.calculate();
            rms = Math.sqrt(ss / this._data.length);
            return rms;
        }
    };
    RootMeanSquare = __decorate([
        mco.role()
    ], RootMeanSquare);
    exports.RootMeanSquare = RootMeanSquare;
});
