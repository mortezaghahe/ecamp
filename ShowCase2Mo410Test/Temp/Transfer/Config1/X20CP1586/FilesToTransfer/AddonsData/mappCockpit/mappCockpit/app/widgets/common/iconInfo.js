var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IconInfo = void 0;
    let IconInfo = class IconInfo {
        constructor(name, tooltip = '', imageName = '') {
            this._name = name;
            this._tooltip = tooltip;
            this._imageName = imageName;
        }
        /**
         * Updates icon info image and tooltip
         *
         * @param {string} imageName
         * @param {string} tooltip
         * @memberof IconInfo
         */
        updateInfo(imageName, tooltip) {
            this.imageName = imageName;
            this.tooltip = tooltip;
        }
        get name() {
            return this._name;
        }
        set name(name) {
            this._name = name;
        }
        get tooltip() {
            return this._tooltip;
        }
        set tooltip(tooltip) {
            this._tooltip = tooltip;
        }
        get imageName() {
            return this._imageName;
        }
        set imageName(imageName) {
            this._imageName = imageName;
        }
    };
    IconInfo = __decorate([
        mco.role()
    ], IconInfo);
    exports.IconInfo = IconInfo;
});
