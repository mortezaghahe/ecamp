var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../controller/openViewManagement/controller/openViewMainController", "../topBarDOMManipulator", "./layout/dropDownHTMLProvider", "./model/dropDownDataModel", "./model/dropDownFooter", "./style/css/dropDownCssClassNameProvider"], function (require, exports, openViewMainController_1, topBarDOMManipulator_1, dropDownHTMLProvider_1, dropDownDataModel_1, dropDownFooter_1, dropDownCssClassNameProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DropDown = void 0;
    let DropDown = class DropDown {
        constructor(groupTag, divID) {
            this._contentChanged = (sender, eventArgs) => { this.updateDropDownOutput(); };
            this._showDropDown = (sender, eventArgs) => { this.showDropDown(); };
            this._hideDropDown = (sender, eventArgs) => { this.hideDropDown(); };
            // Set all IDs needed for accessing data and styling for the dropdownlist
            this._divID = divID;
            this.groupTag = groupTag;
            this._dropDownContainerId = this.groupTag + "_dropdown";
            this._dropDownItemDeleteButtonId = this.groupTag + "_dropDownItemDeleteButton_";
            this._dropDownFooterCloseAllId = this.groupTag + "_dropDownFooterCloseAll";
            this._dropDownFooterCloseAllOtherId = this.groupTag + "_dropDownFooterCloseAllOther";
            this._dropDownData = new dropDownDataModel_1.DropDownDataModel(this.groupTag, this._dropDownItemDeleteButtonId);
            this.initializeDropdown();
            this.attach();
        }
        dispose() {
            this._dropDownData.dispose();
            this.detach();
        }
        attach() {
            this._dropDownData.onDropDownDataChanged.attach(this._contentChanged);
            this._dropDownData.showDropDown.attach(this._showDropDown);
            this._dropDownData.hideDropDown.attach(this._hideDropDown);
        }
        detach() {
            this._dropDownData.onDropDownDataChanged.detach(this._contentChanged);
            this._dropDownData.showDropDown.attach(this._showDropDown);
            this._dropDownData.hideDropDown.attach(this._hideDropDown);
        }
        /**
         * Creates the DropDownList for the given tab
         *
         * @param {string} layoutContainerId
         * @param {string} ibleTabContainerId
         * @memberof DropDown
         */
        initializeDropdown() {
            this.appendDropDownLayout(this._dropDownContainerId, this._divID);
            $("#" + this._dropDownContainerId).ejDropDownList({
                minPopupWidth: "280px",
                popupHeight: "250px",
                cssClass: dropDownCssClassNameProvider_1.DropDownCssClassNameProvider.dropDownListStyle,
                // The placeholder of the template is filled either from item or footer. (Info: JS2 has a footer template)
                template: "${dropDownTemplate}",
                htmlAttributes: {
                    class: dropDownCssClassNameProvider_1.DropDownCssClassNameProvider.dropDownWrapper,
                },
                select: (args) => this.onDropdownSelected(args),
                beforePopupShown: (args) => this.updateDropDownOutput()
            });
            this.hideDropDown();
            this.updateDropDownOutput();
        }
        /**
         * When a tab is selected, the standard syncfusion selection is canceld and an event for setting the selected tab gets triggered
         *
         * @private
         * @param {ej.DropDownList.SelectEventArgs} args
         * @memberof DropDown
         */
        onDropdownSelected(args) {
            // disable standard way of selection from syncfusion 
            args.cancel = true;
            // only list items should trigger an selection event
            if (args.itemId !== undefined) {
                let viewID = args.model.dataSource[args.itemId].id;
                // skip footer selection
                if (viewID !== undefined) {
                    openViewMainController_1.OpenViewMainController.getInstance().executeOpenViewByID(viewID);
                }
            }
        }
        /**
         * Append the dropdownlist on the right top of the  view
         *
         * @private
         * @param {string} dropDownContainerId
         * @param {string} rightTabContainerId
         * @memberof DropDown
         */
        appendDropDownLayout(dropDownContainerId, rightTabContainerId) {
            let html = dropDownHTMLProvider_1.DropDownHTMLProvider.getDropDownPopupLayout(dropDownContainerId);
            topBarDOMManipulator_1.TopBarDOMManipulator.appendHTMLTagAtID(rightTabContainerId, html);
        }
        /**
         * This function sets the actual datasource to the dropdownlist and sets the buttons and events needed for removing items
         *
         * @private
         * @memberof DropDown
         */
        updateDropDownOutput() {
            let data = this.getData();
            this.setDataSource(this._dropDownContainerId, data);
            this.setDropDownDeleteButtons();
            this.setDropDownFooterButtons();
        }
        showDropDown() {
            topBarDOMManipulator_1.TopBarDOMManipulator.removeClassAtID(this._divID, dropDownCssClassNameProvider_1.DropDownCssClassNameProvider.hideDropDownWrapper);
        }
        hideDropDown() {
            this.hidePopupList();
            topBarDOMManipulator_1.TopBarDOMManipulator.addClassAtID(this._divID, dropDownCssClassNameProvider_1.DropDownCssClassNameProvider.hideDropDownWrapper);
        }
        /**
         * Creates for each item of the dropdownlist a delete button
         *
         * @private
         * @memberof DropDown
         */
        setDropDownDeleteButtons() {
            this._dropDownData.data.forEach(item => {
                // only for list items a button should be created
                if (item.id !== undefined) {
                    $("#" + this._dropDownItemDeleteButtonId + item.id).ejButton({
                        contentType: ej.ContentType.ImageOnly,
                        cssClass: dropDownCssClassNameProvider_1.DropDownCssClassNameProvider.listItemDeleteButton,
                        click: () => this.onDeleteItemButtonClicked(item.id)
                    });
                }
            });
        }
        /**
         * Triggers an event that close the tab where the delete button was pressed
         *
         * @private
         * @param {string} tabName
         * @memberof DropDown
         */
        onDeleteItemButtonClicked(viewID) {
            openViewMainController_1.OpenViewMainController.getInstance().executeDeleteViewByID(viewID);
        }
        /**
         * Creates syncfusion buttons "Close all" and "Close all other" for the footer of the dropdownlist
         *
         * @private
         * @memberof DropDown
         */
        setDropDownFooterButtons() {
            $("#" + this._dropDownFooterCloseAllId).ejButton({
                text: "Close all",
                contentType: ej.ContentType.TextOnly,
                cssClass: dropDownCssClassNameProvider_1.DropDownCssClassNameProvider.dropDownFooterCloseAll_Other,
                click: (args) => this.onCloseAllTabs(args)
            });
            $("#" + this._dropDownFooterCloseAllOtherId).ejButton({
                text: "Close all other",
                contentType: ej.ContentType.TextOnly,
                cssClass: dropDownCssClassNameProvider_1.DropDownCssClassNameProvider.dropDownFooterCloseAll_Other,
                click: (args) => this.onCloseAllTabsButActive(args)
            });
        }
        /**
         * Triggers an event that closes all tabs
         *
         * @private
         * @param {*} event
         * @memberof DropDown
         */
        onCloseAllTabs(event) {
            let ids = new Array();
            this._dropDownData.data.forEach(item => {
                ids.push(item.id);
            });
            openViewMainController_1.OpenViewMainController.getInstance().executeDeleteViewByIDList(ids);
        }
        /**
         * Triggers an event that closes all tabs but the active one
         *
         * @private
         * @param {*} event
         * @memberof DropDown
         */
        onCloseAllTabsButActive(event) {
            let ids = new Array();
            this._dropDownData.data.forEach(item => {
                if (item.isActive === false) {
                    ids.push(item.id);
                }
            });
            openViewMainController_1.OpenViewMainController.getInstance().executeDeleteViewByIDList(ids);
        }
        /**
         * Hides popuplist bay the passed id
         *
         * @static
         * @memberof DropDown
         */
        hidePopupList() {
            $("#" + this._dropDownContainerId).ejDropDownList("hidePopup");
        }
        /**
         * Set datasource to SF datamodel by the passed id
         *
         * @static
         * @param {string} dropDownContainerId
         * @param {(Array<DropDownItem|DropDownFooter>)} dataSource
         * @memberof DropDown
         */
        setDataSource(dropDownContainerId, dataSource) {
            $("#" + dropDownContainerId).data("ejDropDownList").option("dataSource", dataSource);
        }
        /**
         * Gets the actual data for the dropdownlist
         *
         * @private
         * @return {*}  {(Array<DropDownItem|DropDownFooter>)}
         * @memberof DropDown
         */
        getData() {
            // Get a deep copy of the dropdownitem array
            let data = this._dropDownData.data.slice();
            // add footer in the last position of the array that it gets displayed at the bottom
            data.push(new dropDownFooter_1.DropDownFooter(this._dropDownFooterCloseAllId, this._dropDownFooterCloseAllOtherId));
            return data;
        }
    };
    DropDown = __decorate([
        mco.role()
    ], DropDown);
    exports.DropDown = DropDown;
});
