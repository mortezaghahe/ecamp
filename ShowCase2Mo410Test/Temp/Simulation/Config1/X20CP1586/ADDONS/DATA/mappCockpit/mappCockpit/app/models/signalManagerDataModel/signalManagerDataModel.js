var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../dataModelInterface", "../../framework/events", "./eventSignalManagerDataChangedArgs", "./signalManagerCalculationInputData", "../../common/persistence/settings", "./signalManagerDataModelSettingIds", "./signalCategory", "./signalRoot", "../common/signal/serieContainer", "../dataModelBase", "./componentDefaultDefinition", "../common/signal/serieGroup"], function (require, exports, dataModelInterface_1, events_1, eventSignalManagerDataChangedArgs_1, signalManagerCalculationInputData_1, settings_1, signalManagerDataModelSettingIds_1, signalCategory_1, signalRoot_1, serieContainer_1, dataModelBase_1, componentDefaultDefinition_1, serieGroup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalManagerDataModel = void 0;
    let EventSignalRemoved = class EventSignalRemoved extends events_1.TypedEvent {
    };
    EventSignalRemoved = __decorate([
        mco.role()
    ], EventSignalRemoved);
    ;
    let SignalManagerDataModel = class SignalManagerDataModel extends dataModelBase_1.DataModelBase {
        constructor() {
            super(...arguments);
            this.eventSignalRemoved = new EventSignalRemoved();
            this._supressUpdate = false;
            this._editModeActive = false;
            this._dataChangedHandler = (sender, args) => this.onDataChanged(sender, args);
            this._settingsId = "categories";
        }
        get data() {
            return this._signalManagerData.childs;
        }
        /**
         * Returns the information if the datamodel provides data for the edit mode
         *
         * @type {boolean}
         * @memberof SignalManagerDataModel
         */
        get editModeActive() {
            return this._editModeActive;
        }
        /**
         * Sets the information if the datamodel should provide the data for "edit mode" or "normal mode"
         *
         * @memberof SignalManagerDataModel
         */
        set editModeActive(value) {
            this._editModeActive = value;
        }
        /**
         * Initialization of the signalmanager datamodel
         *
         * @memberof SignalManagerDataModel
         */
        initialize() {
            this._signalManagerData = new signalRoot_1.SignalRoot(this);
            this._signalManagerData.eventDataChanged.attach(this._dataChangedHandler);
            super.initialize();
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
        }
        dispose() {
            // Bugfix to avoid use of not unbinded datamodel
            this["disposed"] = true;
            super.dispose();
            this._signalManagerData.eventDataChanged.detach(this._dataChangedHandler);
        }
        /**
         * Removes all data from datamodel (excepting the root categories)
         *
         * @memberof SignalManagerDataModel
         */
        clear() {
            this._supressUpdate = true;
            this._signalManagerData.clear();
            this._supressUpdate = false;
            this.raiseModelChangedEvent(new eventSignalManagerDataChangedArgs_1.EventSignalManagerDataChangedArgs(eventSignalManagerDataChangedArgs_1.SignalManagerAction.clearAll, ""));
        }
        getComponentSettings(onlyModified) {
            let storingData = new Array();
            // get the settings from the categories
            for (let i = 0; i < this.data.length; i++) {
                let category = this.data[i];
                storingData.push(category.getSettings());
            }
            // add some component settings(e.g. categories with serie groups)
            this.component.setSetting(this._settingsId, storingData);
            return super.getComponentSettings(onlyModified);
        }
        setComponentSettings(componentSettings) {
            // Remove all old data
            this.clear();
            // Set the series Provider
            this.seriesProvider = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SeriesProviderId);
            // Set the settings to the base class
            super.setComponentSettings(componentSettings);
            // Set the settings to the categories
            let importCategories = this.component.getSetting(this._settingsId);
            if (importCategories != undefined) {
                for (let i = 0; i < importCategories.length; i++) {
                    let importCategory = importCategories[i];
                    let settings = settings_1.Settings.create(importCategory);
                    let category = this.getSignalCategory(settings.getValue(signalManagerDataModelSettingIds_1.SettingIds.CategoryId));
                    if (category != undefined) {
                        category.setSettings(importCategory);
                    }
                }
            }
        }
        /**
         * Adds a signal container to the datamodel (into the given category) // TODO: implement subcategory
         *
         * @param {ISerieContainer} serieContainer
         * @param {string} categoryId
         * @memberof SignalManagerDataModel
         */
        addSerieContainer(serieContainer, categoryId) {
            for (let i = 0; i < this._signalManagerData.childs.length; i++) {
                if (this._signalManagerData.childs[i].id == categoryId) {
                    this._signalManagerData.childs[i].addSerieContainer(serieContainer, 0);
                }
            }
        }
        /**
         * Removes the given signal container from the datamodel
         *
         * @param {ISerieContainer} serieContainer
         * @memberof SignalManagerDataModel
         */
        removeSerieContainer(serieContainer) {
            // Remove SerieContainer from category node ...
            this._signalManagerData.childs.forEach(category => {
                category.removeSerieContainer(serieContainer);
            });
        }
        /**
        * Adds a uploaded serie group to the datamodel(into recent category and creates a clone to all uploaded category )
        *
        * @param {ISerieGroup} serieGroup
        * @memberof SignalManagerDataModel
        */
        addUploadedSerieGroup(serieGroup) {
            let subCategoryRecent = this.getSignalCategory(signalCategory_1.SignalCategory.CategoryIdRecent);
            let subCategoryAll = this.getSignalCategory(signalCategory_1.SignalCategory.CategoryIdUploaded);
            if (subCategoryRecent != undefined && subCategoryAll != undefined) {
                let serieGroupClone;
                if (subCategoryRecent.getChilds().length > 0) { // Copy latest uploaded data to all if available
                    let latestSerieGroup = subCategoryRecent.getChilds()[0];
                    latestSerieGroup.mergeWithSerieGroup(serieGroup);
                    serieGroupClone = latestSerieGroup.clone();
                }
                else { // Add uploaded data to "recent" and clone to "all"
                    subCategoryRecent.addSerieContainer(serieGroup, -1);
                    serieGroupClone = this.getSerieGroupCloned(serieGroup);
                }
                if (serieGroupClone !== undefined) {
                    subCategoryAll.addSerieContainer(serieGroupClone, 0);
                }
                // TODO: Calculate after clone
            }
        }
        /**
         * Get a clone seriegroup just if it is not already in the 'all' folder
         *
         * @param {ISerieGroup} serieGroup
         * @returns {(ISerieGroup | undefined)}
         * @memberof SignalManagerDataModel
         */
        getSerieGroupCloned(serieGroup) {
            let allCategory = this.getSignalCategory(signalCategory_1.SignalCategory.CategoryIdUploaded);
            if (allCategory !== undefined) {
                let serieContainer = allCategory.getSerieContainerById(serieGroup.id);
                if (serieContainer !== undefined) { //SerieGroup already exists in 'All' Container.
                    return undefined;
                }
            }
            return serieGroup.clone();
        }
        /**
         * Returns the signal category with the given id // TODO: implement recursive, not only 2 levels
         *
         * @param {string} id
         * @returns {(ISignalCategory|undefined)}
         * @memberof SignalManagerDataModel
         */
        getSignalCategory(id) {
            let signalCategory;
            this.data.forEach(child => {
                if (child.id == id) {
                    signalCategory = child;
                }
                else {
                    child.getChilds().forEach(subChild => {
                        if (subChild instanceof signalCategory_1.SignalCategory) {
                            if (subChild.id == id) {
                                signalCategory = subChild;
                            }
                        }
                    });
                }
            });
            return signalCategory;
        }
        /**
       * Returns the serie group with the given startTriggerTime within the given container, else undefined
       *
       * @param {number} startTriggerTime
       * @returns {(ISerieGroup|undefined)}
       * @memberof SignalManagerDataModel
       */
        getSerieGroupByStartTriggerTime(container, startTriggerTime) {
            let childs = container.getChilds();
            for (let i = 0; i < childs.length; i++) {
                let node = childs[i];
                if (node instanceof serieGroup_1.SerieGroup) {
                    if (node.startTriggerTime == startTriggerTime) {
                        return node;
                    }
                    let serieGroup = this.getSerieGroupByStartTriggerTime(node, startTriggerTime);
                    if (serieGroup != undefined) {
                        return serieGroup;
                    }
                }
            }
            return undefined;
        }
        /**
         * Removes the given serieNode
         *
         * @param {ISerieNode} serieNode
         * @memberof SignalManagerDataModel
         */
        removeSerieNode(serieNode) {
            this._signalManagerData.childs.forEach(category => {
                category.removeSerieNode(serieNode);
            });
        }
        /**
         * Executed when some data was changed(signal or signalcontainer added or removed)
         *
         * @private
         * @param {*} sender
         * @param {EventSignalManagerDataChangedArgs} args
         * @memberof SignalManagerDataModel
         */
        onDataChanged(sender, args) {
            if (args.action == eventSignalManagerDataChangedArgs_1.SignalManagerAction.remove) {
                if (args.data instanceof serieContainer_1.SerieContainer) {
                    args.data.getSeries().forEach(serie => {
                        this.onSerieRemoved(serie);
                    });
                }
                else {
                    // send serie removed event
                    let serieNode = args.data;
                    if (serieNode != undefined && !(serieNode instanceof signalManagerCalculationInputData_1.SignalManagerCalculationInputData)) {
                        this.onSerieRemoved(serieNode.serie);
                    }
                }
            }
            if (this._supressUpdate == false) {
                this.raiseModelChangedEvent(args);
            }
        }
        /**
         * Raises the model changed event
         *
         * @private
         * @memberof SignalManagerDataModel
         */
        raiseModelChangedEvent(args) {
            // e.g. updates the signal manager widget
            let eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, args.action, this.data);
            this.onModelChanged(this, eventArgs);
        }
        /**
         * Raises the signal removed event
         *
         * @private
         * @param {BaseSeries} serie
         * @memberof SignalManagerDataModel
         */
        onSerieRemoved(serie) {
            if (serie != undefined) {
                this.eventSignalRemoved.raise(this, serie);
                if (this.seriesProvider != undefined) {
                    this.seriesProvider.remove(serie.id);
                }
            }
        }
    };
    SignalManagerDataModel = __decorate([
        mco.role()
    ], SignalManagerDataModel);
    exports.SignalManagerDataModel = SignalManagerDataModel;
});
