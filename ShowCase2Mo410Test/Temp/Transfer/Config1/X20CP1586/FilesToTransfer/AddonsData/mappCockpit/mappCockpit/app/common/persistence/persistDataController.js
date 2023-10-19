var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./interfaces/storageInterface", "./indexeddb", "../../framework/events"], function (require, exports, storageInterface_1, indexeddb_1, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PersistDataController = exports.PersistDataControllerEventNotificationType = void 0;
    var PersistDataControllerEventNotificationType;
    (function (PersistDataControllerEventNotificationType) {
        PersistDataControllerEventNotificationType[PersistDataControllerEventNotificationType["connected"] = 0] = "connected";
        PersistDataControllerEventNotificationType[PersistDataControllerEventNotificationType["dataLoaded"] = 1] = "dataLoaded";
        //dataCleared,
    })(PersistDataControllerEventNotificationType = exports.PersistDataControllerEventNotificationType || (exports.PersistDataControllerEventNotificationType = {}));
    let PersistDataControllerEventNotification = class PersistDataControllerEventNotification extends events_1.TypedEvent {
    };
    PersistDataControllerEventNotification = __decorate([
        mco.role()
    ], PersistDataControllerEventNotification);
    ;
    let PersistDataController = class PersistDataController {
        /**
         * Creates an instance of PersistDataController
         * @param {(PersistDataProvider|undefined)} dataProvider
         * @memberof PersistDataController
         */
        constructor(dataProvider) {
            /**
             * Handler for the events from the storage
             *
             * @private
             * @memberof PersistDataController
             */
            this._storageNotificationHandler = (sender, eventArgs) => { this.handleStorageNotification(sender, eventArgs); };
            /**
             * Event of the persist data controller(connected, data loaded, ....)
             *
             * @memberof PersistDataController
             */
            this.eventNotification = new PersistDataControllerEventNotification();
            this._defaultStorage = new indexeddb_1.Indexeddb();
            this._dataProvider = dataProvider;
            if (this._dataProvider != undefined) {
                this._dataProvider.dataChanged.attach((sender, args) => this.dataProviderDataChanged(sender, args));
            }
        }
        /**
         * handler for the events from the dafault storage
         *
         * @private
         * @param {*} sender
         * @param {StorageEventNotificationType} eventArgs
         * @memberof PersistDataController
         */
        handleStorageNotification(sender, eventArgs) {
            if (eventArgs.type == storageInterface_1.StorageEventNotificationType.storageConnected) {
                this._defaultStorage.eventNotification.detach(this._storageNotificationHandler);
                this.eventNotification.raise(this, PersistDataControllerEventNotificationType.connected);
            }
            if (eventArgs.type == storageInterface_1.StorageEventNotificationType.dataLoaded) {
                this._defaultStorage.eventNotification.detach(this._storageNotificationHandler);
                let dataFromStorage = eventArgs.data;
                if (dataFromStorage != undefined) {
                    if (this._dataProvider != undefined) {
                        this._dataProvider.setData(dataFromStorage);
                    }
                }
                this.eventNotification.raise(this, PersistDataControllerEventNotificationType.dataLoaded);
            }
            /*if(eventArgs.type == StorageEventNotificationType.storageCleared){ // TODO: No storageCleared event is thrown!
                this._defaultStorage.eventNotification.detach(this._storageNotificationHandler);
                this.eventNotification.raise(this, PersistDataControllerEventNotificationType.dataCleared);
            }*/
        }
        /**
         * Connect to the defaultStorage
         *
         * @memberof PersistDataController
         */
        connect() {
            this._defaultStorage.eventNotification.attach(this._storageNotificationHandler);
            this._defaultStorage.connectStorage('mappCockpit');
        }
        /**
         * Save data with the given key to the defaultStorage
         *
         * @param {*} key
         * @param {*} data
         * @memberof PersistDataController
         */
        saveData(key, data) {
            if (this._dataProvider != undefined) {
                this._defaultStorage.saveData(key, data);
            }
        }
        /**
         * Load the whole data from the default storage
         *
         * @memberof PersistDataController
         */
        loadData() {
            this._defaultStorage.eventNotification.attach(this._storageNotificationHandler);
            this._defaultStorage.loadData();
        }
        /**
         * Removes all data from the default storage
         *
         * @memberof PersistDataController
         */
        clearDefaultStorage() {
            //this._defaultStorage.eventNotification.attach(this._storageNotificationHandler);
            this._defaultStorage.clear();
        }
        /**
         * Notification when data in the dataprovider has changed or added
         *
         * @param {PersistDataProvider} sender
         * @param {PersistDataChangedEventArgs} args
         * @memberof PersistDataController
         */
        dataProviderDataChanged(sender, args) {
            // Save data on every change
            this.saveData(args.id, args.data);
        }
    };
    PersistDataController = __decorate([
        mco.role()
    ], PersistDataController);
    exports.PersistDataController = PersistDataController;
});
