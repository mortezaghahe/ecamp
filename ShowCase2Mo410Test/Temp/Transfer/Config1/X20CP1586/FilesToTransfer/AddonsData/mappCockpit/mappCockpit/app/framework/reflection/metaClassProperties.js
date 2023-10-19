define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetaClassProperty = void 0;
    /**
     * Declares class meta properties
     *
     * @export
     * @enum {number}
     */
    var MetaClassProperty;
    (function (MetaClassProperty) {
        MetaClassProperty["className"] = "className";
        MetaClassProperty["persistable"] = "isPersistable";
        MetaClassProperty["transferType"] = "transferType";
    })(MetaClassProperty = exports.MetaClassProperty || (exports.MetaClassProperty = {}));
});
