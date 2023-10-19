var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/exportSerieGroup", "../../../models/common/signal/serieGroup", "../../../models/signalManagerDataModel/signalManagerCalculation", "../../../models/signalManagerDataModel/signalManagerCalculationInputData", "../../../models/signalManagerDataModel/signalManagerCalculationOutputData", "../../../models/common/series/seriesType", "../../../models/signalManagerDataModel/signalCategory"], function (require, exports, exportSerieGroup_1, serieGroup_1, signalManagerCalculation_1, signalManagerCalculationInputData_1, signalManagerCalculationOutputData_1, seriesType_1, signalCategory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExportHelper = void 0;
    let ExportHelper = class ExportHelper {
        /**
         * Returns array of exportSerieGroup elements
         *
         * @param {*} elements
         * @returns {Array<ExportSerieGroup>}
         * @memberof ExportHelper
         */
        getExportableElements(elements) {
            let serieGroups = new Array();
            let items = new Array();
            let groupElements = new Array();
            let signalCalculations = new Array();
            let signalInputCalculations = new Array();
            let signalOutputCalculations = new Array();
            //delete not exportable items
            for (var i = 0; i < elements.length; i++) {
                if (!this.isElementExportable(elements[i].item)) {
                    elements.splice(i, 1);
                    i = -1;
                }
            }
            //Classify selected elements into arrays according to its type 
            for (var i = 0; i < elements.length; i++) {
                items.push(elements[i].item);
                //Put all signalCalculations selected into an array for later checks
                if (elements[i].item instanceof signalManagerCalculation_1.SignalManagerCalculation) {
                    signalCalculations.push(elements[i].item);
                }
                //Put all signalInputCalculations selected into an array for later checks
                else if (elements[i].item instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData) {
                    if (!this.isSignalRepeated(signalInputCalculations, elements[i].item.serie)) {
                        signalInputCalculations.push(elements[i].item);
                    }
                    else {
                        let index = items.indexOf(elements[i].item);
                        items.splice(index, 1);
                    }
                }
                //Put all signalOuputCalculations selected into an array for later
                else if (elements[i].item instanceof signalManagerCalculationOutputData_1.SignalManagerCalculationOutputData) {
                    signalOutputCalculations.push(elements[i].item);
                }
                else if (elements[i].item instanceof serieGroup_1.SerieGroup) {
                    //Put all seriegroups selected into an array
                    let serieGroup = elements[i].item;
                    serieGroups.push(serieGroup);
                    //Convert selected Seriegroups to exportSerieGroups
                    if (serieGroup.getChilds()[0] != undefined) {
                        groupElements.push(new exportSerieGroup_1.ExportSerieGroup(serieGroup.name, serieGroup.startTriggerTime, elements[i].item.childs[0].serie));
                        for (var j = 1; j < serieGroup.getChilds().length; j++) {
                            if (serieGroup.getChilds()[j].serie != undefined && serieGroup.getChilds()[j].serie.rawPointsValid == true) {
                                let index = groupElements.length - 1;
                                groupElements[index].addSerie(serieGroup.getChilds()[j].serie);
                            }
                        }
                    }
                }
            }
            this.filterSelectedItems(items, serieGroups, signalCalculations, signalInputCalculations, signalOutputCalculations, groupElements);
            return groupElements;
        }
        /**
         * Delete duplicated series, invalid series or not need it
         *
         * @private
         * @param {Array<any>} items
         * @param {Array<SerieGroup>} serieGroups
         * @param {Array<SignalManagerCalculation>} signalCalculations
         * @param {Array<SignalManagerCalculationInputData>} signalInputCalculations
         * @param {Array<SignalManagerCalculationOutputData>} signalOutputCalculations
         * @memberof ExportHelper
         *
         * Review Lukas Obersamer:
         * The cyclomatic complexity is too high. Commenting is well done, which makes it easier to understand what the code is supposed to do.
         * --> Corrective actions needed as soon as this area of code is touched the next time.
         */
        filterSelectedItems(items, serieGroups, signalCalculations, signalInputCalculations, signalOutputCalculations, groupElements) {
            //delete selected rows if its SerieGroup is also selected. 
            for (var i = 0; i < items.length; i++) {
                for (var j = 0; j < serieGroups.length; j++) {
                    if (!(items[i] instanceof serieGroup_1.SerieGroup) && items[i].getSerieGroup() == serieGroups[j]) {
                        //delete same element in alll arrays
                        let index = signalCalculations.indexOf(items[i]);
                        signalCalculations.splice(index, 1);
                        index = signalInputCalculations.indexOf(items[i]);
                        signalInputCalculations.splice(index, 1);
                        index = signalOutputCalculations.indexOf(items[i]);
                        signalOutputCalculations.splice(index, 1);
                        items.splice(i, 1);
                        i = -1;
                        break;
                    }
                }
            }
            //delete selected CalculationOutput if its CalculationData is also selected. 
            for (var i = 0; i < signalOutputCalculations.length; i++) {
                if (this.isSignalRepeated(signalCalculations, signalOutputCalculations[i].serie)) {
                    let index = items.indexOf(signalOutputCalculations[i]);
                    signalOutputCalculations.splice(i, 1);
                    items.splice(index, 1);
                    i = -1;
                }
            }
            //add input calculation data if calculation is selected
            for (var i = 0; i < signalCalculations.length; i++) {
                let inputSeries = signalCalculations[i].getInputCalculationData();
                if (signalCalculations[i].getOutputCalculationData()[0].serie.type != seriesType_1.SeriesType.timeSeries) { //Momentary solution. Next step: Export the whole YT formula
                    this.addInputElements(items, inputSeries);
                }
            }
            //add input calculation data if ouput calculation is selected 
            for (var i = 0; i < signalOutputCalculations.length; i++) {
                let calculation = signalOutputCalculations[i].parent.parent;
                let inputSeries = calculation.getInputCalculationData();
                if (signalOutputCalculations[i].serie.type != seriesType_1.SeriesType.timeSeries) { //Momentary solution. Next step: Export the whole YT formula
                    this.addInputElements(items, inputSeries);
                }
            }
            //delete repeated selected series (serie + same serie in input calculation)
            for (var i = 0; i < items.length; i++) {
                if (!(items[i] instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData) && this.isSignalRepeated(signalInputCalculations, items[i].serie)) {
                    items.splice(i, 1);
                    i = -1;
                }
            }
            //create exportSerieGroups with the selected rows
            for (var i = 0; i < items.length; i++) {
                if (!(items[i] instanceof serieGroup_1.SerieGroup)) {
                    let parent = items[i].getSerieGroup();
                    let newGroup = true;
                    for (var j = 0; j < groupElements.length; j++) {
                        if (parent.startTriggerTime == groupElements[j].startTriggerTime) {
                            newGroup = false;
                            groupElements[j].addSerie(items[i].serie);
                        }
                    }
                    if (newGroup) {
                        groupElements.push(new exportSerieGroup_1.ExportSerieGroup(parent.name, parent.startTriggerTime, items[i].serie));
                    }
                }
            }
        }
        /**
         * Returns true if a signal is repeated
         *
         * @private
         * @param {Array<any>} arrayOfItems
         * @param {BaseSeries} serie
         * @returns {boolean}
         * @memberof ExportHelper
         */
        isSignalRepeated(arrayOfItems, serie) {
            for (var i = 0; i < arrayOfItems.length; i++) {
                if (arrayOfItems[i].serie == serie) {
                    return true;
                }
            }
            return false;
        }
        /**
         * Add input series (if not selected) in XY or FFT formulas
         *
         * @private
         * @param {Array<any>} items
         * @param {Array<SignalManagerCalculationInputData>} inputSeries
         * @memberof ExportHelper
         */
        addInputElements(items, inputSeries) {
            for (var j = 0; j < inputSeries.length; j++) {
                let isSelected = false;
                for (var a = 0; a < items.length; a++) {
                    if (inputSeries[j].serie == items[a].serie) {
                        isSelected = true;
                    }
                }
                if (!isSelected) {
                    items.push(inputSeries[j]);
                }
            }
        }
        /**
         * Returns true if selected element can be exported
         *
         * @param {*} item
         * @returns {boolean}
         * @memberof ExportHelper
         */
        isElementExportable(item) {
            //SignalCategory selected
            if (item instanceof signalCategory_1.SignalCategory) {
                return false;
            }
            //Input data without valid signal is selected
            else if (item instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData && item.serie == undefined) {
                return false;
            }
            //Name of Calculation selected
            else if (item.parent instanceof signalManagerCalculation_1.SignalManagerCalculation) {
                return false;
            }
            //SerieContainer selected
            else if (!(item instanceof serieGroup_1.SerieGroup) && item.parent instanceof signalCategory_1.SignalCategory) {
                return false;
            }
            //Calculated signal is invalid
            else if ((item instanceof signalManagerCalculation_1.SignalManagerCalculation || item instanceof signalManagerCalculationOutputData_1.SignalManagerCalculationOutputData) && (item.serie == undefined || item.serie.rawPointsValid == false)) {
                return false;
            }
            return true;
        }
    };
    ExportHelper = __decorate([
        mco.role()
    ], ExportHelper);
    exports.ExportHelper = ExportHelper;
});
