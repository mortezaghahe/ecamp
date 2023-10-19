var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./ytCursorSignalDescriptor", "../../../common/math/sum", "../../../common/math/mean", "../../../common/math/standardDeviation", "../../../common/math/variance", "../../../common/math/min", "../../../common/math/max", "../../../common/math/rms", "./cursorSignal"], function (require, exports, ytCursorSignalDescriptor_1, sum_1, mean_1, standardDeviation_1, variance_1, min_1, max_1, rms_1, cursorSignal_1) {
    "use strict";
    var InfoValues_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.YTCursorSignal = void 0;
    let YTCursorSignal = class YTCursorSignal extends cursorSignal_1.CursorSignal {
        /**
         * Creates an instance of YTCursorSignal
         * @param {BaseSeries} serie
         * @memberof YTCursorSignal
         */
        constructor(serie, expandState, cursorInfo) {
            super(serie, expandState);
            // represents all available values for the actual given cursors
            this._availableValues = new InfoValues();
            this._sum = new sum_1.Sum();
            this._rms = new rms_1.RootMeanSquare();
            this._mean = new mean_1.Mean();
            this._std = new standardDeviation_1.StandardDeviation();
            this._var = new variance_1.Variance();
            this._min = new min_1.Min();
            this._max = new max_1.Max();
            // create specific cursor signal descriptor
            this._cursorSignalDescriptor = new ytCursorSignalDescriptor_1.YTCursorSignalDescriptor(cursorInfo);
        }
        /**
         * Updates the cursor value informations for the given cursors
         *
         * @param {IPoint} cursorData1
         * @param {IPoint} cursorData2
         * @param {number} time1
         * @param {number} time2
         * @memberof YTCursorSignal
         */
        updateValues(cursorData1, cursorData2, time1, time2) {
            this.updateSimpleValues(cursorData1, cursorData2, time1, time2);
            this.updateCalculatedValues(cursorData1, cursorData2);
            this.cursorInfos.forEach(cursorInfo => {
                this.setCursorInfo(cursorInfo);
            });
        }
        updateSimpleValues(cursor1Data, cursor2Data, time1, time2) {
            if (cursor1Data != undefined && cursor1Data.y != undefined && time1 != undefined) {
                // Set cursor 1 infos
                this._availableValues.y1 = cursor1Data.y.toPrecision(17);
                this._availableValues.t1 = cursor1Data.x.toPrecision(6);
            }
            else {
                this._availableValues.y1 = undefined;
                this._availableValues.t1 = undefined;
            }
            if (cursor2Data != undefined && cursor2Data.y != undefined && time2 != undefined) {
                // Set cursor 1 infos
                this._availableValues.y2 = cursor2Data.y.toPrecision(17);
                this._availableValues.t2 = cursor2Data.x.toPrecision(6);
            }
            else {
                this._availableValues.y2 = undefined;
                this._availableValues.t2 = undefined;
            }
        }
        updateCalculatedValues(cursor1Data, cursor2Data) {
            if (cursor1Data != undefined && cursor1Data.y != undefined && cursor2Data != undefined && cursor2Data.y != undefined) {
                let cursorMinXValue = cursor1Data.x;
                let cursorMaxXValue = cursor2Data.x;
                if (cursorMinXValue > cursorMaxXValue) {
                    // Change min and max value
                    let tempXValue = cursorMaxXValue;
                    cursorMaxXValue = cursorMinXValue;
                    cursorMinXValue = tempXValue;
                }
                let signalInfos = this.getSignalInfosFromCursorWindow(cursorMinXValue, cursorMaxXValue, cursor1Data.y);
                this._availableValues.yDiff = (cursor2Data.y - cursor1Data.y).toPrecision(17);
                this._availableValues.tDiff = (cursor2Data.x - cursor1Data.x).toPrecision(6);
                this._availableValues.yMean = signalInfos.yMean.toPrecision(17);
                this._availableValues.yStD = signalInfos.yStD.toPrecision(17);
                this._availableValues.yVar = signalInfos.yVar.toPrecision(17);
                this._availableValues.yRms = signalInfos.yRms.toPrecision(17);
                this._availableValues.yMinimum = signalInfos.yMinimum.toPrecision(17);
                this._availableValues.yMaximum = signalInfos.yMaximum.toPrecision(17);
                this._availableValues.yPp = (signalInfos.yMaximum - signalInfos.yMinimum).toPrecision(17);
            }
            else {
                this._availableValues.yDiff = undefined;
                this._availableValues.tDiff = undefined;
                this._availableValues.yMean = undefined;
                this._availableValues.yStD = undefined;
                this._availableValues.yVar = undefined;
                this._availableValues.yRms = undefined;
                this._availableValues.yMinimum = undefined;
                this._availableValues.yMaximum = undefined;
                this._availableValues.yPp = undefined;
            }
        }
        /**
         * Set cursor informations
         *
         * @private
         * @param {*} cursorInfo
         * @memberof YTCursorSignal
         */
        setCursorInfo(cursorInfo) {
            let value = this._availableValues[cursorInfo.id];
            if (value == undefined) {
                value = InfoValues.undefinedText;
            }
            cursorInfo.value = value;
        }
        getSignalInfosFromCursorWindow(cursorMinXValue, cursorMaxXValue, defaultYValue) {
            let ySelectedValues = [];
            for (let counter = 0; counter < this._serie.rawPoints.length; counter++) {
                if (this._serie.rawPoints[counter].x >= cursorMinXValue && this._serie.rawPoints[counter].x <= cursorMaxXValue) {
                    ySelectedValues.push(this._serie.rawPoints[counter].y);
                }
            }
            this._sum.data = ySelectedValues;
            this._rms.data = ySelectedValues;
            this._mean.data = ySelectedValues;
            this._std.data = ySelectedValues;
            this._max.data = ySelectedValues;
            this._min.data = ySelectedValues;
            let mean = this._mean.calculate();
            this._std.mean = mean;
            let yStd = this._std.calculate();
            this._var.data = yStd;
            return {
                ySum: this._sum.calculate(),
                yRms: this._rms.calculate(),
                yMinimum: this._min.calculate(),
                yMaximum: this._max.calculate(),
                yMean: mean,
                yStD: yStd,
                yVar: this._var.calculate()
            };
        }
        /**
         * provides all available cursor infos
         *
         * @returns {Array<CursorDisplayInfoClass>}
         * @memberof YTCursorSignal
         */
        getAllCursorInfo() {
            return this._cursorSignalDescriptor.getAllCursorInfo();
        }
    };
    YTCursorSignal = __decorate([
        mco.role()
    ], YTCursorSignal);
    exports.YTCursorSignal = YTCursorSignal;
    let InfoValues = InfoValues_1 = class InfoValues {
        constructor() {
            this.y1 = InfoValues_1.undefinedText;
            this.y2 = InfoValues_1.undefinedText;
            this.t1 = InfoValues_1.undefinedText;
            this.t2 = InfoValues_1.undefinedText;
            this.yDiff = InfoValues_1.undefinedText;
            this.tDiff = InfoValues_1.undefinedText;
            this.yMean = InfoValues_1.undefinedText;
            this.yStD = InfoValues_1.undefinedText;
            this.yVar = InfoValues_1.undefinedText;
            this.yRms = InfoValues_1.undefinedText;
            this.yMinimum = InfoValues_1.undefinedText;
            this.yMaximum = InfoValues_1.undefinedText;
            this.yPp = InfoValues_1.undefinedText;
        }
    };
    InfoValues.undefinedText = "";
    InfoValues = InfoValues_1 = __decorate([
        mco.role()
    ], InfoValues);
});
