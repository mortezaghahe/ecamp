var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var WatchableValueTrendBuffer_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WatchableValueTrendBuffer = void 0;
    /**
     * Implements a buffer for storing short value trends
     *
     * @class WatchableValueTrendBuffer
     * @template T_VALUE
     */
    let WatchableValueTrendBuffer = WatchableValueTrendBuffer_1 = class WatchableValueTrendBuffer {
        /**
         *Creates an instance of WatchableValueTrendBuffer.
         * @param {number} bufferSize
         * @memberof WatchableValueTrendBuffer
         */
        constructor(bufferSize) {
            // holds the trend values
            this._values = [];
            // specifies the buffer size
            this._bufferSize = 0;
            this._bufferSize = bufferSize;
            this._values = new Array();
            this.clearTrendBuffer();
        }
        /**
         * Clears the trend buffer
         *
         * @private
         * @memberof WatchableValueTrendBuffer
         */
        clearTrendBuffer() {
            // ad points for marking the minimal y range (0-1)
            this._values.push(0);
            this._values.push(1);
        }
        /**
         * Creates a new trend buffer
         *
         * @static
         * @template T_VALUE
         * @param {number} length
         * @returns {WatchableValueTrendBuffer<T_VALUE>}
         * @memberof WatchableValueTrendBuffer
         */
        static create(length) {
            return new WatchableValueTrendBuffer_1(length);
        }
        /**
         * Adds a new value to the buffer end. The maximal value count is limited to the buffer size
         *
         * @param {T_VALUE} newValue
         * @memberof WatchableValueTrendBuffer
         */
        push(newValue) {
            // if the buffer is full ...
            if (this._values.length >= this._bufferSize) {
                // ... we remove the oldest value ....
                // the oldest value is on index 2 becaue 0 and 1 hold the minimal range values ( 0 and 1).
                // remove the oldest value
                this._values.splice(2, 1);
            }
            // ... and add the new one
            this._values.push(newValue);
        }
        /**
         * Gets the buffers current values
         *
         * @readonly
         * @type {T_VALUE[]}
         * @memberof WatchableValueTrendBuffer
         */
        get values() {
            return this._values;
        }
    };
    WatchableValueTrendBuffer = WatchableValueTrendBuffer_1 = __decorate([
        mco.role()
    ], WatchableValueTrendBuffer);
    exports.WatchableValueTrendBuffer = WatchableValueTrendBuffer;
});
