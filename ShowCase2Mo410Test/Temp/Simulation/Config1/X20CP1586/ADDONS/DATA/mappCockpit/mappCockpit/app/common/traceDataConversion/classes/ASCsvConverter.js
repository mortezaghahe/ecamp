var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../enums/ConvertTypes", "./ASCsvHeader", "./CsvDataRow", "./PartialFile", "../exceptions/traceDataConversionError", "../enums/traceDataConversionErrorTypes"], function (require, exports, ConvertTypes_1, ASCsvHeader_1, CsvDataRow_1, PartialFile_1, traceDataConversionError_1, traceDataConversionErrorTypes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ASCsvConverter = void 0;
    /**
     * Converts IASCsvSignals to a ASCsv formatted string
     *
     * @class ASCsvConverter
     */
    let ASCsvConverter = class ASCsvConverter {
        /**
         * Converts the given data into the given AS CSV format.
         * Can throw TraceDataConversionError.
         *
         * @param {Array<IASCsvSignal>} signals
         * @param {ConvertTypes} type
         * @returns {IPartialFile}
         * @memberof ASCsvConverterV2
         */
        convert(signals, type) {
            let comsep = "";
            let colsep = "";
            switch (type) {
                case ConvertTypes_1.ConvertTypes.CSV_AS_DE:
                    comsep = ",";
                    colsep = ";";
                    break;
                case ConvertTypes_1.ConvertTypes.CSV_AS_EN:
                    comsep = ".";
                    colsep = ",";
                    break;
                default:
                    throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.WRONG_FORMAT);
            }
            let headerRows = this.createHeaderRows(signals, comsep, colsep);
            let dataMatrix = this.createDataMatrix(signals);
            let dataRows = this.createDataRows(dataMatrix, colsep, comsep);
            let csv = this.joinRows(headerRows, dataRows);
            return this.buildPartialFile(csv);
        }
        /**
         * Creates the header rows.
         * Each headerrow is terminated with the value of member linebreakstring.
         *
         * @private
         * @param {Array<IASCsvHeader>} headers
         * @param {string} comsep
         * @param {string} colsep
         * @returns {Array<string>}
         * @memberof ASCsvConverterV2
         */
        createHeaderRows(headers, comsep, colsep) {
            let headerRows = new Array();
            for (let index = 0; index < headers.length; index++) {
                let header = ASCsvHeader_1.ASCsvHeader.buildASCsvHeaderFromInterface(headers[index]);
                let headerStr = header.stringifyASCsvHeader(comsep, colsep);
                headerRows.push(headerStr);
            }
            return headerRows;
        }
        /**
         * Reads the csv data into a matrix representing the csv string structure.
         * Can throw TraceDataConversionError.
         *
         * @private
         * @param {Array<IASCsvData>} data
         * @returns {Array<Array<number>>}
         * @memberof ASCsvConverterV2
         */
        createDataMatrix(data) {
            if (data.length < 1) {
                throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.NO_DATA);
            }
            let maxNrSamples = this.getmaxNrSamplesPerSignals(data);
            let dataMatrix = new Array();
            for (let rowIndex = 0; rowIndex < maxNrSamples; rowIndex++) {
                let row = new Array();
                for (let columnIndex = 0; columnIndex < data.length; columnIndex++) {
                    if (data[columnIndex].data.length > rowIndex) {
                        row.push(data[columnIndex].data[rowIndex].value1);
                        row.push(data[columnIndex].data[rowIndex].value2);
                    }
                    else {
                        row.push(NaN);
                        row.push(NaN);
                    }
                }
                dataMatrix.push(row);
            }
            return dataMatrix;
        }
        /**
         * Returns the maximum number of value pairs of any signal within the array.
         *
         * @private
         * @param {Array<IASCsvData>} data
         * @returns {number}
         * @memberof ASCsvConverterV2
         */
        getmaxNrSamplesPerSignals(data) {
            let maxNrSamplesPerSignals = 0;
            data.forEach(signal => {
                maxNrSamplesPerSignals = Math.max(maxNrSamplesPerSignals, signal.data.length);
            });
            return maxNrSamplesPerSignals;
        }
        /**
         * Stringifies data rows out of the data matrix.
         *
         * @private
         * @param {Array<Array<number>>} dataMatrix
         * @param {string} colsep
         * @param {string} comsep
         * @returns {Array<string>}
         * @memberof ASCsvConverterV2
         */
        createDataRows(dataMatrix, colsep, comsep) {
            let dataRows = new Array();
            for (let rowIndex = 0; rowIndex < dataMatrix.length; rowIndex++) {
                let row = CsvDataRow_1.CsvDataRow.writeDataRow(dataMatrix[rowIndex], colsep, comsep, true);
                dataRows.push(row);
            }
            return dataRows;
        }
        /**
         * Joins header and data rows to one string representing the ASCsv.
         *
         * @private
         * @param {Array<string>} headerRows
         * @param {Array<string>} dataRows
         * @returns {string}
         * @memberof ASCsvConverterV2
         */
        joinRows(headerRows, dataRows) {
            let csv = "";
            csv += headerRows.join("");
            csv += dataRows.join(ASCsvHeader_1.ASCsvHeader.linebreakString);
            return csv;
        }
        /**
         * Builds a partial file out of the csv string.
         *
         * @private
         * @param {string} csv
         * @returns {IPartialFile}
         * @memberof ASCsvConverterV2
         */
        buildPartialFile(csv) {
            let partialFile = new PartialFile_1.PartialFile();
            partialFile.fileending = "csv";
            partialFile.data = csv;
            return partialFile;
        }
    };
    ASCsvConverter = __decorate([
        mco.role()
    ], ASCsvConverter);
    exports.ASCsvConverter = ASCsvConverter;
});
