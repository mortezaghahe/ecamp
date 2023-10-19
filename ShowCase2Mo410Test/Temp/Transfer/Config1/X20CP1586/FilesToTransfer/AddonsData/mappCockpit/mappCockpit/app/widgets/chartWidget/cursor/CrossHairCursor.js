var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./CursorDefinitionBase"], function (require, exports, CursorDefinitionBase_1) {
    "use strict";
    var CrossHairCursor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CrossHairCursor = void 0;
    let CrossHairCursor = CrossHairCursor_1 = class CrossHairCursor extends CursorDefinitionBase_1.CursorDefinitionBase {
        constructor(cursorHandlerId, cursorIndex) {
            super(cursorHandlerId, cursorIndex);
            this.cursorCenterOffset = 4;
            this.crosshairId = cursorHandlerId + CrossHairCursor_1.crossHairCursorId + "_" + cursorIndex + "_crossHair";
        }
        drawCursor(leadCursorPosition, cursorPositions) {
            if (leadCursorPosition != undefined && cursorPositions[0] != undefined) {
                this.cursorPositions = cursorPositions;
                this.leadCursorPosition = leadCursorPosition;
                for (let i = 0; i < cursorPositions.length; i++) {
                    this.drawCrosshair(cursorPositions[i].position, i, cursorPositions[i].additionalInformation["hovered"], cursorPositions[i].additionalInformation["highlight"], cursorPositions[i].additionalInformation["selected"]);
                }
            }
        }
        removeCursors() {
            let cursorElements = document.getElementsByClassName(this.crosshairId);
            while (cursorElements[0]) {
                cursorElements[0].remove();
            }
        }
        drawCrosshair(position, index, hovered, highlight, selected) {
            let svgHtml;
            let currentColor = this.cursorColor;
            if (selected) {
                currentColor = this.selectedColor;
            }
            if (hovered) {
                currentColor = this.hoverColor;
            }
            if (!highlight) {
                svgHtml = `<svg style= "position: absolute" class ="` + this.crosshairId + `" height="100%" width="100%">
            <line x1="` + (position.x - 14) + `" y1="` + position.y + `" x2="` + (position.x - 4) + `" y2="` + position.y + `" style="stroke:` + currentColor + `;stroke-width:2" />
            <line x1="` + (position.x + 14) + `" y1="` + position.y + `" x2="` + (position.x + 4) + `" y2="` + position.y + `" style="stroke:` + currentColor + `;stroke-width:2" />
            <line x1="` + (position.x) + `" y1="` + (position.y - 14) + `" x2="` + (position.x) + `" y2="` + (position.y - 4) + `" style="stroke:` + currentColor + `;stroke-width:2" />
            <line x1="` + (position.x) + `" y1="` + (position.y + 14) + `" x2="` + (position.x) + `" y2="` + (position.y + 4) + `" style="stroke:` + currentColor + `;stroke-width:2" />

            <line x1="` + (position.x - 4) + `" y1="` + (position.y - 4) + `" x2="` + (position.x + 4) + `" y2="` + (position.y - 4) + `" style="stroke:` + currentColor + `;stroke-width:2" />
            <line x1="` + (position.x - 4) + `" y1="` + (position.y + 4) + `" x2="` + (position.x + 4) + `" y2="` + (position.y + 4) + `" style="stroke:` + currentColor + `;stroke-width:2" />
            <line x1="` + (position.x - 4) + `" y1="` + (position.y - 4) + `" x2="` + (position.x - 4) + `" y2="` + (position.y + 4) + `" style="stroke:` + currentColor + `;stroke-width:2" />
            <line x1="` + (position.x + 4) + `" y1="` + (position.y - 4) + `" x2="` + (position.x + 4) + `" y2="` + (position.y + 4) + `" style="stroke:` + currentColor + `;stroke-width:2" />

            </svg>`;
            }
            else {
                svgHtml = `<svg style= "position: absolute" class ="` + this.crosshairId + `" height="100%" width="100%">
            <line x1="` + (position.x - 14) + `" y1="` + position.y + `" x2="` + (position.x - 4) + `" y2="` + position.y + `" style="stroke:` + currentColor + `;stroke-width:2" />
            <line x1="` + (position.x + 14) + `" y1="` + position.y + `" x2="` + (position.x + 4) + `" y2="` + position.y + `" style="stroke:` + currentColor + `;stroke-width:2" />
            <line x1="` + (position.x) + `" y1="` + (position.y - 14) + `" x2="` + (position.x) + `" y2="` + (position.y - 4) + `" style="stroke:` + currentColor + `;stroke-width:2" />
            <line x1="` + (position.x) + `" y1="` + (position.y + 14) + `" x2="` + (position.x) + `" y2="` + (position.y + 4) + `" style="stroke:` + currentColor + `;stroke-width:2" />

            <line x1="` + (position.x - 6) + `" y1="` + (position.y - 6) + `" x2="` + (position.x + 6) + `" y2="` + (position.y - 6) + `" style="stroke:` + currentColor + `;stroke-width:2" />
            <line x1="` + (position.x - 6) + `" y1="` + (position.y + 6) + `" x2="` + (position.x + 6) + `" y2="` + (position.y + 6) + `" style="stroke:` + currentColor + `;stroke-width:2" />
            <line x1="` + (position.x - 6) + `" y1="` + (position.y - 6) + `" x2="` + (position.x - 6) + `" y2="` + (position.y + 6) + `" style="stroke:` + currentColor + `;stroke-width:2" />
            <line x1="` + (position.x + 6) + `" y1="` + (position.y - 6) + `" x2="` + (position.x + 6) + `" y2="` + (position.y + 6) + `" style="stroke:` + currentColor + `;stroke-width:2" />

            </svg>`;
            }
            let cursorHandler = document.getElementById(this.cursorHandlerContainerId);
            if (cursorHandler != undefined) {
                cursorHandler.innerHTML += svgHtml;
            }
        }
        getClosestCursorPositionToPoint(point) {
            let distance = undefined;
            let currentClosestCursorPosition;
            if (this.cursorPositions != undefined) {
                for (let i = 0; i < this.cursorPositions.length; i++) {
                    if (distance == undefined || distance > this.calculateDistance(this.cursorPositions[i].position, point)) {
                        distance = this.calculateDistance(this.cursorPositions[i].position, point);
                        currentClosestCursorPosition = this.cursorPositions[i];
                        currentClosestCursorPosition.additionalInformation["distance"] = distance - this.cursorCenterOffset;
                    }
                }
            }
            return currentClosestCursorPosition;
        }
        /**
         * calculate distance between two points
         *
         * @private
         * @param {IPoint} point1
         * @param {IPoint} point2
         * @returns {number}
         * @memberof CrossHairCursor
         */
        calculateDistance(point1, point2) {
            return (Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow((point2.y - point1.y), 2)));
        }
    };
    CrossHairCursor.crossHairCursorId = "crossHairCursor";
    CrossHairCursor = CrossHairCursor_1 = __decorate([
        mco.role()
    ], CrossHairCursor);
    exports.CrossHairCursor = CrossHairCursor;
});
