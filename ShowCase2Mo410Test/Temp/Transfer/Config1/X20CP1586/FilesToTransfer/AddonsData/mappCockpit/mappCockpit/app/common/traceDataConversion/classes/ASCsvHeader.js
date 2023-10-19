var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../enums/traceDataConversionErrorTypes", "../exceptions/traceDataConversionError"], function (require, exports, traceDataConversionErrorTypes_1, traceDataConversionError_1) {
    "use strict";
    var ASCsvHeader_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ASCsvHeader = void 0;
    /**
     * Represents a header row of the AS CSV format.
     * Contains the knowledge to read or write an ASCsv formatted header row.
     *
     * @class ASCsvHeader
     * @implements {IASCsvHeader}
     */
    let ASCsvHeader = ASCsvHeader_1 = class ASCsvHeader {
        /**
         * Creates an instance of ASCsvHeader.
         * Accessor private to force use of Factory methods.
         * @memberof ASCsvHeader
         */
        constructor() {
            this.title = "";
            this.starttrigger = new Date();
            this.xunit = "UnitX";
            this.yunit = "UnitY";
            this.rows = -1;
            this.formula = ASCsvHeader_1.originalDataFormula;
        }
        /**
         * Stringifies the header in an ASCsv formatted header row with linebreak.
         * Can throw TraceDataConversionError.
         *
         * @param {string} comsep
         * @param {string} colsep
         * @returns {string}
         * @memberof ASCsvHeader
         */
        stringifyASCsvHeader(comsep, colsep) {
            let headerRow = '';
            headerRow = "% ";
            headerRow += ASCsvHeader_1.type_attribute + " ";
            headerRow += ASCsvHeader_1.version_attributeName + "=2" + comsep + "0 ";
            headerRow += ASCsvHeader_1.title_attributeName + `="` + ASCsvHeader_1.buildTitleAttributeString(this.title, this.starttrigger) + `" `;
            headerRow += ASCsvHeader_1.xunit_attributeName + `="` + this.xunit + `" `;
            headerRow += ASCsvHeader_1.yunit_attributeName + `="` + this.yunit + `" `;
            headerRow += ASCsvHeader_1.formula_attributeName + `="` + this.formula + `" `;
            headerRow += ASCsvHeader_1.rows_attributeName + "=" + this.rows + " ";
            headerRow += ASCsvHeader_1.columns_attributeName + "=2 ";
            headerRow += ASCsvHeader_1.createColsepAttribute(colsep) + " ";
            headerRow += colsep;
            headerRow += ASCsvHeader_1.linebreakString;
            return headerRow;
        }
        /**
         * Creates an AS CSV header from the IASCsvHeader interface.
         *
         * @static
         * @param {IASCsvHeader} headerData
         * @returns {ASCsvHeader}
         * @memberof ASCsvHeader
         */
        static buildASCsvHeaderFromInterface(headerData) {
            let header = new ASCsvHeader_1();
            header.title = headerData.title;
            header.starttrigger = headerData.starttrigger;
            header.rows = headerData.rows;
            header.formula = headerData.formula;
            header.xunit = headerData.xunit;
            header.yunit = headerData.yunit;
            return header;
        }
        /**
         * Creates an ASCsv header from the data.
         *
         * @static
         * @param {string} title
         * @param {Date} starttrigger
         * @param {number} rows
         * @param {string} [xunit]
         * @param {string} [yunit]
         * @param {string} [formula]
         * @returns {ASCsvHeader}
         * @memberof ASCsvHeader
         */
        static buildASCsvHeaderFromData(title, starttrigger, rows, xunit, yunit, formula) {
            let header = new ASCsvHeader_1();
            header.title = title;
            header.starttrigger = starttrigger;
            header.rows = rows;
            if (formula) {
                header.formula = formula;
            }
            if (xunit) {
                header.xunit = xunit;
            }
            if (yunit) {
                header.yunit = yunit;
            }
            return header;
        }
        /**
         * Creates an AS CSV header from a string containing an AS CSV formatted headerrow.
         * Can throw TraceDataConversionError.
         *
         * @static
         * @param {string} headerRow
         * @param {Date} backupDate
         * @returns {ASCsvHeader}
         * @memberof ASCsvHeader
         */
        static buildASCsvHeaderFromString(headerRow, backupDate) {
            let header = new ASCsvHeader_1();
            let titleStr = ASCsvHeader_1.getTextAttribute(ASCsvHeader_1.title_attributeName, headerRow);
            let titleParts = titleStr.split(',');
            header.title = ASCsvHeader_1.tryRemoveStartTrigger(titleStr);
            if (titleParts.length >= 3) {
                header.starttrigger = ASCsvHeader_1.parseStarttriggerDate(titleParts[titleParts.length - 2], titleParts[titleParts.length - 1]);
            }
            else {
                header.starttrigger = backupDate;
            }
            header.rows = ASCsvHeader_1.getNumberAttribute(ASCsvHeader_1.rows_attributeName, headerRow);
            header.xunit = ASCsvHeader_1.getTextAttribute(ASCsvHeader_1.xunit_attributeName, headerRow);
            header.yunit = ASCsvHeader_1.getTextAttribute(ASCsvHeader_1.yunit_attributeName, headerRow);
            header.formula = ASCsvHeader_1.getTextAttribute(ASCsvHeader_1.formula_attributeName, headerRow);
            return header;
        }
        /**
         * Tries to remove the starttrigger of the title of an AS CSV signal and return the title without the starttrigger.
         * If the substring representing the starttrigger can not be determined, it returns the title without changes.
         *
         * @static
         * @param {string} title
         * @returns {string}
         * @memberof ASCsvHeader
         */
        static tryRemoveStartTrigger(title) {
            let startTriggerSeperator = ',';
            let signalName = title;
            let titleParts = title.split(startTriggerSeperator);
            if (titleParts.length >= 3) {
                if ((/..\/..\/../.exec(titleParts[titleParts.length - 2]) != null) && (/..:..:../.exec(titleParts[titleParts.length - 1]) != null)) {
                    signalName = titleParts.slice(0, titleParts.length - 2).join(startTriggerSeperator);
                }
            }
            return signalName;
        }
        /**
         * Tries to extract the column seperator of an ASCsv formatted string.
         * Can throw TraceDataConversionError.
         *
         * @static
         * @param {string} data
         * @returns {string}
         * @memberof ASCsvHeader
         */
        static tryGetColumnSeperator(data) {
            let colSepAttributString = this.getTextAttribute(ASCsvHeader_1.columnSeperator_attributeName, data);
            switch (colSepAttributString) {
                case "SEMICOLON":
                    return ';';
                case "COMMA":
                    return ',';
                default:
                    throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.UNKNOWN_COLSEP);
            }
        }
        /**
         * Returns comma seperator to given column seperator.
         * Can throw TraceDataConversionError.
         *
         * @static
         * @param {string} colsep
         * @returns {string}
         * @memberof ASCsvHeader
         */
        static getCommaSeperatorToColumnSeperator(colsep) {
            let comsep = "";
            switch (colsep) {
                case ';':
                    comsep = ',';
                    break;
                case ',':
                    comsep = '.';
                    break;
                default:
                    throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.UNKNOWN_COLSEP);
            }
            return comsep;
        }
        /**
         * Returns formatted date mm/dd/yy  m=month in UTC
         *
         * @private
         * @static
         * @param {Date} date
         * @returns
         * @memberof ASCsvHeader
         */
        static retrieveFormattedDate(date) {
            let options = {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'UTC'
            };
            return new Intl.DateTimeFormat('en-US', options).format(date);
        }
        /**
         * Returns formatted time in hh/mm/ss  m=minute in UTC
         *
         * @private
         * @static
         * @param {Date} date
         * @returns
         * @memberof ASCsvHeader
         */
        static retrieveFormattedTime(date) {
            let options = {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'UTC'
            };
            return new Intl.DateTimeFormat('en-US', options).format(date);
        }
        /**
         * Creates the COLSEP attribute based on the given column seperator.
         * Throws error "unrecognised column seperator" if column seperator is not known
         * Can throw TraceDataConversionError.
         *
         * @private
         * @static
         * @param {string} colsep
         * @returns {string}
         * @memberof ASCsvHeader
         */
        static createColsepAttribute(colsep) {
            let colsepAttribute = '';
            switch (colsep) {
                case ";":
                    // Set COLSEP attribute for DE
                    colsepAttribute = ASCsvHeader_1.columnSeperator_attributeName + `="SEMICOLON"`;
                    break;
                case ",":
                    // Set COLSEP attribute for EN
                    colsepAttribute = ASCsvHeader_1.columnSeperator_attributeName + `="COMMA"`;
                    break;
                default:
                    throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.UNKNOWN_COLSEP);
            }
            return colsepAttribute;
        }
        /**
         * Extracts text from an attribute based on its name.
         * Can throw TraceDataConversionError.
         *
         * @private
         * @static
         * @param {string} attributeName
         * @param {string} instr
         * @returns {string}
         * @memberof ASCsvHeader
         */
        static getTextAttribute(attributeName, instr) {
            let regex = new RegExp(attributeName + "=\"([^\"]+)");
            let arr = regex.exec(instr);
            if (arr) {
                return arr[1];
            }
            else {
                throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.MISSING_ATTRIBUTE, attributeName);
            }
        }
        /**
         * Extracts a number an attribute based on its name.
         * Can throw TraceDataConversionError.
         *
         * @private
         * @static
         * @param {string} attributeName
         * @param {string} instr
         * @returns {number}
         * @memberof ASCsvHeader
         */
        static getNumberAttribute(attributeName, instr) {
            let regex = new RegExp(attributeName + "=([^ ]+)");
            let arr = regex.exec(instr);
            if (arr) {
                return Number(arr[1]);
            }
            else {
                throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.MISSING_ATTRIBUTE, attributeName);
            }
        }
        /**
         * Parses a UTC date string in format mm/dd/yy (m = month) and a UTC time in format hh:mm:ss (m = minutes) into a Date object.
         *
         * @private
         * @static
         * @param {string} dateStr
         * @param {string} timeStr
         * @returns {Date}
         * @memberof ASCsvHeader
         */
        static parseStarttriggerDate(dateStr, timeStr) {
            let dateArr = dateStr.split('/');
            let timeArr = timeStr.split(':');
            let year = 2000 + Number(dateArr[2]);
            let month = Number(dateArr[0]) - 1; // months start counting at 0; valid range is 0 to 11
            let dayInMonth = Number(dateArr[1]); // days start counting at 1
            let hours = Number(timeArr[0]);
            let minutes = Number(timeArr[1]);
            let seconds = Number(Number(timeArr[2]));
            let milliseconds = 0; // set to zero to have the same defined value for all dates
            let starttrigger = new Date((Date.UTC(year, month, dayInMonth, hours, minutes, seconds, milliseconds)));
            return starttrigger;
        }
        /**
         * Builds the title attribute string.
         * Adds the given starttrigger formatted as a UTC date string in format mm/dd/yy (m = month) and a UTC time string in format hh:mm:ss (m = minutes) to the given title.
         *
         * @static
         * @param {string} title
         * @param {Date} starttrigger
         * @returns {string}
         * @memberof ASCsvHeader
         */
        static buildTitleAttributeString(title, starttrigger) {
            return title + ", " + ASCsvHeader_1.retrieveFormattedDate(starttrigger) + ", " + ASCsvHeader_1.retrieveFormattedTime(starttrigger);
        }
        /**
         * Checks if the IASCsvHeader describes a original signal.
         * A original signal has no calculation information (other than indicating it contains original data) in the formula attribute of its header.
         *
         * @static
         * @param {IASCsvHeader} signal
         * @returns {boolean}
         * @memberof ASCsvHeader
         */
        static isOriginalASCsvSignal(signal) {
            let isOriginal = false;
            if (signal.formula === ASCsvHeader_1.originalDataFormula || signal.formula === ("Y={" + ASCsvHeader_1.originalDataFormula + "}")) {
                isOriginal = true;
            }
            return isOriginal;
        }
    };
    // static meta information used in convertion process
    ASCsvHeader.linebreakString = "\r\n";
    ASCsvHeader.originalDataFormula = "DO_NOT_CHANGE_ORIGINAL_DATA";
    ASCsvHeader.type_attribute = "TYPE=CHART-DATA-ASCII";
    ASCsvHeader.version_attributeName = "V";
    ASCsvHeader.title_attributeName = "TITLE";
    ASCsvHeader.xunit_attributeName = "XUNIT";
    ASCsvHeader.yunit_attributeName = "YUNIT";
    ASCsvHeader.formula_attributeName = "FORMULA";
    ASCsvHeader.rows_attributeName = "ROWS";
    ASCsvHeader.columns_attributeName = "COLS";
    ASCsvHeader.columnSeperator_attributeName = "COLSEP";
    ASCsvHeader = ASCsvHeader_1 = __decorate([
        mco.role()
    ], ASCsvHeader);
    exports.ASCsvHeader = ASCsvHeader;
});
