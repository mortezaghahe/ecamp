var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./traceDataConversion/classes/ConvertHandler", "./traceDataConversion/enums/ConvertTypes", "../models/common/signal/signal", "./colorHelper", "./dateTimeHelper", "../models/common/point", "./traceDataConversion/classes/DeconvertHandler", "./traceDataConversion/exceptions/traceDataConversionError", "./traceDataConversion/classes/ytSignal", "./traceDataConversion/classes/xySignal", "./traceDataConversion/classes/fftSignal", "../core/types/sample", "../core/types/frequencyAmplitude", "../core/types/point", "../models/common/series/seriesType", "./exportSerieGroup", "../models/common/signal/serieGroup", "../models/signalManagerDataModel/signalManagerCalculation", "./seriesHelper", "../models/common/calculatorProvider/calculators/fftCalculator", "../models/common/calculatorProvider/calculators/xyCalculator"], function (require, exports, ConvertHandler_1, ConvertTypes_1, signal_1, colorHelper_1, dateTimeHelper_1, point_1, DeconvertHandler_1, traceDataConversionError_1, ytSignal_1, xySignal_1, fftSignal_1, sample_1, frequencyAmplitude_1, point_2, seriesType_1, exportSerieGroup_1, serieGroup_1, signalManagerCalculation_1, seriesHelper_1, fftCalculator_1, xyCalculator_1) {
    "use strict";
    var ExportImportHelper_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExportImportHelper = void 0;
    let ExportImportHelper = ExportImportHelper_1 = class ExportImportHelper {
        /**
         * Creates an instance of ExportImportHelper
         * @param {ISeriesProvider} seriesProvider
         * @memberof ExportImportHelper
         */
        constructor(seriesProvider) {
            this._seriesProvider = seriesProvider;
        }
        /**
         * converts the data of a serieGroup to a csv string
         *
         * @param {Array<ExportSerieGroup>} elements
         * @returns {string}
         * @memberof ExportImportHelper
         */
        exportTraceData(elements) {
            let returnValue = undefined;
            try {
                let recordings = new Array();
                for (var i = 0; i < elements.length; i++) { // create a recording for each ExportSeriesGroup
                    try {
                        let recording = new Recording(elements[i], this._seriesProvider);
                        recordings.push(recording);
                    }
                    catch (e) {
                        console.error("Convert for " + elements[i].name + " not possible!");
                        console.error(e);
                    }
                }
                if (recordings.length > 0) { //convert recordings if there are any
                    let convertHandler = new ConvertHandler_1.ConvertHandler();
                    let partialFile = convertHandler.convert(recordings, ConvertTypes_1.ConvertTypes.CSV_AS_EN);
                    returnValue = partialFile.data;
                }
            }
            catch (e) {
                if (traceDataConversionError_1.TraceDataConversionError.isTraceDataConversionError(e)) {
                    console.error("ErrorType: " + e.name + " ErrorMessage: " + e.message);
                }
                else {
                    console.error("Convert not possible! Signals can not be exported!");
                }
                alert("Trace data can not be exported!");
            }
            return returnValue;
        }
        /**
         * Converts a csv string to a list of serie groups
         *
         * @param {string} data
         * @param {string} filename
         * @param {(Array<TraceDataPointInfo>|undefined)} [traceDataPointInfos=undefined] can be used for adding alias and description of a datapoint
         * @returns {ISerieGroup[]}
         * @memberof ExportImportHelper
         */
        importTraceData(data, filename, traceDataPointInfos = undefined) {
            // get recordings from data(csv)
            let recordings = ExportImportHelper_1.getRecordingsFromData(data, filename);
            if (recordings == undefined) {
                return [new serieGroup_1.SerieGroup("No data found!", '0', 0)];
            }
            // get serie groups from the recording datas
            return this.getSerieGroupsFromRecordings(recordings, traceDataPointInfos);
        }
        /**
         * Returns recording data from the given input data(csv)
         *
         * @private
         * @static
         * @param {string} data
         * @param {string} filename
         * @returns
         * @memberof ExportImportHelper
         */
        static getRecordingsFromData(data, filename) {
            let deconverter = new DeconvertHandler_1.DeconvertHandler();
            let recordings;
            try {
                recordings = deconverter.Deconvert({ data: data, fileending: this.getFileExtension(filename) });
            }
            catch (e) {
                if (traceDataConversionError_1.TraceDataConversionError.isTraceDataConversionError(e)) {
                    console.error("ErrorType: " + e.name + " ErrorMessage: " + e.message);
                }
                else {
                    console.error("Deconvert not possible! Signals can not be imported!");
                }
                alert("Trace data can not be imported from file!");
                return undefined;
            }
            return recordings;
        }
        /**
         * Returns a series group array with the informations from the given recordings
         *
         * @private
         * @param {Array<IRecording>} recordings
         * @param {(Array<TraceDataPointInfo>|undefined)} [traceDataPointInfos=undefined]
         * @returns
         * @memberof ExportImportHelper
         */
        getSerieGroupsFromRecordings(recordings, traceDataPointInfos = undefined) {
            let serieGroups = new Array();
            // Each recording will be displayed as a own signal group with its own start trigger time
            recordings.forEach(recording => {
                let timestamp = recording.startTriggerTime;
                let id = timestamp.toString();
                let serieGroup = new serieGroup_1.SerieGroup(dateTimeHelper_1.DateTimeHelper.getDateTime(timestamp), id, timestamp);
                let signals = recording.signals;
                for (let i = 0; i < signals.length; i++) {
                    if (signals[i] instanceof ytSignal_1.YTSignal) {
                        let newSerie = this.createYTSerieFromYTSignal(serieGroup, signals[i]);
                        if (traceDataPointInfos != undefined) {
                            // Add description and alias name for datapoint if found
                            let tracePointInfos = traceDataPointInfos.filter(element => element.fullname == signals[i].name);
                            if (tracePointInfos.length == 1) {
                                newSerie.name = tracePointInfos[0].componentName + ":" + tracePointInfos[0].name;
                                newSerie.description = traceDataPointInfos[0].description;
                            }
                        }
                        serieGroup.addSerie(newSerie);
                    }
                }
                signals.forEach(signal => {
                    if (signal instanceof xySignal_1.XYSignal || signal instanceof fftSignal_1.FFTSignal) {
                        this.createCalculatedSerieFromCalculatedSignal(serieGroup, signal);
                    }
                });
                serieGroups.push(serieGroup);
            });
            return serieGroups;
        }
        createYTSerieFromYTSignal(serieGroup, signal) {
            let signalData = new Array();
            for (let i = 0; i < signal.items.length; i++) {
                signalData.push(new point_1.Point(signal.items[i].t, signal.items[i].y));
            }
            let newSignal = new signal_1.Signal(signal.name, signalData);
            let settings = seriesHelper_1.SeriesHelper.createSerieSettings(newSignal, newSignal.name, colorHelper_1.ColorHelper.getColor(), this._seriesProvider.getUniqueId(), seriesType_1.SeriesType.timeSeries, undefined);
            let newSerie = this._seriesProvider.createSerie(settings);
            return newSerie;
        }
        createCalculatedSerieFromCalculatedSignal(serieGroup, signal) {
            let calculation = new signalManagerCalculation_1.SignalManagerCalculation(signal.name, this._seriesProvider);
            serieGroup.addSerieContainer(calculation, -1);
            if (signal instanceof xySignal_1.XYSignal) {
                calculation.setCalculatorTypeById(xyCalculator_1.XYCalculator.id);
                calculation.setInputValueById(xyCalculator_1.XYCalculator.inputIdXSignal, signal.xSource.name);
                calculation.setInputValueById(xyCalculator_1.XYCalculator.inputIdYSignal, signal.ySource.name);
                calculation.setOutputSignalName(signal.name);
            }
            if (signal instanceof fftSignal_1.FFTSignal) {
                calculation.setCalculatorTypeById(fftCalculator_1.FftCalculator.id);
                calculation.setInputValueById(fftCalculator_1.FftCalculator.inputIdSignal, signal.source.name);
                calculation.setOutputSignalName(signal.name);
            }
        }
        static getFileExtension(filename) {
            return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        }
    };
    ExportImportHelper = ExportImportHelper_1 = __decorate([
        mco.role()
    ], ExportImportHelper);
    exports.ExportImportHelper = ExportImportHelper;
    let Recording = class Recording {
        constructor(element, seriesProvider) {
            this.startTriggerTime = 0;
            this.signals = new Array();
            this._seriesProvider = seriesProvider;
            //Export a serieGroup
            if (element instanceof exportSerieGroup_1.ExportSerieGroup) {
                this.startTriggerTime = element.startTriggerTime;
                for (let i = 0; i < element.series.length; i++) {
                    if (element.series[i].type == seriesType_1.SeriesType.timeSeries) { //Export YTSeries
                        this.signals.push(this.createYTSignalFromSeries(element.series[i]));
                    }
                    if (element.series[i].type == seriesType_1.SeriesType.xySeries) { //Export XYSeries
                        this.signals.push(this.createXYSignalFromSeries(element.series[i]));
                    }
                    if (element.series[i].type == seriesType_1.SeriesType.fftSeries) { //Export FFTSeries
                        this.signals.push(this.createFFTSignalFromSeries(element.series[i]));
                    }
                }
            }
        }
        createYTSignalFromSeries(serie) {
            let samples = new Array();
            serie.rawPoints.forEach(point => {
                samples.push(new sample_1.Sample(point.x, point.y));
            });
            return new ytSignal_1.YTSignal(serie.name, samples);
        }
        createXYSignalFromSeries(serie) {
            let points = new Array();
            serie.rawPoints.forEach(point => {
                points.push(new point_2.Point(point.x, point.y));
            });
            let calculationDataInfo = serie.calculationDataInfo;
            let xSource = this.createYTSignalFromSeries(this._seriesProvider.get(calculationDataInfo.inputSeriesIds[0]));
            let ySource = this.createYTSignalFromSeries(this._seriesProvider.get(calculationDataInfo.inputSeriesIds[1]));
            return new xySignal_1.XYSignal(serie.name, points, xSource, ySource);
        }
        createFFTSignalFromSeries(serie) {
            let freqAmps = new Array();
            serie.rawPoints.forEach(point => {
                freqAmps.push(new frequencyAmplitude_1.FrequencyAmplitude(point.x, point.y));
            });
            let calculationDataInfo = serie.calculationDataInfo;
            let source = this.createYTSignalFromSeries(this._seriesProvider.get(calculationDataInfo.inputSeriesIds[0]));
            return new fftSignal_1.FFTSignal(serie.name, freqAmps, source);
        }
    };
    Recording = __decorate([
        mco.role()
    ], Recording);
});
