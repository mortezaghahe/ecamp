var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../framework/events", "../common/directoryProvider", "../framework/appConsole", "../debug/diagnostics", "../common/mappCockpitConfig", "../common/componentFactory/componentFactory", "../common/componentFactory/componentDefinition", "../common/persistence/persistDataController", "../mappCockpitSettings"], function (require, exports, events_1, directoryProvider_1, appConsole_1, diagnostics_1, mappCockpitConfig_1, componentFactory_1, componentDefinition_1, persistDataController_1, mappCockpitSettings_1) {
    "use strict";
    var MappCockpitApp_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitApp = void 0;
    // Declares Event-AppInitialized
    let EventAppInitialized = class EventAppInitialized extends events_1.TypedEvent {
    };
    EventAppInitialized = __decorate([
        mco.role()
    ], EventAppInitialized);
    ;
    // Boot container definition
    const bootContentId = "mappCockpitContent";
    const mainPaneId = "mappCockpitMainPane";
    const bootContent = "<div id=" + bootContentId + ' style="overflow:hidden"></div>';
    /**
     * The class represents the application main class.
     *
     * @class MappCockpitApp
     */
    let MappCockpitApp = MappCockpitApp_1 = class MappCockpitApp {
        /**
         * Creates an instance of MappCockpitApp.
         * @memberof MappCockpitApp
         */
        constructor() {
            // Events
            this.eventAppInitialized = new EventAppInitialized();
        }
        /**
         * Creates an AppConsole instance
         *
         * @private
         * @memberof MappCockpitApp
         */
        createAppConsole() {
            if (!MappCockpitApp_1.cxcoDebug) {
                // in release mode we override the standard console
                appConsole_1.AppConsole.create();
            }
            // ....otherwise the standard console keeps alive...
        }
        /**
         * Creates and initializes the mapp cockpit app.
         *
         * @memberof MappCockpitApp
         */
        create() {
            this.loadAppSettings();
        }
        createUI() {
            var initCommands = window.location.search.substring(1);
            if (initCommands.indexOf("CLEAR") > -1 || initCommands.indexOf("clear") > -1) {
                let persistingDataController = new persistDataController_1.PersistDataController(undefined);
                (() => __awaiter(this, void 0, void 0, function* () {
                    yield persistingDataController.clearDefaultStorage();
                }))();
            }
            if (this.mode == "cxcoDbg") {
                this.loadApp();
            }
            else {
                if (initCommands.indexOf("DEBUG") > -1) {
                    let cxcoDbg = window.prompt("Enter debug password !");
                    if (cxcoDbg == "cxcoDbg") {
                        document.write(diagnostics_1.Diagnostics.DEBUG);
                    }
                    else {
                        this.createAppConsole();
                        this.loadApp();
                    }
                }
                else {
                    this.createAppConsole();
                    this.loadApp();
                }
            }
        }
        loadApp() {
            this.attachUnloadHandler();
            this.loadAppConfiguration();
        }
        /**
         * Loads the application settings (e.g. version)
         *
         * @memberof MappCockpitApp
         */
        loadAppSettings() {
            let cfgFile = "../../../" + directoryProvider_1.DirectoryProvider.getAppDirectory() + "appSettings.json";
            $.getJSON(cfgFile, (appSettings) => { this.onAppSettingsLoaded(appSettings); });
        }
        /**
         * Loads the application configuration (e.g. port, writeAccessRole and other data from the Automation Studio project compile)
         *
         * @memberof MappCockpitApp
         */
        loadAppConfiguration() {
            let cfgFile = "../../../" + directoryProvider_1.DirectoryProvider.getAppDirectory() + "common/mappCockpitConfigSettings.json";
            $.getJSON(cfgFile, (appCfg) => { this.onAppConfigurationLoaded(appCfg); });
        }
        /**
         * Called after the app settings has been loaded
         *
         * @private
         * @param {*} appSettings
         * @memberof MappCockpitApp
         */
        onAppSettingsLoaded(appSettings) {
            // load and update application settings
            mappCockpitSettings_1.MappCockpitSettings.initialize(appSettings);
            this.createUI();
        }
        /**
         * Called after the app configuration has been loaded
         *
         * @private
         * @param {*} appCfg
         * @memberof MappCockpitApp
         */
        onAppConfigurationLoaded(appCfg) {
            // load and update application configuration
            mappCockpitConfig_1.MappCockpitConfiguration.initialize(appCfg);
            // boot the application
            this.loadBootContent();
        }
        /**
         * Loads the main content
         *
         * @private
         * @memberof MappCockpitApp
         */
        loadBootContent() {
            // Get the page body
            var pageBody = $("body");
            // ... append the main content div
            var $bootContent = $(bootContent);
            $bootContent[0].style.height = (window.innerHeight).toString() + 'px';
            var uniqueResizeId = 123;
            $(window).resize((args) => {
                $bootContent[0].style.height = (window.innerHeight).toString() + 'px';
                clearTimeout(uniqueResizeId);
                uniqueResizeId = setTimeout(() => this.doneResizing(args), 500);
            });
            pageBody.append($bootContent);
            // Load the main content into the main div
            $bootContent.load("../../../" + directoryProvider_1.DirectoryProvider.getAppDirectory() + "layout/mappCockpitMain.html", () => { this.onBootContentLoaded(pageBody); });
        }
        doneResizing(args) {
            if (this._mappCockpitWidget != undefined) {
                this._mappCockpitWidget.resize(window.innerWidth, window.innerHeight);
            }
        }
        /**
         * Handler called after loading the main content file.
         *
         * @private
         * @param {JQuery} contentContainer
         * @memberof MappCockpitApp
         */
        onBootContentLoaded(contentContainer) {
            return __awaiter(this, void 0, void 0, function* () {
                // Get the main div
                var mainLayoutPane = $("#" + mainPaneId);
                // Check if the boot div exists 
                if (mainLayoutPane.length) {
                    (() => __awaiter(this, void 0, void 0, function* () { yield this.createMappCockpitWidget(); this.onAppInitialized(); }))();
                }
            });
        }
        /**
         * creates the mapp cockpit widget
         *
         * @private
         * @memberof MappCockpitApp
         */
        createMappCockpitWidget() {
            this._mappCockpitWidget = componentFactory_1.ComponentFactory.getInstance().create(new componentDefinition_1.ComponentDefinition("MappCockpitWidget", "MappCockpitWidget"), undefined);
            if (this._mappCockpitWidget != undefined) {
                this._mappCockpitWidget.initialize();
                // add widget to the parent container
                this._mappCockpitWidget.addToParentContainerId(mainPaneId);
                this._mappCockpitWidget.resize(window.innerWidth, window.innerHeight);
            }
        }
        /**
         * Notifies that the app has been initialized
         *
         * @private
         * @memberof MappCockpitApp
         */
        onAppInitialized() {
            console.log("App Initialized");
            this.eventAppInitialized.raise(this, null);
        }
        /**
         *
         * attaches a handler for unloading mapp cockpit
         * @private
         * @memberof MappCockpitApp
         */
        attachUnloadHandler() {
            window.onbeforeunload = (e) => { this.handleUnload(e); };
        }
        /**
         * handles unloading mapp cockpit....releasing resources, disconnecting ...
         *
         * @param {BeforeUnloadEvent} e
         * @returns {*}
         * @memberof MappCockpitApp
         */
        handleUnload(e) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._mappCockpitWidget != undefined) {
                    this._mappCockpitWidget.dataModel.dispose();
                    this._mappCockpitWidget.dispose();
                }
                console.log("MappCockpitApp: unloading ....");
            });
        }
    };
    MappCockpitApp = MappCockpitApp_1 = __decorate([
        mco.role()
    ], MappCockpitApp);
    exports.MappCockpitApp = MappCockpitApp;
});
