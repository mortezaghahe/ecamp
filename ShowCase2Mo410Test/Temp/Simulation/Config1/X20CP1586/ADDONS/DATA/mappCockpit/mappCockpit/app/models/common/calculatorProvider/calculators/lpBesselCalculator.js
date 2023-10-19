var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../point", "./filters/bessel", "../calculationDataNumber", "../calculationDataPoints", "../calculationDataDisplayInfo", "./calculatorBase", "./calculatorHelper"], function (require, exports, point_1, bessel_1, calculationDataNumber_1, calculationDataPoints_1, calculationDataDisplayInfo_1, calculatorBase_1, calculatorHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LpBesselCalculator = void 0;
    let LpBesselCalculator = class LpBesselCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("lp bessel", "LP Bessel", "Filters a signal with a parameterizable Bessel low-pass filter");
            this.inputId1 = "Order";
            this.inputId2 = "CutoffFrequency";
            this.inputId3 = "InputSignal";
            this.inputName1 = "Order";
            this.inputName2 = "Cutoff frequency";
            this.inputName3 = "Input signal";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "filtered signal";
            this._filterOrderMin = bessel_1.Bessel.filterOrderMin;
            this._filterOrderMax = bessel_1.Bessel.filterOrderMax;
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            let cutOffFrequencyDisplayInfo = new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, false);
            cutOffFrequencyDisplayInfo.minValue = 0;
            // Numeric, 1-5
            defaultInputData.push(new calculationDataNumber_1.CalculationDataNumber(this.inputId1, this.inputName1, 1, "The order of the filter", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(true, false, this.getFilterOrderValues())));
            defaultInputData.push(new calculationDataNumber_1.CalculationDataNumber(this.inputId2, this.inputName2, 3.2, "The cut-off frequency (frequency with an attenuation of -3dB) of the filter", cutOffFrequencyDisplayInfo));
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(this.inputId3, this.inputName3, "", new Array(), "The signal to be filtered", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
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
            let filterOrder = calculationInputDataContainer[0];
            let cutoffFrequency = calculationInputDataContainer[1];
            let inputSignal = calculationInputDataContainer[2];
            if (filterOrder == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(filterOrder.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName1]);
            }
            if (cutoffFrequency == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(cutoffFrequency.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName2]);
            }
            if (inputSignal == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignal.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName3]);
            }
            if (this.hasErrors()) {
                return;
            }
            if (filterOrder.data < this._filterOrderMin || filterOrder.data > this._filterOrderMax) {
                this.addError("Calculation Error: '" + this.inputName1 + "' is out of range (valid range " + this._filterOrderMin + "-" + this._filterOrderMax + ")!");
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let result = new Array();
            let filterOrder = calculationInputDataContainer[0];
            let cutoffFrequency = calculationInputDataContainer[1];
            let inputSignal = calculationInputDataContainer[2];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(filterOrder.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(cutoffFrequency.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignal.data)) {
                result = this.calculateBessel(inputSignal.data, filterOrder.data, cutoffFrequency.data);
            }
            this.addCalculationOutputData({
                data: result,
                value: this.outputValue,
                name: this.outputName,
                id: this.outputId
            });
        }
        /**
         * Calculate bessel with the given data
         *
         * @private
         * @param {Array<IPoint>} signalData
         * @param {number} filterOrder
         * @param {number} inputCutOffFrequence
         * @returns {Array<IPoint>}
         * @memberof LpBesselCalculator
         */
        calculateBessel(signalData, filterOrder, inputCutOffFrequence) {
            let ts = calculatorHelper_1.CalculatorHelper.estimateSampleTime(signalData);
            let inputSignal = new Array();
            for (let i = 0; i < signalData.length; i++) {
                inputSignal.push(signalData[i].y);
            }
            let filter = new bessel_1.Bessel(filterOrder, inputCutOffFrequence, ts);
            let outputSignal = filter.filter(inputSignal);
            let output = new Array();
            for (let i = 0; i < outputSignal.length; i++) {
                output.push(new point_1.Point(signalData[i].x, outputSignal[i]));
            }
            return output;
        }
        /**
         * Returns the supported filter orders for the bessel filter
         *
         * @private
         * @returns {Array<IValueListItem>}
         * @memberof LpBesselCalculator
         */
        getFilterOrderValues() {
            let filterOrderValues = new Array();
            for (let i = this._filterOrderMin; i <= this._filterOrderMax; i++) {
                filterOrderValues.push({ value: i.toString(), displayValue: i.toString() });
            }
            return filterOrderValues;
        }
    };
    LpBesselCalculator = __decorate([
        mco.role()
    ], LpBesselCalculator);
    exports.LpBesselCalculator = LpBesselCalculator;
});
