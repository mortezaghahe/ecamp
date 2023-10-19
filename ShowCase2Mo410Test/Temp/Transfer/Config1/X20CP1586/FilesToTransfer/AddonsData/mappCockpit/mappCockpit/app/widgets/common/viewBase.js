var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./widgetBase"], function (require, exports, widgetBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewBase = void 0;
    /**
     * The class is the base for views representing a container for a composition of other wigets
     *
     * @export
     * @abstract
     * @class ViewBase
     * @extends {WidgetBase}
     * @implements {IView}
     */
    let ViewBase = class ViewBase extends widgetBase_1.WidgetBase {
        constructor() {
            super(...arguments);
            this._childWidgets = [];
            // holds an id referencing the connected component.
            this._connectionId = "";
        }
        /**
         * Connects to a component
         *
         * @param {string} connectionId
         * @memberof ViewBase
         */
        connect(connectionId) {
            super.connect(connectionId);
            this._connectionId = connectionId;
        }
        /**
         * Adds respectively connects a widget to its view
         *
         * @param {IWidget} widget
         * @memberof ViewBase
         */
        addWidget(widget) {
            this._childWidgets.push(widget);
            widget.view = this;
        }
        /**
         * Removes respectively disconnects a widget from its view
         *
         * @param {IWidget} widget
         * @memberof ViewBase
         */
        removeWidget(widget) {
            let i = this._childWidgets.indexOf(widget);
            if (i >= 0) {
                this._childWidgets.splice(i, 1);
            }
        }
        /**
         * Returns the widget for the given id if found, else undefined
         *
         * @param {string} id the widget id
         * @returns {*}
         * @memberof ViewBase
         */
        getWidgetById(id) {
            for (let key in this._childWidgets) {
                let widget = this._childWidgets[key];
                if (widget.component.id == id) {
                    return widget;
                }
            }
            return undefined;
        }
    };
    ViewBase = __decorate([
        mco.role()
    ], ViewBase);
    exports.ViewBase = ViewBase;
});
