var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartManagerData = void 0;
    let ChartManagerData = class ChartManagerData {
        constructor() {
            this.childs = new Array();
        }
        /**
         *  Adds a chart
         *
         * @param {IChartManagerChart} chart
         * @memberof ChartManagerData
         */
        addChart(chart, index) {
            if (index == -1 || index >= this.childs.length) {
                this.childs.push(chart);
            }
            else {
                this.childs.splice(index, 0, chart);
            }
        }
        /**
         *  Removes a chart
         *
         * @param {IChartManagerChart} chart
         * @memberof ChartManagerData
         */
        removeChart(chart) {
            const index = this.childs.indexOf(chart, 0);
            if (index > -1) {
                this.childs.splice(index, 1);
            }
        }
        /**
         * Moves a chart
         *
         * @param {IChartManagerChart} chart
         * @param {IChartManagerChart} targetChart
         * @param {string} insertType e.g. "insertAbove" or "insertBelow"
         * @memberof ChartManagerData
         */
        moveChart(chart, targetChart, insertType) {
            const fromIndex = this.childs.indexOf(chart);
            var toIndex;
            this.childs.forEach(chart => {
                if (chart.name == targetChart.name) {
                    toIndex = this.childs.indexOf(chart);
                }
            });
            if (insertType == "insertAbove") {
            }
            if (insertType == "insertBelow") {
                toIndex += 1;
            }
            // Adjust index if moving downwards
            if (fromIndex < toIndex)
                toIndex--;
            this.arraymove(this.childs, fromIndex, toIndex);
        }
        arraymove(arr, fromIndex, toIndex) {
            var element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
        }
    };
    ChartManagerData = __decorate([
        mco.role()
    ], ChartManagerData);
    exports.ChartManagerData = ChartManagerData;
});
