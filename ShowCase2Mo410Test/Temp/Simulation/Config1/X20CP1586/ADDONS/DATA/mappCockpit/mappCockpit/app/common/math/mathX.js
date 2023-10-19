var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MathX = void 0;
    let MathX = class MathX {
        /**
         * Returns the median of an array of numbers
         * Two relevant cases:
         *  - even number of array elements:
         *      the avarave of the two middle elements is returned
         *  - odd number of array elements
         *      the middle element is returned
         *
         * @export
         * @param {*} arr
         * @returns
         */
        static median(arr) {
            arr.sort(function (a, b) { return a - b; }); // sort all elements depending on the value
            let medianNumber = 0.0;
            if (arr.length % 2 == 0) { // even number of elements take the two closest elements and calculate the mean values of both of them
                let lowerIndex = Math.floor((arr.length - 1.0) / 2.0);
                let upperIndex = lowerIndex + 1;
                medianNumber = (arr[lowerIndex] + arr[upperIndex]) / 2.0;
            }
            else { // odd number of elements --> take the element in the middle
                medianNumber = arr[(arr.length - 1) / 2];
            }
            return medianNumber;
        }
        /**
         * Finds the maximum within an array
         *
         * @param {*} values
         * @returns
         * @memberof MAthX
         */
        static max(values) {
            let max = values[0];
            for (let i = 0; i < values.length; i++) {
                const value = values[i];
                max = value > max ? value : max;
            }
            return max;
        }
        /**
         * Finds the minimum within the array
         *
         * @param {*} values
         * @returns
         * @memberof MAthX
         */
        static min(values) {
            let min = values[0];
            for (let i = 0; i < values.length; i++) {
                const value = values[i];
                min = value < min ? value : min;
            }
            return min;
        }
    };
    MathX = __decorate([
        mco.role()
    ], MathX);
    exports.MathX = MathX;
});
