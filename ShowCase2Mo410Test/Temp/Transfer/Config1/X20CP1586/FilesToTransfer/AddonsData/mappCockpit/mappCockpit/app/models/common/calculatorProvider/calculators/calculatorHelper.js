var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../calculationDataPoints", "../../../../common/math/mathX", "../../point"], function (require, exports, calculationDataPoints_1, mathX_1, point_1) {
    "use strict";
    var CalculatorHelper_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CalculatorHelper = void 0;
    /**
     * Helper class for calculator to provide common functionalities only used in some calculators.
     *
     * @class CalculatorHelper
     */
    let CalculatorHelper = CalculatorHelper_1 = class CalculatorHelper {
        /**
         * Constructor set to private as Helper class should only provide static helper functions.
         * Creates an instance of CalculatorHelper.
         * @memberof CalculatorHelper
         */
        constructor() { }
        ;
        /**
         * Filters two input signals for matching signal parts.
         *
         * @static
         * @param {(Array<TCalculationData>)} inputData
         * @returns {(Array<TCalculationData>)}
         * @memberof CalculatorHelper
         */
        static tryFilterMatchingSignalParts(inputData) {
            let outputData = inputData;
            let input1 = inputData[0].getData();
            let input2 = inputData[1].getData();
            if (Array.isArray(input1) && Array.isArray(input2)
                && input1.length >= 2 && input2.length >= 2) { // only filter for matching signal parts if both inputs are valid signals
                let dataContainer = {
                    pointArray1: input1,
                    pointArray2: input2
                };
                dataContainer = CalculatorHelper_1.filterMatchingPointsByXvalue(dataContainer);
                //create new calculation data points with filtered signals to cut the connection with input data
                let dataPoints1 = new calculationDataPoints_1.CalculationDataPoints(inputData[0].id, inputData[0].getDisplayName(), inputData[0].value, dataContainer.pointArray1, inputData[0].description, inputData[0].displayInfo);
                let dataPoints2 = new calculationDataPoints_1.CalculationDataPoints(inputData[1].id, inputData[1].getDisplayName(), inputData[1].value, dataContainer.pointArray2, inputData[1].description, inputData[1].displayInfo);
                outputData = new Array();
                outputData.push(dataPoints1);
                outputData.push(dataPoints2);
            }
            return outputData;
        }
        /**
         * Gathers Samples of same timestamp from two signals.
         * Used to filter two signals for only the matching parts of the signal (by timestamp).
         *
         * @static
         * @param {TwoPointArraysContainer} input
         * @returns {TwoPointArraysContainer} Matching signal parts based on timestamp.
         * @memberof CalculatorHelper
         */
        static filterMatchingPointsByXvalue(input) {
            let gatheredPoints = {
                pointArray1: new Array(),
                pointArray2: new Array()
            };
            let i = 0;
            let j = 0;
            //extract samples with matching timestamps by iterating both signals at once.
            //worst case iteration amount is length of input1 + length of input2.
            while (i < input.pointArray1.length && j < input.pointArray2.length) {
                if (input.pointArray1[i].x < input.pointArray2[j].x) {
                    i++;
                }
                else if (input.pointArray1[i].x > input.pointArray2[j].x) {
                    j++;
                }
                else {
                    gatheredPoints.pointArray1.push(input.pointArray1[i]);
                    gatheredPoints.pointArray2.push(input.pointArray2[j]);
                    i++;
                    j++;
                }
            }
            return gatheredPoints;
        }
        /**
         * Estimates the sample time to remove jitterbased on median and rounding.
         *
         * @static
         * @param {Array<IPoint>} signalData
         * @returns {number}
         * @memberof CalculatorHelper
         */
        static estimateSampleTime(signalData) {
            let sampleTime = this.getMedianOfSampleTime(signalData);
            sampleTime = this.roundSampleTime(sampleTime);
            return sampleTime;
        }
        /**
         * Calculates the median of the sampletimes
         *
         * @private
         * @static
         * @param {Array<IPoint>} signalData
         * @returns {number}
         * @memberof CalculatorHelper
         */
        static getMedianOfSampleTime(signalData) {
            let sampleTimes = new Array();
            for (let i = 0; i < signalData.length - 1; i++) {
                let sampleTime = signalData[i + 1].x - signalData[i].x;
                sampleTimes.push(sampleTime);
            }
            let sampleTime = mathX_1.MathX.median(sampleTimes);
            return sampleTime;
        }
        /**
         * Rounds the sampletime
         *
         * @private
         * @static
         * @param {number} sampleTime
         * @returns
         * @memberof CalculatorHelper
         */
        static roundSampleTime(sampleTime) {
            sampleTime = sampleTime * 20000;
            sampleTime = Math.round(sampleTime);
            sampleTime = sampleTime / 20000;
            return sampleTime;
        }
        /**
         * Checks whether the Y values of a signal contain a non-finite/NaN value.
         *
         * @static
         * @param {Array<IPoint>} signal Signal to be checked.
         * @returns {boolean} Returns true if NaN or +/- Infinity is contained.
         * @memberof CalculatorHelper
         */
        static containsNaNOrInfinityInYvalue(signal) {
            let containsNaNOrInfinity = false;
            for (let i = 0; i < signal.length && !containsNaNOrInfinity; i++) {
                if (Number.isNaN(signal[i].y) || !Number.isFinite(signal[i].y)) {
                    containsNaNOrInfinity = true;
                }
            }
            return containsNaNOrInfinity;
        }
        /**
         * Returning true if array has NaN or infinity values
         *
         * @public
         * @static
         * @param {Array<number>} signalData
         * @returns {boolean}
         * @memberof StringMathjsCalculator
         */
        static arrayHasNaNOrInvinityValues(signalData) {
            for (let i = 0; i < signalData.length; i++) {
                if (isNaN(signalData[i]) || !isFinite(signalData[i])) {
                    return true;
                }
            }
            return false;
        }
        /**
         * Checks whether the signal has at least length of minimum
         *
         * @static
         * @param {Array<IPoint>} signal
         * @param {number} [minimum=2] The default minimum is 2.
         * @returns {boolean} Returns true if the signal length is equal or longer than minimum
         * @memberof CalculatorHelper
         */
        static isSignalLongerThanMinimum(signal, minimum = 2) {
            return signal.length >= minimum;
        }
        /**
         * Checks whether the given CalculationInputData is a signal.
         *
         * @static
         * @param {(Array<IPoint> | number | string)} calculationInputData
         * @returns {calculationInputData is Array<IPoint>}
         * @memberof CalculatorHelper
         */
        static calculationInputDataIsSignal(calculationInputData) {
            let isSignal = false;
            if (Array.isArray(calculationInputData)) {
                isSignal = true;
            }
            return isSignal;
        }
        /**
         * Checks whether the given CalculationInputData is a number.
         *
         * @static
         * @param {(Array<IPoint> | number | string)} calculationInputData
         * @returns {calculationInputData is number}
         * @memberof CalculatorHelper
         */
        static calculationInputDataIsNumber(calculationInputData) {
            let isNumber = false;
            if (typeof calculationInputData === "number") {
                isNumber = true;
            }
            return isNumber;
        }
        /**
         * Checks whether the given CalculationInputData is a string.
         *
         * @static
         * @param {(Array<IPoint> | number | string)} calculationInputData
         * @returns {calculationInputData is string}
         * @memberof CalculatorHelper
         */
        static calculationInputDataIsString(calculationInputData) {
            let isString = false;
            if (typeof calculationInputData === "string") {
                isString = true;
            }
            return isString;
        }
        /**
         * Validates a signal if it has at least two points and only valid (finite, non-NaN) Y values contained.
         *
         * @private
         * @static
         * @param {IPoint[]} signal
         * @returns {boolean} Returns true if signal is valid.
         * @memberof CalculatorHelper
         */
        static isValidSignal(signal) {
            let isValid = false;
            if (CalculatorHelper_1.isSignalLongerThanMinimum(signal) && !this.containsNaNOrInfinityInYvalue(signal)) {
                isValid = true;
            }
            return isValid;
        }
        /**
         * Validates a number if it is finite and non-NaN
         *
         * @private
         * @static
         * @param {number} num
         * @returns {boolean} Returns true if number is valid.
         * @memberof CalculatorHelper
         */
        static isValidNumber(num) {
            let isValid = false;
            if (!Number.isNaN(num) && Number.isFinite(num)) {
                isValid = true;
            }
            return isValid;
        }
        /**
         *
         * Returns the amount of 0 of Y-values in an IPoint Array
         *
         * @public
         * @static
         * @param {Array<IPoint>} arr
         * @returns {number}
         * @memberof CalculatorHelper
         */
        static amountOfZerosInIPointArrayInYValues(arr) {
            let cnt = 0;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].y == 0) {
                    ++cnt;
                }
            }
            return cnt;
        }
        /**
         * Return true when the Y values of an IPoint Array contain a floating type number
         *
         * @public
         * @static
         * @param {Array<IPoint>} inputSignal
         * @returns {boolean}
         * @memberof calculatorHelper
         */
        static iPointArrayHasFloatInYValues(inputSignal) {
            for (let i = 0; i < inputSignal.length; i++) {
                if (!Number.isSafeInteger(inputSignal[i].y)) {
                    return true;
                }
            }
            return false;
        }
        /**
         * Returns true, when the x values of the IPoint array are strictly monotonically increasing (each value is geater than the previous one).
         *
         * @static
         * @param {Array<IPoint>} inputSignal
         * @returns {boolean}
         * @memberof CalculatorHelper
         */
        static isStrictlyMonotonicallyIncreasingInTime(inputSignal) {
            return inputSignal.every((currentPoint, index, data) => {
                return (index !== 0) ? (currentPoint.x > data[index - 1].x) : true;
            });
        }
        /**
        * Split a IPoint Array into X-axis array and Y-axis array
        *
        * @static
        * @param {Array<IPoint>} iPointArrData
        * @returns {SplittedAxisValuesContainer}
        * @memberof CalculatorHelper
        */
        static fromIPointArrayToNumberArray(iPointArrData) {
            let splittedIPointArr = {
                xArr: new Array(),
                yArr: new Array()
            };
            for (let i = 0; i < iPointArrData.length; i++) {
                splittedIPointArr.xArr.push(iPointArrData[i].x);
                splittedIPointArr.yArr.push(iPointArrData[i].y);
            }
            return splittedIPointArr;
        }
        /**
         * Combining two Number Arrays same length to an Ipoint Array.
         * If the two Number Arrays don't have same size an empty Array gets returned
         *
         * @static
         * @param {Array<number>} arrX
         * @param {Array<number>} arrY
         * @returns {Array<IPoint>}
         * @memberof CalculatorHelper
         */
        static fromTwoNumberArrayToIPointArray(arrX, arrY) {
            let combinedIPointArr = new Array();
            if (arrX.length == arrY.length) {
                for (let i = 0; i < arrX.length; i++) {
                    let point = new point_1.Point(arrX[i], arrY[i]);
                    combinedIPointArr.push(point);
                }
            }
            return combinedIPointArr;
        }
    };
    CalculatorHelper = CalculatorHelper_1 = __decorate([
        mco.role()
    ], CalculatorHelper);
    exports.CalculatorHelper = CalculatorHelper;
});
