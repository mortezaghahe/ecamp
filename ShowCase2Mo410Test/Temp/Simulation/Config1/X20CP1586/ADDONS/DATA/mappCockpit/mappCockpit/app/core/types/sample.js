var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./valuePair"], function (require, exports, valuePair_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Sample = void 0;
    /**
     * Data class implementing interface ISample
     *
     * @class Sample
     * @extends {ValuePair<number, number>}
     * @implements {ISample}
     */
    let Sample = class Sample extends valuePair_1.ValuePair {
        /**
         * Creates an instance of Sample.
         *
         * @param {number} t
         * @param {number} y
         * @memberof Sample
         */
        constructor(t, y) {
            super(t, y);
        }
        /**
         * Get method for the time.
         *
         * @readonly
         * @type {number}
         * @memberof Sample
         */
        get t() {
            return this._value1;
        }
        /**
         * Get method for the value.
         *
         * @readonly
         * @type {number}
         * @memberof Sample
         */
        get y() {
            return this._value2;
        }
    };
    Sample = __decorate([
        mco.role()
    ], Sample);
    exports.Sample = Sample;
});
