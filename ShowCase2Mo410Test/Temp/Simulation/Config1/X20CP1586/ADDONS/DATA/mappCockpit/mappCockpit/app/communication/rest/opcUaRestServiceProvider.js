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
define(["require", "exports", "./restService", "../../common/mappCockpitConfig"], function (require, exports, restService_1, mappCockpitConfig_1) {
    "use strict";
    var OpcUaRestServiceProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OpcUaRestServiceProvider = void 0;
    /**
     * Implements the rest service calls for mapp Cockpit
     *
     * @class OpcUaRestServices
     */
    let OpcUaRestServiceProvider = OpcUaRestServiceProvider_1 = class OpcUaRestServiceProvider {
        // specifies the rest service end point url
        getOpcUaRestServiceEndPointUrl() {
            return 'opc.tcp://' + this.opcuaIp + ':' + mappCockpitConfig_1.MappCockpitConfiguration.opcUaPort;
        }
        /**
         *Creates an instance of OpcUaRestServiceProvider.
         * @memberof OpcUaRestServiceProvider
         */
        constructor() {
            // Specifies the mapp Cockpit namespace
            this.mappCockpitOpcUaNamespace = "urn:B&R/Diagnosis/mappCockpit";
            // Specifies the mapp Cockpit componente root node id
            this.mappCockpitRootNodeId = "i=2100";
            // Specifies the component for reading trace data
            this.mappCockpitTraceDataProviderId = "s=NewTraceRecord.MethodSet";
            // Specifies the datapoint name base for reading trace data
            this.mappCockpitTraceDataPointNameId = "s=NewTraceRecord.RecordedDataPointName";
            // Specifies the trgger time name for reading trace data
            this.mappCockpitTraceTriggerTime = "s=NewTraceRecord.TriggerTime";
            this.mappCockpitTraceDataPointCount = 32;
            // Specifies the component for reading trace data
            this.mappCockpitTraceReadDataMethodId = "s=NewTraceRecord.GetRecordedDataArray";
            // specifies the root node id for enum definitions
            this.mappCockpitEnumsId = "ns=0;i=29";
            // specifies the meta info node id
            this.mappCockpitMetaNodeId = "$BrMetaInfo";
            // specifies the namespace prefix string
            this.mappCockpitNamespacePrefix = "ns=";
            // specifies the sampling rate for montitoring items
            this.monitoringSamplingInterval = 100;
            // specifies the service channel id
            this.serviceChannelNodeId = "$BrComm";
            // specifies the opc ua rest services address an set it to localhost. This is necessary to make sure that the rest connection works with NAT.
            this.opcuaIp = '127.0.0.1';
            // specifies the session timeout. The value is set to 0 as a workoround to disable the session timeout until we can provider proper refresh.
            this.opcUaSessionTimeout = 0;
            // holds the rest service provider
            this._restService = new restService_1.RestService();
            this._restService = new restService_1.RestService();
        }
        /**
         * Creates an instance of OpcUaRestServiceProvider.
         * @memberof OpcUaRestServiceProvider
         */
        create() {
            return new OpcUaRestServiceProvider_1();
        }
        /**
         * Activates batching of single request calls.
         *
    
         * @memberof OpcUaRestServices
         */
        activateBatching() {
            // clear existing requests
            this._restService.clearBatchRequests();
            // switch to batch mode
            this._restService.mode = restService_1.RestServiceMode.BATCH;
        }
        /**
         * Executes the collected batch requests since last "activateBatching"
         *
         * @static
         * @returns {Promise<Map<string,any>>}
         * @memberof OpcUaRestServices
         */
        executeBatchRequest() {
            return __awaiter(this, void 0, void 0, function* () {
                let batchRequestResult = new Map();
                if (this._restService.hasBatchRequests()) {
                    // switch back to execution mode 
                    this._restService.mode = restService_1.RestServiceMode.EXECUTE;
                    batchRequestResult = yield this._restService.executeBatchRequest();
                    // executes the batch request populated with the collected list of single requests.
                    batchRequestResult = this.getBatchRequestResult(batchRequestResult);
                    // now we are done and we can clear the requests.
                    this._restService.clearBatchRequests();
                }
                return batchRequestResult;
            });
        }
        /**
         * Retrieves the batch requests result from the response values
         *
         * @private
         * @static
         * @param {*} batchRequestResult
         * @returns
         * @memberof OpcUaRestServices
         */
        getBatchRequestResult(batchRequestResult) {
            // we return the batch result as map requesKey => responseValue
            let batchResultValues = new Map();
            batchRequestResult.responses.forEach(singleRequestResult => {
                batchResultValues.set(singleRequestResult.id, singleRequestResult.body);
            });
            return batchResultValues;
        }
        /**
         * reads access configuration data and sets the base url for the rest services
         *
         * @static
         * @memberof OpcUaRestServices
         */
        getBaseUrl() {
            // get port for RestServiceBaseUrl from mappCockpit config
            return "http://" + location.hostname + ":" + mappCockpitConfig_1.MappCockpitConfiguration.port + "/api/1.0";
        }
        /**
         * Gets the url for reading the opcu local ip address
         *
         * @returns {string}
         * @memberof OpcUaRestServices
         */
        getOpcUaIpUrl() {
            // get resource string for reading the opcua ip address 
            return this.getOpcUaBaseUrl() + "/localip";
        }
        /**
         * gets the base url for opc ua access
         *
         * @returns {string}
         * @memberof OpcUaRestServices
         */
        getOpcUaBaseUrl() {
            return this.getBaseUrl() + "/opcua";
        }
        /**
         * gets the base url for the web socket
         *
         * @public
         * @memberof OpcUaRestServices
         */
        getWsBaseUrl() {
            // get port for RestServiceBaseUrl from mappCockpit config
            return "ws://" + location.hostname + ":" + mappCockpitConfig_1.MappCockpitConfiguration.port + "/api/1.0/pushchannel";
        }
        /**
         * Reads the ip address to be used for opcua services
         *
         * @returns {Promise<string>}
         * @memberof OpcUaRestServices
         */
        readOpcUaLocalIp() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var serviceUrl = this.getOpcUaIpUrl();
                    const result = yield this._restService.call(restService_1.RestServiceType.GET, serviceUrl);
                    this.opcuaIp = result.ip;
                    return this.opcuaIp;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * provides authentifictaion for rest service access
         *
         * @returns {Promise<number>}
         * @memberof OpcUaRestServices
         */
        authenticate() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var serviceUrl = this.getBaseUrl() + '/auth';
                    var result = yield this._restService.call(restService_1.RestServiceType.GET, serviceUrl);
                    return result;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Changes login to the specified user with
         *
         * @param {number} sessionId
         * @param {string} user
         * @param {string} password
         * @returns {Promise<number>}
         * @memberof OpcUaRestServices
         */
        changeUser(sessionId, userInfo) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    //{ username: user, password: password } 
                    var serviceData = { "userIdentityToken": userInfo };
                    const serviceUrl = this.getOpcUaBaseUrl() + '/sessions/' + sessionId;
                    yield this._restService.call(restService_1.RestServiceType.PATCH, serviceUrl, serviceData);
                    // after successfull login we read the users roles
                    let userRoles = yield this.getUserRoles(userInfo);
                    // return user roles as login (change user) result
                    return userRoles.roles;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Reads a users roles
         *
         * @param {{}} userInfo
         * @returns {Promise<{}>}
         * @memberof OpcUaRestServices
         */
        getUserRoles(userInfo) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let headers = this.createUserRoleAccessHeaders(userInfo);
                    const serviceUrl = this.getBaseUrl() + '/rbac/myroles';
                    let userRoles = yield this._restService.call(restService_1.RestServiceType.GET, serviceUrl, null, headers);
                    return userRoles;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Creates the headers for accessing user roles
         *
         * @private
         * @param {{}} userInfo
         * @returns
         * @memberof OpcUaRestServices
         */
        createUserRoleAccessHeaders(userInfo) {
            return {
                "Authorization": "Basic " + btoa(this.encode_utf8(userInfo.username) + ":" + this.encode_utf8(userInfo.password))
            };
        }
        encode_utf8(s) {
            return unescape(encodeURIComponent(s));
        }
        /**
         * Creates a new session
         *
         * @returns {Promise<string>} The created session id
         * @memberof OpcUaRestServices
         */
        createSession() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var serviceUrl = this.getOpcUaBaseUrl() + '/sessions';
                    // create a session with default user access rights and a timeout
                    var serviceData = { "url": this.getOpcUaRestServiceEndPointUrl(), "userIdentityToken": OpcUaRestServiceProvider_1.defaultUser, "timeout": this.opcUaSessionTimeout };
                    var result = yield this._restService.call(restService_1.RestServiceType.POST, serviceUrl, serviceData);
                    return result.id;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Deletes a session
         *
         * @param {number} sessionId Specifies the session to delete.
         * @returns {Promise<number>}
         * @memberof OpcUaRestServices
         */
        deleteSession(sessionId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const serviceUrl = this.getOpcUaBaseUrl() + '/sessions/' + sessionId;
                    yield this._restService.call(restService_1.RestServiceType.DELETE, serviceUrl);
                    return sessionId;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * creates a subscription as a container for opc-ua items to be monitored (observed)
         *
         * @param {number} sessionId
         * @param {number} [interval=100]
         * @param {boolean} [enabled=true]
         * @returns {Promise<string>}
         * @memberof OpcUaRestServices
         */
        createSubscription(sessionId, interval = 50, enabled = true) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // define baes url
                    var serviceUrl = this.getOpcUaBaseUrl() + '/sessions/' + sessionId + '/subscriptions';
                    // define subscrition settings
                    let subscriptionSettings = {
                        publishingInterval: interval,
                        publishingEnabled: enabled
                    };
                    // call the service with the specified parameters            
                    var serviceData = subscriptionSettings;
                    var result = yield this._restService.call(restService_1.RestServiceType.POST, serviceUrl, serviceData);
                    return result.subscriptionId;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * deletes a subscription
         *
         * @param {number} sessionId
         * @param {*} subscriptionId
         * @returns {Promise<string>}
         * @memberof OpcUaRestServices
         */
        deleteSubscription(sessionId, subscriptionId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var serviceUrl = this.getOpcUaBaseUrl() + '/sessions/' + sessionId + '/subscriptions/' + subscriptionId;
                    var serviceData = { "url": this.getOpcUaRestServiceEndPointUrl() };
                    yield this._restService.call(restService_1.RestServiceType.DELETE, serviceUrl, serviceData);
                    return subscriptionId;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * create a monitored item
         *
         * @param {number} sessionId specifies the service session id
         * @param {string} subscriptionId specifies the subscription id
         * @param {string} nodeId specifies the node to be subscribed
         * @param {OpcUaAttribute} specifies the attribute to be scubscribed
         * @returns {Promise<string>}
         * @memberof OpcUaRestServices
         */
        createMonitoredItem(sessionId, subscriptionId, nodeId, itemId, samplingInterval, attribute) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // define baes url
                    var serviceUrl = this.getOpcUaBaseUrl() + '/sessions/' + sessionId + '/subscriptions/' + subscriptionId + '/monitoredItems';
                    // define monitor item settings
                    const monitorItemSettings = {
                        itemToMonitor: {
                            nodeId: nodeId,
                            attribute: attribute
                        },
                        monitoringParameters: {
                            samplingInterval: samplingInterval,
                            queueSize: 0,
                            clientHandle: itemId
                        },
                    };
                    // call the service with the specified parameters            
                    var serviceData = monitorItemSettings;
                    var result = yield this._restService.call(restService_1.RestServiceType.POST, serviceUrl, serviceData);
                    return result;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * deletes a monitored item
         *
         * @param {number} sessionId
         * @param {string} subscriptionId
         * @param {*} monitoredItemId
         * @returns {Promise<string>}
         * @memberof OpcUaRestServices
         */
        deleteMonitoredItem(sessionId, subscriptionId, monitoredItemId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // define baes url
                    var serviceUrl = this.getOpcUaBaseUrl() + '/sessions/' + sessionId + '/subscriptions/' + subscriptionId + '/monitoredItems/' + monitoredItemId;
                    var result = this._restService.call(restService_1.RestServiceType.DELETE, serviceUrl);
                    return result;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
        * Reads the namespace index for mapp Cockpit services
        *
        * @param {number} sessionId
        * @returns {Promise<number>} The index of the namespace
        * @memberof OpcUaRestServices
        */
        getNamespaceIndex(sessionId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var serviceUrl = this.getOpcUaBaseUrl() + '/sessions/' + sessionId + '/namespaces/' + encodeURIComponent(this.mappCockpitOpcUaNamespace);
                    var result = yield this._restService.call(restService_1.RestServiceType.GET, serviceUrl);
                    return result.index;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Browses the child nodes of the specified parent node
         *
         * @param {number} sessionId
         * @param {string} parentNodeId
         * @returns {Promise<any>}
         * @memberof OpcUaRestServices
         */
        browseNodes(sessionId, parentNodeId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var serviceUrl = this.getOpcUaBaseUrl() + '/sessions/' + sessionId + '/nodes/' + encodeURIComponent(parentNodeId) + '/references';
                    var result = yield this._restService.call(restService_1.RestServiceType.GET, serviceUrl);
                    // in execution mode we take the and update the browsed node names
                    if (this._restService.mode === restService_1.RestServiceMode.EXECUTE) {
                        // Remove NamespaceIndex from browseName
                        result.references.forEach(reference => {
                            let startIndex = reference.browseName.indexOf('"', 0);
                            startIndex++;
                            let endIndex = reference.browseName.indexOf('"', startIndex);
                            reference.browseName = reference.browseName.substr(startIndex, endIndex - startIndex);
                        });
                    }
                    // in execution mode we return the references , in batch mode just the request settings.
                    return this._restService.mode === restService_1.RestServiceMode.EXECUTE ? result.references : result;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * browses the meta info for a component
         *
         * @param {number} sessionId
         * @param {string} nodeId
         * @returns {Promise<Array<Rest.InterfaceOpcUaRestResultNodeReference>>}
         * @memberof OpcUaRestServices
         */
        browseNodeMetaInfo(sessionId, nodeId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let metaInfoReferences = undefined;
                    // read the child nodes
                    let childNodes = yield this.browseNodes(sessionId, nodeId);
                    // check if the child nodes contain a meta node
                    let metaNodes = childNodes.filter((childNode) => { return childNode.browseName === this.mappCockpitMetaNodeId; });
                    if (metaNodes.length === 1) {
                        // Add the sub node id for parameter.
                        let metaNode = metaNodes[0];
                        // Browse the meta info nodes
                        metaInfoReferences = yield this.browseNodes(sessionId, metaNode.nodeId);
                        if (metaInfoReferences) {
                            // retrieve valid meta nodes
                            metaInfoReferences = yield this.browseNodeMetaInfoValues(metaInfoReferences, sessionId);
                        }
                    }
                    return metaInfoReferences;
                }
                catch (error) {
                    throw error;
                }
            });
        }
        /**
         * Browses and updates the meta info values
         *
         * @private
         * @param {Rest.InterfaceOpcUaRestResultNodeReference[]} metaInfoReferences
         * @param {number} sessionId
         * @returns
         * @memberof OpcUaRestServices
         */
        browseNodeMetaInfoValues(metaInfoReferences, sessionId) {
            return __awaiter(this, void 0, void 0, function* () {
                metaInfoReferences = metaInfoReferences.filter((parameter) => { return parameter.nodeClass === "Variable"; });
                // read meta info values
                let readMetaInfoValuesResult = yield this.readMetaInfoValues(metaInfoReferences, sessionId);
                // assign meta info values
                this.updateMetaInfoValues(readMetaInfoValuesResult, metaInfoReferences);
                return metaInfoReferences;
            });
        }
        /**
         * Updates hte meta info values
         *
         * @private
         * @param {*} readMetaInfoValuesResult
         * @param {Rest.InterfaceOpcUaRestResultNodeReference[]} metaInfoReferences
         * @memberof OpcUaRestServices
         */
        updateMetaInfoValues(readMetaInfoValuesResult, metaInfoReferences) {
            for (let i = 0; i < readMetaInfoValuesResult.responses.length; i++) {
                // get meta info value
                const metaInfoValue = readMetaInfoValuesResult.responses[i].body.value;
                // get response id
                const responseId = readMetaInfoValuesResult.responses[i].id;
                // assign meta info value to corresponding meta value object
                metaInfoReferences[responseId].value = metaInfoValue;
            }
        }
        /**
         * Reads the meta info values
         *
         * @private
         * @param {Rest.InterfaceOpcUaRestResultNodeReference[]} metaInfoReferences
         * @param {number} sessionId
         * @returns
         * @memberof OpcUaRestServices
         */
        readMetaInfoValues(metaInfoReferences, sessionId) {
            return __awaiter(this, void 0, void 0, function* () {
                // activate batch mode
                this._restService.mode = restService_1.RestServiceMode.BATCH;
                let readMetaInfoValuesRequests = [];
                // create requests for reading the meta info nodes/values
                for (let i = 0; i < metaInfoReferences.length; i++) {
                    readMetaInfoValuesRequests.push(yield this.readNodeAttribute(sessionId, metaInfoReferences[i].nodeId));
                }
                // eterminate batch mode and excute batch request
                this._restService.mode = restService_1.RestServiceMode.EXECUTE;
                let readMetaInfoValuesResult = yield this.callBatchRequest(readMetaInfoValuesRequests);
                return readMetaInfoValuesResult;
            });
        }
        /**
         * Browses the parameters of the specified node
         *
         * @param {number} sessionId
         * @param {string} nodeId
         * @returns {Promise<Array<Rest.InterfaceOpcUaRestResultNodeReference>>}
         * @memberof OpcUaRestServices
         */
        browseNodeParameters(sessionId, nodeId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Browse the parameter set and extract variable types only.
                    var parameterReferences = yield this.browseNodes(sessionId, nodeId);
                    var valueParameterReferences = parameterReferences.filter((parameter) => { return parameter.nodeClass === "Variable"; });
                    return valueParameterReferences;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Browses the parameter set of a node if any.
         *
         * @param {number} sessionId
         * @param {string} nodeId
         * @returns {Promise<Array<OpcUaNodeReferenceInterface>>} The paremeter references
         * @memberof OpcUaRestServices
         */
        browseNodeParameterSet(sessionId, nodeId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Add the sub node id for parameter.
                    nodeId += ".ParameterSet";
                    // Browse the parameter set and extract variable types only.
                    var parameterReferences = (yield this.browseNodes(sessionId, nodeId));
                    var valueParameterReferences = parameterReferences.filter((parameter) => { return parameter.nodeClass === "Variable"; });
                    return valueParameterReferences;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Reads the specified node attribute
         *
         * @param {number} sessionId
         * @param {string} nodeId
         * @param {*} attribute
         * @param {*} OpcUaAttribute
         * @returns {Promise<any>}
         * @memberof OpcUaRestServices
         */
        readNodeAttribute(sessionId, nodeId, attribute = OpcUaAttribute.VALUE) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var serviceUrl = this.getOpcUaBaseUrl() + '/sessions/' + sessionId + '/nodes/' + encodeURIComponent(nodeId) + '/attributes/' + attribute;
                    var restServiceResult = (yield this._restService.call(restService_1.RestServiceType.GET, serviceUrl));
                    return this._restService.mode === restService_1.RestServiceMode.EXECUTE ? restServiceResult.value : restServiceResult;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Writes the node attribute
         *
         * @param {number} sessionId
         * @param {string} nodeId
         * @param {OpcUaAttribute} [attribute=OpcUaAttribute.VALUE]
         * @param {*} value
         * @returns {Promise<any>}
         * @memberof OpcUaRestServices
         */
        writeNodeAttribute(sessionId, nodeId, attribute = OpcUaAttribute.VALUE, value) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let valueData = value;
                    if (attribute === OpcUaAttribute.VALUE) {
                        valueData = { "value": value };
                    }
                    var serviceUrl = this.getOpcUaBaseUrl() + '/sessions/' + sessionId + '/nodes/' + encodeURIComponent(nodeId) + '/attributes/' + attribute;
                    yield this._restService.call(restService_1.RestServiceType.PUT, serviceUrl, valueData);
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Browses the methods pf the specifed node
         *
         * @param {number} sessionId
         * @param {string} nodeId
         * @returns {Promise<Array<Rest.InterfaceOpcUaRestResultNodeReference>>}
         * @memberof OpcUaRestServices
         */
        browseNodeMethods(sessionId, nodeId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Browse the method set.
                    var methodReferences = (yield this.browseNodes(sessionId, nodeId)).filter((method) => { return method.nodeClass === "Method"; });
                    return methodReferences;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Browses the method set of a node if any.
         *
         * @param {number} sessionId
         * @param {string} nodeId
         * @returns {Promise<Array<OpcUaNodeReferenceInterface>>}
         * @memberof OpcUaRestServices
         */
        browseNodeMethodSet(sessionId, nodeId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Add the sub node id for methods.
                    nodeId += ".MethodSet";
                    // Browse the method set.
                    var methodReferences = (yield this.browseNodes(sessionId, nodeId)).filter((method) => { return method.nodeClass === "Method"; });
                    return methodReferences;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Reads the input parameters of a method
         *
         * @param {number} sessionId
         * @param {string} nodeId
         * @returns {Promise<any>}
         * @memberof OpcUaRestServices
         */
        readMethodParameters(sessionId, nodeId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Add the sub node id for method parameters.
                    nodeId += "#InputArguments";
                    // Browse the input arguments
                    var inputArguments = (yield this.readNodeAttribute(sessionId, nodeId, OpcUaAttribute.VALUE));
                    return inputArguments;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Create and call a json batch request
         *
         * @param {JQuery.AjaxSettings<any>[]} restRequests
         * @memberof OpcUaRestServices
         */
        callBatchRequest(restRequests) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._restService.callBatchRequest(this.getOpcUaBaseUrl(), restRequests);
            });
        }
        /**
         * Executes the specified method
         *
         * @template T_METHOD_RESULT
         * @param {number} sessionId
         * @param {string} nodeId
         * @param {string} methodId
         * @param {*} methodArgs
         * @returns {Promise<T_METHOD_RESULT>}
         * @memberof OpcUaRestServices
         */
        executeMethod(sessionId, nodeId, methodId, methodArgs) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var serviceUrl = this.getOpcUaBaseUrl() + '/sessions/' + sessionId + '/nodes/' + encodeURIComponent(nodeId) + '/methods/' + encodeURIComponent(methodId);
                    var result = yield this._restService.call(restService_1.RestServiceType.POST, serviceUrl, methodArgs);
                    return result;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Filters the nodes to be displayed in mapp cockpit
         *
         * @param {Array<Rest.InterfaceOpcUaRestResultNodeReference>} opcUaNodes
         * @param {string} mappCockpitNamespace
         * @returns
         * @memberof OpcUaRestServices
         */
        filterMappCockpitNodes(opcUaNodes, mappCockpitNamespace) {
            return opcUaNodes.filter((nodeReference) => {
                var isChildNode = nodeReference.isForward === true;
                // check if the node is within the mapp cockpit namespace
                var isMappComponent = nodeReference.typeDefinition.indexOf(mappCockpitNamespace) > -1;
                return isChildNode && isMappComponent;
            });
        }
    };
    // specifies the default user settings
    OpcUaRestServiceProvider.defaultUser = { username: "Anonymous", password: "" };
    OpcUaRestServiceProvider = OpcUaRestServiceProvider_1 = __decorate([
        mco.role()
    ], OpcUaRestServiceProvider);
    exports.OpcUaRestServiceProvider = OpcUaRestServiceProvider;
    /**
     * Defines OpcUa Attribute names.
     *
     * @enum {number}
     */
    var OpcUaAttribute;
    (function (OpcUaAttribute) {
        OpcUaAttribute["VALUE"] = "Value";
        OpcUaAttribute["DATA_TYPE"] = "DataType";
        OpcUaAttribute["BROWSE_NAME"] = "BrowseName";
        OpcUaAttribute["DISPLAY_NAME"] = "DisplayName";
        OpcUaAttribute["DESCRIPTION"] = "Description";
        OpcUaAttribute["USER_ACCESS_LEVEL"] = "UserAccessLevel";
    })(OpcUaAttribute || (OpcUaAttribute = {}));
    /**
     * Specifies access levels ( as bit flags )
     *
     * @enum {number}
     */
    var OpcUaAccessLevel;
    (function (OpcUaAccessLevel) {
        OpcUaAccessLevel[OpcUaAccessLevel["CurrentRead"] = 1] = "CurrentRead";
        OpcUaAccessLevel[OpcUaAccessLevel["CurrentWrite"] = 2] = "CurrentWrite";
        OpcUaAccessLevel[OpcUaAccessLevel["HistoryRead"] = 4] = "HistoryRead";
        OpcUaAccessLevel[OpcUaAccessLevel["HistoryWrite"] = 8] = "HistoryWrite";
        OpcUaAccessLevel[OpcUaAccessLevel["SemanticChange"] = 16] = "SemanticChange";
        OpcUaAccessLevel[OpcUaAccessLevel["StatusWrite"] = 32] = "StatusWrite";
        OpcUaAccessLevel[OpcUaAccessLevel["TimestampWrite"] = 64] = "TimestampWrite";
        OpcUaAccessLevel[OpcUaAccessLevel["Reserved"] = 128] = "Reserved";
    })(OpcUaAccessLevel || (OpcUaAccessLevel = {}));
});
