var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../layout/dropDownHTMLProvider"], function (require, exports, dropDownHTMLProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DropDownFooter = void 0;
    /**
     * Contains the information of the dropdown list footer.
     * Each accessible class member that is used in an Syncfusion Template needs to have the same name.
     *
     * TODO: When changing to SF JS2, Footer item is not needed anymore, cause it can be set directly at the footerTemplate!
     *
     * @export
     * @class DropDownFooter
     */
    let DropDownFooter = class DropDownFooter {
        constructor(dropDownFooterCloseAllId, dropDownFooterCloseAllOtherId) {
            this.dropDownTemplate = this.getFooterTemplate(dropDownFooterCloseAllId, dropDownFooterCloseAllOtherId);
        }
        /**
         * The footer template is generated with the passed ids
         *
         * @private
         * @param {string} dropDownFooterCloseAllId
         * @param {string} dropDownFooterCloseAllOtherId
         * @return {*}  {string}
         * @memberof DropDownFooter
         */
        getFooterTemplate(dropDownFooterCloseAllId, dropDownFooterCloseAllOtherId) {
            return dropDownHTMLProvider_1.DropDownHTMLProvider.getDropDownFooterTemplate(dropDownFooterCloseAllId, dropDownFooterCloseAllOtherId);
        }
    };
    DropDownFooter = __decorate([
        mco.role()
    ], DropDownFooter);
    exports.DropDownFooter = DropDownFooter;
});
