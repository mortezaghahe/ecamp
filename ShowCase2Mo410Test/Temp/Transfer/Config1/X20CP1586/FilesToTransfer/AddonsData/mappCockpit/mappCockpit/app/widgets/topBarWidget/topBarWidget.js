var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../controller/openViewManagement/controller/viewGroupController", "../common/groupTagProvider", "../common/widgetBase", "./topBar", "../mainNavigationWidget/navigationButton", "./topBarDOMManipulator"], function (require, exports, viewGroupController_1, groupTagProvider_1, widgetBase_1, topBar_1, navigationButton_1, topBarDOMManipulator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TopBarWidget = void 0;
    let TopBarWidget = class TopBarWidget extends widgetBase_1.WidgetBase {
        constructor() {
            super(...arguments);
            this._topBarLayoutContainerClass = "TopBarLayoutContainer";
            this._loginButtonContainer = "LoginButtonContainer";
            this._loginButtonContainerId = "LoginButtonContainerID";
            this._topBarList = [];
            this._overviewAdded = (sender, eventArgs) => { this.addTopBarToLayout(eventArgs); };
            this._overviewDeleted = (sender, eventArgs) => { this.removeTopBarFromLayout(eventArgs); };
        }
        initializeComponent() {
            this.component.disablePersisting();
        }
        initialized() {
            super.initialized();
            this._viewGroup = viewGroupController_1.ViewGroupController.getInstance().getAttacherViewGroupByGroupTag(groupTagProvider_1.GroupTag.overview);
            this.attach();
        }
        addLoginButtonToLayout() {
            let htmlTag = '<div id="' + this._loginButtonContainerId + '"class="' + this._loginButtonContainer + '"></div>';
            topBarDOMManipulator_1.TopBarDOMManipulator.appendHTMLTagAtID(this.mainDivId, htmlTag);
            this._loginButton = new navigationButton_1.NavigationButton(groupTagProvider_1.GroupTag.login, this._loginButtonContainerId);
        }
        loadStyles() {
            super.addStyle("widgets/topBarWidget/style/css/topBarStyle.css");
            super.addStyle("widgets/topBarWidget/overviewButton/style/css/overviewButtonStyle.css");
            super.addStyle("widgets/topBarWidget/flexTabContainer/style/css/flexTabStyle.css");
            super.addStyle("widgets/topBarWidget/dropDown/style/css/dropDownStyle.css");
        }
        createLayout() {
            this.addClass(this._topBarLayoutContainerClass);
            topBarDOMManipulator_1.TopBarDOMManipulator.appendHTMLTagAtID(this.mainDivId, '<div class="TopBarLayoutDefault"/>');
            this.addLoginButtonToLayout();
        }
        resize(width, height) {
            this.mainDiv.style.width = width.toString() + "px";
            this.mainDiv.style.height = height.toString() + "px";
            this._actualHeight = height;
            this._actualWidth = width;
            this._topBarList.forEach(topBar => topBar.isTabVisible());
        }
        dispose() {
            this._loginButton.dispose();
            this._topBarList.forEach(topBar => topBar.dispose());
            this._topBarList.length = 0;
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
         * Receives changes from the overview groupTag.
         * When a overview is deleted, the TopBar is removed.
         *
         * @private
         * @param {OpenContentView} change
         * @memberof TopBarWidget
         */
        addTopBarToLayout(change) {
            // The first groupTag describes the are
            let groupTag = groupTagProvider_1.GroupTagProvider.getMainGroupTag(change.groupTags);
            this.addTopBar(groupTag);
        }
        /**
         * Receives changes from the overview groupTag.
         * When a new overview is added, a TopBar is created.
         *
         * @private
         * @param {OpenContentView} change
         * @memberof TopBarWidget
         */
        removeTopBarFromLayout(change) {
            // The first groupTag describes the are
            let groupTag = groupTagProvider_1.GroupTagProvider.getMainGroupTag(change.groupTags);
            this.removeTopBar(groupTag);
        }
        /**
         * If no topBar for the existing groupTag exists, a new one is created
         *
         * @private
         * @param {string} groupTag
         * @memberof TopBarWidget
         */
        addTopBar(groupTag) {
            if (this._topBarList.some(topBar => topBar.groupTag === groupTag) === false) {
                this._topBarList.push(new topBar_1.TopBar(groupTag, this.mainDivId));
            }
        }
        /**
         * The topBar for the passed groupTag is removed
         *
         * @private
         * @param {string} groupTag
         * @memberof TopBarWidget
         */
        removeTopBar(groupTag) {
            let index = this._topBarList.findIndex(topBar => topBar.groupTag == groupTag);
            if (index !== -1) {
                this._topBarList[index].dispose();
                this._topBarList.splice(index, 1);
            }
        }
    };
    TopBarWidget = __decorate([
        mco.role()
    ], TopBarWidget);
    exports.TopBarWidget = TopBarWidget;
});
