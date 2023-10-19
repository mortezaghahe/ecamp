var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./ChartBase", "../../common/seriesHelper", "./chartExtensions/chartExtensions"], function (require, exports, ChartBase_1, seriesHelper_1, chartExtensions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BasicChart = void 0;
    let BasicChart = class BasicChart extends ChartBase_1.ChartBase {
        constructor(parentView, name, scale) {
            super(parentView, name, scale);
        }
        /**
         * dispose chart
         *
         * @memberof BasicChart
         */
        dispose() {
            this.removeWidgetFromView(this.parentView);
            super.dispose();
        }
        /**
         *
         *
         * @protected
         * @param {IView} parentView
         * @memberof BasicChart
         */
        addWidgetToView(parentView) {
            if (parentView) {
                parentView.addWidget(this);
            }
        }
        /**
         *
         *
         * @private
         * @param {ChartViewChartManager} chartManager
         * @memberof BasicChart
         */
        removeWidgetFromView(parentView) {
            if (parentView) {
                parentView.removeWidget(this);
            }
        }
        initialized() {
            super.initialized();
            this.initializeCursorHandlers();
            this.attachChartExtensions(this.chartInstance);
            this.xAxisWidth = this.chart.getXAxisWidth();
        }
        /**
         * Reinitializes the chart
         *
         * @memberof BasicChart
         */
        reinitialize() {
            super.reinitialize();
            this.setAvailableSeriesAsDataSource();
            this.attachChartExtensions(this.chartInstance);
            this.xAxisWidth = this.chart.getXAxisWidth();
            this.cursorHandler = undefined;
            this.initializeCursorHandlers();
        }
        /**
         * Attaches a extension instance
         *
         * @private
         * @param {*} chartInstance
         * @memberof BasicChart
         */
        attachChartExtensions(chartInstance) {
            // inject an extension provider
            let basicChartExtensions = new chartExtensions_1.ChartExtensions(this);
            // use an yt/fft optimization algorithm
            basicChartExtensions.chartDataOptimizer.trimSeriesForChartBounds = basicChartExtensions.chartDataOptimizer.trimSeriesForChartBoundsYt;
            // set the chart extensions
            chartInstance.chartExtensions = basicChartExtensions;
        }
        /**
         * Send data of the series to the chart instance
         *
         * @memberof BasicChart
         */
        setAvailableSeriesAsDataSource() {
            let traceDataSeries = new Array();
            for (let i = 0; i < this.scales.length; i++) {
                for (let j = 0; j < this.scales[i].childs.length; j++) {
                    if (this.scales[i].childs[j].rawPointsValid) {
                        let effectiveSerie = this.chartInstance.chartExtensions ? this.chartInstance.chartExtensions.chartDataOptimizer.attachSeries(this.scales[i].childs[j]) : this.scales[i].childs[j];
                        traceDataSeries.push(this.chart.createTraceDataSeries(effectiveSerie, this.scales[i].id));
                    }
                }
            }
            this.chart.setSeries(traceDataSeries);
        }
        /**
         * Adds a new y axis into the chart
         *
         * @param {Scale} yAxis
         * @param {boolean} opposedPosition
         * @param {string} color
         * @memberof BasicChart
         */
        addYScale(scale, position) {
            const newAxisWidth = 71;
            this.chart.addYAxis(scale.id, scale.minYValue, scale.maxYValue, position);
            this.xAxisWidth = this.chart.getXAxisWidth() - newAxisWidth;
            if (this.scales.indexOf(scale) == -1) {
                this.scales.push(scale);
            }
        }
        /**
         *
         *
         * @param {Scale} yScale
         * @memberof BasicChart
         */
        removeYScaleFromChart(yScale) {
            this.chart.removeYAxis(yScale.id);
            this.chart.redraw();
            this.xAxisWidth = this.chart.getXAxisWidth();
            let scaleIndex = this.scales.indexOf(yScale);
            if (scaleIndex > -1) {
                this.scales.splice(scaleIndex, 1);
            }
        }
        /**
         *
         *
         * @param {*} referenceAxis
         * @param {number} min
         * @param {number} max
         * @memberof BasicChart
         */
        onSynchronizeScaleRange(scale, min, max) {
            let yScales = this.getYScales();
            for (let yScale of yScales) {
                yScale.minXValue = min;
                yScale.maxXValue = max;
            }
            let axis = this.chart.getAxis(this.primaryXAxisName);
            if (axis != undefined) {
                axis.setAxisRange({ min, max });
            }
        }
        getTimestampInSeries(point, availableSeries) {
            // get the points of the available series
            // get the timestamps series from the signal series
            let timestampSeries;
            timestampSeries = availableSeries.map((singleSeries) => { return singleSeries.serie.timestamps; });
            let nearestPoint = seriesHelper_1.SeriesHelper.findNearestValueFromCollection(point.x, timestampSeries);
            return nearestPoint;
        }
        /**
         * Gets a chart point for the specified timestamp
         *
         * @private
         * @param {number} leadCursorTimeStamp
         * @returns {Point}
         * @memberof BasicChart
         */
        getCursorPoint(timestamp, series, seriesIndex) {
            let cursorPoint = series[seriesIndex].serie.previousPointFromTimestamp(timestamp);
            return { timestamp: cursorPoint.x, x: cursorPoint.x, y: cursorPoint.y };
        }
        /**
         *
         *
         * @protected
         * @param {{ x: number, y: number}} currPos
         * @param {{ x: number, y: number}} clickPos
         * @returns {number}
         * @memberof BasicChart
         */
        absDistanceToCursor(currPos, clickPos) {
            return Math.sqrt(Math.pow(clickPos.x - currPos.x, 2));
        }
        ;
        /**
         * Add drop locations in the chart
         *
         * @param {Array<BaseSeries>} serie
         * @returns
         * @memberof BasicChart
         */
        addSerieDropLocations(serie, chartManagerChart) {
            if (chartManagerChart.childs[0].dropPossible) {
                this.addSerieYAxisDropLocations(serie[0]);
            }
            if (chartManagerChart.dropPossible) {
                this.addSerieChartAreaDropLocations(serie[0]);
            }
        }
        /**
         * Add drop locations to the y axis
         *
         * @private
         * @param {*} data
         * @memberof BasicChart
         */
        addSerieYAxisDropLocations(data) {
            if (data.name)
                this.calculateChartDimensions();
            for (let axisBound of this.axisBounds) {
                let offsetWidth = 4;
                let offsetLeft = 2;
                if (axisBound.axis.orientation == "vertical") {
                    $(this.mainDiv).append('<div id="' + this.axisDropZoneId + axisBound.axis.name + '" style="position:absolute; width: ' + (axisBound.width - offsetWidth) + 'px; height: ' + (axisBound.height) + 'px; left:' + (axisBound.x + offsetLeft) + 'px; top:' + (axisBound.y) + 'px" class="dropLocationArea"></div>');
                }
            }
        }
        /**
         * Add drop locations in the chart area
         *
         * @private
         * @param {BaseSeries} serie
         * @memberof BasicChart
         */
        addSerieChartAreaDropLocations(serie) {
            const maximumYAxis = 2;
            if (serie.name)
                if (this.scales.length < maximumYAxis) {
                    let chartArea = this.chart.getChartArea();
                    $(this.mainDiv).append('<div id="' + this.axisDropZoneId + "_chartArea" + '" style="z-index: 5; position:absolute; width: ' + (chartArea.width) + 'px; height: ' + (chartArea.height) + 'px; left:' + (chartArea.x) + 'px; top:' + (chartArea.y) + 'px" class="dropLocationArea"></div>');
                }
        }
        /**
        * Returns the current drop location type (e.g. assign to scale, add new scale, invalid for drop)
        *
        * @param {*} currentTarget
        * @returns {DropLocationType}
        * @memberof BasicChart
        */
        getDropLocationType(currentTarget) {
            if (currentTarget.id.includes("_axisDropZoneScale")) {
                return ChartBase_1.DropLocationType.assignToScale;
            }
            if (currentTarget.id.includes("_axisDropZone_chartArea") && this.scales.length < 2) {
                return ChartBase_1.DropLocationType.addNewScale;
            }
            return ChartBase_1.DropLocationType.invalid;
        }
        /**
         * Highlight droppable areas if a valid signal is dragged over
         *
         * @param {*} currentTarget
         * @memberof BasicChart
         */
        updateDroppableAreas(currentTarget) {
            if (currentTarget.id.includes("_axisDropZone_chartArea") || currentTarget.id.includes("_refCursor_")) {
                let chartArea = document.getElementById(this.axisDropZoneChartAreaId);
                if (chartArea != undefined) {
                    chartArea.classList.add('draggedOver');
                }
                for (var i = 0; i < this.scales.length; i++) {
                    let axisArea = document.getElementById(this.axisDropZoneId + this.scales[i].id);
                    if (axisArea != undefined) {
                        axisArea.classList.remove('draggedOver');
                    }
                }
            }
            else if (currentTarget.id.includes("_axisDropZoneScale")) {
                for (var i = 0; i < this.scales.length; i++) {
                    if (currentTarget.id.includes(this.scales[i].id)) {
                        let axisArea = document.getElementById(this.axisDropZoneId + this.scales[i].id);
                        if (axisArea != undefined) {
                            axisArea.classList.add('draggedOver');
                        }
                    }
                    else {
                        let axisArea = document.getElementById(this.axisDropZoneId + this.scales[i].id);
                        if (axisArea != undefined) {
                            axisArea.classList.remove('draggedOver');
                        }
                    }
                }
                let chartArea = document.getElementById(this.axisDropZoneChartAreaId);
                if (chartArea != undefined) {
                    chartArea.classList.remove('draggedOver');
                }
            }
        }
        ;
        /**
         * Reset highlighted areas
         *
         * @memberof BasicChart
         */
        resetHighlighting() {
            let chartArea = document.getElementById(this.axisDropZoneChartAreaId);
            if (chartArea != undefined) {
                chartArea.classList.remove('draggedOver');
            }
            for (var i = 0; i < this.scales.length; i++) {
                let axisArea = document.getElementById(this.axisDropZoneId + this.scales[i].id);
                if (axisArea != undefined) {
                    axisArea.classList.remove('draggedOver');
                }
            }
        }
        initializeCursorHandlers() { }
    };
    BasicChart = __decorate([
        mco.role()
    ], BasicChart);
    exports.BasicChart = BasicChart;
});
