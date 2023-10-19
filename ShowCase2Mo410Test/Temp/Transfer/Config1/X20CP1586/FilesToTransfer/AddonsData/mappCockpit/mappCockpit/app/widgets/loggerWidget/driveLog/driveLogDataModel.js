var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./driveLogEntry", "../../../common/persistence/settings"], function (require, exports, driveLogEntry_1, settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DriveLogDataModel = void 0;
    /**
     * Datamodel implementation for the logger representation of the network command trace data
     *
     * @export
     * @class DriveLogDataModel
     */
    let DriveLogDataModel = class DriveLogDataModel {
        /**
         * Returns the data source of the datamodel
         *
         * @readonly
         * @type {Array<IDriveLogEntry>}
         * @memberof DriveLogDataModel
         */
        get dataSource() {
            return this._dataSource;
        }
        /**
         * Creates an instance of DriveLogDataModel
         * @memberof DriveLogDataModel
         */
        constructor() {
            /**
             * Holds the dataSource of this dataModel
             *
             * @private
             * @type {Array<any>}
             * @memberof DriveLogDataModel
             */
            this._dataSource = new Array();
        }
        /**
         * Returns the settings(export data) of this datamodel
         *
         * @returns {ISettings}
         * @memberof DriveLogDataModel
         */
        getSettings() {
            let settings = new settings_1.Settings("DriveLogDataModel", "1.0");
            let exportEntries = new Array();
            this.dataSource.forEach(entry => {
                exportEntries.push(entry.getExportData());
            });
            settings.setValue("entries", exportEntries);
            return settings;
        }
        /**
         * Sets the settings(export data) to this datamodel
         *
         * @param {ISettings} settings
         * @memberof DriveLogDataModel
         */
        setSettings(settings) {
            let settingsObj = settings_1.Settings.create(settings);
            if (settingsObj.version == "1.0") {
                let data = settingsObj.getValue("entries");
                this.setDataSourceWithImportData(data);
            }
            else {
                console.error("Importfile version not supported! (Version: " + settingsObj.version + ")");
            }
        }
        /**
         * Update datamodel with new network command trace data from nwct provider(data from target)
         *
         * @param {NwctProvider} nwctProvider
         * @memberof DriveLogDataModel
         */
        setNwctProvider(nwctProvider) {
            this._dataSource = this.getDataSourceFromNwctProvider(nwctProvider);
        }
        /**
         * Returns a valid datasource for the treegrid corresponding to the given nwct bin data
         *
         * @private
         * @param {NwctProvider} nwctProvider
         * @returns
         * @memberof DriveLogDataModel
         */
        getDataSourceFromNwctProvider(nwctProvider) {
            let dataSource = new Array();
            let sortedEntries = nwctProvider.entries;
            sortedEntries.forEach(dataRecord => {
                if (!dataRecord.isResponse) { // TODO: add responses without request and show correct
                    let record = this.getRecord(dataRecord);
                    dataSource.push(record);
                }
                else {
                    // Search for response without request and add them also
                    if (!dataRecord.requestEntry) {
                        let record = this.getRecord(dataRecord);
                        dataSource.push(record);
                    }
                }
            });
            return dataSource;
        }
        /**
         * Sets the import data to the datasource of this datamdodel
         *
         * @private
         * @param {*} importData
         * @memberof DriveLogDataModel
         */
        setDataSourceWithImportData(importData) {
            let dataSource = new Array();
            importData.forEach(importEntry => {
                let entry = new driveLogEntry_1.DriveLogEntry(undefined, importEntry);
                dataSource.push(entry);
            });
            this._dataSource = dataSource;
        }
        /**
         * Returns a logger representation network command trace record
         *
         * @private
         * @param {INwctDataEntry} dataRecord
         * @returns {IDriveLogEntry}
         * @memberof DriveLogDataModel
         */
        getRecord(dataRecord) {
            return new driveLogEntry_1.DriveLogEntry(dataRecord);
        }
    };
    DriveLogDataModel = __decorate([
        mco.role()
    ], DriveLogDataModel);
    exports.DriveLogDataModel = DriveLogDataModel;
});
