var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../common/treeGridWidgetBase", "../../models/common/signal/serieGroup", "./view/smTreeGridCellEditEvents", "./view/smTreeGridCellEditTemplate", "./view/signalManagerTreeGridToolbar", "../../common/fileProvider", "../../framework/events", "../../common/exportImportHelper", "../common/busyInformation", "../../models/signalManagerDataModel/signalCategory", "../../models/signalManagerDataModel/signalManagerCalculation", "../../models/common/signal/serieContainer", "../../models/common/signal/serieNode", "../common/interfaces/dropInterface", "../common/dragDataObject", "../../models/signalManagerDataModel/signalManagerCalculationInputData", "../../models/signalManagerDataModel/signalManagerCalculationOutputData", "../common/dragDropRepresentation", "../../models/signalManagerDataModel/signalManagerCalculatorType", "../../models/common/series/seriesType", "./helpers/exportHelper", "../common/alertDialog", "../../models/signalManagerDataModel/signalRoot", "./componentDefaultDefinition", "../common/widgetBase", "../../common/persistence/persistDataProvider", "../../common/packageConversion/mceConversionError", "../../common/mceExportImport/mceExportImportHelper", "../../framework/componentHub/componentDataHub", "../common/states/cursorStates", "../traceViewWidget/bindingIds"], function (require, exports, treeGridWidgetBase_1, serieGroup_1, smTreeGridCellEditEvents_1, smTreeGridCellEditTemplate_1, signalManagerTreeGridToolbar_1, fileProvider_1, events_1, exportImportHelper_1, busyInformation_1, signalCategory_1, signalManagerCalculation_1, serieContainer_1, serieNode_1, dropInterface_1, dragDataObject_1, signalManagerCalculationInputData_1, signalManagerCalculationOutputData_1, dragDropRepresentation_1, signalManagerCalculatorType_1, seriesType_1, exportHelper_1, alertDialog_1, signalRoot_1, componentDefaultDefinition_1, widgetBase_1, persistDataProvider_1, mceConversionError_1, mceExportImportHelper_1, componentDataHub_1, cursorStates_1, bindingIds_1) {
    "use strict";
    var SignalManagerWidget_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalManagerWidget = void 0;
    let EventSerieDoubleClicked = class EventSerieDoubleClicked extends events_1.TypedEvent {
    };
    EventSerieDoubleClicked = __decorate([
        mco.role()
    ], EventSerieDoubleClicked);
    ;
    let EventChangeSize = class EventChangeSize extends events_1.TypedEvent {
    };
    EventChangeSize = __decorate([
        mco.role()
    ], EventChangeSize);
    ;
    let SignalManagerWidget = SignalManagerWidget_1 = class SignalManagerWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            this._highlightAreaId = "signalManager_Highlighted";
            this._deleteItemsContent = "This action will permanently delete selected elements.";
            this._deleteItemsHeader = "Delete recorded data?";
            this._warningImportingHeader = "Import canceled";
            this._warningImportingContent = "It is not possible to import one .mce file with other files at the same time.";
            this._MCEFilesImportedHeader = "Delete all trace data?";
            this._MCEFilesImportedContent = "Do you want to delete all trace data and import the .mce file?";
            this._isFirstResize = true;
            this._indexesDragged = [];
            this._fileProvider = new fileProvider_1.FileProvider("FileProviderSignalManagerWidget");
            this.editModeActive = false;
            this._widthDefaultModeActive = 0;
            this._widthEditModeActive = 0;
            this._defaultWidthDifference = 450;
            this._minWidth = 250;
            this.eventSerieDoubleClicked = new EventSerieDoubleClicked();
            this.eventChangeSize = new EventChangeSize();
            this._uploadDataFinishedHandler = (sender, args) => this.onUploadDataFinished(args);
        }
        /**
         * Gets the information if the auto upload of tracedata is active
         *
         * @readonly
         * @type {boolean}
         * @memberof SignalManagerWidget
         */
        get autoUploadActive() {
            return true;
        }
        /**
         * Defines the height of the header
         *
         * @returns {number}
         * @memberof SignalManagerWidget
         */
        defineHeaderHeight() {
            return 30;
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
        }
        initialized() {
            super.initialized();
            this.initSignalManagerDataModel();
            this.initSeriesProvider();
            this.initChartManagerDataModel();
            this.refresh();
            super.setHeaderContent("Signals");
            // Set dynamic column settings
            super.setDynamicColumn(0, 40);
            // Initialize scrollbars positions
            let scrollbarSettings = this.component.getSetting(treeGridWidgetBase_1.TreeGridWidgetBase.ScrollbarsSettingsId);
            this.setScrollBarSettings(scrollbarSettings);
            // Add drag support
            super.addDraggingSupport();
            // Add drop support
            super.addSupportedDragDropDataId(dropInterface_1.DragDropDataId.signal);
            // Attach on file upload event
            this._fileProvider.eventUploadDataFinished.attach(this._uploadDataFinishedHandler);
        }
        dispose() {
            this.removeSupportedDragDropDataId(dropInterface_1.DragDropDataId.signal);
            // Detach on file upload event
            this._fileProvider.eventUploadDataFinished.detach(this._uploadDataFinishedHandler);
            super.dispose();
        }
        //#region drag support
        startDragging() {
            if (this._currentDragDropSeries != undefined) {
                let signalImage, signalName;
                let imageProvider = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.ImageProviderId);
                if (this._currentDragDropSeries.length == 1) {
                    // Default yt series svg
                    signalName = this._currentDragDropSeries[0].name;
                    if (imageProvider != undefined) {
                        signalImage = imageProvider.getImage("../app/widgets/common/style/images/dragDrop/ytSeries.svg");
                        if (this._currentDragDropSeries[0].type == seriesType_1.SeriesType.xySeries) {
                            // Use xy series svg
                            signalImage = imageProvider.getImage("../app/widgets/common/style/images/dragDrop/xySeries.svg");
                        }
                        else if (this._currentDragDropSeries[0].type == seriesType_1.SeriesType.fftSeries) {
                            // Use fft series svg
                            signalImage = imageProvider.getImage("../app/widgets/common/style/images/dragDrop/fftSeries.svg");
                        }
                        if (signalImage != undefined) {
                            // Replace serie color in svg with color of current serie
                            signalImage = signalImage.replace("stroke:#76bea6", "stroke:" + this._currentDragDropSeries[0].color);
                        }
                    }
                }
                else {
                    if (imageProvider != undefined) {
                        if (this._currentDragDropSeries[0].type == seriesType_1.SeriesType.xySeries) {
                            signalImage = imageProvider.getImage("../app/widgets/common/style/images/dragDrop/severalXYSeries.svg");
                        }
                        else if (this._currentDragDropSeries[0].type == seriesType_1.SeriesType.fftSeries) {
                            signalImage = imageProvider.getImage("../app/widgets/common/style/images/dragDrop/severalFFTSeries.svg");
                        }
                        else {
                            signalImage = imageProvider.getImage("../app/widgets/common/style/images/dragDrop/severalYTSeries.svg");
                        }
                    }
                }
                let dragDropIconRepresentation = new dragDropRepresentation_1.DragDropRepresentation();
                dragDropIconRepresentation.iconList.push(signalImage);
                dragDropIconRepresentation.textList.push(signalName);
                return new dragDataObject_1.DragDropDataObject(dropInterface_1.DragDropDataId.signal, this._currentDragDropSeries, dragDropIconRepresentation);
            }
            return undefined;
        }
        draggingStopped() {
            // Reset current drag drop signal
            this._currentDragDropSeries = undefined;
            this._currentCalculatorType = undefined;
            this._indexesDragged = [];
        }
        //#endregion
        //#region drop support
        addDropLocations(series) {
            if (series[0].parent != undefined && series.length == 1) {
                series[0].parent.visibleChilds.forEach(child => {
                    if (child instanceof signalManagerCalculation_1.SignalManagerCalculation) {
                        child.setDropLocations(true, series[0]);
                    }
                });
            }
        }
        removeDropLocations(series) {
            if (series[0].parent != undefined && series.length == 1) {
                series[0].parent.visibleChilds.forEach(child => {
                    if (child instanceof signalManagerCalculation_1.SignalManagerCalculation) {
                        child.setDropLocations(false, series[0]);
                    }
                });
            }
        }
        dragStart(args) {
            let series = args.data;
            // Add possible dropLocations
            this.addDropLocations(series);
            // Update treeGrid
            this.refresh();
            let treeGridObj = this.getTreeGridObject();
            this.updateSerieSelection(treeGridObj, this._indexesDragged);
        }
        dragStop(args) {
            let series = args.data;
            // Remove possible dropLocations
            this.removeDropLocations(series);
            // Update treeGrid
            this.refresh();
            let treeGridObj = this.getTreeGridObject();
            this.updateSerieSelection(treeGridObj, this._indexesDragged);
        }
        dragOver(args) {
            let calculationInputItem = this.getCalculationInputFromDropLocation(args.currentTarget);
            if (calculationInputItem != undefined && calculationInputItem.dropPossible == true) {
                this.addHighlightedArea(args.currentTarget);
                return true;
            }
            else {
                this.resetHighlightArea();
            }
            return false;
        }
        drop(args) {
            let series = args.data[0];
            let calculationInputTarget = this.getCalculationInputFromDropLocation(args.currentTarget);
            let calculationInputDraggedItem = this.getCalculationInputDragged(series);
            if (calculationInputTarget != undefined && calculationInputTarget.dropPossible == true) {
                if (series != undefined) {
                    //Exchange of serie if the dragged serie is inside the calculator
                    if (this._currentCalculatorType == calculationInputTarget.parent && calculationInputDraggedItem != undefined) {
                        let oldValue = calculationInputTarget.value;
                        calculationInputDraggedItem.value = oldValue;
                    }
                    calculationInputTarget.value = series.name;
                }
            }
        }
        /**
         * Adds a <div> into the cell when droppable is possible and signal is being dragged over
         *
         * @private
         * @param {*} currentTarget
         * @memberof SignalManagerWidget
         */
        addHighlightedArea(currentTarget) {
            let highlightElem = $('<div id="' + this._highlightAreaId + '" style=" pointer-events:none; position:absolute; " class="draggedOver"></div>');
            this.resetHighlightArea(highlightElem);
            $(currentTarget).append(highlightElem);
            highlightElem.offset({ top: $(currentTarget).offset().top, left: $(currentTarget).offset().left });
            highlightElem.css('height', currentTarget.offsetHeight);
            highlightElem.css('width', currentTarget.offsetWidth);
        }
        /**
         * Remove all signalManager highlighted areas (except the selected one)
         *
         * @private
         * @param {JQuery<HTMLElement>} [element]
         * @memberof SignalManagerWidget
         */
        resetHighlightArea(element) {
            let highlightElem = $('#' + this._highlightAreaId);
            for (var i = 0; i < highlightElem.length; i++) {
                if (element == undefined || highlightElem[i] != element[0]) {
                    highlightElem[i].remove();
                }
            }
        }
        getCalculationInputFromDropLocation(currentTarget) {
            let record = this.getTreeRecord(currentTarget);
            if (record != undefined) {
                if (record.item instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData && currentTarget.classList.value.includes('dropLocationArea')) {
                    return record.item;
                }
            }
            return undefined;
        }
        getCalculationInputDragged(serie) {
            if (this._currentCalculatorType != undefined) {
                for (var i = 0; i < this._currentCalculatorType.getChilds().length; i++) {
                    if (this._currentCalculatorType.getChilds()[i].serie == serie) {
                        return this._currentCalculatorType.getChilds()[i];
                    }
                }
            }
            return undefined;
        }
        //#endregion
        /**
         * Creates the layout of the widget
         *
         * @memberof SignalManagerWidget
         */
        createLayout() {
            this.mainDiv.style.overflow = "hidden";
            super.createLayout();
        }
        initSignalManagerDataModel() {
            let dataModel = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SignalManagerDataModelId);
            this.dataModel = dataModel;
        }
        initSeriesProvider() {
            this._seriesProvider = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SeriesProviderId);
        }
        initChartManagerDataModel() {
            this._chartManagerDataModel = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.ChartManagerDataModelId);
        }
        /**
         * Handles the model changes
         *
         * @param {IDataModel} sender
         * @param {EventModelChangedArgs} eventArgs
         * @returns {*}
         * @memberof SignalManagerWidget
         */
        handleModelChanged(sender, eventArgs) {
            this.refresh();
            this.saveTreeGridSettings();
        }
        /**
         * Resizes the signal manager widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof SignalManagerWidget
         */
        resize(width, height) {
            if (this._isFirstResize && this.editModeActive) {
                // Deactivate editMode and set correct width when widget is initialized
                this._isFirstResize = false;
                this.activateEditMode(false);
            }
            else {
                this._isFirstResize = false;
                if (this.editModeActive) {
                    this._widthEditModeActive = width;
                }
                else {
                    this._widthDefaultModeActive = width;
                }
                // Persist new size
                persistDataProvider_1.PersistDataProvider.getInstance().setDataWithId(this.component.id, this.getComponentSettings(true));
                super.resize(width, height);
            }
        }
        /**
     * Sets the selection to the given series
     *
     * @private
     * @param {*} treeGridObject
     * @param {Array<number>} indexes
     * @memberof SignalManagerWidget
     */
        updateSerieSelection(treeGridObject, indexes) {
            // deselect all selections in signal pane
            treeGridObject.clearSelection();
            if (indexes[0] == undefined) {
                return;
            }
            for (var i = 0; i < indexes.length; i++) {
                treeGridObject._multiSelectCtrlRequest = true;
                let visibleIndex = 0;
                for (let j = 0; j < treeGridObject.model.flatRecords.length; j++) {
                    if (j == indexes[i]) {
                        treeGridObject.selectRows(visibleIndex);
                    }
                    if (treeGridObject.model.flatRecords[j].visible != "false") {
                        visibleIndex++;
                    }
                }
            }
        }
        ;
        /**
         * Refreshes the tree grid
         *
         * @private
         * @memberof SignalManagerWidget
         */
        refresh() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    if (this.refreshEnabled) {
                        this.setModelWithEditSupport(this.dataModel.data);
                    }
                }
                catch (e) {
                    console.info("SignalManager refresh error! => TreeGrid recreation!");
                    console.info(e);
                    this.createTreeGrid();
                }
            });
        }
        /**
         * Creates the column templates for the tree grid and adds them to the widget container
         *
         * @protected
         * @memberof SignalManagerWidget
         */
        createTemplates() {
            var $widgetContainer = $(this.mainDiv);
            $widgetContainer.append(this.getColumnTemplateData(SignalManagerWidget_1.nameColumnId));
            $widgetContainer.append(this.getColumnTemplateData(SignalManagerWidget_1.colorColumnId));
        }
        /**
         * Creates the tree grid for the signal manager
         *
         * @protected
         * @memberof SignalManagerWidget
         */
        createTreeGrid() {
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridColumnResizeSupport()), this.getTreeGridToolbarSupport()), this.getTreeGridCellEditSupport()), this.getTreeGridDragDropSupport()), { dataSource: this.dataModel.data, childMapping: "visibleChilds", expandStateMapping: "expandState", allowReordering: false, rowHeight: 28, selectionSettings: {
                    selectionType: 'multiple'
                }, selectionType: 'multiple', expanded: () => this.treeGridNodeExpandedOrCollapsed(), collapsed: () => this.treeGridNodeExpandedOrCollapsed(), recordClick: (args) => this.click(), recordDoubleClick: (args) => this.doubleClick(args), rowSelected: (args) => this.rowSelected(args.data.item, args.model.currentViewData), create: () => this.treeGridCreated(), actionBegin: (args) => this.treeGridActionBegin(args), actionComplete: (args) => this.treeGridActionComplete(args), queryCellInfo: (args) => this.treeGridQueryCellInfo(args) }));
        }
        /**
         * Returns the tree grid column definition
         *
         * @private
         * @returns {{}}
         * @memberof SignalManagerWidget
         */
        getTreeGridColumnDefinition() {
            return {
                columns: [
                    { field: SignalManagerWidget_1.nameColumnId, headerText: "Name", width: "351px", isTemplateColumn: true, templateID: "smNameColumnTemplate" },
                    { field: SignalManagerWidget_1.valueColumnId, headerText: "Value", visible: this.editModeActive, width: "300px", editTemplate: smTreeGridCellEditTemplate_1.SmTreeGridCellEditTemplate.createInstance(), isTemplateColumn: true },
                    { field: SignalManagerWidget_1.descriptionColumnId, headerText: "Description", visible: this.editModeActive, width: "100px" },
                    { field: SignalManagerWidget_1.colorColumnId, headerText: "Color", width: "50px", visible: this.editModeActive, editType: "DatePicker", editTemplate: smTreeGridCellEditTemplate_1.SmTreeGridCellEditTemplate.createInstance(), isTemplateColumn: true, templateID: "smColorColumnTemplate" },
                    { field: SignalManagerWidget_1.iconDefinitionColumnId, visible: false, width: "0px" },
                ],
            };
        }
        /**
         * Returns the tree grid column resize settings
         *
         * @private
         * @returns {{}}
         * @memberof SignalManagerWidget
         */
        getTreeGridColumnResizeSupport() {
            return {
                allowColumnResize: true,
                columnResizeSettings: { columnResizeMode: ej.TreeGrid.ColumnResizeMode.FixedColumns },
                columnResized: (args) => this.treeGridColumnResized(args),
            };
        }
        /**
         * A treegrid column was resized
         *
         * @private
         * @param {*} args
         * @memberof SignalManagerWidget
         */
        treeGridColumnResized(args) {
            super.resizeDynamicColumn(args.columnIndex, args.model);
            this.saveTreeGridSettings();
        }
        /**
         * Returns the tree grid toolbar settings
         *
         * @private
         * @returns {{}}
         * @memberof SignalManagerWidget
         */
        getTreeGridToolbarSupport() {
            this._toolbar = new signalManagerTreeGridToolbar_1.SignalManagerTreeGridToolbar(this.mainDiv);
            return super.getTreeGridToolbarSupport();
        }
        /**
         * Returns the tree grid cell edit settings
         *
         * @private
         * @returns {{}}
         * @memberof SignalManagerWidget
         */
        getTreeGridCellEditSupport() {
            var cellEditEvents = new smTreeGridCellEditEvents_1.SmTreeGridCellEditEvents();
            return {
                editSettings: { allowEditing: true },
                beginEdit: (args) => cellEditEvents.beginEdit(args, this),
                endEdit: (args) => cellEditEvents.endEdit(args, this),
            };
        }
        /**
         * Activates the signal manager drag and drop support
         *
         * @private
         * @returns {{}}
         * @memberof SignalManagerWidget
         */
        getTreeGridDragDropSupport() {
            return {
                allowDragAndDrop: true,
                rowDragStart: (args) => this.rowDragStart(args),
            };
        }
        /**
         * Switch into "edit mode" or "normal mode"
         * if edit mode is active, the edit mode will be set to the datamodel, and the widget size will be increased
         * if normal mode is active, the normal mode will be set to the datamodel, and the widget size will be decreased
         *
         * @private
         * @param {boolean} active
         * @memberof SignalManagerWidget
         */
        setEditMode(active) {
            if (this.editModeActive != active) {
                this.editModeActive = active;
                let newSize = 0;
                if (active == true) {
                    if (this._widthEditModeActive == 0) {
                        this._widthEditModeActive = this._actualWidth + this._defaultWidthDifference;
                    }
                    newSize = this._widthEditModeActive;
                }
                else {
                    if (this._widthDefaultModeActive == 0) {
                        this._widthDefaultModeActive = this._actualWidth - this._defaultWidthDifference;
                        if (this._widthDefaultModeActive < this._minWidth) {
                            this._widthDefaultModeActive = this._minWidth;
                        }
                    }
                    newSize = this._widthDefaultModeActive;
                }
                this.onChangeSize(newSize);
            }
            this.dataModel.editModeActive = this.editModeActive;
            this._toolbar.activateEditModeButton(this.editModeActive);
        }
        /**
         * Well be called after some tree grid action was started
         *
         * @private
         * @param {*} args
         * @memberof SignalManagerWidget
         */
        treeGridActionBegin(args) {
            // Support "Entf/Del" key
            if (args.requestType == "delete") {
                args.cancel = true;
                if (this.containsItemWithinRecentOrUploaded(args.deletedItems)) {
                    this.showMessageBoxForDeletingItem(args.deletedItems);
                }
                else {
                    this.deleteItems(args.deletedItems);
                }
            }
        }
        /**
         * Loads the styles for the chart manager widget
         *
         * @memberof ChartManagerWidget
         */
        loadStyles() {
            super.loadStyles();
            super.addStyle("widgets/common/style/css/dropDownMenuStyle.css");
        }
        /**
         * Well be called after some tree grid action was completed
         *
         * @private
         * @param {*} args
         * @memberof SignalManagerWidget
         */
        treeGridActionComplete(args) {
            // Event trigger while changing datasource dynamically. 
            // code to done after the dynamic change of datasource. 
            if (args.requestType === 'refreshDataSource') {
                this.refreshSelection();
                if (this._serieContainerToSelectAfterRefresh != undefined) {
                    // Selects the imported signalfile, or the inserted calculation, ...
                    this.selectItem(this._serieContainerToSelectAfterRefresh);
                    this._serieContainerToSelectAfterRefresh = undefined;
                }
            }
        }
        /**
         * Will be called to update the style of the give cell if a refresh will be needed
         *
         * @private
         * @param {*} args
         * @memberof SignalManagerWidget
         */
        treeGridQueryCellInfo(args) {
            if (args.column.field == "name") {
                if (this.isGroupItem(args.data.item)) {
                    // Show group nodes always bold => also if they have no childs
                    if (args.cellElement.style != undefined) {
                        if (args.data.level == 0) {
                            args.cellElement.style.fontWeight = "800"; // 700 would be bold
                        }
                        else {
                            args.cellElement.style.fontWeight = "650";
                        }
                    }
                }
                // Show all nodes red which have invalid signals in it 
                if (this.isItemInvalid(args.data.item) == true) {
                    if (args.cellElement.style != undefined) {
                        args.cellElement.style.color = "red";
                        args.cellElement.style.fontWeight = "bold";
                        //args.cellElement.innerText = args.cellElement.innerText + "(invalid)";
                    }
                }
            }
            else if (args.column.field == "value") {
                if (args.data.dropPossible == true) {
                    args.cellElement.classList.add("dropLocationArea");
                }
            }
        }
        /**
         * Has the given item some data and is this data valid
         *
         * @private
         * @param {*} item
         * @returns {boolean}
         * @memberof SignalManagerWidget
         */
        isItemInvalid(item) {
            if (item instanceof signalManagerCalculation_1.SignalManagerCalculation) {
                let calculatedSignals = item.getSeries();
                // check if a calculated output signal is invalid
                for (let i = 0; i < calculatedSignals.length; i++) {
                    if (calculatedSignals[i].rawPointsValid == false) {
                        return true;
                    }
                }
            }
            else if (item instanceof serieNode_1.SerieNode) {
                if (item.serie != undefined && item.serie.rawPointsValid == false) {
                    if (item instanceof signalManagerCalculationOutputData_1.SignalManagerCalculationOutputData) {
                        return true;
                    }
                    else {
                        return true;
                    }
                }
            }
            return false;
        }
        /**
         * A drag and drop operation was started
         *
         * @private
         * @param {*} args
         * @memberof SignalManagerWidget
         */
        rowDragStart(args) {
            this._indexesDragged = [];
            let selectedElements = this.checkSelectedElements(args.draggedRecords, args.draggedRow);
            if (selectedElements.length > 0) {
                this._currentDragDropSeries = selectedElements;
                // Set current drag drop signal
            }
            else {
                this._currentDragDropSeries = undefined; // Reset current drag drop signal
            }
            // Resets dragged Records because the tree grid drag drop is canceled(general drag drop is used after collection the drag object data here)
            // If dragged Records will not be resetet the next drag drop records will be added to the current records
            // args.draggedRecords = []; // Not working, we have to reset it directly in the tree grid object
            this.clearDraggedRecords();
            args.cancel = true;
        }
        refreshSelection() {
            const treeObj = $(this.mainDiv).ejTreeGrid('instance');
            // Get actual selection index
            let actualSelectedRowIndex = treeObj.model.selectedRowIndex;
            // Reset selection
            treeObj.model.selectedRowIndex = -1;
            // Set to last index if index is out of range
            if (actualSelectedRowIndex >= treeObj.model.flatRecords.length) {
                actualSelectedRowIndex = treeObj.model.flatRecords.length - 1;
            }
            // Set selection
            treeObj.model.selectedRowIndex = actualSelectedRowIndex;
            let areElementsExportable = this.canItemsBeExported(treeObj.model.flatRecords);
            // update toolbar buttons
            if (treeObj.model.flatRecords[actualSelectedRowIndex] != undefined) {
                this.updateToolbarButtonStates(treeObj.model.flatRecords[actualSelectedRowIndex].item, areElementsExportable);
            }
            else {
                this.updateToolbarButtonStates(undefined, areElementsExportable);
            }
        }
        rowSelected(item, currentViewData) {
            let areElementsExportable = this.canItemsBeExported(currentViewData);
            this.updateToolbarButtonStates(item, areElementsExportable);
        }
        /**
         * updates the toolbar buttons(e.g. insert calulation only enabled on SerieGroup or under "Calculated signals" category)
         *
         * @private
         * @param {ISerieNode} item
         * @memberof SignalManagerWidget
         */
        updateToolbarButtonStates(item, areElementsExportable) {
            let toolbar = this._toolbar;
            if (item == undefined) {
                toolbar.disableInsertCalculationButton(true);
                toolbar.disableDeleteButton(true);
            }
            else {
                // set delete button state
                toolbar.disableDeleteButton(!item.canDelete);
                if (item instanceof serieGroup_1.SerieGroup) {
                    toolbar.disableExportButton(false);
                    toolbar.disableInsertCalculationButton(false);
                }
                else {
                    if (item.getSerieGroup() == undefined) {
                        toolbar.disableInsertCalculationButton(true);
                        toolbar.disableExportButton(true);
                    }
                    else if (item instanceof signalManagerCalculatorType_1.SignalManagerCalculatorType && item.name == 'Algorithm' || item instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData && item.serie == undefined ||
                        ((item instanceof signalManagerCalculation_1.SignalManagerCalculation || item instanceof signalManagerCalculationOutputData_1.SignalManagerCalculationOutputData) && (item.serie == undefined || item.serie.rawPointsValid == false))) {
                        toolbar.disableInsertCalculationButton(false);
                        toolbar.disableExportButton(true);
                    }
                    else {
                        toolbar.disableExportButton(false);
                        toolbar.disableInsertCalculationButton(false);
                    }
                }
            }
            if (areElementsExportable) {
                toolbar.disableExportButton(false);
            }
            else {
                toolbar.disableExportButton(true);
            }
        }
        canItemsBeExported(items) {
            let canBeExported = false;
            let exportHelper = new exportHelper_1.ExportHelper();
            for (var i = 0; i < items.length; i++) {
                if (exportHelper.isElementExportable(items[i].item) === true) {
                    canBeExported = true;
                    break;
                }
            }
            return canBeExported;
        }
        /**
         * A click on the tree grid (needed for reseting the current drag drop signal)
         *
         * @private
         * @param {*} args
         * @memberof SignalManagerWidget
         */
        click() {
            // Reset current drag drop signal after click was finished(click up)
            this._currentDragDropSeries = undefined;
            this.focus();
        }
        /**
         * A double click on the tree grid was done
         *
         * @private
         * @param {*} args
         * @memberof SignalManagerWidget
         */
        doubleClick(args) {
            if (args.cellIndex == 0) {
                let serieNode = args.data.item;
                let foundSeries = this.getSeriesFromItem(serieNode);
                if (foundSeries.length > 0) {
                    // Only one serie can be added by double click currently(TODO: add multi insert)
                    this.onSeriesDoubleClicked(foundSeries[0]);
                }
            }
        }
        /**
         * Checks if all elements selected are series and of the same type
         *
         * @private
         * @param {*} elements
         * @param {*} draggedRow
         * @returns {Array<BaseSeries>}
         * @memberof SignalManagerWidget
         */
        checkSelectedElements(elements, draggedRow) {
            let series = new Array();
            let items = new Array();
            let draggedRowIsSelected = false;
            let invalidSelection = false;
            if (draggedRow == undefined || draggedRow.serie == undefined) {
                return [];
            }
            let type = draggedRow.serie.type;
            for (var i = 0; i < elements.length; i = i + 1) {
                if (elements[i].serie == undefined || elements[i].serie.type != type) {
                    invalidSelection = true;
                }
                if (elements[i] == draggedRow) {
                    draggedRowIsSelected = true;
                }
                series.push(elements[i].serie);
                items.push(elements[i]);
            }
            if (draggedRow.item instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData) {
                this._currentCalculatorType = draggedRow.parent;
            }
            //Once all elements have been checked, select correct elements according to the exceptions
            if (!draggedRowIsSelected) {
                series = [];
                series.push(draggedRow.serie);
                this._indexesDragged = [];
                this._indexesDragged.push(draggedRow.index);
            }
            else if (invalidSelection) {
                return [];
            }
            else {
                series = this.deleteEqualSignals(series, items);
            }
            return series;
        }
        /**
         * Delete duplicated signals from the drag&drop array
         *
         * @private
         * @param {Array<BaseSeries>} series
         * @param {*} elements
         * @returns
         * @memberof SignalManagerWidget
         */
        deleteEqualSignals(series, elements) {
            for (let i = 0; i < series.length; i++) {
                if (elements[i].item instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData) {
                    let selectedItems = Object.assign([], series);
                    selectedItems.splice(i, 1);
                    if (selectedItems.includes(series[i])) {
                        series.splice(i, 1);
                        elements.splice(i, 1);
                        i = -1;
                    }
                }
            }
            for (let i = 0; i < elements.length; i++) {
                this._indexesDragged.push(elements[i].index);
            }
            return series;
        }
        /**
         * Returns all series which were found in the serie node item(e.g. a normal serie or calculated series)
         *
         * @private
         * @param {*} item
         * @returns {Array<BaseSeries>}
         * @memberof SignalManagerWidget
         */
        getSeriesFromItem(item) {
            let signals = new Array();
            if (item instanceof serieNode_1.SerieNode && item.serie != undefined) { // Is Signal node
                signals.push(item.serie);
            }
            else if (item instanceof serieContainer_1.SerieContainer) { // is calculation(group node) with signals
                return item.getSeries();
            }
            return signals;
        }
        /**
         * Is the given item a group item (e.g. needed for setting the font style to bold)
         *
         * @private
         * @param {ISerieContainer} item
         * @returns
         * @memberof SignalManagerWidget
         */
        isGroupItem(item) {
            if (item == undefined) {
                return false;
            }
            if (item.visibleChilds != undefined) {
                return true;
            }
            return false;
        }
        insertCalculation(item) {
            if (item == undefined) {
                return;
            }
            var selectedItem = item.item;
            var serieGroup;
            if (selectedItem instanceof serieGroup_1.SerieGroup || selectedItem instanceof signalCategory_1.SignalCategory) {
                // Calculation can only be insert at groups or categories
                serieGroup = selectedItem;
            }
            else {
                serieGroup = selectedItem.getSerieGroup();
            }
            if (serieGroup != undefined) {
                this.activateEditMode(true);
                return this.addCalculationToContainer(serieGroup);
            }
            return undefined;
        }
        addCalculationToContainer(container) {
            if (this._seriesProvider == undefined) {
                return undefined;
            }
            let calculation = new signalManagerCalculation_1.SignalManagerCalculation("Calculation", this._seriesProvider);
            this._serieContainerToSelectAfterRefresh = calculation;
            container.addSerieContainer(calculation, -1);
            return calculation;
        }
        getComponentSettings(onlyModified) {
            this.component.setSetting(widgetBase_1.WidgetBase.WidgetSettingId, this.getWidgetSettings());
            return super.getComponentSettings(onlyModified);
        }
        setComponentSettings(data) {
            super.setComponentSettings(data);
            this.setWidgetSettings(this.component.getSetting(widgetBase_1.WidgetBase.WidgetSettingId));
        }
        /**
         * Returns the settings of this widget
         *
         * @private
         * @returns {*}
         * @memberof SignalManagerWidget
         */
        getWidgetSettings() {
            let settings = { "editModeActive": this.editModeActive,
                "width": this._widthDefaultModeActive,
                "widthEditModeActive": this._widthEditModeActive
            };
            return settings;
        }
        /**
         * Sets the given settings data to the widget
         *
         * @private
         * @param {*} data
         * @returns
         * @memberof SignalManagerWidget
         */
        setWidgetSettings(data) {
            if (data == undefined) {
                return;
            }
            this.editModeActive = (data["editModeActive"]);
            this._actualWidth = data["width"];
            if (data["widthEditModeActive"] != undefined) {
                this._widthEditModeActive = data["widthEditModeActive"];
                this._widthDefaultModeActive = data["width"];
            }
            else {
                // Legacy implementation for settings data without widthEditModeActive information
                if (this.editModeActive) {
                    // Remove the defaultWidthDifference from the given width(in editMode) to the the default size(not in editMode)
                    this._widthDefaultModeActive = data["width"] - this._defaultWidthDifference;
                }
            }
        }
        /**
         * Activate or deactivate the editMode (insert/remove columns and update persisting data)
         *
         * @param {boolean} activate
         * @memberof SignalManagerWidget
         */
        activateEditMode(activate) {
            // Show or hide edit mode columns
            let treeObject = this.getTreeGridObject();
            let valueColumn = treeObject.getColumnByField(SignalManagerWidget_1.valueColumnId);
            let descriptionColumn = treeObject.getColumnByField(SignalManagerWidget_1.descriptionColumnId);
            let colorColumn = treeObject.getColumnByField(SignalManagerWidget_1.colorColumnId);
            if (activate == true) {
                treeObject.showColumn(valueColumn.headerText);
                treeObject.showColumn(descriptionColumn.headerText);
                treeObject.showColumn(colorColumn.headerText);
            }
            else {
                treeObject.hideColumn(valueColumn.headerText);
                treeObject.hideColumn(descriptionColumn.headerText);
                treeObject.hideColumn(colorColumn.headerText);
            }
            this.setEditMode(activate);
            this.refresh();
            persistDataProvider_1.PersistDataProvider.getInstance().setDataWithId(this.component.id, this.getComponentSettings(true));
        }
        /**
         * Returns true if one of the items deleted has been done through the trace of mappCockpit
         *
         * @param {*} selectedItems
         * @returns {boolean}
         * @memberof SignalManagerWidget
         */
        containsItemWithinRecentOrUploaded(selectedItems) {
            for (var i = 0; i < selectedItems.length; i++) {
                if (this.isItemInSignalCategory(selectedItems[i].item, signalCategory_1.SignalCategory.CategoryIdUploaded) || this.isItemInSignalCategory(selectedItems[i].item, signalCategory_1.SignalCategory.CategoryIdRecent)) {
                    return true;
                }
            }
            return false;
        }
        /**
         * Returns true if the item selected belongs to the signal category selected
         *
         * @private
         * @param {ISerieNode | ISerieContainer} item
         * @param {string} signalCategoryId
         * @returns {boolean}
         * @memberof SignalManagerWidget
         */
        isItemInSignalCategory(item, signalCategoryId) {
            let parent = item.parent;
            if (parent instanceof signalCategory_1.SignalCategory && parent.id == signalCategoryId) {
                return true;
            }
            else if (!(parent instanceof signalRoot_1.SignalRoot)) {
                return this.isItemInSignalCategory(parent, signalCategoryId);
            }
            else {
                return false;
            }
        }
        /**
         * Shows message box according to type
         *
         * @private
         * @param {messageBoxType} type
         * @param {Map<string, string>} fileContents
         * @memberof SignalManagerWidget
         */
        showMessageBox(type, fileContents) {
            if (type === alertDialog_1.messageBoxType.Warning) {
                this.showWarningWhenImportingFiles();
            }
            else if (type === alertDialog_1.messageBoxType.YesNo) {
                this.showMessageBoxWhenImportingMCEFiles(fileContents);
            }
        }
        /**
         * Creates a warning message when the user imports a .mce file and other files too
         *
         * @memberof SignalManagerWidget
         */
        showWarningWhenImportingFiles() {
            new alertDialog_1.AlertDialog().createMessageBox(this._warningImportingHeader, this._warningImportingContent, alertDialog_1.messageBoxType.Warning, undefined);
        }
        /**
         * Creates a message box that lets user decide to delete selected data or not
         *
         * @param {*} deletedItems
         * @memberof SignalManagerWidget
         */
        showMessageBoxForDeletingItem(deletedItems) {
            let deferred = jQuery.Deferred();
            let self = this;
            new alertDialog_1.AlertDialog().createMessageBox(this._deleteItemsHeader, this._deleteItemsContent, alertDialog_1.messageBoxType.CancelDelete, deferred);
            $.when(deferred).done(function () {
                self.deleteItems(deletedItems);
            });
        }
        /**
         * Creates a message box that lets user decide to import .mce file nad delete all data or not
         *
         * @private
         * @param {Map<string, string>} fileContents
         * @memberof SignalManagerWidget
         */
        showMessageBoxWhenImportingMCEFiles(fileContents) {
            let deferred = jQuery.Deferred();
            let self = this;
            new alertDialog_1.AlertDialog().createMessageBox(this._MCEFilesImportedHeader, this._MCEFilesImportedContent, alertDialog_1.messageBoxType.YesNo, deferred);
            $.when(deferred).done(function () {
                self.startImport(fileContents);
            });
        }
        /**
         * Delete selected items
         *
         * @param {*} items
         * @memberof SignalManagerWidget
         */
        deleteItems(items) {
            this.enableTreeGridRefresh(false);
            for (var i = 0; i < items.length; i++) {
                this.deleteItem(items[i].item);
            }
            this.enableTreeGridRefresh(true);
            //Refresh treegrid just when all items have been deleted
            this.refresh();
        }
        /**
         * Delete a specific item
         *
         * @private
         * @param {*} item
         * @memberof SignalManagerWidget
         */
        deleteItem(item) {
            if (item.canDelete) {
                if (item instanceof serieContainer_1.SerieContainer && !(item instanceof signalManagerCalculation_1.SignalManagerCalculation)) {
                    this.removeSerieContainer(item);
                }
                else {
                    this.removeSerieNode(item);
                }
            }
        }
        /**
         *  Remove the signal container with all sub containers and signals from datamodel
         *
         * @private
         * @param {ISerieContainer} serieGroup
         * @memberof SignalManagerWidget
         */
        removeSerieContainer(serieGroup) {
            this._dataModel.removeSerieContainer(serieGroup);
        }
        /**
         * Removes the signal from datamodel
         *
         * @private
         * @param {ISerieNode} serieNode
         * @memberof SignalManagerWidget
         */
        removeSerieNode(serieNode) {
            this._dataModel.removeSerieNode(serieNode);
        }
        /**
         * Exports a serieGroup
         *
         * @public
         * @param {Array<ExportSerieGroup>} elements
         * @memberof SignalManagerTreeGrid
         */
        exportSerieGroup(elements) {
            this.setBusyInformation(new busyInformation_1.BusyInformation("Exporting data...", busyInformation_1.ImageId.defaultImage, 48, true));
            this.setBusy(true);
            // Timeout needed to show the busyscreen before exporting data 
            setTimeout(() => this.exportCsvData(elements), 200);
        }
        /**
         * Opens a file select dialog and imports a serieGroup from the file
         *
         * @public
         * @memberof SignalManagerTreeGrid
         */
        importSerieGroup() {
            this._fileProvider.uploadData(".csv, .mce, .mce1", true); // Only show/accept *.csv, *.mce, *.mce1 files
        }
        exportSignalManagerData() {
            this.setBusyInformation(new busyInformation_1.BusyInformation("Exporting data...", busyInformation_1.ImageId.defaultImage, 48, true));
            this.setBusy(true);
            // Timeout needed to show the busyscreen before exporting data 
            setTimeout(() => this.exportData(), 200);
        }
        /**
         * Occurs after reading data from file(trace import data)
         *
         * @private
         * @param {HTMLInputElement} sender
         * @param {Map<string, string>} args
         * @memberof SignalManagerWidget
         */
        onUploadDataFinished(args) {
            this.setBusyInformation(new busyInformation_1.BusyInformation("Importing data...", busyInformation_1.ImageId.defaultImage, 48, true));
            let msgBoxType = this.checkMessageBoxType(args);
            if (msgBoxType != undefined) {
                this.showMessageBox(msgBoxType, args);
            }
            else {
                this.startImport(args);
            }
        }
        /**
         * Exports the given signal group to TraceData.csv file
         *
         * @private
         * @param { Array<ExportSerieGroup>} elements
         * @memberof SignalManagerWidget
         */
        exportCsvData(elements) {
            let data;
            if (this._seriesProvider != undefined) {
                data = new exportImportHelper_1.ExportImportHelper(this._seriesProvider).exportTraceData(elements);
            }
            else {
                console.error("SeriesProvider is not available!");
            }
            if (data !== undefined) {
                var blob = new Blob([data], { type: "text/csv" });
                fileProvider_1.FileProvider.downloadData("TraceData.csv", blob);
            }
            this.setBusy(false);
        }
        /**
         * Exports the signal manager data(datamodel, series provider, ...)
         *
         * @private
         * @memberof SignalManagerWidget
         */
        exportData() {
            if (this._seriesProvider != undefined) { // SeriesProvider needed to export data
                try {
                    let components = this.getComponentsToExport();
                    let settingObjects = this.getSettingObjectsToExport();
                    let stringData = mceExportImportHelper_1.MceExportImportHelper.getExportData(components, settingObjects);
                    var blob = new Blob([stringData], { type: "text/html" });
                    fileProvider_1.FileProvider.downloadData("Export.mce1", blob);
                }
                catch (e) {
                    if (e instanceof Error && mceConversionError_1.MceConversionError.isMceConversionError(e)) {
                        console.error(e.toString());
                    }
                    else {
                        console.error(e);
                    }
                }
            }
            else {
                console.error("SeriesProvider for export not available!");
            }
            this.setBusy(false);
        }
        /**
         * Returns the components in a defined order which should be cleared before importing new setting
         *
         * @private
         * @returns {Array<IComponent>}
         * @memberof SignalManagerWidget
         */
        getComponentsToClear() {
            let componentsToClear = new Array();
            componentsToClear.push(this.dataModel); // SignalManagerDataModel
            if (this._chartManagerDataModel != undefined) {
                componentsToClear.push(this._chartManagerDataModel); // ChartManagerDataModel
            }
            if (this._seriesProvider != undefined) {
                componentsToClear.push(this._seriesProvider); // SeriesProvider must be imported first
            }
            return componentsToClear;
        }
        /**
         * Returns the components which should be exported/imported from the mce file in the given order
         *
         * @private
         * @returns {Array<IComponent>}
         * @memberof SignalManagerWidget
         */
        getComponentsToExport() {
            let exportComponents = new Array();
            if (this._seriesProvider != undefined) {
                exportComponents.push(this._seriesProvider); // SeriesProvider must be imported first
            }
            exportComponents.push(this.dataModel); // SignalManagerDataModel
            if (this._chartManagerDataModel != undefined) {
                exportComponents.push(this._chartManagerDataModel); // ChartManagerDataModel
            }
            return exportComponents;
        }
        /**
         * Returns all settings objects which should be exported
         *
         * @private
         * @returns {Array<ISettingsObject>}
         * @memberof SignalManagerWidget
         */
        getSettingObjectsToExport() {
            let settingsObjects = new Array();
            // get current cursorstates
            let cursorstates = componentDataHub_1.ComponentDataHub.readShared(this, bindingIds_1.TraceViewBinding.CursorStates.scope, bindingIds_1.TraceViewBinding.CursorStates.id, cursorStates_1.CursorStates);
            settingsObjects.push(cursorstates);
            return settingsObjects;
        }
        /**
         * Sets the busy screen and start importing data
         *
         * @private
         * @param {Map<string, string>} args
         * @memberof SignalManagerWidget
         */
        startImport(args) {
            this.setBusy(true);
            // Timeout needed to show the busyscreen before importing data 
            setTimeout(() => this.importData(args), 200);
        }
        /**
         * imports the given filedata with the given filename to the signal manager datamodel
         *
         * @private
         * @param {Map<string, string>} fileContents
         * @memberof SignalManagerWidget
         */
        importData(fileContents) {
            // reset selection of the series container
            this._serieContainerToSelectAfterRefresh = undefined;
            fileContents.forEach((fileData, filename) => {
                if (filename.toLowerCase().endsWith(".csv")) {
                    if (this._seriesProvider != undefined) {
                        let exportImportHelper = new exportImportHelper_1.ExportImportHelper(this._seriesProvider);
                        let serieGroups = exportImportHelper.importTraceData(fileData, filename);
                        let signalFile = new serieContainer_1.SerieContainer(filename);
                        this.setContainerId(signalFile);
                        serieGroups.forEach(serieGroup => {
                            signalFile.addSerieContainer(serieGroup, -1);
                        });
                        this._serieContainerToSelectAfterRefresh = signalFile;
                        this._dataModel.addSerieContainer(signalFile, signalCategory_1.SignalCategory.CategoryIdImported);
                    }
                    else {
                        console.error("SeriesProvider is not available!");
                    }
                }
                else if (filename.toLowerCase().endsWith(".mce")) {
                    try {
                        this.importMCEFile(fileData, ".mce");
                    }
                    catch (e) {
                        if (e instanceof Error && mceConversionError_1.MceConversionError.isMceConversionError(e)) {
                            console.error(e.toString());
                        }
                        else {
                            console.error(e);
                        }
                    }
                }
                else if (filename.toLowerCase().endsWith(".mce1")) {
                    try {
                        this.importMCEFile(fileData, ".mce1");
                    }
                    catch (e) {
                        if (e instanceof Error && mceConversionError_1.MceConversionError.isMceConversionError(e)) {
                            console.error(e.toString());
                        }
                        else {
                            console.error(e);
                        }
                    }
                }
                else {
                    console.error("Import for file format not implemented: " + filename);
                }
            });
            this.setBusy(false);
        }
        /**
         * Returns type of message box need it (if need it)
         *
         * @private
         * @param {Map<string, string>} fileContents
         * @returns {(messageBoxType | undefined)}
         * @memberof SignalManagerWidget
         */
        checkMessageBoxType(fileContents) {
            let isSignalManagerEmpty = this.isSignalManagerEmpty(this.dataModel.data);
            let isThereMCEFile = false;
            fileContents.forEach((fileData, filename) => {
                if (filename.toLowerCase().endsWith(".mce") || filename.toLowerCase().endsWith(".mce1")) {
                    isThereMCEFile = true;
                }
            });
            if (isThereMCEFile && fileContents.size > 1) {
                return alertDialog_1.messageBoxType.Warning;
            }
            else if (isThereMCEFile && !isSignalManagerEmpty) {
                return alertDialog_1.messageBoxType.YesNo;
            }
            else {
                return undefined;
            }
        }
        /**
         * Returns true if there is nothing in the signalManager
         *
         * @private
         * @param {*} data
         * @returns {boolean}
         * @memberof SignalManagerWidget
         */
        isSignalManagerEmpty(data) {
            let isEmpty = true;
            for (var i = 0; i < data.length; i++) {
                if (data[i].childs.length > 0) {
                    isEmpty = false;
                    break;
                }
            }
            return isEmpty;
        }
        /**
         * Deletes all trace data and imports the .mce file
         *
         * @private
         * @param {*} data
         * @memberof SignalManagerWidget
         */
        importMCEFile(fileData, fileEnding) {
            if (this._seriesProvider) { // serie provider needed to import data
                this.enableTreeGridRefresh(false);
                // Clear components with the given order
                let componentsToClear = this.getComponentsToClear();
                mceExportImportHelper_1.MceExportImportHelper.clearComponents(componentsToClear);
                if (fileEnding === ".mce1" || fileEnding === ".mce") {
                    let settingsMap = mceExportImportHelper_1.MceExportImportHelper.readFileContent(fileData, fileEnding);
                    let components = this.getComponentsToExport(); // Import and Export components are the same so we can use the export components array
                    //let settingObjects = this.getSettingObjectsToExport(); // Import and Export objects are the same so we can use the export settings object array
                    // MceExportImportHelper.setImportData(components, settingObjects, settingsMap);
                    mceExportImportHelper_1.MceExportImportHelper.setImportData(components, settingsMap);
                }
                this.enableTreeGridRefresh(true);
                this.refresh();
            }
            else {
                console.error("SeriesProvider for import not available!");
            }
        }
        /**
         * Selects the given container in the tree grid and scrolls to it if out of the window (TODO: Move to BaseClass incl. _serieContainerToSelectAfterRefresh)
         *
         * @private
         * @param {(ISerieContainer|undefined)} container
         * @memberof SignalManagerWidget
         */
        selectItem(container) {
            let treeObject = this.getTreeGridObject();
            let record = treeObject.model.flatRecords.filter(record => { return record.item === container; })[0];
            if (record != undefined) {
                // expand parent node if it is collapsed to see the new imported trace data
                if (record.parentItem.expandState == false) {
                    treeObject.expandCollapseRow(record.parentItem.index);
                }
                // treeObject.scrollOffset not possible if there would be some free space after the last item in the tree grid after scrolling to the given item
                // => scrollToBottom befor scroll to a special offset if possible
                treeObject.scrollToBottom();
                treeObject.setModel({ "selectedRowIndex": record.index });
                let rowHeight = treeObject.model.rowHeight;
                // scroll index not the same as the selectedIndex => collapsed nodes must be considered
                let scrollIndex = this.getScrollIndex(treeObject.model.flatRecords, record.index);
                let scrollOffset = (scrollIndex - 1) * rowHeight;
                treeObject.scrollOffset(0, scrollOffset); // Use parent index to see the parent node in the view
                //(<any>treeObject).updateScrollBar();
            }
        }
        /**
         * Returns the index of only the visible(expanded) rows
         *
         * @private
         * @param {Array<any>} rows
         * @param {number} rowIndex
         * @returns {number}
         * @memberof SignalManagerWidget
         */
        getScrollIndex(rows, rowIndex) {
            let scrollIndex = 0;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].index == rowIndex) {
                    scrollIndex++;
                    return scrollIndex;
                }
                /*if(rows[i].item instanceof SerieGroup){
                    if(this.isVisibleSerieGroupNode(rows[i]) == false){
                        continue;
                    }
                    scrollIndex++;
                }
                else */ if (rows[i].item instanceof serieContainer_1.SerieContainer) {
                    if (this.isVisibleSerieGroupNode(rows[i]) == false) {
                        continue;
                    }
                    scrollIndex++;
                }
                else if (rows[i].item instanceof serieNode_1.SerieNode) {
                    if (this.isVisibleSerieNode(rows[i]) == false) {
                        continue;
                    }
                    scrollIndex++;
                }
            }
            return scrollIndex;
        }
        /**
         * Set unique id for imported data
         *
         * @private
         * @param {SerieContainer} serieContainer
         * @memberof SignalManagerWidget
         */
        setContainerId(serieContainer) {
            serieContainer.id = this.getUniqueId();
        }
        /**
         * Returns a unique id for the imported serieContainer
         *
         * @private
         * @returns
         * @memberof SignalManagerWidget
         */
        getUniqueId() {
            let importedDataIds = this.getImportedDataIds();
            for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
                let id = i.toString();
                if (importedDataIds.includes(id) == false) {
                    return id;
                }
            }
            console.error("No unique id for serieContainer available!");
            return "";
        }
        /**
         * Returns an array of all ids from the imported from file category
         *
         * @private
         * @returns {Array<string>}
         * @memberof SignalManagerWidget
         */
        getImportedDataIds() {
            let ids = [];
            let signalCategory = this._dataModel.getSignalCategory(signalCategory_1.SignalCategory.CategoryIdImported);
            signalCategory.getChilds().forEach(child => {
                ids.push(child.id);
            });
            return ids;
        }
        isVisibleSerieGroupNode(node) {
            if (node.parentItem != null) {
                if (node.parentItem.expandState == false) {
                    return false;
                }
                else if (node.parentItem.parentItem != undefined) {
                    if (node.parentItem.parentItem.expandState == false) {
                        return false;
                    }
                }
            }
            return true;
        }
        isVisibleSerieNode(node) {
            if (node.parentItem.expandState == false || node.parentItem.parentItem.expandState == false) {
                return false;
            }
            else if (node.parentItem.parentItem.parentItem != undefined) {
                if (node.parentItem.parentItem.parentItem.expandState == false) {
                    return false;
                }
            }
            return true;
        }
        treeGridNodeExpandedOrCollapsed() {
            // Refresh to see correct expanded/collapsed icon
            this.refresh();
            //Persist data model (expandState)
            if (this._dataModel !== undefined) {
                this._dataModel.saveSettings();
            }
            this.saveTreeGridSettings();
        }
        /**
         * Returns the column template informations
         *
         * @private
         * @param {string} columnId
         * @returns {string}
         * @memberof SignalManagerWidget
         */
        getColumnTemplateData(columnId) {
            if (columnId == SignalManagerWidget_1.colorColumnId) {
                return `<script type="text/x-jsrender" id="smColorColumnTemplate">
						<div style='height:20px;padding-left:7px;padding-top:4px;' unselectable='on'>
							<div class='e-cell' style='display:inline-block;width:17px;height:17px;background-color: {{:#data['color']}};' unselectable='on'></div>
						</div>
					</script>`;
            }
            else if (columnId == SignalManagerWidget_1.nameColumnId) {
                return `<script type="text/x-jsrender" id="smNameColumnTemplate">
						<div style='height:20px;' unselectable='on'>
							{{if hasChildRecords}}
								<div class='intend' style='height:1px; float:left; width:{{:level*10}}px; display:inline-block;'></div>
							{{else !hasChildRecords}}
								<div class='intend' style='height:1px; float:left; width:{{:level*10}}px; display:inline-block;'></div>
							{{/if}}
							{{:#data['iconDefinition']}}
							<div class='e-cell' style='display:inline-block;width:100%' unselectable='on'>{{:#data['name']}}</div>
						</div>
					</script>`;
            }
            return "";
        }
        /**
         * Raises the series double click event
         *
         * @private
         * @param {BaseSeries} series
         * @memberof SignalManagerWidget
         */
        onSeriesDoubleClicked(series) {
            this.eventSerieDoubleClicked.raise(this, series);
        }
        /**
         * Raises the change size event
         *
         * @private
         * @param {number} size
         * @memberof SignalManagerWidget
         */
        onChangeSize(size) {
            this.eventChangeSize.raise(this, size);
        }
        /**
         * Mouse is not over signalManager while dragging operation
         *
         * @param {DragDropArgs} args
         * @memberof SignalManagerWidget
         */
        dropFocusLost(args) {
            this.resetHighlightArea();
        }
    };
    // column definitions
    SignalManagerWidget.nameColumnId = "name";
    SignalManagerWidget.valueColumnId = "value";
    SignalManagerWidget.descriptionColumnId = "description";
    SignalManagerWidget.colorColumnId = "color";
    SignalManagerWidget.iconDefinitionColumnId = "iconDefinition";
    SignalManagerWidget = SignalManagerWidget_1 = __decorate([
        mco.role()
    ], SignalManagerWidget);
    exports.SignalManagerWidget = SignalManagerWidget;
});
