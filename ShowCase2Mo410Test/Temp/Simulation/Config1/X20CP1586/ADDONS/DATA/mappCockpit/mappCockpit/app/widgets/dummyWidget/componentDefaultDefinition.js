var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/componentBase/componentSettings", "../splitterWidget/splitterDefinition", "../common/splitterComponentSettings", "../common/componentDefaultDefinitionWidgetBase"], function (require, exports, componentSettings_1, splitterDefinition_1, splitterComponentSettings_1, componentDefaultDefinitionWidgetBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDefaultDefinition = void 0;
    let ComponentDefaultDefinition = class ComponentDefaultDefinition extends componentDefaultDefinitionWidgetBase_1.ComponentDefaultDefinitionWidgetBase {
        constructor() {
            super(...arguments);
            this.defaultComponentSettingsId = "dummyWidgetDefinition3";
        }
        /**
         * Returns the default component settings for this widget
         *
         * @returns {ComponentSettings}
         * @memberof ComponentDefaultDefinition
         */
        getDefaultComponentSettings() {
            let componentSettings = new componentSettings_1.ComponentSettings();
            //componentSettings.addSubComponent("SplitterWidget", ComponentDefaultDefinition.mainWidgetId, ComponentDefaultDefinition.DummySplitterDefinitionId);
            return componentSettings;
        }
        /**
         * Returns the default persisting data for splitter
         *
         * @static
         * @returns {*}
         * @memberof ComponentDefaultDefinition
         */
        getDummySplitterDefinition() {
            let splitterComponentSettings = new splitterComponentSettings_1.SplitterComponentSettings(splitterDefinition_1.SplitterDefinition.orientationVertical);
            splitterComponentSettings.addPane("ComponentOverviewWidget", "ComponentOverviewWidgetId", "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(-1));
            splitterComponentSettings.addPane("TraceOverviewWidget", "TraceOverviewWidgetId", "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(250));
            splitterComponentSettings.addPane("ToolsOverviewWidget", "ToolsOverviewWidgetId", "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(250));
            return splitterComponentSettings;
        }
        /**
         * Adds some default persisting data packages in the main default persisting data provider
         *
         * @private
         * @memberof ComponentDefaultDefinition
         */
        getAdditionalDefaultComponentSettings() {
            let defaultSettingsPackages = new Array();
            //defaultSettingsPackages.push(new ComponentDefaultSettingsPackage(ComponentDefaultDefinition.DummySplitterDefinitionId, this.getDummySplitterDefinition()));
            return defaultSettingsPackages;
        }
    };
    ComponentDefaultDefinition.mainWidgetId = "DummySplitterId3";
    ComponentDefaultDefinition.DummySplitterDefinitionId = "dummySplitterDefinition3";
    ComponentDefaultDefinition = __decorate([
        mco.role()
    ], ComponentDefaultDefinition);
    exports.ComponentDefaultDefinition = ComponentDefaultDefinition;
});
