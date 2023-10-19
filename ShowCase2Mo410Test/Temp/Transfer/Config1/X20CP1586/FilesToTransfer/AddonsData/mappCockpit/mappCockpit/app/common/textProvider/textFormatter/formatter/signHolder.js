var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignHolder = void 0;
    /**
     * This class enables simpler formatting by remembering
     * the seperating the sign information from argument.
     *
     * @export
     * @class SignHolder
     */
    let SignHolder = class SignHolder {
        /**
         * Creates an instance of SignHolder.
         * @memberof SignHolder
         */
        constructor() {
            this._sign = "";
        }
        /**
         * Removes the sign from the input argument and remember it in _sign
         *
         * @param {number} argument
         * @return {number}
         * @memberof SignHolder
         */
        getUnsigendArgument(argument) {
            if (argument > 0) {
                this._sign = "+";
            }
            else if (argument == 0) {
                this._sign = " ";
            }
            else if (argument < 0) {
                this._sign = "-";
                // get positive value from negative
                argument = Math.abs(argument);
            }
            else {
                this._sign = "";
            }
            return argument;
        }
        /**
         * Get the sign from the current processed argument
         *
         * @return {*}  {string}
         * @memberof SignHolder
         */
        getSign() {
            return this._sign;
        }
    };
    SignHolder = __decorate([
        mco.role()
    ], SignHolder);
    exports.SignHolder = SignHolder;
});
