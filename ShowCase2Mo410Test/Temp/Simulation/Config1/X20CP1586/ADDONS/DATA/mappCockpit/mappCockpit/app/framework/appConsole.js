var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var AppConsole_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AppConsole = void 0;
    let AppConsole = AppConsole_1 = class AppConsole {
        /**
         * Creates an instance of AppConsole.
         * @memberof AppConsole
         */
        constructor() {
            let origConsoleMethods = this.preserveOriginalConsoleMethods();
            // override the standard app console.
            console = this;
            this.enableReleaseConsoleMethods(origConsoleMethods);
        }
        /**
         * Creates an AppConsole instance
         *
         * @static
         * @returns {AppConsole}
         * @memberof AppConsole
         */
        static create() {
            return new AppConsole_1();
        }
        /**
         * Preserves the original methods
         *
         * @private
         * @memberof AppConsole
         */
        preserveOriginalConsoleMethods() {
            let origConsoleMethods = {};
            origConsoleMethods["info"] = console.info;
            origConsoleMethods["log"] = console.log;
            origConsoleMethods["warn"] = console.warn;
            origConsoleMethods["error"] = console.error;
            return origConsoleMethods;
        }
        /**
         * Enables console methods for release mode
         *
         * @param {*} origConsoleMethods
         * @returns {*}
         * @memberof AppConsole
         */
        enableReleaseConsoleMethods(origConsoleMethods) {
            console.warn = origConsoleMethods["warn"];
            console.error = origConsoleMethods["error"];
        }
        countReset(label) {
        }
        info(message, ...optionalParams) {
        }
        log(message, ...optionalParams) {
        }
        warn(message, ...optionalParams) {
        }
        error(message, ...optionalParams) {
        }
        assert(condition, message, ...data) {
        }
        clear() {
        }
        count(label) {
        }
        debug(message, ...optionalParams) {
        }
        dir(value, ...optionalParams) {
        }
        dirxml(value) {
        }
        exception(message, ...optionalParams) {
        }
        group(groupTitle, ...optionalParams) {
        }
        groupCollapsed(groupTitle, ...optionalParams) {
        }
        groupEnd() {
        }
        markTimeline(label) {
        }
        msIsIndependentlyComposed(element) {
            return false;
        }
        profile(reportName) {
        }
        profileEnd() {
        }
        select(element) {
        }
        table(...tabularData) {
        }
        time(label) {
        }
        timeEnd(label) {
        }
        timeLog(label, ...data) {
        }
        timeStamp(label) {
        }
        timeline(label) {
        }
        timelineEnd(label) {
        }
        trace(message, ...optionalParams) {
        }
    };
    AppConsole = AppConsole_1 = __decorate([
        mco.role()
    ], AppConsole);
    exports.AppConsole = AppConsole;
});
