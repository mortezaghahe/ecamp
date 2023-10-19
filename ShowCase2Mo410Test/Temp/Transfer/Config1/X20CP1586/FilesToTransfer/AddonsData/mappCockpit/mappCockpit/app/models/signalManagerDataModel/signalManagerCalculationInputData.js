var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/signal/serieNode", "./eventSignalManagerDataChangedArgs", "../common/calculatorProvider/calculationDataNumber", "./signalManagerCalculatorType", "./signalManagerCalculationOutputData", "../common/series/seriesType", "../common/calculatorProvider/calculationData", "../common/calculatorProvider/calculationDataNumberOrPoints", "../common/calculatorProvider/calculationDataString", "../common/calculatorProvider/calculationDataPoints"], function (require, exports, serieNode_1, eventSignalManagerDataChangedArgs_1, calculationDataNumber_1, signalManagerCalculatorType_1, signalManagerCalculationOutputData_1, seriesType_1, calculationData_1, calculationDataNumberOrPoints_1, calculationDataString_1, calculationDataPoints_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalManagerCalculationInputData = void 0;
    let SignalManagerCalculationInputData = class SignalManagerCalculationInputData extends serieNode_1.SerieNode {
        /**
         * Returns a list with available values for this calculation input
         *
         * @readonly
         * @type {(Array<IValueListItem>|undefined)}
         * @memberof SignalManagerCalculationInputData
         */
        get values() {
            if (this.calculationData.values != undefined) {
                return this.calculationData.values;
            }
            else if (this.calculationData.displayInfo != undefined && this.calculationData.displayInfo.showSignalList == true) {
                return this.getSerieSelections();
            }
        }
        /**
         * Returns the datatype of this calculation input
         *
         * @readonly
         * @type {string}
         * @memberof SignalManagerCalculationInputData
         */
        get dataTypeName() {
            if (this.calculationData instanceof calculationDataNumber_1.CalculationDataNumber) {
                return "Float";
            }
            else {
                return "String";
            }
        }
        get minValue() {
            if (this.calculationData.displayInfo != undefined) {
                return this.calculationData.displayInfo.minValue;
            }
            return undefined;
        }
        get maxValue() {
            if (this.calculationData.displayInfo != undefined) {
                return this.calculationData.displayInfo.maxValue;
            }
            return undefined;
        }
        /**
         * Returns the parent of this calculation input
         *
         * @type {(ISerieContainer | undefined)}
         * @memberof SignalManagerCalculationInputData
         */
        get parent() {
            return this._parent;
        }
        /**
         * Sets the parent of this calculation input
         *
         * @memberof SignalManagerCalculationInputData
         */
        set parent(value) {
            this._parent = value;
        }
        /**
         * Returns the name of this calculation input
         *
         * @readonly
         * @type {string}
         * @memberof SignalManagerCalculationInputData
         */
        get name() {
            let dataModel = this.getDataModel();
            if (dataModel != undefined) {
                if (dataModel.editModeActive == true) {
                    return this.calculationData.getDisplayName(); // Show the display name of input/output parameter in edit mode
                }
            }
            return this.value; // Show only the value 
        }
        /**
         * Returns the description of this calculation input
         *
         * @readonly
         * @type {string}
         * @memberof SignalManagerCalculationInputData
         */
        get description() {
            return this.calculationData.description;
        }
        /**
         * Returns the color of this calculation input => currently no color needed for inputs
         *
         * @type {string}
         * @memberof SignalManagerCalculationInputData
         */
        get color() {
            return "";
        }
        /**
         * Sets the color of this calculation input => currently no color needed for inputs
         *
         * @memberof SignalManagerCalculationInputData
         */
        set color(value) {
            if (this.serie != undefined) {
                this.serie.color = value;
            }
            this.onDataChanged(this, new eventSignalManagerDataChangedArgs_1.EventSignalManagerDataChangedArgs(eventSignalManagerDataChangedArgs_1.SignalManagerAction.colorChanged, value));
        }
        /**
         * Returns the value of the calculation input written in the cell (rowdata)
         * Added for html
         * @type {string}
         * @memberof SignalManagerCalculationInputData
         */
        getRawValue() {
            return this._value;
        }
        /**
         * Returns the value of this calculation input
         *
         * @type {string}
         * @memberof SignalManagerCalculationInputData
         */
        get value() {
            return this.calculationData.getDisplayValue(this._value);
        }
        /**
         * Sets the value of this calculation input
         *
         * @memberof SignalManagerCalculationInputData
         */
        set value(value) {
            let oldValue = this._value;
            this._value = this.calculationData.getRawValueToDisplayValue(value);
            this.onDataChanged(this, new eventSignalManagerDataChangedArgs_1.EventSignalManagerDataChangedArgs(eventSignalManagerDataChangedArgs_1.SignalManagerAction.valueChanged, value, oldValue));
        }
        /**
         * Set clone data like value, series data and calculation raw data. while cloning flag will be set at the beginning and reseted at the end
         *
         * @param {SignalManagerCalculationInputData} originalInputData
         * @memberof SignalManagerCalculationInputData
         */
        setCloneData(originalInputData) {
            this.whileCloning = true;
            this.value = originalInputData.value;
            if (originalInputData.serie != undefined) {
                this.serie = originalInputData.serie.clone();
            }
            // Sets the data information from the original object to the new created cloned object
            calculationData_1.CalculationData.setRawData(originalInputData.calculationData, this.calculationData);
            this.whileCloning = false;
        }
        /**
         * Returns the type of this calculation input
         *
         * @readonly
         * @protected
         * @type {string}
         * @memberof SignalManagerCalculationInputData
         */
        get nodeType() {
            return serieNode_1.NodeType.calculationInputParam;
        }
        /**
         * Sets the value of the signalCalculationData to the calculation data (NOT FOR serie names in signal calculation data; only for strings, numerics, ...)
         * Resets an old serie to undefined if it was used before in this SignalManagerCalculation data.
         *
         * @param {CalculationData} calculationData
         * @returns {boolean} false if data can not be set => data is not a number
         * @memberof SignalManagerCalculationInputData
         */
        setSignalCalculationValueToCalculationData(calculationData, showMessages) {
            calculationData.value = this.getRawValue();
            if (calculationData instanceof calculationDataNumber_1.CalculationDataNumber || calculationData instanceof calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints) {
                if (calculationData.value != "" && this.isNumber(calculationData.value) == false) {
                    let mainMessage = "Input data ('" + calculationData.value + "') is not in a valid number format";
                    if (calculationData instanceof calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints) {
                        // value from input data could also be a signal name
                        mainMessage += " nor a valid signal name";
                    }
                    // Input data not in a correct number format
                    if (showMessages == true) {
                        let message = mainMessage + ". Use '.' instead of ',' or remove characters in case of number! Previous value will be used.";
                        alert(message);
                    }
                    // Set not a number data => should lead to a calculation error
                    calculationData.setData(Number.NaN);
                    return false;
                }
                else {
                    let parsedData = parseFloat(calculationData.value);
                    calculationData.setData(parsedData); // Set available number data
                }
            }
            else if (calculationData instanceof calculationDataString_1.CalculationDataString) {
                calculationData.setData(calculationData.value); // Set available string data
            }
            else if (calculationData instanceof calculationDataPoints_1.CalculationDataPoints) {
                calculationData.setData(new Array()); // No signal data available, set empty points
            }
            // Remove current used serie from calculationData
            this.serie = undefined;
            return true;
        }
        /**
         * check if the string is in a correct number format (e.g. "1.2", "10e5", "-3", ...)
         *
         * @private
         * @param {string} numberString
         * @returns
         * @memberof SignalManagerCalculationInputData
         */
        isNumber(numberString) {
            return /^-?[\d.]+(?:e-?\d+)?$/.test(numberString);
        }
        setSignalCalculationValueToCalculationDataWithSerieData(serie, calculationData) {
            calculationData.value = this.value;
            calculationData.type = serie.type;
            if (calculationData instanceof calculationDataPoints_1.CalculationDataPoints || calculationData instanceof calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints) {
                calculationData.setData(serie.rawPoints);
            }
            // Add current used signal to calculationData
            this.serie = serie;
        }
        /**
         * Creates an instance of SignalManagerCalculationInputData.
         * @param {TCalculationData} calculationData
         * @param {boolean} isInput
         * @memberof SignalManagerCalculationInputData
         */
        constructor(calculationData) {
            super("", undefined);
            this.onlyValuesFromListAreAllowed = false;
            this.dropPossible = false;
            /**
             * Is a cloning operation active (some messages should not be shown while cloning)
             *
             * @type {boolean}
             * @memberof SignalManagerCalculationInputData
             */
            this.whileCloning = false;
            /**
             * Reset value while circular ref found operation active (some messages should not be shown while reset value in case of circular ref found)
             *
             * @type {boolean}
             * @memberof SignalManagerCalculationInputData
             */
            this.whileCircularRefFound = false;
            this.calculationData = calculationData;
            if (this.calculationData.displayInfo != undefined) {
                this.onlyValuesFromListAreAllowed = this.calculationData.displayInfo.onlyValuesFromListAreAllowed;
            }
            this._value = this.calculationData.value;
            this.canDelete = false;
        }
        /**
         * Returns all a list(displayValue, value) of the series which are available at the parent serie group, output series of the current calculation will be removed
         *
         * @private
         * @returns {Array<any>}
         * @memberof SignalManagerCalculationInputData
         */
        getSerieSelections() {
            // get all available series from parent serieGroup
            let serieSelections = this.getAllSeriesFromParentSerieGroup();
            // Remove own output series from this calculation
            let outputSerieData = this.getOutputDatasOfParent()[0]; // TODO: multi output
            if (outputSerieData != undefined) {
                if (outputSerieData.serie != undefined) {
                    for (let i = 0; i < serieSelections.length; i++) {
                        if (serieSelections[i].value == outputSerieData.serie.name) {
                            serieSelections.splice(i, 1);
                            i--;
                        }
                    }
                }
            }
            // Remove series which results in a cycle of calculations
            if (this.parent instanceof signalManagerCalculatorType_1.SignalManagerCalculatorType) {
                for (let i = 0; i < serieSelections.length; i++) {
                    if (this.parent.cycleFound(serieSelections[i].value) == true) { // check for cycle
                        serieSelections.splice(i, 1);
                        i--;
                    }
                }
            }
            return serieSelections;
        }
        /**
         * Returns a list(with displayValue and value) of all series from the parent serie group
         *
         * @private
         * @returns {Array<any>}
         * @memberof SignalManagerCalculationInputData
         */
        getAllSeriesFromParentSerieGroup() {
            let serieSelections = new Array();
            let serieGroup = this.getSerieGroup();
            if (serieGroup != undefined) { // Is a serie group available
                let series = serieGroup.getSeries();
                for (let i = 0; i < series.length; i++) {
                    // So far, only allowed to use yt series as input 
                    if (series[i].type == seriesType_1.SeriesType.timeSeries) {
                        let serieName = series[i].name;
                        serieSelections.push({ displayValue: serieName, value: serieName });
                    }
                }
            }
            return serieSelections;
        }
        getOutputDatasOfParent() {
            let outputDatas = new Array();
            if (this._parent != undefined) {
                let parentChilds = this._parent.getChilds();
                for (let i = 0; i < parentChilds.length; i++) {
                    if (parentChilds[i] instanceof signalManagerCalculationOutputData_1.SignalManagerCalculationOutputData) {
                        outputDatas.push(parentChilds[i]);
                    }
                }
            }
            return outputDatas;
        }
    };
    SignalManagerCalculationInputData = __decorate([
        mco.role()
    ], SignalManagerCalculationInputData);
    exports.SignalManagerCalculationInputData = SignalManagerCalculationInputData;
});
