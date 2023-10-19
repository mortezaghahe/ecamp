var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./chartDataOptimizer", "./chartLabelCache", "./chartRenderOptimizer"], function (require, exports, chartDataOptimizer_1, chartLabelCache_1, chartRenderOptimizer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartExtensions = void 0;
    /**
     * Implements chart extensions and optimizations
     *
     * @class ChartExtensions
     */
    let ChartExtensions = class ChartExtensions {
        /**
         * Creates an instance of ChartExtensions.
         * @memberof ChartExtensions
         */
        constructor(seriesProvider) {
            this._chartDataOptimizer = new chartDataOptimizer_1.ChartDataOptimizer(seriesProvider);
            this._chartLabelCache = new chartLabelCache_1.ChartLabelCache();
            this._chartRenderOptimizer = new chartRenderOptimizer_1.ChartRenderOptimizer();
        }
        /**
         * Gets the chart data optimizer
         *
         * @readonly
         * @type {ChartDataOptimizer}
         * @memberof ChartExtensions
         */
        get chartDataOptimizer() {
            return this._chartDataOptimizer;
        }
        /**
         * Gets the chart label cache
         *
         * @readonly
         * @type {ChartLabelCache}
         * @memberof ChartExtensions
         */
        get chartLabelCache() {
            return this._chartLabelCache;
        }
        /**
         * Gets the chart render optimizer
         *
         * @readonly
         * @type {ChartRenderOptimizer}
         * @memberof ChartExtensions
         */
        get chartRenderOptimizer() {
            return this._chartRenderOptimizer;
        }
    };
    ChartExtensions = __decorate([
        mco.role()
    ], ChartExtensions);
    exports.ChartExtensions = ChartExtensions;
});
