var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DropDownCssClassNameProvider = void 0;
    /**
     * !! ID and Class names are used in css file dropDownStyle.css
     *
     * @export
     * @class DropDownCssClassNameProvider
     */
    let DropDownCssClassNameProvider = class DropDownCssClassNameProvider {
        constructor() { }
    };
    DropDownCssClassNameProvider.dropDownListStyle = "DropDownListStyle";
    DropDownCssClassNameProvider.dropDownWrapper = "DropDownWrapper";
    DropDownCssClassNameProvider.hideDropDownWrapper = "HideDropDownWrapper";
    DropDownCssClassNameProvider.dropDownItemImg = "DropDownItemImg";
    DropDownCssClassNameProvider.dropDownItemText = "DropDownItemText";
    DropDownCssClassNameProvider.dropDownFooterCloseAll_Other = "DropDownFooterCloseAll_Other";
    DropDownCssClassNameProvider.dropDownFooter = "DropDownFooter";
    DropDownCssClassNameProvider.dropDownFooterSeparator = "DropDownFooterSeparator";
    DropDownCssClassNameProvider.listItemDeleteButton = "ListItemDeleteButton";
    DropDownCssClassNameProvider = __decorate([
        mco.role()
    ], DropDownCssClassNameProvider);
    exports.DropDownCssClassNameProvider = DropDownCssClassNameProvider;
});
