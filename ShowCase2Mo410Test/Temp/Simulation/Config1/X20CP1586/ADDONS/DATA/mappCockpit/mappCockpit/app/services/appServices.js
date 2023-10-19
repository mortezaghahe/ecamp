var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../communication/rest/textRestServices"], function (require, exports, textRestServices_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Services = void 0;
    /**
     * Provides services to be used from components.
     *
     * @export
     * @class Services
     */
    let Services = class Services {
        /**
         * Provides Text System services
         *
         * @readonly
         * @static
         * @type {ITextSystem}
         * @memberof Services
         */
        static get textSystem() {
            return textRestServices_1.TextSystemRestServices;
        }
    };
    Services = __decorate([
        mco.role()
    ], Services);
    exports.Services = Services;
});
