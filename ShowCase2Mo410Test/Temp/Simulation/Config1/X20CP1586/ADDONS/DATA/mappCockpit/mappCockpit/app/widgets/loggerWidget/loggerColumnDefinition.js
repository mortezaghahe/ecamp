var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoggerColumnDefinition = exports.FieldType = void 0;
    /**
     * Type of the data for a column (e.g. numeric or string)
     *
     * @export
     * @enum {number}
     */
    var FieldType;
    (function (FieldType) {
        FieldType[FieldType["Numeric"] = 0] = "Numeric";
        FieldType[FieldType["String"] = 1] = "String";
    })(FieldType = exports.FieldType || (exports.FieldType = {}));
    /**
     * Defines one column for the logger
     *
     * @export
     * @class LoggerColumnDefinition
     */
    let LoggerColumnDefinition = class LoggerColumnDefinition {
        /**
         * Creates an instance of LoggerColumnDefinition
         * @param {string} fieldId
         * @param {string} displayName
         * @param {number} size
         * @param {FieldType} [fieldType=FieldType.String]
         * @param {boolean} [disableSorting=false]
         * @param {string} [tooltipTemplate=""]
         * @memberof LoggerColumnDefinition
         */
        constructor(fieldId, displayName, size, fieldType = FieldType.String, disableSorting = false, tooltipTemplate = "defaultTooltipTemplate") {
            this.fieldId = fieldId;
            this.displayName = displayName;
            this.size = size;
            this.fieldType = fieldType;
            this.disableSorting = disableSorting;
            this.tooltipTemplate = tooltipTemplate;
        }
    };
    LoggerColumnDefinition = __decorate([
        mco.role()
    ], LoggerColumnDefinition);
    exports.LoggerColumnDefinition = LoggerColumnDefinition;
});
