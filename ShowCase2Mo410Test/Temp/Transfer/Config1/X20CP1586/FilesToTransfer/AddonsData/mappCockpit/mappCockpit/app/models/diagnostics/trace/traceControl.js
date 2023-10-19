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
define(["require", "exports", "../../online/mappCockpitComponent", "../../online/mappCockpitComponentReflection", "../../../framework/command", "./traceDataReader", "./traceConfig/traceConfigData", "./traceConfig/traceConfigExport", "./traceConfig/traceConfigImport", "../../../framework/componentHub/bindings/bindings", "../../../framework/componentHub/bindings/bindingDeclarations"], function (require, exports, mappCockpitComponent_1, mappCockpitComponentReflection_1, command_1, traceDataReader_1, traceConfigData_1, traceConfigExport_1, traceConfigImport_1, bindings_1, Binding) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceControl = void 0;
    /**
     * Defines the browsenames of the trace control methods on the opc ua server (e.g. "Activate")
     *
     * @class TraceMethodIds
     */
    let TraceMethodIds = class TraceMethodIds {
    };
    TraceMethodIds.Activate = "Activate";
    TraceMethodIds.ForceStop = "ForceStop";
    TraceMethodIds.ForceStart = "ForceStart";
    TraceMethodIds.SaveTraceConfig = "SaveTraceConfig";
    TraceMethodIds.Reset = "Reset";
    TraceMethodIds.RemoveDataPoint = "RemoveDataPoint";
    TraceMethodIds.RemoveStartTrigger1 = "RemoveStartTrigger1";
    TraceMethodIds.RemoveStartTrigger2 = "RemoveStartTrigger2";
    TraceMethodIds.AddDataPoint = "AddDataPoint";
    TraceMethodIds.SetStartTrigger = "SetStartTrigger";
    TraceMethodIds = __decorate([
        mco.role()
    ], TraceMethodIds);
    let TraceControl = class TraceControl {
        ;
        /**
         * Creates an instance of TraceControl.
         * @param {MappCockpitDiagnosticProvider} diagnosticProvider
         * @memberof TraceControl
         */
        constructor(diagnosticProvider) {
            this._actualTraceState = "";
            this._traceDataLoading = false;
            this._diagnosticProvider = diagnosticProvider;
            this._traceDataReader = new traceDataReader_1.MappCockpitTraceDataReader(diagnosticProvider);
            this.createComponentBindings();
        }
        /**
         * Creates the bindings to other components
         *
         * @private
         * @memberof TraceControl
         */
        createComponentBindings() {
            bindings_1.Bindings.createByDecl(Binding.Traces.TraceData.Load, this, "invokeLoadTraceData", "");
            bindings_1.Bindings.createByDecl(Binding.Traces.TraceData.Loaded, this, "", "onTraceDataLoaded");
            bindings_1.Bindings.createByDecl(Binding.Traces.TraceData.LoadingError, this, "", "onErrorLoadingTraceData");
            bindings_1.Bindings.createByDecl(Binding.Traces.State, this, "", "onTraceStateChanged");
            bindings_1.Bindings.createByDecl(Binding.Traces.TraceData.DataAvailable, this, "", "onTraceDataAvailable");
            bindings_1.Bindings.createByDecl(Binding.Traces.ControlInterface, this, "", "updateTraceControlInterface", false);
        }
        /**
         * Initializes the TraceControl instance
         *
         * @param {MappCockpitTraceComponent} traceComponent
         * @returns {Promise<any>}
         * @memberof TraceControl
         */
        initialize(traceComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                this._traceComponent = traceComponent;
                // create commands
                this.createCommands();
                this.observeTraceState(this._traceComponent.mappCockpitComponent.parameters);
                this.updateTraceControlInterface(this);
            });
        }
        /**
         * Updates the trace control interface
         *
         * @private
         * @param {ITraceComponentControl} traceComponentControl
         * @memberof TraceControl
         */
        updateTraceControlInterface(traceControl) {
            // BINDINGSOURCE: method stub to make the passed data bindable
        }
        /**
         * Creates commands exposed by trace control
         *
         * @private
         * @memberof TraceControl
         */
        createCommands() {
            this._commandActivate = command_1.Command.create(this, this.executeCommandActivate());
            this._commandForceStart = command_1.Command.create(this, this.executeCommandForceStart());
            this._commandForceStop = command_1.Command.create(this, this.executeCommandForceStop());
            this._commandSaveConfiguration = command_1.Command.create(this, this.executeCommandSaveConfiguration());
            this._commandImportTraceConfiguration = command_1.Command.create(this, this.executeCommandImportTraceConfiguration());
            this._commandExportTraceConfiguration = command_1.Command.create(this, this.executeCommandExportTraceConfiguration());
        }
        get commandActivate() {
            return this._commandActivate;
        }
        get commandForceStart() {
            return this._commandForceStart;
        }
        get commandForceStop() {
            return this._commandForceStop;
        }
        get commandSaveConfiguration() {
            return this._commandSaveConfiguration;
        }
        get commandImportTraceConfiguration() {
            return this._commandImportTraceConfiguration;
        }
        get commandExportTraceConfiguration() {
            return this._commandExportTraceConfiguration;
        }
        /**
         * Processes the activate command
         *
         * @private
         * @returns {ICommandExecutionDelegate<any,any>}
         * @memberof TraceControl
         */
        executeCommandActivate() {
            return (commandPars, commandResponse) => {
                this.transferDataToTarget()
                    .then(() => {
                    return this.executeMethod(this.getTraceMethod(TraceMethodIds.Activate));
                })
                    .then(() => {
                    commandResponse.executed();
                }).catch((error) => {
                    commandResponse.rejected(error);
                });
            };
        }
        /**
         * Processes the force stop command
         *
         * @private
         * @returns {ICommandExecutionDelegate<any,any>}
         * @memberof TraceControl
         */
        executeCommandForceStop() {
            return (commandPars, commandResponse) => {
                this.executeMethod(this.getTraceMethod(TraceMethodIds.ForceStop))
                    .then(() => {
                    commandResponse.executed();
                }).catch((error) => {
                    commandResponse.rejected(error);
                });
            };
        }
        /**
         * Processes the force start command
         *
         * @private
         * @returns {ICommandExecutionDelegate<any,any>}
         * @memberof TraceControl
         */
        executeCommandForceStart() {
            return (commandPars, commandResponse) => {
                this.executeMethod(this.getTraceMethod(TraceMethodIds.ForceStart))
                    .then(() => {
                    commandResponse.executed();
                })
                    .catch((error) => {
                    commandResponse.rejected(error);
                });
            };
        }
        /**
         * Processes the save configuration command
         *
         * @private
         * @returns {ICommandExecutionDelegate<any,any>}
         * @memberof TraceControl
         */
        executeCommandSaveConfiguration() {
            return (commandPars, commandResponse) => {
                this.transferDataToTarget()
                    .then(() => {
                    return this.executeMethod(this.getTraceMethod(TraceMethodIds.SaveTraceConfig));
                })
                    .then(() => {
                    commandResponse.executed();
                })
                    .catch((error) => {
                    commandResponse.rejected(error);
                });
            };
        }
        /**
         * Invokes loading trace data
         *
         * @private
         * @memberof TraceControl
         */
        invokeLoadTraceData() {
            if (!this._traceDataLoading && this._actualTraceState == "23") {
                this._traceDataLoading = true;
                this._traceDataReader.requestLoadTraceDataFromTarget().then((traceData) => {
                    // confirm loading trace data successfully
                    this.onTraceDataLoaded(traceData);
                    this._traceDataLoading = false;
                }).catch((error) => {
                    // notify loading error
                    this.onErrorLoadingTraceData(error);
                    this._traceDataLoading = false;
                });
            }
            else {
                this.onErrorLoadingTraceData("trace data loading already in progress!");
            }
        }
        /**
         * Confirms trace data loaded
         *
         * @memberof TraceControl
         */
        onTraceDataLoaded(traceData) {
            // BINDINGSOURCE: dispatches the method call to bound targets
        }
        /**
         * Trace data loading triggered an error
         *
         * @param {*} error
         * @memberof TraceControlProvider
         */
        onErrorLoadingTraceData(error) {
            // BINDINGSOURCE: dispatches the method call to bound targets
        }
        /**
         * Processes the import trace configuration command
         *
         * @private
         * @returns {ICommandExecutionDelegate<any,any>}
         * @memberof TraceControl
         */
        executeCommandImportTraceConfiguration() {
            return (commandPars, commandResponse) => {
                try {
                    this.importTraceConfiguration(commandPars);
                }
                catch (e) {
                    console.error(e);
                }
                commandResponse.executed();
            };
        }
        /**
         * Processes the export trace configuration command
         *
         * @private
         * @returns {ICommandExecutionDelegate<any,any>}
         * @memberof TraceControl
         */
        executeCommandExportTraceConfiguration() {
            return (commandPars, commandResponse) => {
                let exportData = "";
                try {
                    exportData = this.exportTraceConfiguration();
                }
                catch (e) {
                    console.error(e);
                }
                commandResponse.executed(exportData);
            };
        }
        /**
         * Returns the XmlData of the current trace configuration (for export)
         *
         * @private
         * @returns {string}
         * @memberof TraceControl
         */
        exportTraceConfiguration() {
            let traceConfigExport = new traceConfigExport_1.TraceConfigExport();
            return traceConfigExport.getXmlDataFromTraceConfig(this._traceComponent.traceConfigurationData);
        }
        /**
         * Imports the given xml data to the trace configuration
         *
         * @private
         * @param {string} fileData
         * @returns
         * @memberof TraceControl
         */
        importTraceConfiguration(fileData) {
            let traceConfigData = traceConfigImport_1.TraceConfigImport.getTraceConfigDataFromXml(fileData);
            if (traceConfigData != undefined) {
                this.setValuesOfTimingParameters(this._traceComponent.traceConfigurationData.timingParameters, traceConfigData.timingParameters);
                let traceConfigurationData = new traceConfigData_1.TraceConfigurationData(traceConfigData.dataPoints, this._traceComponent.traceConfigurationData.timingParameters, traceConfigData.startTriggers);
                // Update datapoint informations (e.g. axis name, description, ...)
                this._traceComponent.updateDataPointInformations(traceConfigurationData);
                // Set new trace configuration data to trace component
                this._traceComponent.traceConfigurationData = traceConfigurationData;
            }
        }
        /**
         * Sets the values of the timing parameters(from import) to the mappCockpitComponentParameters
         *
         * @private
         * @param {MappCockpitComponentParameter[]} timingParameters
         * @param {{[key: string]: string}} values
         * @memberof TraceControl
         */
        setValuesOfTimingParameters(timingParameters, values) {
            for (let i = 0; i < timingParameters.length; i++) {
                let timingParam = timingParameters[i];
                let timingParamId = traceConfigExport_1.TraceConfigExport.getTimingParamId(timingParam.browseName);
                if (timingParamId != "") {
                    let newValue = values[timingParamId];
                    timingParam.value = newValue;
                }
            }
        }
        /**
         * Observes the trace state
         *
         * @private
         * @param {MappCockpitComponentParameter[]} parameters
         * @returns {*}
         * @memberof TraceControl
         */
        observeTraceState(parameters) {
            let traceStateParameter = parameters.filter((traceParameter) => { return traceParameter.browseName === "TraceStatus"; })[0];
            traceStateParameter.valueSource.changed((newTraceStateValue, oldTraceStateValue) => {
                this._actualTraceState = traceStateParameter.value;
                // notify trace state change
                this.onTraceStateChanged(traceStateParameter.value);
                if (newTraceStateValue != oldTraceStateValue) {
                    if (this._actualTraceState == "23") {
                        // notify trace data available
                        this.onTraceDataAvailable(true);
                    }
                }
            });
            // watch trace state changes
            this._diagnosticProvider.observeComponentModelItems(this, [traceStateParameter]);
        }
        onTraceDataAvailable(traceDataAvailable) {
            // BINDINGSOURCE: method dispatches the call to a bound target
        }
        onTraceStateChanged(traceState) {
            // BINDINGSOURCE: method dispatches the value to a bound target
        }
        /**
         * transfers the trace configuration data to the target (e.g. datapoints, timing parameters, triggers, ...),
         * and clears all data on target before
         *
         * @private
         * @memberof TraceControl
         */
        transferDataToTarget() {
            return __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < this._traceComponent.mappCockpitComponent.methods.length; i++) {
                    // update the methods input parameters
                    yield mappCockpitComponent_1.MappCockpitComponentMethod.updateInputParameters(this._traceComponent.mappCockpitComponent.methods[i]);
                }
                // Call reset method before transfering data to avoid problems when trace is in wrong state
                yield this.executeMethod(this.getTraceMethod(TraceMethodIds.Reset));
                // remove all datapoints
                yield this.removeAllDatapoints();
                // remove all start triggers
                yield this.removeAllStartTriggers();
                // write timing parameters
                yield this.setTimingParameters();
                // add all datapoints
                yield this.addDatapoints();
                // add all start triggers
                yield this.addStartTriggers();
            });
        }
        /**
         * Removes all trace configuration datapoints on target
         *
         * @private
         * @memberof TraceControl
         */
        removeAllDatapoints() {
            return __awaiter(this, void 0, void 0, function* () {
                let datapoints = mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.retrieveTraceConfigurationDatapoints(this._traceComponent.mappCockpitComponent.parameters);
                yield this._diagnosticProvider.readParameterValues(datapoints);
                let removeDataPointMethod = this.getTraceMethod(TraceMethodIds.RemoveDataPoint);
                if (removeDataPointMethod != undefined) {
                    for (let i = 0; i < datapoints.length; i++) {
                        if (datapoints[i].value != "") {
                            removeDataPointMethod.inputParameters[0].value = datapoints[i].value;
                            //console.info("Remove datapoint: " + datapoints[i].value);
                            yield this.executeMethod(removeDataPointMethod);
                        }
                    }
                }
            });
        }
        /**
         * Removes all trace configuration start triggers on target
         *
         * @private
         * @memberof TraceControl
         */
        removeAllStartTriggers() {
            return __awaiter(this, void 0, void 0, function* () {
                let triggerParameters = mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.retrieveTraceConfigurationTriggerParameters(this._traceComponent.mappCockpitComponent.parameters);
                yield this._diagnosticProvider.readParameterValues(triggerParameters);
                let startTriggerDataPoint1 = this.getTraceParameter("StartTrigger1_DataPoint");
                let startTriggerDataPoint2 = this.getTraceParameter("StartTrigger2_DataPoint");
                let removeStartTrigger1Method = this.getTraceMethod(TraceMethodIds.RemoveStartTrigger1);
                let removeStartTrigger2Method = this.getTraceMethod(TraceMethodIds.RemoveStartTrigger2);
                // only delete if starttrigger if defined(datapoint is defined)
                if (startTriggerDataPoint2.value != "") {
                    yield this.executeMethod(removeStartTrigger2Method);
                }
                if (startTriggerDataPoint1.value != "") {
                    yield this.executeMethod(removeStartTrigger1Method);
                }
            });
        }
        /**
         * Sets all timing parameters on target with the current trace configuration from mappCockpit
         *
         * @private
         * @memberof TraceControl
         */
        setTimingParameters() {
            return __awaiter(this, void 0, void 0, function* () {
                let timingParameters = this._traceComponent.traceConfigurationData.timingParameters;
                for (let i = 0; i < timingParameters.length; i++) {
                    let timingParameter = timingParameters[i];
                    /*if (timingParam.displayName == "PLC task class number") {
                        // use value to avoid problems with taskclass cycle time displayValue
                        //timingParam.componentParameter.value = timingParam.value; // value not up to date currently
                        timingParam.componentParameter.value = timingParam.displayValue.substr(0, 1); // value not up to date currently
                    }
                    else {
                        timingParam.componentParameter.value = timingParam.displayValue;
                    }*/
                    yield this._diagnosticProvider.writeParameterValue(timingParameter, timingParameter.value);
                }
            });
        }
        /**
         * Sets all datapoints on target with the current trace configuration from mappCockpit
         *
         * @private
         * @memberof TraceControl
         */
        addDatapoints() {
            return __awaiter(this, void 0, void 0, function* () {
                let addDataPointMethod = this.getTraceMethod(TraceMethodIds.AddDataPoint);
                if (addDataPointMethod != undefined) {
                    let dataPoints = this._traceComponent.traceConfigurationData.dataPoints;
                    for (let i = 0; i < dataPoints.length; i++) {
                        if (dataPoints[i].dataPointName != "") {
                            addDataPointMethod.inputParameters[0].value = dataPoints[i].dataPointName;
                            //console.info("Add datapoint: " + dataPoints[i].dataPointName);
                            yield this.executeMethod(addDataPointMethod);
                        }
                    }
                }
            });
        }
        /**
         * Sets all starttriggers on target with the current trace configuration from mappCockpit
         *
         * @private
         * @memberof TraceControl
         */
        addStartTriggers() {
            return __awaiter(this, void 0, void 0, function* () {
                let setStartTriggerMethod = this.getTraceMethod(TraceMethodIds.SetStartTrigger);
                let startTriggers = this._traceComponent.traceConfigurationData.startTriggers;
                if (setStartTriggerMethod != undefined) {
                    for (let i = 0; i < startTriggers.length; i++) {
                        let startTrigger = startTriggers[i];
                        let missingInfo = false; // TODO: use missing info and report error => no datapointname defined
                        // set setStartTrigger method input args
                        setStartTriggerMethod.inputParameters[0].value = startTrigger.condition;
                        setStartTriggerMethod.inputParameters[1].value = startTrigger.dataPointName;
                        setStartTriggerMethod.inputParameters[2].value = startTrigger.threshold;
                        setStartTriggerMethod.inputParameters[3].value = startTrigger.window;
                        if (missingInfo == false) {
                            yield this.executeMethod(setStartTriggerMethod);
                        }
                    }
                }
            });
        }
        /**
         * Returns a trace component method for the given method id or undefined if not found
         *
         * @private
         * @param {string} methodId
         * @returns {(MappCockpitComponentMethod | undefined)}
         * @memberof TraceControl
         */
        getTraceMethod(methodId) {
            let traceComponent = this._traceComponent.mappCockpitComponent;
            for (let i = 0; i < traceComponent.methods.length; i++) {
                if (traceComponent.methods[i].browseName == methodId) {
                    return traceComponent.methods[i];
                }
            }
            console.warn("Method '" + methodId + "' not found on trace component!");
            return undefined;
        }
        /**
         * Returns a trace component parameter for the given parameter id or undefined if not found
         *
         * @private
         * @param {string} parameterId
         * @returns {(MappCockpitComponentParameter | undefined)}
         * @memberof TraceControl
         */
        getTraceParameter(parameterId) {
            let traceComponent = this._traceComponent.mappCockpitComponent;
            for (let i = 0; i < traceComponent.parameters.length; i++) {
                if (traceComponent.parameters[i].browseName == parameterId) {
                    return traceComponent.parameters[i];
                }
            }
            console.warn("Parameter '" + parameterId + "' not found on trace component!");
            return undefined;
        }
        /**
         * executes the selected method
         *
         * @private
         * @memberof TraceControl
         */
        executeMethod(method) {
            return __awaiter(this, void 0, void 0, function* () {
                if (method) {
                    yield this._diagnosticProvider.executeComponentMethod(method);
                }
            });
        }
    };
    TraceControl = __decorate([
        mco.role()
    ], TraceControl);
    exports.TraceControl = TraceControl;
});
