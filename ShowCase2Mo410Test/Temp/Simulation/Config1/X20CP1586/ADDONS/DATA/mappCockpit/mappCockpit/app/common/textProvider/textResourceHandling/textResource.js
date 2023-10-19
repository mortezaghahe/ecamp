var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../persistence/settings", "../textItem", "../settingIds", "../errorHandling/textSystemErrorTypes", "../errorHandling/textSystemErrorItem"], function (require, exports, settings_1, textItem_1, settingIds_1, textSystemErrorTypes_1, textSystemErrorItem_1) {
    "use strict";
    var TextResource_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextResource = void 0;
    /**
     * A text resource includes all textData in a unique namespace + languageCode
     * Each text resource can have its own language cude
     *
     * @export
     * @class TextResource
     */
    let TextResource = TextResource_1 = class TextResource {
        /**
         * Creates an instance of TextResource.
         * @param {string} namespace
         * @param {Map<string,string>} texts
         * @param {string} languageCode
         * @param {boolean} [fullyLoaded=false]
         * @memberof TextResource
         */
        constructor(namespace, texts, languageCode, fullyLoaded = false) {
            /**
             * The keyvalue is the textID that is mapped to the string data
             *
             * @private
             * @memberof TextResource
             */
            this._textData = new Map();
            this._namespace = namespace;
            this._languageCode = languageCode;
            this._textData = texts;
            this._fullyLoaded = fullyLoaded;
        }
        get languageCode() {
            return this._languageCode;
        }
        get namespace() {
            return this._namespace;
        }
        get textData() {
            return this._textData;
        }
        /**
         * Get the information if the textResource is allready fully loaded from the ArTextSystem
         *
         * @return {*}  {boolean}
         * @memberof TextResource
         */
        isFullyLoaded() {
            return this._fullyLoaded;
        }
        /**
         * Get the data from the passed textID
         * If there is no entry found an error gets pushed in the TextItem
         *
         * @param {string} textId
         * @return {*}  {TextItem}
         * @memberof TextResource
         */
        getText(textId) {
            let text = this._textData.get(textId);
            let foundText = new textItem_1.TextItem();
            if (text !== undefined) {
                foundText.value = text;
            }
            else {
                foundText.errors.push(new textSystemErrorItem_1.TextSystemErrorItem(textSystemErrorTypes_1.TextSystemErrorTypes.RequestedTextNotFound, this._namespace, textId));
            }
            return foundText;
        }
        /**
         * Prepare the TextResource to a suitable format for persiting
         *
         * @return {*}  {ISettings}
         * @memberof TextResource
         */
        getSettings() {
            let settings = new settings_1.Settings(settingIds_1.SettingIds.TextResource);
            settings.setValue(settingIds_1.SettingIds.Namespace, this._namespace);
            settings.setValue(settingIds_1.SettingIds.LanguageCode, this._languageCode);
            settings.setValue(settingIds_1.SettingIds.TextData, this._textData);
            settings.setValue(settingIds_1.SettingIds.FullyLoaded, this._fullyLoaded);
            return settings;
        }
        /**
         * creates a textResource from persisting data
         *
         * @static
         * @param {ISettings} settings
         * @return {*}  {TextResource}
         * @memberof TextResource
         */
        static create(settings) {
            let settingsObj = settings_1.Settings.create(settings);
            let namespace = settingsObj.getValue(settingIds_1.SettingIds.Namespace);
            let languageCode = settingsObj.getValue(settingIds_1.SettingIds.LanguageCode);
            let textData = settingsObj.getValue(settingIds_1.SettingIds.TextData);
            let fullyLoaded = settingsObj.getValue(settingIds_1.SettingIds.FullyLoaded);
            return new TextResource_1(namespace, textData, languageCode, fullyLoaded);
        }
    };
    TextResource = TextResource_1 = __decorate([
        mco.role()
    ], TextResource);
    exports.TextResource = TextResource;
});
