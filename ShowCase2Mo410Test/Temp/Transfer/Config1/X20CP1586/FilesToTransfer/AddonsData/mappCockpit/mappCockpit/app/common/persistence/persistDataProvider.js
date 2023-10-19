var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../framework/events", "./persistDataChangedEventArgs"], function (require, exports, events_1, persistDataChangedEventArgs_1) {
    "use strict";
    var PersistDataProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PersistDataProvider = void 0;
    let DataChanged = class DataChanged extends events_1.TypedEvent {
    };
    DataChanged = __decorate([
        mco.role()
    ], DataChanged);
    ;
    let PersistDataProvider = PersistDataProvider_1 = class PersistDataProvider {
        /**
         * gets a singleton instance of PersistDataProvider
         *
         * @readonly
         * @type {PersistDataProvider}
         * @memberof PersistDataProvider
         */
        static getInstance() {
            this._instance = this._instance ? this._instance : new PersistDataProvider_1();
            return this._instance;
        }
        /**
         * Creates an instance of PersistDataProvider
         * @memberof PersistDataProvider
         */
        constructor() {
            this.dataChanged = new DataChanged();
            /**
             * Holds all of the persisting data
             *
             * @private
             * @type {{ [id: string]: any; }}
             * @memberof PersistDataProvider
             */
            this._data = {};
            /**
             * Holds default persisting/settings data (TODO: Move to seperated class/provider)
             *
             * @private
             * @type {{ [id: string]: any; }}
             * @memberof PersistDataProvider
             */
            this._defaultData = {};
        }
        /**
         * Get the whole data from this data provider
         *
         * @returns {*}
         * @memberof PersistDataProvider
         */
        getData() {
            return this._data;
        }
        /**
         * Set the whole data of this data provider
         *
         * @param {*} data
         * @memberof PersistDataProvider
         */
        setData(data) {
            this._data = data;
        }
        /**
         * Get data from this dataprovider with the given id
         *
         * @param {string} id
         * @returns {*}
         * @memberof PersistDataProvider
         */
        getDataWithId(id) {
            return this._data[id];
        }
        /**
         * Set data to this dataprovider with the given id
         *
         * @param {string} id
         * @param {*} data
         * @memberof PersistDataProvider
         */
        setDataWithId(id, data) {
            this._data[id] = data;
            this.onDataChanged(id, data);
        }
        /**
         * Get default data from this dataprovider with the given id
         *
         * @param {string} id
         * @returns {ComponentSettings}
         * @memberof PersistDataProvider
         */
        getDefaultDataWithId(id) {
            return this._defaultData[id];
        }
        /**
         * Set data to this dataprovider with the given id
         *
         * @param {string} id
         * @param {ComponentSettings} data
         * @memberof PersistDataProvider
         */
        setDefaultDataWithId(id, data) {
            this._defaultData[id] = data;
        }
        /**
         * Raise dataChanged event
         *
         * @private
         * @param {string} id
         * @param {*} data
         * @memberof PersistDataProvider
         */
        onDataChanged(id, data) {
            let eventArgs = new persistDataChangedEventArgs_1.PersistDataChangedEventArgs();
            eventArgs.id = id;
            eventArgs.data = data;
            this.dataChanged.raise(this, eventArgs);
        }
    };
    PersistDataProvider = PersistDataProvider_1 = __decorate([
        mco.role()
    ], PersistDataProvider);
    exports.PersistDataProvider = PersistDataProvider;
});
