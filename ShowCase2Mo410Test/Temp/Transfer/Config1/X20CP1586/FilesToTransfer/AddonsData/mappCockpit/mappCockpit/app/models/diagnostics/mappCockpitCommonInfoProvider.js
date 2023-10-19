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
define(["require", "exports", "../../communication/rest/opcUaRestServices", "../online/mappCockpitComponent", "../online/mappCockpitComponentMetaData", "../online/mappCockpitComponentReflection"], function (require, exports, opcUaRestServices_1, mappCockpitComponent_1, mappCockpitComponentMetaData_1, mappCockpitComponentReflection_1) {
    "use strict";
    var MappCockpitCommonInfoProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitCommonInfoProvider = void 0;
    let MappCockpitCommonInfoProvider = MappCockpitCommonInfoProvider_1 = class MappCockpitCommonInfoProvider {
        /**
         * creates an instance of MappCockpitCommonInfoProvider.
         * @memberof MappCockpitCommonInfoProvider
         */
        constructor() {
            // holds the currently acive session id
            this._sessionId = -1;
            // holds the mapp cockpit nmespace index
            this._namespaceIndex = -1;
            // holds enum type definitions
            this._enumTypeDefinitions = [];
        }
        /**
         * gets a singleton instance of MappCockpitCommonInfoProvider
         *
         * @readonly
         * @type {MappCockpitCommonInfoProvider}
         * @memberof MappCockpitCommonInfoProvider
         */
        static getInstance() {
            this._instance = this._instance ? this._instance : new MappCockpitCommonInfoProvider_1();
            return this._instance;
        }
        /**
         * initializes the info provider and populates it with commonly needed data
         *
         * @param {number} sessionId
         * @param {number} namespaceIndex
         * @returns {*}
         * @memberof MappCockpitCommonInfoProvider
         */
        initialize(sessionId, namespaceIndex) {
            return __awaiter(this, void 0, void 0, function* () {
                this._sessionId = sessionId;
                this._namespaceIndex = namespaceIndex;
                // browse available enum type definitions
                yield this.readEnumTypeDefinitions();
                console.log("MappCockpitCommonInfoProvider.readEnumTypeDefinitions %o", this._enumTypeDefinitions);
            });
        }
        readComponentMetaInfo(component) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let componentMetaReferences = yield opcUaRestServices_1.OpcUaRestServices.browseNodeMetaInfo(this._sessionId, component.id);
                    if (componentMetaReferences) {
                        component.metaData = this.parseComponentMetaData(componentMetaReferences);
                    }
                }
                catch (error) {
                }
            });
        }
        /**
         * Parses the components meta data
         *
         * @private
         * @param {InterfaceOpcUaRestResultNodeReference[]} metaInfoReferences
         * @returns
         * @memberof MappCockpitCommonInfoProvider
         */
        parseComponentMetaData(metaInfoReferences) {
            let metaData = {};
            try {
                metaInfoReferences.forEach((metaInfoReference) => {
                    metaData[metaInfoReference.browseName] = JSON.parse(metaInfoReference.value);
                });
            }
            catch (e) {
                throw new Error("MappCockpitComponentDataModel.browseMetaData: could not parse meta data: " + e.message);
            }
            return metaData;
        }
        /**
         * Initializes the meta data with specific sections
         *
         * @static
         * @param {MappCockpitComponentMetaData} metaData
         * @returns {*}
         * @memberof MappCockpitCommonInfoProvider
         */
        static initializeMetaData(metaData) {
            // create and populate the parameters group
            metaData["Parameters"] = {};
            metaData["Parameters"]["Watchable"] = mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.readParameters(metaData, ["Watchable"]);
            metaData["Parameters"]["Message"] = mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.readMessageParameters(metaData);
            metaData["Parameters"]["Configuration"] = mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.readParameters(metaData, ["Parameter", "Group"]);
            metaData["Parameters"]["WatchableState"] = mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.readParameters(metaData, ["WatchableState"]);
            // create and populate the methods group
            metaData["Methods"] = {};
            metaData["Methods"]["Executable"] = mappCockpitComponentReflection_1.MappCockpitComponentMethodInfo.readMethods(metaData, ["MetaConfigCommands", "CommandsStructure"], ["Command"]);
            metaData["Methods"]["QuickCommand"] = mappCockpitComponentReflection_1.MappCockpitComponentMethodInfo.readMethods(metaData, ["MetaConfigQuickCommands", "QuickCommandsStructure"], ["QuickMethod"]);
        }
        /**
         * gets the available enum type definitions
         *
         * @readonly
         * @type {Array<MappCockpitComponentParameterEnum>}
         * @memberof MappCockpitCommonInfoProvider
         */
        get enumTypeDefinitions() {
            return this._enumTypeDefinitions;
        }
        /**
         * reads and updates enum type definitions
         *
         * @private
         * @memberof MappCockpitCommonInfoProvider
         */
        readEnumTypeDefinitions() {
            return __awaiter(this, void 0, void 0, function* () {
                this._enumTypeDefinitions = yield this.browseEnumTypeDefinitions(this._sessionId, this._namespaceIndex);
            });
        }
        /**
         * Browses the existing enum definitions (batched).
         *
         * @private
         * @param {number} sessionId
         * @param {*} namespaceIndex
         * @returns
         * @memberof MappCockpitCommonInfoProvider
         */
        browseEnumTypeDefinitions(sessionId, namespaceIndex) {
            return __awaiter(this, void 0, void 0, function* () {
                let enums = [];
                try {
                    ////
                    // browse enum nodes
                    // get all available enum nodes
                    let { enumValueNodesResult, mcpEnums } = yield this.browseEnumNodes(sessionId, namespaceIndex);
                    // retrieve the enum values nodes and assign them as reference to the enum node
                    this.readEnumValueNodes(enumValueNodesResult, mcpEnums);
                    //// browse enum values
                    yield this.readEnumValues(mcpEnums, sessionId);
                    // create the enum definition objects
                    enums = mcpEnums.map((opcUaEnumsRef) => { return new mappCockpitComponent_1.MappCockpitComponentParameterEnum(opcUaEnumsRef); });
                }
                catch (error) {
                    console.error(error);
                }
                return enums;
            });
        }
        /**
         * Reads the enum value nodes
         *
         * @private
         * @param {*} enumValueNodesResult
         * @param {InterfaceOpcUaRestResultNodeReference[]} mcpEnums
         * @memberof MappCockpitCommonInfoProvider
         */
        readEnumValueNodes(enumValueNodesResult, mcpEnums) {
            // update the enum objects with their value references
            enumValueNodesResult.forEach((resultValue, requestId) => {
                // filter the enum value nodes
                const valueReference = resultValue.references.find((enumValuesNode) => { return enumValuesNode.browseName.includes("EnumValues") || enumValuesNode.browseName.includes("EnumStrings"); });
                // assign the value references to the enum object
                mcpEnums[requestId].valuesRef = valueReference;
            });
        }
        /**
         * Gets the enum values
         *
         * @private
         * @param {InterfaceOpcUaRestResultNodeReference[]} mcpEnums
         * @param {number} sessionId
         * @memberof MappCockpitCommonInfoProvider
         */
        readEnumValues(mcpEnums, sessionId) {
            return __awaiter(this, void 0, void 0, function* () {
                // activate batch mode
                opcUaRestServices_1.OpcUaRestServices.activateBatching();
                // prepare read enum value requests
                for (let i = 0; i < mcpEnums.length; i++) {
                    yield opcUaRestServices_1.OpcUaRestServices.readNodeAttribute(sessionId, mcpEnums[i].valuesRef.nodeId, opcUaRestServices_1.OpcUaAttribute.VALUE);
                }
                // get the enum values batched
                let enumValuesResult = yield opcUaRestServices_1.OpcUaRestServices.executeBatchRequest();
                // update the enum values ...
                (enumValuesResult).forEach((responseValue, requestId) => {
                    mcpEnums[requestId].enumValues = responseValue.value;
                });
            });
        }
        /**
         * Browses the existin enum nodes
         *
         * @private
         * @param {number} sessionId
         * @param {*} namespaceIndex
         * @returns
         * @memberof MappCockpitCommonInfoProvider
         */
        browseEnumNodes(sessionId, namespaceIndex) {
            return __awaiter(this, void 0, void 0, function* () {
                let opcUaEnums = yield opcUaRestServices_1.OpcUaRestServices.browseNodes(sessionId, opcUaRestServices_1.OpcUaRestServices.mappCockpitEnumsId);
                // filter enums within mapp cockpit namespace
                let mcpEnums = opcUaEnums.filter((opcUaEnum) => { return opcUaEnum.nodeId.indexOf(opcUaRestServices_1.OpcUaRestServices.mappCockpitNamespacePrefix + namespaceIndex) > -1; });
                // activate batching 
                opcUaRestServices_1.OpcUaRestServices.activateBatching();
                // collect requests for browsing the enum properties
                for (let i = 0; i < mcpEnums.length; i++) {
                    yield opcUaRestServices_1.OpcUaRestServices.browseNodes(sessionId, mcpEnums[i].nodeId);
                }
                // get the enum nodes
                let enumValueNodesResult = yield opcUaRestServices_1.OpcUaRestServices.executeBatchRequest();
                return { enumValueNodesResult, mcpEnums };
            });
        }
        /**
         * reads enum definitions for parameters
         *
         * @param {*} metaInfo
         * @returns an object with enum definitions with the parameter name as key
         * @memberof MappCockpitCommonInfoProvider
         */
        readEnumParameterDefinitions(componentParameters, metaInfo) {
            let enumParameters = {};
            // get the target model enum types
            let opcUaEnumTypes = MappCockpitCommonInfoProvider_1.getInstance().enumTypeDefinitions;
            // get the meta parameter infos
            let metaParameterInfo = MappCockpitCommonInfoProvider_1.readEnumMetaInfo(metaInfo);
            if (metaParameterInfo != undefined) {
                // get possible enum type meta items
                enumParameters = this.readEnumDefinitionsFromMetaInfo(metaParameterInfo, opcUaEnumTypes);
            }
            else {
                // without meta info we try to use the target model definitions.
                enumParameters = this.readEnumDefinitionFromTargetModel(componentParameters, opcUaEnumTypes);
            }
            return enumParameters;
        }
        /**
         * Reads the enum parameter meta info
         *
         * @private
         * @param {*} metaInfo
         * @returns
         * @memberof MappCockpitCommonInfoProvider
         */
        static readEnumMetaInfo(metaInfo) {
            let metaParameterInfo;
            if (metaInfo) {
                // If no MetaConfigConfigProps are available only use watchables
                if (metaInfo.MetaConfigConfigProps != undefined) {
                    metaParameterInfo = metaInfo.MetaConfigConfigProps.ConfigurationStructure.Childs;
                    metaParameterInfo = metaParameterInfo.concat(metaInfo.MetaConfigWatchables.WatchablesStructure.Childs);
                }
                else {
                    if (metaInfo.MetaConfigWatchables != undefined) {
                        metaParameterInfo = metaInfo.MetaConfigWatchables.WatchablesStructure.Childs;
                    }
                }
            }
            return metaParameterInfo;
        }
        /**
         * Reads the available enum type definitions from the meta info
         *
         * @private
         * @param {*} metaParameterInfo
         * @param {MappCockpitComponentParameterEnum[]} opcUaEnumTypes
         * @returns {*}
         * @memberof MappCockpitCommonInfoProvider
         */
        readEnumDefinitionsFromMetaInfo(metaParameterInfo, opcUaEnumTypes) {
            let enumParameters = {};
            let metaParameterUsingEnums = MappCockpitCommonInfoProvider_1.readEnumMetaDefinitions(metaParameterInfo);
            metaParameterUsingEnums.forEach((enumParameterMetaItem) => {
                let enumTypeRef = enumParameterMetaItem.TypeDef.EnumTypeRef;
                let matchingOpcUaEnumTypes = opcUaEnumTypes.filter((opcUaEnumType) => { return opcUaEnumType.browseName === enumTypeRef; });
                if (matchingOpcUaEnumTypes.length === 1) {
                    // save the matching enum type info for the parameter name
                    enumParameters[enumParameterMetaItem.Ref] = matchingOpcUaEnumTypes[0];
                }
                else {
                    console.error("MappCockpitComponentParameterInfo - No enum type found for %o %o", enumTypeRef, enumParameterMetaItem);
                }
            });
            return enumParameters;
        }
        /**
         * Reads the enum definitions contained in the meta data
         *
         * @static
         * @param {*} metaParameterInfo
         * @returns
         * @memberof MappCockpitCommonInfoProvider
         */
        static readEnumMetaDefinitions(metaParameterInfo) {
            let typeDefinitions = mappCockpitComponentMetaData_1.MappCockpitComponentMetaData.filterMetaItems(metaParameterInfo, ["Parameter", "Watchable", "Group"], (metaItemGroupOrParameter) => { return metaItemGroupOrParameter.hasOwnProperty("TypeDef"); });
            let enumTypeDefinitions = typeDefinitions.filter((typeDefinition) => { return typeDefinition.TypeDef.hasOwnProperty("EnumTypeRef"); });
            return enumTypeDefinitions;
        }
        /**
         * reads the available enum type defintions from the target model
         *
         * @private
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @param {MappCockpitComponentParameterEnum[]} opcUaEnumTypes
         * @returns {*}
         * @memberof MappCockpitCommonInfoProvider
         */
        readEnumDefinitionFromTargetModel(componentParameters, opcUaEnumTypes) {
            let enumParameters = {};
            componentParameters.forEach((componentParameter) => {
                let matchingOpcUaEnumTypes = opcUaEnumTypes.filter((opcUaEnumType) => { return opcUaEnumType.browseName === componentParameter.dataType.name; });
                if (matchingOpcUaEnumTypes.length === 1) {
                    enumParameters[componentParameter.browseName] = matchingOpcUaEnumTypes[0];
                }
            });
            return enumParameters;
        }
        /**
         * reads enum type definitions for method parameters
         *
         * @param {MappCockpitComponentMethod} method
         * @param {*} metaInfo
         * @returns
         * @memberof MappCockpitCommonInfoProvider
         */
        readMetaEnumMethodParameterDefinitions(method, metaInfo) {
            let enumParameters = {};
            let opcUaEnumTypes = MappCockpitCommonInfoProvider_1.getInstance().enumTypeDefinitions;
            if (metaInfo == undefined)
                return enumParameters;
            // get the meta parameter infos
            if (metaInfo.MetaConfigCommands == undefined)
                return enumParameters;
            let metaMethodParameterInfo = metaInfo.MetaConfigCommands.CommandsStructure.Childs;
            if (metaMethodParameterInfo) {
                // get the command meta info
                let metaCommandInfo = mappCockpitComponentMetaData_1.MappCockpitComponentMetaData.filterMetaItems(metaMethodParameterInfo, ["Command"], (command) => { return command.Ref === method.browseName; });
                // get the commands parameter info
                let metaParameterUsingEnums = mappCockpitComponentMetaData_1.MappCockpitComponentMetaData.filterMetaItems(metaCommandInfo, ["Parameter"], (metaItemGroupOrParameter) => { return metaItemGroupOrParameter.hasOwnProperty("TypeDef"); });
                // find and collect matching opcua enum type refs
                for (let i = 0; i < metaParameterUsingEnums.length; i++) {
                    const enumParameterMetaItem = metaParameterUsingEnums[i];
                    let enumTypeRef = enumParameterMetaItem.TypeDef.EnumTypeRef;
                    let matchingOpcUaEnumTypes = opcUaEnumTypes.filter((opcUaEnumType) => { return opcUaEnumType.browseName === enumTypeRef; });
                    if (matchingOpcUaEnumTypes.length > 0) {
                        // save the matching enum type info for the parameter name
                        enumParameters[enumParameterMetaItem.Ref] = matchingOpcUaEnumTypes[0];
                    }
                    else {
                        console.error("MappCockpitMethodParameterInfo - No enum type found for %o %o", enumTypeRef, enumParameterMetaItem);
                    }
                }
            }
            return enumParameters;
        }
        /**
         * browses the enum values a sjson (for older targets)
         *
         * @private
         * @static
         * @param {number} sessionId
         * @param {*} opcUaEnum
         * @memberof MappCockpitCommonInfoProvider
         */
        browseEnumValuesJson(sessionId, opcUaEnum) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let enumValuesJsonString = yield opcUaRestServices_1.OpcUaRestServices.readNodeAttribute(sessionId, opcUaEnum.nodeId, opcUaRestServices_1.OpcUaAttribute.DESCRIPTION);
                    let enumValuesJson = JSON.parse(enumValuesJsonString).enumValues.map((enumValueItem) => { return { displayName: { locale: "", text: enumValueItem.text }, value: enumValueItem.value }; });
                    opcUaEnum.enumValuesJson = enumValuesJson;
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * browses the opc ua enum node for its value definitions
         *
         * @private
         * @static
         * @param {number} sessionId
         * @param {*} opcUaEnum
         * @returns
         * @memberof MappCockpitCommonInfoProvider
         */
        browseEnumValues(sessionId, opcUaEnum) {
            return __awaiter(this, void 0, void 0, function* () {
                let enumValuesRef = undefined;
                try {
                    let enumValuesNodes = yield opcUaRestServices_1.OpcUaRestServices.browseNodes(sessionId, opcUaEnum.nodeId);
                    if (enumValuesNodes) {
                        let enumValues = enumValuesNodes.filter((enumValuesNode) => { return enumValuesNode.browseName === "EnumValues" || enumValuesNode.browseName === "EnumStrings"; });
                        if (enumValues && enumValues.length > 0) {
                            enumValuesRef = yield opcUaRestServices_1.OpcUaRestServices.readNodeAttribute(sessionId, enumValues[0].nodeId, opcUaRestServices_1.OpcUaAttribute.VALUE);
                        }
                    }
                }
                catch (error) {
                    throw error;
                }
                opcUaEnum.enumValues = enumValuesRef;
            });
        }
    };
    MappCockpitCommonInfoProvider = MappCockpitCommonInfoProvider_1 = __decorate([
        mco.role()
    ], MappCockpitCommonInfoProvider);
    exports.MappCockpitCommonInfoProvider = MappCockpitCommonInfoProvider;
});
