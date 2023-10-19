var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../loggerColumnDefinition"], function (require, exports, loggerColumnDefinition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DriveLogDefinitions = void 0;
    let DriveLogDefinitions = class DriveLogDefinitions {
        constructor() {
            /**
             * Column id definitions
             * For this definitions properties must be available in the LoggerEntry interface
             *
             * @private
             * @memberof DriveLogDefinitions
             */
            this.columnIdRecordNumber = "recordNumber";
            this.columnIdTime = "time";
            this.columnIdModule = "module";
            this.columnIdObjectName = "objectName";
            this.columnIdDescriptionRawData = "descriptionRawData";
            this.columnIdResponseTime = "responseTime";
        }
        /**
         * Returns the column definition for the network command trace logger
         *
         * @returns {Array<LoggerColumnDefinition>}
         * @memberof DriveLogDefinitions
         */
        getColumnDefinitions() {
            let columnDefinitions = new Array();
            columnDefinitions.push(new loggerColumnDefinition_1.LoggerColumnDefinition(this.columnIdRecordNumber, "No.", 40, loggerColumnDefinition_1.FieldType.Numeric));
            columnDefinitions.push(new loggerColumnDefinition_1.LoggerColumnDefinition(this.columnIdTime, "Time [s]", 60, loggerColumnDefinition_1.FieldType.Numeric, true));
            columnDefinitions.push(new loggerColumnDefinition_1.LoggerColumnDefinition(this.columnIdModule, "Module (Element)", 120, loggerColumnDefinition_1.FieldType.String, true));
            columnDefinitions.push(new loggerColumnDefinition_1.LoggerColumnDefinition(this.columnIdObjectName, "Appl. Object", 90, loggerColumnDefinition_1.FieldType.String, true, "objectNameTooltipTemplate"));
            columnDefinitions.push(new loggerColumnDefinition_1.LoggerColumnDefinition(this.columnIdDescriptionRawData, "Drive Parameter Data", 320, loggerColumnDefinition_1.FieldType.String, true, "descriptionTooltipTemplate"));
            columnDefinitions.push(new loggerColumnDefinition_1.LoggerColumnDefinition(this.columnIdResponseTime, "Resp. Time [ms]", 70, loggerColumnDefinition_1.FieldType.Numeric, true));
            return columnDefinitions;
        }
        /**
         * Returns the html representation for the cell with the given columnId
         *
         * @param {string} columnId
         * @param {Array<string>} values
         * @returns {string}
         * @memberof DriveLogDefinitions
         */
        getCellData(columnId, cellItem) {
            let item = cellItem;
            if (columnId == this.columnIdRecordNumber) {
                return "&nbsp;&nbsp;&nbsp;&nbsp;" + item.recordNumber.toString();
            }
            else if (columnId == this.columnIdTime) {
                return item.time;
            }
            else if (columnId == this.columnIdModule) {
                return item.module;
            }
            else if (columnId == this.columnIdObjectName) {
                return item.objectName;
            }
            else if (columnId == this.columnIdDescriptionRawData) {
                let imagePath = "widgets/loggerWidget/style/images/" + item.getDescriptionIconId() + ".svg";
                return `<div style="white-space: nowrap;">
                <div style='position: relative; top:  2px; display: inline-block; width: 30px;'><img height="22" alt=" " src="` + imagePath + `"></div>
                <div style='position: relative; top: -5px; display: inline-block; width: 220px;'>` + item.getDescriptionTextFormated() + `</div>
                <div style='position: relative; top: -5px; display: inline-block; width: 230px;'>` + item.getDescriptionValueWithUnitFormated() + `&nbsp;</div>
                <div style='position: relative; top: -5px; display: inline-block;'>` + item.getDescriptionErrorFormated() + `</div>
            </div>`;
            }
            else if (columnId == this.columnIdResponseTime) {
                return item.responseTime;
            }
            console.error("CellData not implemented for column id: " + columnId);
            return "";
        }
        /**
         * Returns the template for the tooltip
         *
         * @returns {string}
         * @memberof DriveLogDefinitions
         */
        getCellTooltipTemplateData() {
            return `<script type="text/x-jsrender" id="defaultTooltipTemplate">
                </script>
                <script type="text/x-jsrender" id="objectNameTooltipTemplate">
                    <div class="tooltipBox">
                        {{:#data['record']['objectName']}}
                    </div>
                </script>
                <script type="text/x-jsrender" id="descriptionTooltipTemplate">
                    <div class="tooltipBox">
                        {{:#data['record']['descriptionTooltip']}}
                    </div>
                </script>`;
        }
    };
    DriveLogDefinitions = __decorate([
        mco.role()
    ], DriveLogDefinitions);
    exports.DriveLogDefinitions = DriveLogDefinitions;
});
