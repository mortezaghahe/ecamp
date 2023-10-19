var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../point", "../calculationDataNumber", "../calculationDataPoints", "../calculationDataDisplayInfo", "./calculatorBase", "./calculatorHelper"], function (require, exports, point_1, calculationDataNumber_1, calculationDataPoints_1, calculationDataDisplayInfo_1, calculatorBase_1, calculatorHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExpCalculator = void 0;
    let ExpCalculator = class ExpCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("exponentiation", "Exponential a" + "\u207F", "Exponents a signal by a constant value");
            this.inputId1 = "InputSignalA";
            this.inputId2 = "ConstantValueN";
            this.inputName1 = "Input signal a";
            this.inputName2 = "Constant value n";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "exp";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            let exponentDisplayInfo = new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, false);
            exponentDisplayInfo.minValue = 0;
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(this.inputId1, this.inputName1, "", new Array(), "The baseSignal", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            defaultInputData.push(new calculationDataNumber_1.CalculationDataNumber(this.inputId2, this.inputName2, 1, "The exponent", exponentDisplayInfo));
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
            let baseSignal = calculationInputDataContainer[0];
            let exponent = calculationInputDataContainer[1];
            if (baseSignal == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(baseSignal.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName1]);
            }
            if (exponent == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(exponent.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName2]);
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let result = new Array();
            let baseSignal = calculationInputDataContainer[0];
            let exponent = calculationInputDataContainer[1];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(baseSignal.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(exponent.data)) {
                result = this.exponentSignalWithConstValue(baseSignal.data, exponent.data);
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
         * @param {number} inputNumber
         * @returns {Array<IPoint>}
         * @memberof ExpCalculator
         */
        exponentSignalWithConstValue(inputSignal, inputNumber) {
            let points = new Array();
            for (let i = 0; i < inputSignal.length; i++) {
                if (inputNumber < 1 && inputNumber > 0 && inputSignal[i].y < 0) {
                    this.addError("Calculation Error: If exponent is 0<n<1, then each value of the input signal has to be >=0.");
                    return new Array();
                }
                let x = inputSignal[i].x;
                let y = Math.pow(inputSignal[i].y, inputNumber);
                points.push(new point_1.Point(x, y));
            }
            return points;
        }
    };
    ExpCalculator = __decorate([
        mco.role()
    ], ExpCalculator);
    exports.ExpCalculator = ExpCalculator;
});
