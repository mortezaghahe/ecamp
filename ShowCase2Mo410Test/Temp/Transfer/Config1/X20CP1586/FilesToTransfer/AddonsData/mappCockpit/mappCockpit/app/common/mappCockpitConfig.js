var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var MappCockpitConfiguration_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitConfiguration = void 0;
    /**
     * Holds mapp cockpit configuration data
     *
     * @class MappCockpitConfiguration
     */
    let MappCockpitConfiguration = MappCockpitConfiguration_1 = class MappCockpitConfiguration {
        /**
         * Loads and initializes the application configuration
         *
         * @static
         * @param {*} appCfg
         * @memberof MappCockpitConfiguration
         */
        static initialize(appCfg) {
            MappCockpitConfiguration_1.port = appCfg.port;
            MappCockpitConfiguration_1.opcUaPort = appCfg.opcUaPort;
            MappCockpitConfiguration_1.writeAccessRole = appCfg.writeAccessRole;
        }
    };
    // specifies the opc ua port
    MappCockpitConfiguration.opcUaPort = "";
    // specifies the application port
    MappCockpitConfiguration.port = "";
    // specifies the write access role
    MappCockpitConfiguration.writeAccessRole = "";
    MappCockpitConfiguration = MappCockpitConfiguration_1 = __decorate([
        mco.role()
    ], MappCockpitConfiguration);
    exports.MappCockpitConfiguration = MappCockpitConfiguration;
});
