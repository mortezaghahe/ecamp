var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../../framework/property", "./traceControl", "./traceConfig/traceConfigData", "./traceDataPoint", "./traceStartTrigger", "./traceConfig/traceConfigInfo", "../../../framework/command", "../../online/mappCockpitComponentReflection", "../../../framework/componentHub/bindings/bindings", "../../../framework/componentHub/bindings/bindingDeclarations"], function (require, exports, property_1, traceControl_1, traceConfigData_1, traceDataPoint_1, traceStartTrigger_1, traceConfigInfo_1, command_1, mappCockpitComponentReflection_1, bindings_1, Binding) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitTraceComponent = void 0;
    /**
     * Provides data for describing a trace component
     *
     * @class MappCockpitTraceComponent
     */
    let MappCockpitTraceComponent = class MappCockpitTraceComponent {
        constructor(diagnosticProvider, mappCockpitComponent) {
            this._initialized = false;
            this._diagnosticProvider = diagnosticProvider;
            this._mappCockpitComponent = mappCockpitComponent;
            this._traceControl = new traceControl_1.TraceControl(this._diagnosticProvider);
            this._availableTraceDataPoints = property_1.Property.create([]);
            this._traceConfigurationData = new traceConfigData_1.TraceConfigurationData(new Array(), new Array(), new Array());
            this._traceConfigurationInfo = new traceConfigInfo_1.TraceConfigurationInfo(new Array(), new Array(), new Array());
            this._traceComponentParameterInterface = property_1.Property.create({
                parameters: [],
                availableTraceDataPoints: this._availableTraceDataPoints,
                traceConfigurationData: this._traceConfigurationData,
                traceConfigurationInfo: this._traceConfigurationInfo,
                commandRead: this._commandReadTraceParameters,
                commandWrite: this._commandWriteTraceParameters,
            });
            this.createCommands();
            this.createComponentBindings();
            this.initialize();
        }
        /**
         * Creates the bindings to other components
         *
         * @private
         * @memberof MappCockpitTraceComponent
         */
        createComponentBindings() {
            bindings_1.Bindings.createByDecl(Binding.Traces.Configuration.DataPoints, this, "", "updateTraceDataPoints", false);
            bindings_1.Bindings.createByDecl(Binding.Traces.Configuration.StartTriggerInfos, this, "", "updateTraceStartTriggerInfo", false);
            bindings_1.Bindings.createByDecl(Binding.Traces.Configuration.TimingInfos, this, "", "updateTraceTimingParameters", false);
        }
        /**
         * Creates the exposed commands
         *
         * @private
         * @memberof MappCockpitTraceComponent
         */
        createCommands() {
            this._commandReadTraceParameters = command_1.Command.create(this, this.executeCommandReadTraceParameters());
            this._commandWriteTraceParameters = command_1.Command.create(this, this.executeCommandWriteTraceParameters());
        }
        /**
         * Implements the command for reading the trace parameters
         *
         * @returns {*}
         * @memberof MappCockpitTraceComponent
         */
        executeCommandReadTraceParameters() {
            return (traceParameters, commandResponse) => {
                let parametersToRead = traceParameters ? traceParameters : this.mappCockpitComponent.parameters;
                this._diagnosticProvider.readParameterValues(parametersToRead).then((updatedParameters) => {
                    commandResponse.executed(updatedParameters);
                }).catch((error) => {
                    commandResponse.rejected(error);
                });
            };
        }
        /**
         * Implements the command for writing the trace parameters
         *
         * @returns {*}
         * @memberof MappCockpitTraceComponent
         */
        executeCommandWriteTraceParameters() {
            return (traceParameters, commandResponse) => {
                let parametersToWrite = traceParameters ? traceParameters : this.mappCockpitComponent.parameters;
                this._diagnosticProvider.writeParameterValues(parametersToWrite).then((updatedParameters) => {
                    commandResponse.executed(updatedParameters);
                }).catch((error) => {
                    commandResponse.rejected(error);
                });
            };
        }
        initialize() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._initialized == true) {
                    return;
                }
                yield this.connectComponent();
                this._traceControl.initialize(this);
                this._traceConfigurationInfo = new traceConfigInfo_1.TraceConfigurationInfo(mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.retrieveTraceConfigurationDatapoints(this.mappCockpitComponent.parameters), mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.retrieveTraceConfigurationTimingParameters(this.mappCockpitComponent.parameters), mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.retrieveTraceConfigurationTriggerParameters(this.mappCockpitComponent.parameters));
                this._traceConfigurationData = this.getTraceConfigurationData(this._traceConfigurationInfo);
                this.updateParameterInterface();
                this._initialized = true;
            });
        }
        updateParameterInterface() {
            this._traceComponentParameterInterface.value = {
                parameters: this.mappCockpitComponent.parameters,
                availableTraceDataPoints: this._availableTraceDataPoints,
                traceConfigurationData: this._traceConfigurationData,
                traceConfigurationInfo: this._traceConfigurationInfo,
                commandRead: this._commandReadTraceParameters,
                commandWrite: this._commandWriteTraceParameters,
            };
            this.updateTraceTimingParameters(this._traceConfigurationData.timingParameters);
            this.updateTraceDataPoints(this._traceConfigurationData.dataPoints);
            const startTriggerInfos = { data: this._traceConfigurationData.startTriggers, info: this._traceConfigurationInfo.startTriggerInfos };
            this.updateTraceStartTriggerInfo(startTriggerInfos);
        }
        /**
         * Updates the trace start triggers
         *
         * @private
         * @param {TraceStartTrigger[]} startTriggers
         * @memberof MappCockpitTraceComponent
         */
        updateTraceStartTriggerInfo(startTriggerInfo) {
            // BINDINGSOURCE: method stub to make the passed data bindable
        }
        /**
         * Updates the trace data points
         *
         * @private
         * @param {TraceDataPoint[]} dataPoints
         * @memberof MappCockpitTraceComponent
         */
        updateTraceDataPoints(dataPoints) {
            // BINDINGSOURCE: method stub to make the passed data bindable
        }
        /**
         * Updates the trace timing parameters.
         *
         * @private
         * @param {MappCockpitComponentParameter[]} timingParameters
         * @memberof MappCockpitTraceComponent
         */
        updateTraceTimingParameters(timingParameters) {
            // BINDINGSOURCE: method stub to make the passed data bindable
        }
        /**
         * Connects the trace component to the target and browses the methods,parameters
         *
         * @private
         * @param {MappCockpitComponent} traceComponent
         * @memberof MappCockpitTraceComponent
         */
        connectComponent() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this._diagnosticProvider.browseParameters(this._mappCockpitComponent);
                yield this._diagnosticProvider.updateParameterDataTypes(this._mappCockpitComponent.parameters);
                yield this._diagnosticProvider.browseMethods(this._mappCockpitComponent);
                yield this._diagnosticProvider.browseMethodParameters(this._mappCockpitComponent.methods);
                yield this._diagnosticProvider.readParameterValues(this._mappCockpitComponent.parameters);
            });
        }
        getTraceConfigurationData(traceConfigurationInfo) {
            // get datapoints
            let datapoints = this.getDataPoints(traceConfigurationInfo.dataPointInfos);
            // get timing parameters
            let timingParameters = traceConfigurationInfo.timingParameterInfos;
            // get start trigger parameters
            let startTriggers = this.getStartTriggers(traceConfigurationInfo.startTriggerInfos);
            // create trace configuration data
            return new traceConfigData_1.TraceConfigurationData(datapoints, timingParameters, startTriggers);
        }
        getDataPoints(datapointParameters) {
            let datapoints = new Array();
            for (let datapoint of datapointParameters) {
                if (datapoint.displayValue != "") {
                    let newDatapoint = traceDataPoint_1.TraceDataPoint.createSimpleDataPoint(datapoint.displayValue);
                    if (this._availableTraceDataPoints != undefined) {
                        let dataPointInfo = this._availableTraceDataPoints.value.filter(ele => { return ele.fullname == datapoint.displayValue; })[0];
                        if (dataPointInfo != undefined) {
                            newDatapoint = traceDataPoint_1.TraceDataPoint.createWithDataPointInfo(dataPointInfo);
                        }
                    }
                    datapoints.push(newDatapoint);
                }
            }
            return datapoints;
        }
        getStartTriggers(triggerParameters) {
            let startTriggers = new Array();
            for (let triggerInstance = 1; triggerInstance < 10; triggerInstance++) { // Search for start triggers with a defined datapoint name
                let triggerInstanceId = "StartTrigger" + triggerInstance + "_";
                let dataPointNameParam = triggerParameters.filter(param => param.browseName == triggerInstanceId + "DataPoint")[0];
                if (dataPointNameParam != undefined) {
                    if (dataPointNameParam.value != "") { // Add no starttrigger if datapoint name is not defined
                        let startTrigger = this.getStartTrigger(dataPointNameParam.value, triggerInstanceId, triggerParameters);
                        startTriggers.push(startTrigger);
                    }
                }
            }
            return startTriggers;
        }
        getStartTrigger(dataPointName, instanceId, componentParameters) {
            let condition = "";
            let conditionParam = componentParameters.filter(param => param.browseName == instanceId + "Condition")[0];
            if (conditionParam != undefined) {
                condition = conditionParam.value.toString();
            }
            let threshold = "";
            let thresholdParam = componentParameters.filter(param => param.browseName == instanceId + "Threshold")[0];
            if (thresholdParam != undefined) {
                threshold = thresholdParam.displayValue;
            }
            let triggerWindow = "";
            let triggerParam = componentParameters.filter(param => param.browseName == instanceId + "Window")[0];
            if (triggerParam != undefined) {
                triggerWindow = triggerParam.displayValue;
            }
            return new traceStartTrigger_1.TraceStartTrigger(condition, dataPointName, threshold, triggerWindow);
        }
        updateDataPointInformations(traceConfigurationData) {
            traceConfigurationData.dataPoints.forEach(datapoint => {
                let dataPointInfo = this._availableTraceDataPoints.value.filter(ele => { return ele.fullname == datapoint.dataPointName; })[0];
                if (dataPointInfo != undefined) {
                    var newDatapoint = traceDataPoint_1.TraceDataPoint.createWithDataPointInfo(dataPointInfo);
                    datapoint.componentName = newDatapoint.componentName;
                    datapoint.name = newDatapoint.name;
                    datapoint.description = newDatapoint.description;
                }
            });
        }
        set availableTraceDataPoints(dataPoints) {
            this._availableTraceDataPoints = dataPoints;
        }
        /**
         * Returns traceConfigurationData
         *
         * @readonly
         * @type {InterfaceTraceData}
         * @memberof MappCockpitTraceComponent
         */
        get traceConfigurationData() {
            return this._traceConfigurationData;
        }
        set traceConfigurationData(traceConfigurationData) {
            this._traceConfigurationData = traceConfigurationData;
            this.updateParameterInterface();
        }
        /**
         * Gets the MappCockpitComponent
         *
         * @readonly
         * @type {MappCockpitComponent}
         * @memberof MappCockpitTraceComponent
         */
        get mappCockpitComponent() {
            return this._mappCockpitComponent;
        }
        /**
         * Gets the TraceControlInterface
         *
         * @readonly
         * @type {ITraceComponentControl}
         * @memberof MappCockpitTraceComponent
         */
        get traceControlInterface() {
            return this._traceControl;
        }
        /**
         * Gets the Property<ITraceComponentParameters>
         *
         * @readonly
         * @type {Property<ITraceComponentParameters>}
         * @memberof MappCockpitTraceComponent
         */
        get traceParameters() {
            return this._traceComponentParameterInterface;
        }
        /**
         * Gets the DisplayName
         *
         * @readonly
         * @type {Property<ITraceComponentParameters>}
         * @memberof MappCockpitTraceComponent
         */
        get displayName() {
            return this._mappCockpitComponent.displayName;
        }
    };
    MappCockpitTraceComponent = __decorate([
        mco.role()
    ], MappCockpitTraceComponent);
    exports.MappCockpitTraceComponent = MappCockpitTraceComponent;
});
