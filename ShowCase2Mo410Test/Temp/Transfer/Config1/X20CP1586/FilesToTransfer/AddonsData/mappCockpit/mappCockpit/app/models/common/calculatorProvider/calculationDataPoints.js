var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./calculationData"], function (require, exports, calculationData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CalculationDataPoints = void 0;
    let CalculationDataPoints = class CalculationDataPoints extends calculationData_1.CalculationData {
        /**
         * Creates an instance of CalculationDataPoints
         * @param {string} id
         * @param {string} name
         * @param {string} value
         * @param {Array<IPoint>} data
         * @param {string} [description=""]
         * @param {(CalculationDataDisplayInfo|undefined)} [displayInfo=undefined]
         * @memberof CalculationDataPoints
         */
        constructor(id, name, value, data, description = "", displayInfo = undefined) {
            super(id, name, value, data, description, displayInfo);
        }
        /**
         * Returns the data as IPoint array
         *
         * @returns {Array<IPoint>}
         * @memberof CalculationDataPoints
         */
        getData() {
            return super.getData();
        }
        /**
         * Sets the data as IPoint array
         *
         * @param {Array<IPoint>} data
         * @memberof CalculationDataPoints
         */
        setData(data) {
            super.setData(data);
        }
    };
    CalculationDataPoints = __decorate([
        mco.role()
    ], CalculationDataPoints);
    exports.CalculationDataPoints = CalculationDataPoints;
});
