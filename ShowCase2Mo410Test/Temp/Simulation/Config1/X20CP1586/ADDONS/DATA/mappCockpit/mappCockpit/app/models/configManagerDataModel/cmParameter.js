var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./cmFilter"], function (require, exports, cmFilter_1) {
    "use strict";
    var CmParameter_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CmParameter = void 0;
    let CmParameter = CmParameter_1 = class CmParameter {
        /**
         * Creates an instance of CmParameter
         * @param {IMetaDataParameter} paramMetaData
         * @param {Array<MappCockpitComponentParameter>} componentParameters
         * @param {boolean} editModeActive
         * @memberof CmParameter
         */
        constructor(paramMetaData, componentParameters, editModeActive) {
            /**
             * Is edit mode currently active for this parameter
             *
             * @type {boolean}
             * @memberof CmParameter
             */
            this.editModeActive = false;
            this.editModeActive = editModeActive;
            this.filter = undefined;
            if (paramMetaData != null) {
                this.displayName = paramMetaData.DisplayName;
                this.description = paramMetaData.Description;
                this.componentParameter = CmParameter_1.getComponentParameter(componentParameters, paramMetaData.Ref);
                let parameterValues = undefined;
                if (paramMetaData.Filter != null) {
                    if (paramMetaData.Filter.ParameterValues != null) {
                        parameterValues = paramMetaData.Filter.ParameterValues;
                    }
                    this.filter = new cmFilter_1.CmFilter(paramMetaData.Filter.ParameterRef, paramMetaData.Filter.ParameterValue, parameterValues);
                }
            }
            else {
                this.displayName = "Unkown node type";
                this.description = "";
                this.componentParameter = undefined;
            }
        }
        /**
         * Returns the component parameter for the given parameter reference name from the given component parameters list, else undefined
         *
         * @private
         * @static
         * @param {(Array<MappCockpitComponentParameter>|undefined)} componentParameters
         * @param {string} paramRef
         * @returns {(MappCockpitComponentParameter|undefined)}
         * @memberof CmParameter
         */
        static getComponentParameter(componentParameters, paramRef) {
            if (paramRef == undefined || componentParameters == undefined) {
                return undefined;
            }
            for (let parameter of componentParameters) {
                if (parameter.browseName == paramRef) {
                    return parameter;
                }
            }
        }
    };
    CmParameter = CmParameter_1 = __decorate([
        mco.role()
    ], CmParameter);
    exports.CmParameter = CmParameter;
});
