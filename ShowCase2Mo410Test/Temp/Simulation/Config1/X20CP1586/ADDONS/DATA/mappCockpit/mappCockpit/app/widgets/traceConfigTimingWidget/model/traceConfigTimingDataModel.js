var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./timingParameter", "../../../models/dataModelBase", "../../../models/online/mappCockpitComponent", "../../../models/dataModelInterface", "../../../models/diagnostics/trace/traceConfig/traceConfigDefines"], function (require, exports, timingParameter_1, dataModelBase_1, mappCockpitComponent_1, dataModelInterface_1, traceConfigDefines_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigTimingDataModel = void 0;
    /**
     * implements the data model for the trace config timing settings
     *
     * @class TraceConfigTimingDataModel
     * @implements {ITraceConfigTimingDataModel}
     */
    let TraceConfigTimingDataModel = class TraceConfigTimingDataModel extends dataModelBase_1.DataModelBase {
        /**
         * initializes the data model
         *
         * @memberof TraceConfigTimingDataModel
         */
        initialize() {
        }
        /**
         * set the data model object with the timing parameters
         *
         * @memberof TraceConfigTimingDataModel
         */
        set initData(timingParameters) {
            this._timingParameters = timingParameters;
            this.updataData();
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this.data);
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Sets the value of a timing parameter
         *
         * @param {TimingParameter} timingParameter
         * @param {string} value
         * @memberof TraceConfigTimingDataModel
         */
        setValue(timingParameter, value) {
            timingParameter.componentParameter.value = value;
        }
        /**
         * Updates the data model with the given timing parameters
         *
         * @private
         * @param {MappCockpitComponentParameter[]} timingParameters
         * @memberof TraceConfigTimingDataModel
         */
        updataData() {
            this._data = new Array();
            if (this._timingParameters) {
                // Set parameters order
                this.addParameter("Total recording time", "s", traceConfigDefines_1.TraceConfigBrowseNameIds.TotalRecordingTime);
                this.addParameter("Trigger offset time", "s", traceConfigDefines_1.TraceConfigBrowseNameIds.TriggerOffsetTime);
                if (this.addParameter("PLC task class number", "", traceConfigDefines_1.TraceConfigBrowseNameIds.PlcTaskClass) == true) {
                    // Set Enum info to the last added _data item
                    this.defineTaskClassEnum(this._data[this._data.length - 1].componentParameter);
                }
                this.addParameter("PLC sample time", "s", traceConfigDefines_1.TraceConfigBrowseNameIds.PlcSampleTime);
                this.addParameter("ACOPOS sample time", "s", traceConfigDefines_1.TraceConfigBrowseNameIds.AcoposSamplingTime);
            }
        }
        /**
         * Adds a timing parameter to the datamodel
         *
         * @private
         * @param {*} parameterDisplayName
         * @param {*} parameterDisplayUnitName
         * @param {*} componentParameterId
         * @returns {boolean}
         * @memberof TraceConfigTimingDataModel
         */
        addParameter(parameterDisplayName, parameterDisplayUnitName, componentParameterId) {
            let param = this._timingParameters.filter(param => param.browseName == componentParameterId)[0];
            if (param != undefined) {
                this._data.push(new timingParameter_1.TimingParameter(parameterDisplayName, parameterDisplayUnitName, param));
                return true;
            }
            return false;
        }
        /**
         *Create enum for task class selection 1-8 => TODO: set at central position
         *
         * @private
         * @param {*} parameter
         * @memberof TraceConfigTimingDataModel
         */
        defineTaskClassEnum(parameter) {
            let taskClassEnum = new mappCockpitComponent_1.MappCockpitComponentParameterEnum();
            taskClassEnum._enumValues = new Array();
            for (let i = 1; i < 9; i++) {
                taskClassEnum.values.push(new mappCockpitComponent_1.MappCockpitComponentParameterEnumValue(i.toString(), i.toString()));
            }
            parameter.enumType = taskClassEnum;
        }
    };
    TraceConfigTimingDataModel = __decorate([
        mco.role()
    ], TraceConfigTimingDataModel);
    exports.TraceConfigTimingDataModel = TraceConfigTimingDataModel;
});
