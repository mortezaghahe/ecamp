var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../libs/math/mathjs", "./calculators/filters/bessel", "./calculators/differential/diffVector"], function (require, exports, math, bessel_1, diffVector_1) {
    "use strict";
    var MathjsWrapper_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MathjsWrapper = void 0;
    /**
     * Wrapper singleton class for calculator to provide common functionalities only used in some cases with mathjs.
     *
     * @class MathjsRapper
     */
    let MathjsWrapper = MathjsWrapper_1 = class MathjsWrapper {
        /**
         * Constructor set by getInstance should create a singleton class.
         * Creates an instance of MathjsWrapper.
         * @memberof MathjsWrapper
         */
        constructor() {
            /**
             * Use the Bessel Calculator as typed mathjs function and returns filtered signal
             * @private
             * @param {Array<number>} inputSignalY
             * @param {number} sampleTime
             * @param {number} cutOffFrequency
             * @param {number} filterOrder
             * @returns {Array<number>}
             * @memberof MathjsWrapper
             */
            this.lpBessel = math.typed("BR_LP_Bessel", {
                'Array, number, number, number': function (inputSignalY, sampleTime, cutOffFrequency, filterOrder) {
                    if (isNaN(filterOrder) || filterOrder < bessel_1.Bessel.filterOrderMin || filterOrder > bessel_1.Bessel.filterOrderMax) {
                        //this.addError("Calculation Error: '" + filterOrder + "' is not defined or out of range (valid range 1-5)!");
                        return new Array();
                    }
                    let filter = new bessel_1.Bessel(filterOrder, cutOffFrequency, sampleTime);
                    return filter.filter(inputSignalY);
                }
            });
            /**
             * Use the diff Calculator as typed mathjs function
             * @private
             * @param {Array<number>} inputSignalX
             * @param {Array<number>} inputSignalY
             * @returns {Array<number>}
             * @memberof MathjsWrapper
            */
            this.diffSignal = math.typed("BR_Diff", {
                'Array, Array': function (inputSignalX, inputSignalY) {
                    return diffVector_1.DiffVector.diffCalculate(inputSignalX, inputSignalY);
                }
            });
            this._mathLibFn = math.create(math.all);
            this.setAdditionalCalculators();
        }
        ;
        /**
         *Runs the mathjs parse function with limited function pool
         *
         * @param {string} inputString
         * @returns {any} Returns a parse tree
         * @memberof MathjsWrapper
         */
        limitedParse(inputString) {
            return this._limitedParse(inputString);
        }
        /**
         * gets a singleton instance of MathjsWrapper
         *
         * @public
         * @static
         * @type {MathjsWrapper}
         * @memberof MathjsWrapper
         */
        static getInstance() {
            if (MathjsWrapper_1._instance == undefined) {
                MathjsWrapper_1._instance = new MathjsWrapper_1();
            }
            return MathjsWrapper_1._instance;
        }
        /**
         * This function sets the self-generated functions
         * and excludes existing functions of the math.js library that can lead to an security risk.
         * According to that this function handles the parsing limitations for the receivable math instance.
         *
         * @private
         * @memberof MathjsWrapper
         */
        setAdditionalCalculators() {
            //Receive additional calculators
            this._mathLibFn.import({
                BR_LP_Bessel: this.lpBessel,
                BR_Diff: this.diffSignal,
            }, { override: true });
            //Evaluate and parse function for internal usage
            this._limitedParse = this._mathLibFn.parse;
            //Exclude functions with security risks for the user     
            this._mathLibFn.import({
                'import': function () { throw new Error('Function import is disabled'); },
                'createUnit': function () { throw new Error('Function createUnit is disabled'); },
                'evaluate': function () { throw new Error('Function evaluate is disabled'); },
                'parse': function () { throw new Error('Function parse is disabled'); },
                'simplify': function () { throw new Error('Function simplify is disabled'); },
                'derivative': function () { throw new Error('Function derivative is disabled'); }
            }, { override: true });
        }
    };
    MathjsWrapper = MathjsWrapper_1 = __decorate([
        mco.role()
    ], MathjsWrapper);
    exports.MathjsWrapper = MathjsWrapper;
});
