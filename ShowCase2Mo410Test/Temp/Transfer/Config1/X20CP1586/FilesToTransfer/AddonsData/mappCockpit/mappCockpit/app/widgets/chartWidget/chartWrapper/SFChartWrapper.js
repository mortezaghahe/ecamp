var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../core/interfaces/components/ui/chart/chartInterface", "./SFChartAxis", "../helpers/chartLabelFormater", "../../../models/common/point", "../../chartViewWidget/chartViewWidget", "../userInteraction/userInteractionController", "../ChartBase", "../helpers/chartRangeHelper"], function (require, exports, chartInterface_1, SFChartAxis_1, chartLabelFormater_1, point_1, chartViewWidget_1, userInteractionController_1, ChartBase_1, chartRangeHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SFChartWrapper = void 0;
    const spaceChartRightHandSide = 15;
    let SFChartWrapper = class SFChartWrapper {
        constructor(div, scales, nameScaleX) {
            this.prevPanningCoords = {
                'x': undefined,
                'y': undefined
            };
            this._SFChart = this.initializeSFChart(div, scales, nameScaleX);
            this.addTextMeasurementCanvas();
            this.eventAxisRangeChanged = new chartInterface_1.EventAxisRangeChanged();
            this.eventMouseAction = new chartInterface_1.EventMouseAction();
            this.eventMouseWheel = new chartInterface_1.EventMouseWheel();
            this.addEventListenersToChart();
        }
        /**
         * Initialization of Syncfusion chart
         *
         * @private
         * @memberof SFChartWrapper
         */
        initializeSFChart(div, scales, nameScaleX) {
            let chartSettings = {};
            chartSettings = Object.assign(Object.assign(Object.assign(Object.assign({ enableCanvasRendering: true }, this.getSFChartSeriesSettings(scales)), this.getSFChartScaleSettings(scales, nameScaleX)), { zooming: { enable: true, enableMouseWheel: false, type: "XY", enableScrollbar: false, toolbarItems: [""] }, crosshair: { visible: false, type: 'crosshair', line: { color: "black" } }, legend: { visible: false, enableScrollbar: false } }), this.getSFChartEventHandlers());
            $(div).ejChart(chartSettings);
            let SFChartInstance = $(div).ejChart("instance"); // as ej.datavisualization.Chart;
            SFChartInstance.maxLabelWidth = 55;
            return SFChartInstance;
        }
        /**
        *
        *
        * @private
        * @returns {{}}
        * @memberof SFChartWrapper
        */
        getSFChartSeriesSettings(scales) {
            let seriesArray = [];
            for (let scale of scales) {
                for (let series of scale.childs) {
                    let traceDataSeries = this.createTraceDataSeries(series, scale.id);
                    if (traceDataSeries != undefined) {
                        seriesArray.push(traceDataSeries);
                    }
                }
            }
            return { series: seriesArray };
        }
        /**
      *
      *
      * @private
      * @returns {{}}
      * @memberof SFChartWrapper
      */
        getSFChartScaleSettings(scales, nameScaleX) {
            let data = {
                primaryXAxis: {
                    name: nameScaleX,
                    crosshairLabel: { visible: true, trackballTooltipSettings: { border: { width: 10 } } },
                    labelFormat: 'n3',
                    labelPlacement: 'onticks',
                    scrollbarSettings: {
                        visible: false,
                        canResize: false,
                    },
                    labelIntersectAction: "Hide",
                    range: { min: scales[0].minXValue, max: scales[0].maxXValue }
                },
                primaryYAxis: {
                    name: scales[0].id,
                    crosshairLabel: { visible: true },
                    enableAutoIntervalOnZooming: true,
                    labelFormat: "n3",
                    maximumLabelWidth: 60,
                    labelIntersectAction: "Hide",
                    range: { min: scales[0].minYValue, max: scales[0].maxYValue }
                },
            };
            for (let i = 1; i < scales.length; i++) {
                data.axes = [{
                        name: scales[i].id,
                        opposedPosition: true,
                        majorGridLines: { visible: false },
                        range: { min: scales[i].minYValue, max: scales[i].maxYValue },
                        orientation: "vertical"
                    }];
            }
            return data;
        }
        setSeries(series) {
            this._SFChart.option("series", series);
        }
        /**
         * Create property containing data to be drawn
         *
         * @private
         * @param {BaseSeries} serie
         * @param {string} axisID
         * @returns {{}}
         * @memberof SFChartWrapper
         */
        createTraceDataSeries(serie, axisID) {
            if (serie.rawPointsValid == false) {
                // For invalid point data a trace data serie can't be created(ejChart crash if points with undefined x or y values)
                return undefined;
            }
            let properties = {
                name: serie.id,
                type: 'line',
                dataSource: serie.data,
                xName: "x",
                yName: "y",
                fill: serie.color,
                yAxisName: axisID,
                _yAxisName: axisID,
            };
            return properties;
        }
        /**
        *
        *
        * @private
        * @returns {{}}
        * @memberof SFChartWrapper
        */
        getSFChartEventHandlers() {
            return {
                zoomed: (args) => { this.onChartZoomed(args); },
                axesLabelRendering: (args) => { this.onAxesLabelRendering(args); },
            };
        }
        /**
        *
        *
        * @private
        * @memberof SFChartWrapper
        */
        addEventListenersToChart() {
            this._SFChart._on(this._SFChart.element, "mousewheel", (args) => this.onChartMouseWheel(args));
            this._SFChart._on(this._SFChart.element, "mousedown", (args) => this.onChartMouseDown(args));
            this._SFChart._on(this._SFChart.element, "mouseup", (args) => this.onChartMouseUp(args));
            this._SFChart._on(this._SFChart.element, "mousemove", (args) => this.onChartMouseMove(args));
        }
        onChartMouseDown(args) {
            let chartObjectUnderMouse = this.getChartObjectUnderMouse(this._SFChart.mousemoveX, this._SFChart.mousemoveY);
            if (chartObjectUnderMouse.args.axis != undefined) {
                this.mouseDownAxis = chartObjectUnderMouse.args.axis.name;
            }
            let mousePoint = new point_1.Point(args.clientX, args.clientY);
            let mousePointChart = new point_1.Point(this._SFChart.mousemoveX, this._SFChart.mousemoveY);
            let mouseDownArgs = new chartInterface_1.EventMouseArgs(userInteractionController_1.MouseActionType.mouseDown, mousePoint, mousePointChart, args.objectUnderMouse);
            this.eventMouseAction.raise(this, mouseDownArgs);
        }
        onChartMouseUp(args) {
            this.mouseDownAxis = undefined;
            let mousePoint = new point_1.Point(args.clientX, args.clientY);
            let mousePointChart = new point_1.Point(this._SFChart.mousemoveX, this._SFChart.mousemoveY);
            let mouseUpArgs = new chartInterface_1.EventMouseArgs(userInteractionController_1.MouseActionType.mouseUp, mousePoint, mousePointChart, args.objectUnderMouse);
            this.eventMouseAction.raise(this, mouseUpArgs);
        }
        onChartMouseMove(args) {
            let mousePoint = new point_1.Point(args.clientX, args.clientY);
            let mousePointChart = new point_1.Point(this._SFChart.mousemoveX, this._SFChart.mousemoveY);
            let mouseMoveArgs = new chartInterface_1.EventMouseArgs(userInteractionController_1.MouseActionType.mouseMove, mousePoint, mousePointChart, args.objectUnderMouse);
            this.eventMouseAction.raise(this, mouseMoveArgs);
        }
        onChartMouseWheel(args) {
            let mouseWheelArgs = new chartInterface_1.EventMouseWheelArgs(new point_1.Point(this._SFChart.mousemoveX, this._SFChart.mousemoveY), args.objectUnderMouse, args.originalEvent.wheelDelta);
            this.eventMouseWheel.raise(this, mouseWheelArgs);
        }
        /**
      * Sets scale ranges after boxZoom accordingy to zooming position and factor; sets zp and zf to 0/1
      *
      * @protected
      * @param {*} args
      * @memberof SFChartWrapper
      */
        onChartZoomed(args) {
            //let yScales = this.getYScales();
            let chartAxes = args.model._axes;
            let xAxisZoomCanceled = false;
            for (let currentChartAxis of chartAxes) {
                let minVal = currentChartAxis.visibleRange.min;
                let maxVal = currentChartAxis.visibleRange.max;
                //limit the axis range to Precision 11 to prevent syncfusion chart from failing
                if (maxVal.toPrecision(11) - minVal.toPrecision(11) > chartRangeHelper_1.SF_axisResolution) {
                    let axis = this.getAxis(currentChartAxis.name);
                    if (axis != undefined) {
                        axis.setAxisRange({ min: minVal, max: maxVal }, false, false);
                    }
                }
                else {
                    if (currentChartAxis.orientation == "horizontal") {
                        xAxisZoomCanceled = true;
                    }
                }
                currentChartAxis.zoomPosition = 0;
                currentChartAxis.zoomFactor = 1;
            }
            let axis = this.getAxis(chartAxes[0].name);
            if (axis != undefined && xAxisZoomCanceled == false) {
                axis.setAxisRange(axis.getAxisRange(), false, true);
            }
            this._SFChart.zoomed = false;
        }
        redraw() {
            this._SFChart.redraw();
        }
        resize(height, width) {
            this._SFChart.option("size", { height: String(height), width: String(width - spaceChartRightHandSide) });
        }
        /**
       * Sets zoomAxes
       *
       * @param {ZoomDirection} zoomAxes
       * @memberof SFChartWrapper
       */
        setZoomDirection(zoomAxes) {
            this._SFChart.model.zooming.type = chartViewWidget_1.ZoomDirection[zoomAxes];
        }
        /**
        * Enables box zooming
        *
        * @param {boolean} enable
        * @memberof SFChartWrapper
        */
        enableBoxZoom(enable) {
            this._SFChart.model.zooming.enable = enable;
        }
        /**
         * Enables panning
         *
         * @param {boolean} enable
         * @memberof SFChartWrapper
         */
        enablePanning(enable) {
            // Currently not needed to set the panning info in the sfc chart 
            //this._SFChart.panning = enable;
        }
        setPanningAxes(axes) {
            this._SFChart.activePanningAxes = axes;
        }
        /**
         * Adds an invisible Canvas which is used to measure label width
         *
         * @private
         * @memberof SFChartWrapper
         */
        addTextMeasurementCanvas() {
            let id = this._SFChart.chartContainer[0].id;
            let t = $("#" + id);
            t.append('<canvas id="' + id + '_' + "textMaesurementCanvas" + '" style="z-index: -5; position:absolute"> </canvas>');
        }
        /**
       *
       *
       * @private
       * @param {*} args
       * @memberof SFChartWrapper
       */
        onAxesLabelRendering(args) {
            if (this._SFChart != undefined) {
                let id = this._SFChart.chartContainer[0].id;
                let textMaesurementCanvas = document.getElementById(id + '_' + "textMaesurementCanvas");
                if (textMaesurementCanvas) {
                    let context = textMaesurementCanvas.getContext("2d");
                    let number = args.data.label["Value"];
                    let interval = args.data.axis.visibleRange.interval;
                    if (args.data.axis.orientation == "horizontal") {
                        // XAxis(time)
                        args.data.label["Text"] = chartLabelFormater_1.ChartLabelFormater.getXAxisLabelText(number, context, interval);
                    }
                    else {
                        // YAxis
                        args.data.label["Text"] = chartLabelFormater_1.ChartLabelFormater.getYAxisLabelText(number, context, interval);
                    }
                }
            }
        }
        getChartArea() {
            return { x: this._SFChart.canvasX, y: this._SFChart.canvasY, width: this._SFChart.canvasWidth, height: this._SFChart.canvasHeight };
        }
        setChartArea(chartArea) {
            this._SFChart.model.margin.left = chartArea.x - 71;
            this._SFChart.model.margin.top = chartArea.y - 10;
            let numbrOfYAxis = this._SFChart.model._axes.length - 2;
            this._SFChart.model.margin.right = this._SFChart.model.width - (chartArea.x + chartArea.width) - 10 - (numbrOfYAxis * 71);
            this._SFChart.model.margin.bottom = this._SFChart.model.height - ((chartArea.y) + chartArea.height) - 31;
        }
        getAxis(axisID) {
            let axis = this.getChartAxisByName(axisID);
            if (axis != undefined) {
                return new SFChartAxis_1.SFChartAxis(axis, this.eventAxisRangeChanged, this);
            }
            else {
                return undefined;
            }
        }
        getXAxisWidth() {
            return this.getChartArea().width;
        }
        /**
        * Get axis with a given name
        *
        * @param {string} axisName
        * @returns {*}
        * @memberof SFChartWrapper
        */
        getChartAxisByName(axisName) {
            let axes = this._SFChart.model._axes;
            for (let i = 0; i < axes.length; i++) {
                if (axes[i].name == axisName) {
                    return axes[i];
                }
            }
        }
        doPanning(pageX, pageY) {
            if (this.prevPanningCoords.x != undefined) {
                let oDelta;
                oDelta = {
                    'x': this.prevPanningCoords.x - pageX,
                    'y': this.prevPanningCoords.y - pageY
                };
                this.prevPanningCoords = {
                    'x': pageX,
                    'y': pageY
                };
                for (let i = 0; i < this._SFChart.activePanningAxes.length; i++) {
                    let axis = this.getChartAxisByName(this._SFChart.activePanningAxes[i].getAxisID());
                    for (let j = 0; j < this._SFChart.model._axes.length; j++) {
                        if (axis.name == this._SFChart.model._axes[j].name) {
                            axis = this._SFChart.model._axes[j];
                        }
                    }
                    let delta;
                    axis.visibleRange.min = SFChartAxis_1.SFChartAxis.changeInfinityToMaxValue(axis.visibleRange.min);
                    axis.visibleRange.max = SFChartAxis_1.SFChartAxis.changeInfinityToMaxValue(axis.visibleRange.max);
                    if (axis.orientation == "horizontal") {
                        delta = ((Big(axis.visibleRange.max).minus(Big(axis.visibleRange.min))).div(Big(axis.width))).times(Big(oDelta.x));
                        let deltaNmbr = Number(delta.toString());
                        if (axis != undefined) {
                            this.getAxis(axis.name).setAxisRange({ min: axis.visibleRange.min + deltaNmbr, max: axis.visibleRange.max + deltaNmbr });
                        }
                    }
                    else {
                        if (axis != undefined) {
                            delta = ((Big(axis.visibleRange.max).minus(Big(axis.visibleRange.min))).div(Big(axis.height))).times(Big(oDelta.y));
                            let deltaNmbr = Number(delta.toString());
                            deltaNmbr = deltaNmbr * -1;
                            this.getAxis(axis.name).setAxisRange({ min: axis.visibleRange.min + deltaNmbr, max: axis.visibleRange.max + deltaNmbr });
                        }
                    }
                }
            }
            else {
                this.prevPanningCoords = {
                    'x': pageX,
                    'y': pageY
                };
            }
        }
        addYAxis(axisName, axisMin, axisMax, position) {
            let currentAxes = this._SFChart.option("axes");
            let opposedPosition = false;
            if (position == chartInterface_1.AxisPosition.right) {
                opposedPosition = true;
                ;
            }
            currentAxes.push({
                name: axisName,
                opposedPosition: opposedPosition,
                majorGridLines: { visible: false },
                range: { min: axisMin, max: axisMax },
                orientation: "vertical"
            });
            this._SFChart.option("axes", currentAxes);
            if (this._SFChart.model.axes.length == 1) {
                this._SFChart.model.margin.right = 10;
            }
        }
        removeYAxis(axisName) {
            //TODO: Update so it works for more than 2 axis
            let index;
            for (let i = 0; i < this._SFChart.model.axes.length; i++) {
                if (this._SFChart.model.axes[i].name === axisName) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                this._SFChart.model.axes.splice(index, 1);
            }
            else if (this._SFChart.model.axes.length > 0) {
                this._SFChart.model.primaryYAxis = this._SFChart.model.axes[0];
                this._SFChart.model.primaryYAxis.majorGridLines.visible = true;
                this._SFChart.model.primaryYAxis.opposedPosition = false;
                this._SFChart.model.primaryYAxis.backGround = 'transparent';
                this._SFChart.model.axes = [];
            }
            if (this._SFChart.model.axes.length == 0) {
                this._SFChart.model.margin.right = 10;
            }
        }
        setYAxisOffset(numberOfAxes) {
            if (numberOfAxes > 0) {
                this._SFChart.model.margin.right = 10 + (71 * numberOfAxes);
            }
            else {
                this._SFChart.model.margin.right = 10;
            }
        }
        getChartObjectUnderMouse(mouseX, mouseY) {
            let chartObjectUnderMouse = new ChartBase_1.ChartObjectInformation(ChartBase_1.ChartObjectType.emptySpace, {});
            let axisBounds = Array();
            for (let i = 0; i < this._SFChart.model._axes.length; i++) {
                axisBounds.push(this.getAxis(this._SFChart.model._axes[i].name).getAxisBounds());
            }
            for (let i = 0; i < axisBounds.length; i++) {
                if ((mouseX - axisBounds[i].x) < (axisBounds[i].width) && mouseX > axisBounds[i].x) {
                    if ((mouseY - axisBounds[i].y) < (axisBounds[i].height) && mouseY > axisBounds[i].y) {
                        chartObjectUnderMouse = new ChartBase_1.ChartObjectInformation(ChartBase_1.ChartObjectType.axis, { axis: axisBounds[i].axis });
                    }
                }
            }
            return chartObjectUnderMouse;
        }
    };
    SFChartWrapper = __decorate([
        mco.role()
    ], SFChartWrapper);
    exports.SFChartWrapper = SFChartWrapper;
});
