var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./ASCsvDeconverter", "../exceptions/traceDataConversionError", "../enums/traceDataConversionErrorTypes", "./ASCsvHeader", "./ytSignal", "./xySignal", "./fftSignal", "../../../core/types/frequencyAmplitude", "../../../core/types/point", "../../../core/types/sample"], function (require, exports, ASCsvDeconverter_1, traceDataConversionError_1, traceDataConversionErrorTypes_1, ASCsvHeader_1, ytSignal_1, xySignal_1, fftSignal_1, frequencyAmplitude_1, point_1, sample_1) {
    "use strict";
    var DeconverterASCsv_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DeconverterASCsv = void 0;
    /**
     * Runs deconvertion of an AS CSV string.
     * Adapter class.
     *
     * @class DeconverterASCsv
     * @implements {IDeconverter}
     */
    let DeconverterASCsv = DeconverterASCsv_1 = class DeconverterASCsv {
        /**
         * Starts a deconvertion of an AS CSV string into an array of IRecording.
         * Can throw TraceDataConverionError.
         *
         * @param {string} data
         * @returns {Array<IRecording>}
         * @memberof DeconverterASCsv
         */
        Deconvert(data) {
            let deconverter = new ASCsvDeconverter_1.ASCsvDeconverter();
            let asCsvSignals;
            try {
                asCsvSignals = deconverter.deconvert(data);
            }
            catch (err) {
                throw traceDataConversionError_1.TraceDataConversionError.isTraceDataConversionError(err) ? err : traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.INTERNAL, err);
            }
            let originalASCsvSignals = this.extractOriginalASCsvSignals(asCsvSignals);
            let calculatedASCsvSignals = this.extractCalculatedASCsvSignals(asCsvSignals);
            calculatedASCsvSignals = this.updateStartTriggerTimeCalculatedASCsvSignals(calculatedASCsvSignals, originalASCsvSignals);
            let recordings = this.createRecordings(originalASCsvSignals, calculatedASCsvSignals);
            return recordings;
        }
        /**
         * Changes the starttrigger time of a calculated AS CSV signal to the starttrigger time of its original signal.
         * If the starttriggertime of the original signals are not equal or the original signals are not found it will NOT update the start trigger time of the calculated signal.
         *
         * @private
         * @param {IASCsvSignal[]} calculatedASCsvSignals
         * @param {IASCsvSignal[]} originalASCsvSignals
         * @returns {IASCsvSignal[]}
         * @memberof DeconverterASCsv
         */
        updateStartTriggerTimeCalculatedASCsvSignals(calculatedASCsvSignals, originalASCsvSignals) {
            calculatedASCsvSignals.forEach(signal => {
                let starttriggers = new Array();
                let xyResult = DeconverterASCsv_1.xyFormulaRegExp.exec(signal.formula);
                if (xyResult != null) {
                    let signals = this.tryGetASCsvSignalsByTitle([xyResult[1], xyResult[2]], originalASCsvSignals);
                    starttriggers = this.getUniqueStarttriggers(signals);
                }
                let fftResult = DeconverterASCsv_1.fftFormulaRegExp.exec(signal.formula);
                if (fftResult != null) {
                    let signals = this.tryGetASCsvSignalsByTitle([fftResult[1]], originalASCsvSignals);
                    starttriggers = this.getUniqueStarttriggers(signals);
                }
                if (starttriggers.length === 1) {
                    signal.starttrigger = starttriggers[0];
                }
            });
            return calculatedASCsvSignals;
        }
        /**
         * Extracts AS CSV signals from an array based on the title.
         *
         * @private
         * @param {Array<string>} titles
         * @param {Array<IASCsvSignal>} originalASCsvSignals
         * @returns {Array<IASCsvSignal>}
         * @memberof DeconverterASCsv
         */
        tryGetASCsvSignalsByTitle(titles, originalASCsvSignals) {
            let names = new Array();
            titles.forEach(title => {
                names.push(ASCsvHeader_1.ASCsvHeader.tryRemoveStartTrigger(title));
            });
            let signals = new Array();
            originalASCsvSignals.forEach(signal => {
                if (names.includes(signal.title)) {
                    signals.push(signal);
                }
            });
            return signals;
        }
        /**
         * Creates Recordings based on the given original and calculated signals.
         *
         * @private
         * @param {Array<IASCsvSignal>} originalASCsvSignals
         * @param {Array<IASCsvSignal>} calculatedASCsvSignals
         * @returns {Array<IRecording>}
         * @memberof DeconverterASCsv
         */
        createRecordings(originalASCsvSignals, calculatedASCsvSignals) {
            let uniqueStarttriggers = this.getUniqueStarttriggers(originalASCsvSignals);
            let recordings = new Array();
            uniqueStarttriggers.forEach(starttrigger => {
                let asCsvSignals = this.getASCsvSignalsToStarttrigger(starttrigger, originalASCsvSignals, calculatedASCsvSignals);
                let signals = this.generateSignals(asCsvSignals);
                recordings.push({
                    startTriggerTime: starttrigger.getTime() * 1000.0,
                    signals: signals
                });
            });
            return recordings;
        }
        /**
         * Generates Signals according to its types.
         * The generated signals can be of type YTSignal, XYSignal and FFTSignal.
         *
         * @private
         * @param {IASCsvSignal[]} asCsvSignals
         * @returns {ISignal[]}
         * @memberof DeconverterASCsv
         */
        generateSignals(asCsvSignals) {
            let signals = new Array();
            asCsvSignals.forEach(signal => {
                if (ASCsvHeader_1.ASCsvHeader.isOriginalASCsvSignal(signal)) {
                    signals.push(this.generateYTSignal(signal));
                    return;
                }
                let xyResult = DeconverterASCsv_1.xyFormulaRegExp.exec(signal.formula);
                if (xyResult !== null) {
                    let sourcesASCsv = this.tryGetASCsvSignalsByTitle([xyResult[1], xyResult[2]], asCsvSignals);
                    let xSourceASCsv = sourcesASCsv.find(source => { return source.title === ASCsvHeader_1.ASCsvHeader.tryRemoveStartTrigger(xyResult[1]); });
                    let ySourceASCsv = sourcesASCsv.find(source => { return source.title === ASCsvHeader_1.ASCsvHeader.tryRemoveStartTrigger(xyResult[2]); });
                    if (xSourceASCsv !== undefined && ySourceASCsv !== undefined) {
                        signals.push(this.generateXYSignal(signal, xSourceASCsv, ySourceASCsv));
                    }
                    return;
                }
                let fftResult = DeconverterASCsv_1.fftFormulaRegExp.exec(signal.formula);
                if (fftResult !== null) {
                    let sourceASCsv = this.tryGetASCsvSignalsByTitle([fftResult[1]], asCsvSignals);
                    if (sourceASCsv.length === 1) {
                        signals.push(this.generateFFTSignal(signal, sourceASCsv[0]));
                    }
                }
            });
            return signals;
        }
        /**
         * Generates a FFTSignal from an AS CSV signal.
         *
         * @private
         * @param {IASCsvSignal} signal
         * @param {IASCsvSignal} sourceASCsv
         * @returns {FFTSignal}
         * @memberof DeconverterASCsv
         */
        generateFFTSignal(signal, sourceASCsv) {
            let freqAmps = this.valuePairsToFrequencyAmplitudes(signal.data);
            let source = this.generateYTSignal(sourceASCsv);
            let fftSignal = new fftSignal_1.FFTSignal(signal.title, freqAmps, source);
            return fftSignal;
        }
        /**
         * Converts an array of value pairs to an array of FrequencyAmplitude.
         *
         * @private
         * @param {Array<IValuePair<number, number>>} data
         * @returns {Array<FrequencyAmplitude>}
         * @memberof DeconverterASCsv
         */
        valuePairsToFrequencyAmplitudes(data) {
            let freqAmps = new Array();
            data.forEach(valuePair => {
                freqAmps.push(new frequencyAmplitude_1.FrequencyAmplitude(valuePair.value1, valuePair.value2));
            });
            return freqAmps;
        }
        /**
         * Generates a XYSignal from an AS CSV signal.
         *
         * @private
         * @param {IASCsvSignal} signal
         * @param {IASCsvSignal} xSourceASCsv
         * @param {IASCsvSignal} ySourceASCsv
         * @returns {XYSignal}
         * @memberof DeconverterASCsv
         */
        generateXYSignal(signal, xSourceASCsv, ySourceASCsv) {
            let points = this.valuePairsToPoints(signal.data);
            let xSource = this.generateYTSignal(xSourceASCsv);
            let ySource = this.generateYTSignal(ySourceASCsv);
            let xySignal = new xySignal_1.XYSignal(signal.title, points, xSource, ySource);
            return xySignal;
        }
        /**
         * Converts an array of value parirs to an array of Point
         *
         * @private
         * @param {Array<IValuePair<number, number>>} data
         * @returns {Array<Point>}
         * @memberof DeconverterASCsv
         */
        valuePairsToPoints(data) {
            let points = new Array();
            data.forEach(valuePair => {
                points.push(new point_1.Point(valuePair.value1, valuePair.value2));
            });
            return points;
        }
        /**
         * Generates a YTSignal from an AS CSV signal.
         *
         * @private
         * @param {IASCsvSignal} signal
         * @returns {YTSignal}
         * @memberof DeconverterASCsv
         */
        generateYTSignal(signal) {
            let samples = this.valuePairsToSamples(signal.data);
            let ytSignal = new ytSignal_1.YTSignal(signal.title, samples);
            return ytSignal;
        }
        /**
         * Converts an array of value pairs to an array of Sample.
         *
         * @private
         * @param {Array<IValuePair<number, number>>} data
         * @returns {Array<Sample>}
         * @memberof DeconverterASCsv
         */
        valuePairsToSamples(data) {
            let samples = new Array();
            data.forEach(valuePair => {
                samples.push(new sample_1.Sample(valuePair.value1, valuePair.value2));
            });
            return samples;
        }
        /**
         * Extracts AS CSV signals based on the starttrigger.
         *
         * @private
         * @param {Date} starttrigger
         * @param {Array<IASCsvSignal>} originalASCsvSignals
         * @param {Array<IASCsvSignal>} calculatedASCsvSignals
         * @returns {Array<IASCsvSignal>}
         * @memberof DeconverterASCsv
         */
        getASCsvSignalsToStarttrigger(starttrigger, originalASCsvSignals, calculatedASCsvSignals) {
            let asCsvSignals = new Array();
            originalASCsvSignals.forEach(signal => {
                if (starttrigger.getTime() === signal.starttrigger.getTime()) {
                    asCsvSignals.push(signal);
                }
            });
            calculatedASCsvSignals.forEach(signal => {
                if (starttrigger.getTime() === signal.starttrigger.getTime()) {
                    asCsvSignals.push(signal);
                }
            });
            return asCsvSignals;
        }
        /**
         * Generates an array of unique starttriggers from an array of AS CSV signals.
         *
         * @private
         * @param {Array<IASCsvSignal>} originalASCsvSignals
         * @returns {Array<Date>}
         * @memberof DeconverterASCsv
         */
        getUniqueStarttriggers(originalASCsvSignals) {
            let starttriggers = new Array();
            originalASCsvSignals.forEach(signal => {
                if (starttriggers.every(starttrigger => { return starttrigger.getTime() !== signal.starttrigger.getTime(); })) {
                    starttriggers.push(signal.starttrigger);
                }
            });
            return starttriggers;
        }
        /**
         * Extracts calculated signals from an array of AS CSV signals.
         *
         * @private
         * @param {Array<IASCsvSignal>} asCsvSignals
         * @returns {Array<IASCsvSignal>}
         * @memberof DeconverterASCsv
         */
        extractCalculatedASCsvSignals(asCsvSignals) {
            let calculatedASCsvSignals = new Array();
            asCsvSignals.forEach(signal => {
                if (!ASCsvHeader_1.ASCsvHeader.isOriginalASCsvSignal(signal)) {
                    calculatedASCsvSignals.push(signal);
                }
            });
            return calculatedASCsvSignals;
        }
        /**
         * Extracts original (not calculated) signals from an array of AS CSV signals.
         *
         * @private
         * @param {Array<IASCsvSignal>} asCsvSignals
         * @returns {Array<IASCsvSignal>}
         * @memberof DeconverterASCsv
         */
        extractOriginalASCsvSignals(asCsvSignals) {
            let originalASCsvSignals = new Array();
            asCsvSignals.forEach(signal => {
                if (ASCsvHeader_1.ASCsvHeader.isOriginalASCsvSignal(signal)) {
                    originalASCsvSignals.push(signal);
                }
            });
            return originalASCsvSignals;
        }
    };
    DeconverterASCsv.xyFormulaRegExp = /X={'(.+)'};Y={'(.+)'}/;
    DeconverterASCsv.fftFormulaRegExp = /Y={[Ff]{2}[Tt]\('(.+)'\)}/;
    DeconverterASCsv = DeconverterASCsv_1 = __decorate([
        mco.role()
    ], DeconverterASCsv);
    exports.DeconverterASCsv = DeconverterASCsv;
});
