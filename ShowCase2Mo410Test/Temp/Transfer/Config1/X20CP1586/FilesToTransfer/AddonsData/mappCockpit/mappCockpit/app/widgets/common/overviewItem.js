var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OverviewItem = void 0;
    /**
     * Defines one item for the over view widgets
     *
     * @export
     * @class OverviewItem
     */
    let OverviewItem = class OverviewItem {
        /**
         * Creates an instance of OverviewItem
         * @param {string} id
         * @param {string} displayName
         * @memberof OverviewItem
         */
        constructor(id, displayName) {
            this.id = id;
            this.displayName = displayName;
        }
    };
    OverviewItem = __decorate([
        mco.role()
    ], OverviewItem);
    exports.OverviewItem = OverviewItem;
});
