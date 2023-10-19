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
define(["require", "exports", "./treeGridWidgetBase", "../../controller/openViewManagement/models/openContentView", "../../controller/openViewManagement/controller/openViewMainController", "./busyInformation", "../../common/utilities/utilities"], function (require, exports, treeGridWidgetBase_1, openContentView_1, openViewMainController_1, busyInformation_1, utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OverviewTreeGridWidgetBase = void 0;
    let OverviewTreeGridWidgetBase = class OverviewTreeGridWidgetBase extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            /**
             * Items which should be shown in the overview tree grid
             *
             * @protected
             * @type {Array<OverviewItem>}
             * @memberof OverviewTreeGridWidgetBase
             */
            this._dataSource = new Array();
        }
        /**
         * Defines the height of the header
         *
         * @returns {number}
         * @memberof OverviewTreeGridWidgetBase
         */
        defineHeaderHeight() {
            return 30;
        }
        /**
         * Initializes the widget
         *
         * @memberof OverviewTreeGridWidgetBase
         */
        initialized() {
            super.initialized();
            super.setHeaderContent(this.getHeaderText());
            // Set dynamic column settings
            super.setDynamicColumn(1, 100);
        }
        /**
         * Handles the activation of the widget
         *
         * @memberof OverviewTreeGridWidgetBase
         */
        activate() {
            this.updateTreeGridDataSource();
        }
        /**
         * Creates the tree grid for the items overview
         *
         * @protected
         * @memberof OverviewTreeGridWidgetBase
         */
        createTreeGrid() {
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridColumnResizeSupport()), this.getTreeGridColumnSorting()), { recordDoubleClick: (args) => this.doubleClickFromTreeGrid(args), queryCellInfo: (args) => {
                    if (args.column.field == "commandButtons") {
                        this.addCommandButtons(args);
                    }
                } }));
        }
        /**
         * Updates the tree grids dataSource
         *
         * @protected
         * @returns
         * @memberof OverviewTreeGridWidgetBase
         */
        updateTreeGridDataSource() {
            if (this._dataSource == undefined) {
                return;
            }
            if (this.mainDiv != undefined) {
                let mainDiv = $(this.mainDiv);
                if (mainDiv != undefined) {
                    mainDiv.ejTreeGrid({
                        dataSource: this._dataSource,
                    });
                }
            }
        }
        /**
         * Loads the styles for the overview treegrid widget base
         *
         * @memberof OverviewTreeGridWidgetBase
         */
        loadStyles() {
            super.loadStyles();
            this.addStyle("widgets/common/style/css/overviewCommandButtonStyle.css");
            this.addStyle("widgets/common/style/css/iconComponentViewStyle.css");
            this.addStyle("widgets/common/style/css/iconTraceConfigurationViewStyle.css");
            this.addStyle("widgets/common/style/css/iconTraceViewStyle.css");
            this.addStyle("widgets/common/style/css/iconLoggerViewStyle.css");
        }
        /**
         * Adds the available buttons to the given overview item in the commandButtons field
         *
         * @private
         * @param {*} args
         * @memberof OverviewTreeGridWidgetBase
         */
        addCommandButtons(args) {
            args.cellElement.innerHTML = "";
            var cellRowIndex = args.data.index;
            let commandIds = this.getCommandIdsFromItem(args.data.item);
            // Add divs for the buttons
            for (let index = 0; index < commandIds.length; index++) {
                let commandId = commandIds[index];
                let uniqueId = this.getUniqueButtonId(commandId, cellRowIndex);
                args.cellElement.innerHTML += "<div id='" + uniqueId + "' ></div>   ";
            }
            ;
            // Create ejButtons within the divs (after all divs were inserted in the innerHTML, otherwise problems occur)
            for (let index = 0; index < commandIds.length; index++) {
                let commandId = commandIds[index];
                let uniqueId = this.getUniqueButtonId(commandId, cellRowIndex);
                this.createButton(uniqueId, commandId, args.data.item);
            }
            ;
        }
        /**
         * Creates a single button
         *
         * @private
         * @param {string} uniqueId
         * @param {string} commandId
         * @param {OverviewItem} overviewItem
         * @memberof OverviewTreeGridWidgetBase
         */
        createButton(uniqueId, commandId, overviewItem) {
            let imageClass = this.getIconClassNameForCommandId(commandId) + "-Overview";
            let buttonObj = $(this.mainDiv).find("#" + uniqueId);
            buttonObj.ejButton({
                text: this.getNameForCommandId(commandId),
                contentType: ej.ContentType.TextAndImage,
                cssClass: "overviewCommandButton " + imageClass,
                prefixIcon: "e-icon",
                click: (clickArgs) => this.click(overviewItem, commandId),
            });
        }
        /**
         * Returns a unique button id
         *
         * @private
         * @param {string} commandId
         * @param {*} cellRowIndex
         * @returns {string}
         * @memberof OverviewTreeGridWidgetBase
         */
        getUniqueButtonId(commandId, cellRowIndex) {
            return "overviewCommandButton" + commandId + cellRowIndex;
        }
        /**
         * Returns the column resize support definitions
         *
         * @private
         * @returns {{}}
         * @memberof OverviewTreeGridWidgetBase
         */
        getTreeGridColumnResizeSupport() {
            return {
                allowColumnResize: true,
                columnResizeSettings: { columnResizeMode: ej.TreeGrid.ColumnResizeMode.FixedColumns },
                columnResized: (args) => super.resizeDynamicColumn(args.columnIndex, args.model),
            };
        }
        /**
         * Handles the double click event from the treegrid
         *
         * @private
         * @param {*} args
         * @memberof OverviewTreeGridWidgetBase
         */
        doubleClickFromTreeGrid(args) {
            if (args.model.selectedItem != undefined) {
                this.doubleClick(args.columnName, args.model.selectedItem.item);
            }
        }
        /**
         * Returns the definition for column sorting(=> deactivated)
         *
         * @protected
         * @returns {{}}
         * @memberof OverviewTreeGridWidgetBase
         */
        getTreeGridColumnSorting() {
            return {
                allowSorting: false,
            };
        }
        /**
         * Raises the event for opening a view with the given type for the given component
         *
         * @protected
         * @param {string} componentId
         * @param {string} componentDisplayName
         * @param {ViewType} viewType
         * @memberof OverviewTreeGridWidgetBase
         */
        onOpenView(componentId, componentDisplayName, viewType, groupTags) {
            return __awaiter(this, void 0, void 0, function* () {
                this.setBusyInformation(new busyInformation_1.BusyInformation("Loading...", busyInformation_1.ImageId.defaultImage, 48, true));
                this.setBusy(true);
                yield utilities_1.Utilities.sleep(50);
                openViewMainController_1.OpenViewMainController.getInstance().executeAddAndOpenView(new openContentView_1.OpenContentView(componentId, componentDisplayName, viewType, groupTags));
                this.setBusy(false);
            });
        }
    };
    OverviewTreeGridWidgetBase = __decorate([
        mco.role()
    ], OverviewTreeGridWidgetBase);
    exports.OverviewTreeGridWidgetBase = OverviewTreeGridWidgetBase;
});
