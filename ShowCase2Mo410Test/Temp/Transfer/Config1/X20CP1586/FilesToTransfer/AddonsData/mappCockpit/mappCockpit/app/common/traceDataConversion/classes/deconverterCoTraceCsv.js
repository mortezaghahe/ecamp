var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./CoTraceCsvDeconverter", "../exceptions/traceDataConversionError", "../enums/traceDataConversionErrorTypes", "./ytSignal", "../../../core/types/sample"], function (require, exports, CoTraceCsvDeconverter_1, traceDataConversionError_1, traceDataConversionErrorTypes_1, ytSignal_1, sample_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DeconverterCoTraceCsv = void 0;
    /**
     * Runs deconvertion of a CoTrace CSV string.
     * Adapter class.
     *
     * @class DeconverterCoTraceCsv
     * @implements {IDeconverter}
     */
    let DeconverterCoTraceCsv = class DeconverterCoTraceCsv {
        /**
         * Starts a deconvertion of a CoTrace CSV string into an array of IRecording
         * Can throw TraceDataConversionError.
         *
         * @param {string} data
         * @returns {IRecording[]}
         * @memberof DeconverterCoTraceCsv
         */
        Deconvert(data) {
            let deconverter = new CoTraceCsvDeconverter_1.CoTraceCsvDeconverter();
            //run deconvertion
            let result;
            try {
                result = deconverter.deconvert(data);
            }
            catch (err) {
                throw traceDataConversionError_1.TraceDataConversionError.isTraceDataConversionError(err) ? err : traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.INTERNAL, err);
            }
            //convert ICoTraceSignal to ISignal and store them in an array
            let signalArray = new Array();
            for (let i = 0; i < result.signals.length; i++) {
                signalArray.push(new ytSignal_1.YTSignal(result.signals[i].name, this.extractSamples(result.signals[i].samples)));
            }
            //build IRecording
            let recording = {
                startTriggerTime: result.starttrigger.getTime() * 1000.0,
                signals: signalArray
            };
            //add IRecording to an array as interface requires an array as return value
            let recordingArray = new Array();
            recordingArray.push(recording);
            return recordingArray;
        }
        /**
         * Builds explicit instances of class Sample from ISample interface.
         *
         * @private
         * @param {Array<ISample>} coTraceSamples
         * @returns {Array<Sample>}
         * @memberof DeconverterCoTraceCsv
         */
        extractSamples(coTraceSamples) {
            let samples = new Array();
            coTraceSamples.forEach(sample => {
                samples.push(new sample_1.Sample(sample.t, sample.y));
            });
            return samples;
        }
    };
    DeconverterCoTraceCsv = __decorate([
        mco.role()
    ], DeconverterCoTraceCsv);
    exports.DeconverterCoTraceCsv = DeconverterCoTraceCsv;
});
