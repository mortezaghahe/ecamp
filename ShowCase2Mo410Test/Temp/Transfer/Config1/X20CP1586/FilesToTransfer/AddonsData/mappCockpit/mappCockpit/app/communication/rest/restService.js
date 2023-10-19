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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RestRequestInfo = exports.RestServiceMode = exports.RestServiceType = exports.RestService = void 0;
    /**
     * Declares supported rest service types
     *
     * @enum {number}
     */
    var RestServiceType;
    (function (RestServiceType) {
        RestServiceType["POST"] = "POST";
        RestServiceType["DELETE"] = "DELETE";
        RestServiceType["GET"] = "GET";
        RestServiceType["PUT"] = "PUT";
        RestServiceType["PATCH"] = "PATCH";
        RestServiceType["Undefined"] = "";
    })(RestServiceType || (RestServiceType = {}));
    exports.RestServiceType = RestServiceType;
    var RestServiceMode;
    (function (RestServiceMode) {
        RestServiceMode[RestServiceMode["EXECUTE"] = 0] = "EXECUTE";
        RestServiceMode[RestServiceMode["BATCH"] = 1] = "BATCH";
    })(RestServiceMode || (RestServiceMode = {}));
    exports.RestServiceMode = RestServiceMode;
    /**
     * Provides a single batch request info
     *
     * @class BatchRequestInfo
     */
    let BatchRequestInfo = class BatchRequestInfo {
        get id() {
            return this._id;
        }
        get method() {
            return this._method;
        }
        get body() {
            return this._body;
        }
        get url() {
            return this._url;
        }
        /**
         * Constructs an instance of BatchRequestInfo.
         * @param {number} id
         * @param {(string|undefined)} method
         * @param {string} url
         * @param {string} body
         * @memberof BatchRequestInfo
         */
        constructor(id, method, url, body) {
            this._id = id;
            this._method = method;
            this._url = url;
            this._body = body;
        }
        /**
     * Creates an instance of BatchRequestInfo.
     * @param {number} id
    * @param {(string|undefined)} method
     * @param {string} url
     * @param {string} body
     * @memberof BatchRequestInfo
     */
        static create(id, method, url, body) {
            // create the single batch object
            let singleBatchRequest = {
                id: id,
                method: method,
                url: url,
            };
            // add body data if defined
            if (body) {
                singleBatchRequest.body = body;
                singleBatchRequest.headers = { "Content-Type": "application/json" };
            }
            return singleBatchRequest;
        }
    };
    BatchRequestInfo = __decorate([
        mco.role()
    ], BatchRequestInfo);
    /**
     * Provides rest request info
     *
     * @class RestRequest
     */
    let RestRequestInfo = class RestRequestInfo {
        /**
         * Creates an instance of RestRequest.
         * @param {JQuery.AjaxSettings<any>} settings
         * @memberof RestRequest
         */
        constructor(settings) {
            this._settings = {};
            this._settings = settings;
        }
        /**
         * Gets the rest request settings
         *
         * @readonly
         * @type {JQuery.AjaxSettings<any>}
         * @memberof RestRequest
         */
        get settings() {
            return this._settings;
        }
    };
    RestRequestInfo = __decorate([
        mco.role()
    ], RestRequestInfo);
    exports.RestRequestInfo = RestRequestInfo;
    /**
     * Implements a basic rest service call
     *
     * @class RestService
     */
    let RestService = class RestService {
        /**
         *Creates an instance of RestService.
         * @memberof RestService
         */
        constructor() {
            // specifies the service mode
            this.mode = RestServiceMode.EXECUTE;
            // holds rest request settings for batch mode
            this._batchRequests = [];
        }
        /**
         * Returns if the service has pending requests
         *
         * @returns
         * @memberof RestService
         */
        hasBatchRequests() {
            return this._batchRequests.length > 0;
        }
        call(serviceType, serviceUrl, serviceData = null, serviceHeaders = null) {
            return __awaiter(this, void 0, void 0, function* () {
                // create the basic request descriptor
                let restRequest = this.createRequest(serviceType, serviceUrl, serviceData, serviceHeaders);
                // create promise for the rest request
                const restServicePromise = this.createRestRequestPromise(restRequest);
                // attach the request info to the promise
                restServicePromise.restRequestInfo = restRequest;
                // return just the request info or wait for executing the requuest
                return restServicePromise;
            });
        }
        /**
         * Clears the list of requets.
         *
         * @memberof RestService
         */
        clearBatchRequests() {
            this._batchRequests = [];
        }
        /**
         * Executes the batch request specfied by the request collection
         *
         * @returns {Promise<any>}
         * @memberof RestService
         */
        executeBatchRequest() {
            return __awaiter(this, void 0, void 0, function* () {
                const batchResponse = yield this.callBatchRequest("", this._batchRequests);
                return batchResponse;
            });
        }
        /**
         * calls a batch request
         *
         * @template T
         * @param {JQuery.AjaxSettings<any>[]} restRequests
         * @memberof RestService
         */
        callBatchRequest(batchServiceBaseUrl, serviceRequests) {
            return __awaiter(this, void 0, void 0, function* () {
                // calculate the base url in common for all requets
                batchServiceBaseUrl = this.getBatchRequestBaseUrl(serviceRequests);
                // create the batch list
                let batchRequests = { requests: this.createBatchRequestsData(serviceRequests, batchServiceBaseUrl) };
                // create the batch request
                let batchRequest = this.createRequest(RestServiceType.POST, batchServiceBaseUrl + '/$batch', batchRequests);
                // create promise for the rest batch request
                const restBatchServicePromise = this.createRestRequestPromise(batchRequest);
                // return just the request info or wait for executing the requuest
                return restBatchServicePromise;
            });
        }
        /**
         * Creates and initializes the batch requests from the original single requests
         *
         * @private
         * @param {RestRequestInfo[]} serviceRequests
         * @param {string} batchServiceBaseUrl
         * @returns
         * @memberof RestService
         */
        createBatchRequestsData(serviceRequests, batchServiceBaseUrl) {
            // build the batch requests
            let batchRequests = this.buildBatchRequests(serviceRequests, batchServiceBaseUrl);
            return batchRequests;
        }
        /**
         *
         *
         * @private
         * @param {RestRequestInfo[]} serviceRequests
         * @param {string} batchServiceBaseUrl
         * @returns
         * @memberof RestService
         */
        buildBatchRequests(serviceRequests, batchServiceBaseUrl) {
            let batchRequests = [];
            for (let i = 0; i < serviceRequests.length; i++) {
                const serviceRequest = serviceRequests[i];
                if (serviceRequest.settings.url) {
                    // remove the base url from the single request url
                    let singleRequestUrl = serviceRequest.settings.url.replace(batchServiceBaseUrl, "");
                    // extract service data
                    let requestData = serviceRequest.settings.data ? JSON.parse(serviceRequest.settings.data) : undefined;
                    batchRequests.push(BatchRequestInfo.create(i, serviceRequest.settings.type, singleRequestUrl, requestData));
                }
            }
            return batchRequests;
        }
        /**
         * Calculates the base url which is the same for all requests
         *
         * @param {RestRequestInfo[]} serviceRequests
         * @returns {string}
         * @memberof RestService
         */
        getBatchRequestBaseUrl(serviceRequests) {
            // retrieve request urls
            var requestUrls = serviceRequests.map((request) => request.settings.url).filter((url) => { return url !== undefined; });
            // split th urls into their parts
            var requestUrlsSplitted = requestUrls.map((requestUrl) => requestUrl.split("/"));
            // search for the base url in common for all requests
            var baseUrlDepth = -1;
            var baseUrlFound = false;
            while (!baseUrlFound) {
                // increase the url depth
                baseUrlDepth++;
                // iterate through all request urls ...
                for (let i = 0; i < requestUrlsSplitted.length; i++) {
                    // and check if the base url depth exeeds any single url depth or any of the url parts is deifferent.
                    if (baseUrlDepth >= requestUrlsSplitted[i].length || requestUrlsSplitted[i][baseUrlDepth] != requestUrlsSplitted[0][baseUrlDepth]) {
                        // we ar done with sreaching because the exit criteria is met.
                        baseUrlFound = true;
                        break;
                    }
                }
            }
            // build the base path based und the calculated depth and the first request
            var batchBaseUrl = "";
            for (let i = 0; i < baseUrlDepth; i++) {
                batchBaseUrl += requestUrlsSplitted[0][i] + "/";
            }
            // remove last "/"
            batchBaseUrl = batchBaseUrl.slice(0, batchBaseUrl.length - 1);
            return batchBaseUrl;
        }
        /**
         * Creates a promise enclosing the rest request
         *
         * @private
         * @param {RestRequestInfo} restRequest
         * @returns
         * @memberof RestService
         */
        createRestRequestPromise(restRequest) {
            return new Promise((resolve, reject) => {
                if (this.mode == RestServiceMode.EXECUTE) {
                    // execute the rest service
                    // attach the callback functions to the promise callbacks
                    restRequest.settings.success = resolve;
                    restRequest.settings.error = reject;
                    // execute rest request
                    $.ajax(restRequest.settings);
                }
                else if (this.mode == RestServiceMode.BATCH) {
                    // in batch mode we just collect the requests ....
                    this._batchRequests.push(restRequest);
                    // in batch mode rest request info is returned as result. This allows accumulating multiple requests to be executed within a batch request call.
                    resolve(restRequest);
                }
            });
        }
        /**
         * Creates the basic ajax request info
         *
         * @private
         * @param {RestServiceType} serviceType
         * @param {string} serviceUrl
         * @param {(value?: any) => void} resolve
         * @param {(reason?: any) => void} reject
         * @returns {(JQuery.AjaxSettings<any> | undefined)}
         * @memberof RestService
         */
        createRequest(serviceType, serviceUrl, serviceData = null, serviceHeaders = null) {
            // create and initialize the service request object
            let restRequest = {
                type: serviceType,
                url: serviceUrl,
                xhrFields: {
                    withCredentials: true
                },
                dataType: 'json',
                contentType: 'application/json',
            };
            // set request data if defined
            if (serviceData) {
                restRequest.data = JSON.stringify(serviceData);
            }
            // set headers if defined
            if (serviceHeaders) {
                restRequest.headers = serviceHeaders;
            }
            return new RestRequestInfo(restRequest);
        }
    };
    RestService = __decorate([
        mco.role()
    ], RestService);
    exports.RestService = RestService;
});
