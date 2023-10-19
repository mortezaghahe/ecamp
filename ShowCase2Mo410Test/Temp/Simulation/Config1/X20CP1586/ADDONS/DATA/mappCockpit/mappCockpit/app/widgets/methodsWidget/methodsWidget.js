var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/viewBase", "./componentDefaultDefinition"], function (require, exports, viewBase_1, componentDefaultDefinition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MethodsWidget = void 0;
    /**
     * implements displaying and execution of methods
     *
     * @class MethodsWidget
     * @extends {WidgetBase}
     * @implements {IMethodsWidget}
     */
    let MethodsWidget = class MethodsWidget extends viewBase_1.ViewBase {
        constructor() {
            super(...arguments);
            this._layoutWidgetActivated = (sender, args) => this.onContentActivated(sender, args);
            this._methodListSelectionChangedHandler = (sender, args) => this.onMethodListSelectionChanged(sender, args);
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        /**
         * Defines the height of the header
         *
         * @returns {number}
         * @memberof MethodsWidget
         */
        defineHeaderHeight() {
            return 30;
        }
        /**
         * Sets the widget content and eventually subwidgets
         *
         * @memberof MethodsWidget
         */
        initialized() {
            super.initialized();
            this.initLayoutWidget();
            this.setHeaderContent("Commands");
            this.setMethodListWidget();
            this.setParameterListWidget();
        }
        initLayoutWidget() {
            this._layoutWidget = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SplitterWidgetMethodsId);
            this.attachLayoutToView(this);
            //No persisting data in the common component view
            this._layoutWidget.component.disablePersisting();
            this._layoutWidget.initialize();
            // add widget to the parent container
            this._layoutWidget.addToParentContainer(this.mainDiv);
            this._layoutWidget.eventWidgetActivated.attach(this._layoutWidgetActivated);
        }
        /**
         * set the method list widget
         *
         * @returns {*}
         * @memberof MethodsWidget
         */
        setMethodListWidget() {
            this._methodListWidget = this.getWidgetById(componentDefaultDefinition_1.ComponentDefaultDefinition.MethodListWidgetId);
            this._methodListWidget.eventSelectionChanged.attach(this._methodListSelectionChangedHandler);
        }
        /**
         * set the method parameter list widget
         *
         * @returns {*}
         * @memberof MethodsWidget
         */
        setParameterListWidget() {
            this._methodParameterListWidget = this.getWidgetById(componentDefaultDefinition_1.ComponentDefaultDefinition.MethodParameterListWidgetId);
        }
        /**
         * activates MethodWidget
         *
         * @memberof MethodsWidget
         */
        activate() {
            this._layoutWidget.activate();
        }
        /**
         * deactivates MethodWidget
         *
         * @memberof MethodsWidget
         */
        deactivate() {
        }
        /**
         * disposes MethodWidget
         *
         * @memberof MethodsWidget
         */
        dispose() {
            if (this._methodListWidget != undefined) {
                this._methodListWidget.eventSelectionChanged.detach(this._methodListSelectionChangedHandler);
            }
            if (this._methodParameterListWidget != undefined) {
                this._methodParameterListWidget.dispose();
            }
            this._layoutWidget.eventWidgetActivated.detach(this._layoutWidgetActivated);
            this._layoutWidget.dispose();
            super.dispose();
        }
        /**
         * resizes the methods widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof MethodsWidget
         */
        resize(width, height) {
            this._actualWidth = width;
            this._actualHeight = height;
            if (this._layoutWidget != undefined) {
                let heightWithoutHeader = height - this._headerHeight;
                this._layoutWidget.resize(width, heightWithoutHeader);
            }
        }
        onMethodListSelectionChanged(sender, args) {
            this._methodParameterListWidget.updateParametersList(args);
        }
        onContentActivated(sender, args) {
            args.widget.activate();
            this.resize(this._actualWidth, this._actualHeight);
        }
    };
    MethodsWidget = __decorate([
        mco.role()
    ], MethodsWidget);
    exports.MethodsWidget = MethodsWidget;
});
