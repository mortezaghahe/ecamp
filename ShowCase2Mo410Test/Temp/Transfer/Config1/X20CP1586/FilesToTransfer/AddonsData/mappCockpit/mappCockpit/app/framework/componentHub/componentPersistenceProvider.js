var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../reflection/metaClassProperties", "../reflection/metaClassReflectionInfo", "../../common/persistence/persistDataProvider"], function (require, exports, metaClassProperties_1, metaClassReflectionInfo_1, persistDataProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentPersistencyProvider = void 0;
    /**
     * The class provides saving and loading instance persistence data.
     *
     * @export
     * @class ComponentPersistencyProvider
     */
    let ComponentPersistencyProvider = class ComponentPersistencyProvider {
        /**
         * Saves objects persistence data
         *
         * @static
         * @param {IPersistencyObject} persistableInstance
         * @memberof ComponentPersistencyProvider
         */
        static savePersistenceData(persistableInstance) {
            // Check if persistableInstance is persistable
            if (!this.isPersistencyObject(persistableInstance)) {
                this.showNoPersistencyObjectError(persistableInstance);
                return;
            }
            // Save persistence data for the given persistableInstance if id for persisting is set 
            if (persistableInstance.id != "") {
                persistDataProvider_1.PersistDataProvider.getInstance().setDataWithId(persistableInstance.id, persistableInstance.getSettings());
            }
            else {
                console.error("No id for persisting data available!");
                console.error(this);
            }
        }
        /**
        * Load objects persistence data
        *
        * @static
        * @param {IPersistencyObject} persistableInstance
        * @memberof ComponentPersistencyProvider
        */
        static loadPersistenceData(persistableInstance) {
            // Check if persistableInstance is persistable
            if (!this.isPersistencyObject(persistableInstance)) {
                this.showNoPersistencyObjectError(persistableInstance);
                return;
            }
            // Load persistence data for the given persistableInstance
            let settingsData = persistDataProvider_1.PersistDataProvider.getInstance().getDataWithId(persistableInstance.id);
            if (settingsData != undefined) {
                persistableInstance.setSettings(settingsData);
            }
        }
        /**
         * Check if the object is a IPersistencyObject
         *
         * @private
         * @static
         * @param {*} object
         * @returns {boolean}
         * @memberof ComponentPersistencyProvider
         */
        static isPersistencyObject(object) {
            // getSetting and setSettings (from ISettingsObject interface) and also id (from IPersistencyObject interface) must be defined
            if (object.id != undefined && object.getSettings != undefined && object.setSettings != undefined) {
                return true;
            }
            return false;
        }
        /**
         * Shows a "no persistency object" error for the given object
         *
         * @private
         * @static
         * @param {*} object
         * @memberof ComponentPersistencyProvider
         */
        static showNoPersistencyObjectError(object) {
            console.error("The following object has no IPersistencyObject implementation!");
            console.error(object);
        }
        /**
         * Determines if the instance supports persistency
         *
         * @public
         * @static
         * @param {*} modifiedInstance
         * @returns {boolean}
         * @memberof ComponentPersistencyProvider
         */
        static instanceSupportsPersistency(modifiedInstance) {
            const instanceType = modifiedInstance.constructor;
            const isPersistable = metaClassReflectionInfo_1.MetaClassReflectionInfo.classHasMetaProperty(instanceType, metaClassProperties_1.MetaClassProperty.persistable) ? metaClassReflectionInfo_1.MetaClassReflectionInfo.getClassMetaPropertyValue(instanceType, metaClassProperties_1.MetaClassProperty.persistable) : false;
            return isPersistable;
        }
    };
    ComponentPersistencyProvider = __decorate([
        mco.role()
    ], ComponentPersistencyProvider);
    exports.ComponentPersistencyProvider = ComponentPersistencyProvider;
});
