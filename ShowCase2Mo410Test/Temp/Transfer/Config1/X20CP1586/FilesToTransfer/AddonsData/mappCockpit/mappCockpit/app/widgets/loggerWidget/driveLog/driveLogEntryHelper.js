var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DriveLogEntryHelper = void 0;
    let DriveLogEntryHelper = class DriveLogEntryHelper {
        /**
         * Returns main tooltip description
         *
         * @static
         * @param {string} recordType
         * @param {number} parId
         * @returns {string}
         * @memberof DriveLogEntryHelper
         */
        static getMainDescriptionTooltip(recordType, parId) {
            let tooltip = "";
            // Add type of entry as header(bold)
            tooltip += "<b>" + recordType + "</b>";
            tooltip += "<br/>";
            // Add general tooltip info
            tooltip += "ParId: " + parId;
            tooltip += "<br/>";
            return tooltip;
        }
        /**
         * Returns the tooltip for the given additional data object
         *
         * @static
         * @param {(IAdditionalData|undefined)} data
         * @returns {string}
         * @memberof DriveLogEntryHelper
         */
        static getAdditionalDescriptionTooltip(data) {
            let tooltip = "";
            if (data != undefined) {
                if (data.parGroup != undefined) {
                    tooltip += this.createParamGroupDescription(data.parGroup);
                }
                if (data.bitPattern != undefined) {
                    tooltip += "<br/>";
                    tooltip += this.createBitMaskTable(data.bitPattern);
                }
                if (data.errorInfo != undefined) {
                    tooltip += this.createErrorInfoDescription(data.errorInfo);
                }
            }
            return tooltip;
        }
        /**
         * Returns the descriptionValue incl. the unit
         *
         * @param {string} value
         * @param {(string|undefined)} unit
         * @returns {string}
         * @memberof DriveLogEntryHelper
         */
        static combineValueWithUnit(value, unit) {
            if (unit != undefined && unit != "") {
                value += " " + unit;
            }
            return value;
        }
        /**
         * Generate icon id for the given records of this entry(e.g. recordId1_recordId2 or recId1_recId2_ivalid)
         *
         * @static
         * @param {(number|undefined)} recordType
         * @param {(number|undefined)} linkedRecordType
         * @param {boolean} invalidLinkedRecord
         * @returns {string}
         * @memberof DriveLogEntryHelper
         */
        static generateIconId(recordType, linkedRecordType, invalidLinkedRecord) {
            let id = "";
            if (recordType != undefined) {
                id = recordType.toString();
            }
            if (linkedRecordType != undefined && linkedRecordType != -1) {
                if (id != "") {
                    id += "_";
                }
                id += linkedRecordType.toString();
            }
            if (invalidLinkedRecord == true) {
                id += "_invalid";
            }
            return id;
        }
        /**
         * Sets the red color and bold for the given error text
         *
         * @static
         * @param {string} text
         * @returns
         * @memberof DriveLogEntryHelper
         */
        static setStyleError(text) {
            // set style red and bold
            return this.setStyle(text, "red", true);
        }
        /**
         * find first different character (after " " to use only whole words)
         *
         * @static
         * @param {string} text1
         * @param {string} text2
         * @returns {number}
         * @memberof DriveLogEntryHelper
         */
        static findFirstDifferentChar(text1, text2) {
            let index = 0;
            for (let i = 0; i < text1.length; i++) {
                if (text2.length > i) {
                    if (text1[i] == " ") { // Different char must be after " " to use only whole words
                        // set index to character after last " "
                        index = i + 1;
                    }
                    if (text2[i] != text1[i]) {
                        return index;
                    }
                }
                else {
                    return index;
                }
            }
            return index;
        }
        /**
         * Creates the parameter group description for the given param group data
         *
         * @private
         * @static
         * @param {Array<INwctParamGroupInfo>} paramGroupExportDatas
         * @returns {string}
         * @memberof DriveLogEntryHelper
         */
        static createParamGroupDescription(paramGroupExportDatas) {
            let tooltip = "";
            paramGroupExportDatas.forEach(parGroup => {
                if (parGroup.parName != undefined) {
                    // Add parameter info
                    tooltip += "<br/>" + parGroup.parName + " = " + parGroup.parValue;
                    if (parGroup.parUnit != undefined && parGroup.parUnit != "") { // Add unit if available
                        tooltip += " " + parGroup.parUnit;
                    }
                    // Add additional bit pattern info if available
                    if (parGroup.bitPattern != undefined) {
                        tooltip += this.createBitMaskTable(parGroup.bitPattern);
                    }
                }
            });
            return tooltip;
        }
        /**
         * Creates the error info description for the given error info data
         *
         * @private
         * @static
         * @param {INwctErrorInfo} errorInfo
         * @returns {string}
         * @memberof DriveLogEntryHelper
         */
        static createErrorInfoDescription(errorInfo) {
            let tooltip = "";
            if (errorInfo != undefined && errorInfo.errorNumber != undefined) {
                tooltip += "<br/>" + this.setStyleError(errorInfo.errorMessage);
            }
            return tooltip;
        }
        /**
         * Returns a string with some DIVs(table with rows and cells) with the bit mask informations
         *
         * @private
         * @static
         * @param {Array<INwctBitDefinition>} bitMaskDescription
         * @returns {string}
         * @memberof DriveLogEntryHelper
         */
        static createBitMaskTable(bitMaskDescription) {
            let tooltip = "<div class='tooltipTable'>";
            if (bitMaskDescription.length > 16) { // Show bitmask info with two columns if more then 16 bits are available
                let rowCount = 0;
                let bitCount = bitMaskDescription.length;
                let modulo = bitCount % 2;
                let evenNumber = bitCount + modulo;
                let startIndexOfSecondColumn = evenNumber / 2;
                for (let i = startIndexOfSecondColumn; i < bitMaskDescription.length; i++) {
                    let elementColumn1 = bitMaskDescription[i - startIndexOfSecondColumn];
                    let elementColumn2 = bitMaskDescription[i];
                    let alternateRow = rowCount % 2;
                    // Add row with two bitmask infos
                    tooltip += this.createBitMaskTableRow(new Array(elementColumn1, elementColumn2), alternateRow == 1);
                    rowCount++;
                }
                // Add last single bit description
                if (modulo == 1) {
                    let elementColumn1 = bitMaskDescription[startIndexOfSecondColumn - 1];
                    let alternateRow = rowCount % 2;
                    // Add row with one bitmask info and one empty definiton
                    tooltip += this.createBitMaskTableRow(new Array(elementColumn1, undefined), alternateRow == 1);
                }
            }
            else { // Show bitmask info with only one column
                let rowCount = 0;
                bitMaskDescription.forEach(element => {
                    let alternateRow = rowCount % 2;
                    // Add row with one bitmask info 
                    tooltip += this.createBitMaskTableRow(new Array(element), alternateRow == 1);
                    rowCount++;
                });
            }
            tooltip += '</div>';
            return tooltip;
        }
        /**
         * Returns a string with some DIVs(tableRow with some tableCells) for a bit mask representation(e.g. bitnumber, checked, bitname)
         *
         * @private
         * @static
         * @param {(Array<INwctBitDefinition|undefined>)} bitDefinitions
         * @param {boolean} alternateStyle
         * @returns {string}
         * @memberof DriveLogEntryHelper
         */
        static createBitMaskTableRow(bitDefinitions, alternateStyle) {
            let tableRow = "";
            let classAlternate = "";
            if (alternateStyle == true) {
                classAlternate += " tooltipTableRowAlternate";
            }
            // add begin
            tableRow += "<div class='tooltipTableRow" + classAlternate + "'>";
            // add cells
            bitDefinitions.forEach(bitDef => {
                tableRow += this.createBitMaskTableCells(bitDef);
            });
            // add end
            tableRow += "</div>";
            return tableRow;
        }
        /**
         * Returns a string with some DIVs(tableCells) for a bit mask representation(e.g. bitnumber, checked, bitname)
         *
         * @private
         * @static
         * @param {(INwctBitDefinition|undefined)} bitDef
         * @returns {string}
         * @memberof DriveLogEntryHelper
         */
        static createBitMaskTableCells(bitDef) {
            let classForCell = "tooltipTableCell";
            if (bitDef == undefined) {
                // add three empty cells
                let definitionOfOneEmptyCell = "<div class='" + classForCell + "'></div>";
                let tableCell = definitionOfOneEmptyCell;
                tableCell += definitionOfOneEmptyCell;
                tableCell += definitionOfOneEmptyCell;
                return tableCell;
            }
            let classForCellModified = "";
            if (bitDef.isModified) {
                classForCellModified = " tooltipTableCellModififed";
            }
            let isSetCheck = "&nbsp;";
            let classForCellBold = "";
            if (bitDef.isSet) {
                // Set check symbol for bit == 1 ...
                isSetCheck = "&#x2713;"; // unicode check symbol
                // ... and bold style
                classForCellBold = " tooltipTableCellBold";
            }
            // add cells with data(bitnumber, checked, bitname)
            let tableCell = "<div class='" + classForCell + classForCellBold + "'>" + bitDef.bit + "</div>";
            tableCell += "<div class='" + classForCell + classForCellBold + "'>" + isSetCheck + "</div>";
            tableCell += "<div class='" + classForCell + classForCellBold + classForCellModified + "'>" + bitDef.name + "</div>";
            return tableCell;
        }
        /**
         * Sets the gree color for the given text and bold if needed
         *
         * @private
         * @static
         * @param {string} text
         * @param {string} color
         * @param {boolean} [bold=false]
         * @returns
         * @memberof DriveLogEntryHelper
         */
        static setStyle(text, color, bold = false) {
            if (text == "") { // don't add red style if no text is available
                return text;
            }
            let colorString = "";
            if (color != "") {
                colorString = 'color:' + color + ';';
            }
            if (bold == true) {
                return "<p style='" + colorString + "display:inline;font-weight:bold;'>" + text + "</p>";
            }
            return "<p style='" + colorString + "display:inline;'>" + text + "</p>";
        }
    };
    DriveLogEntryHelper = __decorate([
        mco.role()
    ], DriveLogEntryHelper);
    exports.DriveLogEntryHelper = DriveLogEntryHelper;
});
