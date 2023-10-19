define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataTransferType = void 0;
    // specifies if data (class instances) should be transferred by reference or by value
    var DataTransferType;
    (function (DataTransferType) {
        DataTransferType[DataTransferType["byValue"] = 0] = "byValue";
        DataTransferType[DataTransferType["byReference"] = 1] = "byReference";
    })(DataTransferType = exports.DataTransferType || (exports.DataTransferType = {}));
});
