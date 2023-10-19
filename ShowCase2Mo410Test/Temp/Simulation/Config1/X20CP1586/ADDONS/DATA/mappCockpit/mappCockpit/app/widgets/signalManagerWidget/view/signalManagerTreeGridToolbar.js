var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/treeGridToolbarBase", "../../../common/directoryProvider", "../helpers/exportHelper", "./signalManagerExportDropDownMenu"], function (require, exports, treeGridToolbarBase_1, directoryProvider_1, exportHelper_1, signalManagerExportDropDownMenu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalManagerTreeGridToolbar = void 0;
    let SignalManagerTreeGridToolbar = class SignalManagerTreeGridToolbar extends treeGridToolbarBase_1.TreeGridToolbarBase {
        /**
         * Creates an instance of SignalManagerTreeGridToolbar.
         * @param {HTMLDivElement} widgetDiv
         * @memberof SignalManagerTreeGridToolbar
         */
        constructor(widgetDiv) {
            super(widgetDiv);
            this._toolbarIdImport = "Import";
            this._toolbarToolTipImport = "Imports trace data";
            this._toolbarIdExport = "Export";
            this._toolbarToolTipExport = "Exports trace data";
            this._toolbarIdCalculation = "Calculation";
            this._toolbarToolTipCalculation = "Inserts a new calculation";
            this._toolbarIdDelete = "Delete";
            this._toolbarToolTipDelete = "Delete trace data";
            this._toolbarIdEditMode = "EditMode";
            this._toolbarToolTipEditMode = "Open/Close edit mode";
            this._editModeActivated = false;
            let imageDirectory = "../../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "signalManagerWidget/style/images/toolbar/";
            // buttons for the editor
            this.addToolbarButton(this._toolbarIdImport, this._toolbarToolTipImport, imageDirectory + "import.svg");
            this.addToolbarButton(this._toolbarIdExport, this._toolbarToolTipExport, imageDirectory + "export.svg");
            this.addToolbarButton(this._toolbarIdCalculation, this._toolbarToolTipCalculation, imageDirectory + "calculation.svg");
            this.addToolbarButton(this._toolbarIdDelete, this._toolbarToolTipDelete, imageDirectory + "delete.svg");
            // global used buttons of tree grid
            this.setCollapseLevel(1);
            this.addCollapseButton();
            this.addExpandButton();
            // buttons on the right side
            this.addToolbarButton(this._toolbarIdEditMode, this._toolbarToolTipEditMode, imageDirectory + "editMode.svg", treeGridToolbarBase_1.ToolbarButtonAlignment.Right);
            this.dropDownMenu = new signalManagerExportDropDownMenu_1.SignalManagerExportDropDownMenu(this, this._widgetMainDiv);
        }
        /**
         * Sets the default toolbar states at startup
         *
         * @memberof SignalManagerTreeGridToolbar
         */
        initToolbarStates() {
            super.initToolbarStates();
            // At the beginning the export/delete/insert calculation button is disabled because no selection is available
            this.disableExportButton(true);
            this.disableDeleteButton(true);
            this.disableInsertCalculationButton(true);
        }
        /**
         * Reacts on toolbar click
         *
         * @param {*} args
         * @param {SignalManagerWidget} signalManagerWidget
         * @memberof SignalManagerTreeGridToolbar
         */
        toolbarClick(args, signalManagerWidget) {
            //set edit cell to false so treegrid can be updated
            signalManagerWidget.setCellEdit(false);
            super.toolbarClickBase(args);
            var clickedToolbarId = this.getClickedToolbarId(args.itemName, args.model.toolbarSettings);
            if (clickedToolbarId == this._toolbarIdImport) {
                signalManagerWidget.importSerieGroup();
            }
            else if (clickedToolbarId == this._toolbarIdExport) {
                if (!this.dropDownMenu.isOpened) {
                    let selectedItemsExportable = signalManagerWidget.canItemsBeExported(args.model.selectedItems);
                    this.dropDownMenu.showDropDownMenu(signalManagerWidget, args.model, selectedItemsExportable);
                }
                else {
                    this.dropDownMenu.hideDropDownMenu();
                }
            }
            else if (clickedToolbarId == this._toolbarIdCalculation) {
                signalManagerWidget.insertCalculation(args.model.selectedItem);
            }
            else if (clickedToolbarId == this._toolbarIdDelete) {
                let selectedItems = Object.assign([], args.model.selectedItems);
                if (signalManagerWidget.containsItemWithinRecentOrUploaded(selectedItems)) {
                    signalManagerWidget.showMessageBoxForDeletingItem(selectedItems);
                }
                else {
                    signalManagerWidget.deleteItems(selectedItems);
                }
            }
            else if (clickedToolbarId == this._toolbarIdEditMode) {
                this._editModeActivated = !this._editModeActivated;
                this.activateEditModeButton(this._editModeActivated);
                signalManagerWidget.activateEditMode(this._editModeActivated);
            }
        }
        exportSelectedTraceData(signalManagerWidget, selectedItems) {
            let items = new exportHelper_1.ExportHelper().getExportableElements(selectedItems);
            signalManagerWidget.exportSerieGroup(items);
        }
        exportAllTraceDataAsCsv(signalManagerWidget, allItems) {
            let itemsTobeExported = Object.assign([], allItems);
            let items = new exportHelper_1.ExportHelper().getExportableElements(itemsTobeExported);
            signalManagerWidget.exportSerieGroup(items);
        }
        exportAllTraceData(signalManagerWidget) {
            signalManagerWidget.exportSignalManagerData();
        }
        disableExportButton(disable) {
            this.disableButton(this._toolbarIdExport, disable);
        }
        disableDeleteButton(disable) {
            this.disableButton(this._toolbarIdDelete, disable);
        }
        disableInsertCalculationButton(disable) {
            this.disableButton(this._toolbarIdCalculation, disable);
        }
        activateEditModeButton(activate) {
            this._editModeActivated = activate;
            this.activateButton(this._toolbarIdEditMode, activate);
        }
    };
    SignalManagerTreeGridToolbar = __decorate([
        mco.role()
    ], SignalManagerTreeGridToolbar);
    exports.SignalManagerTreeGridToolbar = SignalManagerTreeGridToolbar;
});
