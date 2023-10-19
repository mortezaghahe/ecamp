var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/directoryProvider", "./toolbarButton", "./domHelper", "./themeProvider", "./customToolbarButton"], function (require, exports, directoryProvider_1, toolbarButton_1, domHelper_1, themeProvider_1, customToolbarButton_1) {
    "use strict";
    var TreeGridToolbarBase_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ToolbarButtonAlignment = exports.TreeGridToolbarBase = void 0;
    var ToolbarButtonAlignment;
    (function (ToolbarButtonAlignment) {
        ToolbarButtonAlignment[ToolbarButtonAlignment["Left"] = 0] = "Left";
        ToolbarButtonAlignment[ToolbarButtonAlignment["Right"] = 1] = "Right";
    })(ToolbarButtonAlignment || (ToolbarButtonAlignment = {}));
    exports.ToolbarButtonAlignment = ToolbarButtonAlignment;
    let TreeGridToolbarBase = TreeGridToolbarBase_1 = class TreeGridToolbarBase {
        /**
         * Creates an instance of TreeGridToolbarBase.
         * @param {HTMLDivElement} widgetMainDiv
         * @memberof TreeGridToolbarBase
         */
        constructor(widgetMainDiv) {
            this._collapseButtonId = "collapse";
            this._expandButtonId = "expand";
            this._collapseButtonToolTip = "Collapse all";
            this._expandButtonToolTip = "Expand all";
            this._imageDirectory = "../../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "common/style/images/tree/toolbar/";
            this._collapseLevel = 0;
            this._defaultButtonClassNameIsUsed = false;
            this._widgetMainDiv = widgetMainDiv;
            this._toolbarButtons = new Array();
        }
        /**
         * Adds a new toolbar button to the toolbar buttons list
         *
         * @param {string} id must be without spaces
         * @param {string} tooltip
         * @param {string} icon
         * @param {string} [align="left"]
         * @memberof TreeGridToolbarBase
         */
        addToolbarButton(id, tooltip, icon, align = ToolbarButtonAlignment.Left) {
            // add toolbar button needed to show a toolbar
            if (id.indexOf(" ") != -1) {
                console.error("Empty ' ' not allowed within id!");
            }
            this._toolbarButtons.push(new toolbarButton_1.ToolbarButton(id, tooltip, icon, align));
        }
        setCollapseLevel(level) {
            this._collapseLevel = level;
        }
        addCollapseButton() {
            // add toolbar button for collapse
            this._toolbarButtons.push(new toolbarButton_1.ToolbarButton(this._collapseButtonId, this._collapseButtonToolTip, this._imageDirectory + "collapse.svg", ToolbarButtonAlignment.Left));
        }
        addExpandButton() {
            // add toolbar button for expand
            this._toolbarButtons.push(new toolbarButton_1.ToolbarButton(this._expandButtonId, this._expandButtonToolTip, this._imageDirectory + "expand.svg", ToolbarButtonAlignment.Left));
        }
        hideCollapseButton(hide) {
            // hide collapse toolbar button
            this.hideButton(this._collapseButtonId, hide);
        }
        hideExpandButton(hide) {
            // hide expand toolbar button
            this.hideButton(this._expandButtonId, hide);
        }
        toolbarClick(args, widget) { }
        toolbarClickBase(args) {
            var clickedToolbarId = this.getClickedToolbarId(args.itemName, args.model.toolbarSettings);
            if (clickedToolbarId == this._collapseButtonId) {
                if (this._collapseLevel == 0) {
                    this.getTreeGridObject().collapseAll();
                }
                else {
                    this.getTreeGridObject().collapseAtLevel(this._collapseLevel);
                }
            }
            else if (clickedToolbarId == this._expandButtonId) {
                this.getTreeGridObject().expandAll();
            }
        }
        /**
         * Returns true if Expand or Collapse button is selected
         *
         * @param {*} args
         * @returns {boolean}
         * @memberof TreeGridToolbarBase
         */
        isExpandCollapseSelected(args) {
            var clickedToolbarId = this.getClickedToolbarId(args.itemName, args.model.toolbarSettings);
            if (clickedToolbarId === this._collapseButtonId || clickedToolbarId === this._expandButtonId) {
                return true;
            }
            else {
                return false;
            }
        }
        /**
         * Returns the toolbar definition for the tree grid
         *
         * @returns {CustomToolbarButton[]}
         * @memberof TreeGridToolbarBase
         */
        getCustomToolbars() {
            let toolbars = [];
            this._toolbarButtons.forEach((button) => {
                toolbars.push(new customToolbarButton_1.CustomToolbarButton(button.id, button.tooltip));
            });
            return toolbars;
        }
        /**
         * Disables the button (e.g. show the "..._deactivated.svg icon instead of "....svg")
         *
         * @param {string} buttonId
         * @param {boolean} disable
         * @param {boolean} [isIcon]
         * @returns
         * @memberof TreeGridToolbarBase
         */
        disableButton(buttonId, disable, isIcon) {
            let button = this.getToolbarButton(buttonId);
            if (button == undefined) {
                console.error("Button id not found! id: " + buttonId);
                return;
            }
            button.disabled = disable;
            let element = this.getElementByToolbarButtonElementId(button.id);
            if (element == undefined) {
                return;
            }
            let icon = button.icon;
            if (this._defaultButtonClassNameIsUsed == true) {
                // Switch automatically to deactivated icon if default classnames are used for buttons
                if (disable == true) {
                    if (!isIcon) {
                        icon = this.getDeactivatedIcon(button.icon);
                    }
                    element.classList.remove(TreeGridToolbarBase_1.defaultToolbarButtonClassName);
                    element.classList.add(TreeGridToolbarBase_1.defaultToolbarButtonDeactivatedClassName);
                }
                else {
                    element.classList.remove(TreeGridToolbarBase_1.defaultToolbarButtonDeactivatedClassName);
                    element.classList.add(TreeGridToolbarBase_1.defaultToolbarButtonClassName);
                }
            }
            domHelper_1.DomHelper.disableElement(element, disable);
            if (this._defaultButtonClassNameIsUsed == true) {
                // Switch automatically to deactivated icon if default classnames are used for buttons
                if (!isIcon) {
                    element.style.backgroundImage = "url(" + this.getImagePath(icon) + ")";
                }
            }
        }
        /**
         * Updates class entry in button to show other icon
         * Removes other class names with prefix and adds new class name with prefix
         *
         * @param {string} buttonId
         * @param {string} iconName
         * @param {string} classNamePrefix
         * @returns
         * @memberof TreeGridToolbarBase
         */
        updateButtonIcon(buttonId, iconName, classNamePrefix) {
            // Add "_" to prefix
            classNamePrefix += "_";
            let button = this.getToolbarButton(buttonId);
            if (button == undefined) {
                console.error("Button id not found! id: " + buttonId);
                return;
            }
            let element = this.getElementByToolbarButtonElementId(button.id);
            if (element == undefined) {
                return;
            }
            // get iconElement 
            let iconElement = element.firstElementChild;
            if (iconElement != undefined) {
                let classNamesToRemove = new Array();
                iconElement.classList.forEach(className => {
                    if (className.startsWith(classNamePrefix)) {
                        classNamesToRemove.push(className);
                    }
                });
                classNamesToRemove.forEach(className => {
                    iconElement.classList.remove(className);
                });
                iconElement.classList.add(classNamePrefix + iconName);
            }
        }
        /**
         * Hides(Shows) the button with the given id
         *
         * @param {string} buttonId
         * @param {boolean} hide
         * @returns
         * @memberof TreeGridToolbarBase
         */
        hideButton(buttonId, hide) {
            let button = this.getToolbarButton(buttonId);
            if (button == undefined) {
                console.error("Button id not found! id: " + buttonId);
                return;
            }
            let element = this.getElementByToolbarButtonElementId(button.id);
            if (element != undefined) {
                if (hide == true) {
                    element.style.display = "none";
                }
                else {
                    element.style.display = "";
                }
            }
        }
        /**
         * Shows the button highlighted (e.g orange background)
         *
         * @param {string} buttonId
         * @param {boolean} activate
         * @returns
         * @memberof TreeGridToolbarBase
         */
        activateButton(buttonId, activate) {
            let button = this.getToolbarButton(buttonId);
            if (button == undefined) {
                console.error("Button id not found! id: " + buttonId);
                return;
            }
            let element = this.getElementByToolbarButtonElementId(button.id);
            if (element != undefined) {
                if (activate == true) {
                    element.style.backgroundColor = "var(--main-orange)";
                }
                else {
                    element.style.backgroundColor = "";
                }
            }
        }
        /**
         * Returns the id of the toolbar button that was clicked. Only if the toolbar button is not deactivated!
         *
         * @param {string} toolTipText
         * @param {*} toolbarSettings
         * @returns {string}
         * @memberof TreeGridToolbarBase
         */
        getClickedToolbarId(toolTipText, toolbarSettings) {
            // TODO: why itemName == tooltiptext of customtoolbar and not the id!!!
            // ej.TreeGrid.ToolbarItems.Add = "add" => will be "Add" in itemName!!!
            // custom toolbar
            for (let index = 0; index < toolbarSettings.customToolbarItems.length; index++) {
                if (toolbarSettings.customToolbarItems[index].tooltipText == toolTipText) {
                    let button = this.getToolbarButton(toolbarSettings.customToolbarItems[index].text);
                    if (button != undefined && button.disabled == false) {
                        return toolbarSettings.customToolbarItems[index].text;
                    }
                    return "";
                }
            }
            return "";
        }
        /**
         * Adds a className to the toolbar buttons
         *
         * @memberof TreeGridToolbarBase
         */
        addToolbarButtonClassName(className) {
            for (let i = 0; i < this._toolbarButtons.length; i++) {
                $(this._widgetMainDiv).append(this.getImageStyle(this._toolbarButtons[i].id, this._toolbarButtons[i].icon));
                // add toolbar class to element
                let element = this.getElementByToolbarButtonElementId(this._toolbarButtons[i].id);
                if (element != undefined) {
                    element.classList.add(className);
                }
            }
        }
        /**
         * Sets the default toolbar states at startup
         *
         * @memberof TreeGridToolbarBase
         */
        initToolbarStates() {
            // Sets the default toolbar button class name
            this._defaultButtonClassNameIsUsed = true;
            this.addToolbarButtonClassName(TreeGridToolbarBase_1.defaultToolbarButtonClassName);
        }
        /**
         * Resize the toolbar to the given width
         * Sets the position of the right aligned buttons
         *
         * @param {number} width
         * @memberof TreeGridToolbarBase
         */
        resize(width) {
            let buttonWidth = 31; // TODO: get 31px from div/svg
            let leftButtonCount = this.getVisibleToolbarButtonOnLeftSideCount();
            let rightButtonCount = this.getVisibleToolbarButtonsOnRightSideCount();
            let buttonCount = leftButtonCount + rightButtonCount;
            if (width > (buttonCount * buttonWidth)) { // Only move buttons from right to left if there is enought space  
                // Set the position of the buttons that should be on the right side of the toolbar
                for (let i = 0; i < this._toolbarButtons.length; i++) {
                    if (this._toolbarButtons[i].align == ToolbarButtonAlignment.Right) {
                        let element = this.getElementByToolbarButtonElementId(this._toolbarButtons[i].id);
                        if (element != undefined) {
                            element.parentElement.style.width = width.toString() + "px";
                            let newPosition = width - (leftButtonCount * buttonWidth) - ((rightButtonCount) * buttonWidth);
                            element.style.left = newPosition.toString() + "px";
                        }
                    }
                }
            }
        }
        /**
         * Returns the number of the visible toolbar buttons on the right side
         *
         * @private
         * @returns {number}
         * @memberof TreeGridToolbarBase
         */
        getVisibleToolbarButtonsOnRightSideCount() {
            let visibleToolbarButtons = 0;
            for (let i = 0; i < this._toolbarButtons.length; i++) {
                if (this._toolbarButtons[i].align == ToolbarButtonAlignment.Right) {
                    let element = this.getElementByToolbarButtonElementId(this._toolbarButtons[i].id);
                    if (element != undefined) {
                        if (element.style.display != "none") {
                            visibleToolbarButtons++;
                        }
                    }
                }
            }
            return visibleToolbarButtons;
        }
        /**
         * Returns the number of the visible toolbar buttons on the left side
         *
         * @private
         * @returns
         * @memberof TreeGridToolbarBase
         */
        getVisibleToolbarButtonOnLeftSideCount() {
            let visibleToolbarButtons = 0;
            for (let i = 0; i < this._toolbarButtons.length; i++) {
                if (this._toolbarButtons[i].align == ToolbarButtonAlignment.Left) {
                    let element = this.getElementByToolbarButtonElementId(this._toolbarButtons[i].id);
                    if (element != undefined) {
                        if (element.style.display != "none") {
                            visibleToolbarButtons++;
                        }
                    }
                }
            }
            return visibleToolbarButtons;
        }
        getImageStyle(toolbarId, imageName) {
            let elementId = this.getElementId(toolbarId);
            return `
            <style type="text/css">
            ` + elementId + ` {
                background-image: url(` + this.getImagePath(imageName) + `);
                background-size: 20px 20px;
                background-repeat: no-repeat;
                background-position: center center;
                height: 20px;
                width: 24px;
            }
            </style>`;
        }
        getImagePath(imageName) {
            return themeProvider_1.ThemeProvider.getInstance().getThemedFilePath(imageName);
        }
        getDeactivatedIcon(icon) {
            return icon.replace(".svg", "_deactivated.svg");
        }
        getToolbarButton(id) {
            return this._toolbarButtons.filter(toolbarButton => { return toolbarButton.id == id; })[0];
        }
        /**
         * Returns the HTMLDivElement of the toolbar button for the given id
         *
         * @private
         * @param {string} toolbarButtonId
         * @returns {(HTMLDivElement | undefined)}
         * @memberof TreeGridToolbarBase
         */
        getElementByToolbarButtonElementId(toolbarButtonId) {
            let id = this.getElementId(toolbarButtonId);
            let mySubDiv = this._widgetMainDiv.querySelector(id);
            if (mySubDiv == null) {
                return undefined;
            }
            return mySubDiv;
        }
        /**
         * Returns the element id incl. "#..."
         *
         * @private
         * @param {string} toolbarId
         * @returns {string}
         * @memberof TreeGridToolbarBase
         */
        getElementId(toolbarId) {
            return "#" + this._widgetMainDiv.id + "_" + toolbarId;
        }
        /**
         * Returns the ej tree grid object
         *
         * @returns {ej.TreeGrid}
         * @memberof TreeGridToolbarBase
         */
        getTreeGridObject() {
            return $(this._widgetMainDiv).data("ejTreeGrid");
        }
    };
    TreeGridToolbarBase.defaultToolbarButtonClassName = "toolbarButton";
    TreeGridToolbarBase.defaultToolbarButtonDeactivatedClassName = TreeGridToolbarBase_1.defaultToolbarButtonClassName + "Deactivated";
    TreeGridToolbarBase = TreeGridToolbarBase_1 = __decorate([
        mco.role()
    ], TreeGridToolbarBase);
    exports.TreeGridToolbarBase = TreeGridToolbarBase;
});
