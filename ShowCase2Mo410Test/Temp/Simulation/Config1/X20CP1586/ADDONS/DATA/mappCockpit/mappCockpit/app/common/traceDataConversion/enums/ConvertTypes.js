define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConvertTypes = void 0;
    /**
     * This enum holds all supported convert types.
     *
     * @enum {number}
     */
    var ConvertTypes;
    (function (ConvertTypes) {
        ConvertTypes[ConvertTypes["CSV_AS_DE"] = 0] = "CSV_AS_DE";
        ConvertTypes[ConvertTypes["CSV_AS_EN"] = 1] = "CSV_AS_EN";
    })(ConvertTypes || (ConvertTypes = {}));
    exports.ConvertTypes = ConvertTypes;
});
