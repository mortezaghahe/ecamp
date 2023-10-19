var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./cmNode", "../../../models/configManagerDataModel/cmGroup"], function (require, exports, cmNode_1, cmGroup_1) {
    "use strict";
    var CmGroupNode_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CmGroupNode = void 0;
    let CmGroupNode = CmGroupNode_1 = class CmGroupNode extends cmNode_1.CmNode {
        /**
         * Creates an instance of CmGroupNode
         * @param {ICmGroup} element
         * @memberof CmGroupNode
         */
        constructor(element) {
            super(element);
            this.expandState = true;
            var childConfigurationData = new Array();
            if (element instanceof cmGroup_1.CmGroup) {
                if (element.childs != null) {
                    element.childs.forEach(element => {
                        if (element.filter == null || element.filter.active == false) {
                            if (element instanceof cmGroup_1.CmGroup) {
                                childConfigurationData.push(new CmGroupNode_1(element));
                            }
                            else {
                                childConfigurationData.push(new cmNode_1.CmNode(element));
                            }
                        }
                    });
                }
                this.childs = childConfigurationData;
            }
            this.childs = childConfigurationData;
        }
        /**
         * Returns the icon definition for this groupnode
         *
         * @readonly
         * @type {string}
         * @memberof CmGroupNode
         */
        get iconDefinition() {
            if (this.element.editModeActive == true) {
                // Show modified icon if group is modified
                if (this.isModified == true) {
                    return this.getModifiedIconDefinition();
                }
                // Show containsChanges icon also if a child is modified and the group is collapsed
                let firstModifiedChild = this.getFirstModifiedChild(this.childs);
                if (firstModifiedChild != undefined && !this.expanded()) {
                    return cmNode_1.CmNode.createDiv("containsChangesIcon", "Child contains pending changes");
                }
            }
            // Show expanded or collapsed group icon
            if (this.expanded()) {
                return cmNode_1.CmNode.createDiv("e-treegrid e-cmtreegridexpandgroup");
            }
            return cmNode_1.CmNode.createDiv("e-treegrid e-cmtreegridcollapsegroup");
        }
        /**
         * Returns the first child where a modification, transfer failed or not transferable state is found, else undefined
         *
         * @protected
         * @returns {boolean}
         * @memberof CmGroupNode
         */
        getFirstModifiedChild(childNodes) {
            for (let i = 0; i < childNodes.length; i++) {
                let childNode = childNodes[i];
                if (childNode.isModified == true) {
                    return childNode;
                }
                else if (childNode instanceof CmGroupNode_1) {
                    let firstModifiedChild = this.getFirstModifiedChild(childNode.childs);
                    if (firstModifiedChild != undefined) {
                        return firstModifiedChild;
                    }
                }
            }
            return undefined;
        }
        /**
         * Returns the icon definition for collapse/expand icon for this groupnode
         *
         * @readonly
         * @type {string}
         * @memberof CmGroupNode
         */
        get collapseExpandIconDefinition() {
            let hasChildRecords = this.childs.length > 0;
            if (this.expanded() == true) {
                return cmNode_1.CmNode.createDiv("e-treegridexpand e-cmtreegridexpand");
            }
            else if (hasChildRecords == true) {
                return cmNode_1.CmNode.createDiv("e-treegridcollapse e-cmtreegridcollapse");
            }
            return "";
        }
        /**
         * Is this node expanded(or collapsed)
         *
         * @private
         * @returns {boolean}
         * @memberof CmGroupNode
         */
        expanded() {
            return this.expandState;
        }
    };
    CmGroupNode = CmGroupNode_1 = __decorate([
        mco.role()
    ], CmGroupNode);
    exports.CmGroupNode = CmGroupNode;
});
