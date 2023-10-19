var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Max = void 0;
    let Max = class Max {
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
        calculate() {
            let max = this._data[0];
            for (var i = 1; i < this._data.length; i++) {
                max = Math.max(max, this._data[i]);
            }
            return max;
        }
    };
    Max = __decorate([
        mco.role()
    ], Max);
    exports.Max = Max;
});
