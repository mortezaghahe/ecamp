var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/persistence/settings", "./signalManagerDataModelSettingIds", "../common/signal/serieContainer", "../common/signal/serieGroup"], function (require, exports, settings_1, signalManagerDataModelSettingIds_1, serieContainer_1, serieGroup_1) {
    "use strict";
    var SignalCategory_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalCategory = void 0;
    let SignalCategory = SignalCategory_1 = class SignalCategory extends serieContainer_1.SerieContainer {
        /**
         * Creates an instance of a signal category
         * @param {string} id
         * @memberof SignalCategory
         */
        constructor(id) {
            super(SignalCategory_1.getDisplayName(id), id);
            this.id = id;
            this.canDelete = false;
        }
        /**
         * Returns the settings of this signal category
         *
         * @returns {ISettings}
         * @memberof SignalCategory
         */
        getSettings() {
            let settings = new settings_1.Settings("category");
            settings.setValue("id", this.id);
            settings.setValue("expandState", this.expandState);
            let seriesGroupsData = new Array();
            // get all serie groups from this category
            this.getChilds().forEach(container => {
                if (container instanceof serieGroup_1.SerieGroup) {
                    // add serie group settings
                    seriesGroupsData.push(container.getSettings());
                }
                else if (container instanceof serieContainer_1.SerieContainer) {
                    // Import file category
                    let serieGroups = container.getChilds(); // serie groups of an imported file
                    for (let i = 0; i < serieGroups.length; i++) {
                        let group = serieGroups[i];
                        if (group instanceof serieGroup_1.SerieGroup) {
                            seriesGroupsData.push(group.getSettings());
                        }
                    }
                }
            });
            settings.setValue(signalManagerDataModelSettingIds_1.SettingIds.SerieGroups, seriesGroupsData);
            return settings;
        }
        /**
         * Sets the given settings to this signal category (id can not be changed currently)
         *
         * @param {ISettings} settings
         * @memberof SignalCategory
         */
        setSettings(settings) {
            let settingsObj = settings_1.Settings.create(settings);
            this.expandState = settingsObj.data.expandState;
            settingsObj.getValue(signalManagerDataModelSettingIds_1.SettingIds.SerieGroups).forEach(importSerieGroup => {
                let container;
                if (this.id == SignalCategory_1.CategoryIdImported) { // import category needs additionally container(file container)
                    container = this.getOrCreateContainer(importSerieGroup.data[signalManagerDataModelSettingIds_1.SettingIds.ContainerName], importSerieGroup.data[signalManagerDataModelSettingIds_1.SettingIds.ContainerId], importSerieGroup.data[signalManagerDataModelSettingIds_1.SettingIds.ContainerExpandState]);
                }
                else {
                    container = this;
                }
                // add default group to container
                let serieGroup = new serieGroup_1.SerieGroup("", "", 0);
                container.addSerieContainer(serieGroup);
                // set group data
                serieGroup.setSettings(importSerieGroup);
            });
        }
        /**
         * Returns the found serieContainer or creats and adds a new serieContainer with the given containerName
         *
         * @private
         * @param {string} containerName
         * @param {string} containerId
         * @param {boolean} expandState
         * @returns {ISerieContainer}
         * @memberof SignalCategory
         */
        getOrCreateContainer(containerName, containerId, expandState) {
            // Search for existing container
            let foundContainer = this.getSerieContainerById(containerId);
            if (foundContainer != undefined) {
                return foundContainer;
            }
            // Create new container
            let container = new serieContainer_1.SerieContainer(containerName, containerId, expandState);
            this.addSerieContainer(container, -1);
            return container;
        }
        /**
         * Returns the display name for the given category id
         *
         * @private
         * @param {string} id
         * @returns
         * @memberof SignalCategory
         */
        static getDisplayName(id) {
            // get displaynames of the category
            if (id == SignalCategory_1.CategoryIdRecent) {
                return "Recent";
            }
            else if (id == SignalCategory_1.CategoryIdUploaded) {
                return "All uploaded from PLC";
            }
            else if (id == SignalCategory_1.CategoryIdImported) {
                return "Imported from file";
            }
            else if (id == SignalCategory_1.CategoryIdCalculated) {
                return "Calculated signals";
            }
            return "Unknown category id";
        }
    };
    SignalCategory.CategoryIdRecent = "Recent";
    SignalCategory.CategoryIdUploaded = "Uploaded";
    SignalCategory.CategoryIdImported = "Imported";
    SignalCategory.CategoryIdCalculated = "Calculated";
    SignalCategory = SignalCategory_1 = __decorate([
        mco.role()
    ], SignalCategory);
    exports.SignalCategory = SignalCategory;
});
