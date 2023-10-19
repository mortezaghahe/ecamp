var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var AcoposParameterDefinition_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AcoposParameterDefinition = void 0;
    let AcoposParameterDefinition = AcoposParameterDefinition_1 = class AcoposParameterDefinition {
        /**
         * Creates an instance of AcoposParameterDefinition.
         * @param {number} id
         * @param {string} constName
         * @param {string} typ
         * @memberof AcoposParameterDefinition
         */
        constructor(id, constName, typ) {
            this.id = id;
            this.const = constName;
            this.typ = typ;
        }
        /**
         * Creates a new parameter definition
         *
         * @static
         * @param {number} id -1 if not defined
         * @param {string} constName
         * @param {string} typ
         * @returns {IAcoposParameterDefinition}
         * @memberof AcoposParameterDefinition
         */
        static create(id, constName, typ) {
            return new AcoposParameterDefinition_1(id, constName, typ);
        }
    };
    AcoposParameterDefinition = AcoposParameterDefinition_1 = __decorate([
        mco.role()
    ], AcoposParameterDefinition);
    exports.AcoposParameterDefinition = AcoposParameterDefinition;
});
