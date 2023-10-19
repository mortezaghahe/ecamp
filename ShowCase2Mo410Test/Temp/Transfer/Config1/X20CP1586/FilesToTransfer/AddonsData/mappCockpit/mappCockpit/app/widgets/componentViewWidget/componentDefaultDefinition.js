var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../splitterWidget/splitterDefinition", "../../common/componentBase/componentSettings", "../common/splitterComponentSettings", "../common/componentDefaultDefinitionWidgetBase", "../../common/componentBase/componentDefaultSettingsPackage", "../../framework/componentHub/bindings/bindingDeclarations"], function (require, exports, splitterDefinition_1, componentSettings_1, splitterComponentSettings_1, componentDefaultDefinitionWidgetBase_1, componentDefaultSettingsPackage_1, Binding) {
    "use strict";
    var ComponentDefaultDefinition_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDefaultDefinition = void 0;
    let ComponentDefaultDefinition = ComponentDefaultDefinition_1 = class ComponentDefaultDefinition extends componentDefaultDefinitionWidgetBase_1.ComponentDefaultDefinitionWidgetBase {
        constructor() {
            super(...arguments);
            this.defaultComponentSettingsId = "componentViewWidgetDefinition";
            this.MainSplitterDefinitionId = "componentViewMainSplitterDefinition";
            this.TopSplitterDefinitionId = "componentViewTopSplitterDefinition";
        }
        /**
         * Returns the default component settings for this widget
         *
         * @returns {ComponentSettings}
         * @memberof ComponentDefaultDefinition
         */
        getDefaultComponentSettings() {
            let componentSettings = new componentSettings_1.ComponentSettings();
            componentSettings.addSubComponent("SplitterWidget", ComponentDefaultDefinition_1.SplitterWidgetComponentViewId, this.MainSplitterDefinitionId);
            componentSettings.addBindingByDecl(Binding.Components.Component.Connect, "", "connectComponent");
            componentSettings.addBindingByDecl(Binding.Components.Component.Disconnect, "", "disconnectComponent");
            return componentSettings;
        }
        getMainSplitterDefinition() {
            let splitterComponentSettings = new splitterComponentSettings_1.SplitterComponentSettings(splitterDefinition_1.SplitterDefinition.orientationVertical);
            splitterComponentSettings.addPane("SplitterWidget", ComponentDefaultDefinition_1.SplitterWidgetTopSplitterId, this.TopSplitterDefinitionId, splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(-1));
            splitterComponentSettings.addPane("MessagesWidget", ComponentDefaultDefinition_1.ComponentViewMessagesWidgetId, "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(110));
            return splitterComponentSettings;
        }
        getTopSplitterDefinition() {
            let splitterComponentSettings = new splitterComponentSettings_1.SplitterComponentSettings(splitterDefinition_1.SplitterDefinition.orientationHorizontal);
            splitterComponentSettings.addPane("MethodsWidget", ComponentDefaultDefinition_1.MethodsWidgetId, "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(400));
            splitterComponentSettings.addPane("WatchablesWidget", ComponentDefaultDefinition_1.WatchablesWidgetId, "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(-1));
            splitterComponentSettings.addPane("ConfigManagerWidget", ComponentDefaultDefinition_1.ConfigManagerWidgetId, "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(750));
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
            defaultSettingsPackages.push(new componentDefaultSettingsPackage_1.ComponentDefaultSettingsPackage(this.MainSplitterDefinitionId, this.getMainSplitterDefinition()));
            defaultSettingsPackages.push(new componentDefaultSettingsPackage_1.ComponentDefaultSettingsPackage(this.TopSplitterDefinitionId, this.getTopSplitterDefinition()));
            return defaultSettingsPackages;
        }
    };
    ComponentDefaultDefinition.SplitterWidgetComponentViewId = "SplitterWidget_ComponentView";
    ComponentDefaultDefinition.SplitterWidgetTopSplitterId = "SplitterWidget_TopSplitter";
    ComponentDefaultDefinition.ComponentViewMessagesWidgetId = "ComponentViewMessagesWidget";
    ComponentDefaultDefinition.MethodsWidgetId = "MethodsWidget";
    ComponentDefaultDefinition.WatchablesWidgetId = "WatchablesWidget";
    ComponentDefaultDefinition.ConfigManagerWidgetId = "ConfigManagerWidget";
    ComponentDefaultDefinition = ComponentDefaultDefinition_1 = __decorate([
        mco.role()
    ], ComponentDefaultDefinition);
    exports.ComponentDefaultDefinition = ComponentDefaultDefinition;
});
