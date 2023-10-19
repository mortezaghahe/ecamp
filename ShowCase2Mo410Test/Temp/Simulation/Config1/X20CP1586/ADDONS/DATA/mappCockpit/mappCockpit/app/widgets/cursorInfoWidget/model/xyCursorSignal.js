var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./xyCursorSignalDescriptor", "./cursorSignal"], function (require, exports, xyCursorSignalDescriptor_1, cursorSignal_1) {
    "use strict";
    var InfoValues_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XYCursorSignal = void 0;
    let XYCursorSignal = class XYCursorSignal extends cursorSignal_1.CursorSignal {
        /**
         * Creates an instance of XYCursorSignal
         * @param {BaseSeries} serie
         * @memberof XYCursorSignal
         */
        constructor(serie, expandState, cursorInfo) {
            super(serie, expandState);
            // represents all available values for the actual given cursors
            this._availableValues = new InfoValues();
            // create specific cursor signal desriptor
            this._cursorSignalDescriptor = new xyCursorSignalDescriptor_1.XYCursorSignalDescriptor(cursorInfo);
        }
        /**
         * Updates the cursor value informations for the given cursors
         *
         * @param {IPoint} cursorData1
         * @param {IPoint} cursorData2
         * @param {number} time1
         * @param {number} time2
         * @memberof XYCursorSignal
         */
        updateValues(cursorData1, cursorData2, time1, time2) {
            this.updateSimpleValues(cursorData1, cursorData2, time1, time2);
            this.updateCalculatedValues(cursorData1, cursorData2, time1, time2);
            this.cursorInfos.forEach(cursorInfo => {
                this.setCursorInfo(cursorInfo);
            });
        }
        updateSimpleValues(cursor1Data, cursor2Data, time1, time2) {
            if (cursor1Data != undefined && cursor1Data.y != undefined && time1 != undefined) {
                // Set cursor 1 infos
                this._availableValues.y1 = cursor1Data.y.toPrecision(17);
                this._availableValues.x1 = cursor1Data.x.toPrecision(17);
                this._availableValues.t1 = time1.toPrecision(6);
            }
            else {
                this._availableValues.y1 = undefined;
                this._availableValues.x1 = undefined;
                this._availableValues.t1 = undefined;
            }
            if (cursor2Data != undefined && cursor2Data.y != undefined && time2 != undefined) {
                // Set cursor 1 infos
                this._availableValues.y2 = cursor2Data.y.toPrecision(17);
                this._availableValues.x2 = cursor2Data.x.toPrecision(17);
                this._availableValues.t2 = time2.toPrecision(6);
            }
            else {
                this._availableValues.y2 = undefined;
                this._availableValues.x2 = undefined;
                this._availableValues.t2 = undefined;
            }
        }
        updateCalculatedValues(cursor1Data, cursor2Data, time1, time2) {
            if (cursor1Data != undefined && cursor1Data.y != undefined && time1 != undefined && cursor2Data != undefined && cursor2Data.y != undefined && time2 != undefined) {
                let cursorMinXValue = cursor1Data.x;
                let cursorMaxXValue = cursor2Data.x;
                if (cursorMinXValue > cursorMaxXValue) {
                    // Change min and max value
                    let tempXValue = cursorMaxXValue;
                    cursorMaxXValue = cursorMinXValue;
                    cursorMinXValue = tempXValue;
                }
                this._availableValues.yDiff = (cursor2Data.y - cursor1Data.y).toPrecision(17);
                this._availableValues.xDiff = (cursor2Data.x - cursor1Data.x).toPrecision(17);
                this._availableValues.tDiff = (time2 - time1).toPrecision(6);
                this._availableValues.eucDist = (Math.sqrt(Math.pow(cursor2Data.x - cursor1Data.x, 2) + Math.pow(cursor2Data.y - cursor1Data.y, 2))).toPrecision(17);
            }
            else {
                this._availableValues.yDiff = undefined;
                this._availableValues.tDiff = undefined;
                this._availableValues.xDiff = undefined;
            }
        }
        /**
         * Set cursor informations
         *
         * @private
         * @param {*} cursorInfo
         * @memberof XYCursorSignal
         */
        setCursorInfo(cursorInfo) {
            let value = this._availableValues[cursorInfo.id];
            if (value == undefined) {
                value = InfoValues.undefinedText;
            }
            cursorInfo.value = value;
        }
        /**
         * provides all available cursor infos
         *
         * @returns {Array<CursorDisplayInfoClass>}
         * @memberof XYCursorSignal
         */
        getAllCursorInfo() {
            return this._cursorSignalDescriptor.getAllCursorInfo();
        }
    };
    XYCursorSignal = __decorate([
        mco.role()
    ], XYCursorSignal);
    exports.XYCursorSignal = XYCursorSignal;
    let InfoValues = InfoValues_1 = class InfoValues {
        constructor() {
            this.y1 = InfoValues_1.undefinedText;
            this.y2 = InfoValues_1.undefinedText;
            this.x1 = InfoValues_1.undefinedText;
            this.x2 = InfoValues_1.undefinedText;
            this.t1 = InfoValues_1.undefinedText;
            this.t2 = InfoValues_1.undefinedText;
            this.yDiff = InfoValues_1.undefinedText;
            this.tDiff = InfoValues_1.undefinedText;
            this.xDiff = InfoValues_1.undefinedText;
            this.eucDist = InfoValues_1.undefinedText;
        }
    };
    InfoValues.undefinedText = "";
    InfoValues = InfoValues_1 = __decorate([
        mco.role()
    ], InfoValues);
});
