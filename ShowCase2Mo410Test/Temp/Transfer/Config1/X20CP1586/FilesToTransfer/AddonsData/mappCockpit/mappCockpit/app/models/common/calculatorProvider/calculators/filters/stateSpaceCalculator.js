var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StateSpaceCalculator = void 0;
    let StateSpaceCalculator = class StateSpaceCalculator {
        constructor(nOrder /*! order */, bz /*! vector bz */, az /*! vector az */, bs0, as0) {
            this.bzN = []; /*! normalized vector bz */
            this.azN = []; /*! normalized vector az */
            this.presetCoeff = 0.0; /*! reference to preset coefficient */
            this.nOrder = 0;
            this.xz = []; /*! state-space vector xz */
            this.nOrder = nOrder;
            this.NormCoeffS(bz, az, bs0, as0);
        }
        ClcOutputVector(inputVector) {
            // initialize the state space vector so that the first ouput matches the first element in the input vector
            this.StateSpacePreset(inputVector[0]);
            var outputVector = [];
            for (var i = 0; i < inputVector.length; i++) {
                outputVector.push(this.StateSpace(inputVector[i]));
            }
            return outputVector;
        }
        NormCoeffS(bz /*! vector bz */, az /*! vector az */, bs0, as0) {
            var presetOK; /* internal variable */
            var iCnt; /* internal variable */
            if (this.nOrder > 0) /* regular case - 0 < nOrder <= 255 */ {
                this.bzN[this.nOrder] = bz[this.nOrder] / az[this.nOrder]; /* normalized bz[n] */
                for (iCnt = this.nOrder - 1; iCnt > 0; iCnt--) /* normalized az & bz (index n-1..1) */ {
                    this.azN[iCnt] = az[iCnt] / az[this.nOrder]; /* normalized az[i] & bz[i], i=n-1..1 */
                    this.bzN[iCnt] = bz[iCnt] / az[this.nOrder] - this.azN[iCnt] * this.bzN[this.nOrder];
                } /* end for() */
                this.azN[0] = az[0] / az[this.nOrder]; /* normalized az[0] & bz[0] */
                this.bzN[0] = bz[0] / az[this.nOrder] - this.azN[0] * this.bzN[this.nOrder];
                this.azN[this.nOrder] = 1.0; /* normalized az[n] */
                if (Math.abs(bs0) <= Number.MIN_VALUE) /* preset of state space output y=y0 is not possible, only reset (y0=0) works */ {
                    this.presetCoeff = 0.0;
                    presetOK = false;
                }
                else /* preset of state space output y = y0 is possible */ {
                    this.presetCoeff = as0 / bs0;
                    presetOK = true;
                } /* end if(ABS(bs0) < FLT_EPSILON) */
            }
            else /* special case - nOrder = 0 */ {
                this.bzN[0] = bz[0] / az[0]; /* normalized bz[n] & az[0] */
                this.azN[0] = 1.0;
                this.presetCoeff = 0.0;
                presetOK = true;
            } /* end if(nOrder > 0) */
            return presetOK;
        } /* end NormCoeffS() */
        /*! \brief Initialize state-space output y with init value y0. */
        StateSpacePreset(y0 /*! init output value */) {
            var iCnt = 0; /*internal variable*/
            var u0 = 0; /*internal variables*/
            var xzn = 0; /*internal variables*/
            if (this.nOrder > 0) /* regular case - 0 < nOrder <= 255 */ {
                u0 = y0 * this.presetCoeff; /* y0 = xz[n-1] + bzN[n] * u0 */
                xzn = y0 - this.bzN[this.nOrder] * u0;
                this.xz[0] = 0.0 - this.azN[0] * xzn + this.bzN[0] * u0; /* xz[0] */
                for (iCnt = 1; iCnt < (this.nOrder - 1); iCnt++) /* state vector (index 1..n-1) */ {
                    this.xz[iCnt] = this.xz[iCnt - 1] - this.azN[iCnt] * xzn + this.bzN[iCnt] * u0; /* xz[i], i=1..n-1 */
                } /* end for() */
                this.xz[this.nOrder - 1] = xzn;
            } /* end if(nOrder > 0) */
            return;
        } /* end StateSpacePreset() */
        /*! \brief Time discrete SISO state-space system. */
        StateSpace(u /*! input */) {
            var iCnt = 0; /* internal variable */
            var xzn = 0.0; /* internal variable */
            var y = 0.0; /* internal variable */
            if (this.nOrder > 0) /* regular case - 0 < nOrder <= 255 */ {
                y = this.xz[this.nOrder - 1] + this.bzN[this.nOrder] * u; /* output y */
                for (xzn = this.xz[this.nOrder - 1], iCnt = this.nOrder - 1; iCnt > 0; iCnt--) /* new state vector (index n-1..1) */ {
                    this.xz[iCnt] = this.xz[iCnt - 1] - this.azN[iCnt] * xzn + this.bzN[iCnt] * u; /* xz[i], i=n-1..1 */
                } /* end for() */
                this.xz[0] = 0.0 - this.azN[0] * xzn + this.bzN[0] * u; /* xz[0] */
            }
            else /* special case - nOrder = 0 */ {
                y = this.bzN[0] * u; /* output y */
            } /* end if(nOrder > 0) */
            return y;
        } /* end StateSpace() */
    };
    StateSpaceCalculator = __decorate([
        mco.role()
    ], StateSpaceCalculator);
    exports.StateSpaceCalculator = StateSpaceCalculator;
});
