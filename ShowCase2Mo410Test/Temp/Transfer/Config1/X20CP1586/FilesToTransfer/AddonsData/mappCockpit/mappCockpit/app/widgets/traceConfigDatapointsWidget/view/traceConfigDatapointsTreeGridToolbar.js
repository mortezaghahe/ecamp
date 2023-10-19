var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../models/diagnostics/trace/traceDataPoint", "../../common/treeGridToolbarBase", "../../../common/directoryProvider"], function (require, exports, traceDataPoint_1, treeGridToolbarBase_1, directoryProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigDatapointsTreeGridToolbar = void 0;
    let TraceConfigDatapointsTreeGridToolbar = class TraceConfigDatapointsTreeGridToolbar extends treeGridToolbarBase_1.TreeGridToolbarBase {
        /**
         * Creates an instance of TraceConfigDatapointsTreeGridToolbar.
         * @param {HTMLDivElement} widgetMainDiv
         * @memberof TraceConfigDatapointsTreeGridToolbar
         */
        constructor(widgetMainDiv) {
            super(widgetMainDiv);
            this._toolbarIdAdd = "Add";
            this._toolbarTooltipAdd = "Adds a datapoint";
            this._toolbarIdAddEmptyLine = "AddEmptyLine";
            this._toolbarTooltipAddEmptyLine = "Adds an empty line";
            this._toolbarIdRemoveLine = "RemoveLine";
            this._toolbarTooltipRemoveLine = "Removes the selected line";
            let imageDirectory = "../../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "traceConfigDatapointsWidget/style/images/toolbar/";
            this.addToolbarButton(this._toolbarIdAdd, this._toolbarTooltipAdd, imageDirectory + "add.svg");
            this.addToolbarButton(this._toolbarIdAddEmptyLine, this._toolbarTooltipAddEmptyLine, imageDirectory + "addEmptyLine.svg");
            this.addToolbarButton(this._toolbarIdRemoveLine, this._toolbarTooltipRemoveLine, imageDirectory + "removeLine.svg");
        }
        /**
         * Reacts on toolbar click
         *
         * @param {*} args
         * @param {TraceConfigDatapointsWidget} dataPointWidget
         * @memberof TraceConfigDatapointsTreeGridToolbar
         */
        toolbarClick(args, dataPointWidget) {
            var clickedToolbarId = this.getClickedToolbarId(args.itemName, args.model.toolbarSettings);
            if (clickedToolbarId == this._toolbarIdAdd) {
                args.cancel = true;
                dataPointWidget.openDatapointDialog();
            }
            else if (clickedToolbarId == this._toolbarIdAddEmptyLine) {
                args.cancel = true;
                dataPointWidget.dataModel.addDatapoint(args.model.selectedRowIndex, traceDataPoint_1.TraceDataPoint.createSimpleDataPoint(""));
            }
            else if (clickedToolbarId == this._toolbarIdRemoveLine) {
                args.cancel = true;
                this.deleteSelectedDataPoint(args.model, dataPointWidget.dataModel);
            }
        }
        initToolbarStates() {
            super.initToolbarStates();
            // Disable buttons at startup
            this.disableAddButton(true);
            this.disableAddEmptyButton(true);
            this.disableRemoveButton(true);
        }
        disableAddButton(disable) {
            this.disableButton(this._toolbarIdAdd, disable);
        }
        disableAddEmptyButton(disable) {
            this.disableButton(this._toolbarIdAddEmptyLine, disable);
        }
        disableRemoveButton(disable) {
            this.disableButton(this._toolbarIdRemoveLine, disable);
        }
        deleteSelectedDataPoint(model, dataPointsDataModel) {
            let indexList = new Array();
            for (let i = model.selectedItems.length - 1; i >= 0; i--) {
                indexList.push(model.selectedItems[i].index);
            }
            if (indexList.length > 0) {
                dataPointsDataModel.removeDatapoints(indexList);
                let newSelectionIndex = indexList[indexList.length - 1];
                if (newSelectionIndex >= model.parentRecords.length) {
                    newSelectionIndex = model.parentRecords.length - 1;
                }
                let treeGridObj = this.getTreeGridObject();
                treeGridObj.option("selectedRowIndex", newSelectionIndex, true);
            }
        }
    };
    TraceConfigDatapointsTreeGridToolbar = __decorate([
        mco.role()
    ], TraceConfigDatapointsTreeGridToolbar);
    exports.TraceConfigDatapointsTreeGridToolbar = TraceConfigDatapointsTreeGridToolbar;
});
