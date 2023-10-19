var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/domHelper", "./watchablesGridToolbar", "../common/treeGridWidgetBase", "../../models/online/mappCockpitComponent", "./watchableValueBuffer", "./componentDefaultDefinition"], function (require, exports, domHelper_1, watchablesGridToolbar_1, treeGridWidgetBase_1, mappCockpitComponent_1, watchableValueBuffer_1, componentDefaultDefinition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WatchablesWidget = void 0;
    // defines the base id for the watchable value template
    const WATCHABLE_VALUE_ID = "watchableValue_";
    const WATCHABLE_TREND_ID = "watchableTrend_";
    /**
     * implements the widget for displaying the watchables and their values with fast update. It includes displaying a short value trend.
     *
     * @class WatchablesWidget
     * @extends {TreeGridWidgetBase}
     */
    let WatchablesWidget = class WatchablesWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            // holds a list of parameters to watch
            this._watchableParameters = [];
            // holds a list of watchable parameters that use an icon to show its state
            this._watchableStateParameters = [];
            // holds a trend buffer for every parameter
            this._watchableTrendValues = {};
            // specifies the time span of the trend.
            this._trendTimeSpan = 60000;
            // specifies the period for sampling the parameter values (msecs)
            this._trendSamplingInterval = 100;
            // specifies the ui refresh rate (msecs)
            this._trendRefreshingInterval = 500;
            // holds the timer id for the sample timer
            this._watchableSampleTimerId = undefined;
            // holds the timer id for the trend timer
            this._watchablTrendTimerId = -1;
            this._watchableIconUpdateHandler = (sender, args) => this.onWatchableIconUpdated(sender, args);
            this._watchableParamsLoaded = false;
            this._watchableStateParamsLoaded = false;
        }
        /**
         * Defines the height of the header
         *
         * @returns {number}
         * @memberof WatchablesWidget
         */
        defineHeaderHeight() {
            return 30;
        }
        initialized() {
            super.initialized();
            super.setHeaderContent("Watch");
            // Set dynamic column settings
            super.setDynamicColumn(3, 100);
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        /**
         * Are the watchables and watchable state infos already available(via binding)
         *
         * @private
         * @returns {boolean}
         * @memberof WatchablesWidget
         */
        allBindingsDataAvailable() {
            if (this._watchableParamsLoaded == true && this._watchableStateParamsLoaded == true) {
                return true;
            }
            return false;
        }
        /**
         * Called when the watchable parameters have been updated
         *
         * @private
         * @param {MappCockpitComponentParameter[]} watchableParameters
         * @memberof WatchablesWidget
         */
        onWatchableParametersUpdated(watchableParameters) {
            this._watchableParameters = watchableParameters;
            this._watchableParamsLoaded = true;
            if (this.allBindingsDataAvailable()) {
                this.onComponentParametersUpdated();
            }
        }
        /**
         * Called when the watchable state parameters have been updated
         *
         * @private
         * @param {MappCockpitStateParameter[]} watchableStateParameters
         * @memberof WatchablesWidget
         */
        onWatchableStateParametersUpdated(watchableStateParameters) {
            this._watchableStateParameters = watchableStateParameters;
            this._watchableStateParamsLoaded = true;
            this.addTreeGridIcons();
            if (this.allBindingsDataAvailable()) {
                this.onComponentParametersUpdated();
            }
        }
        /**
         * Loads the styles for the watchables widget
         *
         * @memberof WatchablesWidget
         */
        loadStyles() {
            super.loadStyles();
            super.addStyle("widgets/watchablesWidget/style/css/toolbarIcons.css");
        }
        /**
         * The component parameters have been updated
         *
         * @private
         * @param {MappCockpitComponentParameter[]} watchableParameters
         * @memberof WatchablesWidget
         */
        onComponentParametersUpdated() {
            // create trend buffers for the parameters
            this.createWatchableTrendBuffers(this._watchableParameters);
            // start watchable trend timer
            this.startWatchablesTrend();
            // populate the watchables widget
            this.populateWatchablesWidget();
            // update treegrid's toolbar Icons
            this.updateToolbarIcons();
            // after populating the watchables we start observing value changes of the watchables
            this.observeWatchables(this._watchableParameters);
        }
        /**
         * Start
         *
         * @private
         * @memberof WatchablesWidget
         */
        startWatchablesTrend() {
            this.startSamplingWatchables();
            this.startRefreshingWatchablesTrend();
        }
        /**
         * Starts sampling the watchables
         *
         * @private
         * @memberof WatchablesWidget
         */
        startSamplingWatchables() {
            // stop an eventually running timer before starting a new one
            this.stopSamplingTimer();
            this._watchableSampleTimerId = setInterval(() => {
                this.sampleWatchables(this._watchableParameters);
            }, this._trendSamplingInterval, this._watchableSampleTimerId);
        }
        /**
         * Stops the sampling timer
         *
         * @private
         * @memberof WatchablesWidget
         */
        stopSamplingTimer() {
            if (this._watchableSampleTimerId) {
                clearInterval(this._watchableSampleTimerId);
            }
        }
        /**
         * Starts refreshing the watchables trend
         *
         * @private
         * @memberof WatchablesWidget
         */
        startRefreshingWatchablesTrend() {
            // stop an eventually running timer before starting a new one
            this.stopTrendTimer();
            this._watchablTrendTimerId = setInterval(() => {
                this.refreshWatchablesTrend(this._watchableParameters);
            }, this._trendRefreshingInterval);
        }
        /**
         * Stops the trend timer
         *
         * @private
         * @memberof WatchablesWidget
         */
        stopTrendTimer() {
            if (this._watchablTrendTimerId) {
                clearInterval(this._watchablTrendTimerId);
            }
        }
        /**
         * Creates a trend buffer for every watchable parameter
         *
         * @private
         * @memberof WatchablesWidget
         */
        createWatchableTrendBuffers(watchableParameters) {
            watchableParameters.forEach((watchableParameter) => {
                this._watchableTrendValues[watchableParameter.browseName] = watchableValueBuffer_1.WatchableValueTrendBuffer.create(this._trendTimeSpan / this._trendSamplingInterval);
            });
        }
        /** resizes the watchables widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof WatchablesWidget
         */
        resize(width, height) {
            super.resize(width, height);
            // Refresh watchable values after resize (treegrid sets the data to "0" after resize)
            this.refreshWatchablesValues(this._watchableParameters);
        }
        /** creates the tree grid for the watchables informations
         *
         * @protected
         * @memberof WatchablesWidget
         */
        createTreeGrid() {
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridColumnResizeSupport()), this.getTreeGridToolbarSupport()), { dataSource: undefined, cssClass: 'watchablesWidget', allowSelection: false, isResponsive: false, editSettings: {
                    allowEditing: false,
                    allowAdding: false,
                    allowDeleting: false,
                    showDeleteConfirmDialog: false,
                    showConfirmDialog: false
                }, create: (args) => this.treeGridCreated() }));
        }
        /**
         * Returns the tree grid column definition
         *
         * @private
         * @returns {{}}
         * @memberof WatchablesWidget
         */
        getTreeGridColumnDefinition() {
            return {
                columns: [
                    { field: "displayName", headerText: "Name", isPrimaryKey: true, width: "200" },
                    { field: "displayValue", headerText: "Value", width: "200", isTemplateColumn: true, template: "<div style='padding-left: 20px' id='" + this.mainDivId + WATCHABLE_VALUE_ID + "{{:uiId}}'>0</div>" },
                    { field: "engineeringUnit", headerText: "Unit", width: "100" },
                    { field: "watchableTrend", headerText: "Trend", isTemplateColumn: true, template: "<div id='" + this.mainDivId + WATCHABLE_TREND_ID + "{{:uiId}}'></div>" },
                ],
            };
        }
        /**
         * Returns the tree grid column resize settings
         *
         * @private
         * @returns {{}}
         * @memberof WatchablesWidget
         */
        getTreeGridColumnResizeSupport() {
            return {
                allowColumnResize: true,
                columnResizeSettings: { columnResizeMode: ej.TreeGrid.ColumnResizeMode.FixedColumns },
                columnResized: (args) => this.columnResized(args),
            };
        }
        /**
         * Returns the tree grid toolbar settings
         *
         * @protected
         * @returns {{}}
         * @memberof WatchablesWidget
         */
        getTreeGridToolbarSupport() {
            this._toolbar = new watchablesGridToolbar_1.WatchablesGridToolbar(this.mainDiv);
            return super.getTreeGridToolbarSupport();
        }
        columnResized(args) {
            super.resizeDynamicColumn(args.columnIndex, args.model);
            // Refresh watchable values after resize (treegrid sets the data to "0" after resize)
            this.refreshWatchablesValues(this._watchableParameters);
        }
        /**
         * Add icons to the toolbar treegrid
         *
         * @private
         * @memberof WatchablesWidget
         */
        addTreeGridIcons() {
            this._watchableStateParameters.forEach((stateParameter) => {
                this._toolbar.addIcon(stateParameter);
            });
        }
        /**
         * Disable button properties from icons
         *
         * @private
         * @memberof WatchablesWidget
         */
        updateToolbarIcons() {
            let toolbar = this._toolbar;
            toolbar.hideIcon('empty');
            toolbar.disableIcons();
            toolbar.addEventListeners();
            toolbar.tooltipExtension();
        }
        /**
         *
         * marks the parameters with an id as a reference to the ui
         * @private
         * @param {MappCockpitComponentParameter[]} watchableParameters
         * @memberof WatchablesWidget
         */
        setWatchablesUiId(watchableParameters) {
            for (let i = 0; i < watchableParameters.length; i++) {
                const watchableParameter = watchableParameters[i];
                watchableParameter.uiId = i;
            }
        }
        /**
         * Populate the widget with its specific data content.
         *
         * @memberof WatchablesWidget
         */
        populateWatchablesWidget() {
            this.setWatchablesUiId(this._watchableParameters);
            $(this.mainDiv).ejTreeGrid({
                dataSource: this._watchableParameters,
                toolbarSettings: {
                    customToolbarItems: this._toolbar.getCustomToolbars()
                },
            });
        }
        /**
         * Samples the watchable values
         *
         * @private
         * @param {MappCockpitComponentParameter[]} watchableParameters
         * @memberof WatchablesWidget
         */
        sampleWatchables(watchableParameters) {
            watchableParameters.forEach((watchableParameter) => {
                // update the trend buffer
                this.addWatchableTrendValue(watchableParameter);
            });
        }
        /**
         * Refreshes the watchables trend fields
         *
         * @private
         * @param {MappCockpitComponentParameter[]} watchableParameters
         * @memberof WatchablesWidget
         */
        refreshWatchablesTrend(watchableParameters) {
            watchableParameters.forEach((watchableParameter) => {
                let watchableTrendElement = this.getWatchableTrendElement(watchableParameter);
                if (watchableTrendElement && domHelper_1.DomHelper.isElementInViewport(watchableTrendElement)) {
                    let watchableTrendFieldId = "#" + watchableTrendElement.id;
                    // update the trend field
                    this.refreshWatchableTrendField(watchableParameter, watchableTrendFieldId);
                }
            });
        }
        /**
         * refreshes the content of the watchable value fields
         *
         * @private
         * @param {MappCockpitComponentParameter[]} watchableParameters
         * @memberof WatchablesWidget
         */
        refreshWatchablesValues(watchableParameters) {
            watchableParameters.forEach((watchableParameter) => { this.refreshWatchableValueField(watchableParameter); });
        }
        /**
         * Gets an element corresponding to the parameter to be used for displaying the watchable value
         *
         * @private
         * @param {MappCockpitComponentParameter} watchableParameter
         * @returns
         * @memberof WatchablesWidget
         */
        getWatchableValueElement(watchableParameter) {
            var mySubDiv = this.mainDiv.querySelector("#" + this.mainDivId + WATCHABLE_VALUE_ID + watchableParameter.uiId);
            return mySubDiv;
        }
        /**
         * Gets an element corresponding to the parameter to be used for displaying the watchable trend line
         *
         * @private
         * @param {MappCockpitComponentParameter} watchableParameter
         * @returns {(HTMLElement | null)}
         * @memberof WatchablesWidget
         */
        getWatchableTrendElement(watchableParameter) {
            var mySubDiv = this.mainDiv.querySelector("#" + this.mainDivId + WATCHABLE_TREND_ID + watchableParameter.uiId);
            return mySubDiv;
        }
        /**
         * updates a watchable field with the current values of the corresponding parameter
         *
         * @private
         * @param {MappCockpitComponentParameter} watchableParameter
         * @memberof WatchablesWidget
         */
        refreshWatchableValueField(watchableParameter) {
            // get the corresponding ui element
            let watchableValueElement = this.getWatchableValueElement(watchableParameter);
            // let minValue = this._watchableTrendValues[watchableParameter.browseName]._minValue;
            // let maxValue = this._watchableTrendValues[watchableParameter.browseName]._maxValue;
            // let valueString: string = watchableParameter.displayValue.toString() + "(" + minValue + "-" + maxValue + ")";
            let valueString = watchableParameter.displayValue.toString();
            if (watchableValueElement) {
                watchableValueElement.innerHTML = valueString;
            }
        }
        /**
         * refreshes the visible trend filed content
         *
         * @param {MappCockpitComponentParameter} watchableParameter
         * @param {string} watchableTrendFieldId
         * @memberof WatchablesWidget
         */
        refreshWatchableTrendField(watchableParameter, watchableTrendFieldId) {
            let watchableTrendData = this.getWatchableTrendValues(watchableParameter);
            this.renderWatchableTrend(watchableTrendFieldId, watchableTrendData);
        }
        /**
         * gets the trend values for the watchable parameter
         *
         * @private
         * @param {MappCockpitComponentParameter} watchableParameter
         * @returns {Array<any>}
         * @memberof WatchablesWidget
         */
        getWatchableTrendValues(watchableParameter) {
            let trendValues = [];
            if (this._watchableTrendValues[watchableParameter.browseName]) {
                trendValues = this._watchableTrendValues[watchableParameter.browseName].values;
            }
            return trendValues;
        }
        /**
         * renders a short history of trends
         *
         * @private
         * @param {string} watchableTrendFieldId
         * @param {number[]} watchableTrendData
         * @returns
         * @memberof WatchablesWidget
         */
        renderWatchableTrend(watchableTrendFieldId, watchableTrendData) {
            // get the trend cell
            let $trendCell = $(watchableTrendFieldId);
            let $sparkInstance = $(watchableTrendFieldId + "_sparkline_svg");
            // create a new sparkline instance if not already existing
            if ($sparkInstance.length === 0) {
                this.createWatchableTrendView($trendCell, watchableTrendData);
            }
            else {
                // update the trendline with new data
                this.updateWatchableTrendView($trendCell, watchableTrendData);
            }
        }
        /**
         * updates the trend view with new data
         *
         * @private
         * @param {JQuery<HTMLElement>} $trendCell
         * @param {number[]} watchableTrendData
         * @memberof WatchablesWidget
         */
        updateWatchableTrendView($trendCell, watchableTrendData) {
            $trendCell.ejSparkline({
                dataSource: watchableTrendData,
            });
        }
        /**
         *
         * creates a new instance of a watchable trend view
         * @private
         * @param {JQuery<HTMLElement>} jqtrendCell
         * @param {number[]} watchableTrendData
         * @memberof WatchablesWidget
         */
        createWatchableTrendView($trendCell, watchableTrendData) {
            $trendCell.ejSparkline({
                dataSource: watchableTrendData,
                width: 2,
                stroke: "#C4C4C4",
                type: "line",
                size: { height: 28, width: $trendCell.width() },
                isResponsive: false,
                padding: 2,
            });
        }
        /**
         * Observes the watchables for changes
         *
         * @param {MappCockpitComponentParameter[]} watchableParameters
         * @memberof WatchablesWidget
         */
        observeWatchables(watchableParameters) {
            // invoke observing the watchables first ....
            mappCockpitComponent_1.MappCockpitComponentParameter.observeParameterValueChanges(this, watchableParameters);
            // and then observe watchables inside each watchable state expression
            this.observeWatchablesInStateExpression(watchableParameters);
        }
        /**
         * called after changes of observables
         *
         * @param {Observable[]} changedObservables
         * @memberof WatchablesWidget
         */
        onObservablesChanged(changedObservables) {
            console.log("onObservablesChanged: %o %o", this, changedObservables);
            changedObservables.forEach((observable) => {
                if (observable.property === "Value") {
                    let watchableParameter = observable.object;
                    this.onWatchableValueChanged(watchableParameter);
                }
            });
        }
        /**
         * Send watchables to state expression to be observed
         *
         * @private
         * @param {MappCockpitComponentParameter[]} watchableParameters
         * @memberof WatchablesWidget
         */
        observeWatchablesInStateExpression(watchableParameters) {
            this._watchableStateParameters.forEach((state) => {
                let observedWatchables = watchableParameters.filter((watchable) => state.stateExpression.watchableMapping.has(watchable.browseName));
                state.stateExpression.observeWatchables(observedWatchables);
                //attach event listener
                state.stateExpression.eventIconUpdated.attach(this._watchableIconUpdateHandler);
            });
        }
        /**
         * Handles the value change of a watchable parameter
         *
         * @private
         * @param {MappCockpitComponentParameter} watchableParameter
         * @memberof WatchablesWidget
         */
        onWatchableValueChanged(watchableParameter) {
            // refresh the value field.
            this.refreshWatchableValueField(watchableParameter);
        }
        /**
         * Called when watchable icon is updated
         *
         * @private
         * @param {*} sender
         * @param {{name: string, watchableIcon: WatchableIcon}} args
         * @memberof WatchablesWidget
         */
        onWatchableIconUpdated(sender, args) {
            this._toolbar.updateIcon(args.name, args.watchableIcon);
        }
        /**
         * Adds a new value to the parameters trend buffer
         *
         * @private
         * @param {MappCockpitComponentParameter} watchableParameter
         * @memberof WatchablesWidget
         */
        addWatchableTrendValue(watchableParameter) {
            // filter numbers and boolean values to be recorded
            if (typeof watchableParameter.value === "number" || typeof watchableParameter.value === "boolean") {
                this._watchableTrendValues[watchableParameter.browseName].push(watchableParameter.value);
            }
        }
        /**
         * activates WatchablesWidget
         *
         * @memberof WatchablesWidget
         */
        activate() {
            console.log("WatchablesWidget activated");
            mappCockpitComponent_1.MappCockpitComponentParameter.activateComponentModelItems(this, this._watchableParameters);
        }
        /**
         * deactivates WatchablesWidget
         *
         * @memberof WatchablesWidget
         */
        deactivate() {
            console.log("WatchablesWidget deactivated");
            mappCockpitComponent_1.MappCockpitComponentParameter.deactivateComponentModelItems(this, this._watchableParameters);
        }
        /**
         * disposes WatchablesWidget
         *
         * @memberof WatchablesWidget
         */
        dispose() {
            var _a;
            this.stopSamplingTimer();
            this.stopTrendTimer();
            mappCockpitComponent_1.MappCockpitComponentParameter.unobserveAll(this, (_a = this._watchableParameters[0]) === null || _a === void 0 ? void 0 : _a.component);
            // detach event listeners
            this._watchableStateParameters.forEach((state) => {
                state.stateExpression.eventIconUpdated.detach(this._watchableIconUpdateHandler);
            });
            super.dispose();
        }
    };
    WatchablesWidget = __decorate([
        mco.role()
    ], WatchablesWidget);
    exports.WatchablesWidget = WatchablesWidget;
});
