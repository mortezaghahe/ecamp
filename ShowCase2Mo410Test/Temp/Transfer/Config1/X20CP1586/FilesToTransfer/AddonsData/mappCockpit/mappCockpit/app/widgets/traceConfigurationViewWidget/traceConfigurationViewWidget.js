var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/viewBase", "./componentDefaultDefinition"], function (require, exports, viewBase_1, componentDefaultDefinition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigurationViewWidget = void 0;
    /**
     * implements the trace configuration view widget
     *
     * @class TraceConfigurationViewWidget
     * @extends {WidgetBase}
     */
    let TraceConfigurationViewWidget = class TraceConfigurationViewWidget extends viewBase_1.ViewBase {
        constructor() {
            super(...arguments);
            this._layoutWidgetActivatedHandler = (sender, args) => this.onContentActivated(sender, args);
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        /**
         * Sets the widget content and eventually subwidgets
         *
         * @memberof TraceConfigurationViewWidget
         */
        initialized() {
            super.initialized();
            this.initLayoutWidget();
            // attach layout of traceConfigurationWidget to view
            this.attachLayoutToView(this);
        }
        initLayoutWidget() {
            this._layoutWidget = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SplitterWidgetTraceConfigurationViewId);
            this.attachLayoutToView(this);
            this._layoutWidget.initialize();
            // add widget to the parent container
            this._layoutWidget.addToParentContainer(this.mainDiv);
            this._layoutWidget.eventWidgetActivated.attach(this._layoutWidgetActivatedHandler);
        }
        dispose() {
            this.disconnectComponent(this._connectionId);
            this._layoutWidget.eventWidgetActivated.detach(this._layoutWidgetActivatedHandler);
            this._layoutWidget.dispose();
            super.dispose();
        }
        /** resizes the trace configuration view widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof TraceConfigurationViewWidget
         */
        resize(width, height) {
            this._actualWidth = width;
            this._actualHeight = height;
            if (this._layoutWidget != undefined) {
                this._layoutWidget.resize(width, height);
            }
        }
        connect(componentId) {
            super.connect(componentId);
            // connect the component connection
            this.connectComponent(componentId);
        }
        /**
         *  Connects the active component
         *
         * @memberof TraceConfigurationViewWidget
         */
        connectComponent(componentId) {
            //BINDINGSOURCE: forwards the call to the bound provider
        }
        /**
         * Disconnects the active component
         *
         * @memberof TraceConfigurationViewWidget
         */
        disconnectComponent(componentId) {
            //BINDINGSOURCE: forwards the call to the bound provider
        }
        /**
         * Activates the component view
         *
         * @returns {*}
         * @memberof TraceConfigurationViewWidget
         */
        activate() {
            this._layoutWidget.activate();
        }
        /**
         * Deactivates the component view
         *
         * @returns {*}
         * @memberof TraceConfigurationViewWidget
         */
        deactivate() {
            this._layoutWidget.deactivate();
        }
        onContentActivated(sender, args) {
            args.widget.activate();
            this.resize(this._actualWidth, this._actualHeight);
        }
    };
    TraceConfigurationViewWidget = __decorate([
        mco.role()
    ], TraceConfigurationViewWidget);
    exports.TraceConfigurationViewWidget = TraceConfigurationViewWidget;
});
