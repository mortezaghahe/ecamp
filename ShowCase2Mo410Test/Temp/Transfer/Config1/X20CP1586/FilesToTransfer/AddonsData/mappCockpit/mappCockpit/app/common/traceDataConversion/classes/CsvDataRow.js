var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var CsvDataRow_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CsvDataRow = void 0;
    /**
     * Represents the operations which can be performed on as csv data row.
     *
     * @class CsvDataRow
     */
    let CsvDataRow = CsvDataRow_1 = class CsvDataRow {
        constructor() { }
        /**
         * Writes a csv data row from an array of numbers.
         *
         * @static
         * @param {Array<number>} data
         * @param {string} colsep character used to seperate entries
         * @param {string} comsep character used as decimal delimiter
         * @param {boolean} [endRowWithColsep=false] flag to control if a colsep is placed on end of line
         * @returns {string}
         * @memberof CsvDataRow
         */
        static writeDataRow(data, colsep, comsep, endRowWithColsep = false) {
            let row = "";
            for (let i = 0; i < data.length; i++) {
                if (i !== 0) {
                    row += colsep;
                }
                row += (isNaN(data[i])) ? CsvDataRow_1.undefValueString : this.stringifyNumber(data[i], comsep);
            }
            return endRowWithColsep ? row + colsep : row;
        }
        /**
         * Reads a csv data row into an array of numbers.
         * Invalid numbers and empty columns are represented as NaN.
         *
         * @static
         * @param {string} row
         * @param {string} colsep character which seperates columns
         * @param {string} [comsep=','] character which delimits decimal digits
         * @returns {Array<number>}
         * @memberof CsvDataRow
         */
        static readDataRow(row, colsep, comsep = ',') {
            let nums = new Array();
            let rowParts = row.split(colsep);
            rowParts.forEach((str) => {
                str = str.replace(' ', '');
                if (str !== '') {
                    str = str.replace(comsep, '.');
                    nums.push(parseFloat(str));
                }
                else {
                    nums.push(NaN);
                }
            });
            return nums;
        }
        /**
         * Creates and returns a formatted string from a given number.
         *
         * @private
         * @static
         * @param {number} value
         * @param {string} comsep
         * @returns {string}
         * @memberof CsvDataRow
         */
        static stringifyNumber(value, comsep) {
            let strValue = "";
            strValue = value.toExponential(16);
            // remove negative sign
            let negStr = "";
            if (strValue[0] === "-") {
                negStr = "-";
                strValue = strValue.slice(1);
            }
            let strArray = strValue.split("e");
            let exponent = Number(strArray[1]);
            // get value without decimal character
            let mantissa = strArray[0].replace(".", "");
            let mantissaLength = mantissa.length;
            // fill leading or trailing "0"
            if (exponent < 0) {
                // add leading "0"
                strValue = "0" + comsep + this.strRepeat('0', (exponent * (-1.0)) - 1) + mantissa;
            }
            else if (exponent > (mantissaLength - 1)) {
                // add trailing "0"
                strValue = mantissa + this.strRepeat('0', exponent - mantissaLength + 1);
            }
            else if (exponent === (mantissaLength - 1)) {
                // nothing to do
                strValue = mantissa;
            }
            else {
                // place decimal character within the mantissa at the correct position
                strValue = mantissa.substring(0, exponent + 1) + comsep + mantissa.substring(exponent + 1, mantissaLength);
            }
            // add negative sign
            strValue = negStr + strValue;
            return strValue;
        }
        /**
         * Creates and returns a string containing the entered string "str" which is repeated as often as defined in "qty".
         * Original code comes from a forum entry, where this was metnioned as the fastest solution that had been in the comparison.
         *
         * @private
         * @param {string} str string which should be repeated
         * @param {number} qty number of repeats (must be positive)
         * @returns {string}
         * @memberof CsvDataRow
         */
        static strRepeat(str, qty) {
            var result = '';
            while (qty > 0) {
                // If the LSB of qty is set, append str to result.   
                if (qty & 1) {
                    result += str;
                }
                // The bits of qty are shifted to the right by 1 bit. The new bit inserted on the left is a copy of the previous left bit.  
                // The now unnecessary previous right bit gets discarded. The new value is stored in qty. Realises a base 2 exponential shrinking of qty.
                qty >>= 1;
                // Concatenates str on itself and stores this new string in str. Realises a base 2 exponential growth of str.
                str += str;
            }
            return result;
        }
    };
    CsvDataRow.undefValueString = "       ";
    CsvDataRow = CsvDataRow_1 = __decorate([
        mco.role()
    ], CsvDataRow);
    exports.CsvDataRow = CsvDataRow;
});
