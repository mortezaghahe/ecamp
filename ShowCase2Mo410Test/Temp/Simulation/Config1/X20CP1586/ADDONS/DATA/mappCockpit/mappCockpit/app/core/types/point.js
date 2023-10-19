var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./valuePair"], function (require, exports, valuePair_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Point = void 0;
    /**
     * Represents a value at a certain value.
     *
     * @class Point
     * @extends {ValuePair<number, number>}
     * @implements {IPoint}
     */
    let Point = class Point extends valuePair_1.ValuePair {
        /**
         * Creates an instance of Point.
         *
         * @param {number} x
         * @param {number} y
         * @memberof Point
         */
        constructor(x, y) {
            super(x, y);
        }
        get x() {
            return this._value1;
        }
        get y() {
            return this._value2;
        }
    };
    Point = __decorate([
        mco.role()
    ], Point);
    exports.Point = Point;
});
