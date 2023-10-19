var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../models/online/mappCockpitComponent", "./methodParameterEditor", "../common/treeGridWidgetBase", "../common/domHelper", "./methodParameterFilterHelper"], function (require, exports, mappCockpitComponent_1, methodParameterEditor_1, treeGridWidgetBase_1, domHelper_1, methodParameterFilterHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MethodParameterListWidget = void 0;
    /**
     * implements the MethodParameterList widget
     *
     * @class MethodParameterListWidget
     * @extends {TreeGridWidgetBase}
     */
    let MethodParameterListWidget = class MethodParameterListWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            // Holds id of execute button
            this._executeButtonId = '';
            // Holds method filter helper class
            this._methodParameterHelper = new methodParameterFilterHelper_1.MethodParameterFilterHelper(this);
            /**
             * True if parameter list update is active
             *
             * @private
             * @memberof MethodParameterListWidget
             */
            this._parameterListUpdateIsActive = false;
        }
        /**
         * Defines the height of the footer
         *
         * @returns {number}
         * @memberof MethodParameterListWidget
         */
        defineFooterHeight() {
            return 36;
        }
        initialized() {
            super.initialized();
            this._executeButtonId = this.mainDivId + "_ExecuteButton";
            this.setFooterContent("<div id='" + this._executeButtonId + "' style='margin-top: -5px; margin-left: -5px;'></div>");
            this.createExecuteButton("Select command");
            // Set dynamic column settings
            super.setDynamicColumn(0, 100);
        }
        createExecuteButton(commandDisplayName) {
            $("#" + this._executeButtonId).ejButton({
                cssClass: 'e-primary',
                // size:ej.ButtonSize.Large,
                width: "100%",
                height: "34px",
                enabled: false,
                contentType: "textandimage",
                text: commandDisplayName,
                imagePosition: ej.ImagePosition.ImageRight,
                showRoundedCorner: false,
                click: (args) => { this.handleExecuteMethodClicked(args); },
                prefixIcon: "e-icon e-mediaplay"
            });
            $("#" + this._executeButtonId).css("font-size", "20px");
        }
        /**
         * handles click on the method execute button
         *
         * @param {*} args
         * @returns {*}
         * @memberof MethodParameterListWidget
         */
        handleExecuteMethodClicked(args) {
            var treeObj = this.getTreeGridObject();
            // Save cell if currently in edit mode before executing method
            treeObj.saveCell();
            this.executeMethod();
        }
        /**
         * executes the selected method
         *
         * @private
         * @memberof MethodParameterListWidget
         */
        executeMethod() {
            if (this._actualMethod && this._actualMethod instanceof mappCockpitComponent_1.MappCockpitComponentMethod) {
                mappCockpitComponent_1.MappCockpitComponentMethod.execute(this._actualMethod);
            }
        }
        /**
         * Loads the styles for the method execute button
         *
         * @memberof MethodParameterListWidget
         */
        loadStyles() {
            super.addStyle("widgets/methodParameterListWidget/style/css/methodExecuteButtonStyle.css");
        }
        /** resizes the methods parameter list widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof MethodParameterListWidget
         */
        resize(width, height) {
            super.resize(width, height);
            this.resizeExecuteButton(width);
        }
        /**
        * creates the tree grid for the method parameters list
        *
        * @protected
        * @returns {*}
        * @memberof MethodParameterListWidget
        */
        createTreeGrid() {
            var parameterListDataSource = [{}];
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridColumnResizeSupport()), { dataSource: parameterListDataSource, editSettings: {
                    allowEditing: true,
                    allowAdding: false,
                    allowDeleting: false,
                    showDeleteConfirmDialog: false,
                    showConfirmDialog: false
                }, beginEdit: (args) => this.beginEdit(args), endEdit: (args) => this._methodParameterHelper.endTreegridEdit(this._actualMethod), queryCellInfo: (args) => this.showParametersInListDisabled(args) }));
        }
        /**
         * Returns the tree grid column definition
         *
         * @private
         * @returns {{}}
         * @memberof MethodParameterListWidget
         */
        getTreeGridColumnDefinition() {
            return {
                columns: [
                    { field: "displayName", headerText: "Parameter", isPrimaryKey: true, allowEditing: false },
                    { field: "displayValue", headerText: "Value", width: "100", editType: "stringedit", editTemplate: methodParameterEditor_1.MappCockpitParameterTypeEditor.createInstance() },
                    { field: "engineeringUnit", headerText: "Unit", width: "100" },
                ],
            };
        }
        /**
         * Returns the tree grid column resize settings
         *
         * @private
         * @returns {{}}
         * @memberof MethodParameterListWidget
         */
        getTreeGridColumnResizeSupport() {
            return {
                allowColumnResize: true,
                columnResizeSettings: { columnResizeMode: ej.TreeGrid.ColumnResizeMode.FixedColumns },
                columnResized: (args) => super.resizeDynamicColumn(args.columnIndex, args.model),
            };
        }
        /**
         * Update input parameter state (enable/disable)
         *
         * @private
         * @param {*} args
         * @memberof MethodParameterListWidget
         */
        showParametersInListDisabled(args) {
            if (this._actualMethod != undefined && this._actualMethod.isExecutable != undefined) {
                if (args.cellElement.classList != undefined) {
                    // Show ReadOnly cell with other color
                    let disableTreeCellClassName = "treeCellDisabled";
                    if (this._actualMethod.isExecutable.value == false) {
                        args.cellElement.classList.add(disableTreeCellClassName);
                    }
                    else {
                        args.cellElement.classList.remove(disableTreeCellClassName);
                    }
                }
                domHelper_1.DomHelper.disableElement(args.cellElement, !this._actualMethod.isExecutable.value);
            }
        }
        /**
         * Called when edit cell action is started.
         *
         * @private
         * @param {*} args
         * @memberof MethodParameterListWidget
         */
        beginEdit(args) {
            // Only value column can be edited (TODO: use column id instead of index)
            if (args.columnIndex != 1) { // 1 = value column
                args.cancel = true;
            }
            else {
                if (this._actualMethod == undefined) {
                    args.cancel = true;
                }
                else if (this._actualMethod.isExecutable == undefined) {
                    args.cancel = true;
                }
                else if (this._actualMethod.isExecutable.value == false) {
                    args.cancel = true;
                }
                else if (this._actualMethod.inputParameters != undefined && this._actualMethod.inputParameters.length == 0) {
                    // No input parameters available for this method; cancel edit of value column
                    args.cancel = true;
                }
            }
        }
        /**
         * updates the content of the method parameters list
         *
         * @param {MappCockpitComponentMethod} method
         * @memberof MethodParameterListWidget
         */
        updateParametersList(method) {
            //console.info("CALL updateParametersList: " + method.browseName);
            if (this._actualMethod == method) {
                // No change of method
                return;
            }
            this.observeMethodExecutability(this._actualMethod, method);
            if (this._parameterListUpdateIsActive == true) {
                this._nextMethodForParameterListUpdate = method;
                return;
            }
            else {
                this._nextMethodForParameterListUpdate = undefined;
            }
            this._parameterListUpdateIsActive = true;
            this._actualMethod = method;
            // Check if method has been browsed already
            if (this._methodParameterHelper.methodInputParametersMapping.has(method.browseName)) {
                this.updateTreegridData(method);
            }
            else {
                // Browse method's input parameters
                mappCockpitComponent_1.MappCockpitComponentMethod.updateInputParameters(method).then((inputParameters) => {
                    // add mapping to methodParameterHelper and update tree grid
                    this._methodParameterHelper.addMethodInputParameters(method);
                    this.updateTreegridData(method);
                });
            }
        }
        /**
         * Update tree grid
         *
         * @private
         * @param {MappCockpitComponentMethod} method
         * @memberof MethodParameterListWidget
         */
        updateTreegridData(method) {
            let inputParameters = this._methodParameterHelper.methodInputParametersMapping.get(method.browseName);
            this.populateMethodParameterList(inputParameters, method);
            this._parameterListUpdateIsActive = false;
            if (this._nextMethodForParameterListUpdate != undefined) {
                this.updateParametersList(this._nextMethodForParameterListUpdate);
            }
        }
        /**
         * Detach/attach observer when selected method has changed
         *
         * @param {MappCockpitComponentMethod | undefined} previousMethod
         * @param {MappCockpitComponentMethod} method
         * @memberof MethodParameterListWidget
         */
        observeMethodExecutability(previousMethod, method) {
            if (previousMethod != undefined && previousMethod.isExecutable.isObservedBy(this)) {
                previousMethod.isExecutable.detachObserver(this);
            }
            method.isExecutable.attachObserver(this, (isExecutable) => {
                this.updateExecutePaneText(method);
            });
        }
        /**
         * Detach observation
         *
         * @private
         * @memberof MethodParameterListWidget
         */
        detachExecutePaneMethod() {
            if (this._actualMethod) {
                this._actualMethod.isExecutable.detachObserver(this);
            }
        }
        /**
         * Populate the method parameter list
         *
         * @private
         * @param {MappCockpitMethodParameter[]} inputParameters
         * @param {MappCockpitComponentMethod} method
         * @returns
         * @memberof MethodParameterListWidget
         */
        populateMethodParameterList(inputParameters, method) {
            var parameterListDataSource = [];
            if (inputParameters.length > 0) {
                parameterListDataSource = inputParameters;
            }
            var treeObj = this.getTreeGridObject();
            if (!treeObj) {
                return;
            }
            // Save cell if currently in edit mode before refreshing, otherwise refresh is not working
            treeObj.saveCell();
            // To refresh TreeGrid with new datasource
            treeObj.setModel({ "dataSource": parameterListDataSource }, true);
            this.resize(this._actualWidth, this._actualHeight);
            this.updateExecutePaneText(method);
        }
        /**
         * Update execute pane text
         *
         * @private
         * @param {MappCockpitComponentMethod} method
         * @returns {*}
         * @memberof MethodParameterListWidget
         */
        updateExecutePaneText(method) {
            let buttonActive = false;
            if (method != undefined && method.isExecutable != undefined) {
                if (method.isExecutable.value == true) {
                    buttonActive = true;
                }
            }
            // get button instance;
            let executeBtn = $("#" + this._executeButtonId).data("ejButton");
            if (executeBtn) {
                // set button text
                executeBtn.option({ text: method.displayName });
                // set button active state
                executeBtn.option({ enabled: buttonActive });
            }
        }
        resizeExecuteButton(width) {
            let executeBtn = $("#" + this._executeButtonId).data("ejButton");
            executeBtn.option({ width: width - 1 });
        }
        dispose() {
            this.detachExecutePaneMethod();
        }
    };
    MethodParameterListWidget = __decorate([
        mco.role()
    ], MethodParameterListWidget);
    exports.MethodParameterListWidget = MethodParameterListWidget;
});
