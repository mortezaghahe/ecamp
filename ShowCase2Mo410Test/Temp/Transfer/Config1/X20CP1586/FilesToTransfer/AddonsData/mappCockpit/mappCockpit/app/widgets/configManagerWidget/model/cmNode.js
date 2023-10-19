var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var CmNode_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CmNode = void 0;
    let CmNode = CmNode_1 = class CmNode {
        constructor(element) {
            this.element = element;
        }
        get displayName() {
            return this.element.displayName;
        }
        get description() {
            return this.element.description;
        }
        get modifiedDisplayValue() {
            if (this.element.componentParameter != undefined) {
                if (this.element.componentParameter.modifiedDisplayValue != undefined) {
                    return this.element.componentParameter.modifiedDisplayValue;
                }
                return this.displayValue;
            }
            return "";
        }
        set modifiedDisplayValue(value) {
            if (this.element.componentParameter != undefined) {
                this.element.componentParameter.modifiedDisplayValue = value;
            }
        }
        get displayValue() {
            if (this.element.componentParameter != undefined) {
                return this.element.componentParameter.displayValue;
            }
            return "";
        }
        set displayValue(value) {
            if (this.element.componentParameter != undefined) {
                this.element.componentParameter.displayValue = value;
            }
        }
        get unit() {
            if (this.element.componentParameter != undefined) {
                return this.element.componentParameter.engineeringUnit;
            }
            return "";
        }
        get isReadOnly() {
            if (this.element.componentParameter != undefined) {
                return this.element.componentParameter.isReadOnly;
            }
            return false;
        }
        get isWritable() {
            if (this.element.componentParameter != undefined) {
                return this.element.componentParameter.isWriteable.value;
            }
            return false;
        }
        get writeAccess() {
            if (this.element.componentParameter != undefined) {
                return this.element.componentParameter.writeAccess.value;
            }
            return false;
        }
        get transferFailed() {
            let transferFailed = false;
            let param = this.element.componentParameter;
            if (param != undefined) {
                if (param.transferFailed != undefined) {
                    transferFailed = param.transferFailed;
                }
            }
            return transferFailed;
        }
        /**
         * Returns the icon definition for this node
         *
         * @readonly
         * @type {string}
         * @memberof CmNode
         */
        get iconDefinition() {
            if (this.isModified == true && this.element.editModeActive) {
                //Show some modified icon
                return this.getModifiedIconDefinition();
            }
            // Show the default node icon
            return CmNode_1.createDiv("e-treegrid e-cmdoc");
        }
        /**
         * Return the icon definition if node is modified(e.g. only modified, or modified and transfer failed, or modified and not transferable)
         *
         * @protected
         * @returns {string}
         * @memberof CmNode
         */
        getModifiedIconDefinition() {
            if (this.transferFailed == true) {
                return CmNode_1.createDiv("transferFailedIcon", "Pending change (failed to apply value in last attempt)");
            }
            if (this.isWritable == false) {
                return CmNode_1.createDiv("notTransferableIcon", "Pending change can’t be applied due to current component state");
            }
            return CmNode_1.createDiv("modifiedIcon", "Pending change");
        }
        /**
         * creates a div with the given tooltipText and className and returns the div string
         *
         * @private
         * @param {string} tooltipText
         * @param {string} className
         * @returns {string}
         * @memberof CmNode
         */
        static createDiv(className, tooltipText = "") {
            if (tooltipText != "") {
                return "<div title='" + tooltipText + "' class='" + className + "'></div>";
            }
            return "<div class='" + className + "'></div>";
        }
        /**
         * Returns the icon definition for collapse/expand icon for this node
         *
         * @readonly
         * @type {string}
         * @memberof CmNode
         */
        get collapseExpandIconDefinition() {
            // No collapse expand icon for nodes without childs
            return "";
        }
        /**
         * Is the value of this node already modified
         *
         * @protected
         * @returns {boolean}
         * @memberof CmNode
         */
        get isModified() {
            var _a;
            if (((_a = this.element.componentParameter) === null || _a === void 0 ? void 0 : _a.modifiedValue) != undefined) {
                return true;
            }
            return false;
        }
    };
    CmNode = CmNode_1 = __decorate([
        mco.role()
    ], CmNode);
    exports.CmNode = CmNode;
});
