var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/treeGridWidgetBase", "./view/chartManagerTreeGridCellStyle", "./view/chartManagerTreeGridDragDrop", "./view/chartManagerTreeGridToolbar", "../../models/chartManagerDataModel/chartManagerChart", "../common/interfaces/dropInterface", "../../models/common/series/baseSeries", "../../models/chartManagerDataModel/scale", "../../models/chartManagerDataModel/chartManagerDataModel", "../chartViewWidget/chartViewWidget", "../chartViewWidget/helpers/chartDropHelper", "../common/SerieChartTypeHelper", "../../models/common/series/seriesType", "./componentDefaultDefinition"], function (require, exports, treeGridWidgetBase_1, chartManagerTreeGridCellStyle_1, chartManagerTreeGridDragDrop_1, chartManagerTreeGridToolbar_1, chartManagerChart_1, dropInterface_1, baseSeries_1, scale_1, chartManagerDataModel_1, chartViewWidget_1, chartDropHelper_1, SerieChartTypeHelper_1, seriesType_1, componentDefaultDefinition_1) {
    "use strict";
    var ChartManagerWidget_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartManagerWidget = void 0;
    let ChartManagerWidget = ChartManagerWidget_1 = class ChartManagerWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            this.eventDropHelper = new chartViewWidget_1.EventDropHelper();
            this.highlightAreaId = "chartManager_Highlighted";
            //*******************************************************End region drop support*******************************************************
        }
        /**
         * Defines the height of the header
         *
         * @returns {number}
         * @memberof ChartManagerWidget
         */
        defineHeaderHeight() {
            return 30;
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
        }
        dispose() {
            this.removeSupportedDragDropDataId(dropInterface_1.DragDropDataId.signal);
            super.dispose();
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
         * Creates the layout of the widget
         *
         * @memberof ChartManagerWidget
         */
        createLayout() {
            this.mainDiv.style.overflow = "hidden";
            super.createLayout();
        }
        initialized() {
            super.initialized();
            this.setChartManagerDataModel();
            super.setHeaderContent("Charts");
            // Set dynamic column settings
            super.setDynamicColumn(0, 80);
            // Initialize scrollbars positions      
            let scrollbarSettings = this.component.getSetting(treeGridWidgetBase_1.TreeGridWidgetBase.ScrollbarsSettingsId);
            this.setScrollBarSettings(scrollbarSettings);
            // Hide the column header of the tree grid
            //super.setColumnHeaderHidden();
            this.addSupportedDragDropDataId(dropInterface_1.DragDropDataId.signal);
        }
        setChartManagerDataModel() {
            let dataModel = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.ChartManagerDataModelId);
            this.dataModel = dataModel;
            // Refresh treeGrid(and toolbar) to use the new datamodel
            this.refresh();
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
         * Handles the model changes
         *
         * @param {IDataModel} sender
         * @param {EventModelChangedArgs} eventArgs
         * @returns {*}
         * @memberof ChartManagerWidget
         */
        handleModelChanged(sender, eventArgs) {
            if (eventArgs.hint != chartManagerDataModel_1.ChartManagerDataModelChangedHint.updateScaleRange && eventArgs.hint != chartManagerDataModel_1.ChartManagerDataModelChangedHint.default) {
                this.refresh();
                var treegridObj = this.getTreeGridObject();
                if (treegridObj.model.selectedRowIndex == -1) { // TODO: selectedItem != undefined but selectedRowIndex == -1 !!!
                    this.updateToolbarButtonStates(eventArgs.data.data, undefined);
                }
                else {
                    this.updateToolbarButtonStates(eventArgs.data.data, treegridObj.model.selectedItem.item);
                }
                this.saveTreeGridSettings();
            }
        }
        /**
         * Creates the drag and drop and column templates for the tree grid and adds them to the widget container
         *
         * @protected
         * @memberof ChartManagerWidget
         */
        createTemplates() {
            var $widgetContainer = $(this.mainDiv);
            $widgetContainer.append(this.getScriptForDragDropTemplateHelpers());
            $widgetContainer.append(this.getColumnTemplateData(ChartManagerWidget_1.nameColumnId));
        }
        /**
         * creates the tree grid for the chartmanager
         *
         * @protected
         * @returns
         * @memberof ChartManagerWidget
         */
        createTreeGrid() {
            if (this._dataModel == undefined) {
                console.info("dataModel undefined!");
                return;
            }
            var cellStyle = new chartManagerTreeGridCellStyle_1.ChartManagerTreeGridCellStyle();
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridColumnResizeSupport()), this.getTreeGridToolbarSupport()), this.getTreeGridDragDropSupport()), { dataSource: this._dataModel.data, childMapping: "childs", idMapping: ChartManagerWidget_1.nameColumnId, expandStateMapping: "expandState", isResponsive: true, rowHeight: 28, 
                // Set init size to draw the toolbar icons at the right position
                sizeSettings: { height: '100px', width: '100px', }, expanded: (args) => this.treeGridNodeExpandedOrCollapsed(), collapsed: (args) => this.treeGridNodeExpandedOrCollapsed(), rowSelected: (args) => this.updateToolbarButtonStates(args.model.dataSource, args.data.item), create: (args) => this.treeGridCreated(), actionBegin: (args) => this.treeGridActionBegin(args), actionComplete: (args) => this.treeGridActionComplete(args), queryCellInfo: (args) => cellStyle.setCellStyle(args) }));
        }
        treeGridNodeExpandedOrCollapsed() {
            // Refresh to see correct expanded/collapsed icon
            this.refresh();
            //Persist data model (expandState)
            if (this._dataModel !== undefined) {
                this._dataModel.saveSettings();
            }
            //Persit scrollbar position of treeGrid
            this.saveTreeGridSettings();
        }
        /**
         * Returns the tree grid column definition
         *
         * @private
         * @returns {{}}
         * @memberof ChartManagerWidget
         */
        getTreeGridColumnDefinition() {
            return {
                columns: [
                    { field: ChartManagerWidget_1.nameColumnId, headerText: "Name", isTemplateColumn: true, templateID: "cmNameColumnTemplate" },
                    { field: ChartManagerWidget_1.additionalInfoColumnId, headerText: "", width: "140px" },
                    { field: ChartManagerWidget_1.iconDefinitionColumnId, visible: false, width: "0px" },
                ],
            };
        }
        /**
         * Returns the tree grid column resize settings
         *
         * @private
         * @returns {{}}
         * @memberof ChartManagerWidget
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
         * @memberof ChartManagerWidget
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
         * @memberof ChartManagerWidget
         */
        getTreeGridToolbarSupport() {
            this._toolbar = new chartManagerTreeGridToolbar_1.ChartManagerTreeGridToolbar(this.mainDiv, this._dataModel);
            return super.getTreeGridToolbarSupport();
        }
        getTreeGridDragDropSupport() {
            var dragDrop = new chartManagerTreeGridDragDrop_1.ChartManagerTreeGridDragDrop();
            return {
                allowDragAndDrop: true,
                rowDragStart: (args) => dragDrop.rowDragStart(args),
                rowDrag: (args) => dragDrop.rowDrag(args),
                rowDropActionBegin: (args) => dragDrop.rowDropActionBegin(args, this._dataModel),
                rowDragStop: (args) => dragDrop.rowDragStop(args, this._dataModel),
            };
        }
        treeGridActionBegin(args) {
            // Support "Entf/Del" key
            if (args.requestType == "delete") {
                args.cancel = true;
                if (args.deletedItems[0].item instanceof chartManagerChart_1.ChartManagerChart) {
                    // Remove chart from datamodel
                    this._dataModel.removeChart(args.deletedItems[0].item);
                }
                else if (args.deletedItems[0].item instanceof baseSeries_1.BaseSeries) {
                    var chart = args.deletedItems[0].parentItem.parentItem.item;
                    if (chart != undefined) {
                        // Remove serie from datamodel
                        this._dataModel.removeSerie(chart, args.deletedItems[0].item);
                    }
                }
                else if (args.deletedItems[0].item instanceof scale_1.Scale) {
                    var chart = args.deletedItems[0].parentItem.item;
                    if (chart != undefined && chart.canRemoveYAxis() == true) {
                        // Remove yAxis from datamodel
                        this._dataModel.removeYAxis(chart, args.deletedItems[0].item);
                    }
                }
            }
        }
        treeGridActionComplete(args) {
            // Event trigger while changing datasource dynamically. 
            // code to done after the dynamic change of datasource. 
            if (args.requestType === 'refreshDataSource') {
                this.refreshSelection();
            }
        }
        resize(width, height) {
            super.resize(width, height);
        }
        refresh() {
            try {
                if (this.refreshEnabled) {
                    // update datamodel in treegrid
                    this.setModel(this.dataModel.data);
                    // update datamodel in toolbar
                    this._toolbar.updateDataModel(this.dataModel);
                }
            }
            catch (e) {
                console.info("ChartManager refresh error! => TreeGrid recreation!");
                console.info(e);
                this.createTreeGrid();
            }
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
            // update toolbar buttons
            if (treeObj.model.flatRecords[actualSelectedRowIndex] != undefined) {
                this.updateToolbarButtonStates(treeObj.model.dataSource, treeObj.model.flatRecords[actualSelectedRowIndex].item);
            }
        }
        updateToolbarButtonStates(charts, selectedItem) {
            let toolbar = this._toolbar;
            if (charts.length == 0 || selectedItem == undefined || (selectedItem instanceof scale_1.Scale && selectedItem.parent.canRemoveYAxis() == false)) {
                toolbar.disableDeleteButton(true);
            }
            else {
                toolbar.disableDeleteButton(false);
            }
            if (this._dataModel.canAddChart() || (selectedItem instanceof chartManagerChart_1.ChartManagerChart && selectedItem.canAddYAxis())) {
                toolbar.disableAddButton(false);
            }
            else {
                toolbar.disableAddButton(true);
            }
            toolbar.setSelectedChart(selectedItem);
        }
        //*******************************************************Region drop support*******************************************************
        /**
         * Adds all possible dropLocations
         *
         * @private
         * @param {Array<BaseSeries>} series
         * @memberof ChartManagerWidget
         */
        addDropLocations(series) {
            // Add possible drop locations
        }
        /**
         * Removes all drop locations
         *
         * @private
         * @param {Array<BaseSeries>} series
         * @memberof ChartManagerWidget
         */
        removeDropLocations(series) {
            this._dataModel.data.forEach(chart => {
                chart.dropPossible = false;
                chart.childs.forEach(yAxis => {
                    yAxis.dropPossible = false;
                });
            });
        }
        dragStart(args) {
            let serie = args.data;
            // Add possible dropLocations
            this.addDropLocations(serie);
            // Update treeGrid
            this.refresh();
        }
        dragStop(args) {
            let serie = args.data;
            // Remove possible dropLocations
            this.removeDropLocations(serie);
            // Update treeGrid
            this.refresh();
        }
        dragOver(args) {
            let series = args.data;
            let dropPossible = false;
            let chart = this.getChartFromDragLocation(args.currentTarget);
            let yAxis = this.getYAxisFromDragLocation(args.currentTarget);
            let imageProvider = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.ImageProviderId);
            if (chart != undefined) {
                if (chart.dropPossible == true) {
                    dropPossible = true;
                    if (args.dragDropRepresentation != undefined) {
                        let addNewScaleImage = imageProvider.getImage("../app/widgets/common/style/images/dragDrop/addNewScale.svg");
                        args.dragDropRepresentation.iconList.push(addNewScaleImage);
                        if (series[0].type === seriesType_1.SeriesType.timeSeries && chart.chartType == chartManagerChart_1.ChartType.FFTChart) {
                            args.dragDropRepresentation.textList[0] = "Calculate FFT signal and add it to new scale";
                        }
                        else {
                            args.dragDropRepresentation.textList[0] = "Create a new scale and add dragged signals";
                        }
                    }
                }
            }
            else if (yAxis != undefined) {
                if (yAxis.dropPossible == true) {
                    dropPossible = true;
                    if (args.dragDropRepresentation != undefined) {
                        let addNewScaleImage;
                        //XY chart exception
                        if (yAxis.parent.chartType == chartManagerChart_1.ChartType.XYChart) {
                            addNewScaleImage = imageProvider.getImage("../app/widgets/common/style/images/dragDrop/assignToChart.svg");
                            if (series[0].type == seriesType_1.SeriesType.timeSeries) {
                                args.dragDropRepresentation.textList[0] = "Calculate XY signal and add it to the chart";
                            }
                            else {
                                args.dragDropRepresentation.textList[0] = "Add dragged signals to chart";
                            }
                        }
                        else if (yAxis.parent.chartType == chartManagerChart_1.ChartType.FFTChart) {
                            addNewScaleImage = imageProvider.getImage("../app/widgets/common/style/images/dragDrop/assignToScale.svg");
                            args.dragDropRepresentation.textList[0] = "Calculate FFT signal and add it to scale";
                        }
                        else {
                            addNewScaleImage = imageProvider.getImage("../app/widgets/common/style/images/dragDrop/assignToScale.svg");
                            args.dragDropRepresentation.textList[0] = "Add dragged signals to scale";
                        }
                        args.dragDropRepresentation.iconList.push(addNewScaleImage);
                    }
                }
            }
            this.highlightDroppableAreas(chart, yAxis, args.currentTarget);
            return dropPossible;
        }
        drop(args) {
            let series = args.data;
            let chart = this.getChartFromDragLocation(args.currentTarget);
            let yAxis = this.getYAxisFromDragLocation(args.currentTarget);
            if (yAxis != undefined) {
                chart = yAxis.parent;
            }
            series = SerieChartTypeHelper_1.SerieChartTypeHelper.getDroppableSeries(chart.getAllSeries(), series);
            let data = {
                chart: chart,
                yAxis: yAxis,
                series: series
            };
            //raise event to traceViewWidget
            if (series[0].type == seriesType_1.SeriesType.timeSeries && chart.chartType == chartManagerChart_1.ChartType.XYChart) {
                this.eventDropHelper.raise(this.dataModel, { hint: chartDropHelper_1.ChartDropHelperChangedHint.createXYSerie, data: data });
            }
            else if (series[0].type == seriesType_1.SeriesType.timeSeries && chart.chartType == chartManagerChart_1.ChartType.FFTChart) {
                this.eventDropHelper.raise(this.dataModel, { hint: chartDropHelper_1.ChartDropHelperChangedHint.createFFTSerie, data: data });
            }
            else {
                this.eventDropHelper.raise(this.dataModel, { hint: chartDropHelper_1.ChartDropHelperChangedHint.addSerie, data: data });
            }
            this.resetHighlightArea();
        }
        getChartFromDragLocation(currentTarget) {
            let classes = currentTarget.classList.value;
            //avoid dropping serie in not highlighted area
            if (!classes.includes('e-templatecell') && classes.includes('e-rowcell') || classes.includes('e-headercell') || currentTarget.localName == 'span') {
                return undefined;
            }
            let record = this.getTreeRecord(currentTarget);
            if (record != undefined) {
                if (record.item instanceof chartManagerChart_1.ChartManagerChart) {
                    return record.item;
                }
            }
            return undefined;
        }
        getYAxisFromDragLocation(currentTarget) {
            let classes = currentTarget.classList.value;
            //avoid dropping serie in not highlighted area
            if (!classes.includes('e-templatecell') && classes.includes('e-rowcell')) {
                return undefined;
            }
            let record = this.getTreeRecord(currentTarget);
            if (record != undefined) {
                if (record.item instanceof scale_1.Scale) {
                    return record.item;
                }
            }
            return undefined;
        }
        /**
         * Returns the column template informations
         *
         * @private
         * @returns {string}
         * @memberof ChartManagerWidget
         */
        getColumnTemplateData(columnId) {
            if (columnId == ChartManagerWidget_1.nameColumnId) {
                return `<script type="text/x-jsrender" id="cmNameColumnTemplate">
			            <div style='height:20px;' unselectable='on'>
                            {{if !~getstate()}}
                                <div class='e-dragintend' style='height:1px; float:left; width:14px; display:inline-block;'>
                                    <div class={{:~_stageName()}} style='width:24px;'>
                                        <span class='e-aboveIcon e-iconMargin e-icon' style='position:relative;float:right;display:none;'></span>
                                        <span class='e-belowIcon e-iconMargin e-icon' style='position:relative;float:right;display:none;'></span>
                                        <span class='e-childIcon e-iconMargin e-icon' style='position:relative;float:right;display:none;'></span>
                                        <span class='e-cancelIcon e-iconMargin e-icon' style='position:relative;float:right;display:none;'></span>
                                    </div>
                                </div>
                            {{else ~getstate()}}
                                <div class='e-intendparent'>
                                    <div class={{:~_stageName()}}>
                                        <span class='e-aboveIcon e-iconMargin e-icon' style='position:relative;float:left;display:none;'></span>
                                        <span class='e-belowIcon e-iconMargin e-icon' style='position:relative;float:left;display:none;'></span>
                                        <span class='e-childIcon e-iconMargin e-icon' style='position:relative;float:left;display:none;'></span>
                                        <span class='e-cancelIcon e-iconMargin e-icon' style='position:relative;float:left;display:none;'></span>
                                    </div>
                                </div>
                            {{/if}}
   
                            {{:#data['iconDefinition']}}
                            <div class='e-cell' style='display:inline-block;width:100%' unselectable='on'>{{:#data['name']}}</div>
			            </div>
                    </script>`;
            }
            return "";
        }
        getScriptForDragDropTemplateHelpers() {
            return `<script type="text/javascript">
                    $.views.helpers({ _stageName: getStageName });
                    $.views.helpers({ getstate: _getState });
                    $.views.helpers({ isGroup: _isGroup });
                    
                    function _getState() {
                        if (this.data.parentItem)
                            return false;
                        else
                            return true;
                    }

                    function _isGroup() {
                        if (this.data.isGroup)
                            return true;
                        else
                            return false;
                    }

                    function getStageName() {
                        var rowClass = "gridrowIndex",
                            proxy = this;
                        rowClass += proxy.data.index.toString() + "level" + proxy.data.level.toString();
                        return rowClass;

                    }
                </script>`;
        }
        /**
         *
         *
         * @param {DragDropArgs} args
         * @memberof ChartManagerWidget
         */
        dropFocusLost(args) {
            this.resetHighlightArea();
        }
        ;
        /**
         * Highlight rows where signal is dragged over and possible to be dropped
         *
         * @private
         * @param {(IChartManagerChart | undefined)} chartManagerChart
         * @param {(Scale | undefined)} yAxis
         * @memberof ChartManagerWidget
         */
        highlightDroppableAreas(chartManagerChart, yAxis, currentTarget) {
            if (chartManagerChart != undefined && chartManagerChart.dropPossible) {
                let area = this.getAreaToFromCurrentTarget(currentTarget);
                this.addHighlightedArea(area);
            }
            else if (yAxis != undefined && yAxis.dropPossible) {
                let area = this.getAreaToFromCurrentTarget(currentTarget);
                this.addHighlightedArea(area);
            }
            else {
                this.resetHighlightArea();
            }
        }
        addHighlightedArea(area) {
            let highlightElem = $('<div id="' + this.highlightAreaId + '" style=" pointer-events:none; position:absolute; " class="draggedOver"></div>');
            this.resetHighlightArea(highlightElem);
            $(area).append(highlightElem);
            highlightElem.css('top', area.offsetTop);
            highlightElem.css('left', area.offsetLeft);
            highlightElem.css('height', area.offsetHeight);
            highlightElem.css('width', area.offsetWidth);
        }
        getAreaToFromCurrentTarget(currentTarget) {
            let classes = currentTarget.classList.value;
            if (classes.includes('e-rowcell')) {
                return currentTarget;
            }
            else {
                return this.getAreaToFromCurrentTarget(currentTarget.parentElement);
            }
        }
        /**
         * Reset all highlighted ares in chartManager except the cell being draggedOver
         *
         * @private
         * @param {JQuery<HTMLElement>} [element]
         * @memberof ChartManagerWidget
         */
        resetHighlightArea(element) {
            let highlightElem = $('#' + this.highlightAreaId);
            for (var i = 0; i < highlightElem.length; i++) {
                if (element == undefined || highlightElem[i] != element[0]) {
                    highlightElem[i].remove();
                }
            }
        }
    };
    ChartManagerWidget.nameColumnId = "name";
    ChartManagerWidget.additionalInfoColumnId = "additionalInfo";
    ChartManagerWidget.iconDefinitionColumnId = "iconDefinition";
    ChartManagerWidget = ChartManagerWidget_1 = __decorate([
        mco.role()
    ], ChartManagerWidget);
    exports.ChartManagerWidget = ChartManagerWidget;
});
