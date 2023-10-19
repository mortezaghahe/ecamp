var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../dataModelInterface", "./scale", "../common/series/eventSerieDataChangedArgs", "./eventScaleDataChangedArgs", "./chartManagerChart", "./settingIds", "./componentDefaultDefinition", "./chartManagerData", "../dataModelBase"], function (require, exports, dataModelInterface_1, scale_1, eventSerieDataChangedArgs_1, eventScaleDataChangedArgs_1, chartManagerChart_1, settingIds_1, componentDefaultDefinition_1, chartManagerData_1, dataModelBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartManagerDataModel = exports.ChartManagerDataModelChangedHint = void 0;
    var ChartManagerDataModelChangedHint;
    (function (ChartManagerDataModelChangedHint) {
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["addSerie"] = 0] = "addSerie";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["moveSerie"] = 1] = "moveSerie";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["removeSerie"] = 2] = "removeSerie";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["addChart"] = 3] = "addChart";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["moveChart"] = 4] = "moveChart";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["removeChart"] = 5] = "removeChart";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["addYScale"] = 6] = "addYScale";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["removeYScale"] = 7] = "removeYScale";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["updateScaleRange"] = 8] = "updateScaleRange";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["disableChart"] = 9] = "disableChart";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["renameSignal"] = 10] = "renameSignal";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["startTriggerTimeChanged"] = 11] = "startTriggerTimeChanged";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["colorChanged"] = 12] = "colorChanged";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["dataPointsChanged"] = 13] = "dataPointsChanged";
        ChartManagerDataModelChangedHint[ChartManagerDataModelChangedHint["default"] = 14] = "default";
    })(ChartManagerDataModelChangedHint = exports.ChartManagerDataModelChangedHint || (exports.ChartManagerDataModelChangedHint = {}));
    let ChartManagerDataModel = class ChartManagerDataModel extends dataModelBase_1.DataModelBase {
        constructor() {
            super(...arguments);
            this.series = new Array();
            this._chartManagerData = new chartManagerData_1.ChartManagerData();
            this._serieDataChangedHandler = (sender, args) => this.onSerieDataChanged(sender, args);
            this._scaleDataChangedHandler = (sender, args) => this.onScaleDataChanged(sender, args);
            this._maxChartCount = 4; // Currently limitation of charts to the max. of 4 
        }
        /**
         * Initializes the ChartManagerDataModel
         *
         * @memberof ChartManagerDataModel
         */
        initialize() {
            this._data = this._chartManagerData.childs;
            super.initialize();
            this._dataSource = this;
            super.initialize();
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
        }
        dispose() {
            super.dispose();
            this.clear();
        }
        clear() {
            // Remove all charts
            if (this.data != undefined) {
                for (let i = this.data.length - 1; i >= 0; i--) {
                    this.removeChart(this.data[i]);
                }
            }
        }
        getComponentSettings(onlyModified) {
            let chartList = new Array();
            // export data
            this.data.forEach(child => {
                chartList.push(child.getSettings());
            });
            this.component.setSetting("dataModel", chartList);
            return super.getComponentSettings(onlyModified);
        }
        setComponentSettings(componentSettings) {
            super.setComponentSettings(componentSettings);
            let dataModel = this.component.getSetting("dataModel");
            // Reset the data of this datamodel
            this.clear();
            if (dataModel != undefined) {
                // import data
                dataModel.forEach(chart => {
                    let newChart = new chartManagerChart_1.ChartManagerChart("");
                    newChart.setSettings(chart);
                    newChart.addDefaultYScale(this);
                    // TODO: Set scales to chart within setSettings method of chart
                    let scales = chart.data[settingIds_1.SettingIds.ChartScales];
                    for (let i = 0; i < scales.length; i++) {
                        let scale = scales[i];
                        let newScale;
                        if (i == 0) {
                            // Set scale data to already available default scale
                            newScale = newChart.childs[0];
                            newScale.setSettings(scale);
                        }
                        else {
                            // Add new scale
                            newScale = new scale_1.Scale("", newChart);
                            newScale.setSettings(scale);
                            this.addYScale(newChart, newScale);
                        }
                        // TODO: Set series to scale within setSettings method of scale
                        let seriesProvider = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SeriesProviderId);
                        let seriesIds = scale.data[settingIds_1.SettingIds.ScaleSeriesIds];
                        seriesIds.forEach(seriesId => {
                            if (seriesProvider != undefined) {
                                let series = seriesProvider.get(seriesId);
                                if (series != undefined) {
                                    this.addSeriesToChart(newChart, [series], newScale, true);
                                }
                            }
                        });
                    }
                    ;
                    this.addChart(newChart, -1);
                });
            }
        }
        /**
         * Adds a chart to the datamodel
         *
         * @param {IChartManagerChart} chart
         * @param {number} index
         * @returns {boolean} false if chart adding not possible, else true
         * @memberof ChartManagerDataModel
         */
        addChart(chart, index) {
            let data = this.data;
            if (data.length >= this._maxChartCount) { // Limitation of charts
                return false;
            }
            this._chartManagerData.addChart(chart, index);
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.addChart, { data: data, chart: chart, index: index, type: chart.chartType });
            this.onModelChanged(this, eventArgs);
            let childsclone = chart.childs.slice();
            for (let i = 0; i < childsclone.length; i++) {
                let yAxis = childsclone[i];
                let series = yAxis.childs.slice();
                for (let j = 0; j < series.length; j++) {
                    // fire add serie event for all series of this chart
                    var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.addSerie, { data: data, chart: chart, axis: chart.childs[0], series: series, keepScales: true });
                    this.onModelChanged(this, eventArgs);
                }
            }
            return true;
        }
        /**
         * Returns true if a chart can be added, else false if chart limit was reached
         *
         * @returns {boolean}
         * @memberof ChartManagerDataModel
         */
        canAddChart() {
            if (this.data.length >= this._maxChartCount) { // Limitation of charts
                return false;
            }
            return true;
        }
        /**
         * Removes a chart from the datamodel
         *
         * @param {IChartManagerChart} chart
         * @memberof ChartManagerDataModel
         */
        removeChart(chart) {
            let axisInCharts = chart.getChilds();
            for (let i = 0; i < axisInCharts.length; i++) {
                this.removeYAxis(chart, axisInCharts[i]);
            }
            this._chartManagerData.removeChart(chart);
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.removeChart, { data: this.data, chart: chart });
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Moves a chart within the datamodel
         *
         * @param {IChartManagerChart} chart
         * @param {IChartManagerChart} targetChart
         * @param {string} insertType e.g "insertAbove" or "insertBelow"
         * @memberof ChartManagerDataModel
         */
        moveChart(chart, targetChart, insertType) {
            this._chartManagerData.moveChart(chart, targetChart, insertType);
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.moveChart, { data: this.data, chart: chart, target: targetChart, insertType: insertType });
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Adds a serie to a chart
         *
         * @param {IChartManagerChart} chart
         * @param {Array<BaseSeries>} series
         * @param {Scale} scale
         * @memberof ChartManagerDataModel
         */
        addSeriesToChart(chart, series, scale, keepScales = false) {
            if (chart.getYScale(scale.id) == undefined) {
                chart.addYScale(scale);
            }
            chart.addSeries(series, scale);
            for (var i = 0; i < series.length; i++) {
                series[i].eventDataChanged.attach(this._serieDataChangedHandler);
            }
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.addSerie, { data: this.data, chart: chart, series: series, axis: scale, keepScales: keepScales });
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Removes a serie from a chart
         *
         * @param {IChartManagerChart} chart
         * @param {BaseSeries} serie
         * @memberof ChartManagerDataModel
         */
        removeSerie(chart, serie) {
            if (chart != undefined) {
                chart.removeSerie(serie);
                let chartsWithThisSerie = this.getChartsWithSerie(serie);
                let serieUsed = false;
                if (chartsWithThisSerie.length > 0) {
                    serieUsed = true;
                }
                else { // Serie not used in an other chart => detach events
                    serie.eventDataChanged.detach(this._serieDataChangedHandler);
                }
                var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.removeSerie, { data: this.data, chart: chart, serie: serie, signalUsedInOtherCharts: serieUsed });
                this.onModelChanged(this, eventArgs);
            }
        }
        /**
         * Adds a yAxis to the given chart
         *
         * @param {IChartManagerChart} chart
         * @param {Scale} yScale
         * @memberof ChartManagerDataModel
         */
        addYScale(chart, yScale) {
            if (chart != undefined) {
                chart.addYScale(yScale);
                yScale.eventDataChanged.attach(this._scaleDataChangedHandler);
                var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.addYScale, { data: this.data, chart: chart, yAxis: yScale });
                this.onModelChanged(this, eventArgs);
            }
        }
        getDefaultXScaleRangeByType(type) {
            let scaleRange = { min: 0, max: 100 };
            let chart;
            if (type == chartManagerChart_1.ChartType.XYChart) {
                return scaleRange;
            }
            else {
                for (chart of this.data) {
                    if (chart.chartType == type) {
                        scaleRange.max = chart.childs[0].maxXValue;
                        scaleRange.min = chart.childs[0].minXValue;
                        return scaleRange;
                    }
                }
            }
            return scaleRange;
        }
        /**
         * Removes a yAxis from the given chart
         *
         * @param {IChartManagerChart} chart
         * @param {Scale} yAxis
         * @memberof ChartManagerDataModel
         */
        removeYAxis(chart, yAxis) {
            if (chart != undefined) {
                //First, remove series from Y Axis
                let seriesInAxis = yAxis.getChilds();
                for (let i = 0; i < seriesInAxis.length; i++) {
                    this.removeSerie(chart, seriesInAxis[i]);
                }
                if (chart.removeYAxis(yAxis) == true) {
                    var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.removeYScale, { data: this.data, chart: chart, yAxis: yAxis });
                    this.onModelChanged(this, eventArgs);
                }
            }
        }
        /**
         * Removes a serie from all charts
         *
         * @param {BaseSeries} series
         * @memberof ChartManagerDataModel
         */
        removeSerieFromAllCharts(serie) {
            for (let i = 0; i < this.data.length; i++) {
                let chart = this.data[i];
                if (chart != undefined) {
                    for (let j = 0; j < chart.childs.length; j++) {
                        if (chart.removeSerie(serie)) {
                            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.removeSerie, { data: this.data, chart: chart, serie: serie, signalUsedInOtherCharts: false });
                            this.onModelChanged(this, eventArgs);
                        }
                    }
                }
            }
        }
        /**
         * Moves a serie from one position to an other, within a chart or into an other chart (=> currently only changed event will raised, moving is done by syncfusion treegrid!!!)
         *
         * @param {IChartManagerChart} sourceChart
         * @param {Scale} sourceAxis
         * @param {BaseSeries} serie
         * @param {IChartManagerChart} targetChart
         * @param {Scale} targetAxis
         * @param {string} insertType
         * @memberof ChartManagerDataModel
         */
        moveSerie(sourceChart, sourceAxis, serie, targetChart, targetAxis, insertType) {
            // currently only changed event will raised (moving is done by syncfusion treegrid!!!) 
            var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.moveSerie, { data: this.data, chart: sourceChart, targetChart: targetChart, serie: serie, targetAxis: targetAxis });
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Set the chart disabled or enabled
         *
         * @param {IChartManagerChart} chart
         * @param {boolean} disabled
         * @memberof ChartManagerDataModel
         */
        /*disableChart(chart: IChartManagerChart, disabled: boolean){
          chart.setDisabled(disabled);
          var eventArgs = new EventModelChangedArgs(this, ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.disableChart, {data: this.data});
          this.onModelChanged(this, eventArgs);
        }*/
        /**
         * Returns the chart with the given name or undefined if not found
         *
         * @param {string} chartName
         * @returns {(IChartManagerChart|undefined)}
         * @memberof ChartManagerDataModel
         */
        getChart(chartName) {
            for (let chart of this.data) {
                if (chart.name == chartName) {
                    return chart;
                }
            }
            ;
            return undefined;
        }
        /**
         * Returns a unique chart name (e.g "Chart 1", "chart 2", ...)
         *
         * @returns {string}
         * @memberof ChartManagerDataModel
         */
        getUniqueChartName() {
            for (var i = 1; 1 < 1000; i++) {
                var newchartName = "Chart " + i;
                var chartNameAlreadyExists = false;
                for (let chart of this.data) {
                    if (chart.name == newchartName) {
                        chartNameAlreadyExists = true;
                        break;
                    }
                }
                if (chartNameAlreadyExists == false)
                    return newchartName;
            }
            return "Chart 1000";
        }
        /**
         * Returns all charts which work with the given serie
         *
         * @param {Array<BaseSeries>} serie
         * @returns {Array<IChartManagerChart>}
         * @memberof ChartManagerDataModel
         */
        getChartsWithSeries(serie) {
            let charts = new Array();
            for (let i = 0; i < this.data.length; i++) {
                let chart = this.data[i];
                if (chart.hasSeries(serie)) {
                    charts.push(chart);
                }
            }
            return charts;
        }
        /**
         * Returns all charts which have the given serie
         *
         * @param {BaseSeries} serie
         * @returns {Array<IChartManagerChart>}
         * @memberof ChartManagerDataModel
         */
        getChartsWithSerie(serie) {
            let charts = new Array();
            for (let i = 0; i < this.data.length; i++) {
                let chart = this.data[i];
                if (chart.hasSerie(serie)) {
                    charts.push(chart);
                }
            }
            return charts;
        }
        onSerieDataChanged(sender, args) {
            if (args.action == eventSerieDataChangedArgs_1.SerieAction.rename) {
                var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.renameSignal, { data: this.data });
                this.onModelChanged(this, eventArgs);
            }
            else if (args.action == eventSerieDataChangedArgs_1.SerieAction.startTriggerTimeChanged) {
                var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.startTriggerTimeChanged, { data: this.data });
                this.onModelChanged(this, eventArgs);
            }
            else if (args.action == eventSerieDataChangedArgs_1.SerieAction.colorChanged) {
                var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.colorChanged, { data: this.data });
                this.onModelChanged(this, eventArgs);
            }
            else if (args.action == eventSerieDataChangedArgs_1.SerieAction.dataPointsChanged) { // Needed for showing correct valid/invalid icon in chartmanager if data changes
                var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.dataPointsChanged, { data: this.data });
                this.onModelChanged(this, eventArgs);
            }
        }
        onScaleDataChanged(sender, args) {
            if (args.action == eventScaleDataChangedArgs_1.ScaleAction.xRangeChanged && args.data.scale.parent.chartType != chartManagerChart_1.ChartType.XYChart) {
                var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.updateScaleRange, { data: this.data, scale: sender });
                this.onModelChanged(this, eventArgs);
            }
            if (args.action == eventScaleDataChangedArgs_1.ScaleAction.yRangeChanged) {
                var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.default, { data: this.data, scale: sender });
                this.onModelChanged(this, eventArgs);
            }
            if (args.action == eventScaleDataChangedArgs_1.ScaleAction.xRangeChanged && args.data.scale.parent.chartType == chartManagerChart_1.ChartType.XYChart) {
                var eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, ChartManagerDataModelChangedHint.default, { data: this.data, scale: sender });
                this.onModelChanged(this, eventArgs);
            }
        }
    };
    ChartManagerDataModel = __decorate([
        mco.role()
    ], ChartManagerDataModel);
    exports.ChartManagerDataModel = ChartManagerDataModel;
});
