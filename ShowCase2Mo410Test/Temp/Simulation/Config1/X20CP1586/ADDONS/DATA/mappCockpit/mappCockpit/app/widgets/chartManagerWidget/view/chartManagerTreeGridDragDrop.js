var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../models/chartManagerDataModel/chartManagerChart", "../../../models/common/series/baseSeries", "../../../models/chartManagerDataModel/scale"], function (require, exports, chartManagerChart_1, baseSeries_1, scale_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartManagerTreeGridDragDrop = void 0;
    let ChartManagerTreeGridDragDrop = class ChartManagerTreeGridDragDrop {
        /**
         * Sets the variable '_dragStartChartItem' when a drag operation is started
         *
         * @param {*} args
         * @memberof ChartManagerTreeGridDragDrop
         */
        rowDragStart(args) {
            if (args.draggedRow.parentItem != undefined) {
                if (args.draggedRow.level == 2) {
                    this._dragStartChartItem = args.draggedRow.parentItem.parentItem.item;
                }
            }
            else if (args.draggedRow.level == 1) {
                this._dragStartChartItem = args.draggedRow.parentItem.item;
            }
            else if (args.draggedRow.level == 0) {
                this._dragStartChartItem = args.draggedRow.item;
            }
        }
        /**
         * Checks if drop is possible when dragging
         *
         * @param {*} args
         * @memberof ChartManagerTreeGridDragDrop
         */
        rowDrag(args) {
            if (args.draggedRow.item instanceof chartManagerChart_1.ChartManagerChart) {
                this.canDropChart(args);
            }
            else if (args.draggedRow.item instanceof scale_1.Scale) {
                this.canDropYAxis(args);
            }
            else if (args.draggedRow.item instanceof baseSeries_1.BaseSeries) {
                this.canDropSerie(args);
            }
        }
        /**
         * Checks if chart can be dropped
         *
         * @private
         * @param {*} args
         * @memberof ChartManagerTreeGridDragDrop
         */
        canDropChart(args) {
            if ((args.dropPosition == "insertAbove" || args.dropPosition == "insertBelow") && args.targetRow.level == 0) {
            }
            else {
                args.canDrop = false;
            }
        }
        /**
         * Checks if Scale can be dropped
         *
         * @private
         * @param {*} args
         * @memberof ChartManagerTreeGridDragDrop
         */
        canDropYAxis(args) {
            // Drag & Drop of YAxis not allowed
            args.canDrop = false;
        }
        /**
         * Checks if Serie can be dropped
         *
         * @private
         * @param {*} args
         * @memberof ChartManagerTreeGridDragDrop
         */
        canDropSerie(args) {
            if ((args.dropPosition == "insertAbove" || args.dropPosition == "insertBelow") && args.targetRow.level == 2
                || (args.dropPosition == "insertAsChild" && (args.targetRow.level == 1 || args.targetRow.level == 0))) {
                let targetAxis = this.getTargetAxisFromTragetRow(args.targetRow);
                let targetChart = this.getTargetChartFromTargetRow(args.targetRow);
                if (targetChart != undefined && args.draggedRow.type !== chartManagerChart_1.ChartType.XYChart) {
                    this.canDropNotXYSerie(args, targetAxis, targetChart);
                }
                else if (targetChart != undefined) {
                    this.canDropXYSerie(args, targetAxis, targetChart);
                }
            }
            else {
                args.canDrop = false;
            }
        }
        /**
         * Checks if YT or FFT serie can be dropped
         *
         * @private
         * @param {*} args
         * @param {(Scale | undefined)} targetAxis
         * @param {IChartManagerChart} targetChart
         * @memberof ChartManagerTreeGridDragDrop
         */
        canDropNotXYSerie(args, targetAxis, targetChart) {
            let sourceChart = args.draggedRow.parentItem.parentItem.item;
            let sourceAxis = args.draggedRow.parentItem.item;
            let serie = args.draggedRow.item;
            let series = new Array();
            series.push(serie);
            if (targetAxis == sourceAxis) { // Avoid moving of series within an axis
                args.canDrop = false;
            }
            else if (args.draggedRow.parentItem.parentItem.chartType !== targetChart.chartType ||
                (targetChart != sourceChart && targetChart.hasSeries(series))) {
                args.canDrop = false;
            }
            else if (args.targetRow.level == 0) {
                // Check if a new axis can be added (drag and drop of a serie to a chart)
                if (!targetChart.canAddYAxis()) {
                    args.canDrop = false;
                }
            }
        }
        /**
         * Checks if XY serie can be dropped
         *
         * @private
         * @param {*} args
         * @param {(Scale | undefined)} targetAxis
         * @param {IChartManagerChart} targetChart
         * @memberof ChartManagerTreeGridDragDrop
         */
        canDropXYSerie(args, targetAxis, targetChart) {
            let sourceChart = args.draggedRow.parentItem.parentItem.item;
            let sourceAxis = args.draggedRow.parentItem.item;
            let serie = args.draggedRow.item;
            let series = new Array();
            series.push(serie);
            if (targetAxis == sourceAxis || sourceChart == targetChart) { // Avoid moving of series within same axis
                args.canDrop = false;
            }
            else if (args.draggedRow.parentItem.parentItem.chartType !== targetChart.chartType ||
                (targetChart != sourceChart && targetChart.hasSeries(series))) {
                args.canDrop = false;
            }
        }
        /**
         * Triggered when drop action is done
         *
         * @param {*} args
         * @param {IChartManagerDataModel} dataModel
         * @memberof ChartManagerTreeGridDragDrop
         */
        rowDropActionBegin(args, dataModel) {
            let dropPosition = args.dropPosition;
            if ((dropPosition == "insertAbove" || dropPosition == "insertBelow") && args.targetRow.level == 2
                || (dropPosition == "insertAsChild" && (args.targetRow.level == 1 || args.targetRow.level == 0))) {
                let targetAxis = this.getTargetAxisFromTragetRow(args.targetRow);
                let targetChart = this.getTargetChartFromTargetRow(args.targetRow);
                if (args.draggedRow.type !== chartManagerChart_1.ChartType.XYChart) {
                    this.NotXYrowDropAction(args, dataModel, targetAxis, targetChart);
                }
                else {
                    this.XYrowDropAction(args, dataModel, targetAxis, targetChart);
                }
            }
        }
        /**
         * Drop YT or FFT serie into the target chart
         *
         * @private
         * @param {*} args
         * @param {IChartManagerDataModel} dataModel
         * @param {(Scale | undefined)} targetAxis
         * @param {(IChartManagerChart | undefined)} targetChart
         * @memberof ChartManagerTreeGridDragDrop
         */
        NotXYrowDropAction(args, dataModel, targetAxis, targetChart) {
            if (targetAxis == undefined) {
                // Handle drag of serie to chart
                let sourceChart = this._dragStartChartItem;
                if (sourceChart != undefined) {
                    let serie = args.draggedRow.item;
                    let series = new Array();
                    series.push(serie);
                    // Remove serie from source chart
                    dataModel.removeSerie(sourceChart, serie);
                    // Create new axis and add serie to target chart
                    let axisName = targetChart.getNextYAxisId();
                    let yAxis = new scale_1.Scale(axisName, targetChart);
                    dataModel.addYScale(targetChart, yAxis);
                    dataModel.addSeriesToChart(targetChart, series, yAxis);
                }
                args.cancel = true;
            }
        }
        /**
         * Drop XY serie into the target chart
         *
         * @private
         * @param {*} args
         * @param {IChartManagerDataModel} dataModel
         * @param {(Scale | undefined)} targetScale
         * @param {(IChartManagerChart | undefined)} targetChart
         * @memberof ChartManagerTreeGridDragDrop
         */
        XYrowDropAction(args, dataModel, targetScale, targetChart) {
            if (targetScale == undefined) {
                // Handle drag of serie to chart
                let sourceChart = this._dragStartChartItem;
                if (sourceChart != undefined) {
                    let serie = args.draggedRow.item;
                    let series = new Array();
                    series.push(serie);
                    // Remove serie from source chart
                    dataModel.removeSerie(sourceChart, serie);
                    // Add serie to target chart
                    let scaleName = targetChart.getDefaultYAxisId();
                    let yScale = targetChart.getYScale(scaleName);
                    dataModel.addSeriesToChart(targetChart, series, yScale);
                }
                args.cancel = true;
            }
        }
        /**
         * Get target chart from row
         *
         * @private
         * @param {*} targetRow
         * @returns {(IChartManagerChart | undefined)}
         * @memberof ChartManagerTreeGridDragDrop
         */
        getTargetChartFromTargetRow(targetRow) {
            if (targetRow.level == 2) {
                return targetRow.parentItem.parentItem.item;
            }
            else if (targetRow.level == 1) {
                return targetRow.parentItem.item;
            }
            else if (targetRow.level == 0) {
                return targetRow.item;
            }
            return undefined;
        }
        /**
         * Get target axis from row
         *
         * @private
         * @param {*} targetRow
         * @returns {(Scale | undefined)}
         * @memberof ChartManagerTreeGridDragDrop
         */
        getTargetAxisFromTragetRow(targetRow) {
            if (targetRow.level == 2) {
                return targetRow.parentItem.item;
            }
            else if (targetRow.level == 1) {
                return targetRow.item;
            }
            else if (targetRow.level == 0) {
            }
            return undefined;
        }
        /**
         * Triggered when drag operation is finished
         *
         * @param {*} args
         * @param {IChartManagerDataModel} dataModel
         * @memberof ChartManagerTreeGridDragDrop
         */
        rowDragStop(args, dataModel) {
            if (args.draggedRow.item instanceof chartManagerChart_1.ChartManagerChart) {
                this.dropChart(args, dataModel, args.requestType);
            }
            if (args.draggedRow.item instanceof baseSeries_1.BaseSeries) {
                this.dropSerie(args, dataModel, args.requestType);
            }
        }
        /**
         * Drop chart to selected position
         *
         * @private
         * @param {*} args
         * @param {IChartManagerDataModel} dataModel
         * @param {*} dropPosition
         * @memberof ChartManagerTreeGridDragDrop
         */
        dropChart(args, dataModel, dropPosition) {
            if ((dropPosition == "insertAbove" || dropPosition == "insertBelow") && args.targetRow.level == 0) {
                dataModel.moveChart(args.draggedRow.item, args.targetRow.item, dropPosition);
            }
            else {
                args.cancel = true;
            }
        }
        /**
         * Drop serie to selected chart/scale
         *
         * @private
         * @param {*} args
         * @param {*} dataModel
         * @param {*} dropPosition
         * @memberof ChartManagerTreeGridDragDrop
         */
        dropSerie(args, dataModel, dropPosition) {
            if ((dropPosition == "insertAbove" || dropPosition == "insertBelow") && args.targetRow.level == 2
                || (dropPosition == "insertAsChild" && (args.targetRow.level == 1 || args.targetRow.level == 0))) {
                let sourceChart = this._dragStartChartItem;
                let sourceAxis = args.draggedRow.parentItem.item;
                let serie = args.draggedRow.item;
                let targetAxis = this.getTargetAxisFromTragetRow(args.targetRow);
                let targetChart = this.getTargetChartFromTargetRow(args.targetRow);
                dataModel.moveSerie(sourceChart, sourceAxis, serie, targetChart, targetAxis, dropPosition);
            }
            else {
                args.cancel = true;
            }
        }
    };
    ChartManagerTreeGridDragDrop = __decorate([
        mco.role()
    ], ChartManagerTreeGridDragDrop);
    exports.ChartManagerTreeGridDragDrop = ChartManagerTreeGridDragDrop;
});
