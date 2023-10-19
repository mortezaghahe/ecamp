var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../point", "../calculationDataPoints", "../calculationDataDisplayInfo", "./calculatorBase", "./calculatorHelper", "../../../common/series/seriesType"], function (require, exports, point_1, calculationDataPoints_1, calculationDataDisplayInfo_1, calculatorBase_1, calculatorHelper_1, seriesType_1) {
    "use strict";
    var XYCalculator_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XYCalculator = void 0;
    let XYCalculator = XYCalculator_1 = class XYCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super(XYCalculator_1.id, "XY", "Creates an XY signal");
            this.inputName1 = "X signal";
            this.inputName2 = "Y signal";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "xySignal";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(XYCalculator_1.inputIdXSignal, this.inputName1, "", new Array(), "X signal", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(XYCalculator_1.inputIdYSignal, this.inputName2, "", new Array(), "Y signal", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            return defaultInputData;
        }
        getDefaultOutputData() {
            let defaultOutputData = super.getDefaultOutputData();
            let output = new calculationDataPoints_1.CalculationDataPoints(this.outputId, this.outputName, this.outputValue, new Array());
            output.type = seriesType_1.SeriesType.xySeries;
            defaultOutputData.push(output);
            return defaultOutputData;
        }
        prepareCalculationData() {
            super.prepareCalculationData();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let xSignal = calculationInputDataContainer[0];
            let ySignal = calculationInputDataContainer[1];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(xSignal.data) && calculatorHelper_1.CalculatorHelper.isValidSignal(xSignal.data)
                && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(ySignal.data) && calculatorHelper_1.CalculatorHelper.isValidSignal(ySignal.data)) {
                let preparedPointArrays = calculatorHelper_1.CalculatorHelper.filterMatchingPointsByXvalue({
                    pointArray1: xSignal.data,
                    pointArray2: ySignal.data
                });
                xSignal.data = preparedPointArrays.pointArray1;
                ySignal.data = preparedPointArrays.pointArray2;
                if (!calculatorHelper_1.CalculatorHelper.isValidSignal(xSignal.data) || !calculatorHelper_1.CalculatorHelper.isValidSignal(ySignal.data)) {
                    this.addErrorByType(calculatorBase_1.ErrorMessageType.NotEnoughCommonTimestamps, [xSignal.name, ySignal.name]);
                }
            }
        }
        verifyCalculationInputData() {
            super.verifyCalculationInputData();
            let calculcationInputDataContainer = this.getCalculationInputDataContainer();
            let xSignal = calculcationInputDataContainer[0];
            let ySignal = calculcationInputDataContainer[1];
            if (xSignal == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(xSignal.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName1]);
            }
            if (ySignal == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(ySignal.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName2]);
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let result = new Array();
            let xSignal = calculationInputDataContainer[0];
            let ySignal = calculationInputDataContainer[1];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(xSignal.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(ySignal.data)) {
                result = this.addTwoSignals(xSignal.data, ySignal.data);
            }
            this.addCalculationOutputData({
                data: result,
                value: this.outputValue,
                name: this.outputName,
                id: this.outputId
            });
        }
        /**
         * Calculates output value
         *
         * @private
         * @param {Array<IPoint>} inputSignal1
         * @param {Array<IPoint>} inputSignal2
         * @returns {Array<IPoint>}
         * @memberof XYCalculator
         */
        addTwoSignals(inputSignal1, inputSignal2) {
            let points = new Array();
            if (inputSignal1.length == inputSignal2.length) { // Add only signals with same sample count
                for (let i = 0; i < inputSignal1.length; i++) {
                    let newX = inputSignal1[i].y;
                    let newY = inputSignal2[i].y;
                    // check if signal two has same x value
                    if (inputSignal1[i].x == inputSignal2[i].x) {
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
    };
    XYCalculator.id = "xy";
    XYCalculator.inputIdXSignal = "XSignal";
    XYCalculator.inputIdYSignal = "YSignal";
    XYCalculator = XYCalculator_1 = __decorate([
        mco.role()
    ], XYCalculator);
    exports.XYCalculator = XYCalculator;
});
