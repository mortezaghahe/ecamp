var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigurationInfo = void 0;
    /**
     * Provides data for describing trace configuration informations
     *
     * @class TraceConfigurationInfo
     */
    let TraceConfigurationInfo = class TraceConfigurationInfo {
        constructor(dataPointInfos, timingParameterInfos, startTriggerInfos) {
            this._dataPointInfos = dataPointInfos;
            this._timingParameterInfos = timingParameterInfos;
            this._startTriggerInfos = startTriggerInfos;
        }
        /**
         * Gets the data point informations
         *
         * @readonly
         * @type {MappCockpitComponentParameter[]}
         * @memberof TraceConfigurationInfo
         */
        get dataPointInfos() {
            return this._dataPointInfos;
        }
        /**
         * Gets the timing parameters informations
         *
         * @readonly
         * @type {MappCockpitComponentParameter[]}
         * @memberof TraceConfigurationInfo
         */
        get timingParameterInfos() {
            return this._timingParameterInfos;
        }
        /**
         * Gets the start trigger parameters information
         *
         * @readonly
         * @type {MappCockpitComponentParameter[]}
         * @memberof TraceConfigurationInfo
         */
        get startTriggerInfos() {
            return this._startTriggerInfos;
        }
    };
    TraceConfigurationInfo = __decorate([
        mco.role()
    ], TraceConfigurationInfo);
    exports.TraceConfigurationInfo = TraceConfigurationInfo;
});
