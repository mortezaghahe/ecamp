var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../point", "../calculationDataPoints", "../calculationDataDisplayInfo", "./calculatorBase", "./calculatorHelper"], function (require, exports, point_1, calculationDataPoints_1, calculationDataDisplayInfo_1, calculatorBase_1, calculatorHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimeStampSyncCalculator = void 0;
    let TimeStampSyncCalculator = class TimeStampSyncCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("timeStampSync", "Time stamp synchronization", "Synchronizes the time stamps of a signal to the time stamps of a reference signal.");
            this.inputId1 = "InputSignalAToSynchronizeTimeStamps";
            this.inputId2 = "InputSignalBWithReferenceTimeStamps";
            this.inputName1 = "Input signal a to synchronize time stamps";
            this.inputName2 = "Input signal b with reference time stamps";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "result";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(this.inputId1, this.inputName1, "", new Array(), "The signal whose time stamps are to be synchronized.", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(this.inputId2, this.inputName2, "", new Array(), "The signal with the reference time stamps.", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
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
            let signalToSynchronize = calculationInputDataContainer[0];
            let referenceSignal = calculationInputDataContainer[1];
            if (signalToSynchronize == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(signalToSynchronize.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName1]);
            }
            if (referenceSignal == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(referenceSignal.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName2]);
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let result = new Array();
            let signalToSynchronize = calculationInputDataContainer[0];
            let referenceSignal = calculationInputDataContainer[1];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(signalToSynchronize.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(referenceSignal.data)) {
                result = this.synchronizeTimeStamp(signalToSynchronize.data, referenceSignal.data);
            }
            this.addCalculationOutputData({
                data: result,
                value: this.outputValue,
                name: this.outputName,
                id: this.outputId
            });
        }
        /**
         * Calculates output signal depending on type of inputs
         *
         * @private
         * @param {*} inputNumber1
         * @param {*} inputNumber2
         * @param {(Array<IPoint>|undefined)} inputSignalData1
         * @param {(Array<IPoint>|undefined)} inputSignalData2
         * @returns {Array<IPoint>}
         * @memberof AddCalculator
         */
        synchronizeTimeStamp(inputSignalToSync, inputSignalRefTimeStamp) {
            let points = new Array();
            let lastIndex = 0;
            for (let i = 0; i < inputSignalRefTimeStamp.length; i++) {
                for (let j = lastIndex; j < inputSignalToSync.length; j++) {
                    if (inputSignalToSync[j].x > inputSignalRefTimeStamp[i].x) {
                        if (j > 0) { //zero order hold -> To take over a value at the first sampling point, 
                            //the signal "inputSignalToSync" must have a sampling before the very first sampling of the signal "inputSignalRefTimeStamp".
                            let x = inputSignalRefTimeStamp[i].x;
                            let y = inputSignalToSync[j - 1].y;
                            points.push(new point_1.Point(x, y));
                            lastIndex = j;
                        }
                        break;
                    }
                }
                //check if last point is relevant (time interval between last point and next time stamp < period time of signal to be synchronized)   
                if (inputSignalRefTimeStamp[i].x >= inputSignalToSync[inputSignalToSync.length - 1].x) {
                    if ((inputSignalRefTimeStamp[i].x - inputSignalToSync[inputSignalToSync.length - 1].x) < (inputSignalToSync[inputSignalToSync.length - 1].x - inputSignalToSync[inputSignalToSync.length - 2].x)) {
                        let x = inputSignalRefTimeStamp[i].x;
                        let y = inputSignalToSync[inputSignalToSync.length - 1].y;
                        points.push(new point_1.Point(x, y));
                    }
                }
            }
            return points;
        }
    };
    TimeStampSyncCalculator = __decorate([
        mco.role()
    ], TimeStampSyncCalculator);
    exports.TimeStampSyncCalculator = TimeStampSyncCalculator;
});
