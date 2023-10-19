var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../../communication/rest/opcUaRestServices"], function (require, exports, opcUaRestServices_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TracePoint = exports.TraceDataChannel = exports.TraceData = exports.MappCockpitTraceDataReader = void 0;
    const TRACE_READ_CHUNK_SIZE = 1000;
    ;
    let TraceDataChunk = class TraceDataChunk {
        constructor(traceData = undefined) {
            this._timeValues = [];
            this._dataValues = [];
            if (traceData) {
                this._timeValues = traceData.TimeValues;
                this._dataValues = traceData.DataValues;
            }
        }
        get TimeValues() {
            return this._timeValues;
        }
        set TimeValues(timeValues) {
            this._timeValues = timeValues;
        }
        get DataValues() {
            return this._dataValues;
        }
        set DataValues(dataValues) {
            this._dataValues = dataValues;
        }
    };
    TraceDataChunk = __decorate([
        mco.role()
    ], TraceDataChunk);
    /**
     * Implements the trace request header
     *
     * @class TraceReadRequestHader
     * @implements {TRACE_READ_REQUEST_HEADER}
     */
    let TraceReadRequestHeader = class TraceReadRequestHeader {
        constructor(dataPointName, aboveTimeStamp = 0, maxReadCount = TRACE_READ_CHUNK_SIZE) {
            this._dataPointName = dataPointName;
            this._aboveTimeStamp = aboveTimeStamp;
            this._maxReadCount = maxReadCount;
        }
        get DataPointName() {
            return this._dataPointName;
        }
        get MaxReadCount() {
            return this._maxReadCount;
        }
        get AboveTimestamp() {
            return this._aboveTimeStamp;
        }
        set AboveTimestamp(aboveTimeStamp) {
            this._aboveTimeStamp = aboveTimeStamp;
        }
    };
    TraceReadRequestHeader = __decorate([
        mco.role()
    ], TraceReadRequestHeader);
    ;
    /**
     * Implements trace access services
     *
     * @class MappCockpitTraceDataReader
     */
    let MappCockpitTraceDataReader = class MappCockpitTraceDataReader {
        constructor(diagnosticProvider) {
            this._diagnosticProvider = diagnosticProvider;
            this._traceData = new TraceData();
        }
        /**
         * Specifies the trace reader node id
         *
         * @readonly
         * @private
         * @type {string}
         * @memberof MappCockpitTraceDataReader
         */
        get traceDataProviderId() {
            return this._diagnosticProvider.namespace + ";" + opcUaRestServices_1.OpcUaRestServices.mappCockpitTraceDataProviderId;
        }
        /**
         * Specifies the trace data read method id
         *
         * @readonly
         * @private
         * @type {string}
         * @memberof MappCockpitTraceDataReader
         */
        get traceDataReadMethodId() {
            return this._diagnosticProvider.namespace + ";" + opcUaRestServices_1.OpcUaRestServices.mappCockpitTraceReadDataMethodId;
        }
        /**
         * Returns available trace data
         *
         * @readonly
         * @type {TraceData}
         * @memberof MappCockpitTraceDataReader
         */
        get traceData() {
            return this._traceData;
        }
        /**
         * Reads/downloads trace data from the target
         *
         * @param {MappCockpitComponentDataModel} mappCockpitComponentDataModel
         * @returns {Promise<TraceData>}
         * @memberof MappCockpitTraceDataReader
         */
        requestLoadTraceDataFromTarget() {
            return __awaiter(this, void 0, void 0, function* () {
                // clear existing treca data
                this._traceData.clear();
                try {
                    // get available trace points
                    var traceDataPoints = yield this.requestReadTraceDataPointsFromTarget();
                    // read and update the trigger time
                    this._traceData.triggerTime = yield this.requestReadTraceTriggerTimeFromTarget();
                    // read trace data in order of the trace data point list
                    for (let i = 0; i < traceDataPoints.length; i++) {
                        const tracePointName = traceDataPoints[i];
                        yield this.readTraceChannelData(tracePointName);
                    }
                }
                catch (error) {
                    console.error(error);
                }
                return this._traceData;
            });
        }
        /**
         * Reads the trace data for the specified data point
         *
         * @private
         * @param {string} dataPointName
         * @memberof MappCockpitTraceDataReader
         */
        readTraceChannelData(dataPointName) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let traceReadRequestInfo = new TraceReadRequestHeader(dataPointName);
                    // read the trace data for the specified trace point
                    let traceChannelData = new TraceDataChunk();
                    // read trace data
                    yield this.readTraceDataChunk(traceReadRequestInfo, traceChannelData);
                    // if data available add it to the trace data                
                    if (traceChannelData) {
                        // Add the trace channel data to the trace data
                        this.addTraceChannel(traceReadRequestInfo.DataPointName, traceChannelData);
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
        /**
         * Reads a trace data chunk.
         *
         * @private
         * @param {{ DataPointName: string; MaxReadCount: number; AboveTimestamp: number; }} readTraceDataRequestInfo
         * @param {Rest.InterfaceTraceData} traceChannelData
         * @returns
         * @memberof MappCockpitTraceDataReader
         */
        readTraceDataChunk(readTraceDataRequestInfo, traceChannelData) {
            return __awaiter(this, void 0, void 0, function* () {
                let traceChannelDataChunk = new TraceDataChunk();
                try {
                    do {
                        // create new request header
                        let traceReadRequestHeader = { DataPointName: readTraceDataRequestInfo.DataPointName, AboveTimestamp: readTraceDataRequestInfo.AboveTimestamp, MaxReadCount: readTraceDataRequestInfo.MaxReadCount };
                        // read a trace data chunk
                        traceChannelDataChunk = new TraceDataChunk((yield opcUaRestServices_1.OpcUaRestServices.executeMethod(this._diagnosticProvider.sessionId, this.traceDataProviderId, this.traceDataReadMethodId, traceReadRequestHeader)).args);
                        // if the trace data chunk is valid, we append it to the channel data
                        if (traceChannelDataChunk && traceChannelDataChunk.TimeValues.length > 0) {
                            this.appendTraceDataChunk(traceChannelData, traceChannelDataChunk);
                        }
                        // adjust the the time stamp to the next chunk based on the last time point of the current chunk.
                        readTraceDataRequestInfo.AboveTimestamp = traceChannelDataChunk.TimeValues[traceChannelDataChunk.TimeValues.length - 1];
                        // continue until chunks available
                    } while (this.nextTraceDataChunkAvailable(traceChannelDataChunk, readTraceDataRequestInfo.MaxReadCount));
                }
                catch (error) {
                    console.error(error);
                }
                return traceChannelDataChunk;
            });
        }
        /**
         * Checks if more trace data is possibly available
         *
         * @private
         * @param {Rest.InterfaceTraceData} traceChannelData
         * @param {number} chunkSize
         * @returns
         * @memberof MappCockpitTraceDataReader
         */
        nextTraceDataChunkAvailable(traceChannelData, chunkSize) {
            return traceChannelData && traceChannelData.TimeValues.length === chunkSize;
        }
        /**
         * Appends a trace data block to the existing trace data channel
         *
         * @private
         * @param {Rest.InterfaceTraceData} traceChannelData
         * @param {Rest.InterfaceTraceData} nextTraceChannelDataBlock
         * @memberof MappCockpitTraceDataReader
         */
        appendTraceDataChunk(traceChannelData, nextTraceChannelDataBlock) {
            nextTraceChannelDataBlock.DataValues.forEach((traceValue) => { traceChannelData.DataValues.push(traceValue); });
            nextTraceChannelDataBlock.TimeValues.forEach((traceTimeStamp) => { traceChannelData.TimeValues.push(traceTimeStamp); });
        }
        /**
         * Creates initializes and adds a new trace channel to the trace data
         *
         * @private
         * @param {string} tracePointName
         * @param {Rest.InterfaceTraceData} traceData
         * @memberof MappCockpitTraceDataReader
         */
        addTraceChannel(tracePointName, traceData) {
            var tracePoints = new Array();
            for (let i = 0; i < traceData.DataValues.length; i++) {
                const dataValue = traceData.DataValues[i];
                const timestamp = traceData.TimeValues[i];
                tracePoints.push(new TracePoint(dataValue, timestamp));
            }
            this._traceData.addTraceChannel(tracePointName, tracePoints);
        }
        /**
         * Reads available trace data points.
         *
         * @returns {Promise<Array<string>>}
         * @memberof MappCockpitTraceDataReader
         */
        requestReadTraceDataPointsFromTarget() {
            return __awaiter(this, void 0, void 0, function* () {
                var traceDataPointBaseName = this._diagnosticProvider.namespace + ";" + opcUaRestServices_1.OpcUaRestServices.mappCockpitTraceDataPointNameId;
                var traceDataPointNames = new Array();
                let readDataPointNameRequests = [];
                for (let i = 1; i <= opcUaRestServices_1.OpcUaRestServices.mappCockpitTraceDataPointCount; i++) {
                    readDataPointNameRequests.push(opcUaRestServices_1.OpcUaRestServices.readNodeAttribute(this._diagnosticProvider.sessionId, traceDataPointBaseName + i));
                }
                try {
                    let availableTracePointNames = yield Promise.all(readDataPointNameRequests);
                    // filter valid trace point names
                    traceDataPointNames = availableTracePointNames.filter((tracePointName) => { return tracePointName; });
                }
                catch (error) {
                }
                return traceDataPointNames;
            });
        }
        /**
         * Reads the trace trigger time
         *
         * @private
         * @returns {Promise<Array<any>>}
         * @memberof MappCockpitTraceDataReader
         */
        requestReadTraceTriggerTimeFromTarget() {
            return __awaiter(this, void 0, void 0, function* () {
                var traceTriggerTimeId = this._diagnosticProvider.namespace + ";" + opcUaRestServices_1.OpcUaRestServices.mappCockpitTraceTriggerTime;
                let triggerTime = yield opcUaRestServices_1.OpcUaRestServices.readNodeAttribute(this._diagnosticProvider.sessionId, traceTriggerTimeId);
                return triggerTime;
            });
        }
    };
    MappCockpitTraceDataReader = __decorate([
        mco.role()
    ], MappCockpitTraceDataReader);
    exports.MappCockpitTraceDataReader = MappCockpitTraceDataReader;
    /**
     * Implements a single trace point
     *
     * @class TracePoint
     */
    let TracePoint = class TracePoint {
        constructor(dataValue, timeValue) {
            this.dataValue = dataValue;
            this.timeStamp = timeValue;
        }
    };
    TracePoint = __decorate([
        mco.role()
    ], TracePoint);
    exports.TracePoint = TracePoint;
    /**
     * Implements a trace data channel
     *
     * @class TraceDataChannel
     */
    let TraceDataChannel = class TraceDataChannel {
        /**
         * The name of the trace channel
         *
         * @readonly
         * @type {string}
         * @memberof TraceDataChannel
         */
        get name() {
            return this._name;
        }
        /**
         * The trace points of the trace channel
         *
         * @readonly
         * @type {Array<TracePoint>}
         * @memberof TraceDataChannel
         */
        get tracePoints() {
            return this._tracePoints;
        }
        constructor(name, tracePoints) {
            this._name = name;
            this._tracePoints = tracePoints;
        }
    };
    TraceDataChannel = __decorate([
        mco.role()
    ], TraceDataChannel);
    exports.TraceDataChannel = TraceDataChannel;
    /**
     * Implements a class for downloading and providing trace data
     *
     * @class TraceData
     */
    let TraceData = class TraceData {
        constructor() {
            // Holds trace data channels
            this._traceChannels = [];
            this._triggerTime = 0;
            this._traceChannels = [];
        }
        addTraceChannel(tracePointName, tracePoints) {
            var newTraceChannel = new TraceDataChannel(tracePointName, tracePoints);
            this._traceChannels.push(newTraceChannel);
        }
        /**
         * Returns the trace channels
         *
         * @readonly
         * @type {Array<TraceDataChannel>}
         * @memberof TraceData
         */
        get traceChannels() {
            return this._traceChannels;
        }
        set triggerTime(value) {
            this._triggerTime = value;
        }
        get triggerTime() {
            return this._triggerTime;
        }
        /**
         * Clears existing trace data
         *
         * @returns {*}
         * @memberof TraceData
         */
        clear() {
            this._traceChannels = [];
        }
    };
    TraceData = __decorate([
        mco.role()
    ], TraceData);
    exports.TraceData = TraceData;
});
