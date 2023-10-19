var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDefinition = void 0;
    let ComponentDefinition = class ComponentDefinition {
        /**
         * Creates an instance of ComponentDefinition
         * @param {string} type
         * @param {string} id
         * @param {string} [defaultSettingsDataId=""]
         * @memberof ComponentDefinition
         */
        constructor(type, id, defaultSettingsDataId = "") {
            /**
             * Id where to find the default setting data for this component
             *
             * @type {string}
             * @memberof ComponentDefinition
             */
            this.defaultSettingsDataId = "";
            this.type = type;
            this.id = id;
            this.defaultSettingsDataId = defaultSettingsDataId;
        }
        /**
         * Sets the given componentDefinition to this componentDefinition
         *
         * @param {ComponentDefinition} componentDefinition
         * @memberof ComponentDefinition
         */
        set(componentDefinition) {
            this.type = componentDefinition.type;
            this.id = componentDefinition.id;
            this.defaultSettingsDataId = componentDefinition.defaultSettingsDataId;
        }
    };
    ComponentDefinition = __decorate([
        mco.role()
    ], ComponentDefinition);
    exports.ComponentDefinition = ComponentDefinition;
});
