var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./componentDefaultDefinition", "../componentBase/componentBase", "./textResourceHandling/textResource", "./languageCodes", "./settingIds", "./textFormatter/textFormatter", "./textResourceHandling/textResourcesContainer", "./errorHandling/textSystemErrorHandler", "./textProviderHelper", "./arTextSystemConnector", "../../framework/events", "./eventNamespacesLoadedResponse"], function (require, exports, componentDefaultDefinition_1, componentBase_1, textResource_1, languageCodes_1, settingIds_1, textFormatter_1, textResourcesContainer_1, textSystemErrorHandler_1, textProviderHelper_1, arTextSystemConnector_1, events_1, eventNamespacesLoadedResponse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextProvider = exports.EventSingleTextLoaded = exports.EventNamespacesLoaded = void 0;
    let EventNamespacesLoaded = class EventNamespacesLoaded extends events_1.TypedEvent {
    };
    EventNamespacesLoaded = __decorate([
        mco.role()
    ], EventNamespacesLoaded);
    exports.EventNamespacesLoaded = EventNamespacesLoaded;
    ;
    let EventSingleTextLoaded = class EventSingleTextLoaded extends events_1.TypedEvent {
    };
    EventSingleTextLoaded = __decorate([
        mco.role()
    ], EventSingleTextLoaded);
    exports.EventSingleTextLoaded = EventSingleTextLoaded;
    ;
    /**
     * This class handles provides access to all multilanguage texts
     * Texts are packaged in languages and namespaces
     * For searching for textresources the hirarchy is: language -> namepsage -> TextID
     *
     * @export
     * @class TextProvider
     * @extends {ComponentWithoutSettingsBase}
     * @implements {ITextProvider}
     */
    let TextProvider = class TextProvider {
        /**
         * Creates an instance of TextProvider.
         *
         * @memberof TextProvider
         */
        constructor() {
            this.eventNamespacesLoaded = new EventNamespacesLoaded();
            this.eventSingleTextLoaded = new EventSingleTextLoaded();
            /**
             * At first the TextSystem tries to find the namespace with the _selectedLanguage as languagecode
             *
             * @private
             * @type {string}
             * @memberof TextProvider
             */
            this._selectedLanguage = "";
            /**
             * If there is no namespace found with the _selectedLanguage as languagecode, the _fallbackLanguage is used
             *
             * @private
             * @type {string}
             * @memberof TextProvider
             */
            this._fallbackLanguage = "";
            /**
             * If there is also no namespace found with the _fallbackLanguage as languagecode, the _systemLanguage is used
             * The system language of the TextSystem is english
             *
             * @private
             * @memberof TextProvider
             */
            this._systemLanguage = languageCodes_1.LanguageCodes.english;
            /**
             *
             *
             * @private
             * @type {TextResourcesContainer}
             * @memberof TextProvider
             */
            this._resources = new textResourcesContainer_1.TextResourcesContainer();
            /**
             * Is used for persisting the TextSystem
             *
             * @type {ComponentBase}
             * @memberof TextProvider
             */
            this.component = new componentBase_1.ComponentBase(undefined, this);
        }
        /**
         * Initializes the component
         *
         * @memberof TextProvider
         */
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
        }
        /**
         * Loads the peristed data for the TextSystem
         *
         * @memberof TextProvider
         */
        initialize() {
            this.component.loadComponentSettings();
        }
        /**
         * Disposes this component
         *
         * @memberof TextProvider
         */
        dispose() {
            this._resources.clearAllTexts();
        }
        /**
         * Clears all the data of this component
         *
         * @memberof TextProvider
         */
        clear() {
            this._resources.clearAllTexts();
            this.component.saveComponentSettings();
        }
        /**
         * Gets the current ComponentSettings
         *
         * @returns {ComponentSettings}
         * @memberof TextProvider
         */
        getComponentSettings() {
            // Get a valid format for persiting the textresources
            let textResourcesAsSettings = this._resources.getRecoursesSettings();
            // persist the selectedLanguage, fallbackLanguage and recourses
            this.component.setSetting(settingIds_1.SettingIds.TextResources, textResourcesAsSettings);
            this.component.setSetting(settingIds_1.SettingIds.SelectedLanguage, this._selectedLanguage);
            this.component.setSetting(settingIds_1.SettingIds.FallbackLanguage, this._fallbackLanguage);
            return this.component.getComponentSettings();
        }
        /**
         * Sets the given ComponentSettings
         *
         * @param {(ComponentSettings|undefined)} settings
         * @returns
         * @memberof TextProvider
         */
        setComponentSettings(settings) {
            this._resources.clearAllTexts();
            this.component.setComponentSettings(settings);
            if (settings === undefined) {
                return;
            }
            // load the selectedLanguage, fallbackLanguage and recourses from the component
            this._selectedLanguage = this.component.getSetting(settingIds_1.SettingIds.SelectedLanguage);
            this._fallbackLanguage = this.component.getSetting(settingIds_1.SettingIds.FallbackLanguage);
            let textResourcesSettings = this.component.getSetting(settingIds_1.SettingIds.TextResources);
            if (textResourcesSettings === undefined) {
                return;
            }
            // get the correct resource type from settings array
            textResourcesSettings.forEach(textResourcesSetting => {
                let textResource = textResource_1.TextResource.create(textResourcesSetting);
                this._resources.addReplaceTextResource(textResource);
            });
        }
        /**
         * Sets the selected language
         *
         * @param {(ComponentSettings|undefined)} settings
         * @returns
         * @memberof TextProvider
         */
        setSelectedLanguage(selectedLanguage) {
            this._selectedLanguage = selectedLanguage;
            this.component.saveComponentSettings();
        }
        /**
         * Sets the fallback language
         *
         * @param {(ComponentSettings|undefined)} settings
         * @returns
         * @memberof TextProvider
         */
        setFallbackLanguage(fallbackLanguage) {
            this._fallbackLanguage = fallbackLanguage;
            this.component.saveComponentSettings();
        }
        /**
         * Add textRecourse to the allready existing ones.
         * If a resource with same namespace and languagecode exist allready, the existing one is replaced.
         *
         * @memberof TextProvider
         */
        persistTextResource(textResource) {
            this._resources.addReplaceTextResource(textResource);
            this.component.saveComponentSettings();
        }
        /**
         * Add the fully qualified textId to the allready existing ones.
         * If there exist allready one on the same path, the existing one is replaced.
         *
         * @param {string} namespace
         * @param {string} textId
         * @param {string} text
         * @param {string} [languageCode=this._systemLanguage]
         * @memberof TextProvider
         */
        persistFullyQualifiedTextId(namespace, textId, text, languageCode = this._systemLanguage) {
            this._resources.addReplaceFullyQualifiedTextId(namespace, textId, text, languageCode);
            this.component.saveComponentSettings();
        }
        /**
         * The passed namespace gets fully loaded to the target and persisted in the textSystem
         *
         * @param {string} namespace
         * @param {string} [languageCode=this._selectedLanguage]
         * @return {*}
         * @memberof TextProvider
         */
        loadFullNamespacesRequest(namespaces, languageCode = this._selectedLanguage) {
            // Returned argument from the EventNamespacesLoaded
            let eventNamespacesLoadedResponse = new eventNamespacesLoadedResponse_1.EventNamespacesLoadedResponse();
            (() => __awaiter(this, void 0, void 0, function* () {
                for (const namespace of namespaces) {
                    try {
                        // Check if the namespace isn't allready persisted -> only valid when either the full namespace is correct loaded or an exeption is thrown
                        if (!this._resources.isFullyLoadedNamespace(namespace, languageCode)) {
                            // Get all texts from the namespace from the textsystem
                            const textMap = yield arTextSystemConnector_1.ArTextSystemConnector.getFullNamespaceRequest(namespace, languageCode);
                            // Persist receved texts
                            let textResource = new textResource_1.TextResource(namespace, textMap, languageCode, true);
                            this.persistTextResource(textResource);
                        }
                        eventNamespacesLoadedResponse.loadedNamespaces.push(namespace);
                    }
                    catch (exception) {
                        eventNamespacesLoadedResponse.errors.push(namespace);
                    }
                }
                // trigger event when all namespaces are loaded
                this.eventNamespacesLoaded.raise(this, eventNamespacesLoadedResponse);
            }))();
        }
        /**
         * The passed fullyQualifiedTextId gets loaded to the target and persisted in the textSystem
         *
         * @param {string} namespace
         * @param {string} textId
         * @param {string} [languageCode=this._selectedLanguage]
         * @return {*}
         * @memberof TextProvider
         */
        loadFullyQualifiedTextIdRequest(namespace, textId, languageCode = this._selectedLanguage) {
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Get single text from textsystem
                    if (!this._resources.isFullyLoadedNamespace(namespace, languageCode)) {
                        const text = yield arTextSystemConnector_1.ArTextSystemConnector.getSingleEntryRequest(namespace, textId, languageCode);
                        // If a text is found it gets persited    
                        this.persistFullyQualifiedTextId(namespace, textId, text, languageCode);
                    }
                    this.eventSingleTextLoaded.raise(this, true);
                }
                catch (exception) {
                    this.eventSingleTextLoaded.raise(this, false);
                }
            }))();
        }
        /**
         * Searches for an entry in the textsystem with the passed namespace and textId.
         * Returns the requested text, a fallback text or an error text.
         * In case of an error the error is included in the error container of the returned textItem.
         *
         * @param {string} namespace
         * @param {string} textID
         * @param {*} [languageCode=this._selectedLanguage]
         * @returns {string}
         * @memberof TextSystem
         */
        getRawText(namespace, textID, languageCode = this._selectedLanguage) {
            let text = textProviderHelper_1.TextProviderHelper.getTextNoFallback(this._resources, namespace, textID, languageCode);
            // fallback 1: use fallback language
            if (!text.isValid()) {
                text = textProviderHelper_1.TextProviderHelper.getTextNoFallback(this._resources, namespace, textID, this._fallbackLanguage);
            }
            // fallback 2: use system language
            if (!text.isValid()) {
                text = textProviderHelper_1.TextProviderHelper.getTextNoFallback(this._resources, namespace, textID, this._systemLanguage);
            }
            // generate Error message
            if (!text.isValid()) {
                text.value = textSystemErrorHandler_1.TextSystemErrorHandler.getErrorMessageByNamespaceAndID(text.errors[0].statusNumber, namespace, textID);
            }
            return text;
        }
        /**
         * Searches for an entry in the textsystem with the passed fullyQualifiedTextId.
         * Returns the requested text, a fallback text or an error text.
         * In case of an error the error is included in the error container of the returned textItem.
         *
         * @param {string} fullyQualifiedTextId
         * @param {*} [languageCode=this._selectedLanguage]
         * @returns {string}
         * @memberof TextProvider
         */
        getRawTextByFullyQualifiedTextId(fullyQualifiedTextId, languageCode = this._selectedLanguage) {
            // retrieve namespace and textId
            let textQualifier = textProviderHelper_1.TextProviderHelper.decodeFullyQualifiedTextId(fullyQualifiedTextId);
            return this.getRawText(textQualifier.namespace, textQualifier.textId, languageCode);
        }
        /**
         * Searches for an entry in the textsystem with the passed namespace and textId.
         * In case the received text contains format items, they get resolved.
         * Returns the requested text, a fallback text or an error text.
         * In case of an error the error is included in the error container of the returned textItem.     *
         *
         * @param {string} namespace
         * @param {string} textID
         * @param {FormatterInputArgumentList} formatterArgs
         * @param {*} [languageCode=this._selectedLanguage]
         * @returns {string}
         * @memberof TextProvider
         */
        getFormattedText(namespace, textID, formatterArgs, languageCode = this._selectedLanguage) {
            // get the text that the formatter should work with
            let text = this.getRawText(namespace, textID, languageCode);
            if (text.isValid()) {
                // prepare a referece the this text system, so that the formatter can get a text if required (e.g. to resolve a format item such as {$someNamespace/someTextId})
                let textSystemInterface = this;
                // format the raw text
                text = textFormatter_1.TextFormatter.formatText(text.value, textSystemInterface, formatterArgs, languageCode);
            }
            return text;
        }
    };
    TextProvider = __decorate([
        mco.role()
    ], TextProvider);
    exports.TextProvider = TextProvider;
});
