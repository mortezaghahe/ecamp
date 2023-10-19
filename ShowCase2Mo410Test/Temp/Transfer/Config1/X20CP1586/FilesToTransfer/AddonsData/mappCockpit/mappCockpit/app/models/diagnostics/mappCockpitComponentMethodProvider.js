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
define(["require", "exports", "../../communication/rest/opcUaRestServices", "../online/mappCockpitComponent", "../online/mappCockpitComponentReflection", "./mappCockpitComponentParameterProvider"], function (require, exports, opcUaRestServices_1, ModelItems, mappCockpitComponentReflection_1, mappCockpitComponentParameterProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitComponentMethodProvider = void 0;
    /**
     * Implements component method access services
     *
     * @export
     * @class MappCockpitComponentMethodProvider
     */
    let MappCockpitComponentMethodProvider = class MappCockpitComponentMethodProvider {
        /**
         * Creates an instance of MappCockpitComponentMethodProvider.
         * @param {MappCockpitDiagnosticProvider} diagnosticProvider
         * @memberof MappCockpitComponentMethodProvider
         */
        constructor(diagnosticProvider, parameterProvider) {
            this._diagnosticProvider = diagnosticProvider;
            this._parameterProvider = new mappCockpitComponentParameterProvider_1.MappCockpitComponentParameterProvider(diagnosticProvider);
        }
        /**
     * Browses the methods of a component
     *
     * @private
     * @param {ModelItems.MappCockpitComponent} mappCockpitComponent
     * @memberof MappCockpitComponentMethodProvider
     */
        browseComponentMethods(mappCockpitComponent) {
            return __awaiter(this, void 0, void 0, function* () {
                var methodSet = yield opcUaRestServices_1.OpcUaRestServices.browseNodeMethodSet(this._diagnosticProvider.sessionId, mappCockpitComponent.id);
                let componentMethods = new Array();
                for (let i = 0; i < methodSet.length; i++) {
                    try {
                        var componentMethod = methodSet[i];
                        let mappCockpitComponentMethod = new ModelItems.MappCockpitComponentMethod(mappCockpitComponent, componentMethod.displayName, componentMethod);
                        componentMethods.push(mappCockpitComponentMethod);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                mappCockpitComponent.methods = componentMethods;
                return mappCockpitComponent.methods;
            });
        }
        /**
         * Browses the component method parameters
         *
         * @private
         * @param {ModelItems.MappCockpitComponent} mappCockpitComponent
         * @memberof MappCockpitComponentMethodProvider
         */
        browseComponentMethodParameters(mappCockpitComponentMethods) {
            return __awaiter(this, void 0, void 0, function* () {
                let methodInputParameterReadRequest = [];
                mappCockpitComponentMethods.forEach((mappCockpitComponentMethod) => { methodInputParameterReadRequest.push(this.readMethodInputParameters(mappCockpitComponentMethod)); });
                let methodInputParameters = yield Promise.all(methodInputParameterReadRequest);
                return methodInputParameters;
            });
        }
        /**
         * Read input parameters for a component method
         *
         * @private
         * @param {MappCockpitComponentMethod} componentMethod
         * @returns {Promise<ModelItems.MappCockpitMethodParameter[]>}
         * @memberof MappCockpitComponentProvider
         */
        readMethodInputParameters(componentMethod) {
            return __awaiter(this, void 0, void 0, function* () {
                // clear current input parameters
                componentMethod.inputParameters = [];
                try {
                    // read the methods input parameters
                    var inputParameters = yield opcUaRestServices_1.OpcUaRestServices.readMethodParameters(this._diagnosticProvider.sessionId, componentMethod.id);
                    // create the method input parameter lsit
                    let componentMethodInputParameters = inputParameters.map((inputParameter) => { return new ModelItems.MappCockpitMethodParameter(componentMethod, inputParameter.name, inputParameter); });
                    // update the methods parameter list
                    componentMethod.inputParameters = componentMethodInputParameters;
                }
                catch (error) {
                    console.error("MappCockpitComponentProvider: Could not read method input parameters for %o ", componentMethod);
                }
                // return the methods input parameters
                return componentMethod.inputParameters;
            });
        }
        /**
         * reads and updates method parameter enums
         *
         * @param {ModelItems.MappCockpitComponentMethod[]} methods
         * @returns {*}
         * @memberof MappCockpitComponentMethodProvider
         */
        readMethodParameterEnums(methods) {
            let metaData = methods[0].component.metaData;
            for (let i = 0; i < methods.length; i++) {
                const method = methods[i];
                if (method.inputParameters.length > 0) {
                    mappCockpitComponentReflection_1.MappCockpitComponentMethodInfo.readMethodParameterEnums(method, metaData);
                }
            }
        }
        /**
         * executes a component method
         *
         * @param {MappCockpitComponentMethod} mappCockpitComponentMethod
         * @returns {*}
         * @memberof MappCockpitComponentMethodProvider
         */
        executeComponentMethod(mappCockpitComponentMethod) {
            return __awaiter(this, void 0, void 0, function* () {
                let methodResult;
                if (mappCockpitComponentMethod.isExecutable.value) {
                    let methodNodeId = mappCockpitComponentMethod.id.split(".")[0] + ".MethodSet";
                    let methodArgs = {};
                    for (let i = 0; i < mappCockpitComponentMethod.inputParameters.length; i++) {
                        const inputParameter = mappCockpitComponentMethod.inputParameters[i];
                        methodArgs[inputParameter.name] = inputParameter.value;
                    }
                    methodResult = yield opcUaRestServices_1.OpcUaRestServices.executeMethod(this._diagnosticProvider.sessionId, methodNodeId, mappCockpitComponentMethod.id, methodArgs);
                }
                else {
                    console.error("MappCockpitComponentProvider: method %o called though not executable!");
                    methodResult = undefined;
                }
                return methodResult;
            });
        }
        /**
         * updates method parameter data types
         *
         * @param {MappCockpitComponentMethod[]} methods
         * @returns {*}
         * @memberof MappCockpitComponentMethodProvider
         */
        updateMethodParameterDataTypes(methods) {
            return __awaiter(this, void 0, void 0, function* () {
                // read and update method parameter data types
                yield this.readMethodParameterDataTypes(methods);
                // read and update parameter enums
                this.readMethodParameterEnums(methods);
            });
        }
        /**
        * reads and assigns method parameter data types
        *
        * @param {ModelItems.MappCockpitComponentMethod[]} methods
        * @returns {Promise<any>}
        * @memberof MappCockpitComponentMethodProvider
        */
        readMethodParameterDataTypes(methods) {
            return __awaiter(this, void 0, void 0, function* () {
                for (let iMethod = 0; iMethod < methods.length; iMethod++) {
                    const method = methods[iMethod];
                    for (let iPar = 0; iPar < method.inputParameters.length; iPar++) {
                        const inputPar = method.inputParameters[iPar];
                        yield this.updateMethodParameterDataType(inputPar);
                    }
                }
            });
        }
        /**
         * Updates the method input parameter s data type
         *
         * @private
         * @param {ModelItems.MappCockpitMethodParameter} inputParameter
         * @memberof MappCockpitComponentMethodProvider
         */
        updateMethodParameterDataType(inputParameter) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!inputParameter.dataType.isDefined) {
                    let dataTypeRef = yield this._parameterProvider.readDataTypeInfo(inputParameter.dataTypeId);
                    inputParameter.dataType = dataTypeRef;
                }
            });
        }
    };
    MappCockpitComponentMethodProvider = __decorate([
        mco.role()
    ], MappCockpitComponentMethodProvider);
    exports.MappCockpitComponentMethodProvider = MappCockpitComponentMethodProvider;
});
