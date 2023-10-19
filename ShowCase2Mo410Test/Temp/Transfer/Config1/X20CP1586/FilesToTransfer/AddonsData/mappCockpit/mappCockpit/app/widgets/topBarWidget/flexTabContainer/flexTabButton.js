var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../controller/openViewManagement/controller/openViewMainController", "../../common/viewTypeProvider", "../topBarDOMManipulator"], function (require, exports, openViewMainController_1, viewTypeProvider_1, topBarDOMManipulator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FlexTabButton = void 0;
    /**
     * FlexTabButtons are the tabs from the content views.
     * Tabs can be drag and dropped.
     * Tabs can be selected
     * Tabs can be removed with auxiliary button pressed.
     *
     * @export
     * @class FlexTabButton
     */
    let FlexTabButton = class FlexTabButton {
        constructor(elementID, viewID, displayName, viewType, isActive, pos, sV) {
            this._leftIcon = "FlexTabIconLeft";
            this._displayedText = "FlexTabText";
            this._rightIcon = "FlexTabIconRight";
            this._buttonLink = null;
            this.viewID = viewID;
            this.divID = viewID + "-FlexTabButton";
            this._displayName = displayName;
            this._pos = pos;
            this._sortedViewGroup = sV;
            this._imageClass = viewTypeProvider_1.ViewTypeProvider.getInstance().getIconClassByViewType(viewType);
            this._themeClass = this.getThemeClass(isActive);
            this.appendToLayout(elementID);
        }
        dispose() {
            if (this._buttonLink !== null) {
                this._buttonLink.removeEventListener("click", event => this.onFlexTabButtonClicked(event));
                this._buttonLink.removeEventListener("auxclick", event => this.onFlexTabButtonWheelClicked(event));
                this._buttonLink.removeEventListener("mousedown", event => this.preventWheelClickScrolling(event));
                this._buttonLink.removeEventListener("dragstart", event => this.handleDragStart(event));
                this._buttonLink.removeEventListener("dragover", event => this.handleDragOver(event));
                this._buttonLink.removeEventListener("drop", event => this.handleDrop(event));
            }
        }
        /**
         * Returns the corresponding css theme classes needed
         *
         * @private
         * @param {boolean} isActive
         * @return {*}  {string}
         * @memberof FlexTabButton
         */
        getThemeClass(isActive) {
            return isActive === true ? "FlexTabButton TabIsActive" : "FlexTabButton TabIsDeactive";
        }
        /**
         * HTML template for a flexTabButton (allowing drag and drop)
         *
         * @private
         * @return {*}  {string}
         * @memberof FlexTabButton
         */
        getButtonLayout() {
            let html = '<button id="' + this.divID + '" class="' + this._themeClass + '" draggable="true">' +
                '<div class="' + this._leftIcon + '"></div>' +
                '<div class="' + this._displayedText + '">' + this._displayName + '</div>' +
                '<div class="' + this._rightIcon + ' ' + this._imageClass + '"></div>' +
                '</button>';
            return html;
        }
        /**
         * Add click events and drag & drop events to flexTabs
         *
         * @private
         * @memberof FlexTabButton
         */
        attachOnHTMLEvents() {
            // get button from DOM
            this._buttonLink = document.getElementById(this.divID);
            // If the button is found attach click events and drag and drop events
            if (this._buttonLink !== null) {
                this._buttonLink.addEventListener("click", event => this.onFlexTabButtonClicked(event));
                this._buttonLink.addEventListener("auxclick", event => this.onFlexTabButtonWheelClicked(event));
                this._buttonLink.addEventListener("mousedown", event => this.preventWheelClickScrolling(event));
                this._buttonLink.addEventListener("dragstart", event => this.handleDragStart(event));
                this._buttonLink.addEventListener("dragover", event => this.handleDragOver(event));
                this._buttonLink.addEventListener("drop", event => this.handleDrop(event));
            }
            else {
                console.error("Click events for FlexTabs not added");
            }
        }
        /**
         * Generate button and append it to the layout.
         *
         * @private
         * @param {string} elementID
         * @memberof FlexTabButton
         */
        appendToLayout(elementID) {
            topBarDOMManipulator_1.TopBarDOMManipulator.appendHTMLTagAtID(elementID, this.getButtonLayout());
            this.attachOnHTMLEvents();
        }
        /**
         * When mousedown is realized in a valid position, a move for the sortedViewGroup is triggered
         *
         * @private
         * @param {*} event
         * @memberof FlexTabButton
         */
        handleDrop(event) {
            event.preventDefault();
            let viewID = event.dataTransfer.getData("viewID");
            this._sortedViewGroup.moveSingleData(viewID, this._pos);
        }
        /**
         * Visualizing that the element can be dropped in this element
         *
         * @private
         * @param {*} event
         * @memberof FlexTabButton
         */
        handleDragOver(event) {
            event.preventDefault();
        }
        /**
         * Set the information needed for the drag and drop action
         *
         * @private
         * @param {*} event
         * @memberof FlexTabButton
         */
        handleDragStart(event) {
            event.dataTransfer.setData("viewID", this.viewID);
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.dropEffect = "move";
        }
        /**
         * Open view with main button pressed
         *
         * @private
         * @param {MouseEvent} e
         * @memberof FlexTabButton
         */
        onFlexTabButtonClicked(e) {
            // Main button pressed, usually the left button or the un-initialized state
            if (e.button === 0) {
                openViewMainController_1.OpenViewMainController.getInstance().executeOpenViewByID(this.viewID);
            }
        }
        /**
         * Delete view with auxiliary button pressed
         *
         * @private
         * @param {MouseEvent} e
         * @memberof FlexTabButton
         */
        onFlexTabButtonWheelClicked(e) {
            // Auxiliary button pressed, usually the wheel button or the middle button (if present)
            if (e.button === 1) {
                openViewMainController_1.OpenViewMainController.getInstance().executeDeleteViewByID(this.viewID);
            }
        }
        /**
         * Prevent the default settings so that specific settings can be applied
         *
         * @private
         * @param {MouseEvent} e
         * @memberof FlexTabButton
         */
        preventWheelClickScrolling(e) {
            // Auxiliary button pressed, usually the wheel button or the middle button (if present)
            if (e.button === 1) {
                e.preventDefault();
            }
        }
    };
    FlexTabButton = __decorate([
        mco.role()
    ], FlexTabButton);
    exports.FlexTabButton = FlexTabButton;
});
