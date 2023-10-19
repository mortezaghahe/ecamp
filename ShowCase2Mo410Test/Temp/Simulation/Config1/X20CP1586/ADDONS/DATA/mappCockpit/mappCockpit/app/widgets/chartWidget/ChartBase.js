var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../core/interfaces/components/ui/chart/chartInterface", "../common/widgetBase", "./helpers/chartRangeHelper", "../../framework/events", "./userInteraction/userInteractionController", "../../models/common/point", "../common/states/cursorStates", "./cursor/CursorPositionInfo", "./chartViewSerie", "../../common/seriesHelper", "./chartWrapper/SFChartWrapper", "../../models/chartManagerDataModel/eventScaleDataChangedArgs", "./componentDefaultDefinition", "../../common/componentBase/componentBase", "../../common/componentFactory/componentFactory", "../common/states/cursorType", "./chartWrapper/SFChartAxis"], function (require, exports, chartInterface_1, widgetBase_1, chartRangeHelper_1, events_1, userInteractionController_1, point_1, cursorStates_1, CursorPositionInfo_1, chartViewSerie_1, seriesHelper_1, SFChartWrapper_1, eventScaleDataChangedArgs_1, componentDefaultDefinition_1, componentBase_1, componentFactory_1, cursorType_1, SFChartAxis_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartObjectInformation = exports.DropLocationType = exports.ChartObjectType = exports.EventUserChartInteractionArgs = exports.EventUserChartInteraction = exports.EventSeriesAdded = exports.EventRedrawAllChartsArgs = exports.EventRedrawAllCharts = exports.ChartBase = void 0;
    var ChartObjectType;
    (function (ChartObjectType) {
        ChartObjectType[ChartObjectType["cursor"] = 0] = "cursor";
        ChartObjectType[ChartObjectType["series"] = 1] = "series";
        ChartObjectType[ChartObjectType["axis"] = 2] = "axis";
        ChartObjectType[ChartObjectType["chartSpace"] = 3] = "chartSpace";
        ChartObjectType[ChartObjectType["emptySpace"] = 4] = "emptySpace";
        ChartObjectType[ChartObjectType["invalid"] = 5] = "invalid";
    })(ChartObjectType || (ChartObjectType = {}));
    exports.ChartObjectType = ChartObjectType;
    var DropLocationType;
    (function (DropLocationType) {
        DropLocationType[DropLocationType["addNewScale"] = 0] = "addNewScale";
        DropLocationType[DropLocationType["assignToScale"] = 1] = "assignToScale";
        DropLocationType[DropLocationType["invalid"] = 2] = "invalid";
    })(DropLocationType || (DropLocationType = {}));
    exports.DropLocationType = DropLocationType;
    let ChartObjectInformation = class ChartObjectInformation {
        constructor(chartObjectType, args) {
            this.chartObjectType = chartObjectType;
            this.args = args;
        }
    };
    ChartObjectInformation = __decorate([
        mco.role()
    ], ChartObjectInformation);
    exports.ChartObjectInformation = ChartObjectInformation;
    let EventUserChartInteraction = class EventUserChartInteraction extends events_1.TypedEvent {
    };
    EventUserChartInteraction = __decorate([
        mco.role()
    ], EventUserChartInteraction);
    exports.EventUserChartInteraction = EventUserChartInteraction;
    ;
    let EventUserChartInteractionArgs = class EventUserChartInteractionArgs {
        constructor(chartInteractionType, eventArguments) {
            this.chartInteractionType = chartInteractionType;
            this.eventArguments = eventArguments;
        }
    };
    EventUserChartInteractionArgs = __decorate([
        mco.role()
    ], EventUserChartInteractionArgs);
    exports.EventUserChartInteractionArgs = EventUserChartInteractionArgs;
    let EventRedrawAllCharts = class EventRedrawAllCharts extends events_1.TypedEvent {
    };
    EventRedrawAllCharts = __decorate([
        mco.role()
    ], EventRedrawAllCharts);
    exports.EventRedrawAllCharts = EventRedrawAllCharts;
    ;
    let EventRedrawAllChartsArgs = class EventRedrawAllChartsArgs {
        constructor(chartType) {
            this.chartType = chartType;
        }
    };
    EventRedrawAllChartsArgs = __decorate([
        mco.role()
    ], EventRedrawAllChartsArgs);
    exports.EventRedrawAllChartsArgs = EventRedrawAllChartsArgs;
    let EventSeriesAdded = class EventSeriesAdded extends events_1.TypedEvent {
    };
    EventSeriesAdded = __decorate([
        mco.role()
    ], EventSeriesAdded);
    exports.EventSeriesAdded = EventSeriesAdded;
    ;
    let ChartBase = class ChartBase extends widgetBase_1.WidgetBase {
        /**
         * Returns the id for the axis dropZone
         *
         * @readonly
         * @private
         * @type {string}
         * @memberof ChartBase
         */
        get axisDropZoneId() {
            return this.mainDivId + '_axisDropZone';
        }
        /**
         * Returns the id for the axis chart area dropZone
         *
         * @readonly
         * @protected
         * @type {string}
         * @memberof ChartBase
         */
        get axisDropZoneChartAreaId() {
            return this.axisDropZoneId + '_chartArea';
        }
        constructor(parentView, name, scale) {
            super();
            this.widgetName = "";
            this.textMeasurementCanvasId = "textMeasurementCanvas";
            this.series = [];
            this.hoveredSeries = [];
            this.scales = [];
            //private keyEventsPlaced = false;
            // holds the current cursor states values. We initialize the member for default. The effective initialization takes place when the external shared instance
            // of the cursor states is created and reflected through the curorStates setter!
            this._cursorStates = new cursorStates_1.CursorStates();
            this.cursorHoverDistance = 8;
            this.draggedSeriesIndex = 0;
            this.axisBounds = [];
            this.xAxisWidth = 0;
            this.yAxisAlignmentOffset = 0;
            this.flaggedForResize = false;
            if (this.component == undefined) {
                // TODO: component should be set by component factory when charts can be created with component factory
                this.component = new componentBase_1.ComponentBase(componentFactory_1.ComponentFactory.getInstance(), this);
                this.initializeComponent();
                this.component.addDefaultComponentSettings();
            }
            this.component.type = "ChartBase"; // TODO: Remove when chartbase(xychart, fftchart, ytchart) will be created with the component factory
            this.component.id = name;
            this.parentView = parentView;
            this.widgetName = name;
            this.scales = scale;
            this.eventUserChartInteraction = new EventUserChartInteraction();
            this.eventRedrawAllCharts = new EventRedrawAllCharts();
            this.eventSeriesAdded = new EventSeriesAdded();
        }
        /**
         * Destroy object
         *
         * @memberof ChartBase
         */
        dispose() {
            // TODO: Dispose of CursorStates must be done globaly
            this.cursorsStates.dispose();
            let chartObj = $(this.mainDiv).data("ejChart");
            if (chartObj != undefined) {
                chartObj.destroy();
            }
            else {
                // TODO: dispose of this widget is called from splitter and also from the chartViewChartManager
                //console.warn("Dispose of chartObj(== undefined) not possible!");
            }
            super.dispose();
        }
        initialized() {
            super.initialized();
            for (let scale of this.scales) {
                this.addSeriesToChart(scale.childs, scale, false);
            }
            let newChart = new SFChartWrapper_1.SFChartWrapper(this.mainDiv, this.scales, this.primaryXAxisName);
            newChart.eventAxisRangeChanged.attach((sender, args) => this.onAxisRangeChanged(sender, args));
            newChart.eventMouseAction.attach((sender, args) => this.onMouseAction(sender, args));
            newChart.eventMouseWheel.attach((sender, args) => this.onChartMouseWheel(sender, args));
            this.chartInstance = newChart._SFChart;
            this.chart = newChart;
            this.setBoxZoom(false);
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        /**
         * Gets the cursors states
         *
         * @protected
         * @type {TCursorStates}
         * @memberof ChartBase
         */
        get cursorsStates() {
            return this._cursorStates;
        }
        /**
         * Sets the cursors states. The method is called automatically whenever a cursor state has been changed externally.
         *
         * @protected
         * @memberof ChartBase
         */
        set cursorsStates(cursorStates) {
            // update the backup field
            this._cursorStates = cursorStates;
            this.updateUICursors(cursorStates);
        }
        /**
         * Updates the cursor states.
         *
         * @protected
         * @param {CursorStates} cursorStates
         * @memberof ChartBase
         */
        updateCursorStates(cursorStates) {
            // BINDINGSOURCE: dispatches the method call to bound targets
        }
        onAxisRangeChanged(sender, args) {
            for (let i = 0; i < args.axisIDs.length; i++) {
                let scale;
                //Workaround until X-Axis handling is implemented correct
                if (args.axisIDs[i] != this.primaryXAxisName) {
                    scale = this.getScaleByScaleId(args.axisIDs[i]);
                }
                else {
                    scale = this.scales[0];
                }
                if (scale != undefined) {
                    let axis = sender;
                    let range = axis.getAxisRange();
                    if (axis.getAxisOrientation() == chartInterface_1.AxisOrientation.horizontal) {
                        this.setScaleRange(scale, range.min, range.max, scale.minYValue, scale.maxYValue, "", false);
                        if (args.syncAxis == true) {
                            this.eventRedrawAllCharts.raise(this, new EventRedrawAllChartsArgs(this.type));
                        }
                    }
                    else {
                        this.setScaleRange(scale, scale.minXValue, scale.maxXValue, range.min, range.max, "", false);
                    }
                }
            }
            if (args.forceRedraw == true) {
                this.redrawChart();
            }
        }
        /**
         *
         *
         * @param {number} mouseX
         * @param {number} mouseY
         * @returns {ChartObjectInformation}
         * @memberof ChartBase
         */
        getChartObjectUnderMouse(mouseX, mouseY) {
            this.calculateChartDimensions();
            if (this.mouseIsInChartBounds(mouseX, mouseY)) {
                let index = this.cursorsStates.getHoveredCursorIndex();
                if (index !== -1) {
                    //TODO: might be better to use cursor instance instead of index
                    return new ChartObjectInformation(ChartObjectType.cursor, { cursorIndex: index });
                }
                return new ChartObjectInformation(ChartObjectType.chartSpace, {});
            }
            for (let i = 0; i < this.axisBounds.length; i++) {
                if ((mouseX - this.axisBounds[i].x) < (this.axisBounds[i].width) && mouseX > this.axisBounds[i].x) {
                    if ((mouseY - this.axisBounds[i].y) < (this.axisBounds[i].height) && mouseY > this.axisBounds[i].y) {
                        let axis = this.chart.getAxis(this.axisBounds[i].axis.name);
                        return new ChartObjectInformation(ChartObjectType.axis, { axis: axis });
                    }
                }
            }
            return new ChartObjectInformation(ChartObjectType.emptySpace, {});
        }
        /**
         *
         *
         * @private
         * @memberof ChartBase
         */
        calculateChartDimensions() {
            this.axisBounds = [];
            for (let i = 0; i < this.scales.length; i++) {
                let axis = this.chart.getAxis(this.scales[i].id);
                if (axis != undefined) {
                    this.axisBounds.push(axis.getAxisBounds());
                }
            }
            let axis = this.chart.getAxis(this.primaryXAxisName);
            if (axis != undefined) {
                this.axisBounds.push(axis.getAxisBounds());
            }
        }
        onMouseAction(sender, args) {
            switch (args.mouseActionType) {
                case userInteractionController_1.MouseActionType.mouseDown: {
                    this.onChartMouseDown(sender, args);
                    break;
                }
                case userInteractionController_1.MouseActionType.mouseUp: {
                    this.onChartMouseUp(sender, args);
                    break;
                }
                case userInteractionController_1.MouseActionType.mouseMove: {
                    this.onChartMouseMove(sender, args);
                    break;
                }
            }
        }
        /**
         *
         *
         * @private
         * @param {*} args
         * @memberof ChartBase
         */
        onChartMouseDown(sender, args) {
            args.objectUnderMouse = this.getChartObjectUnderMouse(args.mousePointChart.x, args.mousePointChart.y);
            let eventUserChartInteractionArgs;
            eventUserChartInteractionArgs = new EventUserChartInteractionArgs(userInteractionController_1.MouseActionType.mouseDown, args);
            eventUserChartInteractionArgs.eventArguments.hoveredSeries = this.hoveredSeries;
            this.eventUserChartInteraction.raise(this, eventUserChartInteractionArgs);
        }
        ;
        /**
         *
         *
         * @private
         * @param {*} args
         * @memberof ChartBase
         */
        onChartMouseUp(sender, args) {
            args.objectUnderMouse = this.getChartObjectUnderMouse(args.mousePointChart.x, args.mousePointChart.y);
            let eventUserChartInteractionArgs;
            eventUserChartInteractionArgs = new EventUserChartInteractionArgs(userInteractionController_1.MouseActionType.mouseUp, args);
            this.eventUserChartInteraction.raise(this, eventUserChartInteractionArgs);
        }
        ;
        /**
         *
         *
         * @private
         * @param {*} args
         * @memberof ChartBase
         */
        onChartMouseMove(sender, args) {
            let chartObjectUnderMouse = this.getChartObjectUnderMouse(args.mousePointChart.x, args.mousePointChart.y);
            args.objectUnderMouse = chartObjectUnderMouse;
            let eventUserChartInteractionArgs;
            eventUserChartInteractionArgs = new EventUserChartInteractionArgs(userInteractionController_1.MouseActionType.mouseMove, args);
            this.eventUserChartInteraction.raise(this, eventUserChartInteractionArgs);
        }
        ;
        /**
         * This method is called by the InteractionStratetgies when a click in the
         * chart has been made.
         *
         * @memberof ChartBase
         */
        setCursorOnPointerPosition(mousePoint) {
            this.setCursor(mousePoint.x, mousePoint.y);
            this.checkCursorsHovering(mousePoint);
        }
        /**
         * Internal method for actually moving the cursors. Overwritten in FFTChart.ts
         *
         * @protected
         * @param {number} x
         * @param {number} y
         * @returns
         * @memberof ChartBase
         */
        setCursor(x, y) {
            if (!this.series.length) {
                return;
            }
            this.cursorsStates.setLastCursorTypeSelected(cursorType_1.CursorType.timeDomain);
            let hoveredCursorIndex = this.cursorsStates.getHoveredCursorIndex();
            if (hoveredCursorIndex != -1) { // Set selected cursor when hovered cursor was found
                this.cursorsStates.setSelected(hoveredCursorIndex, true);
            }
            else {
                this.cursorsStates.setSelected(this.cursorsStates.getSelectedCursorIndex(), true);
            }
            this.updateSelectedCursor(x, y);
        }
        /**
         * Pass the x and y position on the property and this method will figure out where to
         * place the cursors and update the states accordingly
         *
         * @protected
         * @param {CursorStates} cursorsStates
         * @param {number} x
         * @param {number} y
         * @memberof ChartBase
         */
        updateSelectedCursor(x, y) {
            let point = this.getChartCoordinateFromPixel(this.primaryXAxisName, this.scales[0].id, x, y);
            let nearestTimestampFromAllSeries = this.getTimestampInSeries(point, this.series);
            this.cursorsStates.setActive(this.cursorsStates.getSelectedCursorIndex(), true);
            this.cursorsStates.setPosition(this.cursorsStates.getSelectedCursorIndex(), nearestTimestampFromAllSeries);
            this.cursorsStates.setHovered(this.cursorsStates.getSelectedCursorIndex(), this.getSerieCursorType(), false);
            this.updateCursorStates(this.cursorsStates);
        }
        /**
         * Internal method for actually moving the cursors. Pass the x and y
         * position on the property and this method will figure out where to
         * place the cursors and update the states accordingly
         *
         * @private
         * @param {number} x
         * @param {number} y
         * @returns
         * @memberof ChartBase
         */
        dragCursorAlongLine(x, y, hoverdSeries) {
            if (!this.series.length) {
                return;
            }
            if (hoverdSeries.length != 0) {
                let point = this.getChartCoordinateFromPixel(this.primaryXAxisName, this.scales[0].id, x, y);
                let nearestTimestampFromSingleSeries = this.getTimestampInSeries(point, hoverdSeries);
                this.cursorsStates.setPosition(this.cursorsStates.getSelectedCursorIndex(), nearestTimestampFromSingleSeries);
            }
            this.updateCursorStates(this.cursorsStates);
        }
        /**
         * This method is called by the userInteraction stragetgy whenever
         * the mouse is moved across a chart. If the mouse is above a cursor
         * this cursor updates it's own state to HOVERING and once it is no
         * longer below the mouse it will reset to it's previous state
         *
         * @memberof ChartBase
         */
        checkCursorsHovering(mousePoint) {
            if (this.cursorHandler != undefined) {
                let chartArea = this.chart.getChartArea();
                let actualMousePoint = new point_1.Point(mousePoint.x - chartArea.x, mousePoint.y - chartArea.y);
                let selectedCursorIndex = this.cursorsStates.getSelectedCursorIndex();
                let closestCursorPosition = this.cursorHandler.getClosestCursorPositionToPoint(actualMousePoint, selectedCursorIndex);
                if (closestCursorPosition != undefined) {
                    let distanceToCursor = closestCursorPosition.additionalInformation["distance"];
                    let currentlyHoveredSeries = this.hoveredSeries;
                    this.hoveredSeries = [];
                    let closestCursorIndex;
                    if (distanceToCursor < this.cursorHoverDistance) {
                        closestCursorPosition.additionalInformation["highlight"] = true;
                        closestCursorIndex = closestCursorPosition.additionalInformation["cursorIndex"];
                        this.hoveredSeries = closestCursorPosition.additionalInformation["series"];
                        //as the cursor state is not updated when the hoveredSeries change, the redraw has to be called manually
                        if (!this.seriesArrayEqualsSeriesArray(currentlyHoveredSeries, this.hoveredSeries)) {
                            this.updateUICursors(this.cursorsStates);
                        }
                    }
                    this.updateHoveringStatesInCursors(this.cursorsStates, closestCursorIndex);
                    this.updateCursorStates(this.cursorsStates);
                }
            }
        }
        /**
         * check if two arrays of type ChartViewSerie[] contain the exact same order of series by id
         *
         * @private
         * @param {ChartViewSerie[]} seriesArray1
         * @param {ChartViewSerie[]} seriesArray2
         * @returns {boolean}
         * @memberof ChartBase
         */
        seriesArrayEqualsSeriesArray(seriesArray1, seriesArray2) {
            if (seriesArray1.length != seriesArray2.length) {
                return false;
            }
            for (let i = 0; i < seriesArray1.length; i++) {
                if (seriesArray1[i].id != seriesArray2[i].id) {
                    return false;
                }
            }
            return true;
        }
        getSerieCursorType() {
            if (this.series.length > 0) {
                return cursorType_1.CursorTypeHelper.getCursorTypeForSeries(this.series[0].serie);
            }
            else {
                return undefined;
            }
        }
        /**
         * Reset cursor states with the given cursor type
         *
         * @param {CursorType} cursorType
         * @memberof ChartBase
         */
        resetCursorStates(cursorType) {
            this.cursorsStates.resetCursorStates(cursorType);
        }
        /**
         * Reset hovering of all cursors when mouse is outside of the charts
         *
         * @memberof ChartBase
         */
        resetCursorsHovered() {
            let hoveredCursor = this.cursorsStates.getHoveredCursorIndex();
            //If any cursor is hovered, reset all
            if (hoveredCursor !== -1) {
                this.hoveredSeries = [];
                this.updateHoveringStatesInCursors(this.cursorsStates, undefined);
                this.updateCursorStates(this.cursorsStates);
            }
        }
        /**
         * Internal method to calculate the state which is to be updated in the
         * states to be HOVERING. This method will also reset the correct states
         * to it's previous values if non of the cursors are hovering.
         *
         * @private
         * @param {CursorStates} cursorStates
         * @param {number} closestIndex
         * @returns {CursorStates}
         * @memberof ChartBase
         */
        updateHoveringStatesInCursors(cursorStates, closestIndex) {
            if (closestIndex !== undefined) {
                // Index of cursor found => set hovered flag
                cursorStates.setHovered(closestIndex, this.getSerieCursorType(), true);
            }
            else {
                // No index of cursor found => reset all hovered flags of all cursors
                cursorStates.setHovered(-1, this.getSerieCursorType(), false);
            }
            return cursorStates;
        }
        /**
         * Calculate zoom on mousewheel action
         *
         * @param {*} args
         * @memberof ChartBase
         */
        onChartMouseWheel(sender, args) {
            args.objectUnderMouse = this.getChartObjectUnderMouse(args.mousePoint.x, args.mousePoint.y);
            let eventUserChartInteractionArgs;
            eventUserChartInteractionArgs = new EventUserChartInteractionArgs(userInteractionController_1.MouseActionType.mouseWheel, args);
            this.eventUserChartInteraction.raise(this, eventUserChartInteractionArgs);
        }
        ;
        /**
         * Get if mouse is inside chart bounds
         *
         * @private
         * @param {*} mouseX
         * @param {*} mouseY
         * @returns {boolean}
         * @memberof ChartBase
         */
        mouseIsInChartBounds(mouseX, mouseY) {
            let isInBounds = true;
            let chartArea = this.chart.getChartArea();
            if (mouseX < chartArea.x || mouseX > (chartArea.x + chartArea.width)) {
                isInBounds = false;
            }
            if (mouseY < chartArea.y || mouseY > (chartArea.y + chartArea.height)) {
                isInBounds = false;
            }
            return isInBounds;
        }
        /**
         * Resize chart
         *
         * @param {*} width
         * @param {*} height
         * @memberof ChartBase
         */
        resize(width, height) {
            this.resizeChart(height, width);
        }
        /**
         * Resize Chart only if needed
         *
         * @private
         * @param {*} width
         * @param {*} height
         * @param {*} width
         * @memberof ChartBase
         */
        resizeChart(height, width) {
            if (this.flaggedForResize || this._actualHeight != height || this._actualWidth != width) {
                this._actualHeight = height, this._actualWidth = width;
                width = width - this.yAxisAlignmentOffset;
                this.chart.resize(height, width);
                this.redrawChart();
            }
        }
        /**
         * Redraws chart
         *
         * @param {boolean}
         * @memberof ChartBase
         */
        redrawChart() {
            this.chart.redraw();
            if (this.cursorHandler != undefined) {
                this.cursorHandler.updateChartArea(this.chart.getChartArea());
            }
            this.repositionCursors();
        }
        /**
         * Adds a given serie into a chart
         *
         * @param {Array<BaseSeries>} series
         * @param {Scale} scale
         * @memberof ChartBase
         */
        addSeriesToChart(series, yScale, updateRangeX) {
            for (var i = 0; i < series.length; i++) {
                if (series[i].rawPointsValid == true && this.series.map(e => e.serie).indexOf(series[i]) == -1) {
                    let chartSeries = new chartViewSerie_1.ChartViewSerie(series[i], yScale);
                    this.series.push(chartSeries);
                }
                this.eventSeriesAdded.raise(this, series[i]);
            }
        }
        /**
         * Remove a given serie from the chart
         *
         * @param {BaseSeries} serie
         * @param {boolean} resetCursorStates
         * @memberof ChartBase
         */
        removeSerieFromChart(serie, resetCursorStates) {
            const index = this.serieInChart(serie);
            let cursorType = this.getSerieCursorType();
            if (index > -1) {
                this.series.splice(index, 1);
            }
            this.setAvailableSeriesAsDataSource();
            //Reset cursor states if there are no more series in the chartView with the corresponding cursor type
            if (resetCursorStates) {
                this.resetCursorStates(cursorType);
            }
            //redraw cursors
            let states = this.getUsedCursorStates();
            for (let i = 0; i < states.length; i++) {
                let timestamp = states[i].position;
                this.drawCursor(timestamp, i, states[i].hovered, states[i].selected);
            }
        }
        ;
        /**
         *
         *
         * @private
         * @param {*} serie
         * @returns
         * @memberof ChartBase
         */
        serieInChart(serie) {
            for (let i = 0; i < this.series.length; i++) {
                if (this.series[i].id == serie.id) {
                    return i;
                }
            }
            return -1;
        }
        setZoomAxes(zoomAxes) {
            this.chart.setZoomDirection(zoomAxes);
        }
        setPanning(enable) {
            this.chart.enablePanning(enable);
        }
        /**
         * Panning operation
         *
         * @param {*} pageX
         * @param {*} pageY
         * @memberof ChartBase
         */
        doPanning(pageX, pageY) {
            this.chart.doPanning(pageX, pageY);
            this.eventRedrawAllCharts.raise(this, new EventRedrawAllChartsArgs(this.type));
        }
        resetPanningCoords() {
            //TODO: this is a only workaround, needs to be fixed 
            this.chart.prevPanningCoords = { 'x': undefined, 'y': undefined };
        }
        /**
         * Enables box zooming
         *
         * @param {boolean} enable
         * @memberof ChartBase
         */
        setBoxZoom(enable) {
            this.chart.enableBoxZoom(enable);
        }
        /**
         *Draw the cursor defined by its index for a given timestamp
         *
         * @private
         * @param {number} timestamp
         * @param {number} cursorIndex
         * @param {boolean} hovered
         * @param {boolean} selected
         * @returns
         * @memberof ChartBase
         */
        drawCursor(timestamp, cursorIndex, hovered, selected) {
            if (this.cursorHandler != undefined) {
                let leadCursorPixelPosition;
                let leadCursorTimestamp;
                //the cursorPosition for each serie is stored in an array
                let cursorPositions = [];
                //if the given timestamp is outside of the series bounds, the cursor must not be drawn at all
                let cursorOutOfSeriesBounds = true;
                for (let seriesIndex = 0; seriesIndex < this.series.length; seriesIndex++) {
                    if (timestamp >= this.series[seriesIndex].serie.timestamps[0] && timestamp <= this.series[seriesIndex].serie.timestamps[this.series[seriesIndex].serie.timestamps.length - 1]) {
                        cursorOutOfSeriesBounds = false;
                    }
                }
                if (cursorOutOfSeriesBounds == false) {
                    //leadCursorPosition has to be converted to pixels to be drawn
                    leadCursorPixelPosition = this.getPixelsFromChartPoint(timestamp, 0, this.primaryYAxisName);
                    //leadCursorTimestamp is needed to calculate the cursor positions for the other series (might be different from the timestamp argument)
                    leadCursorTimestamp = timestamp; //this.getTimestampInSeries(leadCursorChartPoint, allSeries);
                    //the cursor positions are calculated for each series to draw the squares for the timestamp indicator
                    cursorPositions = [];
                    for (let seriesIndex = 0; seriesIndex < this.series.length; seriesIndex++) {
                        //only draw the cursor for a series when it is within the series bounds of that chart
                        if (leadCursorTimestamp >= this.series[seriesIndex].serie.timestamps[0] && leadCursorTimestamp <= this.series[seriesIndex].serie.timestamps[this.series[seriesIndex].serie.timestamps.length - 1]) {
                            let cursorChartPoint = this.getCursorPoint(timestamp, this.series, seriesIndex);
                            let scaleId = this.getScaleIDForSeries(this.series[seriesIndex].serie);
                            let cursorPosition = this.getPixelsFromChartPoint(cursorChartPoint.x, cursorChartPoint.y, scaleId);
                            //set highlight to true if cursor is hovered and if its series is currently selected
                            let highlightCursor = false;
                            if (this.hoveredSeries.indexOf(this.series[seriesIndex]) != -1 && hovered && (this.series.length != this.hoveredSeries.length || this.hoveredSeries.length == 1)) {
                                highlightCursor = true;
                            }
                            cursorPositions.push(new CursorPositionInfo_1.CursorPosition(cursorPosition, { selected: selected, hovered: hovered, highlight: highlightCursor, series: [this.series[seriesIndex]], cursorIndex: cursorIndex }));
                        }
                    }
                }
                let leadCursorPosition = new CursorPositionInfo_1.CursorPosition(leadCursorPixelPosition, { selected: selected, hovered: hovered, series: this.series, cursorIndex: cursorIndex });
                this.cursorHandler.drawCursor(leadCursorPosition, cursorPositions, cursorIndex);
            }
        }
        getScaleIDForSeries(series) {
            for (let i = 0; i < this.scales.length; i++) {
                if (this.scales[i].hasSerie(series)) {
                    return this.scales[i].id;
                }
            }
            return "";
        }
        getScaleByScaleId(scaleId) {
            for (let i = 0; i < this.scales.length; i++) {
                if (scaleId == this.scales[i].id) {
                    return this.scales[i];
                }
            }
        }
        autoScaleYScales() {
            let scales = this.getYScales();
            let chartMinYPixel;
            let chartMaxYPixel;
            for (let scale of scales) {
                let seriesMinY = this.getSeriesMinYForScale(scale);
                let seriesMaxY = this.getSeriesMaxYForScale(scale);
                if (seriesMinY != undefined && seriesMaxY != undefined) {
                    let axisMinYPixel = this.calculatePixelY(scale.id, seriesMinY);
                    let axisMaxYPixel = this.calculatePixelY(scale.id, seriesMaxY);
                    if (chartMinYPixel == undefined || axisMinYPixel > chartMinYPixel) {
                        chartMinYPixel = axisMinYPixel;
                    }
                    if (chartMaxYPixel == undefined || axisMaxYPixel < chartMaxYPixel) {
                        chartMaxYPixel = axisMaxYPixel;
                    }
                }
            }
            if (chartMinYPixel != undefined && chartMaxYPixel != undefined) {
                for (let scale of scales) {
                    let newAxisMinValue = this.getChartCoordinateFromPixel(this.primaryXAxisName, scale.id, 0, chartMinYPixel).y;
                    let newAxisMaxValue = this.getChartCoordinateFromPixel(this.primaryXAxisName, scale.id, 0, chartMaxYPixel).y;
                    this.updateRangeY(scale, newAxisMinValue, newAxisMaxValue);
                }
            }
        }
        /**
         * Sets the range for X Axis
         *
         * @param {number} newMinX
         * @param {number} newMaxX
         * @memberof ChartBase
         */
        setRangeX(newMinX, newMaxX) {
            this.scales[0].minXValue = newMinX;
            this.scales[0].maxXValue = newMaxX;
            //Trigger event so axis range can be persisted when 'AutoScale' or 'Reset All'  
            let args = new eventScaleDataChangedArgs_1.EventScaleDataChangedArgs(eventScaleDataChangedArgs_1.ScaleAction.xRangeChanged, { scale: this.scales[0] });
            this.scales[0].eventDataChanged.raise(this.scales[0], args);
            let axis = this.chart.getAxis(this.primaryXAxisName);
            if (axis != undefined) {
                axis.setAxisRange({ min: newMinX, max: newMaxX });
            }
        }
        /**
         *  Sets the range of this chart for the given axis and min/max values
         *
         *
         * @param {Scale} scale
         * @param {number} minXValue
         * @param {number} maxXValue
         * @param {number} minYValue
         * @param {number} maxYValue
         * @param {boolean} [setAxisRange=true]
         * @memberof ChartBase
         */
        setScaleRange(scale, minXValue, maxXValue, minYValue, maxYValue, orientation, setAxisRange = true) {
            scale.setScaleRange(minXValue, maxXValue, minYValue, maxYValue);
            if (setAxisRange) {
                let axis = this.chart.getAxis(scale.id);
                if (axis != undefined) {
                    axis.setAxisRange({ min: scale.minYValue, max: scale.maxYValue });
                }
            }
        }
        /**
         * Update Y range
         *
         * @private
         * @param {Scale} scale
         * @param {number} yAxisMaxValue
         * @param {number} yAxisMinValue
         * @memberof ChartBase
         */
        updateRangeY(scale, yAxisMinValue, yAxisMaxValue) {
            let chartRangeHelper = new chartRangeHelper_1.ChartRangeHelper;
            if (!isNaN(yAxisMaxValue) || !isNaN(yAxisMinValue)) {
                yAxisMaxValue = SFChartAxis_1.SFChartAxis.changeInfinityToMaxValue(yAxisMaxValue);
                yAxisMinValue = SFChartAxis_1.SFChartAxis.changeInfinityToMaxValue(yAxisMinValue);
                yAxisMaxValue = Number(yAxisMaxValue.toPrecision(14));
                yAxisMinValue = Number(yAxisMinValue.toPrecision(14));
                let yAxisRange = yAxisMaxValue - yAxisMinValue;
                let yAxisOffset;
                if (yAxisRange == 0) {
                    //if range is zero, we have to calculate an arbitrary offset to display the y axis correctly
                    yAxisOffset = chartRangeHelper.getAxisOffsetForStraightLines(yAxisMinValue);
                }
                else {
                    let axis = this.chart.getAxis(scale.id);
                    if (axis != undefined) {
                        let pixelRange = axis.getAxisRangeInPixel();
                        yAxisOffset = chartRangeHelper.getAxisOffset(yAxisRange, (pixelRange.max - pixelRange.min));
                    }
                }
                yAxisMaxValue += yAxisOffset;
                yAxisMinValue -= yAxisOffset;
                yAxisRange = yAxisMaxValue - yAxisMinValue;
                this.setScaleRange(scale, scale.minXValue, scale.maxXValue, yAxisMinValue, yAxisMaxValue);
            }
        }
        /**
         * Get min Y value from all the series in the chart
         *
         * @private
         * @param {Scale} scale
         * @returns {(number|undefined)}
         * @memberof ChartBase
         */
        getSeriesMinYForScale(scale) {
            let minY = undefined;
            for (let i = 0; i < scale.childs.length; i++) {
                if (minY == undefined || scale.childs[i].minY < minY) {
                    minY = scale.childs[i].minY;
                }
            }
            return minY;
        }
        /**
         * Get max Y value from all the series on the axis
         *
         * @private
         * @param {Scale} scale
         * @returns {(number|undefined)}
         * @memberof ChartBase
         */
        getSeriesMaxYForScale(scale) {
            let maxY = undefined;
            for (let i = 0; i < scale.childs.length; i++) {
                if (maxY == undefined || scale.childs[i].maxY > maxY) {
                    maxY = scale.childs[i].maxY;
                }
            }
            return maxY;
        }
        /**
         * Updates the available ui cursors according to the current state in response to a state change.
         *
         * @private
         * @param {CursorStates} modifiedState
         * @memberof ChartBase
         */
        updateUICursors(modifiedState) {
            try {
                let serieCursorType = this.getSerieCursorType();
                let cursorTimeStates = modifiedState.getTimeStates();
                let cursorFreqStates = modifiedState.getFrequencyStates();
                if (serieCursorType == cursorType_1.CursorType.timeDomain) {
                    this.updateCursorLoations(cursorTimeStates);
                }
                else if (serieCursorType == cursorType_1.CursorType.frequencyDomain) {
                    this.updateCursorLoations(cursorFreqStates);
                }
            }
            catch (error) {
                // the try catch block fixes an incorrect sequence when closing and reopening the analysis view as a workaround until
                // the binding connections will be cleaned up correctly.
                console.warn("ChartBase.updateUICursors: cursors could not be updated because of exception %o", error);
            }
        }
        updateCursorLoations(cursorStates) {
            for (let index = 0; index < cursorStates.length; index++) {
                // this.setCursorState(index, cursorStates[index]);
                // update the cursors only if they have a valid position
                let position = cursorStates[index].position;
                if (position != undefined) {
                    this.drawCursor(position, index, cursorStates[index].hovered, cursorStates[index].selected);
                }
            }
        }
        /**
         * Returns primary XAxis min value
         *
         * @private
         * @returns
         * @memberof ChartBase
         */
        getMinXAxisValue() {
            let axis = this.chart.getAxis(this.primaryXAxisName);
            if (axis != undefined) {
                return axis.getAxisRange().min;
            }
        }
        /**
         * Returns primary XAxis max value
         *
         * @private
         * @returns
         * @memberof ChartBase
         */
        getMaxXAxisValue() {
            let axis = this.chart.getAxis(this.primaryXAxisName);
            if (axis != undefined) {
                return axis.getAxisRange().max;
            }
        }
        /**
         *
         *
         * @private
         * @param {number} x
         * @param {number} y
         * @returns {{ x: number, y: number}}
         * @memberof ChartBase
         */
        getPixelsFromChartPoint(x, y, scaleID) {
            let chartArea = this.chart.getChartArea();
            return { x: this.calculatePixelX(x) - chartArea.x, y: this.calculatePixelY(scaleID, y) - chartArea.y };
        }
        /**
         * We reposition the cursors aswell when we update the chart
         *
         * @private
         * @memberof ChartBase
         */
        repositionCursors() {
            // Force updating the cursors states which in response updates the cursor ui ....
            //this.updateCursorStates(this.cursorsStates);
            this.updateUICursors(this.cursorsStates);
        }
        /**
         *
         *
         * @private
         * @param {number} chartX
         * @returns
         * @memberof ChartBase
         */
        calculatePixelX(chartX) {
            let minX = this.getMinXAxisValue();
            let maxX = this.getMaxXAxisValue();
            if (maxX != undefined && minX != undefined) {
                let range = (maxX - minX);
                let startX = minX;
                let actualRange = range;
                let timePercentage = (chartX - startX) / actualRange;
                let chartArea = this.chart.getChartArea();
                return chartArea.x + chartArea.width * timePercentage;
            }
            return 0;
        }
        /**
         *
         *
         * @private
         * @param {number} chartY
         * @returns
         * @memberof ChartBase
         */
        calculatePixelY(scaleID, chartY) {
            let axis = this.chart.getAxis(scaleID);
            if (axis != undefined) {
                let axisRange = axis.getAxisRange();
                let range;
                if (axisRange.delta != undefined) {
                    range = axisRange.delta;
                }
                else {
                    range = axisRange.max - axisRange.min;
                }
                let startY = axisRange.min;
                let valuePercentage = 1 - ((chartY - startY) / range);
                let chartArea = this.chart.getChartArea();
                return chartArea.y + chartArea.height * valuePercentage;
            }
            return 0;
        }
        /**
         * Remove drop locations from the chart
         *
         * @memberof ChartBase
         */
        removeSerieDropLocations() {
            let chartDiv = $(this.mainDiv);
            for (let axisBound of this.axisBounds) {
                let dropZoneDiv = chartDiv.find("#" + this.axisDropZoneId + axisBound.axis.name);
                dropZoneDiv.remove();
            }
            let dropZoneDiv = chartDiv.find("#" + this.axisDropZoneId + "_chartArea");
            dropZoneDiv.remove();
        }
        /**
         * Get number of y axes inside a chart
         *
         * @returns {number}
         * @memberof ChartBase
         */
        getNumberOfYScales() {
            return this.scales.length;
        }
        /**
         * Get all y axes from a chart
         *
         * @returns {Scale[]}
         * @memberof ChartBase
         */
        getYScales() {
            return this.scales;
        }
        /**
         *
         *
         * @protected
         * @param {number} pixelCoordinateX
         * @param {number} pixelCoordinateY
         * @returns
         * @memberof XYChart
         */
        getChartCoordinateFromPixel(scaleIDX, scaleIDY, pixelCoordinateX, pixelCoordinateY) {
            let chartArea = this.chart.getChartArea();
            let xAxis = this.chart.getAxis(scaleIDX);
            let yAxis = this.chart.getAxis(scaleIDY);
            let yAxisRange = yAxis.getAxisRange();
            let xAxisRange = xAxis.getAxisRange();
            // X Axis: 
            pixelCoordinateX = SFChartAxis_1.SFChartAxis.changeInfinityToMaxValue(pixelCoordinateX);
            let relativePixelCoordinateX = Big(pixelCoordinateX).minus(Big(chartArea.x));
            let chartAxisXRange = Big(xAxisRange.max).minus(Big(xAxisRange.min));
            let chartCoordinatePerPixel = chartAxisXRange.div(Big(chartArea.width));
            let closestXAxisValueToClick = Big(xAxisRange.min).plus((relativePixelCoordinateX.times(chartCoordinatePerPixel)));
            // Y Axis: 
            pixelCoordinateY = SFChartAxis_1.SFChartAxis.changeInfinityToMaxValue(pixelCoordinateY);
            let relativePixelCoordinateY = Big(pixelCoordinateY).minus(Big(chartArea.y));
            let chartAxisYRange = Big(yAxisRange.max).minus(Big(yAxisRange.min));
            chartCoordinatePerPixel = chartAxisYRange.div(Big(chartArea.height));
            let closestYAxisValueToClick = Big(yAxisRange.min).plus(chartAxisYRange.minus(relativePixelCoordinateY.times(chartCoordinatePerPixel)));
            let closestYAxisValueNumber = Number(closestYAxisValueToClick.toFixed(14));
            let closestXAxisValueNumber = Number(closestXAxisValueToClick.toFixed(14));
            return new point_1.Point(closestXAxisValueNumber, closestYAxisValueNumber);
        }
        /**
         * gets a series point in chart coordinates for the specefied timestamp
         *
         * @protected
         * @param {number} timestamp
         * @returns {Point}
         * @memberof YTChart
         */
        getSeriesPointFromTimestamp(timestamp) {
            // we provide y == 0 if we are not able to find matching points
            let seriesPoint = new point_1.Point(timestamp, 0);
            // skip searching if the series index is out of range
            if (this.series.length == 0)
                return seriesPoint;
            // find a matching series point related to the timestamp
            seriesPoint = this.findNearestPointInAllSeries(timestamp);
            return seriesPoint;
        }
        /**
         * Searches for the nearest point related to the timestamp in all series
         *
         * @private
         * @param {number} timestamp
         * @returns
         * @memberof ChartBase
         */
        findNearestPointInAllSeries(timestamp) {
            // collect the nearest points from every series
            let nearestSeriesPoints = this.series.map((singleSeries) => { return singleSeries.serie.pointFromTimestamp(timestamp); });
            // sort the nearest points by their timestamp value
            nearestSeriesPoints.sort((value1, value2) => { return value1.x - value2.x; });
            // get the timestamp values
            let nearestSeriesTimestamps = nearestSeriesPoints.map((seriesPoint) => { return seriesPoint.x; });
            // find the nearest point from all series. The found index refers to the nearest series !
            let nearestSeriesIndex = seriesHelper_1.SeriesHelper.indexOfNearest(timestamp, nearestSeriesTimestamps);
            // get the nearest point from the series
            let seriesPointFromTimeStamp = nearestSeriesPoints[nearestSeriesIndex];
            // create a point instance with a matching timestamp
            let seriesPoint = seriesPointFromTimeStamp ? new point_1.Point(seriesPointFromTimeStamp.x, seriesPointFromTimeStamp.y) : new point_1.Point(timestamp, 0);
            return seriesPoint;
        }
        // --------------------------------------------------- Overload methods in derived chart --------------------------------------------------- //
        removeYScaleFromChart(yScale) { }
        ;
        onSynchronizeScaleRange(scale, min, max) { }
        setAvailableSeriesAsDataSource() { }
        updateChartRangeX(xAxisMinValue, xAxisMaxValue) {
            let chartRangeHelper = new chartRangeHelper_1.ChartRangeHelper();
            if (xAxisMaxValue != undefined && xAxisMinValue != undefined) {
                let xAxisSegmentRange = xAxisMaxValue - xAxisMinValue;
                let xAxisOffset;
                if (xAxisSegmentRange == 0) {
                    xAxisOffset = chartRangeHelper.getAxisOffsetForStraightLines(this.series[0].rawPoints[0].x);
                }
                else {
                    let axis = this.chart.getAxis(this.primaryXAxisName);
                    if (axis != undefined) {
                        let axisPixelRange = axis.getAxisRangeInPixel();
                        xAxisOffset = chartRangeHelper.getAxisOffset(xAxisSegmentRange, (axisPixelRange.max - axisPixelRange.min));
                    }
                }
                xAxisMaxValue += xAxisOffset;
                xAxisMinValue -= xAxisOffset;
                xAxisSegmentRange = xAxisMaxValue - xAxisMinValue;
                this.setRangeX(xAxisMinValue, xAxisMaxValue);
            }
        }
        getTimestampInSeries(p, series) { return p.x; }
        getCursorPoint(timestamp, series, seriesIndex) { return { x: timestamp, y: 0, timestamp: timestamp }; }
        addSerieDropLocations(serie, chartManagerChart) { }
        ;
        addDropLocations(serie) { }
        ;
        getDropLocationType(currentTarget) { return DropLocationType.invalid; }
        addYScale(scale, position) { }
        updateDroppableAreas(currentTarget) { }
        ;
        resetHighlighting() { }
        ;
        getUsedCursorStates() { return []; }
        ;
    };
    ChartBase = __decorate([
        mco.role()
    ], ChartBase);
    exports.ChartBase = ChartBase;
});
