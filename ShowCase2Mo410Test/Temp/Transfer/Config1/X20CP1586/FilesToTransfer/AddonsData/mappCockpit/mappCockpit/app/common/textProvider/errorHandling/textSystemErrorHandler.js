var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./textSystemError"], function (require, exports, textSystemError_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextSystemErrorHandler = void 0;
    /**
     * Static class for creating error messages for the textsystem
     *
     * @export
     * @class TextSystemErrorHandler
     */
    let TextSystemErrorHandler = class TextSystemErrorHandler {
        /**
         * Creates a static instance of TextSystemErrorHandler.
         * @private
         * @memberof TextSystemErrorHandler
         */
        constructor() { }
        /**
         * SHOULD ONLY BE USED FOR DEFINED ERROR TYPES!
         * Put together namespace and textID to get the source and returns a specific error message
         *
         * @static
         * @param {TextSystemErrorTypes} errorType
         * @param {string} namespace
         * @param {string} textID
         * @return {*}  {string}
         * @memberof TextSystemErrorHandler
         */
        static getErrorMessageByNamespaceAndID(errorType, namespace, textID) {
            let source = namespace + "/" + textID;
            return this.getErrorMessageBySource(errorType, source);
        }
        /**
         * SHOULD ONLY BE USED FOR DEFINED ERROR TYPES!
         * Returns a specific error message containing the error and the attampted access
         *
         * @static
         * @param {TextSystemErrorTypes} errorType
         * @param {string} source
         * @return {*}  {string}
         * @memberof TextSystemErrorHandler
         */
        static getErrorMessageBySource(errorType, source) {
            return "{Error " + errorType + ": $" + source + "}";
        }
        /**
         * Is used for the exeption handling in the formatter.
         *
         * @static
         * @param {TextSystemErrorTypes} errorType
         * @param {string} message
         * @return {*}  null
         * @memberof TextSystemErrorHandler
         */
        static throwFormatterErrors(message, item) {
            throw new textSystemError_1.TextSystemError(message, item);
        }
    };
    // In case of no specific Error Message this string should be used
    TextSystemErrorHandler.defaultErrorMessage = "?Nul";
    TextSystemErrorHandler = __decorate([
        mco.role()
    ], TextSystemErrorHandler);
    exports.TextSystemErrorHandler = TextSystemErrorHandler;
});
