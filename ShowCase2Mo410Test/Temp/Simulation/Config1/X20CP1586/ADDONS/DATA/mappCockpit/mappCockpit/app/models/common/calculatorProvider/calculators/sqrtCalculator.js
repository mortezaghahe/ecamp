var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../point", "../calculationDataPoints", "../calculationDataDisplayInfo", "./calculatorBase", "./calculatorHelper"], function (require, exports, point_1, calculationDataPoints_1, calculationDataDisplayInfo_1, calculatorBase_1, calculatorHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SqrtCalculator = void 0;
    let SqrtCalculator = class SqrtCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("square root ", "Square root √a", "Square root of a signal");
            this.inputId = "InputSignalA";
            this.inputName = "Input signal a";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "sqrt";
        }
        /**
         * Returns the default input data for this calculator
         *
         * @returns {(Array<CalculationDataNumber|CalculationDataPoints>)}
         * @memberof SqrtCalculator
         */
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            // add input params with default displaynames
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(this.inputId, this.inputName, "", new Array(), "The signal whose square root is calculated", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            return defaultInputData;
        }
        /**
         * Returns the default output data for this calculator
         *
         * @returns {Array<CalculationDataPoints>}
         * @memberof SqrtCalculator
         */
        getDefaultOutputData() {
            let outputData = super.getDefaultOutputData();
            // add output params with default displaynames
            outputData.push(new calculationDataPoints_1.CalculationDataPoints(this.outputId, this.outputName, this.outputValue, new Array()));
            return outputData;
        }
        verifyCalculationInputData() {
            super.verifyCalculationInputData();
            let calculationInputData = this.getCalculationInputDataContainer();
            let radicand = calculationInputData[0];
            if (radicand == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(radicand.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName]);
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            let calculationInputData = this.getCalculationInputDataContainer();
            let result = new Array();
            let radicand = calculationInputData[0];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(radicand.data)) {
                result = this.sqrtSignal(radicand.data);
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
         * @param {Array<IPoint>} radicand
         * @returns {Array<IPoint>}
         * @memberof SqrtCalculator
         */
        sqrtSignal(radicand) {
            let points = new Array();
            for (let i = 0; i < radicand.length; i++) {
                if (radicand[i].y >= 0) {
                    let x = radicand[i].x;
                    let y = Math.sqrt(radicand[i].y);
                    points.push(new point_1.Point(x, y));
                }
                else {
                    // Not possible to calculate the square root of a negative number. Technically yes, but we are just engineers.
                    this.addError("Calculation Error: Not possible to calculate the square root of a negative number.");
                    return new Array();
                }
            }
            return points;
        }
    };
    SqrtCalculator = __decorate([
        mco.role()
    ], SqrtCalculator);
    exports.SqrtCalculator = SqrtCalculator;
});
