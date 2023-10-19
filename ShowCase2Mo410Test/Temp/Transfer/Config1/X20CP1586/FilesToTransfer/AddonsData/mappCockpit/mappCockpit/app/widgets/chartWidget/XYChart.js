var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./ChartBase", "./helpers/chartRangeHelper", "./chartExtensions/chartExtensions", "./cursor/CursorHandler", "../../common/math/mathX"], function (require, exports, ChartBase_1, chartRangeHelper_1, chartExtensions_1, CursorHandler_1, mathX_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XYChart = void 0;
    let XYChart = class XYChart extends ChartBase_1.ChartBase {
        constructor(parentView, name, type, scales) {
            super(parentView, name, scales);
            this.series = [];
            this.primaryXAxisName = "PrimaryDataXAxis";
            this.primaryYAxisName = "Scale_1";
            this.cursorHandler = undefined;
            this.widgetName = name;
            this.parentView = parentView;
            this.type = type;
            this.addWidgetToView(parentView);
        }
        /**
         * Eradicate!
         *
         * @memberof XYChart
         */
        dispose() {
            this.removeWidgetFromView(this.parentView);
            super.dispose();
        }
        /**
         * Add widget to view
         *
         * @private
         * @param {ChartViewChartManager} chartManager
         * @memberof XYChart
         */
        addWidgetToView(parentView) {
            if (parentView) {
                parentView.addWidget(this);
            }
        }
        /**
         * Remove widget from view
         *
         * @private
         * @param {ChartViewChartManager} chartManager
         * @memberof XYChart
         */
        removeWidgetFromView(parentView) {
            if (parentView) {
                parentView.removeWidget(this);
            }
        }
        initialized() {
            super.initialized();
            this.setAvailableSeriesAsDataSource();
            this.initializeCursorHandlers();
            this.attachChartExtensions(this.chartInstance);
        }
        /**
         * Reinitializes the chart
         *
         * @memberof XYChart
         */
        reinitialize() {
            super.reinitialize();
            this.setAvailableSeriesAsDataSource();
            this.cursorHandler = undefined;
            this.initializeCursorHandlers();
            this.attachChartExtensions(this.chartInstance);
        }
        /**
         * Attaches a extension instance
         *
         * @private
         * @param {*} chartInstance
         * @memberof XYChart
         */
        attachChartExtensions(chartInstance) {
            // inject an extension provider
            let xyChartExtensions = new chartExtensions_1.ChartExtensions(this);
            // use an XY optimization algorithm
            xyChartExtensions.chartDataOptimizer.trimSeriesForChartBounds = xyChartExtensions.chartDataOptimizer.trimSeriesForChartBoundsXY;
            // set the chart extensions
            chartInstance.chartExtensions = xyChartExtensions;
        }
        initializeCursorHandlers() {
            if (this.cursorHandler == undefined) {
                this.cursorHandler = new CursorHandler_1.CursorHandler(this.mainDiv, this.chart.getChartArea());
                this.cursorHandler.enableCrosshairCursor = true;
            }
        }
        /**
         * Send data of the series to the chart instance
         *
         * @memberof XYChart
         */
        setAvailableSeriesAsDataSource() {
            let traceDataSeries = new Array();
            for (let i = 0; i < this.series.length; i++) {
                let effectiveSerie = this.chartInstance.chartExtensions ? this.chartInstance.chartExtensions.chartDataOptimizer.attachSeries(this.series[i]) : this.series[i];
                traceDataSeries.push(this.chart.createTraceDataSeries(effectiveSerie, this.primaryYAxisName));
            }
            this.chart.setSeries(traceDataSeries);
            this.repositionCursors();
        }
        /**
         * Calculate zoom on mousewheel action
         *
         * @protected
         * @param {*} args
         * @memberof XYChart
         */
        onChartMouseWheel(sender, args) {
            super.onChartMouseWheel(sender, args);
        }
        /**
         *
         *
         * @protected
         * @param {Point} cursorPoint
         * @returns {number}
         * @memberof XYChart
         */
        getTimestampInSeries(cursorPoint, availableSeries) {
            // find the nearest series point
            //console.log(series.length);
            const nearestSeriesPointInfo = this.findNearestSeriesPointInSeries(cursorPoint, availableSeries);
            // get the nearest series and point index
            const nearestSeriesIndex = nearestSeriesPointInfo.seriesIndex;
            const nearestPointIndex = nearestSeriesPointInfo.pointIndex;
            // get the nearest series points 
            let calculationDataInfo = availableSeries[nearestSeriesIndex].calculationDataInfo;
            if (calculationDataInfo != undefined) {
                let nearestSeriesPoints = calculationDataInfo.inputData[0].getData();
                // get the nearest timestamp of the nearest series
                let nearestTimestamp = nearestSeriesPoints[nearestPointIndex].x;
                return nearestTimestamp;
            }
            console.error("NearestTimestamp not found! No calculationDataInfo!");
            return 0;
        }
        /**
         * Gets a timestamp nearest to thespecified point
         *
         * @protected
         * @param {Point} cursorPoint
         * @returns
         * @memberof XYChart
         */
        getTimestampFromSerie(cursorPoint) {
            let xAxis = this.chart.getAxis(this.primaryXAxisName);
            let yAxis = this.chart.getAxis(this.scales[0].id);
            if (xAxis != undefined && yAxis != undefined) {
                // get the current active series points;
                const effectiveSeriesPoints = this.series[this.draggedSeriesIndex].serie.rawPoints;
                // find the nearest point within this series
                let nearestPointInfo = this.findNearestXYPoint(effectiveSeriesPoints, cursorPoint, xAxis, yAxis);
                // grab one input data series to get access to the timestamps.
                let calculationDataInfo = this.series[this.draggedSeriesIndex].calculationDataInfo;
                if (calculationDataInfo != undefined) {
                    let inputSeriesPoints = calculationDataInfo.inputData[0].getData();
                    // get the nearest timestamp from this series. The input datas x vlues represent the timestamps.
                    let nearestTimestamp = inputSeriesPoints[nearestPointInfo.pointIndex].x;
                    return nearestTimestamp;
                }
            }
            return 0;
        }
        /**
         * Finds the nearest point in all avalibale series.
         *
         * @private
         * @param {Point} cursorPoint
         * @returns {NearestPointInfo}
         * @memberof XYChart
         */
        findNearestSeriesPointInSeries(cursorPoint, series) {
            // get the charts x-Axis
            let xAxis = this.chart.getAxis(this.primaryXAxisName);
            // get the charts y-Axis
            let yAxis = this.chart.getAxis(this.scales[0].id);
            // create an array for collecting the nearest point infos
            let nearestXYSeriesPointInfos = this.findNearestPointsInSeries(series, cursorPoint, xAxis, yAxis);
            // retrieve the collected nearest point distances
            const nearestSeriesPointInfo = this.getNearestPointOfAllSeries(nearestXYSeriesPointInfos);
            return nearestSeriesPointInfo;
        }
        /**
         * Finds a nearest point within a series
         *
         * @private
         * @param {IPoint[]} xyRawPoints
         * @param {Point} chartPoint
         * @param {*} xAxis
         * @param {*} yAxis
         * @returns {NearestPointInfo}
         * @memberof XYChart
         */
        findNearestXYPoint(xyRawPoints, chartPoint, xAxis, yAxis) {
            // get the x-axis range
            const xAxisRange = xAxis.getAxisRange();
            // get the chart x axis pixel range
            const xAxisPixelRange = xAxis.getAxisRangeInPixel();
            // calculate the x - pixel/unit ratio
            const xPixelsPerUnit = (xAxisPixelRange.max - xAxisPixelRange.min) / (xAxisRange.max - xAxisRange.min);
            // get the y-axis range
            const yAxisRange = yAxis.getAxisRange();
            // get the chart y axis pixel range
            const yAxisPixelRange = yAxis.getAxisRangeInPixel();
            // calculate the y - pixel/unit ratio
            const yPixelsPerUnit = (yAxisPixelRange.max - yAxisPixelRange.min) / (yAxisRange.max - yAxisRange.min);
            // create a initial nearest point info.
            const nearestPointInfo = this.getMinSquaredDistancePointInfo(xyRawPoints, chartPoint, xPixelsPerUnit, yPixelsPerUnit);
            return nearestPointInfo;
        }
        /**
         * Gets the minimal squared distance of the specified point within the points
         *
         * @private
         * @param {IPoint[]} xyRawPoints
         * @param {Point} chartPoint
         * @param {number} xPixelsPerUnit
         * @param {number} yPixelsPerUnit
         * @returns
         * @memberof XYChart
         */
        getMinSquaredDistancePointInfo(xyRawPoints, chartPoint, xPixelsPerUnit, yPixelsPerUnit) {
            const nearestPointInfo = { seriesIndex: 0, pointIndex: 0, distanceSquared: Number.MAX_VALUE };
            // find the smallest distance to the series point
            for (let i = 0; i < xyRawPoints.length; i++) {
                // calculate the x distance 
                let dx = (xyRawPoints[i].x - chartPoint.x) * xPixelsPerUnit;
                // calculate the y distance
                let dy = (xyRawPoints[i].y - chartPoint.y) * yPixelsPerUnit;
                // calculate the 2D distance to the point
                let pointToSeriesDistanceSquared = dx * dx + dy * dy;
                // update the nearest point info if the distance is smaller then the already existing one. 
                if (pointToSeriesDistanceSquared < nearestPointInfo.distanceSquared) {
                    nearestPointInfo.distanceSquared = pointToSeriesDistanceSquared;
                    nearestPointInfo.pointIndex = i;
                }
            }
            return nearestPointInfo;
        }
        /**
         * Retrievs the point which is the nearest in all series
         *
         * @private
         * @param {NearestPointInfo[]} nearestXYSeriesPointInfos
         * @returns
         * @memberof XYChart
         */
        getNearestPointOfAllSeries(nearestXYSeriesPointInfos) {
            // retrieve the collected nearest point distances
            const pointToSeriesDistances = nearestXYSeriesPointInfos.map((nearestXYSeriesPointInfo) => { return nearestXYSeriesPointInfo.distanceSquared; });
            // get the smallest one...        
            const smallestPointToSeriesDistance = mathX_1.MathX.min(pointToSeriesDistances);
            // get the index of the smallest one...
            // the nearest distance index directly matches the series index because the order within the arrays is the same.
            const nearestSeriesIndex = nearestXYSeriesPointInfos.findIndex((nearestXYSeriesPointInfo) => { return nearestXYSeriesPointInfo.distanceSquared === smallestPointToSeriesDistance; });
            // update the nearest point infos series index
            const nearestSeriesPointInfo = nearestXYSeriesPointInfos[nearestSeriesIndex];
            nearestSeriesPointInfo.seriesIndex = nearestSeriesIndex;
            return nearestSeriesPointInfo;
        }
        /**
         * Finds the nearest points in the specified series
         *
         * @private
         * @param {Point} cursorPoint
         * @param { IChartAxis | undefined} xAxis
         * @param { IChartAxis | undefined} yAxis
         * @returns
         * @memberof XYChart
         */
        findNearestPointsInSeries(series, cursorPoint, xAxis, yAxis) {
            let nearestXYSeriesPointInfos = [];
            if (xAxis && yAxis) {
                // collect the nearest point infos of all series
                series.forEach((series) => { nearestXYSeriesPointInfos.push(this.findNearestXYPoint(series.serie.rawPoints, cursorPoint, xAxis, yAxis)); });
            }
            return nearestXYSeriesPointInfos;
        }
        /**
         * Gets a chart point for the specified timestamp
         *
         * @private
         * @param {number} timestamp
         * @returns {Point}
         * @memberof ChartBase
         */
        getCursorPoint(timestamp, series, seriesIndex) {
            let seriesTimestampIndex = series[seriesIndex].serie.getTimestampIndex(timestamp);
            let seriesPoint = series[seriesIndex].serie.rawPoints[seriesTimestampIndex];
            return { timestamp: series[seriesIndex].calculationDataInfo.inputData[0].getData()[seriesTimestampIndex].x, x: seriesPoint.x, y: seriesPoint.y };
        }
        /**
         * Get max x value from all series in the chart
         *
         * @returns {(number|undefined)}
         * @memberof XYChart
         */
        getTotalMaxX(traceChartList) {
            let maxX = undefined;
            for (let i = 0; i < this.series.length; i++) {
                if (this.series[i] !== undefined) {
                    if (maxX == undefined || this.series[i].maxX > maxX) {
                        maxX = this.series[i].maxX;
                    }
                }
            }
            return maxX;
        }
        /**
         * Get min x value from all series in the chart
         *
         * @returns {(number|undefined)}
         * @memberof XYChart
         */
        getTotalMinX(traceChartList) {
            let minX = undefined;
            for (let i = 0; i < this.series.length; i++) {
                if (this.series[i] !== undefined) {
                    if (minX == undefined || this.series[i].minX < minX) {
                        minX = this.series[i].minX;
                    }
                }
            }
            return minX;
        }
        /**
         * Add drop locations in the chart
         *
         * @param {Array<BaseSeries>} serie
         * @returns
         * @memberof XYChart
         */
        addSerieDropLocations(serie, chartManagerChart) {
            if (!chartManagerChart.childs[0].dropPossible) {
                return;
            }
            this.addSerieChartDropLocations(serie[0]);
        }
        /**
         * Add drop locations in the chart area
         *
         * @private
         * @param {BaseSeries} serie
         * @memberof YTChart
         */
        addSerieChartDropLocations(serie) {
            if (serie.name) {
                let offsetWidth = 18.4;
                let parentContainer = $(this.mainDiv);
                parentContainer.append('<div id="' + this.axisDropZoneId + "_chartArea" + '" style="position:absolute; width: ' + (parentContainer.width() - offsetWidth) + 'px; height: ' + (parentContainer.height()) + 'px; top: 0px"; class="dropLocationArea"></div>');
            }
        }
        /**
         *
         *
         * @param {*} pageX
         * @param {*} pageY
         * @memberof XYChart
         */
        doPanning(pageX, pageY) {
            super.doPanning(pageX, pageY);
            this.redrawChart();
        }
        /**
         * Returns the current drop location type (e.g. assign to scale, add new scale, invalid for drop)
         *
         * @returns {DropLocationType}
         * @memberof XYChart
         */
        getDropLocationType(currentTarget) {
            return ChartBase_1.DropLocationType.assignToScale;
        }
        /**
         * Highlight droppable areas if a valid signal is dragged over
         *
         * @param {*} currentTarget
         * @memberof BasicChart
         */
        updateDroppableAreas(currentTarget) {
            if (currentTarget.id.includes("_axisDropZone_chartArea")) {
                let chartArea = document.getElementById(this.axisDropZoneChartAreaId);
                if (chartArea != undefined) {
                    chartArea.classList.add('draggedOver');
                }
            }
            else {
                this.resetHighlighting();
            }
        }
        ;
        /**
         * Reset highlighted areas
         *
         * @memberof BasicChart
         */
        resetHighlighting() {
            let chartArea = document.getElementById(this.axisDropZoneId);
            if (chartArea != undefined) {
                chartArea.classList.remove('draggedOver');
            }
        }
        setScaleRange(scale, minXValue, maxXValue, minYValue, maxYValue, orientation, setAxisRange = true) {
            super.setScaleRange(scale, minXValue, maxXValue, minYValue, maxYValue, orientation, setAxisRange);
            if (orientation == 'horizontal' && setAxisRange == true) {
                let axis = this.chart.getAxis(this.primaryXAxisName);
                if (axis != undefined) {
                    axis.setAxisRange({ min: scale.minXValue, max: scale.maxXValue });
                }
            }
        }
        addSeriesToChart(series, scale, updateRangeX) {
            let resetXRange = false;
            if (this.series.length == 0) {
                resetXRange = true;
            }
            super.addSeriesToChart(series, scale, updateRangeX);
            if (resetXRange && updateRangeX == true) {
                new chartRangeHelper_1.ChartRangeHelper().resetXRangesAllChartTypes([this]);
            }
        }
        /**
         * Get used cursor states
         *
         * @protected
         * @returns {Array<ICursorState>}
         * @memberof XYChart
         */
        getUsedCursorStates() {
            return this.cursorsStates.getTimeStates();
        }
    };
    XYChart = __decorate([
        mco.role()
    ], XYChart);
    exports.XYChart = XYChart;
});
