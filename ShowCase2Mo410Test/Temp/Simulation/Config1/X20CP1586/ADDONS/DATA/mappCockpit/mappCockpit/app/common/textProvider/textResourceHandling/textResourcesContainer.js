var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../textFormatter/editStringHelper", "./textResource"], function (require, exports, editStringHelper_1, textResource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextResourcesContainer = void 0;
    /**
     * Holds all available TextResources
     *
     * @export
     * @class TextResourcesContainer
     */
    let TextResourcesContainer = class TextResourcesContainer {
        constructor() {
            this._textData = new Array();
        }
        /**
         * Finds a TextResource by the passed namespace and language Code
         * If no TextResource is found undefined is returned
         *
         * @param {string} namespace
         * @param {string} languageCode
         * @return {*}  {(TextResource | undefined)}
         * @memberof TextResourceContainer
         */
        getTextResource(namespace, languageCode) {
            return this._textData.find(textResource => textResource.namespace === namespace && textResource.languageCode === languageCode);
        }
        /**
         * This method allows to add a new namespace with texts.
         * If the namespace exists in the given languages, the existing one is completely replaced.
         *
         * @param {TextResource} textResource
         * @memberof TextResourcesContainer
         */
        addReplaceTextResource(textResource) {
            // Search for the position of allready existing textResources with similar namespace and languagecode
            let index = this._textData.findIndex(entry => (entry.namespace === textResource.namespace && entry.languageCode === textResource.languageCode));
            // If the index is valid, the textResource is replaced in the position of the index, otherwise the textResource is added
            if (editStringHelper_1.EditStringHelper.indexIsValid(index)) {
                this._textData.splice(index, 1, textResource);
            }
            else {
                this._textData.push(textResource);
            }
        }
        /**
         * If the textdata has a textresource of the passed namespace, the single text entry is added combined with its textId.
         * In case there is allready an entry to that textId, the old entry is overwridden.
         * IF no namespace is found, a new textresource including the passed single text is created.
         *
         * @param {string} namespace
         * @param {string} textId
         * @param {string} text
         * @param {string} languageCode
         * @memberof TextResourcesContainer
         */
        addReplaceFullyQualifiedTextId(namespace, textId, text, languageCode) {
            let namespaceExist = false;
            // Add or replace an entry to an allready existing Namespace
            this._textData.forEach(entry => {
                if (entry.namespace === namespace && entry.languageCode === languageCode) {
                    // Map.set either sets the text or replace the allready existing one
                    entry.textData.set(textId, text);
                    namespaceExist = true;
                }
            });
            // Create a new textresource in case the namespace is not found
            if (!namespaceExist) {
                let textMap = new Map();
                textMap.set(textId, text);
                this._textData.push(new textResource_1.TextResource(namespace, textMap, languageCode));
            }
        }
        /**
         * Checks if a namespace is allready fully loaded on the textsystem
         *
         * @param {*} namespace
         * @param {*} languageCode
         * @return {*}  {boolean}
         * @memberof TextResourcesContainer
         */
        isFullyLoadedNamespace(namespace, languageCode) {
            let isFullyLoadedNamespace = false;
            let textResource = this.getTextResource(namespace, languageCode);
            if (textResource !== undefined) {
                isFullyLoadedNamespace = textResource.isFullyLoaded();
            }
            return isFullyLoadedNamespace;
        }
        /**
         * Get all textResources in a suitable format for persisting
         *
         * @memberof TextResourcesContainer
         */
        getRecoursesSettings() {
            let textResourcesAsSettings = new Array();
            this._textData.forEach((resource) => {
                textResourcesAsSettings.push(resource.getSettings());
            });
            return textResourcesAsSettings;
        }
        /**
         * All elements are deleted (also if this array is accessed by other references)
         *
         * @memberof TextResourcesContainer
         */
        clearAllTexts() {
            this._textData.splice(0, this._textData.length);
        }
    };
    TextResourcesContainer = __decorate([
        mco.role()
    ], TextResourcesContainer);
    exports.TextResourcesContainer = TextResourcesContainer;
});
