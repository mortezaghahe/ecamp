var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../models/chartManagerDataModel/chartManagerChart", "../../common/treeGridToolbarBase", "../../../common/directoryProvider", "../../../models/common/series/baseSeries", "../../../models/chartManagerDataModel/scale", "./chartManagerTreeGridDropDownMenu"], function (require, exports, chartManagerChart_1, treeGridToolbarBase_1, directoryProvider_1, baseSeries_1, scale_1, chartManagerTreeGridDropDownMenu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartManagerTreeGridToolbar = void 0;
    let ChartManagerTreeGridToolbar = class ChartManagerTreeGridToolbar extends treeGridToolbarBase_1.TreeGridToolbarBase {
        /**
         * Creates an instance of ChartManagerTreeGridToolbar.
         * @param {HTMLDivElement} widgetDiv
         * @param {IChartManagerDataModel} dataModel
         * @memberof ChartManagerTreeGridToolbar
         */
        constructor(widgetDiv, dataModel) {
            super(widgetDiv);
            this._toolbarIdAdd = "Add";
            this._toolbarToolTipAdd = "Adds a new chart/scale";
            this._toolbarIdDelete = "Delete";
            this._toolbarToolTipDelete = "Deletes a chart, a scale or a signal";
            this.dataModel = dataModel;
            this.dropDownMenu = new chartManagerTreeGridDropDownMenu_1.ChartManagerTreeGridDropDownMenu(this.dataModel, this._widgetMainDiv);
            let imageDirectory = "../../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "chartManagerWidget/style/images/";
            this.addToolbarButton(this._toolbarIdAdd, this._toolbarToolTipAdd, imageDirectory + "add.svg");
            this.addToolbarButton(this._toolbarIdDelete, this._toolbarToolTipDelete, imageDirectory + "delete.svg");
            this.addCollapseButton();
            this.addExpandButton();
        }
        /**
         * Sets the default toolbar states at startup
         *
         * @memberof ChartManagerTreeGridToolbar
         */
        initToolbarStates() {
            super.initToolbarStates();
            // disable dummy button after creation
            this.disableDeleteButton(true);
        }
        /**
         * Updates the chartmanager datamodel
         *
         * @param {IChartManagerDataModel} dataModel
         * @memberof ChartManagerTreeGridToolbar
         */
        updateDataModel(dataModel) {
            this.dataModel = dataModel;
            this.dropDownMenu.updateDataModel(dataModel);
        }
        /**
         * Reacts on toolbar click
         *
         * @param {*} args
         * @memberof ChartManagerTreeGridToolbar
         */
        toolbarClick(args, widget) {
            super.toolbarClickBase(args);
            var clickedToolbarId = this.getClickedToolbarId(args.itemName, args.model.toolbarSettings);
            if (clickedToolbarId == this._toolbarIdAdd) {
                args.cancel = true;
                if (!this.dropDownMenu.isOpened) {
                    this.dropDownMenu.showDropDownMenu(this.selectedChart);
                }
                else {
                    this.dropDownMenu.hideDropDownMenu();
                }
            }
            else if (clickedToolbarId == this._toolbarIdDelete) {
                args.cancel = true;
                this.deleteItem(args.model.selectedItem);
            }
        }
        /**
         * deletes the given datamodel item(chart, scale, serie) from the datamodel
         *
         * @private
         * @param {*} selectedModelItem
         * @memberof ChartManagerTreeGridToolbar
         */
        deleteItem(selectedModelItem) {
            let selectedItem = selectedModelItem.item;
            if (selectedModelItem != null) {
                if (selectedItem instanceof chartManagerChart_1.ChartManagerChart) {
                    // Remove chart from datamodel
                    this.dataModel.removeChart(selectedItem);
                }
                else if (selectedItem instanceof baseSeries_1.BaseSeries) {
                    var chart = selectedModelItem.parentItem.parentItem.item;
                    if (chart != undefined) {
                        // Remove serie from datamodel
                        this.dataModel.removeSerie(chart, selectedItem);
                    }
                }
                else if (selectedItem instanceof scale_1.Scale) {
                    var chart = selectedModelItem.parentItem.item;
                    if (chart != undefined) {
                        // Remove yAxis from datamodel
                        this.dataModel.removeYAxis(chart, selectedItem);
                    }
                }
            }
        }
        /**
         * Disables/Enables the delete chart/serie button in the toolbar
         *
         * @param {boolean} disable
         * @memberof ChartManagerTreeGridToolbar
         */
        disableDeleteButton(disable) {
            this.disableButton(this._toolbarIdDelete, disable);
        }
        /**
         * Disables/Enables the add chart button in the toolbar
         *
         * @param {boolean} disable
         * @memberof ChartManagerTreeGridToolbar
         */
        disableAddButton(disable) {
            this.disableButton(this._toolbarIdAdd, disable);
        }
        /**
         * sets the current selected chart
         *
         * @param {(IChartManagerChart|Scale|BaseSeries)} chart
         * @memberof ChartManagerTreeGridToolbar
         */
        setSelectedChart(chart) {
            if (chart instanceof chartManagerChart_1.ChartManagerChart) {
                this.selectedChart = chart;
            }
            else {
                this.selectedChart = undefined;
            }
        }
    };
    ChartManagerTreeGridToolbar = __decorate([
        mco.role()
    ], ChartManagerTreeGridToolbar);
    exports.ChartManagerTreeGridToolbar = ChartManagerTreeGridToolbar;
});
