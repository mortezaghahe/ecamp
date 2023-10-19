define(["require", "exports", "../metaClassReflectionInfo", "../../../framework/reflection/metaClassProperties", "../../../factory/classFactory"], function (require, exports, metaClassReflectionInfo_1, metaClassProperties_1, classFactory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetaClassProperty = exports.metaClassProperty = void 0;
    Object.defineProperty(exports, "MetaClassProperty", { enumerable: true, get: function () { return metaClassProperties_1.MetaClassProperty; } });
    /**
     * Decorator for reflecting the meta properties
     *
     * @export
     * @param {string} propertyName
     * @param {*} propertyValue
     * @returns
     */
    function metaClassProperty(propertyName, propertyValue) {
        // return decorator function
        return function registerMetaProperty(constructor) {
            // register the meta class property
            metaClassReflectionInfo_1.MetaClassReflectionInfo.registerProperty(constructor, propertyName, propertyValue);
            // when registering a class name we add the class to the class factory
            if (propertyName === metaClassProperties_1.MetaClassProperty.className) {
                classFactory_1.ClassFactory.registerDynamicClass(propertyValue, constructor);
            }
        };
    }
    exports.metaClassProperty = metaClassProperty;
});
