var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../controller/openViewManagement/controller/viewGroupController", "../common/groupTagProvider", "../common/widgetBase", "../mainNavigationWidget/navigationButton"], function (require, exports, viewGroupController_1, groupTagProvider_1, widgetBase_1, navigationButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SideBarWidget = void 0;
    let SideBarWidget = class SideBarWidget extends widgetBase_1.WidgetBase {
        constructor() {
            super(...arguments);
            this._sideBarCSSClass = "SideBarClass";
            this._sideBarButtons = new Array();
            this._overviewAdded = (sender, eventArgs) => { this.addSideBarButton(eventArgs); };
            this._overviewDeleted = (sender, eventArgs) => { this.removeSideBarButton(eventArgs); };
        }
        initializeComponent() {
            this.component.disablePersisting();
        }
        initialized() {
            super.initialized();
            this._viewGroup = viewGroupController_1.ViewGroupController.getInstance().getAttacherViewGroupByGroupTag(groupTagProvider_1.GroupTag.overview);
            this.attach();
        }
        createLayout() {
            this.addClass(this._sideBarCSSClass);
        }
        resize(width, height) {
            this._actualWidth = width;
            this._actualHeight = height;
        }
        /**
         * Loads the styles for the sidebar widget
         *
         * @memberof SideBarWidget
         */
        loadStyles() {
            super.addStyle("widgets/sideBarWidget/style/css/sideBarWidgetStyle.css");
            super.addStyle("widgets/common/style/css/groupTagButtonStyle.css");
        }
        dispose() {
            this._sideBarButtons.forEach(button => button.dispose());
            this._sideBarButtons.length = 0;
            this.detach();
            super.dispose();
        }
        attach() {
            if (this._viewGroup !== undefined) {
                this._viewGroup.viewAdded.attach(this._overviewAdded);
                this._viewGroup.viewDeleted.attach(this._overviewDeleted);
            }
        }
        detach() {
            if (this._viewGroup !== undefined) {
                this._viewGroup.viewAdded.detach(this._overviewAdded);
                this._viewGroup.viewDeleted.detach(this._overviewDeleted);
            }
        }
        /**
         * If a new main groupTag containing groupTag overview is added, a button in sideBarWidget is created for the main groupTag
         *
         * @private
         * @param {OpenContentView} change
         * @return {*}
         * @memberof SideBarWidget
         */
        addSideBarButton(change) {
            // The first groupTag describes the area
            let groupTag = groupTagProvider_1.GroupTagProvider.getMainGroupTag(change.groupTags);
            this.addButton(groupTag);
        }
        /**
         * IF a groupTag containing overview is deleted, also the button is deleted
         *
         * @private
         * @param {OpenContentView} change
         * @memberof SideBarWidget
         */
        removeSideBarButton(change) {
            // The first groupTag describes the area
            let groupTag = groupTagProvider_1.GroupTagProvider.getMainGroupTag(change.groupTags);
            this.removeButton(groupTag);
        }
        /**
         * Add a button for the passed groupTag
         *
         * @private
         * @param {string} groupTag
         * @memberof SideBarWidget
         */
        addButton(groupTag) {
            // If a button already exist with the same groupTag, no button is added
            if (this._sideBarButtons.some(button => button.groupTag === groupTag) === false) {
                let button = new navigationButton_1.NavigationButton(groupTag, this.mainDivId);
                $("#" + button.buttonID).addClass("SideBarButtonPos");
                this._sideBarButtons.push(button);
            }
        }
        /**
         * Remove the button for the passed groupTag
         *
         * @private
         * @param {string} groupTag
         * @memberof SideBarWidget
         */
        removeButton(groupTag) {
            let index = this._sideBarButtons.findIndex(button => button.groupTag == groupTag);
            if (index !== -1) {
                this._sideBarButtons[index].dispose();
                this._sideBarButtons.splice(index, 1);
            }
        }
    };
    SideBarWidget = __decorate([
        mco.role()
    ], SideBarWidget);
    exports.SideBarWidget = SideBarWidget;
});
