var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./model/configManagerWidgetDataModel", "../common/treeGridWidgetBase", "./view/cmTreeGridCellEditTemplate", "./view/cmTreeGridCellEditEvents", "./view/cmTreeGridCellStyle", "./view/cmTreeGridToolbar", "../../models/online/mappCockpitComponent", "./componentDefaultDefinition", "../common/widgetBase"], function (require, exports, configManagerWidgetDataModel_1, treeGridWidgetBase_1, cmTreeGridCellEditTemplate_1, cmTreeGridCellEditEvents_1, cmTreeGridCellStyle_1, cmTreeGridToolbar_1, mappCockpitComponent_1, componentDefaultDefinition_1, widgetBase_1) {
    "use strict";
    var ConfigManagerWidget_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfigManagerWidget = void 0;
    let ConfigManagerWidget = ConfigManagerWidget_1 = class ConfigManagerWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            /**
             * is edit mode active in the widget
             *
             * @private
             * @type {boolean}
             * @memberof ConfigManagerWidget
             */
            this._editModeActive = false;
            // holds the update delay timer id
            this._uiRefreshTimer = -1;
            // specifies the time spent until the effective refresh will be executed
            this._uiRefreshDelay = 100;
            this._methods = [];
        }
        /**
         * Defines the height of the header
         *
         * @returns {number}
         * @memberof ConfigManagerWidget
         */
        defineHeaderHeight() {
            return 30;
        }
        initialized() {
            super.initialized();
            super.setHeaderContent("Configuration");
            // Set dynamic column settings
            super.setDynamicColumn(3, 100);
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
        }
        onMethodsUpdated(methods) {
            this._methods = methods;
            // get the save configuration method
            this._saveParametersMethod = this.retrieveSaveParametersMethod();
            // disable save button
            let toolbar = this._toolbar;
            toolbar.saveButtonExecutable(false);
            // enable the save button depending on executable state.
            if (this._saveParametersMethod) {
                toolbar.saveButtonExecutable(this._saveParametersMethod.isExecutable.value);
                this._saveParametersMethod.isExecutable.changed((isExecutable) => {
                    toolbar.saveButtonExecutable(isExecutable);
                });
            }
        }
        retrieveSaveParametersMethod() {
            return this._methods.filter(method => method.browseName == "Save Config")[0];
        }
        /**
         * Called when the configuration parameters have been changed
         *
         * @private
         * @param {MappCockpitComponentParameter[]} configurationParameters
         * @memberof ConfigManagerWidget
         */
        onConfigurationParametersUpdated(configurationParameters) {
            let configManagerDataModel = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.ConfigManagerDataModel);
            if (configManagerDataModel != undefined) {
                configManagerDataModel.setEditModeActive(this._editModeActive);
                configManagerDataModel.configurationParameters = configurationParameters;
                this.dataModel = configManagerDataModel;
            }
        }
        /**
         * Creates the layout of the widget
         *
         * @memberof ConfigManagerWidget
         */
        createLayout() {
            this.mainDiv.style.overflow = "hidden";
            $(this.mainDiv).append(this.getScriptInformationForTreeGrid());
            super.createLayout();
        }
        /**
         * Sets the component settings deactivates the edit settings by default
         *
         * @param {ComponentSettings} data
         * @memberof ConfigManagerWidget
         */
        setComponentSettings(data) {
            if (data != undefined) {
                super.setComponentSettings(data);
            }
            // Deactivate the edit mode by default
            this.setEditMode(false);
        }
        /**
         * Returns the template for the display name column (Icons, expand state, display name...)
         *
         * @private
         * @returns {string}
         * @memberof ConfigManagerWidget
         */
        getScriptInformationForTreeGrid() {
            var str = `<script type="text/x-jsrender" id="cmDisplayNameColumnTemplate">
				<div style='height:24px;' unselectable='on'>
					<div class='cmIndent' style='width:{{:level*20}}px;'></div>
                    <div class='cmCollapseExpandIcon'>{{:#data['collapseExpandIconDefinition']}}</div>
                    <div class='cmNodeIcon'>{{:#data['iconDefinition']}}</div>                   
                                     
                    <div class='e-cell cmCell' unselectable='on'>{{:#data['displayName']}}</div>
                    </div>
		</script>`;
            return str;
        }
        /**
         * Load the styles for the config manager
         *
         * @memberof ConfigManagerWidget
         */
        loadStyles() {
            super.addStyle("widgets/configManagerWidget/style/css/treeGridIconStyles.css");
        }
        handleModelChanged(sender, eventArgs) {
            // delegate model change processing depending on change type (hint)
            switch (eventArgs.hint) {
                case "writeAccessChanged":
                    this.handleWriteAccessChanged(eventArgs.data);
                    break;
                default:
                    this.updateGridData(sender);
            }
        }
        /**
         * Handles write access changes.
         *
         * @private
         * @param {boolean} writeAccess
         * @memberof ConfigManagerWidget
         */
        handleWriteAccessChanged(writeAccess) {
            this.updateWriteAccess(writeAccess);
        }
        /**
         * Updates write access related ui states.
         *
         * @param {boolean} writeAccess
         * @memberof ConfigManagerWidget
         */
        updateWriteAccess(writeAccess) {
            if (this._configManagerWidgetDataModel != undefined) {
                this._configManagerWidgetDataModel.writeAccess = writeAccess;
            }
            let toolbar = this._toolbar;
            toolbar.setWriteAccess(writeAccess);
            this.refresh();
        }
        /**
         * Applies the modified parameters (writes them to target)
         *
         * @memberof ConfigManagerWidget
         */
        applyModifiedParameters() {
            if (this._configManagerWidgetDataModel) {
                this._configManagerWidgetDataModel.applyModifiedParameters();
            }
        }
        /**
         * Discards parameter modifications
         *
         * @memberof ConfigManagerWidget
         */
        discard() {
            if (this._configManagerWidgetDataModel) {
                this._configManagerWidgetDataModel.discard();
            }
        }
        /**
         * Executes the save parameters method
         *
         * @memberof ConfigManagerWidget
         */
        saveParameters() {
            if (this._saveParametersMethod != undefined) {
                if (this._saveParametersMethod.isExecutable != undefined) {
                    if (this._saveParametersMethod.isExecutable.value == true) {
                        mappCockpitComponent_1.MappCockpitComponentMethod.execute(this._saveParametersMethod);
                    }
                }
            }
        }
        /**
         * Activates/Deactivates the edit mode
         *
         * @param {boolean} activate
         * @memberof ConfigManagerWidget
         */
        setEditMode(activate) {
            this._editModeActive = activate;
            // Set the info if the editmode is active or not to the datamodel
            if (!(this.dataModel instanceof widgetBase_1.NullDataModel)) {
                this.dataModel.setEditModeActive(activate);
            }
            // Show or hide edit mode columns
            let treeObject = this.getTreeGridObject();
            let modifiedValueColumn = treeObject.getColumnByField(ConfigManagerWidget_1.displayModifiedValueColumnId);
            if (activate == true) {
                treeObject.showColumn(modifiedValueColumn.headerText);
            }
            else {
                treeObject.hideColumn(modifiedValueColumn.headerText);
            }
            this.updateGridData(this.dataModel);
            // Update toolbar button positions(e.g. position of right align toolbar) after hide or show toolbar button
            this._toolbar.resize(this.width);
        }
        /**
         * Handles the changes of observed items requested by 'observeDataModelItems'
         *
         * @param {IDataModel} sender
         * @param {EventModelChangedArgs} eventArgs
         * @memberof ConfigManagerWidget
         */
        handleModelItemsChanged(sender, eventArgs) {
            this.updateGridData(sender);
        }
        /**
         * Activate the configmanagerwidget
         *
         * @memberof ConfigManagerWidget
         */
        activate() {
            let componentParameters = this.getComponentParameters();
            if (componentParameters != undefined) {
                mappCockpitComponent_1.MappCockpitComponentParameter.activateComponentModelItems(this.dataModel, componentParameters);
            }
        }
        /**
         * Deactivate the configmanagerwidget
         *
         * @memberof ConfigManagerWidget
         */
        deactivate() {
            let componentParameters = this.getComponentParameters();
            if (componentParameters) {
                mappCockpitComponent_1.MappCockpitComponentParameter.deactivateComponentModelItems(this.dataModel, componentParameters);
            }
        }
        /**
         * Dispose the configmanagerwidget
         *
         * @memberof ConfigManagerWidget
         */
        dispose() {
            if (this.dataModel != undefined) {
                this.dataModel.dispose();
            }
            super.dispose();
        }
        /**
         * Creates the tree grid for the configuration structure
         *
         * @protected
         * @memberof ConfigManagerWidget
         */
        createTreeGrid() {
            let cellEditEvents = new cmTreeGridCellEditEvents_1.CmTreeGridCellEditEvents();
            let cellStyle = new cmTreeGridCellStyle_1.CmTreeGridCellStyle();
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridColumnResizeSupport()), this.getTreeGridToolbarSupport()), { dataSource: undefined, childMapping: "childs", expandStateMapping: "expandState", isResponsive: false, allowReordering: false, editSettings: {
                    allowEditing: true,
                    allowDeleting: false,
                    showDeleteConfirmDialog: false,
                    showConfirmDialog: false,
                }, expanded: (args) => this.treeGridNodeExpandedOrCollapsed(), collapsed: (args) => this.treeGridNodeExpandedOrCollapsed(), queryCellInfo: (args) => cellStyle.setCellStyle(args, this._configManagerWidgetDataModel), beginEdit: (args) => cellEditEvents.beginEdit(args, this._configManagerWidgetDataModel), endEdit: (args) => cellEditEvents.endEdit(args, this._configManagerWidgetDataModel), create: (args) => this.treeGridCreated() }));
        }
        /**
         * Returns the tree grid column definition
         *
         * @private
         * @returns {{}}
         * @memberof ConfigManagerWidget
         */
        getTreeGridColumnDefinition() {
            return {
                columns: [
                    { field: ConfigManagerWidget_1.displayNameColumnId, headerText: "Name", width: "300", isTemplateColumn: true, templateID: "cmDisplayNameColumnTemplate" },
                    { field: ConfigManagerWidget_1.displayModifiedValueColumnId, headerText: "Value", visible: false, width: "180", editType: "stringedit", editTemplate: cmTreeGridCellEditTemplate_1.CmTreeGridCellEditTemplate.createInstance() },
                    { field: ConfigManagerWidget_1.displayValueColumnId, headerText: "Target Value", width: "180", editType: "stringedit", editTemplate: cmTreeGridCellEditTemplate_1.CmTreeGridCellEditTemplate.createInstance() },
                    { field: ConfigManagerWidget_1.unitColumnId, headerText: "Unit", width: "100" },
                    { field: ConfigManagerWidget_1.descriptionColumnId, headerText: "Description", width: "400" },
                ],
            };
        }
        /**
         * Returns the tree grid column resize settings
         *
         * @private
         * @returns {{}}
         * @memberof ConfigManagerWidget
         */
        getTreeGridColumnResizeSupport() {
            return {
                allowColumnResize: true,
                columnResizeSettings: { columnResizeMode: ej.TreeGrid.ColumnResizeMode.FixedColumns },
                columnResized: (args) => super.resizeDynamicColumn(args.columnIndex, args.model),
            };
        }
        /**
         * Returns the tree grid toolbar settings
         *
         * @private
         * @returns {{}}
         * @memberof ConfigManagerWidget
         */
        getTreeGridToolbarSupport() {
            this._toolbar = new cmTreeGridToolbar_1.CmTreeGridToolbar(this.mainDiv);
            return super.getTreeGridToolbarSupport();
        }
        /**
         * Handles the collapse/expand events
         *
         * @private
         * @memberof ConfigManagerWidget
         */
        treeGridNodeExpandedOrCollapsed() {
            // Refresh to see correct expanded/collapsed icon
            this.refresh();
        }
        /**
         * Returns the component parameters from the datamodel
         *
         * @private
         * @returns {(Array<MappCockpitComponentParameter>|undefined)}
         * @memberof ConfigManagerWidget
         */
        getComponentParameters() {
            return this.dataModel.componentParameters;
        }
        /**
         * Updates the grids data
         *
         * @private
         * @param {IDataModel} dataModel
         * @memberof ConfigManagerWidget
         */
        updateGridData(dataModel) {
            let newDataModel = new configManagerWidgetDataModel_1.ConfigManagerWidgetDataModel(dataModel);
            if (this._configManagerWidgetDataModel != undefined) {
                newDataModel.writeAccess = this._configManagerWidgetDataModel.writeAccess;
                // set expands states from the current to the new datamodel
                newDataModel.setExpandStates(this._configManagerWidgetDataModel.getDataModel());
                this._configManagerWidgetDataModel.dispose();
            }
            this._configManagerWidgetDataModel = newDataModel;
            let toolbar = this._toolbar;
            toolbar.setTransferPossible(this._configManagerWidgetDataModel.isTransferPossible);
            this.refresh();
        }
        /**
         * refreshes the tree grids data
         *
         * @memberof ConfigManagerWidget
         */
        refresh() {
            return __awaiter(this, void 0, void 0, function* () {
                // multiple refresh requests will be delayed as long as no request is received within the specified timeout. This in consequence supresses too many updates.
                this.invokeDelayedUIRefresh();
            });
        }
        /**
         * Invokes a delayedUI update request
         *
         * @private
         * @memberof ConfigManagerWidget
         */
        invokeDelayedUIRefresh() {
            // reset the current timeout
            clearTimeout(this._uiRefreshTimer);
            // start the next timeout
            this._uiRefreshTimer = setTimeout(() => {
                this.refreshGrid();
            }, this._uiRefreshDelay);
        }
        /**
         * Refreshes thegrid content
         *
         * @private
         * @memberof ConfigManagerWidget
         */
        refreshGrid() {
            if (this._configManagerWidgetDataModel != undefined && this.refreshEnabled) {
                let datamodel = this._configManagerWidgetDataModel.getDataModel();
                this.setModelWithEditSupport(datamodel);
            }
        }
    };
    // column definitions
    ConfigManagerWidget.displayNameColumnId = "displayName";
    ConfigManagerWidget.displayModifiedValueColumnId = "modifiedDisplayValue";
    ConfigManagerWidget.displayValueColumnId = "displayValue";
    ConfigManagerWidget.unitColumnId = "unit";
    ConfigManagerWidget.descriptionColumnId = "description";
    ConfigManagerWidget = ConfigManagerWidget_1 = __decorate([
        mco.role()
    ], ConfigManagerWidget);
    exports.ConfigManagerWidget = ConfigManagerWidget;
});
