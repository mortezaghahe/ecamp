var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./calculatorBase", "../calculationDataNumber", "../calculationDataPoints", "../calculationDataDisplayInfo", "./calculatorHelper", "../../point"], function (require, exports, calculatorBase_1, calculationDataNumber_1, calculationDataPoints_1, calculationDataDisplayInfo_1, calculatorHelper_1, point_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShiftTimeAxisCalculator = void 0;
    let ShiftTimeAxisCalculator = class ShiftTimeAxisCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("shift time axis", "Shift time axis", "Shifts a signal on the time axis by the defined delay time");
            this.inputId1 = "InputSignalA";
            this.inputId2 = "DelayTimeB";
            this.inputName1 = "Input signal a";
            this.inputName2 = "Delay time b [s]";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "shift time axis";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(this.inputId1, this.inputName1, "", new Array(), "The signal to be shifted", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            defaultInputData.push(new calculationDataNumber_1.CalculationDataNumber(this.inputId2, this.inputName2, 0, "Delay time in seconds", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, false)));
            return defaultInputData;
        }
        getDefaultOutputData() {
            let defaultOutputData = super.getDefaultOutputData();
            defaultOutputData.push(new calculationDataPoints_1.CalculationDataPoints(this.outputId, this.outputName, this.outputValue, new Array()));
            return defaultOutputData;
        }
        verifyCalculationInputData() {
            super.verifyCalculationInputData();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let inputSignal = calculationInputDataContainer[0];
            let inputNumber = calculationInputDataContainer[1];
            if (inputSignal == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignal.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName1]);
            }
            if (inputNumber == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(inputNumber.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName2]);
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            //retrieve calculation input data and initialize result
            let calculationInputData = this.getCalculationInputDataContainer();
            let result = new Array();
            let inputSignal = calculationInputData[0];
            let inputNumber = calculationInputData[1];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignal.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(inputNumber.data)) {
                result = this.calcTimeAxisShift(inputSignal.data, inputNumber.data);
            }
            this.addCalculationOutputData({
                data: result,
                value: this.outputValue,
                name: this.outputName,
                id: this.outputId
            });
        }
        /**
         * Calculate bitwise or with each Y-IPoint-Array value with the given number
         *
         * @private
         * @param {Array<IPoint>} inputSignal
         * @param {number} inputNumber
         * @returns {Array<IPoint>}
         * @memberof OrCalculator
         */
        calcTimeAxisShift(inputSignal, inputNumber) {
            let timeAxisShift = new Array();
            for (let i = 0; i < inputSignal.length; i++) {
                timeAxisShift.push(new point_1.Point(inputSignal[i].x + inputNumber, inputSignal[i].y));
            }
            return timeAxisShift;
        }
    };
    ShiftTimeAxisCalculator = __decorate([
        mco.role()
    ], ShiftTimeAxisCalculator);
    exports.ShiftTimeAxisCalculator = ShiftTimeAxisCalculator;
});
