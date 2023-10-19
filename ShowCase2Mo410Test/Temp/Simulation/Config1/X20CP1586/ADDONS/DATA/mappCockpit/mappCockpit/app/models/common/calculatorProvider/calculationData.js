var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/series/seriesType"], function (require, exports, seriesType_1) {
    "use strict";
    var CalculationData_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CalculationData = void 0;
    let CalculationData = CalculationData_1 = class CalculationData {
        /**
         * Creates an instance of CalculationData
         * @param {string} id the id of the calculation data
         * @param {string} name the displayname of the calculation data
         * @param {string} value the displayValue of this calculation data
         * @param {(number| string| Array<IPoint>)} data the data(e.g. datapoints) of this calculation data
         * @param {string} [description=""]
         * @param {(CalculationDataDisplayInfo|undefined)} [displayInfo=undefined]
         * @memberof CalculationData
         */
        constructor(id, name, value, data, description = "", displayInfo = undefined) {
            this._type = seriesType_1.SeriesType.timeSeries;
            this.id = id;
            this._name = name;
            this._value = value;
            this._data = data;
            this.description = description;
            this.errorInfo = new Array();
            this.displayInfo = displayInfo;
            if (this.displayInfo != undefined) {
                this.values = this.displayInfo.values;
            }
        }
        /**
         * Sets the internal data from one object to an other one(e.g. for cloning objects)
         *
         * @static
         * @param {CalculationData} sourceObject
         * @param {CalculationData} targetObject
         * @memberof CalculationData
         */
        static setRawData(sourceObject, targetObject) {
            targetObject._data = sourceObject._data;
        }
        /**
         * Creates a new calculationData object with the given data
         *
         * @param {*} data
         * @returns {CalculationData}
         * @memberof CalculationData
         */
        create(data) {
            let newObject = new CalculationData_1("", "", "", data);
            return newObject;
        }
        get value() {
            return this._value;
        }
        set value(value) {
            this._value = value;
        }
        get type() {
            return this._type;
        }
        set type(value) {
            this._type = value;
        }
        /**
         * Returns the display name of the calculation data
         *
         * @returns {string}
         * @memberof CalculationData
         */
        getDisplayName() {
            return this._name;
        }
        /**
         * Gets displayvalue to rawvalue if an value list exists.
         * Gets convererted string if value converter exists.
         *
         * @param {string} newValue
         * @returns {string}
         * @memberof CalculationData
         */
        getDisplayValue(newValue) {
            let retValue = newValue;
            if (this.values != undefined) {
                // Return displayValue instead of id if found in available values list
                this.values.forEach(value => {
                    if (newValue == value.value) {
                        retValue = value.displayValue;
                    }
                });
            }
            else if (this.valueConverter != undefined) {
                retValue = this.getValueFromRawValue(newValue);
            }
            return retValue;
        }
        /**
         * Gets rawvalue to displayvalue if an value list exists.
         *
         * @private
         * @param {string} value
         * @returns {string}
         * @memberof CalculationData
         */
        getRawValueToDisplayValue(value) {
            let rawValue = value;
            if (this.values != undefined) {
                // Set raw value instead of display value if found in available values list
                this.values.forEach(value => {
                    if (rawValue == value.displayValue) {
                        rawValue = value.value;
                    }
                });
            }
            return rawValue;
        }
        getIconPath() {
            return "";
        }
        getData() {
            return this._data;
        }
        setData(data) {
            this._data = data;
        }
        set valueConverter(valueConverterInjection) {
            this._valueConverter = valueConverterInjection;
        }
        get valueConverter() {
            return this._valueConverter;
        }
        getValueFromRawValue(rawValue) {
            if (this.valueConverter != undefined) {
                return this.valueConverter.getValueFromRawValue(rawValue);
            }
            return rawValue;
        }
    };
    CalculationData = CalculationData_1 = __decorate([
        mco.role()
    ], CalculationData);
    exports.CalculationData = CalculationData;
});
