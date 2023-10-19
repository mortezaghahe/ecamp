var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./componentDefaultDefinition", "../common/viewBase"], function (require, exports, componentDefaultDefinition_1, viewBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigurationWidget = void 0;
    /**
     * implements the TraceConfigurationWidget
     *
     * @class TraceConfigurationWidget
     * @extends {WidgetBase}
     */
    let TraceConfigurationWidget = class TraceConfigurationWidget extends viewBase_1.ViewBase {
        constructor() {
            super(...arguments);
            this._layoutWidgetActivatedHandler = (sender, args) => this.onLayoutContentActivated(sender, args);
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        /**
         * Sets the widget content and eventually subwidgets
         *
         * @memberof TraceConfigurationWidget
         */
        initialized() {
            super.initialized();
            this.initLayoutWidget();
        }
        initLayoutWidget() {
            this._layoutWidget = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SplitterWidgetTraceConfigurationId);
            this.attachLayoutToView();
            this._layoutWidget.initialize();
            // add widget to the parent container
            this._layoutWidget.addToParentContainer(this.mainDiv);
            this._layoutWidget.eventWidgetActivated.attach(this._layoutWidgetActivatedHandler);
        }
        dispose() {
            this._layoutWidget.eventWidgetActivated.detach(this._layoutWidgetActivatedHandler);
            this._layoutWidget.dispose();
            super.dispose();
        }
        /**
         * resizes the trace configuration widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof TraceConfigurationWidget
         */
        resize(width, height) {
            this._actualWidth = width;
            this._actualHeight = height;
            if (this._layoutWidget != undefined) {
                this._layoutWidget.resize(width, height);
            }
        }
        /**
         * Raised after a layout content was activated
         *
         * @private
         * @param {*} sender
         * @param {*} args
         * @memberof TraceConfigurationWidget
         */
        onLayoutContentActivated(sender, args) {
            args.widget.activate();
            this.resize(this._actualWidth, this._actualHeight);
        }
    };
    TraceConfigurationWidget = __decorate([
        mco.role()
    ], TraceConfigurationWidget);
    exports.TraceConfigurationWidget = TraceConfigurationWidget;
});
