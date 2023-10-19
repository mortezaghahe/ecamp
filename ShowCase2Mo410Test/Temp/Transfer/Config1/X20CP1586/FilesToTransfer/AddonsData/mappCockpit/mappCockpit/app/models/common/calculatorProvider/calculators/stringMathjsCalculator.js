var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../calculationDataNumberOrPoints", "../calculationDataPoints", "../calculationDataDisplayInfo", "./calculatorBase", "../calculationDataString", "../../../../libs/math/mathjs", "../mathjsWrapper", "../mathjsHtmlConverter", "./calculatorHelper"], function (require, exports, calculationDataNumberOrPoints_1, calculationDataPoints_1, calculationDataDisplayInfo_1, calculatorBase_1, calculationDataString_1, math, mathjsWrapper_1, mathjsHtmlConverter_1, calculatorHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StringMathjsCalculator = void 0;
    let StringMathjsCalculator = class StringMathjsCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super("stringmathjs", "Math expression", "Calculates separated values and time as mathematical expression");
            this.inputStringYId = "CalculatingValues";
            this.inputStringXId = "CalculatingTime";
            this.inputSignalAId = "InputSignalOrNumberA";
            this.inputSignalBId = "InputSignalOrNumberB";
            this.inputSignalCId = "InputSignalOrNumberC";
            this.inputSignalDId = "InputSignalOrNumberD";
            this.inputSignalEId = "InputSignalOrNumberE";
            this.inputStringYName = "Calculating values";
            this.inputStringXName = "Calculating time";
            this.inputSignalAName = "Input signal or number a";
            this.inputSignalBName = "Input signal or number b";
            this.inputSignalCName = "Input signal or number c";
            this.inputSignalDName = "Input signal or number d";
            this.inputSignalEName = "Input signal or number e";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "math expression";
            this.inputStringDescripion = "Mathematical expression expected";
            this._mathJSLib = mathjsWrapper_1.MathjsWrapper.getInstance();
        }
        /**
         * Returns the default input data for this calculator
         *
         * @returns {Array<TCalculationData>}
         * @memberof StringMathjsCalculator
         */
        getDefaultInputData() {
            let inputData = super.getDefaultInputData();
            // convert the received input strings to a display value with math.js specific html for enabling syntax highlighting
            let stringInputData1 = new calculationDataString_1.CalculationDataString(this.inputStringYId, this.inputStringYName, this.inputStringDescripion, "Calculates mathematical formulas from the math.js library for the y values", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, false));
            stringInputData1.valueConverter = new mathjsHtmlConverter_1.MathjsHtmlConverter(this.inputStringDescripion);
            inputData.push(stringInputData1);
            let stringInputData2 = new calculationDataString_1.CalculationDataString(this.inputStringXId, this.inputStringXName, this.inputStringDescripion, "Calculates mathematical formulas from the math.js library for the x values", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, false));
            stringInputData2.valueConverter = new mathjsHtmlConverter_1.MathjsHtmlConverter(this.inputStringDescripion);
            inputData.push(stringInputData2);
            inputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputSignalAId, this.inputSignalAName, 0, "Input is a signal: a.value, a.time and a.sampleTime can be used for the calculation; Input is a number: a can be used for the calculation", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            inputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputSignalBId, this.inputSignalBName, 0, "Input is a Signal: b.value, b.time and b.sampleTime can be used for the calculation; Input is a number: b can be used for the calculation", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            inputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputSignalCId, this.inputSignalCName, 0, "Input is a Signal: c.value, c.time and c.sampleTime can be used for the calculation; Input is a number: c can be used for the calculation", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            inputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputSignalDId, this.inputSignalDName, 0, "Input is a Signal: d.value, d.time and d.sampleTime can be used for the calculation; Input is a number: d can be used for the calculation", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            inputData.push(new calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints(this.inputSignalEId, this.inputSignalEName, 0, "Input is a Signal: e.value, e.time and e.sampleTime can be used for the calculation; Input is a number: e can be used for the calculation", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            return inputData;
        }
        /**
         * Returns the default output data for this calculator
         *
         * @returns {Array<CalculationDataPoints>}
         * @memberof stringMathjsCalculator
         */
        getDefaultOutputData() {
            let outputData = new Array();
            // add output params with default displaynames
            outputData.push(new calculationDataPoints_1.CalculationDataPoints(this.outputId, this.outputName, this.outputValue, new Array()));
            return outputData;
        }
        verifyCalculationInputData() {
            super.verifyCalculationInputData();
            //retrieve calculation input data
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let stringDataY = calculationInputDataContainer[0];
            let stringDataX = calculationInputDataContainer[1];
            // check if all input data are valid
            if (stringDataY === undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(stringDataY.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputStringYName]);
            }
            if (stringDataX === undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(stringDataX.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputStringXName]);
            }
            for (let i = 2; i < calculationInputDataContainer.length; i++) {
                let calculationInputData = calculationInputDataContainer[i];
                if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(calculationInputData.data)) {
                    this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [calculationInputData.name]);
                }
            }
            if (this.hasErrors()) {
                return;
            }
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(stringDataY.data) && stringDataY.data === this.inputStringDescripion) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputStringYName]);
            }
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(stringDataX.data) && stringDataX.data === this.inputStringDescripion) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputStringXName]);
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            // retrieve calculation input data and initialize result
            let calculationInputData = this.getCalculationInputDataContainer();
            let result = new Array();
            // prepare the input data for calculation
            let stringDataY = calculationInputData[0];
            let stringDataX = calculationInputData[1];
            let signalData = new Array();
            for (let i = 2; i < calculationInputData.length; i++) {
                let data = calculationInputData[i].data;
                if (!calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(data)) {
                    signalData.push(data);
                }
            }
            // Execute the calculation of the stringMathjsCalculator
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(stringDataY.data) && calculatorHelper_1.CalculatorHelper.calculationInputDataIsString(stringDataX.data)) {
                result = this.calculateString(stringDataY.data, stringDataX.data, signalData);
            }
            // add the result of the calculation to the calculationOutpuContainer
            this.addCalculationOutputData({
                data: result,
                value: this.outputValue,
                name: this.outputName,
                id: this.outputId
            });
        }
        /**
         * Calculate mathematical expressions with the given data
         *
         * @private
         * @param {string} stringDataY
         * @param {string} stringDataX
         * @param {Array<IPoint[] | number>} signalData
         * @returns {Array<IPoint>}
         * @memberof StringMathjsCalculator
         */
        calculateString(stringDataY, stringDataX, signalData) {
            let output = new Array();
            // Receive the results of the calculation for both axis
            let resultX = this.evaluateString(stringDataX, signalData);
            let resultY = this.evaluateString(stringDataY, signalData);
            // If in both axis no errors occured during calculating, then they get combined to an IPoint Array
            if (!this.hasErrors()) {
                output = calculatorHelper_1.CalculatorHelper.fromTwoNumberArrayToIPointArray(resultX, resultY);
                if (output.length === 0) {
                    this.addErrorByType(calculatorBase_1.ErrorMessageType.ArraysHaveDifferentLength, ["Calculating values and calculating time"]);
                }
            }
            return output;
        }
        verifyCalculationOutputData() {
            super.verifyCalculationOutputData();
            let calculationOutputDataContainer = this.getCalculationOutputDataContainer();
            // checks if the calculation time values are strictly monotonically increasing
            calculationOutputDataContainer.forEach((calculationOutputData) => {
                if (!calculatorHelper_1.CalculatorHelper.isStrictlyMonotonicallyIncreasingInTime(calculationOutputData.data)) {
                    this.addErrorByType(calculatorBase_1.ErrorMessageType.NotStrictlyMonotonicallyIncreasingInTime, [calculationOutputData.name]);
                }
            });
        }
        /**
         * Calculate the string value with mathjs lib and match to the inputsignal or constant
         * @private
         * @param {string} str
         * @param {Array<IPoint[] | number>} signalData
         * @returns {number | Array<number>}
         * @memberof StringMathjsCalculator
         */
        evaluateString(str, signalData) {
            let arrResult = new Array();
            try {
                let code = this._mathJSLib.limitedParse(str);
                // Add the input signal data to the scope for evaluating
                let scope = {
                    a: this.getScopeObjectOrValue(signalData[0]),
                    b: this.getScopeObjectOrValue(signalData[1]),
                    c: this.getScopeObjectOrValue(signalData[2]),
                    d: this.getScopeObjectOrValue(signalData[3]),
                    e: this.getScopeObjectOrValue(signalData[4])
                };
                let compiledCode = code.compile();
                let result = compiledCode.evaluate(scope);
                // The evaluate function can lead to several different resulting datatypes, but only arrays of numbers can be used later
                arrResult = this.convertMathjsResultTypeToArray(result);
            }
            catch (error) {
                this.addError("Error in expression: " + str + "!\n" + error.name + ": " + error.message + "!");
            }
            return arrResult;
        }
        /**
        * Check the datatype of the evaluated mathjs result and convert it to an Number Array if possible
        * Throws errors if they are not valid
        *
        * @private
        * @param {any} result
        * @returns {Array<number>}
        * @memberof StringMathjsCalculator
        */
        convertMathjsResultTypeToArray(result) {
            //get the matrix or array value from a multiline expression
            if (math.typeOf(result) == 'ResultSet') {
                if (!result.hasOwnProperty('entries')) {
                    this.mathjsResultTypeError('Result is a invalid ResultSet', 'The result of the expression is invalid');
                }
                result = result.entries[0];
            }
            //get the array from the matrix
            if (math.typeOf(result) == 'Matrix') {
                if (result._size.length != 1) {
                    this.mathjsResultTypeError('Result is a multidimensional matrix', 'The result of the expression is not allowed to be a multidimensional matrix');
                }
                result = result._data;
            }
            this.checkForInvalidDataType(result);
            return result;
        }
        /**
        * Check if the datatype of the evaluated mathjs result is valid
        * Throws errors if they are not valid
        * @private
        * @param {any} result
        * @memberof StringMathjsCalculator
        */
        checkForInvalidDataType(result) {
            switch (math.typeOf(result)) {
                case 'undefined': this.mathjsResultTypeError('Result is undefined', 'The result of the expression is not allowed to be undefined');
                case 'number': this.mathjsResultTypeError('Result is a number', 'The result of the expression is not allowed to be a number');
                case 'boolean': this.mathjsResultTypeError('Result is a boolean', 'The result of the expression is not allowed to be a single boolean');
                case 'null': this.mathjsResultTypeError('Result is null', 'The result of the expression is not allowed to be null');
                case 'Array':
                    if (calculatorHelper_1.CalculatorHelper.arrayHasNaNOrInvinityValues(result)) {
                        this.mathjsResultTypeError('Result is an array with NaN or invinity values', 'The result of the expression is not allowed to be an array with NaN or invinity values');
                    }
                    break;
                default: this.mathjsResultTypeError('Result is invalid', 'The result of the expression is invalid');
            }
        }
        /**
         * Returns the suitable object for the evaluation scope of math.js
         *
         * @private
         * @param {IPoint[] | number} signalData
         * @returns {any}
         * @memberof StringMathjsCalculator
         */
        getScopeObjectOrValue(signalData) {
            //Scope for a number
            if (signalData != undefined && !Array.isArray(signalData)) {
                return signalData;
            }
            //Scope for a signal
            else if (signalData != undefined && Array.isArray(signalData)) {
                let splittedSignal = calculatorHelper_1.CalculatorHelper.fromIPointArrayToNumberArray(signalData);
                return {
                    value: splittedSignal.yArr,
                    time: splittedSignal.xArr,
                    sampleTime: calculatorHelper_1.CalculatorHelper.estimateSampleTime(signalData)
                };
            }
        }
        /**
         * method for generalize throw messages for invalid calculation results
         *
         * @private
         * @param {string} errorName
         * @param {string} errorMessage
         * @returns {never}
         * @memberof StringMathjsCalculator
         */
        mathjsResultTypeError(errorName, errorMessage) {
            throw { name: errorName, data: errorMessage };
        }
    };
    StringMathjsCalculator = __decorate([
        mco.role()
    ], StringMathjsCalculator);
    exports.StringMathjsCalculator = StringMathjsCalculator;
});
