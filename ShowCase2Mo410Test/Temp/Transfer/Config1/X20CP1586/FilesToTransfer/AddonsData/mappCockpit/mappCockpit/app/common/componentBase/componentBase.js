var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./componentSettings", "../persistence/persistDataProvider", "../componentFactory/componentDefinition", "../../framework/componentHub/bindings/bindings", "../../framework/events", "./eventSubComponentsLoadedArgs", "./eventComponentSettingsLoadedArgs"], function (require, exports, componentSettings_1, persistDataProvider_1, componentDefinition_1, bindings_1, events_1, eventSubComponentsLoadedArgs_1, eventComponentSettingsLoadedArgs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentBase = void 0;
    let EventSubComponentsLoaded = class EventSubComponentsLoaded extends events_1.TypedEvent {
    };
    EventSubComponentsLoaded = __decorate([
        mco.role()
    ], EventSubComponentsLoaded);
    ;
    let EventComponentSettingsLoaded = class EventComponentSettingsLoaded extends events_1.TypedEvent {
    };
    EventComponentSettingsLoaded = __decorate([
        mco.role()
    ], EventComponentSettingsLoaded);
    ;
    let ComponentBase = class ComponentBase {
        /**
         * Returns the component factory
         *
         * @readonly
         * @type {(IComponentFactory | undefined)}
         * @memberof ComponentBase
         */
        get componentFactory() {
            return this._componentFactory;
        }
        /**
         * Disable persisting of data for this component
         *
         * @memberof ComponentBase
         */
        disablePersisting() {
            this._persistData = false;
        }
        /**
         * Returns persist state of component
         *
         * @returns {boolean}
         * @memberof ComponentBase
         */
        getPersistency() {
            return this._persistData;
        }
        /**
         * Creates an instance of ComponentBase
         * @param {(IComponentFactory|undefined)} componentFactory
         * @param {*} owner
         * @memberof ComponentBase
         */
        constructor(componentFactory, owner) {
            this.eventSubComponentsLoaded = new EventSubComponentsLoaded();
            this.eventComponentSettingsLoaded = new EventComponentSettingsLoaded();
            /**
             * Main definition of this component(e.g. type, id, default settings data id)
             *
             * @type {ComponentDefinition}
             * @memberof ComponentBase
             */
            this._definition = new componentDefinition_1.ComponentDefinition("", "", ""); // Create default component definition
            /**
             * List of all created sub components after loading settings data
             *
             * @protected
             * @type {{ [id: string]: any; }}
             * @memberof ComponentBase
             */
            this._subComponents = {};
            /**
             * Data of this component will not be persisted if this flag is false
             *
             * @memberof ComponentBase
             */
            this._persistData = true;
            this._componentSettings = new componentSettings_1.ComponentSettings();
            this._componentFactory = componentFactory;
            this._owner = owner;
        }
        /**
         * Initialize the component
         *
         * @memberof ComponentBase
         */
        initialize() {
            this._owner.initializeComponent();
            //this.logComponentDependencies();
            this.addDefaultComponentSettings();
            this.addAdditionalDefaultComponentSettings();
        }
        /**
         * Logs the default component dependencies(subcomponents, bindings, ...)
         *
         * @private
         * @memberof ComponentBase
         */
        /*private logComponentDependencies(){
            if(this._defaultDefinition != undefined){
                let defaultComponentSettings = this._defaultDefinition.getDefaultComponentSettings();
                if(defaultComponentSettings != undefined){
                    let dependencies = "";
                    let bindingsInfo = "";
    
                    let subComponents = defaultComponentSettings.getSubComponentSettings();
                    if(subComponents != undefined){
                        subComponents.forEach(subComponent => {
                            dependencies += subComponent.type + "; ";
                        });
                    }
                    let bindings = defaultComponentSettings.getBindingSettings();
                    if(bindings != undefined){
                        bindings.forEach(binding => {
                            bindingsInfo += binding.id + "; ";
                        });
                    }
                    if(bindingsInfo != ""){
                        console.error("Comp: " + this._owner.constructor.name + "; CompDeps: " + dependencies + "=> Bdgs: " + bindingsInfo);
                    }
                    else{
                        console.error("Comp: " + this._owner.constructor.name + "; CompDeps: " + dependencies);
                    }
                }
            }
            
        }*/
        /**
         * Raises the subComponentsLoaded event
         *
         * @param {ComponentBase} sender
         * @param {EventSubComponentsLoadedArgs} data
         * @memberof ComponentBase
         */
        onSubComponentsLoaded(sender, data) {
            this.eventSubComponentsLoaded.raise(sender, data);
        }
        /**
         * Raises the componentSettingsLoaded event
         *
         * @param {ComponentBase} sender
         * @param {EventComponentSettingsLoadedArgs} data
         * @memberof ComponentBase
         */
        onComponentSettingsLoaded(sender, data) {
            this.eventComponentSettingsLoaded.raise(sender, data);
        }
        /**
         * Returns the settings of this component
         *
         * @returns {ComponentSettings}
         * @memberof ComponentBase
         */
        getComponentSettings(onlyModified = false) {
            return this._componentSettings.getSettings(onlyModified);
        }
        /**
         * Sets settings to this component
         *
         * @param {(ComponentSettings|undefined)} settings
         * @memberof ComponentBase
         */
        setComponentSettings(settings) {
            if (settings != undefined) {
                // Set componentSettings
                this._componentSettings.setSettings(settings);
                let defaultSettingsData = this.getDefaultSettingsData();
                if (defaultSettingsData != undefined) {
                    // Currently SubComponent and Binding settings are static and were not saved, therefore the default settings must be used
                    let defaultSubComponentSettings = defaultSettingsData.getSubComponentSettings();
                    let subComponentSettings = this._componentSettings.getSubComponentSettings();
                    if (subComponentSettings == undefined && defaultSubComponentSettings != undefined) {
                        // Use default sub component settings if no sub component settings are available
                        this._componentSettings.setSubComponentSettings(defaultSubComponentSettings);
                    }
                    let defaultBindingSettings = defaultSettingsData.getBindingSettings();
                    let bindingSettings = this._componentSettings.getBindingSettings();
                    if (bindingSettings == undefined && defaultBindingSettings != undefined) {
                        // Use default binding settings if no sub component settings are available
                        this._componentSettings.setBindingSettings(defaultBindingSettings);
                    }
                }
            }
        }
        /**
         * Saves the component settings to the persisting data provider
         *
         * @memberof ComponentBase
         */
        saveComponentSettings() {
            if (this._persistData == true) {
                if (this.id != "") {
                    // Only persist if data was modified
                    persistDataProvider_1.PersistDataProvider.getInstance().setDataWithId(this.id, this._owner.getComponentSettings(true));
                }
                else {
                    console.warn("No id for persisting data available!(ComponentBase) => " + this.type);
                    console.warn(this);
                }
            }
        }
        /**
         * Loads the component settings from the persisting data provider(default or persisted data if available) to the component base,
         * and creates the subcomponents
         *
         * @memberof ComponentBase
         */
        loadComponentSettings() {
            let componentSettings = persistDataProvider_1.PersistDataProvider.getInstance().getDataWithId(this.id);
            if (this.useDefaultComponentSettings(componentSettings) == true) {
                componentSettings = this.getDefaultSettingsData();
            }
            // Get sub component settings of the component settings object or default if not available
            let subComponentSettings = this.getSubComponentSettings(componentSettings);
            // Create sub component before set settings to the owner of this component base (because sub components are sometimes needed in the owner setComponentSettings method)
            this.createSubComponents(subComponentSettings);
            // Raise sub components loaded event
            this.onSubComponentsLoaded(this, new eventSubComponentsLoadedArgs_1.EventSubComponentsLoadedArgs(this.getSubComponentsArray()));
            // Set the component settings
            this._owner.setComponentSettings(componentSettings);
            // Raise components settings loaded event
            this.onComponentSettingsLoaded(this, new eventComponentSettingsLoadedArgs_1.EventComponentSettingsLoadedArgs());
        }
        /**
         * Returns an array with the current sub components
         *
         * @private
         * @returns {Array<IComponent>}
         * @memberof ComponentBase
         */
        getSubComponentsArray() {
            let subComponents = new Array();
            let keys = Object.keys(this._subComponents);
            keys.forEach(key => {
                subComponents.push(this._subComponents[key]);
            });
            return subComponents;
        }
        /**
         * Returns the sub component settings of the component settings object or default if not available
         *
         * @private
         * @param {(ComponentSettings|undefined)} componentSettings
         * @returns {(ComponentDefinition[]|undefined)}
         * @memberof ComponentBase
         */
        getSubComponentSettings(componentSettings) {
            let subComponentSettings;
            if (componentSettings != undefined) {
                // Complete ComponentSetting object not available so we have to use the data array and the id to get the subcomponents data => getSubComponentSettings is not working here
                subComponentSettings = componentSettings.data[componentSettings_1.ComponentSettings.SubComponentsSettingId];
                if (subComponentSettings == undefined) {
                    let defaultSettingsData = this.getDefaultSettingsData();
                    if (defaultSettingsData != undefined) {
                        // Currently SubComponent and Binding settings are static and were not saved, therefore the default settings must be used
                        subComponentSettings = defaultSettingsData.getSubComponentSettings();
                    }
                }
            }
            return subComponentSettings;
        }
        /**
         * Returns true if no components settings are defined, or if persisting is deactivated, or version of component settings is not supported
         *
         * @private
         * @param {ComponentSettings} componentSettings
         * @returns {boolean}
         * @memberof ComponentBase
         */
        useDefaultComponentSettings(componentSettings) {
            if (componentSettings == undefined) {
                return true;
            }
            if (this._persistData == false) {
                return true;
            }
            if (this.isComponentSupportingSettings(componentSettings) == false) {
                return true;
            }
            return false;
        }
        /**
         * Check if the settings version is supported in this component version (equal versions are supported => only major version is checked)
         * major.minor => x.y (e.g)
         *
         * @private
         * @param {ComponentSettings} componentSettings
         * @returns {boolean}
         * @memberof ComponentBase
         */
        isComponentSupportingSettings(componentSettings) {
            let splittedSettingsVersion = componentSettings.version.split(".");
            let splittedComponentVersion = this._componentSettings.version.split(".");
            let settingVersionNumber = parseInt(splittedSettingsVersion[0], 10);
            let settingComponentNumber = parseInt(splittedComponentVersion[0], 10);
            // Currently only equal versions are allowed
            if (settingVersionNumber == settingComponentNumber) {
                return true;
            }
            return false;
        }
        /**
         * Adds the default component settings to the default settings provider
         *
         * @private
         * @memberof ComponentBase
         */
        addDefaultComponentSettings() {
            // Is a default persisting data id definied
            if (this.defaultSettingsDataId != "") {
                // Is some default persisting data defined
                if (this._defaultDefinition != undefined) {
                    let defaultComponentSettings = this._defaultDefinition.getDefaultComponentSettings();
                    if (defaultComponentSettings != undefined) {
                        // Add default persisting definition to the default persisting data provider
                        this.addComponentDefaultDefinitionToProvider(this.defaultSettingsDataId, defaultComponentSettings);
                    }
                }
            }
        }
        /**
         * Adds the additional defined default definitions which are defined in the defaultDefiniton to the defaultDefinitionProvider
         *
         * @private
         * @memberof ComponentBase
         */
        addAdditionalDefaultComponentSettings() {
            if (this._defaultDefinition != undefined) {
                let additionalDefaultComponentSettingsPackages = this._defaultDefinition.getAdditionalDefaultComponentSettings();
                if (additionalDefaultComponentSettingsPackages != undefined) {
                    additionalDefaultComponentSettingsPackages.forEach(settingsPackage => {
                        this.addComponentDefaultDefinitionToProvider(settingsPackage.id, settingsPackage.defaultSettings);
                    });
                }
            }
        }
        /**
         * Adds the given default component settings to the default persisting data provider(TODO: should be a seperated default componentSettings provider)
         *
         * @memberof ComponentBase
         */
        addComponentDefaultDefinitionToProvider(id, settings) {
            if (settings == undefined) {
                console.error("No default persisting data available for id: " + id);
            }
            else {
                persistDataProvider_1.PersistDataProvider.getInstance().setDefaultDataWithId(id, settings);
            }
        }
        addSubComponent(type, id, defaultSettingsDataId = "", context = undefined) {
            // Only add dynamic sub components to component settings if they should be persisted
            // this.getComponentSettings().addSubComponent(type, id, defaultInstanceDataId);
            let instance = this.createComponentInstance(new componentDefinition_1.ComponentDefinition(type, id, defaultSettingsDataId), context);
            if (instance != undefined) {
                this._subComponents[instance.component._definition.id] = instance;
            }
            return instance;
        }
        /**
         * Returns subcomponent for the given id
         *
         * @param {string} id
         * @returns {IComponent}
         * @memberof ComponentBase
         */
        getSubComponent(id) {
            return this._subComponents[id];
        }
        setBindingsData() {
            // Set bindings needed for this component
            let bindings = this.getSetting(componentSettings_1.ComponentSettings.BindingsSettingId);
            this.createBindings(bindings);
        }
        get type() {
            return this._definition.type;
        }
        set type(value) {
            this._definition.type = value;
            // Additionaly set type in componentSettings
            this._componentSettings.type = value;
        }
        get id() {
            return this._definition.id;
        }
        set id(value) {
            this._definition.id = value;
        }
        /**
         * Returns the defaultSettingsData id (the component uses this data at startup if no persited data is available for this component)
         *
         * @type {string}
         * @memberof ComponentBase
         */
        get defaultSettingsDataId() {
            return this._definition.defaultSettingsDataId;
        }
        /**
         * Sets the defaultSettingsDataid (the component uses this data at startup if no persited data is available for this component)
         *
         * @memberof ComponentBase
         */
        set defaultSettingsDataId(value) {
            this._definition.defaultSettingsDataId = value;
        }
        /**
         * Sets the componentDefaultDefinition
         *
         * @memberof ComponentBase
         */
        setDefaultDefinition(value) {
            if (value != undefined) {
                this.defaultSettingsDataId = value.defaultComponentSettingsId;
            }
            else {
                this.defaultSettingsDataId = "";
            }
            this._defaultDefinition = value;
        }
        /**
         * Returns the setting for the given key
         *
         * @param {string} key
         * @returns {(any|undefined)}
         * @memberof ComponentBase
         */
        getSetting(key) {
            let setting = undefined;
            if (this._componentSettings != undefined) {
                setting = this._componentSettings.getValue(key);
            }
            return setting;
        }
        /**
         * Sets a new setting with the given key and value to the componentSettings
         *
         * @param {string} key
         * @param {*} value
         * @memberof ComponentBase
         */
        setSetting(key, value) {
            if (this._componentSettings != undefined) {
                this._componentSettings.setValue(key, value);
            }
            else {
                console.error("ComponentSettings not available for setting data!");
            }
        }
        /**
         * Returns the coomponentDefinition of this component(type, id, defaultDataId)
         *
         * @returns {ComponentDefinition}
         * @memberof ComponentBase
         */
        getDefinition() {
            return this._definition;
        }
        /**
         * Sets the componentDefinition of this component(type, id, defaultDataId)
         *
         * @param {ComponentDefinition} value
         * @memberof ComponentBase
         */
        setDefinition(value) {
            let defaultSettingsDataId = this._definition.defaultSettingsDataId;
            this._definition = value;
            if (this._definition.defaultSettingsDataId == "") {
                this._definition.defaultSettingsDataId = defaultSettingsDataId; // Use old settings data id if not defined in the new one
            }
            // set type also to the component settings
            this._componentSettings.type = this._definition.type;
        }
        /**
         * Creates components for the given component definitions and add them to the sub components list of this component
         *
         * @protected
         * @param {Array<ComponentDefinition>} componentDefinitions
         * @memberof ComponentBase
         */
        createSubComponents(componentDefinitions) {
            if (componentDefinitions != undefined) {
                for (let i = 0; i < componentDefinitions.length; i++) {
                    let componentDef = componentDefinitions[i];
                    let instance = this.createComponentInstance(componentDef, this.context);
                    if (instance != undefined) {
                        this._subComponents[instance.component._definition.id] = instance;
                    }
                }
            }
        }
        /**
         * Creates a component instance with the given component definition if the component factory is available
         *
         * @private
         * @param {ComponentDefinition} componentDef
         * @returns {(IComponent|undefined)}
         * @memberof ComponentBase
         */
        createComponentInstance(componentDef, context) {
            if (this._componentFactory != undefined) {
                let instance = this._componentFactory.create(componentDef, context);
                if (instance != undefined) {
                    return instance;
                }
            }
            else {
                console.error("ComponentFactory not available!");
            }
            return undefined;
        }
        /**
         * Creates the bindings an binds them
         *
         * @protected
         * @param {Array<Binding>} bindings
         * @memberof ComponentBase
         */
        createBindings(bindings) {
            if (bindings != undefined) {
                for (let i = 0; i < bindings.length; i++) {
                    let binding = bindings[i];
                    // create new binding for this component (binding component = this.owner => e.g. widget, datamodel, ...)
                    bindings_1.Bindings.create(binding.type, binding.dataType, this._owner, binding.scope, binding.id, binding.targetKey, binding.sourceKey, binding.passByValue, this.context);
                }
            }
        }
        /**
         * Returns the default settings data which should be used for default startup of this component or undefined if not available
         *
         * @private
         * @returns {(ComponentSettings|undefined)}
         * @memberof ComponentBase
         */
        getDefaultSettingsData() {
            if (this._definition.defaultSettingsDataId != "") {
                return persistDataProvider_1.PersistDataProvider.getInstance().getDefaultDataWithId(this._definition.defaultSettingsDataId);
            }
            return undefined;
        }
    };
    ComponentBase = __decorate([
        mco.role()
    ], ComponentBase);
    exports.ComponentBase = ComponentBase;
});
