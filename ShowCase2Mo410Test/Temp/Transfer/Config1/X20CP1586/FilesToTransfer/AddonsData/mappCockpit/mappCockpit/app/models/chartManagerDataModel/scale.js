var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../framework/events", "./eventScaleDataChangedArgs", "./chartManagerChart", "../../common/persistence/settings", "./settingIds"], function (require, exports, events_1, eventScaleDataChangedArgs_1, chartManagerChart_1, settings_1, settingIds_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Scale = void 0;
    let EventScaleDataChanged = class EventScaleDataChanged extends events_1.TypedEvent {
    };
    EventScaleDataChanged = __decorate([
        mco.role()
    ], EventScaleDataChanged);
    ;
    let Scale = class Scale {
        /**
         * Creates an instance of Scale
         * @param {string} id
         * @memberof Scale
         */
        constructor(id, parent) {
            this.dropPossible = false;
            this.expandState = true;
            this.uniqueId = 0;
            this._minYValue = 0;
            this._maxYValue = 100;
            this._minXValue = 0;
            this._maxXValue = 100;
            this.eventDataChanged = new EventScaleDataChanged();
            this.parent = parent;
            this.id = id;
            this.name = 'Scale';
            this.description = "";
            this.childs = new Array();
            this.isDisabled = false;
        }
        getSettings() {
            let settings = new settings_1.Settings("Scale");
            let series = this.getChilds();
            let seriesExport = new Array();
            series.forEach(serie => {
                seriesExport.push(serie.id);
            });
            settings.setValue(settingIds_1.SettingIds.ScaleId, this.id);
            settings.setValue(settingIds_1.SettingIds.ScaleName, this.name);
            settings.setValue(settingIds_1.SettingIds.ScaleExpandState, this.expandState);
            settings.setValue(settingIds_1.SettingIds.ScaleMinXValue, this.minXValue);
            settings.setValue(settingIds_1.SettingIds.ScaleMaxXValue, this.maxXValue);
            settings.setValue(settingIds_1.SettingIds.ScaleMinYValue, this.minYValue);
            settings.setValue(settingIds_1.SettingIds.ScaleMaxYValue, this.maxYValue);
            settings.setValue(settingIds_1.SettingIds.ScaleSeriesIds, seriesExport);
            return settings;
        }
        setSettings(settings) {
            let settingsObj = settings_1.Settings.create(settings);
            this.id = settingsObj.getValue(settingIds_1.SettingIds.ScaleId);
            this.name = settingsObj.getValue(settingIds_1.SettingIds.ScaleName);
            this.expandState = settingsObj.getValue(settingIds_1.SettingIds.ScaleExpandState);
            let minXValue = settingsObj.getValue(settingIds_1.SettingIds.ScaleMinXValue);
            let maxXValue = settingsObj.getValue(settingIds_1.SettingIds.ScaleMaxXValue);
            let minYValue = settingsObj.getValue(settingIds_1.SettingIds.ScaleMinYValue);
            let maxYValue = settingsObj.getValue(settingIds_1.SettingIds.ScaleMaxYValue);
            this.setScaleRange(minXValue, maxXValue, minYValue, maxYValue);
            // TODO: Set series to scale here and not in chartmanager datamodel
            //this.seriesExport = settingsObj.getData("seriesIds");
        }
        get minYValue() {
            return this._minYValue;
        }
        set minYValue(value) {
            this._minYValue = value;
        }
        get maxYValue() {
            return this._maxYValue;
        }
        set maxYValue(value) {
            this._maxYValue = value;
        }
        get minXValue() {
            return this._minXValue;
        }
        set minXValue(value) {
            if (value != this._minXValue) {
                this._minXValue = value;
            }
        }
        get maxXValue() {
            return this._maxXValue;
        }
        set maxXValue(value) {
            if (value != this._maxXValue) {
                this._maxXValue = value;
            }
        }
        get iconDefinition() {
            let iconDefinition = "";
            let classNames = "e-treegridcollapse treegridcollapse";
            // Add collapse/expand icon 
            if (this.expandState == true) {
                classNames += "e-treegridexpand treegridexpand";
            }
            iconDefinition += `<div class='` + classNames + `'></div>`;
            return iconDefinition;
        }
        /**
         * Add series to scale
         *
         * @param {Array<BaseSeries>} series
         * @memberof Scale
         */
        addSeries(series) {
            for (var i = 0; i < series.length; i++) {
                this.childs.push(series[i]);
            }
        }
        /**
         *
         *
         * @param {BaseSeries} serie
         * @returns {boolean}
         * @memberof Scale
         */
        removeSerie(serie) {
            let index = -1;
            for (let i = 0; i < this.childs.length; i++) {
                if (this.childs[i] == serie) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                this.childs.splice(index, 1);
                return true;
            }
            return false;
        }
        /**
         * Returns the number of matching series between the ones being dragged and the ones in the scale
         *
         * @param {Array<BaseSeries>} data
         * @returns {number}
         * @memberof Scale
         */
        numberOfMatchingSeries(data) {
            let index = 0;
            //FFT exception. Avoid to insert same input signal in FFT chart
            let isFFTChart = this.parent.chartType == chartManagerChart_1.ChartType.FFTChart;
            for (let i = 0; i < this.childs.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    if (this.childs[i] == data[j] || (isFFTChart && this.isSerieInCalculation(this.childs[i], data[j]))) {
                        index += 1;
                        break;
                    }
                }
            }
            return index;
        }
        /**
         * Returns true if the signal is in the scale
         *
         * @param {BaseSeries} serie
         * @returns {boolean}
         * @memberof Scale
         */
        hasSerie(serie) {
            for (let i = 0; i < this.childs.length; i++) {
                if (this.childs[i] == serie) {
                    return true;
                }
            }
            return false;
        }
        /**
         * Check if serie is already used in a calculated serie that is inside the chart
         *
         * @param {BaseSeries} serieInScale
         * @param {BaseSeries} serie
         * @returns {boolean}
         * @memberof Scale
         */
        isSerieInCalculation(serieInScale, serie) {
            let calculationDataInfo = serieInScale.calculationDataInfo;
            if (calculationDataInfo != undefined) {
                if (calculationDataInfo.inputSeriesIds[0] == serie.id) {
                    return true;
                }
            }
            return false;
        }
        getChilds() {
            let series = [];
            for (let i = 0; i < this.childs.length; i++) {
                series.push(this.childs[i]);
            }
            return series;
        }
        /**
         * Sets the chart disabled or enabled
         *
         * @param {boolean} disabled
         * @memberof Scale
         */
        setDisabled(disabled) {
            this.isDisabled = disabled;
        }
        /**
         * Sets the range of this scale for the given axis and min/max values
         *
         * @param {number} minXValue
         * @param {number} maxXValue
         * @param {number} minYValue
         * @param {number} maxYValue
         * @memberof Scale
         */
        setScaleRange(minXValue, maxXValue, minYValue, maxYValue) {
            let xAxisChanged = false;
            let yAxisChanged = false;
            if (this.minXValue != minXValue || this.maxXValue != maxXValue) {
                xAxisChanged = true;
            }
            if (this.minYValue != minYValue || this.maxYValue != maxYValue) {
                yAxisChanged = true;
            }
            this.minYValue = minYValue;
            this.maxYValue = maxYValue;
            this.minXValue = minXValue;
            this.maxXValue = maxXValue;
            if (xAxisChanged) {
                let args = new eventScaleDataChangedArgs_1.EventScaleDataChangedArgs(eventScaleDataChangedArgs_1.ScaleAction.xRangeChanged, { scale: this });
                this.eventDataChanged.raise(this, args);
            }
            if (yAxisChanged) {
                let args = new eventScaleDataChangedArgs_1.EventScaleDataChangedArgs(eventScaleDataChangedArgs_1.ScaleAction.yRangeChanged, { scale: this });
                this.eventDataChanged.raise(this, args);
            }
        }
    };
    Scale = __decorate([
        mco.role()
    ], Scale);
    exports.Scale = Scale;
});
