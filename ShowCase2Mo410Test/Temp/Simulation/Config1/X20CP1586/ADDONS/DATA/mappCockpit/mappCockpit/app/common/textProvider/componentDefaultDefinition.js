var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/componentBase/componentSettings", "./languageCodes", "./settingIds"], function (require, exports, componentSettings_1, languageCodes_1, settingIds_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDefaultDefinition = void 0;
    /**
     * Sets the ComponentDefaultDefinition for the TextFormatter
     *
     * @export
     * @class ComponentDefaultDefinition
     * @implements {IComponentDefaultDefinition}
     */
    let ComponentDefaultDefinition = class ComponentDefaultDefinition {
        constructor() {
            this.defaultComponentSettingsId = "textProviderDefinition";
        }
        /**
         * Returns the default component settings for this component
         *
         * @returns {ComponentSettings}
         * @memberof ComponentDefaultDefinition
         */
        getDefaultComponentSettings() {
            let componentSettings = new componentSettings_1.ComponentSettings();
            // per default, english should be set as the selected langauge
            componentSettings.setValue(settingIds_1.SettingIds.SelectedLanguage, languageCodes_1.LanguageCodes.english);
            // per default, english should be set as the fallback language
            componentSettings.setValue(settingIds_1.SettingIds.FallbackLanguage, languageCodes_1.LanguageCodes.english);
            return componentSettings;
        }
        /**
         * Adds some default persisting data packages in the main default persisting data provider
         *
         * @returns {(Array<ComponentDefaultSettingsPackage>|undefined)}
         * @memberof ComponentDefaultDefinition
         */
        getAdditionalDefaultComponentSettings() {
            return undefined;
        }
    };
    ComponentDefaultDefinition = __decorate([
        mco.role()
    ], ComponentDefaultDefinition);
    exports.ComponentDefaultDefinition = ComponentDefaultDefinition;
});
