var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../style/css/dropDownCssClassNameProvider"], function (require, exports, dropDownCssClassNameProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DropDownHTMLProvider = void 0;
    let DropDownHTMLProvider = class DropDownHTMLProvider {
        constructor() { }
        /**
         * Sets the dropdownlist Id, on that position the dropdownlist is added
         *
         * @static
         * @param {string} dropDownContainerId
         * @return {*}  {string}
         * @memberof DropDownHTMLProvider
         */
        static getDropDownPopupLayout(dropDownContainerId) {
            let html = '<input id="' + dropDownContainerId + '"/>';
            return html;
        }
        /**
         * Template for list items
         *
         * @private
         * @static
         * @param {string} dropDownItemDeleteButtonId
         * @return {*}  {string}
         * @memberof DropDownHTMLProvider
         */
        static getDropDownItemTemplate(dropDownItemDeleteButtonId) {
            let html = '<div class="' + dropDownCssClassNameProvider_1.DropDownCssClassNameProvider.dropDownItemImg + ' ${imageClass}"/>'
                +
                    '<div class="' + dropDownCssClassNameProvider_1.DropDownCssClassNameProvider.dropDownItemText + '">${text}</div>'
                +
                    '<button id="' + dropDownItemDeleteButtonId + '${id}"></button>';
            return html;
        }
        /**
         * Template for footer
         *
         * @private
         * @static
         * @param {string} dropDownFooterCloseAllId
         * @param {string} dropDownFooterCloseAllOtherId
         * @return {*}  {string}
         * @memberof DropDownHTMLProvider
         */
        static getDropDownFooterTemplate(dropDownFooterCloseAllId, dropDownFooterCloseAllOtherId) {
            let html = '<div class="' + dropDownCssClassNameProvider_1.DropDownCssClassNameProvider.dropDownFooter + '">'
                +
                    '<button id="' + dropDownFooterCloseAllId + '"></button>'
                +
                    '<div class="' + dropDownCssClassNameProvider_1.DropDownCssClassNameProvider.dropDownFooterSeparator + '"></div>'
                +
                    '<button id="' + dropDownFooterCloseAllOtherId + '"></button>'
                +
                    '</div>';
            return html;
        }
    };
    DropDownHTMLProvider = __decorate([
        mco.role()
    ], DropDownHTMLProvider);
    exports.DropDownHTMLProvider = DropDownHTMLProvider;
});
