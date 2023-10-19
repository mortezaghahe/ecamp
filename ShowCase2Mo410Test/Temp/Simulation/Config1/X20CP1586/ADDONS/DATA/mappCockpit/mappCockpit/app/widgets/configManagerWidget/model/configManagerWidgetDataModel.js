var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../framework/events", "./cmNode", "./cmGroupNode", "../../../models/configManagerDataModel/cmGroup"], function (require, exports, events_1, cmNode_1, cmGroupNode_1, cmGroup_1) {
    "use strict";
    var ConfigManagerWidgetDataModel_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfigManagerWidgetDataModel = void 0;
    // Declares Event-AppInitialized
    let EventConfigManagerWidgetDataModelChanged = class EventConfigManagerWidgetDataModelChanged extends events_1.TypedEvent {
    };
    EventConfigManagerWidgetDataModelChanged = __decorate([
        mco.role()
    ], EventConfigManagerWidgetDataModelChanged);
    ;
    let ConfigManagerWidgetDataModel = ConfigManagerWidgetDataModel_1 = class ConfigManagerWidgetDataModel {
        constructor(dataModel) {
            // Events
            this.eventDataModelChanged = new EventConfigManagerWidgetDataModelChanged();
            /**
             * holds the info if write access is available
             *
             * @private
             * @memberof ConfigManagerWidgetDataModel
             */
            this._writeAccess = false;
            this._dataModel = dataModel;
            this._widgetDataModel = ConfigManagerWidgetDataModel_1.createWidgetDataModel((dataModel.data));
            this.isTransferPossible = this.isTransferOfModifiedNodesPossible(this._widgetDataModel);
        }
        /**
         * Dispose the configmanagerwidget datamodel
         *
         * @memberof ConfigManagerWidgetDataModel
         */
        dispose() {
        }
        /**
         * Activate or deactivate write access
         *
         * @memberof ConfigManagerWidgetDataModel
         */
        set writeAccess(value) {
            this._writeAccess = value;
        }
        /**
         * Returns true if write access is available
         *
         * @type {boolean}
         * @memberof ConfigManagerWidgetDataModel
         */
        get writeAccess() {
            return this._writeAccess;
        }
        /**
         * Sets the expand states from an other datamodel to this datamodel
         *
         * @param {Array<ICmNode>} dataModel
         * @memberof ConfigManagerWidgetDataModel
         */
        setExpandStates(dataModel) {
            this.setExpandStatesForGroups(dataModel, this._widgetDataModel);
        }
        /**
         * Sets the expand states from an array of nodes to an other array of nodes with all child nodes
         *
         * @private
         * @param {Array<ICmNode>} oldGroup
         * @param {Array<ICmNode>} newGroup
         * @memberof ConfigManagerWidgetDataModel
         */
        setExpandStatesForGroups(oldGroup, newGroup) {
            for (let i = 0; i < newGroup.length; i++) {
                if (newGroup[i] instanceof cmGroupNode_1.CmGroupNode) {
                    // Set expand state for the group
                    let oldGroupNode = this.getGroup(oldGroup, newGroup[i].displayName);
                    if (oldGroupNode != undefined) {
                        newGroup[i].expandState = oldGroupNode.expandState;
                        // Set expand states for the childs
                        this.setExpandStatesForGroups(oldGroupNode.childs, newGroup[i].childs);
                    }
                }
            }
        }
        /**
         * Returns a group with the given groupId if found, else undefined (not recursive, only top level nodes)
         *
         * @private
         * @param {Array<ICmNode>} dataModel
         * @param {*} groupId
         * @returns {(ICmGroupNode|undefined)}
         * @memberof ConfigManagerWidgetDataModel
         */
        getGroup(dataModel, groupId) {
            if (dataModel != undefined) {
                for (let i = 0; i < dataModel.length; i++) {
                    if (dataModel[i] instanceof cmGroupNode_1.CmGroupNode) {
                        if (dataModel[i].displayName == groupId) {
                            return dataModel[i];
                        }
                    }
                }
            }
            return undefined;
        }
        /**
         * Returns the array with the nodes for the ui (widget datamodel)
         *
         * @returns {Array<ICmNode>}
         * @memberof ConfigManagerWidgetDataModel
         */
        getDataModel() {
            return this._widgetDataModel;
        }
        /**
         * Sets the value of the given parameter
         *
         * @param {ICmParameter} element
         * @param {string} value
         * @memberof ConfigManagerWidgetDataModel
         */
        setValue(element, value) {
            let node = this.getNode(this._widgetDataModel, element);
            if (node != undefined) {
                node.modifiedDisplayValue = value;
            }
            // Update the filter states corresponding to the new value
            this._dataModel.updateFiltersInDataModel();
        }
        /**
         * Returns the cmNode(widget datamodel) of the given cmParameter(datamodel)
         *
         * @private
         * @param {Array<ICmNode>} nodes
         * @param {ICmParameter} element
         * @returns {(ICmNode|undefined)}
         * @memberof ConfigManagerWidgetDataModel
         */
        getNode(nodes, element) {
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                if (node instanceof cmGroupNode_1.CmGroupNode) {
                    let foundNode = this.getNode(node.childs, element);
                    if (foundNode != undefined) {
                        return foundNode;
                    }
                }
                else {
                    if (node.element == element) {
                        return node;
                    }
                }
            }
            return undefined;
        }
        /**
         * Creates the widget datamodel with the given data from the underlying datamodel
         *
         * @private
         * @static
         * @param {ICmGroup[]} dataModel
         * @returns {Array<ICmNode>}
         * @memberof ConfigManagerWidgetDataModel
         */
        static createWidgetDataModel(dataModel) {
            var nodes = new Array();
            if (dataModel != undefined) {
                dataModel.forEach(element => {
                    if (element.filter == null || element.filter.active == false) {
                        nodes.push(ConfigManagerWidgetDataModel_1.CreateNode(element));
                    }
                });
            }
            return nodes;
        }
        /**
         * Is it possible to transfer the given nodes; false if a modified node was found which one is readonly
         *
         * @private
         * @param {Array<ICmNode>} nodes
         * @returns {boolean}
         * @memberof ConfigManagerWidgetDataModel
         */
        isTransferOfModifiedNodesPossible(nodes) {
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                if (node.isModified == true && node.isWritable == false) {
                    return false;
                }
                if (node instanceof cmGroupNode_1.CmGroupNode) {
                    let isTransferPossible = this.isTransferOfModifiedNodesPossible(node.childs);
                    if (isTransferPossible == false) {
                        return false;
                    }
                }
            }
            return true;
        }
        /**
         * Creates a single ui node/groupNode for the given underlying datamodel node
         *
         * @private
         * @static
         * @param {ICmParameter} element
         * @returns {ICmNode}
         * @memberof ConfigManagerWidgetDataModel
         */
        static CreateNode(element) {
            if (element instanceof cmGroup_1.CmGroup) {
                return new cmGroupNode_1.CmGroupNode(element);
            }
            else {
                return new cmNode_1.CmNode(element);
            }
        }
        /**
         * Applies the modified parameters
         *
         * @memberof ConfigManagerWidgetDataModel
         */
        applyModifiedParameters() {
            this._dataModel.applyModifiedParameters();
        }
        /**
         * Discards the changes
         *
         * @memberof ConfigManagerWidgetDataModel
         */
        discard() {
            this._dataModel.discardModifications();
        }
    };
    ConfigManagerWidgetDataModel = ConfigManagerWidgetDataModel_1 = __decorate([
        mco.role()
    ], ConfigManagerWidgetDataModel);
    exports.ConfigManagerWidgetDataModel = ConfigManagerWidgetDataModel;
});
