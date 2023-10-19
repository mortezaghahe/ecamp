var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../splitterWidget/splitterDefinition", "../../common/componentBase/componentSettings", "../common/splitterComponentSettings", "../common/componentDefaultDefinitionWidgetBase", "../../common/componentBase/componentDefaultSettingsPackage"], function (require, exports, splitterDefinition_1, componentSettings_1, splitterComponentSettings_1, componentDefaultDefinitionWidgetBase_1, componentDefaultSettingsPackage_1) {
    "use strict";
    var ComponentDefaultDefinition_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDefaultDefinition = void 0;
    let ComponentDefaultDefinition = ComponentDefaultDefinition_1 = class ComponentDefaultDefinition extends componentDefaultDefinitionWidgetBase_1.ComponentDefaultDefinitionWidgetBase {
        constructor() {
            super(...arguments);
            this.defaultComponentSettingsId = "traceConfigurationDefinition";
        }
        /**
         * Returns the default component settings for this widget
         *
         * @returns {ComponentSettings}
         * @memberof ComponentDefaultDefinition
         */
        getDefaultComponentSettings() {
            let componentSettings = new componentSettings_1.ComponentSettings();
            componentSettings.addSubComponent("SplitterWidget", ComponentDefaultDefinition_1.SplitterWidgetTraceConfigurationId, ComponentDefaultDefinition_1.MainSplitterDefinitionId);
            return componentSettings;
        }
        getMainSplitterDefinition() {
            let splitterComponentSettings = new splitterComponentSettings_1.SplitterComponentSettings(splitterDefinition_1.SplitterDefinition.orientationHorizontal);
            splitterComponentSettings.addPane("TraceConfigDatapointsWidget", ComponentDefaultDefinition_1.TraceConfigDatapointsWidgetId, "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(-1));
            splitterComponentSettings.addPane("TraceConfigTimingWidget", ComponentDefaultDefinition_1.TraceConfigTimingWidgetId, "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(570));
            splitterComponentSettings.addPane("TraceConfigTriggerWidget", ComponentDefaultDefinition_1.TraceConfigTriggerWidgetId, "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(500));
            return splitterComponentSettings;
        }
        /**
         * Adds some default persisting data packages in the main default persisting data provider
         *
         * @returns {(ComponentDefaultSettingsPackage[]| undefined)}
         * @memberof ComponentDefaultDefinition
         */
        getAdditionalDefaultComponentSettings() {
            let defaultSettingsPackages = new Array();
            defaultSettingsPackages.push(new componentDefaultSettingsPackage_1.ComponentDefaultSettingsPackage(ComponentDefaultDefinition_1.MainSplitterDefinitionId, this.getMainSplitterDefinition()));
            return defaultSettingsPackages;
        }
    };
    ComponentDefaultDefinition.SplitterWidgetTraceConfigurationId = "SplitterWidget_TraceConfiguration";
    ComponentDefaultDefinition.TraceConfigDatapointsWidgetId = "TraceConfigDatapointsWidget";
    ComponentDefaultDefinition.TraceConfigTimingWidgetId = "TraceConfigTimingWidget";
    ComponentDefaultDefinition.TraceConfigTriggerWidgetId = "TraceConfigTriggerWidget";
    ComponentDefaultDefinition.MainSplitterDefinitionId = "traceConfigurationMainSplitterDefinition";
    ComponentDefaultDefinition = ComponentDefaultDefinition_1 = __decorate([
        mco.role()
    ], ComponentDefaultDefinition);
    exports.ComponentDefaultDefinition = ComponentDefaultDefinition;
});
