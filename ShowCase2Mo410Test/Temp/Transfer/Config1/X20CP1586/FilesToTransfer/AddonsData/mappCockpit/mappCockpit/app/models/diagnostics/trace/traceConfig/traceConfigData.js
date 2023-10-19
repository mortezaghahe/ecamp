var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigurationData = void 0;
    /**
     * Provides data for describing a trace configuration
     *
     * @class TraceConfigurationData
     */
    let TraceConfigurationData = class TraceConfigurationData {
        constructor(dataPoints, timingParameters, startTriggers) {
            this._dataPoints = dataPoints;
            this._timingParameters = timingParameters;
            this._startTriggers = startTriggers;
        }
        /**
         * Gets the data points
         *
         * @readonly
         * @type {TraceDataPoint[]}
         * @memberof TraceConfigurationData
         */
        get dataPoints() {
            return this._dataPoints;
        }
        /**
         * Gets the timing parameters
         *
         * @readonly
         * @type {MappCockpitComponentParameter[]}
         * @memberof TraceConfigurationData
         */
        get timingParameters() {
            return this._timingParameters;
        }
        /**
         * Gets the start trigger parameters
         *
         * @readonly
         * @type {TraceStartTrigger[]}
         * @memberof TraceConfigurationData
         */
        get startTriggers() {
            return this._startTriggers;
        }
    };
    TraceConfigurationData = __decorate([
        mco.role()
    ], TraceConfigurationData);
    exports.TraceConfigurationData = TraceConfigurationData;
});
