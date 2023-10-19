var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./editStringHelper", "./formatItemIdentifier", "./formatSpecification/formatSpecification"], function (require, exports, editStringHelper_1, formatItemIdentifier_1, formatSpecification_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatItem = exports.DataSourceTypes = void 0;
    /**
     * Contains the different datasource types
     *
     * @export
     * @enum {number}
     */
    var DataSourceTypes;
    (function (DataSourceTypes) {
        DataSourceTypes[DataSourceTypes["external"] = 0] = "external";
        DataSourceTypes[DataSourceTypes["argument"] = 1] = "argument";
    })(DataSourceTypes = exports.DataSourceTypes || (exports.DataSourceTypes = {}));
    /**
     * This class holds the information of the format item.
     * Syntax: {<dataSource>|<formatSpecification>}
     *
     * @export
     * @class FormatItem
     */
    let FormatItem = class FormatItem {
        /**
         * Creates an instance of FormatItem.
         *
         * @param {string} rawItem
         * @param {FormatterInputArgumentList} [argumentList]
         * @memberof FormatItem
         */
        constructor(rawItem, argumentList) {
            // get dataSource type
            this._dataSourceType = this.getDataSourceType(rawItem[0]);
            // remove the data source identifier
            rawItem = this.removeIdentifiers(rawItem);
            this._dataSource = rawItem;
            // get default values
            this._formatSpecification = new formatSpecification_1.FormatSpecification();
            // search for a format specification "|"
            let indexOfFormatSpecification = rawItem.indexOf(formatItemIdentifier_1.FormatItemIdentifier.formatSpecification);
            // check if a format specification is found
            if (editStringHelper_1.EditStringHelper.indexIsValid(indexOfFormatSpecification)) {
                // get the string of the format specification
                let textFormatSpecification = rawItem.substring(indexOfFormatSpecification + 1, rawItem.length);
                // convert the format specification string to a IFormatSpecification
                this._formatSpecification = editStringHelper_1.EditStringHelper.getFormatSpecificationFromText(textFormatSpecification, argumentList);
                // get string index for the argument list
                this._dataSource = rawItem.substring(0, indexOfFormatSpecification);
            }
        }
        /**
         * get the string which refers to a data source
         *
         * @readonly
         * @type {string}
         * @memberof FormatItem
         */
        get dataSource() {
            return this._dataSource;
        }
        /**
         * get the format specification of the format item
         *
         * @readonly
         * @type {IFormatSpecification}
         * @memberof FormatItem
         */
        get formatSpecification() {
            return this._formatSpecification;
        }
        /**
         * get the type of the data source
         *
         * @readonly
         * @type {DataSourceTypes}
         * @memberof FormatItem
         */
        get dataSourceType() {
            return this._dataSourceType;
        }
        /**
         * Checks if the processed format item need to be processed again for inner format items
         *
         * @private
         * @return {*}  {boolean}
         * @memberof FormatItem
         */
        isRecursive() {
            // add recursive data sources with or || if there are more 
            if (this._dataSourceType == DataSourceTypes.external) {
                return true;
            }
            else {
                return false;
            }
        }
        /**
         * get the type of the data source
         *
         * @private
         * @param {string} identifier
         * @return {*}  {DataSourceType}
         * @memberof FormatItem
         */
        getDataSourceType(identifier) {
            // check if it is a external data source item ("$")
            if (identifier === formatItemIdentifier_1.FormatItemIdentifier.externalDataSource) {
                return DataSourceTypes.external;
            }
            else {
                return DataSourceTypes.argument;
            }
        }
        /**
         * remove the datasource identifier from the raw Item
         *
         * @private
         * @param {string} rawItem
         * @return {*}  {string}
         * @memberof FormatItem
         */
        removeIdentifiers(rawItem) {
            if (this._dataSourceType === DataSourceTypes.external) {
                return rawItem.substring(1, rawItem.length);
            }
            else {
                return rawItem;
            }
        }
    };
    FormatItem = __decorate([
        mco.role()
    ], FormatItem);
    exports.FormatItem = FormatItem;
});
