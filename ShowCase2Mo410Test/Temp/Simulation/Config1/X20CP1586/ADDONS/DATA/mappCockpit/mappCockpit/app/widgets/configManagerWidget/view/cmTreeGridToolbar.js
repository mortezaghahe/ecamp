var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/treeGridToolbarBase", "../../../common/directoryProvider"], function (require, exports, treeGridToolbarBase_1, directoryProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CmTreeGridToolbar = void 0;
    let CmTreeGridToolbar = class CmTreeGridToolbar extends treeGridToolbarBase_1.TreeGridToolbarBase {
        /**
         * Creates an instance of CmTreeGridToolbar.
         * @param {HTMLDivElement} widgetMainDiv
         * @memberof CmTreeGridToolbar
         */
        constructor(widgetMainDiv) {
            super(widgetMainDiv);
            this._toolbarIdSaveParameters = "Save";
            this._toolbarToolTipSaveParameters = "Save parameters";
            this._toolbarIdApplyParameters = "Apply";
            this._toolbarToolTipApplyParameters = "Apply parameters";
            this._toolbarIdDiscard = "Discard";
            this._toolbarToolTipDiscard = "Discard changes";
            this._toolbarIdEditMode = "EditMode";
            this._toolbarToolTipEditMode = "Open/Close edit mode";
            /**
             * Holds the state if the edit mode is active or not
             *
             * @private
             * @memberof CmTreeGridToolbar
             */
            this._editMode = false;
            /**
             * Holds the state if writeAccess is available or not
             *
             * @private
             * @memberof CmTreeGridToolbar
             */
            this._writeAccess = false;
            /**
             * Holds the state if save button is executable
             *
             * @private
             * @memberof CmTreeGridToolbar
             */
            this._saveButtonExecutable = false;
            /**
             * Holds the state if the current modified data can be transfered
             *
             * @private
             * @memberof CmTreeGridToolbar
             */
            this._transferPossible = false;
            let imageDirectory = "../../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "configManagerWidget/style/images/toolbar/";
            this.addToolbarButton(this._toolbarIdApplyParameters, this._toolbarToolTipApplyParameters, imageDirectory + "apply.svg");
            this.addToolbarButton(this._toolbarIdDiscard, this._toolbarToolTipDiscard, imageDirectory + "discardChanges.svg");
            this.addToolbarButton(this._toolbarIdSaveParameters, this._toolbarToolTipSaveParameters, imageDirectory + "save.svg");
            this.addCollapseButton();
            this.addExpandButton();
            // add editMode button to the right
            this.addToolbarButton(this._toolbarIdEditMode, this._toolbarToolTipEditMode, imageDirectory + "editMode.svg", treeGridToolbarBase_1.ToolbarButtonAlignment.Right);
        }
        /**
         * Reacts on toolbar click
         *
         * @param {*} args
         * @param {IConfigManagerWidget} widget
         * @memberof CmTreeGridToolbar
         */
        toolbarClick(args, widget) {
            super.toolbarClickBase(args);
            var clickedToolbarId = this.getClickedToolbarId(args.itemName, args.model.toolbarSettings);
            switch (clickedToolbarId) {
                case this._toolbarIdSaveParameters:
                    args.cancel = true;
                    widget.saveParameters();
                    break;
                case this._toolbarIdApplyParameters:
                    args.cancel = true;
                    widget.applyModifiedParameters();
                    break;
                case this._toolbarIdDiscard:
                    args.cancel = true;
                    widget.discard();
                    break;
                case this._toolbarIdEditMode:
                    args.cancel = true;
                    // Toggle editMode
                    this.toggleEditMode();
                    // Update widget with editMode
                    widget.setEditMode(this._editMode);
                    break;
            }
        }
        /**
         * Sets the default toolbar states at startup
         *
         * @memberof CmTreeGridToolbar
         */
        initToolbarStates() {
            super.initToolbarStates();
            this.updateButtons();
        }
        /**
         * Change the edit mode(activate/deactivate)
         *
         * @private
         * @memberof CmTreeGridToolbar
         */
        toggleEditMode() {
            this._editMode = !this._editMode;
            this.updateButtons();
        }
        /**
         * Update the visibilitiy and state of all buttons corresponding to the editMode, writeAccess, ...
         *
         * @private
         * @memberof CmTreeGridToolbar
         */
        updateButtons() {
            // hide/show buttons
            this.hideButton(this._toolbarIdApplyParameters, !this._editMode);
            this.hideButton(this._toolbarIdDiscard, !this._editMode);
            this.hideButton(this._toolbarIdSaveParameters, !this._editMode);
            // set active state of buttons
            this.activateButton(this._toolbarIdEditMode, this._editMode);
            // activate/deactivate buttons
            let disableSaveButton = true;
            if (this._writeAccess == true && this._saveButtonExecutable == true) {
                disableSaveButton = false;
            }
            this.disableButton(this._toolbarIdSaveParameters, disableSaveButton);
            let disableApplyButton = true;
            if (this._writeAccess == true && this._transferPossible == true) {
                disableApplyButton = false;
            }
            this.disableButton(this._toolbarIdApplyParameters, disableApplyButton);
        }
        /**
         * Is the save button executable
         *
         * @param {boolean} value
         * @memberof CmTreeGridToolbar
         */
        saveButtonExecutable(value) {
            this._saveButtonExecutable = value;
            this.updateButtons();
        }
        /**
         * Sets the info if writeAccess is available or not
         *
         * @param {boolean} value
         * @memberof CmTreeGridToolbar
         */
        setWriteAccess(value) {
            this._writeAccess = value;
            this.updateButtons();
        }
        /**
         * Sets the info if the current modified data can be transfered
         *
         * @param {boolean} value
         * @memberof CmTreeGridToolbar
         */
        setTransferPossible(value) {
            this._transferPossible = value;
            this.updateButtons();
        }
    };
    CmTreeGridToolbar = __decorate([
        mco.role()
    ], CmTreeGridToolbar);
    exports.CmTreeGridToolbar = CmTreeGridToolbar;
});
