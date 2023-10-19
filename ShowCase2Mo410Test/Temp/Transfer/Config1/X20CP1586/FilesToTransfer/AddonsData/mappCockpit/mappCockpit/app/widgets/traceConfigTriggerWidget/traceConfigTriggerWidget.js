var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/treeGridWidgetBase", "./view/traceConfigTriggerTreeGridToolbar", "./view/traceConfigTriggerTreeGridCellEditTemplate", "./view/traceConfigTriggerTreeGridCellEditEvents", "../../view/datapointDialog/datapointDialog", "./model/traceConfigTriggerDataModel", "./triggerDescriptionProvider", "./componentDefaultDefinition"], function (require, exports, treeGridWidgetBase_1, traceConfigTriggerTreeGridToolbar_1, traceConfigTriggerTreeGridCellEditTemplate_1, traceConfigTriggerTreeGridCellEditEvents_1, datapointDialog_1, traceConfigTriggerDataModel_1, triggerDescriptionProvider_1, componentDefaultDefinition_1) {
    "use strict";
    var TraceConfigTriggerWidget_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigTriggerWidget = void 0;
    /**
     * implements the TraceConfigTriggerWidget
     *
     * @class TraceConfigTriggerWidget
     * @extends {TreeGridWidgetBase}
     */
    let TraceConfigTriggerWidget = TraceConfigTriggerWidget_1 = class TraceConfigTriggerWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            this._addDataPointHandler = (sender, args) => this.onAddDatapoint(sender, args);
            this._dialogClosedHandler = (sender, args) => this.onDialogClosed(sender, args);
            this._availableTraceDataPoints = new Array();
            this._actualTriggerConditionDescriptionId = 0;
            this._dropDownListSelectionChangedHandler = (sender, args) => this.onDropDownListSelectionChanged(sender, args);
        }
        /**
         * Defines the height of the header
         *
         * @returns {number}
         * @memberof TraceConfigTriggerWidget
         */
        defineHeaderHeight() {
            return 30;
        }
        /**
         * Defines the height of the footer
         *
         * @returns {number}
         * @memberof TraceConfigTriggerWidget
         */
        defineFooterHeight() {
            return 290;
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        initialized() {
            super.initialized();
            super.setHeaderContent("Trigger");
            this.updateFooterContent(0);
            // Set dynamic column settings
            super.setDynamicColumn(1, 80);
        }
        /**
         * Updates and initializes the trace data points
         *
         * @private
         * @param {TraceDataPoint[]} traceDataPoints
         * @memberof TraceConfigTriggerWidget
         */
        initializeAvailableDataPoints(availableTraceDataPoints) {
            this._availableTraceDataPoints = availableTraceDataPoints;
            datapointDialog_1.DatapointDialog.getInstance().setDatapoints(this._availableTraceDataPoints);
        }
        /**
         * Updates and initializes the start triggers
         *
         * @private
         * @param {TraceStartTrigger[]} startTriggers
         * @memberof TraceConfigTriggerWidget
         */
        initializeTraceStartTriggerInfo(startTriggerInfo) {
            let traceConfigTriggerDataModel = new traceConfigTriggerDataModel_1.TraceConfigTriggerDataModel();
            traceConfigTriggerDataModel.initialize();
            this.dataModel = traceConfigTriggerDataModel;
            traceConfigTriggerDataModel.initData = startTriggerInfo;
        }
        dispose() {
            super.dispose();
            if (this._cellEditTemplate != undefined) {
                this._cellEditTemplate.eventSelectionChanged.detach(this._dropDownListSelectionChangedHandler);
            }
        }
        /** updates the footer content with the trigger description
         *
         * @param {number} triggerConditionId (e.g. 20 for IN_WINDOW; 30 for OUT_WINDOW; ...)
         * @memberof TraceConfigTriggerWidget
         */
        updateFooterContent(triggerConditionId) {
            if (this._actualTriggerConditionDescriptionId != triggerConditionId) {
                this._actualTriggerConditionDescriptionId = triggerConditionId;
                let htmlData = triggerDescriptionProvider_1.TriggerDescriptionProvider.getHtmlDescription(triggerConditionId);
                super.setFooterContent(htmlData);
            }
        }
        /**
         * implements the model change handling
         *
         * @param {IDataModel} sender
         * @param {EventModelChangedArgs} data
         * @returns {*}
         * @memberof TraceConfigTriggerWidget
         */
        handleModelChanged(sender, eventArgs) {
            this.refresh();
            // Set correct footer content 
            var treeGridObj = this.getTreeGridObject();
            let actualSelectedItem = treeGridObj.model.selectedItem;
            if (actualSelectedItem == undefined) {
                // get trigger condition of first trigger
                let conditionParameter = "StartTrigger1_Condition";
                let triggerConditionValue = this.getTriggerConditionValue(treeGridObj.model.dataSource, conditionParameter);
                this.updateFooterContent(triggerConditionValue);
            }
            else {
                this.updateFooterContentToSelectedItem(actualSelectedItem);
            }
        }
        updateFooterContentToSelectedItem(selectedItem) {
            let startTriggerGroup;
            if (selectedItem.level == 0) {
                // Rootnode selected
                startTriggerGroup = selectedItem;
            }
            else {
                // Parameter selected
                startTriggerGroup = selectedItem.parentItem;
            }
            if (startTriggerGroup != undefined) {
                let triggerConditionValue = startTriggerGroup.startTriggerRef.condition;
                this.updateFooterContent(parseInt(triggerConditionValue, 10));
            }
        }
        /**
         * handles the changes of observed items requested by 'observeDataModelItems'
         *
         * @param {IDataModel} sender
         * @param {EventModelChangedArgs} data
         * @memberof TraceConfigTriggerWidget
         */
        handleModelItemsChanged(sender, eventArgs) {
            this.refresh();
        }
        /** catches the add datapoint event from the datapoint dialog
         * => sets the selected datapoint to the actual selected trigger and closes the datapoint dialog
         *
         * @param {} sender
         * @param {EventDatapointArgs} args
         * @memberof TraceConfigTriggerWidget
         */
        onAddDatapoint(sender, args) {
            this.setDatapointNameToSelectedTrigger(args.dataPointInfo.fullname);
            datapointDialog_1.DatapointDialog.getInstance().close();
        }
        /** catches the dialog close event from the datapoint dialog
         * => detaches the dialog events
         *
         * @param {} sender
         * @param {} args
         * @memberof TraceConfigTriggerWidget
         */
        onDialogClosed(sender, args) {
            datapointDialog_1.DatapointDialog.getInstance().eventAddDatapoint.detach(this._addDataPointHandler);
            datapointDialog_1.DatapointDialog.getInstance().eventDialogClosed.detach(this._dialogClosedHandler);
        }
        /** catches the dialog close event from the datapoint dialog
         * => detaches the dialog events
         *
         * @param {string} dataPointName
         * @memberof TraceConfigTriggerWidget
         */
        setDatapointNameToSelectedTrigger(dataPointName) {
            var treeGridObj = this.getTreeGridObject();
            let startTriggerItem;
            let actualSelectedItem = treeGridObj.model.selectedItem;
            if (actualSelectedItem != undefined) {
                if (actualSelectedItem.level == 0) {
                    startTriggerItem = actualSelectedItem;
                }
                else {
                    startTriggerItem = actualSelectedItem.parentItem;
                }
            }
            else {
                console.log("No start trigger selected!");
            }
            // Save cell before updating the datamodel to see the right data after update
            treeGridObj.saveCell();
            let triggerGroup = startTriggerItem.item;
            if (triggerGroup != undefined) {
                let dataPointNameParameter = triggerGroup.childs.filter(triggerParameter => { return triggerParameter.id == "datapoint"; })[0];
                if (dataPointNameParameter != undefined) {
                    dataPointNameParameter.displayValue = dataPointName;
                    this.refresh();
                    triggerGroup.setValue(dataPointNameParameter.id, dataPointName);
                }
            }
        }
        /** creates the tree grid for the trigger informations
         *
         * @memberof TraceConfigTriggerWidget
         */
        createTreeGrid() {
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridColumnResizeSupport()), this.getTreeGridToolbarSupport()), this.getTreeGridCellEditSupport()), { childMapping: "childs", expandStateMapping: "expandState", expanded: (args) => this.treeGridNodeExpandedOrCollapsed(), collapsed: (args) => this.treeGridNodeExpandedOrCollapsed(), rowSelected: (args) => this.treeGridRowSelected(args), create: (args) => this.treeGridCreated(), actionBegin: (args) => this.treeGridActionBegin(args), actionComplete: (args) => this.treeGridActionComplete(args) }));
        }
        treeGridNodeExpandedOrCollapsed() {
            // Refresh to see correct expanded/collapsed icon
            this.refresh();
        }
        /**
         * Returns the tree grid column definition
         *
         * @private
         * @returns {{}}
         * @memberof TraceConfigTriggerWidget
         */
        getTreeGridColumnDefinition() {
            this._cellEditTemplate = traceConfigTriggerTreeGridCellEditTemplate_1.TraceConfigTriggerTreeGridCellEditTemplate.createInstance();
            this._cellEditTemplate.eventSelectionChanged.attach(this._dropDownListSelectionChangedHandler);
            return {
                columns: [
                    { field: "displayName", headerText: "Name", width: "200" },
                    { field: "displayValue", headerText: "Value", width: "200", editType: "stringedit", editTemplate: this._cellEditTemplate }
                ],
            };
        }
        /**
         * Returns the tree grid column resize settings
         *
         * @private
         * @returns {{}}
         * @memberof TraceConfigTriggerWidget
         */
        getTreeGridColumnResizeSupport() {
            return {
                allowColumnResize: true,
                columnResizeSettings: { columnResizeMode: ej.TreeGrid.ColumnResizeMode.FixedColumns },
                columnResized: (args) => super.resizeDynamicColumn(args.columnIndex, args.model),
            };
        }
        /**
         * Returns the tree grid toolbar settings
         *
         * @private
         * @returns {{}}
         * @memberof TraceConfigTriggerWidget
         */
        getTreeGridToolbarSupport() {
            this._toolbar = new traceConfigTriggerTreeGridToolbar_1.TraceConfigTriggerTreeGridToolbar(this.mainDiv);
            return super.getTreeGridToolbarSupport();
        }
        /**
         * Returns the tree grid cell edit settings
         *
         * @private
         * @returns {{}}
         * @memberof TraceConfigTriggerWidget
         */
        getTreeGridCellEditSupport() {
            let cellEditEvents = new traceConfigTriggerTreeGridCellEditEvents_1.TraceConfigTriggerTreeGridCellEditEvents();
            return {
                editSettings: { allowEditing: true },
                beginEdit: (args) => cellEditEvents.beginEdit(args),
                endEdit: (args) => cellEditEvents.endEdit(args),
            };
        }
        treeGridActionBegin(args) {
            // Support "Entf/Del" key
            if (args.requestType == "delete") {
                this.deleteStartTriggers(args.deletedItems);
                args.cancel = true;
            }
        }
        treeGridActionComplete(args) {
            // Event trigger while changing datasource dynamically. 
            // code to done after the dynamic change of datasource. 
            if (args.requestType === 'refreshDataSource') {
                this.refreshSelection();
            }
        }
        treeGridRowSelected(args) {
            if (args.model.selectedItem != undefined) {
                this.updateFooterContentToSelectedItem(args.model.selectedItem);
                this.updateToolbarButtonStates(args.model.dataSource, args.model.selectedItem);
            }
        }
        addStartTrigger() {
            this.dataModel.addTrigger();
            this.refreshSelection();
            // Get actual selection item
            const treeObj = $(this.mainDiv).ejTreeGrid('instance');
            let selectedItem = treeObj.model.selectedItem;
            if (treeObj.model.selectedRowIndex == -1) {
                selectedItem = undefined;
            }
            this.updateToolbarButtonStates(treeObj.model.dataSource, selectedItem);
        }
        deleteStartTriggers(deleteItems) {
            let indexList = new Array();
            for (let i = deleteItems.length - 1; i >= 0; i--) {
                if (deleteItems[i].level == 0) {
                    // Only level 0 can be deleted (start trigger group, not single parameters of this group)
                    indexList.push(deleteItems[i].hierarchyRowIndex);
                }
            }
            if (indexList.length > 0) {
                this.dataModel.removeTriggers(indexList);
                this.refreshSelection();
                // Get actual selection item
                const treeObj = $(this.mainDiv).ejTreeGrid('instance');
                let selectedItem = treeObj.model.selectedItem;
                if (treeObj.model.selectedRowIndex == -1) {
                    selectedItem = undefined;
                }
                this.updateToolbarButtonStates(treeObj.model.dataSource, selectedItem);
            }
        }
        /**
         * opens the datapoint selection dialog and attaches to the dialog events
         *
         * @memberof TraceConfigTriggerWidget
         */
        openDatapointDialog() {
            datapointDialog_1.DatapointDialog.getInstance().eventAddDatapoint.attach(this._addDataPointHandler);
            datapointDialog_1.DatapointDialog.getInstance().eventDialogClosed.attach(this._dialogClosedHandler);
            datapointDialog_1.DatapointDialog.getInstance().open(TraceConfigTriggerWidget_1.selectDataPointDialogTitle, datapointDialog_1.FooterContentType.applyClose);
        }
        refreshSelection() {
            const treeObj = $(this.mainDiv).ejTreeGrid('instance');
            // Get actual selection index
            let actualSelectedRowIndex = treeObj.model.selectedRowIndex;
            if (actualSelectedRowIndex == -1) {
                // update toolbar buttons in case of no selected item
                this.updateToolbarButtonStates(treeObj.model.dataSource, undefined);
                return;
            }
            // Reset selection
            treeObj.model.selectedRowIndex = -1;
            // Set to last index if index is out of range
            if (actualSelectedRowIndex >= treeObj.model.flatRecords.length) {
                actualSelectedRowIndex = treeObj.model.flatRecords.length - 1;
            }
            // Set selection
            treeObj.model.selectedRowIndex = actualSelectedRowIndex;
            // update toolbar buttons with selected item
            if (treeObj.model.flatRecords[actualSelectedRowIndex] != undefined) {
                this.updateToolbarButtonStates(treeObj.model.dataSource, treeObj.model.flatRecords[actualSelectedRowIndex].item);
            }
        }
        /**
         * Returns the trigger condition(e.g. 20 for IN_WINDOW; 30 for OUT_WINDOW; ...) for the given condition parameter id (e.g. StartTrigger1_Condition)
         *
         * @param {} dataSource
         * @param {string} conditionParameter
         * @returns {number}
         * @memberof TraceConfigTriggerWidget
         */
        getTriggerConditionValue(dataSource, conditionParameter) {
            for (let i = 0; i < dataSource.length; i++) {
                let startTrigger = dataSource[i];
                for (let j = 0; j < startTrigger.childs.length; j++) {
                    let parameter = startTrigger.childs[j];
                    if (parameter.componentParameter.browseName == conditionParameter) {
                        return parseInt(parameter.componentParameter.value, 10);
                    }
                }
            }
            return 0;
        }
        /**
         * Refreshes trigger parameters tree grid with the current model data
         *
         * @memberof TraceConfigTriggerWidget
         */
        refresh() {
            if (this.refreshEnabled) {
                this.setModel(this.dataModel.data);
            }
        }
        onDropDownListSelectionChanged(sender, args) {
            this.updateFooterContent(args.value);
        }
        updateToolbarButtonStates(startTriggers, selectedItem) {
            let toolbar = this._toolbar;
            // Set select trigger datapoint button state
            if (selectedItem == undefined) {
                toolbar.disableSelectTriggerDataPointButton(true);
            }
            else {
                toolbar.disableSelectTriggerDataPointButton(false);
            }
            // Set add trigger button state
            if (startTriggers.length > 1) {
                toolbar.disableAddButton(true);
            }
            else {
                toolbar.disableAddButton(false);
            }
            // Set remove trigger button state
            if (startTriggers.length == 0 || selectedItem == undefined || selectedItem.level > 0) {
                toolbar.disableRemoveButton(true);
            }
            else {
                toolbar.disableRemoveButton(false);
            }
        }
    };
    TraceConfigTriggerWidget.selectDataPointDialogTitle = "Select data point";
    TraceConfigTriggerWidget = TraceConfigTriggerWidget_1 = __decorate([
        mco.role()
    ], TraceConfigTriggerWidget);
    exports.TraceConfigTriggerWidget = TraceConfigTriggerWidget;
});
