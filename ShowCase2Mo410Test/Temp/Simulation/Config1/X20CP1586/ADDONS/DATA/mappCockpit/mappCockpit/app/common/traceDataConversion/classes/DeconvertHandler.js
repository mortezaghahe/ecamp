var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./CsvHandler", "../exceptions/traceDataConversionError", "../enums/traceDataConversionErrorTypes", "../../../core/types/point", "../../../core/types/frequencyAmplitude", "../../../core/types/sample", "./ytSignal"], function (require, exports, CsvHandler_1, traceDataConversionError_1, traceDataConversionErrorTypes_1, point_1, frequencyAmplitude_1, sample_1, ytSignal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DeconvertHandler = void 0;
    /**
     * Handles deconvertion of a partial file.
     *
     * @class DeconvertHandler
     * @implements {IDeconvertHandler}
     */
    let DeconvertHandler = class DeconvertHandler {
        /**
         * Handles deconvertion based on fileending of IPartialFile.
         * Can throw TraceDataConversionError.
         *
         * @param {IPartialFile} partialFile
         * @returns {IRecording[]}
         * @memberof DeconvertHandler
         */
        Deconvert(partialFile) {
            let deconverter;
            let result;
            switch (partialFile.fileending.toLowerCase()) {
                case "csv":
                    //assumed csv type is either AsCsv or CoTraceCsv
                    //analyzing csv string to pick deconverter
                    let deconvertCsvHandler = new CsvHandler_1.CsvHandler();
                    try {
                        deconverter = deconvertCsvHandler.pickDeconverter(partialFile.data);
                    }
                    catch (err) {
                        throw traceDataConversionError_1.TraceDataConversionError.isTraceDataConversionError(err) ? err : traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.INTERNAL, err);
                    }
                    break;
                default:
                    throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.WRONG_FILETYPE);
            }
            try {
                result = deconverter.Deconvert(partialFile.data);
                this.validateRecording(result);
            }
            catch (err) {
                throw traceDataConversionError_1.TraceDataConversionError.isTraceDataConversionError(err) ? err : traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.INTERNAL, err);
            }
            return result;
        }
        /**
         * Checks if Recording contains only valid data points.
         * If invalid (NaN) data point is found it throws a TraceDataConversionError.
         *
         * @private
         * @param {IRecording[]} recording
         * @memberof DeconvertHandler
         */
        validateRecording(recording) {
            recording.forEach((record) => {
                record.signals.forEach((signal) => {
                    signal.items.forEach((item) => {
                        let val1 = NaN;
                        let val2 = NaN;
                        if (item instanceof sample_1.Sample) {
                            val1 = item.t;
                            val2 = item.y;
                        }
                        if (item instanceof point_1.Point) {
                            val1 = item.x;
                            val2 = item.y;
                        }
                        if (item instanceof frequencyAmplitude_1.FrequencyAmplitude) {
                            val1 = item.f;
                            val2 = item.a;
                        }
                        if (Number.isNaN(val1) || Number.isNaN(val2)) {
                            throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.INVALID_RECORDING);
                        }
                    });
                    if (signal instanceof ytSignal_1.YTSignal) {
                        let isTimeStrictlyMonotonicallyIncreasing = signal.items.every((point, index, items) => {
                            return (index !== 0) ? point.t > items[index - 1].t : true;
                        });
                        if (!isTimeStrictlyMonotonicallyIncreasing) {
                            throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.TIME_NOT_STRICTLY_MONOTONICALLY_INCREASING, signal.name);
                        }
                    }
                });
            });
        }
    };
    DeconvertHandler = __decorate([
        mco.role()
    ], DeconvertHandler);
    exports.DeconvertHandler = DeconvertHandler;
});
