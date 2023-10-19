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
define(["require", "exports", "../common/treeGridWidgetBase", "./view/traceConfigDatapointsTreeGridToolbar", "../../view/datapointDialog/datapointDialog", "../../view/datapointDialog/eventDatapointArgs", "../../models/diagnostics/trace/traceDataPoint", "./view/traceConfigDatapointsTreeGridCellEditEvents", "./model/traceConfigDatapointsDataModel", "./componentDefaultDefinition"], function (require, exports, treeGridWidgetBase_1, traceConfigDatapointsTreeGridToolbar_1, datapointDialog_1, eventDatapointArgs_1, traceDataPoint_1, traceConfigDatapointsTreeGridCellEditEvents_1, traceConfigDatapointsDataModel_1, componentDefaultDefinition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigDatapointsWidget = void 0;
    /**
     * implements the TraceConfigDatapointsWidget
     *
     * @class TraceConfigDatapointsWidget
     * @extends {TreeGridWidgetBase}
     */
    let TraceConfigDatapointsWidget = class TraceConfigDatapointsWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            this._addDataPointHandler = (sender, args) => this.onAddDatapoint(sender, args);
            this._dialogClosedHandler = (sender, args) => this.onDialogClosed(sender, args);
            this._availableTraceDataPoints = new Array();
        }
        /**
         * Defines the height of the header
         *
         * @returns {number}
         * @memberof TraceConfigDatapointsWidget
         */
        defineHeaderHeight() {
            return 30;
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        initialized() {
            super.initialized();
            super.setHeaderContent("Data points");
            // Set dynamic column settings
            super.setDynamicColumn(3, 250);
        }
        /**
         * Updates and initializes the trace data points
         *
         * @private
         * @param {TraceDataPoint[]} traceDataPoints
         * @memberof TraceConfigDatapointsWidget
         */
        initializeTraceDataPoints(traceDataPoints) {
            let traceConfigDatapointsDataModel = new traceConfigDatapointsDataModel_1.TraceConfigDatapointsDataModel();
            traceConfigDatapointsDataModel.initialize();
            this.dataModel = traceConfigDatapointsDataModel;
            traceConfigDatapointsDataModel.initData = traceDataPoints;
            this.updateToolbar();
        }
        /**
         * implements the model change handling
         *
         * @param {IDataModel} sender
         * @param {EventModelChangedArgs} data
         * @returns {*}
         * @memberof TraceConfigDatapointsWidget
         */
        handleModelChanged(sender, eventArgs) {
            let dataPoints = eventArgs.data;
            this.refreshDatapointsValues(dataPoints);
            this.updateToolbarButtonStates(dataPoints);
        }
        /**
         * handles the changes of observed items requested by 'observeDataModelItems'
         *
         * @param {IDataModel} sender
         * @param {EventModelChangedArgs} data
         * @memberof TraceConfigDatapointsWidget
         */
        handleModelItemsChanged(sender, eventArgs) {
            let dataPoints = this.dataModel.data;
            this.updateToolbarButtonStates(dataPoints);
            this.refreshDatapointsValues(dataPoints);
        }
        /** catches the add datapoint event from the datapoint dialog
         * => adds or replaces the selected datapoint with the datapoint from the datapoint dialog
         *
         * @param {} sender
         * @param {EventDatapointArgs} args
         * @memberof TraceConfigDatapointsWidget
         */
        onAddDatapoint(sender, args) {
            var treeGridObj = this.getTreeGridObject();
            let actualSelectionIndex = treeGridObj.model.selectedRowIndex;
            if (actualSelectionIndex == undefined) {
                actualSelectionIndex = -1;
            }
            let dataPoint = traceDataPoint_1.TraceDataPoint.createWithDataPointInfo(args.dataPointInfo);
            let tcDataPointDataModel = this._dataModel;
            if (args.action == eventDatapointArgs_1.DatapointAction.add) {
                tcDataPointDataModel.addDatapoint(actualSelectionIndex, dataPoint);
            }
            else if (args.action == eventDatapointArgs_1.DatapointAction.replace) {
                tcDataPointDataModel.replaceDatapoint(actualSelectionIndex, dataPoint, true);
            }
        }
        /** catches the dialog close event from the datapoint dialog
         * => detaches the dialog events
         *
         * @param {} sender
         * @param {} args
         * @memberof TraceConfigDatapointsWidget
         */
        onDialogClosed(sender, args) {
            datapointDialog_1.DatapointDialog.getInstance().eventAddDatapoint.detach(this._addDataPointHandler);
            datapointDialog_1.DatapointDialog.getInstance().eventDialogClosed.detach(this._dialogClosedHandler);
        }
        /** creates the tree grid for the datapoint informations
         *
         * @memberof TraceConfigDatapointsWidget
         */
        createTreeGrid() {
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridColumnResizeSupport()), this.getTreeGridToolbarSupport()), this.getTreeGridCellEditSupport()), { selectionType: ej.TreeGrid.SelectionType.Multiple, editSettings: { allowEditing: true }, rowSelected: (args) => this.treeGridRowSelected(args), actionBegin: (args) => this.treeGridActionBegin(args), create: (args) => this.treeGridCreated() }));
        }
        /**
         * Returns the tree grid column definition
         *
         * @private
         * @returns {{}}
         * @memberof TraceConfigDatapointsWidget
         */
        getTreeGridColumnDefinition() {
            return {
                columns: [
                    { field: "dataPointName", headerText: "Data point", width: "350" },
                    { field: "componentName", headerText: "Component" },
                    { field: "name", headerText: "Name" },
                    { field: "description", headerText: "Description", width: "250" },
                ],
            };
        }
        /**
         * Returns the tree grid column resize settings
         *
         * @private
         * @returns {{}}
         * @memberof TraceConfigDatapointsWidget
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
         * @memberof TraceConfigDatapointsWidget
         */
        getTreeGridToolbarSupport() {
            this._toolbar = new traceConfigDatapointsTreeGridToolbar_1.TraceConfigDatapointsTreeGridToolbar(this.mainDiv);
            return super.getTreeGridToolbarSupport();
        }
        /**
         * Returns the tree grid cell edit settings
         *
         * @private
         * @returns {{}}
         * @memberof TraceConfigDatapointsWidget
         */
        getTreeGridCellEditSupport() {
            var cellEditEvents = new traceConfigDatapointsTreeGridCellEditEvents_1.TraceConfigDatapointsTreeGridCellEditEvents();
            return {
                beginEdit: (args) => cellEditEvents.beginEdit(args),
                endEdit: (args) => cellEditEvents.endEdit(args, this._dataModel, this._availableTraceDataPoints),
            };
        }
        treeGridActionBegin(args) {
            // Support "Entf/Del" key
            if (args.requestType == "delete") {
                args.cancel = true;
                this.deleteDataPoints(args);
            }
        }
        treeGridRowSelected(args) {
            if (args.model.selectedItem != undefined) {
                this._toolbar.disableRemoveButton(false);
            }
            else {
                this._toolbar.disableRemoveButton(true);
            }
        }
        deleteDataPoints(args) {
            let indexList = new Array();
            for (let i = args.deletedItems.length - 1; i >= 0; i--) {
                indexList.push(args.deletedItems[i].index);
            }
            if (indexList.length > 0) {
                this._dataModel.removeDatapoints(indexList);
                var treeGridObj = this.getTreeGridObject();
                let newSelectionIndex = indexList[indexList.length - 1];
                if (newSelectionIndex >= args.model.parentRecords.length) {
                    newSelectionIndex = args.model.parentRecords.length - 1;
                }
                treeGridObj.option("selectedRowIndex", newSelectionIndex, true);
            }
        }
        /**
         * opens the datapoint selection dialog and attaches to the dialog events
         *
         * @memberof TraceConfigDatapointsWidget
         */
        openDatapointDialog() {
            datapointDialog_1.DatapointDialog.getInstance().eventAddDatapoint.attach(this._addDataPointHandler);
            datapointDialog_1.DatapointDialog.getInstance().eventDialogClosed.attach(this._dialogClosedHandler);
            datapointDialog_1.DatapointDialog.getInstance().open();
        }
        /**
         * updates the toolbar corresponding to the current data selection
         *
         * @private
         * @memberof TraceConfigDatapointsWidget
         */
        updateToolbar() {
            // Update toolbar buttons => show/hide add datapoints toolbar button
            let dataPoints = this._dataModel.data;
            this.updateToolbarButtonStates(dataPoints);
        }
        /**
         * Initializes and updates the available trace data points
         *
         * @private
         * @param {TraceDataPointInfo[]} availableTraceDataPoints
         * @memberof TraceConfigDatapointsWidget
         */
        initializeAvailableDataPoints(availableTraceDataPoints) {
            this._availableTraceDataPoints = availableTraceDataPoints;
            datapointDialog_1.DatapointDialog.getInstance().setDatapoints(this._availableTraceDataPoints);
            this.updateToolbar();
        }
        /**
         * refreshes the content of the datapoints parameters value fields
         *
         * @private
         * @param {Datapoint[]} datapoints
         * @memberof TraceConfigDatapointsWidget
         */
        refreshDatapointsValues(datapoints) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    this.setModelWithEditSupport(datapoints);
                }
                catch (e) {
                    console.log(e);
                }
            });
        }
        updateToolbarButtonStates(dataPoints) {
            let selectedItem = undefined;
            var treeObj = this.getTreeGridObject();
            if (treeObj != undefined) {
                selectedItem = treeObj.model.selectedItem;
            }
            let dataPointsLength = 0;
            if (dataPoints != undefined) {
                dataPointsLength = dataPoints.length;
            }
            let toolbar = this._toolbar;
            if (dataPointsLength > 31) {
                toolbar.disableAddButton(true);
                toolbar.disableAddEmptyButton(true);
            }
            else {
                if (this._availableTraceDataPoints.length == 0) {
                    toolbar.disableAddButton(true);
                }
                else {
                    toolbar.disableAddButton(false);
                }
                toolbar.disableAddEmptyButton(false);
            }
            if (dataPointsLength == 0 || selectedItem == undefined) {
                toolbar.disableRemoveButton(true);
            }
            else {
                toolbar.disableRemoveButton(false);
            }
        }
    };
    TraceConfigDatapointsWidget = __decorate([
        mco.role()
    ], TraceConfigDatapointsWidget);
    exports.TraceConfigDatapointsWidget = TraceConfigDatapointsWidget;
});
