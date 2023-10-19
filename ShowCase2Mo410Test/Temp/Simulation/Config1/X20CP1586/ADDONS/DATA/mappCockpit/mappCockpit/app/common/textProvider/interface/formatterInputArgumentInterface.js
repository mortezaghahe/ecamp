define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatterArgumentTypes = void 0;
    /**
     * Defines the input argument types for the text formatter
     *
     * @exports
     * @interface IInputArgument
     */
    var FormatterArgumentTypes;
    (function (FormatterArgumentTypes) {
        FormatterArgumentTypes[FormatterArgumentTypes["Integer"] = 0] = "Integer";
        FormatterArgumentTypes[FormatterArgumentTypes["Float"] = 1] = "Float";
        FormatterArgumentTypes[FormatterArgumentTypes["String"] = 2] = "String";
    })(FormatterArgumentTypes = exports.FormatterArgumentTypes || (exports.FormatterArgumentTypes = {}));
});
