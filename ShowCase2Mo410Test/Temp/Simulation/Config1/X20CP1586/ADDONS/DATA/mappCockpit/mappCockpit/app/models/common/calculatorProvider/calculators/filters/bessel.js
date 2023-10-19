var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./bilinearTransformation", "./stateSpaceCalculator"], function (require, exports, bilinearTransformation_1, stateSpaceCalculator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bessel = void 0;
    let Bessel = class Bessel {
        /**
         * Returns the highest supported filterorder.
         *
         * @readonly
         * @static
         * @type {number}
         * @memberof Bessel
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
         * @memberof Bessel
         */
        static get filterOrderMin() {
            return this._filterOrderMin;
        }
        constructor(order, cutoffFrequencyHz, Ts) {
            /* Frequency scaling factors for bessel filter */
            this.KB2 = 1.272;
            this.KB3 = 1.405;
            this.KB4 = 1.514;
            this.KB5 = 1.622;
            /*Coefficients of a normalised Bessel filter*/
            this.B21 = 1.732050807588;
            this.B31 = 2.432880798339;
            this.B32 = 2.466212074330;
            this.B41 = 3.123939936920;
            this.B42 = 4.391550328368;
            this.B43 = 3.201085872943;
            this.B51 = 3.810701205349;
            this.B52 = 6.776673715676;
            this.B53 = 6.886367652423;
            this.B54 = 3.936283427035;
            this.Num = [];
            this.Den = [];
            // initialize the numerator and denumerator for the bessel filter
            this.initNumDen(order, cutoffFrequencyHz);
            // convert the parameters into the discrete time system "world"
            var bilinearTransformation = new bilinearTransformation_1.BilinearTransformation(order, Ts, this.Num, this.Den);
            // create and init the state space object
            this.stateSpaceCalculator = new stateSpaceCalculator_1.StateSpaceCalculator(order, bilinearTransformation.bz, bilinearTransformation.az, this.Num[0], this.Den[0]);
        }
        initNumDen(order, cutoffFrequencyHz) {
            /* tslint:disable:max-func-body-length */ // disabled due to switch case
            var wc = 2 * Math.PI * cutoffFrequencyHz;
            switch (order) {
                case 1:
                    this.Num[0] = wc;
                    this.Num[1] = 0;
                    this.Num[2] = 0;
                    this.Num[3] = 0;
                    this.Num[4] = 0;
                    this.Num[5] = 0;
                    this.Den[0] = wc;
                    this.Den[1] = 1;
                    this.Den[2] = 0;
                    this.Den[3] = 0;
                    this.Den[4] = 0;
                    this.Den[5] = 0;
                    break;
                case 2:
                    wc = wc * this.KB2;
                    this.Num[0] = Math.pow(wc, 2);
                    this.Num[1] = 0;
                    this.Num[2] = 0;
                    this.Num[3] = 0;
                    this.Num[4] = 0;
                    this.Num[5] = 0;
                    this.Den[0] = Math.pow(wc, 2);
                    this.Den[1] = this.B21 * wc;
                    this.Den[2] = 1;
                    this.Den[3] = 0;
                    this.Den[4] = 0;
                    this.Den[5] = 0;
                    break;
                case 3:
                    wc = wc * this.KB3;
                    this.Num[0] = Math.pow(wc, 3);
                    this.Num[1] = 0;
                    this.Num[2] = 0;
                    this.Num[3] = 0;
                    this.Num[4] = 0;
                    this.Num[5] = 0;
                    this.Den[0] = Math.pow(wc, 3);
                    this.Den[1] = this.B32 * Math.pow(wc, 2);
                    this.Den[2] = this.B31 * wc;
                    this.Den[3] = 1;
                    this.Den[4] = 0;
                    this.Den[5] = 0;
                    break;
                case 4:
                    wc = wc * this.KB4;
                    this.Num[0] = Math.pow(wc, 4);
                    this.Num[1] = 0;
                    this.Num[2] = 0;
                    this.Num[3] = 0;
                    this.Num[4] = 0;
                    this.Num[5] = 0;
                    this.Den[0] = Math.pow(wc, 4);
                    this.Den[1] = this.B43 * Math.pow(wc, 3);
                    this.Den[2] = this.B42 * Math.pow(wc, 2);
                    this.Den[3] = this.B41 * wc;
                    this.Den[4] = 1;
                    this.Den[5] = 0;
                    break;
                case 5:
                    wc = wc * this.KB5;
                    this.Num[0] = Math.pow(wc, 5);
                    this.Num[1] = 0;
                    this.Num[2] = 0;
                    this.Num[3] = 0;
                    this.Num[4] = 0;
                    this.Num[5] = 0;
                    this.Den[0] = Math.pow(wc, 5);
                    this.Den[1] = this.B54 * Math.pow(wc, 4);
                    this.Den[2] = this.B53 * Math.pow(wc, 3);
                    this.Den[3] = this.B52 * Math.pow(wc, 2);
                    this.Den[4] = this.B51 * wc;
                    this.Den[5] = 1;
                    break;
            }
            /* tslint:enable:max-func-body-length */
        }
        filter(inputSignal) {
            return this.stateSpaceCalculator.ClcOutputVector(inputSignal);
        }
    };
    Bessel._filterOrderMin = 1;
    Bessel._filterOrderMax = 5;
    Bessel = __decorate([
        mco.role()
    ], Bessel);
    exports.Bessel = Bessel;
});
