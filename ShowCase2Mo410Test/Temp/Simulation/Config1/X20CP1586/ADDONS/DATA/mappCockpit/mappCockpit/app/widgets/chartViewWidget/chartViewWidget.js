var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./chartViewChartManager", "../chartViewWidget/chartViewLayoutManager", "../common/widgetBase", "../../framework/events", "../chartWidget/userInteraction/userInteractionController", "../chartWidget/userInteraction/commands/setCursorCommand", "../chartWidget/userInteraction/commands/resetZoomCommand", "../chartWidget/ChartBase", "../chartWidget/userInteraction/commands/cursorHoveringCommand", "../chartWidget/userInteraction/commands/dragCursorCommand", "../chartWidget/userInteraction/commands/endCursorDragCommand", "../chartWidget/userInteraction/commands/panChartCommand", "../chartWidget/userInteraction/commands/toogleBoxZoomCommand", "../chartWidget/userInteraction/commands/tooglePanningCommand", "../chartWidget/userInteraction/commands/selectZoomAxesCommand", "../../models/chartManagerDataModel/chartManagerChart", "../common/interfaces/dropInterface", "../chartWidget/userInteraction/commands/zoomChartCommand", "../chartWidget/userInteraction/commands/selectPanningAxesCommand", "../../models/common/series/baseSeries", "./helpers/chartDropHelper", "../chartWidget/userInteraction/commands/autoScaleCommand", "../chartWidget/userInteraction/commands/resetDragPositionCommand", "../chartWidget/userInteraction/commands/resetCursorHoveringCommand", "../common/SerieChartTypeHelper", "../../models/common/series/seriesType", "./componentDefaultDefinition"], function (require, exports, chartViewChartManager_1, chartViewLayoutManager_1, widgetBase_1, events_1, userInteractionController_1, setCursorCommand_1, resetZoomCommand_1, ChartBase_1, cursorHoveringCommand_1, dragCursorCommand_1, endCursorDragCommand_1, panChartCommand_1, toogleBoxZoomCommand_1, tooglePanningCommand_1, selectZoomAxesCommand_1, chartManagerChart_1, dropInterface_1, zoomChartCommand_1, selectPanningAxesCommand_1, baseSeries_1, chartDropHelper_1, autoScaleCommand_1, resetDragPositionCommand_1, resetCursorHoveringCommand_1, SerieChartTypeHelper_1, seriesType_1, componentDefaultDefinition_1) {
    "use strict";
    var ChartViewWidget_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventDropHelper = exports.ZoomDirection = exports.ChartViewTools = exports.ChartViewWidget = void 0;
    let EventDropHelper = class EventDropHelper extends events_1.TypedEvent {
    };
    EventDropHelper = __decorate([
        mco.role()
    ], EventDropHelper);
    exports.EventDropHelper = EventDropHelper;
    ;
    var ChartViewTools;
    (function (ChartViewTools) {
        ChartViewTools[ChartViewTools["none"] = 0] = "none";
        ChartViewTools[ChartViewTools["referenceCursor1"] = 1] = "referenceCursor1";
        ChartViewTools[ChartViewTools["referenceCursor2"] = 2] = "referenceCursor2";
        ChartViewTools[ChartViewTools["pageScroll"] = 3] = "pageScroll";
        ChartViewTools[ChartViewTools["chartScroll"] = 4] = "chartScroll";
        ChartViewTools[ChartViewTools["boxZoom"] = 5] = "boxZoom";
        ChartViewTools[ChartViewTools["panning"] = 6] = "panning";
    })(ChartViewTools || (ChartViewTools = {}));
    exports.ChartViewTools = ChartViewTools;
    var ZoomDirection;
    (function (ZoomDirection) {
        ZoomDirection[ZoomDirection["X"] = 0] = "X";
        ZoomDirection[ZoomDirection["Y"] = 1] = "Y";
        ZoomDirection[ZoomDirection["XY"] = 2] = "XY";
    })(ZoomDirection || (ZoomDirection = {}));
    exports.ZoomDirection = ZoomDirection;
    let ChartViewWidget = ChartViewWidget_1 = class ChartViewWidget extends widgetBase_1.WidgetBase {
        constructor() {
            super(...arguments);
            this.eventDropHelper = new EventDropHelper();
            this.activeSelectedZoomAxis = ZoomDirection.XY;
            this.dropPossible = false;
            this._scrollbarTopPosition = 0;
            this.chartCommandMap = {};
            this._userInteractionControllerExecuteChartCommandHandler = (sender, args) => this.onExecuteChartCommand(sender, args);
            this._chartManagerModelChangedHandler = (sender, data) => this.onChartManagerModelChanged(sender, data);
            //****************************************#endregion drop support*****************************************
        }
        /**
         * Defines the height of the header
         *
         * @returns {number}
         * @memberof ChartViewWidget
         */
        defineHeaderHeight() {
            return 30;
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
        }
        /**
         * Dispose the objects from this widget
         *
         * @memberof ChartViewWidget
         */
        dispose() {
            this.removeSupportedDragDropDataId(dropInterface_1.DragDropDataId.signal);
            this.detachChartManagerDataModelEvents();
            if (this._layoutManager != undefined) {
                this._layoutManager.dispose();
            }
            if (this.chartManager != undefined) {
                this.chartManager.dispose();
            }
            if (this.userInteractionController != undefined) {
                this.userInteractionController.eventExecuteChartCommand.detach(this._userInteractionControllerExecuteChartCommandHandler);
                this.userInteractionController.dispose();
            }
            super.dispose();
        }
        /**
         * Creates the layout of the widget
         *
         * @memberof ChartViewWidget
         */
        createLayout() {
            $(this.mainDiv).css("overflow", "hidden");
            $(this.mainDiv).append('<div id="InnerChartViewContainer" style="display: flex; flex-direction: column; height: 100%;"></div>');
            if (this.view != undefined) {
                this.userInteractionController = new userInteractionController_1.UserInteractionController();
            }
            this._layoutManager = new chartViewLayoutManager_1.ChartViewLayoutManager(this, this.component);
            let div = $(this.mainDiv).find("#InnerChartViewContainer");
            this._layoutManager.addChartViewContainers(div);
        }
        /**
         * Loads the styles for the chart view toolbar
         *
         * @memberof ChartViewWidget
         */
        loadStyles() {
            super.addStyle("widgets/chartViewWidget/style/css/refCursorStyle.css");
        }
        initialized() {
            super.initialized();
            this.setHeaderContent("Analysis");
            this.initChartManagerDataModel();
            if (this.userInteractionController) {
                this.chartManager = new chartViewChartManager_1.ChartViewChartManager(this, this.userInteractionController, this._layoutManager, this.dataModel);
            }
            this.addChartCommands();
            this._layoutManager.initializeChartViewLayout();
            this.disableMouseWheelForScrollbar();
            this.attachChartManagerDataModelEvents();
            this.chartManager.initChartViewWithDataModel();
            this.enableScrollPersisting();
            this.addSupportedDragDropDataId(dropInterface_1.DragDropDataId.signal);
        }
        initChartManagerDataModel() {
            let dataModel = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.ChartManagerDataModelId);
            this.dataModel = dataModel;
        }
        /**
         * Attaches the chart manager datamodel events
         *
         * @private
         * @memberof ChartViewWidget
         */
        attachChartManagerDataModelEvents() {
            if (this.dataModel) {
                this.dataModel.eventModelChanged.attach(this._chartManagerModelChangedHandler);
            }
        }
        /**
         * Detaches the chart manager datamodel events
         *
         * @private
         * @memberof ChartViewWidget
         */
        detachChartManagerDataModelEvents() {
            if (this.dataModel) {
                this.dataModel.eventModelChanged.detach(this._chartManagerModelChangedHandler);
            }
        }
        onChartManagerModelChanged(sender, args) {
            // Update the chart view widget
            this.refreshCharts(sender, args);
        }
        addChartCommands() {
            if (this.chartManager != undefined && this.userInteractionController != undefined) {
                let setCursorOnPointerPositionCommand = new setCursorCommand_1.SetCursorOnPointerPositionCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.setCursorOnPointerPosition] = setCursorOnPointerPositionCommand;
                let resetZoomCommand = new resetZoomCommand_1.ResetZoomCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.resetZoom] = resetZoomCommand;
                let checkCursorHoveringCommand = new cursorHoveringCommand_1.CheckCursorHoveringCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.checkCursorHovering] = checkCursorHoveringCommand;
                let dragCursorCommand = new dragCursorCommand_1.DragCursorCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.dragCursor] = dragCursorCommand;
                let endCursorDragCommand = new endCursorDragCommand_1.EndCursorDragCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.endCursorDrag] = endCursorDragCommand;
                let panChartCommand = new panChartCommand_1.PanChartCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.panChart] = panChartCommand;
                let toggleBoxZoomCommand = new toogleBoxZoomCommand_1.ToogleBoxZoomCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.toggleBoxZoom] = toggleBoxZoomCommand;
                let togglePanningCommand = new tooglePanningCommand_1.TooglePanningCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.togglePanning] = togglePanningCommand;
                let selectZoomAxesCommand = new selectZoomAxesCommand_1.SelectZoomAxesCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.selectZoomAxis] = selectZoomAxesCommand;
                let zoomChartCommand = new zoomChartCommand_1.ZoomChartCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.zoomChart] = zoomChartCommand;
                let selectPanningAxesCommand = new selectPanningAxesCommand_1.SelectPanningAxesCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.selectPanningAxes] = selectPanningAxesCommand;
                let autoScaleCommand = new autoScaleCommand_1.AutoScaleCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.autoScale] = autoScaleCommand;
                let resetDragPositionCommand = new resetDragPositionCommand_1.ResetDragPositionCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.resetDragPosition] = resetDragPositionCommand;
                let resetCursorHoveringCommand = new resetCursorHoveringCommand_1.ResetCursorHoveringCommand(this.chartManager);
                this.chartCommandMap[userInteractionController_1.ChartCommandType.resetCursorHovering] = resetCursorHoveringCommand;
                this.userInteractionController.eventExecuteChartCommand.attach(this._userInteractionControllerExecuteChartCommandHandler);
            }
            else {
                console.log("chartManager undefined");
            }
        }
        onExecuteChartCommand(sender, args) {
            this.chartCommandMap[args.commandType].onExecuteChartCommand(sender, args);
        }
        onEventToolbarButtonClicked(sender, args) {
            if (this.userInteractionController) {
                this.userInteractionController.onToolbarClick(sender, args);
            }
        }
        onUserChartInteraction(sender, eventUserChartInteractionArgs) {
            if (this.userInteractionController) {
                this.userInteractionController.onChartInteraction(eventUserChartInteractionArgs.chartInteractionType, sender, eventUserChartInteractionArgs.eventArguments);
            }
        }
        resize(width, height) {
            let div = $(this.mainDiv).find("#InnerChartViewContainer");
            let heightWithoutHeader = height - this._headerHeight;
            div[0].style.height = heightWithoutHeader + "px";
            //If width is not defined, it means it is first resize and scroll needs to be set
            if (div[0].style.width === "") {
                let scrollbarSettings = this.component.getSetting(ChartViewWidget_1.ScrollbarSettingId);
                this.setScrollBarSettings(scrollbarSettings);
            }
            div[0].style.width = width + "px";
            this._layoutManager.resize(width, heightWithoutHeader);
        }
        updateCharts(traceChartList) {
            this._layoutManager.updateCharts(this.chartManager.traceChartList);
        }
        refreshCharts(sender, data) {
            this.chartManager.onChartManagerModelChanged(sender, data);
        }
        getTraceChartByName(name) {
            if (this.chartManager != undefined) {
                return this.chartManager.getTraceChartByName(name);
            }
            return undefined;
        }
        setPageScroll(enable) {
            ChartViewWidget_1._pageScrollActive = enable;
        }
        selectReferenceCursor(cursorIndex) {
            if (this.userInteractionController) {
                this.userInteractionController.selectCursor(cursorIndex);
            }
            else {
                console.error("UserInteractionController not defined");
            }
        }
        disableMouseWheelForScrollbar() {
            $("#" + this._layoutManager.chartSplitterParentContainerId).bind('mousewheel DOMMouseScroll', function (e) {
                var disableScrollbarScroll = false;
                if (ChartViewWidget_1._pageScrollActive == false && e.target.id !== 'ChartViewChartSplitterContainer') {
                    if (e.type == 'mousewheel') {
                        disableScrollbarScroll = true;
                    }
                    else if (e.type == 'DOMMouseScroll') {
                        disableScrollbarScroll = true;
                    }
                }
                if (disableScrollbarScroll) {
                    e.preventDefault();
                }
            });
        }
        /**
         * Enable persistency of scroll
         *
         * @private
         * @memberof ChartViewWidget
         */
        enableScrollPersisting() {
            let widget = this;
            $("#" + this._layoutManager.chartSplitterParentContainerId).scroll(function (e) {
                widget._scrollbarTopPosition = this.scrollTop;
                widget.saveSettings();
            });
        }
        getComponentSettings(onlyModified) {
            this.component.setSetting(ChartViewWidget_1.ScrollbarSettingId, this.getScrollBarSettings());
            return super.getComponentSettings(onlyModified);
        }
        getScrollBarSettings() {
            let settings = { "vertical": this._scrollbarTopPosition };
            return settings;
        }
        setScrollBarSettings(data) {
            if (data == undefined) {
                return;
            }
            $("#" + this._layoutManager.chartSplitterParentContainerId)[0].scrollTo(0, data["vertical"]);
        }
        //***************************************#Region drop support**************************************************
        dragStart(args) {
            if (args.data[0] instanceof baseSeries_1.BaseSeries) {
                let sameGroup = this.areSeriesFromSameGroup(args.data);
                this.chartManager.addDroppableLocations(args.data, sameGroup);
            }
        }
        dragStop(args) {
            if (args.data[0] instanceof baseSeries_1.BaseSeries) {
                this.chartManager.removeDroppableLocations();
            }
        }
        dragOver(args) {
            var _a;
            this.dropPossible = false;
            var targetChartContainerId = args.currentTarget.parentElement.id;
            var targetChart = this.chartManager.getTraceChartByContainerId(targetChartContainerId);
            let chartManagerDataModel = this.dataModel;
            let dropHelper = new chartDropHelper_1.ChartDropHelper(chartManagerDataModel, this);
            let chartArea = this.getChartAreaId(args.currentTarget);
            if (targetChart != undefined) {
                // Drag over a chart/chart widget
                let series = args.data;
                let chart = targetChart;
                let dropLocationType = dropHelper.getDropLocationType(args.currentTarget, chart, series);
                this.dragAndDropRepresentation(chart, series, dropLocationType, args.dragDropRepresentation);
                this.highlightDroppableAreas(chart, args.currentTarget);
            }
            else if (dropHelper.canAddChart() == true) { // Is it possible to add one more chart
                let chartViewChartSplitterLastPaneId = (_a = this._layoutManager) === null || _a === void 0 ? void 0 : _a.chartSplitter.getLastPaneId();
                this.resetHighlighting();
                // Maybe drag over empty space
                if (chartArea == chartViewChartSplitterLastPaneId + "_YT") {
                    this.dropPossible = true;
                    this.updateDragDropRepresentation(args.dragDropRepresentation, "../app/widgets/common/style/images/dragDrop/addNewYTChart.svg", "Create a new YT chart and add dragged signals");
                    this.updateChartTypeDroppableAreas(chartArea);
                }
                else if (chartArea == chartViewChartSplitterLastPaneId + "_FFT") {
                    this.dropPossible = true;
                    this.updateDragDropRepresentation(args.dragDropRepresentation, "../app/widgets/common/style/images/dragDrop/addNewFFTChart.svg", "Create a new FFT chart and add dragged signals");
                    this.updateChartTypeDroppableAreas(chartArea);
                }
                else if (chartArea == chartViewChartSplitterLastPaneId + "_XY") {
                    this.dropPossible = true;
                    this.updateDragDropRepresentation(args.dragDropRepresentation, "../app/widgets/common/style/images/dragDrop/addNewXYChart.svg", "Create a new XY chart and add a calculated XY signal");
                    this.updateChartTypeDroppableAreas(chartArea);
                }
            }
            if (chartArea == undefined) {
                this.updateChartTypeDroppableAreas(chartArea);
            }
            return this.dropPossible;
        }
        dragAndDropRepresentation(chart, series, dropLocationType, dragDropRepresentation) {
            if (chart.type == chartManagerChart_1.ChartType.YTChart || chart.type == chartManagerChart_1.ChartType.FFTChart) {
                if (dropLocationType == ChartBase_1.DropLocationType.addNewScale) {
                    this.dropPossible = true;
                    if (series[0].type === seriesType_1.SeriesType.timeSeries && chart.type == chartManagerChart_1.ChartType.FFTChart) {
                        this.updateDragDropRepresentation(dragDropRepresentation, "../app/widgets/common/style/images/dragDrop/addNewScale.svg", "Calculate FFT signal and add it to new scale");
                    }
                    else {
                        this.updateDragDropRepresentation(dragDropRepresentation, "../app/widgets/common/style/images/dragDrop/addNewScale.svg", "Create a new scale and add dragged signals");
                    }
                }
                else if (dropLocationType == ChartBase_1.DropLocationType.assignToScale) {
                    this.dropPossible = true;
                    if (series[0].type === seriesType_1.SeriesType.timeSeries && chart.type == chartManagerChart_1.ChartType.FFTChart) {
                        this.updateDragDropRepresentation(dragDropRepresentation, "../app/widgets/common/style/images/dragDrop/assignToScale.svg", "Calculate FFT signal and add it to scale");
                    }
                    else {
                        this.updateDragDropRepresentation(dragDropRepresentation, "../app/widgets/common/style/images/dragDrop/assignToScale.svg", "Add dragged signals to scale");
                    }
                }
            }
            else {
                if (dropLocationType == ChartBase_1.DropLocationType.assignToScale && this.areSeriesFromSameGroup(series)) {
                    this.dropPossible = true;
                    if (series[0].type == seriesType_1.SeriesType.timeSeries) {
                        this.updateDragDropRepresentation(dragDropRepresentation, "../app/widgets/common/style/images/dragDrop/assignToChart.svg", "Calculate XY signal and add it to the chart");
                    }
                    else {
                        this.updateDragDropRepresentation(dragDropRepresentation, "../app/widgets/common/style/images/dragDrop/assignToChart.svg", "Add dragged signals to chart");
                    }
                }
            }
        }
        /**
         * Updates the drag and drop representation while dragging with new icons or texts
         *
         * @private
         * @param {DragDropRepresentation} dragDropRepresentation
         * @param {string} overlayIconPath
         * @param {string} newText
         * @memberof ChartViewWidget
         */
        updateDragDropRepresentation(dragDropRepresentation, overlayIconPath, newText) {
            if (dragDropRepresentation != undefined) {
                // Add overlay icon if available
                if (overlayIconPath != "") {
                    let imageProvider = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.ImageProviderId);
                    if (imageProvider != undefined) {
                        let addNewScaleImage = imageProvider.getImage(overlayIconPath);
                        if (addNewScaleImage != "") {
                            dragDropRepresentation.iconList.push(addNewScaleImage);
                        }
                    }
                }
                // add text or replace existing text
                if (dragDropRepresentation.textList.length == 0) {
                    dragDropRepresentation.textList.push(newText);
                }
                else {
                    dragDropRepresentation.textList[0] = newText;
                }
            }
        }
        drop(args) {
            let series = args.data;
            if (this.dropPossible) { // Is drop possible
                let chartManagerDataModel = this.dataModel;
                let dropHelper = new chartDropHelper_1.ChartDropHelper(chartManagerDataModel, this);
                let targetChart = this.chartManager.getTraceChartByContainerId(args.currentTarget.parentElement.id);
                if (targetChart != undefined) {
                    let chart = chartManagerDataModel.getChart(targetChart.widgetName);
                    series = SerieChartTypeHelper_1.SerieChartTypeHelper.getDroppableSeries(chart.getAllSeries(), series);
                }
                dropHelper.addSeries(args.currentTarget, targetChart, series, this._layoutManager);
            }
        }
        /**
         * Mouse is not over chartView while dragging operation
         *
         * @param {DragDropArgs} args
         * @memberof ChartViewWidget
         */
        dropFocusLost(args) {
            this.updateChartTypeDroppableAreas(args.currentTarget);
            this.resetHighlighting();
        }
        /**
         * Highlights areas where signals is being dragged
         *
         * @param {ChartBase} chart
         * @param {*} currentTarget
         * @memberof ChartViewWidget
         */
        highlightDroppableAreas(chart, currentTarget) {
            if (currentTarget.id.includes("_axisDropZoneScale") || currentTarget.id.includes("_axisDropZone_chartArea") || currentTarget.id.includes("_refCursor_")) {
                chart.updateDroppableAreas(currentTarget);
                this.resetHighlighting(chart);
            }
            else {
                this.resetHighlighting();
            }
        }
        /**
         * Reset highlighted areas for all charts, except the selected one
         *
         * @param {ITraceChart} [chart]
         * @memberof ChartViewWidget
         */
        resetHighlighting(chart) {
            let traceCharts = this.chartManager.traceChartList;
            for (var i = 0; i < traceCharts.length; i++) {
                if (chart != traceCharts[i]) {
                    traceCharts[i].resetHighlighting();
                }
            }
        }
        /**
         * Update highlighting state for chart Type areas
         *
         * @protected
         * @param {(string | undefined)} currentTargetId
         * @memberof ChartViewWidget
         */
        updateChartTypeDroppableAreas(currentTargetId) {
            var _a;
            let chartViewChartSplitterLastPaneId = (_a = this._layoutManager) === null || _a === void 0 ? void 0 : _a.chartSplitter.getLastPaneId();
            let emptySpaceElement = document.getElementById(chartViewChartSplitterLastPaneId);
            if (emptySpaceElement != undefined) {
                for (var i = 0; i < emptySpaceElement.childElementCount; i = i + 1) {
                    if (emptySpaceElement.children[i].id == currentTargetId) {
                        let area = document.getElementById(emptySpaceElement.children[i].id);
                        area.classList.add('draggedOver');
                    }
                    else {
                        let area = document.getElementById(emptySpaceElement.children[i].id);
                        area.classList.remove('draggedOver');
                    }
                }
            }
        }
        /**
         * Gets the chart area id
         *
         * @protected
         * @param {HTMLElement} target
         * @returns {(string | undefined)}
         * @memberof ChartViewWidget
         */
        getChartAreaId(target) {
            var _a;
            let chartViewChartSplitterLastPaneId = (_a = this._layoutManager) === null || _a === void 0 ? void 0 : _a.chartSplitter.getLastPaneId();
            let ytArea = chartViewChartSplitterLastPaneId + "_YT";
            let fftArea = chartViewChartSplitterLastPaneId + "_FFT";
            let xyArea = chartViewChartSplitterLastPaneId + "_XY";
            if (target.classList.contains('disabled') || target.parentElement.classList.contains('disabled')) {
                return undefined;
            }
            else if (target.id == ytArea || target.parentElement.id == ytArea) {
                return ytArea;
            }
            else if (target.id == fftArea || target.parentElement.id == fftArea) {
                return fftArea;
            }
            else if (target.id == xyArea || target.parentElement.id == xyArea) {
                return xyArea;
            }
            return undefined;
        }
        /**
         * Returns true if drag series belong to the same serie group
         *
         * @private
         * @param {Array<BaseSeries>} series
         * @returns {boolean}
         * @memberof ChartViewWidget
         */
        areSeriesFromSameGroup(series) {
            let parent = series[0].parent;
            for (var i = 1; i < series.length; i = i + 1) {
                if (series[i].parent != parent) {
                    return false;
                }
            }
            return true;
        }
    };
    ChartViewWidget._pageScrollActive = false;
    ChartViewWidget.ScrollbarSettingId = "scrollbar";
    ChartViewWidget = ChartViewWidget_1 = __decorate([
        mco.role()
    ], ChartViewWidget);
    exports.ChartViewWidget = ChartViewWidget;
});
