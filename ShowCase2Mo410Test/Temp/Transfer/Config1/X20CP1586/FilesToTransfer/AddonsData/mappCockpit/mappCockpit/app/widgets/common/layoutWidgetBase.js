var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./widgetBase", "../../framework/events", "./uniqueIdGenerator"], function (require, exports, widgetBase_1, events_1, uniqueIdGenerator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LayoutWidgetBase = void 0;
    let EventWidgetActivated = class EventWidgetActivated extends events_1.TypedEvent {
    };
    EventWidgetActivated = __decorate([
        mco.role()
    ], EventWidgetActivated);
    ;
    let LayoutWidgetBase = class LayoutWidgetBase extends widgetBase_1.WidgetBase {
        constructor() {
            super(...arguments);
            this.eventWidgetActivated = new EventWidgetActivated();
        }
        dispose() {
            super.dispose();
            for (var key in this.layoutPanes) {
                // check if the property/key is defined in the object
                if (this.layoutPanes.hasOwnProperty(key)) {
                    delete this.layoutPanes[key];
                }
            }
        }
        /**
         * Adds a widget to the widgets list of this layout widget
         *
         * @param {IWidget} widget
         * @param {string} name
         * @param {ViewType} viewType
         * @param {{}} [data]
         * @param {PaneProperties} [paneProperties]
         * @memberof LayoutWidgetBase
         */
        addWidget(widget, name, viewType, data, paneProperties) {
            if (viewType == undefined) {
                console.error("viewType for addWidget(...) not defined!");
            }
            let id = name + "_" + viewType.toString();
            id = uniqueIdGenerator_1.UniqueIdGenerator.getInstance().getUniqueIdFromString(id);
            if (this._widgets.get(id) != undefined) {
                console.error("addWidget %s => id (%s) must be unique", name, viewType);
            }
            this._widgets.set(id, widget);
            this.addWidgetToView(widget, this.view);
        }
        /**
         * Removes a widget from the widgets list of this layout widget
         *
         * @param {(IWidget|undefined)} widget
         * @returns
         * @memberof LayoutWidgetBase
         */
        removeWidget(widget) {
            if (widget == undefined) {
                return;
            }
            this._widgets.forEach((widgetTemp, key) => {
                if (widgetTemp === widget) {
                    if (this.view) {
                        this.removeWidgetFromView(widget);
                    }
                    this._widgets.delete(key);
                }
            });
        }
        addWidgetToView(widget, view) {
            if (view) {
                view.addWidget(widget);
            }
        }
        removeWidgetFromView(widget) {
            if (this.view) {
                this.view.removeWidget(widget);
            }
        }
        recalculateLayout() {
        }
    };
    LayoutWidgetBase = __decorate([
        mco.role()
    ], LayoutWidgetBase);
    exports.LayoutWidgetBase = LayoutWidgetBase;
});
