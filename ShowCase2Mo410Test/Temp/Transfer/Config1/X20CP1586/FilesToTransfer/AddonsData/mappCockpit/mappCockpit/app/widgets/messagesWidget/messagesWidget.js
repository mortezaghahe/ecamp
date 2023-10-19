var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/directoryProvider", "../common/treeGridWidgetBase", "../../models/online/mappCockpitComponent", "./model/messagesViewModel", "../common/themeProvider", "./componentDefaultDefinition"], function (require, exports, directoryProvider_1, treeGridWidgetBase_1, mappCockpitComponent_1, messagesViewModel_1, themeProvider_1, componentDefaultDefinition_1) {
    "use strict";
    var MessagesWidget_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessagesWidget = void 0;
    let MessagesWidget = MessagesWidget_1 = class MessagesWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            // Defines the html fragment for the split layout
            this.messagesWidgetSeverityTemplate = `
    <script type="text/x-jsrender" id="severityColumnTemplate">
        {{if severity==0}}
            <img src="` + MessagesWidget_1.getImagePath("icon_success.svg") + `" style="padding-left: 8px; max-height: 100%; alt="{{: 0 }}"">
        {{else severity==1 }}
            <img src="` + MessagesWidget_1.getImagePath("icon_info.svg") + `" style="padding-left: 8px; max-height: 100%; alt="{{: 1 }}""> 
        {{else severity==2}}
            <img src="` + MessagesWidget_1.getImagePath("icon_warning.svg") + `" style="padding-left: 8px; max-height: 100%; alt="{{: 2 }}"">		
        {{else severity==3}}
            <img src="` + MessagesWidget_1.getImagePath("icon_error.svg") + `" style="padding-left: 8px; max-height: 100%; alt="{{: 3 }}""> 
        {{/if}}
    </script>
    `;
            // holds the message parameters
            this._messageParameters = [];
            this._messageWidgetData = new messagesViewModel_1.MessagesData;
            // is the command finished tooltip active?
            this._tooltipActive = false;
            // last known mouse position
            this._currentMouseX = 0;
            this._currentMouseY = 0;
            this.commandSupportClassName = "hoverCommandsSupport";
            this.activeCommandSupportClassName = "hoverCommandsSupportActive";
            this.cellFinishedCommandTooltipClassName = "cellFinishedCommandTooltip";
            this.mouseMoveHandler = (e) => this.setCurrentMousePosition(e, this);
            this.moveFinishedCommandTooltipHandler = (e) => this.showTooltip(e, this);
        }
        static getImagePath(imageName) {
            return themeProvider_1.ThemeProvider.getInstance().getThemedFilePath("../../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "messagesWidget/style/images/" + imageName);
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        initialized() {
            super.initialized();
            // Set dynamic column settings
            super.setDynamicColumn(2, 400);
        }
        /**
         * Called when the message parameters have been updated
         *
         * @private
         * @param {MappCockpitComponentParameter[]} messageParameters
         * @memberof MessagesWidget
         */
        onMessageParametersUpdated(messageParameters) {
            //BINDINGTARGET: the method will be called because of a binding notification
            this._messageParameters = messageParameters;
            // update the widgets data source.
            this.populateMessagesWidgetContent();
        }
        /**
         * Updates the data for the widget from the message parameter values
         *
         * @private
         * @memberof MessagesWidget
         */
        updateMessagesWidgetData() {
            this._messageWidgetData = messagesViewModel_1.MessagesViewModel.convertParametersToMessageData(this._messageParameters);
        }
        /**
         * Creates the layout of the widget
         *
         * @memberof MessagesWidget
         */
        createLayout() {
            $(this.mainDiv).append(this.messagesWidgetSeverityTemplate);
            super.createLayout();
        }
        /**
         * Updates the messages widget with the data and populates the widget
         *
         * @private
         * @memberof MessagesWidget
         */
        populateMessagesWidgetContent() {
            this.refreshMessageContent();
            this.observeMessages();
        }
        /**
         * refreshes the messages after the message parameters have changed
         *
         * @private
         * @memberof MessagesWidget
         */
        refreshMessageContent() {
            this.updateMessagesWidgetData();
            $(this.mainDiv).ejTreeGrid({
                dataSource: this._messageWidgetData.messages,
            });
        }
        /**
         * Observes the message parameters for change and updates the content.
         *
         * @memberof MessagesWidget
         */
        observeMessages() {
            // invoke observing the messages
            mappCockpitComponent_1.MappCockpitComponentParameter.observeParameterValueChanges(this, this._messageParameters);
        }
        /**
         * handles observable changes
         *
         * @param {Observable[]} changedObservables
         * @memberof MessagesWidget
         */
        onObservablesChanged(changedObservables) {
            console.log("onObservablesChanged: %o %o", this, changedObservables);
            this.refreshMessageContent();
        }
        /**
         * activates MessagesWidget
         *
         * @memberof MessagesWidget
         */
        activate() {
            console.log("MessagesWidget activated");
            mappCockpitComponent_1.MappCockpitComponentParameter.activateComponentModelItems(this, this._messageParameters);
            $(this.mainDiv)[0].addEventListener('mousemove', this.mouseMoveHandler);
        }
        /**
         * deactivates MessagesWidget
         *
         * @memberof MessagesWidget
         */
        deactivate() {
            console.log("MessagesWidget deactivated");
            mappCockpitComponent_1.MappCockpitComponentParameter.deactivateComponentModelItems(this, this._messageParameters);
            $(this.mainDiv)[0].removeEventListener('mousemove', this.mouseMoveHandler);
        }
        /**
         * disposes MessagesWidget
         *
         * @memberof MessagesWidget
         */
        dispose() {
            var _a;
            console.log("MessagesWidget disposed");
            mappCockpitComponent_1.MappCockpitComponentParameter.unobserveAll(this, (_a = this._messageParameters[0]) === null || _a === void 0 ? void 0 : _a.component);
            super.dispose();
        }
        /**
         * Creates the tree grid for the messages list
         *
         * @protected
         * @memberof MessagesWidget
         */
        createTreeGrid() {
            let outerObject = this;
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), this.getTreeGridColumnResizeSupport()), { allowSelection: false, editSettings: {
                    allowEditing: false,
                    editMode: "normal",
                    showDeleteConfirmDialog: false,
                    showConfirmDialog: false
                }, recordClick: (args) => this.clickFromTreeGrid(args), queryCellInfo: function (args) {
                    if (args.column.field == "description") {
                        args.cellElement.style.fontWeight = "bold";
                    }
                    else if (args.column.field == "eventId") {
                        args.cellElement.classList.add(outerObject.commandSupportClassName);
                    }
                    let messageItem = args.data;
                    if (messageItem.severity == "3") {
                        args.cellElement.style.color = "red";
                    }
                } }));
        }
        /**
         * add supported operations to cell (e.g. copy to clipboard)
         *
         * @private
         * @param {HTMLElement} cellElement
         * @returns
         * @memberof MessagesWidget
         */
        addOperationsToCell(cellElement) {
            if (cellElement.childNodes.length > 0) {
                if (cellElement.childNodes[0] != undefined) {
                    if (cellElement.childNodes[0].id == "originalText") {
                        // Operations already added
                        return;
                    }
                }
            }
            // Create new div with the original text and a second div positioned on the right side with the commands support icons
            let newContent = `<div id="originalText" class="box" style="margin-top: 4px;">` + cellElement.innerHTML + `</div><div class="commandIcons box" style="margin-left: 4px;">` + MessagesWidget_1.getOperationsRepresentation() + `</div>`;
            cellElement.innerHTML = newContent;
        }
        /**
         * remove supported operations from cell (e.g. copy to clipboard)
         *
         * @private
         * @param {HTMLElement} cellElement
         * @memberof MessagesWidget
         */
        removeOperationsFromCell(cellElement) {
            let originalText = cellElement.childNodes[0].innerHTML;
            cellElement.innerHTML = originalText;
        }
        /**
         * get supported operations representation (e.g. img objects)
         *
         * @private
         * @static
         * @returns {string}
         * @memberof MessagesWidget
         */
        static getOperationsRepresentation() {
            return `<img src="../../../mappCockpit/app/widgets/messagesWidget/style/images/icon_copy.svg" title="Copy the ID">`;
            //`<img src="../../../mappCockpit/app/widgets/messagesWidget/style/images/icon_test.svg" title="Add to favorites">`;
        }
        /**
         * handles the click from the treegrid
         *
         * @private
         * @param {*} args
         * @memberof MessagesWidget
         */
        clickFromTreeGrid(args) {
            if (args.data.item != undefined) {
                if (args.columnName == "ID") {
                    this.copyToClipboard(args.data.item.eventId);
                }
            }
        }
        /**
         * Copies the given text to the clipboard
         *
         * @private
         * @param {string} text_to_copy
         * @returns
         * @memberof MessagesWidget
         */
        copyToClipboard(text_to_copy) {
            let outerObject = this;
            if (!navigator.clipboard) { // undefined if window.isSecureContext is false (not localhost or https)
                // use old execCommand() way if we are not in secureContext
                // text area method
                let textArea = document.createElement("textarea");
                textArea.value = text_to_copy;
                // make the textarea out of viewport
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                return new Promise((res, rej) => {
                    document.execCommand('copy') ? outerObject.copyToClipboardFinised(text_to_copy) : rej();
                    textArea.remove();
                });
            }
            else {
                navigator.clipboard.writeText(text_to_copy).then(() => outerObject.copyToClipboardFinised(text_to_copy))
                    .catch(function () {
                    // Copy to clipboard failed
                });
            }
        }
        /**
         * show tooltip after finished copying to clipboard
         *
         * @private
         * @param {string} copiedText
         * @memberof MessagesWidget
         */
        copyToClipboardFinised(copiedText) {
            if (this._tooltipActive == false) {
                // set tooltip active
                this._tooltipActive = true;
                // get current widget
                let widgetDiv = $(this.mainDiv)[0];
                // create tooltip
                let tooltip = document.createElement("tooltip");
                tooltip.classList.add(this.cellFinishedCommandTooltipClassName);
                tooltip.innerHTML = "Copied the ID '" + copiedText + "'";
                // add tooltip to the widget
                widgetDiv.appendChild(tooltip);
                // set initial tooltip position        
                this.setTooltipPosition(widgetDiv, this._currentMouseX, this._currentMouseY);
                // add mouse move listener for further movements to update the tooltip position
                widgetDiv.addEventListener('mousemove', this.moveFinishedCommandTooltipHandler);
                let outherObject = this;
                // Online show tooltip for some time( e.g. 1,6 sec)
                setTimeout(function () {
                    outherObject._tooltipActive = false;
                    widgetDiv.removeEventListener('mousemove', outherObject.moveFinishedCommandTooltipHandler);
                    widgetDiv.removeChild(tooltip);
                }, 1400);
            }
        }
        /**
         * shows finised operation tooltip at the given position
         *
         * @private
         * @param {*} e
         * @param {MessagesWidget} widget
         * @memberof MessagesWidget
         */
        showTooltip(e, widget) {
            widget.setTooltipPosition(e.currentTarget, e.pageX, e.pageY);
        }
        /**
         * sets the current mouse position and shows additional operations if supported for current hovered cell
         *
         * @private
         * @param {*} e
         * @param {MessagesWidget} widget
         * @memberof MessagesWidget
         */
        setCurrentMousePosition(e, widget) {
            widget._currentMouseX = e.pageX;
            widget._currentMouseY = e.pageY;
            widget.onNewMousePos(e, widget);
        }
        /**
         * add operations if cell supports commands
         *
         * @private
         * @param {*} e
         * @param {MessagesWidget} widget
         * @returns
         * @memberof MessagesWidget
         */
        onNewMousePos(e, widget) {
            let hoverCommandSupportElement;
            // Look if current element under the mouse has a commandSupport class name ...
            if (e.composedPath()[0].classList.contains(this.commandSupportClassName)) {
                hoverCommandSupportElement = e.composedPath()[0];
            }
            else {
                // ...  or one of its parents
                hoverCommandSupportElement = e.composedPath()[0].closest('.' + this.commandSupportClassName);
            }
            // Return if the found hoverCommandSupportElement is already active => nothing to do
            if (hoverCommandSupportElement != undefined && hoverCommandSupportElement.classList.contains(this.activeCommandSupportClassName)) {
                return;
            }
            // If there is already an other element active, then remove the active state, and remove the operations from cell
            if (widget._lastHoverCommandSupportElement != undefined) {
                widget._lastHoverCommandSupportElement.classList.remove(this.activeCommandSupportClassName);
                widget.removeOperationsFromCell(widget._lastHoverCommandSupportElement);
                widget._lastHoverCommandSupportElement = undefined;
            }
            // If there is a new element with command support available, then add the active state and add the operations to the cell
            if (hoverCommandSupportElement != undefined) {
                hoverCommandSupportElement.classList.add(this.activeCommandSupportClassName);
                widget._lastHoverCommandSupportElement = hoverCommandSupportElement;
                widget.addOperationsToCell(hoverCommandSupportElement);
            }
        }
        /**
         * sets the finished command tooltip at the given position
         *
         * @private
         * @param {*} widgtDiv
         * @param {number} posX
         * @param {number} posY
         * @memberof MessagesWidget
         */
        setTooltipPosition(widgtDiv, posX, posY) {
            let tooltips = widgtDiv.getElementsByClassName(this.cellFinishedCommandTooltipClassName);
            if (tooltips != undefined && tooltips.length > 0 && tooltips[0] != undefined) {
                let tooltip = tooltips[0];
                let offsets = widgtDiv.getBoundingClientRect();
                tooltip.style.left = (posX + tooltip.clientWidth + 20 < document.body.clientWidth)
                    ? (posX + 10 + "px")
                    : (document.body.clientWidth - tooltip.clientWidth + "px");
                tooltip.style.left = (parseInt(tooltip.style.left, 10) - offsets.left) + "px";
                tooltip.style.top = (posY + tooltip.clientHeight + 40 < document.body.clientHeight)
                    ? (posY + 15 + "px")
                    : (document.body.clientHeight - tooltip.clientHeight + "px");
                tooltip.style.top = (parseInt(tooltip.style.top, 10) - offsets.top) + "px";
            }
        }
        /**
         * Returns the tree grid column definition
         *
         * @private
         * @returns {{}}
         * @memberof MessagesWidget
         */
        getTreeGridColumnDefinition() {
            return {
                columns: [
                    { field: "severity", headerText: "Severity", isTemplateColumn: true, template: "#severityColumnTemplate", width: "32" },
                    { field: "timeStamp", headerText: "Time", width: "200" },
                    { field: "description", headerText: "Description" },
                    { field: "eventId", headerText: "ID", width: "160" },
                ],
            };
        }
        /**
         * Returns the tree grid column resize settings
         *
         * @private
         * @returns {{}}
         * @memberof MessagesWidget
         */
        getTreeGridColumnResizeSupport() {
            return {
                allowColumnResize: true,
                columnResizeSettings: { columnResizeMode: ej.TreeGrid.ColumnResizeMode.FixedColumns },
                columnResized: (args) => super.resizeDynamicColumn(args.columnIndex, args.model),
            };
        }
    };
    MessagesWidget = MessagesWidget_1 = __decorate([
        mco.role()
    ], MessagesWidget);
    exports.MessagesWidget = MessagesWidget;
});
