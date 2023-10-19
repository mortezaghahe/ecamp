var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/signal/serieNode", "./eventSignalManagerDataChangedArgs", "../common/signal/signal", "../common/calculatorProvider/calculationDataNumber", "../../common/seriesHelper", "../../common/colorHelper"], function (require, exports, serieNode_1, eventSignalManagerDataChangedArgs_1, signal_1, calculationDataNumber_1, seriesHelper_1, colorHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalManagerCalculationOutputData = void 0;
    let SignalManagerCalculationOutputData = class SignalManagerCalculationOutputData extends serieNode_1.SerieNode {
        get values() {
            return undefined;
        }
        get minValue() {
            return undefined;
        }
        get maxValue() {
            return undefined;
        }
        get dataTypeName() {
            if (this.calculationData instanceof calculationDataNumber_1.CalculationDataNumber) {
                return "Float";
            }
            else {
                return "String";
            }
        }
        get parent() {
            return this._parent;
        }
        set parent(value) {
            this._parent = value;
            if (this._parent != undefined && this.serie != undefined) {
                this.serie.parent = this.getSerieGroup();
            }
        }
        get name() {
            let dataModel = this.getDataModel();
            if (dataModel != undefined) {
                if (dataModel.editModeActive == true) {
                    return this.calculationData.getDisplayName(); // Show the display name of input/output parameter in edit mode
                }
            }
            return this.value; // Show only the value 
        }
        get description() {
            return this.calculationData.description;
        }
        get color() {
            if (this.serie != undefined) {
                return this.serie.color;
            }
            return "";
        }
        set color(value) {
            let oldValue = "";
            if (this.serie != undefined) {
                oldValue = this.serie.color;
                this.serie.color = value;
            }
            this.onDataChanged(this, new eventSignalManagerDataChangedArgs_1.EventSignalManagerDataChangedArgs(eventSignalManagerDataChangedArgs_1.SignalManagerAction.colorChanged, value, oldValue));
        }
        get value() {
            if (this.serie != undefined) {
                return this.serie.name;
            }
            return this._value;
        }
        set value(value) {
            let oldValue = this._value;
            this._value = value;
            if (this.serie != undefined) {
                this.serie.name = value;
            }
            this.onDataChanged(this, new eventSignalManagerDataChangedArgs_1.EventSignalManagerDataChangedArgs(eventSignalManagerDataChangedArgs_1.SignalManagerAction.valueChanged, value, oldValue));
        }
        get nodeType() {
            return serieNode_1.NodeType.calculationOutputParam;
        }
        /**
         * Creates an instance of SignalManagerCalculationOutputData.
         * @param {TCalculationData} calculationData
         * @param {boolean} isInput
         * @memberof SignalManagerCalculationOutputData
         */
        constructor(calculationData, seriesProvider) {
            super("", undefined);
            this.onlyValuesFromListAreAllowed = false;
            this.dropPossible = false;
            this.calculationData = calculationData;
            // generate unique calculation output name
            let uniqueOutputName = this.calculationData.value + " " + seriesProvider.getUniqueCalculationId();
            if (calculationData.type != undefined) {
                let signal = new signal_1.Signal(uniqueOutputName, new Array());
                let settings = seriesHelper_1.SeriesHelper.createSerieSettings(signal, signal.name, colorHelper_1.ColorHelper.getColor(), seriesProvider.getUniqueId(), calculationData.type, undefined);
                this.serie = seriesProvider.createSerie(settings);
                this.serie.isCalculated = true;
            }
            this._value = uniqueOutputName;
            this.canDelete = false;
        }
    };
    SignalManagerCalculationOutputData = __decorate([
        mco.role()
    ], SignalManagerCalculationOutputData);
    exports.SignalManagerCalculationOutputData = SignalManagerCalculationOutputData;
});
