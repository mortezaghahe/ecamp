var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./textFormatter/editStringHelper", "./textResourceHandling/textQualifier"], function (require, exports, editStringHelper_1, textQualifier_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextItem = void 0;
    /**
     * Used as return value for the usage of the textsystem
     *
     * @export
     * @class TextItem
     */
    let TextItem = class TextItem {
        // set default values
        constructor(value = "", errors = new Array()) {
            this._value = value;
            this._errors = errors;
        }
        set value(value) {
            this._value = value;
        }
        get value() {
            return this._value;
        }
        set errors(errors) {
            this._errors = errors;
        }
        get errors() {
            return this._errors;
        }
        /**
         * Returns true wenn no error occured, false otherwise
         *
         * @return {*}  {boolean}
         * @memberof TextItem
         */
        isValid() {
            if (this.errors.length === 0) {
                return true;
            }
            return false;
        }
        /**
         * In case of errors that occured due to invalid access of the textsystem,
         * all those paths are returned as array of strings.
         *
         * @return {*}  {Array<string>}
         * @memberof TextItem
         */
        getUnresolvedFullyQualifiedTextIds() {
            let paths = new Array();
            this._errors.forEach(errorItem => {
                if (errorItem.fullyQualifiedTextId !== undefined) {
                    paths.push(errorItem.fullyQualifiedTextId);
                }
            });
            return paths;
        }
        /**
         * In case of errors that occured due to invalid access of the textsystem,
         * all those paths are returned as array of TextQualifier (namespace & textId seperated).
         *
         * @return {*}  {Array<TextQualifier>}
         * @memberof TextItem
         */
        getUnresolvedTextQualifiers() {
            let textQualifier = new Array();
            this._errors.forEach(errorItem => {
                if (errorItem.namespace !== undefined && errorItem.textId !== undefined) {
                    textQualifier.push(new textQualifier_1.TextQualifier(errorItem.namespace, errorItem.textId));
                }
            });
            return textQualifier;
        }
        /**
         * Returns an array of TextSystemErrorTypes (= number enum with correct error number)
         * Includes all errors occured during processing a function.
         *
         * @return {*}  {Array<TextSystemErrorTypes>}
         * @memberof TextItem
         */
        getErrorNumbers() {
            let errorNumbers = new Array();
            this._errors.forEach(errorItem => errorNumbers.push(errorItem.statusNumber));
            return errorNumbers;
        }
        /**
         * Returns true when all accesses to the textsystem are valid, false otherwise
         *
         * @return {*}  {boolean}
         * @memberof TextItem
         */
        allTextResourcesFound() {
            let index = this._errors.findIndex(entry => entry.namespace !== undefined);
            return !editStringHelper_1.EditStringHelper.indexIsValid(index);
        }
    };
    TextItem = __decorate([
        mco.role()
    ], TextItem);
    exports.TextItem = TextItem;
});
