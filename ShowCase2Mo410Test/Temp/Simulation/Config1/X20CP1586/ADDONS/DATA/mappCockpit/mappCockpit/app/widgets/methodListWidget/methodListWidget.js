var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../framework/events", "./view/methodsGridToolbar", "../common/treeGridWidgetBase", "../../models/online/mappCockpitComponent", "../../models/online/mappCockpitComponentReflection", "../common/domHelper", "./componentDefaultDefinition"], function (require, exports, events_1, methodsGridToolbar_1, treeGridWidgetBase_1, mappCockpitComponent_1, mappCockpitComponentReflection_1, domHelper_1, componentDefaultDefinition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MethodListWidget = void 0;
    let EventSelectionChanged = class EventSelectionChanged extends events_1.TypedEvent {
    };
    EventSelectionChanged = __decorate([
        mco.role()
    ], EventSelectionChanged);
    ;
    /**
     * implements the MethodList widget
     *
     * @class MethodListWidget
     * @extends {TreeGridWidgetBase}
     * @implements {IMethodListWidget}
     */
    let MethodListWidget = class MethodListWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            this.eventSelectionChanged = new EventSelectionChanged();
            this._executableMethods = [];
            this._quickCommands = [];
            this._uiRefreshTimer = -1;
            this._uiRefreshDelay = 100;
            this._methodsLoaded = false;
            this._quickCommandsLoaded = false;
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        initialized() {
            // invoke creating the methods bindings 
        }
        /**
          * Are the methods and quick commands infos already available(via binding)
          *
          * @private
          * @returns {boolean}
          * @memberof MethodListWidget
          */
        allBindingsDataAvailable() {
            if (this._methodsLoaded == true && this._quickCommandsLoaded == true) {
                return true;
            }
            return false;
        }
        /**
         * Called when the methods have been updated
         *
         * @private
         * @param {MappCockpitComponentMethod[]} userMethods
         * @memberof MethodListWidget
         */
        onMethodsUpdated(methods) {
            // update the methods
            this._executableMethods = methods;
            this._methodsLoaded = true;
            if (this.allBindingsDataAvailable() == true) {
                // after receiving all required data sets (methods,watchables and quick commands), the methodlist can be initialized
                this.initializeMethodlist();
            }
        }
        /**
         * Called when the quick commands have been updated
         *
         * @private
         * @param {MappCockpitComponentMethod[]} methods
         * @memberof MethodListWidget
         */
        onQuickCommandsUpdated(quickCommands) {
            // update the quick commands
            this._quickCommands = quickCommands;
            this._quickCommandsLoaded = true;
            if (this.allBindingsDataAvailable() == true) {
                // after receiving all required data sets (methods,watchables and quick commands), the methodlist can be initialized
                this.initializeMethodlist();
            }
        }
        /**
         * Initializes the method list widget and updates the ui
         *
         * @private
         * @memberof MethodListWidget
         */
        initializeMethodlist() {
            // initialize the method parameters default values
            this._executableMethods.forEach((executableMethod) => {
                mappCockpitComponentReflection_1.MappCockpitComponentMethodInfo.updateMethodInputParameters(executableMethod);
                this.observeMethodExecutability(executableMethod);
            });
            this.addToolBarButtons();
        }
        /**
         * Observes if the executability of the methods has changed
         *
         * @private
         * @memberof MethodListWidget
         */
        observeMethodExecutability(executableMethod) {
            executableMethod.isExecutable.attachObserver(this, (isExecutable) => {
                // refreshes the methods executable state
                this.refreshMethodState(executableMethod, isExecutable);
            });
        }
        /**
         * Refreshes a single methods executable state
         *
         * @private
         * @param {MappCockpitComponentMethod} method
         * @param {boolean} isExecutable
         * @memberof MethodListWidget
         */
        refreshMethodState(method, isExecutable) {
            if (this.isTreeGridDataSourceInitialized()) {
                this.invokeDelayedUIRefresh();
            }
        }
        /**
         * Invokes a delayedUI update request
         *
         * @private
         * @memberof MethodListWidget
         */
        invokeDelayedUIRefresh() {
            // reset the current timeout
            clearTimeout(this._uiRefreshTimer);
            // start the next timeout
            this._uiRefreshTimer = setTimeout(() => {
                this.updateMethodsList();
            }, this._uiRefreshDelay);
        }
        /**
         * Activates the method list widget
         *
         * @memberof MethodListWidget
         */
        activate() {
        }
        /**
         * Dispose some objects from the widget
         *
         * @memberof MethodListWidget
         */
        dispose() {
            // detach observers
            this.detachMethodsExecutabilityObservation();
            if (this._methodsToolbar != undefined) {
                this._methodsToolbar.dispose();
            }
            super.dispose();
        }
        /**
         * Detaches observation of the methods executability
         *
         * @private
         * @memberof MethodListWidget
         */
        detachMethodsExecutabilityObservation() {
            this._executableMethods.forEach((executableMethod) => {
                mappCockpitComponentReflection_1.MappCockpitComponentMethodInfo.updateMethodInputParameters(executableMethod);
                executableMethod.isExecutable.detachObserver(this);
            });
        }
        /**
         * Loads the styles for the method list toolbar buttons
         *
         * @memberof MethodListWidget
         */
        loadStyles() {
            super.addStyle("widgets/methodListWidget/style/css/methodListToolbarButtonStyle.css");
        }
        /**
         * Creates the tree grid for the methods list
         *
         * @protected
         * @memberof MethodListWidget
         */
        createTreeGrid() {
            var methodsDataSource = [];
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridToolbarSupport()), { dataSource: methodsDataSource, editSettings: {
                    allowDeleting: false,
                    showDeleteConfirmDialog: false,
                    showConfirmDialog: false
                }, childMapping: "childs", isResponsive: false, rowSelected: (args) => this.handleMethodListItemSelected(args), create: (args) => this.treeGridCreated(), queryCellInfo: (args) => this.showMethodDisabledIfNotExecutable(args) }));
        }
        /**
         * Returns true if dataSource treegrid has been initialized with this._executableMethods
         *
         * @private
         * @returns {boolean}
         * @memberof MethodListWidget
         */
        isTreeGridDataSourceInitialized() {
            let treeGridObj = this.getTreeGridObject();
            if (treeGridObj != undefined && treeGridObj.model.dataSource != undefined) {
                let dataSource = treeGridObj.model.dataSource;
                //Check if tree grid dataSource has not been initialized.
                if (dataSource.length == 0) {
                    return false;
                }
                else {
                    return true;
                }
            }
            return false;
        }
        /**
         * Returns the tree grid column definition
         *
         * @private
         * @returns {{}}
         * @memberof MethodListWidget
         */
        getTreeGridColumnDefinition() {
            return {
                columns: [
                    { field: "displayName", headerText: "Command", width: "250" },
                ],
            };
        }
        /**
         * Returns the tree grid toolbar settings
         *
         * @protected
         * @returns {{}}
         * @memberof MethodListWidget
         */
        getTreeGridToolbarSupport() {
            this._methodsToolbar = new methodsGridToolbar_1.MethodGridToolbar(); // TODO: use _toolbar and super.getTreeGridToolbarSupport()
            return {
                toolbarSettings: {
                    showToolbar: true,
                    customToolbarItems: this._methodsToolbar.getDefaultToolbarButtons()
                },
            };
        }
        /**
         * Add toolbar buttons with quickCommands info
         *
         * @private
         * @memberof MethodListWidget
         */
        addToolBarButtons() {
            if (this._quickCommands.length > 0) {
                this.addToolbarSettingsToTreeGrid();
                this.addQuickCommandButtons();
            }
            else {
                this.updateMethodsList();
                this._methodsToolbar.addDefaultToolbarButtons();
            }
            this._methodsToolbar.setActualComponentMethods(this._executableMethods);
        }
        /**
         * Add quick command buttons to treegrid's toolbar
         *
         * @private
         * @memberof MethodListWidget
         */
        addQuickCommandButtons() {
            this._quickCommands.forEach((command) => {
                this._methodsToolbar.addQuickCommandsToolbarButtons(command.name, command.imageName);
            });
        }
        treeGridCreated() {
            //super.treeGridCreated();
            this._methodsToolbar.initToolbar(this.mainDiv);
            // Resize needed because toolbar size is changed
            this.resize(this.width, this.height);
            this.updateMethodsList();
        }
        showMethodDisabledIfNotExecutable(args) {
            if (args.column.field == "displayName") {
                if (args.data.item != undefined && args.data.item.isExecutable != undefined) {
                    if (args.cellElement.classList != undefined) {
                        // Show ReadOnly cell with other color
                        let disableTreeCellClassName = "treeCellDisabled";
                        if (args.data.item.isExecutable.value == false) {
                            args.cellElement.classList.add(disableTreeCellClassName);
                        }
                        else {
                            args.cellElement.classList.remove(disableTreeCellClassName);
                        }
                    }
                    domHelper_1.DomHelper.disableElement(args.cellElement, !args.data.item.isExecutable.value);
                }
            }
        }
        /**
         * updates the commands data
         *
         * @private
         * @memberof MethodListWidget
         */
        updateMethodsList() {
            $(this.mainDiv).ejTreeGrid({
                dataSource: this.getDataModel()
            });
        }
        getDataModel() {
            return this._executableMethods;
            /*let temp = new Array();
            let group1= {childs: new Array(), displayName: "Initialisation"};
            let group2= {childs: new Array(), displayName: "Movement"}
            let group3= {childs: new Array(), displayName: "Others"}
            temp.push(group1);
            temp.push(group2);
            temp.push(group3);
    
            group1.childs = this._executableMethods.slice(0,5);
            group2.childs = this._executableMethods.slice(5,11);
            group3.childs = this._executableMethods.slice(16);
            return temp;*/
        }
        /**
         * First time treegrid is updated, toolbar buttons are inserted
         *
         * @private
         * @memberof MethodListWidget
         */
        addToolbarSettingsToTreeGrid() {
            $(this.mainDiv).ejTreeGrid({
                dataSource: this.getDataModel(),
                toolbarSettings: {
                    customToolbarItems: this._methodsToolbar.getCustomToolbars(this._quickCommands)
                }
            });
        }
        /**
         * handles selections of method items
         *
         * @param {*} args
         * @returns {*}
         * @memberof MethodListWidget
         */
        handleMethodListItemSelected(args) {
            // update the method parameter list after a method has been selected.
            if (args.data.item && args.data.item instanceof mappCockpitComponent_1.MappCockpitComponentMethod) {
                this.onSelectionChanged(args.data.item);
            }
        }
        onSelectionChanged(method) {
            this.eventSelectionChanged.raise(null, method);
        }
    };
    MethodListWidget = __decorate([
        mco.role()
    ], MethodListWidget);
    exports.MethodListWidget = MethodListWidget;
});
