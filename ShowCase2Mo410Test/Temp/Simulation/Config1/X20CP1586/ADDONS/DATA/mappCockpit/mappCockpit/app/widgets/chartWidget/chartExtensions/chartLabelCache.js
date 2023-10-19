var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartLabelCache = void 0;
    /**
     * Implements caching for chart label text sizes ....
     *
     * @class ChartLabelCache
     */
    let ChartLabelCache = class ChartLabelCache {
        constructor() {
            // holds the text size cache
            this._textSizeCache = {};
        }
        /**
         * Gets the text size for the requested text and font
         *
         * @param {*} text
         * @param {*} maxwidth
         * @param {*} font
         * @memberof ChartLabelCache
         */
        getTextSize(text, maxwidth, font) {
            if (!this._textSizeCache) {
                this._textSizeCache = {};
            }
            else {
                if (this._textSizeCache[font.fontFamily]) {
                    if (this._textSizeCache[font.fontFamily][font.size]) {
                        if (this._textSizeCache[font.fontFamily][font.size][text.length]) {
                            let cachedTextBounds = this._textSizeCache[font.fontFamily][font.size][text.length].bounds;
                            return cachedTextBounds;
                        }
                    }
                }
            }
        }
        /**
         * Caches the text size for the specefied text and font
         *
         * @param {*} text
         * @param {*} maxwidth
         * @param {*} font
         * @memberof ChartLabelCache
         */
        cacheTextSize(text, maxwidth, font, bounds) {
            if (!this._textSizeCache[font.fontFamily]) {
                this._textSizeCache[font.fontFamily] = { fontFamily: font.fontFamily };
            }
            if (!this._textSizeCache[font.fontFamily][font.size]) {
                this._textSizeCache[font.fontFamily][font.size] = { fontSize: font.size };
            }
            if (!this._textSizeCache[font.fontFamily][font.size][text.length]) {
                // reserver some additional space in width because the cache just uses the text length
                bounds.width = bounds.width * 1.2;
                // store the bounds with the text lenght as key. Keep in mind that this not strictly exact because different text content with the same length could result in different text bounds !
                this._textSizeCache[font.fontFamily][font.size][text.length] = { bounds: bounds };
            }
        }
    };
    ChartLabelCache = __decorate([
        mco.role()
    ], ChartLabelCache);
    exports.ChartLabelCache = ChartLabelCache;
});
