var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./calculationData"], function (require, exports, calculationData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CalculationDataNumber = void 0;
    let CalculationDataNumber = class CalculationDataNumber extends calculationData_1.CalculationData {
        /**
         * Creates an instance of CalculationDataNumber
         * @param {string} id
         * @param {string} name
         * @param {number} value
         * @param {string} [description=""]
         * @param {(CalculationDataDisplayInfo|undefined)} [displayInfo=undefined]
         * @memberof CalculationDataNumber
         */
        constructor(id, name, value, description = "", displayInfo = undefined) {
            super(id, name, value.toString(), value, description, displayInfo);
        }
        /**
         * Returns the data as number
         *
         * @returns {number}
         * @memberof CalculationDataNumber
         */
        getData() {
            return super.getData();
        }
        /**
         * Sets the data as number
         *
         * @param {number} data
         * @memberof CalculationDataNumber
         */
        setData(data) {
            super.setData(data);
        }
    };
    CalculationDataNumber = __decorate([
        mco.role()
    ], CalculationDataNumber);
    exports.CalculationDataNumber = CalculationDataNumber;
});
