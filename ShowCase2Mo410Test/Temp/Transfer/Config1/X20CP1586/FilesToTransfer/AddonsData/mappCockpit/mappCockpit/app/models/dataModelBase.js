var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./dataModelInterface"], function (require, exports, dataModelInterface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataModelItemObserver = exports.DataModelBase = void 0;
    /**
     * implements the base interface for observing data model items
     *
     * @class DataModelItemObserver
     * @implements {IDataModelItemObserver}
     */
    let DataModelItemObserver = class DataModelItemObserver {
        constructor() {
            // declare event for notifying model item changes
            this.eventModelItemsChanged = new dataModelInterface_1.EventModelChanged();
        }
        /**
         * method for invoking the observation of model items
         *
         * @param {any[]} observableItems
         * @memberof DataModelItemObserver
         */
        observeModelItems(observableItems) {
            // has to be overloaded in a concretized data model
            throw new Error("Method not implemented.");
        }
        /**
         * notification method called when model items has changed
         *
         * @param {IDataModel} sender
         * @param {EventModelChangedArgs} data
         * @memberof DataModelItemObserver
         */
        onModelItemsChanged(sender, data) {
            // raise the model items changed event
            this.eventModelItemsChanged.raise(sender, data);
        }
        /**
         * method for handling model item changes
         *
         * @param {IDataModel} sender
         * @param {EventModelChangedArgs} data
         * @memberof DataModelItemObserver
         */
        handleModelItemsChanged(sender, data) {
        }
    };
    DataModelItemObserver = __decorate([
        mco.role()
    ], DataModelItemObserver);
    exports.DataModelItemObserver = DataModelItemObserver;
    /**
     * implements the base class for data models.
     *
     * @abstract
     * @class DataModelBase
     * @implements {IDataModel}
     */
    let DataModelBase = class DataModelBase extends DataModelItemObserver {
        constructor() {
            super(...arguments);
            // event declarations
            this.eventModelChanged = new dataModelInterface_1.EventModelChanged();
            this.eventModelInitialized = new dataModelInterface_1.EventModelInitialized();
            this._isPersistEnabled = false;
        }
        connect() {
        }
        initialize() {
            this.component.loadComponentSettings();
            this.initialized();
            this._isPersistEnabled = true;
        }
        initializeComponent() {
        }
        initialized() {
        }
        clear() {
        }
        dispose() {
            this._isPersistEnabled = false;
        }
        getComponentSettings(onlyModified) {
            return this.component.getComponentSettings(onlyModified);
        }
        setComponentSettings(componentSettings) {
            this.component.setComponentSettings(componentSettings);
        }
        saveSettings() {
            if (this._isPersistEnabled) {
                this.component.saveComponentSettings();
            }
        }
        get data() {
            return this._data;
        }
        set data(data) {
            this._data = data;
        }
        get dataSource() {
            return this._dataSource;
        }
        set dataSource(dataSource) {
            this._dataSource = dataSource;
        }
        onModelChanged(sender, data) {
            this.eventModelChanged.raise(sender, data);
            this.saveSettings();
        }
        onModelInitialized(sender, data) {
            this.eventModelInitialized.raise(sender, data);
        }
        handleModelChanged(sender, data) { }
    };
    DataModelBase = __decorate([
        mco.role()
    ], DataModelBase);
    exports.DataModelBase = DataModelBase;
});
