var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./CoTraceSignal", "./CoTraceRecording", "./CsvDataRow", "../enums/traceDataConversionErrorTypes", "../exceptions/traceDataConversionError", "../../../core/types/sample"], function (require, exports, CoTraceSignal_1, CoTraceRecording_1, CsvDataRow_1, traceDataConversionErrorTypes_1, traceDataConversionError_1, sample_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CoTraceCsvDeconverter = void 0;
    /**
     * Deconverts a CoTrace CSV string into a ICoTraceRecording.
     *
     * @class CoTraceCsvDeconverter
     */
    let CoTraceCsvDeconverter = class CoTraceCsvDeconverter {
        /**
         * Deconverts an cotrace csv formatted string to an IRecording.
         * Can throw TraceDataConversionError.
         * Column and comma seperator may not contain:
         * - whitespace characters
         * - numbers
         * - letters which occur in variable or timestamp names
         * - multiple characters
         *
         * @param {string} csv
         * @returns {ICoTraceRecording}
         * @memberof CoTraceCsvDeconverter
         */
        deconvert(csv) {
            let lines = this.splitStringIntoRows(csv);
            let colsep = this.tryExtractColsep(lines[0]); //first row needs to be headerline
            let comsep = this.tryExtractComsep(lines, colsep);
            let dataMatrix = this.parseLinesToMatrix(lines, colsep, comsep);
            let signals = this.prepareSignals(lines[0], colsep);
            signals = this.resolveMatrix(signals, dataMatrix);
            let starttrigger = this.tryExtractStartTrigger(dataMatrix);
            return new CoTraceRecording_1.CoTraceRecording(starttrigger, signals);
        }
        /**
         * Builds the array of ICoTraceSignals based on their names in the headerline.
         *
         * @private
         * @param {string} headerline
         * @param {*} colsep
         * @returns {Array<ICoTraceSignal>}
         * @memberof CoTraceCsvDeconverter
         */
        prepareSignals(headerline, colsep) {
            let names = headerline.split(colsep);
            let signals = new Array();
            //traced variables start at index 3, because index 0-2 are timestamps
            for (let i = 3; i < names.length; i++) {
                if (names[i] !== "") {
                    signals.push(new CoTraceSignal_1.CoTraceSignal(names[i]));
                }
            }
            return signals;
        }
        /**
         * Resolves the data matrix into the ICotraceSignals.
         *
         * @private
         * @param {ICoTraceSignal[]} signals
         * @param {Array<Array<number>>} matrix
         * @returns {ICoTraceSignal[]}
         * @memberof CoTraceCsvDeconverter
         */
        resolveMatrix(signals, matrix) {
            for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
                let relTime = matrix[rowIndex][2]; //relative time is in 3rd column -> index 2
                //traced variables start at index 3, because index 0-2 are timestamps
                for (let columnIndex = 3; (columnIndex - 3) < signals.length; columnIndex++) {
                    let sample = new sample_1.Sample(relTime, matrix[rowIndex][columnIndex]);
                    signals[columnIndex - 3].samples.push(sample);
                }
            }
            return signals;
        }
        /**
         * Creates a datamatrix out of the csv data representing the values and position within the csv.
         *
         * @private
         * @param {Array<string>} lines
         * @param {string} colsep
         * @param {(string|undefined)} comsep
         * @returns {Array<Array<number>>}
         * @memberof CoTraceCsvDeconverter
         */
        parseLinesToMatrix(lines, colsep, comsep) {
            let dataMatrix = new Array();
            for (let lineIndex = 1; lineIndex < lines.length; lineIndex++) {
                let row = CsvDataRow_1.CsvDataRow.readDataRow(lines[lineIndex], colsep, comsep);
                dataMatrix.push(row);
            }
            return dataMatrix;
        }
        /**
         * Tries to derive starttrigger from the data row with relative timestamp to start trigger 0.
         * If not possible the current timestamp is returned.
         *
         * @private
         * @param {Array<Array<number>>} matrix
         * @returns {Date}
         * @memberof CoTraceCsvDeconverter
         */
        tryExtractStartTrigger(matrix) {
            let starttrigger = new Date();
            for (let rowIndex = 1; rowIndex < matrix.length; rowIndex++) {
                if (matrix[rowIndex][2] === 0) { //if relative time to starttrigger is null
                    //take EpochTimestamp, transform it to UNIXTimestamp and build Date Object
                    starttrigger = new Date(matrix[rowIndex][0] * 1000);
                }
            }
            return starttrigger;
        }
        /**
         * Removes all whitespace characters and then splits the csv string into rows.
         * Can throw TraceDataConversionError.
         *
         * @private
         * @param {string} csv
         * @returns {Array<string>}
         * @memberof CoTraceCsvDeconverter
         */
        splitStringIntoRows(csv) {
            // matches all whitespace characters excluding \n
            let regex = /[\r\t\f\v ]+/gm;
            //removes all characters from string matched by the regex
            let filteredCsv = this.removeCharacter(csv, regex);
            let lines = filteredCsv.split('\n');
            lines = this.removeEmptyLines(lines);
            if (lines.length > 1) {
                // csv is only considered valid if at least 2 rows exist (the header row and one or more data rows) 
                return lines;
            }
            throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.FORMAT_VIOLATION);
        }
        /**
         * Tries to extract the comma seperator the data lines.
         * The first character which is not a number, a '-', a whitespace character or the column seperator is taken as comma seperator.
         * If not found, the comma seperator is undefined.
         *
         * @private
         * @param {Array<string>} lines
         * @param {string} colsep
         * @returns {(string|undefined)}
         * @memberof CoTraceCsvDeconverter
         */
        tryExtractComsep(lines, colsep) {
            //matches for a single character which is not '-' or '0'-'9' or ' ' or colsep or whitespace character
            let getComsepRegEx = new RegExp("[^\-0-9\ " + colsep + "\r\n\t\f\v]");
            let comsepCandidates;
            let comsep = undefined;
            for (let i = 1; i < lines.length; i++) {
                comsepCandidates = getComsepRegEx.exec(lines[i]);
                //if a comsep candidate is found return it
                if (comsepCandidates) {
                    comsep = comsepCandidates[0];
                }
            }
            //if no comsep candidate is found return undefined. there is probably no decimal value in csv
            return comsep;
        }
        /**
         * Tries to extract the column seperator from known, fixed parts of the headerline.
         * Can throw TraceDataConversionError.
         *
         * @private
         * @param {string} headerline
         * @returns {string}
         * @memberof CoTraceCsvDeconverter
         */
        tryExtractColsep(headerline) {
            //matches for all characters between phrases "EpochTimestamp" and "SiosTimeUsec"
            let getColsepRegEx = new RegExp("EpochTimestamp(.)SiosTimeUsec");
            let colsepCandidates = getColsepRegEx.exec(headerline);
            if (colsepCandidates) {
                return colsepCandidates[1];
            }
            else {
                // if no colsep can be determined there is an incorrect headerline provided
                throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.NO_COLSEP);
            }
        }
        /**
         * Removes empty strings in an array of strings.
         *
         * @private
         * @param {Array<string>} lines
         * @returns {Array<string>}
         * @memberof CoTraceCsvDeconverter
         */
        removeEmptyLines(lines) {
            return lines.filter(val => { return (val !== "") ? true : false; });
        }
        /**
         * Removes characters (specified by a regex) from a string.
         *
         * @private
         * @param {string} str
         * @param {RegExp} regex
         * @returns {string}
         * @memberof CoTraceCsvDeconverter
         */
        removeCharacter(str, regex) {
            return str.replace(regex, "");
        }
    };
    CoTraceCsvDeconverter = __decorate([
        mco.role()
    ], CoTraceCsvDeconverter);
    exports.CoTraceCsvDeconverter = CoTraceCsvDeconverter;
});
