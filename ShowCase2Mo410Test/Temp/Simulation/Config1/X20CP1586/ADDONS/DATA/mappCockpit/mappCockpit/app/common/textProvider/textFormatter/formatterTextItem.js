var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../textItem"], function (require, exports, textItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatterTextItem = void 0;
    /**
     * TextItem needed for the processing of the TextFormatter that includes the information of the recursion cnt
     *
     * @export
     * @class FormatterTextItem
     * @extends {TextItem}
     */
    let FormatterTextItem = class FormatterTextItem extends textItem_1.TextItem {
        constructor(value = "", errors = new Array(), recursionCnt = 0) {
            super(value, errors);
            this._recursionCnt = recursionCnt;
            this._recursionLimitExeeded = this.getRecursionStatus();
        }
        get recurisionCnt() {
            return this._recursionCnt;
        }
        set recurisionCnt(value) {
            this._recursionCnt = value;
            this._recursionLimitExeeded = this.getRecursionStatus();
        }
        /**
         * recieve the information if the recurision cnt is out of valid range (>10)
         *
         * @readonly
         * @type {boolean}
         * @memberof FormatterTextItem
         */
        get recursionLimitExeeded() {
            return this._recursionLimitExeeded;
        }
        /**
         * increment the recursion cnt of the textformatter by 1
         *
         * @memberof FormatterTextItem
         */
        incrementRecurisionCnt() {
            this._recursionCnt++;
            this._recursionLimitExeeded = this.getRecursionStatus();
        }
        /**
         * resetset recursion cnt of the textformatter
         *
         * @memberof FormatterTextItem
         */
        resetRecurisionCnt() {
            this._recursionCnt = 0;
            this._recursionLimitExeeded = this.getRecursionStatus();
        }
        /**
         * When the recursionCnt is over 10 then it returns true, false otherwise
         *
         * @private
         * @return {*}  {boolean}
         * @memberof FormatterTextItem
         */
        getRecursionStatus() {
            if (this._recursionCnt < 10) {
                return false;
            }
            return true;
        }
    };
    FormatterTextItem = __decorate([
        mco.role()
    ], FormatterTextItem);
    exports.FormatterTextItem = FormatterTextItem;
});
