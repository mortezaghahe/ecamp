var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var BinSearch_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinSearch = exports.BinSearchMode = void 0;
    var BinSearchMode;
    (function (BinSearchMode) {
        BinSearchMode[BinSearchMode["NEAREST"] = 0] = "NEAREST";
        BinSearchMode[BinSearchMode["PREVIOUSLOWER"] = 1] = "PREVIOUSLOWER";
        BinSearchMode[BinSearchMode["LOWERBOUND"] = 2] = "LOWERBOUND";
        BinSearchMode[BinSearchMode["NEXTUPPER"] = 3] = "NEXTUPPER";
        BinSearchMode[BinSearchMode["UPPERBOUND"] = 4] = "UPPERBOUND";
    })(BinSearchMode = exports.BinSearchMode || (exports.BinSearchMode = {}));
    /**
     * implements binary search.
     *
     * @export
     * @class BinSearch
     */
    let BinSearch = BinSearch_1 = class BinSearch {
        static findNearest(value, data, searchMode = BinSearchMode.NEAREST, iFrom = 0, iTo = 0) {
            const OUT_OF_RANGE = -1;
            if (data.length > 1) {
                // initialize start index
                if (iFrom === 0 && iTo === 0) {
                    iTo = data.length - 1;
                }
                // check if value is outside the range and return the matching limit value
                if (value < data[iFrom])
                    return iFrom;
                else if (value > data[iTo])
                    return iTo;
                if (iTo - iFrom > 1) {
                    // split and select range containing the value
                    return BinSearch_1.splitRange(iFrom, iTo, value, data, searchMode);
                }
                else {
                    // we now reached the last step and need to select the best matching value depending on the search mode
                    return BinSearch_1.selectNearestValue(iFrom, iTo, value, data, searchMode);
                }
            }
            else if (data.length === 1) {
                return 0;
            }
            else {
                return OUT_OF_RANGE;
            }
        }
        /**
         * splits the available range and selects the one containing the value
         *
         * @private
         * @static
         * @param {number} iFrom
         * @param {number} iTo
         * @param {number} value
         * @param {number[]} data
         * @param {BinSearchMode} searchMode
         * @returns
         * @memberof BinSearch
         */
        static splitRange(iFrom, iTo, value, data, searchMode) {
            // calculate the middle index
            const iMiddle = Math.floor((iFrom + iTo) / 2);
            // continue searching the upper range
            if (value > data[iMiddle]) {
                // continue searching within the upper range
                return this.findNearest(value, data, searchMode, iMiddle, iTo);
            }
            else {
                // continue seearching the lower range
                return this.findNearest(value, data, searchMode, iFrom, iMiddle);
            }
        }
        /**
         * determines the nearest value. The picked value depends on the search mode.
         *
         * @private
         * @static
         * @param {number} iFrom
         * @param {BinSearchMode} searchMode
         * @param {number} value
         * @param {number[]} data
         * @param {number} iTo
         * @returns
         * @memberof BinSearch
         */
        static selectNearestValue(iFrom, iTo, value, data, searchMode) {
            let foundIndex = iFrom;
            switch (searchMode) {
                case BinSearchMode.NEAREST:
                    // select the nearest index
                    foundIndex = Math.abs(value - data[iFrom]) <= Math.abs(value - data[iTo]) ? iFrom : iTo;
                    break;
                case BinSearchMode.PREVIOUSLOWER:
                    // select the next smaller smaller possible value
                    foundIndex = value > data[iFrom] ? iFrom : iFrom > 0 ? iFrom - 1 : iFrom;
                    break;
                case BinSearchMode.LOWERBOUND:
                    // select the next smaller smaller possible value
                    foundIndex = value < data[iTo] ? iFrom : iTo;
                    break;
                case BinSearchMode.NEXTUPPER:
                    // select the next greater possible value
                    foundIndex = value < data[iTo] ? iTo : iTo + 1 < data.length ? iTo + 1 : iTo;
                    break;
                case BinSearchMode.UPPERBOUND:
                    // select the next greater possible value
                    foundIndex = value > data[iFrom] ? iTo : iFrom;
                    break;
            }
            return foundIndex;
        }
        /**
         * Source: https://codereview.stackexchange.com/questions/39573/is-this-binary-search-in-typescript-correct
         *
         * Good case:
         *  Returns the array index of the match
         *
         * Precondition:
         *  The array has to be sorted in an ascending way
         *
         * Error handling:
         *  Returns -1 if there is no match
         *
         * @static
         * @template T
         * @param {T[]} xs
         * @param {T} x
         * @param {(p: T, q: T) => number} fnCmp
         * @returns {number}
         * @memberof BinSearch
         */
        static findExactMatch(xs, x, fnCmp) {
            var bot = 0;
            var top = xs.length;
            while (bot < top) { // If x is in xs, it's somewhere in xs[bot..top).
                var mid = Math.floor((bot + top) / 2);
                var c = fnCmp(xs[mid], x);
                if (c === 0)
                    return mid;
                if (c < 0)
                    bot = mid + 1;
                if (0 < c)
                    top = mid;
            }
            return -1;
        }
    };
    BinSearch = BinSearch_1 = __decorate([
        mco.role()
    ], BinSearch);
    exports.BinSearch = BinSearch;
});
