var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./calculators/addCalculator", "./calculators/subCalculator", "./calculators/mulCalculator", "./calculators/divCalculator", "./calculators/diffCalculator", "./calculators/lpBesselCalculator", "./calculators/xyCalculator", "./calculators/expCalculator", "./calculators/absCalculator", "./calculators/limitCalculator", "./calculators/sqrtCalculator", "./calculators/vectCalculator", "./calculators/maxCalculator", "./calculators/minCalculator", "./calculators/fftCalculator", "./calculators/sinCalculator", "./calculators/cosCalculator", "./calculators/atan2Calculator", "./calculators/shiftTimeAxisCalculator", "./calculators/timeStampSyncCalculator", "./calculators/andCalculator", "./calculators/orCalculator", "./calculators/notCalculator", "./calculators/stringMathjsCalculator", "./calculators/lessThanCalculator", "./calculators/greaterThanCalculator", "./calculators/equalToCalculator", "./calculators/moduloCalculator"], function (require, exports, addCalculator_1, subCalculator_1, mulCalculator_1, divCalculator_1, diffCalculator_1, lpBesselCalculator_1, xyCalculator_1, expCalculator_1, absCalculator_1, limitCalculator_1, sqrtCalculator_1, vectCalculator_1, maxCalculator_1, minCalculator_1, fftCalculator_1, sinCalculator_1, cosCalculator_1, atan2Calculator_1, shiftTimeAxisCalculator_1, timeStampSyncCalculator_1, andCalculator_1, orCalculator_1, notCalculator_1, stringMathjsCalculator_1, lessThanCalculator_1, greaterThanCalculator_1, equalToCalculator_1, moduloCalculator_1) {
    "use strict";
    var CalculatorProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CalculatorProvider = void 0;
    let CalculatorProvider = CalculatorProvider_1 = class CalculatorProvider {
        constructor() {
            this.calculators = new Array();
            this.calculators.push(new addCalculator_1.AddCalculator());
            this.calculators.push(new subCalculator_1.SubCalculator());
            this.calculators.push(new mulCalculator_1.MulCalculator());
            this.calculators.push(new divCalculator_1.DivCalculator());
            this.calculators.push(new diffCalculator_1.DiffCalculator());
            this.calculators.push(new expCalculator_1.ExpCalculator());
            this.calculators.push(new sqrtCalculator_1.SqrtCalculator());
            this.calculators.push(new vectCalculator_1.VectCalculator());
            this.calculators.push(new absCalculator_1.AbsCalculator());
            this.calculators.push(new maxCalculator_1.MaxCalculator());
            this.calculators.push(new minCalculator_1.MinCalculator());
            this.calculators.push(new limitCalculator_1.LimitCalculator);
            //this.calculators.push(new LpButterworthCalculator());
            this.calculators.push(new lpBesselCalculator_1.LpBesselCalculator());
            this.calculators.push(new sinCalculator_1.SinCalculator());
            this.calculators.push(new cosCalculator_1.CosCalculator());
            this.calculators.push(new atan2Calculator_1.Atan2Calculator());
            this.calculators.push(new shiftTimeAxisCalculator_1.ShiftTimeAxisCalculator());
            this.calculators.push(new timeStampSyncCalculator_1.TimeStampSyncCalculator());
            this.calculators.push(new andCalculator_1.AndCalculator());
            this.calculators.push(new orCalculator_1.OrCalculator());
            this.calculators.push(new notCalculator_1.NotCalculator());
            this.calculators.push(new stringMathjsCalculator_1.StringMathjsCalculator());
            this.calculators.push(new xyCalculator_1.XYCalculator());
            this.calculators.push(new fftCalculator_1.FftCalculator());
            this.calculators.push(new lessThanCalculator_1.LessThanCalculator());
            this.calculators.push(new greaterThanCalculator_1.GreaterThanCalculator());
            this.calculators.push(new equalToCalculator_1.EqualToCalculator());
            this.calculators.push(new moduloCalculator_1.ModuloCalculator());
        }
        /**
         * gets a singleton instance of UiCalculatorProvider
         *
         * @readonly
         * @type {UiCalculatorProvider}
         * @memberof UiCalculatorProvider
         */
        static getInstance() {
            this._instance = this._instance ? this._instance : new CalculatorProvider_1();
            return this._instance;
        }
        /**
         * Returns a calculator instance for the given id
         *
         * @param {string} id
         * @returns {(IUiCalculator|undefined)}
         * @memberof UiCalculatorProvider
         */
        getCalculator(id) {
            let result = this.calculators.filter(function (element) {
                return element.id == id;
            });
            if (result.length > 0) {
                return result[0];
            }
            return undefined; // TODO: Return Dummy
        }
        /**
         * Returns the id for the given displayname
         *
         * @param {string} displayName
         * @returns {string}
         * @memberof CalculatorProvider
         */
        convertDisplayNameToId(displayName) {
            let result = this.calculators.filter(function (element) {
                return element.displayName == displayName;
            });
            if (result.length > 0) {
                return result[0].id;
            }
            return "";
        }
        /**
         * Returns the displayname for the given id
         *
         * @param {string} id
         * @returns {string}
         * @memberof CalculatorProvider
         */
        convertIdToDisplayName(id) {
            let calculator = this.getCalculator(id);
            if (calculator != undefined) {
                return calculator.displayName;
            }
            return "";
        }
    };
    CalculatorProvider = CalculatorProvider_1 = __decorate([
        mco.role()
    ], CalculatorProvider);
    exports.CalculatorProvider = CalculatorProvider;
});
