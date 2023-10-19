var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SettingIds = void 0;
    /**
     * Includes all setting IDs needed for the textsystem
     *
     * @export
     * @class SettingIds
     */
    let SettingIds = class SettingIds {
        constructor() { }
    };
    // settings ids of text resource
    SettingIds.Namespace = "ns";
    SettingIds.LanguageCode = "languagaCode";
    SettingIds.TextData = "textData";
    SettingIds.FullyLoaded = "isFullyLoaded";
    SettingIds.TextResource = "textResource";
    // settings ids of text provider
    SettingIds.TextResources = "textResources";
    SettingIds.SelectedLanguage = "selecteLanguage";
    SettingIds.FallbackLanguage = "fallbackLanguage";
    SettingIds = __decorate([
        mco.role()
    ], SettingIds);
    exports.SettingIds = SettingIds;
});
