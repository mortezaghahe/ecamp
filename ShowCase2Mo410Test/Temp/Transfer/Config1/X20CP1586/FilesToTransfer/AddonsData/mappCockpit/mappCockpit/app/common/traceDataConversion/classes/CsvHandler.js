var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./deconverterCoTraceCsv", "./deconverterASCsv", "../exceptions/traceDataConversionError", "../enums/traceDataConversionErrorTypes"], function (require, exports, deconverterCoTraceCsv_1, deconverterASCsv_1, traceDataConversionError_1, traceDataConversionErrorTypes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CsvHandler = void 0;
    /**
     * Handles the decision of which deconverter to use on a csv string.
     *
     * @class CsvHandler
     */
    let CsvHandler = class CsvHandler {
        /**
         * Analyzes csv string to pick correct csv deconverter and deconverts with it.
         * Can throw TraceDataConversionError.
         *
         * @param {string} csv
         * @returns {IRecording[]}
         * @memberof CsvHandler
         */
        pickDeconverter(csv) {
            let deconverter;
            deconverter = this.chooseCsvDeconverter(csv);
            if (deconverter != null) {
                return deconverter;
            }
            throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.UNKNOWN_FORMAT);
        }
        /**
         * Returns associated Deconverter based on characteristics of csv string or null if no characteristics are met.
         *
         * @private
         * @param {string} csv
         * @returns {(IDeconverter | null)}
         * @memberof CsvHandler
         */
        chooseCsvDeconverter(csv) {
            let deconverter = null;
            //assuming csv string to be a CoTraceCsv if it contains appropriate headerline
            //<start of line>EpochTimestamp<column seperator>SiosTimeUsec<column seperator>RelativeTime
            if (csv.search(/^EpochTimestamp.SiosTimeUsec.RelativeTime/m) >= 0) {
                deconverter = new deconverterCoTraceCsv_1.DeconverterCoTraceCsv();
            }
            //assuming csv string to be a AsCsv if it contains appropriate part of headerline
            //<start of line>% TYPE=CHART-DATA-ASCII V=2<comma seperator>0
            if (csv.search(/^%\ TYPE=CHART-DATA-ASCII\ V=2.0/m) >= 0) {
                deconverter = new deconverterASCsv_1.DeconverterASCsv();
            }
            return deconverter;
        }
    };
    CsvHandler = __decorate([
        mco.role()
    ], CsvHandler);
    exports.CsvHandler = CsvHandler;
});
