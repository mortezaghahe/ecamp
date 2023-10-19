var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/componentBase/componentSettings", "../common/componentDefaultDefinitionWidgetBase"], function (require, exports, componentSettings_1, componentDefaultDefinitionWidgetBase_1) {
    "use strict";
    var ComponentDefaultDefinition_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDefaultDefinition = void 0;
    let ComponentDefaultDefinition = ComponentDefaultDefinition_1 = class ComponentDefaultDefinition extends componentDefaultDefinitionWidgetBase_1.ComponentDefaultDefinitionWidgetBase {
        constructor() {
            super(...arguments);
            this.defaultComponentSettingsId = "mappCockpitWidgetDefinition";
        }
        /**
         * Returns the default component settings for this widget
         *
         * @returns {ComponentSettings}
         * @memberof ComponentDefaultDefinition
         */
        getDefaultComponentSettings() {
            let componentSettings = new componentSettings_1.ComponentSettings();
            // add all subcomponents
            // add Image provider in the mappCockpit widget to trigger the initialization
            componentSettings.addSubComponent("ImageProvider", ComponentDefaultDefinition_1.ImageProviderId);
            // needed for disconnected screen
            componentSettings.addSubComponent("CommonLayoutProvider", ComponentDefaultDefinition_1.CommonLayoutProviderId);
            componentSettings.addSubComponent("MappCockpitDataModel", ComponentDefaultDefinition_1.MappCockpitDataModelId);
            componentSettings.addSubComponent("MainNavigationWidget", ComponentDefaultDefinition_1.MainNavigationWidgetId);
            return componentSettings;
        }
    };
    ComponentDefaultDefinition.MappCockpitDataModelId = "MappCockpitDataModel";
    ComponentDefaultDefinition.MainNavigationWidgetId = "MainNavigationWidget";
    ComponentDefaultDefinition.ComponentOverviewWidgetId = "ComponentOverviewWidget";
    ComponentDefaultDefinition.TraceOverviewWidgetId = "TraceOverviewWidget";
    ComponentDefaultDefinition.ToolsOverviewWidgetId = "ToolsOverviewWidget";
    ComponentDefaultDefinition.StartPageWidgetId = "StartPageWidget";
    ComponentDefaultDefinition.LoginWidgetId = "LoginWidget";
    ComponentDefaultDefinition.DummyWidgetId = "DummyWidget";
    ComponentDefaultDefinition = ComponentDefaultDefinition_1 = __decorate([
        mco.role()
    ], ComponentDefaultDefinition);
    exports.ComponentDefaultDefinition = ComponentDefaultDefinition;
});
