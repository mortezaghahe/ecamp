var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RDP = void 0;
    //Algorithm from
    //http://mourner.github.io/simplify-js/
    let RDP = class RDP {
        constructor() {
            this.ratioX = 1;
            this.ratioY = 1;
        }
        // to suit your point format, run search/replace for '.x' and '.y';
        // for 3D version, see 3d branch (configurability would draw significant performance overhead)
        // square distance between 2 points
        getSqDist(p1, p2) {
            var dx = p1.x - p2.x, dy = p1.y - p2.y;
            return (dx / this.ratioX) * (dx / this.ratioX) + (dy / this.ratioY * dy / this.ratioY);
        }
        // square distance from a point to a segment
        getSqSegDist(p, p1, p2) {
            var x = p1.x, y = p1.y, dx = p2.x - x, dy = p2.y - y;
            if (dx !== 0 || dy !== 0) {
                var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
                if (t > 1) {
                    x = p2.x;
                    y = p2.y;
                }
                else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }
            dx = p.x - x;
            dy = p.y - y;
            return (dx / this.ratioX) * (dx / this.ratioX) + (dy / this.ratioY * dy / this.ratioY);
        }
        // rest of the code doesn't care about point format
        // basic distance-based simplification
        simplifyRadialDist(points, sqTolerance) {
            var prevPoint = points[0], newPoints = [prevPoint], point;
            for (var i = 1, len = points.length; i < len; i++) {
                point = points[i];
                if (this.getSqDist(point, prevPoint) > sqTolerance) {
                    newPoints.push(point);
                    prevPoint = point;
                }
            }
            if (prevPoint !== point)
                newPoints.push(point);
            return newPoints;
        }
        simplifyDPStep(points, first, last, sqTolerance, simplified) {
            var maxSqDist = sqTolerance, index;
            for (var i = first + 1; i < last; i++) {
                var sqDist = this.getSqSegDist(points[i], points[first], points[last]);
                if (sqDist > maxSqDist) {
                    index = i;
                    maxSqDist = sqDist;
                }
            }
            if (maxSqDist > sqTolerance) {
                if (index - first > 1)
                    this.simplifyDPStep(points, first, index, sqTolerance, simplified);
                simplified.push(points[index]);
                if (last - index > 1)
                    this.simplifyDPStep(points, index, last, sqTolerance, simplified);
            }
        }
        // simplification using Ramer-Douglas-Peucker algorithm
        simplifyDouglasPeucker(points, sqTolerance) {
            var last = points.length - 1;
            var simplified = [points[0]];
            this.simplifyDPStep(points, 0, last, sqTolerance, simplified);
            simplified.push(points[last]);
            return simplified;
        }
        // both algorithms combined for awesome performance
        // simplify(points: Array<IPoint>, tolerance: number, highestQuality: boolean) : Array<IPoint> {
        /**
         *
         * @param points
         * @param tolerance tolerance of the algorithm
         * @param ratioX ratio in the x-drection of the chart
         * @param ratioY ratio in the y-direction of the chart
         * @param highestQuality
         */
        simplify(points, tolerance, ratioX, ratioY, highestQuality) {
            if (points.length <= 2)
                return points;
            this.ratioX = ratioX;
            this.ratioY = ratioY;
            var sqTolerance = (tolerance !== undefined) ? tolerance * tolerance : 1;
            points = highestQuality ? points : this.simplifyRadialDist(points, sqTolerance);
            points = this.simplifyDouglasPeucker(points, sqTolerance);
            return points;
        }
    };
    RDP = __decorate([
        mco.role()
    ], RDP);
    exports.RDP = RDP;
    ;
});
