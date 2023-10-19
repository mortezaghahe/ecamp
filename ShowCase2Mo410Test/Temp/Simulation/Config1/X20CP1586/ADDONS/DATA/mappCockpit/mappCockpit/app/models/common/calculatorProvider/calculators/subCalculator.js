var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../point", "../calculationDataPoints", "../calculationDataNumberOrPoints", "../calculationDataDisplayInfo", "./calculatorBase", "./calculatorHelper"], function (require, exports, point_1, calculationDataPoints_1, calculationDataNumberOrPoints_1, calculationDataDisplayInfo_1, calculatorBase_1, calculatorHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SubCalculator = void 0;
    let SubCalculator = class SubCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("sub", "Subtraction a-b", "Subtraction of one signals from another, a constant value from a signal or a signal from a constant value");
            this.inputId1 = "MinuendA";
            this.inputId2 = "SubtrahendB";
            this.inputName1 = "Minuend a";
            this.inputName2 = "Subtrahend b";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "difference";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            defaultInputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputId1, this.inputName1, 0, "The minuend", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            defaultInputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputId2, this.inputName2, 0, "The subtrahend", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            return defaultInputData;
        }
        getDefaultOutputData() {
            let defaultOutputData = super.getDefaultOutputData();
            defaultOutputData.push(new calculationDataPoints_1.CalculationDataPoints(this.outputId, this.outputName, this.outputValue, new Array()));
            return defaultOutputData;
        }
        prepareCalculationData() {
            super.prepareCalculationData();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let minuend = calculationInputDataContainer[0];
            let subtrahend = calculationInputDataContainer[1];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(minuend.data) && calculatorHelper_1.CalculatorHelper.isValidSignal(minuend.data)
                && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(subtrahend.data) && calculatorHelper_1.CalculatorHelper.isValidSignal(subtrahend.data)) {
                let preparedPointArrays = calculatorHelper_1.CalculatorHelper.filterMatchingPointsByXvalue({
                    pointArray1: minuend.data,
                    pointArray2: subtrahend.data
                });
                minuend.data = preparedPointArrays.pointArray1;
                subtrahend.data = preparedPointArrays.pointArray2;
                if (!calculatorHelper_1.CalculatorHelper.isValidSignal(minuend.data) || !calculatorHelper_1.CalculatorHelper.isValidSignal(subtrahend.data)) {
                    this.addErrorByType(calculatorBase_1.ErrorMessageType.NotEnoughCommonTimestamps, [minuend.name, subtrahend.name]);
                }
            }
        }
        verifyCalculationInputData() {
            super.verifyCalculationInputData();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let minuend = calculationInputDataContainer[0];
            let subtrahend = calculationInputDataContainer[1];
            if (minuend == undefined || calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(minuend.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName1]);
            }
            if (subtrahend == undefined || calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(subtrahend.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName2]);
            }
            if (this.hasErrors()) {
                return;
            }
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(minuend.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(subtrahend.data)) {
                this.addError("Calculation Error: It is not supported to operate with just two numbers!");
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let result = new Array();
            let minuend = calculationInputDataContainer[0];
            let subtrahend = calculationInputDataContainer[1];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(minuend.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(subtrahend.data)) {
                result = this.subTwoSignals(minuend.data, subtrahend.data);
            }
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(minuend.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(subtrahend.data)) {
                result = this.subConstFromSignal(minuend.data, subtrahend.data);
            }
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(minuend.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(subtrahend.data)) {
                result = this.subSignalFromConst(minuend.data, subtrahend.data);
            }
            this.addCalculationOutputData({
                data: result,
                value: this.outputValue,
                name: this.outputName,
                id: this.outputId
            });
        }
        /**
         * Calculates output signal when input is Signal and Signal
         *
         * @private
         * @param {Array<IPoint>} inputSignal1
         * @param {Array<IPoint>} inputSignal2
         * @returns {Array<IPoint>}
         * @memberof SubCalculator
         */
        subTwoSignals(inputSignal1, inputSignal2) {
            let points = new Array();
            if (inputSignal1.length == inputSignal2.length) { // Sub only signals with same sample count
                for (let i = 0; i < inputSignal1.length; i++) {
                    let newX = inputSignal1[i].x;
                    let newY = inputSignal1[i].y;
                    newY -= inputSignal2[i].y;
                    // check if signal two has same x value
                    if (inputSignal2[i].x == newX) {
                        points.push(new point_1.Point(newX, newY));
                    }
                    else {
                        // Sub of two different signals(different x values) currently not possible
                        this.addError("Calculation Error: The input signals don't have equal x (time) values!");
                        return new Array();
                    }
                }
            }
            else {
                this.addError("Calculation Error: The input signals don't have the same number of points!");
            }
            return points;
        }
        /**
         * Calculates output signal when input is Signal and Constant
         *
         * @private
         * @param {Array<IPoint>} inputSignal
         * @param {number} inputNumber
         * @returns {Array<IPoint>}
         * @memberof SubCalculator
         */
        subConstFromSignal(inputSignal, inputNumber) {
            let points = new Array();
            for (let i = 0; i < inputSignal.length; i++) {
                let x = inputSignal[i].x;
                let y = inputSignal[i].y - inputNumber;
                points.push(new point_1.Point(x, y));
            }
            return points;
        }
        /**
         * Calculates output signal when input is Constant and Signal
         *
         * @private
         * @param {number} inputNumber
         * @param {Array<IPoint>} inputSignal
         * @returns {Array<IPoint>}
         * @memberof SubCalculator
         */
        subSignalFromConst(inputNumber, inputSignal) {
            let points = new Array();
            for (let i = 0; i < inputSignal.length; i++) {
                let x = inputSignal[i].x;
                let y = inputNumber - inputSignal[i].y;
                points.push(new point_1.Point(x, y));
            }
            return points;
        }
    };
    SubCalculator = __decorate([
        mco.role()
    ], SubCalculator);
    exports.SubCalculator = SubCalculator;
});
