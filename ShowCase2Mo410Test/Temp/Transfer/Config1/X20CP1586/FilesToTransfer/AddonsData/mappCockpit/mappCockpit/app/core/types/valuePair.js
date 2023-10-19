var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValuePair = void 0;
    /**
     * Represents a pair of values.
     *
     * @class ValuePair
     * @implements {IValuePair<T1, T2>}
     * @template T1 Type of value1
     * @template T2 Type of value2
     */
    let ValuePair = class ValuePair {
        /**
         * Creates an instance of ValuePair.
         *
         * @param {T1} value1
         * @param {T2} value2
         * @memberof ValuePair
         */
        constructor(value1, value2) {
            this._value1 = value1;
            this._value2 = value2;
        }
        get value1() {
            return this._value1;
        }
        get value2() {
            return this._value2;
        }
    };
    ValuePair = __decorate([
        mco.role()
    ], ValuePair);
    exports.ValuePair = ValuePair;
});
