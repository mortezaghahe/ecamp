var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../enums/traceDataConversionErrorTypes"], function (require, exports, traceDataConversionErrorTypes_1) {
    "use strict";
    var TraceDataConversionError_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceDataConversionError = void 0;
    /**
     * This class represents an error ocurred in traceDataConversion.
     *
     * @class TraceDataConversionError
     * @extends {Error}
     */
    let TraceDataConversionError = TraceDataConversionError_1 = class TraceDataConversionError extends Error {
        /**
         * Creates an instance of TraceDataConversionError.
         * The id will be added to the base name.
         *
         * @param {number} id
         * @param {string} text
         * @memberof TraceDataConversionError
         */
        constructor(id, text) {
            super(text);
            this.name = TraceDataConversionError_1.errorName + id;
        }
        /**
         * Typeguard to check if an Error is a TraceDataConversionError.
         *
         * @static
         * @param {Error} err
         * @returns {err is TraceDataConversionError}
         * @memberof TraceDataConversionError
         */
        static isTraceDataConversionError(err) {
            let isFound = false;
            if (err instanceof Error && err.name.search(TraceDataConversionError_1.errorName) >= 0) {
                isFound = true;
            }
            return isFound;
        }
        /**
         * Builds a TraceData Conversion Error based on the TraceDataConversionErrorType
         * Appends additionalInfo to the base error text
         *
         * @static
         * @param {TraceDataConversionErrorTypes} errorType
         * @param {string} [additionalInfo]
         * @returns {TraceDataConversionError}
         * @memberof TraceDataConversionError
         */
        static build(errorType, additionalInfo) {
            let text = this.getErrorText(errorType);
            text += additionalInfo ? (": " + additionalInfo) : ".";
            return new TraceDataConversionError_1(errorType, text);
        }
        /**
         * Provides the base error text for an TraceDataConversionErrorType or ID.
         *
         * @static
         * @param {TraceDataConversionErrorTypes} errorType
         * @returns {string}
         * @memberof TraceDataConversionError
         */
        static getErrorText(errorType) {
            let text;
            switch (errorType) {
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.WRONG_FORMAT:
                    text = "This format is not supported";
                    break;
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.NO_DATA:
                    text = "There is no data to be converted";
                    break;
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.FORMAT_VIOLATION:
                    text = "The format is invalid";
                    break;
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.NO_COLSEP:
                    text = "The column seperator can not be determined";
                    break;
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.NO_COMSEP:
                    text = "The comma seperator can not be determined";
                    break;
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.UNKNOWN_COLSEP:
                    text = "The column seperator is unknown";
                    break;
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.UNKNOWN_COMSEP:
                    text = "The comma seperator is unknown";
                    break;
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.MISSING_ATTRIBUTE:
                    text = "An attribute does not exist";
                    break;
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.UNKNOWN_FORMAT:
                    text = "The format can not be determined";
                    break;
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.WRONG_FILETYPE:
                    text = "This filetype is not supported";
                    break;
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.INTERNAL:
                    text = "Internal error";
                    break;
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.INVALID_RECORDING:
                    text = "The recording contains signals with invalid numbers";
                    break;
                case traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.TIME_NOT_STRICTLY_MONOTONICALLY_INCREASING:
                    text = "The timestamps are not strictly monotonically increasing";
                    break;
                default:
                    text = "Unknown reason";
                    break;
            }
            return text;
        }
    };
    /**
     * Holds the base name of the TraceDataConversion Error.
     *
     * @private
     * @static
     * @type {string}
     * @memberof TraceDataConversionError
     */
    TraceDataConversionError.errorName = "TraceDataConversionError ID ";
    TraceDataConversionError = TraceDataConversionError_1 = __decorate([
        mco.role()
    ], TraceDataConversionError);
    exports.TraceDataConversionError = TraceDataConversionError;
});
