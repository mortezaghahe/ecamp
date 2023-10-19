define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceDataConversionErrorTypes = void 0;
    /**
     * This enum holds all possible types of errors that can occur in the traceDataConversion.
     *
     * @enum {number}
     */
    var TraceDataConversionErrorTypes;
    (function (TraceDataConversionErrorTypes) {
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["WRONG_FORMAT"] = 0] = "WRONG_FORMAT";
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["NO_DATA"] = 1] = "NO_DATA";
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["FORMAT_VIOLATION"] = 2] = "FORMAT_VIOLATION";
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["NO_COLSEP"] = 3] = "NO_COLSEP";
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["NO_COMSEP"] = 4] = "NO_COMSEP";
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["UNKNOWN_COLSEP"] = 5] = "UNKNOWN_COLSEP";
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["UNKNOWN_COMSEP"] = 6] = "UNKNOWN_COMSEP";
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["MISSING_ATTRIBUTE"] = 7] = "MISSING_ATTRIBUTE";
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["UNKNOWN_FORMAT"] = 8] = "UNKNOWN_FORMAT";
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["WRONG_FILETYPE"] = 9] = "WRONG_FILETYPE";
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["INVALID_RECORDING"] = 10] = "INVALID_RECORDING";
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["TIME_NOT_STRICTLY_MONOTONICALLY_INCREASING"] = 11] = "TIME_NOT_STRICTLY_MONOTONICALLY_INCREASING";
        TraceDataConversionErrorTypes[TraceDataConversionErrorTypes["INTERNAL"] = 999] = "INTERNAL";
    })(TraceDataConversionErrorTypes || (TraceDataConversionErrorTypes = {}));
    exports.TraceDataConversionErrorTypes = TraceDataConversionErrorTypes;
});
