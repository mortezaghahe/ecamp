var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/overviewTreeGridWidgetBase", "../common/viewTypeProvider", "../common/overviewItem", "./componentDefaultDefinition", "../common/groupTagProvider"], function (require, exports, overviewTreeGridWidgetBase_1, viewTypeProvider_1, overviewItem_1, componentDefaultDefinition_1, groupTagProvider_1) {
    "use strict";
    var TraceOverviewWidget_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceOverviewWidget = void 0;
    /**
     * implements the TraceOverviewWidget
     *
     * @class TraceOverviewWidget
     * @extends {OverviewTreeGridWidgetBase}
     * @implements {ITraceOverviewWidget}
     */
    let TraceOverviewWidget = TraceOverviewWidget_1 = class TraceOverviewWidget extends overviewTreeGridWidgetBase_1.OverviewTreeGridWidgetBase {
        /**
         * Returns the header text which one should be shown for this overview widget in the header
         *
         * @protected
         * @returns {string}
         * @memberof TraceOverviewWidget
         */
        getHeaderText() {
            return "Trace Overview";
        }
        /**
         * Initialize the component
         *
         * @memberof TraceOverviewWidget
         */
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        onTraceComponentIdsUpdated(traceComponentIds) {
            // clear data source
            this._dataSource = new Array();
            // add new data
            traceComponentIds.forEach(traceComponentId => {
                let traceComponentDisplayName = traceComponentId;
                if (traceComponentId == "NewTraceConfig") {
                    traceComponentDisplayName = "Trace"; // Show Trace instead of "NewTraceConfig"
                }
                this._dataSource.push(new overviewItem_1.OverviewItem(traceComponentId, traceComponentDisplayName));
            });
            // update tree grid
            this.updateTreeGridDataSource();
        }
        getTreeGridColumnDefinition() {
            return {
                columns: [
                    { field: "displayName", headerText: TraceOverviewWidget_1.columnName, width: "350" },
                    { field: "commandButtons", headerText: TraceOverviewWidget_1.columnOpenView },
                ],
            };
        }
        getNameForCommandId(commandId) {
            return viewTypeProvider_1.ViewType[commandId];
        }
        getIconClassNameForCommandId(commandId) {
            let viewType = parseInt(commandId);
            return viewTypeProvider_1.ViewTypeProvider.getInstance().getIconClassByViewType(viewType);
        }
        getCommandIdsFromItem(overviewItem) {
            // TODO get available views from component
            let availableViews = new Array();
            availableViews.push(viewTypeProvider_1.ViewType.Configuration);
            availableViews.push(viewTypeProvider_1.ViewType.Analysis);
            return availableViews;
        }
        getDefaultCommandIdFromItem(overviewItem) {
            // TODO get default view from component
            return viewTypeProvider_1.ViewType.Analysis.toString();
        }
        click(overviewItem, commandId) {
            let viewType = parseInt(commandId);
            this.onOpenView(overviewItem.id, overviewItem.displayName, viewType, groupTagProvider_1.GroupTagProvider.createGroupTags(groupTagProvider_1.GroupTag.trace));
        }
        doubleClick(columnName, overviewItem) {
            if (columnName == TraceOverviewWidget_1.columnName) {
                let defaultCommandId = this.getDefaultCommandIdFromItem(overviewItem);
                let defaultOpenViewType = parseInt(defaultCommandId);
                this.onOpenView(overviewItem.id, overviewItem.displayName, defaultOpenViewType, groupTagProvider_1.GroupTagProvider.createGroupTags(groupTagProvider_1.GroupTag.trace));
            }
        }
    };
    // Column header texts
    TraceOverviewWidget.columnName = "Name";
    TraceOverviewWidget.columnOpenView = "Open View";
    TraceOverviewWidget = TraceOverviewWidget_1 = __decorate([
        mco.role()
    ], TraceOverviewWidget);
    exports.TraceOverviewWidget = TraceOverviewWidget;
});
