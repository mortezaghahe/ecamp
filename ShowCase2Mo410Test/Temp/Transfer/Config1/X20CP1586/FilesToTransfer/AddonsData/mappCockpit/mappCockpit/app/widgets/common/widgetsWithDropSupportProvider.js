var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var WidgetsWithDropSupportProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WidgetsWithDropSupportProvider = void 0;
    /**
     * This class handles the widgets which support dropping of data into them
     *
     * @export
     * @class WidgetsWithDropSupportProvider
     */
    let WidgetsWithDropSupportProvider = WidgetsWithDropSupportProvider_1 = class WidgetsWithDropSupportProvider {
        constructor() {
            this._widgets = new Array();
        }
        /**
         * Returns all available widgets with drop support
         *
         * @readonly
         * @type {Array<IDroppable>}
         * @memberof WidgetsWithDropSupportProvider
         */
        get availableWidgets() {
            return this._widgets;
        }
        /**
         * Returns available widgets with drop support for the given dragDropDataId
         *
         * @param {string} dragDropDataId
         * @returns {Array<IDroppable>}
         * @memberof DroppableWidgetsProvider
         */
        getWidgetsWithDragDropDataId(dragDropDataId) {
            let filteredWidget = this._widgets.filter(droppableWidget => {
                let index = droppableWidget.supportedDragDropDataIds.indexOf(dragDropDataId);
                if (index != -1) {
                    return true;
                }
                return false;
            });
            return filteredWidget;
        }
        /**
         * Returns the one and only singleton instance of the WidgetsWithDropSupportProvider
         *
         * @static
         * @returns
         * @memberof WidgetsWithDropSupportProvider
         */
        static getInstance() {
            if (!WidgetsWithDropSupportProvider_1.instance) {
                WidgetsWithDropSupportProvider_1.instance = new WidgetsWithDropSupportProvider_1();
            }
            return WidgetsWithDropSupportProvider_1.instance;
        }
        /**
         * Adds a widget with drop support to the provider
         *
         * @param {IDroppable} widget
         * @memberof WidgetsWithDropSupportProvider
         */
        addWidget(widget) {
            let index = this._widgets.indexOf(widget);
            if (index == -1) {
                this._widgets.push(widget);
            }
        }
        /**
         * Removes a widget with drop support from the provider
         *
         * @param {IDroppable} widget
         * @memberof WidgetsWithDropSupportProvider
         */
        removeWidget(widget) {
            let index = this._widgets.indexOf(widget);
            if (index != -1) {
                this._widgets.splice(index, 1);
            }
        }
    };
    WidgetsWithDropSupportProvider = WidgetsWithDropSupportProvider_1 = __decorate([
        mco.role()
    ], WidgetsWithDropSupportProvider);
    exports.WidgetsWithDropSupportProvider = WidgetsWithDropSupportProvider;
});
