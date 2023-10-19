var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./ytSignal", "./xySignal", "./fftSignal", "../exceptions/traceDataConversionError", "../enums/traceDataConversionErrorTypes", "./ASCsvConverter", "./ASCsvSignalObj", "./ASCsvHeader"], function (require, exports, ytSignal_1, xySignal_1, fftSignal_1, traceDataConversionError_1, traceDataConversionErrorTypes_1, ASCsvConverter_1, ASCsvSignalObj_1, ASCsvHeader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConverterASCsv = void 0;
    /**
     * Runs convertion to an AS CSV string.
     * Adapter class.
     *
     * @class ConverterASCsv
     * @implements {IConverter}
     */
    let ConverterASCsv = class ConverterASCsv {
        /**
         * Starts convertion of an array of IRecording to a partial file containing an AS CSV string of given format as data and 'csv' as fileending.
         * Can throw TraceDataConversionError.
         *
         * @param {Array<IRecording>} data
         * @param {ConvertTypes} format
         * @returns {IPartialFile}
         * @memberof ConverterASCsv
         */
        Convert(data, format) {
            let asCsvSignalArr = new Array();
            //merge recordings with same starttrigger to remove redundant signals
            let mergedRecordings = this.mergeRecordingsOfSameStarttrigger(data);
            mergedRecordings.forEach(recording => {
                recording.signals.forEach(signal => {
                    let asCsvSignal = this.handleSignal(signal, new Date(recording.startTriggerTime / 1000.0));
                    asCsvSignalArr.push(asCsvSignal);
                });
            });
            let converterInstance = new ASCsvConverter_1.ASCsvConverter();
            let partialFile;
            try {
                partialFile = converterInstance.convert(asCsvSignalArr, format);
            }
            catch (err) {
                throw traceDataConversionError_1.TraceDataConversionError.isTraceDataConversionError(err) ? err : traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.INTERNAL, err);
            }
            return partialFile;
        }
        /**
         * Merges IRecordings with same start triggers.
         * When merging two recordings with same starttrigger, duplicates of signals (identified by name) are removed.
         *
         * @param {IRecording[]} data
         * @returns {Array<IRecording>}
         * @memberof ConverterASCsv
         */
        mergeRecordingsOfSameStarttrigger(data) {
            let filteredRecordings = new Array();
            let reduceTimePrecisionConstant = 1000000;
            for (let recording of data) {
                //find index of recording with same startrigger (start trigger time is compared on floored seconds resulution)
                let index = filteredRecordings.findIndex((elem) => { return (elem.startTriggerTime - (elem.startTriggerTime % reduceTimePrecisionConstant)) === (recording.startTriggerTime - (recording.startTriggerTime % reduceTimePrecisionConstant)); });
                if (index === -1) { // no recording with same starttrigger found => no merging needed
                    filteredRecordings.push(recording);
                }
                else { // recording with same starttrigger found => merge recording (remove possible duplicate signals)
                    for (let signal of recording.signals) {
                        if (filteredRecordings[index].signals.every((elem) => { return elem.name !== signal.name; })) { //if signals with same name do not exist in merged recording
                            filteredRecordings[index].signals.push(signal);
                        }
                    }
                }
            }
            return filteredRecordings;
        }
        /**
         * Handles the generation of an AS CSV signal from an YTSignal, XYSignal or FFTSignal.
         *
         * @private
         * @param {ISignal} signal
         * @param {Date} starttrigger
         * @returns {IASCsvSignal}
         * @memberof ConverterASCsv
         */
        handleSignal(signal, starttrigger) {
            let asCsvSignal;
            if (signal instanceof ytSignal_1.YTSignal) {
                asCsvSignal = this.buildASCsvSignalFromYTSignal(signal, starttrigger);
            }
            else if (signal instanceof xySignal_1.XYSignal) {
                asCsvSignal = this.buildASCsvSignalFromXYSignal(signal, starttrigger);
            }
            else if (signal instanceof fftSignal_1.FFTSignal) {
                asCsvSignal = this.buildASCsvSignalFromFFTSignal(signal, starttrigger);
            }
            else {
                throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.UNKNOWN_FORMAT);
            }
            return asCsvSignal;
        }
        /**
         * Builds an AS CSV signal from a YTSignal.
         *
         * @private
         * @param {YTSignal} signal
         * @param {Date} starttrigger
         * @returns {IASCsvSignal}
         * @memberof ConverterASCsv
         */
        buildASCsvSignalFromYTSignal(signal, starttrigger) {
            let asCsvSignal = new ASCsvSignalObj_1.ASCsvSignalObj(signal.name, starttrigger, signal.items.length, signal.items, undefined, undefined, undefined);
            return asCsvSignal;
        }
        /**
         * Builds an AS CSV signal from a XYSignal.
         *
         * @private
         * @param {XYSignal} signal
         * @param {Date} starttrigger
         * @returns {IASCsvSignal}
         * @memberof ConverterASCsv
         */
        buildASCsvSignalFromXYSignal(signal, starttrigger) {
            let xSignalName = ASCsvHeader_1.ASCsvHeader.buildTitleAttributeString(signal.xSource.name, starttrigger);
            let ySignalName = ASCsvHeader_1.ASCsvHeader.buildTitleAttributeString(signal.ySource.name, starttrigger);
            let formula = "X={'" + xSignalName + "'};Y={'" + ySignalName + "'}";
            let asCsvSignal = new ASCsvSignalObj_1.ASCsvSignalObj(signal.name, starttrigger, signal.items.length, signal.items, undefined, undefined, formula);
            return asCsvSignal;
        }
        /**
         * Builds an AS CSV signal from a FFTSignal.
         *
         * @private
         * @param {FFTSignal} signal
         * @param {Date} starttrigger
         * @returns {IASCsvSignal}
         * @memberof ConverterASCsv
         */
        buildASCsvSignalFromFFTSignal(signal, starttrigger) {
            let signalName = ASCsvHeader_1.ASCsvHeader.buildTitleAttributeString(signal.source.name, starttrigger);
            let formula = "Y={FFT('" + signalName + "')}";
            let asCsvSignal = new ASCsvSignalObj_1.ASCsvSignalObj(signal.name, starttrigger, signal.items.length, signal.items, undefined, undefined, formula);
            return asCsvSignal;
        }
    };
    ConverterASCsv = __decorate([
        mco.role()
    ], ConverterASCsv);
    exports.ConverterASCsv = ConverterASCsv;
});
