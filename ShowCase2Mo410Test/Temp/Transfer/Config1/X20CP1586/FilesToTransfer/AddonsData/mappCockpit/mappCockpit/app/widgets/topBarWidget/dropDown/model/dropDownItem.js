var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/viewTypeProvider", "../layout/dropDownHTMLProvider"], function (require, exports, viewTypeProvider_1, dropDownHTMLProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DropDownItem = void 0;
    /**
     * Contains the information of a a dropdown list item.
     * Each accessible class member that is used in an Syncfusion Template needs to have the same name.
     *
     * @export
     * @class DropDownItem
     */
    let DropDownItem = class DropDownItem {
        /**
         * Creates an instance of DropDownDataModel.
         * The variable names needs to match with the keys set in the template of ejDropDownList
         * @memberof DropDownDataModel
         */
        constructor(id, text, viewType, isActive, dropDownItemDeleteButtonId) {
            this.id = id;
            this.text = text;
            this.isActive = isActive;
            this.imageClass = viewTypeProvider_1.ViewTypeProvider.getInstance().getIconClassByViewType(viewType, isActive);
            this.dropDownTemplate = this.getListItemTemplate(dropDownItemDeleteButtonId);
        }
        /**
         *
         *
         * @private
         * @param {string} dropDownItemDeleteButtonId
         * @return {*}  {string}
         * @memberof DropDownItem
         */
        getListItemTemplate(dropDownItemDeleteButtonId) {
            return dropDownHTMLProvider_1.DropDownHTMLProvider.getDropDownItemTemplate(dropDownItemDeleteButtonId);
        }
    };
    DropDownItem = __decorate([
        mco.role()
    ], DropDownItem);
    exports.DropDownItem = DropDownItem;
});
