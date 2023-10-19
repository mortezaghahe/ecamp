var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiffVector = void 0;
    /**
     * Static class to execute the differential algortihm.
     *
     * @class diffVector
     */
    let DiffVector = class DiffVector {
        /**
         * Constructor set to private class should only provide static calculation functions.
         * Creates an instance of diffVector.
         * @memberof diffVector
         */
        constructor() { }
        ;
        /**
         * Calculate differential; If the input parameters are invalid an empty array get returned
         *
         * @public
         * @static
         * @param {Array<number>} inputSignalX
         * @param {Array<number>} inputSignalY
         * @returns {Array<number>} returns calculated Y Values
         * @memberof diffVector
         */
        static diffCalculate(inputSignalX, inputSignalY) {
            let outputSignal = new Array();
            if (inputSignalX.length == inputSignalY.length && inputSignalX.length > 0) {
                let dXTemp = inputSignalX[0];
                let dYTemp = inputSignalY[0];
                let closeNegativeValueToZero = -1E-10;
                let closePostiveValueToZero = 1E-10;
                for (let i = 0; i < inputSignalX.length - 1; i++) {
                    let dDiv = inputSignalX[i + 1] - dXTemp;
                    let dFact = inputSignalY[i + 1] - dYTemp;
                    let newYValue = dFact;
                    if ((dDiv < closeNegativeValueToZero) || (dDiv > closePostiveValueToZero)) { //Avoid division by zero
                        newYValue = dFact / dDiv;
                    }
                    if (i == 0) {
                        // Add start datapoint to get same points as in input
                        outputSignal.push(newYValue);
                    }
                    outputSignal.push(newYValue);
                    dXTemp = inputSignalX[i + 1];
                    dYTemp = inputSignalY[i + 1];
                }
            }
            return outputSignal;
        }
    };
    DiffVector = __decorate([
        mco.role()
    ], DiffVector);
    exports.DiffVector = DiffVector;
});
