var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./Cursor"], function (require, exports, Cursor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorHandler = void 0;
    let CursorHandler = class CursorHandler {
        /**
         * initializes the main cursor handler
         * @param {HTMLDivElement} parentContainer
         * @param {Rectangle} [chartArea]
         * @memberof MainCursorHandler
         */
        constructor(parentContainer, chartArea) {
            this._enableLineCursor = false;
            this._enableCrosshairCursor = false;
            this.parentContainer = parentContainer;
            this.containerId = parentContainer.id + "_cursorHandler";
            this.appendContainer(chartArea);
            //initialize Cursors
            this.cursors = new Array();
            this.cursors[0] = new Cursor_1.Cursor(this.containerId, 0);
            this.cursors[1] = new Cursor_1.Cursor(this.containerId, 1);
            //set cursor colors
            this.cursors[0].setCursorColor("var(--main-cursor1-color)", "var(--main-cursor1-hover-color)", "var(--main-cursor1-active-color)");
            this.cursors[1].setCursorColor("var(--main-cursor2-color)", "var(--main-cursor2-hover-color)", "var(--main-cursor2-active-color)");
        }
        /**
         *draw the cursor of the given cursor index onto the given positions
         *
         * @param {CursorPosition} leadCursorPosition
         * @param {CursorPosition[]} cursorPositions
         * @param {number} cursorIndex
         * @memberof MainCursorHandler
         */
        drawCursor(leadCursorPosition, cursorPositions, cursorIndex) {
            this.cursors[cursorIndex].drawCursor(leadCursorPosition, cursorPositions);
        }
        /**
         *return the closest cursors position and additional data to a given point
         *
         * @param {IPoint} point
         * @returns {CursorPosition}
         * @memberof MainCursorHandler
         */
        getClosestCursorPositionToPoint(point, selectedCursorIndex) {
            let distance = undefined;
            let currentClosestCursorPosition;
            for (let cursor of this.cursors) {
                let closestCursorPosition = cursor.getClosestCursorPositionToPoint(point);
                if (closestCursorPosition != undefined) {
                    let cursorsClosestDistance = closestCursorPosition.additionalInformation["distance"];
                    if (distance == undefined || distance > cursorsClosestDistance) {
                        distance = cursorsClosestDistance;
                        currentClosestCursorPosition = closestCursorPosition;
                    }
                    else if (distance == cursorsClosestDistance) {
                        if (cursor.cursorIndex == selectedCursorIndex) {
                            distance = cursorsClosestDistance;
                            currentClosestCursorPosition = closestCursorPosition;
                        }
                    }
                }
            }
            return currentClosestCursorPosition;
        }
        /**
         * sets up the cursor handler html code
         *
         * @private
         * @param {Rectangle} [chartArea]
         * @memberof MainCursorHandler
         */
        appendContainer(chartArea) {
            let cursorHandlerDiv = document.createElement("div");
            cursorHandlerDiv.id = this.containerId;
            $(this.parentContainer).append(cursorHandlerDiv);
            this.updateChartArea(chartArea);
        }
        /**
         *updates the cursor handlers html position
         *
         * @param {Rectangle} [chartArea]
         * @memberof MainCursorHandler
         */
        updateChartArea(chartArea) {
            let cursorHandlerDiv = document.getElementById(this.containerId);
            if (cursorHandlerDiv != undefined) {
                cursorHandlerDiv.setAttribute("style", "position: absolute; top: " + chartArea.y + "px;left: " + chartArea.x + "px;width: " + chartArea.width + "px;height: " + chartArea.height + "px;");
            }
        }
        set enableLineCursor(enable) {
            this._enableLineCursor = enable;
            for (let i = 0; i < this.cursors.length; i++) {
                this.cursors[i].enableLineCursor = enable;
            }
        }
        get enableLineCursor() {
            return this._enableLineCursor;
        }
        set enableCrosshairCursor(enable) {
            this._enableCrosshairCursor = enable;
            for (let i = 0; i < this.cursors.length; i++) {
                this.cursors[i].enableCrossHairCursor = enable;
            }
        }
        get enableCrosshairCursor() {
            return this._enableCrosshairCursor;
        }
    };
    CursorHandler = __decorate([
        mco.role()
    ], CursorHandler);
    exports.CursorHandler = CursorHandler;
    ;
});
