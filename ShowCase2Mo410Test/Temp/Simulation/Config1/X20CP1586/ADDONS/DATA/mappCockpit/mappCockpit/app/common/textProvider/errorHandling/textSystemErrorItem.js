var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../textProviderHelper"], function (require, exports, textProviderHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextSystemErrorItem = void 0;
    /**
     * The Text system error item is used for being able to throw specific error messages.
     *
     * @export
     * @class TextSystemErrorItem
     */
    let TextSystemErrorItem = class TextSystemErrorItem {
        constructor(statusNumber, namespace, textId) {
            this.statusNumber = statusNumber;
            this.namespace = namespace;
            this.textId = textId;
            if (namespace !== undefined && textId !== undefined) {
                this.fullyQualifiedTextId = textProviderHelper_1.TextProviderHelper.createFullyQualifiedTextId(namespace, textId);
            }
        }
    };
    TextSystemErrorItem = __decorate([
        mco.role()
    ], TextSystemErrorItem);
    exports.TextSystemErrorItem = TextSystemErrorItem;
});
