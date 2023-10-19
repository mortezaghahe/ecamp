var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../chartWidget/YTChart", "../chartWidget/XYChart", "../chartWidget/FFTChart", "./chartViewWidget", "../common/viewTypeProvider", "../chartWidget/helpers/chartRangeHelper", "../../models/chartManagerDataModel/chartManagerDataModel", "../../models/chartManagerDataModel/chartManagerChart", "../../models/common/series/eventSerieDataChangedArgs", "./helpers/chartDropHelper", "../common/states/chartViewToolbarStates", "../../core/interfaces/components/ui/chart/chartInterface", "../common/SerieChartTypeHelper", "../../models/common/series/seriesType", "../chartWidget/cursor/CrossHairCursor", "../chartWidget/cursor/LineCursor", "../common/paneProperties", "../../framework/componentHub/bindings/bindings", "../traceViewWidget/bindingIds"], function (require, exports, YTChart_1, XYChart_1, FFTChart_1, chartViewWidget_1, viewTypeProvider_1, chartRangeHelper_1, chartManagerDataModel_1, chartManagerChart_1, eventSerieDataChangedArgs_1, chartDropHelper_1, chartViewToolbarStates_1, chartInterface_1, SerieChartTypeHelper_1, seriesType_1, CrossHairCursor_1, LineCursor_1, paneProperties_1, bindings_1, bindingIds_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartViewChartManager = void 0;
    let ChartViewChartManager = class ChartViewChartManager {
        /**
         * Gets the tool state
         *
         * @readonly
         * @protected
         * @type {ChartViewToolState}
         * @memberof ChartViewChartManager
         */
        get toolState() {
            return this._toolState;
        }
        /**
         * Sets the tool state. The method is called automatically whenever a tool state has been changed externally.
         *
         * @protected
         * @memberof ChartViewChartManager
         */
        set toolState(toolState) {
            // update the backup field
            this._toolState = toolState;
        }
        /**
          * Gets the zoom direction state
          *
          * @readonly
          * @protected
          * @type {ChartViewZoomDirectionState}
          * @memberof ChartViewChartManager
          */
        get zoomDirectionState() {
            return this._zoomDirectionState;
        }
        /**
         * Sets the zoom direction state. The method is called automatically whenever a zoom direction state has been changed externally.
         *
         * @protected
         * @memberof ChartViewChartManager
         */
        set zoomDirectionState(zoomDirectionState) {
            // update the backup field
            this._zoomDirectionState = zoomDirectionState;
        }
        /**
         * Creates an instance of ChartViewChartManager
         * @param {ChartViewWidget} chartViewWidget
         * @param {IUserInteractionController} userInteractionController
         * @param {ChartViewLayoutManager} layoutManager
         * @param {IChartManagerDataModel} chartManagerDataModel
         * @memberof ChartViewChartManager
         */
        constructor(chartViewWidget, userInteractionController, layoutManager, chartManagerDataModel) {
            this.traceChartList = [];
            this.series = new Array();
            this._toolState = new chartViewToolbarStates_1.ChartViewToolState();
            this._zoomDirectionState = new chartViewToolbarStates_1.ChartViewZoomDirectionState();
            this._onSerieDataChanged = (sender, eventArgs) => this.onSerieDataChanged(sender, eventArgs);
            this._userChartInteractionHandler = (sender, args) => this.onUserChartInteraction(sender, args);
            this._onRedrawAllCharts = (sender, args) => this.onRedrawAllCharts(sender, args);
            this._onChartSeriesAdded = (sender, args) => this.onChartSeriesAdded(sender, args);
            this._persistedPanes = [];
            this._chartMinHeight = 100;
            this.chartViewWidget = chartViewWidget;
            this.userInteractionController = userInteractionController;
            this.layoutManager = layoutManager;
            this._chartManagerDataModel = chartManagerDataModel;
            this.createBindings();
        }
        /**
         * Creates the bindings
         *
         * @private
         * @memberof ChartViewChartManager
         */
        createBindings() {
            bindings_1.Bindings.createByDecl(bindingIds_1.TraceViewBinding.ToolState, this, "toolState", "");
            bindings_1.Bindings.createByDecl(bindingIds_1.TraceViewBinding.ZoomDirectionState, this, "zoomDirectionState", "");
        }
        initChartViewWithDataModel() {
            if (this._chartManagerDataModel != undefined) {
                // If there are already charts in the datamodel => show in chart view => needed for persisting
                if (this._chartManagerDataModel.data != undefined) {
                    //Get persisted chart panes
                    this._persistedPanes = this.layoutManager.chartSplitter.getChartViewSplitterPaneDefinitions();
                    this._chartManagerDataModel.data.forEach(chart => {
                        // Add charts, add scales, add series
                        this.addTraceChart(chart, -1, chart.chartType, false); // Suppress redrawing and do it after all charts where added to avoid multiple redraws
                    });
                    // redraw all charts after adding
                    /*for (let i = 0; i < this.traceChartList.length; i++) {
                        this.traceChartList[i].redrawChart();
                    }*/
                }
            }
        }
        /**
         * Disposes the instance
         *
         * @memberof ChartViewChartManager
         */
        dispose() {
            for (let i = 0; i < this.traceChartList.length; i++) {
                this.traceChartList[i].dispose();
            }
            // Unbinds all bindings to this instance
            bindings_1.Bindings.unbind(this);
        }
        addTraceChart(chart, index = -1, type, supressRedraw = false) {
            let newTraceChart = this.addChartToContainer(chart.name, index, type, chart.childs);
            if (supressRedraw == false) {
                this.redrawCharts(false);
            }
            this.updateZoomSettings();
            this.updateXAxisWidth(chart.chartType);
            return newTraceChart;
        }
        addChartToContainer(name, index = -1, type, scales) {
            let traceChart;
            let chartHeight = 300;
            if (this.chartViewWidget.view) {
                // TODO: Handle with settings object factory
                if (type === chartManagerChart_1.ChartType.YTChart) {
                    traceChart = new YTChart_1.YTChart(this.chartViewWidget.view, name, type, scales);
                }
                else if (type === chartManagerChart_1.ChartType.XYChart) {
                    traceChart = new XYChart_1.XYChart(this.chartViewWidget.view, name, type, scales);
                }
                else {
                    traceChart = new FFTChart_1.FFTChart(this.chartViewWidget.view, name, type, scales);
                }
                traceChart.eventUserChartInteraction.attach(this._userChartInteractionHandler);
                traceChart.eventRedrawAllCharts.attach(this._onRedrawAllCharts);
                traceChart.eventSeriesAdded.attach(this._onChartSeriesAdded);
                //Set the height of persisted charts
                if (this._persistedPanes.length > 0) {
                    chartHeight = this.getPersistedChartHeight(name);
                    //Workaround: Add 2 pixels if is the first chart 
                    if (this.layoutManager.chartSplitter.layoutPanes.length == 0) {
                        chartHeight += 2;
                    }
                }
                let paneProperties = new paneProperties_1.PaneProperties();
                paneProperties.paneSize = chartHeight;
                paneProperties.minSize = this._chartMinHeight;
                this.layoutManager.chartSplitter.addWidget(traceChart, name, viewTypeProvider_1.ViewType.User, paneProperties);
                if (index != -1) {
                    // TODO: set index at addWidget Method to avoid moving the chart afterwards
                    this.layoutManager.chartSplitter.moveWidget(traceChart, index);
                    this.traceChartList.splice(index, 0, traceChart);
                }
                else {
                    this.traceChartList.push(traceChart);
                }
                return traceChart;
            }
            return undefined;
        }
        /**
         * Get height of persisted charts
         *
         * @param {string} chartName
         * @returns {number}
         * @memberof ChartViewChartManager
         */
        getPersistedChartHeight(chartName) {
            let chartHeight = this.layoutManager.getChartViewSplitterHeight(this._persistedPanes, chartName);
            this._persistedPanes = this._persistedPanes.filter(element => { return element.componentDefinition.id != chartName; });
            return chartHeight;
        }
        /**
         * Method to set the ZoomSetting(Direction and BoxZoom) for all Charts according to the corresponding states
         *
         * @private
         * @memberof ChartViewChartManager
         */
        updateZoomSettings() {
            let toolstate = this.toolState;
            let zoomDirectionState = this.zoomDirectionState;
            if (toolstate.selectedTool == chartViewToolbarStates_1.ChartViewToolStateEnum.BOXZOOM) {
                this.setBoxZoom(true);
                this.setPanning(false);
            }
            else if (toolstate.selectedTool == chartViewToolbarStates_1.ChartViewToolStateEnum.PANNING) {
                this.setBoxZoom(false);
                this.setPanning(true);
            }
            else {
                this.setBoxZoom(false);
                this.setPanning(false);
            }
            this.setChartZoomAxes(zoomDirectionState.zoomDirection);
        }
        removeTraceChart(chart) {
            chart.eventUserChartInteraction.detach(this._userChartInteractionHandler);
            chart.eventRedrawAllCharts.detach(this._onRedrawAllCharts);
            chart.eventSeriesAdded.detach(this._onChartSeriesAdded);
            this.removeChartFromChartList(chart);
            chart.dispose();
            this.layoutManager.chartSplitter.removeWidget(chart);
        }
        removeChartFromChartList(chart) {
            let index = this.getChartIndex(chart);
            if (index > -1) {
                this.traceChartList.splice(index, 1);
            }
        }
        moveTraceChart(chart, targetChart, args) {
            let traceChart = this.getChartObjectByName(chart.name);
            let targetTraceChart = this.getChartObjectByName(targetChart.name);
            if (traceChart != undefined && targetTraceChart != undefined) {
                let chartIndex = this.getChartIndex(traceChart);
                let targetIndex = this.getChartIndex(targetTraceChart);
                if (args.insertType == "insertBelow") {
                    targetIndex += 1;
                }
                if (chartIndex > -1 && targetIndex > -1) {
                    this.traceChartList.splice(chartIndex, 1);
                    if (chartIndex < targetIndex) {
                        this.traceChartList.splice(targetIndex - 1, 0, traceChart);
                    }
                    else {
                        this.traceChartList.splice(targetIndex, 0, traceChart);
                    }
                    this.layoutManager.chartSplitter.moveWidget(traceChart, targetIndex);
                }
                this.redrawCharts(false);
                this.updateXAxisWidth(chart.chartType);
            }
        }
        removeAllCharts() {
            while (this.traceChartList.length > 0) {
                this.removeTraceChart(this.traceChartList[0]);
            }
        }
        getChartIndex(chart) {
            let index = -1;
            for (let i = 0; i < this.traceChartList.length; i++) {
                if (this.traceChartList[i] == chart) {
                    index = i;
                }
            }
            return index;
        }
        getTraceChartByContainerId(containerID) {
            for (let i = 0; i < this.traceChartList.length; i++) {
                let divId = this.traceChartList[i].mainDivId;
                if (divId == containerID.substr(0, divId.length)) {
                    return this.traceChartList[i];
                }
            }
            return undefined;
        }
        getTraceChartByName(chartName) {
            for (let i = 0; i < this.traceChartList.length; i++) {
                if (this.traceChartList[i].widgetName == chartName) {
                    return this.traceChartList[i];
                }
            }
            return undefined;
        }
        onChartManagerModelChanged(dataModel, args) {
            this._chartManagerDataModel = dataModel;
            switch (args.hint) {
                case chartManagerDataModel_1.ChartManagerDataModelChangedHint.addSerie: {
                    this.addSeriesToChart(args.data.series, args.data.chart, args.data.axis, args.data.keepScales);
                    break;
                }
                case chartManagerDataModel_1.ChartManagerDataModelChangedHint.moveSerie: {
                    this.moveSerie(args.data.serie, args.data.chart.name, args.data.targetChart.name, args.data.targetAxis);
                    break;
                }
                case chartManagerDataModel_1.ChartManagerDataModelChangedHint.removeSerie: {
                    this.removeSerie(args.data.serie, args.data.chart.name);
                    break;
                }
                case chartManagerDataModel_1.ChartManagerDataModelChangedHint.removeChart: {
                    this.removeChart(args.data.chart);
                    break;
                }
                case chartManagerDataModel_1.ChartManagerDataModelChangedHint.addChart: {
                    this.addTraceChart(args.data.chart, args.data.index, args.data.type);
                    break;
                }
                case chartManagerDataModel_1.ChartManagerDataModelChangedHint.moveChart: {
                    this.moveTraceChart(args.data.chart, args.data.target, args.data);
                    break;
                }
                case chartManagerDataModel_1.ChartManagerDataModelChangedHint.addYScale: {
                    this.addYScale(args.data.yAxis, args.data.chart.name);
                    break;
                }
                case chartManagerDataModel_1.ChartManagerDataModelChangedHint.removeYScale: {
                    this.removeYAxis(args.data.yAxis, args.data.chart);
                    break;
                }
                case chartManagerDataModel_1.ChartManagerDataModelChangedHint.updateScaleRange: {
                    this.synchronizeScaleXRange(args.data.scale);
                    break;
                }
            }
        }
        addSeriesToChart(series, chart, scale, keepScales = false) {
            for (var i = 0; i < series.length; i++) {
                series[i].eventDataChanged.attach(this._onSerieDataChanged);
            }
            let chartName = chart.name;
            let resetXRange = false;
            let resetYRange = false;
            if (!keepScales) {
                resetXRange = this.isFirstSeriesOfTypeInCharts(series[0]);
                resetYRange = this.isFirstSeriesOnScale(series[0], scale);
            }
            else {
                let chartObj = this.getChartObjectByName(chartName);
                if (chartObj != undefined) {
                    // TODO: Only works for YT but not for FFT
                    // Update scale(Y)
                    chartObj.setScaleRange(scale, scale.minXValue, scale.maxXValue, scale.minYValue, scale.maxYValue);
                    // Update scale(X)
                    chartObj.setRangeX(scale.minXValue, scale.maxXValue);
                }
            }
            this.addSeries(series, chartName, scale, resetYRange, resetXRange);
            if (resetXRange) {
                this.resetXRange(series[0]);
            }
        }
        /**
         *Checks if a given Series is the first Series on a particular scale
         *
         * @private
         * @param {Array<BaseSeries>} series
         * @param {Scale} scale
         * @returns {boolean}
         * @memberof ChartViewChartManager
         */
        isFirstSeriesOnScale(series, scale) {
            //only reset the chartrange on the y axis if these are the first series in the scale
            if (scale.childs.length < 1 || series != scale.childs[0]) {
                return false;
            }
            return true;
        }
        /**
         *Checks if a given Series is the first of its type in all charts
         *
         * @private
         * @param {BaseSeries} series
         * @returns
         * @memberof ChartViewChartManager
         */
        isFirstSeriesOfTypeInCharts(series) {
            let charts = this.getChartsForSerie(series);
            for (let chart of charts) {
                if (chart.series.length != 0) {
                    return false;
                }
            }
            return true;
        }
        getChartsForSerie(series) {
            let charts = Array();
            if (series.type == seriesType_1.SeriesType.fftSeries) {
                charts = new chartRangeHelper_1.ChartRangeHelper().getFFTCharts(this.traceChartList);
            }
            else if (series.type == seriesType_1.SeriesType.timeSeries) {
                charts = new chartRangeHelper_1.ChartRangeHelper().getYTCharts(this.traceChartList);
            }
            return charts;
        }
        onSerieDataChanged(sender, eventArgs) {
            if (eventArgs.action == eventSerieDataChangedArgs_1.SerieAction.dataPointsChanged) {
                this.updateSerieData(sender);
            }
            else if (eventArgs.action == eventSerieDataChangedArgs_1.SerieAction.colorChanged) {
                this.updateSerieColor(sender);
            }
        }
        /**
         *  Updates the serie datapoints in all charts where the serie is displayed
         *  If datapoints not valid, the serie will be removed from the charts otherwise added if not already in the chart
         *
         * @private
         * @param {BaseSeries} series
         * @memberof ChartViewChartManager
         */
        updateSerieData(series) {
            if (series.rawPointsValid == false) {
                // No valid serie data => remove from all charts
                this.removeSerieFromAllCharts(series);
            }
            else {
                // add serie to chart if not already in it otherwise update chart
                if (this._chartManagerDataModel != undefined) {
                    let charts = this._chartManagerDataModel.getChartsWithSeries([series]);
                    this.updateSerieInAllCharts(charts, series);
                }
            }
        }
        updateSerieInAllCharts(charts, series) {
            let serieChartType = SerieChartTypeHelper_1.SerieChartTypeHelper.getSerieChartType(series.type);
            for (let i = 0; i < charts.length; i++) {
                let chart = this.getChartObjectByName(charts[i].name);
                if (chart != undefined && serieChartType == chart.type) {
                    if (!this.isSerieInChart(chart, series)) {
                        // add series 
                        let scale = charts[i].getYAxisForSerie(series);
                        if (scale != undefined) {
                            let isFirstSeriesInChart = this.isFirstSeriesOfTypeInCharts(series);
                            this.addSeries([series], charts[i].name, scale, this.isFirstSeriesOnScale(series, scale), true);
                            if (isFirstSeriesInChart) {
                                this.resetXRange(series);
                            }
                        }
                        else {
                            console.error("Scale not found for serie");
                        }
                    }
                    chart.setAvailableSeriesAsDataSource();
                    chart.redrawChart();
                }
            }
        }
        resetXRange(series) {
            let chartRangeHelper = new chartRangeHelper_1.ChartRangeHelper();
            if (series.type == seriesType_1.SeriesType.timeSeries) {
                chartRangeHelper.resetXRangesYT(this.traceChartList);
            }
            else if (series.type == seriesType_1.SeriesType.fftSeries) {
                chartRangeHelper.resetXRangesFFT(this.traceChartList);
            }
            this.redrawCharts(true);
        }
        /**
         * Updates the color of the serie in all charts where the serie is displayed
         *
         * @private
         * @param {BaseSeries} serie
         * @memberof ChartViewChartManager
         */
        updateSerieColor(serie) {
            if (this._chartManagerDataModel != undefined) {
                let series = new Array();
                series.push(serie);
                let charts = this._chartManagerDataModel.getChartsWithSeries(series);
                for (let i = 0; i < charts.length; i++) {
                    let chart = this.getChartObjectByName(charts[i].name);
                    if (chart != undefined) {
                        // Update series color in the chart
                        chart.setAvailableSeriesAsDataSource();
                    }
                }
            }
        }
        /**
         * add serie to chart
         *
         * @param {Array<BaseSeries>} series
         * @param {string} chartName
         * @param {Scale} scale
         * @param {boolean} updateRangeY
         * @memberof ChartViewChartManager
         */
        addSeries(series, chartName, scale, updateRangeY, updateRangeX) {
            let chart = this.getChartObjectByName(chartName);
            if (chart != undefined) {
                let axisMin;
                let axisMax;
                let axis = chart.chart.getAxis(scale.id);
                if (axis != undefined) {
                    let axisRange = axis.getAxisRange();
                    if (axisRange != undefined) {
                        axisMin = axisRange.min;
                        axisMax = axisRange.max;
                    }
                }
                else {
                    console.error("Scale not available! " + scale.id);
                }
                chart.addSeriesToChart(series, scale, updateRangeX);
                chart.setAvailableSeriesAsDataSource();
                if (axisMin != undefined && axisMax != undefined) {
                    chart.setScaleRange(scale, scale.minXValue, scale.maxXValue, axisMin, axisMax);
                }
                if (updateRangeY) {
                    let axisMinValue = chart.getSeriesMinYForScale(scale);
                    let axisMaxValue = chart.getSeriesMaxYForScale(scale);
                    if (axisMinValue != undefined && axisMaxValue != undefined) {
                        chart.updateRangeY(scale, axisMinValue, axisMaxValue);
                    }
                }
                chart.redrawChart();
            }
        }
        addYScale(yScale, chartName) {
            let chart = this.getChartObjectByName(chartName);
            if (chart != undefined) {
                chart.addYScale(yScale, chartInterface_1.AxisPosition.right);
                this.updateXAxisWidth(chart.type);
            }
        }
        /**
         * move one serie from one chart to another
         *
         * @param {BaseSeries} serie
         * @param {string} chartName
         * @param {string} targetChartName
         * @param {Scale} targetScale
         * @memberof ChartViewChartManager
         */
        moveSerie(serie, chartName, targetChartName, targetScale) {
            if (serie.rawPointsValid == true) {
                let chart = this.getChartObjectByName(chartName);
                let target = this.getChartObjectByName(targetChartName);
                let series = new Array();
                series.push(serie);
                if (chart != undefined && target != undefined) {
                    chart.removeSerieFromChart(serie, this.isLastSerieWithCursorType(chart));
                    target.addSeriesToChart(series, targetScale, true);
                    chart.setAvailableSeriesAsDataSource();
                    target.setAvailableSeriesAsDataSource();
                }
                this.updateXAxisWidth(chart.type);
            }
        }
        /**
         * remove one serie from given chart
         *
         * @param {BaseSeries} serie
         * @param {string} chartName
         * @memberof ChartViewChartManager
         */
        removeSerie(serie, chartName) {
            let chart = this.getChartObjectByName(chartName);
            if (chart != undefined) {
                chart.removeSerieFromChart(serie, this.isLastSerieWithCursorType(chart));
                chart.setAvailableSeriesAsDataSource();
            }
            let chartsWithSerie = this._chartManagerDataModel.getChartsWithSeries([serie]);
            if (chartsWithSerie.length == 0) { // Serie not used in an other chart => detach serie events
                serie.eventDataChanged.detach(this._onSerieDataChanged);
            }
        }
        removeYAxis(yScale, chart) {
            let traceChart = this.getChartObjectByName(chart.name);
            if (traceChart != undefined) {
                traceChart.removeYScaleFromChart(yScale);
                traceChart.setAvailableSeriesAsDataSource();
            }
            this.updateXAxisWidth(chart.chartType);
        }
        /**
         * remove chart
         *
         * @param {string} chartName
         * @memberof ChartViewChartManager
         */
        removeChart(chart) {
            let traceChart = this.getChartObjectByName(chart.name);
            if (traceChart != undefined) {
                this.removeTraceChart(traceChart);
                let minX;
                let maxX;
                for (let i = 0; i < traceChart.series.length; i++) {
                    if (minX == undefined || minX > traceChart.series[i].minX) {
                        minX = traceChart.series[i].minX;
                    }
                    if (maxX == undefined || maxX < traceChart.series[i].maxX) {
                        maxX = traceChart.series[i].maxX;
                    }
                }
            }
            this.updateXAxisWidth(chart.chartType);
        }
        setPanningAxes(axes) {
            for (let i = 0; i < this.traceChartList.length; i++) {
                let panningAxis = new Array();
                if (axes[0] == undefined) {
                    for (let j = 0; j < this.traceChartList[i].scales.length; j++) {
                        var axis = this.traceChartList[i].chart.getAxis(this.traceChartList[i].scales[j].id);
                        if (axis != undefined) {
                            panningAxis.push(axis);
                        }
                    }
                    var axis = this.traceChartList[i].chart.getAxis(this.traceChartList[i].primaryXAxisName);
                    if (axis != undefined) {
                        panningAxis.push(axis);
                    }
                }
                else {
                    panningAxis = axes;
                }
                this.traceChartList[i].chart.setPanningAxes(panningAxis);
            }
        }
        synchronizeScaleXRange(scale) {
            let chartType = scale.parent.chartType;
            let min = scale.minXValue;
            let max = scale.maxXValue;
            for (let i = 0; i < this.traceChartList.length; i++) {
                if (this.traceChartList[i].type == chartType) {
                    this.traceChartList[i].onSynchronizeScaleRange(scale, min, max);
                    //this.traceChartList[i].redrawChart();
                }
            }
        }
        getZoomAxesInChart(chart, zoomDirection) {
            let axes = new Array();
            if (zoomDirection == chartViewWidget_1.ZoomDirection.XY || zoomDirection == chartViewWidget_1.ZoomDirection.X) {
                let axis = chart.chart.getAxis(chart.primaryXAxisName);
                if (axis != undefined) {
                    axes.push(axis);
                }
            }
            if (zoomDirection == chartViewWidget_1.ZoomDirection.XY || zoomDirection == chartViewWidget_1.ZoomDirection.Y) {
                for (let i = 0; i < chart.scales.length; i++) {
                    let axis = chart.chart.getAxis(chart.scales[i].id);
                    if (axis != undefined && axis.getAxisOrientation() == chartInterface_1.AxisOrientation.vertical) {
                        axes.push(axis);
                    }
                }
            }
            return axes;
        }
        /**
         * Returns true if there are no more series in all other charts with the same cursor type
         *
         * @private
         * @param {ITraceChart} chart
         * @returns {boolean}
         * @memberof ChartViewChartManager
         */
        isLastSerieWithCursorType(chart) {
            let cursorType = chart.getSerieCursorType();
            if (chart.series.length > 1) {
                return false;
            }
            for (var i = 0; i < this.traceChartList.length; i++) {
                if (this.traceChartList[i].getSerieCursorType() === cursorType && this.traceChartList[i] !== chart) {
                    return false;
                }
            }
            return true;
        }
        /**
         * Finds ITraceChartObject by give name and return object
         *
         * @private
         * @param {string} name
         * @returns {(ITraceChart | undefined)}
         * @memberof ChartViewChartManager
         */
        getChartObjectByName(name) {
            for (let i = 0; i < this.traceChartList.length; i++) {
                if (this.traceChartList[i].widgetName == name) {
                    return this.traceChartList[i];
                }
            }
            return undefined;
        }
        isSerieInChart(chart, serie) {
            for (let i = 0; i < chart.series.length; i++) {
                if (chart.series[i].id === serie.id) {
                    return true;
                }
            }
            return false;
        }
        /*private getPreviousChartObjectByName(name :string) : ITraceChart | undefined{
            for(let i = 0; i < this.traceChartList.length; i++){
                if(this.traceChartList[i].widgetName == name){
                   return this.traceChartList[i];
                }
            }
            return undefined;
        }*/
        removeSerieFromAllCharts(serie) {
            for (let i = 0; i < this.traceChartList.length; i++) {
                var index = this.traceChartList[i].series.map(function (x) { return x.id; }).indexOf(serie.id);
                //const index = this.traceChartList[i].series.indexOf(serie, 0);
                if (index > -1) {
                    this.traceChartList[i].removeSerieFromChart(this.traceChartList[i].series[index], this.isLastSerieWithCursorType(this.traceChartList[i]));
                }
            }
        }
        checkReferenceCursorsHovering(mousePoint, traceChart) {
            traceChart.checkCursorsHovering(mousePoint);
        }
        dragCursorAlongLine(traceChart, movementX, movementY) {
            traceChart.dragCursorAlongLine(movementX, movementY, this._hoveredSeries);
        }
        setCursorOnPointerPosition(traceChart, mousePoint) {
            traceChart.setCursorOnPointerPosition(mousePoint);
        }
        doPanning(traceChart, mousePointX, mousePointY) {
            traceChart.doPanning(mousePointX, mousePointY);
        }
        resetPanningCoords() {
            for (let chart of this.traceChartList) {
                chart.resetPanningCoords();
            }
        }
        resetZoom() {
            let chartRangeHelper = new chartRangeHelper_1.ChartRangeHelper();
            chartRangeHelper.resetXRangesAllChartTypes(this.traceChartList);
            chartRangeHelper.resetYRangesAllChartTypes(this.traceChartList);
            this.redrawCharts(true);
        }
        resetCursorsHovering(args) {
            if (this.traceChartList.length > 0) {
                let parentElement = args.data.e.target.parentElement;
                if (parentElement !== undefined && parentElement !== null) {
                    let mouseOverCursors = this.isMouseOverCursors(parentElement);
                    //Just reset cursors if mouse is moving outside a chart
                    if (this.getTraceChartByContainerId(parentElement.id) === undefined && !mouseOverCursors) {
                        this.traceChartList[0].resetCursorsHovered();
                    }
                }
            }
        }
        autoScale() {
            let chartRangeHelper = new chartRangeHelper_1.ChartRangeHelper();
            for (let chart of this.traceChartList) {
                chart.autoScaleYScales();
            }
            chartRangeHelper.resetXRangesAllChartTypes(this.traceChartList);
            this.redrawCharts(true);
        }
        setChartZoomAxes(axes) {
            for (let i = 0; i < this.traceChartList.length; i++) {
                this.traceChartList[i].setZoomAxes(axes);
            }
            this.chartViewWidget.activeSelectedZoomAxis = axes;
        }
        setPanning(enable) {
            for (let i = 0; i < this.traceChartList.length; i++) {
                this.traceChartList[i].setPanning(enable);
            }
        }
        setBoxZoom(enable) {
            for (let i = 0; i < this.traceChartList.length; i++) {
                this.traceChartList[i].setBoxZoom(enable);
            }
        }
        redrawCharts(forceRedraw, chartType) {
            for (let i = 0; i < this.traceChartList.length; i++) {
                //if (forceRedraw == true || this.traceChartList[i].type != ChartType.XYChart) {
                //    this.traceChartList[i].redrawChart();
                //}
                if (chartType == undefined || forceRedraw == true || this.traceChartList[i].type == chartType) {
                    this.traceChartList[i].redrawChart();
                }
            }
        }
        onRedrawAllCharts(sender, args) {
            this.redrawCharts(false, args.chartType);
        }
        onChartSeriesAdded(sender, args) {
            if (args != undefined) {
                let serie = args;
                serie.eventDataChanged.attach(this._onSerieDataChanged);
            }
        }
        isMouseOverCursors(element) {
            if (element.classList.value.includes(CrossHairCursor_1.CrossHairCursor.crossHairCursorId) || element.classList.value.includes(LineCursor_1.LineCursor.lineCursorId)) {
                return true;
            }
            return false;
        }
        onUserChartInteraction(sender, eventUserChartInteractionArgs) {
            //on dragging the hoverd series needs to be stored to calculate the cursor postion when the mouse is moved over multiple charts
            if (eventUserChartInteractionArgs.eventArguments.hoveredSeries) {
                this._hoveredSeries = eventUserChartInteractionArgs.eventArguments.hoveredSeries;
            }
            this.chartViewWidget.onUserChartInteraction(sender, eventUserChartInteractionArgs);
        }
        addDroppableLocations(data, sameGroup) {
            for (let chart of this.traceChartList) {
                let chartManagerChart = this._chartManagerDataModel.getChart(chart.widgetName);
                let serieChartType = SerieChartTypeHelper_1.SerieChartTypeHelper.getSerieChartType(data[0].type);
                SerieChartTypeHelper_1.SerieChartTypeHelper.setDropPossibleAreas(chartManagerChart, data, serieChartType, sameGroup);
                chart.addSerieDropLocations(data, chartManagerChart);
            }
            let dropHelper = new chartDropHelper_1.ChartDropHelper(this._chartManagerDataModel, this.chartViewWidget);
            // Add empty space drop location
            if (dropHelper.canAddChart() == true) { // Is it possible to add one more chart
                let emptySpaceElement = document.getElementById(this.layoutManager.chartSplitter.getLastPaneId());
                let scrollBarWidth = $('#' + this.layoutManager.chartSplitterParentContainerId)[0].offsetWidth - $('#' + this.layoutManager.chartSplitterContainerId)[0].offsetWidth;
                if (emptySpaceElement != undefined) {
                    emptySpaceElement.style.backgroundColor = 'rgba(125,160,165, 0.2)';
                    if (data[0].type == seriesType_1.SeriesType.timeSeries && data.length > 2 || !sameGroup) {
                        this.addChartTypeAreas(emptySpaceElement, [true, false, true], scrollBarWidth);
                    }
                    else if (data[0].type == seriesType_1.SeriesType.timeSeries) {
                        this.addChartTypeAreas(emptySpaceElement, [true, true, true], scrollBarWidth);
                    }
                    else if (data[0].type == seriesType_1.SeriesType.xySeries) {
                        this.addChartTypeAreas(emptySpaceElement, [false, true, false], scrollBarWidth);
                    }
                    else if (data[0].type == seriesType_1.SeriesType.fftSeries) {
                        this.addChartTypeAreas(emptySpaceElement, [false, false, true], scrollBarWidth);
                    }
                }
            }
        }
        addChartTypeAreas(parent, enabled, scrollBarWidth) {
            let chartNames = ['YT', 'XY', 'FFT'];
            for (var i = 0; i < chartNames.length; i = i + 1) {
                let area = document.createElement('div');
                area.id = parent.id + '_' + chartNames[i];
                area.classList.add('chartTypes');
                if (!enabled[i]) {
                    area.classList.add('disabled');
                }
                area.style.width = ((parent.offsetWidth - scrollBarWidth) / chartNames.length).toString() + 'px';
                let image = document.createElement("img");
                image.src = './widgets/common/style/images/chartType' + chartNames[i] + '.svg';
                image.classList.add('imageChart');
                area.appendChild(image);
                parent.appendChild(area);
            }
        }
        removeDroppableLocations() {
            for (let chart of this.traceChartList) {
                chart.removeSerieDropLocations();
            }
            // Remove empty space drop location
            let emptySpaceElement = document.getElementById(this.layoutManager.chartSplitter.getLastPaneId());
            if (emptySpaceElement != undefined) {
                let typeOfCharts = emptySpaceElement.children.length;
                emptySpaceElement.style.backgroundColor = '#fff';
                for (var i = 0; i < typeOfCharts; i = i + 1) {
                    emptySpaceElement.children[0].remove();
                }
            }
        }
        updateXAxisWidth(chartType) {
            let maxYAxes = 0;
            let chartArea;
            for (let i = 0; i < this.traceChartList.length; i++) {
                if (this.traceChartList[i].type == chartType) {
                    this.traceChartList[i].chart.redraw();
                    let numberOfYAxesInChart = this.traceChartList[i].getNumberOfYScales();
                    if (numberOfYAxesInChart == 0) {
                        numberOfYAxesInChart = 1;
                    }
                    //if one chart has more axis than the others use its width, if they have the same amount use the one with the higher width
                    if (numberOfYAxesInChart > maxYAxes) {
                        maxYAxes = numberOfYAxesInChart;
                        chartArea = this.traceChartList[i].chart.getChartArea();
                    }
                    else if (numberOfYAxesInChart == maxYAxes && this.traceChartList[i].chart.getChartArea().width > chartArea.width) {
                        chartArea = this.traceChartList[i].chart.getChartArea();
                    }
                }
            }
            if (chartArea != undefined) {
                this.alignYAxes(chartArea, chartType);
            }
        }
        alignYAxes(chartArea, chartType) {
            for (let i = 0; i < this.traceChartList.length; i++) {
                if (this.traceChartList[i].type == chartType) {
                    let newChartArea = { x: chartArea.x, y: chartArea.y, width: chartArea.width, height: this.traceChartList[i].chart.getChartArea().height - 1 };
                    this.traceChartList[i].chart.setChartArea(newChartArea);
                    this.traceChartList[i].redrawChart();
                }
            }
        }
    };
    ChartViewChartManager = __decorate([
        mco.role()
    ], ChartViewChartManager);
    exports.ChartViewChartManager = ChartViewChartManager;
});
