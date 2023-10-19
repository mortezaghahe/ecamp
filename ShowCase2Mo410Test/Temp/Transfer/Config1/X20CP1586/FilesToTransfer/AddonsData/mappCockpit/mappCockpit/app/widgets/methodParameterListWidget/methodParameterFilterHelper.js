var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MethodParameterFilterHelper = void 0;
    /**
     * Helper class used to change the visibility of method input parameters
     *
     * @class MethodParameterFilterHelper
     */
    let MethodParameterFilterHelper = class MethodParameterFilterHelper {
        constructor(widget) {
            this.methodInputParametersMapping = new Map();
            this.widget = widget;
        }
        /**
         * Add method and filtered parameters to mapping
         *
         * @param {*} method
         * @memberof MethodParameterFilterHelper
         */
        addMethodInputParameters(method) {
            let inputParameters = this.getFilteredInputParameters(method);
            // add mapping of method and input parameters
            this.methodInputParametersMapping.set(method.browseName, inputParameters);
        }
        /**
         * Triggered when edit cell has finished. Filters input parameters and update parameter list if need it
         *
         * @param {(MappCockpitComponentMethod | undefined)} actualMethod
         * @memberof MethodParameterFilterHelper
         */
        endTreegridEdit(actualMethod) {
            if (actualMethod) {
                let previousInputParameters = this.methodInputParametersMapping.get(actualMethod.browseName);
                let filteredInputParameters = this.getFilteredInputParameters(actualMethod);
                // update mapping of method and input parameters
                this.methodInputParametersMapping.set(actualMethod.browseName, filteredInputParameters);
                //If parameters are the same, don't update parameter list
                let update = this.areInputParametersChanged(previousInputParameters, filteredInputParameters);
                if (update) {
                    this.widget.updateParametersList(actualMethod);
                }
            }
        }
        /**
         * Return true if input parameters have been filtered
         *
         * @private
         * @param {MappCockpitMethodParameter[]} actualParameters
         * @param {MappCockpitMethodParameter[]} filteredParameters
         * @returns {boolean}
         * @memberof MethodParameterFilterHelper
         */
        areInputParametersChanged(actualParameters, filteredParameters) {
            if (actualParameters.length === filteredParameters.length) {
                for (var i = 0; i < actualParameters.length; i++) {
                    if (actualParameters[i] !== filteredParameters[i]) {
                        return true;
                    }
                }
                //If all parameters are the same, returns false
                return false;
            }
            else {
                return true;
            }
        }
        /**
         * Returns filtered input paramaters
         *
         * @private
         * @param {MappCockpitComponentMethod} method
         * @returns {MappCockpitMethodParameter[]}
         * @memberof MethodParameterFilterHelper
         */
        getFilteredInputParameters(method) {
            let inputParametersVisibilityState = this.initInputParametersVisibilityState(method.inputParameters);
            this.updateParametersVisibilityState(method, inputParametersVisibilityState);
            let inputParametersShown = this.getUpdatedInputParameters(method.inputParameters, inputParametersVisibilityState);
            return inputParametersShown;
        }
        /**
         * Initialize the mapping of each input parameter and its visible state
         *
         * @private
         * @param {MappCockpitMethodParameter[]} inputParameters
         * @returns {Map<string, boolean>}
         * @memberof MethodParameterFilterHelper
         */
        initInputParametersVisibilityState(inputParameters) {
            let inputParamFilterState = new Map();
            inputParameters.forEach((inputParameter) => {
                //Initialize all input parameters to visible state
                inputParamFilterState.set(inputParameter.name, true);
            });
            return inputParamFilterState;
        }
        /**
         * Update visible state of the input parameter mapping
         *
         * @private
         * @param {MappCockpitComponentMethod} method
         * @param {Map<string, boolean>} inputParametersVisibilityState
         * @memberof MethodParameterFilterHelper
         */
        updateParametersVisibilityState(method, inputParametersVisibilityState) {
            //Get just parameters that are using the filter mechanism
            let parametersWithFilter = method.inputParameters.filter((parameter) => parameter.filter.parameterRef !== '');
            parametersWithFilter.forEach((parameter) => {
                if (this.isFilterActivated(method, parameter.filter)) {
                    inputParametersVisibilityState.set(parameter.name, false);
                }
                else {
                    inputParametersVisibilityState.set(parameter.name, true);
                }
            });
        }
        /**
         * Get state of filter
         *
         * @private
         * @param {*} method
         * @param {ParameterFilter} filter
         * @returns {boolean}
         * @memberof MethodParameterFilterHelper
         */
        isFilterActivated(method, filter) {
            let parameterRefValue = this.getValueFromParameterRef(method, filter.parameterRef);
            let valueFound = filter.parameterValues.find((parameterValue) => parameterRefValue === parameterValue);
            //If value is found, filter is not activated
            if (valueFound !== undefined) {
                return false;
            }
            else {
                return true;
            }
        }
        /**
         * Get value need it for filtering from parameter reference
         *
         * @private
         * @param {MappCockpitComponentMethod} method
         * @param {string} reference
         * @returns {string}
         * @memberof MethodParameterFilterHelper
         */
        getValueFromParameterRef(method, reference) {
            let parameterRef = method.inputParameters.find((parameter) => parameter.name === reference);
            if (parameterRef !== undefined) {
                if (typeof (parameterRef.value) !== 'string') {
                    return parameterRef.value.toString();
                }
                else {
                    return parameterRef.value;
                }
            }
            else {
                return '';
            }
        }
        /**
         * Return just visible inputParameters
         *
         * @static
         * @param {MappCockpitMethodParameter[]} parameters
         * @param {Map<string, boolean>} inputParametersVisibilityState
         * @returns {MappCockpitMethodParameter[]}
         * @memberof MethodParameterFilterHelper
         */
        getUpdatedInputParameters(parameters, inputParametersVisibilityState) {
            let inputParameters = parameters.filter(parameter => { return inputParametersVisibilityState.get(parameter.name); });
            return inputParameters;
        }
    };
    MethodParameterFilterHelper = __decorate([
        mco.role()
    ], MethodParameterFilterHelper);
    exports.MethodParameterFilterHelper = MethodParameterFilterHelper;
});
