var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextQualifier = void 0;
    /**
     * A textqualifier holds the string information of the namespace, that refers to a text recourse
     * In the given namespaces are keys with text Ids, that are maped to the text data
     *
     * @export
     * @class TextQualifier
     */
    let TextQualifier = class TextQualifier {
        /**
         * Creates an instance of TextQualifier.
         *
         * @param {string} namespace
         * @param {string} textId
         * @memberof TextQualifier
         */
        constructor(namespace, textId) {
            this._namespace = "";
            this._textId = "";
            this._namespace = namespace;
            this._textId = textId;
        }
        get namespace() {
            return this._namespace;
        }
        get textId() {
            return this._textId;
        }
    };
    TextQualifier = __decorate([
        mco.role()
    ], TextQualifier);
    exports.TextQualifier = TextQualifier;
});
