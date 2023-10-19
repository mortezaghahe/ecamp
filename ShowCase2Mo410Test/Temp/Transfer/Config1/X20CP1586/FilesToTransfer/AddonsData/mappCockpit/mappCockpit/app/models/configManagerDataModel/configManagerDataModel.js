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
define(["require", "exports", "./cmGroup", "../dataModelBase", "../dataModelInterface", "../online/mappCockpitComponent", "../online/mappCockpitComponentReflection", "../online/mappCockpitComponentService"], function (require, exports, cmGroup_1, dataModelBase_1, dataModelInterface_1, mappCockpitComponent_1, mappCockpitComponentReflection_1, mappCockpitComponentService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfigManagerDataModel = void 0;
    //import { ContextIdsComponent } from "../../common/componentBase/contextIds/contextIdsComponent";
    let ConfigManagerDataModel = class ConfigManagerDataModel extends dataModelBase_1.DataModelBase {
        constructor() {
            super(...arguments);
            /**
             * Holds the service channel
             *
             * @private
             * @type {(MappCockpitComponentService | null)}
             * @memberof ConfigManagerDataModel
             */
            this._serviceChannel = null;
            /**
             * Holds the last active parameters
             *
             * @private
             * @type {Array<MappCockpitComponentParameter>}
             * @memberof ConfigManagerDataModel
             */
            this._currentActiveComponentParameters = [];
            // holds the actual connected component
            this._actualComponent = undefined;
            /**
             * DataModel changed handler
             *
             * @private
             * @memberof ConfigManagerDataModel
             */
            this._dataModelChangedHandler = (sender, eventArgs) => { this.handleModelChanged(sender, eventArgs); };
            /**
             * Holds the info if the datamodel is currently in edit mode
             *
             * @private
             * @type {boolean}
             * @memberof ConfigManagerDataModel
             */
            this._editModeActive = false;
        }
        /**
         * Initialize the configmanager datamodel
         *
         * @memberof ConfigManagerDataModel
         */
        initialize() {
            // watch the data model for change events
            this.eventModelChanged.attach(this._dataModelChangedHandler);
            super.initialize();
        }
        /**
         * Initialize the component
         *
         * @memberof ConfigManagerDataModel
         */
        initializeComponent() {
            this.component.disablePersisting();
        }
        /**
         * Dispose the configmanager datamodel
         *
         * @memberof ConfigManagerDataModel
         */
        dispose() {
            var _a;
            this.eventModelChanged.detach(this._dataModelChangedHandler);
            // destroy observables
            mappCockpitComponent_1.MappCockpitComponentParameter.unobserveAll(this, (_a = this._currentActiveComponentParameters[0]) === null || _a === void 0 ? void 0 : _a.component);
        }
        /**
         * Sets the configurationparameters as the data source for the configuration manager datamodel
         *
         * @memberof ConfigManagerDataModel
         */
        set configurationParameters(configurationParameters) {
            let componentParameters = configurationParameters;
            if (componentParameters.length > 0) {
                this.onComponentParametersUpdated(componentParameters);
            }
        }
        /**
         * Returns the parameters of the component which is used in this datamodel
         *
         * @readonly
         * @type {(MappCockpitComponentParameter[]|undefined)}
         * @memberof ConfigManagerDataModel
         */
        get componentParameters() {
            return this._componentParameters;
        }
        /**
         * Handle component parameters update
         *
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @memberof ConfigManagerDataModel
         */
        onComponentParametersUpdated(componentParameters) {
            // filter the configuration parameters and update the parameter values
            if (componentParameters.length != 0 && componentParameters[0] != undefined) {
                this._componentParameters = componentParameters;
                this._actualComponent = this.getComponentFromParameters();
                if (this._actualComponent != undefined) {
                    this._data = this.createDataModelData(this._actualComponent);
                    // observe the service channel
                    this.connectServiceChannel(this._actualComponent);
                }
                this.observeConfigParameters(componentParameters);
                // Initialize the datamodel after observing the first data
                this.updateFiltersInDataModel();
                this.onModelChanged(this, new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this));
            }
        }
        /**
         * Connects to the service channel for calling service methods (...bulk write) and observing service notifications
         *
         * @private
         * @param {MappCockpitComponent} component
         * @memberof ConfigManagerDataModel
         */
        connectServiceChannel(component) {
            if (component.serviceChannel) {
                // connect and preserve the service channel
                this._serviceChannel = component.serviceChannel;
                // observe the service notification
                this.observeParameterSetWriteResponse(component);
            }
        }
        /**
           * handles the component parameter update.
           *
           * @param {MappCockpitComponentDataModel} sender
           * @param {EventModelChangedArgs} eventArgs
           * @memberof ConfigManagerDataModel
           */
        handleEventComponentParametersUpdated(sender, eventArgs) {
            let componentParameters = eventArgs.data;
            if (componentParameters) {
                let configParameters = mappCockpitComponentReflection_1.MappCockpitComponentParameterInfo.retrieveConfigurationParameters(componentParameters);
                if (configParameters.length > 0) {
                    this._componentParameters = configParameters;
                    let component = this.getComponentFromParameters();
                    if (component != undefined) {
                        this._data = this.createDataModelData(component);
                    }
                }
                this.onModelChanged(this, new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this));
            }
        }
        /**
         * Returns the configuration structure metaInfo for the given component
         *
         * @private
         * @param {MappCockpitComponent} component
         * @returns {*} metaInfo object from the component
         * @memberof ConfigManagerDataModel
         */
        getMetaInfoFromComponent(component) {
            let compMetaData = component.metaData;
            if (compMetaData != undefined) {
                return compMetaData.MetaConfigConfigProps;
            }
            return undefined;
        }
        /**
         * handles model changes
         *
         * @param {IDataModel} sender
         * @param {EventModelChangedArgs} eventArgs
         * @memberof ConfigManagerDataModel
         */
        handleModelChanged(sender, eventArgs) {
            // external model changes with change type "updateSource" have to be forwarded (written) to the source
            if (eventArgs.caller !== this && eventArgs.changeType === dataModelInterface_1.ModelChangeType.updateSource) {
                console.log("handleModelChanged (%o) : %o", this, eventArgs);
                let modifiedComponentParameter = eventArgs.hint.changedItemData.componentParameter;
                // modify parameter value
                this.modifyParameter(modifiedComponentParameter, eventArgs.hint.newItemData);
            }
        }
        /**
         * Modifies the specified parameter value
         *
         * @param {MappCockpitComponentParameter} modifiedParameter
         * @param {*} newItemData
         * @memberof ConfigManagerDataModel
         */
        modifyParameter(modifiedParameter, value) {
            // preserve the modified value ...
            modifiedParameter.modifiedDisplayValue = value;
        }
        /**
         * Applies the modified parameter set
         *
         * @memberof ConfigManagerDataModel
         */
        applyModifiedParameters() {
            // get the modified parameters
            let modifiedParameters = this.getModifiedParameters();
            // exit on no parameters to modify or the component not defined
            if (modifiedParameters.length > 0) {
                // get the component holding the parameters
                const component = modifiedParameters[0].component;
                if (component && component.serviceChannel) {
                    // invoke writing the parameter set
                    ((component) => __awaiter(this, void 0, void 0, function* () {
                        const success = yield component.serviceChannel.writeParameterSet(modifiedParameters);
                        if (success) {
                            // the request has been invoked successfully ....-> wait for  and handle response event
                            console.log("Parameter write pending ...: %0 ", modifiedParameters);
                        }
                        else {
                            // the request could not be invoked successfully ... -> handle request failure
                            console.log("Could not write parameters: %0 ", modifiedParameters);
                            this.setParametersTransferFailed(modifiedParameters);
                        }
                    }))(component);
                }
                else {
                    console.error("Component or service channel of the component not available!");
                }
            }
        }
        /**
         * Sets all the given parameters to transferFailed
         *
         * @private
         * @param {MappCockpitComponentParameter[]} modifiedParameters
         * @memberof ConfigManagerDataModel
         */
        setParametersTransferFailed(modifiedParameters) {
            modifiedParameters.forEach(modifiedParameters => {
                modifiedParameters.transferFailed = true;
            });
            // Update transfer failed icon in the view 
            this.onModelChanged(this, new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this));
        }
        /**
         * Returns the modified parameters
         *
         * @private
         * @returns {Array<MappCockpitComponentParameter>}
         * @memberof ConfigManagerDataModel
         */
        getModifiedParameters() {
            const modifiedParameters = new Array();
            this.componentParameters.forEach(parameter => {
                if (parameter.modifiedValue != undefined) {
                    let isFiltered = this.isParameterFiltered(parameter, this._data);
                    if (isFiltered == false) {
                        // Add parameter only to modified parameter list if parameter is not filtered(not shown in config manager)
                        modifiedParameters.push(parameter);
                    }
                }
            });
            return modifiedParameters;
        }
        /**
         * Returns true if this component parameter is used within a filtered configManager parameter
         *
         * @private
         * @param {MappCockpitComponentParameter} componentParameter
         * @param {Array<ICmParameter>} parameters
         * @returns {boolean}
         * @memberof ConfigManagerDataModel
         */
        isParameterFiltered(componentParameter, parameters) {
            for (let i = 0; i <= parameters.length; i++) {
                let parameter = parameters[i];
                if (parameter != undefined) {
                    if (parameter.componentParameter == componentParameter) {
                        if (parameter.filter != undefined) {
                            if (parameter.filter.active == true) {
                                return true;
                            }
                        }
                    }
                    else if (parameter instanceof cmGroup_1.CmGroup) {
                        let filtered = this.isParameterFiltered(componentParameter, parameter.childs);
                        if (filtered == true) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        /**
         * Discards user edited parameter modifications
         *
         * @memberof ConfigManagerDataModel
         */
        discardModifications() {
            // clear modifications 
            this.clearModifiedParameters();
        }
        /**
         * Sets the edit mode and updates the datamodel
         *
         * @param {boolean} active
         * @memberof ConfigManagerDataModel
         */
        setEditModeActive(active) {
            this._editModeActive = active;
            let component = this.getComponentFromParameters();
            if (component != undefined) {
                this.setDataModelActive(active);
                this.updateFiltersInDataModel();
            }
        }
        /**
         * Sets the edit mode for the data model.
         *
         * @private
         * @param {boolean} active
         * @returns {*}
         * @memberof ConfigManagerDataModel
         */
        setDataModelActive(active) {
            this.parseDataModel(this._data, (cmParameter) => {
                cmParameter.editModeActive = active;
            });
        }
        /**
         * Returns the component of the given component parameters(first parameter)
         *
         * @private
         * @returns {(MappCockpitComponentItem|undefined)}
         * @memberof ConfigManagerDataModel
         */
        getComponentFromParameters() {
            // TODO: Get component via context (this.component.context?.getContext(ContextIdsComponent.ComponentId))
            if (this.componentParameters != undefined) {
                if (this.componentParameters.length > 0) {
                    let component = this.componentParameters[0].component;
                    if (component != null) {
                        return component;
                    }
                }
            }
            return undefined;
        }
        /**
         * Marks the parameters with a flag that the parameter value was not transfered
         *
         * @private
         * @param {(Array<ComponentServiceResponseDataChangedParameter>|undefined)} [failedParameters=undefined]
         * @memberof ConfigManagerDataModel
         */
        setTransferFailedParameters(failedParameters) {
            this.componentParameters.forEach(parameter => {
                let foundParam = failedParameters.find(param => param.key == parameter.browseName);
                if (foundParam != undefined) {
                    parameter.transferFailed = true;
                }
            });
        }
        /**
         * Clears the modified parameters
         *
         * @private
         * @param {(Array<ComponentServiceResponseDataChangedParameter>|undefined)} [parametersToClear=undefined]
         * @memberof ConfigManagerDataModel
         */
        clearModifiedParameters(parametersToClear = undefined) {
            if (this.componentParameters == undefined) {
                // no componentParameters available => no clear of parameters possible
                return;
            }
            this.componentParameters.forEach(parameter => {
                if (parametersToClear == undefined) {
                    parameter.modifiedValue = undefined;
                    parameter.transferFailed = false;
                }
                else {
                    let paramFound = parametersToClear.find(param => param.key == parameter.browseName);
                    if (paramFound != undefined) {
                        parameter.modifiedValue = undefined;
                        parameter.transferFailed = false;
                    }
                }
            });
            this.updateFiltersInDataModel();
        }
        /**
         * Updates all filters and raises the model changed event
         *
         * @memberof ConfigManagerDataModel
         */
        updateFiltersInDataModel() {
            // update the active parameter set according to the filter criteria
            this.updateFilterState();
            // update parameter change observation
            this.updateActiveParameterObservables();
            // Update modified value (modified icon) in the view 
            this.onModelChanged(this, new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this));
        }
        /**
         * Retrieves the active parameters and updates the required observables (monitored items)
         *
         * @private
         * @memberof ConfigManagerDataModel
         */
        updateActiveParameterObservables() {
            // get the currently active and obsolete parameters
            const { activatedParameters, deactivatedParameters, newActiveConfigParameters } = this.retrieveParameterSetChanges();
            // add new observers and remove obsolete ones.
            this.updateParameterObservables(activatedParameters, deactivatedParameters);
            // keep the currently activated parameters.
            this._currentActiveComponentParameters = newActiveConfigParameters;
        }
        /**
         * Detects changes of the active parameter set and returns the activated and obsolete parameters
         *
         * @private
         * @returns
         * @memberof ConfigManagerDataModel
         */
        retrieveParameterSetChanges() {
            // retrieve the currently active parameters
            let newActiveConfigParameters = this.retrieveActiveParameters(this._data);
            // find newly activated parameters to be observed
            const activatedParameters = newActiveConfigParameters.filter(parameter => !this._currentActiveComponentParameters.includes(parameter));
            // find obsolete parameters to be unobserved
            const deactivatedParameters = this._currentActiveComponentParameters.filter(parameter => !newActiveConfigParameters.includes(parameter));
            return { activatedParameters, deactivatedParameters, newActiveConfigParameters };
        }
        /**
         * Updates the active monitored items for observing parameter changes
         *
         * @private
         * @param {MappCockpitComponentParameter[]} activatedParameters
         * @param {MappCockpitComponentParameter[]} deactivatedParameters
         * @memberof ConfigManagerDataModel
         */
        updateParameterObservables(activatedParameters, deactivatedParameters) {
            // create and call an async context to make sure that observing and unobserving is called strictly consecutive.
            (() => __awaiter(this, void 0, void 0, function* () {
                // observe the new activated parameters
                if (activatedParameters.length > 0) {
                    yield this.observeConfigParameterValues(activatedParameters);
                    console.log("ConfigManagerDataModel:observed - %o", activatedParameters);
                }
                // unobserve the parameters 
                if (deactivatedParameters.length > 0) {
                    yield this.unobserveConfigParameterValues(deactivatedParameters);
                    console.log("ConfigManagerDataModel:unobserved - %o", deactivatedParameters);
                }
            }))();
        }
        /**
         * Creates the datamodel data for the given metaInformation
         *
         * @private
         * @param {*} metaInformation
         * @returns {Array<ICmGroup>}
         * @memberof ConfigManagerDataModel
         */
        createDataModelData(component) {
            let metaInformation = this.getMetaInfoFromComponent(component);
            let metaInformationDataModel = new Array();
            if (metaInformation.ConfigurationStructure != null) {
                if (metaInformation.ConfigurationStructure.Childs != null) {
                    metaInformation.ConfigurationStructure.Childs.forEach(element => {
                        metaInformationDataModel.push(new cmGroup_1.CmGroup(element.Group, this.componentParameters, this._editModeActive));
                    });
                }
            }
            return metaInformationDataModel;
        }
        /**
         * Updates all filters of the given cmParameters(or the whole datamodel if undefined)if they are active or not for there corresponding values
         *
         * @param {(ICmParameter[]|undefined)} [cmParameters=undefined]
         * @returns
         * @memberof ConfigManagerDataModel
         */
        updateFilterState(cmParameters = undefined) {
            if (cmParameters == undefined) {
                cmParameters = this._data;
            }
            if (cmParameters == undefined) {
                return;
            }
            cmParameters.forEach(element => {
                if (element instanceof cmGroup_1.CmGroup) {
                    if (element.filter != null) {
                        this.updateFilter(element.filter, element.editModeActive);
                    }
                    if (element.childs != null) {
                        this.updateFilterState(element.childs);
                    }
                }
                else {
                    if (element.filter != null) {
                        this.updateFilter(element.filter, element.editModeActive);
                    }
                }
            });
        }
        /**
         * Retrieves the flat parameters currently active (or needed for filtering)
         *
         * @private
         * @param {ICmParameter[]} cmParameters
         * @returns {MappCockpitComponentParameter[]}
         * @memberof ConfigManagerDataModel
         */
        retrieveActiveParameters(cmParameters) {
            let parameters = new Map();
            // parse the data model and retrieve all active items.
            this.parseDataModel(cmParameters, (cmParameter) => {
                var _a;
                let filterParameter = (_a = this.componentParameters) === null || _a === void 0 ? void 0 : _a.find(componentParameter => { var _a; return componentParameter.browseName == ((_a = cmParameter.filter) === null || _a === void 0 ? void 0 : _a.parameterRef); });
                if (filterParameter != undefined) {
                    // Add also parameters needed for filters
                    parameters.set(filterParameter.browseName, filterParameter);
                }
                if (cmParameter.componentParameter) {
                    // if we find a cmParameter we just collect the component parameter
                    if (cmParameter.filter === undefined || (cmParameter.filter && !cmParameter.filter.active)) {
                        parameters.set(cmParameter.componentParameter.browseName, cmParameter.componentParameter);
                    }
                }
            });
            return Array.from(parameters.values());
        }
        /**
         * Parses the data model and calls the processing function for every model item
         *
         * @private
         * @param {ICmParameter[]} cmParameters
         * @param {(cmParameter:ICmParameter)=> void} processingDelegate
         * @memberof ConfigManagerDataModel
         */
        parseDataModel(cmParameters, processingDelegate) {
            cmParameters.forEach((cmParameter) => {
                // call the processing function with the current model item
                processingDelegate(cmParameter);
                // in case of a group we need to iterate its childs and call the parsing method recursive ...
                if (cmParameter instanceof cmGroup_1.CmGroup && cmParameter.childs && cmParameter.childs.length > 0) {
                    this.parseDataModel(cmParameter.childs, processingDelegate);
                }
            });
        }
        /**
         * Updates the info, if the filter is active for the given parameter with the given value
         *
         * @private
         * @param {ICmFilter} filter
         * @param {boolean} editModeActive
         * @returns
         * @memberof ConfigManagerDataModel
         */
        updateFilter(filter, editModeActive) {
            filter.active = false;
            if (filter.parameterRef == "" && filter.parameterValue == undefined && filter.parameterValues == undefined) {
                return; // No filter defined
            }
            var paramValue = this.getParameterValueFromSource(filter.parameterRef, editModeActive);
            if (paramValue == undefined) {
                filter.active = true;
                return;
            }
            if (filter.parameterValue != undefined) {
                // Check single parameterValue filter
                if (paramValue != filter.parameterValue) {
                    filter.active = true;
                }
            }
            else if (filter.parameterValues != undefined) {
                // Check multiple parameterValue filter
                filter.active = true;
                filter.parameterValues.forEach(filterParamValue => {
                    if (filterParamValue == paramValue) {
                        filter.active = false;
                    }
                });
            }
        }
        /**
         * Returns the value/modified value for the given parameter reference name
         *
         * @private
         * @param {string} parameterRef
         * @param {boolean} editModeActive
         * @returns {(string | undefined)}
         * @memberof ConfigManagerDataModel
         */
        getParameterValueFromSource(parameterRef, editModeActive) {
            if (this.componentParameters == undefined) {
                return undefined;
            }
            for (let parameter of this.componentParameters) {
                if (parameter.browseName == parameterRef) {
                    let value = parameter.modifiedValue;
                    if (editModeActive == false) {
                        value = parameter.value; // Use value instead of modifiedValue if editMode is not active
                    }
                    if (value == undefined) {
                        value = parameter.value; // Use value if no modified value is defined
                    }
                    return value;
                }
            }
            return undefined;
        }
        /**
         * Observes the config parameters for changes
         *
         * @param {MappCockpitComponentParameter[]} observableParmeters
         * @returns {*}
         * @memberof ConfigManagerDataModel
         */
        observeConfigParameters(observableParmeters) {
            // observe component write access
            this.observeComponentWriteAccess(observableParmeters);
            // add the service channel parameter to the observables
            const serviceChannelInfoParameter = this._serviceChannel && this._serviceChannel && this._serviceChannel.infoChannel ? this._serviceChannel.infoChannel : null;
            if (serviceChannelInfoParameter) {
                // observableParmeters.push(serviceChannelInfoParameter);
                mappCockpitComponent_1.MappCockpitComponentParameter.observeParameterValueChanges(this, [serviceChannelInfoParameter]);
            }
        }
        /**
         * Adds the specified parameters as observables
         *
         * @private
         * @param {MappCockpitComponentParameter[]} observableParmeters
         * @memberof ConfigManagerDataModel
         */
        observeConfigParameterValues(observableParmeters) {
            return __awaiter(this, void 0, void 0, function* () {
                yield mappCockpitComponent_1.MappCockpitComponentParameter.observeParameterValueChanges(this, observableParmeters);
            });
        }
        /**
         * Removes the specified parameters as observables.
         *
         * @private
         * @param {MappCockpitComponentParameter[]} observableParmeters
         * @memberof ConfigManagerDataModel
         */
        unobserveConfigParameterValues(observableParmeters) {
            return __awaiter(this, void 0, void 0, function* () {
                yield mappCockpitComponent_1.MappCockpitComponentParameter.unobserveComponentModelItems(this, observableParmeters);
            });
        }
        /**
         * Observes the component reply channel for the purpose of receiving the response for parameter set write requests.
         *
         * @private
         * @param {MappCockpitComponent} component
         * @memberof ConfigManagerDataModel
         */
        observeParameterSetWriteResponse(component) {
            // get the components reply channel parameter ...
            const serviceChannelInfoParameter = this._serviceChannel && this._serviceChannel && this._serviceChannel.infoChannel ? this._serviceChannel.infoChannel : null;
            // ...and observe the info channel parameter
            if (serviceChannelInfoParameter) {
                // listen to the response notifications
                serviceChannelInfoParameter.valueSource.changed((infoChannelData) => {
                    this.handleParameterSetWriteResponse(infoChannelData);
                });
            }
        }
        /**
       * Handles the notification in response to parameter set write requests.
       *
       * @private
       * @param {*} responseData
       * @memberof ConfigManagerDataModel
       */
        handleParameterSetWriteResponse(serviceInfoData) {
            if (serviceInfoData) {
                try {
                    const serviceResponseData = JSON.parse(serviceInfoData);
                    // process the service response 
                    switch (serviceResponseData.eventType) {
                        case mappCockpitComponentService_1.ComponentServiceRequestType.changeParameterSet:
                            this.handleServiceResponseChangeParameterSet(serviceResponseData);
                            break;
                        default:
                            break;
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
        /**
         * Handles the service response for parameter set changed.
         *
         * @private
         * @param {ServiceResponseChangeParameters} serviceResponseData
         * @memberof ConfigManagerDataModel
         */
        handleServiceResponseChangeParameterSet(serviceResponseData) {
            var _a;
            // the response id needs to match the request id to make sure that the result corresponds to the request!
            if ((_a = this._serviceChannel) === null || _a === void 0 ? void 0 : _a.requestIsPending(serviceResponseData.requestID)) {
                // rejected parameters need to be indicated as erroneous. 
                const rejectedParameters = serviceResponseData.eventData.rejected ? serviceResponseData.eventData.rejected : [];
                this.setTransferFailedParameters(rejectedParameters);
                // applied parameters are considered as no longer modified. Thus the corresponding modified parameters ( or state ) need to be removed
                const appliedParameters = serviceResponseData.eventData.applied ? serviceResponseData.eventData.applied : [];
                this.clearModifiedParameters(appliedParameters);
                // now we can clear the matching pending request.
                this._serviceChannel.clearPendingRequest(serviceResponseData.requestID);
            }
        }
        /**
         * handles observable changes
         *
         * @param {Observable[]} changedObservables
         * @memberof ConfigManagerDataModel
         */
        onObservablesChanged(changedObservables) {
            console.log("onObservablesChanged: %o %o", this, changedObservables);
            this.updateFiltersInDataModel();
        }
        /**
         * Observes if the component changes the write access
         *
         * @param {MappCockpitComponentParameter[]} configParameters
         * @returns {*}
         * @memberof ConfigManagerDataModel
         */
        observeComponentWriteAccess(configParameters) {
            // we use a single parameter to get the parent component and observe changes of the write acces value.
            configParameters[0].component.writeAccess.changed((writeAccess) => {
                // invoke common model changed processing triggered by write access change.
                this.onModelChanged(this, new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "componentParametersUpdated", this));
                // invoke specific write access changed changed processing.
                this.onModelChanged(this, new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateTarget, "writeAccessChanged", writeAccess));
            });
        }
    };
    ConfigManagerDataModel = __decorate([
        mco.role()
    ], ConfigManagerDataModel);
    exports.ConfigManagerDataModel = ConfigManagerDataModel;
});
