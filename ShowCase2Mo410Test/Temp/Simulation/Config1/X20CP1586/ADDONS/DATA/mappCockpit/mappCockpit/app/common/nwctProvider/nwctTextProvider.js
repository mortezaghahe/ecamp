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
define(["require", "exports", "../componentFactory/componentFactory", "../componentFactory/componentDefinition", "../../services/appServices", "../textProvider/textFormatter/formatterInputArguments/formatterInputArgumentList", "../textProvider/textFormatter/formatterInputArguments/formatterInputArgumentString", "../textProvider/textFormatter/formatterInputArguments/formatterInputArgumentFloat", "../../framework/events", "../textProvider/textFormatter/formatterInputArguments/formatterInputArgumentInt"], function (require, exports, componentFactory_1, componentDefinition_1, appServices_1, formatterInputArgumentList_1, formatterInputArgumentString_1, formatterInputArgumentFloat_1, events_1, formatterInputArgumentInt_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctTextProvider = void 0;
    let NamespacesLoaded = class NamespacesLoaded extends events_1.TypedEvent {
    };
    NamespacesLoaded = __decorate([
        mco.role()
    ], NamespacesLoaded);
    ;
    let NwctTextProvider = class NwctTextProvider {
        constructor() {
            /**
             * Handler for uploadedNamespacesFinished event
             *
             * @private
             * @memberof NwctTextProvider
             */
            this._uploadedNamespacesFinishedHandler = (sender, args) => this.onUploadedNamespacesFinished(sender, args);
            /**
             * NamespaceLoaded event will be raise after loading some namespaces
             *
             * @memberof NwctTextProvider
             */
            this.eventNamespacesLoaded = new NamespacesLoaded();
        }
        /**
         * loads the namespaces for the given namespace names
         *
         * @param {Array<string>} namespaceNames
         * @memberof NwctTextProvider
         */
        loadNamespaces(namespaceNames) {
            return __awaiter(this, void 0, void 0, function* () {
                // get the textProvider
                let componentFactory = componentFactory_1.ComponentFactory.getInstance();
                this._textProvider = componentFactory.create(new componentDefinition_1.ComponentDefinition("TextProvider", "TextProvider", "textProviderDefinition"), undefined);
                // Set default language
                const defaultLanguageId = yield appServices_1.Services.textSystem.getDefaultLanguage();
                this._textProvider.setSelectedLanguage(defaultLanguageId);
                // Listen to namespaceLoaded event
                this._textProvider.eventNamespacesLoaded.attach(this._uploadedNamespacesFinishedHandler);
                // Load namespaces
                this._textProvider.loadFullNamespacesRequest(namespaceNames);
            });
        }
        /**
         * Raises the eventNamespaceLoaded when the loading of namespaces is finished
         *
         * @private
         * @param {ITextProvider} sender
         * @param {EventNamespacesLoadedResponse} args
         * @memberof NwctTextProvider
         */
        onUploadedNamespacesFinished(sender, args) {
            sender.eventNamespacesLoaded.detach(this._uploadedNamespacesFinishedHandler);
            if (args.errors.length !== 0) {
                // react to not all namespaces found
                console.error("Some namespaces could not be found/loaded!");
            }
            this.eventNamespacesLoaded.raise(this, undefined);
        }
        /**
         * Returns the text from the textprovider for the given textId
         *
         * @param {string} textId
         * @param {(string|undefined)} value
         * @param {string} valueType
         * @param {string} unit
         * @returns {string}
         * @memberof NwctTextProvider
         */
        getFormattedText(textId, value, valueType, unit) {
            // is text provider available?
            if (this._textProvider == undefined) {
                console.error("TextProvider not available. No namespaces loaded!");
                return "";
            }
            // Use value as input argument -> convert to correct inputArgument type
            let inputArgs = new formatterInputArgumentList_1.FormatterInputArgumentList();
            if (value != undefined) {
                // Value defined => add unit and value to input arguments
                inputArgs.push(new formatterInputArgumentString_1.FormatterInputArgumentString(unit));
                if (valueType == "") { // "" => string type
                    inputArgs.push(new formatterInputArgumentString_1.FormatterInputArgumentString(value));
                }
                else {
                    let number = Number(value);
                    if (Number.isSafeInteger(number)) {
                        inputArgs.push(new formatterInputArgumentInt_1.FormatterInputArgumentInt(number));
                    }
                    else {
                        inputArgs.push(new formatterInputArgumentFloat_1.FormatterInputArgumentFloat(number));
                    }
                }
            }
            // Returns the formated text
            return this._textProvider.getFormattedText("BR/EventLog", textId.toString(), inputArgs).value;
        }
    };
    NwctTextProvider = __decorate([
        mco.role()
    ], NwctTextProvider);
    exports.NwctTextProvider = NwctTextProvider;
});
