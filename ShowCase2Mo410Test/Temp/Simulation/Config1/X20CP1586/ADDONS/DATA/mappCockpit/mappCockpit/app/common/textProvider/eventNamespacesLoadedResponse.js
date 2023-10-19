var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventNamespacesLoadedResponse = void 0;
    let EventNamespacesLoadedResponse = class EventNamespacesLoadedResponse {
        constructor() {
            /**
             * List of all found namespaces
             *
             * @private
             * @type {Array<string>}
             * @memberof EventNamespacesLoadedResponse
             */
            this._loadedNamespaces = new Array();
            /**
             * key: not found namepsace
             * value: error message
             * @private
             * @type {Map<string, string>}
             * @memberof EventNamespacesLoadedResponse
             */
            this._errors = new Array();
        }
        get loadedNamespaces() {
            return this._loadedNamespaces;
        }
        set loadedNamespaces(value) {
            this._loadedNamespaces = value;
        }
        get errors() {
            return this._errors;
        }
        set errors(value) {
            this._errors = value;
        }
    };
    EventNamespacesLoadedResponse = __decorate([
        mco.role()
    ], EventNamespacesLoadedResponse);
    exports.EventNamespacesLoadedResponse = EventNamespacesLoadedResponse;
});
