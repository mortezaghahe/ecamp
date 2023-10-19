var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dropDownMenuBase = void 0;
    let dropDownMenuBase = class dropDownMenuBase {
        constructor(widgetDiv, toolbarButtonId) {
            this._buttonsId = [];
            this.isOpened = false;
            this._widgetDiv = widgetDiv;
            this.toolbarButtonId = toolbarButtonId;
        }
        get buttonsId() {
            return this._buttonsId;
        }
        set buttonsId(value) {
            this._buttonsId = value;
        }
        /**
         * Creates dropdown menu
         *
         * @protected
         * @memberof SignalManagerExportDropDownMenu
         */
        createDropDownMenu(width, leftPos, buttonsId) {
            this.dropDownMenu = $('<div style="height:120px;width:' + width + ';background-color:transparent;position:absolute; top: 63px; left: ' + leftPos + '"></div>');
            for (var i = 0; i < buttonsId.length; i++) {
                this.dropDownMenu.append('<button id=' + buttonsId[i] + '/>');
            }
            this.appendDropDownMenu();
        }
        /**
         * Append the html element and add eventListeners
         *
         * @private
         * @memberof dropDownMenuBase
         */
        appendDropDownMenu() {
            $(this._widgetDiv).append(this.dropDownMenu[0]);
            this.removeEventListenerForDropDownMenu = this.removeEventListenerForDropDownMenu.bind(this);
            document.addEventListener('mousedown', this.removeEventListenerForDropDownMenu);
        }
        /**
         * Remove event listener when 'mousedown' is triggered
         *
         * @private
         * @param {*} e
         * @memberof dropDownMenuBase
         */
        removeEventListenerForDropDownMenu(e) {
            if (!this._buttonsId.includes(e.target.id) &&
                !['#' + e.target.parentElement.id, '#' + e.target.id].includes(this._widgetDiv.id + '_' + this.toolbarButtonId)) {
                this.hideDropDownMenu();
            }
        }
        /**
         * Hide the dropdown menu
         *
         * @memberof dropDownMenuBase
         */
        hideDropDownMenu() {
            document.removeEventListener('mousedown', this.removeEventListenerForDropDownMenu);
            this.dropDownMenu.remove();
            this.isOpened = false;
        }
    };
    dropDownMenuBase = __decorate([
        mco.role()
    ], dropDownMenuBase);
    exports.dropDownMenuBase = dropDownMenuBase;
});
