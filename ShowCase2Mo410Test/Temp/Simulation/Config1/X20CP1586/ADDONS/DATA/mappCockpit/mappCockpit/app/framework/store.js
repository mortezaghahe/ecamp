var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./property", "../common/utilities/objectx", "./componentHub/componentDataHub"], function (require, exports, property_1, objectx_1, componentDataHub_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Store = void 0;
    /**
     * Implemens a store for holding and sharing named data objects.
     *
     * @export
     * @class Store
     */
    let Store = class Store {
        constructor() {
            /**
             * holds the named store items
             *
             * @protected
             * @memberof Store
             */
            this._items = new Map();
        }
        /**
         * reads a named store item
         *
         * @template STOREITEMTYPE specifies the store items type for casting to the result type
         * @param {TStoreItemConstructor} storeItemTypeConstructor specifies the type to be constructed
         * @param {string} [storeItemId] specifies store items id
         * @returns {STOREITEMTYPE} the requested store item
         * @memberof Store
         */
        read(storeItemTypeConstructor, storeItemId) {
            // retrieve a copy of a named store item
            const itemValue = this.getStoreItem(storeItemId, storeItemTypeConstructor).value;
            // we copy the item value to prohibit directly modifying the original object.
            let storeItem = property_1.Property.copyValue(itemValue, storeItemTypeConstructor);
            return storeItem;
        }
        /**
         * updates the store item with values of the specified item
         *
         * @template STOREITEMTYPE specifies the store items type for casting to the result type
         * @param {*} storeItemTypeConstructor specifies the type to be constructed
         * @param {string} [storeItemId] specifies store items id
         * @memberof Store
         */
        update(caller, storeItemTypeConstructor, newValue, storeItemId, forceUpdate = false) {
            // get the named store item
            let storeItemProperty = this.getStoreItem(storeItemId, storeItemTypeConstructor);
            // register the caller as accessor
            if (!storeItemProperty.isAccessedBy(caller)) {
                storeItemProperty.attachAccessor(caller);
            }
            // update (and notify observers implicitly) the state properties value if the state objects content has changed. If the update
            // is forced the vaule is updated anyway and in response sent to listeners.
            if (forceUpdate || !objectx_1.ObjectX.deepEquals(storeItemProperty.value, newValue)) {
                // console.log("updated modified state: old %o new %o",storeItemProperty.value,modifiedStoreItem);
                // update the store item value
                storeItemProperty.update(newValue, storeItemTypeConstructor);
                // notify component data hub from updating a shared property
                componentDataHub_1.ComponentDataHub.notifyChanged(this, newValue, newValue);
            }
        }
        /**
         * observes changes of the store item as a consequence of an update call.
         *
         * @template STOREITEMTYPE specifies the store items type for casting to the result type
         * @param {*} storeItemTypeConstructor specifies the type to be constructed
         * @param {(newValue: STOREITEMTYPE, oldValue: STOREITEMTYPE) => void} storeItemChangedCallback
         * @param {string} [storeItemId] specifies store items id
         * @memberof Store
         */
        observe(caller, storeItemTypeConstructor, storeItemChangedCallback, storeItemId) {
            // get the named store item
            let storeItem = this.getStoreItem(storeItemId, storeItemTypeConstructor);
            // observe the value change of the property and notify the caller
            if (!storeItem.isObservedBy(caller)) {
                // register the caller as observer
                storeItem.attachObserver(caller, storeItemChangedCallback, storeItemTypeConstructor);
            }
            else {
                console.error("shared propery store: The item %o is already attached to observer %o", storeItem, caller);
            }
        }
        /**
         * checks if the store contains the specified item
         *
         * @param {string} itemId specifies store items id
         * @returns {*}
         * @memberof Store
         */
        contains(itemId) {
            return this._items.has(itemId);
        }
        /**
         * retrieves the store item by id
         *
         * @private
         * @template STOREITEMTYPE specifies the store items type for casting to the result type
         * @param {string} storeItemId specifies store items id
         * @param {TConnectionDataType} storeItemType specifies the type to be constructed
         * @returns {Property<STOREITEMTYPE>} a property object holding the store item
         * @memberof Store
         */
        getStoreItem(storeItemId, storeItemType) {
            const itemType = typeof storeItemType !== "string" ? storeItemType : undefined;
            let effectivestoreItemId = storeItemId ? storeItemId : itemType ? itemType.name : "undefined";
            // get the existing property by id
            let property = this._items.get(effectivestoreItemId);
            // create a new one if not yet available
            if (!property) {
                // create an initial tore item value
                let initialStoreItemValue = itemType ? new itemType() : undefined;
                property = property_1.Property.create(initialStoreItemValue);
                // put the new property into the map
                this._items.set(effectivestoreItemId, property);
                // notify component data hub from creating a shared property
                if (initialStoreItemValue) {
                    componentDataHub_1.ComponentDataHub.notifyCreated(this, initialStoreItemValue);
                }
            }
            return property;
        }
        /**
         * Detaches all properties connected to the bound object
         *
         * @param {object} boundObject
         * @memberof Store
         */
        detach(boundObject) {
            this.detachBoundObjectFromProperties(boundObject);
            this.deleteUnattachedProperties();
        }
        /**
         * Detaches the bound object from the related properties
         *
         * @private
         * @param {object} boundObject
         * @memberof Store
         */
        detachBoundObjectFromProperties(boundObject) {
            // retrieve all observed properties
            const observedProperties = Array.from(this._items.values()).filter((storeProperty) => { return storeProperty.isObservedBy(boundObject); });
            // detach the bound object from these properties as observer
            observedProperties.forEach((property) => { property.detachObserver(boundObject); });
            // retrieve all accessed properties
            const accessedProperties = Array.from(this._items.values()).filter((storeProperty) => { return storeProperty.isAccessedBy(boundObject); });
            // detach the bound object from these properties as accessor
            accessedProperties.forEach((property) => { property.detachAccessor(boundObject); });
        }
        /**
         * Deletes all properties from the store which are not observed or accessed.
         *
         * @private
         * @memberof Store
         */
        deleteUnattachedProperties() {
            // get the unattchaed property keys
            const unattachedPropertyKeys = Array.from(this._items.keys()).filter((storePropertyKey) => {
                let propertyIsUnattached = false;
                const storeProperty = this._items.get(storePropertyKey);
                if (storeProperty) {
                    propertyIsUnattached = !storeProperty.isAttached;
                }
                return propertyIsUnattached;
            });
            //// remove the unattached properties from the store
            unattachedPropertyKeys.forEach((unattachedPropertyKey) => {
                this._items.delete(unattachedPropertyKey);
            });
        }
    };
    Store = __decorate([
        mco.role()
    ], Store);
    exports.Store = Store;
});
