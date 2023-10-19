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
define(["require", "exports", "../../communication/rest/opcUaRestServices", "./mappCockpitComponentProvider", "./mappCockpitCommonInfoProvider", "./trace/mappCockpitTraceProvider", "./mappCockpitDiagnosticMonitoringProvider", "../../framework/events", "../online/mappCockpitComponent", "../../services/appServices", "../online/mappCockpitComponentService"], function (require, exports, opcUaRestServices_1, mappCockpitComponentProvider_1, mappCockpitCommonInfoProvider_1, mappCockpitTraceProvider_1, mappCockpitDiagnosticMonitoringProvider_1, events_1, ModelItems, appServices_1, mappCockpitComponentService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitDiagnosticProvider = void 0;
    let EventObservablesChanged = class EventObservablesChanged extends events_1.TypedEvent {
    };
    EventObservablesChanged = __decorate([
        mco.role()
    ], EventObservablesChanged);
    ;
    /**
     * Implements the mapp cockpit diagnostic provider
     *
     * @class MappCockpitDiagnosticProvider
     */
    let MappCockpitDiagnosticProvider = class MappCockpitDiagnosticProvider {
        /**
         * Creates an instance of MappCockpitDiagnosticProvider.
         * @memberof MappCockpitDiagnosticProvider
         */
        constructor(dataModel) {
            // Holds the currently acive session id
            this._sessionId = -1;
            // Holds the mapp cockpit nmespace index
            this._namespaceIndex = -1;
            this._observedItemsChangedHandler = (sender, eventArgs) => { this.handleObservableChanged(sender, eventArgs); };
            // Initialize members
            this._dataModel = dataModel;
            this._componentProvider = new mappCockpitComponentProvider_1.MappCockpitComponentProvider(this);
            this._traceProvider = new mappCockpitTraceProvider_1.MappCockpitTraceProvider(this);
            this._monitoringProvider = new mappCockpitDiagnosticMonitoringProvider_1.MappCockpitDiagnosticMonitoringProvider(this);
            this._commonInfoProvider = mappCockpitCommonInfoProvider_1.MappCockpitCommonInfoProvider.getInstance();
            this.eventObservablesChanged = new EventObservablesChanged();
            // attach events 
            this._monitoringProvider.eventObservedItemsChanged.attach(this._observedItemsChangedHandler);
        }
        /**
         * Dispose the MappCockpitDiagnosticProvider
         *
         * @memberof MappCockpitDiagnosticProvider
         */
        dispose() {
            // detach events 
            this._monitoringProvider.eventObservedItemsChanged.detach(this._observedItemsChangedHandler);
            // terminate the current session
            (() => __awaiter(this, void 0, void 0, function* () {
                yield this.endSession();
            }))();
        }
        /**
         * Gets the component provider
         *
         * @readonly
         * @type {MappCockpitTraceProvider}
         * @memberof MappCockpitDiagnosticProvider
         */
        get componentProvider() {
            return this._componentProvider;
        }
        /**
         * Gets the data model
         *
         * @readonly
         * @type {MappCockpitComponentDataModel}
         * @memberof MappCockpitDiagnosticProvider
         */
        get model() {
            return this._dataModel;
        }
        /**
         * Gets the trace provider
         *
         * @readonly
         * @type {MappCockpitTraceProvider}
         * @memberof MappCockpitDiagnosticProvider
         */
        get traceProvider() {
            return this._traceProvider;
        }
        /**
         * Returns the current session id
         *
         * @readonly
         * @type {string}
         * @memberof MappCockpitDiagnosticProvider
         */
        get sessionId() {
            return this._sessionId;
        }
        /**
         * Returns the effective namespace index
         *
         * @readonly
         * @type {number}
         * @memberof MappCockpitDiagnosticProvider
         */
        get namespaceIndex() {
            return this._namespaceIndex;
        }
        /**
         * Returns the mapp cockpit namespace
         *
         * @readonly
         * @type {string}
         * @memberof MappCockpitDiagnosticProvider
         */
        get namespace() {
            return opcUaRestServices_1.OpcUaRestServices.mappCockpitNamespacePrefix + this._namespaceIndex;
        }
        /**
         * starts a diagnostic session
         *
         * @private
         * @memberof MappCockpitDiagnosticProvider
         */
        beginSession() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // get opc ua address
                    yield opcUaRestServices_1.OpcUaRestServices.readOpcUaLocalIp();
                    // authenticate 
                    yield opcUaRestServices_1.OpcUaRestServices.authenticate();
                    // create a socket connection for receiving opc-ua events
                    yield this._monitoringProvider.createOpcUaSocket();
                    console.log('MappCockpitDiagnosticProvider: created web socket ');
                    // create a session
                    yield this.createSession();
                    console.log("MappCockpitDiagnosticProvider: created session: %o", this.sessionId);
                    // read the namespace index for further access
                    this._namespaceIndex = yield opcUaRestServices_1.OpcUaRestServices.getNamespaceIndex(this.sessionId);
                    console.log("MappCockpitDiagnosticProvider: got namespace index: %o", this._namespaceIndex);
                    // initialize common info provider 
                    yield this._commonInfoProvider.initialize(this.sessionId, this._namespaceIndex);
                    // connects to the text system
                    yield this.connectTextSystem();
                }
                catch (error) {
                    console.log(error);
                }
            });
        }
        /**
         * Connects and initializes the textsystem
         *
         * @private
         * @memberof MappCockpitDiagnosticProvider
         */
        connectTextSystem() {
            return __awaiter(this, void 0, void 0, function* () {
                yield appServices_1.Services.textSystem.connectTextSystem();
                // // browse the textsystem just for test and exemplaric purposes
                // await this.browseTextSystem();
                // // browse the textprovider just for test and exemplaric purposes
                // await this.browseTextProvider();
            });
        }
        // /**
        //  * Just a test method for browsing the text system
        //  *
        //  * @private
        //  * @memberof MappCockpitDiagnosticProvider
        //  */
        // private async browseTextSystem() {
        //     // read the default language
        //     const defaultLanguageId = await Services.textSystem.getDefaultLanguage();
        //     // read all available languages
        //     const languages = await Services.textSystem.getLanguages();
        //     // read namespace text resources
        //     const namespaceTextItemsMap = await Services.textSystem.getNamespaceTextItems(defaultLanguageId,"BR/GMC/Enum/AcpParIdDescription");
        //     // get one text from the map
        //     const parIdTextFromMap = namespaceTextItemsMap.get("111");
        //     // read single specific text from namespace
        //     const parIdText = await Services.textSystem.getText(defaultLanguageId,"BR/GMC/Enum/AcpParIdDescription","111");
        //     // // read all text items of the namespace per single access
        //     // // retrieve the text keys
        //     // const textItemIds = Object.keys(namespaceTextItems);
        //     // let retrievedNsTextItems  = {};
        //     // // iterate all text keys and get the correponding text
        //     // textItemIds.forEach(async textItemId => {
        //     //     const nsText = await Services.textSystem.getText(defaultLanguageId,"BR/GMC/Enum/AcpParIdDescription",textItemId);
        //     //     retrievedNsTextItems[textItemId] = nsText;
        //     // }); 
        //     console.log(languages);
        // }
        // private _text: TextItem = new TextItem();
        // private _uploadedNamespacesFinishedHandler = (sender, args)=>this.onUploadedNamespacesFinished(sender, args);
        // private onUploadedNamespacesFinished(sender: ITextProvider, args: EventNamespacesLoadedResponse) {
        //     if(args.notFoundNamespaces.length !== 0) {
        //         // react to not all namespaces found
        //     }
        //     let inputArgs = new FormatterInputArgumentList();
        //     inputArgs.push(new FormatterInputArgumentString("°C"));
        //     inputArgs.push(new FormatterInputArgumentFloat(23.12000));
        //     this._text = sender.getFormattedText("BR/EventLog", "-2141085654", inputArgs);
        // }
        // private async browseTextProvider() {
        //     let componentFactory: IComponentFactory = ComponentFactory.getInstance();
        //     let textProvider: ITextProvider = componentFactory.create(new ComponentDefinition("TextProvider", "TextProvider", "textProviderDefinition"), undefined) as ITextProvider;
        //     const defaultLanguageId = await Services.textSystem.getDefaultLanguage();
        //     textProvider.setSelectedLanguage(defaultLanguageId);
        //     let namespaces: Array<string> = new Array<string>();
        //     namespaces.push("BR/GMC/Enum/AcpParIdDescription");
        //     namespaces.push("BR/EventLog");
        //     textProvider.eventNamespacesLoaded.attach(this._uploadedNamespacesFinishedHandler);
        //     textProvider.loadFullNamespacesRequest(namespaces);
        //     textProvider.eventNamespacesLoaded.detach(this._uploadedNamespacesFinishedHandler);
        // }
        /**
         * Creates a new session if not already available.
         *
         * @private
         * @memberof MappCockpitDiagnosticProvider
         */
        createSession() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._sessionId === -1) {
                    let newSessionId = yield opcUaRestServices_1.OpcUaRestServices.createSession();
                    this._sessionId = newSessionId;
                }
            });
        }
        /**
         * terminates a diagnostic session
         *
         * @private
         * @memberof MappCockpitDiagnosticProvider
         */
        endSession() {
            return __awaiter(this, void 0, void 0, function* () {
                this._monitoringProvider.close();
                yield opcUaRestServices_1.OpcUaRestServices.deleteSession(this.sessionId);
                this._sessionId = -1;
            });
        }
        /**
         * Checks is the connection to the target is still valid
         *
         * @returns {*}
         * @memberof MappCockpitDiagnosticProvider
         */
        checkTargetConnection() {
            return __awaiter(this, void 0, void 0, function* () {
                let connected = false;
                try {
                    // we access the mapp cockpit roots description atribute as live check. The connection is valid if the attribute could be read successfully.
                    yield opcUaRestServices_1.OpcUaRestServices.readNodeAttribute(this.sessionId, this.namespace + ";" + opcUaRestServices_1.OpcUaRestServices.mappCockpitRootNodeId, opcUaRestServices_1.OpcUaAttribute.DESCRIPTION);
                    connected = true;
                }
                catch (error) {
                    connected = false;
                }
                return connected;
            });
        }
        /**
         * Login new user
         *
         * @param {string} user
         * @param {string} password
         * @memberof MappCockpitDiagnosticProvider
         */
        changeUser(userInfo) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield opcUaRestServices_1.OpcUaRestServices.changeUser(this.sessionId, userInfo);
            });
        }
        /**
         * browses the meta info for a component
         *
         * @param {ModelItems.MappCockpitComponent} mappCockpitComponent
         * @returns {Promise<any>}
         * @memberof MappCockpitDiagnosticProvider
         */
        browseMetaInfo(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                var metaInfo = yield this._componentProvider.browseComponentMetaInfo(mappCockpitComponent);
                return metaInfo;
            });
        }
        /**
         * browses the parameters of a component
         *
         * @param {ModelItems.MappCockpitComponent} mappCockpitComponent
         * @returns {Promise<ModelItems.MappCockpitComponentParameter[]>}
         * @memberof MappCockpitDiagnosticProvider
         */
        browseParameters(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                var mappCockpitComponentParameters = yield this._componentProvider.browseComponentParameters(mappCockpitComponent);
                return mappCockpitComponentParameters;
            });
        }
        /**
         * updates parameter data types
         *
         * @param {ModelItems.MappCockpitComponentParameter[]} parameters
         * @returns {Promise<any>}
         * @memberof MappCockpitDiagnosticProvider
         */
        updateParameterDataTypes(parameters) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this._componentProvider.updateParameterDataTypes(parameters);
            });
        }
        /**
         * updates method parameter data types
         *
         * @param {ModelItems.MappCockpitComponentMethod[]} methods
         * @returns {Promise<any>}
         * @memberof MappCockpitDiagnosticProvider
         */
        updateMethodParameterDataTypes(methods) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this._componentProvider.updateMethodParameterDataTypes(methods);
            });
        }
        /**
         * reads a list of parameter values
         *
         * @param {Array<ModelItems.MappCockpitComponentParameter>} componentParameters
         * @returns {Promise<Array<ModelItems.MappCockpitComponentParameter>>}
         * @memberof MappCockpitDiagnosticProvider
         */
        readParameterValues(componentParameters) {
            return __awaiter(this, void 0, void 0, function* () {
                let requestsReadParameterValues = componentParameters.map((componentParameter) => { return this._componentProvider.readComponentParameterValue(componentParameter); });
                yield Promise.all(requestsReadParameterValues);
                return componentParameters;
            });
        }
        /**
         * Writes the parameters values
         *
         * @param {ModelItems.MappCockpitComponentParameter[]} componentParameters
         * @returns {*}
         * @memberof MappCockpitDiagnosticProvider
         */
        writeParameterValues(componentParameters) {
            return __awaiter(this, void 0, void 0, function* () {
                let requestsWriteParameterValues = componentParameters.map((componentParameter) => { return this._componentProvider.writeComponentParameterValue(componentParameter); });
                yield Promise.all(requestsWriteParameterValues);
                return componentParameters;
            });
        }
        /**
         * observes the list of items for value changes
         *
         * @param {Array<ModelItems.MappCockpitComponentParameter>} componentParameters
         * @memberof MappCockpitDiagnosticProvider
         */
        observeComponentModelItems(observer, componentParameters) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this._monitoringProvider.observeComponentModelItems(observer, this.sessionId, componentParameters);
            });
        }
        /**
         * Unobserves the passed parameters.
         *
         * @param {*} observer
         * @param {ModelItems.MappCockpitComponentParameter[]} observableParameters
         * @memberof MappCockpitDiagnosticProvider
         */
        unobserveComponentModelItems(observer, observableParameters, suspend) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this._monitoringProvider.unobserveComponentModelItems(observer, this.sessionId, observableParameters, suspend);
            });
        }
        /**
         * handles change notifications from observables
         *
         * @returns {*}
         * @memberof MappCockpitDiagnosticProvider
         */
        handleObservableChanged(sender, changedEventArgs) {
            this.eventObservablesChanged.raise(this, changedEventArgs);
        }
        /**
         * writes a parameters value
         *
         * @param {ModelItems.MappCockpitComponentParameter} componentParameter
         * @param {*} value
         * @returns {Promise<any>}
         * @memberof MappCockpitDiagnosticProvider
         */
        writeParameterValue(componentParameter, value) {
            return __awaiter(this, void 0, void 0, function* () {
                // Initiate loading trace data
                var componentParameterValue = yield this._componentProvider.writeComponentParameterValue(componentParameter);
                return componentParameterValue;
            });
        }
        /**
         * browses the methods of a component
         *
         * @param {MappCockpitComponent} mappCockpitComponent
         * @returns {*}
         * @memberof MappCockpitDiagnosticProvider
         */
        browseMethods(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                var mappCockpitComponentMethods = yield this._componentProvider.browseComponentMethods(mappCockpitComponent);
                return mappCockpitComponentMethods;
            });
        }
        browseMethodParameters(mappCockpitComponentMethods) {
            return __awaiter(this, void 0, void 0, function* () {
                var mappCockpitComponentMethodParameters = yield this._componentProvider.browseComponentMethodParameters(mappCockpitComponentMethods);
                return mappCockpitComponentMethodParameters;
            });
        }
        /**
         * executes a component method
         *
         * @param {*} mappCockpitComponent
         * @returns {*}
         * @memberof MappCockpitDiagnosticProvider
         */
        executeComponentMethod(mappCockpitComponentMethod) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._componentProvider.executeComponentMethod(mappCockpitComponentMethod);
            });
        }
        /**
         * Browses for the service node and creates a component service object
         *
         * @param {ModelItems.MappCockpitComponent} mappCockpitComponent
         * @returns {Promise<MappCockpitComponentService>}
         * @memberof MappCockpitDiagnosticProvider
         */
        browseServiceChannel(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                // create the component service object
                let componentService = new mappCockpitComponentService_1.MappCockpitComponentService();
                try {
                    // get the components nodes.
                    const componentNodes = yield opcUaRestServices_1.OpcUaRestServices.browseNodes(this.sessionId, mappCockpitComponent.id);
                    // check if the service node is available
                    if (componentNodes && componentNodes.find((node) => { return node.browseName === opcUaRestServices_1.OpcUaRestServices.serviceChannelNodeId; })) {
                        // get the components service node id
                        const serviceNodeId = mappCockpitComponent.id + "." + opcUaRestServices_1.OpcUaRestServices.serviceChannelNodeId;
                        // browse and get the info channel property
                        let serviceParameters = yield opcUaRestServices_1.OpcUaRestServices.browseNodeParameters(this.sessionId, serviceNodeId);
                        let serviceChannel = serviceParameters.filter((parameter) => { return parameter.browseName === "infoChannel"; });
                        if (serviceChannel.length === 1) {
                            componentService.infoChannel = new ModelItems.MappCockpitComponentParameter(mappCockpitComponent, serviceChannel[0].displayName, serviceChannel[0]);
                            ;
                        }
                        // browse and get the request method
                        let serviceMethods = yield opcUaRestServices_1.OpcUaRestServices.browseNodeMethods(this.sessionId, serviceNodeId);
                        let serviceRequest = serviceMethods.filter((parameter) => { return parameter.browseName === "request"; });
                        if (serviceRequest.length === 1) {
                            componentService.request = new ModelItems.MappCockpitComponentMethod(mappCockpitComponent, serviceRequest[0].displayName, serviceRequest[0]);
                        }
                    }
                }
                catch (error) {
                }
                return componentService.request && componentService.infoChannel ? componentService : null;
            });
        }
    };
    MappCockpitDiagnosticProvider = __decorate([
        mco.role()
    ], MappCockpitDiagnosticProvider);
    exports.MappCockpitDiagnosticProvider = MappCockpitDiagnosticProvider;
});
