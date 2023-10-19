define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextSystemErrorTypes = void 0;
    /**
     * List of all errors that can occure in the textsystem.
     * The error types with defined error codes can occure in the productive return values.
     * For other error types "?Nul" can be returned in the productive return value.
     *
     * @export
     * @enum {number}
     */
    var TextSystemErrorTypes;
    (function (TextSystemErrorTypes) {
        TextSystemErrorTypes[TextSystemErrorTypes["NoError"] = 0] = "NoError";
        TextSystemErrorTypes[TextSystemErrorTypes["EndlessRecursion"] = 1] = "EndlessRecursion";
        TextSystemErrorTypes[TextSystemErrorTypes["NoPassedArgumentlist"] = 2] = "NoPassedArgumentlist";
        TextSystemErrorTypes[TextSystemErrorTypes["InvalidIndexForArgumentList"] = 3] = "InvalidIndexForArgumentList";
        TextSystemErrorTypes[TextSystemErrorTypes["NoFormatterForInputArgumentFound"] = 4] = "NoFormatterForInputArgumentFound";
        TextSystemErrorTypes[TextSystemErrorTypes["RequestedTextNotFound"] = -2144327656] = "RequestedTextNotFound";
        TextSystemErrorTypes[TextSystemErrorTypes["ReadAccessToTextDatabaseFailed"] = -2144327660] = "ReadAccessToTextDatabaseFailed";
        TextSystemErrorTypes[TextSystemErrorTypes["CouldNotOpenTextDatabase"] = -2144327663] = "CouldNotOpenTextDatabase";
    })(TextSystemErrorTypes = exports.TextSystemErrorTypes || (exports.TextSystemErrorTypes = {}));
});
