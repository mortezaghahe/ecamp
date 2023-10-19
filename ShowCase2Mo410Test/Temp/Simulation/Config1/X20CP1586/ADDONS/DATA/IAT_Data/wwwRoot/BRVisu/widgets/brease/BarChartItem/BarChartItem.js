define([
    'brease/core/BaseWidget',
    'brease/datatype/Node',
    'brease/core/Utils',
    'brease/decorators/LanguageDependency',
    'brease/decorators/MeasurementSystemDependency',
    'brease/events/BreaseEvent'
], function (SuperClass, Node, Utils, languageDependency, measurementSystemDependency, BreaseEvent) {

    'use strict';

    /**
     * @class widgets.brease.BarChartItem
     * @extends brease.core.BaseWidget
     *
     * @iatMeta category:Category
     * Chart,Numeric
     *
     * @iatMeta description:short
     * BarChartItem zur Datenanbindung
     * @iatMeta description:de
     * Widget zur Datenanbindung für BarChart.
     * Jedes BarChartItem repräsentiert eine Säule
     * @iatMeta description:en
     * Widget used for data connection to BarChart. 
     * Each BarChartItem represents a bar
     */

    /**
     * @cfg {Number} value=50
     * @bindable
     * @iatStudioExposed
     * @iatCategory Data
     * @nodeRefId node
     * Value for the bar. The configured default value will be used if the property is not bound.
     */

    /**
     * @cfg {Number} maxValue=100
     * @iatStudioExposed
     * @iatCategory Behavior
     * Maximum value, used to define the limits of the Chart.
     */

    /**
     * @cfg {Number} minValue=0
     * @iatStudioExposed
     * @iatCategory Behavior
     * Minimun value, used to define the limits of the Chart.
     */

    /**
     * @cfg {brease.datatype.Node} node=''
     * @bindable
     * @iatStudioExposed
     * @iatCategory Data
     * Value with unit for the bar.
     */

    /**
     * @cfg {String} text (required)
     * @iatStudioExposed
     * @localizable
     * @iatCategory Appearance
     * Display text on the cardinal axis for the Bar.
     */

    /**
     * @property {WidgetList} parents=["widgets.brease.BarChart"]
     * @inheritdoc  
     */

    /**
     * @cfg {String} tooltip=''
     * @iatStudioExposed
     * @hide 
     */

    /**
     * @cfg {Integer} tabIndex=-1
     * @hide
     */

    /**
     * @method showTooltip
     * @hide
     */

    /**
    * @method focus
    * @hide
    */
   
    /**
    * @event FocusIn
    * @hide
    */

    /**
    * @event FocusOut
    * @hide
    */

    var defaultSettings = {
            value: 50,
            maxValue: 100,
            minValue: 0,
            node: {},
            unit: {},
            type: 'BarChartItem',
            avoidSubmitChange: false
        },

        WidgetClass = SuperClass.extend(function BarChartItem() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),

        p = WidgetClass.prototype;

    p.init = function () {
        this.addInitialClass('barWidget');
        // class name 'breaseBarChartItem' is used in BarChart to find child widgets of type BarChartItem
        // works for derived widgets as well, as they get the css class too
        this.addInitialClass('breaseBarChartItem');

        this.data = {
            node: new Node(this.settings.value, null, this.settings.minValue, this.settings.maxValue),
            text: this.settings.text
        };

        _selectClipPath(this);
        
        SuperClass.prototype.init.call(this);

        this.setNode(this.data.node);
        this.setText(this.data.text);
    };

    p.langChangeHandler = function () {
        if (this.settings.textkey !== undefined) {
            var oldText = this.data.text,
                newText = brease.language.getTextByKey(this.settings.textkey);
            if (oldText !== newText) {
                this.data.text = newText;
                _sendDataChange(this);
            }
        }
    };

    p.measurementSystemChangeHandler = function () {
        var widget = this;
        this.settings.mms = brease.measurementSystem.getCurrentMeasurementSystem();
        this.valueChange = $.Deferred();
        this.unitChange = $.Deferred();

        $.when(this.valueChange.promise(), this.unitChange.promise()).then(function successHandler() {
            _sendDataChange(widget);
        });

        var previousUnitCode = this.data.node.unit;

        if (this.settings.unit !== undefined) {
            this.data.node.setUnit(this.settings.unit[this.settings.mms]);
        } else {
            this.unitChange.resolve();
        }

        var subscriptions = brease.uiController.getSubscriptionsForElement(this.elem.id);
        if (subscriptions !== undefined && subscriptions.node !== undefined) {
            if (this.data.node.unit !== previousUnitCode) {
                this.sendNodeChange({ attribute: 'node', nodeAttribute: 'unit', value: this.data.node.unit });
            } else {
                this.valueChange.resolve();
            }
        } else {
            this.valueChange.resolve();
        }
    };

    /**
     * @method setNode
     * sets the node
     * @param {brease.datatype.Node} node
     */
    p.setNode = function (node) {
        if (Utils.isObject(node)) {
            this.setAvoidSubmitChange(true);
            this.data.node.setId(node.id);
            this.setMinValue(node.minValue, true);
            this.setMaxValue(node.maxValue, true);
            var valueTrunked = _trunkValueToLimits(node.value, this.getMinValue(), this.getMaxValue());
            this.setValue(valueTrunked, true);
            this.setAvoidSubmitChange(false);
            _sendDataChange(this);
        }
    };

    /**
     * @method getNode
     * get the node
     * @return {brease.datatype.Node}
     */
    p.getNode = function () {
        return this.data.node;
    };

    /**
     * @method setValue
     * @iatStudioExposed
     * Sets the value for the Bar
     * @param {Number} value
     */
    p.setValue = function (value, trunked) {
        if (Utils.isNumeric(value)) {
            if (trunked !== true) {
                this.setReceivedValue(value);
            }
            var valueTrunked = _trunkValueToLimits(value, this.getMinValue(), this.getMaxValue());
            this.data.node.setValue(valueTrunked);
            _sendDataChange(this);

        }
    };

    /**
     * @method getValue
     * get the value
     * @return {Number}
     */
    p.getValue = function () {
        return this.data.node.value;
    };

    p.setReceivedValue = function (receivedValue) {
        this.settings.receivedValue = receivedValue;
    };

    p.getReceivedValue = function () {
        return this.settings.receivedValue;
    };

    /**
     * @method setMinValue
     * Sets minValue
     * @param {Number} value
     */
    p.setMinValue = function (value) {
        if (Utils.isNumeric(value)) {
            this.data.node.setMinValue(value);
            var valueTrunked = _trunkValueToLimits(this.getReceivedValue(), this.getMinValue(), this.getMaxValue());
            if (valueTrunked !== this.getValue()) {
                this.setValue(valueTrunked, true);
            }
            _sendDataChange(this);
        }
    };

    /**
     * @method getMinValue
     * get the minValue
     * @return {Number}
     */
    p.getMinValue = function () {
        return this.data.node.minValue;
    };

    /**
     * @method setMaxValue
     * Sets maxValue
     * @param {Number} value
     */
    p.setMaxValue = function (value) {
        if (Utils.isNumeric(value)) {
            this.data.node.setMaxValue(value);
            var valueTrunked = _trunkValueToLimits(this.getReceivedValue(), this.getMinValue(), this.getMaxValue());
            if (valueTrunked !== this.getValue()) {
                this.setValue(valueTrunked, true);
            }
            _sendDataChange(this);
        }
    };

    /**
     * @method getMaxValue
     * get the maxValue
     * @return {Number}
     */
    p.getMaxValue = function () {
        return this.data.node.maxValue;
    };

    /**
     * @method setText
     * Sets text
     * @param {String} text
     */
    p.setText = function (text) {
        if (text !== undefined) {
            if (brease.language.isKey(text)) {
                this.setTextkey(text);
            } else if (Utils.isString(text)) {
                this.data.text = text;
                _sendDataChange(this);
                if (this.getTextkey() !== undefined) {
                    this.removeTextkey();
                }
            }
        }
    };

    /**
     * @method getText
     * get text
     * @return {String}
     */
    p.getText = function () {
        return this.data.text;
    };

    p.updateVisibility = function (initial) {
        SuperClass.prototype.updateVisibility.apply(this, arguments);

        _sendDataChange(this);
    };

    p.setTextkey = function (textkey) {
        if (textkey !== undefined) {
            this.settings.textkey = brease.language.parseKey(textkey);
            this.setLangDependency(true);
            this.langChangeHandler();
        }
    };

    p.getTextkey = function () {
        return this.settings.textkey;
    };

    p.removeTextkey = function () {
        this.settings.textkey = undefined;
        this.setLangDependency(false);
    };

    p.setParentWidgetId = function (parentWidgetId) {
        this.settings.parentWidgetId = parentWidgetId;
        _sendDataChange(this);
    };

    p.getParentWidgetId = function () {
        return this.settings.parentWidgetId;
    };

    p.setUnit = function (unit) {
        this.settings.unit = unit;
        this.measurementSystemChangeHandler();
    };

    p.addClassNames = function (classNames) {
        var widget = this;
        classNames.forEach(function (id) {
            widget.el.addClass(id);
        });
        this.initialized = true;
    };

    p.setAvoidSubmitChange = function (avoidSubmitChange) {
        this.settings.avoidSubmitChange = avoidSubmitChange;
    };

    p.getAvoidSubmitChange = function () {
        return this.settings.avoidSubmitChange;
    };

    p.getData = function () {
        if (this.getAvoidSubmitChange()) { return; }

        if (!this.isHidden) {
            this.el.addClass('visible');
        } else {
            this.el.removeClass('visible');
        }

        return {
            id: this.elem.id,
            maxValue: this.getMaxValue(),
            minValue: this.getMinValue(),
            value: this.getValue(),
            text: this.getText(),
            visibility: !this.isHidden,
            type: this.settings.type
        };
    };
    //Private

    function _trunkValueToLimits(value, minValue, maxValue) {
        return Math.min(Math.max(value, minValue), maxValue);
    }

    function _sendDataChange(widget) { 
        var objectSend = widget.getData();
        if (objectSend === undefined) {
            return;
        }
        var parentWidgetId = widget.getParentWidgetId();
        if (brease.uiController.isWidgetCallable(parentWidgetId)) {          
            brease.callWidget(parentWidgetId, 'updateData', objectSend);
        }   
    }

    // override method called in BaseWidget.init
    p._initEditor = function () {
        var widget = this;
        require(['widgets/brease/BarChartItem/libs/EditorHandles', 'widgets/brease/common/libs/SVGUtils'], function (EditorHandles, SVGUtils) {
            // ensure element is created in svg namespace. Otherwise it won't appear in the ContentDesigner
            widget.elem = SVGUtils.importToSVGNamespace(widget.elem);
            widget.el = $(widget.elem);
            var editorHandles = new EditorHandles(widget);
            widget.getHandles = function () {
                return editorHandles.getHandles();
            };
            widget.designer.getSelectionDecoratables = function () {
                return editorHandles.getSelectionDecoratables();
            };
            _sendDataChange(widget);
            widget.dispatchEvent(new CustomEvent(BreaseEvent.WIDGET_EDITOR_IF_READY, { bubbles: true }));
        });
    };

    function _selectClipPath(widget) {
        widget.el.find('defs > clipPath').attr('id', widget.elem.id + '_clipPath');
    }

    return measurementSystemDependency.decorate(languageDependency.decorate(WidgetClass, false), true);
});
