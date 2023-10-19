define(["require", "exports", "./bilinearTransformation", "./stateSpaceCalculator"], function (require, exports, bilinearTransformation_1, stateSpaceCalculator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Butterworth = void 0;
    class Butterworth {
        /**
         * Returns the highest supported filterorder.
         *
         * @readonly
         * @static
         * @type {number}
         * @memberof Butterworth
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
         * @memberof Butterworth
         */
        static get filterOrderMin() {
            return this._filterOrderMin;
        }
        constructor(order, cutoffFrequencyHz, Ts) {
            /*Coefficients of a normalised Butterworth filter*/
            this.P21 = 1.41421356;
            this.P31 = 2;
            this.P32 = 2;
            this.P41 = 2.61312592;
            this.P42 = 3.41421356;
            this.P43 = 2.61312592;
            this.P51 = 3.23606797;
            this.P52 = 5.23606797;
            this.P53 = 5.23606797;
            this.P54 = 3.23606797;
            this.Num = [];
            this.Den = [];
            // initialize the numerator and denumerator for the butterworth filter
            this.initNumDen(order, cutoffFrequencyHz);
            // convert the parameters into the discrete time system "world"
            var bilinearTransformation = new bilinearTransformation_1.BilinearTransformation(order, Ts, this.Num, this.Den);
            // create and init the state space object
            this.stateSpaceCalculator = new stateSpaceCalculator_1.StateSpaceCalculator(order, bilinearTransformation.bz, bilinearTransformation.az, this.Num[0], this.Den[0]);
        }
        initNumDen(order, cutoffFrequencyHz) {
            /* tslint:disable:max-func-body-length */ // disabled due to switch case
            /* angular frequency calculation (rad/s) */
            var wc = 2 * Math.PI * cutoffFrequencyHz;
            /*calculation of terms in the transfer functions*/
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
                    this.Num[0] = Math.pow(wc, 2);
                    this.Num[1] = 0;
                    this.Num[2] = 0;
                    this.Num[3] = 0;
                    this.Num[4] = 0;
                    this.Num[5] = 0;
                    this.Den[0] = Math.pow(wc, 2);
                    this.Den[1] = this.P21 * wc;
                    this.Den[2] = 1;
                    this.Den[3] = 0;
                    this.Den[4] = 0;
                    this.Den[5] = 0;
                    break;
                case 3:
                    this.Num[0] = Math.pow(wc, 3);
                    this.Num[1] = 0;
                    this.Num[2] = 0;
                    this.Num[3] = 0;
                    this.Num[4] = 0;
                    this.Num[5] = 0;
                    this.Den[0] = Math.pow(wc, 3);
                    this.Den[1] = this.P32 * Math.pow(wc, 2);
                    this.Den[2] = this.P31 * wc;
                    this.Den[3] = 1;
                    this.Den[4] = 0;
                    this.Den[5] = 0;
                    break;
                case 4:
                    this.Num[0] = Math.pow(wc, 4);
                    this.Num[1] = 0;
                    this.Num[2] = 0;
                    this.Num[3] = 0;
                    this.Num[4] = 0;
                    this.Num[5] = 0;
                    this.Den[0] = Math.pow(wc, 4);
                    this.Den[1] = this.P43 * Math.pow(wc, 3);
                    this.Den[2] = this.P42 * Math.pow(wc, 2);
                    this.Den[3] = this.P41 * wc;
                    this.Den[4] = 1;
                    this.Den[5] = 0;
                    break;
                case 5:
                    this.Num[0] = Math.pow(wc, 5);
                    this.Num[1] = 0;
                    this.Num[2] = 0;
                    this.Num[3] = 0;
                    this.Num[4] = 0;
                    this.Num[5] = 0;
                    this.Den[0] = Math.pow(wc, 5);
                    this.Den[1] = this.P54 * Math.pow(wc, 4);
                    this.Den[2] = this.P53 * Math.pow(wc, 3);
                    this.Den[3] = this.P52 * Math.pow(wc, 2);
                    this.Den[4] = this.P51 * wc;
                    this.Den[5] = 1;
                    break;
            }
            /* tslint:enable:max-func-body-length */
        }
        filter(inputSignal) {
            return this.stateSpaceCalculator.ClcOutputVector(inputSignal);
        }
    }
    exports.Butterworth = Butterworth;
    Butterworth._filterOrderMin = 1;
    Butterworth._filterOrderMax = 5;
});
