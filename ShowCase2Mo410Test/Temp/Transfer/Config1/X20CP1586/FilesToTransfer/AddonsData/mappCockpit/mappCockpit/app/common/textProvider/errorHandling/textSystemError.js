var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextSystemError = void 0;
    /**
     * Specific error that is used for exeption handling in the textformatter
     *
     * @export
     * @class TextSystemError
     * @extends {Error}
     */
    let TextSystemError = class TextSystemError extends Error {
        constructor(message, item) {
            super(message);
            this._item = item;
        }
        get item() {
            return this._item;
        }
    };
    TextSystemError = __decorate([
        mco.role()
    ], TextSystemError);
    exports.TextSystemError = TextSystemError;
});
