var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorDefinitionBase = void 0;
    let CursorDefinitionBase = class CursorDefinitionBase {
        constructor(cursorHandlerId, cursorIndex) {
            this.cursorHandlerContainerId = cursorHandlerId;
            this.cursorPositions = [];
            this.cursorColor = "var(--main-cursor1-color)";
            this.hoverColor = "var(--main-cursor1-hover-color)";
            this.selectedColor = "var(--main-cursor1-active-color)";
        }
        /**
         *set the colors for this cursor style
         *
         * @param {string} cursorColor
         * @param {string} hoverColor
         * @param {string} selectedColor
         * @memberof CursorStyleBase
         */
        setColor(cursorColor, hoverColor, selectedColor) {
            this.cursorColor = cursorColor;
            this.hoverColor = hoverColor;
            this.selectedColor = selectedColor;
            this.removeCursors();
            this.drawCursor(this.leadCursorPosition, this.cursorPositions);
        }
    };
    CursorDefinitionBase = __decorate([
        mco.role()
    ], CursorDefinitionBase);
    exports.CursorDefinitionBase = CursorDefinitionBase;
});
