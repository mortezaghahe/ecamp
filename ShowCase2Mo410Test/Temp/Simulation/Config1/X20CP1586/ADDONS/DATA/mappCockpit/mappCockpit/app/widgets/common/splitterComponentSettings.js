var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/componentFactory/componentDefinition", "../splitterWidget/splitterDefinition", "../splitterWidget/splitterPaneDefinition", "../splitterWidget/layoutPane", "../../common/componentBase/componentSettings"], function (require, exports, componentDefinition_1, splitterDefinition_1, splitterPaneDefinition_1, layoutPane_1, componentSettings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SplitterComponentSettings = void 0;
    let SplitterComponentSettings = class SplitterComponentSettings extends componentSettings_1.ComponentSettings {
        /**
         * Creates an instance of SplitterComponentSettings
         * @param {string} orientation (e.g. "vertical" or "horizontal")
         * @param {boolean} [responsive=true]
         * @memberof SplitterComponentSettings
         */
        constructor(orientation, responsive = true) {
            super();
            // Create SplitterDefinition
            this._splitterDefinition = new splitterDefinition_1.SplitterDefinition(orientation, responsive);
            // Add SplitterDefinition to this widget base data
            this.setValue(splitterDefinition_1.SplitterDefinition.splitterDefinitionId, this._splitterDefinition);
        }
        /**
         * Adds a new pane to the splitter component settings
         *
         * @param {string} type
         * @param {string} id
         * @param {string} defaultDataId
         * @param {*} [paneDefinition=""]
         * @memberof SplitterComponentSettings
         */
        addPane(type, id, defaultDataId, paneDefinition = "") {
            // Add panes to panes data
            let paneDefs = this._splitterDefinition.paneDefinitions;
            paneDefs.push(new splitterPaneDefinition_1.SplitterPaneDefinition(new componentDefinition_1.ComponentDefinition(type, id, defaultDataId), paneDefinition));
        }
        /**
         * Returns an ISettings object with a pane definition for the given data
         *
         * @static
         * @param {number} size
         * @param {boolean} [resizable=true]
         * @param {number} [minimumSize=0]
         * @returns {ISettings}
         * @memberof SplitterComponentSettings
         */
        static getPaneSettings(size, resizable = true, minimumSize = 0) {
            let fillSpace = false;
            if (size == -1) {
                // Use dynamic size for the pane
                size = 0;
                fillSpace = true;
            }
            return layoutPane_1.LayoutPane.getFormatedSettings(size, false, false, fillSpace, resizable, minimumSize);
        }
    };
    SplitterComponentSettings = __decorate([
        mco.role()
    ], SplitterComponentSettings);
    exports.SplitterComponentSettings = SplitterComponentSettings;
});
