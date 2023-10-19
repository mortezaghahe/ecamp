var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaneProperties = void 0;
    let PaneProperties = class PaneProperties {
        constructor() {
            this._collapsible = false;
            this._expandable = false;
            this._maxSize = null;
            this._minSize = 10;
            this._paneSize = -1;
            this._resizable = true;
        }
        set collapsible(collapsible) {
            this._collapsible = collapsible;
        }
        get collapsible() {
            return this._collapsible;
        }
        set expandable(expandable) {
            this._expandable = expandable;
        }
        get expandable() {
            return this._expandable;
        }
        set maxSize(maxSize) {
            this._maxSize = maxSize;
        }
        get maxSize() {
            return this._maxSize;
        }
        set minSize(minSize) {
            this._minSize = minSize;
        }
        get minSize() {
            return this._minSize;
        }
        set paneSize(paneSize) {
            this._paneSize = paneSize;
        }
        get paneSize() {
            return this._paneSize;
        }
        set resizable(resizable) {
            this._resizable = resizable;
        }
        get resizable() {
            return this._resizable;
        }
    };
    PaneProperties = __decorate([
        mco.role()
    ], PaneProperties);
    exports.PaneProperties = PaneProperties;
});
