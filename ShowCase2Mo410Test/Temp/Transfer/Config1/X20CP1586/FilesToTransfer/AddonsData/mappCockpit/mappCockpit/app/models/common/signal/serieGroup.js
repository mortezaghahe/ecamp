var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/dateTimeHelper", "../../../common/persistence/settings", "../../signalManagerDataModel/signalManagerDataModelSettingIds", "./serieContainer", "./serieNode", "../../signalManagerDataModel/signalManagerCalculation", "../../signalManagerDataModel/signalManagerCalculationInputData", "../../signalManagerDataModel/signalCategory"], function (require, exports, dateTimeHelper_1, settings_1, signalManagerDataModelSettingIds_1, serieContainer_1, serieNode_1, signalManagerCalculation_1, signalManagerCalculationInputData_1, signalCategory_1) {
    "use strict";
    var SerieGroup_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SerieGroup = void 0;
    let SerieGroup = SerieGroup_1 = class SerieGroup extends serieContainer_1.SerieContainer {
        get startTriggerTime() {
            return this._startTriggerTime;
        }
        set startTriggerTime(value) {
            this._startTriggerTime = value;
        }
        get color() {
            return undefined;
        }
        /**
         * Creates an instance of SerieGroup.
         * @param {string} name
         * @param {number} startTriggerTime
         * @memberof SerieGroup
         */
        constructor(name, id, startTriggerTime, expandState = true) {
            super(name, id, expandState);
            this.isSerieGroup = true;
            this._startTriggerTime = startTriggerTime;
        }
        getSettings() {
            let settings = new settings_1.Settings("SerieGroup");
            let seriesOfGroup = this.getSeries();
            if (seriesOfGroup != undefined) {
                let seriesIds = new Array();
                for (let i = 0; i < seriesOfGroup.length; i++) {
                    seriesIds.push(seriesOfGroup[i].id);
                }
                let containerName = undefined;
                let containerId = undefined;
                let containerExpandState = undefined;
                let expandState = this.expandState;
                if (this.parent != undefined && !(this.parent instanceof signalCategory_1.SignalCategory)) {
                    containerName = this.parent.name;
                    containerId = this.parent.id;
                    containerExpandState = this.parent.expandState;
                }
                settings.setValue(signalManagerDataModelSettingIds_1.SettingIds.ContainerName, containerName);
                settings.setValue(signalManagerDataModelSettingIds_1.SettingIds.ContainerExpandState, containerExpandState);
                settings.setValue(signalManagerDataModelSettingIds_1.SettingIds.SeriesIds, seriesIds);
                settings.setValue(signalManagerDataModelSettingIds_1.SettingIds.ContainerId, containerId);
                settings.setValue(signalManagerDataModelSettingIds_1.SettingIds.SerieGroupStartTriggerTime, this.startTriggerTime);
                settings.setValue(signalManagerDataModelSettingIds_1.SettingIds.ExpandState, expandState);
            }
            return settings;
        }
        setSettings(settings) {
            let settingsObj = settings_1.Settings.create(settings);
            // Set name, id, startTriggerTime and expandState of group
            let startTriggerTime = settingsObj.getValue(signalManagerDataModelSettingIds_1.SettingIds.SerieGroupStartTriggerTime);
            this.name = dateTimeHelper_1.DateTimeHelper.getDateTime(startTriggerTime);
            this.id = startTriggerTime.toString();
            this._startTriggerTime = startTriggerTime;
            this.expandState = settingsObj.getValue(signalManagerDataModelSettingIds_1.SettingIds.ExpandState);
            this.addSerieIdsFromSerieProviderToGroup(settingsObj.getValue(signalManagerDataModelSettingIds_1.SettingIds.SeriesIds));
        }
        /**
         * Adds the series for the given seriesIds to this group
         *
         * @private
         * @param {Array<string>} seriesIds
         * @memberof SerieGroup
         */
        addSerieIdsFromSerieProviderToGroup(seriesIds) {
            let calculations = new Map();
            let dataModel = this.getDataModel();
            if (dataModel != undefined && dataModel.seriesProvider != undefined) {
                // add series to group and calculations without input data (needed to have all )
                seriesIds.forEach(serieId => {
                    let foundSerie = dataModel.seriesProvider.get(serieId);
                    if (foundSerie != undefined) {
                        if (foundSerie.calculationDataInfo != undefined) {
                            if (foundSerie.calculationDataInfo.type != "") {
                                // set output series object
                                let newCalculation = this.addCalculation(foundSerie.calculationDataInfo.type, foundSerie);
                                if (newCalculation != undefined) {
                                    calculations.set(foundSerie, newCalculation);
                                }
                                else {
                                    console.error("Calculator for given id not found! => " + foundSerie.calculationDataInfo.type);
                                }
                            }
                        }
                        else {
                            this.addSerie(foundSerie);
                        }
                    }
                });
            }
            else {
                console.error("dataModel or dataModel.seriesProvider is undefined!");
            }
            // set input data of calculations
            calculations.forEach((signalManagerCalculation, series) => {
                if (series != undefined) {
                    // get input values
                    let inputValues = new Array();
                    if (series.calculationDataInfo != undefined) {
                        for (let i = 0; i < series.calculationDataInfo.inputDataValues.length; i++) {
                            inputValues.push(series.calculationDataInfo.inputDataValues[i]);
                        }
                    }
                    if (series.calculationDataInfo != undefined) {
                        // set input values
                        for (let i = 0; i < series.calculationDataInfo.inputDataIds.length; i++) {
                            signalManagerCalculation.setInputValueById(series.calculationDataInfo.inputDataIds[i], inputValues[i]);
                        }
                    }
                }
            });
        }
        /**
         * Adds a new calculation with the given type to this group
         *
         * @param {string} type
         * @param {(BaseSeries|undefined)} [existingSerie=undefined]
         * @returns {SignalManagerCalculation}
         * @memberof SerieGroup
         */
        addCalculation(type, existingSerie = undefined) {
            // this serie is the output of a calculation => add calculation
            let dataModel = this.getDataModel();
            if (dataModel == undefined || dataModel.seriesProvider == undefined) {
                return undefined;
            }
            let calculation = new signalManagerCalculation_1.SignalManagerCalculation("Calculation", dataModel.seriesProvider);
            this.addSerieContainer(calculation, -1);
            // set calculationType
            calculation.setCalculatorTypeById(type);
            if (existingSerie != undefined) {
                let outputData = calculation.getOutputCalculationData();
                if (outputData.length > 0) { // TODO: Implement multiOutput
                    // Add new serie object
                    outputData[0].serie = existingSerie;
                }
            }
            return calculation;
        }
        /**
         * Adds a serie to this serie container
         *
         * @param {BaseSeries} serie
         * @param {number} [index=-1]  -1 to add at the end, else the index where to add
         * @memberof SerieContainer
         */
        addSerie(serie, index = -1) {
            let newSerieNode = new serieNode_1.SerieNode(undefined, serie);
            super.addSerieNode(newSerieNode);
        }
        /**
         * Removes a serie from this serie container
         *
         * @param {BaseSeries} serie
         * @memberof SerieContainer
         */
        removeSerie(serie) {
            // Found serie within serienodes
            let serieNode = undefined;
            for (let i = 0; i < this.childs.length; i++) {
                if (this.childs[i].serie == serie) {
                    serieNode = this.childs[i];
                }
            }
            if (serieNode != undefined) {
                super.removeSerieNode(serieNode);
            }
        }
        /**
         * Remove all references to the given serie within this serie group(e.g. references in calculations)
         *
         * @param {(BaseSeries|undefined)} serie
         * @memberof SerieGroup
         */
        removeReferencesToSerieNode(serieNode) {
            if (!(serieNode instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData)) {
                // inform all child nodes(calculations) that a serie will be removed from this serieGroup; only in case of
                // the serieNode is no inputSignal of a calculation
                this.getChilds().forEach(child => {
                    if (child instanceof signalManagerCalculation_1.SignalManagerCalculation) {
                        let calculation = child;
                        if (serieNode.serie != undefined) {
                            calculation.removeReferencesToSerie(serieNode.serie);
                        }
                    }
                });
            }
        }
        /**
         * Makes a copy of the object with all sub objects(e.g. series)
         *
         * @returns {SerieGroup}
         * @memberof SerieGroup
         */
        clone() {
            let id = this.startTriggerTime.toString();
            let serieGroup = new SerieGroup_1(this.name, id, this.startTriggerTime);
            serieGroup.expandState = this.expandState;
            for (let i = 0; i < this.childs.length; i++) {
                let serieNode = this.childs[i];
                if (serieNode != undefined) {
                    serieGroup.addSerieNode(serieNode.clone(), -1);
                }
            }
            let listOfSeriesIdsToRemove = new Array();
            // update series at input calculation data with cloned series from serie group
            for (let i = 0; i < serieGroup.childs.length; i++) {
                let calculationNode = serieGroup.childs[i];
                if (calculationNode instanceof signalManagerCalculation_1.SignalManagerCalculation) {
                    let serieIdsToRemove = calculationNode.updateInputData(serieGroup);
                    // Add only serie ids which are not already in the list
                    let addToList = serieIdsToRemove.filter((item) => listOfSeriesIdsToRemove.indexOf(item) < 0);
                    listOfSeriesIdsToRemove = listOfSeriesIdsToRemove.concat(addToList);
                }
            }
            let dataModel = this.getDataModel();
            if (dataModel != undefined) {
                let seriesProvider = dataModel.seriesProvider;
                if (seriesProvider != undefined) {
                    // Remove cloned series input objects from series provider to avoid unused series objects
                    listOfSeriesIdsToRemove.forEach(seriesId => {
                        seriesProvider.remove(seriesId);
                    });
                }
            }
            return serieGroup;
        }
        /**
         * Returns the serie with the given serieName within the serie group
         *
         * @param {string} serieName
         * @returns {(BaseSeries|undefined)}
         * @memberof SerieGroup
         */
        getSerie(serieName) {
            let series = this.getSeries();
            for (let i = 0; i < series.length; i++) {
                if (series[i].name == serieName) {
                    return series[i];
                }
            }
            return undefined;
        }
        getSerieByOriginalName(originalName) {
            let series = this.getSeries();
            for (let i = 0; i < series.length; i++) {
                if (series[i].originalName == originalName) {
                    return series[i];
                }
            }
            return undefined;
        }
        /**
         * Merges the information of a serie group to an existing serie group
         * Adds new series; removes not available series; updates the data of existing series(same serie name)
         * Calculations will be ignored
         *
         * @param {ISerieGroup} newSerieGroup
         * @memberof SerieGroup
         */
        mergeWithSerieGroup(newSerieGroup) {
            this.startTriggerTime = newSerieGroup.startTriggerTime;
            this.name = newSerieGroup.name;
            // Remove unused series (only if not a calculation)
            for (let i = 0; i < this.childs.length; i++) {
                let serieNode = this.childs[i];
                let serieNodeName = serieNode.name;
                if (serieNode.serie != undefined) {
                    serieNodeName = serieNode.serie.originalName;
                }
                let foundSerieNode = newSerieGroup.getSerieByOriginalName(serieNodeName);
                if (foundSerieNode == undefined) {
                    if (!(serieNode instanceof signalManagerCalculation_1.SignalManagerCalculation)) { // Remove only if not a calculation
                        this.removeSerieNode(serieNode);
                        i--;
                    }
                }
                else {
                    // Updates the data of an existing serie
                    if (serieNode.serie != undefined) {
                        serieNode.serie.updatePoints(foundSerieNode.rawPoints);
                        serieNode.serie.errorInfo = foundSerieNode.errorInfo;
                        serieNode.serie.startTriggerTime = foundSerieNode.startTriggerTime;
                    }
                }
            }
            this.addSeriesFromGroup(newSerieGroup);
        }
        /**
         * Adds series from the given serieGroup to this serieGroup if not already there
         * Signals will be added before the first calculation
         *
         * @private
         * @param {ISerieGroup} serieGroup
         * @memberof SerieGroup
         */
        addSeriesFromGroup(serieGroup) {
            // add new series before calculations
            let firstCalculationIndex = this.getFirstCalculationIndex();
            let childs = serieGroup.getChilds();
            for (let i = 0; i < childs.length; i++) {
                let serieNodeName = childs[i].name;
                if (childs[i].serie != undefined) {
                    serieNodeName = childs[i].serie.originalName;
                }
                let foundSerieNode = this.getSerieByOriginalName(serieNodeName);
                if (foundSerieNode == undefined) {
                    let newSerieNode = childs[i];
                    if (newSerieNode != undefined) {
                        this.addSerieNode(newSerieNode, firstCalculationIndex);
                        if (firstCalculationIndex != -1) {
                            firstCalculationIndex++;
                        }
                    }
                }
                else {
                    //Delete old serieNode from serieProvider (as the new serieNode of serieGroup is used)
                    let dataModel = this.getDataModel();
                    dataModel.seriesProvider.remove(childs[i].serie.id);
                }
            }
        }
        /**
         * Returns the index of the first calculation in the childs of this group
         *
         * @private
         * @returns {number}
         * @memberof SerieGroup
         */
        getFirstCalculationIndex() {
            for (let i = 0; i < this.childs.length; i++) {
                let child = this.childs[i];
                if (child instanceof signalManagerCalculation_1.SignalManagerCalculation) {
                    return i;
                }
            }
            return -1;
        }
    };
    SerieGroup = SerieGroup_1 = __decorate([
        mco.role()
    ], SerieGroup);
    exports.SerieGroup = SerieGroup;
});
