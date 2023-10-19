var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CoTraceSignal = void 0;
    /**
     * Represents a signal recorded by the CoTrace library.
     *
     * @class CoTraceSignal
     * @implements {ICoTraceSignal}
     */
    let CoTraceSignal = class CoTraceSignal {
        /**
         * Creates an instance of CoTraceSignal.
         *
         * @param {string} name
         * @memberof CoTraceSignal
         */
        constructor(name) {
            this.name = name;
            this.samples = new Array();
        }
    };
    CoTraceSignal = __decorate([
        mco.role()
    ], CoTraceSignal);
    exports.CoTraceSignal = CoTraceSignal;
});
