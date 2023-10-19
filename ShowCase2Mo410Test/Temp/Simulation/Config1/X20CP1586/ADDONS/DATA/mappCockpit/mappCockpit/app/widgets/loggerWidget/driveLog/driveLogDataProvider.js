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
define(["require", "exports", "../../../models/online/mappCockpitComponent", "../../../common/fileProvider", "../interfaces/loggerDataProviderInterface", "./driveLogDataModel", "../../../common/nwctProvider/nwctProvider", "../dataLoadingProgressArgs", "../../../common/nwctProvider/nwctMetaDataProvider", "../../../common/nwctProvider/nwctDynamicMetaData", "../../../common/nwctProvider/nwctStaticMetaData", "../../../common/nwctProvider/brModuleParser", "../../../common/zipContainer", "../../common/alertDialog", "../../../common/utilities/utilities"], function (require, exports, mappCockpitComponent_1, fileProvider_1, loggerDataProviderInterface_1, driveLogDataModel_1, nwctProvider_1, dataLoadingProgressArgs_1, nwctMetaDataProvider_1, nwctDynamicMetaData_1, nwctStaticMetaData_1, brModuleParser_1, zipContainer_1, alertDialog_1, utilities_1) {
    "use strict";
    var DriveLogDataProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DriveLogDataProvider = void 0;
    /**
     * Implements some functionality to export/import or upload some network command trace data
     *
     * @export
     * @class DriveLogDataProvider
     */
    let DriveLogDataProvider = DriveLogDataProvider_1 = class DriveLogDataProvider {
        /**
         * Is there some data available to export something
         *
         * @returns {boolean}
         * @memberof DriveLogDataProvider
         */
        isExportPossible() {
            return true;
        }
        /**
         * Creates an instance of DriveLogDataProvider
         * @memberof DriveLogDataProvider
         */
        constructor() {
            /**
             * Event handler for the file provider when loading data from file is finished
             *
             * @private
             * @memberof DriveLogDataProvider
             */
            this._uploadDataFinishedHandler = (sender, args) => this.onUploadDataFinished(sender, args);
            /**
             * Event handler for namespaces for textsystem loading finished
             *
             * @private
             * @memberof DriveLogDataProvider
             */
            this._namespacesLoadedHandler = (sender, args) => this.onNamespacesLoaded(sender, args);
            /**
             * Event handler for data zipped
             *
             * @private
             * @memberof DriveLogDataProvider
             */
            this._dataZippedHandler = (sender, zippedData) => this.onDataZippedHandler(sender, zippedData);
            /**
             * Event handler for data unzipped
             *
             * @private
             * @memberof DriveLogDataProvider
             */
            this._dataUnzippedHandler = (sender, unzippedData) => this.onDataUnzippedHandler(sender, unzippedData);
            /**
             * Event to inform when some data is available(e.g. loading from file or from target)
             *
             * @memberof DriveLogDataProvider
             */
            this.eventDataAvailable = new loggerDataProviderInterface_1.EventDataAvailable();
            /**
             * Event to inform how many data is already loaded(e.g. 0%, 10%, ...., 100%);
             *
             * @memberof DriveLogDataProvider
             */
            this.eventDataLoadingProgressChanged = new loggerDataProviderInterface_1.EventDataLoadingProgress();
            this._fileProvider = new fileProvider_1.FileProvider("FileProviderDriveLogDataProvider", true);
            this._fileProvider.eventUploadDataFinished.attach(this._uploadDataFinishedHandler);
        }
        /**
         * Dispose the DriveLogDataProvider instance
         *
         * @memberof DriveLogDataProvider
         */
        dispose() {
            this._fileProvider.eventUploadDataFinished.detach(this._uploadDataFinishedHandler);
        }
        setComponentMethods(componentMethods) {
            this.onDriveLogComponentMethodsUpdated(componentMethods);
        }
        /**
         * The drive log component methods have been updated ...
         *
         * @param {MappCockpitComponentMethod[]} componentMethods
         * @memberof DriveLogDataProvider
         */
        onDriveLogComponentMethodsUpdated(componentMethods) {
            return __awaiter(this, void 0, void 0, function* () {
                this._createDriveLogSnapshotMethod = componentMethods.filter(method => { return method.browseName == DriveLogDataProvider_1.createDriveLogSnapshotMethodName; })[0];
                this._getDriveLogSnapshotMethod = componentMethods.filter(method => { return method.browseName == DriveLogDataProvider_1.getDriveLogSnapshotMethodName; })[0];
                this._getDriveLogConfigInfoMethod = componentMethods.filter(method => { return method.browseName == DriveLogDataProvider_1.getDriveLogConfigInfoMethodName; })[0];
                if (this._getDriveLogSnapshotMethod != undefined) {
                    // update the methods input parameters
                    yield mappCockpitComponent_1.MappCockpitComponentMethod.updateInputParameters(this._getDriveLogSnapshotMethod);
                }
                if (this._getDriveLogConfigInfoMethod != undefined) {
                    // update the methods input parameters
                    yield mappCockpitComponent_1.MappCockpitComponentMethod.updateInputParameters(this._getDriveLogConfigInfoMethod);
                }
            });
        }
        /**
         * Uploads the network command trace data from target (eventUploadDataFinished will be raise))
         *
         * @returns
         * @memberof DriveLogDataProvider
         */
        uploadDataFromTarget() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._createDriveLogSnapshotMethod != undefined && this._getDriveLogSnapshotMethod != undefined) {
                    // create network command trace snapshot on target
                    yield mappCockpitComponent_1.MappCockpitComponentMethod.execute(this._createDriveLogSnapshotMethod);
                    let dataAvailable = yield this.dataAvailable();
                    if (dataAvailable) {
                        let ref = { data: new Uint8Array() };
                        yield this.getNwctData(ref);
                        let currentNwctBinData = ref.data;
                        // get DynamicMetaData from target(opc ua methods)
                        let dynamicMetaData = yield this.getDynamicMetaData();
                        // create nwct provider
                        if (this._nwctMetaDataProvider == undefined) {
                            this._nwctMetaDataProvider = new nwctMetaDataProvider_1.NwctMetaDataProvider();
                            // Set the static data (parameter definitions, error info definitions, ...) after creating the NwctMetaDataProvider
                            let staticMetaDataFromTarget = yield this.getStaticMetaData();
                            this._nwctMetaDataProvider.setStaticMetaData(staticMetaDataFromTarget);
                        }
                        // Set dynamic data(network interface names, component names, ...) for every new upload of network command trace data
                        this._nwctMetaDataProvider.setDynamicMetaData(dynamicMetaData);
                        yield this.createNwctProvider(currentNwctBinData, this._nwctMetaDataProvider);
                    }
                    else {
                        console.error("No network command trace data available!");
                    }
                }
                else {
                    console.error("DriveLog component methods not loaded!");
                }
            });
        }
        /**
         * Returns the static meta data from target (OPC UA methods)
         *
         * @private
         * @returns {(Promise<NwctStaticMetaData|undefined>)}
         * @memberof DriveLogDataProvider
         */
        getStaticMetaData() {
            return __awaiter(this, void 0, void 0, function* () {
                let acoposParameterStaticData = undefined;
                let errorInfoStaticData = undefined;
                // load acopos parameter meta data
                let refMetaData = { data: "" };
                yield this.getNwctStaticMetaDataAcoposParameter(refMetaData);
                let staticdata = refMetaData.data;
                // create json objects
                try {
                    acoposParameterStaticData = JSON.parse(staticdata);
                }
                catch (e) {
                    console.error("Problem with data from GetDriveLogConfigInfo with id 2!");
                    console.error(e);
                }
                // load error info meta data
                let refMetaDataErrorInfo = { data: "" };
                yield this.getNwctStaticMetaDataErrorInfo(refMetaDataErrorInfo);
                let errorInfoStaticdata = refMetaDataErrorInfo.data;
                // create json objects
                try {
                    errorInfoStaticData = JSON.parse(errorInfoStaticdata);
                }
                catch (e) {
                    console.error("Problem with data from GetDriveLogConfigInfo with id 3!");
                    console.error(e);
                }
                // load data into satic metaData object
                return new nwctStaticMetaData_1.NwctStaticMetaData(acoposParameterStaticData, errorInfoStaticData);
            });
        }
        /**
         * Returns the dynamic meta data from the target (OPC UA methods)
         *
         * @private
         * @returns {(Promise<NwctDynamicMetaData|undefined>)}
         * @memberof DriveLogDataProvider
         */
        getDynamicMetaData() {
            return __awaiter(this, void 0, void 0, function* () {
                let refMetaData = { data: "" };
                yield this.getNwctDynamicMetaData(refMetaData);
                let dyndata = refMetaData.data;
                // create json objects
                let mappMotionArConfigObject = undefined;
                try {
                    mappMotionArConfigObject = JSON.parse(dyndata);
                }
                catch (e) {
                    console.error("Problem with data from GetDriveLogConfigInfo with id 1!");
                    console.error(e);
                }
                // load data into dynamic metaData object
                return new nwctDynamicMetaData_1.NwctDynamicMetaData(mappMotionArConfigObject);
            });
        }
        /**
         * Exports the network command trace data from target to a file
         *
         * @memberof DriveLogDataProvider
         */
        /*public async exportUploadNetworkCommandTrace(){
            if(this._createDriveLogSnapshotMethod != undefined && this._getDriveLogSnapshot != undefined){
                        
                // create network command trace snapshot on target
                await MappCockpitComponentMethod.execute(this._createDriveLogSnapshotMethod);
    
                let dataAvailable = await this.dataAvailable();
                if(dataAvailable){
                    // get network command trace snapshot from target
                    let ref = {data: new Blob()};
                    await this.createNetworkCommandTraceData(ref);
    
                    // download network command trace snapshot
                    FileProvider.downloadData("DriveLogSnapShot" + FileProvider.BinFileExt, ref.data);
                }
                else{
                    console.error("No network command trace data available!");
                }
            }
        }*/
        /**
         * Exports the last imported/uploaded network command trace data to a file
         *
         * @memberof DriveLogDataProvider
         */
        /*public exportCurrentDataToFile(){
            let binBlobData = this.getCurrentBinDataAsBlob();
            if(binBlobData != undefined){
                // download current etwork command trace snapshot(uploaded or imported)
                FileProvider.downloadData("DriveLogSnapShot" + FileProvider.BinFileExt, binBlobData);
            }
        }*/
        /**
         * Export the dat to zip file
         *
         * @param {Blob} data
         * @memberof DriveLogDataProvider
         */
        exportDataToFile(data) {
            if (data != undefined) {
                // Raise start exporting event 0%
                this.eventDataLoadingProgressChanged.raise(this, new dataLoadingProgressArgs_1.DataLoadingProgressArgs(dataLoadingProgressArgs_1.DataLoadingProgressArgs.exportToFileType, 0));
                // Start compressing data
                this.zipData(data);
            }
        }
        /**
         * Compress data and save to file
         *
         * @private
         * @param {Blob} data
         * @memberof DriveLogDataProvider
         */
        zipData(data) {
            let zipContainer = new zipContainer_1.ZipContainer();
            zipContainer.addFile("DriveLog.json", data);
            zipContainer.eventDataZipped.attach(this._dataZippedHandler);
            zipContainer.zipData();
        }
        /**
         * Imports some network command trace data from a file
         * Shows an file explorer to select a file and starts loading the file data (eventUploadDataFinished will be raise)
         *
         * @memberof DriveLogDataProvider
         */
        importDataFromFile() {
            this._fileProvider.uploadData(fileProvider_1.FileProvider.DriveLogExportFileExt + "," + fileProvider_1.FileProvider.BrFileExt);
        }
        /**
         * Occurs after reading data from file(trace configuration import data)
         *
         * @private
         * @param {HTMLInputElement} sender
         * @param {Map<string, string>} args
         * @memberof DriveLogDataProvider
         */
        onUploadDataFinished(sender, args) {
            // Timeout needed to show some busyscreen before importing data otherwise UI have no time to update
            setTimeout(() => this.onDataAvailable(sender, args), 200);
        }
        /**
         * Raised when the data from a loaded file is available
         *
         * @private
         * @param {HTMLInputElement} fileInputElement
         * @param {Map<string, string>} fileContents
         * @memberof DriveLogDataProvider
         */
        onDataAvailable(fileInputElement, fileContents) {
            if (fileContents.size === 1) {
                // Start with Progress 0% (load from file)
                this.eventDataLoadingProgressChanged.raise(this, new dataLoadingProgressArgs_1.DataLoadingProgressArgs(dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadFromFileType, 0));
                // Timeout needed to show the busyscreen before exporting data 
                setTimeout(() => this.interpretData(fileContents), 200);
            }
        }
        /**
         * Loads the network command trace data from file (eventUploadDataFinished will be raise))
         *
         * @private
         * @param {*} fileContents
         * @memberof DriveLogDataProvider
         */
        interpretData(fileContents) {
            return __awaiter(this, void 0, void 0, function* () {
                let filedata = fileContents.values().next().value;
                let filename = fileContents.keys().next().value;
                if (filename.endsWith(fileProvider_1.FileProvider.BrFileExt)) { // SDM br file import
                    yield this.importSdmBrFile(filedata);
                    return;
                }
                else if (filename.endsWith(fileProvider_1.FileProvider.DriveLogExportFileExt)) { // dle file DriveLog import
                    this.importDleFile(filedata);
                    return;
                }
                /*else if(filename.endsWith(FileProvider.BinFileExt)){ // Bin file import
                    this.importBinFile(filedata);
                    return;
                }*/
                this.eventDataLoadingProgressChanged.raise(this, new dataLoadingProgressArgs_1.DataLoadingProgressArgs(dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadFromFileType, 100));
                this.showFileNotSupportedWarningWhenImportingFile();
                // Raise EmtpyDataModel to clear the view
                this.raiseEmptyDataModel();
            });
        }
        /**
         * Raises the dataAvailable event with an empty datamodel
         *
         * @private
         * @memberof DriveLogDataProvider
         */
        raiseEmptyDataModel() {
            let loggerDataModel = new driveLogDataModel_1.DriveLogDataModel();
            this.eventDataAvailable.raise(this, loggerDataModel);
        }
        /**
         * Import SDM br file
         *
         * @private
         * @param {string} filedata
         * @returns
         * @memberof DriveLogDataProvider
         */
        importSdmBrFile(filedata) {
            return __awaiter(this, void 0, void 0, function* () {
                // Convert bin string to array buffer 
                let arrayBuffer2 = this.str2ab(filedata);
                // Receive the parsed br module data
                let brModuleData = new brModuleParser_1.BrModuleParser(arrayBuffer2);
                // check if its an valid NC data 
                if (brModuleData.isNCData === false || brModuleData.has6Sections === false) {
                    //handle error
                    this.eventDataLoadingProgressChanged.raise(this, new dataLoadingProgressArgs_1.DataLoadingProgressArgs(dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadFromFileType, 100));
                    this.showFileNotSupportedWarningWhenImportingFile();
                    // Raise EmtpyDataModel to clear the view
                    this.raiseEmptyDataModel();
                    return;
                }
                this.eventDataLoadingProgressChanged.raise(this, new dataLoadingProgressArgs_1.DataLoadingProgressArgs(dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadFromFileType, 100));
                // create json objects
                let mappMotionArConfigObject = JSON.parse(brModuleData.mappMotionArConfig);
                // load data into dynamic metaData object
                let dynamicMetaData = new nwctDynamicMetaData_1.NwctDynamicMetaData(mappMotionArConfigObject);
                // TODO: try catch for JSON parse
                let staticMetaData = new nwctStaticMetaData_1.NwctStaticMetaData(JSON.parse(brModuleData.acoposParIDs), JSON.parse(brModuleData.acoposErrInfTypes));
                let nwctMetaDataProvider = new nwctMetaDataProvider_1.NwctMetaDataProvider();
                // Set the static data from sdm binary file (parameter definitions, error info definitions, ...)
                nwctMetaDataProvider.setStaticMetaData(staticMetaData);
                // Set dynamic data(network interface names, component names, ...) from sdm binary file
                nwctMetaDataProvider.setDynamicMetaData(dynamicMetaData);
                yield this.createNwctProvider(brModuleData.mTrcBinDat01, nwctMetaDataProvider);
            });
        }
        /**
         * Creates a warning message when the user imports a .br file(or unsupported file extension) which one is not supported
         *
         * @private
         * @memberof DriveLogDataProvider
         */
        showFileNotSupportedWarningWhenImportingFile() {
            new alertDialog_1.AlertDialog().createMessageBox("File not supported", "Invalid file for this operation!", alertDialog_1.messageBoxType.Warning, undefined);
        }
        /**
         * Import dle file
         *
         * @private
         * @param {string} filedata
         * @memberof DriveLogDataProvider
         */
        importDleFile(filedata) {
            let zipContainer = new zipContainer_1.ZipContainer();
            zipContainer.eventDataUnzipped.attach(this._dataUnzippedHandler);
            zipContainer.unzipData(filedata, "DriveLog.json");
        }
        // -----------------------------Remove for release------------------------------------------
        /**
         * Import bin file
         *
         * @private
         * @param {string} filedata
         * @memberof DriveLogDataProvider
         */
        /*private async importBinFile(filedata: string){
            // Convert bin string to array buffer
            let arrayBuffer = this.str2ab(filedata);
            
            // End with Progress 100% (load from file)
            this.eventDataLoadingProgressChanged.raise(this, new DataLoadingProgressArgs(DataLoadingProgressArgs.loadFromFileType, 100));
    
            // get DynamicMetaData from data buffer
            let dynamicMetaData = this.getDynamicMetaDataFromBuffer(arrayBuffer);
            // get only the data buffer without metaData info
            let dataBuffer = this.getDataBuffer(arrayBuffer);
    
            // create nwct provider
            if(this._nwctMetaDataProvider == undefined){
                this._nwctMetaDataProvider = new NwctMetaDataProvider();
                // Set the static data (parameter definitions, error info definitions, ...) after creating the NwctMetaDataProvider
                let staticMetaDataFromTarget = await this.getStaticMetaData();
                this._nwctMetaDataProvider.setStaticMetaData(staticMetaDataFromTarget);
            }
    
            // Set dynamic data(network interface names, component names, ...) for every new upload of network command trace data
            this._nwctMetaDataProvider.setDynamicMetaData(dynamicMetaData);
            // create nwct provider
            await this.createNwctProvider(dataBuffer, this._nwctMetaDataProvider);
        }*/
        /**
         * Returns only the network command trace buffer without the metadata
         *
         * @private
         * @param {ArrayBuffer} networkCmdTrcData
         * @returns {ArrayBuffer}
         * @memberof DriveLogDataProvider
         */
        /*private getDataBuffer(networkCmdTrcData: ArrayBuffer): ArrayBuffer{
            let metaDataStartIndex = this.findMetaDataStart(networkCmdTrcData);
            let dataBuffer = networkCmdTrcData;
            if(metaDataStartIndex != -1){
                // Extract metaData
                dataBuffer = networkCmdTrcData.slice(0,metaDataStartIndex);
            }
            return dataBuffer;
        }*/
        /**
         * Returns the dynamic meta data found within the drive log buffer
         *
         * @private
         * @param {ArrayBuffer} networkCmdTrcData
         * @returns {(NwctDynamicMetaData|undefined)}
         * @memberof DriveLogDataProvider
         */
        /*private getDynamicMetaDataFromBuffer(networkCmdTrcData: ArrayBuffer): NwctDynamicMetaData|undefined{
            let metaDataStartIndex: number = this.findMetaDataStart(networkCmdTrcData);
            let currentMetaDataString;
            if(metaDataStartIndex != -1){
                // Extract metaData
                let metaDataBuffer = networkCmdTrcData.slice(metaDataStartIndex);
                currentMetaDataString = this.ab2str(metaDataBuffer);
            }
            
            let metaDataObject: NwctDynamicMetaData|undefined;
            if(currentMetaDataString != undefined){
                
                let indexMappMotionArConfig = currentMetaDataString.search("mappMotionArConfig");
                let mappMotionArConfig = currentMetaDataString.substr(indexMappMotionArConfig-2);
    
                let newSection = mappMotionArConfig.indexOf("{\"acoposParIDs\":");
                if(newSection != -1){
                    mappMotionArConfig = mappMotionArConfig.substr(0, newSection);
                }
                let endIndex = mappMotionArConfig.lastIndexOf("}");
    
                mappMotionArConfig = mappMotionArConfig.substr(0, endIndex+1); // Remove wrong characters at the end
                
                // create json objects
                let mappMotionArConfigObject = JSON.parse(mappMotionArConfig);
    
                // load data into dynamic metaData object
                metaDataObject = new NwctDynamicMetaData(mappMotionArConfigObject);
            }
            return metaDataObject;
        }*/
        /**
         * Find the index where the metaData is located in the bin buffer if available, other wise -1
         *
         * @private
         * @param {ArrayBuffer} networkCmdTrcData
         * @returns {number}
         * @memberof DriveLogDataProvider
         */
        /*private findMetaDataStart(networkCmdTrcData: ArrayBuffer): number{
            for(let i = 0; i < networkCmdTrcData.byteLength+4; i++){
                // TODO: Find start of MetaData in bin buffer if used in final version(maybe with kaitai parser)
                // 7B 22 6D 61 70 70 4D 6F 74 69 6F 6E 41 72 43 6F => {"mappMotionArCo(nfig)
                if(networkCmdTrcData[i] == 123 && networkCmdTrcData[i+1] == 34 && networkCmdTrcData[i+2] == 109 && networkCmdTrcData[i+3] == 97 && networkCmdTrcData[i+4] == 112 && networkCmdTrcData[i+5] == 112 ){
                    return i;
                }
            }
            return -1;
        }*/
        // -----------------------------Remove for release------------------------------------------
        /**
         * Parses the available network command trace *.bin data -> raises the eventDataAvailable when nwctProvider is finished with loading the data
         *
         * @private
         * @param {ArrayBuffer} networkCmdTrcData
         * @param {NwctMetaDataProvider} nwctMetaDataProvider
         * @memberof DriveLogDataProvider
         */
        createNwctProvider(networkCmdTrcData, nwctMetaDataProvider) {
            return __awaiter(this, void 0, void 0, function* () {
                // Start with Progress 0% (loading resources)
                this.eventDataLoadingProgressChanged.raise(this, new dataLoadingProgressArgs_1.DataLoadingProgressArgs(dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadResourcesType, 0));
                // Create nwctProvider to provider the drive log data for the given data buffer
                let nwctProvider = new nwctProvider_1.NwctProvider(networkCmdTrcData, nwctMetaDataProvider);
                nwctProvider.eventNamespacesLoaded.attach(this._namespacesLoadedHandler);
                // load needed namespaces        
                let namespaces = this.getNeededNamespaces();
                nwctProvider.loadTextSystemNamespaces(namespaces);
            });
        }
        /**
         * Searches for namespaces which are needed for the current nwctTrace data and returns them
         *
         * @private
         * @returns {Array<string>}
         * @memberof DriveLogDataProvider
         */
        getNeededNamespaces() {
            // TODO: load needed namespace names from target
            let namespaces = new Array();
            namespaces.push("BR/EventLog");
            return namespaces;
        }
        /**
         * Raised when loading namespaces is finished
         *
         * @private
         * @param {NwctProvider} sender
         * @param {*} args
         * @memberof DriveLogDataProvider
         */
        onNamespacesLoaded(sender, args) {
            // End with Progress 100% (loading resources)
            this.eventDataLoadingProgressChanged.raise(this, new dataLoadingProgressArgs_1.DataLoadingProgressArgs(dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadResourcesType, 100));
            // Update the data in the datamodel after loading of namespaces is finished
            let loggerDataModel = new driveLogDataModel_1.DriveLogDataModel();
            try {
                loggerDataModel.setNwctProvider(sender);
            }
            catch (e) {
                // No valid nwctProvider data
                this.showFileNotSupportedWarningWhenImportingFile();
            }
            this.eventDataAvailable.raise(this, loggerDataModel);
            // detach event namespacesLoaded
            sender.eventNamespacesLoaded.detach(this._namespacesLoadedHandler);
        }
        /**
         * Data zipped handler
         *
         * @private
         * @param {ZipContainer} sender
         * @param {*} zippedData
         * @memberof DriveLogDataProvider
         */
        onDataZippedHandler(sender, zippedData) {
            // download zipped network command trace snapshot(uploaded or imported)
            fileProvider_1.FileProvider.downloadData("DriveLogSnapShot" + fileProvider_1.FileProvider.DriveLogExportFileExt, zippedData);
            // Raise end exporting event 100%
            this.eventDataLoadingProgressChanged.raise(this, new dataLoadingProgressArgs_1.DataLoadingProgressArgs(dataLoadingProgressArgs_1.DataLoadingProgressArgs.exportToFileType, 100));
            //Detach datazipped event
            sender.eventDataZipped.detach(this._dataZippedHandler);
        }
        /**
         * Data unzipped handler
         *
         * @private
         * @param {ZipContainer} sender
         * @param {*} unzippedData
         * @memberof DriveLogDataProvider
         */
        onDataUnzippedHandler(sender, unzippedData) {
            // Create new datamodel with the new data
            let loggerDataModel = new driveLogDataModel_1.DriveLogDataModel();
            loggerDataModel.setSettings(JSON.parse(unzippedData));
            // Raise dataAvailable event
            this.eventDataAvailable.raise(this, loggerDataModel);
            // End with Progress 100% (load from file)
            this.eventDataLoadingProgressChanged.raise(this, new dataLoadingProgressArgs_1.DataLoadingProgressArgs(dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadFromFileType, 100));
            // Detach data unzipped event
            sender.eventDataUnzipped.detach(this._dataUnzippedHandler);
        }
        /**
         * Creates network command trace data for export in blob format (*.bin)
         *
         * @private
         * @param {{data: Blob}} ref
         * @memberof DriveLogDataProvider
         */
        /*private async createNetworkCommandTraceData(ref: {data: Blob}){
            let internalRef = {data: new Uint8Array()};
            await this.getNwctData(internalRef);
            this._currentNwctBinData = internalRef.data;
            ref.data = this.getCurrentBinDataAsBlob();
            
        }*/
        /**
         * Returns the current bin data(uploaded or imported) incl. metadata as blob (else empty blob if error)
         *
         * @private
         * @returns {Blob}
         * @memberof DriveLogDataProvider
         */
        /*private getCurrentBinDataAsBlob(): Blob{
            // Add Network Command Trace Buffer and add dynamic MetaData
            //let data = new Blob([new Uint8Array(this._currentNwctBinData)]);
            let mergedArray: Uint8Array|undefined;
            let data = new Uint8Array(this._currentNwctBinData);
            if(this._currentMetaDataBuffer != undefined){
                let metaData =  new Uint8Array(this._currentMetaDataBuffer);
                mergedArray = new Uint8Array(data.length + metaData.length);
                mergedArray.set(data);
                mergedArray.set(metaData, data.length);
            }
            else{
                console.error("No metadata available!");
            }
            if(mergedArray != undefined){
                let blob = new Blob([mergedArray]);
                return blob;
            }
            // Return emtpy blob in case of an error
            return new Blob();
        }*/
        /**
         * Converts a string to an array buffer
         *
         * @private
         * @param {string} str
         * @returns {Uint8Array}
         * @memberof DriveLogDataProvider
         */
        str2ab(str) {
            let buf = new Uint8Array(str.length);
            for (var i = 0, strLen = str.length; i < strLen; i++) {
                buf[i] = str.charCodeAt(i);
            }
            return buf;
        }
        /**
         * Converts an array buffer to a string
         *
         * @private
         * @param {ArrayBuffer} buf
         * @returns {string}
         * @memberof DriveLogDataProvider
         */
        ab2str(buf) {
            return new TextDecoder().decode(buf);
        }
        /**
         * Upload network command trace data
         *
         * @private
         * @param {{data: Uint8Array}} ref
         * @memberof DriveLogDataProvider
         */
        getNwctData(ref) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._getDriveLogSnapshotMethod != undefined) {
                    yield this.loadData(this._getDriveLogSnapshotMethod, ref);
                }
            });
        }
        /**
         * Upload the dynamic meta data for the network command trace
         *
         * @private
         * @param {{data: Uint8Array}} ref
         * @memberof DriveLogDataProvider
         */
        getNwctDynamicMetaData(ref) {
            return __awaiter(this, void 0, void 0, function* () {
                // get data buffer
                let refMetaData = { data: new Uint8Array() };
                if (this._getDriveLogConfigInfoMethod != undefined) {
                    yield this.loadData(this._getDriveLogConfigInfoMethod, refMetaData, 1);
                }
                // convert data buffer to string
                let metaData = this.ab2str(refMetaData.data);
                ref.data = metaData;
            });
        }
        /**
         * Upload the static meta data for the network command trace for the acopos parameters
         *
         * @private
         * @param {{data: Uint8Array}} ref
         * @memberof DriveLogDataProvider
         */
        getNwctStaticMetaDataAcoposParameter(ref) {
            return __awaiter(this, void 0, void 0, function* () {
                // get data buffer
                let refMetaData = { data: new Uint8Array() };
                if (this._getDriveLogConfigInfoMethod != undefined) {
                    yield this.loadData(this._getDriveLogConfigInfoMethod, refMetaData, 2);
                }
                // convert data buffer to string
                let metaData = this.ab2str(refMetaData.data);
                ref.data = metaData;
            });
        }
        /**
         * Upload the static meta data for the network command trace for the error infos
         *
         * @private
         * @param {{data: Uint8Array}} ref
         * @memberof DriveLogDataProvider
         */
        getNwctStaticMetaDataErrorInfo(ref) {
            return __awaiter(this, void 0, void 0, function* () {
                // get data buffer
                let refMetaData = { data: new Uint8Array() };
                if (this._getDriveLogConfigInfoMethod != undefined) {
                    yield this.loadData(this._getDriveLogConfigInfoMethod, refMetaData, 3);
                }
                // convert data buffer to string
                let metaData = this.ab2str(refMetaData.data);
                ref.data = metaData;
            });
        }
        /**
         * Load data from target with the given component method
         *
         * @private
         * @param {MappCockpitComponentMethod} componentMethod
         * @param {{data: Uint8Array}} ref
         * @param {number} [additionalId=0] id which data should be loaded(needed for loading dynamically metaData)
         * @memberof DriveLogDataProvider
         */
        loadData(componentMethod, ref, additionalId = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                let startOffset = 0;
                let maxBytes = 32768;
                // Start with Progress 0% (load from target) => currently only for nwct Bin Data
                if (componentMethod == this._getDriveLogSnapshotMethod) {
                    this.eventDataLoadingProgressChanged.raise(this, new dataLoadingProgressArgs_1.DataLoadingProgressArgs(dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadFromTargetType, 0));
                }
                let inputCounter = 0;
                if (additionalId != 0) {
                    componentMethod.inputParameters[inputCounter].value = additionalId;
                    inputCounter++;
                }
                let startOffsetInputIndex = inputCounter;
                let maxBytesInputIndex = inputCounter + 1;
                componentMethod.inputParameters[startOffsetInputIndex].value = startOffset;
                componentMethod.inputParameters[maxBytesInputIndex].value = maxBytes;
                let result = yield mappCockpitComponent_1.MappCockpitComponentMethod.execute(componentMethod);
                let dataLength = result.args.DataLeft + result.args.DataRead;
                let data = new Uint8Array(dataLength);
                let encData = this.encodeBase64(result.args.Data);
                for (let i = 0; i < encData.length; i++) {
                    data[startOffset + i] = encData[i];
                }
                startOffset += result.args.DataRead;
                if (result.args.DataLeft == 0) {
                    // Data loaded completly
                    if (componentMethod == this._getDriveLogSnapshotMethod) {
                        // raise event -> 100% progress
                        this.eventDataLoadingProgressChanged.raise(this, new dataLoadingProgressArgs_1.DataLoadingProgressArgs(dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadFromTargetType, 100));
                    }
                }
                else {
                    // Load the rest of the data
                    while (result.args.DataLeft > 0) {
                        componentMethod.inputParameters[startOffsetInputIndex].value = startOffset;
                        result = yield mappCockpitComponent_1.MappCockpitComponentMethod.execute(componentMethod);
                        let encData = this.encodeBase64(result.args.Data);
                        for (let i = 0; i < encData.length; i++) {
                            data[startOffset + i] = encData[i];
                        }
                        startOffset += result.args.DataRead;
                        // Calculate progress after every loaded datapart (load from target) => currently only for nwct Bin Data
                        if (componentMethod == this._getDriveLogSnapshotMethod) {
                            let progress = 100 - (result.args.DataLeft * 100) / dataLength;
                            this.eventDataLoadingProgressChanged.raise(this, new dataLoadingProgressArgs_1.DataLoadingProgressArgs(dataLoadingProgressArgs_1.DataLoadingProgressArgs.loadFromTargetType, Math.round(progress)));
                        }
                    }
                }
                ref.data = data;
            });
        }
        /**
         * Convert from base64 string to Uint8Array
         *
         * @private
         * @param {any} base64
         * @returns {Uint8Array}
         * @memberof DriveLogDataProvider
         */
        encodeBase64(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes;
        }
        /**
         * Executes a command on the target to look if there is some network command trace data available
         *
         * @private
         * @returns
         * @memberof DriveLogDataProvider
         */
        dataAvailable() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._getDriveLogSnapshotMethod != undefined) {
                    this._getDriveLogSnapshotMethod.inputParameters[0].value = 0;
                    this._getDriveLogSnapshotMethod.inputParameters[1].value = 10;
                    for (let i = 0; i < 20; i++) {
                        let result = yield mappCockpitComponent_1.MappCockpitComponentMethod.execute(this._getDriveLogSnapshotMethod);
                        if (result.args != undefined && result.args.DataRead == 10) {
                            return true;
                        }
                        yield utilities_1.Utilities.sleep(200);
                    }
                }
                return false;
            });
        }
    };
    /**
     * Method names for loading the drive log snapshot and the drive log config infos
     *
     * @static
     * @memberof DriveLogDataProvider
     */
    DriveLogDataProvider.createDriveLogSnapshotMethodName = "CreateDriveLogSnapshot";
    DriveLogDataProvider.getDriveLogSnapshotMethodName = "GetDriveLogSnapshot";
    DriveLogDataProvider.getDriveLogConfigInfoMethodName = "GetDriveLogConfigInfo";
    DriveLogDataProvider = DriveLogDataProvider_1 = __decorate([
        mco.role()
    ], DriveLogDataProvider);
    exports.DriveLogDataProvider = DriveLogDataProvider;
});
