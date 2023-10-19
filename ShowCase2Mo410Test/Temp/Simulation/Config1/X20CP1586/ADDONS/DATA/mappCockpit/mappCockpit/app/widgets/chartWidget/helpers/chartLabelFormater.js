var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartLabelFormater = void 0;
    let ChartLabelFormater = class ChartLabelFormater {
        static getXAxisLabelText(number, context, interval) {
            let numberWithoutExp = this.getTimeWithDecimalDigitsByInterval(number, interval);
            let width = context.measureText(numberWithoutExp).width;
            if (width >= 55) {
                return number.toExponential(3);
            }
            else {
                return numberWithoutExp;
            }
        }
        static getYAxisLabelText(number, context, interval) {
            let formatedNumber = number.toFixed(3);
            let width = context.measureText(formatedNumber).width;
            if (width >= 55) {
                //let factor = Math.abs(number)/Math.abs(interval);
                let expText = number.toExponential(3);
                //console.log(factor);
                /*if(factor < 0.9){ // TODO: Also for intervals greater 0.001
                    expText = "0.000";
                }*/
                return expText;
            }
            else {
                if (interval < 0.001) {
                    let factor = Math.abs(number) / Math.abs(interval);
                    let expText = number.toExponential(3);
                    if (factor < 0.9) {
                        expText = "0.000";
                    }
                    return expText;
                }
                else {
                    return formatedNumber;
                }
            }
        }
        static getTimeWithDecimalDigitsByInterval(number, interval) {
            let numberWithoutExp = number.toFixed(3);
            if (interval >= 0.010000) {
                if (interval >= 0.100000) {
                    if (interval >= 1.000000) {
                        numberWithoutExp = number.toFixed(0);
                    }
                    else {
                        numberWithoutExp = number.toFixed(1);
                    }
                }
                else {
                    numberWithoutExp = number.toFixed(2);
                }
            }
            return numberWithoutExp;
        }
    };
    ChartLabelFormater = __decorate([
        mco.role()
    ], ChartLabelFormater);
    exports.ChartLabelFormater = ChartLabelFormater;
});
