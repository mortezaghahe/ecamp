var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./textItem", "./textResourceHandling/textQualifier", "./errorHandling/textSystemErrorTypes", "./errorHandling/textSystemErrorItem"], function (require, exports, textItem_1, textQualifier_1, textSystemErrorTypes_1, textSystemErrorItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextProviderHelper = void 0;
    /**
     * Static class that provides helper functions for the textProvider
     *
     * @export
     * @class TextFormatterHelper
     */
    let TextProviderHelper = class TextProviderHelper {
        constructor() { }
        /**
         * Searches for text data in the text recourses.
         * If nothing is found than a specific error is pushed to the output item.
         *
         * @public
         * @static
         * @param {TextResourcesContainer} recourses
         * @param {string} namespace
         * @param {string} textId
         * @param {string} languageCode
         * @return {*}  {TextItem}
         * @memberof TextProvider
         */
        static getTextNoFallback(recourses, namespace, textId, languageCode) {
            let text = new textItem_1.TextItem();
            let textResource = recourses.getTextResource(namespace, languageCode);
            if (textResource !== undefined) {
                text = textResource.getText(textId);
            }
            else {
                text.errors.push(new textSystemErrorItem_1.TextSystemErrorItem(textSystemErrorTypes_1.TextSystemErrorTypes.ReadAccessToTextDatabaseFailed, namespace, textId));
            }
            return text;
        }
        /**
         * Seperate a string "namespacePart1/.../namepacePartn/TextId1" into:
         * namespace = "namespacePart1/.../namepacePartn" and
         * textId = "TextId1"
         *
         * @public
         * @static
         * @param {string} fullyQualifiedTextId
         * @return {*}  {TextQualifier}
         * @memberof TextProvider
         */
        static decodeFullyQualifiedTextId(fullyQualifiedTextId) {
            // seperate elements by "/"
            let elements = fullyQualifiedTextId.split(this.namespaceSeperator);
            // the last element is the textId
            let textId = elements[elements.length - 1];
            // remove the last element
            elements.pop();
            // concatenate all elmenets insrting the "/" again
            let namespace = elements.join(this.namespaceSeperator);
            return new textQualifier_1.TextQualifier(namespace, textId);
        }
        /**
         * Combines namespace and TextId to a fully qualified textId
         *
         * @static
         * @param {string} namespace
         * @param {string} textId
         * @return {*}  {string}
         * @memberof TextProviderHelper
         */
        static createFullyQualifiedTextId(namespace, textId) {
            return namespace + this.namespaceSeperator + textId;
        }
    };
    TextProviderHelper.namespaceSeperator = "/";
    TextProviderHelper = __decorate([
        mco.role()
    ], TextProviderHelper);
    exports.TextProviderHelper = TextProviderHelper;
});
