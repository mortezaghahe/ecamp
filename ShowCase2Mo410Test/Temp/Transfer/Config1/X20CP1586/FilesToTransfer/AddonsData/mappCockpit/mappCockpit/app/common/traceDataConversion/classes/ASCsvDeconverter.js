var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./ASCsvSignalObj", "./CsvDataRow", "./ASCsvHeader", "../enums/traceDataConversionErrorTypes", "../exceptions/traceDataConversionError", "../../../core/types/valuePair"], function (require, exports, ASCsvSignalObj_1, CsvDataRow_1, ASCsvHeader_1, traceDataConversionErrorTypes_1, traceDataConversionError_1, valuePair_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ASCsvDeconverter = void 0;
    /**
     * Deconverts an AS CSV string to an array of IASCsvSignal.
     *
     * @class ASCsvDeconverter
     */
    let ASCsvDeconverter = class ASCsvDeconverter {
        /**
         * Deconverts an ASCsv formatted csv string into an array of IASCsvSignal.
         * Can throw TraceDataConversionError.
         *
         * @param {string} csvString
         * @returns {Array<IASCsvSignal>}
         * @memberof ASCsvDeconverter
         */
        deconvert(csvString) {
            let backupDate = new Date();
            let colsep = ASCsvHeader_1.ASCsvHeader.tryGetColumnSeperator(csvString);
            let comsep = ASCsvHeader_1.ASCsvHeader.getCommaSeperatorToColumnSeperator(colsep);
            let csvParts = this.devideCsvInParts(csvString, colsep, comsep);
            let headers = this.processHeaderPart(csvParts.headerRows, backupDate);
            let data = this.processDataPart(csvParts.dataRows, colsep, comsep);
            this.verifyDataMatrix(data, headers.length);
            let signals = this.buildSignals(headers, data);
            return signals;
        }
        /**
         * Splits the csv string into header and data part.
         *
         * @private
         * @param {string} csvString
         * @param {string} colsep
         * @param {string} comsep
         * @returns {Array<Array<string>>}
         * @memberof ASCsvDeconverter
         */
        devideCsvInParts(csvString, colsep, comsep) {
            let parts = {
                headerRows: new Array(),
                dataRows: new Array()
            };
            let rows = csvString.split('\n');
            for (let i = 0; i < rows.length; i++) {
                if ((rows[i].search(/%/) !== -1)) {
                    parts.headerRows.push(rows[i]);
                }
                else {
                    parts.dataRows.push(rows[i]);
                }
            }
            return parts;
        }
        /**
         * Builds IASCsvHeaders out of the header rows.
         *
         * @private
         * @param {Array<string>} headerPart
         * @param {Date} backupDate
         * @returns {Array<IASCsvHeader>}
         * @memberof ASCsvDeconverter
         */
        processHeaderPart(headerPart, backupDate) {
            let headers = new Array();
            for (let i = 0; i < headerPart.length; i++) {
                let header = ASCsvHeader_1.ASCsvHeader.buildASCsvHeaderFromString(headerPart[i], backupDate);
                headers.push(header);
            }
            return headers;
        }
        /**
         * Builds a data matrix out of the data rows.
         *
         * @private
         * @param {Array<string>} dataPart
         * @param {string} colsep
         * @param {string} comsep
         * @returns {Array<Array<number>>}
         * @memberof ASCsvDeconverter
         */
        processDataPart(dataPart, colsep, comsep) {
            let data = new Array();
            for (let i = 0; i < dataPart.length; i++) {
                if (dataPart[i] !== '') {
                    let values = CsvDataRow_1.CsvDataRow.readDataRow(dataPart[i], colsep, comsep);
                    data.push(values);
                }
            }
            return data;
        }
        /**
         * Builds IASCsvSignals from IASCsvHeaders and value pair arrays.
         *
         * @private
         * @param {Array<IASCsvHeader>} headers
         * @param {Array<Array<number>>} values
         * @returns {Array<IASCsvSignal>}
         * @memberof ASCsvDeconverter
         */
        buildSignals(headers, values) {
            let signals = new Array();
            let data = this.resolveValueMatrix(values, headers.length);
            for (let i = 0; i < headers.length; i++) {
                let signal = ASCsvSignalObj_1.ASCsvSignalObj.buildASCsvSignalObj(headers[i], data[i]);
                signals.push(signal);
            }
            return signals;
        }
        /**
         * Resolves the number matrix into value pair arrays.
         *
         * @private
         * @param {Array<Array<number>>} matrix
         * @param {number} numberOfSignals
         * @returns {Array<Array<IPoint>>}
         * @memberof ASCsvDeconverter
         */
        resolveValueMatrix(matrix, numberOfSignals) {
            let sortedData = new Array();
            for (let i = 0; i < numberOfSignals; i++) {
                let arr = new Array();
                sortedData.push(arr);
            }
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length - 1; j += 2) {
                    let value1 = matrix[i][j];
                    let value2 = matrix[i][j + 1];
                    if ((value1 == value1) && (value2 == value2)) {
                        let valuePair = new valuePair_1.ValuePair(value1, value2);
                        sortedData[j / 2].push(valuePair);
                    }
                }
            }
            return sortedData;
        }
        /**
         * Verifies that the data matrix has two columns per signal.
         * Does not trigger exception when there is one additional column because this can happen when there is a colsep at the end of a data row.
         * Can throw TraceDataConversionError.
         *
         * @private
         * @param {number[][]} data
         * @param {number} numberOfSignals
         * @memberof ASCsvDeconverter
         */
        verifyDataMatrix(data, numberOfSignals) {
            data.forEach((row) => {
                if (((row.length - (row.length % 2)) / 2) != numberOfSignals) {
                    throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.FORMAT_VIOLATION);
                }
            });
        }
    };
    ASCsvDeconverter = __decorate([
        mco.role()
    ], ASCsvDeconverter);
    exports.ASCsvDeconverter = ASCsvDeconverter;
});
