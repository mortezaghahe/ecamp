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
define(["require", "exports", "./opcUaRestServices", "./restService"], function (require, exports, opcUaRestServices_1, restService_1) {
    "use strict";
    var TextSystemRestServices_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextSystemRestServices = void 0;
    /**
     * Provides Text system access rest services
     *
     * @export
     * @class TextSystemRestServices
     */
    let TextSystemRestServices = TextSystemRestServices_1 = class TextSystemRestServices {
        /**
         * Gets the base url for text system requests
         *
         * @static
         * @returns {string}
         * @memberof TextSystemRestServices
         */
        static getTextSystemBaseUrl() {
            return opcUaRestServices_1.OpcUaRestServices.getBaseUrl() + TextSystemRestServices_1.textSystem;
        }
        /**
         * Gets the available languages as id's
         *
         * @static
         * @returns {Promise<any>}
         * @memberof TextSystemRestServices
         */
        static getLanguages() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var textResource = yield this.getTextResource(TextSystemRestServices_1.resIdLanguages);
                    return textResource.languageIds;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Gets the default language as id
         *
         * @static
         * @returns {Promise<Array<string>>}
         * @memberof TextSystemRestServices
         */
        static getDefaultLanguage() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var textResource = yield this.getTextResource(TextSystemRestServices_1.resIdDefaultLanguage);
                    return textResource.defaultLanguageId;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Gets all text resources contained in the specified namespace
         *
         * @static
         * @param {string} languageId
         * @param {string} namespace
         * @returns {Promise<Array<string>>}
         * @memberof TextSystemRestServices
         */
        static getNamespaceTextItems(languageId, namespace) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var namespaceTextResources = yield this.getTextResource(languageId + '/' + encodeURIComponent(namespace));
                    // convert the plain object into regular map (textKey -> textValue)
                    const namespaceTextItems = new Map(Object.entries(namespaceTextResources));
                    return namespaceTextItems;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Gets a single text item form the specifiedlanguage and namespace
         *
         * @static
         * @param {string} languageId
         * @param {string} namespace
         * @param {string} textId
         * @returns  Promise<string>
         * @memberof TextSystemRestServices
         */
        static getText(languageId, namespace, textId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var namespaceTextItem = yield this.getTextResource(languageId + '/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(textId));
                    return namespaceTextItem[textId];
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Reads a text resource from the textsystem specified by the resource id
         *
         * @static
         * @param {string} textResourceId
         * @returns {Promise<any>}
         * @memberof TextSystemRestServices
         */
        static getTextResource(textResourceId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var serviceUrl = this.getTextSystemBaseUrl() + textResourceId;
                    var result = yield this._restService.call(restService_1.RestServiceType.GET, serviceUrl);
                    return result;
                }
                catch (error) {
                    throw new Error(error);
                }
            });
        }
        /**
         * Connects the textsystem
         *
         * @static
         * @param {number} sessionId
         * @memberof OpcUaRestServices
         */
        static connectTextSystem() {
            return __awaiter(this, void 0, void 0, function* () {
                // stub for text system initialization    
            });
        }
    };
    // declares the base url for text system rest services
    TextSystemRestServices.textSystem = '/text/';
    TextSystemRestServices.resIdLanguages = '/languages/';
    TextSystemRestServices.resIdDefaultLanguage = '/languages/default/';
    // holds the rest service provider
    TextSystemRestServices._restService = new restService_1.RestService();
    TextSystemRestServices = TextSystemRestServices_1 = __decorate([
        mco.role()
    ], TextSystemRestServices);
    exports.TextSystemRestServices = TextSystemRestServices;
});
