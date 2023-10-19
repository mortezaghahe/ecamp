var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartRenderOptimizer = void 0;
    let ChartRenderOptimizer = class ChartRenderOptimizer {
        getPointsInCanvasBounds(point1, point2, canvasWidth, canvasHeight) {
            var direction = { X: point2.X - point1.X, Y: point2.Y - point1.Y };
            //if both points are outside the canvasArea and the line does not cross it set them directly next to the canvas
            if (!this.testIfLineIsInCanvas(point1, point2, canvasWidth, canvasHeight)) {
                if (point1.Y < 0) {
                    point1.Y = -1;
                    point2.Y = -1;
                }
                if (point1.Y > canvasHeight) {
                    point1.Y = canvasHeight + 1;
                    point2.Y = canvasHeight + 1;
                }
                if (point1.X < 0) {
                    point1.X = -1;
                    point2.X = -1;
                }
                if (point1.X > canvasWidth) {
                    point1.X = canvasWidth + 1;
                    point2.X = canvasWidth + 1;
                }
            }
            else {
                point1 = this.calculatePointPosition(point1, direction, canvasWidth, canvasHeight);
                point2 = this.calculatePointPosition(point2, direction, canvasWidth, canvasHeight);
            }
            return { point1: point1, point2: point2 };
        }
        testIfLineIsInCanvas(point1, point2, canvasWidth, canvasHeight) {
            if (point1.X < 0 && point2.X < 0) {
                return false;
            }
            if (point1.X > canvasWidth && point2.X > canvasWidth) {
                return false;
            }
            if (point1.Y < 0 && point2.Y < 0) {
                return false;
            }
            if (point1.Y > canvasHeight && point2.Y > canvasHeight) {
                return false;
            }
            return true;
        }
        calculatePointPosition(point, direction, canvasWidth, canvasHeight) {
            var p1 = { X: point.X, Y: point.Y };
            var v = direction;
            if (p1.X < 0) {
                var l = (p1.X / v.X) * -1;
                p1.X = 0;
                p1.Y = p1.Y + l * v.Y;
            }
            if (p1.Y < 0) {
                var l = (p1.Y / v.Y) * -1;
                p1.Y = 0;
                p1.X = p1.X + l * v.X;
            }
            if (p1.X > canvasWidth) {
                var l = (canvasWidth / v.X) - (p1.X / v.X);
                p1.X = canvasWidth;
                p1.Y = p1.Y + l * v.Y;
            }
            if (p1.Y > canvasHeight) {
                var l = (canvasHeight / v.Y) - (p1.Y / v.Y);
                p1.Y = canvasHeight;
                p1.X = p1.X + l * v.X;
            }
            return p1;
        }
    };
    ChartRenderOptimizer = __decorate([
        mco.role()
    ], ChartRenderOptimizer);
    exports.ChartRenderOptimizer = ChartRenderOptimizer;
});
