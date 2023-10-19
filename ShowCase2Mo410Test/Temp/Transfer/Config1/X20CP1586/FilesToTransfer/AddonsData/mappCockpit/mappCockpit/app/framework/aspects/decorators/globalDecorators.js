define(["require", "exports", "../dataModelProxy"], function (require, exports, dataModelProxy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deinstall = exports.install = void 0;
    /**
     * Preprocesses the specified class before usage and instantiation.
     *
     * @param {TConstructor} originalConstructor
     * @returns {*}
     */
    function preprocessClass(originalConstructor) {
        // apply modifications to the specified class
        modifyClassMembers(originalConstructor);
        // return the original constructor.
        return originalConstructor;
        // // modify and return the modified constructor
        // return modifyClass(originalConstructor);
    }
    /**
     * Modifies members of the existing class
     *
     * @param {TConstructor} originalConstructor
     */
    function modifyClassMembers(originalConstructor) {
        // Make all class members enumerable
        try {
            dataModelProxy_1.DataModelProxy.exposeAllDataProperties(originalConstructor.prototype)(originalConstructor.prototype);
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * Installs the classInfo decorator globallay to be used without import.
     *
     */
    function install() {
        // instal class info decorator globally
        globalThis.mco = {
            role() {
                return preprocessClass;
            }
        };
    }
    exports.install = install;
    /**
     * Deinstalls the global decorators
     *
     * @returns
     */
    function deinstall() {
        // deinstal class info decorator globally
        console.log("Deinstalled global decorators");
        // delete mco globals forced.
        globalThis.mco = undefined;
    }
    exports.deinstall = deinstall;
});
