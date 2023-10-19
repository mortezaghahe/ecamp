var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../models/diagnostics/trace/traceDataPoint"], function (require, exports, traceDataPoint_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigDatapointsTreeGridCellEditEvents = void 0;
    let TraceConfigDatapointsTreeGridCellEditEvents = class TraceConfigDatapointsTreeGridCellEditEvents {
        /**
         * Start editing a cell
         *
         * @param {*} args
         * @memberof TraceConfigDatapointsTreeGridCellEditEvents
         */
        beginEdit(args) {
            // Only datapoint column can be edited (TODO: use column id instead of index)
            if (args.columnIndex != 0) {
                args.cancel = true;
            }
        }
        /**
         * End of editing a cell
         *
         * @param {*} args
         * @param {*} dataModel
         * @param {TraceDataPointInfo[]} availableTraceDataPoints
         * @returns
         * @memberof TraceConfigDatapointsTreeGridCellEditEvents
         */
        endEdit(args, dataModel, availableTraceDataPoints) {
            if (args.columnObject.field == "dataPointName") {
                // dataPointName has changed
                let tcDataPointsModel = dataModel;
                // Is datapoint already in datamodel
                if (tcDataPointsModel.dataPointAlreadyInList(args.value, args.rowIndex, false)) {
                    console.info("Datapoint already in list!");
                    args.cancel = true;
                    return;
                }
                // Found available datapoint for the given datapoint name    
                let dataPointInfo = availableTraceDataPoints.filter((datapoint) => { return datapoint.fullname == args.value; })[0];
                let dataPoint;
                if (dataPointInfo == undefined) {
                    dataPoint = traceDataPoint_1.TraceDataPoint.createSimpleDataPoint(args.value);
                }
                else {
                    dataPoint = traceDataPoint_1.TraceDataPoint.createWithDataPointInfo(dataPointInfo);
                }
                // Replace the current datapoint with the new one
                tcDataPointsModel.replaceDatapoint(args.rowIndex, dataPoint, false);
            }
        }
    };
    TraceConfigDatapointsTreeGridCellEditEvents = __decorate([
        mco.role()
    ], TraceConfigDatapointsTreeGridCellEditEvents);
    exports.TraceConfigDatapointsTreeGridCellEditEvents = TraceConfigDatapointsTreeGridCellEditEvents;
});
