var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../framework/events", "./strategies/charStrategyInterface", "./strategies/cursorStrategy", "./strategies/chartPanningStrategy", "../../chartViewWidget/chartViewWidget", "./strategies/chartBoxZoomStrategy", "./strategies/cursorDragStrategy", "../ChartBase", "../../common/states/chartViewToolbarStates", "./strategies/axisPanningStrategy", "../../../core/types/point", "../../traceViewWidget/bindingIds", "../../../framework/componentHub/bindings/bindings"], function (require, exports, events_1, charStrategyInterface_1, cursorStrategy_1, chartPanningStrategy_1, chartViewWidget_1, chartBoxZoomStrategy_1, cursorDragStrategy_1, ChartBase_1, chartViewToolbarStates_1, axisPanningStrategy_1, point_1, bindingIds_1, bindings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MouseActionType = exports.ChartCommandType = exports.EventExecuteChartCommandArgs = exports.EventExecuteChartCommand = exports.UserInteractionController = void 0;
    let EventExecuteChartCommand = class EventExecuteChartCommand extends events_1.TypedEvent {
    };
    EventExecuteChartCommand = __decorate([
        mco.role()
    ], EventExecuteChartCommand);
    exports.EventExecuteChartCommand = EventExecuteChartCommand;
    ;
    /**
     * Commands that can be used within the charts
     *
     * @enum {number}
     */
    var ChartCommandType;
    (function (ChartCommandType) {
        ChartCommandType[ChartCommandType["setCursorOnPointerPosition"] = 0] = "setCursorOnPointerPosition";
        ChartCommandType[ChartCommandType["resetZoom"] = 1] = "resetZoom";
        ChartCommandType[ChartCommandType["selectCursor"] = 2] = "selectCursor";
        ChartCommandType[ChartCommandType["checkCursorHovering"] = 3] = "checkCursorHovering";
        ChartCommandType[ChartCommandType["dragCursor"] = 4] = "dragCursor";
        ChartCommandType[ChartCommandType["endCursorDrag"] = 5] = "endCursorDrag";
        ChartCommandType[ChartCommandType["panChart"] = 6] = "panChart";
        ChartCommandType[ChartCommandType["toggleBoxZoom"] = 7] = "toggleBoxZoom";
        ChartCommandType[ChartCommandType["togglePanning"] = 8] = "togglePanning";
        ChartCommandType[ChartCommandType["selectZoomAxis"] = 9] = "selectZoomAxis";
        ChartCommandType[ChartCommandType["selectPanningAxes"] = 10] = "selectPanningAxes";
        ChartCommandType[ChartCommandType["zoomChart"] = 11] = "zoomChart";
        ChartCommandType[ChartCommandType["autoScale"] = 12] = "autoScale";
        ChartCommandType[ChartCommandType["resetDragPosition"] = 13] = "resetDragPosition";
        ChartCommandType[ChartCommandType["resetCursorHovering"] = 14] = "resetCursorHovering";
    })(ChartCommandType || (ChartCommandType = {}));
    exports.ChartCommandType = ChartCommandType;
    /**
     * ChartInteractionType
     *
     * @enum {number}
     */
    var MouseActionType;
    (function (MouseActionType) {
        MouseActionType[MouseActionType["mouseDown"] = 0] = "mouseDown";
        MouseActionType[MouseActionType["mouseUp"] = 1] = "mouseUp";
        MouseActionType[MouseActionType["mouseMove"] = 2] = "mouseMove";
        MouseActionType[MouseActionType["mouseWheel"] = 3] = "mouseWheel";
    })(MouseActionType || (MouseActionType = {}));
    exports.MouseActionType = MouseActionType;
    /**
     * ChartMouseState
     *
     * @enum {number}
     */
    var ChartMouseState;
    (function (ChartMouseState) {
        ChartMouseState[ChartMouseState["mouseUp"] = 0] = "mouseUp";
        ChartMouseState[ChartMouseState["mouseDown"] = 1] = "mouseDown";
        ChartMouseState[ChartMouseState["dragging"] = 2] = "dragging";
    })(ChartMouseState || (ChartMouseState = {}));
    /**
     * Arguments for EventExecuteChartCommand
     *
     * @class EventExecuteChartCommandArgs
     */
    let EventExecuteChartCommandArgs = class EventExecuteChartCommandArgs {
        constructor(caller, commandType, traceChart, data = {}) {
            this.caller = caller;
            this.commandType = commandType;
            this.traceChart = traceChart;
            this.data = data;
        }
    };
    EventExecuteChartCommandArgs = __decorate([
        mco.role()
    ], EventExecuteChartCommandArgs);
    exports.EventExecuteChartCommandArgs = EventExecuteChartCommandArgs;
    /**
     * UserInteractionController
     *
     * @class UserInteractionController
     * @implements {IUserInteractionController}
     */
    let UserInteractionController = class UserInteractionController {
        /**
         * Creates an instance of UserInteractionController
         * @memberof UserInteractionController
         */
        constructor() {
            this.mouseDownPosition = [];
            this.zoomStep = 1.2;
            this.zoomDirection = chartViewWidget_1.ZoomDirection.XY;
            this._toolState = new chartViewToolbarStates_1.ChartViewToolState();
            this._zoomDirectionState = new chartViewToolbarStates_1.ChartViewZoomDirectionState();
            this.eventExecuteChartCommand = new EventExecuteChartCommand();
            this.mouseState = ChartMouseState.mouseUp;
            this.activeStrategies = [];
            this.createBindings();
            this.selectCursor(1);
            //needed for mouse actions that are happening outside of the charts
            $(document).on("mouseup", (() => this.onMouseUpOutsideOfChart()));
            $(document).on("mousemove", ((e) => this.onMouseMoveOutsideOfChart(e)));
        }
        /**
         * Creates the binding to the different states(zoom direction, tool, ...)
         *
         * @private
         * @memberof UserInteractionController
         */
        createBindings() {
            bindings_1.Bindings.createByDecl(bindingIds_1.TraceViewBinding.ToolState, this, "toolState", "");
            bindings_1.Bindings.createByDecl(bindingIds_1.TraceViewBinding.ZoomDirectionState, this, "zoomDirectionState", "");
        }
        /**
         * Disposes all bindings to this instance
         *
         * @private
         * @memberof UserInteractionController
         */
        disposeBindings() {
            bindings_1.Bindings.unbind(this);
        }
        /**
         * Dispose this instance
         *
         * @memberof UserInteractionController
         */
        dispose() {
            this.disposeBindings();
        }
        /**
         * Gets the tool states
         *
         * @protected
         * @type {ChartViewToolState}
         * @memberof UserInteractionController
         */
        get toolState() {
            return this._toolState;
        }
        /**
         * Sets the tool state. The method is called automatically whenever a tool state has been changed externally.
         *
         * @protected
         * @memberof UserInteractionController
         */
        set toolState(toolState) {
            // update the backup field
            this._toolState = toolState;
            this.updateOnChartViewToolStateChange(this._toolState);
        }
        /**
         * Gets the zoom direction states
         *
         * @protected
         * @type {ChartViewZoomDirectionState}
         * @memberof UserInteractionController
         */
        get zoomDirectionState() {
            return this._zoomDirectionState;
        }
        /**
         * Sets the zoom direction state. The method is called automatically whenever a zoom direction state has been changed externally.
         *
         * @protected
         * @memberof UserInteractionController
         */
        set zoomDirectionState(zoomDirectionState) {
            // update the backup field
            this._zoomDirectionState = zoomDirectionState;
            this.updateOnChartViewZoomDirectionChange(this._zoomDirectionState);
        }
        updateOnChartViewToolStateChange(modifiedState) {
            switch (modifiedState.selectedTool) {
                case chartViewToolbarStates_1.ChartViewToolStateEnum.CURSORS: {
                    this.selectCursor(1);
                    break;
                }
                case chartViewToolbarStates_1.ChartViewToolStateEnum.PANNING:
                    this.setPanning();
                    break;
                case chartViewToolbarStates_1.ChartViewToolStateEnum.BOXZOOM:
                    this.setBoxZoom();
                    break;
            }
        }
        updateOnChartViewZoomDirectionChange(modifiedState) {
            switch (modifiedState.zoomDirection) {
                case chartViewWidget_1.ZoomDirection.X:
                    this.eventExecuteChartCommand.raise(this, new EventExecuteChartCommandArgs(this, ChartCommandType.selectZoomAxis, null, { zoomAxes: chartViewWidget_1.ZoomDirection.X }));
                    this.zoomDirection = chartViewWidget_1.ZoomDirection.X;
                    break;
                case chartViewWidget_1.ZoomDirection.Y:
                    this.eventExecuteChartCommand.raise(this, new EventExecuteChartCommandArgs(this, ChartCommandType.selectZoomAxis, null, { zoomAxes: chartViewWidget_1.ZoomDirection.Y }));
                    this.zoomDirection = chartViewWidget_1.ZoomDirection.Y;
                    break;
                case chartViewWidget_1.ZoomDirection.XY:
                    this.eventExecuteChartCommand.raise(this, new EventExecuteChartCommandArgs(this, ChartCommandType.selectZoomAxis, null, { zoomAxes: chartViewWidget_1.ZoomDirection.XY }));
                    this.zoomDirection = chartViewWidget_1.ZoomDirection.XY;
                    break;
            }
        }
        /**
         * method called when the user interacts with charts
         *
         * @param {MouseActionType} chartInteractionType
         * @param {ITraceChart} sender chart in which interaction happened
         * @param {*} args
         * @memberof UserInteractionController
         */
        onChartInteraction(chartInteractionType, sender, args) {
            switch (chartInteractionType) {
                case (MouseActionType.mouseDown):
                    this.onChartMouseDown(sender, args);
                    break;
                case (MouseActionType.mouseUp):
                    this.onChartMouseUp(sender, args);
                    break;
                case (MouseActionType.mouseMove):
                    this.onChartMouseMove(sender, args);
                    break;
                case (MouseActionType.mouseWheel):
                    this.onChartMouseWheel(sender, args);
                    break;
            }
        }
        /**
         *method called on mouse down event
         *
         * @private
         * @param {ITraceChart} sender chart in which mouseDown happened
         * @param {*} args
         * @memberof UserInteractionController
         */
        onChartMouseDown(sender, args) {
            this.mouseState = ChartMouseState.mouseDown;
            this.activeChart = sender;
            this.mouseDownPosition = [args.mousePointChart.x, args.mousePointChart.y];
            for (let i = 0; i < this.activeStrategies.length; i++) {
                args.objectUnderMouse = this.activeStrategies[i].onMouseDown(sender, args.objectUnderMouse, args.mousePointChart);
            }
        }
        /**
         *method called on mouse up event
         *
         * @private
         * @param {ITraceChart} sender chart in which mouseUp happened
         * @param {*} args
         * @memberof UserInteractionController
         */
        onChartMouseUp(sender, args) {
            if (this.mouseDownPosition[0] != args.mousePointChart.x || this.mouseDownPosition[1] != args.mousePointChart.y) {
                for (let i = 0; i < this.activeStrategies.length; i++) {
                    this.activeStrategies[i].onDragEnd(sender, args.objectUnderMouse);
                }
            }
            else {
                for (let i = 0; i < this.activeStrategies.length; i++) {
                    this.activeStrategies[i].onClick(sender, args.objectUnderMouse, args.mousePointChart);
                }
            }
            this.mouseState = ChartMouseState.mouseUp;
            this.activeChart = undefined;
            this.mouseDownPosition = [];
        }
        /**
         * called when the mousebutton is released outside of a chart
         *
         * @private
         * @memberof UserInteractionController
         */
        onMouseUpOutsideOfChart() {
            if (this.mouseState == ChartMouseState.dragging) {
                //each strategy has to be notified, when the drag stopped outside of the chart
                for (let i = 0; i < this.activeStrategies.length; i++) {
                    this.activeStrategies[i].onDragEnd(undefined, new ChartBase_1.ChartObjectInformation(ChartBase_1.ChartObjectType.invalid, {}));
                }
            }
            this.mouseState = ChartMouseState.mouseUp;
            this.mouseDownPosition = [];
            this.eventExecuteChartCommand.raise(this, new EventExecuteChartCommandArgs(this, ChartCommandType.resetDragPosition, null, {}));
        }
        /**
         * called when the mouse is moved outside of the chart
         *
         * @private
         * @param {*} e
         * @memberof UserInteractionController
         */
        onMouseMoveOutsideOfChart(e) {
            //only reset the hovering state when the mouse is currently dragging (e.g dragging the cursor)
            if (this.mouseState != ChartMouseState.dragging) {
                this.eventExecuteChartCommand.raise(this, new EventExecuteChartCommandArgs(this, ChartCommandType.resetCursorHovering, null, { e }));
            }
        }
        /**
         *method called on mouse move event
         *
         * @private
         * @param {ITraceChart} sender chart in which mouseDown happened
         * @param {*} args
         * @memberof UserInteractionController
         */
        onChartMouseMove(sender, args) {
            if (this.mouseState == ChartMouseState.mouseUp) {
                this.mouseHover(sender, args);
            }
            else {
                if (this.activeChart) {
                    args.mousePointChart = new point_1.Point(args.mousePoint.x - this.activeChart.mainDiv.getBoundingClientRect().x, args.mousePoint.y - this.activeChart.mainDiv.getBoundingClientRect().y);
                    this.mouseDrag(this.activeChart, args);
                }
            }
        }
        /**
         *method called when mouse is hovering above chart
         *
         * @private
         * @param {*} sender chart in which hover happened
         * @param {*} args
         * @memberof UserInteractionController
         */
        mouseHover(sender, args) {
            for (let i = 0; i < this.activeStrategies.length; i++) {
                this.activeStrategies[i].onMouseHover(sender, args.objectUnderMouse, args.mousePointChart);
            }
        }
        /**
         *method called when mouse is draged on chart
         *
         * @private
         * @param {*} sender chart in which drag happened
         * @param {*} args
         * @memberof UserInteractionController
         */
        mouseDrag(sender, args) {
            this.mouseState = ChartMouseState.dragging;
            let activeStrategy = this.getActiveDragStrategy();
            if (activeStrategy != undefined) {
                activeStrategy.onDrag(sender, args);
            }
            else {
                for (let i = 0; i < this.activeStrategies.length; i++) {
                    this.activeStrategies[i].onDrag(sender, args);
                    if (this.activeStrategies[i].dragIsActive == true) {
                        break;
                    }
                }
            }
        }
        /**
         * checks if any drag operation is active and return corresponding strategy
         *
         * @private
         * @returns IChartInteractionStrategy | undefined
         * @memberof UserInteractionController
         */
        getActiveDragStrategy() {
            for (let i = 0; i < this.activeStrategies.length; i++) {
                if (this.activeStrategies[i].dragIsActive == true) {
                    return this.activeStrategies[i];
                }
            }
            return undefined;
        }
        /**
         *method called when mouse wheel changes
         *
         * @private
         * @param {ITraceChart} sender
         * @param {*} args
         * @memberof UserInteractionController
         */
        onChartMouseWheel(sender, args) {
            let zoomStep = this.zoomStep;
            if (args.wheelDelta > 0) {
                zoomStep = 1 / this.zoomStep;
            }
            if (args.objectUnderMouse.chartObjectType != ChartBase_1.ChartObjectType.emptySpace) {
                let axes = new Array();
                if (args.objectUnderMouse.chartObjectType == ChartBase_1.ChartObjectType.axis) {
                    axes.push(sender.chart.getAxis(args.objectUnderMouse.args.axis.getAxisID()));
                }
                this.eventExecuteChartCommand.raise(this, new EventExecuteChartCommandArgs(this, ChartCommandType.zoomChart, sender, { mousePoint: args.mousePoint, zoomStep: zoomStep, zoomDirection: this.zoomDirection, axes: axes }));
            }
        }
        /**
         * method called when the chartViewToolbar is clicked
         *
         * @param {IChartViewToolbar} sender
         * @param {*} args
         * @memberof UserInteractionController
         */
        onToolbarClick(sender, args) {
            //TODO: remove this method and use state updates instead
            if (args.groupNumber == 3) {
                this.eventExecuteChartCommand.raise(this, new EventExecuteChartCommandArgs(this, ChartCommandType.autoScale, null));
            }
            if (args.groupNumber == 4) {
                this.eventExecuteChartCommand.raise(this, new EventExecuteChartCommandArgs(this, ChartCommandType.resetZoom, null));
            }
        }
        /**
         *method used to execute a chart command
         *
         * @param {EventExecuteChartCommandArgs} executeChartCommandArgs
         * @memberof UserInteractionController
         */
        executeCommand(executeChartCommandArgs) {
            this.eventExecuteChartCommand.raise(this, executeChartCommandArgs);
        }
        /**
         * method to choose one of the cursors as active tool by index
         *
         * @param {number} cursorIndex
         * @memberof UserInteractionController
         */
        selectCursor(cursorIndex) {
            //let commandArguments = new EventExecuteChartCommandArgs(this,ChartCommandType.selectCursor, null, {cursorIndex : cursorIndex});
            //this.executeCommand(commandArguments);
            let commandArguments = new EventExecuteChartCommandArgs(this, ChartCommandType.toggleBoxZoom, null, { enabled: false });
            this.executeCommand(commandArguments);
            commandArguments = new EventExecuteChartCommandArgs(this, ChartCommandType.togglePanning, null, { enabled: false });
            this.executeCommand(commandArguments);
            this.clearActiveStrategies();
            this.activeStrategies.push(new axisPanningStrategy_1.AxisPanningStrategy(this));
            this.activeStrategies.push(new cursorStrategy_1.CursorInteractionStrategy(this, cursorIndex));
            this.activeStrategies.push(new cursorDragStrategy_1.CursorDragStrategy(this, cursorIndex));
        }
        /**
         * method to set panning as active tool
         *
         * @private
         * @memberof UserInteractionController
         */
        setPanning() {
            this.clearActiveStrategies();
            this.activeStrategies.push(new axisPanningStrategy_1.AxisPanningStrategy(this));
            this.activeStrategies.push(new chartPanningStrategy_1.ChartPanningStrategy(this));
            this.activeStrategies.push(new cursorDragStrategy_1.CursorDragStrategy(this, 0));
            this.eventExecuteChartCommand.raise(this, new EventExecuteChartCommandArgs(this, ChartCommandType.toggleBoxZoom, null, { boxZoomEnabled: false }));
            this.eventExecuteChartCommand.raise(this, new EventExecuteChartCommandArgs(this, ChartCommandType.togglePanning, null, { panningEnabled: false }));
        }
        /**
         *method to set box zoom as active tool
         *
         * @private
         * @memberof UserInteractionController
         */
        setBoxZoom() {
            this.clearActiveStrategies();
            this.activeStrategies.push(new axisPanningStrategy_1.AxisPanningStrategy(this));
            this.activeStrategies.unshift(new chartBoxZoomStrategy_1.ChartBoxZoomStrategy(this));
            this.activeStrategies.push(new cursorDragStrategy_1.CursorDragStrategy(this, 0));
            this.eventExecuteChartCommand.raise(this, new EventExecuteChartCommandArgs(this, ChartCommandType.toggleBoxZoom, null, { boxZoomEnabled: true }));
            this.eventExecuteChartCommand.raise(this, new EventExecuteChartCommandArgs(this, ChartCommandType.togglePanning, null, { panningEnabled: false }));
        }
        /**
         *removes all active strategys that are in place
         *
         * @private
         * @memberof UserInteractionController
         */
        clearActiveStrategies() {
            this.activeStrategies = [];
            this.activeStrategies.push(new charStrategyInterface_1.ChartIdleStrategy(this));
        }
    };
    UserInteractionController = __decorate([
        mco.role()
    ], UserInteractionController);
    exports.UserInteractionController = UserInteractionController;
});
