var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../framework/events"], function (require, exports, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FileProvider = void 0;
    let EventUploadDataFinished = class EventUploadDataFinished extends events_1.TypedEvent {
    };
    EventUploadDataFinished = __decorate([
        mco.role()
    ], EventUploadDataFinished);
    ;
    let FileProvider = class FileProvider {
        /**
         * Creates an instance of FileProvider.
         * @param {string} elementID the elementID must be unique! added for better testability
         * @param {boolean} [readBinary=false]
         * @memberof FileProvider
         */
        constructor(elementID, readBinary = false) {
            // The event need to be attached correctly to make it testable
            this.eventUploadDataFinished = new EventUploadDataFinished();
            this._fileInputElement = document.createElement('input');
            this._fileInputElement.id = elementID;
            document.body.appendChild(this._fileInputElement);
            this._fileInputElement.type = 'file';
            this._fileInputElement.onchange = e => {
                // let file = (<any>e!.target!).files[0]; 
                let files = e.target.files;
                let contents = new Map();
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    // initialize the file reader 
                    var reader = new FileReader();
                    // catch the reading finish event
                    reader.onload = readerEvent => {
                        var content = readerEvent.target.result; // the content of the file
                        contents.set(file.name, content);
                        if (i === files.length - 1) {
                            this.onUploadDataFinished(contents);
                            this._fileInputElement.value = "";
                        }
                    };
                    if (readBinary == true) {
                        reader.readAsBinaryString(file);
                    }
                    else {
                        reader.readAsText(file, 'UTF-8');
                    }
                }
                ;
            };
        }
        /**
         * Returns true if the file exists on the server(404 will be shown in console if not found)
         *
         * @static
         * @param {*} urlToFile
         * @returns
         * @memberof FileProvider
         */
        static doesFileExistOnServer(urlToFile) {
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', urlToFile, false);
            xhr.send();
            if (xhr.status == 404) {
                return false;
            }
            else {
                return true;
            }
        }
        /**
         * downloads data from visualization to the local pc
         *
         * @static
         * @param {string} defaultFileName e.g. "TraceData.csv"
         * @param {Blob} data data that should be written into the file
         * @memberof FileProvider
         */
        static downloadData(defaultFileName, data) {
            var downloadLink = document.createElement("a");
            var url = URL.createObjectURL(data);
            downloadLink.href = url;
            downloadLink.download = defaultFileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
        /**
         * Opens the file dialog for file selection to upload data to visualization
         * after selecting and applying a file the eventUploadDataFinished event will be raised
         *
         * @param {string} fileExtensions e.g. ".csv"
         * @param {boolean} [allowMultipleFileSelection=false] flag to enable multiselection
         * @memberof FileProvider
         */
        uploadData(fileExtensions, allowMultipleFileSelection = false) {
            this._fileInputElement.accept = fileExtensions;
            this._fileInputElement.multiple = allowMultipleFileSelection;
            this._fileInputElement.click();
        }
        onUploadDataFinished(data) {
            this.eventUploadDataFinished.raise(this._fileInputElement, data);
        }
    };
    FileProvider.BrFileExt = ".br";
    FileProvider.DriveLogExportFileExt = ".dle";
    FileProvider.BinFileExt = ".bin";
    FileProvider = __decorate([
        mco.role()
    ], FileProvider);
    exports.FileProvider = FileProvider;
});
