var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/dateTimeHelper", "../../models/common/point", "../../common/colorHelper", "../common/busyInformation", "../../models/chartManagerDataModel/chartManagerChart", "../../models/diagnostics/trace/traceConfig/traceConfigDefines", "../common/viewBase", "../chartViewWidget/helpers/chartDropHelper", "../chartViewWidget/insertedInfo", "../../models/chartManagerDataModel/scale", "../chartWidget/ChartBase", "../common/SerieChartTypeHelper", "../../models/signalManagerDataModel/signalManagerCalculation", "../../models/signalManagerDataModel/signalCategory", "../../models/common/signal/serieGroup", "../../models/common/signal/signal", "../../models/common/series/seriesType", "./componentDefaultDefinition", "../../common/seriesHelper", "../../models/common/calculatorProvider/calculators/xyCalculator", "../../models/common/calculatorProvider/calculators/fftCalculator"], function (require, exports, dateTimeHelper_1, point_1, colorHelper_1, busyInformation_1, chartManagerChart_1, traceConfigDefines_1, viewBase_1, chartDropHelper_1, insertedInfo_1, scale_1, ChartBase_1, SerieChartTypeHelper_1, signalManagerCalculation_1, signalCategory_1, serieGroup_1, signal_1, seriesType_1, componentDefaultDefinition_1, seriesHelper_1, xyCalculator_1, fftCalculator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceViewWidget = void 0;
    let TraceViewWidget = class TraceViewWidget extends viewBase_1.ViewBase {
        constructor() {
            super(...arguments);
            this._isLoadingTraceData = false;
            this._widgetIsActive = true;
            // Event handlers
            this._contentActivatedHandler = (sender, args) => this.onContentActivated(sender, args);
            this._chartViewWidgetDropChangedHandler = (sender, args) => this.onDropChanged(sender, args);
            this._signalManagerWidgetSerieDoubleClickedHandler = (sender, data) => this.onSignalManagerWidgetSerieDoubleClicked(sender, data);
            this._signalManagerWidgetChangeSizeHandler = (sender, data) => this.onSignalManagerWidgetChangeSize(sender, data);
            this._signalManagerSignalRemovedHandler = (sender, data) => this.onSignalManagerSignalRemoved(sender, data);
            this._chartManagerWidgetdropHelperHandler = (sender, args) => this.onDropChanged(sender, args);
            this._traceState = "";
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        /**
         * Sets the widget content and eventually subwidgets
         *
         * @memberof TraceViewWidget
         */
        initialized() {
            super.initialized();
            this.initLayoutWidget();
            this.setSeriesProvider();
            this.setTraceControlWidget();
            this.setInnerWidgets();
        }
        initLayoutWidget() {
            this._layoutWidget = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SplitterWidgetTraceViewId);
            this.attachLayoutToView(this);
            this._layoutWidget.initialize();
            // add widget to the parent container
            this._layoutWidget.addToParentContainer(this.mainDiv);
            this._layoutWidget.eventWidgetActivated.attach(this._contentActivatedHandler);
        }
        /**
         * Sets the inner widgets (signalmanager, chart view, chartmanager/cursorinfo)
         *
         * @private
         * @memberof TraceViewWidget
         */
        setInnerWidgets() {
            // Create left widget
            this.setSignalManagerWidget();
            this.attachSignalManagerWidgetEvents();
            // Create the middle widget
            this.setChartViewWidget();
            // Create the widgets on the right side
            this.setRightWidgets();
            this.attachSignalManagerDataModelEvents();
        }
        /**
         * Sets the right widgets (chartmanager, cursorinfo)
         *
         * @private
         * @memberof TraceViewWidget
         */
        setRightWidgets() {
            // Sets the chart manager widget on top
            this.setChartManagerWidget();
        }
        /**
         * Sets the seriesProvider
         *
         * @returns {*}
         * @memberof TraceViewWidget
         */
        setSeriesProvider() {
            this._seriesProvider = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SeriesProviderId);
        }
        /**
         * Sets the trace control widget
         *
         * @returns {*}
         * @memberof TraceViewWidget
         */
        setTraceControlWidget() {
            this._traceControlWidget = this.getWidgetById(componentDefaultDefinition_1.ComponentDefaultDefinition.TraceControlWidgetId);
        }
        /**
         * Sets the signal manager widget
         *
         * @private
         * @memberof TraceViewWidget
         */
        setSignalManagerWidget() {
            this._signalManagerWidget = this.getWidgetById(componentDefaultDefinition_1.ComponentDefaultDefinition.SignalManagerWidgetId);
            this._signalManagerDataModel = this._signalManagerWidget.dataModel;
        }
        /**
         * Sets the chart view widget
         *
         * @private
         * @memberof TraceViewWidget
         */
        setChartViewWidget() {
            this._chartViewWidget = this.getWidgetById(componentDefaultDefinition_1.ComponentDefaultDefinition.ChartViewWidgetId);
            this._chartViewWidget.eventDropHelper.attach(this._chartViewWidgetDropChangedHandler);
        }
        /**
         * Sets the chart manager widget
         *
         * @private
         * @memberof TraceViewWidget
         */
        setChartManagerWidget() {
            this._chartManagerWidget = this.getWidgetById(componentDefaultDefinition_1.ComponentDefaultDefinition.ChartManagerWidgetId);
            this._chartManagerWidget.eventDropHelper.attach(this._chartManagerWidgetdropHelperHandler);
            this._chartManagerDataModel = this._chartManagerWidget.dataModel;
        }
        /**
         * Activate the widget
         *
         * @memberof TraceViewWidget
         */
        activate() {
            this._layoutWidget.activate();
        }
        dispose() {
            this._widgetIsActive = false;
            this._layoutWidget.dispose();
            // Detach events
            this.detachEvents();
            // Dispose provider
            this.disposeProviders();
            // Dispose datamodels
            this.disposeDataModels();
            super.dispose();
        }
        /**
         * Detaches all events
         *
         * @private
         * @memberof TraceViewWidget
         */
        detachEvents() {
            this.detachChartViewWidgetEvents();
            this.detachSignalManagerWidgetEvents();
            this.detachSignalManagerDataModelEvents();
            this.detachChartManagerWidgetEvents();
            this._layoutWidget.eventWidgetActivated.detach(this._contentActivatedHandler);
        }
        disposeProviders() {
            if (this._seriesProvider != undefined) {
                // TODO: Last user must dispose
                this.component.componentFactory.disposeComponent("SeriesProvider");
            }
        }
        /**
         * Dispose all data models
         *
         * @private
         * @memberof TraceViewWidget
         */
        disposeDataModels() {
            // TODO: Dispose datamodels central
            if (this._signalManagerDataModel != undefined) {
                this._signalManagerDataModel.dispose();
            }
            if (this._chartManagerDataModel != undefined) {
                // TODO: Last user must dispose
                // TODO: only needed to remove singleton instance of chartmanagerDataModel
                this.component.componentFactory.disposeComponent("ChartManagerDataModel");
            }
        }
        /** resizes the trace configuration widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof TraceViewWidget
         */
        resize(width, height) {
            this._actualWidth = width;
            this._actualHeight = height;
            if (this._layoutWidget != undefined) {
                this._layoutWidget.resize(width, height);
            }
        }
        onContentActivated(sender, args) {
            args.widget.activate();
            this.resize(this._actualWidth, this._actualHeight);
        }
        detachChartViewWidgetEvents() {
            if (this._chartViewWidget != undefined) {
                this._chartViewWidget.eventDropHelper.detach(this._chartViewWidgetDropChangedHandler);
            }
        }
        /**
         * Called when a D&D operation has been done
         *
         * Review Lukas Obersamer:
         * The cyclomatic complexity of this function is too high.
         * Temporarily okay, as in my subjective judgement, the code readability is okay and the expected risk of hidden issues is expected to be very low.
         * --> Corrective action is sufficient within the 5.19 version range.
         * --> TODO further discussion (e.g. separation of control flow logic and data processing) and definition of mitigation options needed (as soon as this area has to be adapted)
         *
         * @private
         * @param {DataModels.IChartManagerDataModel} chartManagerDataModel
         * @param {*} args
         * @memberof TraceViewWidget
         */
        onDropChanged(chartManagerDataModel, args) {
            switch (args.hint) {
                case chartDropHelper_1.ChartDropHelperChangedHint.createChart: {
                    //creates a chart an adds its series
                    let chartName = chartManagerDataModel.getUniqueChartName();
                    let chartManagerChart = new chartManagerChart_1.ChartManagerChart(chartName, args.data.type);
                    chartManagerChart.addDefaultYScale(this._chartManagerDataModel);
                    chartManagerDataModel.addChart(chartManagerChart, -1);
                    if (args.data.series != undefined) {
                        let yAxisId = chartManagerChart.getDefaultYAxisId();
                        let series = args.data.series;
                        if (args.data.type != chartManagerChart_1.ChartType.YTChart && args.data.series[0].type == seriesType_1.SeriesType.timeSeries) {
                            this._signalManagerWidget.enableTreeGridRefresh(false);
                            if (args.data.type == chartManagerChart_1.ChartType.XYChart) {
                                series = new Array();
                                let xySeries = this.createXYSerie(args.data.series[0].parent, args.data.series);
                                if (xySeries != undefined) {
                                    series.push(xySeries);
                                }
                            }
                            else if (args.data.type == chartManagerChart_1.ChartType.FFTChart) {
                                series = new Array();
                                for (var i = 0; i < args.data.series.length; i++) {
                                    let fftSeries = this.createFFTSerie(args.data.series[i].parent, args.data.series[i]);
                                    if (fftSeries != undefined) {
                                        series.push(fftSeries);
                                    }
                                }
                            }
                            this._signalManagerWidget.enableTreeGridRefresh(true);
                            if (!this._signalManagerWidget.editModeActive && args.data.type == chartManagerChart_1.ChartType.XYChart) {
                                this._signalManagerWidget.activateEditMode(true);
                            }
                        }
                        //Add all dragged series to the chart.
                        this.addSerieToChart(chartManagerDataModel, series, chartManagerChart, yAxisId);
                    }
                    break;
                }
                case chartDropHelper_1.ChartDropHelperChangedHint.addSerie: {
                    let series = args.data.series;
                    let chart = args.data.chart;
                    let yAxis = args.data.yAxis;
                    if (chart != undefined) {
                        //target chart may not be provided by the event args
                        if (args.data.targetChart == undefined) {
                            if (this._chartViewWidget != undefined) {
                                args.data.targetChart = this._chartViewWidget.getTraceChartByName(chart.name);
                            }
                        }
                        //if target chart still does not exist dont try to add the series to anything
                        if (args.data.targetChart != undefined) {
                            let yAxisId = this.getYAxisId(chartManagerDataModel, chart, yAxis, args.data.targetChart);
                            //insert serie to empty a chart
                            this.addSerieToChart(chartManagerDataModel, series, chart, yAxisId);
                        }
                    }
                    break;
                }
                case chartDropHelper_1.ChartDropHelperChangedHint.createXYSerie: {
                    //Creates XY serie and adds it to the XY chart
                    let chartManagerChart = args.data.chart;
                    let series = new Array();
                    let xySeries = this.createXYSerie(args.data.series[0].parent, args.data.series);
                    if (xySeries != undefined) {
                        series.push(xySeries);
                    }
                    let yAxisId = chartManagerChart.getDefaultYAxisId();
                    //Add all dragged series to the chart.
                    this.addSerieToChart(chartManagerDataModel, series, chartManagerChart, yAxisId);
                    break;
                }
                case chartDropHelper_1.ChartDropHelperChangedHint.createFFTSerie: {
                    //Creates FFT serie and add it to the FFT chart
                    let chart = args.data.chart;
                    let series = new Array();
                    for (var i = 0; i < args.data.series.length; i++) {
                        let fftSeries = this.createFFTSerie(args.data.series[i].parent, args.data.series[i]);
                        if (fftSeries != undefined) {
                            series.push(fftSeries);
                        }
                    }
                    let yAxis = args.data.yAxis;
                    //target chart may not be provided by the event args
                    if (args.data.targetChart == undefined) {
                        if (this._chartViewWidget != undefined) {
                            args.data.targetChart = this._chartViewWidget.getTraceChartByName(chart.name);
                        }
                    }
                    //if target chart still does not exist dont try to add the series to anything
                    if (args.data.targetChart != undefined) {
                        let yAxisId = this.getYAxisId(chartManagerDataModel, chart, yAxis, args.data.targetChart);
                        //Add all dragged series to the chart.
                        this.addSerieToChart(chartManagerDataModel, series, chart, yAxisId);
                    }
                }
            }
        }
        /**
         * Attaches the signal manager widget events
         *
         * @private
         * @memberof TraceViewWidget
         */
        attachSignalManagerWidgetEvents() {
            if (this._signalManagerWidget != undefined) {
                this._signalManagerWidget.eventSerieDoubleClicked.attach(this._signalManagerWidgetSerieDoubleClickedHandler);
                this._signalManagerWidget.eventChangeSize.attach(this._signalManagerWidgetChangeSizeHandler);
            }
        }
        /**
         * Detaches the signal manager widget events
         *
         * @private
         * @memberof TraceViewWidget
         */
        detachSignalManagerWidgetEvents() {
            if (this._signalManagerWidget != undefined) {
                this._signalManagerWidget.eventSerieDoubleClicked.detach(this._signalManagerWidgetSerieDoubleClickedHandler);
                this._signalManagerWidget.eventChangeSize.detach(this._signalManagerWidgetChangeSizeHandler);
            }
        }
        onSignalManagerWidgetSerieDoubleClicked(sender, serie) {
            this.addNewChart(this._chartManagerWidget.dataModel, serie);
        }
        onSignalManagerWidgetChangeSize(sender, newSize) {
            // get parent(splitter) widget of sender(signalManager)
            let innerLayoutSplitterWidget = this.getWidgetById(componentDefaultDefinition_1.ComponentDefaultDefinition.SplitterWidgetMainTraceId);
            // change size of splitter pane
            innerLayoutSplitterWidget.resizeWidget(sender, newSize);
        }
        /**
         * Adds a new chart to the chartmanager datamodel(if possible => max chart number) and adds the given signal to the new chart
         *
         * @private
         * @param {BaseSeries} serie
         * @memberof TraceViewWidget
         */
        addNewChart(chartManagerDataModel, serie) {
            if (chartManagerDataModel) {
                var newChartName = chartManagerDataModel.getUniqueChartName();
                let serieChartType = SerieChartTypeHelper_1.SerieChartTypeHelper.getSerieChartType(serie.type);
                var newChart = new chartManagerChart_1.ChartManagerChart(newChartName, serieChartType);
                newChart.addDefaultYScale(this._chartManagerDataModel);
                let isChartAdded = chartManagerDataModel.addChart(newChart, 0);
                if (serie != undefined && isChartAdded) {
                    let series = new Array();
                    series.push(serie);
                    let yAxis = newChart.getYScale(newChart.getDefaultYAxisId());
                    if (yAxis != undefined) {
                        this.addSerieToChart(chartManagerDataModel, series, newChart, yAxis.id);
                    }
                    else {
                        console.error("Default yAxis not available!");
                    }
                }
            }
        }
        /**
         * Add serie to chart (one by one)
         *
         * @private
         * @param {Array<BaseSeries>} series
         * @param {(IChartManagerChart | undefined)} chartManagerChart
         * @param {string} yAxisId
         * @memberof TraceViewWidget
         */
        addSerieToChart(chartManagerDataModel, series, chartManagerChart, yAxisId) {
            let yAxis = chartManagerChart.getYScale(yAxisId);
            let insertedInfo = new insertedInfo_1.InsertedInfo(series, yAxis, chartManagerChart);
            if (insertedInfo != undefined && insertedInfo.yAxis != undefined && insertedInfo.chart != undefined) {
                chartManagerDataModel.addSeriesToChart(insertedInfo.chart, insertedInfo.series, insertedInfo.yAxis);
            }
        }
        createXYSerie(container, series) {
            if (this._seriesProvider == undefined) {
                return undefined;
            }
            // create calculation
            let calculation = new signalManagerCalculation_1.SignalManagerCalculation("Calculation", this._seriesProvider);
            // add calculation to container
            container.addSerieContainer(calculation, -1);
            // set calculation type
            calculation.setCalculatorTypeById(xyCalculator_1.XYCalculator.id);
            // set calculation input data
            if (series.length > 0 && series[0] != undefined) {
                calculation.setInputValueById(xyCalculator_1.XYCalculator.inputIdXSignal, series[0].name);
            }
            if (series.length > 1 && series[1] != undefined) {
                calculation.setInputValueById(xyCalculator_1.XYCalculator.inputIdYSignal, series[1].name);
            }
            // Return calculation output data 
            return calculation.getOutputCalculationData()[0].serie;
        }
        /**
         * Create FFT output serie
         *
         * @private
         * @param {ISerieContainer} container
         * @param {BaseSeries} series
         * @returns
         * @memberof TraceViewWidget
         */
        createFFTSerie(container, series) {
            if (this._seriesProvider == undefined) {
                return undefined;
            }
            // create calculation
            let calculation = new signalManagerCalculation_1.SignalManagerCalculation("Calculation", this._seriesProvider);
            // add calculation to container
            container.addSerieContainer(calculation, -1);
            // set calculation type
            calculation.setCalculatorTypeById(fftCalculator_1.FftCalculator.id);
            // set calculation input data
            calculation.setInputValueById(fftCalculator_1.FftCalculator.inputIdSignal, series.name);
            // Change output data name and color of new FFT calculation
            let inputData = calculation.getInputCalculationData();
            let outputData = calculation.getOutputCalculationData();
            if (inputData[0].serie != undefined && inputData[0].serie.rawPointsValid) {
                let outputData = calculation.getOutputCalculationData();
                if (outputData.length > 0) {
                    outputData[0].color = inputData[0].serie.color;
                    outputData[0].value = 'FFT(' + inputData[0].serie.name + ') ' + calculation.serie.calculationDataInfo.uniqueId;
                }
            }
            // Return calculation output data 
            return outputData[0].serie;
        }
        /**
         *
         *
         * @private
         * @param {IChartManagerDataModel} chartManagerDataModel
         * @param {IChartManagerChart} chart
         * @param {(Scale | undefined)} yAxis
         * @param {(ITraceChart | undefined)} targetChart
         * @returns {string}
         * @memberof TraceViewWidget
         */
        getYAxisId(chartManagerDataModel, chart, yAxis, targetChart) {
            let yAxisId;
            if (yAxis != undefined) {
                chart = yAxis.parent;
                yAxisId = yAxis.id;
            }
            else {
                yAxisId = this.getYScaleId(chartManagerDataModel, chart, targetChart);
                if (yAxisId == undefined) {
                    // Create new scale
                    yAxisId = chart.getNextYAxisId();
                    let newYAxis = new scale_1.Scale(yAxisId, chart);
                    chartManagerDataModel.addYScale(chart, newYAxis);
                }
            }
            return yAxisId;
        }
        /**
         * Return yAxis id when serie is dropped in the chart view
         *
         * @private
         * @param {DataModels.IChartManagerDataModel} chartManagerDataModel
         * @param {IChartManagerChart} chartManagerChart
         * @param {*} targetChart
         * @returns {string}
         * @memberof TraceViewWidget
         */
        getYScaleId(chartManagerDataModel, chartManagerChart, targetChart) {
            let yAxisId;
            if (chartManagerChart.chartType == chartManagerChart_1.ChartType.XYChart) {
                yAxisId = chartManagerChart.getDefaultYAxisId();
            }
            else {
                //adding series to YT charts
                let objectUnderMouse = targetChart.getChartObjectUnderMouse(targetChart.chartInstance.mousemoveX, targetChart.chartInstance.mousemoveY);
                if (objectUnderMouse.chartObjectType == ChartBase_1.ChartObjectType.axis) {
                    // get axis id
                    yAxisId = objectUnderMouse.args.axis.getAxisID();
                }
                else if (objectUnderMouse.chartObjectType == ChartBase_1.ChartObjectType.chartSpace) {
                    // create new axis
                    yAxisId = chartManagerChart.getNextYAxisId();
                    let newYAxis = new scale_1.Scale(yAxisId, chartManagerChart);
                    chartManagerDataModel.addYScale(chartManagerChart, newYAxis);
                }
            }
            return yAxisId;
        }
        /**
         * Attaches the signal manager datamodel events
         *
         * @private
         * @memberof TraceViewWidget
         */
        attachSignalManagerDataModelEvents() {
            if (this._signalManagerDataModel) {
                this._signalManagerDataModel.eventSignalRemoved.attach(this._signalManagerSignalRemovedHandler);
            }
        }
        /**
         * Detaches the signal manager datamodel events
         *
         * @private
         * @memberof TraceViewWidget
         */
        detachSignalManagerDataModelEvents() {
            if (this._signalManagerDataModel) {
                this._signalManagerDataModel.eventSignalRemoved.detach(this._signalManagerSignalRemovedHandler);
            }
        }
        onSignalManagerSignalRemoved(sender, serie) {
            if (this._chartManagerDataModel) {
                this._chartManagerDataModel.removeSerieFromAllCharts(serie);
            }
        }
        /**
         * Detaches the chart manager widget events
         *
         * @private
         * @memberof TraceViewWidget
         */
        detachChartManagerWidgetEvents() {
            this._chartManagerWidget.eventDropHelper.detach(this._chartManagerWidgetdropHelperHandler);
        }
        /**
         * Start loading trace data from target
         *
         * @private
         * @returns
         * @memberof TraceViewWidget
         */
        loadTraceDataFromTarget() {
            if (this._isLoadingTraceData == true || this._widgetIsActive == false) {
                return;
            }
            this._isLoadingTraceData = true;
            this._traceControlWidget.setBusyInformation(new busyInformation_1.BusyInformation("Loading trace data", busyInformation_1.ImageId.defaultImage, 25, false));
            this._traceControlWidget.setBusy(true);
            // invoke loading trace data
            this.invokeLoadTraceData();
        }
        invokeLoadTraceData() {
            // BINDINGSOURCE: method for dispatching the call to a bound target
        }
        /**
         * Informations if loading of trace data from target failed
         *
         * @private
         * @param {*} errorData
         * @memberof TraceViewWidget
         */
        onErrorLoadingTraceData(errorData) {
            this._isLoadingTraceData = false;
            this._traceControlWidget.setBusy(false);
        }
        /**
         * update the available data point infos
         *
         * @private
         * @param {Array<TraceDataPointInfo>} traceDataPointInfos
         * @memberof TraceViewWidget
         */
        updateAvailableDataPoints(traceDataPointInfos) {
            this._traceDataPointInfos = traceDataPointInfos;
        }
        /**
         *  handles trace state changes
         *
         * @private
         * @param {string} traceState
         * @param {string} oldTraceState
         * @memberof TraceViewWidget
         */
        onTraceStateChanged(traceState, oldTraceState) {
            let whileStartup = false;
            if (this._traceState == "") {
                whileStartup = true;
            }
            this._traceState = traceState;
            // Load available data if state was changed to data_available and also at startup
            if (traceState == traceConfigDefines_1.TraceStateIds.Data_available && (oldTraceState != traceConfigDefines_1.TraceStateIds.Data_available || whileStartup == true)) {
                // Auto upload of trace data
                this.loadTraceDataFromTarget();
            }
        }
        /**
         * Informations(tracedata) from target after successful trace data upload
         *
         * @private
         * @param {*} result
         * @memberof TraceViewWidget
         */
        onTraceDataLoaded(result) {
            var traceData = result;
            let addTraceDataToSignalManager = true;
            // check if data already in signalmanager datamodel
            if (traceData.traceChannels.length > 0 && traceData.traceChannels[0].tracePoints.length > 0) {
                var serieGroupStartTriggerTime = traceData.triggerTime;
                if (this._signalManagerDataModel != undefined) {
                    if (this._signalManagerDataModel["disposed"] != true) { // Bugfix to avoid use of not unbinded datamodel
                        let latestCategory = this._signalManagerDataModel.getSignalCategory(signalCategory_1.SignalCategory.CategoryIdRecent);
                        if (latestCategory != undefined) {
                            let serieGroup = this._signalManagerDataModel.getSerieGroupByStartTriggerTime(latestCategory, serieGroupStartTriggerTime);
                            if (serieGroup != undefined) { // signal group already exists; needed to avoid duplicated signal groups if event comes multiple times
                                addTraceDataToSignalManager = false;
                            }
                        }
                    }
                }
                else {
                    console.error("signalManagerDataModel not available");
                }
            }
            if (addTraceDataToSignalManager == true) {
                if (traceData.traceChannels.length > 0 && traceData.traceChannels[0].tracePoints.length > 0) {
                    this.addTraceDataToSignalManager(traceData);
                }
            }
            this._isLoadingTraceData = false;
            this._traceControlWidget.setBusy(false);
        }
        /**
         * Adds the given trace data to the signal manager
         *
         * @private
         * @param {*} traceData
         * @memberof TraceViewWidget
         */
        addTraceDataToSignalManager(traceData) {
            let id = traceData.triggerTime.toString();
            var newSerieGroup = new serieGroup_1.SerieGroup(dateTimeHelper_1.DateTimeHelper.getDateTime(traceData.triggerTime), id, traceData.triggerTime);
            for (var i = 0; i < traceData.traceChannels.length; i++) {
                let signalHasNullValues = false;
                var data = new Array();
                for (var j = 0; j < traceData.traceChannels[i].tracePoints.length; j++) {
                    var xVal = (traceData.traceChannels[i].tracePoints[j].timeStamp - traceData.triggerTime) / 1000000;
                    let dataValue = traceData.traceChannels[i].tracePoints[j].dataValue;
                    if (dataValue == null) {
                        // null value found => used for NaN or +/- inf
                        // use empty point array for signal
                        data = new Array();
                        signalHasNullValues = true;
                        break;
                    }
                    else {
                        var yVal = dataValue;
                        data.push(new point_1.Point(xVal, yVal));
                    }
                }
                let newSignal = new signal_1.Signal(traceData.traceChannels[i].name, data);
                if (this._seriesProvider != undefined) {
                    let errorInfo = new Array();
                    if (signalHasNullValues == true) {
                        errorInfo.push("Invalid signal contains NaN or inf values!");
                    }
                    let settings = seriesHelper_1.SeriesHelper.createSerieSettings(newSignal, newSignal.name, colorHelper_1.ColorHelper.getColor(), this._seriesProvider.getUniqueId(), seriesType_1.SeriesType.timeSeries, undefined, errorInfo);
                    let newSerie = this._seriesProvider.createSerie(settings);
                    if (newSerie != undefined) {
                        if (this._traceDataPointInfos != undefined) {
                            let tracePointInfos = this._traceDataPointInfos.filter(element => element.fullname == newSignal.name);
                            if (tracePointInfos.length == 1) {
                                newSerie.name = tracePointInfos[0].componentName + ":" + tracePointInfos[0].name;
                                newSerie.description = tracePointInfos[0].description;
                            }
                        }
                        newSerieGroup.addSerie(newSerie);
                    }
                    else {
                        console.error("Creation of the serie was not possible!");
                    }
                }
                else {
                    console.error("SeriesProvider not available!");
                }
            }
            this._signalManagerDataModel.addUploadedSerieGroup(newSerieGroup);
        }
    };
    TraceViewWidget = __decorate([
        mco.role()
    ], TraceViewWidget);
    exports.TraceViewWidget = TraceViewWidget;
});
