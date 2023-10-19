var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/treeGridToolbarBase", "../../common/directoryProvider", "../common/iconInfo", "../../models/common/stateExpression/watchableIcon"], function (require, exports, treeGridToolbarBase_1, directoryProvider_1, iconInfo_1, watchableIcon_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WatchablesGridToolbar = void 0;
    let WatchablesGridToolbar = class WatchablesGridToolbar extends treeGridToolbarBase_1.TreeGridToolbarBase {
        /**
         * Creates an instance of WatchablesGridToolbar.
         * @param {HTMLDivElement} widgetDiv
         * @memberof WatchablesGridToolbar
         */
        constructor(widgetDiv) {
            super(widgetDiv);
            // Path to image directory     
            this.imageDirectory = "../../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "watchablesWidget/style/images/toolbar/";
            // Holds an array of existing icons
            this._toolbarIconInfo = new Array();
            // Last icon where mouse has been over
            this._lastIconMouseOver = new iconInfo_1.IconInfo('', '', '');
            //Add empty button so toolbar is created
            this.addToolbarButton('empty', '', this.imageDirectory + "empty.svg");
        }
        /**
         * Sets the default toolbar states at startup
         *
         * @memberof WatchablesGridToolbar
         */
        initToolbarStates() {
            // Don't use the default initializer because watchables widget uses only state icons, no really buttons
            //super.initToolbarStates();       
            // disable dummy button after creation
            this.disableDummyButton();
        }
        /**
         * Adds icon to be inserted in the toolbar
         *
         * @param {MappCockpitStateParameter} watchableStateParameter
         * @memberof WatchablesGridToolbar
         */
        addIcon(watchableStateParameter) {
            //Add button to toolbar
            let name = watchableStateParameter.name;
            this.addToolbarButton(name, '', '');
            //Create toolbar icon info
            this._toolbarIconInfo.push(new iconInfo_1.IconInfo(name));
            //Initialize as unkown state
            this.updateIcon(name, watchableIcon_1.WatchableIcon.getUnkownWatchableIcon());
        }
        /**
         * Add event listener to icons for mouseover
         *
         * @memberof WatchablesGridToolbar
         */
        addEventListeners() {
            this._toolbarIconInfo.forEach((iconInfo) => {
                var elemId = '#' + this._widgetMainDiv.id + '_' + iconInfo.name;
                $(elemId).on('mouseover', (e) => this.getMouseOverIcon(e));
            });
        }
        /**
         * Updates icon image
         *
         * @param {string} name
         * @param {WatchableIcon} watchableIcon
         * @memberof WatchablesGridToolbar
         */
        updateIcon(name, watchableIcon) {
            var toolbarIcon = this.getToolbarIconInfo(name);
            if (toolbarIcon !== undefined && toolbarIcon.imageName !== watchableIcon.imageName) {
                this.updateIconInToolbar(toolbarIcon, name, watchableIcon.imageName, watchableIcon.tooltip);
            }
        }
        /**
         * Updates icon image in treegrid's toolbar
         *
         * @private
         * @param {IconInfo} toolbarIcon
         * @param {string} buttonId
         * @param {string} imageName
         * @param {string} tooltip
         * @memberof WatchablesGridToolbar
         */
        updateIconInToolbar(toolbarIcon, buttonId, imageName, tooltip) {
            // wTbI => watchablesToolbarIcon
            this.updateButtonIcon(buttonId, imageName, "wTbI");
            toolbarIcon.updateInfo(imageName, tooltip);
        }
        /**
         * Get Icon info
         *
         * @private
         * @param {string} name
         * @returns {IconInfo}
         * @memberof WatchablesGridToolbar
         */
        getToolbarIconInfo(name) {
            var iconInfo = this._toolbarIconInfo.find((iconInfo) => iconInfo.name === name);
            return iconInfo;
        }
        /**
         * Get icon where we are dragging the mouse over
         *
         * @private
         * @param {*} args
         * @memberof WatchablesGridToolbar
         */
        getMouseOverIcon(args) {
            var name = ('#' + args.currentTarget.id).split(this._widgetMainDiv.id + '_')[1];
            let toolbarIconInfo = this._toolbarIconInfo.find((iconInfo) => iconInfo.name === name);
            if (toolbarIconInfo !== undefined) {
                this._lastIconMouseOver = toolbarIconInfo;
            }
        }
        /**
         * Updates toolbar tooltip without updating the whole treegrid
         *
         * @memberof WatchablesGridToolbar
         */
        tooltipExtension() {
            // Get HTML element of current tooltip icon
            var target = $('#' + this._widgetMainDiv.id + '_toolbarItems_content')[0];
            if (target != undefined) {
                //Create a mutation observer
                var observer = new MutationObserver((mutations) => {
                    this.updateTooltipOnMutationChanged(target, mutations);
                });
                //Observe changes in tooltip content. 
                //There is just one <div> for all tooltips of the same toolbar. 
                observer.observe(target, { attributes: true, childList: true, characterData: true });
            }
        }
        /**
         * Update tooltip when a mutationRecord is changed
         *
         * @private
         * @param {HTMLElement} target
         * @param {MutationRecord[]} mutations
         * @memberof WatchablesGridToolbar
         */
        updateTooltipOnMutationChanged(target, mutations) {
            mutations.forEach((mutationRecord) => {
                var iconInfo = this.getToolbarIconInfo(this._lastIconMouseOver.name);
                if (iconInfo !== undefined) {
                    var newValue = iconInfo.tooltip;
                    var oldValue = target.innerHTML;
                    if (newValue != oldValue) {
                        target.innerHTML = newValue;
                    }
                }
            });
        }
        /**
         * hide selected icon
         *
         * @param {string} id
         * @memberof WatchablesGridToolbar
         */
        hideIcon(id) {
            this.hideButton(id, true);
        }
        /**
         * disables dummy button needed for initialization of toolbar
         *
         * @memberof WatchablesGridToolbar
         */
        disableDummyButton() {
            this.disableButton('empty', true, true);
        }
        /**
         * Disable icons in toolbar so they don't behave as buttons
         *
         * @memberof WatchablesGridToolbar
         */
        disableIcons() {
            for (var i = 0; i < this._toolbarIconInfo.length; i++) {
                this.disableButton(this._toolbarIconInfo[i].name, true, true);
            }
        }
    };
    WatchablesGridToolbar = __decorate([
        mco.role()
    ], WatchablesGridToolbar);
    exports.WatchablesGridToolbar = WatchablesGridToolbar;
});
