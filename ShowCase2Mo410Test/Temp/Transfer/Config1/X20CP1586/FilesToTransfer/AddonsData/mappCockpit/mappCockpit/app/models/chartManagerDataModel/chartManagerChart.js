var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./scale", "../../common/persistence/settings", "./settingIds"], function (require, exports, scale_1, settings_1, settingIds_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartManagerChart = exports.ChartType = void 0;
    var ChartType;
    (function (ChartType) {
        ChartType[ChartType["YTChart"] = 0] = "YTChart";
        ChartType[ChartType["XYChart"] = 1] = "XYChart";
        ChartType[ChartType["FFTChart"] = 2] = "FFTChart";
    })(ChartType = exports.ChartType || (exports.ChartType = {}));
    let ChartManagerChart = class ChartManagerChart {
        /**
         * Returns some additional infos which would be shown in the second column in the chartmanager
         *
         * @readonly
         * @type {string}
         * @memberof ChartManagerChart
         */
        get additionalInfo() {
            switch (this.chartType) {
                case ChartType.XYChart:
                    return 'XY';
                case ChartType.YTChart:
                    return 'YT';
                case ChartType.FFTChart:
                    return 'FFT';
            }
            return "";
        }
        /**
         * Creates an instance of ChartManagerChart.
         * @param {string} name
         * @param {ChartType} type
         * @memberof ChartManagerChart
         */
        constructor(name, type = ChartType.YTChart) {
            this.dropPossible = false;
            this.expandState = true;
            this.isGroup = true;
            this.nextUniqueScaleId = 1;
            this.name = name;
            this.chartType = type;
            this.description = "";
            this.childs = new Array();
            this.isDisabled = false;
        }
        getSettings() {
            let scales = this.getChilds();
            let scaleExport = new Array();
            scales.forEach(scale => {
                scaleExport.push(scale.getSettings());
            });
            let settings = new settings_1.Settings("Chart");
            settings.setValue(settingIds_1.SettingIds.ChartName, this.name);
            settings.setValue(settingIds_1.SettingIds.ChartType, this.chartType);
            settings.setValue(settingIds_1.SettingIds.ChartExpandState, this.expandState);
            settings.setValue(settingIds_1.SettingIds.ChartScales, scaleExport);
            return settings;
        }
        setSettings(settings) {
            let settingsObj = settings_1.Settings.create(settings);
            this.name = settingsObj.getValue(settingIds_1.SettingIds.ChartName);
            this.chartType = settingsObj.getValue(settingIds_1.SettingIds.ChartType);
            this.expandState = settingsObj.getValue(settingIds_1.SettingIds.ChartExpandState);
        }
        addDefaultYScale(dataModel) {
            // add default yAxis
            let yScale = new scale_1.Scale("Scale_1", this);
            let defaultXScaleRange = dataModel.getDefaultXScaleRangeByType(this.chartType);
            yScale.minXValue = defaultXScaleRange.min;
            yScale.maxXValue = defaultXScaleRange.max;
            //dataModel.addYScale(this, yScale);
            this.addYScale(yScale);
            yScale.eventDataChanged.attach(dataModel._scaleDataChangedHandler);
        }
        /**
         * Returns the icon definition for this chart object
         *
         * @readonly
         * @type {string}
         * @memberof ChartManagerChart
         */
        get iconDefinition() {
            let iconDefinition = "";
            let classNames = "e-treegridcollapse treegridcollapse";
            // Add collapse/expand icon 
            if (this.expandState == true) {
                classNames += "e-treegridexpand treegridexpand";
            }
            iconDefinition += `<div class='` + classNames + `'></div>`;
            return iconDefinition;
        }
        /**
         * Adds a serie to the given scale in this chart
         *
         * @param {Array<BaseSeries>} series
         * @param {Scale} scale
         * @memberof ChartManagerChart
         */
        addSeries(series, scale) {
            if (scale !== undefined) {
                scale.addSeries(series);
            }
        }
        /**
         * Removes the serie from this chart(will be removed from child => YAxis)
         *
         * @param {BaseSeries} serie
         * @returns {boolean}
         * @memberof ChartManagerChart
         */
        removeSerie(serie) {
            for (let i = 0; i < this.childs.length; i++) {
                let yAxis = this.childs[i];
                if (yAxis.removeSerie(serie)) {
                    return true;
                }
            }
            return false;
        }
        canSeriesBeDropped(series, serieChartType, sameGroup) {
            if (serieChartType == this.chartType) {
                return true;
            }
            else if (series.length == 2 && sameGroup && this.chartType == ChartType.XYChart && serieChartType != ChartType.FFTChart) {
                return true;
            }
            else if (serieChartType == ChartType.YTChart && this.chartType == ChartType.FFTChart) {
                return true;
            }
            return false;
        }
        /**
         * Returns true if it is possible to add an other axis(current limit is 2 yAxis)
         *
         * @returns {boolean}
         * @memberof ChartManagerChart
         */
        canAddYAxis() {
            let maxYAxisCount = 2;
            if (this.chartType == ChartType.XYChart) {
                maxYAxisCount = 1;
            }
            if (this.childs.length < maxYAxisCount) {
                return true;
            }
            return false;
        }
        /**
         * Returns false if there is only one yAxis available
         * There must always be one yAxis available; the last yAxis may not be deleted
         *
         * @memberof ChartManagerChart
         */
        canRemoveYAxis() {
            let minYAxisCount = 1;
            if (this.childs.length <= minYAxisCount) {
                return false;
            }
            return true;
        }
        /**
         * Adds a new yAxis to the chart
         * Returns true if added else false
         *
         * @param {Scale} yAxis
         * @returns {boolean}
         * @memberof ChartManagerChart
         */
        addYScale(yAxis) {
            if (this.canAddYAxis() == false) {
                // Not possible to add more yAxis(limit reached)
                return false;
            }
            this.childs.push(yAxis);
            this.nextUniqueScaleId++;
            return true;
        }
        /**
         * Removes a yAxis from the chart
         * Returns true if removed, else false-
         *
         * @param {Scale} yAxis
         * @returns {boolean}
         * @memberof ChartManagerChart
         */
        removeYAxis(yAxis) {
            if (this.canRemoveYAxis() == false) {
                // There must always be one yAxis available; the last yAxis may not be deleted
                return false;
            }
            let index = -1;
            for (let j = 0; j < this.childs.length; j++) {
                if (this.childs[j] == yAxis) {
                    index = j;
                    break;
                }
            }
            if (index > -1) {
                this.childs.splice(index, 1);
                return true;
            }
            return false;
        }
        /**
         * Returns the name of the next scale, which is currently not in this chart
         *
         * @returns {string}
         * @memberof ChartManagerChart
         */
        getNextYAxisId() {
            return "Scale_" + this.nextUniqueScaleId;
        }
        /**
         * Returns true if the given serie or its only child (FFT) is in the chart, else false
         *
         * @param {Array<BaseSeries>} serie
         * @returns {boolean}
         * @memberof ChartManagerChart
         */
        hasSeries(series) {
            let seriesInChart = 0;
            for (let i = 0; i < this.childs.length; i++) {
                let yAxis = this.childs[i];
                //number of dropped series that are already in the chart 
                seriesInChart = seriesInChart + yAxis.numberOfMatchingSeries(series);
            }
            if (seriesInChart == series.length) {
                return true;
            }
            else {
                return false;
            }
        }
        /**
         * Returns true if the given serie is in the chart, else false
         *
         * @param {BaseSeries} serie
         * @returns
         * @memberof ChartManagerChart
         */
        hasSerie(serie) {
            for (let i = 0; i < this.childs.length; i++) {
                let yAxis = this.childs[i];
                if (yAxis.hasSerie(serie)) {
                    return true;
                }
            }
            return false;
        }
        /**
         * Returns the yAxis object for the given yAxis name
         *
         * @param {string} yAxisId
         * @returns {(Scale|undefined)}
         * @memberof ChartManagerChart
         */
        getYScale(yAxisId) {
            for (let i = 0; i < this.childs.length; i++) {
                if (this.childs[i].id == yAxisId) {
                    return this.childs[i];
                }
            }
            return undefined;
        }
        /**
         * Returns the yAxis object for the given serie
         *
         * @param {BaseSeries} serie
         * @returns {(Scale|undefined)}
         * @memberof ChartManagerChart
         */
        getYAxisForSerie(serie) {
            for (let i = 0; i < this.childs.length; i++) {
                for (let j = 0; j < this.childs[i].childs.length; j++) {
                    if (this.childs[i].childs[j] == serie) {
                        return this.childs[i];
                    }
                }
            }
            return undefined;
        }
        /**
         * Returns the id of the first yAxis
         *
         * @returns {string}
         * @memberof ChartManagerChart
         */
        getDefaultYAxisId() {
            return this.childs[0].id;
        }
        /**
         * Returns all childs of this chart(e.g. yAxis)
         *
         * @returns
         * @memberof ChartManagerChart
         */
        getChilds() {
            let yAxis = [];
            for (let i = 0; i < this.childs.length; i++) {
                yAxis.push(this.childs[i]);
            }
            return yAxis;
        }
        /**
         * Sets the chart disabled or enabled
         *
         * @param {boolean} disabled
         * @memberof ChartManagerChart
         */
        setDisabled(disabled) {
            this.isDisabled = disabled;
        }
        getAllSeries() {
            let series = new Array();
            for (let i = 0; i < this.childs.length; i++) {
                let yAxis = this.childs[i];
                for (let j = 0; j < yAxis.childs.length; j++) {
                    series.push(yAxis.childs[j]);
                }
            }
            return series;
        }
    };
    ChartManagerChart = __decorate([
        mco.role()
    ], ChartManagerChart);
    exports.ChartManagerChart = ChartManagerChart;
});
