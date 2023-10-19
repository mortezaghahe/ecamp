define([
    'widgets/brease/TableItemWidget/TableItemWidget',
    'brease/events/BreaseEvent',
    'brease/decorators/CultureDependency',
    'brease/helper/DateFormatter'
], function (
    SuperClass, BreaseEvent, CultureDependency, DateFormatter
) {
    
    'use strict';

    /**
     * @class widgets.brease.TableItemDateTime
     * @extends widgets.brease.TableItemWidget
     * @iatMeta studio:visible
     * true
    
     * @iatMeta category:Category
     * Data,Container
     * @iatMeta description:short
     * Provides an date time list for the Table widget
     * @iatMeta description:de
     * Stellt dem Table Widget eine Liste an Datum
     * @iatMeta description:en
     * Provides an date time list for the Table widget
     */
    
    /**
     * @property {WidgetList} parents=["widgets.brease.Table"]
     * @inheritdoc  
     */

    /**
     * @cfg {DateTimeArray1D} value
     * @iatStudioExposed
     * @nodeRefId node
     * @iatCategory Data
     * @bindable
     * @not_projectable
     * Binding for DATETIME Arrays.
     */

    /**
     * @cfg {String} format='F'
     * @localizable
     * @iatStudioExposed
     * @iatCategory Appearance
     * @bindable
     * Specifies the format of the time shown in the TableItemDateTime. This is either a format string (ee.g. "HH:mm") or a pattern ("F").
     */

    var defaultSettings = {
            data: [],
            value: [],
            format: 'F',
            formatKey: '',
            dataInitialized: false,
            fireDataInitEvent: false,
            dataType: 'date',
            selectedImageIndex: -1
        },

        WidgetClass = SuperClass.extend(function TableItemDateTime() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),

        p = WidgetClass.prototype;

    p.init = function () {
        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseTableItemDateTime');
        }       
        SuperClass.prototype.init.call(this);
        this.setFormatIsSet = false;
        this.setValueIsSet = false;
        _initFormat(this);

        if (brease.config.editMode) {
            this.settings.mockData = ['1970-01-01T00:00:01.000+00:00', '1970-01-01T00:00:01.000+00:00', '1970-01-01T00:00:01.000+00:00', '1970-01-01T00:00:01.000+00:00', '1970-01-01T00:00:01.000+00:00', '1970-01-01T00:00:01.000+00:00', '1970-01-01T00:00:01.000+00:00', '1970-01-01T00:00:01.000+00:00', '1970-01-01T00:00:01.000+00:00', '1970-01-01T00:00:01.000+00:00'];
            this.formatData(this.settings.mockData);
            this.el.zIndex(this.el.zIndex() + 1);
        }

        var widget = this;
        this.el.one(BreaseEvent.WIDGET_READY, function () {
            widget.settings.fireDataInitEvent = true;
            if (!(_hasBinding.call(widget, 'value'))) {
                widget.valueInitState.resolve();
            }
        });      
    };

    /**
     * @method setValue
     * Sets value
     * @param {DateTimeArray1D} value
     */
    p.setValue = function (value) {
        if (value !== undefined) {
            this.settings.value = Array.isArray(value) ? value : [];
            this.setValueIsSet = true;
            if (!(_hasBinding.call(this, 'format')) || this.setFormatIsSet) {
                this.formatData();
                if (this.valueInitState.state() !== 'resolved') {
                    this.valueInitState.resolve();                  
                }
            }          
        }      
    };

    /**
     * @method getValue 
     * Returns value.
     * @return {DateTimeArray1D}
     */
    p.getValue = function () {
        return this.settings.value;
    };

    /**
     * @method setFormat
     * Sets format
     * @param {String} format
     * @param {Object} metaData
     * @param {Boolean} omitValueInit
     */
    p.setFormat = function (format, metaData, omitValueInit) {
        if (omitValueInit === undefined) {
            omitValueInit = false;
        }
        if (format !== undefined) {
            if (brease.language.isKey(format) === false) {
                this.settings.format = format;
                this.settings.formatKey = undefined;
            } else {
                this.setFormatKey(brease.language.parseKey(format));
            }

            if (brease.config.editMode) {
                this.formatData(this.settings.mockData);
            } else {
                this.formatData(); 
                this.setFormatIsSet = !omitValueInit;
                if (this.valueInitState.state() !== 'resolved' && (!omitValueInit && this.setValueIsSet)) {
                    this.valueInitState.resolve();   
                }               
            }        
        }
    };

    /**
     * @method getFormat 
     * Returns format.
     * @return {String}
     */
    p.getFormat = function () {
        return this.settings.format;
    };

    p.setFormatKey = function (key) {
        if (key !== undefined) {
            this.settings.formatKey = key;
            this.setCultureDependency(true);
            var format = brease.language.getTextByKey(this.settings.formatKey);
            if (format !== 'undefined key') {
                this.settings.format = format;
                if (brease.config.editMode) {
                    this.formatData(this.settings.mockData);
                } else {
                    this.formatData();
                }
            } else {
                console.iatWarn(this.elem.id + ': Format textKey not found: ' + key);
            }
        } else {
            this.settings.formatKey = undefined;
            console.iatInfo(this.elem.id + ': The text key is not valid : ' + key);
        }
    };

    p.formatData = function (dates) {
        if (dates === undefined || dates === null) {
            dates = this.settings.value;
        }

        var widget = this, retVal, formattedArray = [];
        dates.forEach(function (date, index) {
            var d = new Date(date);
            d.setMinutes(d.getMinutes() + d.getTimezoneOffset()); //Convert back to UTC standard time
            DateFormatter.format(d, widget.settings.format, function (result) {
                retVal = result;
            });
            formattedArray[index] = retVal;
        });
        widget.settings.data = formattedArray;
        this.updateTableValues();
    };

    /**
     * @method getData
     * Returns data (Interface Table -> TableItem)
     */
    p.getData = function () {
        return this.settings.data;
    };

    /**
     * @method getDataUpdateState
     * Returns data update availability state
     */
    p.getDataUpdateState = function () {
        var updateState = {};

        updateState.enableUpdateAvailable = this.enableUpdateAvailable;
        updateState.valueUpdateAvailable = this.valueUpdateAvailable;
        updateState.visibleUpdateAvailable = this.visibleUpdateAvailable;
        updateState.headerUpdateAvailable = this.headerUpdateAvailable;
        updateState.itemSizeUpdateAvailable = this.itemSizeUpdateAvailable;

        return updateState;
    };

    /**
     * @method getItemConfig
     * Returns item config
     */
    p.getItemConfig = function () {
        var configObj = {};

        configObj.type = this.settings.dataType;
        configObj.input = false;
        configObj.inputConfig = {};
        configObj.inputConfig.format = this.settings.format;
        configObj.inputConfig.inputStyle = 'default';
        configObj.inputConfig.validDataLength = 0;
        return configObj;
    };

    /**
     * @method updateTableValues
     * Invoke drawing function for cell values in the table
     */
    p.updateTableValues = function () {
        this.valueUpdateAvailable = true;
        if (this.settings.dataInitialized && this.isTableReady()) {
            this.initialTableReadyCall = true;
            // this.table._valueUpdateAvailable(this.elem.id);
            brease.callWidget(this.tableId, '_valueUpdateAvailable', this.elem.id);
        }
    };

    p.cultureChangeHandler = function () {
        if (this.settings.formatKey) {
            this.setFormatKey(this.settings.formatKey);
        } else {
            this.formatData();
        }

        SuperClass.prototype.langChangeHandler.apply(this, arguments);
    };

    /**
     * @method getItemType
     * This method will return the type of the widget. Necessary for the table 
     * to keep track of the newly added widgets in the editor
     * @returns {String} the type of the widget on the form widgets/brease/*
     */
    p.getItemType = function () {
        return 'widgets/brease/TableItemDateTime';
    };
    function _hasBinding(attribute) {
        return this.bindings !== undefined && this.bindings[attribute] !== undefined;
    }

    function _initFormat(widget) {
        widget.setFormat(widget.settings.format, undefined, true);
    }

    return CultureDependency.decorate(WidgetClass, true);
});
