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
define(["require", "exports", "../../communication/rest/opcUaRestServices", "../online/mappCockpitComponent", "./mappCockpitComponentParameterProvider", "./mappCockpitComponentMethodProvider"], function (require, exports, opcUaRestServices_1, ModelItems, mappCockpitComponentParameterProvider_1, mappCockpitComponentMethodProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitComponentProvider = void 0;
    /**
     * Implements component access services
     *
     * @class MappCockpitComponentProvider
     */
    let MappCockpitComponentProvider = class MappCockpitComponentProvider {
        constructor(diagnosticProvider) {
            this._diagnosticProvider = diagnosticProvider;
            this._parameterProvider = new mappCockpitComponentParameterProvider_1.MappCockpitComponentParameterProvider(diagnosticProvider);
            this._methodProvider = new mappCockpitComponentMethodProvider_1.MappCockpitComponentMethodProvider(diagnosticProvider, this._parameterProvider);
        }
        /**
         * Browses the available mapp cockpit components
         *
         * @private
         * @param {number} sessionId
         * @param {number} namespaceIndex
         * @param {MappCockpitComponentDataModel} mappCockpitComponentDataModel
         * @memberof MappCockpitComponentProvider
         */
        browseComponents() {
            return __awaiter(this, void 0, void 0, function* () {
                // Read components
                let allComponents = (yield opcUaRestServices_1.OpcUaRestServices.browseNodes(this._diagnosticProvider.sessionId, this._diagnosticProvider.namespace + ";" + opcUaRestServices_1.OpcUaRestServices.mappCockpitRootNodeId));
                var filteredMappCockpitComponents = opcUaRestServices_1.OpcUaRestServices.filterMappCockpitNodes(allComponents, this._diagnosticProvider.namespace);
                // Convert the references to model items
                let mappCockpitComponents = filteredMappCockpitComponents.map((mappCockpitComponentRef) => {
                    return new ModelItems.MappCockpitComponent(null, mappCockpitComponentRef.displayName, mappCockpitComponentRef);
                });
                return mappCockpitComponents;
            });
        }
        /**
         * browses the available meta information for a component
         *
         * @param {ModelItems.MappCockpitComponent} mappCockpitComponent
         * @returns {Promise<ModelItems.MappCockpitComponentParameter[]>}
         * @memberof MappCockpitComponentProvider
         */
        browseComponentMetaInfo(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                // Read component parameters.
                var metaInfoReferences = yield opcUaRestServices_1.OpcUaRestServices.browseNodeMetaInfo(this._diagnosticProvider.sessionId, mappCockpitComponent.id);
                return metaInfoReferences;
            });
        }
        /**
         * Browses the parameters of a component
         *
         * @private
         * @param {MappCockpitComponent} mappCockpitComponent
         * @returns
         * @memberof MappCockpitComponentProvider
         */
        browseComponentParameters(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._parameterProvider.browseComponentParameters(mappCockpitComponent);
            });
        }
        /**
         * updates parameter data types
         *
         * @param {any[]} parameters
         * @returns {Promise<any>}
         * @memberof MappCockpitComponentProvider
         */
        updateParameterDataTypes(parameters) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._parameterProvider.updateParameterDataTypes(parameters);
            });
        }
        /**
         * reads a parameters value and updates the parameters value if specified
         *
         * @param {ModelItems.MappCockpitComponentParameter} componentParameter
         * @param {boolean} [update=true] updates the parameters value if true
         * @returns
         * @memberof MappCockpitComponentProvider
         */
        readComponentParameterValue(componentParameter, update = true) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._parameterProvider.readComponentParameterValue(componentParameter, update);
            });
        }
        /**
         * writes a parameter value
         *
         * @param {ModelItems.MappCockpitComponentParameter} componentParameter
         * @returns
         * @memberof MappCockpitComponentProvider
         */
        writeComponentParameterValue(componentParameter) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._parameterProvider.writeComponentParameterValue(componentParameter);
            });
        }
        /**
         * Browses the methods of a component
         *
         * @private
         * @param {ModelItems.MappCockpitComponent} mappCockpitComponent
         * @memberof MappCockpitComponentProvider
         */
        browseComponentMethods(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._methodProvider.browseComponentMethods(mappCockpitComponent);
            });
        }
        /**
         * executes a component method
         *
         * @param {MappCockpitComponentMethod} mappCockpitComponentMethod
         * @returns {*}
         * @memberof MappCockpitComponentProvider
         */
        executeComponentMethod(mappCockpitComponentMethod) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._methodProvider.executeComponentMethod(mappCockpitComponentMethod);
            });
        }
        /**
         * Browses the component method parameters
         *
         * @private
         * @param {ModelItems.MappCockpitComponent} mappCockpitComponent
         * @memberof MappCockpitComponentProvider
         */
        browseComponentMethodParameters(mappCockpitComponentMethods) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._methodProvider.browseComponentMethodParameters(mappCockpitComponentMethods);
            });
        }
        /**
         * updates method parameter data types
         *
         * @param {MappCockpitComponentMethod[]} methods
         * @returns {*}
         * @memberof MappCockpitComponentProvider
         */
        updateMethodParameterDataTypes(methods) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this._methodProvider.updateMethodParameterDataTypes(methods);
            });
        }
    };
    MappCockpitComponentProvider = __decorate([
        mco.role()
    ], MappCockpitComponentProvider);
    exports.MappCockpitComponentProvider = MappCockpitComponentProvider;
});
