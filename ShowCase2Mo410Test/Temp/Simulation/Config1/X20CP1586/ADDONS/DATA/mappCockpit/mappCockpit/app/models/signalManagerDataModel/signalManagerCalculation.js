var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/dateTimeHelper", "../common/calculation/calculation", "./signalManagerCalculatorType", "../common/signal/serieContainer", "./signalManagerCalculationInputData", "../common/calculatorProvider/calculationDataPoints", "../common/calculatorProvider/calculationDataNumberOrPoints", "../common/signal/serieNode", "../common/series/seriesType"], function (require, exports, dateTimeHelper_1, calculation_1, signalManagerCalculatorType_1, serieContainer_1, signalManagerCalculationInputData_1, calculationDataPoints_1, calculationDataNumberOrPoints_1, serieNode_1, seriesType_1) {
    "use strict";
    var SignalManagerCalculation_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalManagerCalculation = void 0;
    let SignalManagerCalculation = SignalManagerCalculation_1 = class SignalManagerCalculation extends serieContainer_1.SerieContainer {
        get validNode() {
            let outputData = this.getOutputCalculationData();
            if (outputData.length > 0) {
                if (outputData[0].serie != undefined) {
                    return outputData[0].serie.rawPointsValid;
                }
            }
            return false;
        }
        /**
         * Returns only the visible childs (e.g visible childs only available in edit mode)
         *
         * @readonly
         * @type {(ISerieNode[]|undefined)}
         * @memberof SignalManagerCalculation
         */
        get visibleChilds() {
            let dataModel = this.getDataModel();
            if (dataModel != undefined) {
                if (dataModel.editModeActive == false) {
                    return undefined;
                }
            }
            return this.childs;
        }
        get name() {
            let data = this.getOutputCalculationData();
            if (data.length > 0) {
                // TODO: multi output ,use not only the first output
                return data[0].serie.name;
            }
            if (this._name != undefined) {
                return this._name;
            }
            return "";
        }
        set name(name) {
            this._name = name;
        }
        get serie() {
            let data = this.getOutputCalculationData();
            if (data.length > 0) {
                // TODO: multi output ,not only the first output
                return data[0].serie;
            }
            return undefined;
        }
        set serie(value) {
        }
        get color() {
            let data = this.getOutputCalculationData();
            if (data.length > 0) {
                // TODO: multi output ,not only the first output
                return data[0].color;
            }
            return undefined;
        }
        set color(color) {
            let data = this.getOutputCalculationData();
            if (data.length > 0 && color != undefined) {
                // TODO: multi output ,not only the first output
                data[0].color = color;
            }
        }
        get startTriggerTime() {
            let serieGroup = this.getSerieGroup();
            if (serieGroup != undefined) {
                return serieGroup.startTriggerTime;
            }
            return 0; // Not start trigger available
        }
        get startTriggerTimeFormated() {
            let serieGroup = this.getSerieGroup();
            if (serieGroup != undefined) {
                return dateTimeHelper_1.DateTimeHelper.getDateTime(serieGroup.startTriggerTime);
            }
            return ""; // Not start trigger info available
        }
        /**
         * Creates an instance of SignalManagerCalculation.
         * @param {string} name
         * @memberof SignalManagerCalculation
         */
        constructor(name, seriesProvider) {
            super(name);
            this._seriesProvider = seriesProvider;
            this.id = name + SignalManagerCalculation_1.uniqueId;
            SignalManagerCalculation_1.uniqueId++;
            this._calculation = new calculation_1.Calculation("select type");
            // Init => Add Type for calculation
            this._calculatorType = new signalManagerCalculatorType_1.SignalManagerCalculatorType("Algorithm", "select type", this._seriesProvider);
            this.addSerieContainer(this._calculatorType, -1);
        }
        dispose() {
            this._calculatorType.dispose();
            super.dispose();
        }
        /**
         * Removes all references to the given series from the calculation
         *
         * @param {BaseSeries} serie
         * @memberof SignalManagerCalculation
         */
        removeReferencesToSerie(serie) {
            this._calculatorType.removeReferenceToSerie(serie);
        }
        get nodeType() {
            let dataModel = this.getDataModel();
            if (dataModel != undefined) {
                if (dataModel.editModeActive == true) {
                    return serieNode_1.NodeType.container;
                }
            }
            return serieNode_1.NodeType.series;
        }
        calculate() {
            this._calculatorType.calculate();
        }
        /**
         * Sets the calculator type(e.g. "add", "sub", ...)
         *
         * @param {string} calculatorTypeId
         * @memberof SignalManagerCalculation
         */
        setCalculatorTypeById(calculatorTypeId) {
            this._calculatorType.setCalculatorById(calculatorTypeId);
        }
        /**
           *  Sets the given value to the inputparameter with given id
           *
           * @param {number} index
           * @param {string} value
           * @memberof SignalManagerCalculation
           */
        setInputValueById(id, value) {
            let inputData = this._calculatorType.getInputCalculationDataById(id);
            if (inputData != undefined) {
                inputData.value = value;
            }
            else {
                console.error("Value can't be set to current id! => " + id);
            }
        }
        /**
         * Sets the signal name of the calculation ouptut
         *
         * @param {string} name
         * @memberof SignalManagerCalculation
         */
        setOutputSignalName(name) {
            let outputDatas = this.getOutputCalculationData();
            if (outputDatas != undefined && outputDatas.length > 0) {
                outputDatas[0].value = name;
            }
        }
        /**
         * Clones the calculation
         *
         * @returns
         * @memberof SignalManagerCalculation
         */
        clone() {
            // Clone object
            let clonedSignalCalculation = new SignalManagerCalculation_1(this.name, this._seriesProvider);
            clonedSignalCalculation._calculation = this._calculation;
            // Clone calculator type child container
            clonedSignalCalculation.childs.splice(0, 1); // TODO: Implement RemoveSerieContainer
            let calculatorType = this._calculatorType.clone();
            clonedSignalCalculation._calculatorType = calculatorType;
            clonedSignalCalculation.addSerieContainer(calculatorType);
            return clonedSignalCalculation;
        }
        /**
         * Needed to update the input series of this calculations to the new series of the new serieGroup
         *
         * @param {SerieGroup} serieGroup
         * @returns {Array<string>} serie ids which are not needed any more as input series(should be removed from series provider)
         * @memberof SignalManagerCalculation
         */
        updateInputData(serieGroup) {
            let listOfSeriesIdsToRemove = new Array();
            let calculationInputDatas = this.getInputCalculationData();
            for (let j = 0; j < calculationInputDatas.length; j++) {
                let inputData = calculationInputDatas[j];
                if (inputData.serie != undefined) {
                    // find serie in new cloned serie group by name ...
                    let foundSerie = serieGroup.getSerie(inputData.serie.name);
                    if (foundSerie != undefined) {
                        // Save id of clone serie object which one can be removed after updating all input Series
                        if (listOfSeriesIdsToRemove.includes(inputData.serie.id) == false) {
                            listOfSeriesIdsToRemove.push(inputData.serie.id);
                        }
                        // ... and set the new serie
                        inputData.serie = foundSerie;
                    }
                }
            }
            return listOfSeriesIdsToRemove;
        }
        /**
         * Sets(or resets) a flag at all inputs of this calculation where a drop of the given series would be possible
         *
         * @param {boolean} activate
         * @param {BaseSeries} series
         * @memberof SignalManagerCalculation
         */
        setDropLocations(activate, series) {
            if (this.visibleChilds != undefined) {
                if (this.visibleChilds.length > 0) {
                    let calculationType = this.visibleChilds[0];
                    calculationType.visibleChilds.forEach(calculationData => {
                        if (calculationData instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData) {
                            if (this.isSeriesDropAllowedAtCurrentInputItem(calculationData, series) == true) {
                                calculationData.dropPossible = activate;
                            }
                        }
                    });
                }
            }
        }
        /**
         * Checks if a drop of a series is possible for the given calculation input
         *
         * @private
         * @param {SignalManagerCalculationInputData} inputItem
         * @param {BaseSeries} serie
         * @returns {boolean}
         * @memberof SignalManagerCalculation
         */
        isSeriesDropAllowedAtCurrentInputItem(inputItem, serie) {
            // It is not allowed to use xy or fft series as input 
            if (serie.type == seriesType_1.SeriesType.xySeries || serie.type == seriesType_1.SeriesType.fftSeries) {
                return false;
            }
            // It is not allowed to use fft series as input for FFT calculation
            // if(inputItem.parent instanceof SignalManagerCalculatorType){
            //     if(inputItem.parent.value == 'FFT' && serie.type == SeriesType.fftSeries) {
            //         return false;
            //     }
            // }
            // Series can only be dropped at an input where serie(datapoints) are allowed
            if (!(inputItem.calculationData instanceof calculationDataPoints_1.CalculationDataPoints) && !(inputItem.calculationData instanceof calculationDataNumberOrPoints_1.CalculationDataNumberOrPoints)) {
                return false;
            }
            let outputSeriesOfCalculation = inputItem.parent.getSeries();
            if (outputSeriesOfCalculation.indexOf(serie) == -1) { // OutputSeries of this calculation are not allowed for this calculation as input(circular reference)
                if (inputItem.getSerieGroup() == serie.parent) { // Check for same serie group
                    if (inputItem.parent instanceof signalManagerCalculatorType_1.SignalManagerCalculatorType) {
                        if (inputItem.parent.cycleFound(serie.name) == false) { // check for cycle
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        /**
         * Returns all calculation input datas
         *
         * @returns {Array<SignalManagerCalculationInputData>}
         * @memberof SignalManagerCalculation
         */
        getInputCalculationData() {
            return this._calculatorType.getInputCalculationData();
        }
        /**
         * Returns all calculation output datas
         *
         * @returns {Array<SignalManagerCalculationOutputData>}
         * @memberof SignalManagerCalculation
         */
        getOutputCalculationData() {
            let outputData = this._calculatorType.getFirstOutputCalculationData();
            if (outputData != undefined) {
                return [outputData];
            }
            return new Array();
        }
    };
    SignalManagerCalculation.uniqueId = 0; // TODO: use unique id 
    SignalManagerCalculation = SignalManagerCalculation_1 = __decorate([
        mco.role()
    ], SignalManagerCalculation);
    exports.SignalManagerCalculation = SignalManagerCalculation;
});
