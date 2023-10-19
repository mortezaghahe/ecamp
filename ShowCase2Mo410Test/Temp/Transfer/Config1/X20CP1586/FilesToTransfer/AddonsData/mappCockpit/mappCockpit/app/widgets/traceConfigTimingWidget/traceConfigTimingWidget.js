var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/treeGridWidgetBase", "./view/traceConfigTimingTreeGridToolbar", "./view/traceConfigTimingTreeGridCellEditEvents", "./view/traceConfigTimingTreeGridCellEditTemplate", "./model/traceConfigTimingDataModel", "./componentDefaultDefinition"], function (require, exports, treeGridWidgetBase_1, traceConfigTimingTreeGridToolbar_1, traceConfigTimingTreeGridCellEditEvents_1, traceConfigTimingTreeGridCellEditTemplate_1, traceConfigTimingDataModel_1, componentDefaultDefinition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigTimingWidget = void 0;
    /**
     * implements the TraceConfigTimingWidget
     *
     * @class TraceConfigTimingWidget
     * @extends {TreeGridWidgetBase}
     */
    let TraceConfigTimingWidget = class TraceConfigTimingWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        /**
         * Defines the height of the header
         *
         * @returns {number}
         * @memberof TraceConfigTimingWidget
         */
        defineHeaderHeight() {
            return 30;
        }
        /**
         * Defines the height of the footer
         *
         * @returns {number}
         * @memberof TraceConfigTimingWidget
         */
        defineFooterHeight() {
            return 340;
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        initialized() {
            super.initialized();
            super.setHeaderContent("Timing");
            this.initFooterContent();
            // Set dynamic column settings
            super.setDynamicColumn(0, 100);
        }
        /**
         * Processes trace timing parameter changes
         *
         * @private
         * @param {MappCockpitComponentParameter[]} traceTimingParameters
         * @memberof TraceConfigTimingWidget
         */
        initializeTraceTimingParameters(traceTimingParameters) {
            if (traceTimingParameters.length > 0) {
                let traceConfigTimingDataModel = new traceConfigTimingDataModel_1.TraceConfigTimingDataModel();
                traceConfigTimingDataModel.initialize();
                this.dataModel = traceConfigTimingDataModel;
                traceConfigTimingDataModel.initData = traceTimingParameters;
            }
        }
        /** initialize the footer content
         *
         * @memberof TraceConfigTimingWidget
         */
        initFooterContent() {
            let coTraceNoOffsetImagePath = "widgets/traceConfigTimingWidget/resources/images/TraceTimingDiagram_NoOffset.svg";
            let coTraceNegOffsetImagePath = "widgets/traceConfigTimingWidget/resources/images/TraceTimingDiagram_NegOffset.svg";
            let coTracePosOffsetImagePath = "widgets/traceConfigTimingWidget/resources/images/TraceTimingDiagram_PosOffset.svg";
            super.setFooterContent(`
        <b>No trigger offset:</b><br>
        <img src="` + coTraceNoOffsetImagePath + `"></br>
        <br>
        <b>Start recording before start trigger detection:</b><br>
        <img src="` + coTraceNegOffsetImagePath + `"><br>
        <br>
        <b>Start recording after start trigger detection:</b><br>
        <img src="` + coTracePosOffsetImagePath + `"></br>
        1... The first start trigger is detected.`);
        }
        /**
         * implements the model change handling
         *
         * @param {IDataModel} sender
         * @param {EventModelChangedArgs} data
         * @returns {*}
         * @memberof TraceConfigTimingWidget
         */
        handleModelChanged(sender, eventArgs) {
            this.refreshTimingParameterValues(this.dataModel.data);
        }
        /**
         * handles the changes of observed items requested by 'observeDataModelItems'
         *
         * @param {IDataModel} sender
         * @param {EventModelChangedArgs} data
         * @memberof TraceConfigTimingWidget
         */
        handleModelItemsChanged(sender, eventArgs) {
            this.refreshTimingParameterValues(this.dataModel.data);
        }
        /** creates the tree grid for the timing informations
         *
         * @memberof TraceConfigTimingWidget
         */
        createTreeGrid() {
            var cellEditEvents = new traceConfigTimingTreeGridCellEditEvents_1.TraceConfigTimingTreeGridCellEditEvents();
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridColumnResizeSupport()), this.getTreeGridToolbarSupport()), { editSettings: {
                    allowEditing: true,
                    allowDeleting: false,
                }, create: (args) => this.treeGridCreated(), beginEdit: (args) => cellEditEvents.beginEdit(args), endEdit: (args) => cellEditEvents.endEdit(args, this.dataModel) }));
        }
        /**
         * Returns the tree grid column definition
         *
         * @private
         * @returns {{}}
         * @memberof TraceConfigTimingWidget
         */
        getTreeGridColumnDefinition() {
            let cellEditTemplate = traceConfigTimingTreeGridCellEditTemplate_1.TraceConfigTimingTreeGridCellEditTemplate.createInstance();
            return {
                columns: [
                    { field: "displayName", headerText: "Name" },
                    { field: "displayValue", headerText: "Value", width: "200", editType: "stringedit", editTemplate: cellEditTemplate },
                    { field: "engineeringunit", headerText: "Unit", width: "100" },
                ],
            };
        }
        /**
         * Returns the tree grid column resize settings
         *
         * @private
         * @returns {{}}
         * @memberof TraceConfigTimingWidget
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
         * @memberof TraceConfigTimingWidget
         */
        getTreeGridToolbarSupport() {
            this._toolbar = new traceConfigTimingTreeGridToolbar_1.TraceConfigTimingTreeGridToolbar(this.mainDiv);
            return super.getTreeGridToolbarSupport();
        }
        /**
         * refreshes the content of the timing parameters value fields
         *
         * @private
         * @param {TimingParameter[]} timingParameters
         * @memberof TraceConfigTimingWidget
         */
        refreshTimingParameterValues(timingParameters) {
            $(this.mainDiv).ejTreeGrid({
                dataSource: timingParameters,
            });
        }
    };
    TraceConfigTimingWidget = __decorate([
        mco.role()
    ], TraceConfigTimingWidget);
    exports.TraceConfigTimingWidget = TraceConfigTimingWidget;
});
