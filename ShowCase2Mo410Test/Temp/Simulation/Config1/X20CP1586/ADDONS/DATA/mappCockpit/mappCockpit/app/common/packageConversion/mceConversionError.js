var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var MceConversionError_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MceConversionErrorType = exports.MceConversionError = void 0;
    /**
     * Exception class for MceConversions (PackageAdapters)
     *
     * @class MceConversionError
     * @extends {Error}
     */
    let MceConversionError = MceConversionError_1 = class MceConversionError extends Error {
        /**
         * Creates an instance of MceConversionError.
         * Set to private to enforce use of facxtory methods.
         *
         * @param {string} message
         * @memberof MceConversionError
         */
        constructor(message) {
            super(message);
            this.name = MceConversionError_1.errorName;
        }
        /**
         * Typeguard for MceConversionError.
         *
         * @static
         * @param {Error} e
         * @returns {e is MceConversionError}
         * @memberof MceConversionError
         */
        static isMceConversionError(e) {
            return e.name === this.errorName;
        }
        /**
         * Creates an instance of MceConverionError.
         * Erroremessage will be generated from type and errorMessageData attributes.
         *
         * @static
         * @param {MceConversionErrorType} type
         * @param {string} [errorMessageData=""]
         * @returns
         * @memberof MceConversionError
         */
        static createErrorByType(type, errorMessageData = "") {
            let errorMessage = `${type}: ${errorMessageData}`;
            return new MceConversionError_1(errorMessage);
        }
        /**
         * Returns a string representing the error
         *
         * @returns {string}
         * @memberof MceConversionError
         */
        toString() {
            return `${this.name}: ${this.message}`;
        }
    };
    /**
     * Name for instances of the MceConversionError class.
     *
     * @static
     * @memberof MceConversionError
     */
    MceConversionError.errorName = "MCE Conversion Error";
    MceConversionError = MceConversionError_1 = __decorate([
        mco.role()
    ], MceConversionError);
    exports.MceConversionError = MceConversionError;
    /**
     * Contains the Error type supported by the MceConversionError
     *
     * @enum {number}
     */
    var MceConversionErrorType;
    (function (MceConversionErrorType) {
        MceConversionErrorType["MISSING_DATA"] = "Data is missing";
        MceConversionErrorType["UNSUPPORTED_VERSION"] = "Unsupported version";
        MceConversionErrorType["UNSUPPORTED_TYPE"] = "Unsupported type";
    })(MceConversionErrorType || (MceConversionErrorType = {}));
    exports.MceConversionErrorType = MceConversionErrorType;
});
