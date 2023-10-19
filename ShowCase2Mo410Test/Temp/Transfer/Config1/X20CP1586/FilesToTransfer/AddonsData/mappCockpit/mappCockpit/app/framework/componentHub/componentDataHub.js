var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./bindings/bindingConnector", "./componentPersistenceProvider"], function (require, exports, bindingConnector_1, componentPersistenceProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDataHub = void 0;
    /**
     * The data hub provides updating, accessing and managing shared data
     *
     * @export
     * @class ComponentData
     */
    let ComponentDataHub = class ComponentDataHub {
        /**
         * Updates a shared data item specified by scope and id.
         *
         * @static
         * @template TDataType Specifies the values data type
         * @param {object} caller The caller of the update method
         * @param {TDataType} value The new update value.
         * @param {string} sharedDataScope Specefies the items shared scop
         * @param {string} sharedDataId Specifies the items id
         * @param {(SharedDataType|undefined)} [sharedDataType=undefined] Specifies the items data type
         * @memberof ComponentDataService
         */
        static updateShared(caller, value, sharedDataScope, sharedDataId, sharedDataType = undefined) {
            bindingConnector_1.BindingConnector.updateSharedData(caller, value, sharedDataScope, sharedDataId, sharedDataType);
        }
        /**
         * Reds a shared data item specified by scope and id.
         *
         * @static
         * @template TDataType
         * @param {object} caller
         * @param {string} sharedDataScope
         * @param {string} sharedDataId
         * @param {TConstructor} sharedDataType
         * @returns {TDataType}
         * @memberof ComponentDataHub
         */
        static readShared(caller, sharedDataScope, sharedDataId, sharedDataType) {
            return bindingConnector_1.BindingConnector.readSharedData(caller, sharedDataScope, sharedDataId, sharedDataType);
        }
        /**
         * Called when component data has changed and needs to be processed.
         *
         * @static
         * @param {object} caller
         * @param {*} modifiedInstance
         * @param {*} value
         * @param {string} [hints=""]
         * @memberof ComponentDataHub
         */
        static notifyChanged(caller, modifiedInstance, value, hints = "") {
            // check if the instance should be persisted and delegate the change notification to the persistency provider
            if (componentPersistenceProvider_1.ComponentPersistencyProvider.instanceSupportsPersistency(modifiedInstance)) {
                componentPersistenceProvider_1.ComponentPersistencyProvider.savePersistenceData(modifiedInstance);
            }
        }
        /**
         * called whenever component data has been instantiated
         *
         * @static
         * @param {object} caller
         * @param {*} createdInstance
         * @param {string} [hints=""]
         * @memberof ComponentDataHub
         */
        static notifyCreated(caller, createdInstance, hints = "") {
            // check if the instance should be persisted and delegate the change notification to the persistency provider
            if (componentPersistenceProvider_1.ComponentPersistencyProvider.instanceSupportsPersistency(createdInstance)) {
                componentPersistenceProvider_1.ComponentPersistencyProvider.loadPersistenceData(createdInstance);
            }
        }
    };
    ComponentDataHub = __decorate([
        mco.role()
    ], ComponentDataHub);
    exports.ComponentDataHub = ComponentDataHub;
});
