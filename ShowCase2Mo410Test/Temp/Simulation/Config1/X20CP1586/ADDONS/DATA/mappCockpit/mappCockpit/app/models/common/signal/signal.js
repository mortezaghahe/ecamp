var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../framework/events", "./eventSignalDataChangedArgs", "../point", "../../../common/persistence/settings", "./settingIds"], function (require, exports, events_1, eventSignalDataChangedArgs_1, point_1, settings_1, settingIds_1) {
    "use strict";
    var Signal_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Signal = void 0;
    let EventDataChanged = class EventDataChanged extends events_1.TypedEvent {
    };
    EventDataChanged = __decorate([
        mco.role()
    ], EventDataChanged);
    ;
    let Signal = Signal_1 = class Signal {
        get rawPointsValid() {
            if (this._rawPoints.length < 2) {
                return false;
            }
            return true;
        }
        get name() {
            return this._name;
        }
        set name(value) {
            let oldName = this._name;
            this._name = value;
            this.onDataChanged(eventSignalDataChangedArgs_1.SignalAction.rename, oldName);
        }
        get rawPoints() {
            return this._rawPoints;
        }
        set rawPoints(points) {
            this._rawPoints = points;
            this._rawPoints_x = new Array(this._rawPoints.length);
            this._rawPoints_y = new Array(this._rawPoints.length);
            for (let i = 0; i < this._rawPoints.length; i++) {
                this._rawPoints_x[i] = this._rawPoints[i].x;
                this._rawPoints_y[i] = this._rawPoints[i].y;
            }
            // Raise rawPoints changed event
            this.onDataChanged(eventSignalDataChangedArgs_1.SignalAction.dataPointsChanged, this._rawPoints);
        }
        /**
         * Creates an instance of Signal.
         * @param {string} name
         * @param {Array<IPoint>} data
         * @memberof Signal
         */
        constructor(name, data) {
            this.eventDataChanged = new EventDataChanged();
            this._name = name;
            this._rawPoints = [];
            // preserve original data points
            this.rawPoints = data;
            this.id = name + Signal_1.uniqueId;
            Signal_1.uniqueId++;
        }
        getSettings() {
            let settings = new settings_1.Settings("Signal", "2.0");
            settings.setValue(settingIds_1.SettingIds.Name, this.name);
            settings.setValue(settingIds_1.SettingIds.RawPointsX, this._rawPoints_x);
            settings.setValue(settingIds_1.SettingIds.RawPointsY, this._rawPoints_y);
            return settings;
        }
        /*getSettings(): any {
            return { name: this.name, items: this._rawPoints, items_x: this._rawPoints_x, items_y: this._rawPoints_y };
        }*/
        setSettings(settings) {
            let settingsObj = settings_1.Settings.create(settings);
            this.name = settingsObj.getValue(settingIds_1.SettingIds.Name);
            let signalPoints = new Array();
            let pointsX = settingsObj.getValue(settingIds_1.SettingIds.RawPointsX);
            let pointsY = settingsObj.getValue(settingIds_1.SettingIds.RawPointsY);
            pointsX = Object.values(pointsX);
            pointsY = Object.values(pointsY);
            for (let i = 0; i < pointsX.length; i++) {
                let rawPointX = pointsX[i];
                let rawPointY = pointsY[i];
                signalPoints.push(new point_1.Point(parseFloat(rawPointX), parseFloat(rawPointY)));
            }
            // preserve original data points
            this._rawPoints = signalPoints;
            this._rawPoints_x = pointsX;
            this._rawPoints_y = pointsY;
        }
        /**
         * Clones the signal
         *
         * @returns
         * @memberof Signal
         */
        clone() {
            let clonedSignal = new Signal_1(this._name, this.rawPoints);
            return clonedSignal;
        }
        /**
         * Raises the name changed event
         *
         * @private
         * @param {string} name
         * @memberof Signal
         */
        onDataChanged(action, data) {
            let eventArgs = new eventSignalDataChangedArgs_1.EventSignalDataChangedArgs(action, data);
            this.eventDataChanged.raise(this, eventArgs);
        }
    };
    Signal.uniqueId = 0; // TODO use unique id (first recent data and latest have same id) => create unique id generator
    Signal = Signal_1 = __decorate([
        mco.role()
    ], Signal);
    exports.Signal = Signal;
});
