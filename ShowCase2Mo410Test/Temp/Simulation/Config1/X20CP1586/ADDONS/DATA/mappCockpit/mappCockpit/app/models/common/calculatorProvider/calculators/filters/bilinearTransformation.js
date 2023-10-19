var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BilinearTransformation = void 0;
    let BilinearTransformation = class BilinearTransformation {
        /**
         * Returns the highest supported filterorder.
         *
         * @readonly
         * @static
         * @type {number}
         * @memberof BilinearTransformation
         */
        static get filterOrderMax() {
            return this._filterOrderMax;
        }
        /**
         * Returns the lowest supported filterorder.
         *
         * @readonly
         * @static
         * @type {number}
         * @memberof BilinearTransformation
         */
        static get filterOrderMin() {
            return this._filterOrderMin;
        }
        constructor(order, Ts, bs, as_) {
            this.bz = []; /*! array of numerator z-coefficients*/
            this.az = []; /*! array of denominator z-coefficients*/
            this.TsV = []; /* internal variable */
            this.bV = []; /* internal variable */
            this.aV = []; /* internal variable */
            switch (order) {
                case 0:
                    this.clcOrder0(Ts, bs, as_);
                    break;
                case 1:
                    this.clcOrder1(Ts, bs, as_);
                    break;
                case 2:
                    this.clcOrder2(Ts, bs, as_);
                    break;
                case 3:
                    this.clcOrder3(Ts, bs, as_);
                    break;
                case 4:
                    this.clcOrder4(Ts, bs, as_);
                    break;
                case 5:
                    this.clcOrder5(Ts, bs, as_);
                    break;
                default:
            }
        }
        clcOrder0(Ts, bs, as_) {
            this.bz[0] = bs[0];
            this.az[0] = as_[0];
        }
        clcOrder1(Ts, bs, as_) {
            this.bz[0] = bs[0] * Ts - bs[1] * 2.0;
            this.bz[1] = bs[0] * Ts + bs[1] * 2.0;
            this.az[0] = as_[0] * Ts - as_[1] * 2.0;
            this.az[1] = as_[0] * Ts + as_[1] * 2.0;
        }
        clcOrder2(Ts, bs, as_) {
            this.TsV[1] = Ts;
            this.TsV[2] = Ts * this.TsV[1];
            this.bV[0] = bs[0] * this.TsV[2];
            this.aV[0] = as_[0] * this.TsV[2];
            this.bV[1] = bs[1] * this.TsV[1] * 2.0;
            this.aV[1] = as_[1] * this.TsV[1] * 2.0;
            this.bV[2] = bs[2] * 4.0;
            this.aV[2] = as_[2] * 4.0;
            this.bz[0] = this.bV[0] - this.bV[1] + this.bV[2];
            this.bz[1] = this.bV[0] * 2.0 - this.bV[2] * 2.0;
            this.bz[2] = this.bV[0] + this.bV[1] + this.bV[2];
            this.az[0] = this.aV[0] - this.aV[1] + this.aV[2];
            this.az[1] = this.aV[0] * 2.0 - this.aV[2] * 2.0;
            this.az[2] = this.aV[0] + this.aV[1] + this.aV[2];
        }
        clcOrder3(Ts, bs, as_) {
            this.TsV[1] = Ts;
            this.TsV[2] = Ts * this.TsV[1];
            this.TsV[3] = Ts * this.TsV[2];
            this.bV[0] = bs[0] * this.TsV[3];
            this.aV[0] = as_[0] * this.TsV[3];
            this.bV[1] = bs[1] * this.TsV[2] * 2.0;
            this.aV[1] = as_[1] * this.TsV[2] * 2.0;
            this.bV[2] = bs[2] * this.TsV[1] * 4.0;
            this.aV[2] = as_[2] * this.TsV[1] * 4.0;
            this.bV[3] = bs[3] * 8.0;
            this.aV[3] = as_[3] * 8.0;
            this.bz[0] = this.bV[0] - this.bV[1] + this.bV[2] - this.bV[3];
            this.bz[1] = this.bV[0] * 3.0 - this.bV[1] - this.bV[2] + this.bV[3] * 3.0;
            this.bz[2] = this.bV[0] * 3.0 + this.bV[1] - this.bV[2] - this.bV[3] * 3.0;
            this.bz[3] = this.bV[0] + this.bV[1] + this.bV[2] + this.bV[3];
            this.az[0] = this.aV[0] - this.aV[1] + this.aV[2] - this.aV[3];
            this.az[1] = this.aV[0] * 3.0 - this.aV[1] - this.aV[2] + this.aV[3] * 3.0;
            this.az[2] = this.aV[0] * 3.0 + this.aV[1] - this.aV[2] - this.aV[3] * 3.0;
            this.az[3] = this.aV[0] + this.aV[1] + this.aV[2] + this.aV[3];
        }
        clcOrder4(Ts, bs, as_) {
            this.TsV[1] = Ts;
            this.TsV[2] = Ts * this.TsV[1];
            this.TsV[3] = Ts * this.TsV[2];
            this.TsV[4] = Ts * this.TsV[3];
            this.bV[0] = bs[0] * this.TsV[4];
            this.aV[0] = as_[0] * this.TsV[4];
            this.bV[1] = bs[1] * this.TsV[3] * 2.0;
            this.aV[1] = as_[1] * this.TsV[3] * 2.0;
            this.bV[2] = bs[2] * this.TsV[2] * 4.0;
            this.aV[2] = as_[2] * this.TsV[2] * 4.0;
            this.bV[3] = bs[3] * this.TsV[1] * 8.0;
            this.aV[3] = as_[3] * this.TsV[1] * 8.0;
            this.bV[4] = bs[4] * 16.0;
            this.aV[4] = as_[4] * 16.0;
            this.bz[0] = this.bV[0] - this.bV[1] + this.bV[2] - this.bV[3] + this.bV[4];
            this.bz[1] = this.bV[0] * 4.0 - this.bV[1] * 2.0 + this.bV[3] * 2.0 - this.bV[4] * 4.0;
            this.bz[2] = this.bV[0] * 6.0 - this.bV[2] * 2.0 + this.bV[4] * 6.0;
            this.bz[3] = this.bV[0] * 4.0 + this.bV[1] * 2.0 - this.bV[3] * 2.0 - this.bV[4] * 4.0;
            this.bz[4] = this.bV[0] + this.bV[1] + this.bV[2] + this.bV[3] + this.bV[4];
            this.az[0] = this.aV[0] - this.aV[1] + this.aV[2] - this.aV[3] + this.aV[4];
            this.az[1] = this.aV[0] * 4.0 - this.aV[1] * 2.0 + this.aV[3] * 2.0 - this.aV[4] * 4.0;
            this.az[2] = this.aV[0] * 6.0 - this.aV[2] * 2.0 + this.aV[4] * 6.0;
            this.az[3] = this.aV[0] * 4.0 + this.aV[1] * 2.0 - this.aV[3] * 2.0 - this.aV[4] * 4.0;
            this.az[4] = this.aV[0] + this.aV[1] + this.aV[2] + this.aV[3] + this.aV[4];
        }
        clcOrder5(Ts, bs, as_) {
            this.TsV[1] = Ts;
            this.TsV[2] = Ts * this.TsV[1];
            this.TsV[3] = Ts * this.TsV[2];
            this.TsV[4] = Ts * this.TsV[3];
            this.TsV[5] = Ts * this.TsV[4];
            this.bV[0] = bs[0] * this.TsV[5];
            this.aV[0] = as_[0] * this.TsV[5];
            this.bV[1] = bs[1] * this.TsV[4] * 2.0;
            this.aV[1] = as_[1] * this.TsV[4] * 2.0;
            this.bV[2] = bs[2] * this.TsV[3] * 4.0;
            this.aV[2] = as_[2] * this.TsV[3] * 4.0;
            this.bV[3] = bs[3] * this.TsV[2] * 8.0;
            this.aV[3] = as_[3] * this.TsV[2] * 8.0;
            this.bV[4] = bs[4] * this.TsV[1] * 16.0;
            this.aV[4] = as_[4] * this.TsV[1] * 16.0;
            this.bV[5] = bs[5] * 32.0;
            this.aV[5] = as_[5] * 32.0;
            this.bz[0] = this.bV[0] - this.bV[1] + this.bV[2] - this.bV[3] + this.bV[4] - this.bV[5];
            this.bz[1] = this.bV[0] * 5.0 - this.bV[1] * 3.0 + this.bV[2] + this.bV[3] - this.bV[4] * 3.0 + this.bV[5] * 5.0;
            this.bz[2] = this.bV[0] * 10.0 - this.bV[1] * 2.0 - this.bV[2] * 2.0 + this.bV[3] * 2.0 + this.bV[4] * 2.0 - this.bV[5] * 10.0;
            this.bz[3] = this.bV[0] * 10.0 + this.bV[1] * 2.0 - this.bV[2] * 2.0 - this.bV[3] * 2.0 + this.bV[4] * 2.0 + this.bV[5] * 10.0;
            this.bz[4] = this.bV[0] * 5.0 + this.bV[1] * 3.0 + this.bV[2] - this.bV[3] - this.bV[4] * 3.0 - this.bV[5] * 5.0;
            this.bz[5] = this.bV[0] + this.bV[1] + this.bV[2] + this.bV[3] + this.bV[4] + this.bV[5];
            this.az[0] = this.aV[0] - this.aV[1] + this.aV[2] - this.aV[3] + this.aV[4] - this.aV[5];
            this.az[1] = this.aV[0] * 5.0 - this.aV[1] * 3.0 + this.aV[2] + this.aV[3] - this.aV[4] * 3.0 + this.aV[5] * 5.0;
            this.az[2] = this.aV[0] * 10.0 - this.aV[1] * 2.0 - this.aV[2] * 2.0 + this.aV[3] * 2.0 + this.aV[4] * 2.0 - this.aV[5] * 10.0;
            this.az[3] = this.aV[0] * 10.0 + this.aV[1] * 2.0 - this.aV[2] * 2.0 - this.aV[3] * 2.0 + this.aV[4] * 2.0 + this.aV[5] * 10.0;
            this.az[4] = this.aV[0] * 5.0 + this.aV[1] * 3.0 + this.aV[2] - this.aV[3] - this.aV[4] * 3.0 - this.aV[5] * 5.0;
            this.az[5] = this.aV[0] + this.aV[1] + this.aV[2] + this.aV[3] + this.aV[4] + this.aV[5];
        }
    };
    BilinearTransformation._filterOrderMin = 0;
    BilinearTransformation._filterOrderMax = 5;
    BilinearTransformation = __decorate([
        mco.role()
    ], BilinearTransformation);
    exports.BilinearTransformation = BilinearTransformation;
});
