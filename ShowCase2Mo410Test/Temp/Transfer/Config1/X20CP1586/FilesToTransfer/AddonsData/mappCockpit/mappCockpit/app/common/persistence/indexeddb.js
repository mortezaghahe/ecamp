var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./interfaces/storageInterface", "./interfaces/indexeddbCommandInterface", "../utilities/versionNumberProvider"], function (require, exports, storageInterface_1, indexeddbCommandInterface_1, versionNumberProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Indexeddb = void 0;
    let Indexeddb = class Indexeddb {
        constructor() {
            /**
             * Some events from the storage(e.g dataLoaded, storageInitialized,...)
             *
             * @memberof Indexeddb
             */
            this.eventNotification = new storageInterface_1.StorageEventNotification();
            //private _data;
            this._location = 'mappCockpit';
            this._databaseWorker = new Worker("./common/persistence/indexdDBWorker.js");
        }
        connectStorage(location) {
            this._location = location;
            this._databaseWorker.onmessage = (event) => this.onMessageFromWorker(event.data);
            let command = new indexeddbCommandInterface_1.IndexedDBCommand(indexeddbCommandInterface_1.IndexedDBCommandMessage.init, { location: this._location, version: versionNumberProvider_1.VersionNumberProvider.getMappCockpitMainVersionNumber() });
            this._databaseWorker.postMessage(command);
        }
        loadData() {
            this._databaseWorker.onmessage = (event) => this.onMessageFromWorker(event.data);
            let command = new indexeddbCommandInterface_1.IndexedDBCommand(indexeddbCommandInterface_1.IndexedDBCommandMessage.load, {});
            this._databaseWorker.postMessage(command);
        }
        /*retrieveData() : any{
            if(this._data != undefined){
                return this._data
            }
            else {
                console.log("data not defined");
            }
        }*/
        saveData(key, data) {
            let dbWorkerCommand = new indexeddbCommandInterface_1.IndexedDBCommand(indexeddbCommandInterface_1.IndexedDBCommandMessage.store, { data: data, key: key });
            this._databaseWorker.postMessage(dbWorkerCommand);
        }
        ;
        clear() {
            let command = new indexeddbCommandInterface_1.IndexedDBCommand(indexeddbCommandInterface_1.IndexedDBCommandMessage.clear, { location: this._location, version: versionNumberProvider_1.VersionNumberProvider.getMappCockpitMainVersionNumber() });
            this._databaseWorker.postMessage(command);
        }
        /**
         * called when the background worker finished a task,
         * used to raise the event of this storage(data loaded, ...)
         *
         * @private
         * @param {IndexedDBCommand} indexedDBCommand
         * @memberof Indexeddb
         */
        onMessageFromWorker(indexedDBCommand) {
            let eventNotificationType = this.getEventNotificationType(indexedDBCommand.message);
            let eventNotificationData = this.getEventNotificationData(indexedDBCommand);
            if (eventNotificationType != undefined) {
                this.eventNotification.raise(this, new storageInterface_1.StorageEventNotificationArgs(eventNotificationType, eventNotificationData));
            }
        }
        /**
         * get data from indexedDB command(from worker) which should be raised from this storage class
         *
         * @private
         * @param {IndexedDBCommand} indexedDBCommand
         * @returns {*}
         * @memberof Indexeddb
         */
        getEventNotificationData(indexedDBCommand) {
            if (indexedDBCommand.message == indexeddbCommandInterface_1.IndexedDBCommandMessage.load) {
                return indexedDBCommand.data.data;
            }
            return undefined;
        }
        /**
         * Convert IndexedDbCommand type to StorageEventType
         *
         * @private
         * @param {IndexedDBCommand} indexedDBCommandMessage
         * @returns {(StorageEventNotificationType|undefined)}
         * @memberof Indexeddb
         */
        getEventNotificationType(indexedDBCommandMessage) {
            if (indexedDBCommandMessage == indexeddbCommandInterface_1.IndexedDBCommandMessage.load) {
                return storageInterface_1.StorageEventNotificationType.dataLoaded;
            }
            else if (indexedDBCommandMessage == indexeddbCommandInterface_1.IndexedDBCommandMessage.store) {
                return storageInterface_1.StorageEventNotificationType.dataSaved;
            }
            else if (indexedDBCommandMessage == indexeddbCommandInterface_1.IndexedDBCommandMessage.success) {
                return storageInterface_1.StorageEventNotificationType.storageConnected;
            }
            else if (indexedDBCommandMessage == indexeddbCommandInterface_1.IndexedDBCommandMessage.clear) {
                return storageInterface_1.StorageEventNotificationType.storageCleared;
            }
            else if (indexedDBCommandMessage == indexeddbCommandInterface_1.IndexedDBCommandMessage.error) {
                return storageInterface_1.StorageEventNotificationType.error;
            }
            return undefined;
        }
    };
    Indexeddb = __decorate([
        mco.role()
    ], Indexeddb);
    exports.Indexeddb = Indexeddb;
});
