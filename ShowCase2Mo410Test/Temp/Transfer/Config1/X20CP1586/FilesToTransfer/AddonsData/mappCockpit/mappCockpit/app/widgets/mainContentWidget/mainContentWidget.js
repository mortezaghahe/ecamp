var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/componentBase/componentContext", "../../common/componentBase/contextIds/contextIdsComponent", "../../controller/openViewManagement/controller/openViewMainController", "../../controller/openViewManagement/controller/viewGroupController", "../../controller/openViewManagement/models/openContentView", "./componentDefaultDefinition", "../common/groupTagProvider", "../common/viewTypeProvider", "../topBarWidget/topBarDOMManipulator", "../common/layoutWidgetBase"], function (require, exports, componentContext_1, contextIdsComponent_1, openViewMainController_1, viewGroupController_1, openContentView_1, componentDefaultDefinition_1, groupTagProvider_1, viewTypeProvider_1, topBarDOMManipulator_1, layoutWidgetBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MainContentWidget = void 0;
    /**
     * Widget handling the visibility of the main area of all OpenContentViews
     *
     * @export
     * @class MainContentWidget
     * @extends {LayoutWidgetBase}
     * @implements {IMainContentWidget}
     */
    let MainContentWidget = class MainContentWidget extends layoutWidgetBase_1.LayoutWidgetBase {
        constructor() {
            super(...arguments);
            // CSS Class names
            this._mainContentWidgetClass = "MainContentAreaClass";
            this._hideWidgetClass = "HideWidget";
            this._viewActivated = (sender, eventArgs) => { this.onViewActivated(eventArgs); };
            this._viewDeactivated = (sender, eventArgs) => { this.onViewDeactivated(eventArgs); };
            this._viewDeleted = (sender, eventArgs) => { this.onViewDeleted(eventArgs); };
            /** TODO: ALL THE FOLLOWING CODE SHOULD BE OUTSOURCED FROM THIS CLASS */
            this.StartViewName = "StartView";
            this.ComponentsViewName = "ComponentsView";
            this.TraceViewName = "TraceView";
            this.ToolsViewName = "ToolsView";
            this.LoginViewName = "LoginView";
        }
        initializeComponent() {
            this.component.disablePersisting();
        }
        initialized() {
            super.initialized();
            this.initializeMainContentWidget();
        }
        initializeMainContentWidget() {
            this._globalViewGroup = viewGroupController_1.ViewGroupController.getInstance().getAttacherViewGroupByGroupTag(groupTagProvider_1.GroupTag.global);
            this.attach();
            this.addStandardViews();
        }
        loadStyles() {
            this.addStyle("widgets/mainContentWidget/style/css/mainContentWidgetStyle.css");
        }
        createLayout() {
            // add css class to mainDiv
            this.addClass(this._mainContentWidgetClass);
        }
        resize(width, height) {
            this._actualWidth = width;
            this._actualHeight = height;
            // Resize the currently active views 
            if (this._globalViewGroup !== undefined) {
                let openViews = this._globalViewGroup.getActiveViewsOfViewGroup();
                openViews.forEach(view => {
                    this.resizeWidgetByViewID(view.viewID);
                });
            }
        }
        dispose() {
            this.detach();
            this._widgets.forEach(widget => widget.dispose());
            super.dispose();
        }
        /**
         * Attach on the events from the _globalViewGroup
         *
         * @private
         * @memberof MainContentWidget
         */
        attach() {
            if (this._globalViewGroup !== undefined) {
                this._globalViewGroup.viewActivated.attach(this._viewActivated);
                this._globalViewGroup.viewDeactivated.attach(this._viewDeactivated);
                this._globalViewGroup.viewDeleted.attach(this._viewDeleted);
            }
        }
        /**
         * Attach on the events from the _globalViewGroup
         *
         * @private
         * @memberof MainContentWidget
         */
        detach() {
            if (this._globalViewGroup) {
                this._globalViewGroup.viewActivated.detach(this._viewActivated);
                this._globalViewGroup.viewDeactivated.detach(this._viewDeactivated);
                this._globalViewGroup.viewDeleted.detach(this._viewDeleted);
            }
        }
        /**
         * Adds widget to map
         *
         * @param {IWidget} widget
         * @param {string} name
         * @param {ViewType} viewType
         * @param {{}} [data]
         * @param {PaneProperties} [paneProperties]
         * @memberof LayoutWidgetBase
         */
        addWidgetById(widget, id) {
            if (this.getWidgetByViewID(id) !== undefined) {
                console.error("addWidget => id (%s) must be unique", id);
            }
            this._widgets.set(id, widget);
        }
        /**
         * Removes widget from map
         *
         * @private
         * @param {string} id
         * @memberof MainContentWidget
         */
        removeWidgetById(id) {
            let widget = this.getWidgetByViewID(id);
            if (widget === undefined) {
                console.error("removeWidget => widget for id (%s) not found", id);
            }
            else {
                this._widgets.delete(id);
                widget.dispose();
            }
        }
        /**
         * Get widget from subComponent list by viewID
         *
         * @private
         * @param {string} id
         * @return {*}  {IWidget}
         * @memberof MainContentWidget
         */
        getWidgetByViewID(id) {
            return this._widgets.get(id);
        }
        /**
         * Check if a widget exist for the passed viewID in the subComponent list
         *
         * @private
         * @param {string} id
         * @return {*}  {boolean}
         * @memberof MainContentWidget
         */
        isNewView(id) {
            // currently check html -> better use getSubComponent below when remove is added
            // return $("#"+id).length === 0;
            return this.getWidgetByViewID(id) === undefined;
        }
        /**
         * Resize the widget with passed id
         *
         * @private
         * @param {string} id
         * @memberof MainContentWidget
         */
        resizeWidgetByViewID(id) {
            let widget = this.getWidgetByViewID(id);
            if (widget !== undefined) {
                widget.resize(this._actualWidth, this._actualHeight);
            }
            else {
                console.error("widget for id (%s) not found", id);
            }
        }
        /**
         * Create, initialize and show widget
         *
         * @private
         * @param {OpenContentView} eventArgs
         * @memberof MainContentWidget
         */
        addView(eventArgs) {
            let widget = this.createWidgetForViewType(eventArgs.viewID, eventArgs.viewType, eventArgs.componentID);
            if (widget !== undefined) {
                // TODO: Should not be needed -> Needed for TraceOverviewPage     
                if (eventArgs.componentID === componentDefaultDefinition_1.ComponentDefaultDefinition.TraceOverviewWidgetId) {
                    let mainDataModel = this.component.addSubComponent("MappCockpitDataModel", "MappCockpitDataModel");
                    mainDataModel.dataSource.traceProvider.initialize();
                }
                // TODO: Should not be needed  -> Set login interface from maindatamodel
                if (eventArgs.viewID === componentDefaultDefinition_1.ComponentDefaultDefinition.LoginWidgetId + viewTypeProvider_1.ViewType.User) {
                    let mainDataModel = this.component.addSubComponent("MappCockpitDataModel", "MappCockpitDataModel");
                    widget.loginInterface = { commandChangeUser: mainDataModel.dataSource.commandChangeUser };
                }
                // Append and set visible div container for every widget
                $(this.mainDiv).append('<div id="' + eventArgs.viewID + '"></div>');
                // Initializing steps (Hint: If 'display: None' is set, not all stylings are set in SF elements)
                widget.initialize();
                widget.addToParentContainerId(eventArgs.viewID);
                widget.connect(eventArgs.componentID);
                this.addWidgetById(widget, eventArgs.viewID);
            }
        }
        /**
         * Get the type of widget by the viewType and add a new widget with an unique id to the subComponent list.
         *
         * @private
         * @param {string} id
         * @param {ViewType} viewType
         * @param {string} contextComponentId
         * @return {*}  {IWidget}
         * @memberof MainContentWidget
         */
        createWidgetForViewType(id, viewType, contextComponentId) {
            let componentType = viewTypeProvider_1.ViewTypeProvider.getInstance().getComponentTypeForViewType(viewType);
            let componentId = viewTypeProvider_1.ViewTypeProvider.getInstance().getDefaultComponentIdForViewType(viewType);
            if (componentType != "" && componentId != "") {
                // Get component context (e.g. needed for axis)
                let context = new componentContext_1.ComponentContext();
                context.addContext(contextIdsComponent_1.ContextIdsComponent.ComponentId, contextComponentId);
                context.addContext(contextIdsComponent_1.ContextIdsComponent.ViewComponentTypeId, componentType);
                return this.component.addSubComponent(componentType, id, "", context);
            }
            return this.component.addSubComponent(contextComponentId, id);
        }
        /**
         * If the view does not exist already, it is created and its div is set visible.
         * If the view exist already, the div in that it is located is set visible.
         *
         * @private
         * @param {OpenContentView} eventArgs
         * @memberof MainContentWidget
         */
        onViewActivated(eventArgs) {
            if (this.isNewView(eventArgs.viewID) === true) {
                this.addView(eventArgs);
            }
            else {
                // Set already existing widget visible
                this.setViewVisible(eventArgs);
            }
            // Activate widget
            this.setWidgetActivated(eventArgs.viewID);
            // Resize of the widget is always triggered when it is set active
            this.resizeWidgetByViewID(eventArgs.viewID);
        }
        /**
         * The div in that the view is located is set invisible.
         *
         * @private
         * @param {OpenContentView} eventArgs
         * @memberof MainContentWidget
         */
        onViewDeactivated(eventArgs) {
            // deactivate widget
            this.setWidgetDeactivated(eventArgs.viewID);
            // set deactivated widget invisible
            this.setViewInvisible(eventArgs);
        }
        /**
         * Call the widget.activate function
         *
         * @private
         * @param {string} id
         * @memberof MainContentWidget
         */
        setWidgetActivated(id) {
            let widget = this.getWidgetByViewID(id);
            if (widget !== undefined) {
                widget.activate();
            }
            else {
                console.error("widget for id (%s) not found", id);
            }
        }
        /**
         * Call the widget.deactivate function
         *
         * @private
         * @param {string} id
         * @memberof MainContentWidget
         */
        setWidgetDeactivated(id) {
            let widget = this.getWidgetByViewID(id);
            if (widget !== undefined) {
                widget.deactivate();
            }
            else {
                console.error("widget for id (%s) not found", id);
            }
        }
        /**
         * Removes the hided css class from view in order to display it
         *
         * @private
         * @param {OpenContentView} eventArgs
         * @memberof MainContentWidget
         */
        setViewVisible(eventArgs) {
            topBarDOMManipulator_1.TopBarDOMManipulator.removeClassAtID(eventArgs.viewID, this._hideWidgetClass);
        }
        /**
         * Set the hided css class to view to make it invisible
         *
         * @private
         * @param {OpenContentView} eventArgs
         * @memberof MainContentWidget
         */
        setViewInvisible(eventArgs) {
            topBarDOMManipulator_1.TopBarDOMManipulator.addClassAtID(eventArgs.viewID, this._hideWidgetClass);
        }
        /**
         * Delete the
         *
         * @private
         * @param {OpenContentView} eventArgs
         * @memberof MainContentWidget
         */
        onViewDeleted(eventArgs) {
            // Dispose widget TODO: Also remove from component if available
            this.removeWidgetById(eventArgs.viewID);
            // Remove from mainDiv
            $("#" + eventArgs.viewID).remove();
        }
        /**
         * Called after the main model has been connected
         *
         * @private
         * @returns
         * @memberof MappCockpitWidget
         */
        addStandardViews() {
            this.addLoginView();
            this.addContentViews();
        }
        /**
         * Creates descriptions of viewTypes (default views)
         *
         * @private
         * @memberof MappCockpitWidget
         */
        addContentViews() {
            this.addStartPageView();
            this.addComponentOverviewView();
            this.addTraceOverviewView();
            this.addToolsOverviewView();
            //this.addDummyView();
        }
        addLoginView() {
            let groupTags = groupTagProvider_1.GroupTagProvider.createGroupTags(groupTagProvider_1.GroupTag.login, false, true);
            let view = new openContentView_1.OpenContentView(componentDefaultDefinition_1.ComponentDefaultDefinition.LoginWidgetId, this.LoginViewName, viewTypeProvider_1.ViewType.User, groupTags);
            openViewMainController_1.OpenViewMainController.getInstance().executeAddView(view);
        }
        /**
         * Add the start page widget
         *
         * @private
         * @memberof MappCockpitWidget
         */
        addStartPageView() {
            let groupTags = groupTagProvider_1.GroupTagProvider.createGroupTags(groupTagProvider_1.GroupTag.startPage, true, true);
            let view = new openContentView_1.OpenContentView(componentDefaultDefinition_1.ComponentDefaultDefinition.StartPageWidgetId, this.StartViewName, viewTypeProvider_1.ViewType.Overview, groupTags);
            openViewMainController_1.OpenViewMainController.getInstance().executeAddView(view);
        }
        addDummyView() {
            let groupTags = groupTagProvider_1.GroupTagProvider.createGroupTags("dummy", true, true);
            let view = new openContentView_1.OpenContentView(componentDefaultDefinition_1.ComponentDefaultDefinition.DummyWidgetId, "DummyView", viewTypeProvider_1.ViewType.Overview, groupTags);
            openViewMainController_1.OpenViewMainController.getInstance().executeAddView(view);
        }
        /**
         * Adds the component overview widget to the main navigation
         *
         * @private
         * @memberof MappCockpitWidget
         */
        addComponentOverviewView() {
            let groupTags = groupTagProvider_1.GroupTagProvider.createGroupTags(groupTagProvider_1.GroupTag.component, true, true);
            let view = new openContentView_1.OpenContentView(componentDefaultDefinition_1.ComponentDefaultDefinition.ComponentOverviewWidgetId, this.ComponentsViewName, viewTypeProvider_1.ViewType.Overview, groupTags);
            openViewMainController_1.OpenViewMainController.getInstance().executeAddView(view);
        }
        /**
         * Adds the trace overview widget to the main navigation
         *
         * @private
         * @memberof MappCockpitWidget
         */
        addTraceOverviewView() {
            let groupTags = groupTagProvider_1.GroupTagProvider.createGroupTags(groupTagProvider_1.GroupTag.trace, true, true);
            let view = new openContentView_1.OpenContentView(componentDefaultDefinition_1.ComponentDefaultDefinition.TraceOverviewWidgetId, this.TraceViewName, viewTypeProvider_1.ViewType.Overview, groupTags);
            openViewMainController_1.OpenViewMainController.getInstance().executeAddView(view);
        }
        /**
         * Adds the tools overview widget to the main navigation
         *
         * @private
         * @memberof MappCockpitWidget
         */
        addToolsOverviewView() {
            let groupTags = groupTagProvider_1.GroupTagProvider.createGroupTags(groupTagProvider_1.GroupTag.tools, true, true);
            let view = new openContentView_1.OpenContentView(componentDefaultDefinition_1.ComponentDefaultDefinition.ToolsOverviewWidgetId, this.ToolsViewName, viewTypeProvider_1.ViewType.Overview, groupTags);
            openViewMainController_1.OpenViewMainController.getInstance().executeAddView(view);
        }
    };
    MainContentWidget = __decorate([
        mco.role()
    ], MainContentWidget);
    exports.MainContentWidget = MainContentWidget;
});
