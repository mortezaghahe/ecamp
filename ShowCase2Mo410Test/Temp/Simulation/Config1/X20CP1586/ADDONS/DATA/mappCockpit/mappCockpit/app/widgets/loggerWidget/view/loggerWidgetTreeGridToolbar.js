var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/treeGridToolbarBase", "../../../common/directoryProvider"], function (require, exports, treeGridToolbarBase_1, directoryProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoggerWidgetTreeGridToolbar = void 0;
    /**
     * Implementation of the logger widget toolbar
     *
     * @export
     * @class LoggerWidgetTreeGridToolbar
     * @extends {TreeGridToolbarBase}
     */
    let LoggerWidgetTreeGridToolbar = class LoggerWidgetTreeGridToolbar extends treeGridToolbarBase_1.TreeGridToolbarBase {
        /**
         * Creates an instance of LoggerWidgetTreeGridToolbar
         * @param {HTMLDivElement} widgetDiv
         * @memberof LoggerWidgetTreeGridToolbar
         */
        constructor(widgetDiv) {
            super(widgetDiv);
            // Defines the toolbar button ids and the tooltip texts
            this._toolbarIdUpload = "Upload";
            this._toolbarToolTipUpload = "Load data from target";
            this._toolbarIdImport = "Import";
            this._toolbarToolTipImport = "Import data";
            this._toolbarIdExport = "Export";
            this._toolbarToolTipExport = "Export data";
            let imageDirectory = "../../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "loggerWidget/style/images/toolbar/";
            // buttons for the editor
            this.addToolbarButton(this._toolbarIdUpload, this._toolbarToolTipUpload, imageDirectory + "upload.svg");
            this.addToolbarButton(this._toolbarIdImport, this._toolbarToolTipImport, imageDirectory + "import.svg");
            this.addToolbarButton(this._toolbarIdExport, this._toolbarToolTipExport, imageDirectory + "export.svg");
        }
        /**
         * Reacts on toolbar click
         *
         * @param {*} args
         * @param {LoggerWidget} loggerWidget
         * @memberof LoggerWidgetTreeGridToolbar
         */
        toolbarClick(args, loggerWidget) {
            //set edit cell to false so treegrid can be updated
            loggerWidget.setCellEdit(false);
            super.toolbarClickBase(args);
            var clickedToolbarId = this.getClickedToolbarId(args.itemName, args.model.toolbarSettings);
            if (clickedToolbarId == this._toolbarIdUpload) {
                loggerWidget.uploadData();
            }
            else if (clickedToolbarId == this._toolbarIdImport) {
                loggerWidget.importData();
            }
            else if (clickedToolbarId == this._toolbarIdExport) {
                loggerWidget.exportData();
            }
        }
        /**
         * Initialise the toolbar states
         *
         * @memberof LoggerWidgetTreeGridToolbar
         */
        initToolbarStates() {
            super.initToolbarStates();
            // Disable buttons at startup
            this.disableExportButton(true);
        }
        /**
         * Disables the import button
         *
         * @param {boolean} disable
         * @memberof LoggerWidgetTreeGridToolbar
         */
        disableUploadButton(disable) {
            this.disableButton(this._toolbarIdUpload, disable);
        }
        /**
         * Disables the export button
         *
         * @param {boolean} disable
         * @memberof LoggerWidgetTreeGridToolbar
         */
        disableExportButton(disable) {
            this.disableButton(this._toolbarIdExport, disable);
        }
    };
    LoggerWidgetTreeGridToolbar = __decorate([
        mco.role()
    ], LoggerWidgetTreeGridToolbar);
    exports.LoggerWidgetTreeGridToolbar = LoggerWidgetTreeGridToolbar;
});
