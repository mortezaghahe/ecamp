var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./mappCockpitComponent", "./mappCockpitComponentMetaData", "../diagnostics/mappCockpitCommonInfoProvider", "../../widgets/methodParameterListWidget/parameterFilter"], function (require, exports, mappCockpitComponent_1, mappCockpitComponentMetaData_1, mappCockpitCommonInfoProvider_1, parameterFilter_1) {
    "use strict";
    var MappCockpitComponentParameterInfo_1, MappCockpitComponentMethodInfo_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitComponentMethodInfo = exports.MappCockpitComponentParameterInfo = void 0;
    /**
     * provides descriptive information for a parameter
     *
     * @class MappCockpitComponentParameterInfo
     */
    let MappCockpitComponentParameterInfo = MappCockpitComponentParameterInfo_1 = class MappCockpitComponentParameterInfo {
        /**
         * Retrieves watchableParameters
         *
         * @static
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @param {Array<string>} dataToRetrieve
         * @returns {MappCockpitComponentParameter[]}
         * @memberof MappCockpitComponentParameterInfo
         */
        static retrieveWatchableParameters(componentParameters, dataToRetrieve) {
            let metaConfig = dataToRetrieve[0];
            let metaStructure = dataToRetrieve[1];
            let metaName = dataToRetrieve[2];
            // get the watchables meta infos
            if ((componentParameters[0] == undefined) || componentParameters[0].component.metaData[metaConfig] == undefined) {
                return new Array();
            }
            let metaInfo = componentParameters[0].component.metaData[metaConfig][metaStructure];
            // retrieve the watchables definitions
            let parameters = MappCockpitComponentParameterInfo_1.retrieveParametersFromMetaInfo([metaName], metaInfo, componentParameters);
            return parameters;
        }
        /**
         * Create watchable state parameters according to metaInfo
         *
         * @static
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @param {Array<string>} dataToRetrieve
         * @returns {MappCockpitStateParameter[]}
         * @memberof MappCockpitComponentParameterInfo
         */
        static retrieveWatchableStates(componentParameters, dataToRetrieve) {
            let metaConfig = dataToRetrieve[0];
            let metaStructure = dataToRetrieve[1];
            let metaName = dataToRetrieve[2];
            // get the watchables meta infos
            if ((componentParameters[0] == undefined) || componentParameters[0].component.metaData[metaConfig] == undefined) {
                return new Array();
            }
            let metaInfo = componentParameters[0].component.metaData[metaConfig][metaStructure];
            let stateParameters = MappCockpitComponentParameterInfo_1.retrieveWatchableStatesFromMetaInfo([metaName], metaInfo, componentParameters);
            return stateParameters;
        }
        /**
         * retrieves the message parameters from the component parameters
         *
         * @private
         * @param {Array<MappCockpitComponentParameter>} componentParameters
         * @returns {Array<MappCockpitComponentParameter>}
         * @memberof MappCockpitComponentParameterInfo
         */
        static retrieveMessageParameters(componentParameters) {
            let messageSeverityParameter = componentParameters.filter(parameter => { return parameter.browseName === "intArraySeverity"; })[0];
            if (messageSeverityParameter == undefined) {
                messageSeverityParameter = componentParameters.filter(parameter => { return parameter.browseName === "strArraySeverity"; })[0];
            }
            let messageDescriptionParameter = componentParameters.filter(parameter => { return parameter.browseName === "strArrayDescription"; })[0];
            let messageEventIdParameter = componentParameters.filter(parameter => { return parameter.browseName === "strArrayEventID"; })[0];
            let messageTimeStampParameter = componentParameters.filter(parameter => { return parameter.browseName === "strArrayTime"; })[0];
            return [messageSeverityParameter, messageDescriptionParameter, messageEventIdParameter, messageTimeStampParameter];
        }
        /**
         * retrieves the trace configuration timing parameters from the parameter set
         *
         * @static
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @returns {MappCockpitComponentParameter[]}
         * @memberof MappCockpitComponentParameterInfo
         */
        static retrieveTraceConfigurationTimingParameters(componentParameters) {
            // retrieve the trace configuration timing parameters
            let timingParameters = new Array();
            for (let i = 0; i < componentParameters.length; i++) {
                if (MappCockpitComponentParameterInfo_1.isTimingParameter(componentParameters[i])) {
                    timingParameters.push(componentParameters[i]);
                }
            }
            // Update the values to the real values from CurrentTrcConfig Property (BUGFIX for missing StartTriggers at startup)
            let currentTrcConfigProperties = componentParameters.filter((element) => { return element.browseName == "CurrentTrcConfig"; });
            if (currentTrcConfigProperties.length == 1) {
                if (currentTrcConfigProperties[0].value != undefined) {
                    this.updateTimingParameters(timingParameters, currentTrcConfigProperties[0].value);
                }
            }
            return timingParameters;
        }
        /**
         * Updates the values of the timing parameters with the values from a json string (currentTraceConfigJsonString)
         * BUGFIX for missing StartTriggers at startup
         *
         * @private
         * @static
         * @param {MappCockpitComponentParameter[]} timingParameters
         * @param {string} currentTraceConfigJsonString
         * @memberof MappCockpitComponentParameterInfo
         */
        static updateTimingParameters(timingParameters, currentTraceConfigJsonString) {
            if (currentTraceConfigJsonString != "") {
                let currentTraceConfig = JSON.parse(currentTraceConfigJsonString);
                // Update all timing parameters
                try {
                    if (currentTraceConfig.Timing != undefined) {
                        this.setValueOfProperty(timingParameters, "Timing_TotalRecordingTime", currentTraceConfig.Timing.TotalRecordingTime);
                        this.setValueOfProperty(timingParameters, "Timing_TriggerOffsetTime", currentTraceConfig.Timing.TriggerOffsetTime);
                        this.setValueOfProperty(timingParameters, "Timing_AcoposSampleTime", currentTraceConfig.Timing.ACOPOSSampleTime);
                        this.setValueOfProperty(timingParameters, "Timing_PlcTaskClass", currentTraceConfig.Timing.PVTaskClass);
                        this.setValueOfProperty(timingParameters, "Timing_PlcSampleTime", currentTraceConfig.Timing.PlcSampleTime);
                    }
                }
                catch (error) {
                    console.error("Updating of some trace configuration timing informations not possible!");
                }
            }
        }
        static isTimingParameter(parameter) {
            // Timing parameters begin with "Timing_" in the properties name
            let prefix = "Timing_";
            if (parameter.browseName.substr(0, prefix.length) == prefix) {
                return true;
            }
            return false;
        }
        /**
         * retrieves the trace configuration trigger parameters from the parameter set
         *
         * @static
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @returns {MappCockpitComponentParameter[]}
         * @memberof MappCockpitComponentParameterInfo
         */
        static retrieveTraceConfigurationTriggerParameters(componentParameters) {
            // retrieve the trace configuration trigger parameters
            let triggerParameters = new Array();
            for (let i = 0; i < componentParameters.length; i++) {
                if (MappCockpitComponentParameterInfo_1.isTriggerParameter(componentParameters[i])) {
                    triggerParameters.push(componentParameters[i]);
                }
            }
            // Update the values to the real values from CurrentTrcConfig Property (BUGFIX for missing StartTriggers at startup)
            let currentTrcConfigProperties = componentParameters.filter((element) => { return element.browseName == "CurrentTrcConfig"; });
            if (currentTrcConfigProperties.length == 1) {
                if (currentTrcConfigProperties[0].value != undefined) {
                    this.updateTriggerParameters(triggerParameters, currentTrcConfigProperties[0].value);
                }
            }
            return triggerParameters;
        }
        /**
         * Updates the values of the trigger parameters with the values from a json string (currentTraceConfigJsonString)
         * BUGFIX for missing StartTriggers at startup
         *
         * @private
         * @static
         * @param {MappCockpitComponentParameter[]} triggerParameters
         * @param {string} currentTraceConfigJsonString
         * @memberof MappCockpitComponentParameterInfo
         */
        static updateTriggerParameters(triggerParameters, currentTraceConfigJsonString) {
            if (currentTraceConfigJsonString != "") {
                let currentTraceConfig = JSON.parse(currentTraceConfigJsonString);
                // Update all supported triggers
                for (let i = 0; i < 2; i++) {
                    this.updateSingleTrigger(triggerParameters, i, currentTraceConfig);
                }
            }
        }
        /**
         * Updates the values of a trigger with the given index with the values from a json string (currentTraceConfigJsonString)
         * BUGFIX for missing StartTriggers at startup
         *
         * @private
         * @static
         * @param {MappCockpitComponentParameter[]} triggerParameters
         * @param {number} triggerIndex
         * @param {*} currentTraceConfig
         * @memberof MappCockpitComponentParameterInfo
         */
        static updateSingleTrigger(triggerParameters, triggerIndex, currentTraceConfig) {
            try {
                let triggerID = (triggerIndex + 1);
                let startTriggerPrefixBrowseName = "StartTrigger" + triggerID + "_";
                let currentTriggerCfg = currentTraceConfig.Triggers.filter((element) => { return element.ID == triggerID; })[0];
                if (currentTriggerCfg != undefined) {
                    this.setValueOfProperty(triggerParameters, startTriggerPrefixBrowseName + "Condition", currentTriggerCfg.Event);
                    this.setValueOfProperty(triggerParameters, startTriggerPrefixBrowseName + "DataPoint", currentTriggerCfg.DataPoint);
                    this.setValueOfProperty(triggerParameters, startTriggerPrefixBrowseName + "Threshold", currentTriggerCfg.Threshold);
                    this.setValueOfProperty(triggerParameters, startTriggerPrefixBrowseName + "Window", currentTriggerCfg.Window);
                }
                else {
                    // Set Trigger to default if not available in current trace config
                    this.setValueOfProperty(triggerParameters, startTriggerPrefixBrowseName + "Condition", "20");
                    this.setValueOfProperty(triggerParameters, startTriggerPrefixBrowseName + "DataPoint", "");
                    this.setValueOfProperty(triggerParameters, startTriggerPrefixBrowseName + "Threshold", "0");
                    this.setValueOfProperty(triggerParameters, startTriggerPrefixBrowseName + "Window", "0");
                }
            }
            catch (error) {
                console.error("Updating of some trace configuration trigger informations not possible!");
            }
        }
        static setValueOfProperty(properties, propertyName, value) {
            let property = properties.filter((element) => { return element.browseName == propertyName; })[0];
            if (property != undefined) {
                property.value = value;
            }
        }
        static isTriggerParameter(parameter) {
            // Trigger parameters begin with "StartTrigger" in the properties name
            let prefix = "StartTrigger";
            if (parameter.browseName.substr(0, prefix.length) == prefix) {
                return true;
            }
            return false;
        }
        /**
         * retrieves the trace configuration datapoints from the parameter set
         *
         * @static
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @returns {MappCockpitComponentParameter[]}
         * @memberof MappCockpitComponentParameterInfo
         */
        static retrieveTraceConfigurationDatapoints(componentParameters) {
            // retrieve the trace configuration datapoints
            let datapoints = new Array();
            for (let i = 0; i < componentParameters.length; i++) {
                if (MappCockpitComponentParameterInfo_1.isDataPoint(componentParameters[i])) {
                    datapoints.push(componentParameters[i]);
                }
            }
            // Update the values to the real values from CurrentTrcConfig Property (BUGFIX for missing StartTriggers at startup)
            let currentTrcConfigProperties = componentParameters.filter((element) => { return element.browseName == "CurrentTrcConfig"; });
            if (currentTrcConfigProperties.length == 1) {
                if (currentTrcConfigProperties[0].value != undefined) {
                    this.updateDataPointParameters(datapoints, currentTrcConfigProperties[0].value);
                }
            }
            return datapoints;
        }
        /**
         * Updates the values of the datapoint parameters with the values from a json string (currentTraceConfigJsonString)
         * BUGFIX for missing StartTriggers at startup
         *
         * @private
         * @static
         * @param {MappCockpitComponentParameter[]} dataPointParameters
         * @param {string} currentTraceConfigJsonString
         * @memberof MappCockpitComponentParameterInfo
         */
        static updateDataPointParameters(dataPointParameters, currentTraceConfigJsonString) {
            if (currentTraceConfigJsonString != "") {
                let currentTraceConfig = JSON.parse(currentTraceConfigJsonString);
                // Update all datapoints
                try {
                    if (currentTraceConfig.DataPoints != undefined) {
                        for (let index = 0; index < dataPointParameters.length; index++) {
                            let dataPointID = (index + 1);
                            let currentDataPoint = currentTraceConfig.DataPoints.filter((element) => { return element.ID == dataPointID; })[0];
                            if (currentDataPoint != undefined) {
                                dataPointParameters[index].value = currentDataPoint.Name;
                            }
                            else {
                                dataPointParameters[index].value = "";
                            }
                        }
                    }
                }
                catch (error) {
                    console.error("Updating of some trace configuration datapoint informations not possible!");
                }
            }
        }
        static isDataPoint(parameter) {
            // Datapoint parameters begin with "DataPoint" in the properties name
            let prefix = "DataPoint";
            if (parameter.browseName.substr(0, prefix.length) == prefix) {
                return true;
            }
            return false;
        }
        /**
         * retrieves the trace control parameters from the parameter set
         *
         * @static
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @returns {MappCockpitComponentParameter[]}
         * @memberof MappCockpitComponentParameterInfo
         */
        static retrieveTraceControlParameters(componentParameters) {
            // retrieve the trace configuration datapoints
            let datapoints = new Array();
            for (let i = 0; i < componentParameters.length; i++) {
                if (MappCockpitComponentParameterInfo_1.isTraceControlParameter(componentParameters[i])) {
                    datapoints.push(componentParameters[i]);
                }
            }
            return datapoints;
        }
        static isTraceControlParameter(parameter) {
            if (parameter.browseName == "TraceStatus") {
                return true;
            }
            return false;
        }
        /**
        * retrieves the configuration parameters from the parameter set
        *
        * @static
        * @param {MappCockpitComponentParameter[]} componentParameters
        * @returns {MappCockpitComponentParameter[]}
        * @memberof MappCockpitComponentParameterInfo
        */
        static retrieveConfigurationParameters(componentParameters) {
            // get the configuration meta infos
            let configurationMetaInfo;
            if ((componentParameters[0] != undefined) && componentParameters[0].component.metaData.MetaConfigConfigProps != undefined) {
                configurationMetaInfo = componentParameters[0].component.metaData.MetaConfigConfigProps.ConfigurationStructure;
            }
            else {
                return new Array();
            }
            // retrieve the configuration definitions
            let configurationParameters = MappCockpitComponentParameterInfo_1.retrieveParametersFromMetaInfo(["Parameter", "Group"], configurationMetaInfo, componentParameters);
            return configurationParameters;
        }
        /**
         * retrives parameters declared in the meta info
         *
         * @private
         * @static
         * @param {string[]} requesteItemTypes
         * @param {*} parameterMetaInfo
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @returns
         * @memberof MappCockpitComponentParameterInfo
         */
        static retrieveParametersFromMetaInfo(requesteItemTypes, parameterMetaInfo, componentParameters) {
            // get requested meta items
            let metaParameterItems = mappCockpitComponentMetaData_1.MappCockpitComponentMetaData.filterMetaItems(parameterMetaInfo, requesteItemTypes);
            // create dictionary of available parameters
            let parameterSet = {};
            componentParameters.forEach((parameter) => { parameterSet[parameter.browseName] = parameter; });
            // create dictionary of meta parameters
            let metaParameters = {};
            metaParameterItems.forEach((metaParameter) => { metaParameters[metaParameter.Ref] = metaParameter; });
            // retrieve the parameters with matching name in the meta info
            let matchingParameters = componentParameters.filter((componentParameter) => { return metaParameters[componentParameter.browseName] !== undefined; });
            // read and assign units
            MappCockpitComponentParameterInfo_1.updateParameter(matchingParameters, metaParameters);
            // notify invalid or unknown references
            let unknownParameterRefs = metaParameterItems.filter((metaParameter) => { return metaParameter.Ref !== undefined && parameterSet[metaParameter.Ref] === undefined; });
            if (unknownParameterRefs.length > 0) {
                console.error("MappCockpitComponentParameterInfo.retrieveParametersFromMetaInfo : meta info references unknown parameters %o %o", unknownParameterRefs, parameterSet);
            }
            return matchingParameters;
        }
        /**
         * Retrieves watchable states declared in the metaInfo
         *
         * @static
         * @param {string[]} requesteItemTypes
         * @param {*} parameterMetaInfo
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @returns {MappCockpitStateParameter[]}
         * @memberof MappCockpitComponentParameterInfo
         */
        static retrieveWatchableStatesFromMetaInfo(requesteItemTypes, parameterMetaInfo, componentParameters) {
            let stateParameters = new Array();
            // get requested meta items
            let metaParameterItems = mappCockpitComponentMetaData_1.MappCockpitComponentMetaData.filterMetaItems(parameterMetaInfo, requesteItemTypes);
            // create dictionary of available parameters
            let parameterSet = {};
            componentParameters.forEach((parameter) => { parameterSet[parameter.browseName] = parameter; });
            // create watchable states
            metaParameterItems.forEach((metaParameter) => {
                stateParameters.push(new mappCockpitComponent_1.MappCockpitStateParameter(metaParameter.Ref, metaParameter.IconExpression, metaParameter.WatchableVariablesMapping, metaParameter.Icon));
            });
            return stateParameters;
        }
        static readParameters(parameterMetaInfo, parameter) {
            // get requested meta items
            let metaParameterItems = mappCockpitComponentMetaData_1.MappCockpitComponentMetaData.filterMetaItems(parameterMetaInfo, parameter);
            // create dictionary of meta parameters
            let metaParameters = {};
            metaParameterItems.forEach((metaParameter) => { metaParameters[metaParameter.Ref] = metaParameter; });
            return metaParameters;
        }
        static readMessageParameters(parameterMetaInfo) {
            let metaParameters = {};
            metaParameters["intArraySeverity"] = { Ref: "intArraySeverity" };
            metaParameters["strArrayDescription"] = { Ref: "strArrayDescription" };
            metaParameters["strArrayEventID"] = { Ref: "strArrayEventID" };
            metaParameters["strArrayTime"] = { Ref: "strArrayTime" };
            return metaParameters;
        }
        /**
         * reads engineering units from the meta info and assigns it to the parameters
         *
         * @private
         * @static
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @param {{}} metaParameters
         * @memberof MappCockpitComponentParameterInfo
         */
        static updateParameter(componentParameters, metaParameters) {
            componentParameters.forEach((componentParameter) => {
                MappCockpitComponentParameterInfo_1.updateParameterEngineeringUnit(metaParameters, componentParameter);
                MappCockpitComponentParameterInfo_1.updateParameterDisplayName(metaParameters, componentParameter);
                MappCockpitComponentParameterInfo_1.updateParameterIsReadOnly(metaParameters, componentParameter);
            });
        }
        /**
         * Updates the parameters display name
         *
         * @static
         * @param {{}} metaParameters
         * @param {MappCockpitComponentParameter} componentParameter
         * @returns {*}
         * @memberof MappCockpitComponentParameterInfo
         */
        static updateParameterDisplayName(metaParameters, componentParameter) {
            if (metaParameters[componentParameter.browseName].DisplayName) {
                componentParameter.displayName = metaParameters[componentParameter.browseName].DisplayName;
            }
        }
        /**
         * Updates the parameters readOnly info
         *
         * @static
         * @param {{}} metaParameters
         * @param {MappCockpitComponentParameter} componentParameter
         * @returns {*}
         * @memberof MappCockpitComponentParameterInfo
         */
        static updateParameterIsReadOnly(metaParameters, componentParameter) {
            if (metaParameters[componentParameter.browseName].IsReadOnly
                && (metaParameters[componentParameter.browseName].IsReadOnly == "true"
                    || metaParameters[componentParameter.browseName].IsReadOnly == true)) {
                componentParameter.isReadOnly = true;
            }
            else {
                componentParameter.isReadOnly = false;
            }
        }
        /**
         * Updates the parameters engineering units
         *
         * @private
         * @static
         * @param {{}} metaParameters
         * @param {MappCockpitComponentParameter} componentParameter
         * @memberof MappCockpitComponentParameterInfo
         */
        static updateParameterEngineeringUnit(metaParameters, componentParameter) {
            if (metaParameters[componentParameter.browseName].EU) {
                componentParameter.engineeringUnit = metaParameters[componentParameter.browseName].EU;
            }
        }
        /**
         * reads enum values if available and assigns it to the parameter
         *
         * @static
         * @param {MappCockpitComponentParameter} parameter
         * @returns {*} true if the parameter uses an enum for its value
         * @memberof MappCockpitComponentParameterInfo
         */
        static readParameterEnums(componentParameters) {
            // get available enum parameter defs 
            let enumParameterTypeDefinitions = mappCockpitCommonInfoProvider_1.MappCockpitCommonInfoProvider.getInstance().readEnumParameterDefinitions(componentParameters, componentParameters[0].component.metaData);
            // find matching parameter
            let matchingParameters = componentParameters.filter((componentParameter) => { return enumParameterTypeDefinitions[componentParameter.browseName]; });
            // set the enum definitions for the matching parameters
            matchingParameters.forEach((matchingParameter) => {
                // set the enum definition
                matchingParameter.enumType = enumParameterTypeDefinitions[matchingParameter.browseName];
                console.log("MappCockpitComponentParameterInfo - set enum info %o for %o", matchingParameter.enumType, matchingParameter.component.browseName + "." + matchingParameter.browseName);
            });
        }
    };
    MappCockpitComponentParameterInfo = MappCockpitComponentParameterInfo_1 = __decorate([
        mco.role()
    ], MappCockpitComponentParameterInfo);
    exports.MappCockpitComponentParameterInfo = MappCockpitComponentParameterInfo;
    /**
     * provides descriptive information for a method
     *
     * @class MappCockpitComponentMethodInfoInfo
     */
    let MappCockpitComponentMethodInfo = MappCockpitComponentMethodInfo_1 = class MappCockpitComponentMethodInfo {
        /**
         * initializes the method input parameters
         *
         * @static
         * @param {MappCockpitComponentMethod} method
         * @returns {*}
         * @memberof MappCockpitComponentMethodInfo
         */
        static updateMethodInputParameters(method) {
            // skip if the method has no parameters to initialize.
            if (method.inputParameters.length === 0)
                return;
            // get the meta data
            let methodMetaInfo = MappCockpitComponentMethodInfo_1.getMethodMetaInfo(method);
            if (methodMetaInfo) {
                // find and initialize method parameter default values
                method.inputParameters.forEach((methodInputParameter) => {
                    MappCockpitComponentMethodInfo_1.updateMethodInputParameterDefaults(method, methodInputParameter, methodMetaInfo);
                });
            }
        }
        /**
         * updates respectively initializes the method input parameters with defaults
         *
         * @private
         * @static
         * @param {MappCockpitComponentMethod} method
         * @param {MappCockpitMethodParameter} methodInputParameter
         * @param {*} methodMetaInfo
         * @memberof MappCockpitComponentMethodInfo
         */
        static updateMethodInputParameterDefaults(method, methodInputParameter, methodMetaInfo) {
            let methodParameterMetaInfo = MappCockpitComponentMethodInfo_1.getMethodParameterMetaInfo(methodMetaInfo, methodInputParameter);
            if (methodParameterMetaInfo) {
                // assign default value if defined ...
                MappCockpitComponentMethodInfo_1.updateMethodInputParameterDefaultValue(methodParameterMetaInfo, methodInputParameter, method);
                // assign engineering unit if defined.
                MappCockpitComponentMethodInfo_1.updateMethodParameterEngineeringUnit(methodParameterMetaInfo, methodInputParameter);
                // assign display name
                MappCockpitComponentMethodInfo_1.updateMethodParameterDisplayName(methodParameterMetaInfo, methodInputParameter);
                //assign filter if defined
                MappCockpitComponentMethodInfo_1.updateMethodParameterFilter(methodParameterMetaInfo, methodInputParameter);
            }
            else {
                console.error("MappCockpitComponentMethodInfo.initializeInputParameterDefaultValues : No meta info defined for for method parameter %o", method.browseName + "." + methodInputParameter.name);
            }
        }
        /**
         * Update filter information to method parameter
         *
         * @private
         * @static
         * @param {*} methodParameterMetaInfo
         * @param {MappCockpitMethodParameter} methodInputParameter
         * @returns {*}
         * @memberof MappCockpitComponentMethodInfo
         */
        static updateMethodParameterFilter(methodParameterMetaInfo, methodInputParameter) {
            let parameterHasFilter = methodParameterMetaInfo.Parameter.hasOwnProperty("Filter");
            if (parameterHasFilter) {
                methodInputParameter.filter = new parameterFilter_1.ParameterFilter(methodParameterMetaInfo.Parameter.Filter.ParameterRef, methodParameterMetaInfo.Parameter.Filter.ParameterValues);
            }
        }
        /**
         * Updates the display from meta info
         *
         * @static
         * @param {*} methodParameterMetaInfo
         * @param {MappCockpitMethodParameter} methodInputParameter
         * @returns {*}
         * @memberof MappCockpitComponentMethodInfo
         */
        static updateMethodParameterDisplayName(methodParameterMetaInfo, methodInputParameter) {
            if (methodParameterMetaInfo.Parameter.DisplayName) {
                methodInputParameter.displayName = methodParameterMetaInfo.Parameter.DisplayName;
            }
        }
        /**
         * Updates the engineering unit
         *
         * @private
         * @static
         * @param {*} methodParameterMetaInfo
         * @param {MappCockpitMethodParameter} methodInputParameter
         * @memberof MappCockpitComponentMethodInfo
         */
        static updateMethodParameterEngineeringUnit(methodParameterMetaInfo, methodInputParameter) {
            if (methodParameterMetaInfo.Parameter.EU) {
                methodInputParameter.engineeringUnit = methodParameterMetaInfo.Parameter.EU;
            }
        }
        /**
         * Updates the default value
         *
         * @private
         * @static
         * @param {*} methodParameterMetaInfo
         * @param {MappCockpitMethodParameter} methodInputParameter
         * @param {MappCockpitComponentMethod} method
         * @memberof MappCockpitComponentMethodInfo
         */
        static updateMethodInputParameterDefaultValue(methodParameterMetaInfo, methodInputParameter, method) {
            let parameterHasDefaultValue = methodParameterMetaInfo.Parameter.hasOwnProperty("DefaultValue");
            if (parameterHasDefaultValue) {
                methodInputParameter.value = methodParameterMetaInfo.Parameter.DefaultValue;
            }
            else {
                // method parameters must have default values defined
                console.error("MappCockpitComponentMethodInfo.initializeInputParameterDefaultValues : No default value defined for method parameter %o", method.browseName + "." + methodInputParameter.name);
            }
        }
        /**
         * gets the meta info for a method parameter
         *
         * @private
         * @static
         * @param {*} methodMetaInfo
         * @param {MappCockpitMethodParameter} methodInputParameter
         * @returns
         * @memberof MappCockpitComponentMethodInfo
         */
        static getMethodParameterMetaInfo(methodMetaInfo, methodInputParameter) {
            let methodParameterMetaInfo = undefined;
            // get parameter meta info if available
            if (methodMetaInfo.Parameters) {
                let methodParameterMetaInfos = methodMetaInfo.Parameters.filter((methodMetaItemParameterItem) => { return methodMetaItemParameterItem.Parameter.Ref === methodInputParameter.name; });
                methodParameterMetaInfo = methodParameterMetaInfos.length === 1 ? methodParameterMetaInfos[0] : undefined;
            }
            return methodParameterMetaInfo;
        }
        /**
         * gets the meta info for the requested method
         *
         * @private
         * @static
         * @param {MappCockpitComponentMethod} method
         * @returns
         * @memberof MappCockpitComponentMethodInfo
         */
        static getMethodMetaInfo(method) {
            let methodMetaInfo = undefined;
            let componentMetaData = method.component.metaData;
            if (componentMetaData == undefined) {
                return methodMetaInfo;
            }
            // get the method info from meta data
            let methodMetaItems = mappCockpitComponentMetaData_1.MappCockpitComponentMetaData.filterMetaItems(componentMetaData.MetaConfigCommands.CommandsStructure, ["Command"]);
            // get the meta info for the requested method
            let methodMetaInfos = methodMetaItems.filter((methodMetaItem) => { return methodMetaItem.Ref === method.browseName; });
            methodMetaInfo = methodMetaInfos.length === 1 ? methodMetaInfos[0] : undefined;
            return methodMetaInfo;
        }
        /**
         * gets the method parameters contained in the meta data
         *
         * @private
         * @static
         * @param {*} methodMetaItem
         * @param {MappCockpitMethodParameter} methodInputParameter
         * @returns
         * @memberof MappCockpitComponentMethodInfo
         */
        static getMatchingMethodParameters(methodMetaItem, methodInputParameter) {
            return methodMetaItem.Parameters.filter((methodMetaItemParameterItem) => {
                let isMatchingMethodParameter = methodMetaItemParameterItem.Parameter.Ref === methodInputParameter.name
                    && methodMetaItemParameterItem.Parameter.DefaultValue
                    && methodMetaItemParameterItem.Parameter.DefaultValue !== "";
                return isMatchingMethodParameter;
            });
        }
        /**
         * Retrieves the executable methods from the component method set
         *
         * @static
         * @param {MappCockpitComponentMethod[]} componentMethods
         * @param {Array<string>} dataToRetrieve
         * @returns {MappCockpitComponentMethod[]}
         * @memberof MappCockpitComponentMethodInfo
         */
        static retrieveExecutableMethods(componentMethods, dataToRetrieve) {
            let metaConfig = dataToRetrieve[0];
            let metaStructure = dataToRetrieve[1];
            let metaName = dataToRetrieve[2];
            let executableMethods = Array();
            if ((componentMethods[0] == undefined) ||
                componentMethods[0].component.metaData == undefined ||
                componentMethods[0].component.metaData[metaConfig] == undefined) {
                return executableMethods;
            }
            // get the commands meta infos
            let methodsMetaInfo = componentMethods[0].component.metaData[metaConfig][metaStructure];
            // retrieve the method definitions
            let metaMethods = mappCockpitComponentMetaData_1.MappCockpitComponentMetaData.filterMetaItems(methodsMetaInfo, [metaName]);
            // create dictionary of available methods
            let methodSet = {};
            let metaMethodSet = {};
            componentMethods.forEach((method) => { methodSet[method.browseName] = method; });
            metaMethods.forEach((metaMethod) => { metaMethodSet[metaMethod.Ref] = metaMethod; });
            // retrieve the methods with matching name in the meta info
            executableMethods = metaMethods.filter((metaMethod) => { return methodSet[metaMethod.Ref] !== undefined; }).map((metaMethod) => { return methodSet[metaMethod.Ref]; });
            // assign the display name
            executableMethods.forEach((method) => { this.updateMethodDisplayName(method, metaMethodSet[method.browseName]); });
            // notify invalid or unknown methods
            let unknownMethods = metaMethods.filter((metaMethod) => { return methodSet[metaMethod.Ref] === undefined; });
            if (unknownMethods.length > 0) {
                console.error("MappCockpitComponentMethodInfo.retrieveExecutableMethods : meta info references unknown methods %o", unknownMethods);
            }
            return executableMethods;
        }
        /**
         * Retrieves quick commands methods from metaInfo
         *
         * @static
         * @param {MappCockpitComponentMethod[]} componentMethods
         * @param {Array<string>} dataToRetrieve
         * @returns {MappCockpitQuickCommandParameter[]}
         * @memberof MappCockpitComponentMethodInfo
         */
        static retrieveQuickCommands(componentMethods, dataToRetrieve) {
            let metaConfig = dataToRetrieve[0];
            let metaStructure = dataToRetrieve[1];
            let metaName = dataToRetrieve[2];
            let quickCommands = Array();
            if ((componentMethods[0] == undefined) ||
                componentMethods[0].component.metaData == undefined ||
                componentMethods[0].component.metaData[metaConfig] == undefined) {
                return quickCommands;
            }
            // get the commands meta infos
            let methodsMetaInfo = componentMethods[0].component.metaData[metaConfig][metaStructure];
            // retrieve the method definitions
            let metaMethods = mappCockpitComponentMetaData_1.MappCockpitComponentMetaData.filterMetaItems(methodsMetaInfo, [metaName]);
            // create dictionary of available methods
            let methodSet = {};
            componentMethods.forEach((method) => { methodSet[method.browseName] = method; });
            metaMethods.forEach((metaMethod) => {
                quickCommands.push(new mappCockpitComponent_1.MappCockpitQuickCommandParameter(metaMethod.Ref, metaMethod.Tooltip, metaMethod.ImageName));
            });
            // notify invalid or unknown methods
            let unknownMethods = quickCommands.filter((quickCommand) => { return methodSet[quickCommand.name] === undefined; });
            if (unknownMethods.length > 0) {
                console.error("MappCockpitComponentMethodInfo.retrieveQuickCommands : meta info references unknown methods %o", unknownMethods);
            }
            return quickCommands;
        }
        static readMethods(metaInfo, property, method) {
            let metaConfig = property[0];
            let metaConfigStructure = property[1];
            // get the commands meta infos
            if (metaInfo[metaConfig] == undefined)
                return {};
            let methodsMetaInfo = metaInfo[metaConfig][metaConfigStructure];
            // retrieve the method definitions
            let metaMethods = mappCockpitComponentMetaData_1.MappCockpitComponentMetaData.filterMetaItems(methodsMetaInfo, method);
            // create dictionary of available methods
            let metaMethodSet = {};
            metaMethods.forEach((metaMethod) => { metaMethodSet[metaMethod.Ref] = metaMethod; });
            return metaMethodSet;
        }
        /**
         * Updates a methods display name
         *
         * @static
         * @param {MappCockpitComponentMethod} method
         * @param {*} arg1
         * @returns {*}
         * @memberof MappCockpitComponentMethodInfo
         */
        static updateMethodDisplayName(method, metaMethodInfo) {
            if (metaMethodInfo && metaMethodInfo.DisplayName) {
                method.displayName = metaMethodInfo.DisplayName;
            }
        }
        /**
         * reads and updates method parameter enums
         *
         * @static
         * @param {MappCockpitComponentMethod} method
         * @returns {*}
         * @memberof MappCockpitComponentMethodInfo
         */
        static readMethodParameterEnums(method, metaData) {
            let methodParameters = method.inputParameters;
            // get available enum method parameter defs 
            let metaMethodParameterEnumTypeDefinitions = mappCockpitCommonInfoProvider_1.MappCockpitCommonInfoProvider.getInstance().readMetaEnumMethodParameterDefinitions(method, metaData);
            // find matching parameter
            let matchingMethodParameters = methodParameters.filter((methodParameter) => { return metaMethodParameterEnumTypeDefinitions[methodParameter.name]; });
            // set the enum definitions for the matching parameters
            matchingMethodParameters.forEach((matchingMethodParameter) => {
                // set the enum definition
                matchingMethodParameter.enumType = metaMethodParameterEnumTypeDefinitions[matchingMethodParameter.name];
                console.log("MappCockpitComponentMethodInfo - set enum info %o for %o", matchingMethodParameter.enumType, method.browseName + "." + matchingMethodParameter.name);
            });
        }
    };
    MappCockpitComponentMethodInfo = MappCockpitComponentMethodInfo_1 = __decorate([
        mco.role()
    ], MappCockpitComponentMethodInfo);
    exports.MappCockpitComponentMethodInfo = MappCockpitComponentMethodInfo;
});
