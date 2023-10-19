var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/viewBase", "./componentDefaultDefinition"], function (require, exports, viewBase_1, componentDefaultDefinition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentViewWidget = void 0;
    let ComponentViewWidget = class ComponentViewWidget extends viewBase_1.ViewBase {
        constructor() {
            super(...arguments);
            this._layoutWidgetActivatedHandler = (sender, args) => this.onContentActivated(sender, args);
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        connect(componentId) {
            super.connect(componentId);
            this.connectComponent(componentId);
        }
        /**
         * Connects the active component
         *
         * @private
         * @memberof ComponentViewWidget
         */
        connectComponent(componentName) {
            //BINDINGSOURCE: forwards the call to the bound provider
        }
        /**
         * Disconnects the active component
         *
         * @private
         * @memberof ComponentViewWidget
         */
        disconnectComponent(componentName) {
            //BINDINGSOURCE: forwards the call to the bound provider
        }
        /**
         * Sets the widget content and eventually subwidgets
         *
         * @memberof ComponentViewWidget
         */
        initialized() {
            super.initialized();
            this.initLayoutWidget();
        }
        initLayoutWidget() {
            this._layoutWidget = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SplitterWidgetComponentViewId);
            this.attachLayoutToView(this);
            this._layoutWidget.component.disablePersisting();
            this._layoutWidget.initialize();
            // add widget to the parent container
            this._layoutWidget.addToParentContainer(this.mainDiv);
            this._layoutWidget.eventWidgetActivated.attach(this._layoutWidgetActivatedHandler);
            // disable persisting for inner splitters
            let innerLayoutWidget = this._layoutWidget.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SplitterWidgetTopSplitterId);
            innerLayoutWidget.component.disablePersisting();
        }
        /**
         * Activates the component view
         *
         * @returns {*}
         * @memberof ComponentViewWidget
         */
        activate() {
            this._layoutWidget.activate();
        }
        /**
         * Deactivates the component view
         *
         * @returns {*}
         * @memberof ComponentViewWidget
         */
        deactivate() {
            this._layoutWidget.deactivate();
        }
        /**
         * Disposes the component view
         *
         * @returns {*}
         * @memberof ComponentViewWidget
         */
        dispose() {
            this.disconnectComponent(this._connectionId);
            this._layoutWidget.eventWidgetActivated.detach(this._layoutWidgetActivatedHandler);
            this._layoutWidget.dispose();
            super.dispose();
        }
        /**
         * Resizes the component view
         *
         * @param number width
         * @param number height
         * @returns {*}
         * @memberof ComponentViewWidget
         */
        resize(width, height) {
            this._actualWidth = width;
            this._actualHeight = height;
            if (this._layoutWidget != undefined) {
                this._layoutWidget.resize(width, height);
            }
        }
        onContentActivated(sender, args) {
            args.widget.activate();
            this.resize(this._actualWidth, this._actualHeight);
        }
    };
    ComponentViewWidget = __decorate([
        mco.role()
    ], ComponentViewWidget);
    exports.ComponentViewWidget = ComponentViewWidget;
});
