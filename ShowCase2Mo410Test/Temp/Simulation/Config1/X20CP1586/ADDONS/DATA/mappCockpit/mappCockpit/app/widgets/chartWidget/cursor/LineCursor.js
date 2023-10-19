var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./CursorDefinitionBase"], function (require, exports, CursorDefinitionBase_1) {
    "use strict";
    var LineCursor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LineCursor = void 0;
    let LineCursor = LineCursor_1 = class LineCursor extends CursorDefinitionBase_1.CursorDefinitionBase {
        constructor(cursorHandlerId, cursorIndex) {
            super(cursorHandlerId, cursorIndex);
            this.lineId = cursorHandlerId + LineCursor_1.lineCursorId + "_" + cursorIndex + "_line";
        }
        drawCursor(leadCursorPosition, cursorPositions) {
            if (leadCursorPosition != undefined && cursorPositions[0] != undefined) {
                this.cursorPositions = cursorPositions;
                this.leadCursorPosition = leadCursorPosition;
                this.drawLine(leadCursorPosition.position.x, leadCursorPosition.additionalInformation["hovered"], leadCursorPosition.additionalInformation["highlight"], leadCursorPosition.additionalInformation["selected"]);
            }
        }
        removeCursors() {
            let cursorElement = document.getElementById(this.lineId);
            if (cursorElement != undefined) {
                cursorElement.remove();
            }
        }
        drawLine(positionX, hovered, highlight, selected) {
            let currentColor = this.cursorColor;
            if (selected) {
                currentColor = this.selectedColor;
            }
            if (hovered) {
                currentColor = this.hoverColor;
            }
            let svgHtml = `<svg style= "position: absolute" id ="` + this.lineId + `" height="100%" width="100%">
                <line x1="` + positionX + `" y1="0" x2="` + positionX + `" y2="100%" style="stroke:` + currentColor + `;stroke-width:2" />
            </svg>`;
            let cursorHandler = document.getElementById(this.cursorHandlerContainerId);
            if (cursorHandler != undefined) {
                cursorHandler.innerHTML += svgHtml;
            }
        }
        getClosestCursorPositionToPoint(point) {
            let distance = undefined;
            let currentClosestCursorPosition;
            if (this.leadCursorPosition != undefined) {
                distance = this.calculateHorizontalDistance(this.leadCursorPosition.position, point);
                currentClosestCursorPosition = this.leadCursorPosition;
                currentClosestCursorPosition.additionalInformation["distance"] = distance;
                return currentClosestCursorPosition;
            }
        }
        /**
         * calculate the horizontal distance between two points
         *
         * @private
         * @param {IPoint} point1
         * @param {IPoint} point2
         * @returns {number}
         * @memberof LineCursor
         */
        calculateHorizontalDistance(point1, point2) {
            return (Math.sqrt(Math.pow(point2.x - point1.x, 2)));
        }
    };
    LineCursor.lineCursorId = "lineCursor";
    LineCursor = LineCursor_1 = __decorate([
        mco.role()
    ], LineCursor);
    exports.LineCursor = LineCursor;
});
