var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./CrossHairCursor", "./LineCursor"], function (require, exports, CrossHairCursor_1, LineCursor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Cursor = void 0;
    let Cursor = class Cursor {
        constructor(cursorHandlerID, cursorIndex) {
            this._enableLineCursor = false;
            this._enableCrossHairCursor = false;
            this.cursorIndex = cursorIndex;
            this.lineCursor = new LineCursor_1.LineCursor(cursorHandlerID, cursorIndex);
            this.crossHairCursor = new CrossHairCursor_1.CrossHairCursor(cursorHandlerID, cursorIndex);
        }
        /**
         * set the cursor colors
         *
         * @param {string} cursorColor
         * @param {string} hoverColor
         * @param {string} selectedColor
         * @memberof Cursor
         */
        setCursorColor(cursorColor, hoverColor, selectedColor) {
            this.lineCursor.setColor(cursorColor, hoverColor, selectedColor);
            this.crossHairCursor.setColor(cursorColor, hoverColor, selectedColor);
        }
        /**
         *draw the cursor to the given positions
         *
         * @param {*} leadCursorPosition
         * @param {*} cursorPositions
         * @memberof Cursor
         */
        drawCursor(leadCursorPosition, cursorPositions) {
            this.lineCursor.removeCursors();
            if (this.enableLineCursor == true) {
                this.lineCursor.drawCursor(leadCursorPosition, cursorPositions);
            }
            this.crossHairCursor.removeCursors();
            if (this.enableCrossHairCursor == true) {
                this.crossHairCursor.drawCursor(leadCursorPosition, cursorPositions);
            }
        }
        /**
         * return the closest cursors position and additional data to a given point
         *
         * @param {IPoint} point
         * @returns {CursorPosition}
         * @memberof Cursor
         */
        getClosestCursorPositionToPoint(point) {
            let distance = undefined;
            let currentClosestCursorPosition;
            let cursorStyles = this.getCursorStyleArray();
            for (let i = 0; i < cursorStyles.length; i++) {
                let cursorsClosestCursorPosition = cursorStyles[i].getClosestCursorPositionToPoint(point);
                if (cursorsClosestCursorPosition != undefined) {
                    let cursorsClosestDistance = cursorsClosestCursorPosition.additionalInformation["distance"];
                    if ((distance == undefined || distance > cursorsClosestDistance)) {
                        distance = cursorsClosestDistance;
                        currentClosestCursorPosition = cursorsClosestCursorPosition;
                    }
                }
            }
            return currentClosestCursorPosition;
        }
        /**
         *
         * returns an array with all available cursor styles
         * @private
         * @returns {Array<CursorDefinitionBase>}
         * @memberof Cursor
         */
        getCursorStyleArray() {
            let cursorStyles = new Array();
            if (this.enableLineCursor == true) {
                cursorStyles.push(this.lineCursor);
            }
            if (this.enableCrossHairCursor == true) {
                cursorStyles.push(this.crossHairCursor);
            }
            return cursorStyles;
        }
        set enableLineCursor(enable) {
            this._enableLineCursor = enable;
        }
        get enableLineCursor() {
            return this._enableLineCursor;
        }
        set enableCrossHairCursor(enable) {
            this._enableCrossHairCursor = enable;
        }
        get enableCrossHairCursor() {
            return this._enableCrossHairCursor;
        }
    };
    Cursor = __decorate([
        mco.role()
    ], Cursor);
    exports.Cursor = Cursor;
});
