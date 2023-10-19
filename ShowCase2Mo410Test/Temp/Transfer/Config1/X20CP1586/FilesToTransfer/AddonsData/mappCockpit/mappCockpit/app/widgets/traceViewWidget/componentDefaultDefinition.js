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
            this.defaultComponentSettingsId = "traceViewDefinition";
            this.MainSplitterDefinitionId = "traceViewMainSplitterDefinition";
            this.InnerSplitterDefinitionId = "traceViewInnerSplitterDefinition";
            this.RightSplitterDefinitionId = "traceViewRightSplitterDefinition";
        }
        /**
         * Returns the default component settings for this widget
         *
         * @returns {ComponentSettings}
         * @memberof ComponentDefaultDefinition
         */
        getDefaultComponentSettings() {
            let componentSettings = new componentSettings_1.ComponentSettings();
            // add sub compontents
            componentSettings.addSubComponent("SeriesProvider", ComponentDefaultDefinition_1.SeriesProviderId);
            componentSettings.addSubComponent("SplitterWidget", ComponentDefaultDefinition_1.SplitterWidgetTraceViewId, this.MainSplitterDefinitionId);
            // Add bindings
            componentSettings.addBindingByDecl(Binding.Traces.TraceData.Load, "", "invokeLoadTraceData");
            componentSettings.addBindingByDecl(Binding.Traces.TraceData.Loaded, "onTraceDataLoaded", "");
            componentSettings.addBindingByDecl(Binding.Traces.TraceData.LoadingError, "onErrorLoadingTraceData", "");
            componentSettings.addBindingByDecl(Binding.Traces.State, "onTraceStateChanged", "");
            componentSettings.addBindingByDecl(Binding.Traces.AvailableDataPoints, "updateAvailableDataPoints", "");
            return componentSettings;
        }
        getMainSplitterDefinition() {
            let splitterComponentSettings = new splitterComponentSettings_1.SplitterComponentSettings(splitterDefinition_1.SplitterDefinition.orientationVertical);
            splitterComponentSettings.addPane("TraceControlWidget", ComponentDefaultDefinition_1.TraceControlWidgetId, "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(40, false));
            splitterComponentSettings.addPane("SplitterWidget", ComponentDefaultDefinition_1.SplitterWidgetMainTraceId, this.InnerSplitterDefinitionId, splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(-1, false));
            return splitterComponentSettings;
        }
        getInnerSplitterDefinition() {
            let splitterComponentSettings = new splitterComponentSettings_1.SplitterComponentSettings(splitterDefinition_1.SplitterDefinition.orientationHorizontal);
            splitterComponentSettings.addPane("SignalManagerWidget", ComponentDefaultDefinition_1.SignalManagerWidgetId, "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(350));
            splitterComponentSettings.addPane("ChartViewWidget", ComponentDefaultDefinition_1.ChartViewWidgetId, "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(-1, true, 150));
            splitterComponentSettings.addPane("SplitterWidget", ComponentDefaultDefinition_1.SplitterWidgetRightTraceId, this.RightSplitterDefinitionId, splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(300));
            return splitterComponentSettings;
        }
        getRightSplitterDefinition() {
            let splitterComponentSettings = new splitterComponentSettings_1.SplitterComponentSettings(splitterDefinition_1.SplitterDefinition.orientationVertical);
            splitterComponentSettings.addPane("ChartManagerWidget", ComponentDefaultDefinition_1.ChartManagerWidgetId, "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(-1));
            splitterComponentSettings.addPane("CursorInfoWidget", ComponentDefaultDefinition_1.CursorInfoWidgetId, "", splitterComponentSettings_1.SplitterComponentSettings.getPaneSettings(300));
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
            defaultSettingsPackages.push(new componentDefaultSettingsPackage_1.ComponentDefaultSettingsPackage(this.InnerSplitterDefinitionId, this.getInnerSplitterDefinition()));
            defaultSettingsPackages.push(new componentDefaultSettingsPackage_1.ComponentDefaultSettingsPackage(this.RightSplitterDefinitionId, this.getRightSplitterDefinition()));
            return defaultSettingsPackages;
        }
    };
    ComponentDefaultDefinition.SeriesProviderId = "SeriesProvider";
    ComponentDefaultDefinition.SplitterWidgetTraceViewId = "SplitterWidget_TraceView";
    ComponentDefaultDefinition.SplitterWidgetMainTraceId = "SplitterWidget_MainTrace";
    ComponentDefaultDefinition.SplitterWidgetRightTraceId = "SplitterWidget_RightTrace";
    ComponentDefaultDefinition.TraceControlWidgetId = "TraceControlWidget";
    ComponentDefaultDefinition.SignalManagerWidgetId = "SignalManagerWidget";
    ComponentDefaultDefinition.ChartViewWidgetId = "ChartViewWidget";
    ComponentDefaultDefinition.ChartManagerWidgetId = "ChartManagerWidget";
    ComponentDefaultDefinition.CursorInfoWidgetId = "CursorInfoWidget";
    ComponentDefaultDefinition = ComponentDefaultDefinition_1 = __decorate([
        mco.role()
    ], ComponentDefaultDefinition);
    exports.ComponentDefaultDefinition = ComponentDefaultDefinition;
});
