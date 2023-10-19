var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartViewSerie = void 0;
    let ChartViewSeries = class ChartViewSeries {
        constructor(serie, scale) {
            this.serie = serie;
        }
        get id() {
            return this.serie.id;
        }
        get minY() {
            return this.serie.minY;
        }
        set minY(value) {
            this.serie.minY = value;
        }
        get maxY() {
            return this.serie.maxY;
        }
        set maxY(value) {
            this.serie.maxY = value;
        }
        get minX() {
            return this.serie.minX;
        }
        set minX(value) {
            this.serie.minX = value;
        }
        get maxX() {
            return this.serie.maxX;
        }
        set maxX(value) {
            this.serie.maxX = value;
        }
        get rawPoints() {
            return this.serie.rawPoints;
        }
        set rawPoints(value) {
            this.serie.rawPoints = value;
        }
        get color() {
            return this.serie.color;
        }
        set color(value) {
            this.serie.color = value;
        }
        get calculationDataInfo() {
            return this.serie.calculationDataInfo;
        }
        set calculationDataInfo(value) {
            this.serie.calculationDataInfo = value;
        }
    };
    ChartViewSeries = __decorate([
        mco.role()
    ], ChartViewSeries);
    exports.ChartViewSerie = ChartViewSeries;
});
