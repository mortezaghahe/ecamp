var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../controller/openViewManagement/controller/viewGroupController", "../topBarDOMManipulator", "./flexTabButton"], function (require, exports, viewGroupController_1, topBarDOMManipulator_1, flexTabButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FlexTabContainer = void 0;
    let FlexTabContainer = class FlexTabContainer {
        constructor(groupTag, divID) {
            this._contentChanged = (sender, eventArgs) => { this.updateFlexTabContainer(eventArgs); };
            // Needed for drag and drop -> remaining place were no tabs are
            this._placeholder = null;
            this.groupTag = groupTag;
            this._divID = divID;
            this._flexTabButtons = new Array();
            this._sortedViewGroup = viewGroupController_1.ViewGroupController.getInstance().getAttacherViewGroupSubControllerByGroupTag(groupTag);
            this.attach();
            this.addPlaceHolder();
        }
        dispose() {
            this.detach();
            this.clearContainer();
        }
        attach() {
            if (this._sortedViewGroup !== undefined) {
                this._sortedViewGroup.eventModelChanged.attach(this._contentChanged);
            }
        }
        detach() {
            if (this._sortedViewGroup !== undefined) {
                this._sortedViewGroup.eventModelChanged.detach(this._contentChanged);
            }
            this.detachPlaceholder();
        }
        /**
         * Receives events from sortedViewGroup
         * -> Throw away old data and remove button from DOM
         * -> Set changed data received from event
         *
         * @private
         * @param {*} eventArgs
         * @memberof FlexTabContainer
         */
        updateFlexTabContainer(eventArgs) {
            let views = eventArgs.data;
            this.clearContainer();
            let pos = 0;
            views.forEach(tab => {
                this._flexTabButtons.push(new flexTabButton_1.FlexTabButton(this._divID, tab.viewID, tab.viewName, tab.viewType, tab.isActive, pos, this._sortedViewGroup));
                pos++;
            });
            this.checkIfActiveTabIsVisible();
            this.addPlaceHolder();
        }
        /**
         * Initialize placeholder that fills the remaining space for flexTabs
         *
         * @private
         * @memberof FlexTabContainer
         */
        addPlaceHolder() {
            let id = "flexTabPlaceHolderId-" + this.groupTag;
            let item = '<div id="' + id + '" class="FlexTabPlaceHolder" draggable="false"></div>';
            topBarDOMManipulator_1.TopBarDOMManipulator.appendHTMLTagAtID(this._divID, item);
            this._placeholder = document.getElementById(id);
            if (this._placeholder !== null) {
                this._placeholder.addEventListener("dragover", event => this.handleDragOver(event));
                this._placeholder.addEventListener("drop", event => this.handleDrop(event));
            }
        }
        /**
         * Removes drag events from placeholder
         *
         * @private
         * @memberof FlexTabContainer
         */
        detachPlaceholder() {
            if (this._placeholder !== null) {
                this._placeholder.removeEventListener("dragover", event => this.handleDragOver(event));
                this._placeholder.removeEventListener("drop", event => this.handleDrop(event));
            }
        }
        /**
         * When the tab is dropped in the placeholder, the tab is moved to last position
         *
         * @private
         * @param {*} event
         * @return {*}  {*}
         * @memberof FlexTabContainer
         */
        handleDrop(event) {
            event.preventDefault();
            let viewID = event.dataTransfer.getData("viewID");
            this._sortedViewGroup.moveSingleData(viewID, this._flexTabButtons.length);
        }
        /**
         * Allowing the tab drag event to drop in the empty area (placeholder) of the flexTabContainer
         *
         * @private
         * @param {*} event
         * @return {*}  {*}
         * @memberof FlexTabContainer
         */
        handleDragOver(event) {
            event.preventDefault();
        }
        /**
         * Checks if the active tab of the topBar is fully visible.
         * If not it sets the tab to the first position.
         *
         * @return {*}
         * @memberof FlexTabContainer
         */
        checkIfActiveTabIsVisible() {
            if (this._sortedViewGroup === undefined) {
                return;
            }
            // Get DOMRect for the topBar and active tab 
            let topBarDOMRect = this.getDOMRectByID(this._divID);
            let view = this._sortedViewGroup.getActiveView();
            if (view === undefined) {
                return;
            }
            let activeTabDOMRect = this.getActiveTabDOMRect(view.viewID);
            // if the tab is out of visualization move it to first position
            if (this.isActiveTabOutOfVisibility(topBarDOMRect, activeTabDOMRect) === true) {
                this._sortedViewGroup.moveSingleData(view.viewID);
            }
        }
        /**
         * Check by the absolute positions of the DOMRects, if the active tab is fully visible.
         *
         * @private
         * @param {(DOMRect | undefined)} topBarDOMRect
         * @param {(DOMRect | undefined)} activeTabDOMRect
         * @return {*}  {boolean} true if not visible
         * @memberof FlexTabContainer
         */
        isActiveTabOutOfVisibility(topBarDOMRect, activeTabDOMRect) {
            if (topBarDOMRect !== undefined && activeTabDOMRect !== undefined) {
                // Check if the active tab is inside the topBar
                if (topBarDOMRect.right < activeTabDOMRect.right) {
                    return true;
                }
            }
            else {
                console.error('TopBar DOM element not found');
            }
            return false;
        }
        /**
         * Returns the DOMRect for the tab of the passed viewID
         *
         * @private
         * @param {string} viewID
         * @return {*}  {(DOMRect | undefined)}
         * @memberof FlexTabContainer
         */
        getActiveTabDOMRect(viewID) {
            let button = this._flexTabButtons.find(tab => viewID === tab.viewID);
            if (button === undefined) {
                return undefined;
            }
            return this.getDOMRectByID(button.divID);
        }
        /**
         * Returns the DOMRect for the passed HTML id
         *
         * @private
         * @param {string} id
         * @return {*}  {(DOMRect | undefined)}
         * @memberof FlexTabContainer
         */
        getDOMRectByID(id) {
            let div = document.getElementById(id);
            if (div === null) {
                return undefined;
            }
            return div.getBoundingClientRect();
        }
        /**
         * Clean up flexTabButtons array and remove it from DOM
         *
         * @private
         * @memberof FlexTabContainer
         */
        clearContainer() {
            this._flexTabButtons.forEach(button => button.dispose());
            // Empty array
            this._flexTabButtons.length = 0;
            this.detachPlaceholder();
            // Remove child's
            $("#" + this._divID).empty();
        }
    };
    FlexTabContainer = __decorate([
        mco.role()
    ], FlexTabContainer);
    exports.FlexTabContainer = FlexTabContainer;
});
