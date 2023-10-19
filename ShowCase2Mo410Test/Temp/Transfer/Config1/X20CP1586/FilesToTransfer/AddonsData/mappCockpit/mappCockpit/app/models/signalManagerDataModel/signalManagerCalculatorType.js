var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/calculatorProvider/calculatorProvider", "../common/signal/serieContainer", "../common/calculatorProvider/calculationDataPoints", "./signalManagerCalculationInputData", "./signalManagerCalculationOutputData", "../common/series/eventSerieDataChangedArgs", "./signalManagerCalculation", "./eventSignalManagerDataChangedArgs"], function (require, exports, calculatorProvider_1, serieContainer_1, calculationDataPoints_1, signalManagerCalculationInputData_1, signalManagerCalculationOutputData_1, eventSerieDataChangedArgs_1, signalManagerCalculation_1, eventSignalManagerDataChangedArgs_1) {
    "use strict";
    var SignalManagerCalculatorType_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalManagerCalculatorType = void 0;
    let SignalManagerCalculatorType = SignalManagerCalculatorType_1 = class SignalManagerCalculatorType extends serieContainer_1.SerieContainer {
        get values() {
            return this._values;
        }
        get onlyValuesFromListAreAllowed() {
            return this._onlyValuesFromListAreAllowed;
        }
        get minValue() {
            return undefined;
        }
        get maxValue() {
            return undefined;
        }
        /**
         * Returns the name of this calculator type
         *
         * @readonly
         * @type {string}
         * @memberof SignalManagerCalculatorType
         */
        get name() {
            let dataModel = this.getDataModel();
            if (dataModel != undefined) {
                if (dataModel.editModeActive == true) {
                    return this._name; // Show the name of calculator type in the edit mode (e.g. Algorithm)
                }
            }
            return this.value; // Show only the value (e.g. "Add")
        }
        /**
         * Returns the parent of this calculator type
         *
         * @type {(ISerieContainer | undefined)}
         * @memberof SignalManagerCalculatorType
         */
        get parent() {
            return this._parent;
        }
        /**
         * Sets the parent of this calculator type
         *
         * @memberof SignalManagerCalculatorType
         */
        set parent(value) {
            this._parent = value;
        }
        /**
         * Remove reference to serie from this calculation
         *
         * @param {BaseSeries} serie
         * @memberof SignalManagerCalculatorType
         */
        removeReferenceToSerie(serie) {
            let calcDatas = this.getCalculationDatasCorrespondingToSignalName(serie);
            calcDatas.forEach(calculationData => {
                calculationData.value = "";
                let defaultData = new Array();
                calculationData.calculationData.setData(defaultData);
            });
        }
        // needed for CellTypeEditor
        get displayValue() {
            return this._value;
        }
        /**
         * Returns the value of this calculator type
         *
         * @type {string}
         * @memberof SignalManagerCalculatorType
         */
        get value() {
            return this._value;
        }
        /**
         * Sets the value of this calculator type
         *
         * @memberof SignalManagerCalculatorType
         */
        set value(value) {
            if (this._value != value) {
                let id = calculatorProvider_1.CalculatorProvider.getInstance().convertDisplayNameToId(value);
                this.setCalculatorById(id);
            }
        }
        /**
         * Sets the calculator by the given id
         *
         * @param {string} id
         * @memberof SignalManagerCalculatorType
         */
        setCalculatorById(id) {
            let oldValue = this._value;
            let displayName = calculatorProvider_1.CalculatorProvider.getInstance().convertIdToDisplayName(id);
            this._value = displayName;
            this._calculator = calculatorProvider_1.CalculatorProvider.getInstance().getCalculator(id);
            this.updateChildsByCalculatorType();
            // Calculate with default values to get error infos which data is not available
            this.calculate();
            // Raise data changed event
            this.onDataChanged(this, new eventSignalManagerDataChangedArgs_1.EventSignalManagerDataChangedArgs(eventSignalManagerDataChangedArgs_1.SignalManagerAction.valueChanged, displayName, oldValue));
        }
        /**
         * Attach to the events of the input and output data
         *
         * @private
         * @memberof SignalManagerCalculatorType
         */
        attachEvents() {
            for (let i = 0; i < this.childs.length; i++) {
                if (this.childs[i] instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData) {
                    this.childs[i].eventDataChanged.attach(this._inputDataChangedHandler);
                    this.childs[i].eventSerieDataChanged.attach(this._inputSerieDataChangedHandler);
                }
                else if (this.childs[i] instanceof signalManagerCalculationOutputData_1.SignalManagerCalculationOutputData) {
                    this.childs[i].eventDataChanged.attach(this._outputDataChangedHandler);
                }
            }
        }
        /**
         * Detach events from the input and output data
         *
         * @private
         * @memberof SignalManagerCalculatorType
         */
        detachEvents() {
            for (let i = 0; i < this.childs.length; i++) {
                if (this.childs[i] instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData) {
                    this.childs[i].eventDataChanged.detach(this._inputDataChangedHandler);
                    this.childs[i].eventSerieDataChanged.detach(this._inputSerieDataChangedHandler);
                }
                else if (this.childs[i] instanceof signalManagerCalculationOutputData_1.SignalManagerCalculationOutputData) {
                    this.childs[i].eventDataChanged.detach(this._outputDataChangedHandler);
                }
            }
        }
        updateChildsByCalculatorType() {
            // Detach events of current childs
            this.detachEvents();
            // Clear current childs
            this.clear();
            if (this._calculator == undefined) {
                return;
            }
            // Add input data for calculation
            let defaultInputData = this._calculator.getDefaultInputData();
            for (let i = 0; i < defaultInputData.length; i++) {
                let inputData = new signalManagerCalculationInputData_1.SignalManagerCalculationInputData(defaultInputData[i]);
                this.addSerieNode(inputData);
            }
            // Add ouput data for calculation
            let defaultOutputData = this._calculator.getDefaultOutputData();
            for (let i = 0; i < defaultOutputData.length; i++) {
                let outputData = new signalManagerCalculationOutputData_1.SignalManagerCalculationOutputData(defaultOutputData[i], this._seriesProvider);
                this.addSerieNode(outputData);
            }
            // Attach events to the new childs
            this.attachEvents();
        }
        /**
         * Returns the description of the calculator type
         *
         * @readonly
         * @type {string}
         * @memberof SignalManagerCalculatorType
         */
        get description() {
            if (this._calculator != undefined) {
                return this._calculator.description;
            }
            return "";
        }
        /**
         * Creates an instance of SignalManagerCalculatorType
         * @param {string} name
         * @param {string} value
         * @memberof SignalManagerCalculatorType
         */
        constructor(name, value, seriesProvider) {
            super(name, "", true);
            this._inputDataChangedHandler = (sender, args) => this.onInputDataValueChanged(sender, args);
            this._inputSerieDataChangedHandler = (sender, args) => this.onSerieDataChanged(sender, args);
            this._outputDataChangedHandler = (sender, args) => this.onOutputDataValueChanged(sender, args);
            this.dataTypeName = "String";
            this._seriesProvider = seriesProvider;
            this._value = value;
            this.canDelete = false;
            this._values = this.getAvailableCalculators();
            this._onlyValuesFromListAreAllowed = true;
        }
        /**
         * Dispose the SignalManagerCalculatorType
         *
         * @memberof SignalManagerCalculatorType
         */
        dispose() {
            // Detach events
            this.detachEvents();
            super.dispose();
        }
        /**
         * Clones the SignalManagerCalculatorType object with all childs
         *
         * @returns {SignalManagerCalculatorType}
         * @memberof SignalManagerCalculatorType
         */
        clone() {
            // Clone object
            let clone = new SignalManagerCalculatorType_1(this._name, "", this._seriesProvider);
            if (this._calculator != undefined) {
                clone.setCalculatorById(this._calculator.id); // Set current used calculator from original
            }
            // Set input data 
            let originalInputDatas = this.getInputCalculationData();
            let clonedInputDatas = clone.getInputCalculationData();
            for (let i = 0; i < originalInputDatas.length; i++) {
                // Set data from original to cloned object
                clonedInputDatas[i].setCloneData(originalInputDatas[i]);
            }
            // Set output data
            let originalOutputData = this.getFirstOutputCalculationData(); // TODO: multioutput
            let clonedOutputData = clone.getFirstOutputCalculationData(); // TODO: multioutput
            if (originalOutputData != undefined && clonedOutputData != undefined) {
                clonedOutputData.value = originalOutputData.value;
            }
            clone.calculate();
            return clone;
        }
        /**
         * Returns a list with available calculators displayValue and id
         *
         * @private
         * @returns {any[]}
         * @memberof SignalManagerCalculatorType
         */
        getAvailableCalculators() {
            let possibleTypes = new Array();
            let calculators = calculatorProvider_1.CalculatorProvider.getInstance().calculators;
            for (let i = 0; i < calculators.length; i++) {
                possibleTypes.push({ displayValue: calculators[i].displayName, value: calculators[i].id });
            }
            return possibleTypes;
        }
        getSerie(serieName) {
            if (serieName != undefined) {
                let serieGroup = this.getSerieGroup();
                if (serieGroup != undefined) {
                    return serieGroup.getSerie(serieName);
                }
            }
            return undefined;
        }
        onInputDataValueChanged(sender, args) {
            if (args.data == args.oldData) {
                // Nothing has changed
                return;
            }
            if (sender instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData) {
                let signalCalculationInputData = sender;
                let calculationData = signalCalculationInputData.calculationData;
                // Check if old input data was a signal(name)
                let oldSerie = this.getSerie(calculationData.value);
                if (oldSerie != undefined) {
                    // Remove current used signal from calculationData
                    signalCalculationInputData.serie = undefined;
                }
                // Check if new input data is a signal(name)
                let serie = this.getSerie(signalCalculationInputData.getRawValue()); // get the signal group and look for signal with given name in it
                if (serie != undefined) {
                    if (this.cycleFound(signalCalculationInputData.value, "", true) == false) {
                        signalCalculationInputData.setSignalCalculationValueToCalculationDataWithSerieData(serie, calculationData);
                    }
                    else {
                        //  Cycle found use old input data
                        signalCalculationInputData.whileCircularRefFound = true;
                        signalCalculationInputData.value = calculationData.value;
                        signalCalculationInputData.whileCircularRefFound = false;
                    }
                }
                else {
                    calculationData.type = undefined;
                    // Don't show message and don't reset value while cloning or circular ref value reset
                    let whileCloningOrCircularRefFound = signalCalculationInputData.whileCloning || signalCalculationInputData.whileCircularRefFound;
                    let calculationDataWasSet = signalCalculationInputData.setSignalCalculationValueToCalculationData(calculationData, !whileCloningOrCircularRefFound);
                    if (calculationDataWasSet == false && whileCloningOrCircularRefFound == false) {
                        // Set the data was not possible => use old data if not while cloning or reset value after circular ref found
                        signalCalculationInputData.value = args.oldData;
                        return;
                    }
                }
                this.calculate();
            }
        }
        /**
         * Check if the signal name, which will be used for input of this calculation depends on the output of this calculation
         *
         * @param {string} inputSignalName
         * @param {string} [ouputSignalName=""]
         * @returns {boolean}
         * @memberof SignalManagerCalculatorType
         */
        cycleFound(inputSignalName, ouputSignalName = "", showMessage = false) {
            // get serieNode where it is defined(calculation output or normal signal)
            let serieNode = this.getSerieGroup().getSerieNode(inputSignalName);
            if (serieNode == undefined) {
                return false; // No signal node found => no cycle
            }
            if (!(serieNode instanceof signalManagerCalculation_1.SignalManagerCalculation)) {
                return false; // No calculated signal => no cycle
            }
            if (ouputSignalName == "") {
                //Workaround: Fixed for creation of FFT with D&D. Input data should be added after calculator has been created.
                let firstOutputData = this.getFirstOutputCalculationData();
                if (firstOutputData != undefined) {
                    ouputSignalName = firstOutputData.value;
                }
            }
            if (this.foundCircularReference(serieNode, ouputSignalName, showMessage)) {
                return true;
            }
            return false;
        }
        foundCircularReference(calculationNode, ouputSignalName = "", showMessage) {
            // get input signals of calculation
            // TODO: refactor a little
            if (calculationNode.getChilds()[0] instanceof SignalManagerCalculatorType_1) {
                let calculatorType = calculationNode.getChilds()[0];
                let inputSerieNodes = calculatorType.getInputCalculationData();
                for (let i = 0; i < inputSerieNodes.length; i++) {
                    if (inputSerieNodes[i].value == ouputSignalName) { // TODO: multi output
                        if (showMessage == true) {
                            alert("Circular reference found!");
                        }
                        return true; // input references to output of current calculation => cycle found
                    }
                    else {
                        let childSerieNode = inputSerieNodes[i].getSerieGroup().getSerieNode(inputSerieNodes[i].value);
                        if (childSerieNode != undefined) {
                            let cycleFound = inputSerieNodes[i].parent.cycleFound(inputSerieNodes[i].value, ouputSignalName, showMessage);
                            if (cycleFound == true) {
                                if (showMessage == true) {
                                    alert("Circular reference found!");
                                }
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
        onSerieDataChanged(sender, args) {
            let serie = sender;
            let correspondingCalculationDatas = this.getCalculationDatasCorrespondingToSignalName(serie);
            if (args.action == eventSerieDataChangedArgs_1.SerieAction.dataPointsChanged) {
                correspondingCalculationDatas.forEach((calcData) => {
                    calcData.calculationData.setData(args.data); // Sets the actual data points to the calculation input data
                });
                this.calculate();
            }
            else if (args.action == eventSerieDataChangedArgs_1.SerieAction.rename) {
                correspondingCalculationDatas.forEach((calcData) => {
                    calcData.value = serie.name;
                });
            }
        }
        getCalculationDatasCorrespondingToSignalName(serie) {
            let calcDatas = new Array();
            for (let i = 0; i < this.childs.length; i++) {
                let signalCalculationData = (this.childs[i]);
                if (signalCalculationData.serie == serie) {
                    calcDatas.push(this.childs[i]);
                }
            }
            return calcDatas;
        }
        /**
         * Calculates with the current input data and updates the outputdata
         *
         * @memberof SignalManagerCalculatorType
         */
        calculate() {
            // Calculate with actual input data
            let inputData = new Array();
            let calculationOutputData = new Array();
            let inputCalculationData;
            let actuallyUsedInputData = inputData;
            if (this._calculator != undefined) {
                // Start calculation with actual input data
                inputCalculationData = this.getInputCalculationData();
                inputCalculationData.forEach(inputCalculationData => {
                    inputData.push(inputCalculationData.calculationData);
                });
                calculationOutputData = this._calculator.calculate(inputData);
                actuallyUsedInputData = this._calculator.getActualInputData();
            }
            // Update outputdata TODO: multi output ,not only the first one
            let outputData = this.getFirstOutputCalculationData();
            if (outputData != undefined && outputData.serie != undefined) {
                if (this._calculator != undefined) {
                    let errors = this._calculator.getErrors();
                    if (errors.length > 0) {
                        outputData.serie.errorInfo = errors;
                    }
                }
                let calculatorType = calculatorProvider_1.CalculatorProvider.getInstance().convertDisplayNameToId(this.value);
                outputData.serie.updateCalculationDataInfo(actuallyUsedInputData, calculatorType, this.getInputCalculationData(), this._seriesProvider);
                if (calculationOutputData[0] instanceof calculationDataPoints_1.CalculationDataPoints) {
                    outputData.serie.updatePoints(calculationOutputData[0].getData());
                    let seriesGroup = outputData.getSerieGroup();
                    if (seriesGroup != undefined) {
                        outputData.serie.startTriggerTime = seriesGroup.startTriggerTime;
                    }
                }
                else {
                    console.error("New calculation output data available. New implementation needed! Only DataPoints supported currently.");
                }
            }
        }
        /**
         * Returns all calculation input datas
         *
         * @returns {Array<SignalManagerCalculationInputData>}
         * @memberof SignalManagerCalculatorType
         */
        getInputCalculationData() {
            let inputData = new Array();
            let calculationTypeChilds = this.childs;
            for (let i = 0; i < calculationTypeChilds.length; i++) {
                let signalCalculationData = calculationTypeChilds[i];
                if (signalCalculationData instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData) {
                    inputData.push(signalCalculationData);
                }
            }
            return inputData;
        }
        getInputCalculationDataById(id) {
            let calculationTypeChilds = this.childs;
            for (let i = 0; i < calculationTypeChilds.length; i++) {
                let signalCalculationData = calculationTypeChilds[i];
                if (signalCalculationData instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData) {
                    if (signalCalculationData.calculationData.id == id) {
                        return signalCalculationData;
                    }
                }
            }
            return undefined;
        }
        /**
         * Returns the first calculation output data
         *
         * @returns {(SignalManagerCalculationOutputData|undefined)}
         * @memberof SignalManagerCalculatorType
         */
        getFirstOutputCalculationData() {
            let calculationTypeChilds = this.childs;
            for (let i = 0; i < calculationTypeChilds.length; i++) {
                let calculationData = calculationTypeChilds[i];
                if (calculationData instanceof signalManagerCalculationOutputData_1.SignalManagerCalculationOutputData) {
                    return calculationData;
                }
            }
            return undefined;
        }
        /**
         * Returns a series for the given name from this calculator type node (e.g. output series of calculations)
         *
         * @param {string} [serieName=""] if serieName = "" all series wil be returned
         * @returns {Array<ISerieNode>}
         * @memberof SignalManagerCalculatorType
         */
        getSerieNodes(serieName = "") {
            let serieNodes = new Array();
            for (let i = 0; i < this.childs.length; i++) {
                let child = this.childs[i];
                if (child instanceof signalManagerCalculationOutputData_1.SignalManagerCalculationOutputData) { // Is only a signal in case of outputdata
                    if (serieName == "" || child.value == serieName) {
                        serieNodes.push(child);
                    }
                }
                else if (child instanceof serieContainer_1.SerieContainer) {
                    serieNodes = serieNodes.concat(child.getSerieNodes(serieName));
                }
            }
            return serieNodes;
        }
        onOutputDataValueChanged(sender, args) {
            let serieGroup = this.getSerieGroup();
            if (serieGroup != undefined) {
                let serieNode = this.getSerieGroup().getSerieNodes(args.data);
                if (serieNode.length > 1) { // Signal with given name already available => set signal name to the used name before
                    let signalCalculationData = sender;
                    signalCalculationData.value = args.oldData;
                    //let calculationData = signalCalculationData.calculationData
                    //calculationData.value = args.oldData; 
                    // TODO: Show MessageBox
                    return;
                }
            }
            this.onDataChanged(sender, args);
        }
    };
    SignalManagerCalculatorType = SignalManagerCalculatorType_1 = __decorate([
        mco.role()
    ], SignalManagerCalculatorType);
    exports.SignalManagerCalculatorType = SignalManagerCalculatorType;
});
