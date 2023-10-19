var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var DataBox_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataBox = void 0;
    /**
     * Implements a container for data to be passed by refernce
     *
     * @export
     * @class DataBox
     */
    let DataBox = DataBox_1 = class DataBox {
        /**
         * Creates an instance of RefBox.
         * @param {*} value
         * @memberof DataBox
         */
        constructor(value) {
            this._value = value;
        }
        /**
         * Creates a RefBox instance and encapsulates the specified value;
         *
         * @static
         * @param {*} value
         * @memberof RefBox
         */
        static create(value) {
            return new DataBox_1(value);
        }
        /**
         * Boxes a value within a DataBox instance
         *
         * @static
         * @param {*} value
         * @returns {DataBox}
         * @memberof DataBox
         */
        static Box(value) {
            return DataBox_1.create(value);
        }
        /**
         * Unboxes the value from the DataBox
         *
         * @static
         * @param {DataBox} boxedValue
         * @returns {*}
         * @memberof DataBox
         */
        static Unbox(boxedValue) {
            return boxedValue._value;
        }
        /**
         * Boxes a value within a DataBox instance
         *
         * @static
         * @param {*} value
         * @returns {DataBox}
         * @memberof DataBox
         */
        Box(value) {
            return DataBox_1.Box(value);
        }
        /**
         * Unboxes the value from the DataBox
         *
         * @static
         * @param {DataBox} boxedValue
         * @returns {*}
         * @memberof DataBox
         */
        Unbox() {
            return DataBox_1.Unbox(this);
        }
    };
    DataBox = DataBox_1 = __decorate([
        mco.role()
    ], DataBox);
    exports.DataBox = DataBox;
});
