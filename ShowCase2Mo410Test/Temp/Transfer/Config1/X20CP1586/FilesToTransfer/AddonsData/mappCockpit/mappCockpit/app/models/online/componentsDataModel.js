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
define(["require", "exports", "../diagnostics/mappCockpitDiagnosticProvider", "./mappCockpitComponent", "../../framework/events", "../dataModelInterface", "../dataModelBase", "../../framework/property", "../../framework/command", "../diagnostics/mappCockpitCommonInfoProvider", "./mappCockpitComponentReflection", "../../common/mappCockpitConfig", "../../framework/componentHub/bindings/bindings", "../../framework/componentHub/bindings/bindingDeclarations"], function (require, exports, mappCockpitDiagnosticProvider_1, mappCockpitComponent_1, events_1, dataModelInterface_1, dataModelBase_1, property_1, command_1, mappCockpitCommonInfoProvider_1, mappCockpitComponentReflection_1, mappCockpitConfig_1, bindings_1, Binding) {
    "use strict";
    var MappCockpitComponentDataModel_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitComponentDataModel = void 0;
    let EventTraceDataLoaded = class EventTraceDataLoaded extends events_1.TypedEvent {
    };
    EventTraceDataLoaded = __decorate([
        mco.role()
    ], EventTraceDataLoaded);
    ;
    let EventComponentsUpdated = class EventComponentsUpdated extends events_1.TypedEvent {
    };
    EventComponentsUpdated = __decorate([
        mco.role()
    ], EventComponentsUpdated);
    ;
    let EventComponentParametersUpdated = class EventComponentParametersUpdated extends events_1.TypedEvent {
    };
    EventComponentParametersUpdated = __decorate([
        mco.role()
    ], EventComponentParametersUpdated);
    ;
    let EventComponentMethodsUpdated = class EventComponentMethodsUpdated extends events_1.TypedEvent {
    };
    EventComponentMethodsUpdated = __decorate([
        mco.role()
    ], EventComponentMethodsUpdated);
    ;
    let EventParameterValuesUpdated = class EventParameterValuesUpdated extends events_1.TypedEvent {
    };
    EventParameterValuesUpdated = __decorate([
        mco.role()
    ], EventParameterValuesUpdated);
    ;
    let EventModelConnection = class EventModelConnection extends events_1.TypedEvent {
    };
    EventModelConnection = __decorate([
        mco.role()
    ], EventModelConnection);
    ;
    /**
     * The class implements the main data model for mapp Cockpit.
     *
     * @class MappCockpitComponentDataModel
     */
    let MappCockpitComponentDataModel = MappCockpitComponentDataModel_1 = class MappCockpitComponentDataModel {
        /**
         * Creates an instance of MappCockpitComponentDataModel
         * @memberof MappCockpitComponentDataModel
         */
        constructor() {
            // Create a data source for the components.
            this._componentsSource = property_1.Property.create([]);
            this._userComponentsSource = property_1.Property.create([], (dataLink) => { this.requestReadUserComponents(dataLink); });
            // Holds user roles
            this._userRoles = property_1.Property.create([]);
            // specifies interval for connection observation
            this._connectionObservationInterval = 1000;
            // specefies the connection observation id
            this._connectionObservationTimerId = -1;
            // holds the current model connection state
            this._modelConnected = false;
            this._observablesChangedHandler = (sender, eventArgs) => { this.handleObservableItemsChanged(eventArgs); };
            // Initialize members
            this._mappCockpitDiagnosticProvider = new mappCockpitDiagnosticProvider_1.MappCockpitDiagnosticProvider(this);
            this._components = [];
            this._userComponents = [];
            // Create event sources
            this.eventTraceDataLoaded = new EventTraceDataLoaded();
            this.eventComponentsUpdated = new EventComponentsUpdated();
            this.eventComponentParametersUpdated = new EventComponentParametersUpdated();
            this.eventParameterValuesUpdated = new EventParameterValuesUpdated();
            this.eventComponentMethodsUpdated = new EventComponentMethodsUpdated();
            this.eventModelConnectionChanged = new EventModelConnection();
            // forward the event
            this._mappCockpitDiagnosticProvider.eventObservablesChanged.attach(this._observablesChangedHandler);
            // Create and initialize commands
            this.createCommands();
        }
        /**
         * Dispose the MappCockpitComponentDataModel
         *
         * @memberof MappCockpitComponentDataModel
         */
        dispose() {
            // detach events
            this._mappCockpitDiagnosticProvider.eventObservablesChanged.detach(this._observablesChangedHandler);
            this._mappCockpitDiagnosticProvider.dispose();
        }
        /**
         * Creates exposed commands
         *
         * @private
         * @memberof MappCockpitComponentDataModel
         */
        createCommands() {
            this._commandChangeUser = command_1.Command.create(this, this.executeCommandChangeUser());
        }
        /**
         * initializes the data model
         *
         * @memberof MappCockpitComponentDataModel
         */
        initialize() {
        }
        /**
         * Gets the trace provider
         *
         * @readonly
         * @type {MappCockpitTraceProvider}
         * @memberof MappCockpitComponentDataModel
         */
        get traceProvider() {
            return this._mappCockpitDiagnosticProvider.traceProvider;
        }
        /**
         * connects the data model to the data source
         *
         * @returns {Promise<boolean>}
         * @memberof MappCockpitComponentDataModel
         */
        connect() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this._mappCockpitDiagnosticProvider.beginSession();
                    this.createModelBindings();
                    yield this.browseComponents();
                    // after connecting successfully
                    this.startObserveModelConnection();
                    return true;
                }
                catch (error) {
                    return false;
                }
            });
        }
        /**
         * Creates bindings as providers for data used from specific widgets.
         *
         * @memberof MappCockpitComponentDataModel
         */
        createModelBindings() {
            bindings_1.Bindings.createByDecl(Binding.Components.Component.Connect, this, "connectComponent", "", true);
            bindings_1.Bindings.createByDecl(Binding.Components.Component.Disconnect, this, "disconnectComponent", "", true);
            bindings_1.Bindings.createByDecl(Binding.Components.UserComponentIds, this, "", "onUserComponentIdsUpdated", false);
            bindings_1.Bindings.createByDecl(Binding.Tools.ToolsIds, this, "", "onToolsComponentIdsUpdated", false);
        }
        /**
         * Creates component bindings as providers for data used from with e.g. specific widgets.
         *
         * @memberof MappCockpitComponentDataModel
         */
        createComponentBindings() {
            // create component binding sources
            this.components.forEach((component) => {
                component.createBindings();
            });
        }
        onUserComponentIdsUpdated(componentIds) {
            //BINDINGSOURCE: method stub supporting bindability
        }
        onToolsComponentIdsUpdated(componentIds) {
            //BINDINGSOURCE: method stub supporting bindability
        }
        connectComponent(componentId) {
            //Look for component
            let foundComponent = this.components.find(component => component.browseName == componentId);
            // connect component
            if (foundComponent != undefined) {
                foundComponent.commandConnectComponent.execute();
            }
            else {
                console.error("Component not found! Connect not possible!");
            }
        }
        disconnectComponent(componentId) {
            //Look for component
            let foundComponent = this.components.find(component => component.browseName == componentId);
            // connect component
            if (foundComponent != undefined) {
                foundComponent.commandDisconnectComponent.execute();
            }
            else {
                console.error("Component not found! Connect not possible!");
            }
        }
        get commandChangeUser() {
            return this._commandChangeUser;
        }
        /**
         * Returns the available mapp components
         *
         * @readonly
         * @type {Array<MappCockpitComponent>}
         * @memberof MappCockpitComponentDataModel
         */
        get components() {
            return this._components;
        }
        /**
         * Sets the available mapp components
         *
         * @memberof MappCockpitComponentDataModel
         */
        set components(components) {
            this._components = components;
            let toolsComponentIds = this._components.map(component => component.browseName).filter(componentId => componentId == "DriveLog");
            this.onToolsComponentIdsUpdated(toolsComponentIds);
        }
        get userComponents() {
            return this._userComponents;
        }
        set userComponents(userComponents) {
            this._userComponents = userComponents;
            this.onUserComponentsUpdated(this._userComponents);
            let userComponentIds = this._userComponents.map(component => component.browseName);
            this.onUserComponentIdsUpdated(userComponentIds);
        }
        onUserComponentsUpdated(_userComponents) {
            //BINDINGSOURCE: method stub for suppporting bindability
        }
        get componentsSource() {
            return this._componentsSource;
        }
        get userComponentsSource() {
            return this._userComponentsSource;
        }
        /**
         * Gets the current user roles
         *
         * @readonly
         * @type {string[]}
         * @memberof MappCockpitComponentDataModel
         */
        get userRoles() {
            return this._userRoles;
        }
        /**
         *
         *
         * @returns {boolean}
         * @memberof MappCockpitComponentDataModel
         */
        get writeAccess() {
            let modelHasWriteAccess = false;
            if (this.userRoles.value.length > 0) {
                // update the write access right according the current role
                modelHasWriteAccess = this.userRoles.value.some((userRole) => { return userRole === mappCockpitConfig_1.MappCockpitConfiguration.writeAccessRole; });
            }
            return modelHasWriteAccess;
        }
        /**
         * Clears the data model
         *
         * @returns {*}
         * @memberof MappCockpitComponentDataModel
         */
        clear() {
            this.components = [];
        }
        /**
         * Browses all available resources and updates the model
         *
         * @returns {*}
         * @memberof MappCockpitComponentDataModel
         */
        browseComponents() {
            return __awaiter(this, void 0, void 0, function* () {
                // Update components in model
                this.components = yield this._mappCockpitDiagnosticProvider.componentProvider.browseComponents();
                // update the components meta data
                yield this.updateComponentMetaData();
                // filter and update the user components
                this.userComponents = MappCockpitComponentDataModel_1.retrieveUserComponents(this.components);
                // Connect to model
                this.connectComponentsToModel();
                this.componentsSource.value = this.components;
                return this.components;
            });
        }
        /**
         * Connects the components to the maon data model
         *
         * @private
         * @memberof MappCockpitComponentDataModel
         */
        connectComponentsToModel() {
            this.components.forEach((component) => { component.model = this; });
        }
        /**
         * Updates the components meta data
         *
         * @private
         * @memberof MappCockpitComponentDataModel
         */
        updateComponentMetaData() {
            return __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < this.components.length; i++) {
                    yield this.browseMetaInfo(this.components[i]);
                }
            });
        }
        /**
         * Reads the available user components
         *
         * @private
         * @param {Property<MappCockpitComponent[]>} dataLink
         * @returns {Promise<MappCockpitComponent[]>}
         * @memberof MappCockpitComponentDataModel
         */
        requestReadUserComponents(dataLink) {
            return __awaiter(this, void 0, void 0, function* () {
                let userComponents = [];
                try {
                    // filter components to be exposed to the user
                    userComponents = MappCockpitComponentDataModel_1.retrieveUserComponents(this.components);
                    // submit user components
                    dataLink.readRequestExecuted(userComponents);
                }
                catch (error) {
                    console.error(error);
                    dataLink.readRequestRejected(error);
                }
                return userComponents;
            });
        }
        /**
         * Retrieves the user components from the available components
         *
         * @private
         * @param {MappCockpitComponent[]} components
         * @returns
         * @memberof MappCockpitComponentDataModel
         */
        static retrieveUserComponents(components) {
            let userComponents = components.filter((component) => { return component.metaData; });
            userComponents.forEach((component) => { mappCockpitComponent_1.MappCockpitComponent.registerUserComponent(component); });
            return userComponents;
        }
        /**
         * browses the meta data, parameters and methods of a single component
         *
         * @private
         * @param {MappCockpitComponent} mappCockpitComponent
         * @memberof MappCockpitComponentDataModel
         */
        browseComponent(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                // service channel must be loaded before parameters
                yield this.browseServiceChannel(mappCockpitComponent);
                yield this.browseParameters(mappCockpitComponent);
                yield this.browseMethods(mappCockpitComponent);
                console.log("MappCockpitComponentDataModel.browseComponent: %o", mappCockpitComponent);
            });
        }
        /**
         * Called after components update
         *
         * @param {MappCockpitComponent[]} mappCockpitComponents
         * @returns {*}
         * @memberof MappCockpitComponentDataModel
         */
        onComponentsUpdated(mappCockpitComponents) {
            this.eventComponentsUpdated.raise(this, mappCockpitComponents);
        }
        /**
           * browses the meta info for a component
         *
         * @param {MappCockpitComponent} mappCockpitComponent
         * @returns {Promise<any>}
         * @memberof MappCockpitComponentDataModel
         */
        browseMetaInfo(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Update components in model
                    let metaInfoReferences = yield this._mappCockpitDiagnosticProvider.browseMetaInfo(mappCockpitComponent);
                    if (metaInfoReferences) {
                        mappCockpitComponent.metaData = this.readMetaData(metaInfoReferences);
                    }
                }
                catch (e) {
                    console.error(e.message);
                }
                return mappCockpitComponent.metaData;
            });
        }
        /**
         * Browses available component parameters
         *
         * @returns {Promise<void>}
         * @memberof MappCockpitComponentDataModel
         */
        browseParameters(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                // Update components in model
                mappCockpitComponent.parameters = yield this._mappCockpitDiagnosticProvider.browseParameters(mappCockpitComponent);
                // retrieve and update user parameters
                yield this.retrieveUserParameters(mappCockpitComponent);
                return mappCockpitComponent.parameters;
            });
        }
        /**
         * Browses and updates the methods input parameters
         *
         * @param {MappCockpitComponentMethod} mappCockpitComponentMethod
         * @returns {Promise<MappCockpitMethodParameter[]>}
         * @memberof MappCockpitComponentDataModel
         */
        browseMethodInputParameters(mappCockpitComponentMethod) {
            return __awaiter(this, void 0, void 0, function* () {
                // browse and update the methods parameters
                yield this._mappCockpitDiagnosticProvider.browseMethodParameters([mappCockpitComponentMethod]);
                // update the parameter data types
                yield this._mappCockpitDiagnosticProvider.updateMethodParameterDataTypes([mappCockpitComponentMethod]);
                return mappCockpitComponentMethod.inputParameters;
            });
        }
        /**
         * Retrieves the component parameters relevant for the user. They are specified by meta data
         *
         * @private
         * @param {MappCockpitComponent} mappCockpitComponent
         * @memberof MappCockpitComponentDataModel
         */
        retrieveUserParameters(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                let watchableMetaConfig = ['MetaConfigWatchables', 'WatchablesStructure', 'Watchable'];
                let watchableStateMetaConfig = ['MetaConfigWatchablesStates', 'WatchablesStatesStructure', 'WatchableState'];
                mappCockpitComponent.messageParameters = mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.retrieveMessageParameters(mappCockpitComponent.parameters);
                if (mappCockpitComponent.metaData) {
                    if (mappCockpitComponent.metaData.hasOwnProperty("Parameters") && mappCockpitComponent.metaData["Parameters"].hasOwnProperty("Watchable")) {
                        mappCockpitComponent.watchableParameters = mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.retrieveWatchableParameters(mappCockpitComponent.parameters, watchableMetaConfig);
                        if (mappCockpitComponent.watchableParameters.length > 0) {
                            yield this._mappCockpitDiagnosticProvider.updateParameterDataTypes(mappCockpitComponent.watchableParameters);
                            mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.updateParameter(mappCockpitComponent.watchableParameters, mappCockpitComponent.metaData["Parameters"]["Watchable"]);
                        }
                    }
                    if (mappCockpitComponent.metaData.hasOwnProperty("Parameters") && mappCockpitComponent.metaData["Parameters"].hasOwnProperty("Configuration")) {
                        mappCockpitComponent.configurationParameters = mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.retrieveConfigurationParameters(mappCockpitComponent.parameters);
                        if (mappCockpitComponent.configurationParameters.length > 0) {
                            yield this._mappCockpitDiagnosticProvider.updateParameterDataTypes(mappCockpitComponent.configurationParameters);
                            mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.updateParameter(mappCockpitComponent.configurationParameters, mappCockpitComponent.metaData["Parameters"]["Configuration"]);
                        }
                    }
                    if (mappCockpitComponent.metaData.hasOwnProperty("Parameters") && mappCockpitComponent.metaData["Parameters"].hasOwnProperty("WatchableState") && mappCockpitComponent.watchableParameters.length > 0) {
                        mappCockpitComponent.watchableStateParameters = mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.retrieveWatchableStates(mappCockpitComponent.watchableParameters, watchableStateMetaConfig);
                    }
                }
            });
        }
        /**
         * writes the value to component parameter
         *
         * @param {MappCockpitComponentParameter} parameter
         * @memberof MappCockpitComponentDataModel
         */
        writeComponentParameter(parameter) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this._mappCockpitDiagnosticProvider.writeParameterValue(parameter, parameter.value);
            });
        }
        /**
         * browses the component methods
         *
         * @param {MappCockpitComponent} mappCockpitComponent
         * @returns {Promise<MappCockpitComponentMethod[]>}
         * @memberof MappCockpitComponentDataModel
         */
        browseMethods(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                let methodsMetaConfig = ['MetaConfigCommands', 'CommandsStructure', 'Command'];
                let quickCommandsMetaConfig = ['MetaConfigQuickCommands', 'QuickCommandsStructure', 'QuickCommand'];
                // Update component methods in model
                mappCockpitComponent.methods = yield this._mappCockpitDiagnosticProvider.browseMethods(mappCockpitComponent);
                // filter the methods to the ones specefied by meta info
                mappCockpitComponent.userMethods = mappCockpitComponentReflection_1.MappCockpitComponentMethodInfo.retrieveExecutableMethods(mappCockpitComponent.methods, methodsMetaConfig);
                mappCockpitComponent.quickCommands = mappCockpitComponentReflection_1.MappCockpitComponentMethodInfo.retrieveQuickCommands(mappCockpitComponent.methods, quickCommandsMetaConfig);
                return mappCockpitComponent.methods;
            });
        }
        /**
         * Browses for the service channel and connects it if available
         *
         * @param {MappCockpitComponent} mappCockpitComponent
         * @returns {Promise<any>}
         * @memberof MappCockpitComponentDataModel
         */
        browseServiceChannel(mappCockpitComponent) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                // browse the service channel
                mappCockpitComponent.serviceChannel = yield this._mappCockpitDiagnosticProvider.browseServiceChannel(mappCockpitComponent);
                // initialize service channel  if available.
                if (mappCockpitComponent.serviceChannel) {
                    // update the request methods input parameters
                    yield this.browseMethodInputParameters((_a = mappCockpitComponent.serviceChannel) === null || _a === void 0 ? void 0 : _a.request);
                    if (mappCockpitComponent.serviceChannel) {
                        mappCockpitComponent.serviceChannel.initialize();
                    }
                }
                return mappCockpitComponent.serviceChannel;
            });
        }
        /**
         * Retrieves the methods relevant for the user. They are specified by meta data
         *
         * @private
         * @param {MappCockpitComponent} mappCockpitComponent
         * @param {*} componentMethods
         * @memberof MappCockpitComponentDataModel
         */
        retrieveUserMethods(mappCockpitComponent, componentMethods) {
            let userMethods = [];
            if (mappCockpitComponent.metaData && mappCockpitComponent.metaData.hasOwnProperty("Methods") && mappCockpitComponent.metaData["Methods"].hasOwnProperty("Executable")) {
                let methodsMeta = mappCockpitComponent.metaData["Methods"]["Executable"];
                userMethods = componentMethods.filter((method) => { return methodsMeta[method.browseName]; });
            }
            return userMethods;
        }
        /**
         * reads the meta infos into a single object
         *
         * @private
         * @param {Array<string>} metaParameters
         * @returns
         * @memberof MappCockpitComponentDataModel
         */
        readMetaData(metaParameters) {
            let metaData = {};
            try {
                metaParameters.forEach((metaParameter) => {
                    if (metaParameter.value == "") { // Fallback: Use empty object in case of empty metaInfo
                        metaParameter.value = "{}";
                    }
                    //Just for prototype: Enable/Disable of methods
                    // if (metaParameter.nodeId == "ns=5;s=gAxis1.MetaConfigCommands") {
                    //     metaParameter.value = '{"CommandsStructure":{"Scope":"mapp/Motion/Axis/AcpAxis","Childs":[{"Group":{"DisplayName":"Preparation","Childs":[{"Command":{"DisplayName":"Power on","Ref":"Power On","WatchableVariablesMapping":[["Is Powered","Is_Powered"]],"EnableStateExpression":"Is_Powered == false ? true : false"}},{"Command":{"DisplayName":"Power off","Ref":"Power Off","WatchableVariablesMapping":[["Is Powered","Is_Powered"]],"EnableStateExpression":"Is_Powered == true ? true : false"}},{"Command":{"DisplayName":"Init home","Ref":"Init Home","Parameters":[{"Parameter":{"DisplayName":"Homing mode","Ref":"Homing Mode","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::InitHomeReduced"}}},{"Parameter":{"DisplayName":"Position","Ref":"Position","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Start velocity","Ref":"Start Velocity","DefaultValue":"0.0","EU":"mm/s"}},{"Parameter":{"DisplayName":"Homing velocity","Ref":"Homing Velocity","DefaultValue":"0.0","EU":"mm/s"}},{"Parameter":{"DisplayName":"Acceleration","Ref":"Acceleration","DefaultValue":"0.0","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Switch edge","Ref":"SwitchEdge","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::InitHomeDirection"}}},{"Parameter":{"DisplayName":"Start direction","Ref":"Start Direction","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::InitHomeDirection"}}},{"Parameter":{"DisplayName":"Homing direction","Ref":"Homing Direction","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::InitHomeDirection"}}},{"Parameter":{"DisplayName":"Reference pulse","Ref":"Reference Pulse","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::Switch"}}},{"Parameter":{"DisplayName":"Keep direction","Ref":"Keep Direction","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::Switch"}}},{"Parameter":{"DisplayName":"Reference pulse blocking distance","Ref":"Reference Pulse Blocking Distance","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Torque limit","Ref":"Torque Limit","DefaultValue":"0.0","EU":"N·m"}},{"Parameter":{"DisplayName":"Block detection position error","Ref":"Block Detection Position Error","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Position error stop limit","Ref":"Position Error Stop Limit","DefaultValue":"0.0","EU":"mm"}}]}},{"Command":{"DisplayName":"Home","Ref":"Home","Parameters":[{"Parameter":{"DisplayName":"Position","Ref":"Position","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Homing mode","Ref":"Homing Mode","DefaultValue":"140","TypeDef":{"EnumTypeRef":"AcpAx::HomingReduced"}}}]}}]}},{"Group":{"DisplayName":"Administration","Childs":[{"Command":{"DisplayName":"Reset","Ref":"Reset"}},{"Command":{"DisplayName":"Set override","Ref":"Set Override","Parameters":[{"Parameter":{"DisplayName":"Velocity factor","Ref":"Velocity Factor","DefaultValue":"1.0"}},{"Parameter":{"DisplayName":"Acceleration factor","Ref":"Acceleration Factor","DefaultValue":"1.0"}}]}},{"Command":{"DisplayName":"Command error","Ref":"CommandError","Parameters":[{"Parameter":{"DisplayName":"Command","Ref":"Command","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::CommandErrors"}}}]}},{"Command":{"DisplayName":"Read ParID","Ref":"Read ParId","Parameters":[{"Parameter":{"DisplayName":"ParID","Ref":"ParId","DefaultValue":"0"}}]}},{"Command":{"DisplayName":"Write ParID","Ref":"Write ParId","Parameters":[{"Parameter":{"DisplayName":"ParID","Ref":"ParId","DefaultValue":"0"}},{"Parameter":{"DisplayName":"Value","Ref":"Value","DefaultValue":"0"}}]}}]}},{"Group":{"DisplayName":"Movement","Childs":[{"Command":{"DisplayName":"Move absolute","Ref":"Move Absolute","Parameters":[{"Parameter":{"DisplayName":"Position","Ref":"Position","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Velocity","Ref":"Velocity","DefaultValue":"2","EU":"mm/s"}},{"Parameter":{"DisplayName":"Acceleration","Ref":"Acceleration","DefaultValue":"10","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Deceleration","Ref":"Deceleration","DefaultValue":"10","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Direction","Ref":"Direction","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::MoveAbsDirection"}}}]}},{"Command":{"DisplayName":"Move additive","Ref":"Move Additive","Parameters":[{"Parameter":{"DisplayName":"Distance","Ref":"Distance","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Velocity","Ref":"Velocity","DefaultValue":"2","EU":"mm/s"}},{"Parameter":{"DisplayName":"Acceleration","Ref":"Acceleration","DefaultValue":"10","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Deceleration","Ref":"Deceleration","DefaultValue":"10","EU":"mm/s²"}}]}},{"Command":{"DisplayName":"Move velocity","Ref":"Move Velocity","Parameters":[{"Parameter":{"DisplayName":"Velocity","Ref":"Velocity","DefaultValue":"2","EU":"mm/s"}},{"Parameter":{"DisplayName":"Acceleration","Ref":"Acceleration","DefaultValue":"10","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Deceleration","Ref":"Deceleration","DefaultValue":"10","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Direction","Ref":"Direction","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::MoveVeloDirection"}}}]}},{"Command":{"DisplayName":"Gear in","Ref":"Gear In","Parameters":[{"Parameter":{"DisplayName":"Master","Ref":"Master","DefaultValue":""}},{"Parameter":{"DisplayName":"Ratio numerator","Ref":"Ratio Numerator","DefaultValue":"0.0"}},{"Parameter":{"DisplayName":"Ratio denominator","Ref":"Ratio Denominator","DefaultValue":"0.0"}},{"Parameter":{"DisplayName":"Master value source","Ref":"Master Value Source","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::ValueSource"}}},{"Parameter":{"DisplayName":"Acceleration","Ref":"Acceleration","DefaultValue":"0.0","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Deceleration","Ref":"Deceleration","DefaultValue":"0.0","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Master max velocity","Ref":"Master Max Velocity","DefaultValue":"0.0","EU":"mm/s"}}]}},{"Command":{"DisplayName":"Cam in","Ref":"CamIn","Parameters":[{"Parameter":{"DisplayName":"Master","Ref":"Master","DefaultValue":""}},{"Parameter":{"DisplayName":"Master offset","Ref":"MasterOffset","DefaultValue":"0.0","EU":"mm/s"}},{"Parameter":{"DisplayName":"Slave offset","Ref":"SlaveOffset","DefaultValue":"0.0","EU":"mm/s"}},{"Parameter":{"DisplayName":"Master scaling","Ref":"MasterScaling","DefaultValue":"0"}},{"Parameter":{"DisplayName":"Slave scaling","Ref":"SlaveScaling","DefaultValue":"0"}},{"Parameter":{"DisplayName":"Start mode","Ref":"StartMode","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::CamStartMode"}}},{"Parameter":{"DisplayName":"Master value source","Ref":"MasterValueSource","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::ValueSourceCamIn"}}},{"Parameter":{"DisplayName":"Cam ID","Ref":"CamID","DefaultValue":"65535"}},{"Parameter":{"DisplayName":"Periodic","Ref":"Periodic","DefaultValue":"0"}},{"Parameter":{"DisplayName":"Velocity","Ref":"Velocity","DefaultValue":"0.0","EU":"mm/s"}},{"Parameter":{"DisplayName":"Acceleration","Ref":"Acceleration","DefaultValue":"0.0","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Deceleration","Ref":"Deceleration","DefaultValue":"0.0","EU":"mm/s²"}}]}},{"Command":{"DisplayName":"Torque control","Ref":"Torque Control","Parameters":[{"Parameter":{"DisplayName":"Torque","Ref":"Torque","DefaultValue":"0.0","EU":"N·m"}},{"Parameter":{"DisplayName":"Torque ramp","Ref":"Torque Ramp","DefaultValue":"0.0","EU":"N·m/s"}},{"Parameter":{"DisplayName":"Velocity","Ref":"Velocity","DefaultValue":"0.0","EU":"mm/s"}},{"Parameter":{"DisplayName":"Acceleration","Ref":"Acceleration","DefaultValue":"0.0","EU":"mm/s²"}}]}},{"Command":{"DisplayName":"Brake operation","Ref":"Brake Operation","Parameters":[{"Parameter":{"DisplayName":"Command","Ref":"Command","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::BrakeCommand"}}}]}},{"Command":{"DisplayName":"Halt","Ref":"Halt","Parameters":[{"Parameter":{"DisplayName":"Deceleration","Ref":"Deceleration","DefaultValue":"10","EU":"mm/s²"}}]}}]}},{"Group":{"DisplayName":"Load simulation","Childs":[{"Command":{"DisplayName":"Load simulation command","Ref":"Load Simulation Command","Parameters":[{"Parameter":{"DisplayName":"Command","Ref":"Command","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::SimulationCommand"}}}]}},{"Command":{"DisplayName":"Load simulation set params auto","Ref":"Load Simulation Set Params Auto","Parameters":[{"Parameter":{"DisplayName":"Additive load ParID","Ref":"Additive Load ParId","DefaultValue":"0"}}]}},{"Command":{"DisplayName":"Load simulation set params one mass","Ref":"Load Simulation Set Params One Mass","Parameters":[{"Parameter":{"DisplayName":"Additive load ParID","Ref":"Additive Load ParId","DefaultValue":"0"}},{"Parameter":{"DisplayName":"Inertia","Ref":"Inertia","DefaultValue":"0.0","EU":"kg·m²"}},{"Parameter":{"DisplayName":"Static friction","Ref":"Static Friction","DefaultValue":"0.0","EU":"N·m"}},{"Parameter":{"DisplayName":"Viscous friction","Ref":"Viscous Friction","DefaultValue":"0.0","EU":"N·m·s"}}]}},{"Command":{"DisplayName":"Load simulation set params two masses","Ref":"Load Simulation Set Params Two Masses","Parameters":[{"Parameter":{"DisplayName":"Additive load ParID","Ref":"Additive Load ParId","DefaultValue":"0"}},{"Parameter":{"DisplayName":"Inertia M1","Ref":"Inertia M1","DefaultValue":"0.0","EU":"kg·m²"}},{"Parameter":{"DisplayName":"Static friction M1","Ref":"Static Friction M1","DefaultValue":"0.0","EU":"N·m"}},{"Parameter":{"DisplayName":"Viscous friction M1","Ref":"Viscous Friction M1","DefaultValue":"0.0","EU":"N·m·s"}},{"Parameter":{"DisplayName":"Inertia M2","Ref":"Inertia M2","DefaultValue":"0.0","EU":"kg·m²"}},{"Parameter":{"DisplayName":"Static friction M2","Ref":"Static Friction M2","DefaultValue":"0.0","EU":"N·m"}},{"Parameter":{"DisplayName":"Viscous friction M2","Ref":"Viscous Friction M2","DefaultValue":"0.0","EU":"N·m·s"}},{"Parameter":{"DisplayName":"Stiffness","Ref":"Stiffness","DefaultValue":"0.0","EU":"N·m/rad"}},{"Parameter":{"DisplayName":"Damping","Ref":"Damping","DefaultValue":"0.0","EU":"N·m·s/rad"}}]}}]}},{"Group":{"DisplayName":"AutoTune","Childs":[{"Command":{"DisplayName":"Autotune position controller","Ref":"Auto Tune Position Controller","Parameters":[{"Parameter":{"DisplayName":"Orientation","Ref":"Orientation","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningOrientation"}}},{"Parameter":{"DisplayName":"Max current percent","Ref":"Max Current Percent","DefaultValue":"50","EU":"%"}},{"Parameter":{"DisplayName":"Max distance","Ref":"Max Distance","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Max position error","Ref":"Max Position Error","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Operating point","Ref":"Operating Point","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningOperationPoint"}}},{"Parameter":{"DisplayName":"Velocity","Ref":"Velocity","DefaultValue":"0.0","EU":"mm/s"}},{"Parameter":{"DisplayName":"Acceleration","Ref":"Acceleration","DefaultValue":"0.0","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Max proportional gain","Ref":"Max Proportional Gain","DefaultValue":"2000.0","EU":"As"}},{"Parameter":{"DisplayName":"Proportional gain percent","Ref":"Proportional Gain Percent","DefaultValue":"100.0","EU":"%"}},{"Parameter":{"DisplayName":"Signal type","Ref":"Signal Type","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningExcitationSignal"}}},{"Parameter":{"DisplayName":"Signal order","Ref":"Signal Order","DefaultValue":"9"}},{"Parameter":{"DisplayName":"Delay time","Ref":"Delay Time","DefaultValue":"0.0","EU":"s"}},{"Parameter":{"DisplayName":"Signal start frequency","Ref":"Signal Start Frequency","DefaultValue":"0.0","EU":"Hz"}},{"Parameter":{"DisplayName":"Signal stop frequency","Ref":"Signal Stop Frequency","DefaultValue":"0.0","EU":"Hz"}},{"Parameter":{"DisplayName":"Signal time","Ref":"Signal Time","DefaultValue":"0.0","EU":"s"}}]}},{"Command":{"DisplayName":"Autotune speed controller","Ref":"Auto Tune Speed Controller","Parameters":[{"Parameter":{"DisplayName":"Orientation","Ref":"Orientation","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningOrientation"}}},{"Parameter":{"DisplayName":"Max current percent","Ref":"Max Current Percent","DefaultValue":"50","EU":"%"}},{"Parameter":{"DisplayName":"Max distance","Ref":"Max Distance","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Max position error","Ref":"Max Position Error","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Loop filter1 mode","Ref":"Loop Filter1 Mode","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningLoopFilterMode"}}},{"Parameter":{"DisplayName":"Filter time mode","Ref":"Filter Time Mode","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningFilterTimeMode"}}},{"Parameter":{"DisplayName":"Integration time mode","Ref":"Integration Time Mode","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningIntegrationTimeMode"}}},{"Parameter":{"DisplayName":"Operating point","Ref":"Operating Point","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningOperationPoint"}}},{"Parameter":{"DisplayName":"Velocity","Ref":"Velocity","DefaultValue":"0.0","EU":"mm/s"}},{"Parameter":{"DisplayName":"Acceleration","Ref":"Acceleration","DefaultValue":"0.0","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Max proportional gain","Ref":"Max Proportional Gain","DefaultValue":"2000.0","EU":"As"}},{"Parameter":{"DisplayName":"Proportional gain percent","Ref":"Proportional Gain Percent","DefaultValue":"100.0","EU":"%"}},{"Parameter":{"DisplayName":"Resonance factor","Ref":"Resonance Factor","DefaultValue":"2.0"}},{"Parameter":{"DisplayName":"Inertia estimation lower frequency","Ref":"Inertia Estimation Lower Frequency","DefaultValue":"10.0","EU":"Hz"}},{"Parameter":{"DisplayName":"Inertia estimation upper frequency","Ref":"Inertia Estimation Upper Frequency","DefaultValue":"40.0","EU":"Hz"}},{"Parameter":{"DisplayName":"Signal type","Ref":"Signal Type","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningExcitationSignal"}}},{"Parameter":{"DisplayName":"Signal order","Ref":"Signal Order","DefaultValue":"9"}},{"Parameter":{"DisplayName":"Delay time","Ref":"Delay Time","DefaultValue":"0.0","EU":"s"}},{"Parameter":{"DisplayName":"Signal start frequency","Ref":"Signal Start Frequency","DefaultValue":"0.0","EU":"Hz"}},{"Parameter":{"DisplayName":"Signal stop frequency","Ref":"Signal Stop Frequency","DefaultValue":"0.0","EU":"Hz"}},{"Parameter":{"DisplayName":"Signal time","Ref":"Signal Time","DefaultValue":"0.0","EU":"s"}}]}},{"Command":{"DisplayName":"Autotune feed forward","Ref":"Auto Tune Feed Forward","Parameters":[{"Parameter":{"DisplayName":"Direction","Ref":"Direction","DefaultValue":"0","TypeDef":{"EnumTypeRef":"Axis::Direction"}}},{"Parameter":{"DisplayName":"Orientation","Ref":"Orientation","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningOrientation"}}},{"Parameter":{"DisplayName":"Max distance","Ref":"Max Distance","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Max position error","Ref":"Max Position Error","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Velocity","Ref":"Velocity","DefaultValue":"0.0","EU":"mm/s"}},{"Parameter":{"DisplayName":"Acceleration","Ref":"Acceleration","DefaultValue":"0.0","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Max current percentage","Ref":"Max Current Percentage","DefaultValue":"50","EU":"%"}},{"Parameter":{"DisplayName":"Max velocity percentage","Ref":"Max Velocity Percentage","DefaultValue":"50","EU":"%"}},{"Parameter":{"DisplayName":"Signal type","Ref":"Signal Type","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningExcitationSignal"}}},{"Parameter":{"DisplayName":"Signal order","Ref":"Signal Order","DefaultValue":"9"}},{"Parameter":{"DisplayName":"Delay time","Ref":"Delay Time","DefaultValue":"0.0","EU":"s"}},{"Parameter":{"DisplayName":"Signal start frequency","Ref":"Signal Start Frequency","DefaultValue":"0.0","EU":"Hz"}},{"Parameter":{"DisplayName":"Signal stop frequency","Ref":"Signal Stop Frequency","DefaultValue":"0.0","EU":"Hz"}},{"Parameter":{"DisplayName":"Signal time","Ref":"Signal Time","DefaultValue":"0.0","EU":"s"}}]}},{"Command":{"DisplayName":"Autotune loop filters","Ref":"Auto Tune Loop Filters","Parameters":[{"Parameter":{"DisplayName":"Loop filter 1 mode","Ref":"Loop Filter1 Mode","DefaultValue":"1","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningLoopFilterMode"}}},{"Parameter":{"DisplayName":"Loop filter 2 mode","Ref":"Loop Filter2 Mode","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningLoopFilterMode"}}},{"Parameter":{"DisplayName":"Loop filter 3 mode","Ref":"Loop Filter3 Mode","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningLoopFilterMode"}}},{"Parameter":{"DisplayName":"Orientation","Ref":"Orientation","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningOrientation"}}},{"Parameter":{"DisplayName":"Max current percent","Ref":"Max Current Percent","DefaultValue":"50","EU":"%"}},{"Parameter":{"DisplayName":"Max distance","Ref":"Max Distance","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Max position error","Ref":"Max Position Error","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Operating point","Ref":"Operating Point","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningOperationPoint"}}},{"Parameter":{"DisplayName":"Velocity","Ref":"Velocity","DefaultValue":"0.0","EU":"mm/s"}},{"Parameter":{"DisplayName":"Acceleration","Ref":"Acceleration","DefaultValue":"0.0","EU":"mm/s²"}},{"Parameter":{"DisplayName":"Resonance factor","Ref":"Resonance Factor","DefaultValue":"2"}},{"Parameter":{"DisplayName":"Signal type","Ref":"Signal Type","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningExcitationSignal"}}},{"Parameter":{"DisplayName":"Signal order","Ref":"Signal Order","DefaultValue":"9"}},{"Parameter":{"DisplayName":"Delay time","Ref":"Delay Time","DefaultValue":"0.0","EU":"s"}},{"Parameter":{"DisplayName":"Signal start frequency","Ref":"Signal Start Frequency","DefaultValue":"0.0","EU":"Hz"}},{"Parameter":{"DisplayName":"Signal stop frequency","Ref":"Signal Stop Frequency","DefaultValue":"0.0","EU":"Hz"}},{"Parameter":{"DisplayName":"Signal time","Ref":"Signal Time","DefaultValue":"0.0","EU":"s"}}]}},{"Command":{"DisplayName":"Autotune test","Ref":"Auto Tune Test","Parameters":[{"Parameter":{"DisplayName":"Mode","Ref":"Mode","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningTestMode"}}},{"Parameter":{"DisplayName":"Orientation","Ref":"Orientation","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningOrientation"}}},{"Parameter":{"DisplayName":"Max current percent","Ref":"Max Current Percent","DefaultValue":"50","EU":"%"}},{"Parameter":{"DisplayName":"Max distance","Ref":"Max Distance","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Max position error","Ref":"Max Position Error","DefaultValue":"0.0","EU":"mm"}},{"Parameter":{"DisplayName":"Signal type","Ref":"Signal Type","DefaultValue":"0","TypeDef":{"EnumTypeRef":"AcpAx::AutoTuningExcitationSignal"}}},{"Parameter":{"DisplayName":"Signal order","Ref":"Signal Order","DefaultValue":"9"}},{"Parameter":{"DisplayName":"Delay time","Ref":"Delay Time","DefaultValue":"0.0","EU":"s"}},{"Parameter":{"DisplayName":"Signal start frequency","Ref":"Signal Start Frequency","DefaultValue":"0.0","EU":"Hz"}},{"Parameter":{"DisplayName":"Signal stop frequency","Ref":"Signal Stop Frequency","DefaultValue":"0.0","EU":"Hz"}},{"Parameter":{"DisplayName":"Signal time","Ref":"Signal Time","DefaultValue":"0.0","EU":"s"}}]}}]}}]}}'
                    // }
                    metaData[metaParameter.browseName] = JSON.parse(metaParameter.value);
                    //Just for prototype: watchableIcons
                    //var watchstateMetaData = '{"WatchablesStatesStructure":{"Scope":"mapp/Motion/Axis/AcpAxis","Childs":[{"Group":{"DisplayName":"Main","Childs":[{"WatchableState":{"Ref":"Axis_state","WatchableVariablesMapping":[["Communication Ready","Communication"],["PlcOpen State","PLC_State"]],"IconExpression":"Communication == false ? 1 : PLC_State == 1 ? 2 : PLC_State == 2 ? 3 : PLC_State == 3 or PLC_State == 4 or PLC_State == 5 ? 4 : PLC_State == 6 ? 5 : PLC_State == 7 ? 6 : 0","Icon":{"0":{"ImageName":"GearDisabled","Tooltip":"Axis is disabled"},"1":{"ImageName":"CommunicationNotReady","Tooltip":"Communication is not ready"},"2":{"ImageName":"GearEnabled","Tooltip":"Axis is standstill"},"3":{"ImageName":"GeneralError","Tooltip":"Axis is in error state"},"4":{"ImageName":"GearRotating","Tooltip":"Axis is moving"},"5":{"ImageName":"GearsRotating","Tooltip":"Axis is synchronized"}}}},{"WatchableState":{"Ref":"Controller_state","WatchableVariablesMapping":[["Is Powered","Is_Powered"]],"IconExpression":"Is_Powered == true ? 1 : 0","Icon":{"0":{"ImageName":"Off","Tooltip":"Controller is switched off"},"1":{"ImageName":"On","Tooltip":"Controller is switched on"}}}},{"WatchableState":{"Ref":"Axis_reference_state","WatchableVariablesMapping":[["Is Homed","Is_Homed"],["PlcOpen State","PLC_State"]],"IconExpression":"Is_Homed == true ? 1 : PLC_State == 7 ? 2: 0","Icon":{"0":{"ImageName":"UnkownPosition","Tooltip":"Axis is not homed"},"1":{"ImageName":"KnownPosition","Tooltip":"Axis is homed"},"2":{"ImageName":"FindingPosition","Tooltip":"Axis is homing"}}}}]}}]}}'; 
                    //metaData['MetaConfigWatchablesStates'] = JSON.parse(watchstateMetaData);
                    //Just for prototype: quickCommands
                    // var quickMethod = ' {"QuickCommandsStructure":{"Scope":"mapp/Motion/Axis/AcpAxis","Childs":[{"Group":{"DisplayName":"Main","Childs":[{"QuickCommand":{"Ref":"Power On","Tooltip":"Power on","ImageName":"On"}},{"QuickCommand":{"Ref":"Power Off","Tooltip":"Power off","ImageName":"Off"}},{"QuickCommand":{"Ref":"Abort Command","Tooltip":"Abort command","ImageName":"Stop"}},{"QuickCommand":{"Ref":"Reset","Tooltip":"Reset","ImageName":"Reset"}}]}}]}} '
                    // metaData['MetaConfigQuickCommands'] = JSON.parse(quickMethod);
                });
                // update specific parameter types in meta data object
                mappCockpitCommonInfoProvider_1.MappCockpitCommonInfoProvider.initializeMetaData(metaData);
            }
            catch (e) {
                throw new Error("MappCockpitComponentDataModel.browseMetaData: could not parse meta data: " + e.message);
            }
            return metaData;
        }
        executeComponentMethod(componentMethod) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._mappCockpitDiagnosticProvider.executeComponentMethod(componentMethod);
            });
        }
        /**
         * called after component parameters have been updated
         *
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @returns {*}
         * @memberof MappCockpitComponentDataModel
         */
        // Obsolete because components can't be updated at runtime
        /*onComponentParametersUpdated(component: MappCockpitComponent, componentParameters: MappCockpitComponentParameter[]): any {
            this.eventComponentParametersUpdated.raise(this, new EventModelChangedArgs(this, ModelChangeType.updateTarget, "updatedComponentParameters", componentParameters));
        }*/
        /**
         * called after component methods have been updated
         *
         * @param {MappCockpitComponent} component
         * @param {MappCockpitComponentParameter[]} componentMethods
         * @returns {*}
         * @memberof MappCockpitComponentDataModel
         */
        // Obsolete because components can't be updated at runtime
        /*onComponentMethodsUpdated(component: MappCockpitComponent, componentMethods: MappCockpitComponentMethod[]): any {
            this.eventComponentMethodsUpdated.raise(this, new EventModelChangedArgs(this, ModelChangeType.updateTarget, "updatedComponentMethods", componentMethods));
        }*/
        /**
         * reads  and updates the parameter values of the specified parameter list
         *
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @returns {*}
         * @memberof MappCockpitComponentDataModel
         */
        readParameterValues(componentParameters) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this._mappCockpitDiagnosticProvider.readParameterValues(componentParameters);
                this.onParameterValuesUpdated(componentParameters);
            });
        }
        /**
         * observes the parameters for value changes
         *
         * @param {IObserver} observer
         * @param {MappCockpitComponentItem[]} observableDataModelItems
         * @returns {Promise<any>}
         * @memberof MappCockpitComponentDataModel
         */
        observeDataModelItems(observer, observableDataModelItems) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this._mappCockpitDiagnosticProvider.observeComponentModelItems(observer, observableDataModelItems);
            });
        }
        /**
         * Unobserves the passed parameters.
         *
         * @param {*} observer
         * @param {MappCockpitComponentParameter[]} observableParameters
         * @param {boolean} suspend
         * @memberof MappCockpitComponentDataModel
         */
        unobserveComponentModelItems(observer, observableParameters, suspend) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this._mappCockpitDiagnosticProvider.unobserveComponentModelItems(observer, observableParameters, suspend);
            });
        }
        /**
         * handles observable changed notifications
         *
         * @private
         * @param {EventObservedItemsChangedArgs} eventArgs
         * @memberof MappCockpitComponentDataModel
         */
        handleObservableItemsChanged(eventArgs) {
            if (eventArgs.observer instanceof dataModelBase_1.DataModelBase) {
                // create model changed args
                let modelItemsChangedArgs = new dataModelInterface_1.EventModelChangedArgs(eventArgs.observer, dataModelInterface_1.ModelChangeType.updateTarget, "changed observables", eventArgs.changedItems);
                // notify observers from changing model items
                eventArgs.observer.onModelItemsChanged(eventArgs.observer, modelItemsChangedArgs);
            }
        }
        /**
         * notify from updating the specified parameters values
         *
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @returns {*}
         * @memberof MappCockpitComponentDataModel
         */
        onParameterValuesUpdated(componentParameters) {
            this.eventParameterValuesUpdated.raise(this, componentParameters);
        }
        /**
         * Called when the model has been successfully connected
         *
         * @private
         * @memberof MappCockpitComponentDataModel
         */
        onModelConnected() {
            this._modelConnected = true;
            this.onModelConnectionChanged(this._modelConnected);
        }
        /**
         * Called when the model has lost the connection to the target
         *
         * @private
         * @memberof MappCockpitComponentDataModel
         */
        onModelDisconnected() {
            // notify connection change
            this._modelConnected = false;
            this.onModelConnectionChanged(this._modelConnected);
        }
        /**
         * Observes the connection if it is still alive
         *
         * @returns {*}
         * @memberof MappCockpitComponentDataModel
         */
        startObserveModelConnection() {
            // initially notify the successfull connection
            this.onModelConnected();
            // establish a timer for watching the connection
            if (this._connectionObservationTimerId == -1) {
                this._connectionObservationTimerId = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.observeModelConnection();
                }), this._connectionObservationInterval);
            }
        }
        /**
         * Obsereves the model connection
         *
         * @returns {*}
         * @memberof MappCockpitComponentDataModel
         */
        observeModelConnection() {
            return __awaiter(this, void 0, void 0, function* () {
                // read the connection state
                let isConnected = yield this._mappCockpitDiagnosticProvider.checkTargetConnection();
                if (isConnected) {
                    if (!this._modelConnected) {
                        this.onModelConnected();
                    }
                }
                else {
                    if (this._modelConnected) {
                        this.onModelDisconnected();
                    }
                }
            });
        }
        /**
         * Called when the model connection has changed
         *
         * @param {boolean} connected
         * @returns {*}
         * @memberof MappCockpitComponentDataModel
         */
        onModelConnectionChanged(connected) {
            this.eventModelConnectionChanged.raise(this, connected);
        }
        /**
         * Provides command for changing the user to be logged in
         *
         * @returns {ICommandExecutionDelegate<any,any>}
         * @memberof MappCockpitComponentDataModel
         */
        executeCommandChangeUser() {
            return (userInfo, commandResponse) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // update the user roles
                    this._userRoles.value = (yield this._mappCockpitDiagnosticProvider.changeUser(userInfo));
                    commandResponse.executed(this._userRoles);
                }
                catch (error) {
                    commandResponse.rejected(error);
                }
            });
        }
    };
    MappCockpitComponentDataModel = MappCockpitComponentDataModel_1 = __decorate([
        mco.role()
    ], MappCockpitComponentDataModel);
    exports.MappCockpitComponentDataModel = MappCockpitComponentDataModel;
});
