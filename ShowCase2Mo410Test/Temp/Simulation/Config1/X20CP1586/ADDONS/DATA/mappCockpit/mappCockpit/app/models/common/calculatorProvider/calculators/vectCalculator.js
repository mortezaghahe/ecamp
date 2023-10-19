var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../point", "../calculationDataPoints", "../calculationDataDisplayInfo", "./calculatorBase", "./calculatorHelper"], function (require, exports, point_1, calculationDataPoints_1, calculationDataDisplayInfo_1, calculatorBase_1, calculatorHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VectCalculator = void 0;
    let VectCalculator = class VectCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("vector ", "Vector length √(a\u00B2 + b\u00B2)", "2D vector length");
            this.inputId1 = "InputSignalA";
            this.inputId2 = "InputSignalB";
            this.inputName1 = "Input signal a";
            this.inputName2 = "Input signal b";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "vector";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(this.inputId1, this.inputName1, "", new Array(), "Signal a", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(this.inputId2, this.inputName2, "", new Array(), "Signal b", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
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
                if (!calculatorHelper_1.CalculatorHelper.isValidSignal(inputSignalA.data || !calculatorHelper_1.CalculatorHelper.isValidSignal(inputSignalB.data))) {
                    this.addErrorByType(calculatorBase_1.ErrorMessageType.NotEnoughCommonTimestamps, [inputSignalA.name, inputSignalB.name]);
                }
            }
        }
        verifyCalculationInputData() {
            super.verifyCalculationInputData();
            let calculcationInputDataContainer = this.getCalculationInputDataContainer();
            let inputSignalA = calculcationInputDataContainer[0];
            let inputSignalB = calculcationInputDataContainer[1];
            if (inputSignalA == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignalA.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName1]);
            }
            if (inputSignalB == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignalB.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName2]);
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let result = new Array();
            let inputSignalA = calculationInputDataContainer[0];
            let inputSignalB = calculationInputDataContainer[1];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignalA.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignalB.data)) {
                result = this.vectorSignal(inputSignalA.data, inputSignalB.data);
            }
            this.addCalculationOutputData({
                data: result,
                value: this.outputValue,
                name: this.outputName,
                id: this.outputId
            });
        }
        /**
         * Calculates output signal
         *
         * @private
         * @param {Array<IPoint>} inputSignal1
         * @param {Array<IPoint>} inputSignal2
         * @returns {Array<IPoint>}
         * @memberof VectCalculator
         */
        vectorSignal(inputSignal1, inputSignal2) {
            let points = new Array();
            if (inputSignal1.length == inputSignal2.length) { // Add only signals with same sample count
                for (let i = 0; i < inputSignal1.length; i++) {
                    let newX = inputSignal1[i].x;
                    let newY = Math.sqrt(Math.pow(inputSignal1[i].y, 2) + Math.pow(inputSignal2[i].y, 2));
                    if (inputSignal2[i].x == newX) {
                        points.push(new point_1.Point(newX, newY));
                    }
                    else {
                        // Vector calculation of two different signals(different x values) currently not possible
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
    };
    VectCalculator = __decorate([
        mco.role()
    ], VectCalculator);
    exports.VectCalculator = VectCalculator;
});
