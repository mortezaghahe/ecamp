var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/layoutWidgetBase", "./layoutPane", "../common/viewTypeProvider", "../common/uniqueIdGenerator", "./splitterPaneDefinition", "./splitterDefinition", "../../common/componentFactory/componentDefinition", "../common/widgetBase", "../common/paneProperties"], function (require, exports, layoutWidgetBase_1, layoutPane_1, viewTypeProvider_1, uniqueIdGenerator_1, splitterPaneDefinition_1, splitterDefinition_1, componentDefinition_1, widgetBase_1, paneProperties_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SplitterWidget = void 0;
    let SplitterWidget = class SplitterWidget extends layoutWidgetBase_1.LayoutWidgetBase {
        constructor() {
            super(...arguments);
            this._orientation = ej.Orientation.Horizontal;
            this._isResponsive = true;
            this._defaultSplitterSize = 9; // TODO get actual splitter size 
        }
        /**
         * Initialize the splitter widget
         *
         * @param {number} [headerHeight=0]
         * @memberof SplitterWidget
         */
        initialize() {
            this._actualWidth = 1000;
            this._actualHeight = 400;
            this.layoutPanes = new Array();
            super.initialize();
        }
        /**
         * Sets the orientation of the splitters in the widget (vertical or horizontal)
         *
         * @param {string} orientation
         * @memberof SplitterWidget
         */
        setOrientation(orientation) {
            if (orientation == splitterDefinition_1.SplitterDefinition.orientationVertical) {
                this._orientation = ej.Orientation.Vertical;
            }
            else if (orientation == splitterDefinition_1.SplitterDefinition.orientationHorizontal) {
                this._orientation = ej.Orientation.Horizontal;
            }
        }
        /**
         * Returns the orientation of the splitters in the widget (vertical or horizontal)
         *
         * @returns {string}
         * @memberof SplitterWidget
         */
        getOrientation() {
            if (this._orientation == ej.Orientation.Vertical) {
                return splitterDefinition_1.SplitterDefinition.orientationVertical;
            }
            else if (this._orientation == ej.Orientation.Horizontal) {
                return splitterDefinition_1.SplitterDefinition.orientationHorizontal;
            }
            return "";
        }
        getResponsive() {
            return this._isResponsive;
        }
        setResponsive(isResponsive) {
            this._isResponsive = isResponsive;
            this._actualHeight = 400;
        }
        /**
         * Creates the splitter widget
         *
         * @memberof SplitterWidget
         */
        createLayout() {
            $(this.mainDiv).ejSplitter({
                isResponsive: true,
                orientation: ej.Orientation.Horizontal,
                allowKeyboardNavigation: false,
                // Set a default size => Needed for inactive splitter windows to avoid AddItem problems
                width: "400px",
                height: "400px",
                resize: (args) => {
                    this.onSplitterResize(args);
                },
                create: (args) => {
                    this.mainDiv.style.padding = "0px";
                }
            });
        }
        /**
         * Sets the actual layout panes definitions to the ejsplitter
         *
         * @memberof SplitterWidget
         */
        recalculateLayout() {
            var splitter = this.getSplitter();
            // Set orientation before get properties to the correct paneSizes(height/width)
            splitter.option("orientation", this._orientation);
            var properties = this.getProperties(splitter);
            let keys = Object.keys(this.layoutPanes);
            if (properties.length != keys.length) {
                throw (new Error("properties.length != this.layoutPanes.length"));
            }
            this.updatePropertiesInformationsWithLayoutPanesData(properties);
            this.setPanePropertiesToSplitter(splitter, properties);
            if (this._isResponsive == false) {
                // create default first pane, which will be needed for drag&drop of new widgets to the splitter widget
                let splitter = this.getSplitter();
                let newItem = splitter.addItem("<div id='" + this.getLastPaneId() + "' style='overflow:hidden; width:100%; height:100%'></div>", { paneSize: 400, expandable: false, collapsible: false }, 0);
            }
        }
        /**
         * resizes the splitter widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof SplitterWidget
         */
        resize(width, height) {
            if (this._isResponsive) {
                this._actualHeight = height;
            }
            this._actualWidth = width;
            this.resizeSplitter(this._actualWidth, this._actualHeight - this._headerHeight);
            this.resizeSplitterPaneContents(this._actualWidth, this._actualHeight - this._headerHeight);
        }
        /**
         * Loads the styles for the splitter widget
         *
         * @memberof SplitterWidget
         */
        loadStyles() {
            // TODO: get div from _layoutContainerId
            //super.addStyleToContentId("#" + this._layoutContainerId, "widgets/splitterWidget/style/css/splitterStyle.css");
            //super.addStyleToContentId("#" + this._layoutContainerId, "widgets/common/style/css/widgetHeaderFooterStyle.css");
        }
        /**
         * Activates all the widget in the different splitter panes
         *
         * @memberof SplitterWidget
         */
        activate() {
            this._widgets.forEach((widget) => {
                if (widget != undefined) {
                    widget.activate();
                }
            });
        }
        /**
         * Deactivates all the widget in the different splitter panes
         *
         * @memberof SplitterWidget
         */
        deactivate() {
            this._widgets.forEach((widget) => {
                if (widget != undefined) {
                    widget.deactivate();
                }
            });
        }
        /**
         * Disposes the widget
         *
         * @memberof SplitterWidget
         */
        dispose() {
            this.component.disablePersisting();
            super.dispose();
            this._widgets.forEach((widget) => {
                if (widget != undefined) {
                    widget.dispose();
                }
            });
        }
        getComponentSettings(onlyModified) {
            this.component.setSetting(splitterDefinition_1.SplitterDefinition.splitterDefinitionId, this.getSplitterDefinition());
            return super.getComponentSettings(onlyModified);
        }
        setComponentSettings(data) {
            if (data != undefined) {
                super.setComponentSettings(data);
                let splitterDefinition = this.component.getSetting(splitterDefinition_1.SplitterDefinition.splitterDefinitionId);
                if (splitterDefinition != undefined) {
                    this.setSplitterDefinition(splitterDefinition);
                }
            }
        }
        getSplitterDefinition() {
            let splitterDefinition = new splitterDefinition_1.SplitterDefinition(this.getOrientation(), this.getResponsive());
            splitterDefinition.paneDefinitions = this.getSplitterPaneDefinitions();
            return splitterDefinition;
        }
        setSplitterDefinition(splitterDefinition) {
            let splitterOrientation = splitterDefinition.orientation;
            let splitterResponsive = splitterDefinition.responsive;
            let paneDefinitions = splitterDefinition.paneDefinitions;
            if (paneDefinitions == undefined) {
                return;
            }
            // Set splitter panes
            this.setSplitterPaneDefinitions(paneDefinitions);
            // Set orientation of splitter panes
            this.setOrientation(splitterOrientation);
            // Set responsive of splitter
            this.setResponsive(splitterResponsive);
            this.recalculateLayout();
        }
        getSplitterPaneDefinitions() {
            let paneDefinitions = new Array();
            this._widgets.forEach((widget, key) => {
                if (widget != undefined) {
                    let componentDefinition = new componentDefinition_1.ComponentDefinition("", "", "");
                    componentDefinition.set(widget.component.getDefinition());
                    let paneSettings = undefined;
                    let layoutPane = this.getLayoutPane(key);
                    if (layoutPane != undefined) {
                        paneSettings = layoutPane.getSettings();
                    }
                    else {
                        console.error("LayoutPane not defined!");
                    }
                    paneDefinitions.push(new splitterPaneDefinition_1.SplitterPaneDefinition(componentDefinition, paneSettings));
                }
            });
            return paneDefinitions;
        }
        getLayoutPane(key) {
            let layoutPane;
            layoutPane = this.layoutPanes.filter(element => { return element.name == key; });
            return layoutPane[0];
        }
        setSplitterPaneDefinitions(paneDefinitions) {
            // Create splitter panes and add widgets
            for (let i = 0; i < paneDefinitions.length; i++) {
                if (paneDefinitions[i] != undefined) {
                    let componentDefinition = paneDefinitions[i].componentDefinition;
                    if (this.component.componentFactory != undefined) {
                        let component = this.component.addSubComponent(componentDefinition.type, componentDefinition.id, componentDefinition.defaultSettingsDataId, this.component.context);
                        if (component != undefined) {
                            // check if instance is a widget
                            if (component instanceof widgetBase_1.WidgetBase) {
                                let widget = component;
                                let splitterStoringDataId = componentDefinition.defaultSettingsDataId;
                                if (splitterStoringDataId != "") {
                                    widget.setDefaultComponentSettingsDataId(splitterStoringDataId);
                                }
                                this.addWidget(widget, componentDefinition.id, viewTypeProvider_1.ViewType.Default, new paneProperties_1.PaneProperties());
                            }
                        }
                        else {
                            if (componentDefinition.type != "ChartBase") { // "ChartBase" currently not implemented => TODO: create charts with componentfactory
                                console.warn("Component with component type '" + componentDefinition.type + "' could not be created!");
                            }
                        }
                    }
                    else {
                        console.error("ComponentFactory not available!");
                    }
                }
            }
            // Set splitter pane sizes
            let i = 0;
            for (let key in this.layoutPanes) {
                let layoutPane = this.layoutPanes[key];
                if (paneDefinitions[i].paneData != undefined) {
                    layoutPane.setSettings(paneDefinitions[i].paneData); // TODO: paneData
                }
                i++;
            }
        }
        /**
         * Get pane definitions from chartSplitter component
         *
         * @returns {Array<SplitterPaneDefinition>}
         * @memberof SplitterWidget
         */
        getChartViewSplitterPaneDefinitions() {
            let settings = this.component.getComponentSettings();
            let paneDefinitions = new Array();
            if (settings.data != undefined) {
                if (settings.data.splitterDefinition != undefined) {
                    paneDefinitions = settings.data.splitterDefinition.paneDefinitions;
                }
            }
            return paneDefinitions;
        }
        /**
         * Adds a widget to the splitter => a new pane will be added for the widget to the splitter
         *
         * @param {IWidget} widget
         * @param {string} name
         * @param {ViewType} viewType
         * @param {PaneProperties} paneProperties
         * @memberof SplitterWidget
         */
        addWidget(widget, name, viewType, paneProperties) {
            super.addWidget(widget, name, viewType);
            let splitter = this.getSplitter();
            let properties = this.getProperties(splitter);
            let oldPaneSizes = this.getPaneSizes(properties);
            if (!this._isResponsive && paneProperties.paneSize != -1) {
                this._actualHeight += paneProperties.paneSize + this._defaultSplitterSize;
                this.resizeSplitter(this._actualWidth, this._actualHeight - this._headerHeight);
            }
            let paneId = this.getPaneDivId(name);
            var indexOfNewPane = splitter.model.properties.length;
            this.addPane(splitter, paneId, indexOfNewPane, paneProperties);
            widget.initialize();
            // add widget to the parent container
            widget.addToParentContainerId(paneId);
            this.updateLayoutPanesAfterAddingNewPane(properties, oldPaneSizes, widget, viewType);
            if (!this._isResponsive) {
                this.setPanePropertiesToSplitter(splitter, properties);
                this.resizeSplitterPaneContents(this._actualWidth, this._actualHeight - this._headerHeight);
            }
        }
        /**
         * adds this widget to the given container
         *
         * @param {(HTMLDivElement|undefined)} parentContainer
         * @memberof SplitterWidget
         */
        addToParentContainer(parentContainer) {
            // Adds some additional needed styles for this splitter to the parent container
            this.addStyleToContentId(parentContainer, "widgets/splitterWidget/style/css/splitterStyle.css");
            this.addStyleToContentId(parentContainer, "widgets/common/style/css/widgetHeaderFooterStyle.css");
            super.addToParentContainer(parentContainer);
        }
        /**
         * Removes a widget(pane) from the splitter
         *
         * @param {IWidget} widget
         * @memberof SplitterWidget
         */
        removeWidget(widget) {
            let paneIndex = this.getPaneIndex(widget);
            var splitter = this.getSplitter();
            // get all actual paneSizes 
            var properties = this.getProperties(splitter);
            var sizeToRemove = properties[paneIndex].paneSize;
            var paneSizes = this.getPaneSizes(properties);
            paneSizes.splice(paneIndex, 1);
            splitter.removeItem(paneIndex);
            this.adjustChartsDivContainerSize(sizeToRemove);
            let newSplitterHeight = this.adjustSplitterSize(splitter, sizeToRemove);
            for (let i = 0; i < properties.length; i++) {
                properties[i].paneSize = paneSizes[i];
            }
            this.layoutPanes.splice(paneIndex, 1);
            this.removeWidgetFromList(widget);
            this._actualHeight = newSplitterHeight;
            this.setPanePropertiesToSplitter(splitter, properties);
        }
        /**
         * Moves a widget(splitter pane) from the source index to the target index
         * (internal: target index will be decreased by 1 if source index is before target index)
         *
         * @param {number} sourcePaneIndex
         * @param {number} targetPaneIndex
         * @memberof SplitterWidget
         */
        moveWidget(widget, targetPaneIndex) {
            // adds the widget divs to the documents temp
            widget.addToDocumentsTemp();
            let sourcePaneIndex = this.getPaneIndex(widget);
            let splitter = this.getSplitter();
            let layoutPane = this.layoutPanes[sourcePaneIndex];
            targetPaneIndex = this.updataTargetPaneIndex(sourcePaneIndex, targetPaneIndex);
            let originalPaneProperies = this.getPaneProperties(layoutPane);
            let properties = this.getProperties(splitter);
            this.updatePropertiesList(properties, sourcePaneIndex, targetPaneIndex);
            this.removePane(splitter, sourcePaneIndex);
            let paneId = this.getPaneDivId(widget.widgetName);
            this.addPane(splitter, paneId, targetPaneIndex, originalPaneProperies);
            this.updateLayoutPanesListAfterMoving(layoutPane, sourcePaneIndex, targetPaneIndex);
            this.resizeSplitter(this._actualWidth, this._actualHeight - this._headerHeight);
            // adds the widget divs to the new added splitter pane
            widget.addToParentContainerId(paneId);
            widget.flaggedForResize = true;
            this.resizeSplitterPaneContents(this._actualWidth, this._actualHeight - this._headerHeight);
        }
        /**
         * Returns the paneProperties of the given layoutPane
         *
         * @private
         * @param {ILayoutPane} layoutPane
         * @returns {PaneProperties}
         * @memberof SplitterWidget
         */
        getPaneProperties(layoutPane) {
            let paneProperties = new paneProperties_1.PaneProperties();
            paneProperties.collapsible = layoutPane.collapsible;
            paneProperties.expandable = layoutPane.expandable;
            paneProperties.minSize = layoutPane.minimumSize;
            paneProperties.resizable = layoutPane.resizable;
            return paneProperties;
        }
        /**
         * Resize a widget to a new size and adapt the other widgets in this layoutWidget(splitter)
         *
         * @param {IWidget} widget
         * @param {number} newSize
         * @memberof SplitterWidget
         */
        resizeWidget(widget, newSize) {
            let paneIndex = this.getPaneIndex(widget);
            var splitter = this.getSplitter();
            let properties = this.getProperties(splitter);
            // set new pane sizes
            let currentPaneSize = properties[paneIndex].paneSize;
            let paneDiffSize = currentPaneSize - newSize;
            let sizeOfOtherPane = -1;
            let indexOfOtherPane = -1;
            if (paneIndex + 1 >= this.layoutPanes.length) {
                // Last pane size changed => update the size of the pane before
                sizeOfOtherPane = properties[paneIndex - 1].paneSize + paneDiffSize;
                indexOfOtherPane = paneIndex - 1;
            }
            else {
                // Update the following pane size
                sizeOfOtherPane = properties[paneIndex + 1].paneSize + paneDiffSize;
                indexOfOtherPane = paneIndex + 1;
            }
            if (sizeOfOtherPane < 0) {
                // Avoid resizing the following pane(or the pane before) to a size smaller then 0
                let oldValue = Math.abs(sizeOfOtherPane);
                sizeOfOtherPane = 50;
                newSize = newSize - oldValue - 50;
            }
            this.layoutPanes[indexOfOtherPane].size = sizeOfOtherPane;
            properties[indexOfOtherPane].paneSize = sizeOfOtherPane;
            this.layoutPanes[paneIndex].size = newSize;
            properties[paneIndex].paneSize = newSize;
            // Updates the splitters
            this.setPanePropertiesToSplitter(splitter, properties);
            // updates the contents in the splitters
            this.resizeSplitterPaneContents(this._actualWidth, this._actualHeight);
        }
        /**
         * Returns the ejSplitter data object
         *
         * @private
         * @returns
         * @memberof SplitterWidget
         */
        getSplitter() {
            return $(this.mainDiv).data("ejSplitter");
        }
        /**
         * Returns the sizes of all panes together, incl. the dynamic pane
         *
         * @private
         * @returns {number}
         * @memberof SplitterWidget
         */
        /*private sumOfDefinedLayoutPaneSizes(): number{
            let sum: number = 0;
            for(let key in this.layoutPanes) {
                let layoutPane =  this.layoutPanes[key];
                if(layoutPane != undefined){
                    sum += layoutPane.size;
                }
            }
            return sum;
        }*/
        /**
         * Returns the sizes of all panes together, without the size of the dynamic pane but including the splitter size(e.g. 9px)
         *
         * @private
         * @returns {number}
         * @memberof SplitterWidget
         */
        sumOfDefinedPaneSizes() {
            let sum = 0;
            let index = 0;
            for (let key in this.layoutPanes) {
                let layoutPane = this.layoutPanes[key];
                if (layoutPane == undefined) {
                    continue;
                }
                else {
                    if (layoutPane.fillSpace == false) {
                        sum += layoutPane.size;
                    }
                    if (index > 0) {
                        let splitterSize = this._defaultSplitterSize;
                        sum += splitterSize; // Add size of splitter
                    }
                }
                index++;
            }
            return sum;
        }
        /**
         * if the pane sizes are too big for the current window size, the panes would be decreased in size
         *
         * @private
         * @param {number} size
         * @memberof SplitterWidget
         */
        adoptLayoutPanesToFitCurrentSize(size) {
            let sumOfPanesWitoutDynamic = this.sumOfDefinedPaneSizes();
            let neededSize = sumOfPanesWitoutDynamic - size;
            if (neededSize > 0) {
                // TODO: get last not dynamic pane
                let lastPane = this.layoutPanes[this.layoutPanes.length - 1];
                if (lastPane.size - neededSize < 0) {
                    // Needed space is greater then the last pane size
                    // Set last pane size to 0 (TODO: If splitter with more then 3 colums are available where one is dynamic, the pane before the last one should maybe also be adapted)
                    lastPane.size = 0;
                }
                else {
                    lastPane.size = lastPane.size - neededSize;
                }
            }
        }
        /**
         * Adds a new pane at the given index with the given size
         *
         * @private
         * @param {ej.Splitter} splitter
         * @param {string} paneId
         * @param {number} indexOfNewPane
         * @param {PaneProperties} paneProperties
         * @memberof SplitterWidget
         */
        addPane(splitter, paneId, indexOfNewPane, paneProperties) {
            let newItem;
            if (!this._isResponsive && paneProperties.paneSize != -1) {
                if (indexOfNewPane == 0) {
                    indexOfNewPane++;
                }
                newItem = splitter.removeItem(indexOfNewPane - 1);
                newItem = splitter.addItem("<div id='" + paneId + "' style='overflow:hidden; width:100%; height:100%''></div>", { paneSize: paneProperties.paneSize, expandable: paneProperties.expandable, collapsible: paneProperties.collapsible, minSize: paneProperties.minSize }, indexOfNewPane - 1);
                //Check splitter size: Increase height of splitter if it is not big enough to insert a new chart
                if (!this.hasPaneMinSize(splitter)) {
                    this.resizeSplitter(this._actualWidth, this._actualHeight + 1);
                }
                newItem = splitter.addItem("<div id='" + this.getLastPaneId() + "' style='overflow:hidden; width:100%; height:100%'></div>", { paneSize: 400, expandable: false, collapsible: false }, indexOfNewPane);
            }
            else {
                newItem = splitter.addItem("<div id='" + paneId + "' style='overflow:hidden; width:100%; height:100%''></div>", { paneSize: paneProperties.paneSize, expandable: paneProperties.expandable, collapsible: paneProperties.collapsible, minSize: paneProperties.minSize }, indexOfNewPane);
            }
            if (newItem.toString() == "") {
                console.error("ERROR: splitter.addItem");
            }
            else {
                newItem[0].style.overflow = "hidden";
            }
        }
        /**
         * Returns the div id of the last pane
         *
         * @returns {string}
         * @memberof SplitterWidget
         */
        getLastPaneId() {
            return this.mainDivId + "_lastPane";
        }
        /**
         * Returns the div id of a pane for the given widgetname
         *
         * @private
         * @param {string} name
         * @returns {string}
         * @memberof SplitterWidget
         */
        getPaneDivId(name) {
            return this.mainDivId + "pane_" + name.replace(" ", "");
        }
        /**
         *  Removes the pane with the given index from the splitter
         *
         * @private
         * @param {*} splitter
         * @param {number} paneIndex
         * @memberof SplitterWidget
         */
        removePane(splitter, paneIndex) {
            splitter.removeItem(paneIndex);
        }
        updateLayoutPanesAfterAddingNewPane(properties, oldPaneSizes, widget, viewType) {
            if (this._isResponsive) {
                this.updataLayoutPanesAfterAddingNewPaneResponsive(properties, widget);
            }
            else {
                oldPaneSizes[oldPaneSizes.length - 1] = undefined;
                for (let i = 0; i < properties.length - 1; i++) {
                    let name = "";
                    if (oldPaneSizes[i] != undefined) {
                        properties[i].paneSize = oldPaneSizes[i];
                        name = this.layoutPanes[i].name;
                    }
                    if (name === "") {
                        name = widget.widgetName + "_" + viewType.toString();
                        name = uniqueIdGenerator_1.UniqueIdGenerator.getInstance().getUniqueIdFromString(name);
                        name = name.replace(/[&\/\\#,+( )$~%.'":*?<>{}]/g, '_');
                    }
                    let paneWidget = widget;
                    if (this.layoutPanes[i] != undefined) {
                        paneWidget = this.layoutPanes[i].widget;
                    }
                    this.layoutPanes[i] = new layoutPane_1.LayoutPane(name, properties[i].paneSize, paneWidget, false, true, properties[i].expandable, properties[i].collapsible, properties[i].minSize);
                }
            }
        }
        updataLayoutPanesAfterAddingNewPaneResponsive(properties, widget) {
            for (let i = 0; i < properties.length; i++) {
                let name = "";
                let j = 0;
                this._widgets.forEach((value, key) => {
                    if (j == i) {
                        name = key;
                    }
                    j++;
                });
                let paneWidget = widget;
                if (this.layoutPanes[i] != undefined) {
                    paneWidget = this.layoutPanes[i].widget;
                }
                this.layoutPanes[i] = new layoutPane_1.LayoutPane(name, properties[i].paneSize, paneWidget, false, true, properties[i].expandable, properties[i].collapsible, properties[i].minSize);
            }
        }
        /**
         * Updates the properties with the informations from the layoutPane definitions;
         * Size of dynamic pane will be calculated by using the actual widget size
         *
         * @private
         * @param {*} properties
         * @memberof SplitterWidget
         */
        updatePropertiesInformationsWithLayoutPanesData(properties) {
            let index = 0;
            if (this.layoutPanes.length > 1) {
                if (this.layoutPanes[this.layoutPanes.length - 1].size < 1) {
                    // Set the size of the last pane to at least 3px ...
                    this.layoutPanes[this.layoutPanes.length - 1].size = 3;
                    // ... and decrease the pane before the last pane, otherwise the layout can not be reloaded correct if a browser zoom is used
                    this.layoutPanes[this.layoutPanes.length - 2].size = this.layoutPanes[this.layoutPanes.length - 2].size - 3;
                }
            }
            for (let key in this.layoutPanes) {
                let layoutPane = this.layoutPanes[key];
                if (layoutPane == undefined) {
                    continue;
                }
                else {
                    if (layoutPane.fillSpace == false) {
                        properties[index].paneSize = layoutPane.size;
                    }
                    else {
                        let size = this._actualWidth;
                        if (this._orientation == ej.Orientation.Vertical) {
                            size = this._actualHeight;
                        }
                        properties[index].paneSize = size - this.sumOfDefinedPaneSizes();
                    }
                    properties[index].expandable = layoutPane.expandable;
                    properties[index].collapsible = layoutPane.collapsible;
                    properties[index].resizable = layoutPane.resizable;
                    properties[index].minSize = layoutPane.minimumSize;
                }
                index++;
            }
        }
        /**
         * resize the splitter and update the splitter panesizes
         *
         * @private
         * @param {number} width
         * @param {number} height
         * @memberof SplitterWidget
         */
        resizeSplitter(width, height) {
            let splitter = this.getSplitter();
            splitter.option("width", width, true);
            splitter.option("height", height, true);
            let properties = this.getProperties(splitter);
            this.updatePaneProperties(properties, width, height);
            this.setPanePropertiesToSplitter(splitter, properties);
        }
        /**
         * Return true if splitter has enough size to insert all necessary charts.
         *
         * @private
         * @param {ej.Splitter} splitter
         * @returns {boolean}
         * @memberof SplitterWidget
         */
        hasPaneMinSize(splitter) {
            let minHeight = 0;
            let sumOfPaneHeights = minHeight;
            if (splitter.model.properties && splitter.model.properties.length > 0) {
                //Min height of splitter => lastPaneSize + bar size (409) + minSize of all charts + the bar height between charts(9)
                minHeight = 409 + (splitter.model.properties.length - 1) * 9;
                sumOfPaneHeights = (splitter.model.properties.length - 1) * 9;
                splitter.model.properties.forEach(pane => {
                    minHeight += pane.minSize;
                    sumOfPaneHeights += pane.paneSize;
                });
            }
            if (sumOfPaneHeights >= minHeight) {
                return true;
            }
            else {
                return false;
            }
        }
        /**
         * Updates the panesize in the properties for the new height/width
         *
         * @private
         * @param {*} properties
         * @param {number} width
         * @param {number} height
         * @memberof SplitterWidget
         */
        updatePaneProperties(properties, width, height) {
            // Set all know pane sizes
            this.setKnownPaneSizes(properties);
            // Set all dynamic pane sizes
            this.setDynamicPaneSizes(properties, width, height);
            // Check if sizes(properties) fit into available space and update sizes
            this.checkAndUpdateProperties(properties, width, height);
        }
        /**
         * Check if sizes(properties) fit into available space. If not then reduce the size of first pane to max available and the other ones to 1 pixel
         *
         * @private
         * @param {*} properties
         * @param {number} width
         * @param {number} height
         * @memberof SplitterWidget
         */
        checkAndUpdateProperties(properties, width, height) {
            let availableSize = width;
            if (this._orientation == ej.Orientation.Vertical) {
                availableSize = height;
            }
            let splitterBarSizes = (properties.length - 1) * this._defaultSplitterSize;
            if (properties[0].paneSize + splitterBarSizes > availableSize) { // first pane bigger than available place
                let otherPanesCount = properties.length - 1;
                properties[0].paneSize = availableSize - splitterBarSizes - otherPanesCount; // Set first pane to max available size
                // set other panes to 1 pixel
                for (let i = 1; i < properties.length; i++) {
                    properties[i].paneSize = 1;
                }
            }
        }
        setKnownPaneSizes(properties) {
            let index = 0;
            for (let key in this.layoutPanes) {
                let layoutPane = this.layoutPanes[key];
                if (layoutPane == undefined) {
                    continue;
                }
                else {
                    if (layoutPane.fillSpace == false) {
                        properties[index].paneSize = layoutPane.size;
                    }
                }
                index++;
            }
        }
        setDynamicPaneSizes(properties, width, height) {
            let index = 0;
            for (let key in this.layoutPanes) {
                let layoutPane = this.layoutPanes[key];
                if (layoutPane == undefined) {
                    continue;
                }
                else {
                    if (layoutPane.fillSpace == true) {
                        if (this._orientation == ej.Orientation.Vertical) {
                            let newPaneSize = height - this.sumOfDefinedPaneSizes();
                            if (newPaneSize < 0) {
                                newPaneSize = 0;
                            }
                            properties[index].paneSize = newPaneSize;
                        }
                        else {
                            let newPaneSize = width - this.sumOfDefinedPaneSizes();
                            if (newPaneSize < 0) {
                                newPaneSize = 0;
                            }
                            properties[index].paneSize = newPaneSize;
                        }
                    }
                }
                index++;
            }
        }
        /**
         * Sets the given properties(panesizes, ...) to the ejsplitter
         * if the last panesize is under 1px a correction of the panesize will be done; occures sometimes in case of browser zoom
         *
         * @private
         * @param {ej.Splitter} splitter
         * @param {*} properties
         * @memberof SplitterWidget
         */
        setPanePropertiesToSplitter(splitter, properties) {
            // round pane sizes
            properties.forEach(pane => {
                pane.paneSize = Math.floor(pane.paneSize);
            });
            this.setProperties(splitter, properties);
            let splitterPanes = splitter.panes;
            if (splitterPanes != undefined && splitterPanes.length > 0) {
                let lastPane = splitterPanes[splitterPanes.length - 1];
                if (lastPane != undefined) {
                    let lastPaneSizeString = lastPane.style.width;
                    if (this._orientation == ej.Orientation.Vertical) {
                        lastPaneSizeString = lastPane.style.height;
                    }
                    let lastPaneSize = parseFloat(lastPaneSizeString);
                    if (lastPaneSize <= 0.9999 && properties[properties.length - 1].paneSize > 0) {
                        // Size of last splitter pane was not set correct => to less space!
                        // if browser zoom is used the sizes will be defined with decimalplaces;
                        // the ejSplitter sets the size of the last pane to 0 if it is a little bit to tall (e.g. "0.1px") => pane will not be shown
                        // Set last pane a little bit smaller
                        properties[properties.length - 1].paneSize--;
                        this.setProperties(splitter, properties);
                    }
                }
            }
        }
        /**
         * Sets the splitter pane content sizes (widget sizes)
         *
         * @private
         * @param {number} width
         * @param {number} height
         * @memberof SplitterWidget
         */
        resizeSplitterPaneContents(width, height) {
            // Set the sizes of the splitter panecontents
            let index = 0;
            for (let i = 0; i < this.layoutPanes.length; i++) {
                let widget = this._widgets.get(this.layoutPanes[i].name);
                if (widget != undefined) {
                    let widgetWidth = width;
                    let widgetHeight = height;
                    if (this._orientation == ej.Orientation.Vertical) {
                        if (this.layoutPanes[index].fillSpace == true) {
                            widgetHeight = height - this.sumOfDefinedPaneSizes();
                            if (widgetHeight < 0) { // No place for dynamic pane, maybe also other panes have to be adopted
                                this.adoptLayoutPanesToFitCurrentSize(height);
                                widgetHeight = 0;
                            }
                        }
                        else {
                            widgetHeight = this.layoutPanes[index].size;
                        }
                    }
                    else {
                        if (this.layoutPanes[index].fillSpace == true) {
                            widgetWidth = width - this.sumOfDefinedPaneSizes();
                            if (widgetWidth < 0) { // No place for dynamic pane, maybe also other panes have to be adopted
                                this.adoptLayoutPanesToFitCurrentSize(width);
                                widgetWidth = 0;
                            }
                        }
                        else {
                            widgetWidth = this.layoutPanes[index].size;
                        }
                    }
                    widget.resize(widgetWidth, widgetHeight);
                }
                index++;
            }
            //Persist data every time a splitter is resized
            this.saveSettings();
        }
        /**
         * Updates the layout panes
         *
         * @private
         * @param {*} splitbarIndex
         * @param {*} prevPaneSize
         * @param {*} nextPaneSize
         * @memberof SplitterWidget
         */
        updateLayoutPanesOnSplitterResize(splitbarIndex, prevPaneSize, nextPaneSize) {
            let splitter = this.getSplitter();
            let properties = this.getProperties(splitter);
            if (!this._isResponsive) {
                if (this.layoutPanes[splitbarIndex + 1] != undefined) {
                    properties[splitbarIndex + 1].paneSize = this.layoutPanes[splitbarIndex + 1].size;
                }
                this.setPanePropertiesToSplitter(splitter, properties);
                let oldSize = this.layoutPanes[splitbarIndex].size;
                this.layoutPanes[splitbarIndex].size = prevPaneSize;
                this._actualHeight += (prevPaneSize - oldSize);
                this.resizeSplitter(this._actualWidth, this._actualHeight - this._headerHeight);
            }
            else {
                this.setPanePropertiesToSplitter(splitter, properties);
                for (let i = 0; i < properties.length; i++) {
                    this.layoutPanes[i].size = properties[i].paneSize;
                }
            }
        }
        /**
         * corrects the target index if source index is before target index
         *
         * @private
         * @param {number} sourcePaneIndex
         * @param {number} targetPaneIndex
         * @returns {number}
         * @memberof SplitterWidget
         */
        updataTargetPaneIndex(sourcePaneIndex, targetPaneIndex) {
            if (sourcePaneIndex < targetPaneIndex) {
                // moved element is in list before target position and was removed before, so index must be decreased to get correct insert position
                targetPaneIndex--;
            }
            return targetPaneIndex;
        }
        /**
         * Returns the properties from the ejSplitter
         *
         * @private
         * @param {*} splitter
         * @returns
         * @memberof SplitterWidget
         */
        getProperties(splitter) {
            return splitter.option("properties");
        }
        /**
         * Sets the properties of the ejSplitter
         *
         * @private
         * @param {ej.Splitter} splitter
         * @param {*} properties
         * @memberof SplitterWidget
         */
        setProperties(splitter, properties) {
            splitter.option("properties", properties, true); // force the setting to resize the chart splitters
        }
        /**
         * Updates the properties => moves the property informations from source to target index
         *
         * @private
         * @param {*} properties
         * @param {number} sourcePaneIndex
         * @param {number} targetPaneIndex
         * @memberof SplitterWidget
         */
        updatePropertiesList(properties, sourcePaneIndex, targetPaneIndex) {
            let paneProperties = properties[sourcePaneIndex];
            properties.splice(sourcePaneIndex, 1);
            properties.splice(targetPaneIndex, 0, paneProperties);
        }
        /**
         * Updates the layout panes list after moving
         *
         * @private
         * @param {*} layoutPane
         * @param {*} sourcePaneIndex
         * @param {*} targetPaneIndex
         * @memberof SplitterWidget
         */
        updateLayoutPanesListAfterMoving(layoutPane, sourcePaneIndex, targetPaneIndex) {
            this.layoutPanes.splice(sourcePaneIndex, 1);
            this.layoutPanes.splice(targetPaneIndex, 0, layoutPane);
        }
        /**
         * Returns the pane index of the given widget
         *
         * @private
         * @param {*} widget
         * @returns {number}
         * @memberof SplitterWidget
         */
        getPaneIndex(widget) {
            let paneIndex = -1;
            for (let i = 0; i < this.layoutPanes.length; i++) {
                if (this.layoutPanes[i].widget == widget) {
                    paneIndex = i;
                }
            }
            return paneIndex;
        }
        /**
         * Removes the widget from the widgets list of this layout widget
         *
         * @private
         * @param {*} widget
         * @memberof SplitterWidget
         */
        removeWidgetFromList(widget) {
            this._widgets.forEach((widgetTemp, key) => {
                if (widgetTemp == widget) {
                    this._widgets.delete(key);
                }
            });
        }
        /**
         * Adjust charts div container => remove chart size
         *
         * @private
         * @param {*} sizeToRemove
         * @memberof SplitterWidget
         */
        adjustChartsDivContainerSize(sizeToRemove) {
            this.mainDiv.style.height = (this.mainDiv.offsetHeight - sizeToRemove - 400 + this._defaultSplitterSize) + "px"; // Remove pane size + splitter size(9px)
        }
        /**
         *  Adjust ejSplitter size
         *
         * @private
         * @param {*} splitter
         * @param {*} sizeToRemove
         * @returns {number} Returns the new splitter size after removing
         * @memberof SplitterWidget
         */
        adjustSplitterSize(splitter, sizeToRemove) {
            let actualSplitterHeight = splitter.option("height");
            let newSplitterHeight = parseInt(actualSplitterHeight, 10); // parseInt to remove "px"
            newSplitterHeight -= sizeToRemove + this._defaultSplitterSize; // Remove pane size + splitter size(9px)
            splitter.option("height", newSplitterHeight, true); // TODO: not only height, also width 
            return newSplitterHeight;
        }
        /**
         * Notifies that splitter has resized
         *
         * @private
         */
        onSplitterResize(args) {
            this.updateLayoutPanesOnSplitterResize(args.splitbarIndex, args.prevPane.size, args.nextPane.size);
            this.resizeSplitterPaneContents(this._actualWidth, this._actualHeight - this._headerHeight);
        }
        /**
         * Returns a list with only the sizes of the panes
         *
         * @private
         * @param {*} properties
         * @returns
         * @memberof SplitterWidget
         */
        getPaneSizes(properties) {
            var paneSizes = new Array();
            properties.forEach(property => {
                paneSizes.push(property.paneSize);
            });
            return paneSizes;
        }
    };
    SplitterWidget = __decorate([
        mco.role()
    ], SplitterWidget);
    exports.SplitterWidget = SplitterWidget;
});
