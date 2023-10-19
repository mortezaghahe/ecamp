var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/componentBase/componentSettings", "../../common/componentDefaultDefinitionWidgetBase", "../../traceViewWidget/bindingIds"], function (require, exports, componentSettings_1, componentDefaultDefinitionWidgetBase_1, bindingIds_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDefaultDefinition = void 0;
    let ComponentDefaultDefinition = class ComponentDefaultDefinition extends componentDefaultDefinitionWidgetBase_1.ComponentDefaultDefinitionWidgetBase {
        constructor() {
            super(...arguments);
            this.defaultComponentSettingsId = "chartViewToolbarDefinition";
        }
        /**
         * Returns the default component settings for this widget
         *
         * @returns {ComponentSettings}
         * @memberof ComponentDefaultDefinition
         */
        getDefaultComponentSettings() {
            let componentSettings = new componentSettings_1.ComponentSettings();
            // Add bindings
            componentSettings.addBindingByDecl(bindingIds_1.TraceViewBinding.CursorStates, "cursorsStates", "updateCursorStates");
            componentSettings.addBindingByDecl(bindingIds_1.TraceViewBinding.ToolState, "toolState", "updateToolState");
            componentSettings.addBindingByDecl(bindingIds_1.TraceViewBinding.ZoomDirectionState, "zoomDirectionState", "updateZoomDirectionState");
            return componentSettings;
        }
    };
    ComponentDefaultDefinition = __decorate([
        mco.role()
    ], ComponentDefaultDefinition);
    exports.ComponentDefaultDefinition = ComponentDefaultDefinition;
});
