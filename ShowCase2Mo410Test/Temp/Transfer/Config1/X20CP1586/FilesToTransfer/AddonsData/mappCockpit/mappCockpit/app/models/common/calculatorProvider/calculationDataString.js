var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./calculationData"], function (require, exports, calculationData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CalculationDataString = void 0;
    let CalculationDataString = class CalculationDataString extends calculationData_1.CalculationData {
        /**
         * Creates an instance of CalculationDataString
         * @param {string} id
         * @param {string} name
         * @param {string} value
         * @param {string} [description=""]
         * @param {(CalculationDataDisplayInfo|undefined)} [displayInfo=undefined]
         * @memberof CalculationDataString
         */
        constructor(id, name, value, description = "", displayInfo = undefined) {
            super(id, name, value, value, description, displayInfo);
        }
        /**
         * Retruns the data as string
         *
         * @returns {string}
         * @memberof CalculationDataString
         */
        getData() {
            return super.getData();
        }
        /**
         * Sets the data as string
         *
         * @param {string} data
         * @memberof CalculationDataString
         */
        setData(data) {
            super.setData(data);
        }
    };
    CalculationDataString = __decorate([
        mco.role()
    ], CalculationDataString);
    exports.CalculationDataString = CalculationDataString;
});
