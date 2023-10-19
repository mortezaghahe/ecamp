define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesType = void 0;
    var SeriesType;
    (function (SeriesType) {
        SeriesType[SeriesType["timeSeries"] = 0] = "timeSeries";
        SeriesType[SeriesType["xySeries"] = 1] = "xySeries";
        SeriesType[SeriesType["fftSeries"] = 2] = "fftSeries";
    })(SeriesType = exports.SeriesType || (exports.SeriesType = {}));
});
