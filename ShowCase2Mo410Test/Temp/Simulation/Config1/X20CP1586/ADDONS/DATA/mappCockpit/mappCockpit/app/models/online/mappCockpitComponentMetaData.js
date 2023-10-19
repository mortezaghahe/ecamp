var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var MappCockpitComponentMetaData_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitComponentMetaData = void 0;
    /**
     * provides the meta data container for a component
     *
     * @class MappCockpitComponentMetaData
     */
    let MappCockpitComponentMetaData = MappCockpitComponentMetaData_1 = class MappCockpitComponentMetaData {
        /**
         * retrieves meta items specified by the item property name
         *
         * @static
         * @param {*} metInfo
         * @param {string} requestedMetaItemPropertyNames
         * @returns {*}
         * @memberof MappCockpitComponentMetaData
         */
        static filterMetaItems(metInfo, requestedMetaItemPropertyNames, filterCallback = null) {
            let filteredMetaItems = [];
            // get the specefied meta item types in a flat list
            let flattenedMetaItems = MappCockpitComponentMetaData_1.getFlattendedMetaItems(metInfo);
            // retrieve the meta items with matching item type
            requestedMetaItemPropertyNames.forEach((requestedMetaItemPropertyName) => {
                filteredMetaItems = MappCockpitComponentMetaData_1.filterMetaItemsByItemType(flattenedMetaItems, requestedMetaItemPropertyName, filteredMetaItems);
            });
            // return the found items and filter them if a filter callback is defined
            return filterCallback === null ? filteredMetaItems : filteredMetaItems.filter((metaItem) => { return filterCallback(metaItem); });
        }
        /**
         * filters the meta items by the specified item type
         *
         * @private
         * @static
         * @param {any[]} flattenedMetaItems
         * @param {string} requestedMetaItemPropertyName
         * @param {any[]} metaItems
         * @returns
         * @memberof MappCockpitComponentMetaData
         */
        static filterMetaItemsByItemType(flattenedMetaItems, requestedMetaItemPropertyName, metaItems) {
            // filter items with matching item type
            let metaItemTypeSet = flattenedMetaItems.filter((metaItem) => { return metaItem.hasOwnProperty(requestedMetaItemPropertyName); });
            // get the item objets
            let typedMetaItems = metaItemTypeSet.map((metaItem) => { return metaItem[requestedMetaItemPropertyName]; });
            // add meta item set with specified type
            metaItems = metaItems.length === 0 ? typedMetaItems : metaItems.concat(typedMetaItems);
            // if (metaItems.length === 0) {
            //     metaItems = metaItemsSet;
            // }else{
            //     metaItems = metaItems.concat(metaItemsSet); 
            // }
            return metaItems;
        }
        /**
         * gets the meta items contained in the structure as flat list
         *
         * @private
         * @static
         * @param {*} metaInfo
         * @returns
         * @memberof MappCockpitComponentMetaData
         */
        static getFlattendedMetaItems(metaInfo) {
            let flattendeMetaItems = [];
            this.parseMetaItemObject(metaInfo, (metaItem) => {
                flattendeMetaItems.push(metaItem);
            });
            return flattendeMetaItems;
        }
        /**
         * parses the meta item object deep and calls the callback method for every found child item to filter them for special types.
         *
         * @static
         * @param {*} metaItem
         * @param {*} iterationCallback
         * @returns {*}
         * @memberof MappCockpitComponentMetaData
         */
        static parseMetaItemObject(metaItem, iterationCallback) {
            // get the objects property keys and filter object types only.
            let metaItemPropertyKeys = Object.keys(metaItem).filter((key) => { return metaItem[key] instanceof Object; });
            metaItemPropertyKeys.forEach(metaItemPropertyKey => {
                // get the meta item property value
                let metaItemPropertyObject = metaItem[metaItemPropertyKey];
                // if its an object, parse deeper
                if (metaItemPropertyObject instanceof Object) {
                    // call the iteration callback for filtering ...
                    iterationCallback(metaItemPropertyObject);
                    // parse deeper ...
                    this.parseMetaItemObject(metaItemPropertyObject, iterationCallback);
                }
            });
        }
    };
    MappCockpitComponentMetaData = MappCockpitComponentMetaData_1 = __decorate([
        mco.role()
    ], MappCockpitComponentMetaData);
    exports.MappCockpitComponentMetaData = MappCockpitComponentMetaData;
});
