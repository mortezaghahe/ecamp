var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./triggerParameter"], function (require, exports, triggerParameter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TriggerGroup = exports.TriggerPropertyIds = void 0;
    let TriggerPropertyIds = class TriggerPropertyIds {
    };
    TriggerPropertyIds.Condition = "condition";
    TriggerPropertyIds.Datapoint = "datapoint";
    TriggerPropertyIds.Threshold = "threshold";
    TriggerPropertyIds.Window = "window";
    TriggerPropertyIds = __decorate([
        mco.role()
    ], TriggerPropertyIds);
    exports.TriggerPropertyIds = TriggerPropertyIds;
    let TriggerGroup = class TriggerGroup extends triggerParameter_1.TriggerParameter {
        /**
         * Creates an instance of TriggerGroup
         * @param {string} displayName
         * @param {TraceStartTrigger} startTriggerRef
         * @memberof TriggerGroup
         */
        constructor(displayName, startTriggerRef) {
            super("", displayName, "", "", undefined);
            /**
             * Holds all the trigger parameters of this trigger group with the links to the component parameters on the target
             *
             * @type {TriggerParameter[]}
             * @memberof TriggerGroup
             */
            this.childs = new Array();
            this.startTriggerRef = startTriggerRef;
        }
        /**
         * Sets initial trigger informations(datapointname, condition, threshold, window) with the infos from the component parameters from target
         *
         * @param {(Array<MappCockpitComponentParameter>|undefined)} startTriggerInfos
         * @param {string} triggerInstanceId
         * @param {string} condition
         * @param {string} dataPointName
         * @param {string} threshold
         * @param {string} window
         * @returns
         * @memberof TriggerGroup
         */
        setInitTriggerParameters(startTriggerInfos, triggerInstanceId, condition, dataPointName, threshold, window) {
            if (startTriggerInfos == undefined) {
                return;
            }
            let conditionParamInfo = startTriggerInfos.filter(param => param.browseName == triggerInstanceId + "Condition")[0];
            this.childs.push(new triggerParameter_1.TriggerParameter(TriggerPropertyIds.Condition, "Condition", condition, "", conditionParamInfo));
            let dataPointParamInfo = startTriggerInfos.filter(param => param.browseName == triggerInstanceId + "DataPoint")[0];
            this.childs.push(new triggerParameter_1.TriggerParameter(TriggerPropertyIds.Datapoint, "Data point", dataPointName, "", dataPointParamInfo));
            let thresholdParamInfo = startTriggerInfos.filter(param => param.browseName == triggerInstanceId + "Threshold")[0];
            this.childs.push(new triggerParameter_1.TriggerParameter(TriggerPropertyIds.Threshold, "Threshold", threshold, "", thresholdParamInfo));
            let windowParamInfo = startTriggerInfos.filter(param => param.browseName == triggerInstanceId + "Window")[0];
            this.childs.push(new triggerParameter_1.TriggerParameter(TriggerPropertyIds.Window, "Window", window, "", windowParamInfo));
        }
        /**
         * Sets the value of a trigger parameter for the given id
         *
         * @param {TriggerPropertyIds} id
         * @param {string} value
         * @memberof TriggerGroup
         */
        setValue(id, value) {
            if (id == TriggerPropertyIds.Condition) {
                this.startTriggerRef.condition = value;
            }
            else if (id == TriggerPropertyIds.Datapoint) {
                this.startTriggerRef.dataPointName = value;
            }
            else if (id == TriggerPropertyIds.Threshold) {
                this.startTriggerRef.threshold = value;
            }
            else if (id == TriggerPropertyIds.Window) {
                this.startTriggerRef.window = value;
            }
        }
    };
    TriggerGroup = __decorate([
        mco.role()
    ], TriggerGroup);
    exports.TriggerGroup = TriggerGroup;
});
