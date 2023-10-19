var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/treeGridToolbarBase", "../../../common/directoryProvider"], function (require, exports, treeGridToolbarBase_1, directoryProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigTriggerTreeGridToolbar = void 0;
    let TraceConfigTriggerTreeGridToolbar = class TraceConfigTriggerTreeGridToolbar extends treeGridToolbarBase_1.TreeGridToolbarBase {
        /**
         * Creates an instance of TraceConfigTriggerTreeGridToolbar.
         * @param {HTMLDivElement} widgetMainDiv
         * @memberof TraceConfigTriggerTreeGridToolbar
         */
        constructor(widgetMainDiv) {
            super(widgetMainDiv);
            this._toolbarIdAdd = "Add";
            this._toolbarTooltipAdd = "Adds a new start trigger";
            this.toolbarIdSelect = "Select";
            this.toolbarToolTipSelect = "Select a trigger datapoint";
            this.toolbarIdDelete = "Delete";
            this.toolbarToolTipDelete = "Delete start trigger";
            let imageDirectory = "../../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "traceConfigTriggerWidget/style/images/toolbar/";
            this.addToolbarButton(this._toolbarIdAdd, this._toolbarTooltipAdd, imageDirectory + "add.svg");
            this.addToolbarButton(this.toolbarIdSelect, this.toolbarToolTipSelect, imageDirectory + "select.svg");
            this.addToolbarButton(this.toolbarIdDelete, this.toolbarToolTipDelete, imageDirectory + "delete.svg");
        }
        /**
         * Reacts on toolbar click
         *
         * @param {*} args
         * @param {*} triggerWidget
         * @memberof TraceConfigTriggerTreeGridToolbar
         */
        toolbarClick(args, triggerWidget) {
            var clickedToolbarId = this.getClickedToolbarId(args.itemName, args.model.toolbarSettings);
            if (clickedToolbarId == this._toolbarIdAdd) {
                args.cancel = true;
                triggerWidget.addStartTrigger();
            }
            else if (clickedToolbarId == this.toolbarIdSelect) {
                args.cancel = true;
                triggerWidget.openDatapointDialog();
            }
            else if (clickedToolbarId == this.toolbarIdDelete) {
                args.cancel = true;
                triggerWidget.deleteStartTriggers(args.model.selectedItems);
            }
        }
        disableAddButton(disable) {
            this.disableButton(this._toolbarIdAdd, disable);
        }
        disableRemoveButton(disable) {
            this.disableButton(this.toolbarIdDelete, disable);
        }
        disableSelectTriggerDataPointButton(disable) {
            this.disableButton(this.toolbarIdSelect, disable);
        }
    };
    TraceConfigTriggerTreeGridToolbar = __decorate([
        mco.role()
    ], TraceConfigTriggerTreeGridToolbar);
    exports.TraceConfigTriggerTreeGridToolbar = TraceConfigTriggerTreeGridToolbar;
});
