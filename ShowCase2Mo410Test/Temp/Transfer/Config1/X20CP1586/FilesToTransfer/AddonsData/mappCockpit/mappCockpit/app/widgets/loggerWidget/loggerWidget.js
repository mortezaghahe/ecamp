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
define(["require", "exports", "./componentDefaultDefinition", "../common/treeGridWidgetBase", "./view/loggerWidgetTreeGridToolbar", "./nullLogger/nullLoggerDataProvider", "./nullLogger/nullLoggerDefinitions", "./loggerProvider", "./loggerColumnDefinition", "../common/busyInformation", "./dataLoadingProgressArgs"], function (require, exports, componentDefaultDefinition_1, treeGridWidgetBase_1, loggerWidgetTreeGridToolbar_1, nullLoggerDataProvider_1, nullLoggerDefinitions_1, loggerProvider_1, loggerColumnDefinition_1, busyInformation_1, dataLoadingProgressArgs_1) {
    "use strict";
    var LoggerWidget_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoggerWidget = void 0;
    /**
     * Implements the LoggerWidget
     *
     * @export
     * @class LoggerWidget
     * @extends {TreeGridWidgetBase}
     * @implements {ILoggerWidget}
     */
    let LoggerWidget = LoggerWidget_1 = class LoggerWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            /**
             * Definitions for the logger(e.g. columns to show, ...)
             *
             * @private
             * @type {ILoggerDefinitions}
             * @memberof LoggerWidget
             */
            this._loggerDefinition = new nullLoggerDefinitions_1.NullLoggerDefinitions();
            /**
             * Holds the provider for export/import/upload of logger data
             *
             * @private
             * @type {(ILoggerDataProvider)}
             * @memberof LoggerWidget
             */
            this._loggerDataProvider = new nullLoggerDataProvider_1.NullLoggerDataProvider();
            /**
             * Holds the selected item before filtering
             *
             * @private
             * @memberof LoggerWidget
             */
            this._selectedItem = undefined;
            /**
             * handler for the data available event
             *
             * @private
             * @memberof LoggerWidget
             */
            this._dataAvailableHandler = (sender, args) => this.onDataAvailable(sender, args);
            /**
             * handler for the loading progress changed event
             *
             * @private
             * @memberof LoggerWidget
             */
            this._dataLoadingProgressChangedHandler = (sender, args) => this.onDataLoadingProgressChanged(sender, args);
            this._connectionId = "";
        }
        /**
         * Creates the templates(e.g. row, column, ...) for the tree grid and adds them to the widget container
         *
         * @protected
         * @memberof SignalManagerWidget
         */
        createTemplates() {
            this.addToolTipTemplate();
        }
        /**
         * Adds the tooltip template script to the logger widget div
         *
         * @private
         * @memberof LoggerWidget
         */
        addToolTipTemplate() {
            let $widgetContainer = $(this.mainDiv);
            let cellTooltipTemplateData = this._loggerDefinition.getCellTooltipTemplateData();
            $widgetContainer.append(cellTooltipTemplateData);
        }
        /**
         * Initialize the widget
         *
         * @memberof LoggerWidget
         */
        initialize() {
            super.initialize();
        }
        /**
         * Initialize the component
         *
         * @memberof LoggerWidget
         */
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        connect(componentId) {
            this._connectionId = componentId;
            super.connect(componentId);
            this.connectComponent(componentId);
        }
        /**
         * Connects the active component
         *
         * @private
         * @memberof LoggerWidget
         */
        connectComponent(componentId) {
            //BINDINGSOURCE: forwards the call to the bound provider
            this._loggerDataProvider = loggerProvider_1.LoggerProvider.getLoggerDataProviderForComponentNew(componentId);
            this._loggerDataProvider.eventDataAvailable.attach(this._dataAvailableHandler);
            this._loggerDataProvider.eventDataLoadingProgressChanged.attach(this._dataLoadingProgressChangedHandler);
            // get logger definitions for the given component
            this._loggerDefinition = loggerProvider_1.LoggerProvider.getLoggerDefinitionsForComponentNew(componentId);
            // Destroy old treegrid instance
            this.destroyTreeGrid();
            // recreate tree grid because new data and logger definition is available
            this.createTreeGrid();
        }
        /**
         * Disconnects the active component
         *
         * @private
         * @param {string} componentName
         * @memberof LoggerWidget
         */
        disconnectComponent(componentName) {
            //BINDINGSOURCE: forwards the call to the bound provider
        }
        /**
         * Called when the methods have been updated
         *
         * @private
         * @param {MappCockpitComponentMethod[]} userMethods
         * @memberof LoggerWidget
         */
        onMethodsUpdated(methods) {
            this._loggerDataProvider.setComponentMethods(methods);
        }
        /**
         * Destroys thte treegrid and reloads the needed setting for the mainDiv
         *
         * @private
         * @memberof LoggerWidget
         */
        destroyTreeGrid() {
            let treeGrid = this.getTreeGridObject();
            if (treeGrid != undefined) {
                // deactivate tooltip to avoid problems with freezing tooltip when loading new data(larger data)
                //treeGrid.setModel({"showGridCellTooltip" : false}, true);
                this.setModel({}, true);
                treeGrid.destroy();
            }
            // add networkCommandTrace class for correct style
            this.mainDiv.classList.add("networkCommandTrace");
            // Reload styles
            this.loadStyles();
            // Reload templates
            this.createTemplates();
        }
        /**
         * Disposes the LoggerWidget
         *
         * @memberof LoggerWidget
         */
        dispose() {
            super.dispose();
            this.disconnectComponent(this._connectionId);
            this._loggerDataProvider.eventDataAvailable.detach(this._dataAvailableHandler);
            this._loggerDataProvider.eventDataLoadingProgressChanged.detach(this._dataLoadingProgressChangedHandler);
            this._loggerDataProvider.dispose();
            this.disconnectComponent(""); // TODO: ComponentName 
        }
        /**
         * Load some styles(css files) for this widget
         *
         * @memberof LoggerWidget
         */
        loadStyles() {
            super.addStyle("widgets/loggerWidget/style/css/loggerStyle.css");
        }
        /**
         * Creates the tree grid
         *
         * @protected
         * @memberof LoggerWidget
         */
        createTreeGrid() {
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridToolbarSupport()), { create: (args) => this.treeGridCreated(), queryCellInfo: (args) => this.queryCellInfo(args), 
                // activate virtualization
                enableVirtualization: true, 
                // activate filtering
                allowFiltering: true, 
                // activate excel filter style
                filterSettings: {
                    filterType: ej.TreeGrid.FilterType.Excel,
                    filterHierarchyMode: ej.TreeGrid.FilterHierarchyMode.None,
                }, 
                // activate sorting
                allowSorting: true, 
                // defines the default row height
                rowHeight: 26, 
                // show cell tooltip
                showGridCellTooltip: true, 
                // Disable deleting of items
                editSettings: { allowDeleting: false }, actionBegin: (args) => this.treeGridActionBegin(args), actionComplete: (args) => this.treeGridActionComplete(args) }));
        }
        /**
         * Handles the query cell info event, to show the correct data for the current cell
         *
         * @private
         * @param {*} args
         * @memberof LoggerWidget
         */
        queryCellInfo(args) {
            if (this._loggerDefinition != undefined) {
                args.cellElement.innerHTML = this._loggerDefinition.getCellData(args.column.field, args.data.item);
            }
        }
        /**
         * Raised when a tree grid action begins
         *
         * @private
         * @param {*} args
         * @memberof LoggerWidget
         */
        treeGridActionBegin(args) {
            if (args.requestType == "searching" && args.keyValue == "" || args.requestType == "filterbeforeopen") {
                // Save current selection before new filter is set
                if (args.model.selectedItem != undefined) {
                    this._selectedItem = args.model.selectedItem.item;
                }
                else {
                    this._selectedItem = undefined;
                }
            }
        }
        /**
         * Raised when a tree grid action is completed
         *
         * @private
         * @param {*} args
         * @memberof LoggerWidget
         */
        treeGridActionComplete(args) {
            if (args.requestType == "searching" && args.keyValue == ""
                || args.requestType == "filtering" && args.filterCollection != undefined && args.filterCollection.length == 0) {
                // Select the item which was selected before filtering
                if (this._selectedItem != undefined) {
                    this.selectItem(this._selectedItem);
                }
            }
        }
        /**
         * Select the given item and scroll to the item if scrollToItem = true
         *
         * @private
         * @param {*} item
         * @param {boolean} [scrollToItem=true] scrolls to the selected itme
         * @memberof LoggerWidget
         */
        selectItem(item, scrollToItem = true) {
            let treeObject = this.getTreeGridObject();
            let record = treeObject.model.flatRecords.filter(record => { return record.item === item; })[0];
            if (record != undefined) {
                // treeObject.scrollOffset not possible if there would be some free space after the last item in the tree grid after scrolling to the given item
                // => scrollToBottom befor scroll to a special offset if possible
                if (scrollToItem) {
                    treeObject.scrollToBottom();
                }
                let visibleIndex = this.getIndexOfVisibleRecords(treeObject.model.updatedRecords, item.recordNumber);
                treeObject.setModel({ "selectedRowIndex": visibleIndex });
                if (scrollToItem) {
                    // calculate scroll offset
                    let rowHeight = treeObject.model.rowHeight;
                    let scrollOffset = (visibleIndex - 1) * rowHeight;
                    // set the scroll offset
                    treeObject.scrollOffset(0, scrollOffset);
                }
            }
        }
        /**
         * Returns the index of the given recordNumber of an item in the current view(filtered view)
         *
         * @private
         * @param {Array<any>} data
         * @param {string} recordNumber
         * @returns {number}
         * @memberof LoggerWidget
         */
        getIndexOfVisibleRecords(data, recordNumber) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].recordNumber == recordNumber) {
                    return i;
                }
            }
            return -1;
        }
        /**
         * Handel tree grid created event
         *
         * @protected
         * @memberof LoggerWidget
         */
        treeGridCreated() {
            super.treeGridCreated();
            /*let columnDefinition = this._loggerDefinition.getColumnDefinitions();
            super.setDynamicColumn(columnDefinition.length-2, 40); // sets the column before the last one to the dynamic column by default
    
            let treeGridObject = this.getTreeGridObject();
            // Update the dynamic column size after hide/show of some columns
            this.resizeDynamicColumn(0, treeGridObject.model);*/
        }
        /**
         * Returns the tree grid column resize settings
         *
         * @private
         * @returns {{}}
         * @memberof LoggerWidget
         */
        /*private getTreeGridColumnResizeSupport(): {} {
            return {
                allowColumnResize: true,
                columnResizeSettings: { columnResizeMode: ej.TreeGrid.ColumnResizeMode.FixedColumns },
                columnResized: (args) => this.treeGridColumnResized(args),
            };
        }*/
        /**
         * A treegrid column was resized
         *
         * @private
         * @param {*} args
         * @memberof LoggerWidget
         */
        /*private treeGridColumnResized(args){
            super.resizeDynamicColumn(args.columnIndex, args.model);
            //this.saveTreeGridSettings();
        }*/
        /**
         * Defines the treegrid toolbar
         *
         * @protected
         * @returns {{}}
         * @memberof LoggerWidget
         */
        getTreeGridToolbarSupport() {
            this._toolbar = new loggerWidgetTreeGridToolbar_1.LoggerWidgetTreeGridToolbar(this.mainDiv);
            return super.getTreeGridToolbarSupport(true);
        }
        /**
         * Returns the treegrid column definitions
         *
         * @private
         * @returns {{}}
         * @memberof LoggerWidget
         */
        getTreeGridColumnDefinition() {
            // Converts the logger column definitions to the tree grid column definitions
            let columnDefinitionsForTreeGrid = new Array();
            let columnDefinition = this._loggerDefinition.getColumnDefinitions();
            columnDefinition.forEach(colDef => {
                let filterEditType = "stringedit"; // DefaultType for column is string
                if (colDef.fieldType == loggerColumnDefinition_1.FieldType.Numeric) {
                    filterEditType = "numericedit";
                }
                columnDefinitionsForTreeGrid.push({ field: colDef.fieldId, headerText: colDef.displayName, filterEditType: filterEditType, width: colDef.size, allowSorting: !colDef.disableSorting, tooltip: colDef.tooltipTemplate });
            });
            return {
                columns: columnDefinitionsForTreeGrid,
            };
        }
        /**
         * upload data from target and show data
         *
         * @memberof LoggerWidget
         */
        uploadData() {
            return __awaiter(this, void 0, void 0, function* () {
                this._loggerDataProvider.uploadDataFromTarget();
            });
        }
        /**
         * import data from file
         *
         * @memberof LoggerWidget
         */
        importData() {
            this._loggerDataProvider.importDataFromFile();
        }
        /**
         * export the last imported/uploaded data to a file
         *
         * @memberof LoggerWidget
         */
        exportData() {
            let dataModel = this._currentDataModel;
            if (dataModel != undefined) {
                let exportData = dataModel.getSettings();
                let exportString = JSON.stringify(exportData);
                let data = new Blob([exportString], { type: "text/html" });
                this._loggerDataProvider.exportDataToFile(data);
            }
            else {
                console.error("Datamodel for export not available!");
            }
        }
        /**
         * handles the onDataAvailable if data from file or from target is available
         *
         * @private
         * @param {ILoggerDataProvider} sender
         * @param {ILoggerDataModel} args
         * @memberof LoggerWidget
         */
        onDataAvailable(sender, args) {
            // Recreate treeGrid to remove all filtering, searching and sorting
            this.destroyTreeGrid();
            this.createTreeGrid();
            // set the new data to the datamodel
            this.setBusyInformation(new busyInformation_1.BusyInformation(LoggerWidget_1.loadingViewMessage, busyInformation_1.ImageId.defaultImage, 48, true));
            this.setBusy(true);
            // Timeout needed to show the busyscreen before exporting data 
            setTimeout(() => this.setDataToTreeGrid(args), 200);
            // Check if there is some data for export available and set export toolbar button state
            this._toolbar.disableExportButton(!this._loggerDataProvider.isExportPossible());
        }
        /**
         * Set new tree grid data
         *
         * @private
         * @param {ILoggerDataModel} loggerDataModel
         * @memberof LoggerWidget
         */
        setDataToTreeGrid(loggerDataModel) {
            return __awaiter(this, void 0, void 0, function* () {
                this._currentDataModel = loggerDataModel;
                this.setModel(loggerDataModel.dataSource);
                this.setBusy(false);
            });
        }
        /**
         * Handles the data loading changed event
         *
         * @private
         * @param {ILoggerDataProvider} sender
         * @param {DataLoadingProgressArgs} args
         * @memberof LoggerWidget
         */
        onDataLoadingProgressChanged(sender, args) {
            if (args.progress == 0) {
                let message = LoggerWidget_1.loadingDataMessage;
                if (args.type == dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadFromTargetType) { // Show % only while loading from target(otherwise UI is not updating the % values)
                    message += args.progress + "%";
                }
                else if (args.type == dataLoadingProgressArgs_1.DataLoadingProgressArgs.exportToFileType) {
                    message = LoggerWidget_1.exportingDataMessage;
                }
                else if (args.type == dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadResourcesType) {
                    message = LoggerWidget_1.loadingResourcesMessage;
                }
                this.setBusyInformation(new busyInformation_1.BusyInformation(message, busyInformation_1.ImageId.defaultImage, 48, true));
                this.setBusy(true);
            }
            else if (args.progress == 100) {
                this.setBusy(false);
            }
            else {
                let message = LoggerWidget_1.loadingDataMessage;
                if (args.type == dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadFromTargetType) { // Show % only while loading from target(otherwise UI is not updating the % values)
                    message += args.progress + "%";
                }
                else if (args.type == dataLoadingProgressArgs_1.DataLoadingProgressArgs.exportToFileType) {
                    message = LoggerWidget_1.exportingDataMessage;
                }
                else if (args.type == dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadResourcesType) {
                    message = LoggerWidget_1.loadingResourcesMessage;
                }
                this.changeBusyMessage(message);
            }
        }
    };
    /**
     * Some messages for the busy screen
     *
     * @private
     * @static
     * @memberof LoggerWidget
     */
    LoggerWidget.loadingDataMessage = "Loading drive log data... ";
    LoggerWidget.exportingDataMessage = "Exporting drive log data... ";
    LoggerWidget.loadingResourcesMessage = "Loading drive log resources... ";
    LoggerWidget.loadingViewMessage = "Loading drive log view... ";
    LoggerWidget = LoggerWidget_1 = __decorate([
        mco.role()
    ], LoggerWidget);
    exports.LoggerWidget = LoggerWidget;
});
