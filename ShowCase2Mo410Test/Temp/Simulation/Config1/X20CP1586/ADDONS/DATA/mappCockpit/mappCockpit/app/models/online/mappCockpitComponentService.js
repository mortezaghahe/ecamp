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
define(["require", "exports", "../../communication/rest/opcUaRestServices", "../../framework/events"], function (require, exports, opcUaRestServices_1, events_1) {
    "use strict";
    var MappCockpitComponentService_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitComponentService = exports.ComponentServiceRequestType = exports.EventComponentServiceNotification = void 0;
    // declares an event type for a component service notification
    let EventComponentServiceNotification = class EventComponentServiceNotification extends events_1.TypedEvent {
    };
    EventComponentServiceNotification = __decorate([
        mco.role()
    ], EventComponentServiceNotification);
    exports.EventComponentServiceNotification = EventComponentServiceNotification;
    ;
    // declare service request result states
    var ComponentServiceRequestResultState;
    (function (ComponentServiceRequestResultState) {
        ComponentServiceRequestResultState["accepted"] = "accepted";
        ComponentServiceRequestResultState["rejected"] = "rejected";
    })(ComponentServiceRequestResultState || (ComponentServiceRequestResultState = {}));
    /**
     * Declares the response type
     *
     * @export
     * @enum {number}
     */
    var ComponentServiceRequestType;
    (function (ComponentServiceRequestType) {
        ComponentServiceRequestType["changeParameterSet"] = "changeCfg";
    })(ComponentServiceRequestType = exports.ComponentServiceRequestType || (exports.ComponentServiceRequestType = {}));
    /**
     * The class implements an interface for observing component notifications via an info channel and requesting specific internal commands which can eventually result in a matching info channel response.
     *
     * @export
     * @class MappCockpitComponentService
     */
    let MappCockpitComponentService = MappCockpitComponentService_1 = class MappCockpitComponentService {
        constructor() {
            // declares an event source for a component service notification
            this.eventComponentServiceNotification = new EventComponentServiceNotification();
            // holds the info channel object
            this._serviceResponceInfoChannel = null;
            // holds the request method
            this._requestMethod = null;
            // holds a pending request
            this._pendingRequests = new Map();
        }
        /**
         * Gets the info channel property
         *
         * @type {(MappCockpitComponentParameter|null)}
         * @memberof MappCockpitComponentService
         */
        get infoChannel() {
            return this._serviceResponceInfoChannel;
        }
        /**
         * Sets the info channel property
         *
         * @memberof MappCockpitComponentService
         */
        set infoChannel(infoChannelParameter) {
            this._serviceResponceInfoChannel = infoChannelParameter;
        }
        /**
         * Gets the request method
         *
         * @type {(MappCockpitComponentMethod|null)}
         * @memberof MappCockpitComponentService
         */
        get request() {
            return this._requestMethod;
        }
        /**
         * Sets the request method
         *
         * @memberof MappCockpitComponentService
         */
        set request(requestMethod) {
            this._requestMethod = requestMethod;
        }
        /**
         * Gets the pending request info and state
         *
         * @readonly
         * @type {(ComponentServiceRequestResult|null)}
         * @memberof MappCockpitComponentService
         */
        get pendingRequests() {
            return this._pendingRequests;
        }
        /**
         * Retruns true if the the specified request is pending
         *
         * @param {string} requestID
         * @returns {boolean}
         * @memberof MappCockpitComponentService
         */
        requestIsPending(requestID) {
            return this.pendingRequests.has(requestID);
        }
        /**
         * Initializes the service class
         *
         * @memberof MappCockpitComponentService
         */
        initialize() {
        }
        /**
         * Writes the modified parameter values
         *
         * @param {((MappCockpitComponentParameter | undefined)[])} mofifiedParameters
         * @memberof MappCockpitComponentService
         */
        writeParameterSet(mofifiedParameters) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                // get parameters component
                const component = (_a = mofifiedParameters[0]) === null || _a === void 0 ? void 0 : _a.component;
                // get the request method
                if (component && this.request) {
                    // specify the BR request channel id
                    const requestChannelNodeId = component.id + MappCockpitComponentService_1.serviceNodeId;
                    // specify the BR request channel id
                    const requestMethodId = this.request.id;
                    // get the session id
                    const sessionId = component.model._mappCockpitDiagnosticProvider._sessionId;
                    // create request data object 
                    let requestMethodArgs = this.createChangeParameterSetRequestArgs(mofifiedParameters);
                    // call the request
                    try {
                        // execute the request method
                        const result = yield this.executeServiceMethod(sessionId, requestChannelNodeId, requestMethodId, requestMethodArgs);
                        const serviceRequestResult = JSON.parse(result.args.reply);
                        if (serviceRequestResult.status === ComponentServiceRequestResultState.accepted) {
                            // add pending request
                            this.addPendingRequest(serviceRequestResult);
                            // return true to indicate that the request has been invoked successfully.   
                            return true;
                        }
                        else {
                            console.error("MappCockpitComponentService: Could not execute service call!");
                            // return false to indicate that the request has not been invoked successfully.   
                            return false;
                        }
                        console.log(result);
                    }
                    catch (error) {
                        return false;
                    }
                }
                return false;
            });
        }
        /**
         * Adds a request as pending
         *
         * @private
         * @param {ComponentServiceRequestResult} serviceRequestResult
         * @memberof MappCockpitComponentService
         */
        addPendingRequest(serviceRequestResult) {
            this._pendingRequests.set(serviceRequestResult.requestID, serviceRequestResult);
        }
        /**
         * Clears a pending request
         *
         * @private
         * @param {ComponentServiceRequestResult} serviceRequestResult
         * @memberof MappCockpitComponentService
         */
        clearPendingRequest(requestID) {
            this._pendingRequests.delete(requestID);
        }
        /**
         * Executes the specified service method
         *
         * @private
         * @param {*} sessionId
         * @param {string} requestChannelNodeId
         * @param {string} requestMethodId
         * @param {*} requestMethodArgs
         * @memberof MappCockpitComponentService
         */
        executeServiceMethod(sessionId, requestChannelNodeId, requestMethodId, requestMethodArgs) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield opcUaRestServices_1.OpcUaRestServices.executeMethod(sessionId, requestChannelNodeId, requestMethodId, requestMethodArgs);
            });
        }
        /**
         * Creates the method args to specifiy the request method
         *
         * @private
         * @param {((MappCockpitComponentParameter | undefined)[])} mofifiedParameters
         * @returns
         * @memberof MappCockpitComponentService
         */
        createChangeParameterSetRequestArgs(mofifiedParameters) {
            // create the request header
            let parameterSetWriteRequest = {
                requestSender: MappCockpitComponentService_1.serviceSenderId,
                requestType: ComponentServiceRequestType.changeParameterSet,
                requestData: []
            };
            // create the modified parameter list ...
            const modifiedParameterArgs = Array.from(mofifiedParameters.filter((parameter) => { return parameter != undefined; }).map((parameter) => { return { key: parameter.browseName, value: parameter.modifiedValue.toString() }; }));
            // ... and populate the request data
            parameterSetWriteRequest.requestData = modifiedParameterArgs;
            // prepare the request method args by creating an object containing the payload with the stringified JSON request data
            let requestMethodArgs = {
                payload: JSON.stringify(parameterSetWriteRequest),
            };
            return requestMethodArgs;
        }
    };
    // specifies the node id containing the service methods and response channels
    MappCockpitComponentService.serviceNodeId = ".$BrComm";
    // specifies the request sender id
    MappCockpitComponentService.serviceSenderId = "mappCockpitV17";
    MappCockpitComponentService = MappCockpitComponentService_1 = __decorate([
        mco.role()
    ], MappCockpitComponentService);
    exports.MappCockpitComponentService = MappCockpitComponentService;
});
