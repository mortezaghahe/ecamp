var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/componentBase/componentSettings"], function (require, exports, componentSettings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDefaultDefinitionWidgetBase = void 0;
    let ComponentDefaultDefinitionWidgetBase = class ComponentDefaultDefinitionWidgetBase {
        constructor() {
            this.defaultComponentSettingsId = "";
        }
        getDefaultComponentSettings() {
            return new componentSettings_1.ComponentSettings();
        }
        /**
         * Adds some default persisting data packages in the main default persisting data provider
         *
         * @returns {(ComponentDefaultSettingsPackage[]| undefined)}
         * @memberof ComponentDefaultDefinitionWidgetBase
         */
        getAdditionalDefaultComponentSettings() {
            return undefined;
        }
    };
    ComponentDefaultDefinitionWidgetBase.ImageProviderId = "ImageProvider";
    ComponentDefaultDefinitionWidgetBase.CommonLayoutProviderId = "CommonLayoutProvider";
    ComponentDefaultDefinitionWidgetBase = __decorate([
        mco.role()
    ], ComponentDefaultDefinitionWidgetBase);
    exports.ComponentDefaultDefinitionWidgetBase = ComponentDefaultDefinitionWidgetBase;
});
