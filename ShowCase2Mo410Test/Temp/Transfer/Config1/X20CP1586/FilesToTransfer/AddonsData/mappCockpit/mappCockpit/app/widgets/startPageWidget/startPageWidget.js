var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../mappCockpitSettings", "../common/widgetBase", "./componentDefaultDefinition"], function (require, exports, mappCockpitSettings_1, widgetBase_1, componentDefaultDefinition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StartPageWidget = void 0;
    /**
     * implements the StartPageWidget
     *
     * @class StartPageWidget
     * @extends {WidgetBase}
     */
    let StartPageWidget = class StartPageWidget extends widgetBase_1.WidgetBase {
        constructor() {
            super(...arguments);
            // Div container for cockpit logo
            this._cockpitLogoDivId = "mCo_logo";
        }
        /**
         * Initialize the component
         *
         * @memberof StartPageWidget
         */
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        /**
         * Loads the styles for the start page widget
         *
         * @memberof SplitterWidget
         */
        loadStyles() {
            super.addStyle("widgets/startPageWidget/style/css/startPageStyle.css");
            // TODO: Remove in this class when timing problem while initialization with the resize is solved
            super.addStyle("widgets/common/style/css/treeGridStyle.css");
        }
        /**
         * Creates the widget content and eventually subwidgets
         *
         * @memberof StartPageWidget
         */
        createLayout() {
            // Set the startpage background image(parent_mCo_logo) and positionate the div for the cockpit logo with the version
            this.mainDiv.innerHTML += ` <div id="parent_mCo_logo">
                                       <div id="` + this._cockpitLogoDivId + `"></div>
                                   </div>`;
            this.loadLogoSVG("../app/widgets/startPageWidget/style/images/mappCockpitLogo.svg");
        }
        /**
         * Append the svg logo with version number to layout
         *
         * @private
         * @param {IImageProvider} imageProvider
         * @param {string} imagePath
         * @memberof StartPageWidget
         */
        loadLogoSVG(imagePath) {
            // Get imageProvider for the cockpit logo
            let imageProvider = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.ImageProviderId);
            // Get cockpit logo div container
            let cockpitLogoDiv = $("#" + this._cockpitLogoDivId)[0];
            if (cockpitLogoDiv != undefined) {
                // Get cockpit logo
                let cockpitLogo = imageProvider.getImage(imagePath);
                if (cockpitLogo == "") {
                    console.error("Startpage Logo not loaded");
                    return;
                }
                // Set cockpit svg logo to div container
                cockpitLogoDiv.innerHTML = cockpitLogo;
                // Update cockpit version within the svg logo
                let versionTextElement = document.getElementById("version_text");
                if (versionTextElement != undefined) {
                    let currentVersion = "V" + mappCockpitSettings_1.MappCockpitSettings.version.major + "." + mappCockpitSettings_1.MappCockpitSettings.version.minor + "." + mappCockpitSettings_1.MappCockpitSettings.version.patch;
                    versionTextElement.textContent = currentVersion;
                }
            }
        }
        /** resizes the startpage widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof StartPageWidget
         */
        resize(width, height) {
            this.mainDiv.style.width = width.toString() + "px";
            this.mainDiv.style.height = height.toString() + "px";
        }
    };
    StartPageWidget = __decorate([
        mco.role()
    ], StartPageWidget);
    exports.StartPageWidget = StartPageWidget;
});
