var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../models/common/series/seriesType"], function (require, exports, seriesType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorTypeHelper = exports.CursorType = void 0;
    var CursorType;
    (function (CursorType) {
        CursorType[CursorType["timeDomain"] = 0] = "timeDomain";
        CursorType[CursorType["frequencyDomain"] = 1] = "frequencyDomain";
    })(CursorType = exports.CursorType || (exports.CursorType = {}));
    let CursorTypeHelper = class CursorTypeHelper {
        /**
         * Returns the cursorType for the given series(frequencyDomain for fftSeries, else timeDomain)
         *
         * @private
         * @param {BaseSeries} series
         * @returns {CursorType}
         * @memberof CursorTypeHelper
         */
        static getCursorTypeForSeries(series) {
            if (series.type == seriesType_1.SeriesType.fftSeries) {
                return CursorType.frequencyDomain;
            }
            return CursorType.timeDomain;
        }
    };
    CursorTypeHelper = __decorate([
        mco.role()
    ], CursorTypeHelper);
    exports.CursorTypeHelper = CursorTypeHelper;
});
