var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../libs/jszip/JSZip", "../framework/events"], function (require, exports, JSZip, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZipContainer = exports.EventDataUnzipped = exports.EventDataZipped = void 0;
    let EventDataZipped = class EventDataZipped extends events_1.TypedEvent {
    };
    EventDataZipped = __decorate([
        mco.role()
    ], EventDataZipped);
    exports.EventDataZipped = EventDataZipped;
    ;
    let EventDataUnzipped = class EventDataUnzipped extends events_1.TypedEvent {
    };
    EventDataUnzipped = __decorate([
        mco.role()
    ], EventDataUnzipped);
    exports.EventDataUnzipped = EventDataUnzipped;
    ;
    let ZipContainer = class ZipContainer {
        /**
         * Creates an instance of ZipContainer
         * @memberof ZipContainer
         */
        constructor() {
            /**
             * Data zipped event
             *
             * @memberof ZipContainer
             */
            this.eventDataZipped = new EventDataZipped();
            /**
             * Data unzipped event
             *
             * @memberof ZipContainer
             */
            this.eventDataUnzipped = new EventDataZipped();
            this._zipContainer = new JSZip();
        }
        /**
         * Adds a file to the zip container
         *
         * @param {string} filename
         * @param {Blob} data
         * @memberof ZipContainer
         */
        addFile(filename, data) {
            this._zipContainer.file(filename, data);
        }
        /**
         * Compresses the already added files in the container
         *
         * @memberof ZipContainer
         */
        zipData() {
            //zip.generateNodeStream({type:"blob", compression: "DEFLATE"})
            this._zipContainer.generateAsync({ type: "blob", compression: "DEFLATE" })
                .then(zippedData => {
                this.onDataZipped(zippedData);
            });
        }
        /**
         * Unzippes the data of the given file which is part of the compressed data
         *
         * @param {string} data
         * @param {string} filename
         * @memberof ZipContainer
         */
        unzipData(data, filename) {
            this._zipContainer.loadAsync(data).then(zip => {
                zip.file(filename).async("string").then(unzippedData => {
                    this.onDataUnzipped(unzippedData);
                });
            });
        }
        /**
         * Raises the data zipped event
         *
         * @private
         * @param {*} zippedData
         * @memberof ZipContainer
         */
        onDataZipped(zippedData) {
            this.eventDataZipped.raise(this, zippedData);
        }
        /**
         * Raises the data unzipped event
         *
         * @private
         * @param {*} unzippedData
         * @memberof ZipContainer
         */
        onDataUnzipped(unzippedData) {
            this.eventDataUnzipped.raise(this, unzippedData);
        }
    };
    ZipContainer = __decorate([
        mco.role()
    ], ZipContainer);
    exports.ZipContainer = ZipContainer;
});
