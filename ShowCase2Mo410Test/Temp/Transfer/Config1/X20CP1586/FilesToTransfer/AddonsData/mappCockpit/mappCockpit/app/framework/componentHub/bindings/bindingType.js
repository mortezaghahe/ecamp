define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BindingType = void 0;
    /**
     * Specifies the possible binding types
     *
     * @export
     * @enum {number}
     */
    var BindingType;
    (function (BindingType) {
        BindingType[BindingType["UNDEFINED"] = 0] = "UNDEFINED";
        BindingType[BindingType["DATA"] = 1] = "DATA";
        BindingType[BindingType["COMMAND"] = 2] = "COMMAND";
        BindingType[BindingType["COMMAND_RESPONSE"] = 3] = "COMMAND_RESPONSE";
        BindingType[BindingType["STATE"] = 4] = "STATE";
        BindingType[BindingType["INTERFACE"] = 5] = "INTERFACE";
    })(BindingType = exports.BindingType || (exports.BindingType = {}));
});
