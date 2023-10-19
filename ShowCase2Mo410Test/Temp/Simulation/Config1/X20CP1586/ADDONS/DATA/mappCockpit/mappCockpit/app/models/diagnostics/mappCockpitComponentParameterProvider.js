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
define(["require", "exports", "../../communication/rest/opcUaRestServices", "../online/mappCockpitComponent", "../online/mappCockpitComponentReflection"], function (require, exports, opcUaRestServices_1, ModelItems, mappCockpitComponentReflection_1) {
    "use strict";
    var MappCockpitComponentParameterProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitComponentParameterProvider = void 0;
    /**
     * Implements component parameter access services
     *
     * @class MappCockpitComponentParameterProvider
     */
    let MappCockpitComponentParameterProvider = MappCockpitComponentParameterProvider_1 = class MappCockpitComponentParameterProvider {
        /**
         * Creates an instance of MappCockpitComponentParameterProvider.
         * @param {MappCockpitDiagnosticProvider} diagnosticProvider
         * @memberof MappCockpitComponentParameterProvider
         */
        constructor(diagnosticProvider) {
            this._diagnosticProvider = diagnosticProvider;
        }
        /**
         * Browses the parameters of a component
         *
         * @private
         * @param {MappCockpitComponent} mappCockpitComponent
         * @returns
         * @memberof MappCockpitComponentParameterProvider
         */
        browseComponentParameters(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                // Read component parameters.
                var componentParameterSet = yield opcUaRestServices_1.OpcUaRestServices.browseNodeParameterSet(this._diagnosticProvider.sessionId, mappCockpitComponent.id);
                var componentParameters = componentParameterSet.map((parameter) => {
                    let componentParameters = new ModelItems.MappCockpitComponentParameter(mappCockpitComponent, parameter.displayName, parameter);
                    return componentParameters;
                });
                mappCockpitComponent.parameters = componentParameters;
                return mappCockpitComponent.parameters;
            });
        }
        /**
         * updates parameter data types
         *
         * @param {any[]} parameters
         * @returns {Promise<any>}
         * @memberof MappCockpitComponentParameterProvider
         */
        updateParameterDataTypes(parameters) {
            return __awaiter(this, void 0, void 0, function* () {
                // get the requested parameter type infos
                const parameterDataTypeInfo = yield this.readParameterTypeInfo(parameters);
                // update the parameter data types
                this.updateParameterDataTypeInfo(parameters, parameterDataTypeInfo);
                // read and update parameter enums
                this.readParameterEnums(parameters);
            });
        }
        /**
         * reads the parameters data type infos
         *
         * @private
         * @param {ModelItems.MappCockpitComponentParameter[]} parameters
         * @returns {Promise<Map<string, ModelItems.MappCockpitParameterDataType>>}
         * @memberof MappCockpitComponentParameterProvider
         */
        readParameterTypeInfo(parameters) {
            return __awaiter(this, void 0, void 0, function* () {
                const distinctParameterTypeIds = new Map();
                const parameterTypes = new Map();
                // read the parameters data type ids
                let dataTypeIds = yield this.readParameterDataTypeIds(parameters, distinctParameterTypeIds, parameterTypes);
                // read the data types display name
                const parameterDataTypeInfo = yield this.readParameterDataTypeDisplayNames(parameters, dataTypeIds, distinctParameterTypeIds, parameterTypes);
                return parameterDataTypeInfo;
            });
        }
        /**
         * Reads the display names for the requested data types
         *
         * @private
         * @param {ModelItems.MappCockpitComponentParameter[]} parameters
         * @param {string[]} dataTypeIds
         * @param {Map<string, string>} distinctParameterTypeIds
         * @param {Map<string, string>} parameterTypes
         * @returns
         * @memberof MappCockpitComponentParameterProvider
         */
        readParameterDataTypeDisplayNames(parameters, dataTypeIds, distinctParameterTypeIds, parameterTypes) {
            return __awaiter(this, void 0, void 0, function* () {
                // activate batching
                opcUaRestServices_1.OpcUaRestServices.activateBatching();
                // create the requests for reading the data types display name
                for (let i = 0; i < dataTypeIds.length; i++) {
                    yield opcUaRestServices_1.OpcUaRestServices.readNodeAttribute(this._diagnosticProvider.sessionId, dataTypeIds[i], opcUaRestServices_1.OpcUaAttribute.DISPLAY_NAME);
                }
                // read the display names per batch request
                let dataTypedisplayNameResult = yield opcUaRestServices_1.OpcUaRestServices.executeBatchRequest();
                // create a map of data type id to data type name  
                dataTypedisplayNameResult.forEach((responseValue, requestId) => {
                    // set the item id for the created monitor item
                    const typeId = dataTypeIds[requestId];
                    const typeName = responseValue.value;
                    distinctParameterTypeIds.set(typeId, typeName);
                });
                //// create the parameter type info objects
                const parameterDataTypeInfo = new Map();
                // create a map for the parameters type infos
                parameters.forEach((parameter) => {
                    const parameterDataTypeNodeId = parameterTypes.get(parameter.id);
                    const parameterDataTypeDisplayName = distinctParameterTypeIds.get(parameterDataTypeNodeId);
                    parameterDataTypeInfo.set(parameter.id, new ModelItems.MappCockpitParameterDataType(parameterDataTypeNodeId, parameterDataTypeDisplayName));
                });
                return parameterDataTypeInfo;
            });
        }
        /**
         * Reads the ids for the parameter data types
         *
         * @private
         * @param {ModelItems.MappCockpitComponentParameter[]} parameters
         * @param {Map<string, string>} distinctParameterTypeIds
         * @param {Map<string, string>} parameterTypes
         * @returns
         * @memberof MappCockpitComponentParameterProvider
         */
        readParameterDataTypeIds(parameters, distinctParameterTypeIds, parameterTypes) {
            return __awaiter(this, void 0, void 0, function* () {
                // activate batch mode which returns the rest settings instead of directly executing
                opcUaRestServices_1.OpcUaRestServices.activateBatching();
                for (let i = 0; i < parameters.length; i++) {
                    yield opcUaRestServices_1.OpcUaRestServices.readNodeAttribute(this._diagnosticProvider.sessionId, parameters[i].id, opcUaRestServices_1.OpcUaAttribute.DATA_TYPE);
                }
                // read the parameter type ids
                let nodeDataTypesResult = yield opcUaRestServices_1.OpcUaRestServices.executeBatchRequest();
                // create a map of data type id to data type name  
                nodeDataTypesResult.forEach((responseValue, requestId) => {
                    const parameterTypeId = responseValue.value;
                    distinctParameterTypeIds.set(parameterTypeId, "");
                    parameterTypes.set(parameters[requestId].id, parameterTypeId);
                });
                // retriev the unique type ids
                let dataTypeIds = Array.from(distinctParameterTypeIds.keys());
                return dataTypeIds;
            });
        }
        updateParameterDataTypeInfo(parameters, parameterDataTypeInfo) {
            parameters.forEach((parameter) => {
                // update the parameters data type if available
                const parameterTypeInfo = parameterDataTypeInfo.get(parameter.id);
                if (parameterTypeInfo) {
                    parameter.dataType = parameterTypeInfo;
                }
            });
        }
        /**
         * reads parameter data types
         *
         * @param {ModelItems.MappCockpitComponentParameter[]} mappCockpitComponentParameters
         * @memberof MappCockpitComponentParameterProvider
         */
        readParameterDataTypes(mappCockpitComponentParameters) {
            return __awaiter(this, void 0, void 0, function* () {
                let readParameterDataTypeRequests = [];
                mappCockpitComponentParameters.forEach((componentParameter) => { readParameterDataTypeRequests.push(this.updateParameterDataType(componentParameter)); });
                yield Promise.all(readParameterDataTypeRequests);
            });
        }
        /**
         * Updates the
         *
         * @param {MappCockpitComponentParameter} componentParameter
         * @returns {Promise<any>}
         * @memberof MappCockpitComponentParameterProvider
         */
        updateParameterDataType(componentParameter) {
            return __awaiter(this, void 0, void 0, function* () {
                let dataTypeRef = yield this.readComponentParameterDataType(componentParameter);
                componentParameter.dataType = dataTypeRef;
            });
        }
        /**
         * reads and updates the parameter enums for enum data types
         *
         * @param {ModelItems.MappCockpitComponentParameter[]} mappCockpitComponentParameters
         * @returns {Promise<any>}
         * @memberof MappCockpitComponentParameterProvider
         */
        readParameterEnums(mappCockpitComponentParameters) {
            mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.readParameterEnums(mappCockpitComponentParameters);
        }
        /**
         * reads the data type of a parameter
         *
         * @param {ModelItems.MappCockpitComponentParameter} componentParameter
         * @returns {Promise<any>}
         * @memberof MappCockpitComponentParameterProvider
         */
        readComponentParameterDataType(componentParameter) {
            return __awaiter(this, void 0, void 0, function* () {
                // read the parameters data type 
                var parameterDataTypeId = yield opcUaRestServices_1.OpcUaRestServices.readNodeAttribute(this._diagnosticProvider.sessionId, componentParameter.id, opcUaRestServices_1.OpcUaAttribute.DATA_TYPE);
                var parameterDataTypeNodeId = parameterDataTypeId;
                // var parameterDataTypeBrowseName = await OpcUaRestServices.readNodeAttribute(this._diagnosticProvider.sessionId, parameterDataTypeNodeId,OpcUaAttribute.BROWSE_NAME);
                return yield this.readDataTypeInfo(parameterDataTypeNodeId);
            });
        }
        /**
         * reads data type info for the specified data type id
         *
         * @private
         * @param {*} parameterDataTypeNodeId
         * @returns
         * @memberof MappCockpitComponentParameterProvider
         */
        readDataTypeInfo(parameterDataTypeNodeId) {
            return __awaiter(this, void 0, void 0, function* () {
                var parameterDataTypeDisplayName = "";
                // read the data type dsplay name if not yet available
                if (MappCockpitComponentParameterProvider_1.dataTypeNames.has(parameterDataTypeNodeId)) {
                    parameterDataTypeDisplayName = MappCockpitComponentParameterProvider_1.dataTypeNames.get(parameterDataTypeNodeId);
                }
                else {
                    parameterDataTypeDisplayName = yield opcUaRestServices_1.OpcUaRestServices.readNodeAttribute(this._diagnosticProvider.sessionId, parameterDataTypeNodeId, opcUaRestServices_1.OpcUaAttribute.DISPLAY_NAME);
                    MappCockpitComponentParameterProvider_1.dataTypeNames.set(parameterDataTypeNodeId, parameterDataTypeDisplayName);
                }
                // var parameterDataTypeDescr = await OpcUaRestServices.readNodeAttribute(this._diagnosticProvider.sessionId, parameterDataTypeNodeId,OpcUaAttribute.DESCRIPTION);
                return new ModelItems.MappCockpitParameterDataType(parameterDataTypeNodeId, parameterDataTypeDisplayName);
            });
        }
        /**
         * reads a parameters value and updates the parameters value if specified
         *
         * @param {ModelItems.MappCockpitComponentParameter} componentParameter
         * @param {boolean} [update=true] updates the parameters value if true
         * @returns
         * @memberof MappCockpitComponentParameterProvider
         */
        readComponentParameterValue(componentParameter, update = true) {
            return __awaiter(this, void 0, void 0, function* () {
                var componentParameterValue = yield opcUaRestServices_1.OpcUaRestServices.readNodeAttribute(this._diagnosticProvider.sessionId, componentParameter.id);
                // update the parameters value
                if (update) {
                    componentParameter.value = componentParameterValue;
                }
                return componentParameterValue;
            });
        }
        /**
         * writes a parameter value
         *
         * @param {ModelItems.MappCockpitComponentParameter} componentParameter
         * @returns
         * @memberof MappCockpitComponentParameterProvider
         */
        writeComponentParameterValue(componentParameter) {
            return __awaiter(this, void 0, void 0, function* () {
                // write the component parameter to the target
                var componentParameterValue = yield opcUaRestServices_1.OpcUaRestServices.writeNodeAttribute(this._diagnosticProvider.sessionId, componentParameter.id, opcUaRestServices_1.OpcUaAttribute.VALUE, componentParameter.value);
                // verify if the parameter has been written siccessfully
                this.verifyParameterWrite(componentParameter);
                return componentParameterValue;
            });
        }
        /**
         * Verifies if the parameter has been successfully written by reading back the value after some delay time
         *
         * @private
         * @param {ModelItems.MappCockpitComponentParameter} componentParameter
         * @memberof MappCockpitComponentParameterProvider
         */
        verifyParameterWrite(componentParameter) {
            // delay reread for 2 times the monitoring sampling rate so that change notification could possibly be received
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                // read the parameter value from the target
                let reflectedParameterValue = yield this.readComponentParameterValue(componentParameter, false);
                // update/rewrite the parameter if its value differs from the reflected value.
                if (reflectedParameterValue !== componentParameter.value) {
                    componentParameter.value = reflectedParameterValue;
                }
                // reflect the written value via the write response delegate
                if (componentParameter.reflectedWriteResponseDelegate) {
                    componentParameter.reflectedWriteResponseDelegate(reflectedParameterValue);
                    // clear the response delegate after the response call to make sure that every write uses its own response callback
                    componentParameter.reflectedWriteResponseDelegate = undefined;
                }
            }), opcUaRestServices_1.OpcUaRestServices.monitoringSamplingInterval * 2);
        }
    };
    // caches data type names for node ids
    MappCockpitComponentParameterProvider.dataTypeNames = new Map();
    MappCockpitComponentParameterProvider = MappCockpitComponentParameterProvider_1 = __decorate([
        mco.role()
    ], MappCockpitComponentParameterProvider);
    exports.MappCockpitComponentParameterProvider = MappCockpitComponentParameterProvider;
});
