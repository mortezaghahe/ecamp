var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/viewTypeProvider", "../common/overviewTreeGridWidgetBase", "./componentDefaultDefinition", "../common/overviewItem", "../common/groupTagProvider"], function (require, exports, viewTypeProvider_1, overviewTreeGridWidgetBase_1, componentDefaultDefinition_1, overviewItem_1, groupTagProvider_1) {
    "use strict";
    var ComponentOverviewWidget_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentOverviewWidget = void 0;
    /**
     * implements the ComponentOverviewWidget
     *
     * @class ComponentOverviewWidget
     * @extends {OverviewTreeGridWidgetBase}
     * @implements {IComponentOverviewWidget}
     */
    let ComponentOverviewWidget = ComponentOverviewWidget_1 = class ComponentOverviewWidget extends overviewTreeGridWidgetBase_1.OverviewTreeGridWidgetBase {
        /**
         * Returns the header text which one should be shown for this overview widget in the header
         *
         * @protected
         * @returns {string}
         * @memberof ComponentOverviewWidget
         */
        getHeaderText() {
            return "Component Overview";
        }
        /**
         * Initialize the component
         *
         * @memberof ComponentOverviewWidget
         */
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        onUserComponentIdsUpdated(componentIds) {
            // clear datasource
            this._dataSource = new Array();
            // add new data to datasource
            componentIds.forEach(componentId => {
                this._dataSource.push(new overviewItem_1.OverviewItem(componentId, componentId));
            });
            // update the tree grid with the new data
            this.updateTreeGridDataSource();
            // Use ascending sorting by default for the component name column
            this.getTreeGridObject().sortColumn("displayName", "Ascending");
        }
        getTreeGridColumnDefinition() {
            return {
                columns: [
                    { field: "displayName", headerText: ComponentOverviewWidget_1.columnName, width: "350", allowSorting: true },
                    { field: "commandButtons", headerText: ComponentOverviewWidget_1.columnOpenView, allowSorting: false },
                ],
            };
        }
        /**
         * Returns the definition for column sorting(=> activated)
         *
         * @protected
         * @returns {{}}
         * @memberof ComponentOverviewWidget
         */
        getTreeGridColumnSorting() {
            return {
                allowSorting: true,
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
            availableViews.push(viewTypeProvider_1.ViewType.Common);
            return availableViews;
        }
        getDefaultCommandIdFromItem(overviewItem) {
            // TODO get default view from component
            return viewTypeProvider_1.ViewType.Common.toString();
        }
        click(overviewItem, commandId) {
            let viewType = parseInt(commandId);
            this.onOpenView(overviewItem.id, overviewItem.displayName, viewType, groupTagProvider_1.GroupTagProvider.createGroupTags(groupTagProvider_1.GroupTag.component));
        }
        doubleClick(columnName, overviewItem) {
            if (columnName == ComponentOverviewWidget_1.columnName) {
                let defaultCommandId = this.getDefaultCommandIdFromItem(overviewItem);
                let defaultOpenViewType = parseInt(defaultCommandId);
                this.onOpenView(overviewItem.id, overviewItem.displayName, defaultOpenViewType, groupTagProvider_1.GroupTagProvider.createGroupTags(groupTagProvider_1.GroupTag.component));
            }
        }
    };
    // Column header texts
    ComponentOverviewWidget.columnName = "Name";
    ComponentOverviewWidget.columnOpenView = "Open View";
    ComponentOverviewWidget = ComponentOverviewWidget_1 = __decorate([
        mco.role()
    ], ComponentOverviewWidget);
    exports.ComponentOverviewWidget = ComponentOverviewWidget;
});
