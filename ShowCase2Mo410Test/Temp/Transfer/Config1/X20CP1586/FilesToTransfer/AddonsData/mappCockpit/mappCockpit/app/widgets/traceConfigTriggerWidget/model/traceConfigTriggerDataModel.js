var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./triggerGroup", "../../../models/dataModelBase", "../../../models/diagnostics/trace/traceStartTrigger", "../../../models/dataModelInterface", "../../../models/diagnostics/trace/traceConfig/traceConfigValueConverter"], function (require, exports, triggerGroup_1, dataModelBase_1, traceStartTrigger_1, dataModelInterface_1, traceConfigValueConverter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigTriggerDataModel = void 0;
    /**
     * implements the data model for the trigger settings
     *
     * @class TraceConfigTriggerDataModel
     * @implements {ITraceConfigTriggerDataModel}
     */
    let TraceConfigTriggerDataModel = class TraceConfigTriggerDataModel extends dataModelBase_1.DataModelBase {
        /**
         * initializes the data model
         *
         * @memberof TraceConfigTriggerDataModel
         */
        initialize() {
        }
        /**
         * Sets the trigger informations
         *
         * @memberof TraceConfigTriggerDataModel
         */
        set initData(startTriggersObject) {
            this._startTriggers = startTriggersObject.data;
            this._startTriggerInfos = startTriggersObject.info;
            // set the data model object to the given start triggers
            this.updateData();
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this.data);
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Adds a new start trigger at the end of the start trigger list
         *
         * @returns
         * @memberof TraceConfigTriggerDataModel
         */
        addTrigger() {
            let triggerInstance = this.data.length + 1;
            if (triggerInstance == 3) {
                // Maximum two start triggers are supported
                console.info("Maximum two start triggers are supported!");
                return;
            }
            let newStartTrigger = new traceStartTrigger_1.TraceStartTrigger(traceConfigValueConverter_1.ConditionIds.InWindow.toString(), "", "0", "0");
            this._startTriggers.push(newStartTrigger);
            let triggerInstanceId = "StartTrigger" + triggerInstance + "_";
            // initialze new trigger group
            let triggerGroup = new triggerGroup_1.TriggerGroup("Start trigger " + triggerInstance, newStartTrigger);
            this.setDefaultTriggerGroupData(triggerGroup, triggerInstanceId);
            this.data.push(triggerGroup);
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this.data);
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Removes all start triggers with the index listed in the indexList(use reverse sorting)
         *
         * @param {Array<number>} indexList
         * @returns
         * @memberof TraceConfigTriggerDataModel
         */
        removeTriggers(indexList) {
            if (indexList.length == 0) {
                return;
            }
            for (let i = 0; i < indexList.length; i++) {
                this._data.splice(indexList[i], 1);
                if (this._data.length > indexList[i]) {
                    // update starttrigger name of following start triggers (actual only one following)
                    let triggerGroup = this._data[indexList[i]];
                    triggerGroup.displayName = "Start trigger 1";
                }
                this._startTriggers.splice(indexList[i], 1);
                console.log("removed trigger index: " + indexList[i]);
            }
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this.data);
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Sets trigger informations(datapointname, condition, threshold, window) to the given trigger group
         *
         * @private
         * @param {TriggerGroup} triggerGroup
         * @param {string} triggerInstanceId
         * @memberof TraceConfigTriggerDataModel
         */
        setDefaultTriggerGroupData(triggerGroup, triggerInstanceId) {
            triggerGroup.setInitTriggerParameters(this._startTriggerInfos, triggerInstanceId, traceConfigValueConverter_1.TraceConfigValueConverter.getTriggerConditionDisplayName(traceConfigValueConverter_1.ConditionIds.InWindow.toString()), "", "0", "0");
        }
        /**
         * Updates the datamodel with teh given start triggers _startTriggers
         *
         * @private
         * @returns {TriggerGroup[]}
         * @memberof TraceConfigTriggerDataModel
         */
        updateData() {
            this._data = new Array();
            for (let index = 0; index < this._startTriggers.length; index++) {
                let instance = index + 1;
                let triggerInstanceId = "StartTrigger" + instance + "_";
                let startTrigger = this._startTriggers[index];
                // create new trigger group
                let triggerGroup = new triggerGroup_1.TriggerGroup("Start trigger " + instance, startTrigger);
                this._data.push(triggerGroup);
                let triggerConditionDisplayName = traceConfigValueConverter_1.TraceConfigValueConverter.getTriggerConditionDisplayName(startTrigger.condition);
                // set trigger parameters within the trigger group
                triggerGroup.setInitTriggerParameters(this._startTriggerInfos, triggerInstanceId, triggerConditionDisplayName, startTrigger.dataPointName, startTrigger.threshold, startTrigger.window);
            }
        }
    };
    TraceConfigTriggerDataModel = __decorate([
        mco.role()
    ], TraceConfigTriggerDataModel);
    exports.TraceConfigTriggerDataModel = TraceConfigTriggerDataModel;
});
