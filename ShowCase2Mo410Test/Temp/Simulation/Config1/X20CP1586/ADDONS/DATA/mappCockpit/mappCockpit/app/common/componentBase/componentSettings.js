var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/componentFactory/componentDefinition", "../../framework/componentHub/bindings/binding", "../persistence/settings"], function (require, exports, componentDefinition_1, binding_1, settings_1) {
    "use strict";
    var ComponentSettings_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentSettings = void 0;
    let ComponentSettings = ComponentSettings_1 = class ComponentSettings extends settings_1.Settings {
        /**
         * Creates an instance of ComponentSettings
         * @memberof ComponentSettings
         */
        constructor() {
            super("");
        }
        /**
         * Sets the given component settings information to this component settings
         *
         * @param {(ISettings|undefined)} settings
         * @memberof ComponentSettings
         */
        setSettings(settings) {
            if (settings != undefined) {
                if (settings.type != "") {
                    this.type = settings.type;
                }
                this.version = settings.version;
                this.data = settings.data;
            }
        }
        getSettings(onlyModified = false) {
            if (onlyModified) {
                let onlyModifiedSettings = new ComponentSettings_1();
                onlyModifiedSettings.type = this.type;
                onlyModifiedSettings.version = this.version;
                let keys = Object.keys(this.data);
                keys.forEach(key => {
                    // TODO: compare with default settings
                    // Currently SubComponent and Binding settings are static und must not be saved(or returned with getSettings)
                    if (key != ComponentSettings_1.SubComponentsSettingId && key != ComponentSettings_1.BindingsSettingId) {
                        let data = this.data[key];
                        onlyModifiedSettings.setValue(key, data);
                    }
                });
                return onlyModifiedSettings;
            }
            else {
                return this;
            }
        }
        /**
         * Adds a new (sub) component to this component settings
         *
         * @param {string} type
         * @param {string} id
         * @param {string} [defaultInstanceDataId=""]
         * @memberof ComponentSettings
         */
        addSubComponent(type, id, defaultInstanceDataId = "") {
            let addComponentData = false;
            // Find components data
            let components = this.getSubComponentSettings();
            if (components == undefined) {
                // Create components data
                components = new Array();
                addComponentData = true;
            }
            // Add component to sub components list
            components.push(new componentDefinition_1.ComponentDefinition(type, id, defaultInstanceDataId));
            if (addComponentData == true) {
                this.setValue(ComponentSettings_1.SubComponentsSettingId, components);
            }
        }
        /**
         * Adds a new binding via bindingDeclaration to this component settings
         *
         * @param {IBindingDeclaration} bindingDeclaration
         * @param {string} targetKey
         * @param {string} sourceKey
         * @param {boolean} [passByValue=true]
         * @memberof ComponentSettings
         */
        addBindingByDecl(bindingDeclaration, targetKey, sourceKey, passByValue = true) {
            this.addBinding(bindingDeclaration.bindingType, bindingDeclaration.dataType, bindingDeclaration.scope, bindingDeclaration.id, targetKey, sourceKey, passByValue);
        }
        /**
         * Adds a new binding to this component settings
         *
         * @private
         * @param {BindingType} type
         * @param {TConnectionDataType} dataType
         * @param {string} scope
         * @param {string} id
         * @param {string} targetKey
         * @param {string} sourceKey
         * @param {boolean} [passByValue=true]
         * @memberof ComponentSettings
         */
        addBinding(type, dataType, scope, id, targetKey, sourceKey, passByValue = true) {
            let addBindingsData = false;
            // Find bindings data
            let bindings = this.getValue(ComponentSettings_1.BindingsSettingId);
            if (bindings == undefined) {
                // Create binding data
                bindings = new Array();
                addBindingsData = true;
            }
            // Add binding to bindings data
            const binding = new binding_1.Binding();
            binding.type = type;
            binding.dataType = dataType;
            //binding.component = undefined;
            binding.scope = scope;
            binding.id = id;
            binding.targetKey = targetKey;
            binding.sourceKey = sourceKey;
            binding.passByValue = passByValue;
            bindings.push(binding);
            if (addBindingsData == true) {
                // add bindings data to this widget base data
                this.setValue(ComponentSettings_1.BindingsSettingId, bindings);
            }
        }
        getSubComponentSettings() {
            return this.getValue(ComponentSettings_1.SubComponentsSettingId);
        }
        setSubComponentSettings(subComponentSettings) {
            this.setValue(ComponentSettings_1.SubComponentsSettingId, subComponentSettings);
        }
        getBindingSettings() {
            return this.getValue(ComponentSettings_1.BindingsSettingId);
        }
        setBindingSettings(subComponentSettings) {
            this.setValue(ComponentSettings_1.BindingsSettingId, subComponentSettings);
        }
    };
    ComponentSettings.SubComponentsSettingId = "subComponents";
    ComponentSettings.BindingsSettingId = "bindings";
    ComponentSettings = ComponentSettings_1 = __decorate([
        mco.role()
    ], ComponentSettings);
    exports.ComponentSettings = ComponentSettings;
});
