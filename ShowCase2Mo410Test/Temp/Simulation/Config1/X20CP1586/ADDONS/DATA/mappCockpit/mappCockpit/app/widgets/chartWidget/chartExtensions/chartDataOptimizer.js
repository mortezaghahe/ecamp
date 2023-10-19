var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/math/lineReductionAlgorithm/rdp", "../../../common/math/mathX"], function (require, exports, rdp_1, mathX_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartDataOptimizer = exports.ChartPoint = void 0;
    /**
     * Implements and optimizations for chart signal data
     *
     * @class ChartDataOptimizer
     */
    let ChartDataOptimizer = class ChartDataOptimizer {
        /**
         * Creates an instance of class ChartDataOptimizer
         * @param {IChartSeriesProvider} seriesProvider
         * @memberof ChartDataOptimizer
         */
        constructor(seriesProvider) {
            this._seriesProvider = seriesProvider;
            this.rdp = new rdp_1.RDP();
        }
        /**
        * The default method just passes the points originally
        *
        * @param {*} chartSeries
        * @param {*} chartInstance
        * @returns
        * @memberof ChartDataOptimizer
        */
        trimSeriesForChartBounds(chartSeries, chartInstance) {
            let seriesName = chartSeries.name;
            let serie = this._seriesProvider.series.filter((serie) => {
                //console.log(serie.id, seriesName);
                return serie.id === seriesName; //
            });
            let optimizedSeriesPoints = [];
            if (serie.length === 1) {
                let signalPoints = serie[0].rawPoints;
                for (let i = 0; i < signalPoints.length; i++) {
                    optimizedSeriesPoints.push(new ChartPoint(i, true, signalPoints[i].x, signalPoints[i].y));
                }
            }
            return optimizedSeriesPoints;
        }
        /**
        * Trims and optimizes the trace data to fit in the destination range and ui area.
        *
        * @param {*} chartSeries
        * @param {*} chartInstance
        * @returns
        * @memberof ChartDataOptimizer
        */
        trimSeriesForChartBoundsXY(chartSeries, chartInstance) {
            return this.trimSeriesForChartBounds2D(chartSeries, chartInstance);
        }
        trimSeriesForChartBoundsYt(chartSeries, chartInstance) {
            let canvasBounds = {
                x: chartInstance.canvasX,
                y: chartInstance.canvasY,
                width: chartInstance.canvasWidth,
                height: chartInstance.canvasHeight,
            };
            let seriesBounds = {
                xMin: chartSeries.xAxis.visibleRange.min,
                xMax: chartSeries.xAxis.visibleRange.max,
                xDelta: chartSeries.xAxis.visibleRange.delta,
                yMin: chartSeries.yAxis.visibleRange.min,
                yMax: chartSeries.yAxis.visibleRange.max,
                yDelta: chartSeries.yAxis.visibleRange.delta,
            };
            let seriesName = chartSeries.name;
            let series = this.getSeries(seriesName);
            let optimizedSeriesPoints = [];
            if (series) {
                // we use the display points for further line optimization processing
                let signalPoints = this.getDisplayPoints(series);
                // find the lower range index
                let iVisibleMin = this.findNearestIndex(signalPoints, chartSeries.xAxis.visibleRange.min, 0, signalPoints.length - 1);
                // adjust to the first min point outside the min axis range 
                while (signalPoints[iVisibleMin].x >= chartSeries.xAxis.visibleRange.min && iVisibleMin > 0) {
                    iVisibleMin--;
                }
                // find the upper range index
                let iVisibleMax = this.findNearestIndex(signalPoints, chartSeries.xAxis.visibleRange.max, 0, signalPoints.length - 1);
                // adjust to the first max point outside the max axis range 
                while (signalPoints[iVisibleMax].x <= chartSeries.xAxis.visibleRange.max && iVisibleMax < signalPoints.length - 1) {
                    iVisibleMax++;
                }
                // get points reduced and optimized for the visible bounds
                optimizedSeriesPoints = this.retriveReducedPointsWithinBounds(signalPoints, canvasBounds, seriesBounds, iVisibleMin, iVisibleMax);
            }
            return optimizedSeriesPoints;
        }
        /**
         * Creates point instances to be used for displaying based on the rawpoints.
         *
         * @private
         * @param {ChartViewSerie} series
         * @memberof ChartDataOptimizer
         */
        getDisplayPoints(series) {
            // get the underlying series
            let effectiveSeries = series.serie;
            // create the display points if not yet defined
            if (!effectiveSeries.displayPoints) {
                effectiveSeries.displayPoints = effectiveSeries.rawPoints.map((rawPoint, index) => { return new ChartPoint(index, true, rawPoint.x, rawPoint.y); });
            }
            return effectiveSeries.displayPoints ? effectiveSeries.displayPoints : [];
        }
        /**
         * Retrieves the requested series
         *
         * @private
         * @param {*} seriesName
         * @returns
         * @memberof ChartDataOptimizer
         */
        getSeries(seriesName) {
            let seriesByName = this._seriesProvider.series.filter((serie) => {
                return serie.id === seriesName;
            });
            return seriesByName.length == 1 ? seriesByName[0] : null;
        }
        /**
       * Finds the item nearest to the specified value
       *
       * @memberof ChartDataOptimizer
       */
        findNearestIndex(array, value, iFirst, iLast) {
            // calculate the middle index
            const iMiddle = Math.floor((iFirst + iLast) / 2);
            // if the value matches, we have found the correct index
            if (value == array[iMiddle].x)
                return iMiddle;
            // if the the last possible index is reached, the index with the nearest index is selected
            if (iLast - 1 === iFirst)
                return Math.abs(array[iFirst].x - value) > Math.abs(array[iLast].x - value) ? iLast : iFirst;
            // if the value is greater continue on the higher remaining section
            if (value > array[iMiddle].x)
                return this.findNearestIndex(array, value, iMiddle, iLast);
            // if the value is greater continue on the lower remaining section
            if (value < array[iMiddle].x)
                return this.findNearestIndex(array, value, iFirst, iMiddle);
        }
        /**
     * Optimizes the pointts with respect to the visible area
     *
     * @param {*} points
     * @param {*} canvasBounds
     * @param {*} seriesBounds
     * @returns {*}
     * @memberof ChartDataOptimizer
     */
        retriveReducedPointsWithinBounds(points, canvasBounds, seriesBounds, iMin, iMax) {
            let optimizedPoints = [];
            let visiblePointsCount = iMax - iMin;
            // If the points count is under the area pixel width there is no need to optimize.....
            if ((visiblePointsCount) < canvasBounds.width) {
                // ... so we just convert the visble points to chart points
                optimizedPoints = this.getChartPoints(points, iMin, iMax);
            }
            else {
                // ... otherwise we optimze the points to a reduced but still usefull amount.
                optimizedPoints = this.getReducedChartPointsWithinBounds(canvasBounds, seriesBounds, points, iMin, iMax);
            }
            return optimizedPoints;
        }
        /**
      *  Gets the chart points for the specefied range
      *
      * @private
      * @param {*} canvasBounds
      * @param {*} seriesBounds
      * @param {*} points
      * @param {*} iMin
      * @param {*} iMax
      * @param {any[]} pixelPoints
      * @returns
      * @memberof ChartDataOptimizer
      */
        getChartPoints(points, iMin, iMax) {
            return points.filter((point, i) => { return i >= iMin && i <= iMax; });
        }
        /**
         * Reduces the points to a useful count with respect to the visible area
         *
         * @private
         * @param {*} canvasBounds
         * @param {*} seriesBounds
         * @param {*} points
         * @param {*} iMin
         * @param {*} iMax
         * @param {any[]} pixelPoints
         * @returns
         * @memberof ChartDataOptimizer
         */
        getReducedChartPointsWithinBounds(canvasBounds, seriesBounds, points, iMin, iMax) {
            // create the pixel point array
            // the width needs to be converted to integer because in the case of active browser zoom the width is passed as float value !
            let canvasWidth = Math.ceil(canvasBounds.width);
            var pixelPoints = new Array(canvasWidth);
            // create a set for receiving the visible points to avoid duplicates
            let optimizedPoints = new Set();
            let xScale = canvasBounds.width / seriesBounds.xDelta;
            if (points.length > 1) {
                for (let iVisiblePoint = iMin; iVisiblePoint <= iMax; iVisiblePoint++) {
                    this.reducePixelPoints(points[iVisiblePoint], seriesBounds, xScale, iVisiblePoint, pixelPoints);
                }
                for (let i = 0; i < pixelPoints.length; i++) {
                    const pixelPoint = pixelPoints[i];
                    if (pixelPoint !== undefined) {
                        this.addPixelSubPoints(pixelPoint, i, optimizedPoints);
                    }
                }
            }
            return Array.from(optimizedPoints);
        }
        /**
       * Adds additional points for marking min and max values within a segment
       *
       * @private
       * @param {*} pixelPoint
       * @param {number} i
       * @param {ChartPoint[]} optimizedPoints
       * @memberof ChartDataOptimizer
       */
        addPixelSubPoints(pixelPoint, i, optimizedPoints) {
            // add the first pixel point
            this.addOptimizedPoint(optimizedPoints, i, pixelPoint.firstPoint);
            // add min max points
            if (pixelPoint.yMinPoint.index <= pixelPoint.yMaxPoint.index) {
                this.addOptimizedPoint(optimizedPoints, i, pixelPoint.yMinPoint);
                this.addOptimizedPoint(optimizedPoints, i, pixelPoint.yMaxPoint);
            }
            else {
                this.addOptimizedPoint(optimizedPoints, i, pixelPoint.yMaxPoint);
                this.addOptimizedPoint(optimizedPoints, i, pixelPoint.yMinPoint);
            }
            // add the last point
            this.addOptimizedPoint(optimizedPoints, i, pixelPoint.lastPoint);
        }
        /**
         * Creates and adds a chart point
         *
         * @private
         * @param {ChartPoint[]} optimizedPoints
         * @param {number} i
         * @param {*} pixelPoint
         * @memberof ChartDataOptimizer
         */
        addOptimizedPoint(optimizedPoints, i, pixelPoint) {
            optimizedPoints.add(pixelPoint);
        }
        /**
         * Finds the maximum within an array
         *
         * @param {*} values
         * @returns
         * @memberof ChartDataOptimizer
         */
        findMaximum(values) {
            let max = values[0];
            for (let i = 0; i < values.length; i++) {
                const value = values[i];
                max = value > max ? value : max;
            }
            return max;
        }
        /**
       * Reduces the pixel points respecting the point density on pixels
       *
       * @private
       * @param {*} visiblePoint
       * @param {*} seriesBounds
       * @param {number} xScale
       * @param {*} iVisiblePoint
       * @param {any[]} pixelPoints
       * @memberof ChartDataOptimizer
       */
        reducePixelPoints(visiblePoint, seriesBounds, xScale, iVisiblePoint, pixelPoints) {
            // calculate the pixel offset to axis min
            let xOffset = (visiblePoint.x - seriesBounds.xMin) * (xScale);
            // get the pixel index
            let iPixel = Math.round(xOffset);
            visiblePoint.index = iVisiblePoint;
            this.addPointsForXPixel(pixelPoints, visiblePoint, iPixel);
        }
        /**
         * Adds a point for a corrsponding pixel location
         *
         * @private
         * @param {any[]} pixelPoints
         * @param {number} iPixel
         * @param {*} signalPoint
         * @memberof ChartDataOptimizer
         */
        addPointsForXPixel(pixelPoints, signalPoint, iPixel) {
            if (!pixelPoints[iPixel]) {
                // define the first point for this pixel
                pixelPoints[iPixel] = {};
                // initialize the last point as default
                pixelPoints[iPixel].firstPoint = signalPoint;
                pixelPoints[iPixel].lastPoint = signalPoint;
                pixelPoints[iPixel].yMaxPoint = signalPoint;
                pixelPoints[iPixel].yMinPoint = signalPoint;
            }
            else {
                // update the last point for following values on the same pixel
                pixelPoints[iPixel].lastPoint = signalPoint;
                // update min,max
                if (signalPoint.y > pixelPoints[iPixel].yMaxPoint.y) {
                    // update the point containing yMax
                    pixelPoints[iPixel].yMaxPoint = signalPoint;
                }
                if (signalPoint.y < pixelPoints[iPixel].yMinPoint.y) {
                    // update the point containing yMin
                    pixelPoints[iPixel].yMinPoint = signalPoint;
                }
            }
        }
        /**
         * Trims or optimizes series point to be display within a 2D chart
         *
         * @param {*} chartSeries
         * @param {*} chartInstance
         * @returns
         * @memberof ChartDataOptimizer
         */
        trimSeriesForChartBounds2D(chartSeries, chartInstance) {
            // the chart points to be calculated
            let chartPoints = [];
            // get the canvas bounds in pixel
            let canvasBounds = this.getChartAreaBoundsInPixel(chartInstance);
            // get the chart area bounds
            let chartAreaBounds = this.getChartAreaBounds(chartSeries);
            // get the series with a matching name
            let dataSeries = this.getSeriesData(chartSeries);
            if (dataSeries) {
                // get the original unmodified points 
                let rawPoints = dataSeries.rawPoints;
                // get the initially simplified data
                let viewPointsData = dataSeries.data;
                // retrieve the points to be displayed       
                let viewSeriesPoints = viewPointsData;
                console.time("calculate reduced chart points");
                // retrieve the visible segment points
                chartPoints = this.retrieveVisibleLineSegmentPoints(viewSeriesPoints, chartAreaBounds);
                // get raw points count covered by the visible segments
                let rawVisiblePointsCount = chartPoints.length > 0 ? chartPoints[chartPoints.length - 1].index - chartPoints[0].index + 1 : 0;
                if (rawVisiblePointsCount > 0) {
                    // calculate the current chart units/pixel
                    const kXUnitsPerPixel = chartAreaBounds.xDelta / canvasBounds.width;
                    const kYUnitsPerPixel = chartAreaBounds.yDelta / canvasBounds.height;
                    // if the current coordinate to pixel ratio falls below the initial ration we need to recalculate the simplified points for the current given view port
                    // to get the best matching approximated simplified line. 
                    if (this.isDetailZoomLevel(viewPointsData, kXUnitsPerPixel, kYUnitsPerPixel)) {
                        // retrieve the points with the precision for requested zoom level 
                        chartPoints = this.retrieveDetailedChartPoints(chartPoints, rawPoints, chartAreaBounds, kXUnitsPerPixel, kYUnitsPerPixel);
                    }
                }
                console.timeEnd("calculate reduced chart points");
                console.log("optimized points: %o", chartPoints.length);
            }
            const optimizedPoints = chartPoints.map((point, i) => { return new ChartPoint(point.index, point.visible, point.x, point.y); });
            return optimizedPoints;
        }
        /**
         * Gets
         *
         * @private
         * @param {*} chartSeries
         * @returns
         * @memberof ChartDataOptimizer
         */
        getSeriesData(chartSeries) {
            let chartViewSeries = this._seriesProvider.series.find((series) => { return series.id === chartSeries.name; });
            let dataSeries = chartViewSeries ? chartViewSeries.serie : undefined;
            return dataSeries;
        }
        /**
         * Retrieves the data points necessary to satisfy the specified chart bounds and zoom ratio.
         *
         * @private
         * @param {SeriesPoint[]} chartPoints
         * @param {IPoint[]} rawPoints
         * @param {{ xMin: any; xMax: any; xDelta: any; yMin: any; yMax: any; yDelta: any; }} chartAreaBounds
         * @param {number} currentChartPixelRatioX
         * @param {number} currentChartPixelRationY
         * @returns
         * @memberof ChartDataOptimizer
         */
        retrieveDetailedChartPoints(chartPoints, rawPoints, chartAreaBounds, currentChartPixelRatioX, currentChartPixelRationY) {
            const lastRawIndex = chartPoints[chartPoints.length - 1].index;
            const firstVisibleRawPointIndex = chartPoints[0].index;
            const lastVisibleRawPointIndex = lastRawIndex < rawPoints.length ? lastRawIndex + 1 : rawPoints.length;
            // retrieve the raw points covered by the visible segments
            let rawVisiblePoints = rawPoints.slice(firstVisibleRawPointIndex, lastVisibleRawPointIndex);
            // update point indices
            this.updateVisibilityIndices(rawVisiblePoints);
            // retrieve the visible line segment points
            chartPoints = this.retrieveVisibleLineSegmentPoints(rawVisiblePoints, chartAreaBounds);
            // if the numbert of chart points is still too high, we need to further simplify the data points
            if (chartPoints.length > 1000) {
                // simplify the remaining visible points according the specified precision and ratio
                chartPoints = this.rdp.simplify(rawVisiblePoints, 0.25, currentChartPixelRatioX, currentChartPixelRationY, false);
                // update point indices
                this.updateVisibilityIndices(chartPoints);
                // retrieve the visible segment points
                chartPoints = this.retrieveVisibleLineSegmentPoints(chartPoints, chartAreaBounds);
            }
            return chartPoints;
        }
        /**
         *
         *
         * @private
         * @param {*} viewPointsData
         * @param {number} currentChartPixelRatioX
         * @param {number} currentChartPixelRationY
         * @returns
         * @memberof ChartDataOptimizer
         */
        isDetailZoomLevel(viewPointsData, currentChartPixelRatioX, currentChartPixelRationY) {
            return currentChartPixelRatioX < viewPointsData.pixelRatioX || currentChartPixelRationY < viewPointsData.pixelRatioY;
        }
        /**
         * Updates the indices of the points
         *
         * @private
         * @param {IPoint[]} reducedVisiblePoints
         * @memberof ChartDataOptimizer
         */
        updateVisibilityIndices(points) {
            let seriesPoints = points;
            seriesPoints.forEach((point, index) => { point.index = index; });
        }
        /**
         * Gets the chart area bounds in pixel
         *
         * @private
         * @param {*} chartInstance
         * @returns {{x:number,y:number,width:number,height:number}}
         * @memberof ChartDataOptimizer
         */
        getChartAreaBoundsInPixel(chartInstance) {
            return {
                x: chartInstance.canvasX,
                y: chartInstance.canvasY,
                width: chartInstance.canvasWidth,
                height: chartInstance.canvasHeight,
            };
        }
        /**
         * Gets the visible chart area bounds in coordinate units
         *
         * @private
         * @param {*} chartSeries
         * @returns
         * @memberof ChartDataOptimizer
         */
        getChartAreaBounds(chartSeries) {
            let chartAreaBounds = {
                xMin: chartSeries.xAxis.range.min,
                xMax: chartSeries.xAxis.range.max,
                xDelta: chartSeries.xAxis.range.delta,
                yMin: chartSeries.yAxis.range.min,
                yMax: chartSeries.yAxis.range.max,
                yDelta: chartSeries.yAxis.range.delta,
            };
            return chartAreaBounds;
        }
        /**
         * Determines if a line intersects a rectangle
         *
         * @param {IPoint} p1
         * @param {IPoint} p2
         * @param {Bounds} bounds
         * @returns
         * @memberof ChartDataOptimizer
         *
         * Review Lukas Obersamer:
         * The cyclomatic complexity of this function is too high, but that does not reflext the complexity for humans to understand it.
         * The complexity of understing this method is in fact super simple in particular due to professional commenting. Therefore the method shall remain in this form.
         */
        lineIntersectsRectangle(p1, p2, bounds) {
            // exclude non intersecting lines
            if ((p1.x < bounds.xMin && p2.x < bounds.xMin) || (p1.y < bounds.yMin && p2.y < bounds.yMin) || (p1.x > bounds.xMax && p2.x > bounds.xMax) || (p1.y > bounds.yMax && p2.y > bounds.yMax))
                return false;
            if (this.rectangleContainsPoint(p1, bounds) || this.rectangleContainsPoint(p2, bounds)) {
                return true;
            }
            try {
                // calculate dy/dx
                let k = (p2.y - p1.y) / (p2.x - p1.x);
                // check if line intersects left border
                let yIntersect = p1.y + k * (bounds.xMin - p1.x);
                if (yIntersect >= bounds.yMin && yIntersect <= bounds.yMax)
                    return true;
                // check if line intersects right border
                yIntersect = p1.y + k * (bounds.xMax - p1.x);
                if (yIntersect >= bounds.yMin && yIntersect <= bounds.yMax)
                    return true;
                // check if line intersects bottom border
                let xIntersec = p1.x + (bounds.yMin - p1.y) / k;
                if (xIntersec >= bounds.xMin && xIntersec <= bounds.xMax)
                    return true;
                // check if line intersects top border
                xIntersec = p1.x + (bounds.yMax - p1.y) / k;
                if (xIntersec >= bounds.xMin && xIntersec <= bounds.xMax)
                    return true;
            }
            catch (error) {
                console.error("lineIntersectsRectangle");
            }
            return false;
        }
        /**
         * Retrieves the line segment points for segments intersecting the specified bounds. The methods adds, if necessary invisible line segments by adding invisible helkper points.
         *
         * @private
         * @param {IPoint[]} points
         * @param {Bounds} bounds
         * @returns
         * @memberof ChartDataOptimizer
         */
        retrieveVisibleLineSegmentPoints(points, bounds) {
            if (points.length < 2)
                return points;
            // the available point as series points
            let seriesPoints = points;
            // create the result segment points array
            let lineSegmentPoints = [];
            // holds the last added end point.
            let lastEndPoint = null;
            for (let i = 1; i < seriesPoints.length; i++) {
                const pStart = seriesPoints[i - 1];
                const pEnd = seriesPoints[i];
                // check if the line intersects the specified bounds
                if (this.lineIntersectsRectangle(pStart, pEnd, bounds)) {
                    if (!lastEndPoint) {
                        // at the very beginning we need to add the first start point
                        pStart.visible = true;
                        lineSegmentPoints.push(pStart);
                    }
                    else {
                        // now we continue the line ....
                        // if the line is interrupted ( start and previous end index is not the same), we need to add an invisible helper point to create an invisible segment.
                        // additionally we need to add the start point of the next visible line segment.
                        if (pStart.index != lastEndPoint.index) {
                            // create an invisible helper point
                            let invisibleSegmenStartPoint = Object.create(lastEndPoint);
                            invisibleSegmenStartPoint.visible = false;
                            // add the invisible helper point
                            lineSegmentPoints.push(invisibleSegmenStartPoint);
                            // add the start point of next visible line segment. This is where the line segment is to be continued.
                            pStart.visible = true;
                            lineSegmentPoints.push(pStart);
                        }
                    }
                    // just add the next visible end point
                    pEnd.visible = true;
                    lineSegmentPoints.push(pEnd);
                    lastEndPoint = pEnd;
                }
            }
            return lineSegmentPoints;
        }
        rectangleContainsPoint(point, bounds) {
            const xMinDiff = point.x - bounds.xMin;
            const xMaxDiff = bounds.xMax - point.x;
            const yMinDiff = point.y - bounds.yMin;
            const yMaxDiff = bounds.yMax - point.y;
            const xWithinRange = xMinDiff >= 0 && xMaxDiff >= 0;
            const yWithinRange = yMinDiff >= 0 && yMaxDiff >= 0;
            // const xWithinRange = point.x >= bounds.xMin && point.x <= bounds.xMax;
            // const yWithinRange = point.y >= bounds.yMin && point.y <= bounds.yMax;
            let rectanglesContainsPoint = xWithinRange && yWithinRange;
            return rectanglesContainsPoint;
        }
        /**
         * Attaches a series to the chart optimizer. The method in fact just calculates and updates the series bounds.
         *
         * @param {BaseSeries} serie
         * @returns
         * @memberof ChartDataOptimizer
         */
        attachSeries(serie) {
            if (serie.rawPoints.length > 1) {
                let signalPoints = serie.rawPoints;
                let xValues = signalPoints.map((point) => { return point.x; });
                let yValues = signalPoints.map((point) => { return point.y; });
                let xMin = mathX_1.MathX.min(xValues);
                let xMax = mathX_1.MathX.max(xValues);
                let yMin = mathX_1.MathX.min(yValues);
                let yMax = mathX_1.MathX.max(yValues);
                // update the series bounds
                serie.bounds = { xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax, width: (xMax - xMin), height: (yMax - yMin) };
                this.clearSeriesDisplayPoints(serie);
            }
            return serie;
        }
        /**
         * Clears eventually existing display points.
         *
         * @private
         * @param {BaseSeries} serie
         * @memberof ChartDataOptimizer
         */
        clearSeriesDisplayPoints(serie) {
            serie.displayPoints = null;
        }
    };
    ChartDataOptimizer = __decorate([
        mco.role()
    ], ChartDataOptimizer);
    exports.ChartDataOptimizer = ChartDataOptimizer;
    /**
     * Implements the chart point class
     *
     * @class ChartPoint
     */
    let ChartPoint = class ChartPoint {
        constructor(index, visible, x, y) {
            this.index = index;
            this.x = x;
            this.y = y;
            this.xValue = x;
            this.YValues = [y];
            this.visible = visible;
        }
    };
    ChartPoint = __decorate([
        mco.role()
    ], ChartPoint);
    exports.ChartPoint = ChartPoint;
});
