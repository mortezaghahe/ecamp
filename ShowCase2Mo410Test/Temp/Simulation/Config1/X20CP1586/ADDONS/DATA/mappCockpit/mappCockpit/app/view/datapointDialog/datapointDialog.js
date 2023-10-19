var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../framework/events", "./model/dataPoint", "./model/dataPointCategory", "./model/dataPointComponent", "./eventDatapointArgs"], function (require, exports, events_1, dataPoint_1, dataPointCategory_1, dataPointComponent_1, eventDatapointArgs_1) {
    "use strict";
    var DatapointDialog_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DatapointDialog = exports.FooterContentType = void 0;
    var FooterContentType;
    (function (FooterContentType) {
        FooterContentType[FooterContentType["addReplaceClose"] = 0] = "addReplaceClose";
        FooterContentType[FooterContentType["applyClose"] = 1] = "applyClose";
    })(FooterContentType = exports.FooterContentType || (exports.FooterContentType = {}));
    let EventAddDatapoint = class EventAddDatapoint extends events_1.TypedEvent {
    };
    EventAddDatapoint = __decorate([
        mco.role()
    ], EventAddDatapoint);
    ;
    let EventDialogClosed = class EventDialogClosed extends events_1.TypedEvent {
    };
    EventDialogClosed = __decorate([
        mco.role()
    ], EventDialogClosed);
    ;
    /**
     * Implements a static DatapointDialog
     *
     * @class DatapointDialog
     */
    let DatapointDialog = DatapointDialog_1 = class DatapointDialog {
        /**
         * Returns the one and only instance
         *
         * @static
         * @returns
         * @memberof DatapointDialog
         */
        static getInstance() {
            if (this._instance == undefined) {
                this._instance = new DatapointDialog_1();
            }
            return this._instance;
        }
        /**
         * Opens the datapoint dialog with the given dialog title and footer content (buttons for add, replace, close or apply, close)
         *
         * @param {string} [dialogTitle="Add data points"]
         * @param {FooterContentType} [footerContentType=FooterContentType.addReplaceClose]
         * @memberof DatapointDialog
         */
        open(dialogTitle = "Add data points", footerContentType = FooterContentType.addReplaceClose) {
            // Set dialog title
            $(this._dialogId).ejDialog({ title: dialogTitle });
            this.createDialog(dialogTitle);
            this.createContentOfDialog();
            // Set footer of the dialog
            this.createFooterOfDialog(footerContentType);
            var isOpen = $(this._dialogId).ejDialog("isOpen");
            if (!isOpen) {
                this.showDialog();
            }
        }
        /**
         * Closes the dialog
         *
         * @memberof DatapointDialog
         */
        close() {
            $(this._dialogId).ejDialog("close");
            var treeGridObj = $("#" + this._dataPointContentId).data("ejTreeGrid");
            treeGridObj.destroy();
        }
        /**
         * Updates the available datapoints in the dialog
         *
         * @param {Array<TraceDataPointInfo>} data
         * @memberof DatapointDialog
         */
        setDatapoints(data) {
            this._dataPointsData = new Array();
            for (let i = 0; i < data.length; i++) {
                let dataPointInfo = data[i];
                let dataPointComponent = this._dataPointsData.filter(ele => ele.sourceName == dataPointInfo.componentName)[0];
                if (dataPointComponent == undefined) {
                    dataPointComponent = new dataPointComponent_1.DataPointComponent(dataPointInfo.componentName);
                    this._dataPointsData.push(dataPointComponent);
                }
                let categoryName = this.getDataPointCategoryName(dataPointInfo.namespace);
                let dataPointCategory = dataPointComponent.childs.filter(ele => ele.sourceName == categoryName)[0];
                if (dataPointCategory == undefined) {
                    dataPointCategory = new dataPointCategory_1.DataPointCategory(categoryName);
                    dataPointComponent.childs.push(dataPointCategory);
                }
                dataPointCategory.childs.push(new dataPoint_1.DataPoint(dataPointInfo));
            }
            this.updateTreeGrid();
        }
        /**
         * Creates an instance of DatapointDialog
         * @memberof DatapointDialog
         */
        constructor() {
            // events from dialog
            this.eventAddDatapoint = new EventAddDatapoint();
            this.eventDialogClosed = new EventDialogClosed();
            let datapointDialogId = "CommonDatapointDialog";
            // Add to root => get the page body
            var pageBody = $("body");
            pageBody.append("<div id='" + datapointDialogId + "'></>");
            this.initialize(datapointDialogId);
        }
        /**
         * Initializes the Datapoint dialog with the given id
         *
         * @private
         * @param {string} dialogId
         * @memberof DatapointDialog
         */
        initialize(dialogId) {
            this._dialogId = "#" + dialogId;
            this._dataPointContentId = dialogId + "_ContentRoot";
            this._dataPointFooterId = dialogId + "_Footer";
            this._dataPointFooterScriptId = dialogId + "_FooterScript";
            // Add content div
            $(this._dialogId).append("<div id='" + this._dataPointContentId + "'></div>");
            // Add footer div
            $(this._dialogId).append(`<script id="` + this._dataPointFooterScriptId + `" type="text/x-jsrender">
        <div id="` + this._dataPointFooterId + `" style="padding-left:10px; padding-top: 5px"></div>
        </script>`);
        }
        /**
         * Returns the category name for the given namespace name
         *
         * @private
         * @param {*} namespaceName
         * @returns {string}
         * @memberof DatapointDialog
         */
        getDataPointCategoryName(namespaceName) {
            let categoryName = namespaceName;
            if (namespaceName == "*ACP") {
                categoryName = "Hardware: ACOPOS";
            }
            else if (namespaceName == "*DDP" || namespaceName == "*TRK") {
                categoryName = "Component on PLC";
            }
            return categoryName;
        }
        /**
         * Creates the dialog
         *
         * @private
         * @param {string} dialogTitle
         * @memberof DatapointDialog
         */
        createDialog(dialogTitle) {
            $(this._dialogId).ejDialog({
                actionButtons: ["close"],
                height: "675px",
                width: "530px",
                title: dialogTitle,
                resize: (args) => this.resize(args),
                enableModal: true,
                showFooter: true,
                footerTemplateId: this._dataPointFooterScriptId,
                close: (args) => this.onDialogClosed(),
            });
        }
        /**
         * Resizes the dialog
         *
         * @private
         * @param {*} args
         * @memberof DatapointDialog
         */
        resize(args) {
            // Set treegrid size to the Dialog size
            this._actualDialogHeight = args.model.height;
            this._actualDialogWidth = args.model.width;
            var treeGridObj = $("#" + this._dataPointContentId).data("ejTreeGrid"), sizeSettings = {
                height: this._actualDialogHeight - 107, width: this._actualDialogWidth - 30,
            };
            if (treeGridObj) {
                treeGridObj.option("sizeSettings", sizeSettings, true); // force the setting to resize the treegrid correct
            }
        }
        /**
         * Shows the dialog with current defined size (_actualDialogHeight, _actualDialogWidth)
         *
         * @private
         * @memberof DatapointDialog
         */
        showDialog() {
            $(this._dialogId).ejDialog("open");
            var treeGridObj = $("#" + this._dataPointContentId).data("ejTreeGrid"), sizeSettings = {
                height: this._actualDialogHeight - 107, width: this._actualDialogWidth - 30,
            };
            if (treeGridObj) {
                treeGridObj.option("sizeSettings", sizeSettings, true); // force the setting to resize the treegrid correct
            }
            $(this._dialogId).ejDialog({ height: this._actualDialogHeight });
            $(this._dialogId).ejDialog({ width: this._actualDialogWidth });
            $(this._dialogId).ejDialog("refresh");
        }
        /**
         * Creates the content of the dialog (TreeGrid with datapoints)
         *
         * @private
         * @memberof DatapointDialog
         */
        createContentOfDialog() {
            $("#" + this._dataPointContentId).ejTreeGrid({
                columns: [
                    { field: "sourceName", headerText: "Name", width: 220 },
                    { field: "description", headerText: "Description", width: 300 },
                    { field: "dataPointName", headerText: "Data point", width: 300 },
                ],
                allowColumnResize: true,
                enableVirtualization: true,
                columnResizeSettings: { columnResizeMode: ej.TreeGrid.ColumnResizeMode.Normal },
                editSettings: { allowDeleting: false },
                childMapping: "childs",
                expandStateMapping: "expandState",
                sizeSettings: { height: "570px", width: "500px" },
                recordDoubleClick: (args) => this.onAddDatapoint(args.model.selectedItem, eventDatapointArgs_1.DatapointAction.add),
            });
            this.updateTreeGrid();
        }
        /**
         * Creates the footer content(Add or Apply buttons)
         *
         * @private
         * @param {FooterContentType} footerContentType
         * @memberof DatapointDialog
         */
        createFooterOfDialog(footerContentType) {
            // Reset footer content
            $("#" + this._dataPointFooterId)[0].innerHTML = "";
            // Create footer content
            if (footerContentType == FooterContentType.applyClose) {
                this.createApplyCloseFooter();
            }
            else {
                this.createAddReplaceCloseFooter();
            }
        }
        /**
         * Creates the Apply/Close buttons in the footer content
         *
         * @private
         * @memberof DatapointDialog
         */
        createApplyCloseFooter() {
            $("#" + this._dataPointFooterId).append('<div id="replaceButton"></div>&nbsp;&nbsp;&nbsp;<div id="closeButton"></div>');
            $("#replaceButton").ejButton({
                text: "Apply",
                click: (args) => {
                    var treegridObj = $("#" + this._dataPointContentId).data("ejTreeGrid");
                    let selectedItem = treegridObj.model.selectedItem;
                    this.onAddDatapoint(selectedItem, eventDatapointArgs_1.DatapointAction.replace);
                }
            });
            $("#closeButton").ejButton({
                text: "Close",
                click: (args) => { this.close(); }
            });
        }
        /**
         * Creates the Add/Replace/Close buttons in the footer content
         *
         * @private
         * @memberof DatapointDialog
         */
        createAddReplaceCloseFooter() {
            $("#" + this._dataPointFooterId).append('<div id="addButton"></div>&nbsp;&nbsp;&nbsp;<div id="replaceButton"></div>&nbsp;&nbsp;&nbsp;<div id="closeButton"></div>');
            $("#addButton").ejButton({
                text: "Add",
                click: (args) => {
                    var treegridObj = $("#" + this._dataPointContentId).data("ejTreeGrid");
                    let selectedItem = treegridObj.model.selectedItem;
                    this.onAddDatapoint(selectedItem, eventDatapointArgs_1.DatapointAction.add);
                }
            });
            $("#replaceButton").ejButton({
                text: "Replace",
                click: (args) => {
                    var treegridObj = $("#" + this._dataPointContentId).data("ejTreeGrid");
                    let selectedItem = treegridObj.model.selectedItem;
                    this.onAddDatapoint(selectedItem, eventDatapointArgs_1.DatapointAction.replace);
                }
            });
            $("#closeButton").ejButton({
                text: "Close",
                click: (args) => { this.close(); }
            });
        }
        /**
         * Updates the datapoints in the treegrid
         *
         * @private
         * @memberof DatapointDialog
         */
        updateTreeGrid() {
            var treegridObj = $("#" + this._dataPointContentId).data("ejTreeGrid");
            if (treegridObj != undefined) {
                // refresh TreeGrid with new datasource if tree grid is already available
                treegridObj.setModel({ "dataSource": this._dataPointsData });
            }
        }
        /**
         * Raises the addDatapoint event
         *
         * @private
         * @param {DataPoint} datapoint
         * @param {DatapointAction} action
         * @memberof DatapointDialog
         */
        onAddDatapoint(datapoint, action) {
            if (datapoint.dataPointName != undefined && datapoint.dataPointName != "" && datapoint.dataPointInfo != undefined) {
                let eventArgs = new eventDatapointArgs_1.EventDatapointArgs(this, action, datapoint.dataPointInfo);
                this.eventAddDatapoint.raise(null, eventArgs);
            }
        }
        /**
         * Raises the dialogClosed event
         *
         * @private
         * @memberof DatapointDialog
         */
        onDialogClosed() {
            this.eventDialogClosed.raise(null, null);
        }
    };
    DatapointDialog = DatapointDialog_1 = __decorate([
        mco.role()
    ], DatapointDialog);
    exports.DatapointDialog = DatapointDialog;
});
