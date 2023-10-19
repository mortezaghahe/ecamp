var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./componentDefaultDefinition", "../common/widgetBase", "../../controller/openViewManagement/controller/openViewMainController"], function (require, exports, componentDefaultDefinition_1, widgetBase_1, openViewMainController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MainNavigationWidget = void 0;
    let MainNavigationWidget = class MainNavigationWidget extends widgetBase_1.WidgetBase {
        constructor() {
            super(...arguments);
            // Sizes are also set in gridLayout.css
            this._sideBarWidth = 48;
            this._topBarHeight = 48;
            this._borderSize = 3;
            this._mainNavigationClass = "MainGrid";
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        createLayout() {
            this.addClass(this._mainNavigationClass);
        }
        initialized() {
            super.initialized();
            this.initializeGridLayout();
        }
        dispose() {
            this._sideBarWidget.dispose();
            this._topBarWidget.dispose();
            this._mainContentWidget.dispose();
            openViewMainController_1.OpenViewMainController.getInstance().dispose();
            super.dispose();
        }
        /**
         * Resize
         *
         * @param {number} width
         * @param {number} height
         * @memberof MainNavigationWidget
         */
        resize(width, height) {
            this._actualWidth = width;
            this._actualHeight = height;
            if (this._sideBarWidget !== undefined) {
                this._sideBarWidget.resize(this._sideBarWidth, height);
            }
            if (this._topBarWidget !== undefined) {
                this._topBarWidget.resize(width - this._sideBarWidth - this._borderSize, this._topBarHeight);
            }
            if (this._mainContentWidget !== undefined) {
                this._mainContentWidget.resize(width - this._sideBarWidth - this._borderSize, height - this._topBarHeight - this._borderSize);
            }
        }
        loadStyles() {
            this.addStyle("widgets/mainNavigationWidget/style/css/gridLayout.css");
        }
        initializeGridLayout() {
            // Call constructor for initialization
            openViewMainController_1.OpenViewMainController.getInstance();
            // initialize SideBar-, TopBar- and MainContentWidget 
            this._sideBarWidget = this.initializeSingleWidget(componentDefaultDefinition_1.ComponentDefaultDefinition.SideBarWidgetId);
            this._topBarWidget = this.initializeSingleWidget(componentDefaultDefinition_1.ComponentDefaultDefinition.TopBarWidgetId);
            this._mainContentWidget = this.initializeSingleWidget(componentDefaultDefinition_1.ComponentDefaultDefinition.MainContentWidgetId);
        }
        /**
         * Initialize widget and add it to mainDiv
         *
         * @private
         * @param {string} componentDefaultDefinitionID
         * @return {*}  {IWidget}
         * @memberof MainNavigationWidget
         */
        initializeSingleWidget(componentDefaultDefinitionID) {
            let widget = this.component.getSubComponent(componentDefaultDefinitionID);
            widget.initialize();
            widget.addToParentContainer(this.mainDiv);
            return widget;
        }
    };
    MainNavigationWidget = __decorate([
        mco.role()
    ], MainNavigationWidget);
    exports.MainNavigationWidget = MainNavigationWidget;
});
