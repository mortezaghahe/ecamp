var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../calculatorProvider/calculatorProvider", "../calculatorProvider/calculationDataPoints"], function (require, exports, calculatorProvider_1, calculationDataPoints_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Calculation = void 0;
    let Calculation = class Calculation {
        constructor(calculatorId) {
            this.setCalculatorType(calculatorId);
        }
        setCalculatorType(calculatorId) {
            this.calculator = calculatorProvider_1.CalculatorProvider.getInstance().getCalculator(calculatorId);
            if (this.calculator == undefined) {
                this.inputData = new Array();
                this.outputData = new Array();
            }
            else {
                this.inputData = this.calculator.getDefaultInputData();
                this.outputData = this.calculator.getDefaultOutputData();
            }
        }
        calculate() {
            if (this.calculator != undefined) {
                // Start calculation with current input data
                let results = this.calculator.calculate(this.inputData);
                for (let i = 0; i < results.length; i++) {
                    // Set output data
                    if (results[i] instanceof calculationDataPoints_1.CalculationDataPoints && this.outputData[i] instanceof calculationDataPoints_1.CalculationDataPoints) {
                        this.outputData[i].setData(results[i].getData());
                    }
                    else {
                        console.error("New calculation output data available. New implementation needed! Only DataPoints supported currently.");
                    }
                }
            }
        }
    };
    Calculation = __decorate([
        mco.role()
    ], Calculation);
    exports.Calculation = Calculation;
});
