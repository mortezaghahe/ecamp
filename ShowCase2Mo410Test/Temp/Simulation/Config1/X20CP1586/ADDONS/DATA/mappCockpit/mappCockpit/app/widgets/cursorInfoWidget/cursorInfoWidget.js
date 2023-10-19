var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./interfaces/cursorInfoWidgetInterface", "../common/treeGridWidgetBase", "./view/cursorInfoTreeGridToolbar", "./model/ytCursorSignal", "./model/xyCursorSignal", "./model/fftCursorSignal", "./model/cursorInfo", "../common/states/cursorStates", "./model/dynamicCursorSignalTemplate", "./model/cursorSignal", "../../common/seriesHelper", "../../common/utilities/binSearch", "../common/states/chartViewToolbarStates", "../../models/common/series/seriesType", "./componentDefaultDefinition", "../../models/chartManagerDataModel/chartManagerDataModel", "../common/states/cursorType"], function (require, exports, cursorInfoWidgetInterface_1, treeGridWidgetBase_1, cursorInfoTreeGridToolbar_1, ytCursorSignal_1, xyCursorSignal_1, fftCursorSignal_1, cursorInfo_1, cursorStates_1, dynamicCursorSignalTemplate_1, cursorSignal_1, seriesHelper_1, binSearch_1, chartViewToolbarStates_1, seriesType_1, componentDefaultDefinition_1, chartManagerDataModel_1, cursorType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorInfoWidget = void 0;
    // defines the base id for the cursor value template
    const CURSOR_VALUE_ID = "cursorValue_";
    /**
     * implements the CursorInfo Widget
     *
     * @class CursorInfoWidget
     * @extends {TreeGridWidgetBase}
     */
    let CursorInfoWidget = class CursorInfoWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            this._cursorInfoTemplateDataModel = new Array();
            this._cursorSignalsDataModelChangedHandler = (sender, args) => this.onCursorSignalsDataModelChanged(sender, args);
            this._chartManagerModelChangedHandler = (sender, data) => this.onChartManagerModelChanged(sender, data);
            this._selectedCursorSignals = new Array();
            this._cursorInfoSelectorIsActive = false;
            this._columnId_Visible = "visible";
            this._columnId_Name = "name";
            this._columnId_Value = "value";
            this._columnId_Description = "description";
            this._columnId_IconDefinition = "iconDefinition";
            this._indeterminateStateValue = "indeterminate";
            // holds the current cursor states values. We initialize the member for default. The effective initialization takes place when the external shared instance
            // of the cursor states is created and reflected through the curorStates setter!
            this._cursorStates = new cursorStates_1.CursorStates();
            this._toolState = new chartViewToolbarStates_1.ChartViewToolState();
        }
        /**
         * Initialize the widget
         *
         *  @memberof CursorInfoWidget
         */
        initialize() {
            super.setHeaderFilterBarHidden(); // Must be set before initialization to avoid showing the filterbar
            super.initialize();
        }
        /**
         * Defines the height of the header
         *
         * @returns {number}
         * @memberof OverviewTreeGridWidgetBase
         */
        defineHeaderHeight() {
            return 30;
        }
        initialized() {
            super.initialized();
            // Get cursor signals datamodel
            this._cursorSignalsDataModel = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.CursorSignalsDataModelId);
            // Attach cursor signals datamodel event
            if (this._cursorSignalsDataModel != undefined) {
                this._cursorSignalsDataModel.eventModelChanged.attach(this._cursorSignalsDataModelChangedHandler);
            }
            // Get cursor signals datamodel
            this._chartManagerDataModel = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.ChartManagerDataModelId);
            this.attachChartManagerDataModelEvents();
            // Refresh treeGrid to see the loaded persisting data
            this.refresh();
            // Initialize scrollbars positions
            let scrollbarSettings = this.component.getSetting(treeGridWidgetBase_1.TreeGridWidgetBase.ScrollbarsSettingsId);
            this.setScrollBarSettings(scrollbarSettings);
            super.setHeaderContent("Cursors");
            // Set dynamic column settings
            super.setDynamicColumn(1, 80);
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
        }
        /**
         * Gets the cursors states
         *
         * @protected
         * @type {CursorStates}
         * @memberof CursorInfoWidget
         */
        get cursorsStates() {
            return this._cursorStates;
        }
        /**
         * Sets the cursors states. The method is called automatically whenever a cursor state has been changed externally.
         *
         * @protected
         * @memberof CursorInfoWidget
         */
        set cursorsStates(cursorStates) {
            // update the backup field
            this._cursorStates = cursorStates;
            this.updateInfoCursorsWithNewStateValues(cursorStates);
        }
        /**
         * Gets the tool state
         *
         * @protected
         * @type {ChartViewToolState}
         * @memberof CursorInfoWidget
         */
        get toolState() {
            return this._toolState;
        }
        /**
         * Sets the tool state. The method is called automatically whenever a tool state has been changed externally.
         *
         * @protected
         * @memberof CursorInfoWidget
         */
        set toolState(toolState) {
            // update the backup field
            this._toolState = toolState;
        }
        /**
         * Updates the cursor states.
         *
         * @protected
         * @param {CursorStates} cursorStates
         * @memberof CursorInfoWidget
         */
        updateCursorStates(cursorStates) {
            // BINDINGSOURCE: dispatches the method call to bound targets
        }
        /**
          * Updates the tool state
          *
          * @protected
          * @param {ChartViewToolState} toolState
          * @memberof CursorInfoWidget
          */
        updateToolState(toolState) {
            // BINDINGSOURCE: dispatches the method call to bound targets
        }
        dispose() {
            this.detachChartManagerDataModelEvents();
            if (this._cursorSignalsDataModel != undefined) {
                // Detach cursor signals datamodel events
                this._cursorSignalsDataModel.eventModelChanged.detach(this._cursorSignalsDataModelChangedHandler);
                // Dispose cursor signals datamodel
                this._cursorSignalsDataModel.dispose();
            }
            super.dispose();
        }
        getComponentSettings(onlyModified) {
            return super.getComponentSettings(onlyModified);
        }
        setComponentSettings(data) {
            if (data != undefined) {
                super.setComponentSettings(data);
            }
        }
        /**
         * Creates the column templates for the tree grid and adds them to the widget container
         *
         * @protected
         * @memberof CursorInfoWidget
         */
        createTemplates() {
            var $widgetContainer = $(this.mainDiv);
            $widgetContainer.append(this.getColumnTemplateData(this._columnId_Visible));
            $widgetContainer.append(this.getColumnTemplateData(this._columnId_Name));
        }
        /**
         * Returns the column template informations
         *
         * @private
         * @returns {string}
         * @memberof CursorInfoWidget
         */
        getColumnTemplateData(columnId) {
            if (columnId == this._columnId_Visible) {
                return `<script type="text/x-jsrender" id="ciVisibleColumnTemplate">
                        <div style="margin-left:10px;">{{if visible == "true" && !hasChildRecords}} <input class="customCheckbox" type="checkbox" checked="checked" value="" />{{else !hasChildRecords}} <input class="customCheckbox" type="checkbox" value="" />{{/if}}</div>
                        </script>`;
            }
            else if (columnId == this._columnId_Name) {
                return `<script type="text/x-jsrender" id="ciNameColumnTemplate">
                        <div style='height:20px;' unselectable='on'>
                            {{if hasChildRecords}}
                                <div class='intend' style='height:1px; float:left; width:{{:level*6}}px; display:inline-block;'></div>
                            {{else !hasChildRecords}}
                                <div class='intend' style='height:1px; float:left; width:{{:level*6}}px; display:inline-block;'></div>
                            {{/if}}
                            {{:#data['iconDefinition']}}
                            <div class='e-cell' style='display:inline-block;width:100%' unselectable='on'>{{:#data['name']}}</div>
                        </div>
                    </script>`;
            }
            return "";
        }
        /**
         * Creates the tree grid for the CursorInfos
         *
         * @protected
         * @memberof CursorInfoWidget
         */
        createTreeGrid() {
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridColumnResizeSupport()), this.getTreeGridCellEditSupport()), this.getTreeGridToolbarSupport()), { childMapping: "filteredCursorInfos", expandStateMapping: "expandState", isResponsive: true, treeColumnIndex: 1, rowHeight: 28, 
                // Set init size to draw the toolbar icons at the right position
                sizeSettings: { height: '100px', width: '100px' }, selectionType: ej.TreeGrid.SelectionType.Multiple, expanded: (args) => this.treeGridNodeExpandedOrCollapsed(), collapsed: (args) => this.treeGridNodeExpandedOrCollapsed(), rowSelected: (args) => this.treeGridRowSelected(args), create: (args) => this.treeGridCreated(), actionBegin: (args) => this.treeGridActionBegin(args), queryCellInfo: (args) => this.queryCellInfo(args) }));
        }
        treeGridNodeExpandedOrCollapsed() {
            // Refresh to see correct expanded/collapsed icon
            this.refresh();
            // Persist expandState in dataModel
            if (this._cursorSignalsDataModel !== undefined) {
                this._cursorSignalsDataModel.saveSettings();
            }
            // Persist scrollbar state in cursorInfoWidget
            this.saveTreeGridSettings();
        }
        queryCellInfo(args) {
            if (args.column.field == this._columnId_Visible) {
                if (args.cellValue == this._indeterminateStateValue) {
                    // Set indeterminate icons
                    $(args.cellElement.childNodes[1].childNodes[1]).prop(this._indeterminateStateValue, true);
                }
            }
        }
        /**
         * TreeGrid selected row has changed
         *
         * @private
         * @param {*} args
         * @returns
         * @memberof CursorInfoWidget
         */
        treeGridRowSelected(args) {
            if (args.model.selectedItems == undefined) {
                return;
            }
            if (this._cursorInfoSelectorIsActive == true) {
                // Saves the selected items for multiselection support in cursor info selector
                this._selectedCursorInfosOld = this._selectedCursorInfosNew;
                this._selectedCursorInfosNew = args.model.selectedItems;
            }
            else {
                this._selectedCursorSignals = this.getOnlyCursorSignals(args.model.selectedItems);
                this.updateCursorInfoSelectorButtonState();
            }
        }
        /**
         * get all CursorSignals for the current selection(if CursorInfo is selected, get the parent CursorSignal)
         *
         * @private
         * @param {*} selectedItems
         * @returns {Array<CursorSignal>}
         * @memberof CursorInfoWidget
         */
        getOnlyCursorSignals(selectedItems) {
            let newList = new Array();
            for (let i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i].item instanceof cursorSignal_1.CursorSignal) {
                    let index = newList.indexOf(selectedItems[i].item);
                    if (index == -1) { // Only add if not already in list
                        newList.push(selectedItems[i].item);
                    }
                }
                else if (selectedItems[i].item instanceof cursorInfo_1.CursorInfo) {
                    let index = newList.indexOf(selectedItems[i].parentItem.item);
                    if (index == -1) { // Only add if not already in list
                        newList.push(selectedItems[i].parentItem.item);
                    }
                }
            }
            return newList;
        }
        /**
         * Sets the cursor info selector button state (if one (or more) signal is selected the button is enabled)
         *
         * @private
         * @returns
         * @memberof CursorInfoWidget
         */
        updateCursorInfoSelectorButtonState() {
            let toolbar = this._toolbar;
            if (this._selectedCursorSignals == undefined) {
                // no items selected deactivate Filter button
                toolbar.disableCursorInfoSelectorButton(true);
                return;
            }
            if (this._selectedCursorSignals.length < 1) {
                // no items selected deactivate Filter button
                toolbar.disableCursorInfoSelectorButton(true);
            }
            else {
                toolbar.disableCursorInfoSelectorButton(false);
            }
        }
        /**
         * Returns the tree grid column definition
         *
         * @private
         * @returns {{}}
         * @memberof CursorInfoWidget
         */
        getTreeGridColumnDefinition() {
            // add check box state information
            var checkBoxStates = [
                { text: "Yes", value: "true" },
                { text: "No", value: "false" }
            ];
            // return the column definitions
            return {
                columns: [
                    { field: this._columnId_Visible, headerText: "Visible", visible: false, allowEditing: false, isTemplateColumn: true, templateID: "ciVisibleColumnTemplate", filterEditType: "dropdownedit", dropdownData: checkBoxStates, allowFilteringBlankContent: false, width: "55px" },
                    { field: this._columnId_Name, headerText: "Name", allowEditing: false, isTemplateColumn: true, templateID: "ciNameColumnTemplate" },
                    { field: this._columnId_Value, headerText: "Value", allowEditing: false, width: "140px", isTemplateColumn: true, template: "<div style='padding-left: 20px' id='" + this.mainDivId + CURSOR_VALUE_ID + "{{:uiId}}'></div>" },
                    { field: this._columnId_Description, headerText: "Description", visible: false, allowEditing: false, width: "140px" },
                    { field: this._columnId_IconDefinition, visible: false, width: "0px" },
                ],
            };
        }
        /**
         * Returns the tree grid column resize settings
         *
         * @private
         * @returns {{}}
         * @memberof CursorInfoWidget
         */
        getTreeGridColumnResizeSupport() {
            return {
                allowColumnResize: true,
                columnResizeSettings: { columnResizeMode: ej.TreeGrid.ColumnResizeMode.FixedColumns },
                columnResized: (args) => this.treeGridColumnResized(args),
            };
        }
        /**
         * Returns the tree grid cell edit settings
         *
         * @private
         * @returns {{}}
         * @memberof CursorInfoWidget
         */
        getTreeGridCellEditSupport() {
            return {
                editSettings: {
                    allowEditing: true,
                    showDeleteConfirmDialog: false,
                    showConfirmDialog: false
                },
            };
        }
        /**
         * Returns the tree grid toolbar settings
         *
         * @private
         * @returns {{}}
         * @memberof CursorInfoWidget
         */
        getTreeGridToolbarSupport() {
            this._toolbar = new cursorInfoTreeGridToolbar_1.CursorInfoTreeGridToolbar(this.mainDiv);
            return super.getTreeGridToolbarSupport();
        }
        /**
         * TreeGrid was created
         *
         * @private
         * @memberof CursorInfoWidget
         */
        treeGridCreated() {
            super.treeGridCreated();
            this.attachToCheckBoxChangedEvent();
        }
        /**
         * Attach check box changed events
         *
         * @private
         * @memberof CursorInfoWidget
         */
        attachToCheckBoxChangedEvent() {
            $(this.mainDiv).on("change", ".customCheckbox", (e) => this.checkBoxChanged(e));
        }
        loadStyles() {
            super.addStyle("widgets/cursorInfoWidget/style/css/cursorInfoStyleV1.css");
        }
        /**
         * Occurs on check box changed events
         *
         * @private
         * @param {*} e
         * @memberof CursorInfoWidget
         */
        checkBoxChanged(e) {
            let filterDataSource = this._cursorInfoTemplateDataModel;
            e = e || window.event;
            let targetEle = e.target;
            let checkStatus = $(targetEle).is(':checked');
            // $(targetEle).prop('checked', true);
            let record = this.getTreeRecord(targetEle);
            if (record != undefined) {
                if (checkStatus == false) {
                    record.item.visible = "false";
                    record["visible"] = "false";
                    this.setMultiSelectionCheckBoxes("false", record.index);
                }
                else {
                    record.item.visible = "true";
                    record["visible"] = "true";
                    this.setMultiSelectionCheckBoxes("true", record.index);
                }
                this.setModel(filterDataSource);
                // Set selection after setting checkbox because they are lost after setting a check box
                this.setSelectionInCursorInfoSelectorView(this._selectedCursorInfosOld);
                this.updateCheckBoxes();
                // Update cursor info visibilities if something has changed
                this.setCursorInfoVisibilities(this._selectedCursorSignals, this._cursorInfoTemplateDataModel[0]);
                // Update dataModel
                this._cursorSignalsDataModel.saveSettings();
            }
        }
        /**
         * If multi selection is active, set all selected items to the given state(checked/unchecked)
         *
         * @private
         * @param {string} state
         * @param {number} actualIndex
         * @memberof CursorInfoWidget
         */
        setMultiSelectionCheckBoxes(state, actualIndex) {
            let selectedCursorInfos = this._selectedCursorInfosOld;
            if (selectedCursorInfos != undefined) {
                // Set/Unset check boxes
                let indexWithinMultiSelection = false;
                for (let i = 0; i < selectedCursorInfos.length; i++) {
                    if (actualIndex == selectedCursorInfos[i].index) {
                        indexWithinMultiSelection = true;
                    }
                }
                ;
                if (indexWithinMultiSelection == true) {
                    selectedCursorInfos.forEach(cursorInfo => {
                        cursorInfo.item.visible = state;
                        cursorInfo["visible"] = state;
                    });
                }
                else {
                    // Only one checkbox was clicked => set selection to the new one
                    this._selectedCursorInfosOld = this._selectedCursorInfosNew;
                }
            }
        }
        treeGridActionBegin(args) {
            // Don't support "Entf/Del" key
            if (args.requestType == "delete") {
                args.cancel = true;
            }
        }
        /**
         * A treegrid column was resized
         *
         * @private
         * @param {*} args
         * @memberof CursorInfoWidget
         */
        treeGridColumnResized(args) {
            super.resizeDynamicColumn(args.columnIndex, args.model);
            if (this._cursorInfoSelectorIsActive) {
                this.updateCheckBoxes();
            }
            // Refresh cursor info values after resize (treegrid sets the data to "0" after resize)
            this.refreshCursorValues();
            // Just persist column resize when filter is closed
            if (!this._cursorInfoSelectorIsActive) {
                this.saveTreeGridSettings();
            }
        }
        /** resizes the cursor values widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof CursorInfoWidget
         */
        resize(width, height) {
            super.resize(width, height);
            if (this._cursorInfoSelectorIsActive) {
                this.updateCheckBoxes();
            }
            // Refresh cursor values after resize (treegrid sets the data to "0" after resize)
            this.refreshCursorValues();
        }
        activateCursorInfoSelectorView(activate) {
            this._toolbar.activateCursorInfoSelectorView(activate);
            if (activate == true) {
                this.showCursorInfoSelectorView();
            }
            else {
                this.showCursorSignalsView();
            }
            // Update toolbar button positions(e.g. position of right align toolbar) after hide or show toolbar button
            this._toolbar.resize(this.width);
        }
        /**
         * Shows the curser signals with the filtered/defined cursor informations
         *
         * @memberof CursorInfoWidget
         */
        showCursorSignalsView() {
            this._cursorInfoSelectorIsActive = false;
            this._selectedCursorInfosOld = undefined;
            this._selectedCursorInfosNew = undefined;
            // Show actual cursorInfo data
            this.refresh();
            // Sets the column visibilities
            let treeGridObject = super.getTreeGridObject();
            this.setColumnVisiblities(treeGridObject, false);
            // set the selection to state before switching to the cursor info selector view
            this.setSelectionWithCursorSignals(treeGridObject, this._selectedCursorSignals);
            // Update the dynamic column size after hide/show of some columns
            this.resizeDynamicColumn(0, treeGridObject.model);
            // refresh the cursor info values
            this.refreshCursorValues();
        }
        /**
         * Shows the cursor info selector view
         *
         * @memberof CursorInfoWidget
         */
        showCursorInfoSelectorView() {
            this._cursorInfoSelectorIsActive = true;
            // Reset cursor info template datamodel
            this._cursorInfoTemplateDataModel.splice(0, this._cursorInfoTemplateDataModel.length);
            // create a signal template based on the selected series
            let templateCursorSignal = new dynamicCursorSignalTemplate_1.DynamicCursorSignalTemplate(this._selectedCursorSignals);
            // add the signal template to the model
            this._cursorInfoTemplateDataModel.push(templateCursorSignal);
            // Set cursor info template visibilities
            this.updateTemplateVisibilities(this._selectedCursorSignals, templateCursorSignal);
            // show cursor info template datamodel (the possible cursor infos)
            this.updateDataSource(this._cursorInfoTemplateDataModel);
            // Sets the column visibilities
            let treeGridObject = super.getTreeGridObject();
            this.setColumnVisiblities(treeGridObject, true);
            // Update the dynamic column size after hide/show of some columns
            this.resizeDynamicColumn(0, treeGridObject.model);
            // Removes the filter of the visibility flag which is needed in the cursor signal view
            treeGridObject.clearFilter(this._columnId_Visible);
            // Convert custom check boxes into syncfusion check boxes
            this.updateCheckBoxes();
        }
        /**
         * Sets the column visibilities for the cursor info selector view or the cursor signals view
         *
         * @private
         * @param {*} treeGridObject
         * @param {boolean} cursorInfoSelectorView
         * @memberof CursorInfoWidget
         */
        setColumnVisiblities(treeGridObject, cursorInfoSelectorView) {
            // get needed columns
            let visibleColumn = treeGridObject.getColumnByField(this._columnId_Visible);
            let descriptionColumn = treeGridObject.getColumnByField(this._columnId_Description);
            let valueColumn = treeGridObject.getColumnByField(this._columnId_Value);
            if (cursorInfoSelectorView == false) {
                // Hide visible column
                treeGridObject.hideColumn(visibleColumn.headerText);
                // Hide description column
                treeGridObject.hideColumn(descriptionColumn.headerText);
                // Show value column
                treeGridObject.showColumn(valueColumn.headerText);
            }
            else {
                // Show visible column
                treeGridObject.showColumn(visibleColumn.headerText);
                // Show description column
                treeGridObject.showColumn(descriptionColumn.headerText);
                // Hide value column
                treeGridObject.hideColumn(valueColumn.headerText);
            }
        }
        /**
         * Sets the selection to the given selection objects in cursor info selector view
         *
         * @private
         * @param {Array<any>} selectedObjects
         * @memberof CursorInfoWidget
         */
        setSelectionInCursorInfoSelectorView(selectedObjects) {
            if (selectedObjects === undefined) {
                return;
            }
            let treeGridObject = this.getTreeGridObject();
            treeGridObject.clearSelection();
            if (selectedObjects.length !== undefined) {
                for (var i = 0; i < selectedObjects.length; i++) {
                    treeGridObject._multiSelectCtrlRequest = true;
                    let visibleIndex = 0;
                    for (let j = 0; j < treeGridObject.model.flatRecords.length; j++) {
                        if (treeGridObject.model.flatRecords[j].id == selectedObjects[i].id) {
                            treeGridObject.selectRows(visibleIndex);
                        }
                        visibleIndex++;
                    }
                }
            }
            else {
                treeGridObject.selectRows(selectedObjects.index);
            }
            // Set actual selection for later use 
            this._selectedCursorInfosOld = selectedObjects;
            this._selectedCursorInfosNew = selectedObjects;
        }
        ;
        /**
         * Sets the selection to the given cursor signals
         *
         * @private
         * @param {*} treeGridObject
         * @param {Array<CursorSignal>} cursorSignals
         * @memberof CursorInfoWidget
         */
        setSelectionWithCursorSignals(treeGridObject, cursorSignals) {
            // deselect all selections in cursor signals view
            treeGridObject.clearSelection();
            if (cursorSignals == undefined) {
                return;
            }
            for (var i = 0; i < cursorSignals.length; i++) {
                treeGridObject._multiSelectCtrlRequest = true;
                let visibleIndex = 0;
                let model = treeGridObject.model;
                for (let j = 0; j < model.flatRecords.length; j++) {
                    if (model.flatRecords[j].item == cursorSignals[i]) {
                        treeGridObject.selectRows(visibleIndex);
                    }
                    if (model.flatRecords[j].visible != "false") {
                        visibleIndex++;
                    }
                }
            }
        }
        ;
        /**
         * Sets the visible flags in the template cursor signal to the informations from the cursor signals
         * (e.g. all signals show y1 cursor info so therefore template cursor info visibility is set to "true";
         *       all signals dosn't show y1 cursor info so therefore template cursor info visibility is set to "false";
         *       some signals show y1 cursor info so therefore template cursor info visibility is set to "indeterminate";
         * )
         *
         * @private
         * @param {Array<CursorSignal>} cursorSignals
         * @param {DynamicCursorSignalTemplate} templateCursorSignal
         * @returns
         * @memberof CursorInfoWidget
         */
        updateTemplateVisibilities(cursorSignals, templateCursorSignal) {
            if (templateCursorSignal && templateCursorSignal.cursorInfos) {
                // for all available merged cursor infos
                templateCursorSignal.cursorInfos.forEach((templateCursorSignalInfo) => {
                    // clear existing visibility
                    templateCursorSignalInfo.visible = "";
                    // get the cursor infos by id
                    let matchingCursorInfos = this.retrievCursorInfosById(cursorSignals, templateCursorSignalInfo.id);
                    // for all selected cursor signals with matching id ...
                    matchingCursorInfos.forEach((cursorSignalInfo) => {
                        // if the visibility is yet undefined ..
                        if (!templateCursorSignalInfo.visible) {
                            // initialize the visibility with the first cursor signal infos value.
                            templateCursorSignalInfo.visible = cursorSignalInfo.visible;
                        }
                        else {
                            // set visibility to undetermined if one of the following values is different
                            if (cursorSignalInfo.visible !== templateCursorSignalInfo.visible) {
                                templateCursorSignalInfo.visible = this._indeterminateStateValue;
                            }
                        }
                    });
                });
            }
        }
        /**
         * Sets the visibility defined in the template cursor signal to the cursor signals
         *
         * @private
         * @param {Array<CursorSignal>} cursorSignals
         * @param {DynamicCursorSignalTemplate} templateCursorSignal
         * @returns
         * @memberof CursorInfoWidget
         */
        setCursorInfoVisibilities(cursorSignals, templateCursorSignal) {
            if (templateCursorSignal && templateCursorSignal.cursorInfos) {
                // for all available merged cursor infos
                templateCursorSignal.cursorInfos.forEach((templateCursorSignalInfo) => {
                    if (templateCursorSignalInfo.visible !== this._indeterminateStateValue) {
                        // get the cursor infos by id
                        let matchingCursorInfos = this.retrievCursorInfosById(cursorSignals, templateCursorSignalInfo.id);
                        // for all selected cursor infos with matching id ...
                        matchingCursorInfos.forEach((cursorSignalInfo) => {
                            // set the cursor signals visibility from the template value if a valid state is defined
                            cursorSignalInfo.visible = templateCursorSignalInfo.visible;
                        });
                    }
                });
            }
        }
        /**
         * gets the cursor infos with the specified id
         *
         * @private
         * @param {Array<CursorSignal>} cursorSignals
         * @param {string} cursorInfoId
         * @returns {Array<CursorInfo>}
         * @memberof CursorInfoWidget
         */
        retrievCursorInfosById(cursorSignals, cursorInfoId) {
            let matchingCursorInfos = [];
            cursorSignals.forEach((cursorSignal) => {
                cursorSignal.cursorInfos.forEach((cursorSignalInfo) => {
                    if (cursorSignalInfo.id === cursorInfoId) {
                        matchingCursorInfos.push(cursorSignalInfo);
                    }
                });
            });
            return matchingCursorInfos;
        }
        /**
         * Raises the move cursor event
         *
         * @param {number} cursorIndex
         * @param {CursorMovement} movement
         * @memberof CursorInfoWidget
         */
        onMoveCursor(cursorIndex, movement) {
            let data = [];
            let x = this.cursorsStates.getPosition(cursorIndex, this.cursorsStates.getLastCursorTypeSelected());
            if (this._cursorSignalsDataModel != undefined) {
                let cursors = this._cursorSignalsDataModel.getCursorSignals();
                cursors.forEach(cursor => {
                    data.push(cursor.serie);
                });
                if (x != undefined) {
                    this.moveCursor(cursorIndex, movement, data, x);
                }
            }
        }
        /**
         * moves the cursor for the specified direction and offset
         *
         * @private
         * @param {number} cursorIndex
         * @param {CursorMovement} cursorMovement
         * @param {BaseSeries[]} series
         * @param {number} cursorPosition
         * @memberof CursorInfoWidget
         */
        moveCursor(cursorIndex, cursorMovement, series, cursorPosition) {
            let cursorType = this.cursorsStates.getLastCursorTypeSelected();
            // get the next possible cursor timestamp
            let nearestTimestamp = this.findNearestTimestampInSeries(series, cursorPosition, cursorMovement, cursorType);
            // update the cursors timestamp location
            this.updateCursorLocation(cursorIndex, nearestTimestamp);
        }
        /**
         * searches the next timestamp in all available series. The picked value takes the movement direction intoi account.
         *
         * @private
         * @param {BaseSeries[]} series
         * @param {number} cursorTimeStamp
         * @param {CursorMovement} cursorMovement
         * @returns {number}
         * @memberof CursorInfoWidget
         */
        findNearestTimestampInSeries(series, cursorTimeStamp, cursorMovement, cursorType) {
            // retrieve the timestamps series from the signal series
            let timestampSeries = series.map((singleSeries) => {
                if (cursorType_1.CursorTypeHelper.getCursorTypeForSeries(singleSeries) == cursorType) {
                    return singleSeries.timestamps;
                }
                else {
                    return [];
                }
            });
            let nextNearestTimeStamp = cursorTimeStamp;
            // dpendiung on movement direction we pick the next possible time stamp
            switch (cursorMovement) {
                case cursorInfoWidgetInterface_1.CursorMovement.Right:
                    nextNearestTimeStamp = seriesHelper_1.SeriesHelper.findNearestValueFromCollection(cursorTimeStamp, timestampSeries, binSearch_1.BinSearchMode.NEXTUPPER);
                    break;
                case cursorInfoWidgetInterface_1.CursorMovement.Left:
                    nextNearestTimeStamp = seriesHelper_1.SeriesHelper.findNearestValueFromCollection(cursorTimeStamp, timestampSeries, binSearch_1.BinSearchMode.PREVIOUSLOWER);
                    break;
            }
            return nextNearestTimeStamp;
        }
        /**
         * Handle cursor activation/selection
         *
         * @param {number} cursorIndex
         * @memberof CursorInfoWidget
         */
        onReferenceCursorSelected(cursorIndex) {
            // update the cursor selection state
            this.cursorsStates.setSelected(cursorIndex, true);
            this.updateCursorStates(this.cursorsStates);
            // set the cursors as active tool
            let toolState = new chartViewToolbarStates_1.ChartViewToolState();
            toolState.selectedTool = chartViewToolbarStates_1.ChartViewToolStateEnum.CURSORS;
            this.updateToolState(toolState);
        }
        /**
         * Adds a signal to the cursor info widget
         *
         * @param {Array<BaseSeries>} series
         * @memberof CursorInfoWidget
         */
        addSeries(series) {
            let cursorSignals = new Array();
            for (var i = 0; i < series.length; i++) {
                if (series[i].type === seriesType_1.SeriesType.timeSeries) {
                    cursorSignals.push(new ytCursorSignal_1.YTCursorSignal(series[i], false));
                }
                else if (series[i].type === seriesType_1.SeriesType.xySeries) {
                    cursorSignals.push(new xyCursorSignal_1.XYCursorSignal(series[i], false));
                }
                else if (series[i].type === seriesType_1.SeriesType.fftSeries) {
                    cursorSignals.push(new fftCursorSignal_1.FFTCursorSignal(series[i], false));
                }
            }
            if (this._cursorSignalsDataModel != undefined) {
                this._cursorSignalsDataModel.addCursorSignals(cursorSignals);
            }
        }
        /**
         * Remove a cursor signal from the cursor info widget
         *
         * @param {BaseSeries} serie
         * @memberof CursorInfoWidget
         */
        removeSerie(serie) {
            if (this._cursorSignalsDataModel != undefined) {
                let cursorSignal = this._cursorSignalsDataModel.getCursorSignal(serie);
                if (cursorSignal) {
                    this._cursorSignalsDataModel.removeCursorSignal(cursorSignal);
                    // Disables filter button if is active
                    let toolbar = this._toolbar;
                    if (toolbar.cursorInfoSelectionIsActive) {
                        toolbar.activateCursorInfoSelectorView(!toolbar.cursorInfoSelectionIsActive);
                    }
                    // Removes the cursor signal from the current selection list and updates the toolbar button
                    let index = this._selectedCursorSignals.indexOf(cursorSignal);
                    if (index != -1) {
                        this._selectedCursorSignals.splice(index, 1);
                        this.updateCursorInfoSelectorButtonState();
                    }
                }
            }
        }
        /**
         * changes and updates the cursor location of the selected cursor
         *
         * @param {number} cursorIndex
         * @param {number} cursorTimestamp
         * @memberof CursorInfoWidget
         */
        updateCursorLocation(cursorIndex, cursorTimestamp) {
            this.cursorsStates.setPosition(cursorIndex, cursorTimestamp);
            this.updateCursorStates(this.cursorsStates);
        }
        /**
         * refreshes the tree grids data
         *
         * @memberof CursorInfoWidget
         */
        refresh() {
            // refresh tree grid only if cursor signal view is active (not in case of cursor info selector)
            if (!this._cursorInfoSelectorIsActive && this.refreshEnabled) {
                if (this._cursorSignalsDataModel != undefined) {
                    let cursorSignals = this._cursorSignalsDataModel.getCursorSignals();
                    this.updateDataSource(cursorSignals);
                }
                // set the selection to the select signal before
                let treeGridObject = this.getTreeGridObject();
                this.setSelectionWithCursorSignals(treeGridObject, this._selectedCursorSignals);
                // Update cursor info values 
                this.refreshCursorStates();
            }
        }
        /**
         * Trigger the update of the cursorInfos for the current cursor states
         *
         * @private
         * @memberof CursorInfoWidget
         */
        refreshCursorStates() {
            this.updateCursorStates(this.cursorsStates);
        }
        updateDataSource(cursorSignals) {
            this.setCursorValueUiIds(cursorSignals);
            // Refresh TreeGrid with new datasource
            this.setModel(cursorSignals);
            // Refresh the cursor values after updating the model
            this.refreshCursorValues(cursorSignals);
        }
        /**
         * Defines and sets uids for every cursor value (cursor signals and cursor infos)
         *
         * @private
         * @param {Array<CursorSignal>} cursorSignals
         * @memberof CursorInfoWidget
         */
        setCursorValueUiIds(cursorSignals) {
            let cursorInfoId = 0;
            cursorSignals.forEach((cursorSignal) => {
                cursorSignal.uiId = cursorInfoId++;
                cursorSignal.cursorInfos.forEach((cursorInfo) => {
                    cursorInfo.uiId = cursorInfoId++;
                });
            });
        }
        /**
         * Refresh all cursor values
         *
         * @private
         * @memberof CursorInfoWidget
         */
        refreshCursorValues(cursorSignals = undefined) {
            if (cursorSignals == undefined && this._cursorSignalsDataModel != undefined) {
                cursorSignals = this._cursorSignalsDataModel.getCursorSignals();
            }
            if (cursorSignals != undefined) {
                cursorSignals.forEach((cursorSignal) => {
                    this.refreshCursorValueField(cursorSignal);
                    cursorSignal.cursorInfos.forEach((cursorInfo) => {
                        this.refreshCursorValueField(cursorInfo);
                    });
                });
            }
        }
        /**
         * updates a cursor value field with the current values of the correspondig cursor signal or info
         *
         * @private
         * @param {CursorSignal|CursorInfo} cursorSignalOrInfo
         * @memberof CursorInfoWidget
         */
        refreshCursorValueField(cursorSignalOrInfo) {
            if (cursorSignalOrInfo) {
                // get the corresponding ui element
                let cursorValueElement = this.getCursorValueElement(cursorSignalOrInfo);
                if (cursorValueElement != undefined) {
                    let valueString = cursorSignalOrInfo.value.toString();
                    cursorValueElement.innerText = valueString;
                }
            }
        }
        /**
         * Gets the corresponding cursor signal or info element
         *
         * @private
         * @param {CursorSignal|CursorInfo} cursorSignalOrInfo
         * @returns {(HTMLDivElement | undefined)}
         * @memberof CursorInfoWidget
         */
        getCursorValueElement(cursorSignalOrInfo) {
            var mySubDiv = this.mainDiv.querySelector("#" + this.mainDivId + CURSOR_VALUE_ID + cursorSignalOrInfo.uiId);
            if (mySubDiv == null) {
                return undefined;
            }
            return mySubDiv;
        }
        onCursorSignalsDataModelChanged(sender, args) {
            this.refresh();
            this.saveTreeGridSettings();
        }
        /**
         * This method will update the cursor info widget with data from
         * the cursor state.
         *
         * @private
         * @param {CursorStates} modifiedState
         * @memberof CursorInfoWidget
         */
        updateInfoCursorsWithNewStateValues(modifiedState) {
            if (this._cursorSignalsDataModel != undefined) {
                this._cursorSignalsDataModel.updateInfoCursorsWithNewCursorStateValues(modifiedState);
            }
            this._toolbar.updateButtonStates(modifiedState);
            this.refreshCursorValues();
        }
        /**
         * Convert custom check boxes into syncfusion check boxes
         *
         * @private
         * @memberof CursorInfoWidget
         */
        updateCheckBoxes() {
            var checkBoxes = $('.customCheckbox');
            for (var i = 0; i < checkBoxes.length; i++) {
                checkBoxes[i].id = 'customCheckbox' + (i + 1);
                this.creatSyncfusionCheckbox(checkBoxes[i]);
            }
        }
        /**
         * Instantiate syncfusion check box
         *
         * @private
         * @param {HTMLElement} customCheckbox
         * @memberof CursorInfoWidget
         */
        creatSyncfusionCheckbox(customCheckbox) {
            var enableTriState = false;
            var state = this.getCustomCheckboxState($(customCheckbox));
            if (state === 'indeterminate') {
                enableTriState = true;
            }
            $(customCheckbox).ejCheckBox({
                enableTriState: enableTriState,
                id: customCheckbox.id,
                checkState: state,
                cssClass: "cursorInfoWidget",
                change: (args) => this.syncfusionCheckBoxChanged(args),
            });
        }
        /**
         * Trigger check box change event
         *
         * @private
         * @param {*} args
         * @memberof CursorInfoWidget
         */
        syncfusionCheckBoxChanged(args) {
            if (args.model.enableTriState) {
                $('#' + args.model.id).ejCheckBox({ enableTriState: false });
            }
            this.setSelectedCursorsInfo(args);
            var customCheckbox = $('#' + args.model.id);
            customCheckbox.change();
        }
        /**
         * Set selected cursor info when checkbox is clicked
         *
         * @param {*} args
         * @memberof CursorInfoWidget
         */
        setSelectedCursorsInfo(args) {
            var treegrid = this.getTreeGridObject();
            var index = parseInt(args.model.id.split('customCheckbox')[1], 10);
            if (this._selectedCursorInfosOld == undefined) {
                this._selectedCursorInfosOld = treegrid.model.flatRecords[index];
            }
            else {
                this._selectedCursorInfosOld = this._selectedCursorInfosNew;
            }
            this._selectedCursorInfosNew = treegrid.model.flatRecords[index];
        }
        /**
         * get state of checkbox
         *
         * @private
         * @param {JQuery<HTMLElement>} checkbox
         * @returns {string}
         * @memberof CursorInfoWidget
         */
        getCustomCheckboxState(checkbox) {
            if (checkbox.is(':checked')) {
                return 'check';
            }
            else if (checkbox.is(':indeterminate')) {
                return 'indeterminate';
            }
            else {
                return 'uncheck';
            }
        }
        /**
         * Attaches the chart manager datamodel events
         *
         * @private
         * @memberof CursorInfoWidget
         */
        attachChartManagerDataModelEvents() {
            if (this._chartManagerDataModel) {
                this._chartManagerDataModel.eventModelChanged.attach(this._chartManagerModelChangedHandler);
            }
        }
        /**
         * Detaches the chart manager datamodel events
         *
         * @private
         * @memberof CursorInfoWidget
         */
        detachChartManagerDataModelEvents() {
            if (this._chartManagerDataModel) {
                this._chartManagerDataModel.eventModelChanged.detach(this._chartManagerModelChangedHandler);
            }
        }
        /**
         * chartManagerModel has changed
         *
         * @private
         * @param {*} sender
         * @param {*} args
         * @memberof CursorInfoWidget
         */
        onChartManagerModelChanged(sender, args) {
            // Update the cursor info widget
            if (args.hint == chartManagerDataModel_1.ChartManagerDataModelChangedHint.addSerie && args.data.series != undefined) {
                this.addSeries(args.data.series);
            }
            else if (args.hint == chartManagerDataModel_1.ChartManagerDataModelChangedHint.removeSerie) {
                if (args.data.signalUsedInOtherCharts == false) {
                    this.removeSerie(args.data.serie);
                }
            }
        }
    };
    CursorInfoWidget = __decorate([
        mco.role()
    ], CursorInfoWidget);
    exports.CursorInfoWidget = CursorInfoWidget;
});
