var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../point", "../calculationDataNumber", "../calculationDataPoints", "../calculationDataDisplayInfo", "./calculatorBase", "./calculatorHelper"], function (require, exports, point_1, calculationDataNumber_1, calculationDataPoints_1, calculationDataDisplayInfo_1, calculatorBase_1, calculatorHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LimitCalculator = void 0;
    let LimitCalculator = class LimitCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("max min", "Limit", "Limits the signal to maximum and minimum constant values");
            this.inputId1 = "UpperLimit";
            this.inputId2 = "LowerLimit";
            this.inputId3 = "InputSignal";
            this.inputName1 = "Upper limit";
            this.inputName2 = "Lower limit";
            this.inputName3 = "Input signal";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "limit";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            let maxValueInfo = new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, false);
            let minValueInfo = new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, false);
            defaultInputData.push(new calculationDataNumber_1.CalculationDataNumber(this.inputId1, this.inputName1, 1, "The upper limit value", maxValueInfo));
            defaultInputData.push(new calculationDataNumber_1.CalculationDataNumber(this.inputId2, this.inputName2, 0, "The lower limit value", minValueInfo));
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(this.inputId3, this.inputName3, "", new Array(), "The signal to be limited", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
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
            let upperLimit = calculationInputDataContainer[0];
            let lowerLimit = calculationInputDataContainer[1];
            let inputSignal = calculationInputDataContainer[2];
            if (upperLimit == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(upperLimit.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName1]);
            }
            if (lowerLimit == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(lowerLimit.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName2]);
            }
            if (inputSignal == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignal.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName3]);
            }
            if (this.hasErrors()) {
                return;
            }
            if (upperLimit.data < lowerLimit.data) {
                this.addError('Calculation Error: Lower limit must not be bigger than upper limit.');
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let result = new Array();
            let upperLimit = calculationInputDataContainer[0];
            let lowerLimit = calculationInputDataContainer[1];
            let inputSignal = calculationInputDataContainer[2];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(upperLimit.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(lowerLimit.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignal.data)) {
                result = this.maxMinSignal(upperLimit.data, lowerLimit.data, inputSignal.data);
            }
            this.addCalculationOutputData({
                data: result,
                value: this.outputValue,
                name: this.outputName,
                id: this.outputId
            });
        }
        /**
         * Calculates output data
         *
         * @private
         * @param {number} minValue
         * @param {number} maxValue
         * @param {Array<IPoint>} inputSignal
         * @returns {Array<IPoint>}
         * @memberof LimitCalculator
         */
        maxMinSignal(maxValue, minValue, inputSignal) {
            let points = new Array();
            for (let i = 0; i < inputSignal.length; i++) {
                let x = inputSignal[i].x;
                let y = inputSignal[i].y;
                if (inputSignal[i].y > maxValue) {
                    y = maxValue;
                }
                else if (inputSignal[i].y < minValue) {
                    y = minValue;
                }
                points.push(new point_1.Point(x, y));
            }
            return points;
        }
    };
    LimitCalculator = __decorate([
        mco.role()
    ], LimitCalculator);
    exports.LimitCalculator = LimitCalculator;
});
