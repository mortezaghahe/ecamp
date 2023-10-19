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
define(["require", "exports", "../../framework/property", "../../framework/command", "./mappCockpitComponentReflection", "../../common/numericHelper", "../../widgets/methodParameterListWidget/parameterFilter", "../common/stateExpression/watchableStateExpression", "../../common/componentBase/componentContext", "../../common/componentBase/contextIds/contextIdsComponent", "../../framework/componentHub/bindings/bindingDeclarations", "../../framework/componentHub/bindings/bindings"], function (require, exports, property_1, command_1, mappCockpitComponentReflection_1, numericHelper_1, parameterFilter_1, watchableStateExpression_1, componentContext_1, contextIdsComponent_1, Binding, bindings_1) {
    "use strict";
    var MappCockpitComponentParameter_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitComponentItem = exports.MappCockpitMethodParameter = exports.MappCockpitComponentMethod = exports.MappCockpitComponentParameterEnumValue = exports.MappCockpitComponentParameterEnum = exports.MappCockpitParameterDataType = exports.MappCockpitQuickCommandParameter = exports.MappCockpitStateParameter = exports.MappCockpitComponentParameter = exports.MappCockpitComponent = void 0;
    /**
     * Implements the base members for managing component model members.
     *
     * @class MappCockpitComponentItem
     */
    let MappCockpitComponentItem = class MappCockpitComponentItem {
        /**
         * creates an instance of MappCockpitComponentItem.
         * @param {MappCockpitComponentItem} component
         * @param {string} name
         * @param {*} reference
         * @memberof MappCockpitComponentItem
         */
        constructor(component, name, reference) {
            // Holds the items value
            // protected _value: any = "";
            // holds subitems if any
            this._items = [];
            this._valueSource = property_1.Property.create("");
            // holds the property with the info if the current user has write access
            this._writeAccess = property_1.Property.create(false);
            // specifies a response delaget for write requets
            this._reflectedWriteResponseDelegate = undefined;
            this._reference = reference;
            this._displayName = name;
            this._component = component;
        }
        /**
         * Returns the items display name
         *
         * @readonly
         * @type {string}
         * @memberof MappCockpitComponentItem
         */
        get displayName() {
            return this._displayName;
        }
        set displayName(displayName) {
            this._displayName = displayName;
        }
        get browseName() {
            return this._reference.browseName;
        }
        get name() {
            return this._reference.name;
        }
        get component() {
            return this._component;
        }
        /**
         * true if the current user have write access, else false
         *
         * @readonly
         * @type {string[]}
         * @memberof MappCockpitComponentDataModel
         */
        get writeAccess() {
            return this._writeAccess;
        }
        /**
         * Returns the items id
         *
         * @readonly
         * @type {string}
         * @memberof MappCockpitComponentItem
         */
        get id() {
            return this._reference.nodeId;
        }
        /**
         * sets/gets the items value object
         *
         * @readonly
         * @type {(MappCockpitComponentParameterValue|undefined)}
         * @memberof MappCockpitComponentParameter
         */
        get value() {
            return this._valueSource.value;
        }
        set value(value) {
            this._valueSource.value = value;
        }
        get valueSource() {
            return this._valueSource;
        }
        set valueSource(valueSource) {
            this._valueSource = valueSource;
        }
        /**
         * Sets a delegate for observing write responses
         *
         * @memberof MappCockpitComponentItem
         */
        set reflectedWriteResponseDelegate(reflectedWriteResponseDelegate) {
            this._reflectedWriteResponseDelegate = reflectedWriteResponseDelegate;
        }
        /**
         * Gets the delegate for observing write respomses
         *
         * @memberof MappCockpitComponentItem
         */
        get reflectedWriteResponseDelegate() {
            return this._reflectedWriteResponseDelegate;
        }
        /**
         * gets the value as formatted string if appropiate
         *
         * @type {*}
         * @memberof MappCockpitComponentItem
         */
        get displayValue() {
            return this._valueSource.toString();
        }
        set displayValue(inputValue) {
            this._valueSource.value = inputValue;
        }
        get dataTypeId() {
            return this._reference.dataType;
        }
        /**
         * gets the subitems if any
         *
         * @readonly
         * @type {Array<MappCockpitComponentItem>}
         * @memberof MappCockpitComponentItem
         */
        get items() {
            return this._items;
        }
    };
    MappCockpitComponentItem = __decorate([
        mco.role()
    ], MappCockpitComponentItem);
    exports.MappCockpitComponentItem = MappCockpitComponentItem;
    /**
     * The class represents a component to be used within mapp cockpit UI
     *
     * @class MappCockpitComponent
     */
    let MappCockpitComponent = class MappCockpitComponent extends MappCockpitComponentItem {
        constructor() {
            super(...arguments);
            // Holds the component methods
            this._componentService = null;
            this._methods = [];
            this._quickCommands = [];
            this._userMethods = [];
            // Holds the component parameters
            this._parameters = [];
            this._watchableParameters = [];
            this._watchableStateParameters = [];
            this._configurationParameters = [];
            this._messageParameters = [];
            // Holds the meta data of the component
            this._metaData = undefined;
            // Holds the commands of the component
            this._commandConnect = command_1.Command.create(this, this.executeCommandConnect());
            this._commandDisconnect = command_1.Command.create(this, this.executeCommandDisconnect());
        }
        /**
         * sets/gets the parameters of the component
         *
         * @readonly
         * @type {Array<MappCockpitComponentParameter>}
         * @memberof MappCockpitComponent
         */
        get commandConnectComponent() {
            return this._commandConnect;
        }
        /**
         * gets the command for disconnecting the component
         *
         * @readonly
         * @type {Command<any, any>}
         * @memberof MappCockpitComponent
         */
        get commandDisconnectComponent() {
            return this._commandDisconnect;
        }
        /**
         * Create bindings
         *
         * @memberof MappCockpitComponent
         */
        createBindings() {
            // get the components id
            const componentId = this.browseName;
            let context = new componentContext_1.ComponentContext();
            context.addContext(contextIdsComponent_1.ContextIdsComponent.ComponentId, componentId);
            bindings_1.Bindings.createByDecl(Binding.Components.Component.Messages, this, "", "onMessageParametersUpdated", false, context);
            bindings_1.Bindings.createByDecl(Binding.Components.Component.Watchables, this, "", "onWatchableParametersUpdated", false, context);
            bindings_1.Bindings.createByDecl(Binding.Components.Component.WatchableStates, this, "", "onWatchableStateParametersUpdated", false, context);
            bindings_1.Bindings.createByDecl(Binding.Components.Component.Configuration, this, "", "onConfigurationParametersUpdated", false, context);
            bindings_1.Bindings.createByDecl(Binding.Components.Component.QuickCommands, this, "", "onQuickCommandsUpdated", false, context);
            bindings_1.Bindings.createByDecl(Binding.Components.Component.UserMethods, this, "", "onMethodsUpdated", false, context);
            bindings_1.Bindings.createByDecl(Binding.Components.Component.AllMethods, this, "", "onAllMethodsUpdated", false, context);
        }
        executeCommandConnect() {
            return (commandPars, commandResponse) => __awaiter(this, void 0, void 0, function* () {
                try {
                    this.createBindings();
                    // read parameter component set
                    yield this.connectComponent();
                    // update the data link
                    commandResponse.executed();
                }
                catch (error) {
                    commandResponse.rejected(error);
                }
            });
        }
        /**
         * Connects the component
         *
         * @private
         * @memberof MappCockpitComponent
         */
        connectComponent() {
            return __awaiter(this, void 0, void 0, function* () {
                let model = this.model;
                try {
                    if (model) {
                        // browse the component members
                        yield model.browseComponent(this);
                        // intitially update the components access rights
                        this.updateComponentAccessRights(model);
                        // watch access right changes
                        this.observeComponentAccessRights(model);
                    }
                }
                catch (error) {
                    console.error("MappCockpitComponent: Could not connect component. %o", error);
                    throw (error);
                }
            });
        }
        /**
         * Disconnects the component
         *
         * @private
         * @memberof MappCockpitComponent
         */
        disconnectComponent() {
            return __awaiter(this, void 0, void 0, function* () {
                let model = this.model;
                try {
                    if (model) {
                        // detach component access rights observers
                        this.unobserveComponentAccessRights(model);
                        // unbind/dispose all bindings of this instance
                        bindings_1.Bindings.unbind(this);
                    }
                }
                catch (error) {
                    console.error("MappCockpitComponent: Could not disconnect component. %o", error);
                    throw (error);
                }
            });
        }
        executeCommandDisconnect() {
            return (commandPars, commandResponse) => __awaiter(this, void 0, void 0, function* () {
                let model = this.model;
                try {
                    if (model) {
                        yield this.disconnectComponent();
                        // the command has been executed
                        commandResponse.executed();
                    }
                }
                catch (error) {
                    commandResponse.rejected(error);
                }
            });
        }
        /**
         * Observes changes of the access rights
         *
         * @private
         * @param {MappCockpitComponentDataModel} mainModel
         * @memberof MappCockpitComponent
         */
        observeComponentAccessRights(mainModel) {
            mainModel.userRoles.attachObserver(this, (userRoles) => {
                this.updateComponentAccessRights(mainModel);
            });
        }
        /**
           * unobserves changes of the access rights
         *
         * @private
         * @param {MappCockpitComponentDataModel} mainModel
         * @memberof MappCockpitComponent
         */
        unobserveComponentAccessRights(mainModel) {
            mainModel.userRoles.detachObserver(this);
        }
        /**
         * Updates the componentrs access rights
         *
         * @private
         * @param {MappCockpitComponentDataModel} mainModel
         * @memberof MappCockpitComponent
         */
        updateComponentAccessRights(mainModel) {
            let writeAccess = mainModel.writeAccess;
            console.log("user roles changed %o write access =%o", mainModel.userRoles.value, writeAccess);
            this.updateComponentMemberAccessRights(writeAccess);
            this.writeAccess.value = writeAccess;
        }
        /**
         * Updates the access rights of component members
         *
         * @param {boolean} writeAccess
         * @returns {*}
         * @memberof MappCockpitComponent
         */
        updateComponentMemberAccessRights(writeAccess) {
            this.updateParameterAccessRights(writeAccess);
            this.updateMethodsAccessRights(writeAccess);
        }
        /**
         * Updates the parameters access rights
         *
         * @private
         * @memberof MappCockpitComponent
         */
        updateParameterAccessRights(writeAccess) {
            this.parameters.forEach((parameter) => {
                // rewrite the parameters write access property with its original raw value to force triggering the changed event. This is just a workaround
                // to fix the log in/out problem displaying wrong readonly states.
                // the workaround is intended to be replaced by proper batch refresh requests!
                parameter.isWriteable.value = parameter.isWriteable._value;
            });
        }
        /**
         * Updates the methods access rights
         *
         * @private
         * @returns {*}
         * @memberof MappCockpitComponent
         */
        updateMethodsAccessRights(writeAccess) {
            this.methods.forEach((method) => {
                method.isExecutable.value = writeAccess;
            });
        }
        /**
         * Gets the service channel
         *
         * @type {(MappCockpitComponentService|null)}
         * @memberof MappCockpitComponent
         */
        get serviceChannel() {
            return this._componentService;
        }
        /**
         * Sets the service channel
         *
         * @memberof MappCockpitComponent
         */
        set serviceChannel(serviceChannel) {
            this._componentService = serviceChannel;
        }
        /**
         * sets/gets the parameters of the component
         *
         * @readonly
         * @type {Array<MappCockpitComponentParameter>}
         * @memberof MappCockpitComponent
         */
        get methods() {
            return this._methods;
        }
        set methods(methods) {
            this._methods = methods;
            this.onAllMethodsUpdated(this._methods);
        }
        get quickCommands() {
            return this._quickCommands;
        }
        set quickCommands(quickCommands) {
            this._quickCommands = quickCommands;
            this.onQuickCommandsUpdated(this._quickCommands);
        }
        get userMethods() {
            return this._userMethods;
        }
        set userMethods(methods) {
            this._userMethods = methods;
            this.onMethodsUpdated(this._userMethods);
        }
        onMethodsUpdated(userMethods) {
            //BINDINGSOURCE: method stub supporting bindability
        }
        onAllMethodsUpdated(allMethods) {
            //BINDINGSOURCE: method stub supporting bindability
        }
        onQuickCommandsUpdated(quickCommands) {
            //BINDINGSOURCE: method stub supporting bindability
        }
        /**
         * sets/gets the parameters of the component
         *
         * @readonly
         * @type {Array<MappCockpitComponentParameter>}
         * @memberof MappCockpitComponent
         */
        get parameters() {
            return this._parameters;
        }
        set parameters(parameters) {
            this._parameters = parameters;
        }
        get watchableParameters() {
            return this._watchableParameters;
        }
        set watchableParameters(parameters) {
            this._watchableParameters = parameters;
            this.onWatchableParametersUpdated(this._watchableParameters);
        }
        onWatchableParametersUpdated(parameters) {
            // BINDINGSOURCE: method stub supporting bindability
        }
        get watchableStateParameters() {
            return this._watchableStateParameters;
        }
        set watchableStateParameters(parameters) {
            this._watchableStateParameters = parameters;
            this.onWatchableStateParametersUpdated(this._watchableStateParameters);
        }
        onWatchableStateParametersUpdated(parameters) {
            // BINDINGSOURCE: method stub supporting bindability
        }
        get messageParameters() {
            return this._messageParameters;
        }
        set messageParameters(parameters) {
            this._messageParameters = parameters;
            this.onMessageParametersUpdated(this._messageParameters);
        }
        onMessageParametersUpdated(parameters) {
            // BINDINGSOURCE: method stub supporting bindability
        }
        get configurationParameters() {
            return this._configurationParameters;
        }
        set configurationParameters(parameters) {
            this._configurationParameters = parameters;
            this.onConfigurationParametersUpdated(this._configurationParameters);
        }
        onConfigurationParametersUpdated(parameters) {
            // BINDINGSOURCE: method stub supporting bindability
        }
        /**
         * refreshes the components parameter list
         *
         * @private
         * @param {Property<MappCockpitComponentParameter[]>} dataLink
         * @returns {*}
         * @memberof MappCockpitComponent
         */
        /*private async requestReadComponentParameters(dataLink: Property<MappCockpitComponentParameter[]>): Promise<MappCockpitComponentParameter[]> {
            let componentParameters: MappCockpitComponentParameter[] = [];
            // get the components main model
            let model = (<any>this).model as MappCockpitComponentDataModel;
            try {
                if (model) {
                    // read parameter component set
                    componentParameters = await model.browseParameters(this);
                    // update the data link
                    dataLink.readRequestExecuted(componentParameters);
                }
            } catch (error:any) {
                dataLink.readRequestRejected(error);
            }
    
            return componentParameters;
        }*/
        /**
         * Refreshes the components methods
         *
         * @param {Property<MappCockpitComponentMethod[]>} dataLink
         * @returns {*}
         * @memberof MappCockpitComponent
         */
        /*private async requestReadComponentMethods(dataLink: Property<MappCockpitComponentMethod[]>): Promise<any> {
            let componentMethods: MappCockpitComponentMethod[] = [];
            // get the components main model
            let model = (<any>this).model as MappCockpitComponentDataModel;
            try {
                if (model) {
                    // read parameter component set
                    componentMethods = await model.browseMethods(this);
                    // update the data link
                    dataLink.readRequestExecuted(componentMethods);
                }
            } catch (error:any) {
                dataLink.readRequestRejected(error);
            }
    
            return componentMethods;
        }*/
        /**
         *  gets the meta data of a component
         *
         * @type {*}
         * @memberof MappCockpitComponent
         */
        get metaData() {
            return this._metaData;
        }
        set metaData(metaData) {
            this._metaData = metaData;
        }
        /**
         * Registers or marks the component as user component
         *
         * @static
         * @param {MappCockpitComponent} component
         * @returns {*}
         * @memberof MappCockpitComponent
         */
        static registerUserComponent(component) {
            component.isUserComponent = true;
        }
        /**
         * Determines if the component is a user component
         *
         * @static
         * @param {MappCockpitComponent} component
         * @returns {boolean}
         * @memberof MappCockpitComponent
         */
        static isUserComponent(component) {
            return component.isUserComponent;
        }
    };
    MappCockpitComponent = __decorate([
        mco.role()
    ], MappCockpitComponent);
    exports.MappCockpitComponent = MappCockpitComponent;
    /**
     * The class implements method access.
     *
     * @class MappCockpitComponentMethod
     */
    let MappCockpitComponentMethod = class MappCockpitComponentMethod extends MappCockpitComponentItem {
        constructor() {
            super(...arguments);
            // Holds the method parameters
            this._inputParameters = [];
            // specefies if the method is executable
            this._isExecutable = property_1.Property.create(false, undefined, undefined, (value) => this.methodIsExecutable(value));
        }
        /**
         * Returns the input parameters of the method
         *
         * @readonly
         * @type {Array<MappCockpitMethodParameter>}
         * @memberof MappCockpitComponentMethod
         */
        get inputParameters() {
            return this._inputParameters;
        }
        set inputParameters(value) {
            this._inputParameters = value;
        }
        /**
         * Invokes the execution of the component method
         *
         * @static
         * @param {MappCockpitComponentMethod} componentMethod
         * @returns {*}
         * @memberof MappCockpitComponentMethod
         */
        static execute(componentMethod) {
            return __awaiter(this, void 0, void 0, function* () {
                // get the methods model from the parent component
                let model = componentMethod.component.model;
                if (model && model.executeComponentMethod) {
                    // invoke the execution of the method
                    return yield model.executeComponentMethod(componentMethod);
                }
            });
        }
        /**
         * Finds a method by name
         *
         * @static
         * @param {string} methodName
         * @param {(MappCockpitComponentMethod[]|undefined)} componentMethods
         * @param {boolean} [includeInternals=true]
         * @returns {MappCockpitComponentMethod|undefined}
         * @memberof MappCockpitComponentMethod
         */
        static find(methodName, componentMethods, includeInternals = true) {
            let method = undefined;
            if (componentMethods) {
                let model = componentMethods[0].component.model;
                if (model) {
                    // get the executable methods
                    let executableMethods = includeInternals ? componentMethods[0].component.methods : componentMethods;
                    let matchingMethods = executableMethods.filter((method) => { return method.browseName === methodName; });
                    if (matchingMethods.length === 1) {
                        // call the requested method
                        method = matchingMethods[0];
                    }
                }
            }
            return method;
        }
        /**
         * Gets if the method is executable
         *
         * @readonly
         * @type {Property<boolean>}
         * @memberof MappCockpitComponentMethod
         */
        get isExecutable() {
            return this._isExecutable;
        }
        /**
         * Determines if the methid is executable
         *
         * @param {boolean} executable
         * @returns {*}
         * @memberof MappCockpitComponentMethod
         */
        methodIsExecutable(executable) {
            let isExecutableValue = executable;
            let model = this.component.model;
            if (model && this.component) {
                // enable method execution for non user components
                isExecutableValue = MappCockpitComponent.isUserComponent(this.component) ? isExecutableValue : true;
            }
            return isExecutableValue;
        }
        /**
         * Updates the methods input parameters
         *
         * @static
         * @param {MappCockpitComponentMethod} componentMethod
         * @returns {Promise<MappCockpitMethodParameter[]>}
         * @memberof MappCockpitComponentMethod
         */
        static updateInputParameters(componentMethod) {
            return __awaiter(this, void 0, void 0, function* () {
                // get the methods model from the parent component
                let model = componentMethod.component.model;
                if (model && (model.executeComponentMethod != undefined)) {
                    yield model.browseMethodInputParameters(componentMethod);
                    mappCockpitComponentReflection_1.MappCockpitComponentMethodInfo.updateMethodInputParameters(componentMethod);
                }
                return componentMethod.inputParameters;
            });
        }
    };
    MappCockpitComponentMethod = __decorate([
        mco.role()
    ], MappCockpitComponentMethod);
    exports.MappCockpitComponentMethod = MappCockpitComponentMethod;
    let MappCockpitParameter = class MappCockpitParameter extends MappCockpitComponentItem {
        constructor() {
            super(...arguments);
            // holds the parameters type
            this._dataType = new MappCockpitParameterDataType();
            // reference to the enum information
            this._enumRef = new MappCockpitComponentParameterEnum(null);
            // holds the engineering unit name for this parameter
            this._engineeringUnit = "";
            // holds the modified value if the value of this parameter was already changed in the ui
            this._modifiedValue = undefined;
            // was there an error at the last transfer of this parameter
            this._transferFailed = false;
            // is it allowed to change/write this item in general
            this._isReadOnly = false;
            // is it allowed to write this parameter at the current state
            this._isWritable = property_1.Property.create(false, undefined, undefined, (value) => this.parameterIsWritable(value));
        }
        /**
         * Returns the parameters value object
         *
         * @readonly
         * @type {(MappCockpitParameterDataType)}
         * @memberof MappCockpitParameter
         */
        get dataType() {
            return this._dataType;
        }
        set dataType(dataType) {
            this._dataType = dataType;
        }
        get engineeringUnit() {
            return this._engineeringUnit;
        }
        set engineeringUnit(engineeringUnit) {
            this._engineeringUnit = engineeringUnit;
        }
        get enumType() {
            return this._enumRef;
        }
        set enumType(enumRef) {
            this._enumRef = enumRef;
        }
        /**
         * true if it is not possible to change the value of this parameter, else false
         *
         * @type {boolean}
         * @memberof MappCockpitParameter
         */
        get isReadOnly() {
            return this._isReadOnly;
        }
        set isReadOnly(isReadOnly) {
            this._isReadOnly = isReadOnly;
        }
        /**
         * true if the the parameter value can not be written at the current state
         *
         * @readonly
         * @type {Property<boolean>}
         * @memberof MappCockpitParameter
         */
        get isWriteable() {
            return this._isWritable;
        }
        /**
         * Determines if the properties value is writable.
         *
         * @private
         * @param {boolean} value
         * @returns {boolean}
         * @memberof MappCockpitParameter
         */
        parameterIsWritable(writable) {
            let writableValue = writable;
            let model = this.component.model;
            if (model) {
                writableValue = writable && model.writeAccess;
            }
            return writableValue;
        }
        /**
         * Retruns the display value
         *
         * @type {string}
         * @memberof MappCockpitParameter
         */
        get displayValue() {
            return this.valueToString(this._valueSource.value);
        }
        /**
         * Sets the display value
         *
         * @memberof MappCockpitParameter
         */
        set displayValue(inputValue) {
            let newValue = this.valueFromString(inputValue);
            this.value = newValue;
            console.log("MappCockpitParameter.setDisplayValue %o for %o", this.value, inputValue);
        }
        /**
         * Gets the modified parameter value.
         *
         * @type {*}
         * @memberof MappCockpitParameter
         */
        get modifiedValue() {
            return this._modifiedValue;
        }
        /**
         * Sets the modified parameter value.
         *
         * @memberof MappCockpitParameter
         */
        set modifiedValue(value) {
            this._modifiedValue = value;
        }
        /**
         * Gets the modified display parameter value.
         *
         * @type {*}
         * @memberof MappCockpitParameter
         */
        get modifiedDisplayValue() {
            if (this._modifiedValue != undefined) {
                return this.valueToString(this._modifiedValue);
            }
            return this.valueToString(this._valueSource.value);
        }
        /**
         * Sets the modified display parameter value.
         *
         * @memberof MappCockpitParameter
         */
        set modifiedDisplayValue(value) {
            let newValue = this.valueFromString(value);
            this._modifiedValue = newValue;
        }
        /**
         * True if transfer of modififed value was not possible
         *
         * @type {boolean}
         * @memberof MappCockpitParameter
         */
        get transferFailed() {
            return this._transferFailed;
        }
        /**
         * Will be set to true if transfer of modififed value was not possible
         *
         * @memberof MappCockpitParameter
         */
        set transferFailed(value) {
            this._transferFailed = value;
        }
        /**
         * converts the parameter value to a formatted string
         *
         * @param {*} value
         * @returns {string}
         * @memberof MappCockpitParameter
         */
        valueToString(value) {
            let valueString = "";
            // avoid converting null or undefined value
            if (value != null && value != undefined) {
                valueString = value.toString();
                valueString = numericHelper_1.NumericHelper.convertNumericString(valueString, this.dataType.name);
                if (this.enumType.isDefined) {
                    valueString = this.enumType.getDisplayValue(value);
                }
            }
            return valueString;
        }
        /**
         * converts a parameter value string to a value according to the parameters data type
         *
         * @param {string} inputValue
         * @returns {*}
         * @memberof MappCockpitParameter
         */
        valueFromString(inputValue) {
            // set an empty string for an undefined input value
            let value = inputValue !== undefined && inputValue !== null ? inputValue : "";
            // replace the enum string by the value if there is one defined.
            if (this.enumType.isDefined) {
                value = this.enumType.getValue(inputValue);
            }
            return value;
        }
    };
    MappCockpitParameter = __decorate([
        mco.role()
    ], MappCockpitParameter);
    /**
     * The class implements a component parameter
     *
     * @class MappCockpitComponentParameter
     */
    let MappCockpitComponentParameter = MappCockpitComponentParameter_1 = class MappCockpitComponentParameter extends MappCockpitParameter {
        constructor(component, name, reference) {
            super(component, name, reference);
            this._valueSource = property_1.Property.create("", undefined, (dataLink) => this.requestWriteValue(dataLink));
        }
        /**
         * Writes the current parameter value to target
         *
         * @memberof MappCockpitComponentParameter
         */
        write(reflectedWriteResponseDelegate) {
            // connect the write response delegate
            this.reflectedWriteResponseDelegate = reflectedWriteResponseDelegate;
            // execute writing the parameter value
            this.valueSource.write();
        }
        /**
         * Writes the data links value to target
         *
         * @private
         * @param {Property<any>} dataLink
         * @memberof MappCockpitComponentParameter
         */
        requestWriteValue(dataLink) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let component = this.component;
                    if (component && component.model) {
                        var model = component.model;
                        yield model.writeComponentParameter(this);
                        dataLink.writeRequestExecuted(null);
                    }
                }
                catch (error) {
                    dataLink.writeRequestRejected(error);
                }
            });
        }
        /**
         * Initiates the observation of parameter value changes
         *
         * @static
         * @param {MappCockpitComponentParameter[]} watchableParameters
         * @returns {*}
         * @memberof MappCockpitComponentParameter
         */
        static observeParameterValueChanges(observer, observableParameters) {
            return __awaiter(this, void 0, void 0, function* () {
                if (observableParameters.length > 0 && observableParameters[0] != undefined) {
                    // get the parameters model from the parent component
                    let model = MappCockpitComponentParameter_1.getModel(observableParameters[0]);
                    if (model && model.observeDataModelItems) {
                        // invoke the observation on the model
                        yield model.observeDataModelItems(observer, observableParameters);
                    }
                }
            });
        }
        /**
         * Activates model items registered for observation
         *
         * @static
         * @param {*} observer
         * @param {MappCockpitComponentParameter[]} observableParameters
         * @returns {*}
         * @memberof MappCockpitComponentParameter
         */
        static activateComponentModelItems(observer, observableParameters) {
            //TODO: implement model item activation handling
        }
        /**
         * Unobserves all observables associated with the observer
         *
         * @static
         * @param {*} observer
         * @param {MappCockpitComponentParameter[]} observedParameters
         * @param {boolean} [suspend=true] suspends the observation if true otherwise removes the whole subscription
         * @memberof MappCockpitComponentParameter
         */
        static unobserveComponentModelItems(observer, observedParameters = [], suspend = true) {
            return __awaiter(this, void 0, void 0, function* () {
                if (observedParameters.length > 0 && observedParameters[0] != undefined) {
                    let model = MappCockpitComponentParameter_1.getModel(observedParameters[0]);
                    if (model && model.unobserveComponentModelItems) {
                        // invoke the unobservation on the model
                        yield model.unobserveComponentModelItems(observer, observedParameters, suspend);
                    }
                }
            });
        }
        /**
         * Unobserves all connected parameters of the specified component
         *
         * @static
         * @param {*} observer
         * @param {(MappCockpitComponentItem | null)} component
         * @memberof MappCockpitComponentParameter
         */
        static unobserveAll(observer, component) {
            return __awaiter(this, void 0, void 0, function* () {
                if (component) {
                    const model = component.model;
                    if (model && model.unobserveComponentModelItems) {
                        // Omitting a parameter list forces unobserving every observables of the specified observer
                        yield model.unobserveComponentModelItems(observer, [], false).then((result) => {
                            console.log("MappCockpitComponentParameter: unobserved %o", observer);
                        }).catch((error) => {
                            console.error(error);
                        });
                    }
                }
            });
        }
        /**
         * Deactivates model items registered for observation
         *
         * @static
         * @param {*} observer
         * @param {MappCockpitComponentParameter[]} observedParameters
         * @param {boolean} [suspend=true]
         * @memberof MappCockpitComponentParameter
         */
        static deactivateComponentModelItems(observer, observedParameters, suspend = true) {
            //TODO: implement model item deactivation handling
        }
        /**
         * Gets the parameters model
         *
         * @private
         * @static
         * @param {MappCockpitComponentParameter[]} observableParameters
         * @returns
         * @memberof MappCockpitComponentParameter
         */
        static getModel(componentParameter) {
            if (!componentParameter) {
                console.error("componentParameter undefined !");
            }
            if (!componentParameter.component) {
                console.error("componentParameter.component undefined !");
            }
            return componentParameter.component.model;
        }
    };
    MappCockpitComponentParameter = MappCockpitComponentParameter_1 = __decorate([
        mco.role()
    ], MappCockpitComponentParameter);
    exports.MappCockpitComponentParameter = MappCockpitComponentParameter;
    /**
     * Defines class used for state icons
     *
     * @class MappCockpitStateParameter
     */
    let MappCockpitStateParameter = class MappCockpitStateParameter {
        constructor(name, expression, watchableMapping, icon) {
            // Holds watchable state expression class
            this.stateExpression = new watchableStateExpression_1.WatchableStateExpression();
            this._name = name;
            this.stateExpression = new watchableStateExpression_1.WatchableStateExpression(name, expression, watchableMapping, icon);
        }
        get name() {
            return this._name;
        }
    };
    MappCockpitStateParameter = __decorate([
        mco.role()
    ], MappCockpitStateParameter);
    exports.MappCockpitStateParameter = MappCockpitStateParameter;
    /**
     * implements a method parameter
     *
     * @class MappCockpitMethodParameter
     * @extends {MappCockpitParameter}
     */
    let MappCockpitMethodParameter = class MappCockpitMethodParameter extends MappCockpitParameter {
        constructor(component, name, reference) {
            super(component, name, reference);
            this._filter = new parameterFilter_1.ParameterFilter();
        }
        set filter(filter) {
            this._filter = filter;
        }
        get filter() {
            return this._filter;
        }
    };
    MappCockpitMethodParameter = __decorate([
        mco.role()
    ], MappCockpitMethodParameter);
    exports.MappCockpitMethodParameter = MappCockpitMethodParameter;
    /**
     * Defines the clas for quickcommands
     *
     * @class MappCockpitQuickCommandParameter
     */
    let MappCockpitQuickCommandParameter = class MappCockpitQuickCommandParameter {
        constructor(name, tooltip, imageName) {
            this._name = name;
            this._tooltip = tooltip;
            this._imageName = imageName;
        }
        get name() {
            return this._name;
        }
        get tooltip() {
            return this._tooltip;
        }
        get imageName() {
            return this._imageName;
        }
    };
    MappCockpitQuickCommandParameter = __decorate([
        mco.role()
    ], MappCockpitQuickCommandParameter);
    exports.MappCockpitQuickCommandParameter = MappCockpitQuickCommandParameter;
    /**
     * defines the parameter data type
     *
     * @class MappCockpitComponentParameterDataType
     */
    let MappCockpitParameterDataType = class MappCockpitParameterDataType {
        constructor(dataTypeId = "undefined", dataTypeName = "undefined") {
            this._dataTypeId = "undefined";
            this._dataTypeName = "undefined";
            this._dataTypeId = dataTypeId;
            this._dataTypeName = dataTypeName;
        }
        /**
         * Returns if the data type is defined.
         *
         * @readonly
         * @memberof MappCockpitParameter
         */
        get isDefined() {
            return this._dataTypeId !== "undefined" && this._dataTypeName !== "undefined";
        }
        get id() {
            return this, this._dataTypeId;
        }
        get name() {
            return this._dataTypeName;
        }
    };
    MappCockpitParameterDataType = __decorate([
        mco.role()
    ], MappCockpitParameterDataType);
    exports.MappCockpitParameterDataType = MappCockpitParameterDataType;
    /**
     * implements a single enum value with value and string
     *
     * @class MappCockpitComponentParameterEnumValue
     */
    let MappCockpitComponentParameterEnumValue = class MappCockpitComponentParameterEnumValue {
        /**
         * Creates an instance of MappCockpitComponentParameterEnumValue.
         * @param {string} displayText
         * @param {*} value
         * @memberof MappCockpitComponentParameterEnumValue
         */
        constructor(displayText, value) {
            this._displayValue = "undefined";
            this._value = null;
            this._displayValue = displayText;
            this._value = value;
        }
        /**
         * gets the value of the enum
         *
         * @readonly
         * @type {*}
         * @memberof MappCockpitComponentParameterEnumValue
         */
        get value() {
            return this._value;
        }
        /**
         * gets the string of the enum value
         *
         * @readonly
         * @type {string}
         * @memberof MappCockpitComponentParameterEnumValue
         */
        get displayValue() {
            return this._displayValue;
        }
    };
    MappCockpitComponentParameterEnumValue = __decorate([
        mco.role()
    ], MappCockpitComponentParameterEnumValue);
    exports.MappCockpitComponentParameterEnumValue = MappCockpitComponentParameterEnumValue;
    /**
     * implements a parameter enum holding a collection of enum items
     *
     * @class MappCockpitComponentParameterEnum
     */
    let MappCockpitComponentParameterEnum = class MappCockpitComponentParameterEnum {
        constructor(enumValuesReference = null) {
            this._browseName = "";
            this._enumValuesReference = enumValuesReference;
            if (this._enumValuesReference) {
                this._browseName = this._enumValuesReference.browseName;
                this._enumValues = this._enumValuesReference.enumValues.map((enumValueRef) => { return new MappCockpitComponentParameterEnumValue(enumValueRef.displayName.text, enumValueRef.value); });
            }
        }
        /**
         * gets the browse name of the enum
         *
         * @readonly
         * @type {string}
         * @memberof MappCockpitComponentParameterEnum
         */
        get browseName() {
            return this._enumValuesReference.browseName;
        }
        /**
         * gets the collection of enum items
         *
         * @readonly
         * @type {MappCockpitComponentParameterEnumValue[]}
         * @memberof MappCockpitComponentParameterEnum
         */
        get values() {
            return this._enumValues;
        }
        /**
         * determines if the enum is defined and contains values
         *
         * @readonly
         * @type {boolean}
         * @memberof MappCockpitComponentParameterEnum
         */
        get isDefined() {
            return this._enumValues && this._enumValues.length > 0;
        }
        /**
         * gets a string matching the specified enum value, otherwise return value string as default.
         *
         * @returns {*}
         * @memberof MappCockpitComponentParameterEnum
         */
        getDisplayValue(enumValue) {
            // get an enum item matching the requested value
            let matchingEnumItem = this.findMatchingEnumItemByValue(enumValue);
            // update the value string to the matching one or use the default string
            let enumValueString = matchingEnumItem ? matchingEnumItem.displayValue : enumValue.toString();
            return enumValueString;
        }
        /**
         *
         *
         * @param {string} inputValue
         * @returns {*}
         * @memberof MappCockpitComponentParameterEnum
         */
        getValue(enumDisplayValue) {
            let enumValue = enumDisplayValue;
            // get an enum item matching the requested string
            let matchingEnumItem = this.findMatchingEnumItemByString(enumDisplayValue);
            if (matchingEnumItem) {
                enumValue = matchingEnumItem.value;
            }
            else {
                console.error("MappCockpitComponentParameterEnum.getValue: could not find matching enum value for %o", enumDisplayValue);
            }
            return enumValue;
        }
        /**
         * find an enum item with matching value
         *
         * @private
         * @param {*} enumValue
         * @returns
         * @memberof MappCockpitComponentParameterEnum
         */
        findMatchingEnumItemByValue(enumValue) {
            let matchingEnumItem = this._enumValues.filter((enumItem) => { return enumItem.value == enumValue; });
            return matchingEnumItem.length === 1 ? matchingEnumItem[0] : undefined;
        }
        /**
         * find an enum item with matching string
         *
         * @param {string} enumDisplayValue
         * @returns {*}
         * @memberof MappCockpitComponentParameterEnum
         */
        findMatchingEnumItemByString(enumDisplayValue) {
            let matchingEnumItem = this._enumValues.filter((enumItem) => { return enumItem.displayValue === enumDisplayValue; });
            return matchingEnumItem.length === 1 ? matchingEnumItem[0] : undefined;
        }
    };
    MappCockpitComponentParameterEnum = __decorate([
        mco.role()
    ], MappCockpitComponentParameterEnum);
    exports.MappCockpitComponentParameterEnum = MappCockpitComponentParameterEnum;
});
