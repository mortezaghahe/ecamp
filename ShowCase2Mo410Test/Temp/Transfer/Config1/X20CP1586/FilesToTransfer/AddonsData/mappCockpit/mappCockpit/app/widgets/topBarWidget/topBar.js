var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../controller/openViewManagement/controller/viewGroupController", "./dropDown/dropDown", "./flexTabContainer/flexTabContainer", "./overviewButton/overviewButton", "./topBarDOMManipulator"], function (require, exports, viewGroupController_1, dropDown_1, flexTabContainer_1, overviewButton_1, topBarDOMManipulator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TopBar = void 0;
    let TopBar = class TopBar {
        constructor(groupTag, parentContainerID) {
            // css classes
            this._topBarClass = "TopBarLayout";
            this._invisibleClass = "TopBarInvisible";
            this._flexTabContainerClass = "FlexTabContainer";
            this._dropDownContainerClass = "DropDownContainer";
            this._setTopBarActive = (sender, eventArgs) => { this.showTopBar(eventArgs); };
            this._setTopBarDeactivated = (sender, eventArgs) => { this.hideTopBar(eventArgs); };
            this.groupTag = groupTag;
            this._divID = "TopBar-" + groupTag;
            this._overviewDivID = this._divID + "-overview-button";
            this._flexTabDivID = this._divID + "-flexTabs";
            this._dropDownDivID = this._divID + "-dropDown";
            this._parentContainerID = parentContainerID;
            this._viewGroup = viewGroupController_1.ViewGroupController.getInstance().getAttacherViewGroupByGroupTag(groupTag);
            this.attach();
            this.appendLayout();
            this._overviewButton = new overviewButton_1.OverviewButton(groupTag, this._overviewDivID);
            this._flexTabs = new flexTabContainer_1.FlexTabContainer(groupTag, this._flexTabDivID);
            this._dropdown = new dropDown_1.DropDown(groupTag, this._dropDownDivID);
        }
        isTabVisible() {
            this._flexTabs.checkIfActiveTabIsVisible();
            this._dropdown.hidePopupList();
        }
        /**
         * Layout of the topBar
         *
         * @private
         * @memberof TopBar
         */
        appendLayout() {
            let htmlTag = '<div id=' + this._divID + ' class="' + this._topBarClass + " " + this._invisibleClass + '">' +
                '<button id="' + this._overviewDivID + '"></button>' +
                '<div id="' + this._flexTabDivID + '" class="' + this._flexTabContainerClass + '"></div>' +
                '<div id="' + this._dropDownDivID + '" class="' + this._dropDownContainerClass + '"></div>' +
                '</div>';
            $("#" + this._parentContainerID).append(htmlTag);
        }
        dispose() {
            this._overviewButton.dispose();
            this._flexTabs.dispose();
            this._dropdown.dispose();
            this.detach();
        }
        attach() {
            if (this._viewGroup !== undefined) {
                this._viewGroup.viewGroupActivated.attach(this._setTopBarActive);
                this._viewGroup.viewGroupDeactivated.attach(this._setTopBarDeactivated);
            }
        }
        detach() {
            if (this._viewGroup !== undefined) {
                this._viewGroup.viewGroupActivated.detach(this._setTopBarActive);
                this._viewGroup.viewGroupDeactivated.detach(this._setTopBarDeactivated);
            }
        }
        hideTopBar(eventArgs) {
            topBarDOMManipulator_1.TopBarDOMManipulator.addClassAtID(this._divID, this._invisibleClass);
        }
        showTopBar(eventArgs) {
            topBarDOMManipulator_1.TopBarDOMManipulator.removeClassAtID(this._divID, this._invisibleClass);
        }
    };
    TopBar = __decorate([
        mco.role()
    ], TopBar);
    exports.TopBar = TopBar;
});
