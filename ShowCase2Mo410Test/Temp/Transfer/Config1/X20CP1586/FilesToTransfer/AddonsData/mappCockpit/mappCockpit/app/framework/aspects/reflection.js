define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RefleX = void 0;
    /**
     * Provides reflective information and processing for objects and classes
     *
     * @export
     * @class ClassInfo
     */
    class RefleX {
        /**
         * Executes the delegated method for the object and optionlly the prototypes
         *
         * @static
         * @param {Object} object
         * @param {boolean} includePrototypes
         * @param {(Function|null)} parsingAction
         * @memberof RefleX
         */
        static processObject(object, includePrototypes, parsingAction) {
            if (parsingAction) {
                parsingAction(object);
            }
            if (includePrototypes) {
                let prototype = Object.getPrototypeOf(object);
                if (RefleX.isClass(prototype)) {
                    this.processObject(prototype, includePrototypes, parsingAction);
                }
            }
        }
        /**
         * Gets the objects data properties
         *
         * @static
         * @param {*} object
         * @returns
         * @memberof RefleX
         */
        static getDataProperties(object) {
            const props = Object.getOwnPropertyDescriptors(object);
            // ... as array
            const obectEntries = Object.entries(props);
            // filter pure data properties
            const dataProps = obectEntries.filter((propDscr) => {
                return (propDscr[1].value != undefined && typeof propDscr[1].value != "function") || (propDscr[1].get != undefined);
            });
            return dataProps;
        }
        /**
         * Verifies if the prototype represents a implemented class
         *
         * @private
         * @static
         * @param {*} prototype
         * @returns
         * @memberof RefleX
         */
        static isClass(prototype) {
            return prototype != undefined && prototype.constructor != undefined && prototype.constructor.name != "Object";
        }
    }
    exports.RefleX = RefleX;
});
