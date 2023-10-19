var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentContext = void 0;
    let ComponentContext = class ComponentContext {
        constructor() {
            /**
             * Holds the context informations
             *
             * @private
             * @type {Map<string, string>}
             * @memberof ComponentContext
             */
            this._data = new Map();
        }
        /**
         * Adds a new context with the given key
         *
         * @param {string} key
         * @param {string} value
         * @memberof ComponentContext
         */
        addContext(key, value) {
            this._data.set(key, value);
        }
        /**
         * Returns the context for the given key or undefined if not found
         *
         * @param {string} key
         * @returns {(string|undefined)}
         * @memberof ComponentContext
         */
        getContext(key) {
            if (this._data.has(key)) {
                return this._data.get(key);
            }
            return undefined;
        }
        /**
         * Removes the context with the given key
         *
         * @param {string} key
         * @memberof ComponentContext
         */
        removeContext(key) {
            if (this._data.has(key)) {
                this._data.delete(key);
            }
        }
    };
    ComponentContext = __decorate([
        mco.role()
    ], ComponentContext);
    exports.ComponentContext = ComponentContext;
});
