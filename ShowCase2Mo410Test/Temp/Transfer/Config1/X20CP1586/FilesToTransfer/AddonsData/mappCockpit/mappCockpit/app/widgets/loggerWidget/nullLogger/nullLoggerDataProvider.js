var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./../interfaces/loggerDataProviderInterface"], function (require, exports, loggerDataProviderInterface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NullLoggerDataProvider = void 0;
    /**
     * Null LoggerDataProvider object
     *
     * @export
     * @class NullLoggerDataProvider
     * @implements {ILoggerDataProvider}
     */
    let NullLoggerDataProvider = class NullLoggerDataProvider {
        constructor() {
            this.eventDataAvailable = new loggerDataProviderInterface_1.EventDataAvailable();
            this.eventDataLoadingProgressChanged = new loggerDataProviderInterface_1.EventDataLoadingProgress();
        }
        setComponentMethods(componentMethods) {
        }
        uploadDataFromTarget() {
        }
        importDataFromFile() {
        }
        exportDataToFile(data) {
        }
        isExportPossible() {
            return false;
        }
        dispose() {
        }
    };
    NullLoggerDataProvider = __decorate([
        mco.role()
    ], NullLoggerDataProvider);
    exports.NullLoggerDataProvider = NullLoggerDataProvider;
});
