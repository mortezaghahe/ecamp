var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/widgetBase", "../../common/themeProvider", "../../../common/directoryProvider", "../../../framework/events", "../../common/states/cursorStates", "../../common/states/chartViewToolbarStates", "../chartViewWidget", "./componentDefaultDefinition"], function (require, exports, widgetBase_1, themeProvider_1, directoryProvider_1, events_1, cursorStates_1, chartViewToolbarStates_1, chartViewWidget_1, componentDefaultDefinition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventToolbarButtonClicked = exports.ChartViewToolbarButtonId = exports.ChartViewToolbar = void 0;
    /**
     * Enum of ChartViewToolbarButtonIds
     *
     * @enum {number}
     */
    var ChartViewToolbarButtonId;
    (function (ChartViewToolbarButtonId) {
        ChartViewToolbarButtonId["RefCursor1"] = "RefCursor1";
        ChartViewToolbarButtonId["RefCursor2"] = "RefCursor2";
        ChartViewToolbarButtonId["Panning"] = "Panning";
        ChartViewToolbarButtonId["BoxZoom"] = "BoxZoom";
        ChartViewToolbarButtonId["ZoomX"] = "ZoomX";
        ChartViewToolbarButtonId["ZoomY"] = "ZoomY";
        ChartViewToolbarButtonId["ZoomXY"] = "ZoomXY";
        ChartViewToolbarButtonId["ResetZoom"] = "ResetZoom";
        ChartViewToolbarButtonId["AutoScale"] = "AutoScale";
    })(ChartViewToolbarButtonId || (ChartViewToolbarButtonId = {}));
    exports.ChartViewToolbarButtonId = ChartViewToolbarButtonId;
    let EventToolbarButtonClicked = class EventToolbarButtonClicked extends events_1.TypedEvent {
    };
    EventToolbarButtonClicked = __decorate([
        mco.role()
    ], EventToolbarButtonClicked);
    exports.EventToolbarButtonClicked = EventToolbarButtonClicked;
    ;
    let EventToolbarButtonClickedArgs = class EventToolbarButtonClickedArgs {
        constructor(selectedButton, groupNumber) {
            this.groupNumber = 0;
            this.groupNumber = groupNumber;
            this.selectedButton = selectedButton;
        }
    };
    EventToolbarButtonClickedArgs = __decorate([
        mco.role()
    ], EventToolbarButtonClickedArgs);
    /**
     *Toolbar for ChartViewWidget
     *
     * @class ChartViewToolbar
     * @extends {WidgetBase}
     * @implements {IChartViewToolbar}
     */
    let ChartViewToolbar = class ChartViewToolbar extends widgetBase_1.WidgetBase {
        constructor() {
            super();
            this.toolbarButtonGroup1 = [];
            this.toolbarButtonGroup2 = [];
            this.toolbarButtonGroup3 = [];
            // holds the current cursor states values. We initialize the member for default. The effective initialization takes place when the external shared instance
            // of the cursor states is created and reflected through the curorStates setter!
            this._cursorStates = new cursorStates_1.CursorStates();
            this._toolState = new chartViewToolbarStates_1.ChartViewToolState();
            this._zoomDirectionState = new chartViewToolbarStates_1.ChartViewZoomDirectionState();
            this.eventToolbarButtonClicked = new EventToolbarButtonClicked();
        }
        /**
         * Dispose the chart view toolbar
         *
         * @memberof ChartViewToolbar
         */
        dispose() {
            super.dispose();
            let toolbar = this.getToolbarInstance();
            if (toolbar != undefined) {
                toolbar.destroy();
            }
        }
        initialized() {
            super.initialized();
            this.toolbarButtonGroup1.push(ChartViewToolbarButtonId.RefCursor1);
            this.toolbarButtonGroup1.push(ChartViewToolbarButtonId.RefCursor2);
            this.toolbarButtonGroup3.push(ChartViewToolbarButtonId.Panning);
            this.toolbarButtonGroup3.push(ChartViewToolbarButtonId.BoxZoom);
            this.toolbarButtonGroup2.push(ChartViewToolbarButtonId.ZoomX);
            this.toolbarButtonGroup2.push(ChartViewToolbarButtonId.ZoomXY);
            this.toolbarButtonGroup2.push(ChartViewToolbarButtonId.ZoomY);
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
        }
        /**
         * Gets the cursors states
         *
         * @protected
         * @type {CursorStates}
         * @memberof ChartViewToolbar
         */
        get cursorsStates() {
            return this._cursorStates;
        }
        /**
         * Sets the cursors states. The method is called automatically whenever a cursor state has been changed externally.
         *
         * @protected
         * @memberof ChartViewToolbar
         */
        set cursorsStates(cursorStates) {
            // update the backup field
            this._cursorStates = cursorStates;
            this.updateOnCursorStatesChanges(cursorStates);
        }
        /**
         * Gets the tool state
         *
         * @protected
         * @type {ChartViewToolState}
         * @memberof ChartViewToolbar
         */
        get toolState() {
            return this._toolState;
        }
        /**
         * Sets the tool state. The method is called automatically whenever a tool state has been changed externally.
         *
         * @protected
         * @memberof ChartViewToolbar
         */
        set toolState(toolState) {
            // update the backup field
            this._toolState = toolState;
            this.updateOnChartViewToolStateChange(toolState);
        }
        /**
         * Gets the zoom direction state
         *
         * @protected
         * @type {ChartViewZoomDirectionState}
         * @memberof ChartViewToolbar
         */
        get zoomDirectionState() {
            return this._zoomDirectionState;
        }
        /**
         * Sets the zoom direction state. The method is called automatically whenever a zoom direction state has been changed externally.
         *
         * @protected
         * @memberof ChartViewToolbar
         */
        set zoomDirectionState(zoomDirectionState) {
            // update the backup field
            this._zoomDirectionState = zoomDirectionState;
            this.updateOnChartViewZoomDirectionStateChange(zoomDirectionState);
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
        /**
         * Updates the tool state.
         *
         * @protected
         * @param {ChartViewToolState} toolState
         * @memberof ChartViewToolbar
         */
        updateToolState(toolState) {
            // BINDINGSOURCE: dispatches the method call to bound targets
        }
        /**
         * Updates the zoom direction state.
         *
         * @protected
         * @param {ChartViewZoomDirectionState} zoomDirectionState
         * @memberof ChartViewToolbar
         */
        updateZoomDirectionState(zoomDirectionState) {
            // BINDINGSOURCE: dispatches the method call to bound targets
        }
        /**
         * create the ChartViewToolbars Layout
         *
         * @memberof ChartViewToolbar
         */
        createLayout() {
            this.addLayoutDivs();
            $(this.mainDiv).ejToolbar({
                width: "100%",
                enableSeparator: true,
                height: 33,
                click: (args) => this.onChartViewToolbarClick(args.currentTarget.id)
            });
            let toolbarInstance = this.getToolbarInstance();
            if (toolbarInstance != undefined) {
                toolbarInstance.selectItemByID(ChartViewToolbarButtonId.RefCursor1);
                toolbarInstance.selectItemByID(ChartViewToolbarButtonId.ZoomXY);
            }
        }
        /**
         * add the needed html code for the toolbar
         *
         * @private
         * @memberof ChartViewToolbar
         */
        addLayoutDivs() {
            $(this.mainDiv).append("<ul> " +
                "<li id='" + ChartViewToolbarButtonId.RefCursor1 + "' style='background-image: url(" + this.getImagePath("cursor1.svg") + "); background-repeat: no-repeat; padding: 0px; margin: 0px; background-size: 24px 24px; height: 30px; width: 30px; background-position: center center;' title='Cursor 1'> </li>" +
                "<li id='" + ChartViewToolbarButtonId.RefCursor2 + "' style='background-image: url(" + this.getImagePath("cursor2.svg") + "); background-repeat: no-repeat; padding: 0px; margin: 0px; background-size: 24px 24px; height: 30px; width: 30px; background-position: center center;' title='Cursor 2'> </li>" +
                "</ul>" +
                "<ul> " +
                "<li id='" + ChartViewToolbarButtonId.Panning + "' style='background-image: url(" + this.getImagePath("panning.svg") + "); background-repeat: no-repeat; padding: 0px; margin: 0px; background-size: 24px 24px; height: 30px; width: 30px; background-position: center center;' title='Panning'> </li>" +
                "<li id='" + ChartViewToolbarButtonId.BoxZoom + "' style='background-image: url(" + this.getImagePath("box_zoom.svg") + "); background-repeat: no-repeat; padding: 0px; margin: 0px; background-size: 24px 24px; height: 30px; width: 30px; background-position: center center;' title='BoxZoom'> </li>" +
                "</ul>" +
                "<ul> " +
                "<li id='" + ChartViewToolbarButtonId.ZoomXY + "' style='background-image: url(" + this.getImagePath("zoomXY.svg") + "); background-repeat: no-repeat; padding: 0px; margin: 0px; background-size: 24px 24px; height: 30px; width: 30px; background-position: center center;' title='Zoom XY '> </li>" +
                "<li id='" + ChartViewToolbarButtonId.ZoomX + "' style='background-image: url(" + this.getImagePath("zoomX.svg") + "); background-repeat: no-repeat; padding: 0px; margin: 0px; background-size: 24px 24px; height: 30px; width: 30px; background-position: center center;' title='Zoom X'> </li>" +
                "<li id='" + ChartViewToolbarButtonId.ZoomY + "' style='background-image: url(" + this.getImagePath("zoomY.svg") + "); background-repeat: no-repeat; padding: 0px; margin: 0px; background-size: 24px 24px; height: 30px; width: 30px; background-position: center center;' title='Zoom Y'> </li>" +
                "</ul>" +
                "<ul> " +
                "<li id='" + ChartViewToolbarButtonId.AutoScale + "' style='background-image: url(" + this.getImagePath("zoom_autoscale.svg") + "); background-repeat: no-repeat; padding: 0px; margin: 0px; background-size: 24px 24px; height: 30px; width: 30px; background-position: center center;' title='Auto Scale'> </li>" +
                "<li id='" + ChartViewToolbarButtonId.ResetZoom + "' style='background-image: url(" + this.getImagePath("zoom_reset_all.svg") + "); background-repeat: no-repeat; padding: 0px; margin: 0px; background-size: 24px 24px; height: 30px; width: 30px; background-position: center center;' title='Reset All'> </li>" +
                "</ul>");
        }
        /**
         * return the Path of an image by its name
         *
         * @private
         * @param {string} imageName
         * @returns {string}
         * @memberof ChartViewToolbar
         */
        getImagePath(imageName) {
            return themeProvider_1.ThemeProvider.getInstance().getThemedFilePath("../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "chartViewWidget/style/images/toolbar/" + imageName);
        }
        /**
         *  deselect all toolbar items and remove highlighting
         *
         * @private
         * @memberof ChartViewToolbar
         */
        deselectToolbarGroup(toolbarGroup) {
            let toolbarInstance = this.getToolbarInstance();
            if (toolbarInstance != undefined) {
                for (let i = 0; i < toolbarGroup.length; i++) {
                    toolbarInstance.deselectItemByID(toolbarGroup[i]);
                }
            }
        }
        /**
         * react on a mouse click on one of the toolbars buttons
         *
         * @private
         * @param {ChartViewToolbarButtonId} buttonID
         * @memberof ChartViewToolbar
         */
        onChartViewToolbarClick(buttonID) {
            let toolstate = this._toolState;
            let zoomDirectionState = this._zoomDirectionState;
            switch (buttonID) {
                case ChartViewToolbarButtonId.BoxZoom:
                    toolstate.selectedTool = chartViewToolbarStates_1.ChartViewToolStateEnum.BOXZOOM;
                    break;
                case ChartViewToolbarButtonId.Panning:
                    toolstate.selectedTool = chartViewToolbarStates_1.ChartViewToolStateEnum.PANNING;
                    break;
                case ChartViewToolbarButtonId.RefCursor1:
                    toolstate.selectedTool = chartViewToolbarStates_1.ChartViewToolStateEnum.CURSORS;
                    this.cursorsStates.setSelected(0, true);
                    break;
                case ChartViewToolbarButtonId.RefCursor2:
                    toolstate.selectedTool = chartViewToolbarStates_1.ChartViewToolStateEnum.CURSORS;
                    this.cursorsStates.setSelected(1, true);
                    break;
                case ChartViewToolbarButtonId.ZoomX:
                    zoomDirectionState.zoomDirection = chartViewWidget_1.ZoomDirection.X;
                    break;
                case ChartViewToolbarButtonId.ZoomY:
                    zoomDirectionState.zoomDirection = chartViewWidget_1.ZoomDirection.Y;
                    break;
                case ChartViewToolbarButtonId.ZoomXY:
                    zoomDirectionState.zoomDirection = chartViewWidget_1.ZoomDirection.XY;
                    break;
                case ChartViewToolbarButtonId.AutoScale:
                    //TODO: remove Event and find solution via states
                    let eventToolbarButtonClickedArgs = new EventToolbarButtonClickedArgs(0, 3);
                    this.eventToolbarButtonClicked.raise(this, eventToolbarButtonClickedArgs);
                    break;
                case ChartViewToolbarButtonId.ResetZoom:
                    //TODO: remove Event and find solution via states
                    let eventToolbarButtonClickedArgs2 = new EventToolbarButtonClickedArgs(0, 4);
                    this.eventToolbarButtonClicked.raise(this, eventToolbarButtonClickedArgs2);
                    break;
            }
            // Update the states
            this.updateCursorStates(this.cursorsStates);
            this.updateToolState(toolstate);
            this.updateZoomDirectionState(zoomDirectionState);
        }
        /**
         * highlight one of the cursor button as the selected one
         *
         * @private
         * @param {*} index
         * @memberof ChartViewToolbar
         */
        setCursorButtonSelected(index) {
            let toolbarInstance = this.getToolbarInstance();
            if (toolbarInstance != undefined) {
                const firstFreqCursor = 2;
                const secondFreqCursor = 3;
                this.deselectToolbarGroup(this.toolbarButtonGroup1);
                if (index < 4 && toolbarInstance.selectItemByID) {
                    if (index == secondFreqCursor) {
                        index = 1;
                    }
                    else if (index == firstFreqCursor) {
                        index = 0;
                    }
                    toolbarInstance.selectItemByID(this.toolbarButtonGroup1[index]);
                }
            }
        }
        setChartViewToolSelected(chartViewToolState) {
            let toolbarInstance = this.getToolbarInstance();
            if (toolbarInstance != undefined) {
                this.deselectToolbarGroup(this.toolbarButtonGroup3);
                switch (chartViewToolState) {
                    case chartViewToolbarStates_1.ChartViewToolStateEnum.PANNING:
                        toolbarInstance.selectItemByID(ChartViewToolbarButtonId.Panning);
                        break;
                    case chartViewToolbarStates_1.ChartViewToolStateEnum.BOXZOOM:
                        toolbarInstance.selectItemByID(ChartViewToolbarButtonId.BoxZoom);
                        break;
                }
            }
        }
        getToolbarInstance() {
            let instance = undefined;
            try {
                instance = $(this.mainDiv).ejToolbar("instance");
            }
            catch (e) {
                console.error("ToolbarInstance not available");
            }
            return instance;
        }
        setZoomDirectionButtonSelected(chartViewZoomDirectionState) {
            let toolbarInstance = this.getToolbarInstance();
            if (toolbarInstance != undefined) {
                this.deselectToolbarGroup(this.toolbarButtonGroup2);
                switch (chartViewZoomDirectionState) {
                    case chartViewWidget_1.ZoomDirection.X:
                        toolbarInstance.selectItemByID(ChartViewToolbarButtonId.ZoomX);
                        break;
                    case chartViewWidget_1.ZoomDirection.Y:
                        toolbarInstance.selectItemByID(ChartViewToolbarButtonId.ZoomY);
                        break;
                    case chartViewWidget_1.ZoomDirection.XY:
                        toolbarInstance.selectItemByID(ChartViewToolbarButtonId.ZoomXY);
                        break;
                }
            }
        }
        updateOnCursorStatesChanges(modifiedStates) {
            this.setCursorButtonSelected(modifiedStates.getSelectedCursorIndex());
        }
        updateOnChartViewToolStateChange(modifiedStates) {
            this.setChartViewToolSelected(modifiedStates.selectedTool);
        }
        updateOnChartViewZoomDirectionStateChange(modifiedStates) {
            this.setZoomDirectionButtonSelected(modifiedStates.zoomDirection);
        }
    };
    ChartViewToolbar = __decorate([
        mco.role()
    ], ChartViewToolbar);
    exports.ChartViewToolbar = ChartViewToolbar;
});
