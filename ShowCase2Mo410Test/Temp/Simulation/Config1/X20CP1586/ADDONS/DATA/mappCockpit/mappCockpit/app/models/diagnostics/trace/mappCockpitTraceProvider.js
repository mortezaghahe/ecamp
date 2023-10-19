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
define(["require", "exports", "../mappCockpitCommonInfoProvider", "./traceDataPointInfo", "../../../framework/property", "../../../framework/command", "./mappCockpitTraceComponent", "../../../framework/componentHub/bindings/bindings", "../../../framework/componentHub/bindings/bindingDeclarations"], function (require, exports, mappCockpitCommonInfoProvider_1, traceDataPointInfo_1, property_1, command_1, mappCockpitTraceComponent_1, bindings_1, Binding) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitTraceProvider = void 0;
    /**
     * Implements trace access services
     *
     * @class MappCockpitTraceProvider
     */
    let MappCockpitTraceProvider = class MappCockpitTraceProvider {
        /**
         * Creates an instance of MappCockpitTraceProvider.
         * @param {MappCockpitDiagnosticProvider} diagnosticProvider
         * @memberof MappCockpitTraceProvider
         */
        constructor(diagnosticProvider) {
            this._diagnosticProvider = diagnosticProvider;
            this._availableTraceDataPoints = property_1.Property.create([]);
            this.createCommands();
        }
        onTraceComponentIdsUpdated(traceComponentIds) {
            //BINDINGSOURCE: method stub supporting bindability
        }
        /**
         * Creates the exposed commands
         *
         * @private
         * @memberof MappCockpitTraceProvider
         */
        createCommands() {
            this._commandReadAvailableTracePoints = command_1.Command.create(this, this.executeCommandReadAvailableTracePoints());
        }
        /**
         * Initializes and connects the trace provider
         *
         * @returns {Promise<any>}
         * @memberof MappCockpitTraceProvider
         */
        initialize() {
            return __awaiter(this, void 0, void 0, function* () {
                this.createComponentBindings();
                this.traceComponents = yield this.initializeTraceComponents();
                yield this.commandReadAvailableTracePoints.execute(null, (availableTraceDataPoints) => {
                    this.updateAvailableTracePointsInfo(availableTraceDataPoints);
                });
            });
        }
        /**
         * Creates the bindings to other components
         *
         * @private
         * @memberof MappCockpitTraceProvider
         */
        createComponentBindings() {
            bindings_1.Bindings.createByDecl(Binding.Traces.ComponentIds, this, "", "onTraceComponentIdsUpdated", false);
            bindings_1.Bindings.createByDecl(Binding.Traces.AvailableDataPoints, this, "", "updateAvailableDataPoints", false);
        }
        /**
         * Notifies from updating the available trace points
         *
         * @private
         * @param {TraceDataPointInfo[]} availableTraceDataPoints
         * @memberof MappCockpitTraceProvider
         */
        updateAvailableTracePointsInfo(availableTraceDataPoints) {
            this._availableTraceDataPoints.value = availableTraceDataPoints;
            //TODO: extract to own method to be called from the red trace points response
            this.traceComponents.forEach(traceComponent => {
                traceComponent.updateDataPointInformations(traceComponent.traceConfigurationData);
            });
        }
        /**
         * Command for reading the currently available trace points.
         *
         * @readonly
         * @type {Command<any, TraceData>}
         * @memberof MappCockpitTraceProvider
         */
        get commandReadAvailableTracePoints() {
            return this._commandReadAvailableTracePoints;
        }
        /**
         * Implements the command for reading the available trace points
         *
         * @returns {*}
         * @memberof MappCockpitTraceProvider
         */
        executeCommandReadAvailableTracePoints() {
            return (commandArguments, commandResponse) => {
                this.readAllTraceDataPoints().then((traceDataPoints) => {
                    commandResponse.executed(traceDataPoints);
                }).catch((error) => {
                    commandResponse.rejected(error);
                });
            };
        }
        /**
         * Returns the trace components
         *
         * @readonly
         * @type {MappCockpitTraceComponent[]}
         * @memberof MappCockpitTraceProvider
         */
        get traceComponents() {
            return this._traceComponents;
        }
        set traceComponents(traceComponents) {
            this._traceComponents = traceComponents;
            let userComponentIds = this._traceComponents.map(component => component.mappCockpitComponent.browseName);
            this.onTraceComponentIdsUpdated(userComponentIds);
        }
        /**
         * Gets the traceable data points
         *
         * @readonly
         * @type {Property<Array<TraceDataPoint>>}
         * @memberof MappCockpitTraceProvider
         */
        get availableDataPoints() {
            return this._availableTraceDataPoints;
        }
        /**
         * Initializes and connects the target trace components
         *
         * @private
         * @memberof MappCockpitTraceProvider
         */
        initializeTraceComponents() {
            return __awaiter(this, void 0, void 0, function* () {
                let components = yield this.getTraceComponents();
                let traceComponents = new Array();
                for (let i = 0; i < components.length; i++) {
                    let traceComponent = new mappCockpitTraceComponent_1.MappCockpitTraceComponent(this._diagnosticProvider, components[i]);
                    traceComponent.availableTraceDataPoints = this._availableTraceDataPoints;
                    traceComponents.push(traceComponent);
                }
                ;
                return traceComponents;
            });
        }
        /**
         * gets the trace components from all available components
         *
         * @private
         * @memberof MappCockpitTraceProvider
         */
        getTraceComponents() {
            return __awaiter(this, void 0, void 0, function* () {
                let traceComponents = this._diagnosticProvider.model.components.filter(component => { return component.browseName == "NewTraceConfig"; });
                if (traceComponents.length == 1) {
                    // Set Displayname of trace component "NewTraceConfig" to "Trace"
                    traceComponents[0].displayName = "Trace";
                    return traceComponents;
                }
                return new Array();
            });
        }
        /**
         * Reads the available trace datapoints from all components.
         *
         * @private
         * @returns
         * @memberof MappCockpitTraceProvider
         */
        readAllTraceDataPoints() {
            return __awaiter(this, void 0, void 0, function* () {
                let allAvailableTraceDataPoints = new Array();
                // get the traceable components
                let traceableComponents = yield this.readTraceProviderComponents();
                // collect the components data points into one flat array
                traceableComponents.forEach((traceableComponentcomponent) => {
                    let componetTracePoints = this.readComponentTraceDataPoints(traceableComponentcomponent);
                    allAvailableTraceDataPoints = allAvailableTraceDataPoints.concat(componetTracePoints);
                });
                // update the available trace points link.
                this._availableTraceDataPoints.value = allAvailableTraceDataPoints;
                this.updateAvailableDataPoints(allAvailableTraceDataPoints);
                return allAvailableTraceDataPoints;
            });
        }
        /**
         * Updates the available data points
         *
         * @private
         * @param {TraceDataPointInfo[]} allAvailableTraceDataPoints
         * @memberof MappCockpitTraceProvider
         */
        updateAvailableDataPoints(allAvailableTraceDataPoints) {
            // BINDINGSOURCE: method stub to make the passed data bindable
        }
        /**
         * Collects components supporting traceability and exposing tracepoints
         *
         * @returns {Array<MappCockpitComponent>}
         * @memberof MappCockpitTraceProvider
         */
        readTraceProviderComponents() {
            return __awaiter(this, void 0, void 0, function* () {
                let traceComponents = new Array();
                //let allComponents = this._diagnosticProvider.model.components;
                let allComponents = yield this._diagnosticProvider.componentProvider.browseComponents();
                for (let i = 0; i < allComponents.length; i++) {
                    const component = allComponents[i];
                    yield mappCockpitCommonInfoProvider_1.MappCockpitCommonInfoProvider.getInstance().readComponentMetaInfo(component);
                }
                traceComponents = allComponents.filter((component) => { return component.metaData && component.metaData.MetaConfigDatapoints; });
                return traceComponents;
            });
        }
        /**
         * Reads the trace data points from a single component
         *
         * @private
         * @param {MappCockpitComponent} traceableComponent
         * @memberof MappCockpitTraceProvider
         */
        readComponentTraceDataPoints(traceableComponent) {
            let traceDataPoints = [];
            let traceMetaInfo = traceableComponent.metaData.MetaConfigDatapoints.DataPointsDefinition;
            traceMetaInfo.Namespaces.forEach((namespace) => {
                namespace.Data.DataPoints.forEach((dataPointRef) => {
                    traceDataPoints.push(traceDataPointInfo_1.TraceDataPointInfo.create(traceableComponent.browseName, traceMetaInfo.DeviceAddress, namespace, dataPointRef));
                });
            });
            return traceDataPoints;
        }
    };
    MappCockpitTraceProvider = __decorate([
        mco.role()
    ], MappCockpitTraceProvider);
    exports.MappCockpitTraceProvider = MappCockpitTraceProvider;
});
