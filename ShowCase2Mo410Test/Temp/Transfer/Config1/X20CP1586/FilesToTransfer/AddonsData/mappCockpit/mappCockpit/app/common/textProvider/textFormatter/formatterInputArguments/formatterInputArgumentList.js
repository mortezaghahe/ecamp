var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatterInputArgumentList = void 0;
    /**
     * A 1-based list for storing all formatter input arguments,
     * which needs to be passed for using the argument data source
     *
     * @export
     * @class FormatterInputArgumentList
     */
    let FormatterInputArgumentList = class FormatterInputArgumentList {
        constructor() {
            this._argumentList = new Array();
        }
        /**
         * Get the IFormatterInputArgument from the FormatterInputArgumentList with the one based index passed
         * If the index is invalid undefined gets returned
         *
         * @param {number} index
         * @return {*}  {(IFormatterInputArgument | undefined)}
         * @memberof FormatterInputArgumentList
         */
        get(index) {
            if (index > 0 || index <= this._argumentList.length) {
                return this._argumentList[index - 1];
            }
        }
        /**
         * Pushes an IFormatterInputArgument to the 1-based argument list
         *
         * @param {IFormatterInputArgument} item
         * @return {*}  {number}
         * @memberof FormatterInputArgumentList
         */
        push(item) {
            return this._argumentList.push(item);
        }
    };
    FormatterInputArgumentList = __decorate([
        mco.role()
    ], FormatterInputArgumentList);
    exports.FormatterInputArgumentList = FormatterInputArgumentList;
});
