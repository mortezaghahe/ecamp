var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TriggerParameter = void 0;
    let TriggerParameter = class TriggerParameter {
        /**
         * Creates an instance of TriggerParameter
         * @param {string} id
         * @param {string} displayName
         * @param {string} displayValue
         * @param {string} description
         * @param {(MappCockpitComponentParameter|undefined)} componentParameter
         * @memberof TriggerParameter
         */
        constructor(id, displayName, displayValue, description, componentParameter) {
            this.id = id;
            this.displayName = displayName;
            this.displayValue = displayValue;
            this.description = description;
            this.componentParameter = componentParameter;
        }
    };
    TriggerParameter = __decorate([
        mco.role()
    ], TriggerParameter);
    exports.TriggerParameter = TriggerParameter;
});
