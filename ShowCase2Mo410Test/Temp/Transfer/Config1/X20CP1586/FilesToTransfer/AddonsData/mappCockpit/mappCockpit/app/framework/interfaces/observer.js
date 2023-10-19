var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Observable = void 0;
    /**
     * Holds desriptive data for observables
     *
     * @class ObservableInfo
     */
    let Observable = class Observable {
        get object() {
            return this._object;
        }
        get property() {
            return this._property;
        }
        constructor(object, property) {
            this._object = {};
            this._property = "";
            this._object = object;
            this._property = property;
        }
    };
    Observable = __decorate([
        mco.role()
    ], Observable);
    exports.Observable = Observable;
});
