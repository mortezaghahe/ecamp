var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./../loggerColumnDefinition"], function (require, exports, loggerColumnDefinition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NullLoggerDefinitions = void 0;
    let NullLoggerDefinitions = class NullLoggerDefinitions {
        constructor() {
            /**
             * Column id definitions
             * For this definitions properties must be available in the LoggerEntry interface
             *
             * @private
             * @memberof DriveLogDefinitions
             */
            this.columnIdRecordNumber = "recordNumber";
        }
        /**
         * Returns the column definition for this logger
         *
         * @returns {Array<LoggerColumnDefinition>}
         * @memberof NullLoggerDefinitions
         */
        getColumnDefinitions() {
            let columnDefinitions = new Array();
            columnDefinitions.push(new loggerColumnDefinition_1.LoggerColumnDefinition(this.columnIdRecordNumber, "Index", 40));
            return columnDefinitions;
        }
        /**
          * Returns the html representation for the cell with the given columnId
          *
          * @param {string} columnId
          * @param {ILoggerEntry} cellItem
          * @returns {string}
          * @memberof NullLoggerDefinitions
          */
        getCellData(columnId, cellItem) {
            let item = cellItem;
            if (columnId == this.columnIdRecordNumber) {
                return item.recordNumber.toString();
            }
            console.error("CellData not implemented for column id: " + columnId);
            return "";
        }
        /**
         * Returns the template for the tooltip
         *
         * @returns {string}
         * @memberof NullLoggerDefinitions
         */
        getCellTooltipTemplateData() {
            return `<script type="text/x-jsrender" id="defaultTooltipTemplate">
            <table>
                <tr>
                    <td style='padding:5px;font-weight: bold;'>
                        Task ID
                    </td>
                    <td style='padding:5px;'>
                        : {{:#data['record']['recordNumber']}}
                    </td>
                </tr>
            </table>
        </script>`;
        }
    };
    NullLoggerDefinitions = __decorate([
        mco.role()
    ], NullLoggerDefinitions);
    exports.NullLoggerDefinitions = NullLoggerDefinitions;
});
