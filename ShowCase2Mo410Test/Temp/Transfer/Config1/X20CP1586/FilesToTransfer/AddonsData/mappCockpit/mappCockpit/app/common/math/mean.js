var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Mean = void 0;
    let Mean = class Mean {
        constructor() {
            this._n = 0;
        }
        set data(data) {
            if (data instanceof Array || this._data === undefined) {
                this._data = data;
            }
            else {
                this._data += data;
            }
            this._n++;
        }
        get data() {
            return this._data;
        }
        calculate() {
            let mean = 0;
            if (this._data instanceof Array) {
                for (var i = 0; i < this._data.length; i++) {
                    mean += this._data[i];
                }
                this._n = this._data.length;
            }
            else {
                mean = this._data;
            }
            return (mean / this._n);
        }
    };
    Mean = __decorate([
        mco.role()
    ], Mean);
    exports.Mean = Mean;
});
