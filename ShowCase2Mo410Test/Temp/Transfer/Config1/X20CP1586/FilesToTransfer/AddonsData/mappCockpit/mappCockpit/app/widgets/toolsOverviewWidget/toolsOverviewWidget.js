var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/overviewTreeGridWidgetBase", "../common/viewTypeProvider", "../loggerWidget/loggerProvider", "./componentDefaultDefinition", "../common/overviewItem", "../common/groupTagProvider"], function (require, exports, overviewTreeGridWidgetBase_1, viewTypeProvider_1, loggerProvider_1, componentDefaultDefinition_1, overviewItem_1, groupTagProvider_1) {
    "use strict";
    var ToolsOverviewWidget_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ToolsOverviewWidget = void 0;
    /**
     * implements the ToolsOverviewWidget
     *
     * @class ToolsOverviewWidget
     * @extends {OverviewTreeGridWidgetBase}
     * @implements {IToolsOverviewWidget}
     */
    let ToolsOverviewWidget = ToolsOverviewWidget_1 = class ToolsOverviewWidget extends overviewTreeGridWidgetBase_1.OverviewTreeGridWidgetBase {
        constructor() {
            super(...arguments);
            // Drive Log tool text
            this._networkCommandTraceToolName = "mapp Motion Drive Log";
        }
        /**
         * Returns the header text which one should be shown for this overview widget in the header
         *
         * @protected
         * @returns {string}
         * @memberof ToolsOverviewWidget
         */
        getHeaderText() {
            return "Tools Overview";
        }
        /**
         * Initialize the component
         *
         * @memberof ToolsOverviewWidget
         */
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        onToolsIdsUpdated(toolComponentIds) {
            // clear datasource
            this._dataSource = new Array();
            // set new data
            toolComponentIds.forEach(toolComponentId => {
                let toolComponentDisplayName = toolComponentId;
                if (toolComponentId == loggerProvider_1.LoggerProvider.driveLogComponentName) {
                    toolComponentDisplayName = this._networkCommandTraceToolName; // Show "mapp Motion Drive Log" instead of "DriveLog"
                }
                this._dataSource.push(new overviewItem_1.OverviewItem(toolComponentId, toolComponentDisplayName));
            });
            // update tree grid
            this.updateTreeGridDataSource();
        }
        /**
         * Returns the column definition for this tree grid widget
         *
         * @protected
         * @returns {{}}
         * @memberof ToolsOverviewWidget
         */
        getTreeGridColumnDefinition() {
            return {
                columns: [
                    { field: "displayName", headerText: ToolsOverviewWidget_1.columnName, width: "350" },
                    { field: "commandButtons", headerText: ToolsOverviewWidget_1.columnExecuteCommand },
                ],
            };
        }
        getCommandIdsFromItem(overviewItem) {
            let availableViews = new Array();
            availableViews.push(viewTypeProvider_1.ViewType.DriveLog);
            return availableViews;
        }
        getDefaultCommandIdFromItem(overviewItem) {
            // TODO get default view from component
            return viewTypeProvider_1.ViewType.DriveLog.toString();
        }
        getNameForCommandId(commandId) {
            return viewTypeProvider_1.ViewType[commandId];
        }
        getIconClassNameForCommandId(commandId) {
            let viewType = parseInt(commandId);
            return viewTypeProvider_1.ViewTypeProvider.getInstance().getIconClassByViewType(viewType);
        }
        click(overviewItem, commandId) {
            this.onExecuteToolCommand(overviewItem.id, overviewItem.displayName, commandId);
        }
        doubleClick(columnName, overviewItem) {
            if (columnName == ToolsOverviewWidget_1.columnName) {
                let defaultToolCommandId = this.getDefaultCommandIdFromItem(overviewItem);
                this.onExecuteToolCommand(overviewItem.id, overviewItem.displayName, defaultToolCommandId);
            }
        }
        onExecuteToolCommand(toolId, toolDisplayName, commandId) {
            console.info("Command '" + this.getNameForCommandId(commandId) + "' from tool '" + toolDisplayName + "' executed!");
            if (toolId == loggerProvider_1.LoggerProvider.driveLogComponentName) {
                this.executeNetworkCommandTraceCommand(toolId, toolDisplayName, commandId);
            }
        }
        executeNetworkCommandTraceCommand(toolId, toolDisplayName, commandId) {
            let viewType = parseInt(commandId);
            if (viewType == viewTypeProvider_1.ViewType.DriveLog) {
                this.openNetworkCommandTrace(toolId, viewType);
            }
        }
        openNetworkCommandTrace(toolId, viewType) {
            this.onOpenView(toolId, "Drive Log", viewType, groupTagProvider_1.GroupTagProvider.createGroupTags(groupTagProvider_1.GroupTag.tools)); // Show "Drive Log" in new view instead of "mapp Motion Drive Log"
        }
    };
    // Column header texts
    ToolsOverviewWidget.columnName = "Name";
    ToolsOverviewWidget.columnExecuteCommand = "Shortcuts";
    ToolsOverviewWidget = ToolsOverviewWidget_1 = __decorate([
        mco.role()
    ], ToolsOverviewWidget);
    exports.ToolsOverviewWidget = ToolsOverviewWidget;
});
