var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./driveLog/driveLogDefinitions", "./driveLog/driveLogDataProvider", "./nullLogger/nullLoggerDefinitions", "./nullLogger/nullLoggerDataProvider"], function (require, exports, driveLogDefinitions_1, driveLogDataProvider_1, nullLoggerDefinitions_1, nullLoggerDataProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoggerProvider = void 0;
    /**
     * Provides all the available logger implementations(e.g. network command trace,...)
     *
     * @export
     * @class LoggerProvider
     */
    let LoggerProvider = class LoggerProvider {
        /**
         * Returns the logger data provider for the given component id
         *
         * @static
         * @param {string} componentId
         * @returns {ILoggerDataProvider}
         * @memberof LoggerProvider
         */
        static getLoggerDataProviderForComponentNew(componentId) {
            if (componentId == this.driveLogComponentName) {
                return new driveLogDataProvider_1.DriveLogDataProvider();
            }
            return new nullLoggerDataProvider_1.NullLoggerDataProvider();
        }
        /**
         * Returns the logger definitions for the given component id
         *
         * @static
         * @param {string} componentId
         * @returns {ILoggerDefinitions}
         * @memberof LoggerProvider
         */
        static getLoggerDefinitionsForComponentNew(componentId) {
            if (componentId == this.driveLogComponentName) {
                return new driveLogDefinitions_1.DriveLogDefinitions();
            }
            return new nullLoggerDefinitions_1.NullLoggerDefinitions();
        }
    };
    /**
     * Name of the DriveLog component
     *
     * @static
     * @memberof LoggerProvider
     */
    LoggerProvider.driveLogComponentName = "DriveLog";
    LoggerProvider = __decorate([
        mco.role()
    ], LoggerProvider);
    exports.LoggerProvider = LoggerProvider;
});
