var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Settings_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Settings = void 0;
    let Settings = Settings_1 = class Settings {
        /**
         * Creates an instance of Settings
         * @param {string} type
         * @memberof Settings
         */
        constructor(type, version = "1.0") {
            /**
             * List of settings data with ids
             *
             * @type {{ [key: string]: any; }}
             * @memberof Settings
             */
            this.data = {};
            this.type = type;
            this.version = version;
        }
        /**
         * Creates an instance with the given interface data
         *
         * @static
         * @param {ISettings} settings
         * @returns {Settings}
         * @memberof Settings
         */
        static create(settings) {
            let instance = new Settings_1(settings.type, settings.version);
            instance.data = settings.data;
            return instance;
        }
        /**
         * sets some settings data with the given id
         *
         * @param {string} key
         * @param {*} value
         * @memberof Settings
         */
        setValue(key, value) {
            this.data[key] = value;
        }
        /**
         * Returns some settings data for the given id
         *
         * @param {string} key
         * @returns {*}
         * @memberof Settings
         */
        getValue(key) {
            return this.data[key];
        }
    };
    Settings = Settings_1 = __decorate([
        mco.role()
    ], Settings);
    exports.Settings = Settings;
});
