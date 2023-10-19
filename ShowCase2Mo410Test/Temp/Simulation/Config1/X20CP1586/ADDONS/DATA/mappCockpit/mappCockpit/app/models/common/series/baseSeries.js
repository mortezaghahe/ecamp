var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../framework/events", "../signal/eventSignalDataChangedArgs", "../calculatorProvider/calculationDataPoints", "../../../common/dateTimeHelper", "../../../common/seriesHelper", "../point", "../calculatorProvider/calculationDataInfo", "./seriesType", "../signal/signal", "./settingIds", "./eventSerieDataChangedArgs", "../../signalManagerDataModel/signalCategory"], function (require, exports, events_1, eventSignalDataChangedArgs_1, calculationDataPoints_1, dateTimeHelper_1, seriesHelper_1, point_1, calculationDataInfo_1, seriesType_1, signal_1, settingIds_1, eventSerieDataChangedArgs_1, signalCategory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseSeries = void 0;
    let EventSeriesDataChanged = class EventSeriesDataChanged extends events_1.TypedEvent {
    };
    EventSeriesDataChanged = __decorate([
        mco.role()
    ], EventSeriesDataChanged);
    ;
    let BaseSeries = class BaseSeries {
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value;
        }
        get errorInfo() {
            return this._errorInfo;
        }
        set errorInfo(value) {
            this._errorInfo = value;
        }
        get originalName() {
            return this.signal.name;
        }
        get description() {
            return this._description;
        }
        set description(value) {
            this._description = value;
        }
        /**
         * Creates an instance of BaseSeries
         * @param {ISignal} signal
         * @param {string} name
         * @param {string} color
         * @param {CursorType} cursorType
         * @param {ISeriesProvider} serieProvider
         * @param {string} [uniqueId=""]
         * @memberof BaseSeries
         */
        constructor(signal, name, color, serieProvider, uniqueId, errorInfo) {
            this.type = seriesType_1.SeriesType.timeSeries;
            this.eventDataChanged = new EventSeriesDataChanged();
            this._onSignalDataChanged = (sender, eventArgs) => { this.onSignalDataChanged(sender, eventArgs); };
            this._rawPoints = [];
            this._isCalculated = false;
            this._startTriggerTime = 0;
            this.calculationDataInfo = undefined;
            this.isAutoUpdated = false;
            this._data = [];
            // holds the timestamps
            this._timestamps = [];
            this._errorInfo = new Array();
            this._seriesProvider = serieProvider;
            this._name = name;
            this._color = color;
            this.signal = signal;
            this.signal.eventDataChanged.attach(this._onSignalDataChanged);
            this._description = "";
            this.errorInfo = errorInfo;
            // Set given unique id
            this._id = uniqueId;
            this.persistID = serieProvider.getSeriesPersistingId(this._id);
        }
        /**
         * Create a signal with the given persisted signalData
         *
         * @protected
         * @param {*} signalData
         * @returns {ISignal}
         * @memberof BaseSeries
         */
        static createSignal(signalData) {
            let signal = new signal_1.Signal("", new Array());
            if (signalData != undefined) {
                signal.setSettings(signalData);
            }
            return signal;
        }
        /**
         * Returns the icon representation of this series (serie type, auto upload, series color, ... is included)
         *
         * @returns {string}
         * @memberof BaseSeries
         */
        getIcon() {
            return this._seriesProvider.getIcon(this);
        }
        /**
         * Returns a specific icon for this series (e.g. only a single overlay)
         *
         * @param {string} svgName (e.g. "autoUpdatedOverlay" or "exclamationOverlay")
         * @returns {string}
         * @memberof BaseSeries
         */
        getSpecificIcon(svgName) {
            return this._seriesProvider.getSpecificIcon(svgName);
        }
        /**
         * Retruns an error text for this series if some error infos are available
         *
         * @returns {string}
         * @memberof BaseSeries
         */
        getErrorText() {
            let formatedText = "";
            if (this.errorInfo != undefined) {
                if (this.errorInfo.length > 0) {
                    formatedText = "";
                    this.errorInfo.forEach(error => {
                        formatedText += error + "\r\n";
                    });
                }
            }
            return formatedText;
        }
        /**
         * Returns the persisting data of the BaseSeries
         *
         * @returns {ISettings}
         * @memberof BaseSeries
         */
        getSettings() {
            return seriesHelper_1.SeriesHelper.createSerieSettings(this.signal, this.name, this.color, this.id, this.type, this.calculationDataInfo, this.errorInfo);
        }
        /**
         * Disposes the BaseSeries
         *
         * @memberof BaseSeries
         */
        dispose() {
            this.signal.eventDataChanged.detach(this._onSignalDataChanged);
        }
        /**
         * Updates the timestamps baseon the available series
         *
         * @private
         * @memberof BaseSeries
         */
        updateTimestamps() {
        }
        /**
         * Get serie icon definition
         *
         * @readonly
         * @type {string}
         * @memberof baseSeries
         */
        get iconDefinition() {
            let iconDefinition = `<div class='e-doc' style='position: relative;height:16px;width:30px;margin:auto;float:left;margin-left:6px;margin-top:2px'>`;
            // add series icon (with overlays)
            iconDefinition += this.getIcon();
            iconDefinition += `</div>`;
            return iconDefinition;
        }
        /**
         * Updates the data of an existing serie
         *
         * @param {Array<IPoint>} rawPoints
         * @memberof baseSeries
         */
        updatePoints(rawPoints) {
            this.rawPoints = rawPoints;
            this.getRange();
            this.simplifySignal(rawPoints);
            this.signal.rawPoints = rawPoints;
        }
        simplifySignal(rawPoints) { }
        ;
        /**
         * Updates input data (DataPoints list) for calculated series
         *
         * @param {Array<CalculationDataPoints>} inputData
         * @memberof baseSeries
         */
        updateInputData(inputData) {
            if (this.calculationDataInfo != undefined) {
                for (let i = 0; i < inputData.length; i++) {
                    if (inputData[i] instanceof calculationDataPoints_1.CalculationDataPoints) {
                        this.calculationDataInfo.inputData[i] = inputData[i];
                    }
                }
            }
        }
        /**
         * Updates input data values (input string; e.g. signalname, 5, ...) for calculated series
         *
         * @private
         * @param {Array<SignalManagerCalculationInputData>} inputChilds
         * @memberof BaseSeries
         */
        updateInputDataValues(inputChilds) {
            if (this.calculationDataInfo != undefined) {
                let values = new Array();
                let inputDataIds = new Array();
                for (let i = 0; i < inputChilds.length; i++) {
                    values.push(inputChilds[i].getRawValue());
                    inputDataIds.push(inputChilds[i].calculationData.id);
                }
                this.calculationDataInfo.inputDataIds = inputDataIds;
                this.calculationDataInfo.inputDataValues = values;
            }
        }
        /**
         * Updates the input series for calculated series
         *
         * @private
         * @param {Array<SignalManagerCalculationInputData>} inputChilds
         * @memberof BaseSeries
         */
        updateInputSeriesIds(inputChilds) {
            if (this.calculationDataInfo != undefined) {
                this.calculationDataInfo.inputSeriesIds = [];
                for (let i = 0; i < inputChilds.length; i++) {
                    let serie = inputChilds[i].serie;
                    if (serie != undefined) {
                        this.calculationDataInfo.inputSeriesIds.push(serie.id);
                    }
                }
            }
        }
        /**
         * Updates the calculation informations for this series
         *
         * @param {Array<TCalculationData>} inputData
         * @param {string} type
         * @param {Array<SignalManagerCalculationInputData>} inputChilds
         * @memberof BaseSeries
         */
        updateCalculationDataInfo(inputData, type, inputChilds, seriesProvider) {
            if (this.calculationDataInfo == undefined) {
                this.calculationDataInfo = new calculationDataInfo_1.CalculationDataInfo(seriesProvider.getUniqueCalculationId());
            }
            this.calculationDataInfo.type = type;
            this.updateInputData(inputData);
            this.updateInputDataValues(inputChilds);
            this.updateInputSeriesIds(inputChilds);
        }
        /**
         * Gets the range limits from a serie
         *
         * @protected
         * @memberof baseSeries
         */
        getRange() {
            this.maxX = this.getMaxX();
            this.minX = this.getMinX();
            this.maxY = this.getMaxY();
            this.minY = this.getMinY();
        }
        /**
         *
         *
         * @returns {(number | undefined)}
         * @memberof baseSeries
         */
        getMaxX() {
            return 0;
        }
        /**
         *
         *
         * @protected
         * @returns {(number | undefined)}
         * @memberof baseSeries
         */
        getMinX() {
            return 0;
        }
        /**
         * Get max Y value from a serie
         *
         * @protected
         * @returns {(number | undefined)}
         * @memberof baseSeries
         */
        getMaxY() {
            let maxY;
            if (this.rawPoints.length > 0) {
                for (let i = 0; i < this.rawPoints.length; i++) {
                    if (maxY == undefined || this.rawPoints[i].y > maxY) {
                        maxY = this.rawPoints[i].y;
                    }
                }
            }
            return maxY;
        }
        /**
         * Get min Y value from a serie
         *
         * @protected
         * @returns {(number | undefined)}
         * @memberof baseSeries
         */
        getMinY() {
            let minY;
            if (this.rawPoints.length > 0) {
                for (let i = 0; i < this.rawPoints.length; i++) {
                    if (minY == undefined || this.rawPoints[i].y < minY) {
                        minY = this.rawPoints[i].y;
                    }
                }
            }
            return minY;
        }
        /**
         * Set rawPoints
         *
         * @memberof baseSeries
         */
        set rawPoints(points) {
            this._rawPoints = points;
        }
        /**
         * Get rawPoints
         *
         * @type {Array<IPoint>}
         * @memberof baseSeries
         */
        get rawPoints() {
            return this._rawPoints;
        }
        /**
         * gets the timestamps available in the series
         *
         * @readonly
         * @type {Array<number>}
         * @memberof baseSeries
         */
        get timestamps() {
            return this._timestamps;
        }
        /**
         * determines the index of the timestamp within the available timestamps
         *
         * @param {number} timestamp
         * @param {number[]} timestamps
         * @param {BinSearchMode} LOWER
         * @returns
         * @memberof baseSeries
         */
        getTimestampIndex(timestamp, binSearchMode = seriesHelper_1.BinSearchMode.NEAREST) {
            // get the available timestamps
            let timestamps = this.timestamps;
            // get the index of the timestamp 
            let timestampIndex = seriesHelper_1.SeriesHelper.indexOfNearest(timestamp, timestamps, binSearchMode);
            return timestampIndex >= 0 && timestampIndex < timestamps.length ? timestampIndex : -1;
        }
        /**
         * Gets the series point nearest to the timestamp
         *
         * @returns {IPoint}
         * @memberof baseSeries
         */
        pointFromTimestamp(timestamp) {
            let nearestTimestampIndex = this.getTimestampIndex(timestamp);
            return nearestTimestampIndex >= 0 ? this.rawPoints[nearestTimestampIndex] : new point_1.Point(0, 0);
        }
        /**
         * Gets the series point previous to the timestamp
         *
         * @returns {IPoint}
         * @memberof baseSeries
         */
        previousPointFromTimestamp(timestamp) {
            // get the lowerbound timestamp index ( if the timestamp is not matching exactly)
            let nearestTimestampIndex = this.getTimestampIndex(timestamp, seriesHelper_1.BinSearchMode.LOWERBOUND);
            return nearestTimestampIndex >= 0 ? this.rawPoints[nearestTimestampIndex] : new point_1.Point(0, 0);
        }
        /**
         * Checks if the timestamp is within the available range
         *
         * @param {number} timestamp
         * @returns {boolean}
         * @memberof BaseSeries
         */
        timestampIsInRange(timestamp) {
            return seriesHelper_1.SeriesHelper.isInRange(timestamp, this.timestamps);
        }
        /**
         * Set if serie is calculated
         *
         * @memberof baseSeries
         */
        set isCalculated(value) {
            this._isCalculated = value;
        }
        /**
         * Get if serie is calculated
         *
         * @type {boolean}
         * @memberof baseSeries
         */
        get isCalculated() {
            return this._isCalculated;
        }
        /**
         * Set serie name
         *
         * @memberof baseSeries
         */
        set name(value) {
            let oldName = this._name;
            this._name = value;
            this.onDataChanged(eventSerieDataChangedArgs_1.SerieAction.rename, this._name, oldName);
        }
        /**
         * Get serie name
         *
         * @type {string}
         * @memberof baseSeries
         */
        get name() {
            return this._name;
        }
        /**
         * Get unique serie id
         *
         * @readonly
         * @type {string}
         * @memberof baseSeries
         */
        get id() {
            return this._id;
        }
        /**
         * Set serie color
         *
         * @memberof baseSeries
         */
        set color(value) {
            let oldColor = this._color;
            this._color = value;
            this.onDataChanged(eventSerieDataChangedArgs_1.SerieAction.colorChanged, this._color, oldColor);
        }
        /**
         * Get serie color
         *
         * @type {string}
         * @memberof baseSeries
         */
        get color() {
            return this._color;
        }
        /**
         * Get if rawPoints are valid
         *
         * @readonly
         * @type {boolean}
         * @memberof baseSeries
         */
        get rawPointsValid() {
            return this.signal.rawPointsValid;
        }
        /**
         * Get startTriggerTime
         *
         * @type {number}
         * @memberof baseSeries
         */
        get startTriggerTime() {
            return this._startTriggerTime;
        }
        /**
         * Set startTriggerTime
         *
         * @memberof baseSeries
         */
        set startTriggerTime(value) {
            if (value != this._startTriggerTime) {
                let oldStartTriggerTime = this._startTriggerTime;
                this._startTriggerTime = value;
                this.onDataChanged(eventSerieDataChangedArgs_1.SerieAction.startTriggerTimeChanged, oldStartTriggerTime);
            }
        }
        /**
         * Get start trigger formated time (shown next to serie name)
         *
         * @readonly
         * @type {string}
         * @memberof baseSeries
         */
        get additionalInfo() {
            if (this._startTriggerTime != 0) {
                return dateTimeHelper_1.DateTimeHelper.getDateTime(this._startTriggerTime);
            }
            return ""; // No start trigger info available
        }
        /**
         * Get parent of serie
         *
         * @type {(ISerieGroup | undefined)}
         * @memberof baseSeries
         */
        get parent() {
            return this._parent;
        }
        /**
         * Set parent of serie
         *
         * @memberof baseSeries
         */
        set parent(value) {
            this._parent = value;
            if (this._parent != undefined) {
                if (this._parent.parent instanceof signalCategory_1.SignalCategory) {
                    if (this._parent.parent.id == signalCategory_1.SignalCategory.CategoryIdRecent) {
                        // Set serie to autoUpdated if in recent category
                        this.isAutoUpdated = true;
                    }
                }
                this.startTriggerTime = this._parent.startTriggerTime;
            }
            else {
                this.startTriggerTime = 0;
            }
        }
        /**
         * Resets the name to the original name from the signal
         *
         * @memberof baseSeries
         */
        resetName() {
            this.name = this.originalName;
        }
        /**
         * Clones this serie
         *
         * @returns
         * @memberof baseSeries
         */
        clone() {
            let settings = this.getSettings();
            settings.setValue(settingIds_1.SettingIds.SeriesId, this._seriesProvider.getUniqueId());
            return this._seriesProvider.createSerie(settings);
        }
        /**
         * Handles the serie data changed event (e.g. serie color, serie datapoints, rename changed)
         *
         * @private
         * @param {*} sender
         * @param {*} eventArgs
         * @memberof baseSeries
         */
        onSignalDataChanged(sender, eventArgs) {
            switch (eventArgs.action) {
                case eventSignalDataChangedArgs_1.SignalAction.dataPointsChanged: {
                    this.updateTimestamps();
                    this.onDataChanged(eventSerieDataChangedArgs_1.SerieAction.dataPointsChanged, eventArgs.data);
                    break;
                }
                case eventSignalDataChangedArgs_1.SignalAction.startTriggerTimeChanged: {
                    this.onDataChanged(eventSerieDataChangedArgs_1.SerieAction.startTriggerTimeChanged, eventArgs.data);
                    break;
                }
            }
        }
        onDataChanged(action, data, oldData = undefined) {
            let eventArgs = new eventSerieDataChangedArgs_1.EventSerieDataChangedArgs(action, data, oldData);
            this.eventDataChanged.raise(this, eventArgs);
            if (action == eventSerieDataChangedArgs_1.SerieAction.dataPointsChanged) {
                this.onSerieDataChanged(data);
            }
        }
        /**
         * Called whenever the seris data has changed
         *
         * @private
         * @param {IPoint[]} data
         * @memberof BaseSeries
         */
        onSerieDataChanged(data) {
            //TODO: eventually call simplification ????
        }
    };
    BaseSeries = __decorate([
        mco.role()
    ], BaseSeries);
    exports.BaseSeries = BaseSeries;
});
