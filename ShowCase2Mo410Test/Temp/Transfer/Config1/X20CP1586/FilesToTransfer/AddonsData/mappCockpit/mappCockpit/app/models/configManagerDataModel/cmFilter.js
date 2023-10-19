var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CmFilter = void 0;
    let CmFilter = class CmFilter {
        /**
         * Creates an instance of CmFilter
         * @param {string} parameterRef
         * @param {(string|undefined)} parameterValue
         * @param {(Array<string>|undefined)} [parameterValues=undefined]
         * @memberof CmFilter
         */
        constructor(parameterRef, parameterValue, parameterValues = undefined) {
            this.parameterRef = parameterRef;
            this.parameterValue = parameterValue;
            this.parameterValues = parameterValues;
            this.active = true;
        }
    };
    CmFilter = __decorate([
        mco.role()
    ], CmFilter);
    exports.CmFilter = CmFilter;
});
