var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FileReader = void 0;
    /**
     * The class reads a binary file.
     *
     * @export
     * @class FileReader
     */
    class FileReader {
        /**
         * Reads the content of a file and returns an ArrayBuffer
         *
         * @static
         * @param {string} fileName
         * @returns {Promise<ArrayBuffer>}
         * @memberof BinFileReader
         */
        static readBinary(fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.readFormat(fileName, "arraybuffer");
            });
        }
        /**
         * Reads the content of a file and returns a string
         *
         * @static
         * @param {string} fileName
         * @returns {Promise<string>}
         * @memberof FileReader
         */
        static readText(fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.readFormat(fileName, "text");
            });
        }
        /**
         * Reads the content of a file and returns a JSON object
         *
         * @static
         * @param {string} fileName
         * @returns {Promise<string>}
         * @memberof FileReader
         */
        static readJSON(fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.readFormat(fileName, "json");
            });
        }
        /**
        * Reads the content of a file and returns the specified format/responsetype
         *
         * @private
         * @static
         * @param {string} fileName
         * @param {XMLHttpRequestResponseType} [responseType=""]
         * @returns {Promise<any>}
         * @memberof FileReader
         */
        static readFormat(fileName, responseType = "") {
            return __awaiter(this, void 0, void 0, function* () {
                const xhrPromise = new Promise((resolve, reject) => {
                    try {
                        // prepare the xhr request 
                        var xhr = new XMLHttpRequest();
                        xhr.responseType = responseType;
                        xhr.open("GET", fileName, true);
                        // handle the xhr response
                        xhr.onload = function (xhrEvent) {
                            // because we did request 'arraybuffer' as response type we can return the xhr response data as promise result directly.
                            resolve(xhr.response);
                        };
                        // initiate xhr request
                        xhr.send(null);
                    }
                    catch (error) {
                        // recect becaus of an xhr error
                        reject("FileReader: could not read file: " + fileName);
                    }
                });
                return xhrPromise;
            });
        }
    }
    exports.FileReader = FileReader;
});
