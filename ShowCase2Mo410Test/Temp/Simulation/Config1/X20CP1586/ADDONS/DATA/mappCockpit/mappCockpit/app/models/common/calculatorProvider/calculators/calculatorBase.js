var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../calculationDataPoints", "../../../common/series/seriesType", "./calculatorHelper"], function (require, exports, calculationDataPoints_1, seriesType_1, calculatorHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ErroMessageType = exports.ErrorMessageType = exports.CalculatorBase = void 0;
    var ErrorMessageType;
    (function (ErrorMessageType) {
        ErrorMessageType[ErrorMessageType["MissingOrInvalidInput"] = 0] = "MissingOrInvalidInput";
        ErrorMessageType[ErrorMessageType["InvalidOutput"] = 1] = "InvalidOutput";
        ErrorMessageType[ErrorMessageType["InvalidInputType"] = 2] = "InvalidInputType";
        ErrorMessageType[ErrorMessageType["NotEnoughCommonTimestamps"] = 3] = "NotEnoughCommonTimestamps";
        ErrorMessageType[ErrorMessageType["ContainsNaNOrInfinity"] = 4] = "ContainsNaNOrInfinity";
        ErrorMessageType[ErrorMessageType["ContainsZeroInYValues"] = 5] = "ContainsZeroInYValues";
        ErrorMessageType[ErrorMessageType["ContainsFloatingNumbers"] = 6] = "ContainsFloatingNumbers";
        ErrorMessageType[ErrorMessageType["NumberNotAllowedToBeZero"] = 7] = "NumberNotAllowedToBeZero";
        ErrorMessageType[ErrorMessageType["NumberIsNoInt"] = 8] = "NumberIsNoInt";
        ErrorMessageType[ErrorMessageType["NotStrictlyMonotonicallyIncreasingInTime"] = 9] = "NotStrictlyMonotonicallyIncreasingInTime";
        ErrorMessageType[ErrorMessageType["ArraysHaveDifferentLength"] = 10] = "ArraysHaveDifferentLength";
    })(ErrorMessageType || (ErrorMessageType = {}));
    exports.ErrorMessageType = ErrorMessageType;
    exports.ErroMessageType = ErrorMessageType;
    /**
     * Base class for all calculators
     *
     * @class CalculatorBase
     * @implements {ICalculator}
     */
    let CalculatorBase = class CalculatorBase {
        get id() {
            return this._id;
        }
        get displayName() {
            return this._displayName;
        }
        get description() {
            return this._description;
        }
        /**
         * Creates an instance of CalculatorBase.
         *
         * @param {string} id
         * @param {string} displayName
         * @param {string} description
         * @memberof CalculatorBase
         */
        constructor(id, displayName, description) {
            this.errorList = new Array();
            this.calculationInputDataContainer = new Array();
            this.calculationOutputDataContainer = new Array();
            this._id = id;
            this._displayName = displayName;
            this._description = description;
        }
        /**
         * Empties the error list.
         *
         * @protected
         * @memberof CalculatorBase
         */
        clearErrors() {
            this.errorList = new Array();
        }
        /**
         * Adds an error to the errorlist.
         *
         * @protected
         * @param {string} errorMessage
         * @memberof CalculatorBase
         */
        addError(errorMessage) {
            this.errorList.push(errorMessage);
        }
        /**
         * Returns the error list.
         *
         * @returns {Array<string>}
         * @memberof CalculatorBase
         */
        getErrors() {
            return this.errorList;
        }
        /**
         * Returns if the error list has entries.
         *
         * @protected
         * @returns {boolean}
         * @memberof CalculatorBase
         */
        hasErrors() {
            return this.errorList.length > 0;
        }
        /**
         * Empties the calculation input data container.
         *
         * @protected
         * @memberof CalculatorBase
         */
        clearCalculationInputDataContainer() {
            this.calculationInputDataContainer = new Array();
        }
        /**
         * Adds calculation input data (data to be calculated) to the calculation input data container.
         *
         * @protected
         * @param {CalculationInputData} calculationData
         * @memberof CalculatorBase
         */
        addCalculationInputData(calculationData) {
            this.calculationInputDataContainer.push(calculationData);
        }
        /**
         * Returns the calculation input data container (data to be calculated).
         *
         * @returns {Array<CalculationInputData>}
         * @memberof CalculatorBase
         */
        getCalculationInputDataContainer() {
            return this.calculationInputDataContainer;
        }
        /**
         * Empties the calculation output data container.
         *
         * @protected
         * @memberof CalculatorBase
         */
        clearCalculationOutputDataContainer() {
            this.calculationOutputDataContainer = new Array();
        }
        /**
         * Adds calculation output data (data resulting from calculation) to ther calculation output data container.
         *
         * @protected
         * @param {CalculationOutputData} calculationOutputData
         * @memberof CalculatorBase
         */
        addCalculationOutputData(calculationOutputData) {
            this.calculationOutputDataContainer.push(calculationOutputData);
        }
        /**
         * Returns the container holding the calculation output data (data resulting from calculation).
         *
         * @returns {Array<CalculationOutputData>}
         * @memberof CalculatorBase
         */
        getCalculationOutputDataContainer() {
            return this.calculationOutputDataContainer;
        }
        /**
         * Adds an error to the errorlist of the calculator.
         * Generates the error message based on error type.
         *
         * @protected
         * @param {ErrorMessageType} errorMessageType
         * @param {Array<string>} errorMessageData
         * @returns
         * @memberof CalculatorBase
         *
         */
        addErrorByType(errorMessageType, errorMessageData) {
            if (!(errorMessageData.length > 0)) { // log to console if no errorMessageData is provided
                console.error("errorMessageData is missing!");
                return;
            }
            let errorMessage = "";
            let joinedErrorMessageData = errorMessageData.join(", ");
            switch (errorMessageType) { // generate error message according to errror type
                case ErrorMessageType.MissingOrInvalidInput:
                    errorMessage = "Calculation Error: Data for '" + joinedErrorMessageData + "' is missing or invalid!";
                    break;
                case ErrorMessageType.InvalidOutput:
                    errorMessage = "Calculation Error: Output data for '" + joinedErrorMessageData + "' is invalid!";
                    break;
                case ErrorMessageType.InvalidInputType:
                    errorMessage = "Calculation Error: Input signal type for '" + joinedErrorMessageData + "' is not supported! Please use input signal of type YT.";
                    break;
                case ErrorMessageType.NotEnoughCommonTimestamps:
                    errorMessage = "Calculation Error: The inputs '" + joinedErrorMessageData + "' do not share enough common timestamps!";
                    break;
                case ErrorMessageType.ContainsNaNOrInfinity:
                    errorMessage = "Calculation Error: Data for '" + joinedErrorMessageData + "' does contain NaN or Infinity!";
                    break;
                case ErrorMessageType.ContainsZeroInYValues:
                    errorMessage = "Calculation Error: Data for '" + joinedErrorMessageData + "' does contain 0 in the y values!";
                    break;
                case ErrorMessageType.ContainsFloatingNumbers:
                    errorMessage = "Calculation Error: Data for '" + joinedErrorMessageData + "' does contain floating point numbers in the y values!";
                    break;
                case ErrorMessageType.NumberNotAllowedToBeZero:
                    errorMessage = "Calculation Error: Data for '" + joinedErrorMessageData + "' is not allowed to be 0!";
                    break;
                case ErrorMessageType.NumberIsNoInt:
                    errorMessage = "Calculation Error: Data for '" + joinedErrorMessageData + "' is not allowed to be a floating point number!";
                    break;
                case ErrorMessageType.NotStrictlyMonotonicallyIncreasingInTime:
                    errorMessage = "Calculation Error: Data for '" + joinedErrorMessageData + "' is not strictly monotonically increasing in time!";
                    break;
                case ErrorMessageType.ArraysHaveDifferentLength:
                    errorMessage = "Calculation Error: " + joinedErrorMessageData + " need to have the same length!";
                    break;
                default:
                    errorMessage = "Calculation Error: Calculation of '" + joinedErrorMessageData + "' failed! Unknown reason!";
                    break;
            }
            this.errorList.push(errorMessage);
        }
        /**
         * Hook to provide the default input data
         *
         * @returns {(Array<TCalculationData>)}
         * @memberof CalculatorBase
         */
        getDefaultInputData() {
            let defaultInputData = new Array();
            return defaultInputData;
        }
        /**
         * Hook to provide the default output data
         *
         * @returns {Array<CalculationDataPoints>}
         * @memberof CalculatorBase
         */
        getDefaultOutputData() {
            let defaultOutputData = new Array();
            return defaultOutputData;
        }
        /**
         * Runs the steps necessary to perform the calculation of the calculator.
         *
         * @param {(Array<TCalculationData>)} inputData
         * @returns {Array<CalculationDataPoints>}
         * @memberof CalculatorBase
         */
        calculate(inputData) {
            this.clearErrors();
            this.clearCalculationInputDataContainer();
            this.clearCalculationOutputDataContainer();
            this.extractCalculationData(inputData);
            if (this.hasErrors()) {
                return this.getDefaultOutputData();
            }
            this.prepareCalculationData();
            if (this.hasErrors()) {
                return this.getDefaultOutputData();
            }
            this.verifyCalculationInputData();
            if (this.hasErrors()) {
                return this.getDefaultOutputData();
            }
            this.executeAlgorithm();
            if (this.hasErrors()) {
                return this.getDefaultOutputData();
            }
            this.verifyCalculationOutputData();
            if (this.hasErrors()) {
                return this.getDefaultOutputData();
            }
            let outputData = this.generateOutputData();
            return outputData;
        }
        /**
         * Extracts the calculation input data from the calculator input.
         * Checks if input is not of type XY or FFT.
         *
         * @private
         * @param {(Array<TCalculationData>)} inputData
         * @memberof CalculatorBase
         */
        extractCalculationData(inputData) {
            let invalidSerieTypesNames = new Array();
            inputData.forEach((input) => {
                let calculationData = {
                    data: input.getData(),
                    name: input.getDisplayName()
                };
                if (input.type == seriesType_1.SeriesType.fftSeries || input.type == seriesType_1.SeriesType.xySeries) {
                    invalidSerieTypesNames.push(input.getDisplayName());
                }
                this.addCalculationInputData(calculationData);
            });
            if (invalidSerieTypesNames.length > 0) {
                this.addErrorByType(ErrorMessageType.InvalidInputType, invalidSerieTypesNames);
            }
        }
        /**
         * Hook for preparing the calculation input data.
         *
         * @protected
         * @memberof CalculatorBase
         */
        prepareCalculationData() { }
        /**
         * Hook for verifying calculation input data.
         * Performs basic verification as default.
         *
         * @protected
         * @memberof CalculatorBase
         */
        verifyCalculationInputData() {
            this.getCalculationInputDataContainer().forEach((calculationInputData) => {
                if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(calculationInputData.data)) { //calculationInputData is a signal
                    if (!calculatorHelper_1.CalculatorHelper.isSignalLongerThanMinimum(calculationInputData.data)) {
                        this.addErrorByType(ErrorMessageType.MissingOrInvalidInput, [calculationInputData.name]);
                    }
                    else if (calculatorHelper_1.CalculatorHelper.containsNaNOrInfinityInYvalue(calculationInputData.data)) {
                        this.addErrorByType(ErrorMessageType.ContainsNaNOrInfinity, [calculationInputData.name]);
                    }
                }
                if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsNumber(calculationInputData.data)) { //calculationInputData is a number
                    if (Number.isNaN(calculationInputData.data)) { //NaN means no data provided 
                        this.addErrorByType(ErrorMessageType.MissingOrInvalidInput, [calculationInputData.name]);
                    }
                    else if (!calculatorHelper_1.CalculatorHelper.isValidNumber(calculationInputData.data)) {
                        this.addErrorByType(ErrorMessageType.ContainsNaNOrInfinity, [calculationInputData.name]);
                    }
                }
                if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(calculationInputData.data)) {
                    if (calculationInputData.data === "") {
                        this.addErrorByType(ErrorMessageType.MissingOrInvalidInput, [calculationInputData.name]);
                    }
                }
            });
        }
        /**
         * Hook for executing the algorithm/calculation.
         *
         * @protected
         * @memberof CalculatorBase
         */
        executeAlgorithm() { }
        /**
         * Hook for verifying the calculation result.
         * Performs basic verfication as default.
         *
         * @protected
         * @memberof CalculatorBase
         */
        verifyCalculationOutputData() {
            this.getCalculationOutputDataContainer().forEach((calculationOutputData) => {
                if (!calculatorHelper_1.CalculatorHelper.isSignalLongerThanMinimum(calculationOutputData.data)) {
                    this.addErrorByType(ErrorMessageType.InvalidOutput, [calculationOutputData.name]);
                }
                else if (calculatorHelper_1.CalculatorHelper.containsNaNOrInfinityInYvalue(calculationOutputData.data)) {
                    this.addErrorByType(ErrorMessageType.ContainsNaNOrInfinity, [calculationOutputData.name]);
                }
            });
        }
        /**
         * Generates output data of the calculator based on the data in the calculationOutputDataContainer.
         *
         * @private
         * @returns {Array<CalculationDataPoints>}
         * @memberof CalculatorBase
         */
        generateOutputData() {
            let outputData = new Array();
            let calculationOutputDataContainer = this.getCalculationOutputDataContainer();
            calculationOutputDataContainer.forEach((calculationOutputData) => {
                outputData.push(new calculationDataPoints_1.CalculationDataPoints(calculationOutputData.id, calculationOutputData.name, calculationOutputData.value, calculationOutputData.data));
            });
            if (calculationOutputDataContainer.length == 0) {
                outputData = this.getDefaultOutputData();
            }
            return outputData;
        }
        /**
         * Returns the calculation data used by the algorithm of the calculator after all preparations done.
         *
         * @returns {(Array<TCalculationData>)}
         * @memberof CalculatorBase
         */
        getActualInputData() {
            let inputData = this.getDefaultInputData();
            let calculationData = this.getCalculationInputDataContainer();
            for (let i = 0; i < inputData.length && i < calculationData.length; i++) {
                inputData[i].setData(calculationData[i].data);
            }
            return inputData;
        }
    };
    CalculatorBase = __decorate([
        mco.role()
    ], CalculatorBase);
    exports.CalculatorBase = CalculatorBase;
});
