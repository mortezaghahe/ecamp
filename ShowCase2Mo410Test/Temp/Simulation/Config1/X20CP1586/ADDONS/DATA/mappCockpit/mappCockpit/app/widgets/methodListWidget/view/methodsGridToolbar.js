var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../models/online/mappCockpitComponent", "../../common/domHelper", "../../../common/directoryProvider", "../../common/themeProvider", "../../common/customToolbarButton", "./methodsToolbarButton"], function (require, exports, mappCockpitComponent_1, domHelper_1, directoryProvider_1, themeProvider_1, customToolbarButton_1, methodsToolbarButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MethodGridToolbar = void 0;
    let MethodGridToolbar = class MethodGridToolbar {
        constructor() {
            // Default button id 'Off'
            this.toolbarIdOff = "Off";
            // Default button id 'Abort'
            this.toolbarIdStop = "Abort";
            // Path to image directory
            this._imageDirectory = "../../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "methodListWidget/style/images/toolbar/";
            // Holds an array of buttons used in the toolbar
            this._buttonList = new Array();
            // False if quickCommand buttons are used
            this._areDefaultButtons = true;
        }
        /**
         * Initialization of toolbar
         *
         * @param {HTMLDivElement} widgetMainDiv
         * @memberof MethodGridToolbar
         */
        initToolbar(widgetMainDiv) {
            this._widgetMainDiv = $(widgetMainDiv);
            this._parentDivId = this._widgetMainDiv[0].id;
            // Clear the button list
            this._buttonList.splice(0, this._buttonList.length);
        }
        /**
         * Get default toolbarButtons
         *
         * @returns {CustomToolbarButton[]}
         * @memberof MethodGridToolbar
         */
        getDefaultToolbarButtons() {
            let toolbar = [];
            toolbar.push(new customToolbarButton_1.CustomToolbarButton(this.toolbarIdOff, this.toolbarIdOff));
            toolbar.push(new customToolbarButton_1.CustomToolbarButton(this.toolbarIdStop, this.toolbarIdStop));
            return toolbar;
        }
        /**
         * Define toolbar buttons
         *
         * @param {MappCockpitQuickCommandParameter[]} commands
         * @returns {CustomToolbar[]}
         * @memberof MethodGridToolbar
         */
        getCustomToolbars(commands) {
            let toolbar = [];
            if (commands !== undefined && commands.length !== 0) {
                commands.forEach((command) => {
                    //Text cannot contain spaces
                    let text = command.name.replace(/\s/g, '_');
                    toolbar.push(new customToolbarButton_1.CustomToolbarButton(text, command.tooltip));
                });
            }
            return toolbar;
        }
        /**
         * Dispose the toolbar
         *
         * @memberof MethodGridToolbar
         */
        dispose() {
            for (var i = 0; i < this._buttonList.length; i++) {
                this.destroyButton(this._buttonList[i].buttonId);
            }
        }
        /**
         * Add quick commands toolbar buttons
         *
         * @param {string} methodId
         * @param {string} imageName
         * @memberof MethodGridToolbar
         */
        addQuickCommandsToolbarButtons(methodId, imageName) {
            this._areDefaultButtons = false;
            let buttonId = this._parentDivId + "_" + methodId.replace(/\s/g, '_');
            let imagePath = this._imageDirectory + imageName + '.svg';
            //Add button to toolbar
            this.addMethodToolbarButton(buttonId, methodId, imagePath, '', '35px');
        }
        /**
         * Add default method toolbar buttons
         *
         * @memberof MethodGridToolbar
         */
        addDefaultToolbarButtons() {
            let powerOffIcon = themeProvider_1.ThemeProvider.getInstance().getThemedFilePath("widgets/methodListWidget/style/images/toolbar/Off_white.svg");
            let abortCommandIcon = themeProvider_1.ThemeProvider.getInstance().getThemedFilePath("widgets/methodListWidget/style/images/toolbar/Stop_white.svg");
            let buttonIdOff = this._parentDivId + "_" + this.toolbarIdOff;
            let buttonIdAbort = this._parentDivId + "_" + this.toolbarIdStop;
            //Add buttons to toolbar
            this.addMethodToolbarButton(buttonIdOff, "Power Off", powerOffIcon, this.toolbarIdOff, "100px");
            this.addMethodToolbarButton(buttonIdAbort, "Abort Command", abortCommandIcon, this.toolbarIdStop, "100px");
        }
        /**
         * Add method toolbar buttons
         *
         * @param {string} buttonId
         * @param {string} methodId
         * @param {string} imagePath
         * @param {string} text
         * @param {string} buttonWidth
         * @param {boolean} defaultButtons
         * @memberof MethodGridToolbar
         */
        addMethodToolbarButton(buttonId, methodId, imagePath, text, buttonWidth) {
            this._buttonList.push(new methodsToolbarButton_1.MethodsToolbarButton(buttonId, methodId));
            let buttonElement = this._widgetMainDiv.find("#" + buttonId);
            buttonElement.ejButton({
                cssClass: 'methodListToolbarButton',
                text: text,
                contentType: ej.ContentType.TextAndImage,
                width: buttonWidth,
                click: (args) => this.toolbarButtonClick(methodId),
            });
            this.setButtonImage(buttonId, imagePath);
        }
        /**
         * Defines the image for the button
         *
         * @private
         * @param {string} buttonId
         * @param {string} imagePath
         * @param {string} methodId
         * @param {boolean} defaultButtons
         * @memberof MethodGridToolbar
         */
        setButtonImage(buttonId, imagePath) {
            try {
                let buttonElement = this._widgetMainDiv.find("#" + buttonId)[0];
                buttonElement.style.backgroundImage = "url(" + imagePath + ")";
            }
            catch (e) {
                // Method is called (it should not) when component tab is closed before component has been completely loaded. 
                // Console error is commented until a more robust fixed is found.
                // console.error('MethodsGridToolbar could not add button :' + buttonId + ', ' + e.message);
            }
        }
        /**
         * Destroys the button object
         *
         * @private
         * @param {string} toolbarId
         * @memberof MethodGridToolbar
         */
        destroyButton(toolbarId) {
            let buttonElement = this._widgetMainDiv.find("#" + toolbarId);
            let button = buttonElement.data("ejButton");
            if (button != undefined) {
                button.destroy();
            }
        }
        /**
         * Execute corresponding method when button is clicked
         *
         * @private
         * @param {string} methodId
         * @memberof MethodGridToolbar
         */
        toolbarButtonClick(methodId) {
            let method = mappCockpitComponent_1.MappCockpitComponentMethod.find(methodId, this._actualComponentMethods);
            if (method) {
                if (method.isExecutable != undefined && method.isExecutable.value == true) {
                    mappCockpitComponent_1.MappCockpitComponentMethod.execute(method);
                }
            }
        }
        /**
         * Set button state
         *
         * @private
         * @param {string} buttonId
         * @param {boolean} activated
         * @returns
         * @memberof MethodGridToolbar
         */
        setButtonState(buttonId, activated) {
            // get button instance;
            let buttonElement = this._widgetMainDiv.find("#" + buttonId);
            let button = buttonElement.data("ejButton");
            if (!button) {
                return;
            }
            this.setButtonClass(button, activated);
            domHelper_1.DomHelper.disableElement(buttonElement[0], !activated);
        }
        /**
         * Set specific button class
         *
         * @param {ej.Button} button
         * @param {(boolean | undefined)} activated
         * @memberof MethodGridToolbar
         */
        setButtonClass(button, activated) {
            if (activated) {
                if (this._areDefaultButtons) {
                    button.option({ cssClass: "methodListToolbarButton" });
                }
                else {
                    button.option({ cssClass: "quickCommandToolbarButton" });
                }
            }
            else {
                if (this._areDefaultButtons) {
                    button.option({ cssClass: "methodListToolbarButtonDeactivated" });
                }
                else {
                    button.option({ cssClass: "quickCommandToolbarButtonDeactivated" });
                }
            }
        }
        /**
         * Set executable methods
         *
         * @param {Array<MappCockpitComponentMethod>} actualComponentMethods
         * @memberof MethodGridToolbar
         */
        setActualComponentMethods(actualComponentMethods) {
            this._actualComponentMethods = actualComponentMethods;
            this._buttonList.forEach(button => {
                this.observeMethodExecutabilityForButtonState(button.methodId, button.buttonId, button);
            });
        }
        /**
         * Update button state when executability is changed
         *
         * @private
         * @param {string} methodId
         * @param {string} buttonId
         * @param {ej.Button} button
         * @memberof MethodGridToolbar
         */
        observeMethodExecutabilityForButtonState(methodId, buttonId, button) {
            let method = mappCockpitComponent_1.MappCockpitComponentMethod.find(methodId, this._actualComponentMethods);
            if (method) {
                if (method.isExecutable != undefined) {
                    // Set init state of button   
                    this.setButtonState(buttonId, method.isExecutable.value);
                }
                method.isExecutable.changed((isExecutable) => {
                    // Refresh button state if needed
                    this.setButtonState(buttonId, isExecutable);
                });
            }
            else {
                this.setButtonState(buttonId, false);
            }
        }
    };
    MethodGridToolbar = __decorate([
        mco.role()
    ], MethodGridToolbar);
    exports.MethodGridToolbar = MethodGridToolbar;
});
