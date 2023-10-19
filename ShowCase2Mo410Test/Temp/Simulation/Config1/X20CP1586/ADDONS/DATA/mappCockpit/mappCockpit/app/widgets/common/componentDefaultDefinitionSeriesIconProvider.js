var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/componentBase/componentSettings"], function (require, exports, componentSettings_1) {
    "use strict";
    var ComponentDefaultDefinitionSeriesIconProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDefaultDefinitionSeriesIconProvider = void 0;
    let ComponentDefaultDefinitionSeriesIconProvider = ComponentDefaultDefinitionSeriesIconProvider_1 = class ComponentDefaultDefinitionSeriesIconProvider {
        constructor() {
            this.defaultComponentSettingsId = "seriesIconProviderDefinition";
        }
        /**
         * Returns the default component settings for this provider
         *
         * @returns {ComponentSettings}
         * @memberof ComponentDefaultDefinitionSeriesIconProvider
         */
        getDefaultComponentSettings() {
            let componentSettings = new componentSettings_1.ComponentSettings();
            // add subcomponents
            componentSettings.addSubComponent("ImageProvider", ComponentDefaultDefinitionSeriesIconProvider_1.ImageProviderId);
            return componentSettings;
        }
        /**
         * Adds some default persisting data packages in the main default persisting data provider
         *
         * @returns {(ComponentDefaultSettingsPackage[]| undefined)}
         * @memberof ComponentDefaultDefinitionSeriesIconProvider
         */
        getAdditionalDefaultComponentSettings() {
            return undefined;
        }
    };
    ComponentDefaultDefinitionSeriesIconProvider.ImageProviderId = "ImageProvider";
    ComponentDefaultDefinitionSeriesIconProvider = ComponentDefaultDefinitionSeriesIconProvider_1 = __decorate([
        mco.role()
    ], ComponentDefaultDefinitionSeriesIconProvider);
    exports.ComponentDefaultDefinitionSeriesIconProvider = ComponentDefaultDefinitionSeriesIconProvider;
});
