var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../models/dataModelInterface", "./busyInformation", "./themeProvider", "./widgetsWithDropSupportProvider", "./dragDropArgs", "../../framework/componentHub/bindings/bindings", "../../common/componentBase/componentSettings", "./componentDefaultDefinitionWidgetBase"], function (require, exports, dataModelInterface_1, busyInformation_1, themeProvider_1, widgetsWithDropSupportProvider_1, dragDropArgs_1, bindings_1, componentSettings_1, componentDefaultDefinitionWidgetBase_1) {
    "use strict";
    var WidgetBase_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WidgetBase = exports.NullDataModel = void 0;
    let WidgetBase = WidgetBase_1 = class WidgetBase {
        get mainDiv() {
            return this._widgetMainDiv;
        }
        get headerDiv() {
            return this._widgetHeaderDiv;
        }
        get footerDiv() {
            return this._widgetFooterDiv;
        }
        /**
         * Returns the widgets main div id
         *
         * @readonly
         * @type {string}
         * @memberof WidgetBase
         */
        get mainDivId() {
            return this.mainDiv.id;
        }
        /**
         * Creates an instance of WidgetBase
         * @memberof WidgetBase
         */
        constructor() {
            this._widgets = new Map();
            this._subComponentsLoadedHandler = (sender, eventArgs) => { this.handleSubComponentsLoaded(sender, eventArgs); };
            this._componentSettingsLoadedHandler = (sender, eventArgs) => { this.handleComponentSettingsLoaded(sender, eventArgs); };
            this.busyScreenId = "";
            this.flaggedForResize = false;
            this.widgetName = "";
            this._actualWidth = 0;
            this._actualHeight = 0;
            this._headerHeight = 0;
            this._footerHeight = 0;
            this._busyInformation = new busyInformation_1.BusyInformation();
            this._modelChangedHandler = (sender, data) => { this.handleModelChanged(sender, data); };
            this._modelItemsChangedHandler = (sender, data) => { this.handleModelItemsChanged(sender, data); };
            //#region Drop support
            this._supportedDragDropDataIds = new Array(); //e.g. Signal, ..
            //#endregion
            //#region drag support
            this._dropPossible = false;
            this._draggingSupportActive = false;
            this._defaultDropNotPossibleRepresentation = "";
            this._dataModel = new NullDataModel();
        }
        get view() {
            return this._view;
        }
        set view(view) {
            this._view = view;
        }
        /**
         * Returns the current width of the widget
         *
         * @readonly
         * @type {number}
         * @memberof WidgetBase
         */
        get width() {
            return this._actualWidth;
        }
        /**
         * Returns the current height of the widget
         *
         * @readonly
         * @type {number}
         * @memberof WidgetBase
         */
        get height() {
            return this._actualHeight;
        }
        /**
         * Returns a unique div id (e.g. Cont_1)
         *
         * @static
         * @returns {string}
         * @memberof WidgetBase
         */
        static getUniqueDivId() {
            WidgetBase_1._uniqueDivId++;
            let id = WidgetBase_1._uniqueDivId.toString();
            return "Cont_" + id;
        }
        /**
         * Initializes the widget
         *
         * @memberof WidgetBase
         */
        initialize() {
            this.initializeWithId(WidgetBase_1.getUniqueDivId());
        }
        /**
         * Initializes the widget with the given id
         *
         * @private
         * @param {string} divId
         * @memberof WidgetBase
         */
        initializeWithId(divId) {
            // Create the needed divs
            this.createDivs(divId);
            // Add divs to document body (otherwise syncfusion can not initialize the widgets correct)
            this.addToDocumentsTemp();
            // Load styles
            this.loadStyles();
            // Load component settings
            this.component.eventSubComponentsLoaded.attach(this._subComponentsLoadedHandler);
            this.component.eventComponentSettingsLoaded.attach(this._componentSettingsLoadedHandler);
            this.component.loadComponentSettings();
            this.component.eventSubComponentsLoaded.detach(this._subComponentsLoadedHandler);
            this.component.eventComponentSettingsLoaded.detach(this._componentSettingsLoadedHandler);
        }
        /**
         * Creates the main div and if needed header and footer divs
         *
         * @private
         * @param {string} divId
         * @memberof WidgetBase
         */
        createDivs(divId) {
            // Create widget main div at first to define the mainDivId
            this._widgetMainDiv = document.createElement("div");
            this._widgetMainDiv.id = divId;
            this._headerHeight = this.defineHeaderHeight();
            if (this._headerHeight != 0) {
                this.createHeaderDiv();
            }
            this._footerHeight = this.defineFooterHeight();
            if (this._footerHeight != 0) {
                this.createFooterDiv();
            }
        }
        /**
         * Returns the height which the header should have
         *
         * @returns {number}
         * @memberof WidgetBase
         */
        defineHeaderHeight() {
            return 0;
        }
        /**
         * Returns the height which the footer should have
         *
         * @returns {number}
         * @memberof WidgetBase
         */
        defineFooterHeight() {
            return 0;
        }
        /**
         * Adds(moves) the div containers of this widget to the document(needed for correct behavior of the syncfusion widget because they are looking into the document)
         *
         * @public
         * @memberof WidgetBase
         */
        addToDocumentsTemp() {
            const widgetTempDivId = "widgetTemp";
            // create document body widgetTemp container if not already available ...
            let widgetTempDiv = document.getElementById(widgetTempDivId);
            if (widgetTempDiv == null) {
                widgetTempDiv = document.createElement("div");
                widgetTempDiv.id = widgetTempDivId;
                document.body.appendChild(widgetTempDiv);
            }
            // ... and add the divs of this widget
            if (this.headerDiv != undefined) {
                widgetTempDiv.appendChild(this.headerDiv);
            }
            widgetTempDiv.appendChild(this.mainDiv);
            if (this.footerDiv != undefined) {
                widgetTempDiv.appendChild(this.footerDiv);
            }
        }
        /**
         * Creates a new header div
         *
         * @protected
         * @param {number} headerHeight
         * @memberof WidgetBase
         */
        createHeaderDiv() {
            let headerContainerId = this.mainDivId + "_header";
            this._widgetHeaderDiv = this.createDiv(headerContainerId, "widgetHeader", this._headerHeight);
        }
        /**
         * creates a new footer div
         *
         * @protected
         * @param {number} footerHeight
         * @memberof WidgetBase
         */
        createFooterDiv() {
            let footerContainerId = this.mainDivId + "_footer";
            this._widgetFooterDiv = this.createDiv(footerContainerId, "widgetFooter", this._footerHeight);
        }
        /**
         * Creates a new div with the given informations
         *
         * @private
         * @param {string} id
         * @param {string} className
         * @param {number} height
         * @returns
         * @memberof WidgetBase
         */
        createDiv(id, className, height) {
            let newHeaderDiv = document.createElement("div");
            newHeaderDiv.id = id;
            newHeaderDiv.classList.add(className);
            newHeaderDiv.style.height = height.toString() + "px";
            return newHeaderDiv;
        }
        /**
         * Adds the div containers(header, main, footer, ...) of this widget to the given parent container
         *
         * @param {(HTMLDivElement|undefined)} parentContainer
         * @returns
         * @memberof WidgetBase
         */
        addToParentContainer(parentContainer) {
            if (parentContainer == undefined) {
                return;
            }
            // Add header
            if (this._widgetHeaderDiv != undefined) {
                parentContainer.append(this._widgetHeaderDiv);
            }
            // Add main
            parentContainer.append(this.mainDiv);
            // Add footer
            if (this._widgetFooterDiv != undefined) {
                parentContainer.append(this._widgetFooterDiv);
            }
        }
        addToParentContainerId(parentContainerId) {
            let parentContainer = document.getElementById(parentContainerId);
            if (parentContainer != null) {
                this.addToParentContainer(parentContainer);
            }
        }
        /**
         * Handles the sub component loaded event
         *
         * @param {ComponentBase} sender
         * @param {*} eventargs
         * @memberof WidgetBase
         */
        handleSubComponentsLoaded(sender, eventargs) {
            this.createLayout();
            this.attachLayoutToView();
        }
        /**
         * Handles the component settings loaded event
         *
         * @param {ComponentBase} sender
         * @param {*} eventargs
         * @memberof WidgetBase
         */
        handleComponentSettingsLoaded(sender, eventargs) {
            this.initialized();
            this.component.setBindingsData();
        }
        /**
         * Reinitializes the chart
         *
         * @memberof WidgetBase
         */
        reinitialize() {
            // get current div id
            let currentId = this.mainDivId;
            // empty current wirdget div
            $(this.mainDiv).empty();
            // initialize widget with the already used div id
            this.initializeWithId(currentId);
        }
        /**
         * Will be called after initialization(when loading persisting data was done)
         *
         * @memberof WidgetBase
         */
        initialized() {
        }
        /**
         * Initialize the component parts here
         *
         * @memberof WidgetBase
         */
        initializeComponent() {
        }
        /**
         * Set the id for the default settings data which should be used if no persisting data is available
         *
         * @param {string} defaultSettingsDataId
         * @memberof WidgetBase
         */
        setDefaultComponentSettingsDataId(defaultSettingsDataId) {
            this.component.defaultSettingsDataId = defaultSettingsDataId;
        }
        /**
         * Returns the settings of this component
         *
         * @returns {ComponentSettings}
         * @memberof WidgetBase
         */
        getComponentSettings(onlyModified) {
            return this.component.getComponentSettings(onlyModified);
        }
        /**
         * Sets settings to this component
         *
         * @param {(ComponentSettings|undefined)} settings
         * @memberof WidgetBase
         */
        setComponentSettings(settings) {
            if (settings != undefined) {
                // Set componentSettings
                this.component.setComponentSettings(settings);
            }
        }
        attachLayoutToView(parentView = undefined) {
            let view = parentView ? parentView : this._view;
            if (view && this._layoutWidget) {
                this._layoutWidget.view = view;
            }
        }
        /** sets the header content
         *
         * @param {string} content
         * @memberof WidgetBase
         */
        setHeaderContent(content) {
            if (this._widgetHeaderDiv != undefined) {
                this._widgetHeaderDiv.innerHTML = content;
            }
        }
        /** sets the footer content
         *
         * @param {string} content
         * @memberof WidgetBase
         */
        setFooterContent(content) {
            if (this._widgetFooterDiv != undefined) {
                this._widgetFooterDiv.innerHTML = content;
            }
        }
        /**
         * Creates the layout of the widget
         *
         * @memberof WidgetBase
         */
        createLayout() {
        }
        /**
         * Load styles for WidgetBase
         *
         * @memberof WidgetBase
         */
        loadStyles() {
            //this.styleLoaded(undefined);
        }
        ;
        addStyle(filePath) {
            let themedFilePath = this.getThemedFilePath(filePath);
            $(this.mainDiv).append('<link rel="stylesheet" href="' + themedFilePath + '" type="text/css" />');
            /*var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = filePath;
            $(this.mainDiv).append(link);*/
            //this.loadCss($(this.mainDiv), filePath, (link) =>{this.styleLoaded(link)});
        }
        ;
        addClass(className) {
            $(this.mainDiv).addClass(className);
        }
        addStyleToContentId(parentContainer, filePath) {
            if (parentContainer != undefined && parentContainer.id != "") {
                let themedFilePath = this.getThemedFilePath(filePath);
                $(parentContainer).append('<link rel="stylesheet" href="' + themedFilePath + '" type="text/css" />');
            }
        }
        getThemedFilePath(filePath) {
            let themeProvider = themeProvider_1.ThemeProvider.getInstance();
            return themeProvider.getThemedFilePath(filePath);
        }
        get supportedDragDropDataIds() {
            return this._supportedDragDropDataIds;
        }
        /**
         * Adds the given dragdrop data id to this widget, and adds this widget to the WidgetsWithDropSupportProvider if not already there
         * Can only be used if the widget derives from IDroppable
         *
         * @param {string} id
         * @memberof WidgetBase
         */
        addSupportedDragDropDataId(id) {
            widgetsWithDropSupportProvider_1.WidgetsWithDropSupportProvider.getInstance().addWidget(this);
            // check if already in list
            let index = this._supportedDragDropDataIds.indexOf(id);
            if (index == -1) {
                this._supportedDragDropDataIds.push(id);
            }
        }
        /**
         * Removes the given dragdrop data id from this widget, and if it is the last dragdrop data id, removes the widget from the WidgetsWithDropSupportProvider
         * Can only be used if the widget derives from IDroppable
         *
         * @param {string} id
         * @memberof WidgetBase
         */
        removeSupportedDragDropDataId(id) {
            let index = this._supportedDragDropDataIds.indexOf(id);
            if (index != -1) {
                this._supportedDragDropDataIds.splice(index, 1);
            }
            if (this._supportedDragDropDataIds.length == 0) {
                widgetsWithDropSupportProvider_1.WidgetsWithDropSupportProvider.getInstance().removeWidget(this);
            }
        }
        /**
         * Adds dragging support to this widget; via IDraggable the widget can provide the information which object should be dragged
         *
         * @memberof WidgetBase
         */
        addDraggingSupport() {
            if (this.mainDivId == "") {
                console.error("widget main div id not set for draggable support");
                return;
            }
            let imageProvider = this.component.getSubComponent(componentDefaultDefinitionWidgetBase_1.ComponentDefaultDefinitionWidgetBase.ImageProviderId);
            if (imageProvider != undefined) {
                this._defaultDropNotPossibleRepresentation = imageProvider.getImage("../app/widgets/common/style/images/dragDrop/dropNotPossible.svg");
            }
            else {
                console.error("ImageProvider not available => Add ImageProvider sub component to this widget!");
            }
            this._draggingSupportActive = true;
            this._draggingContainer = $(this.mainDiv);
            this._draggingContainer.ejDraggable({
                distance: 10,
                helper: (args) => this.draggingHelper(args),
                dragStart: (args) => this.draggingStart(args),
                dragStop: (args) => this.draggingStop(args),
                destroy: (args) => this.draggingDestroy(args),
                drag: (args) => this.draggingDrag(args),
            });
        }
        /**
         * Removes dragging support from this widget
         *
         * @memberof WidgetBase
         */
        removeDraggingSupport() {
            this._draggingSupportActive = false;
            var ejDraggableObj = this._draggingContainer.data("ejDraggable");
            if (ejDraggableObj != undefined) {
                ejDraggableObj.destroy();
            }
        }
        /**
         * Will be called at the end of a drag&drop operation
         *
         * @private
         * @param {*} args
         * @memberof WidgetBase
         */
        draggingDestroy(args) {
        }
        /**
         * Creates the temporary drag object for the drag & drop operation and adds it to the document body
         *
         * @private
         * @param {*} args
         * @returns
         * @memberof WidgetBase
         */
        draggingHelper(args) {
            var ejDraggableObj = this._draggingContainer.data("ejDraggable");
            if (ejDraggableObj != undefined) {
                // Set drag object position (_relYposition and _relXposition are the positions within the draggable object)
                ejDraggableObj.option("cursorAt", { top: (ejDraggableObj._relYposition * -1) - 10, left: ejDraggableObj._relXposition * -1 }, true);
            }
            // Get the information of the drag object from widget
            let dragDataObject = this.startDragging();
            if (dragDataObject == undefined) {
                return;
            }
            this._dragDataObject = dragDataObject;
            this._defaultDragRepresentation = this._dragDataObject.representation;
            this._dragSymbol = $('<pre>').html(this._defaultDropNotPossibleRepresentation);
            // Adds the current data to the drag data
            this.setDragData(args, this._dragDataObject.data);
            this._dragSymbol.appendTo(document.body);
            return this._dragSymbol;
        }
        /**
         * Will be called at the beginning of a drag&drop operation
         *
         * @protected
         * @returns {(DragDropDataObject|undefined)}
         * @memberof WidgetBase
         */
        startDragging() {
            return undefined;
        }
        /**
         * Will be called after the drop
         *
         * @protected
         * @memberof WidgetBase
         */
        draggingStopped() {
        }
        /**
         * Removes the temporary drag object after drag & drop operation
         *
         * @private
         * @memberof WidgetBase
         */
        removeDragObjectFromDocument() {
            for (let i = document.body.childNodes.length - 1; i >= 0; i--) {
                if (document.body.childNodes[i].nodeName == "PRE") {
                    document.body.childNodes[i].remove();
                }
            }
        }
        /**
         * Will be called at start dragging
         *
         * @private
         * @param {*} args
         * @returns
         * @memberof WidgetBase
         */
        draggingStart(args) {
            let dragData = this.getDragData(args);
            if (dragData != undefined) {
                // Inform only widgets with drop support for the given dragDropDataId
                widgetsWithDropSupportProvider_1.WidgetsWithDropSupportProvider.getInstance().getWidgetsWithDragDropDataId(this._dragDataObject.id).forEach(widget => {
                    // call dragStart
                    widget.dragStart(new dragDropArgs_1.DragDropArgs(args.currentTarget, dragData, this._defaultDragRepresentation));
                });
                return;
            }
            args.cancel = true;
        }
        /**
         * Will be called while dragging is active
         *
         * @private
         * @param {*} args
         * @memberof WidgetBase
         */
        draggingDrag(args) {
            this._dropPossible = false;
            let currentDragDropElement = this._defaultDragRepresentation.clone();
            let dragData = this.getDragData(args);
            if (dragData != undefined) {
                let newWidget = undefined;
                if (args.currentTarget != undefined) { // undefined if out of browser window
                    // Inform only widgets with drop support for the given dragDropDataId
                    widgetsWithDropSupportProvider_1.WidgetsWithDropSupportProvider.getInstance().getWidgetsWithDragDropDataId(this._dragDataObject.id).forEach(widget => {
                        // Only widget with currentTarget(divId) as parent should be informed
                        if (this.isElementWithinWidget(args.currentTarget, widget.mainDivId)) {
                            newWidget = widget;
                            // call dragOver
                            let dragDropArgs = new dragDropArgs_1.DragDropArgs(args.currentTarget, dragData, currentDragDropElement);
                            let dragOverPossible = widget.dragOver(dragDropArgs);
                            if (dragOverPossible) {
                                this._dropPossible = dragOverPossible;
                            }
                        }
                    });
                }
                if (newWidget != this._currentWidget) {
                    // DragOver changed from one widget to an other
                    if (this._currentWidget != undefined) {
                        this._currentWidget.dropFocusLost(args);
                    }
                    this._currentWidget = newWidget;
                }
            }
            if (this._dropPossible) {
                this._dragSymbol[0].innerHTML = currentDragDropElement.getDragDropElement();
            }
            else {
                this._dragSymbol[0].innerHTML = this._defaultDropNotPossibleRepresentation;
            }
        }
        /**
         * Will be called when dragging was stopped
         *
         * @private
         * @param {*} args
         * @memberof WidgetBase
         */
        draggingStop(args) {
            let dragData = this.getDragData(args);
            if (this._dropPossible) {
                if (args.currentTarget != undefined) { // undefined if out of browser window
                    // Inform only widgets with drop support for the given dragDropDataId
                    widgetsWithDropSupportProvider_1.WidgetsWithDropSupportProvider.getInstance().getWidgetsWithDragDropDataId(this._dragDataObject.id).forEach(widget => {
                        // Only widget with currentTarget(divId) as parent should be informed
                        if (this.isElementWithinWidget(args.currentTarget, widget.mainDivId)) {
                            // call drop
                            widget.drop(new dragDropArgs_1.DragDropArgs(args.currentTarget, dragData));
                        }
                    });
                }
            }
            // Inform only widgets with drop support for the given dragDropDataId
            widgetsWithDropSupportProvider_1.WidgetsWithDropSupportProvider.getInstance().getWidgetsWithDragDropDataId(this._dragDataObject.id).forEach(widget => {
                // call dragStop
                widget.dragStop(new dragDropArgs_1.DragDropArgs(args.currentTarget, dragData));
            });
            this.draggingStopped();
            this.removeDragObjectFromDocument();
        }
        getDragData(args) {
            if (this._dragDataObject != undefined) {
                return args.element.data(this._dragDataObject.id);
            }
            return undefined;
        }
        setDragData(args, data) {
            args.element.data(this._dragDataObject.id, data);
        }
        /**
         * Check if an element is a child of the given parent id
         *
         * @private
         * @param {*} element
         * @param {string} widgetId
         * @returns
         * @memberof WidgetBase
         */
        isElementWithinWidget(element, widgetId) {
            let id = "#" + widgetId;
            let parent = element.closest(id);
            if (parent == null) {
                return false;
            }
            return true;
        }
        /**
         * Returns the widget for the given id if found, else undefined
         *
         * @param {string} id the widget id
         * @returns {*}
         * @memberof WidgetBase
         */
        /*public getWidgetById(id: string, recursive: boolean = false): IWidget|undefined{
            for (let key in this._widgets) {
                let foundWidget: IWidget|undefined = undefined;
                let widget = this._widgets[key];
                if(widget.id == id){
                    foundWidget = widget;
                }
                else{
                    if(recursive == true){
                        let foundChildWidget = widget.getWidgetById(id, true);
                        if(foundChildWidget != undefined){
                            foundWidget = foundChildWidget;
                        }
                    }
                }
                if(foundWidget != undefined){
                    return foundWidget;
                }
            }
            return undefined
        }*/
        //#endregion
        /*private styleLoaded(link){
            
        }
    
        private loadCss(element, url, callback){
            var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = url;
            
            element[0].appendChild(link);
        
            var img = document.createElement('img');
            img.onerror = function(){
                if(callback){
                    callback(link);
                }
            }
            img.src = url;
        }*/
        /**
         * Activate the WidgetBase
         *
         * @memberof WidgetBase
         */
        activate() {
        }
        /**
         * Deactivate the WidgetBase
         *
         * @memberof WidgetBase
         */
        deactivate() {
        }
        /**
         * Connects the widget base
         *
         * @memberof WidgetBase
         */
        connect(componentId) {
        }
        /**
         * Dispose the WidgetBase
         *
         * @memberof WidgetBase
         */
        dispose() {
            if (this._draggingSupportActive == true) {
                this.removeDraggingSupport();
            }
            if (this._dataModel != undefined) {
                this._dataModel.eventModelChanged.detach(this._modelChangedHandler);
                this._dataModel.eventModelItemsChanged.detach(this._modelItemsChangedHandler);
            }
            // delete bindings
            bindings_1.Bindings.unbind(this);
        }
        /**
         * Sets the busy screen information which will be shown when the busy flag true
         *
         * @param {BusyInformation} busyInformation
         * @memberof WidgetBase
         */
        setBusyInformation(busyInformation) {
            this._busyInformation = busyInformation;
        }
        /**
         * Set the busy flag of the WidgetBase(needed in default component settings of widget => addSubComponent("CommonLayoutProvider", ComponentDefaultDefinition.CommonLayoutProviderId);)
         *
         * @param {boolean} flag if true busy screen will be shown
         * @memberof WidgetBase
         */
        setBusy(flag) {
            this.busyScreenId = this.mainDivId + "_busyScreen";
            if (flag == true) {
                let commonLayoutProvider = this.component.getSubComponent(componentDefaultDefinitionWidgetBase_1.ComponentDefaultDefinitionWidgetBase.CommonLayoutProviderId);
                if (commonLayoutProvider != undefined) {
                    var mainDiv = $(this.mainDiv);
                    var parent = mainDiv.parent();
                    let div = undefined;
                    // if no width and height is available in the styles, 100% for width and height for busy screen shows the whole mappCockpit in busy => use div to get current size
                    if (parent[0].style.width == "" && parent[0].style.height == "") {
                        div = parent[0];
                    }
                    let html = commonLayoutProvider.getBusyScreenLayout(this.busyScreenId, this._busyInformation, div);
                    parent.append(html);
                }
                else {
                    console.info("CommonLayoutProvider not available => add to sub components!");
                }
            }
            else {
                let busyDiv = $(this.mainDiv).parent().find("#" + this.busyScreenId);
                busyDiv.remove();
            }
        }
        changeBusyMessage(newMessage) {
            let commonLayoutProvider = this.component.getSubComponent(componentDefaultDefinitionWidgetBase_1.ComponentDefaultDefinitionWidgetBase.CommonLayoutProviderId);
            if (commonLayoutProvider != undefined) {
                commonLayoutProvider.changeBusyMessage(this.busyScreenId, newMessage);
            }
        }
        /**
         * Persist widget settings
         *
         * @protected
         * @memberof WidgetBase
         */
        saveSettings() {
            this.component.saveComponentSettings();
        }
        /**
         * Resize the WidgetBase
         *
         * @param {number} width
         * @param {number} height
         * @memberof WidgetBase
         */
        resize(width, height) {
        }
        /**
         * Resets all data
         *
         * @memberof WidgetBase
         */
        clear() {
        }
        get dataModel() {
            return this._dataModel;
        }
        set dataModel(dataModel) {
            // Detach events from old dataModel
            this.detachDataModelEvents();
            // Set new dataModel
            this._dataModel = dataModel;
            // Attach events to new dataModel
            this.attachDataModelEvents();
        }
        /**
         * attaches the data model events
         *
         * @private
         * @memberof WidgetBase
         */
        attachDataModelEvents() {
            if (this._dataModel != undefined) {
                this._dataModel.eventModelChanged.attach(this._modelChangedHandler);
                this._dataModel.eventModelItemsChanged.attach(this._modelItemsChangedHandler);
            }
        }
        /**
         * detaches the data model events
         *
         * @private
         * @memberof WidgetBase
         */
        detachDataModelEvents() {
            if (this._dataModel != undefined) {
                this._dataModel.eventModelChanged.detach(this._modelChangedHandler);
                this._dataModel.eventModelItemsChanged.detach(this._modelItemsChangedHandler);
            }
        }
        handleModelChanged(sender, data) {
        }
        handleModelItemsChanged(sender, eventArgs) {
        }
        onObservablesChanged(changedObservables) {
        }
    };
    WidgetBase.WidgetSettingId = "widget";
    /**
     * Holds the last used unique div id
     *
     * @private
     * @static
     * @type {number}
     * @memberof WidgetBase
     */
    WidgetBase._uniqueDivId = 0;
    WidgetBase = WidgetBase_1 = __decorate([
        mco.role()
    ], WidgetBase);
    exports.WidgetBase = WidgetBase;
    /**
     * the class implements the null object for the data model. It is intended to be set for widgets without a real data model
     *
     * @class NullDataModel
     * @implements {IDataModel}
     */
    let NullDataModel = class NullDataModel {
        constructor() {
            this.eventModelChanged = new dataModelInterface_1.EventModelChanged;
            this.eventModelItemsChanged = new dataModelInterface_1.EventModelItemsChanged;
        }
        observeModelItems(observableItems) {
        }
        onModelItemsChanged(sender, data) {
        }
        handleModelItemsChanged(sender, data) {
        }
        initialize() {
        }
        clear() {
        }
        dispose() {
        }
        getDefaultStoringData() {
            return undefined;
        }
        initializeComponent() {
            this.component.disablePersisting();
        }
        getComponentSettings() {
            return new componentSettings_1.ComponentSettings();
        }
        setComponentSettings(data) {
        }
        connect() {
        }
        onModelChanged(sender, data) {
        }
        handleModelChanged(sender, data) {
        }
    };
    NullDataModel = __decorate([
        mco.role()
    ], NullDataModel);
    exports.NullDataModel = NullDataModel;
});
