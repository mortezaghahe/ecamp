var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../framework/events", "../../../models/common/series/eventSerieDataChangedArgs", "../../../models/common/point", "../../../models/common/series/seriesType", "./ytCursorSignal", "./xyCursorSignal", "./fftCursorSignal", "./componentDefaultDefinition", "./settingIds", "../../../common/persistence/settings", "../../common/states/cursorType"], function (require, exports, events_1, eventSerieDataChangedArgs_1, point_1, seriesType_1, ytCursorSignal_1, xyCursorSignal_1, fftCursorSignal_1, componentDefaultDefinition_1, settingIds_1, settings_1, cursorType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorSignalsDataModel = void 0;
    let EventModelChanged = class EventModelChanged extends events_1.TypedEvent {
    };
    EventModelChanged = __decorate([
        mco.role()
    ], EventModelChanged);
    ;
    let CursorSignalsDataModel = class CursorSignalsDataModel {
        constructor() {
            this._isPersistEnabled = false;
            this.eventModelChanged = new EventModelChanged();
            this._cursorSignals = new Array();
            this._serieDataChangedHandler = (sender, args) => this.onSerieDataChanged(sender, args);
        }
        initialize() {
            this.component.loadComponentSettings();
            //When widget is initialized data can be persisted
            this._isPersistEnabled = true;
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
        }
        /**
         * Disposes the instance
         *
         * @memberof CursorSignalsDataModel
         */
        dispose() {
        }
        /**
         * Resets all data
         *
         * @memberof CursorSignalsDataModel
         */
        clear() {
            // TODO: Must be implemented if needed
        }
        /**
         * Returns the list with the cursor signals for the cursor info widget
         *
         * @returns {Array<CursorSignal>}
         * @memberof CursorSignalsDataModel
         */
        getCursorSignals() {
            return this._cursorSignals;
        }
        /**
         *  Returns the CursorSignal which links to the given serie
         *
         * @param {BaseSeries} serie
         * @returns {(CursorSignal|undefined)}
         * @memberof CursorSignalsDataModel
         */
        getCursorSignal(serie) {
            for (let i = 0; i < this._cursorSignals.length; i++) {
                if (this._cursorSignals[i].serie.id === serie.id) {
                    // serie already in list
                    return this._cursorSignals[i];
                }
            }
            return undefined;
        }
        /**
         * Returns the index of the cursorSignal in the datamodel else -1 if not found
         *
         * @param {CursorSignal} cursorSignal
         * @returns {number}
         * @memberof CursorSignalsDataModel
         */
        getIndex(cursorSignal) {
            return this._cursorSignals.indexOf(cursorSignal);
        }
        getComponentSettings(onlyModified) {
            let cursorSignalsData = new Array();
            for (let i = 0; i < this._cursorSignals.length; i++) {
                cursorSignalsData.push(this._cursorSignals[i].getSettings());
            }
            this.component.setSetting("cursorSignalsData", cursorSignalsData);
            return this.component.getComponentSettings(onlyModified);
        }
        setComponentSettings(componentSettings) {
            if (componentSettings != undefined) {
                this.component.setComponentSettings(componentSettings);
                let cursorSignalsData = this.component.getSetting("cursorSignalsData");
                if (cursorSignalsData != undefined) {
                    //We add the series from bottom to top. In the cursorInfoWidget, the last serie we insert is always placed on top.
                    for (let i = cursorSignalsData.length - 1; i > -1; i--) {
                        let cursorSignalData = cursorSignalsData[i];
                        let settings = settings_1.Settings.create(cursorSignalData);
                        let series = new Array();
                        let serie = this.getSerieFromProvider(settings.getValue(settingIds_1.SettingIds.SerieId));
                        if (serie != undefined) {
                            series.push(serie);
                        }
                        this.addSeries(series, settings.getValue(settingIds_1.SettingIds.ExpandState), settings.getValue(settingIds_1.SettingIds.CursorInfo));
                    }
                }
                this.onModelChanged();
            }
        }
        getSerieFromProvider(id) {
            let seriesProvider = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SeriesProviderId);
            if (seriesProvider != undefined) {
                return seriesProvider.get(id);
            }
            return undefined;
        }
        addSeries(series, expandState, cursorInfo) {
            let cursorSignals = new Array();
            for (var i = 0; i < series.length; i++) {
                if (series[i].type === seriesType_1.SeriesType.timeSeries) {
                    cursorSignals.push(new ytCursorSignal_1.YTCursorSignal(series[i], expandState, cursorInfo));
                }
                else if (series[i].type === seriesType_1.SeriesType.xySeries) {
                    cursorSignals.push(new xyCursorSignal_1.XYCursorSignal(series[i], expandState, cursorInfo));
                }
                else if (series[i].type === seriesType_1.SeriesType.fftSeries) {
                    cursorSignals.push(new fftCursorSignal_1.FFTCursorSignal(series[i], expandState, cursorInfo));
                }
            }
            this.addCursorSignals(cursorSignals);
        }
        /**
         * Adds the given cursor signals to the signal list(at the top)
         *
         * @param {Array<CursorSignal>} cursorSignal
         * @returns
         * @memberof CursorSignalsDataModel
         */
        addCursorSignals(cursorSignal) {
            for (var i = 0; i < cursorSignal.length; i++) {
                let index = this._cursorSignals.indexOf(cursorSignal[i]);
                if (index > -1) {
                    // cusorSignal already in list
                    return;
                }
                //Check if serie is not in the list
                if (this.getCursorSignal(cursorSignal[i].serie) == undefined) {
                    cursorSignal[i].serie.eventDataChanged.attach(this._serieDataChangedHandler);
                    this._cursorSignals.splice(0, 0, cursorSignal[i]);
                    this.updateCursorSignalValues(cursorSignal[i]);
                    this.onModelChanged();
                }
            }
        }
        /**
         * Updates the cursor signal values for the currently available cursor state positions
         *
         * @private
         * @param {CursorSignal} cursorSignal
         * @memberof CursorSignalsDataModel
         */
        updateCursorSignalValues(cursorSignal) {
            var _a, _b;
            let cursorType = cursorType_1.CursorTypeHelper.getCursorTypeForSeries(cursorSignal.serie);
            this.updateCursorValues(cursorSignal, (_a = this._currentCursorStates) === null || _a === void 0 ? void 0 : _a.getPosition(0, cursorType), (_b = this._currentCursorStates) === null || _b === void 0 ? void 0 : _b.getPosition(1, cursorType));
        }
        /**
         * Clears all the cursor value informations of this signal
         *
         * @private
         * @param {CursorSignal} cursorSignal
         * @memberof CursorSignalsDataModel
         */
        clearCursorSignalValues(cursorSignal) {
            cursorSignal.clearValues();
        }
        /**
         * Removes the given cursor signal from the signal list
         *
         * @param {CursorSignal} cursorSignal
         * @memberof CursorSignalsDataModel
         */
        removeCursorSignal(cursorSignal) {
            let index = this._cursorSignals.indexOf(cursorSignal);
            if (index > -1) {
                this._cursorSignals.splice(index, 1);
                cursorSignal.serie.eventDataChanged.detach(this._serieDataChangedHandler);
                this.onModelChanged();
            }
        }
        /**
         * Updates the cursor informations for the given signal to the defined cursorIndex 1 and 2
         *
         * @private
         * @param {CursorSignal} cursorSignal
         * @param {(number|undefined)} cursorTimestamp1
         * @param {(number|undefined)} cursorTimestamp2
         * @returns
         * @memberof CursorSignalsDataModel
         */
        updateCursorValues(cursorSignal, cursorTimestamp1, cursorTimestamp2) {
            if (!cursorSignal.serie.rawPointsValid) {
                cursorSignal.clearValues();
                return;
            }
            let cursorPoint1;
            let cursorPoint2;
            if (cursorTimestamp1 != undefined) {
                cursorPoint1 = this.getCursorSignalPoint(cursorSignal, cursorTimestamp1);
            }
            if (cursorTimestamp2 != undefined) {
                cursorPoint2 = this.getCursorSignalPoint(cursorSignal, cursorTimestamp2);
            }
            cursorSignal.updateValues(cursorPoint1, cursorPoint2, cursorTimestamp1, cursorTimestamp2);
        }
        /**
         * gets a cursor signal point from the given curor signal and timestamp
         *
         * @private
         * @param {CursorSignal} cursorSignal
         * @param {number} cursorTimestamp
         * @returns
         * @memberof CursorSignalsDataModel
         */
        getCursorSignalPoint(cursorSignal, cursorTimestamp) {
            let cursorPoint = point_1.Point.Empty();
            // get the nearest signal point for valid timestamps
            if (cursorTimestamp != undefined && cursorSignal.serie.timestampIsInRange(cursorTimestamp)) {
                cursorPoint = cursorSignal.serie.previousPointFromTimestamp(cursorTimestamp);
            }
            return cursorPoint;
        }
        /**
         * updates the cursor info values corresponding to the given cursor state values
         *
         * @param {CursorStates} modifiedState
         * @memberof CursorSignalsDataModel
         */
        updateInfoCursorsWithNewCursorStateValues(currentCursorStates) {
            this._currentCursorStates = currentCursorStates;
            this.getCursorSignals().forEach((cursorSignal) => {
                if (cursorSignal.serie.rawPointsValid) {
                    this.updateCursorSignalValues(cursorSignal);
                }
                else {
                    this.clearCursorSignalValues(cursorSignal);
                }
            });
        }
        onSerieDataChanged(sender, args) {
            if (args.action == eventSerieDataChangedArgs_1.SerieAction.rename || args.action == eventSerieDataChangedArgs_1.SerieAction.dataPointsChanged
                || args.action == eventSerieDataChangedArgs_1.SerieAction.startTriggerTimeChanged || args.action == eventSerieDataChangedArgs_1.SerieAction.colorChanged) {
                // if the datapoints have changed, then the cursor values must be updated
                if (args.action == eventSerieDataChangedArgs_1.SerieAction.dataPointsChanged) {
                    let cursorSignal = this.getCursorSignal(sender);
                    if (cursorSignal != undefined) {
                        this.updateCursorSignalValues(cursorSignal);
                    }
                }
                this.onModelChanged();
            }
        }
        onModelChanged() {
            this.eventModelChanged.raise(this, null);
            this.saveSettings();
        }
        /**
         * Save settings in cursor dataModel
         *
         * @memberof CursorSignalsDataModel
         */
        saveSettings() {
            if (this._isPersistEnabled) {
                this.component.saveComponentSettings();
            }
        }
    };
    CursorSignalsDataModel = __decorate([
        mco.role()
    ], CursorSignalsDataModel);
    exports.CursorSignalsDataModel = CursorSignalsDataModel;
});
