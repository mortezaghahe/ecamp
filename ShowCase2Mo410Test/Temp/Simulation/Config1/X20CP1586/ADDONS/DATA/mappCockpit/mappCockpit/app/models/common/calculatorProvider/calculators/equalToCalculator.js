var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./calculatorBase", "../calculationDataPoints", "../calculationDataNumberOrPoints", "../../point", "../calculationDataDisplayInfo", "./calculatorHelper"], function (require, exports, calculatorBase_1, calculationDataPoints_1, calculationDataNumberOrPoints_1, point_1, calculationDataDisplayInfo_1, calculatorHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EqualToCalculator = void 0;
    let EqualToCalculator = class EqualToCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("equal to", "Equal to a = b", "Applies equal to comparison: input a = input b");
            this.inputId1 = "InputSignalOrConstantA";
            this.inputId2 = "InputSignalOrConstantB";
            this.inputName1 = "Input signal or constant a";
            this.inputName2 = "Input signal or constant b";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "equal to";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            defaultInputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputId1, this.inputName1, 0, "Input is a signal: Each Y value of the signal is used for equal to comparison; Input is a constant: Constant used for equal to comparison", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            defaultInputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputId2, this.inputName2, 0, "Input is a signal: Each Y value of the signal is used for equal to comparison; Input is a constant: Constant used for equal to comparison", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
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
            let inputData1 = calculationInputDataContainer[0];
            let inputData2 = calculationInputDataContainer[1];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputData1.data) && calculatorHelper_1.CalculatorHelper.isValidSignal(inputData1.data)
                && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputData2.data) && calculatorHelper_1.CalculatorHelper.isValidSignal(inputData2.data)) {
                let preparedPointArrays = calculatorHelper_1.CalculatorHelper.filterMatchingPointsByXvalue({
                    pointArray1: inputData1.data,
                    pointArray2: inputData2.data
                });
                calculationInputDataContainer[0].data = preparedPointArrays.pointArray1;
                calculationInputDataContainer[1].data = preparedPointArrays.pointArray2;
                if (!calculatorHelper_1.CalculatorHelper.isValidSignal(inputData1.data) || !calculatorHelper_1.CalculatorHelper.isValidSignal(inputData2.data)) {
                    this.addErrorByType(calculatorBase_1.ErrorMessageType.NotEnoughCommonTimestamps, [inputData1.name, inputData2.name]);
                }
            }
        }
        verifyCalculationInputData() {
            super.verifyCalculationInputData();
            //retrieve calculation input data
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let inputData1 = calculationInputDataContainer[0];
            let inputData2 = calculationInputDataContainer[1];
            if (inputData1 == undefined || calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(inputData1.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName1]);
            }
            if (inputData2 == undefined || calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(inputData2.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName2]);
            }
            if (this.hasErrors()) {
                return;
            }
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(inputData1.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(inputData2.data)) {
                this.addError("Calculation Error: It is not supported to operate with just two numbers!");
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            //retrieve calculation input data and initialize result
            let calculationInputData = this.getCalculationInputDataContainer();
            let result = new Array();
            let inputData1 = calculationInputData[0];
            let inputData2 = calculationInputData[1];
            //input1 = signal input2 = constant
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputData1.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(inputData2.data)) {
                result = this.calcSignalEqualToConstant(inputData1.data, inputData2.data);
            }
            //input1 = constant input2 = signal
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(inputData1.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputData2.data)) {
                result = this.calcConstantEqualToSignal(inputData1.data, inputData2.data);
            }
            //input1 = signal input2 = signal
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputData1.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputData2.data)) {
                result = this.calcSignalEqualToSignal(inputData1.data, inputData2.data);
            }
            //add the result of the calculation to the calculationOutpuContainer
            this.addCalculationOutputData({
                data: result,
                value: this.outputValue,
                name: this.outputName,
                id: this.outputId
            });
        }
        /**
         * Calculate "equal to" comparison with each Y-IPoint-Array value and the given number
         * Comparison: Signal value = constant
         *
         * @private
         * @param {Array<IPoint>} inputSignal
         * @param {number} inputNumber
         * @returns {Array<IPoint>}
         * @memberof EqualToCalculator
         */
        calcSignalEqualToConstant(inputSignal, inputNumber) {
            let result = new Array();
            for (let i = 0; i < inputSignal.length; i++) {
                result.push(new point_1.Point(inputSignal[i].x, Number(inputSignal[i].y == inputNumber)));
            }
            return result;
        }
        /**
         * Calculate "equal to" comparison with the given number and each Y-IPoint-Array value
         * Comparison: constant = signal value
         *
         * @private
         * @param {number} inputNumber
         * @param {Array<IPoint>} inputSignal
         * @returns {Array<IPoint>}
         * @memberof EqualToCalculator
         */
        calcConstantEqualToSignal(inputNumber, inputSignal) {
            let result = new Array();
            for (let i = 0; i < inputSignal.length; i++) {
                result.push(new point_1.Point(inputSignal[i].x, Number(inputNumber == inputSignal[i].y)));
            }
            return result;
        }
        /**
         * Applies "equal to" comparision between two Y-IPoint-Array values
         *
         * @private
         * @param {Array<IPoint>} inputSignal1
         * @param {Array<IPoint>} inputSignal2
         * @returns {Array<IPoint>}
         * @memberof EqualToCalculator
         */
        calcSignalEqualToSignal(inputSignal1, inputSignal2) {
            let result = new Array();
            if (inputSignal1.length == inputSignal2.length) { // Compare only signals with same sample count     
                for (let i = 0; i < inputSignal1.length; i++) {
                    result.push(new point_1.Point(inputSignal1[i].x, Number(inputSignal1[i].y == inputSignal2[i].y)));
                }
            }
            else {
                this.addError("Calculation Error: The input signals don't have the same number of points!");
            }
            return result;
        }
    };
    EqualToCalculator = __decorate([
        mco.role()
    ], EqualToCalculator);
    exports.EqualToCalculator = EqualToCalculator;
});
