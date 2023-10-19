define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataType = void 0;
    var DataType;
    (function (DataType) {
        DataType["BOOLEAN"] = "boolean";
        DataType["NUMBER"] = "number";
        DataType["STRING"] = "string";
        DataType["DATE"] = "date";
        DataType["ARRAY"] = "array";
        DataType["OBJECT"] = "object";
        DataType["LINK"] = "link";
        DataType["ANY"] = "any";
        DataType["INVALID"] = "invalid";
    })(DataType = exports.DataType || (exports.DataType = {}));
});
