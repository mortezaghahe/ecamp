var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../framework/events", "./chartViewWidget", "../splitterWidget/splitterDefinition", "../../common/persistence/persistDataProvider", "../common/splitterComponentSettings"], function (require, exports, events_1, chartViewWidget_1, splitterDefinition_1, persistDataProvider_1, splitterComponentSettings_1) {
    "use strict";
    var ChartViewLayoutManager_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartViewLayoutManager = void 0;
    let EventChartViewContentSizeChanged = class EventChartViewContentSizeChanged extends events_1.TypedEvent {
    };
    EventChartViewContentSizeChanged = __decorate([
        mco.role()
    ], EventChartViewContentSizeChanged);
    ;
    let ChartViewLayoutManager = ChartViewLayoutManager_1 = class ChartViewLayoutManager {
        constructor(chartViewWidget, component) {
            this.eventContentSizeChanged = new EventChartViewContentSizeChanged();
            this.chartSplitterParentContainerId = "ChartViewChartSplitterContainer"; // Container needed for scrollbar behavior (switch on/off)
            this.chartSplitterContainerId = "ChartViewChartSplitter"; // TODO: remove if possible => should be Cont31 (look for CSS and use class insted of id)
            this.chartViewToolbarContainerId = "ChartViewToolbar";
            this._chartViewWidgetToolbarButtonClickedHandler = (sender, args) => this.chartViewWidget.onEventToolbarButtonClicked(sender, args);
            this.chartViewWidget = chartViewWidget;
            this._component = component;
        }
        /**
         * initialize layout or chartViewWidget
         *
         * @param {string} containerID
         * @memberof ChartViewLayoutManager
         */
        initializeChartViewLayout() {
            let context = undefined;
            if (this._component != undefined) {
                context = this._component.context;
            }
            this.chartViewtoolbar = this._component.addSubComponent("ChartViewToolbar", "ChartViewToolbar", "", context);
            this.addChartViewToolbarToView(this.chartViewtoolbar, this.chartViewWidget.view);
            this.chartViewtoolbar.initialize();
            // add widget to the parent container
            this.chartViewtoolbar.addToParentContainerId(this.chartViewToolbarContainerId);
            this.chartViewtoolbar.eventToolbarButtonClicked.attach(this._chartViewWidgetToolbarButtonClickedHandler);
            this.initializeChartSplitter(this.chartSplitterContainerId);
        }
        /**
         * Dispose the chart view layout manager
         *
         * @memberof ChartViewLayoutManager
         */
        dispose() {
            if (this.chartViewtoolbar != undefined) {
                this.chartViewtoolbar.eventToolbarButtonClicked.detach(this._chartViewWidgetToolbarButtonClickedHandler);
                this.chartViewtoolbar.dispose();
            }
            if (this.chartSplitter != undefined) {
                this.chartSplitter.dispose();
            }
        }
        /**
         * adds the toolbar to the view explicitly.
         *
         * @param {IView} view
         * @memberof ChartViewLayoutManager
         */
        addChartViewToolbarToView(chartViewToolbar, view) {
            if (view) {
                view.addWidget(chartViewToolbar);
            }
        }
        /**
         * add needed containers for chartView
         *
         * @param {*} chartViewContainerDiv
         * @memberof ChartViewLayoutManager
         */
        addChartViewContainers(chartViewContainerDiv) {
            this.addChartViewToolbarContainer(chartViewContainerDiv);
            this.addChartSplitterContainer(chartViewContainerDiv);
        }
        /**
         * resize layout
         *
         * @param {number} width
         * @param {number} height
         * @memberof ChartViewLayoutManager
         */
        resize(width, height) {
            this.chartSplitter.resize(width, height);
        }
        /**
         *initialize chartSplitter
         *
         * @private
         * @param {string} containerID
         * @memberof ChartViewLayoutManager
         */
        initializeChartSplitter(containerID) {
            let defaultChartSplitterDefinitionId = "ChartSplitterDefinitionId";
            persistDataProvider_1.PersistDataProvider.getInstance().setDefaultDataWithId(defaultChartSplitterDefinitionId, ChartViewLayoutManager_1.getDefaultChartSplitterDefinition());
            this.chartSplitter = this._component.addSubComponent("SplitterWidget", containerID, defaultChartSplitterDefinitionId);
            this.chartSplitter.setDefaultComponentSettingsDataId(defaultChartSplitterDefinitionId);
            this.chartSplitter.initialize();
            // add widget to the parent container
            this.chartSplitter.addToParentContainerId(containerID);
        }
        static getDefaultChartSplitterDefinition() {
            let splitterComponentSettings = new splitterComponentSettings_1.SplitterComponentSettings(splitterDefinition_1.SplitterDefinition.orientationVertical, false);
            return splitterComponentSettings;
        }
        /**
         * Adds a chart splitter container div to the given chart view container
         *
         * @param {*} chartViewContainerId
         * @returns {string}
         * @memberof ChartViewLayoutManager
         */
        addChartSplitterContainer(chartViewContainerDiv) {
            var rect = chartViewContainerDiv[0].getBoundingClientRect();
            var splitterHeight = $(window).height() - rect.top;
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '.splitterStyle { height: ' + splitterHeight + 'px }';
            document.getElementsByTagName('head')[0].appendChild(style);
            chartViewContainerDiv.append("<div style='overflow: hidden auto; flex: 1' class='content' id='" + this.chartSplitterParentContainerId + "'> </div>");
            $("#" + this.chartSplitterParentContainerId).append("<div style='overflow: hidden auto' class='content' id='" + this.chartSplitterContainerId + "'> </div>");
        }
        /**
         * Adds a toolbar container div to the given chart view container
         *
         * @private
         * @param {JQuery<HTMLElement>} chartViewContainerDiv
         * @memberof ChartViewLayoutManager
         */
        addChartViewToolbarContainer(chartViewContainerDiv) {
            var toolbarContainerDiv = document.createElement("div");
            toolbarContainerDiv.id = this.chartViewToolbarContainerId;
            toolbarContainerDiv.classList.add("content");
            toolbarContainerDiv.style.overflow = "hidden";
            chartViewContainerDiv.append(toolbarContainerDiv);
        }
        /**
         * updateCharts by rereading series in all charts
         *      *
         * @param {Array<ITraceChart>} traceChartList
         * @memberof ChartViewLayoutManager
         */
        updateCharts(traceChartList) {
            for (let i = 0; i < traceChartList.length; i++) {
                traceChartList[i].setAvailableSeriesAsDataSource();
            }
        }
        /**
         * returns ZoomAxes for a given string, undefined if string does not equal any axis
         *
         * @param {string} zoomAxesString
         * @returns {(ZoomAxes|undefined)}
         * @memberof ChartViewLayoutManager
         */
        getZoomAxesFromString(zoomAxesString) {
            switch (zoomAxesString) {
                case "X":
                    return chartViewWidget_1.ZoomDirection.X;
                case "Y":
                    return chartViewWidget_1.ZoomDirection.Y;
                case "XY":
                    return chartViewWidget_1.ZoomDirection.XY;
                default:
                    return undefined;
            }
        }
        /**
         * Get height of pane from chartSplitter persisted pane
         *
         * @param {string} chartName
         * @returns {number}
         * @memberof SplitterWidget
         */
        getChartViewSplitterHeight(paneDefinitions, chartName) {
            for (var i = 0; i < paneDefinitions.length; i++) {
                if (paneDefinitions[i].paneData != undefined) {
                    if (paneDefinitions[i].paneData.data != undefined && paneDefinitions[i].componentDefinition.id == chartName) {
                        return paneDefinitions[i].paneData.data.size;
                    }
                }
            }
            //Return default size if there is no data available
            return 300;
        }
    };
    ChartViewLayoutManager = ChartViewLayoutManager_1 = __decorate([
        mco.role()
    ], ChartViewLayoutManager);
    exports.ChartViewLayoutManager = ChartViewLayoutManager;
});
