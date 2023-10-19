var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./calculatorBase", "../calculationDataPoints", "../calculationDataNumberOrPoints", "../../point", "../calculationDataDisplayInfo", "./calculatorHelper", "../calculationDataNumber"], function (require, exports, calculatorBase_1, calculationDataPoints_1, calculationDataNumberOrPoints_1, point_1, calculationDataDisplayInfo_1, calculatorHelper_1, calculationDataNumber_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ModuloCalculator = void 0;
    let ModuloCalculator = class ModuloCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("modulo", "Modulo", "Modulo calculation between dividend a and divisor b");
            this.inputId1 = "DividendA";
            this.inputId2 = "DivisorB";
            this.inputId3 = "DivisionByZero";
            this.inputName1 = "Dividend a";
            this.inputName2 = "Divisor b";
            this.inputName3 = "Division by zero";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "modulo";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            defaultInputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputId1, this.inputName1, 0, "Input is a signal: Each Y value of the signal is used for modulo calculation; Input is a constant: Constant used for modulo calculation", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            defaultInputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputId2, this.inputName2, 0, "Input is a signal: Each Y value of the signal is used for modulo calculation; Input is a constant: Constant used for modulo calculation", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            defaultInputData.push(new calculationDataNumber_1.CalculationDataNumber(this.inputId3, this.inputName3, 0, "Select if zero in the divisor cause an error or should be removed", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(true, false, this.getDivisionByZeroErrorHandling())));
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
            let dividend = calculationInputDataContainer[0];
            let divisor = calculationInputDataContainer[1];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(dividend.data) && calculatorHelper_1.CalculatorHelper.isValidSignal(dividend.data)
                && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(divisor.data) && calculatorHelper_1.CalculatorHelper.isValidSignal(divisor.data)) {
                let preparedPointArrays = calculatorHelper_1.CalculatorHelper.filterMatchingPointsByXvalue({
                    pointArray1: dividend.data,
                    pointArray2: divisor.data
                });
                calculationInputDataContainer[0].data = preparedPointArrays.pointArray1;
                calculationInputDataContainer[1].data = preparedPointArrays.pointArray2;
                if (!calculatorHelper_1.CalculatorHelper.isValidSignal(dividend.data) || !calculatorHelper_1.CalculatorHelper.isValidSignal(divisor.data)) {
                    this.addErrorByType(calculatorBase_1.ErrorMessageType.NotEnoughCommonTimestamps, [dividend.name, divisor.name]);
                }
            }
        }
        /**
         * Review Lukas Obersamer:
         * The cyclomatic complexity of this function is too high, but that does not reflext the complexity for humans to understand it.
         * The complexity of understing this method is in fact super simple. It is a "flat list" of input checks. Therefore the method may remain in this form.
         *
         * @protected
         * @returns
         * @memberof ModuloCalculator
         */
        verifyCalculationInputData() {
            super.verifyCalculationInputData();
            //retrieve calculation input data
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let dividend = calculationInputDataContainer[0];
            let divisor = calculationInputDataContainer[1];
            let divisionByZero = calculationInputDataContainer[2];
            if (dividend == undefined || calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(dividend.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName1]);
            }
            if (divisor == undefined || calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(divisor.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName2]);
            }
            if (divisionByZero == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(divisionByZero.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName3]);
            }
            if (this.hasErrors()) {
                return;
            }
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(dividend.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(divisor.data)) {
                this.addError("Calculation Error: It is not supported to operate with just two numbers!");
            }
            //Checking if the divisor being a number is 0
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(divisor.data) && divisor.data === 0) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.NumberNotAllowedToBeZero, [this.inputName2]);
            }
            //Checking if the signal as divisor contains 0
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(divisor.data) && divisionByZero.data == 0 && calculatorHelper_1.CalculatorHelper.amountOfZerosInIPointArrayInYValues(divisor.data) != 0) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.ContainsZeroInYValues, [this.inputName2]);
            }
            //Checking if the signal as divisor contains more than two values which are not 0
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(divisor.data) && (divisor.data.length - calculatorHelper_1.CalculatorHelper.amountOfZerosInIPointArrayInYValues(divisor.data)) < 2) {
                this.addError("Calculation Error: The divisor being a signal has less than two values which are not 0");
            }
            //Checking if the input signal contains floating point numbers
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(dividend.data) && calculatorHelper_1.CalculatorHelper.iPointArrayHasFloatInYValues(dividend.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.ContainsFloatingNumbers, [this.inputName1]);
            }
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(divisor.data) && calculatorHelper_1.CalculatorHelper.iPointArrayHasFloatInYValues(divisor.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.ContainsFloatingNumbers, [this.inputName2]);
            }
            //Checking if the input number is a floating point numbers
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(dividend.data) && !Number.isSafeInteger(dividend.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.NumberIsNoInt, [this.inputName1]);
            }
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(divisor.data) && !Number.isSafeInteger(divisor.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.NumberIsNoInt, [this.inputName2]);
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
                result = this.calcSignalModuloConstant(inputData1.data, inputData2.data);
            }
            //input1 = constant input2 = signal
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(inputData1.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputData2.data)) {
                result = this.calcConstantModuloSignal(inputData1.data, inputData2.data);
            }
            //input1 = signal input2 = signal
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputData1.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputData2.data)) {
                result = this.calcSignalModuloSignal(inputData1.data, inputData2.data);
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
         * Calculate "modulo" with each Y-IPoint-Array value and the given number
         *
         * @private
         * @param {Array<IPoint>} inputSignal
         * @param {number} inputNumber
         * @returns {Array<IPoint>}
         * @memberof ModuloCalculator
         */
        calcSignalModuloConstant(inputSignal, inputNumber) {
            let result = new Array();
            for (let i = 0; i < inputSignal.length; i++) {
                if (inputNumber != 0) {
                    result.push(new point_1.Point(inputSignal[i].x, inputSignal[i].y % inputNumber));
                }
            }
            return result;
        }
        /**
         * Calculate "modulo" with the given number and each Y-IPoint-Array value
         *
         * @private
         * @param {number} inputNumber
         * @param {Array<IPoint>} inputSignal
         * @returns {Array<IPoint>}
         * @memberof ModuloCalculator
         */
        calcConstantModuloSignal(inputNumber, inputSignal) {
            let result = new Array();
            for (let i = 0; i < inputSignal.length; i++) {
                if (inputSignal[i].y != 0) {
                    result.push(new point_1.Point(inputSignal[i].x, inputNumber % inputSignal[i].y));
                }
            }
            return result;
        }
        /**
         * Applies "modulo" between two Y-IPoint-Array values
         *
         * @private
         * @param {Array<IPoint>} inputSignal1
         * @param {Array<IPoint>} inputSignal2
         * @returns {Array<IPoint>}
         * @memberof ModuloCalculator
         */
        calcSignalModuloSignal(inputSignal1, inputSignal2) {
            let result = new Array();
            if (inputSignal1.length == inputSignal2.length) { // Use only signals with same sample count for modulo calculation     
                for (let i = 0; i < inputSignal1.length; i++) {
                    if (inputSignal2[i].y != 0) {
                        result.push(new point_1.Point(inputSignal1[i].x, inputSignal1[i].y % inputSignal2[i].y));
                    }
                }
            }
            else {
                this.addError("Calculation Error: The input signals don't have the same number of points!");
            }
            return result;
        }
        /**
         * Returns the possibilities of a divison with 0
         *
         * @private
         * @returns {Array<IValueListItem>}
         * @memberof DivCalculator
         */
        getDivisionByZeroErrorHandling() {
            let divisionByZeroPossibilities = new Array();
            divisionByZeroPossibilities.push({ value: "0", displayValue: "Cause error" });
            divisionByZeroPossibilities.push({ value: "1", displayValue: "Points are removed" });
            return divisionByZeroPossibilities;
        }
    };
    ModuloCalculator = __decorate([
        mco.role()
    ], ModuloCalculator);
    exports.ModuloCalculator = ModuloCalculator;
});
