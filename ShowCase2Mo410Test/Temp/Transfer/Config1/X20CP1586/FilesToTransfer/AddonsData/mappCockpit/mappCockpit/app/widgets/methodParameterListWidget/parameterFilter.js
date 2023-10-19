var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParameterFilter = void 0;
    let ParameterFilter = class ParameterFilter {
        constructor(parameterRef = '', parameterValues = []) {
            this._parameterRef = parameterRef;
            this._parameterValues = parameterValues;
        }
        set parameterRef(parameterRef) {
            this._parameterRef = parameterRef;
        }
        get parameterRef() {
            return this._parameterRef;
        }
        set parameterValues(parameterValues) {
            this._parameterValues = parameterValues;
        }
        get parameterValues() {
            return this._parameterValues;
        }
    };
    ParameterFilter = __decorate([
        mco.role()
    ], ParameterFilter);
    exports.ParameterFilter = ParameterFilter;
});
