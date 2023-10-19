var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/packageConversion/mceConversionError", "../../framework/componentHub/componentDataHub", "../../widgets/common/states/cursorStates", "../../widgets/traceViewWidget/bindingIds", "../packageConversion/packageConversionController"], function (require, exports, mceConversionError_1, componentDataHub_1, cursorStates_1, bindingIds_1, packageConversionController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MceExportImportHelper = void 0;
    /**
     * Handles the creation of *.mce file export data (mce => MappCockpitExport), and also the import of the export data into the components/settingsObjects
     *
     * @export
     * @class MceExportImportHelper
     */
    let MceExportImportHelper = class MceExportImportHelper {
        /**
         * Returns the export data for the given components
         *
         * @static
         * @param {Array<IComponent>} componentInstances
         * @param {Array<ISettingsObject>} settingsObjects
         * @returns {string}
         * @memberof MceExportImportHelper
         */
        static getExportData(componentInstances, settingsObjects) {
            try {
                // Add component data
                componentInstances.forEach(instance => {
                    let componentSettings = instance.getComponentSettings(false);
                    if (componentSettings !== undefined) {
                        packageConversionController_1.PackageConversionController.scheduleConversionTo(instance.component.type, componentSettings);
                    }
                });
                // TODO: Add settings objects data for CursorStates support
                settingsObjects.forEach(settingsObject => {
                    let settings = settingsObject.getSettings();
                    if (settings !== undefined) {
                        packageConversionController_1.PackageConversionController.scheduleConversionTo("CursorStates", settings); // CursorState type needed, or type of settings object
                    }
                });
                let packageData = packageConversionController_1.PackageConversionController.runConversionTo();
                if (packageData.length > 0) {
                    let stringData = JSON.stringify(packageData);
                    return stringData;
                }
                else { // TODO improve error handling!
                    throw "export failed";
                }
            }
            catch (e) {
                if (e instanceof Error && mceConversionError_1.MceConversionError.isMceConversionError(e)) {
                    console.error(e.toString());
                }
                else {
                    console.error(e);
                }
            }
            return "";
        }
        /**
         * Clears all the components in the given order (needed before importing new data)
         *
         * @static
         * @param {Array<IComponent>} componentInstances
         * @memberof MceExportImportHelper
         */
        static clearComponents(componentInstances) {
            componentInstances.forEach(componentInstance => {
                componentInstance.clear();
            });
        }
        /**
         * Sets the given data from a exportContainer to the given components
         *
         * @static
         * @param {Array<IComponent>} componentInstances
         * @param {Map<string, ISettings>} importedSettingsMap
         * @memberof MceExportImportHelper
         */
        static setImportData(componentInstances, importedSettingsMap) {
            // set all settings to the components
            componentInstances.forEach(componentInstance => {
                let componentSettings = importedSettingsMap.get(componentInstance.component.type);
                if (componentSettings !== undefined) {
                    componentInstance.setComponentSettings(componentSettings);
                }
            });
            // TODO: Use settingsobjects data for more dynamic support
            //sets imported cursorstates settings 
            let cursorStatesSettings = importedSettingsMap.get("CursorStates");
            if (cursorStatesSettings !== undefined) {
                let cursorStatesScope = bindingIds_1.TraceViewBinding.CursorStates.scope;
                let cursorStatesID = bindingIds_1.TraceViewBinding.CursorStates.id;
                let cursorStates = new cursorStates_1.CursorStates();
                cursorStates.setSettings(cursorStatesSettings);
                componentDataHub_1.ComponentDataHub.updateShared(this, cursorStates, cursorStatesScope, cursorStatesID, cursorStates_1.CursorStates);
            }
        }
        static readFileContentMce1(fileData) {
            let parsedFileContent = JSON.parse(fileData);
            let importedSettingsMap = new Map();
            if (Array.isArray(parsedFileContent)) {
                packageConversionController_1.PackageConversionController.scheduleConversionFrom(parsedFileContent);
                importedSettingsMap = packageConversionController_1.PackageConversionController.runConversionFrom();
            }
            return importedSettingsMap;
        }
        static readFileContentMce(fileData) {
            let parsedFileContent = JSON.parse(fileData);
            let importedSettingsMap = new Map();
            if (Array.isArray(parsedFileContent)) {
                importedSettingsMap = this.readFileContentMce1(fileData);
            }
            else if (parsedFileContent !== undefined && parsedFileContent.SeriesProvider !== undefined && parsedFileContent.SignalManagerDataModel !== undefined) {
                packageConversionController_1.PackageConversionController.scheduleConversionTo("SignalManagerDataModel", parsedFileContent.SignalManagerDataModel);
                packageConversionController_1.PackageConversionController.scheduleConversionTo("SeriesProvider", parsedFileContent.SeriesProvider);
                let packageArray = packageConversionController_1.PackageConversionController.runConversionTo();
                if (packageArray.length > 0) {
                    packageConversionController_1.PackageConversionController.scheduleConversionFrom(packageArray);
                    importedSettingsMap = packageConversionController_1.PackageConversionController.runConversionFrom();
                }
            }
            return importedSettingsMap;
        }
        static readFileContent(fileData, fileEnding) {
            let importedSettingsMap = new Map();
            if (fileEnding === ".mce1") {
                importedSettingsMap = this.readFileContentMce1(fileData);
            }
            else {
                importedSettingsMap = this.readFileContentMce(fileData);
            }
            return importedSettingsMap;
        }
    };
    MceExportImportHelper = __decorate([
        mco.role()
    ], MceExportImportHelper);
    exports.MceExportImportHelper = MceExportImportHelper;
});
