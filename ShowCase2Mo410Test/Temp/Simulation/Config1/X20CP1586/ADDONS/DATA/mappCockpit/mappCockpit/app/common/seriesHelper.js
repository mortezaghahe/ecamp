var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./persistence/settings", "./utilities/binSearch", "../models/common/series/seriesType", "../models/common/series/settingIds"], function (require, exports, settings_1, binSearch_1, seriesType_1, settingIds_1) {
    "use strict";
    var SeriesHelper_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinSearchMode = exports.SeriesHelper = void 0;
    Object.defineProperty(exports, "BinSearchMode", { enumerable: true, get: function () { return binSearch_1.BinSearchMode; } });
    let SeriesHelper = SeriesHelper_1 = class SeriesHelper {
        /**
         * searches for the next nearest timestamp in all series.
         *
         * @static
         * @param {number} searchValue the value to be searched for.
         * @param {number[][]} valueCollection an array of a value array containing the possible values.
         * @param {BinSearchMode} [searchMode=BinSearchMode.NEAREST] specefies the search mode to decide if the bigger, smaller or nearest values shoud be picked.
         * @returns
         * @memberof SeriesHelper
         */
        static findNearestValueFromCollection(searchValue, valueCollection, searchMode = binSearch_1.BinSearchMode.NEAREST) {
            let nearestValues = [];
            // find and collect the nearest points within a single series
            valueCollection.forEach((values) => {
                let nearestValueIndex = binSearch_1.BinSearch.findNearest(searchValue, values, searchMode);
                if (nearestValues.indexOf(values[nearestValueIndex]) == -1) {
                    nearestValues.push(values[nearestValueIndex]);
                }
            });
            // sort the nearest series points of multiple series by their x value (timestamp)
            nearestValues.sort((value1, value2) => { return value1 - value2; });
            // get the nearest value from all value series
            let nearestValueIndex = binSearch_1.BinSearch.findNearest(searchValue, nearestValues, searchMode);
            let nearestValue = nearestValues[nearestValueIndex];
            return nearestValue;
        }
        /**
         * searches for the nearest value
         *
         * @static
         * @param {number} searchValue
         * @param {number[]} values
         * @param {*} [searchMode=BinSearchMode.NEAREST]
         * @param {number} [iFrom=0]
         * @param {number} [iTo=0]
         * @returns {number}
         * @memberof SeriesHelper
         */
        static indexOfNearest(searchValue, values, searchMode = binSearch_1.BinSearchMode.NEAREST) {
            return binSearch_1.BinSearch.findNearest(searchValue, values, searchMode);
        }
        /**
         * Checks if the specified timestamp is with the available values
         *
         * @static
         * @param {number} timestamp
         * @param {number[]} timestamps
         * @returns {boolean}
         * @memberof SeriesHelper
         */
        static isInRange(timestamp, timestamps) {
            return timestamps.length > 0 && timestamp >= timestamps[0] && timestamp <= timestamps[timestamps.length - 1];
        }
        /**
         * Returns all necessary settings to create a new serie
         *
         * @static
         * @param {ISignal} signal
         * @param {string} signalName
         * @param {string} color
         * @param {string} id
         * @param {SeriesType} type
         * @param {(CalculationDataInfo|undefined)} calculationDataInfo
         * @param {Array<string>} [errorInfo=new Array<string>()]
         * @returns {ISettings}
         * @memberof SeriesHelper
         */
        static createSerieSettings(signal, signalName, color, id, type, calculationDataInfo, errorInfo = new Array()) {
            let serieType = SeriesHelper_1.getSerieTypeName(type);
            let settings = new settings_1.Settings(serieType, "1.1");
            let calculationDataInfoSettings = undefined;
            let signalDataSettings = undefined;
            if (calculationDataInfo == undefined) {
                signalDataSettings = signal.getSettings();
            }
            else {
                calculationDataInfoSettings = calculationDataInfo.getSettings();
            }
            settings.setValue(settingIds_1.SettingIds.SeriesId, id);
            settings.setValue(settingIds_1.SettingIds.SeriesName, signalName);
            settings.setValue(settingIds_1.SettingIds.SeriesColor, color);
            settings.setValue(settingIds_1.SettingIds.SeriesSignalData, signalDataSettings);
            settings.setValue(settingIds_1.SettingIds.SeriesCalculationData, calculationDataInfoSettings);
            settings.setValue(settingIds_1.SettingIds.SeriesErrorInfo, errorInfo);
            return settings;
        }
        static getSerieTypeName(type) {
            if (type == seriesType_1.SeriesType.timeSeries) {
                return "YTSeries";
            }
            else if (type == seriesType_1.SeriesType.xySeries) {
                return "XYSeries";
            }
            else {
                return "FFTSeries";
            }
        }
    };
    SeriesHelper = SeriesHelper_1 = __decorate([
        mco.role()
    ], SeriesHelper);
    exports.SeriesHelper = SeriesHelper;
});
