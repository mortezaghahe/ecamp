var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../widgets/cursorInfoWidget/model/cursorSignalsDataModel", "../../models/common/seriesProvider/seriesProvider", "../../widgets/widgets", "../../models/dataModels", "../componentBase/componentBase", "../../widgets/common/imageProvider", "../../widgets/common/commonLayoutProvider", "../../widgets/common/seriesIconProvider", "../textProvider/textProvider"], function (require, exports, cursorSignalsDataModel_1, seriesProvider_1, Widgets, DataModels, componentBase_1, imageProvider_1, commonLayoutProvider_1, seriesIconProvider_1, textProvider_1) {
    "use strict";
    var ComponentFactory_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentFactory = void 0;
    let ComponentFactory = ComponentFactory_1 = class ComponentFactory {
        constructor() {
            this._componentInstances = new Map();
        }
        static getInstance() {
            if (this._instance == undefined) {
                this._instance = new ComponentFactory_1();
            }
            return this._instance;
        }
        /**
    
         *
         * @param {ComponentDefinition} componentDefinition
         * @param {(ComponentContext|undefined)} [context=undefined]
         * @returns {(IComponent|undefined)}
         * @memberof ComponentFactory
         *
         * Review Lukas Obersamer:
         * The cyclomatic complexity of this function is too high, but that does not reflect the complexity for humans to understand it.
         * The complexity of understing this method is in fact super simple. Therefore the method may remain in this form.
         * In the long run, this will be obsulete, as the component factory will be automatically generated.
         */
        create(componentDefinition, context = undefined) {
            /* tslint:disable:max-func-body-length */ // disabled due to switch case
            let instance = undefined;
            let doInitialization = false;
            switch (componentDefinition.type) {
                case "e":
                    console.error(componentDefinition);
                    break;
                /////////////////
                // Create widgets
                case "MappCockpitWidget":
                    instance = Widgets.MappCockpitWidget.create();
                    break;
                case "WatchablesWidget":
                    instance = Widgets.WatchablesWidget.create();
                    break;
                case "MethodsWidget":
                    instance = Widgets.MethodsWidget.create();
                    break;
                case "ConfigManagerWidget":
                    instance = Widgets.ConfigManagerWidget.create();
                    break;
                case "SignalManagerWidget":
                    instance = Widgets.SignalManagerWidget.create();
                    break;
                case "ChartManagerWidget":
                    instance = Widgets.ChartManagerWidget.create();
                    break;
                case "TraceViewWidget":
                    instance = Widgets.TraceViewWidget.create();
                    break;
                case "ChartViewWidget":
                    instance = Widgets.ChartViewWidget.create();
                    break;
                case "MessagesWidget":
                    instance = Widgets.MessagesWidget.create();
                    break;
                case "SplitterWidget":
                    instance = Widgets.SplitterWidget.create();
                    break;
                case "ComponentViewWidget":
                    instance = Widgets.ComponentViewWidget.create();
                    break;
                case "MethodListWidget":
                    instance = Widgets.MethodListWidget.create();
                    break;
                case "MethodParameterListWidget":
                    instance = Widgets.MethodParameterListWidget.create();
                    break;
                case "SideBarWidget":
                    instance = Widgets.SideBarWidget.create();
                    break;
                case "MainContentWidget":
                    instance = Widgets.MainContentWidget.create();
                    break;
                case "TopBarWidget":
                    instance = Widgets.TopBarWidget.create();
                    break;
                case "StartPageWidget":
                    instance = Widgets.StartPageWidget.create();
                    break;
                case "ComponentOverviewWidget":
                    instance = Widgets.ComponentOverviewWidget.create();
                    break;
                case "TraceOverviewWidget":
                    instance = Widgets.TraceOverviewWidget.create();
                    break;
                case "TraceConfigurationViewWidget":
                    instance = Widgets.TraceConfigurationViewWidget.create();
                    break;
                case "TraceControlWidget":
                    instance = Widgets.TraceControlWidget.create();
                    break;
                case "TraceConfigurationWidget":
                    instance = Widgets.TraceConfigurationWidget.create();
                    break;
                case "TraceConfigTimingWidget":
                    instance = Widgets.TraceConfigTimingWidget.create();
                    break;
                case "TraceConfigTriggerWidget":
                    instance = Widgets.TraceConfigTriggerWidget.create();
                    break;
                case "TraceConfigDatapointsWidget":
                    instance = Widgets.TraceConfigDatapointsWidget.create();
                    break;
                case "MainNavigationWidget":
                    instance = Widgets.MainNavigationWidget.create();
                    break;
                case "LoginWidget":
                    instance = Widgets.LoginWidget.create();
                    break;
                case "CursorInfoWidget":
                    instance = Widgets.CursorInfoWidget.create();
                    break;
                case "ToolsOverviewWidget":
                    instance = Widgets.ToolsOverviewWidget.create();
                    break;
                case "ChartViewToolbar":
                    instance = Widgets.ChartViewToolbar.create();
                    break;
                case "ChartBase":
                    // Implement creation of chartBase(widget) in the component factory(type must be set by defaultSettingsId => fft, xy, yt, ...)
                    //instance = Widgets.ChartBaseWidget.create();
                    break;
                case "DummyWidget":
                    instance = Widgets.DummyWidget.create();
                    break;
                case "LoggerWidget":
                    instance = Widgets.LoggerWidget.create();
                    break;
                ////////////////////
                // Create datamodels
                case "MappCockpitDataModel":
                    if (this._componentInstances.has(componentDefinition.id)) {
                        instance = this._componentInstances.get(componentDefinition.id);
                        doInitialization = false;
                    }
                    else {
                        instance = DataModels.MappCockpitDataModel.create();
                        doInitialization = true;
                        this._componentInstances.set(componentDefinition.id, instance);
                    }
                    break;
                case "ConfigManagerDataModel":
                    instance = DataModels.ConfigManagerDataModel.create();
                    doInitialization = true;
                    break;
                case "SignalManagerDataModel":
                    instance = DataModels.SignalManagerDataModel.create();
                    doInitialization = true;
                    break;
                case "CursorSignalsDataModel":
                    instance = new cursorSignalsDataModel_1.CursorSignalsDataModel();
                    doInitialization = true;
                    break;
                ////////////////////
                // Create providers
                case "SeriesProvider":
                case "TextProvider":
                case "ChartManagerDataModel":
                    if (this._componentInstances.has(componentDefinition.id)) {
                        instance = this._componentInstances.get(componentDefinition.id);
                    }
                    else {
                        if (componentDefinition.type == "SeriesProvider") {
                            instance = seriesProvider_1.SeriesProvider.getInstance();
                        }
                        else if (componentDefinition.type == "TextProvider") {
                            instance = new textProvider_1.TextProvider();
                        }
                        else if (componentDefinition.type == "ChartManagerDataModel") {
                            instance = DataModels.ChartManagerDataModel.create();
                        }
                        else {
                            console.error("Type not defined!");
                            return undefined;
                        }
                        this.createComponentAndInitializeInstance(componentDefinition, context, instance);
                    }
                    return instance;
                    break;
                case "SeriesIconProvider":
                    instance = seriesIconProvider_1.SeriesIconProvider.getInstance();
                    doInitialization = true;
                    break;
                case "ImageProvider":
                    instance = imageProvider_1.ImageProvider.getInstance();
                    break;
                case "CommonLayoutProvider":
                    instance = commonLayoutProvider_1.CommonLayoutProvider.getInstance();
                    doInitialization = true;
                    break;
                default:
                    console.error("Unkown type used for instance factory: " + componentDefinition.type);
                    break;
            }
            if (instance != undefined) {
                this.createComponent(instance, componentDefinition, context);
                if (doInitialization == true) {
                    // Does the initialization of the instance(datamodel,...) => widgets will be initialized later at the add of a widget to a splitter widget
                    instance.initialize();
                }
            }
            return instance;
            /* tslint:enable:max-func-body-length */
        }
        /**
         * Create component and initialize instance
         *
         * @private
         * @param {ComponentDefinition} componentDefinition
         * @param {(ComponentContext|undefined)} [context=undefined]
         * @param {IComponent} instance
         * @memberof ComponentFactory
         */
        createComponentAndInitializeInstance(componentDefinition, context = undefined, instance) {
            this._componentInstances.set(componentDefinition.id, instance);
            this.createComponent(instance, componentDefinition, context);
            instance.initialize();
        }
        /**
         * Dispose component
         *
         * @param {string} id
         * @memberof ComponentFactory
         */
        disposeComponent(id) {
            if (this._componentInstances.has(id)) {
                let instance = this._componentInstances.get(id);
                if (instance != undefined) {
                    instance.dispose();
                    this._componentInstances.delete(id);
                }
            }
        }
        /**
         * Creates an initializes the component object for the given instance(widget, datamodel, provider, ...)
         *
         * @private
         * @param {IComponent} instance
         * @param {ComponentDefinition} componentDefinition
         * @param {ComponentContext|undefined} context
         * @memberof ComponentFactory
         */
        createComponent(instance, componentDefinition, context) {
            instance.component = new componentBase_1.ComponentBase(this, instance);
            instance.component.initialize();
            if (context != undefined) {
                instance.component.context = context;
            }
            instance.component.setDefinition(componentDefinition);
        }
    };
    ComponentFactory = ComponentFactory_1 = __decorate([
        mco.role()
    ], ComponentFactory);
    exports.ComponentFactory = ComponentFactory;
});
