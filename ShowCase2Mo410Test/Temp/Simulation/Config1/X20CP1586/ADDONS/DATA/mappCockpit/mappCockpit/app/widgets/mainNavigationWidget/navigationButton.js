var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../controller/openViewManagement/controller/openViewMainController", "../../controller/openViewManagement/controller/viewGroupController", "../common/groupTagProvider"], function (require, exports, openViewMainController_1, viewGroupController_1, groupTagProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NavigationButton = void 0;
    let NavigationButton = class NavigationButton {
        constructor(groupTag, elementID) {
            this._setButtonActive = (sender, eventArgs) => { this.setButtonActive(eventArgs); };
            this._setButtonDeactive = (sender, eventArgs) => { this.setButtonDeactive(eventArgs); };
            this.groupTag = groupTag;
            this.buttonID = "NavigationButton" + this.groupTag;
            this._viewGroup = viewGroupController_1.ViewGroupController.getInstance().getAttacherViewGroupByGroupTag(groupTag);
            this.attach();
            this.createButton(elementID);
        }
        dispose() {
            this.detach();
        }
        attach() {
            if (this._viewGroup !== undefined) {
                this._viewGroup.viewGroupActivated.attach(this._setButtonActive);
                this._viewGroup.viewGroupDeactivated.attach(this._setButtonDeactive);
            }
        }
        detach() {
            if (this._viewGroup !== undefined) {
                this._viewGroup.viewGroupActivated.detach(this._setButtonActive);
                this._viewGroup.viewGroupDeactivated.detach(this._setButtonDeactive);
            }
        }
        /**
         * Create button div and append it to the passed element ide
         *
         * @private
         * @param {string} elementID
         * @memberof NavigationButton
         */
        createButton(elementID) {
            var _a;
            let button = document.createElement("button");
            button.setAttribute("id", this.buttonID);
            (_a = document.getElementById(elementID)) === null || _a === void 0 ? void 0 : _a.appendChild(button);
            $("#" + this.buttonID).ejButton({
                contentType: ej.ContentType.ImageOnly,
                prefixIcon: "e-icon " + groupTagProvider_1.GroupTagProvider.getImageClassForGroupTag(this.groupTag) + " Icon-28",
                cssClass: "Button-Navigation",
                click: (args) => this.onButtonClicked(args)
            });
        }
        onButtonClicked(args) {
            args.cancel = true;
            if (this._viewGroup === undefined) {
                this._viewGroup = viewGroupController_1.ViewGroupController.getInstance().getAttacherViewGroupByGroupTag(this.groupTag);
                this.attach();
            }
            openViewMainController_1.OpenViewMainController.getInstance().executeOpenViewByGroupTag(this.groupTag);
        }
        setButtonDeactive(groupTag) {
            if (this.groupTag === groupTag) {
                let activeClass = groupTagProvider_1.GroupTagProvider.getImageClassForGroupTag(this.groupTag, true);
                this.removeClassAtID(this.buttonID, activeClass);
                let deactiveClass = groupTagProvider_1.GroupTagProvider.getImageClassForGroupTag(this.groupTag, false);
                this.addClassAtID(this.buttonID, deactiveClass);
            }
        }
        setButtonActive(groupTag) {
            if (this.groupTag === groupTag) {
                let deactiveClass = groupTagProvider_1.GroupTagProvider.getImageClassForGroupTag(this.groupTag, false);
                this.removeClassAtID(this.buttonID, deactiveClass);
                let activeClass = groupTagProvider_1.GroupTagProvider.getImageClassForGroupTag(this.groupTag, true);
                this.addClassAtID(this.buttonID, activeClass);
            }
        }
        /**
         * Add css class in the element of the passed id
         *
         * @param {string} id
         * @param {string} className
         * @memberof NavigationButton
         */
        addClassAtID(id, className) {
            $("#" + id).find(".e-icon").addClass(className);
        }
        /**
         * Remove css class in the element of the passed id
         *
         * @param {string} id
         * @param {string} className
         * @memberof NavigationButton
         */
        removeClassAtID(id, className) {
            $("#" + id).find(".e-icon").removeClass(className);
        }
    };
    NavigationButton = __decorate([
        mco.role()
    ], NavigationButton);
    exports.NavigationButton = NavigationButton;
});
