var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./common/version"], function (require, exports, version_1) {
    "use strict";
    var MappCockpitSettings_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitSettings = void 0;
    /**
     * Holds mapp cockpit settings data
     *
     * @class MappCockpitSettings
     */
    let MappCockpitSettings = MappCockpitSettings_1 = class MappCockpitSettings {
        /**
         * Loads and initializes the application settings
         *
         * @static
         * @param {*} appSettings
         * @memberof MappCockpitSettings
         */
        static initialize(appSettings) {
            MappCockpitSettings_1.version = new version_1.Version(appSettings.version);
        }
    };
    MappCockpitSettings.version = new version_1.Version("1.0.0");
    MappCockpitSettings = MappCockpitSettings_1 = __decorate([
        mco.role()
    ], MappCockpitSettings);
    exports.MappCockpitSettings = MappCockpitSettings;
});
