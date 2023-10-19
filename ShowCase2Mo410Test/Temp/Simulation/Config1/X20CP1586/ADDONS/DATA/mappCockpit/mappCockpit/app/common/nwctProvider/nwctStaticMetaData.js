var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctStaticMetaData = void 0;
    let NwctStaticMetaData = class NwctStaticMetaData {
        get acoposFubParIdDefinitions() {
            return this._acoposFubParIdDefinitions;
        }
        get parameterDefinitions() {
            return this._parameterDefinitions;
        }
        get errorInfoDefinitions() {
            return this._errorInfoDefinitions;
        }
        /**
         * Creates an instance of NwctStaticMetaData
         * @param {*} acoposParameterMetaData
         * @param {*} errorInfoMetaData
         * @memberof NwctStaticMetaData
         */
        constructor(acoposParameterMetaData, errorInfoMetaData) {
            /**
             * Holds the acopos parameter definitions
             *
             * @private
             * @memberof NwctStaticMetaData
             */
            this._parameterDefinitions = new Array();
            /**
             * Holds the error infos definitions
             *
             * @private
             * @memberof NwctStaticMetaData
             */
            this._errorInfoDefinitions = new Array();
            // Use errorInfo metaData if available
            if (errorInfoMetaData != undefined) {
                this._errorInfoDefinitions = errorInfoMetaData.acoposErrInfTypes;
            }
            else {
                console.error("No acoposErrInfTypes from target available!");
                this.initializeErrorInfo();
            }
            // Use acoposParameter metaData if available
            if (acoposParameterMetaData != undefined) {
                this._acoposFubParIdDefinitions = acoposParameterMetaData.acoposParIDs.fubParIdDefines;
                this._parameterDefinitions = acoposParameterMetaData.acoposParIDs.parIdList;
            }
            else {
                // TODO: Default definitions should be removed later
                console.error("No acoposParameterMetaData from target available!");
                this.initializeAcoposFubParIdDefinitions();
                this.initializeParData();
            }
        }
        /**
         * Initialize the acopos fub parId definitions
         *
         * @private
         * @memberof NwctStaticMetaData
         */
        initializeAcoposFubParIdDefinitions() {
            let metaData = this.getEmtpyAcoposParIdMetaData();
            this._acoposFubParIdDefinitions = metaData.acoposParIDs.fubParIdDefines;
        }
        /**
         * Initialize the par id data
         *
         * @private
         * @memberof NwctStaticMetaData
         */
        initializeParData() {
            let metaData = this.getEmtpyAcoposParIdMetaData();
            this._parameterDefinitions = metaData.acoposParIDs.parIdList;
        }
        /**
         * Initialize the ErrorInfos
         *
         * @private
         * @memberof NwctStaticMetaData
         */
        initializeErrorInfo() {
            let metaData = this.getEmptyErrorInfo();
            this._errorInfoDefinitions = metaData.mappMotionErrInfs;
        }
        /**
         * Returns an empty error info definition list
         *
         * @private
         * @returns {*}
         * @memberof NwctStaticMetaData
         */
        getEmptyErrorInfo() {
            return { "mappMotionErrInfs": [] };
        }
        /**
         * Returns an empty acopos parameter definition list
         *
         * @private
         * @returns {*}
         * @memberof NwctStaticMetaData
         */
        getEmtpyAcoposParIdMetaData() {
            return { "acoposParIDs": {
                    "fubParIdDefines": { "min": 3072, "range": 29696, "offsetPLCopen": 30720, "instances": 8 },
                    "parIdList": []
                } };
        }
    };
    NwctStaticMetaData = __decorate([
        mco.role()
    ], NwctStaticMetaData);
    exports.NwctStaticMetaData = NwctStaticMetaData;
});
