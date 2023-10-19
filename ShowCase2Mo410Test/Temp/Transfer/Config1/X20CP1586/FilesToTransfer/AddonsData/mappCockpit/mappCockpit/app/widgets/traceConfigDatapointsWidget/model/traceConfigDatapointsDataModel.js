var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../models/dataModelBase", "../../../models/dataModelInterface"], function (require, exports, dataModelBase_1, dataModelInterface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigDatapointsDataModel = void 0;
    /**
     * implements the data model for the trace config timing settings
     *
     * @class TraceConfigDatapointsDataModel
     * @implements {ITraceConfigDatapointsDataModel}
     */
    let TraceConfigDatapointsDataModel = class TraceConfigDatapointsDataModel extends dataModelBase_1.DataModelBase {
        /**
         * initializes the data model
         *
         * @memberof TraceConfigDatapointsDataModel
         */
        initialize() {
        }
        /**
         * Adds a new datapoint at the given index if limit(32) is not exceded or datapoint with same name is already in the list
         *
         * @param {number} index
         * @param {TraceDataPoint} datapoint
         * @returns
         * @memberof TraceConfigDatapointsDataModel
         */
        addDatapoint(index, datapoint) {
            if (this._data.length >= 32) {
                console.info("Only 32 datapoints are supported!");
                return;
            }
            if (this.dataPointAlreadyInList(datapoint.dataPointName)) {
                console.info("Datapoint already in list!");
                return;
            }
            if (index == -1 || index >= this._data.length) {
                // No index defined or after the end => add at the end
                this._data.push(datapoint);
            }
            else {
                this._data.splice(index, 0, datapoint);
            }
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this.data);
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Replace the datapoint at the given index with the new datapoint if a datapoint with the new datapoint name is not already in the datamodel
         *
         * @param {number} index
         * @param {TraceDataPoint} datapoint
         * @param {boolean} ignoreIndexForDuplicateCheck should the name of the datapoint also checked for the given index
         * @returns
         * @memberof TraceConfigDatapointsDataModel
         */
        replaceDatapoint(index, datapoint, ignoreIndexForDuplicateCheck) {
            if (index >= this._data.length) {
                console.error("Cannot replace datapoint with index: " + index);
                return;
            }
            if (this.dataPointAlreadyInList(datapoint.dataPointName, index, ignoreIndexForDuplicateCheck)) {
                console.info("Datapoint already in list!");
                return;
            }
            this._data.splice(index, 1, datapoint);
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this.data);
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Removes all datapoints for the indexes given in the list
         *
         * @param {Array<number>} indexList
         * @memberof TraceConfigDatapointsDataModel
         */
        removeDatapoints(indexList) {
            for (let i = 0; i < indexList.length; i++) {
                this._data.splice(indexList[i], 1);
                console.log("removed datapoint index: " + indexList[i]);
            }
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this.data);
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Sets the initial data for the datamodel
         *
         * @memberof TraceConfigDatapointsDataModel
         */
        set initData(datapointParameters) {
            this.data = datapointParameters;
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this.data);
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Check if a datapoint with the given name is already in the list at an other index position as the given one if checkIndex is true
         *
         * @param {string} dataPointName
         * @param {number} [index=-1]
         * @param {boolean} [ignoreIndex=true] should the name of the datapoint also be checked if already in use for the given index; for replace normally not needed
         * @returns {boolean}
         * @memberof TraceConfigDatapointsDataModel
         */
        dataPointAlreadyInList(dataPointName, index = -1, ignoreIndex = true) {
            if (!this.isDataPointAnEmptyLine(dataPointName)) {
                for (let i = 0; i < this._data.length; i++) {
                    if (i != index || ignoreIndex == true) {
                        if (this._data[i].dataPointName === dataPointName) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        /**
         * Check if the datapoint name defines an empty line
         *
         * @private
         * @param {string} dataPointName
         * @returns {boolean}
         * @memberof TraceConfigDatapointsDataModel
         */
        isDataPointAnEmptyLine(dataPointName) {
            if (dataPointName == undefined || dataPointName == "") {
                return true;
            }
            return false;
        }
    };
    TraceConfigDatapointsDataModel = __decorate([
        mco.role()
    ], TraceConfigDatapointsDataModel);
    exports.TraceConfigDatapointsDataModel = TraceConfigDatapointsDataModel;
});
