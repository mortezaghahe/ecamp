var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../enums/ConvertTypes", "./converterASCsv", "../enums/traceDataConversionErrorTypes", "../exceptions/traceDataConversionError"], function (require, exports, ConvertTypes_1, converterASCsv_1, traceDataConversionErrorTypes_1, traceDataConversionError_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConvertHandler = void 0;
    /**
     * Handles the convertion of an array of IRecording.
     *
     * @class ConvertHandler
     * @implements {IConvertHandler}
     */
    let ConvertHandler = class ConvertHandler {
        /**
         *  Handles convertion of an array of f IRecording.
         *  Data gets converted with chosen type of convertion.
         *  Can throw TraceDataConversionError.
         *
         * @param {IRecording[]} data
         * @param {ConvertTypes} type
         * @returns {IPartialFile}
         * @memberof ConvertHandler
         */
        convert(data, type) {
            let converter;
            switch (type) {
                case ConvertTypes_1.ConvertTypes.CSV_AS_DE:
                //convert to type CSV_AS_DE
                case ConvertTypes_1.ConvertTypes.CSV_AS_EN:
                    //convert to type CSV_AS_EN
                    converter = new converterASCsv_1.ConverterASCsv();
                    break;
                default:
                    throw traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.WRONG_FORMAT);
            }
            try {
                return converter.Convert(data, type);
            }
            catch (err) {
                throw traceDataConversionError_1.TraceDataConversionError.isTraceDataConversionError(err) ? err : traceDataConversionError_1.TraceDataConversionError.build(traceDataConversionErrorTypes_1.TraceDataConversionErrorTypes.INTERNAL, err);
            }
        }
    };
    ConvertHandler = __decorate([
        mco.role()
    ], ConvertHandler);
    exports.ConvertHandler = ConvertHandler;
});
