var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ColorHelper = void 0;
    let ColorHelper = class ColorHelper {
        /**
         * Every call returns the next color from the given colorScheme (at the end of the colorScheme return to start of colorScheme)
         *
         * @static
         * @returns {string}
         * @memberof ColorHelper
         */
        static getColor() {
            if (this._newColorIndex >= this._colorsScheme.length)
                this._newColorIndex = 0;
            var color = this._colorsScheme[this._newColorIndex];
            this._newColorIndex++;
            return color;
        }
    };
    ColorHelper._newColorIndex = 0;
    ColorHelper._colorsScheme = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
        '#008080', '#e6beff', '#9a6324', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#000000'];
    ColorHelper = __decorate([
        mco.role()
    ], ColorHelper);
    exports.ColorHelper = ColorHelper;
});
