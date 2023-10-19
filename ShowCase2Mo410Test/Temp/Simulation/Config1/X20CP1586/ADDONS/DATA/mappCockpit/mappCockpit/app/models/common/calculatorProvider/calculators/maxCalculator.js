var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../point", "../calculationDataPoints", "../calculationDataDisplayInfo", "./calculatorBase", "../calculationDataNumberOrPoints", "./calculatorHelper"], function (require, exports, point_1, calculationDataPoints_1, calculationDataDisplayInfo_1, calculatorBase_1, calculationDataNumberOrPoints_1, calculatorHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MaxCalculator = void 0;
    let MaxCalculator = class MaxCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("max", "Max (a,b)", "Maximum value between two signals or one signal and one constant");
            this.inputId1 = "InputSignalOrConstantA";
            this.inputId2 = "InputSignalOrConstantB";
            this.inputName1 = "Input signal/constant a";
            this.inputName2 = "Input signal/constant b";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "max";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            defaultInputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputId1, this.inputName1, 0, "Signal or constant a", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            defaultInputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputId2, this.inputName2, 0, "Signal or constant b", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
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
            let inputSignalA = calculationInputDataContainer[0];
            let inputSignalB = calculationInputDataContainer[1];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignalA.data) && calculatorHelper_1.CalculatorHelper.isValidSignal(inputSignalA.data)
                && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignalB.data) && calculatorHelper_1.CalculatorHelper.isValidSignal(inputSignalB.data)) {
                let preparedPointArrays = calculatorHelper_1.CalculatorHelper.filterMatchingPointsByXvalue({
                    pointArray1: inputSignalA.data,
                    pointArray2: inputSignalB.data
                });
                inputSignalA.data = preparedPointArrays.pointArray1;
                inputSignalB.data = preparedPointArrays.pointArray2;
                if (!calculatorHelper_1.CalculatorHelper.isValidSignal(inputSignalA.data) || !calculatorHelper_1.CalculatorHelper.isValidSignal(inputSignalB.data)) {
                    this.addErrorByType(calculatorBase_1.ErrorMessageType.NotEnoughCommonTimestamps, [inputSignalA.name, inputSignalB.name]);
                }
            }
        }
        verifyCalculationInputData() {
            super.verifyCalculationInputData();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let inputSignalA = calculationInputDataContainer[0];
            let inputSignalB = calculationInputDataContainer[1];
            if (inputSignalA == undefined || calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(inputSignalA.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName1]);
            }
            if (inputSignalB == undefined || calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(inputSignalB.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName2]);
            }
            if (this.hasErrors()) {
                return;
            }
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(inputSignalA.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(inputSignalB.data)) {
                this.addError("Calculation Error: It is not supported to operate with just two numbers!");
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let result = new Array();
            let inputSignalA = calculationInputDataContainer[0];
            let inputSignalB = calculationInputDataContainer[1];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignalA.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignalB.data)) {
                result = this.maxTwoSignals(inputSignalA.data, inputSignalB.data);
            }
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignalA.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(inputSignalB.data)) {
                result = this.maxConstToSignal(inputSignalA.data, inputSignalB.data);
            }
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(inputSignalA.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignalB.data)) {
                result = this.maxConstToSignal(inputSignalB.data, inputSignalA.data);
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
         * @memberof MaxCalculator
         */
        maxTwoSignals(inputSignal1, inputSignal2) {
            let points = new Array();
            if (inputSignal1.length == inputSignal2.length) { // Add only signals with same sample count
                for (let i = 0; i < inputSignal1.length; i++) {
                    let newX = inputSignal1[i].x;
                    let newY = inputSignal1[i].y;
                    if (newY < inputSignal2[i].y) {
                        newY = inputSignal2[i].y;
                    }
                    // check if signal two has same x value
                    if (inputSignal2[i].x == newX) {
                        points.push(new point_1.Point(newX, newY));
                    }
                    else {
                        // Add of two different signals(different x values) currently not possible
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
         * @memberof MaxCalculator
         */
        maxConstToSignal(inputSignal, inputNumber) {
            let points = new Array();
            for (let i = 0; i < inputSignal.length; i++) {
                let x = inputSignal[i].x;
                let y = inputSignal[i].y;
                if (y < inputNumber) {
                    y = inputNumber;
                }
                points.push(new point_1.Point(x, y));
            }
            return points;
        }
    };
    MaxCalculator = __decorate([
        mco.role()
    ], MaxCalculator);
    exports.MaxCalculator = MaxCalculator;
});
