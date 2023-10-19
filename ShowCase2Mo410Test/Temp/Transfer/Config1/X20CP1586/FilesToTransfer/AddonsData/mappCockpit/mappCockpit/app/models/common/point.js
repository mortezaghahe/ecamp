var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Point_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Point = void 0;
    let Point = Point_1 = class Point {
        static Empty() {
            let val;
            return new Point_1(val, val);
        }
        static distanceToPoint(firstPoint, secondPoint) {
            return Math.sqrt(Math.pow(secondPoint.x - firstPoint.x, 2) + Math.pow(secondPoint.y - firstPoint.y, 2));
        }
        /**
         * Creates an instance of Point.
         * @param {number} x
         * @param {number} y
         * @memberof Point
         */
        constructor(x, y) {
            this._x = x;
            this._y = y;
        }
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }
    };
    Point = Point_1 = __decorate([
        mco.role()
    ], Point);
    exports.Point = Point;
});
