var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../enums/traceDataConversionErrorTypes", "../exceptions/traceDataConversionError"], function (require, exports, traceDataConversionErrorTypes_1, traceDataConversionError_1) {
    "use strict";
    var ASCsvSignalObj_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ASCsvSignalObj = void 0;
    /**
     * Represents the data contained in an AS CSV formatted string.
     *
     * @class ASCsvSignalObj
     * @implements {IASCsvSignal}
     */
    let ASCsvSignalObj = ASCsvSignalObj_1 = class ASCsvSignalObj {
        /**
         * Creates an instance of ASCsvSignalObj.
         *
         * @param {string} title
         * @param {Date} starttrigger
         * @param {number} rows
         * @param {Array<IPoint>} points
         * @param {string} [xunit="UnitX"]
         * @param {string} [yunit="UnitY"]
         * @param {string} [formula="DO_NOT_CHANGE_ORIGINAL_DATA"]
         * @memberof ASCsvSignalObj
         */
        constructor(title, starttrigger, rows, data, xunit = "UnitX", yunit = "UnitY", formula = "DO_NOT_CHANGE_ORIGINAL_DATA") {
            this.title = title;
            this.starttrigger = starttrigger;
            this.rows = rows;
            this.data = data;
            this.xunit = xunit;
            this.yunit = yunit;
            this.formula = formula;
        }
        /**
         * Builds a ASCsvSignalObj from interfaces.
         * Can throw TraceDataConversionError.
         *
         * @static
         * @param {IASCsvHeader} header
         * @param {Array<IPoint>} data
         * @returns {ASCsvSignalObj}
         * @memberof ASCsvSignalObj
         */
        static buildASCsvSignalObj(header, data) {
            if (header.rows !== data.length) {
                throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.FORMAT_VIOLATION);
            }
            return new ASCsvSignalObj_1(header.title, header.starttrigger, header.rows, data, header.xunit, header.yunit, header.formula);
        }
    };
    ASCsvSignalObj = ASCsvSignalObj_1 = __decorate([
        mco.role()
    ], ASCsvSignalObj);
    exports.ASCsvSignalObj = ASCsvSignalObj;
});
