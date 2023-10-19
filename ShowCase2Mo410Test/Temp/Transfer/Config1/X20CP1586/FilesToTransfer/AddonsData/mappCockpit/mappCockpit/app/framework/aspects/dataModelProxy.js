define(["require", "exports", "./reflection"], function (require, exports, reflection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataModelProxy = void 0;
    /**
     * Provides supportfor passing data model objects to consumers. E.g. controlling property selction and accessibility
     *
     * @export
     * @class DataModelProxy
     */
    class DataModelProxy {
        /**
         * Creates an instance of DataModelProxy.
         * @memberof DataModelProxy
         */
        constructor() {
        }
        /**
         * Retrieves and prepares the data model instance members to be passed to consumers.
         *
         * @static
         * @param {Object} dataModelInstance
         * @memberof DataModelProxy
         */
        static DataOf(dataModelInstance) {
            // make all data properties accessible (incl. getters !)
            reflection_1.RefleX.processObject(dataModelInstance, true, this.exposeAllDataProperties(dataModelInstance));
            return dataModelInstance;
        }
        /**
        * Declares all data properties as enumerable
        *
        * @param {*} target
        * @returns {(Function | null)}
        */
        static exposeAllDataProperties(target) {
            return (object) => {
                DataModelProxy.exposeDataProperties(target, target);
            };
        }
        static exposeDataProperties(object, target) {
            if (Array.isArray(object)) {
                object.forEach(dataItem => {
                    // DataModelProxy.exposeProperties(dataItem, dataItem);
                    reflection_1.RefleX.processObject(dataItem, true, this.exposeAllDataProperties(dataItem));
                });
            }
            else {
                DataModelProxy.exposeProperties(object, target);
            }
        }
        static exposeProperties(dataObject, target) {
            const dataProps = reflection_1.RefleX.getDataProperties(dataObject);
            if (dataProps.length == 0)
                return;
            // declare the properties as enumerable
            dataProps.forEach(element => {
                if (element[1].configurable) {
                    element[1].enumerable = true;
                    Object.defineProperty(target, element[0], element[1]);
                }
                // process child properties
                if (element[1].value && Array.isArray(element[1].value)) {
                    // DataModelProxy.exposeDataProperties(element[1].value, element[1].value);
                    reflection_1.RefleX.processObject(element[1].value, true, this.exposeAllDataProperties(element[1].value));
                }
            });
        }
    }
    exports.DataModelProxy = DataModelProxy;
});
