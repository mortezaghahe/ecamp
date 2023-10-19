var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/dropDownMenuBase"], function (require, exports, dropDownMenuBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalManagerExportDropDownMenu = void 0;
    let SignalManagerExportDropDownMenu = class SignalManagerExportDropDownMenu extends dropDownMenuBase_1.dropDownMenuBase {
        constructor(toolbar, widgetDiv) {
            super(widgetDiv, "Export");
            this._width = '315px';
            this._leftPosition = '32px';
            this.toolbar = toolbar;
            this.buttonsId = ["exportAll_Choose_Btn_DropDownMenu", "exportSelected_Choose_Btn_DropDownMenu", "exportAllNew_Choose_Btn_DropDownMenu"];
            this.exportAll = this.buttonsId[0];
            this.exportAllAsCsv = this.buttonsId[1];
            this.exportSelected = this.buttonsId[2];
        }
        /**
         * Show dropdown menu
         *
         * @param {SignalManagerWidget} signalManagerWidget
         * @param {*} model
         * @param {boolean} selectedItemsExportable
         * @memberof SignalManagerExportDropDownMenu
         */
        showDropDownMenu(signalManagerWidget, model, selectedItemsExportable) {
            this.createDropDownMenu(this._width, this._leftPosition, this.buttonsId);
            this.createButton(this.exportAll, "Export all signals and charts (recommended)", true, signalManagerWidget, model);
            this.createButton(this.exportAllAsCsv, "Export all signals as .csv", true, signalManagerWidget, model);
            this.createButton(this.exportSelected, "Export selected signals  as .csv", selectedItemsExportable, signalManagerWidget, model);
            this.isOpened = true;
        }
        /**
         * Create syncf button
         *
         * @private
         * @param {string} id
         * @param {string} text
         * @param {boolean} enabled
         * @param {SignalManagerWidget} signalManager
         * @param {*} model
         * @memberof SignalManagerExportDropDownMenu
         */
        createButton(id, text, enabled, signalManager, model) {
            $('#' + id).ejButton({
                text: text,
                contentType: ej.ContentType.TextOnly,
                cssClass: "dropDownMenu",
                prefixIcon: "e-icon",
                enabled: enabled,
                click: (args) => {
                    switch (id) {
                        case this.exportSelected:
                            this.exportSelectedData(signalManager, model.selectedItems);
                            break;
                        case this.exportAllAsCsv:
                            this.exportAllDataAsCsv(signalManager, model.currentViewData);
                            break;
                        case this.exportAll:
                            this.exportAllData(signalManager);
                            break;
                    }
                    this.hideDropDownMenu();
                }
            });
        }
        /**
         * Exports selected data as .csv
         *
         * @private
         * @param {SignalManagerWidget} signalManagerWidget
         * @param {*} selectedItems
         * @memberof SignalManagerExportDropDownMenu
         */
        exportSelectedData(signalManagerWidget, selectedItems) {
            this.toolbar.exportSelectedTraceData(signalManagerWidget, selectedItems);
        }
        /**
         * Exports all data as .csv
         *
         * @private
         * @param {SignalManagerWidget} signalManagerWidget
         * @param {*} allItems
         * @memberof SignalManagerExportDropDownMenu
         */
        exportAllDataAsCsv(signalManagerWidget, allItems) {
            this.toolbar.exportAllTraceDataAsCsv(signalManagerWidget, allItems);
        }
        /**
         * Exports all data as .mce
         *
         * @private
         * @param {SignalManagerWidget} signalManagerWidget
         * @param {*} allItems
         * @memberof SignalManagerExportDropDownMenu
         */
        exportAllData(signalManagerWidget) {
            this.toolbar.exportAllTraceData(signalManagerWidget);
        }
    };
    SignalManagerExportDropDownMenu = __decorate([
        mco.role()
    ], SignalManagerExportDropDownMenu);
    exports.SignalManagerExportDropDownMenu = SignalManagerExportDropDownMenu;
});
