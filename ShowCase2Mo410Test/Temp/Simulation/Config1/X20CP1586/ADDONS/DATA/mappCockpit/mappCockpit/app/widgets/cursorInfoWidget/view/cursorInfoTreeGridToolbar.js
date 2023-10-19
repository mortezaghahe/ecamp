var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/treeGridToolbarBase", "../interfaces/cursorInfoWidgetInterface", "../../../common/directoryProvider"], function (require, exports, treeGridToolbarBase_1, cursorInfoWidgetInterface_1, directoryProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorInfoTreeGridToolbar = void 0;
    let CursorInfoTreeGridToolbar = class CursorInfoTreeGridToolbar extends treeGridToolbarBase_1.TreeGridToolbarBase {
        /**
         * Creates an instance of CursorInfoTreeGridToolbar.
         * @param {HTMLDivElement} widgetMainDiv
         * @memberof CursorInfoTreeGridToolbar
         */
        constructor(widgetMainDiv) {
            super(widgetMainDiv);
            this._toolbarIdCursor1 = "Cursor1";
            this._toolbarToolTipCursor1 = "Selects the first cursor";
            this._toolbarIdCursor2 = "Cursor2";
            this._toolbarToolTipCursor2 = "Selects the second cursor";
            //private readonly _toolbarIdMoveExtendedLeft ="MoveExtendedLeft";
            //private readonly _toolbarToolTipMoveExtendedLeft ="Moves the selected cursor to the left(extended)";
            this._toolbarIdMoveLeft = "MoveLeft";
            this._toolbarToolTipMoveLeft = "Moves the selected cursor to the left";
            this._toolbarIdMoveRight = "MoveRight";
            this._toolbarToolTipMoveRight = "Moves the selected cursor to the right";
            //private readonly _toolbarIdMoveExtendedRight ="MoveExtendedRight";
            //private readonly _toolbarToolTipMoveExtendedRight ="Moves the selected cursor to the right(extended)";
            this._toolbarIdCursorInfoSelector = "ToogleFilter";
            this._toolbarToolTipCursorInfoSelector = "Choose cursor informations for the selected signals";
            this._selectedCursorIndex = -1;
            this.cursorInfoSelectionIsActive = false;
            let imageDirectory = "../../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "cursorInfoWidget/style/images/toolbar/";
            this.addToolbarButton(this._toolbarIdCursor1, this._toolbarToolTipCursor1, imageDirectory + "cursor1.svg");
            this.addToolbarButton(this._toolbarIdCursor2, this._toolbarToolTipCursor2, imageDirectory + "cursor2.svg");
            //this.addToolbarButton(this._toolbarIdMoveExtendedLeft, this._toolbarToolTipMoveExtendedLeft, imageDirectory + "moveExtendedLeft.svg");
            this.addToolbarButton(this._toolbarIdMoveLeft, this._toolbarToolTipMoveLeft, imageDirectory + "moveLeft.svg");
            this.addToolbarButton(this._toolbarIdMoveRight, this._toolbarToolTipMoveRight, imageDirectory + "moveRight.svg");
            //this.addToolbarButton(this._toolbarIdMoveExtendedRight, this._toolbarToolTipMoveExtendedRight, imageDirectory + "moveExtendedRight.svg");
            this.addCollapseButton();
            this.addExpandButton();
            this.addToolbarButton(this._toolbarIdCursorInfoSelector, this._toolbarToolTipCursorInfoSelector, imageDirectory + "toggleVisibility.svg", treeGridToolbarBase_1.ToolbarButtonAlignment.Right);
        }
        /**
         * Reacts on toolbar click
         *
         * @param {*} args
         * @param {ICursorInfoWidget} widget
         * @memberof CursorInfoTreeGridToolbar
         */
        toolbarClick(args, widget) {
            super.toolbarClickBase(args);
            var clickedToolbarId = this.getClickedToolbarId(args.itemName, args.model.toolbarSettings);
            if (clickedToolbarId == this._toolbarIdCursor1) {
                widget.onReferenceCursorSelected(0);
                args.cancel = true;
            }
            else if (clickedToolbarId == this._toolbarIdCursor2) {
                widget.onReferenceCursorSelected(1);
                args.cancel = true;
            }
            /*else if (clickedToolbarId == this._toolbarIdMoveExtendedLeft) {
                widget.onMoveCursor(this._selectedCursorIndex, CursorAction.moveLeftExtended);
                args.cancel = true;
            }*/
            else if (clickedToolbarId == this._toolbarIdMoveLeft) {
                widget.onMoveCursor(this._selectedCursorIndex, cursorInfoWidgetInterface_1.CursorMovement.Left);
                args.cancel = true;
            }
            else if (clickedToolbarId == this._toolbarIdMoveRight) {
                widget.onMoveCursor(this._selectedCursorIndex, cursorInfoWidgetInterface_1.CursorMovement.Right);
                args.cancel = true;
            }
            /*else if (clickedToolbarId == this._toolbarIdMoveExtendedRight) {
                widget.onMoveCursor(this._selectedCursorIndex, CursorAction.moveRightExtended);
                args.cancel = true;
            }*/
            else if (clickedToolbarId == this._toolbarIdCursorInfoSelector) {
                widget.activateCursorInfoSelectorView(!this.cursorInfoSelectionIsActive);
                args.cancel = true;
            }
        }
        /**
         * Shows the correct toolbar buttons for the current view
         *
         * @param {boolean} activate
         * @memberof CursorInfoTreeGridToolbar
         */
        activateCursorInfoSelectorView(activate) {
            this.cursorInfoSelectionIsActive = activate;
            this.activateButton(this._toolbarIdCursorInfoSelector, activate);
            this.hideButton(this._toolbarIdCursor1, activate);
            this.hideButton(this._toolbarIdCursor2, activate);
            this.hideButton(this._toolbarIdMoveLeft, activate);
            this.hideButton(this._toolbarIdMoveRight, activate);
            this.hideCollapseButton(activate);
            this.hideExpandButton(activate);
        }
        /**
         * Initializes the toolbar stats
         *
         * @memberof CursorInfoTreeGridToolbar
         */
        initToolbarStates() {
            super.initToolbarStates();
            // Disable buttons at startup
            this.disableButton(this._toolbarIdMoveLeft, true);
            this.disableButton(this._toolbarIdMoveRight, true);
            this.disableButton(this._toolbarIdCursorInfoSelector, true);
        }
        /**
         * Disables the button for the activation of the cursor info selector view
         *
         * @param {boolean} disable
         * @memberof CursorInfoTreeGridToolbar
         */
        disableCursorInfoSelectorButton(disable) {
            this.disableButton(this._toolbarIdCursorInfoSelector, disable);
        }
        /**
         * Updates the toolbar buttons (enable only if a cursor is defined)
         *
         * @param {CursorStates} cursorStates
         * @memberof CursorInfoTreeGridToolbar
         */
        updateButtonStates(cursorStates) {
            // Set selected cursor index
            let selectedCursorIndex = cursorStates.getSelectedCursorIndex();
            this._selectedCursorIndex = selectedCursorIndex;
            // Activate/Deactivate cursor buttons for current selected cursor
            this.activateCursorButton(selectedCursorIndex);
            // Activate/Deactivate cursor move buttons
            this.activateMoveButtons(cursorStates, selectedCursorIndex);
        }
        /**
         * Sets the active cursor index
         * The cursor button for the given index will be set activated(other deactivated)
         *
         *
         * @private
         * @param {number} index
         * @memberof CursorInfoTreeGridToolbar
         */
        activateCursorButton(index) {
            // Activate or deactivate ref cursor 1 or 2 button
            if (index == 0) {
                this.activateButton(this._toolbarIdCursor1, true);
                this.activateButton(this._toolbarIdCursor2, false);
            }
            else if (index == 1) {
                this.activateButton(this._toolbarIdCursor2, true);
                this.activateButton(this._toolbarIdCursor1, false);
            }
            else {
                this.activateButton(this._toolbarIdCursor2, false);
                this.activateButton(this._toolbarIdCursor1, false);
            }
        }
        /**
         * Sets the move buttons active or inactive for the given selected cursor index
         *
         * @private
         * @param {CursorStates} cursorStates
         * @param {number} selectedCursorIndex
         * @memberof CursorInfoTreeGridToolbar
         */
        activateMoveButtons(cursorStates, selectedCursorIndex) {
            let selectedCursorIsActive = false;
            if (selectedCursorIndex != -1) {
                if (cursorStates.getActive(selectedCursorIndex) == true) {
                    selectedCursorIsActive = true;
                }
            }
            if (selectedCursorIsActive) {
                this.enableMoveButtons(true);
            }
            else {
                this.enableMoveButtons(false);
            }
        }
        /**
         * Enables the buttons for the cursor move operations
         *
         * @private
         * @param {boolean} enable
         * @memberof CursorInfoTreeGridToolbar
         */
        enableMoveButtons(enable) {
            this.disableButton(this._toolbarIdMoveLeft, !enable);
            this.disableButton(this._toolbarIdMoveRight, !enable);
        }
    };
    CursorInfoTreeGridToolbar = __decorate([
        mco.role()
    ], CursorInfoTreeGridToolbar);
    exports.CursorInfoTreeGridToolbar = CursorInfoTreeGridToolbar;
});
