var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../calculationDataPoints", "../calculationDataDisplayInfo", "./calculatorBase", "./calculatorHelper", "./differential/diffVector"], function (require, exports, calculationDataPoints_1, calculationDataDisplayInfo_1, calculatorBase_1, calculatorHelper_1, diffVector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiffCalculator = void 0;
    let DiffCalculator = class DiffCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("differentiate", "Differentiate dy/dt", "Differentiate a signal using the forward difference quotient");
            this.inputId = "InputSignal";
            this.inputName = "Input signal";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "gradient";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(this.inputId, this.inputName, "", new Array(), "The signal whose difference quotient is calculated", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
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
            if (inputSignal == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignal.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName]);
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let result = new Array();
            let inputSignal = calculationInputDataContainer[0];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignal.data)) {
                result = this.diffSignal(inputSignal.data);
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
         * @param {Array<IPoint>} inputSignal
         * @returns {Array<IPoint>}
         * @memberof DiffCalculator
         */
        diffSignal(inputSignal) {
            let points = new Array();
            let splittedSignal = calculatorHelper_1.CalculatorHelper.fromIPointArrayToNumberArray(inputSignal);
            let diffResult = diffVector_1.DiffVector.diffCalculate(splittedSignal.xArr, splittedSignal.yArr);
            points = calculatorHelper_1.CalculatorHelper.fromTwoNumberArrayToIPointArray(splittedSignal.xArr, diffResult);
            return points;
        }
    };
    DiffCalculator = __decorate([
        mco.role()
    ], DiffCalculator);
    exports.DiffCalculator = DiffCalculator;
});
