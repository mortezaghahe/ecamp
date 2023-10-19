var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/widgetBase", "../common/domHelper", "../common/themeProvider", "../../common/fileProvider", "../../models/diagnostics/trace/traceConfig/traceConfigDefines", "./componentDefaultDefinition", "../../common/componentBase/contextIds/contextIdsComponent"], function (require, exports, widgetBase_1, domHelper_1, themeProvider_1, fileProvider_1, traceConfigDefines_1, componentDefaultDefinition_1, contextIdsComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceControlWidget = void 0;
    /**
     * Layout styles for dynamic layout
     *
     * @enum {number}
     */
    var LayoutStyle;
    (function (LayoutStyle) {
        LayoutStyle[LayoutStyle["Default"] = 0] = "Default";
        LayoutStyle[LayoutStyle["MinimizeStep1"] = 1] = "MinimizeStep1";
        LayoutStyle[LayoutStyle["MinimizeStep2"] = 2] = "MinimizeStep2";
        LayoutStyle[LayoutStyle["MinimizeStep3"] = 3] = "MinimizeStep3";
    })(LayoutStyle || (LayoutStyle = {}));
    /**
     * The texts for the buttons
     *
     * @class ButtonTexts
     */
    let ButtonTexts = class ButtonTexts {
    };
    // Default button texts
    ButtonTexts.Activate = "Activate";
    ButtonTexts.ForceStart = "Force start";
    ButtonTexts.ForceStop = "Force stop";
    ButtonTexts.SaveTraceConfiguration = "Save trace configuration";
    ButtonTexts.ImportTraceConfiguration = "Import trace configuration";
    ButtonTexts.ExportTraceConfiguration = "Export trace configuration";
    // Minimized button texts
    ButtonTexts.SaveTraceConfigurationMinimized = "Save";
    ButtonTexts.ImportTraceConfigurationMinimized = "Import";
    ButtonTexts.ExportTraceConfigurationMinimized = "Export";
    ButtonTexts = __decorate([
        mco.role()
    ], ButtonTexts);
    /**
     * implements the TraceControlWidget
     *
     * @class TraceControlWidget
     * @extends {WidgetBase}
     */
    let TraceControlWidget = class TraceControlWidget extends widgetBase_1.WidgetBase {
        constructor() {
            super(...arguments);
            this._actualTraceState = traceConfigDefines_1.TraceStateIds.Disabled;
            this._saveConfigIsActive = false;
            this._activateIsActive = false;
            this._uploadDataFinishedHandler = (sender, args) => this.onUploadDataFinished(sender, args);
            /**
             * Default button width for active button
             *
             * @private
             * @memberof TraceControlWidget
             */
            this._defaultButtonWidth1 = "85px";
            /**
             * Default button width for force start/stop button
             *
             * @private
             * @memberof TraceControlWidget
             */
            this._defaultButtonWidth2 = "100px";
            /**
             * Default button width for save/import/export trace config buttons
             *
             * @private
             * @memberof TraceControlWidget
             */
            this._defaultButtonWidth3 = "195px";
            /**
             * Minimized Step 1 button width for save/import/export trace config buttons
             *
             * @private
             * @memberof TraceControlWidget
             */
            this._defaultButtonWidth3MinimizedStep1 = "60px";
            /**
             * Minimized Step 2 button width for save/import/export trace config buttons
             *
             * @private
             * @memberof TraceControlWidget
             */
            this._defaultButtonWidth3MinimizedStep2 = "16px";
            /**
             * Default left position of the save/import/export buttons
             *
             * @private
             * @memberof TraceControlWidget
             */
            this._leftPositionStart = 730;
            /**
             * Default space between the  save/import/export buttons
             *
             * @private
             * @memberof TraceControlWidget
             */
            this._defaultButtonSpace = 35;
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        /**
         * Dispose some objects from this widget
         *
         * @memberof TraceControlWidget
         */
        dispose() {
            // Dispose static button and fields
            this.destroyButton(this._activateButtonId);
            this.destroyField(this._stateFieldId);
            this.destroyButton(this._forceStartButtonId);
            this.destroyButton(this._forceStopButtonId);
            // Dispose dynamic buttons if available
            this.destroyButton(this._saveTraceConfigurationButtonId);
            this.destroyButton(this._importTraceConfigurationButtonId);
            this.destroyButton(this._exportTraceConfigurationButtonId);
            if (this._fileProvider !== undefined) {
                this._fileProvider.eventUploadDataFinished.detach(this._uploadDataFinishedHandler);
            }
            super.dispose();
        }
        /**
         * Creates the widget content and eventually subwidgets
         *
         * @memberof TraceControlWidget
         */
        createLayout() {
            this.initButtonAndFieldIds();
            this.createDivButtonsAndFieldsLayout();
            this.addStaticButtons();
        }
        /**
         * Initializes the ids for the buttons and fields
         *
         * @private
         * @memberof TraceControlWidget
         */
        initButtonAndFieldIds() {
            let layoutContainerId = this.mainDivId;
            this._activateButtonId = layoutContainerId + "_activateButton";
            this._forceStartButtonId = layoutContainerId + "_forceStartButton";
            this._forceStopButtonId = layoutContainerId + "_forceStopButton";
            this._saveTraceConfigurationButtonId = layoutContainerId + "_saveTraceConfigurationButton";
            this._importTraceConfigurationButtonId = layoutContainerId + "_importTraceConfigurationButton";
            this._exportTraceConfigurationButtonId = layoutContainerId + "_exportTraceConfigurationButton";
            this._stateFieldId = layoutContainerId + "tracecontrol_state";
            this._stateImage = layoutContainerId + "tracecontrol_state_image";
        }
        /**
         * Creates the layout for the buttons and fields
         *
         * @private
         * @memberof TraceControlWidget
         */
        createDivButtonsAndFieldsLayout() {
            this.mainDiv.style.paddingTop = "4px";
            this.mainDiv.style.background = "var(--main-grey-dark2)";
            this.mainDiv.style.overflow = "hidden";
            let element = $(this.mainDiv);
            element.append("<div style='left: 25px; position: absolute;' id='" + this._activateButtonId + "'></div>");
            element.append("<div style='top: 10px; left: 150px; position: absolute;' class='traceControlStateImage' id='" + this._stateImage + "'></div>");
            element.append("<div style='top: 10px; left: 180px; position: absolute;' id='" + this._stateFieldId + "'></div>");
            element.append("<div style='left: 340px; position: absolute;' id='" + this._forceStartButtonId + "'></div>");
            element.append("<div style='left: 475px; position: absolute;' id='" + this._forceStopButtonId + "'></div>");
            element.append("<div style='left: " + this.getLeftPosition(0) + "px; position: absolute;' id='" + this._saveTraceConfigurationButtonId + "'></div>");
            element.append("<div style='left: " + this.getLeftPosition(1) + "px; position: absolute;' id='" + this._importTraceConfigurationButtonId + "'></div>");
            element.append("<div style='left: " + this.getLeftPosition(2) + "px; position: absolute;' id='" + this._exportTraceConfigurationButtonId + "'></div>");
        }
        /**
         * Returns the left position of a button for the given LayoutStyle
         *
         * @private
         * @param {number} index
         * @param {LayoutStyle} [layoutStyle=LayoutStyle.Default]
         * @returns {number}
         * @memberof TraceControlWidget
         */
        getLeftPosition(index, layoutStyle = LayoutStyle.Default) {
            if (index == 0) {
                return this._leftPositionStart;
            }
            else {
                let defaultButtonWidth = this._defaultButtonWidth3;
                if (layoutStyle == LayoutStyle.MinimizeStep1) {
                    defaultButtonWidth = this._defaultButtonWidth3MinimizedStep1;
                }
                else if (layoutStyle == LayoutStyle.MinimizeStep2) {
                    defaultButtonWidth = this._defaultButtonWidth3MinimizedStep2;
                }
                let buttonWidth = parseInt(defaultButtonWidth, 10);
                return this._leftPositionStart + (index * (buttonWidth + this._defaultButtonSpace));
            }
        }
        /**
         * Creates the buttons and fields
         *
         * @private
         * @memberof TraceControlWidget
         */
        addStaticButtons() {
            this.createButton(this._activateButtonId, ButtonTexts.Activate, this.getImagePath("play.svg"), this._defaultButtonWidth1);
            this.createField(this._stateFieldId);
            this.createButton(this._forceStartButtonId, ButtonTexts.ForceStart, this.getImagePath("record.svg"), this._defaultButtonWidth2);
            this.createButton(this._forceStopButtonId, ButtonTexts.ForceStop, this.getImagePath("stop.svg"), this._defaultButtonWidth2);
        }
        /**
         * Loads the styles for the trace control widget
         *
         * @memberof TraceControlWidget
         */
        loadStyles() {
            super.addStyle("widgets/traceControlWidget/style/css/traceControlStyle.css");
            super.addStyle("widgets/traceControlWidget/style/css/traceControlButtonStyle.css");
        }
        /**
         * Activates/Deactivates a button
         *
         * @private
         * @param {string} id
         * @param {boolean} deactivate
         * @returns
         * @memberof TraceControlWidget
         */
        deactivateButton(id, deactivate) {
            var ejButton = $("#" + id).data("ejButton");
            if (ejButton == undefined) {
                return;
            }
            this.setButtonCssClass(ejButton, deactivate);
            let buttonElement = $("#" + id)[0];
            let imagePath = this.getImagePathForId(id, deactivate);
            buttonElement.style.backgroundImage = "url('" + imagePath + "')";
            domHelper_1.DomHelper.disableElement(buttonElement, deactivate);
        }
        /**
         * Sets the layout of the button(e.g. text, size, left postion)
         *
         * @private
         * @param {string} id
         * @param {string} buttonText
         * @param {string} newSize
         * @param {string} newLeftPosition
         * @returns
         * @memberof TraceControlWidget
         */
        setButtonLayout(id, buttonText, newSize, newLeftPosition) {
            var ejButton = $("#" + id).data("ejButton");
            if (ejButton == undefined) {
                return;
            }
            ejButton.option("text", buttonText, true);
            if (buttonText == "") {
                ejButton.option("contentType", ej.ContentType.ImageOnly, true);
            }
            else {
                ejButton.option("contentType", ej.ContentType.TextAndImage, true);
            }
            ejButton.option("width", newSize, true);
            let buttonElement = $("#" + id)[0];
            if (buttonElement != undefined) {
                buttonElement.style.left = newLeftPosition;
            }
        }
        /**
         * Returns the imagepath for the button ids
         *
         * @private
         * @param {string} buttonId
         * @param {boolean} deactivate
         * @returns {string}
         * @memberof TraceControlWidget
         */
        getImagePathForId(buttonId, deactivate) {
            let imagePath;
            if (buttonId == this._forceStartButtonId) {
                imagePath = this.getImagePath("record.svg", deactivate);
            }
            else if (buttonId == this._forceStopButtonId) {
                imagePath = this.getImagePath("stop.svg", deactivate);
            }
            else if (buttonId == this._saveTraceConfigurationButtonId) {
                imagePath = this.getImagePath("save.svg", deactivate);
            }
            else if (buttonId == this._activateButtonId) {
                imagePath = this.getImagePath("play.svg", deactivate);
            }
            else if (buttonId == this._importTraceConfigurationButtonId) {
                imagePath = this.getImagePath("import.svg", deactivate);
            }
            else if (buttonId == this._exportTraceConfigurationButtonId) {
                imagePath = this.getImagePath("export.svg", deactivate);
            }
            return imagePath;
        }
        /**
         * Sets the Button css styles for activated or deactivated state
         *
         * @private
         * @param {*} ejButton
         * @param {boolean} deactivate
         * @memberof TraceControlWidget
         */
        setButtonCssClass(ejButton, deactivate) {
            if (deactivate == true) {
                ejButton.option("cssClass", "traceControlButtonDeactivated", true);
            }
            else {
                ejButton.option("cssClass", "traceControlButton", true);
            }
        }
        /**
         * Creates a button with the given text and image
         *
         * @param {string} id
         * @param {string} text
         * @param {string} imagePath
         * @memberof TraceControlWidget
         */
        createButton(id, text, imagePath, width) {
            let element = $("#" + id);
            let ejButton = element.data("ejButton");
            if (ejButton == undefined) { // Only initialize if not already available to avoid duplicated events     
                element.ejButton({
                    text: text,
                    contentType: ej.ContentType.TextAndImage,
                    cssClass: "traceControlButton",
                    prefixIcon: "e-icon",
                    click: (clickArgs) => this.click(id),
                    width: width,
                });
            }
            let buttonElement = element[0];
            buttonElement.style.backgroundPositionX = "4px";
            buttonElement.style.backgroundPositionY = "4px";
            buttonElement.style.backgroundImage = "url('" + imagePath + "')";
            buttonElement.style.backgroundRepeat = "no-repeat";
            buttonElement.style.backgroundSize = "16px 16px";
        }
        /**
         * Destroys the button object
         *
         * @private
         * @param {string} id
         * @memberof TraceControlWidget
         */
        destroyButton(id) {
            let button = $("#" + id).data("ejButton");
            if (button != undefined) {
                button.destroy();
            }
        }
        /**
         * Creates the trace state field (currently a special button is used)
         *
         * @param {string} id
         * @memberof TraceControlWidget
         */
        createField(id) {
            $("#" + id).ejButton({
                text: "0",
                contentType: ej.ContentType.TextOnly,
                cssClass: "traceStateButton",
            });
            let fieldElement = $("#" + id)[0];
            if (fieldElement != undefined) {
                fieldElement.style.color = "#FFFFFF";
            }
        }
        /**
         * Destroys the field object
         *
         * @param {string} id
         * @memberof TraceControlWidget
         */
        destroyField(id) {
            let field = $("#" + id).data("ejButton");
            if (field != undefined) {
                field.destroy();
            }
        }
        /**
         * Resizes the trace control widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof TraceControlWidget
         */
        resize(width, height) {
            this._actualHeight = height;
            this._actualWidth = width;
            this.mainDiv.style.width = width.toString() + "px";
            this.mainDiv.style.height = height.toString() + "px";
            this.updateDynamicLayout();
        }
        /**
         * Updates the dynamic layout (e.g. smaller buttons if small widget size)
         *
         * @private
         * @memberof TraceControlWidget
         */
        updateDynamicLayout() {
            let neededSizeForDefaultLayout = 1400;
            let neededSizeForMinimzedLayoutStep1 = 1000;
            if (this._actualWidth > neededSizeForDefaultLayout) {
                this.setLayout(LayoutStyle.Default);
            }
            else if (this._actualWidth > neededSizeForMinimzedLayoutStep1) {
                this.setLayout(LayoutStyle.MinimizeStep1);
            }
            else {
                this.setLayout(LayoutStyle.MinimizeStep2);
            }
        }
        /**
         * Sets the dynamic layout to a defined layout style (e.g. default or minimized)
         *
         * @private
         * @param {LayoutStyle} layoutStyle
         * @memberof TraceControlWidget
         */
        setLayout(layoutStyle) {
            switch (layoutStyle) {
                case LayoutStyle.MinimizeStep2: {
                    this.setButtonLayout(this._saveTraceConfigurationButtonId, "", this._defaultButtonWidth3MinimizedStep2, this.getLeftPosition(0, LayoutStyle.MinimizeStep2) + "px");
                    this.setButtonLayout(this._importTraceConfigurationButtonId, "", this._defaultButtonWidth3MinimizedStep2, this.getLeftPosition(1, LayoutStyle.MinimizeStep2) + "px");
                    this.setButtonLayout(this._exportTraceConfigurationButtonId, "", this._defaultButtonWidth3MinimizedStep2, this.getLeftPosition(2, LayoutStyle.MinimizeStep2) + "px");
                    break;
                }
                case LayoutStyle.MinimizeStep1: {
                    this.setButtonLayout(this._saveTraceConfigurationButtonId, ButtonTexts.SaveTraceConfigurationMinimized, this._defaultButtonWidth3MinimizedStep1, this.getLeftPosition(0, LayoutStyle.MinimizeStep1) + "px");
                    this.setButtonLayout(this._importTraceConfigurationButtonId, ButtonTexts.ImportTraceConfigurationMinimized, this._defaultButtonWidth3MinimizedStep1, this.getLeftPosition(1, LayoutStyle.MinimizeStep1) + "px");
                    this.setButtonLayout(this._exportTraceConfigurationButtonId, ButtonTexts.ExportTraceConfigurationMinimized, this._defaultButtonWidth3MinimizedStep1, this.getLeftPosition(2, LayoutStyle.MinimizeStep1) + "px");
                    break;
                }
                case LayoutStyle.Default: {
                    this.setButtonLayout(this._saveTraceConfigurationButtonId, ButtonTexts.SaveTraceConfiguration, this._defaultButtonWidth3, this.getLeftPosition(0) + "px");
                    this.setButtonLayout(this._importTraceConfigurationButtonId, ButtonTexts.ImportTraceConfiguration, this._defaultButtonWidth3, this.getLeftPosition(1) + "px");
                    this.setButtonLayout(this._exportTraceConfigurationButtonId, ButtonTexts.ExportTraceConfiguration, this._defaultButtonWidth3, this.getLeftPosition(2) + "px");
                    break;
                }
            }
        }
        /**
         * Sets and defines the interface to the trace control
         *
         * @private
         * @param {ITraceComponentControl} traceComponentControl
         * @memberof TraceControlWidget
         */
        updateTraceControlInterface(traceComponentControl) {
            var _a;
            if (((_a = this.component.context) === null || _a === void 0 ? void 0 : _a.getContext(contextIdsComponent_1.ContextIdsComponent.ViewComponentTypeId)) == "TraceViewWidget") {
                traceComponentControl = this.getInterfaceWithoutSaveCommand(traceComponentControl);
            }
            this._traceControlInterface = traceComponentControl;
            if (this._traceControlInterface) {
                this.addDynamicButtonsForAvailableCommands(this._traceControlInterface);
                this.addTraceState();
            }
        }
        /**
         * Returns the trace component control with out the save/import/export trace configuration command
         *
         * @private
         * @param {ITraceComponentControl} traceComponentControl
         * @returns {*}
         * @memberof TraceViewWidget
         */
        getInterfaceWithoutSaveCommand(traceComponentControl) {
            return {
                commandActivate: traceComponentControl.commandActivate,
                commandForceStart: traceComponentControl.commandForceStart,
                commandForceStop: traceComponentControl.commandForceStop,
            };
        }
        /**
         * Add trace state info to layout
         *
         * @private
         * @memberof TraceControlWidget
         */
        addTraceState() {
            this.createField(this._stateFieldId);
            this.refreshTraceControlParameterValue(this._actualTraceState);
        }
        /**
         * Adds the dynamic buttons (save/import/export trace configuation) if command is available in command interface
         *
         * @private
         * @param {*} commands
         * @memberof TraceControlWidget
         */
        addDynamicButtonsForAvailableCommands(commands) {
            if (commands.commandSaveConfiguration) {
                this.createButton(this._saveTraceConfigurationButtonId, ButtonTexts.SaveTraceConfiguration, this.getImagePath("save.svg"), this._defaultButtonWidth3);
            }
            if (commands.commandImportTraceConfiguration) {
                this.createButton(this._importTraceConfigurationButtonId, ButtonTexts.ImportTraceConfiguration, this.getImagePath("import.svg"), this._defaultButtonWidth3);
                this._fileProvider = new fileProvider_1.FileProvider("FileProviderTraceContolWidget" + widgetBase_1.WidgetBase.getUniqueDivId());
                this._fileProvider.eventUploadDataFinished.attach(this._uploadDataFinishedHandler);
            }
            if (commands.commandExportTraceConfiguration) {
                this.createButton(this._exportTraceConfigurationButtonId, ButtonTexts.ExportTraceConfiguration, this.getImagePath("export.svg"), this._defaultButtonWidth3);
            }
            // Update layout after adding new buttons
            this.updateDynamicLayout();
        }
        /**
         * Will be called when a button was clicked
         *
         * @private
         * @param {*} buttonId
         * @memberof TraceControlWidget
         */
        click(buttonId) {
            switch (buttonId) {
                case this._activateButtonId:
                    this.executeActivate();
                    break;
                case this._forceStartButtonId:
                    this.executeForceStart();
                    break;
                case this._forceStopButtonId:
                    this.executeForceStop();
                    break;
                case this._saveTraceConfigurationButtonId:
                    this.executeSaveConfiguration();
                    break;
                case this._importTraceConfigurationButtonId:
                    this.importTraceConfiguration();
                    break;
                case this._exportTraceConfigurationButtonId:
                    this.exportTraceConfiguration();
                    break;
            }
        }
        /**
         * Activates the trace
         *
         * @private
         * @memberof TraceControlWidget
         */
        executeActivate() {
            // invoke activate trace by using a component command
            if (this._saveConfigIsActive == false) {
                this._activateIsActive = true;
                this.setButtonStates(this._actualTraceState);
                this.activateTrace();
            }
        }
        activateTrace() {
            if (this._traceControlInterface) {
                this._traceControlInterface.commandActivate.execute(null, (result) => {
                    this.onTraceActivated();
                });
            }
        }
        /**
         * Processes trace activation response
         *
         * @private
         * @memberof TraceControlWidget
         */
        onTraceActivated() {
            this._activateIsActive = false;
            this.setButtonStates(this._actualTraceState);
        }
        /**
         * handles trace state changes
         *
         * @private
         * @param {string} traceState
         * @memberof TraceControlWidget
         */
        onTraceStateChanged(traceState) {
            this._actualTraceState = traceState;
            this.refreshTraceControlParameterValue(traceState);
        }
        /**
         * Forces starting the trace
         *
         * @private
         * @memberof TraceControlWidget
         */
        executeForceStart() {
            if (this._traceControlInterface) {
                if (this._actualTraceState == traceConfigDefines_1.TraceStateIds.Wait_start_trigger) {
                    this._traceControlInterface.commandForceStart.execute();
                }
            }
        }
        /**
         * Forces stopping the trace
         *
         * @private
         * @memberof TraceControlWidget
         */
        executeForceStop() {
            if (this._traceControlInterface) {
                if (this._actualTraceState == traceConfigDefines_1.TraceStateIds.Wait_stop_event) { // Only while running
                    this._traceControlInterface.commandForceStop.execute();
                }
            }
        }
        /**
         * Saves the trace configuration on target
         *
         * @private
         * @memberof TraceControlWidget
         */
        executeSaveConfiguration() {
            if (this._traceControlInterface) {
                if (this.saveTraceConfigPossibleInThisState(this._actualTraceState)) {
                    this._saveConfigIsActive = true;
                    this.setButtonStates(this._actualTraceState);
                    this._traceControlInterface.commandSaveConfiguration.execute(null, (result) => {
                        this._saveConfigIsActive = false;
                        this.setButtonStates(this._actualTraceState);
                    });
                }
            }
        }
        /**
         * Opens a file select dialog and imports a trace configuration from the file
         *
         * @private
         * @memberof TraceControlWidget
         */
        importTraceConfiguration() {
            if (this._fileProvider !== undefined) {
                this._fileProvider.uploadData(".tracecfg"); // Only show/accept *.tracecfg files
            }
        }
        /**
         * Export a trace configuration to a file
         *
         * @private
         * @memberof TraceControlWidget
         */
        exportTraceConfiguration() {
            this._traceControlInterface.commandExportTraceConfiguration.execute(null, (result) => {
                var blob = new Blob([result], { type: "text/xml" });
                fileProvider_1.FileProvider.downloadData("TraceConfi.tracecfg", blob);
            });
        }
        /**
         * Occurs after reading data from file(trace configuration import data)
         *
         * @private
         * @param {HTMLInputElement} sender
         * @param {Map<string, string>} args
         * @memberof TraceControlWidget
         */
        onUploadDataFinished(sender, args) {
            /*this.setBusyInformation(new BusyInformation("Importing data...", ImageId.defaultImage, 48, true));
            this.setBusy(true);*/
            // Timeout needed to show the busyscreen before importing data 
            setTimeout(() => this.importData(sender, args), 200);
        }
        /**
         * imports the given filedata with the given filename
         *
         * @private
         * @param {HTMLInputElement} fileInputElement
         * @param {Map<string, string>} fileContents
         * @memberof TraceControlWidget
         */
        importData(fileInputElement, fileContents) {
            if (fileContents.size === 1) {
                let filedata = fileContents.values().next().value;
                this._traceControlInterface.commandImportTraceConfiguration.execute(filedata, (result) => {
                });
            }
        }
        /**
         * refreshes the trace state (displayname of value and the state icon)
         *
         * @private
         * @param {MappCockpitComponentParameter} traceControlParameter
         * @memberof TraceControlWidget
         */
        refreshTraceControlParameterValue(traceState) {
            this.setTraceStateText(traceState);
            this.setTraceStateImage(traceState);
            this.setButtonStates(traceState);
        }
        /**
         * Set the display name for the trace state in the visualization
         *
         * @private
         * @param {string} traceState
         * @memberof TraceControlWidget
         */
        setTraceStateText(traceState) {
            // Get display name for the trace state
            let traceStateDisplayText = "Inactive";
            if (traceState == traceConfigDefines_1.TraceStateIds.Config_processing || traceState == traceConfigDefines_1.TraceStateIds.Config_applied) {
                traceStateDisplayText = "Applying configuration";
            }
            else if (traceState == traceConfigDefines_1.TraceStateIds.Wait_start_trigger) {
                traceStateDisplayText = "Wait for start trigger";
            }
            else if (traceState == traceConfigDefines_1.TraceStateIds.Wait_stop_event) {
                traceStateDisplayText = "Running";
            }
            else if (traceState == traceConfigDefines_1.TraceStateIds.Data_available) {
                traceStateDisplayText = "Data available";
            }
            else if (traceState == traceConfigDefines_1.TraceStateIds.Record_failure) {
                traceStateDisplayText = "Record failed";
            }
            // Set display name for the trace state
            $("#" + this._stateFieldId).ejButton({
                text: traceStateDisplayText,
            });
        }
        /**
         * Sets an image for the trace state in the visualization
         *
         * @private
         * @param {string} traceState
         * @memberof TraceControlWidget
         */
        setTraceStateImage(traceState) {
            // Get image for the trace state
            let imagepath = this.getImagePath("inactive.svg");
            if (traceState == traceConfigDefines_1.TraceStateIds.Wait_start_trigger) {
                imagepath = this.getImagePath("wait_start_trigger.svg");
            }
            else if (traceState == traceConfigDefines_1.TraceStateIds.Wait_stop_event) {
                imagepath = this.getImagePath("wait_stop_event.svg");
            }
            else if (traceState == traceConfigDefines_1.TraceStateIds.Data_available) {
                imagepath = this.getImagePath("data_available.svg");
            }
            // Set image for the trace state
            let imageElement = $("#" + this._stateImage)[0];
            if (imageElement != undefined) {
                imageElement.style.backgroundImage = "url('" + imagepath + "')";
            }
        }
        /**
         * Sets the states(enabled/disabled) of the buttons for the given trace state
         *
         * @private
         * @param {string} traceState
         * @memberof TraceControlWidget
         */
        setButtonStates(traceState) {
            if (traceState == traceConfigDefines_1.TraceStateIds.Wait_start_trigger) {
                this.setButtonStateInWaitStartTriggerState();
            }
            else if (traceState == traceConfigDefines_1.TraceStateIds.Wait_stop_event) {
                this.setButtonStateInWaitStopEventState();
            }
            else {
                if (this.saveTraceConfigPossibleInThisState(traceState)) {
                    this.deactivateButton(this._saveTraceConfigurationButtonId, false);
                }
                // other state => deactivate force start trigger and force stop event
                this.deactivateButton(this._forceStartButtonId, true);
                this.deactivateButton(this._forceStopButtonId, true);
                // set activate button state
                if (this._activateIsActive == false && this._saveConfigIsActive == false) {
                    this.deactivateButton(this._activateButtonId, false);
                }
                else {
                    this.deactivateButton(this._activateButtonId, true);
                }
            }
        }
        /**
         * Sets the button states if the trace state is waiting for start trigger
         *
         * @private
         * @memberof TraceControlWidget
         */
        setButtonStateInWaitStartTriggerState() {
            // Wait for start trigger => activate force start; deactivate force stop event
            this.deactivateButton(this._forceStartButtonId, false);
            this.deactivateButton(this._forceStopButtonId, true);
            this.deactivateButton(this._saveTraceConfigurationButtonId, true);
        }
        /**
         * Sets the button states if the trace state is waiting for the stop event
         *
         * @private
         * @memberof TraceControlWidget
         */
        setButtonStateInWaitStopEventState() {
            // Running => deactivate force start trigger; activate force stop event
            this.deactivateButton(this._forceStartButtonId, true);
            this.deactivateButton(this._forceStopButtonId, false);
            this.deactivateButton(this._saveTraceConfigurationButtonId, true);
        }
        /**
         * Returns the imagePath for the given imageName and state(activated/deactivated)
         *
         * @private
         * @param {string} imageName
         * @param {boolean} [deactivated=false]
         * @returns {string}
         * @memberof TraceControlWidget
         */
        getImagePath(imageName, deactivated = false) {
            if (deactivated == true) {
                imageName = imageName.replace(".svg", "_deactivated.svg");
            }
            return themeProvider_1.ThemeProvider.getInstance().getThemedFilePath("widgets/traceControlWidget/style/images/" + imageName);
        }
        /**
         * Return true if saveing of trace configuration is possible in the current trace state
         *
         * @private
         * @param {*} state
         * @returns {boolean}
         * @memberof TraceControlWidget
         */
        saveTraceConfigPossibleInThisState(state) {
            if (state == traceConfigDefines_1.TraceStateIds.Disabled || state == traceConfigDefines_1.TraceStateIds.Data_available || state == traceConfigDefines_1.TraceStateIds.Record_failure) {
                return true;
            }
            return false;
        }
    };
    TraceControlWidget = __decorate([
        mco.role()
    ], TraceControlWidget);
    exports.TraceControlWidget = TraceControlWidget;
});
