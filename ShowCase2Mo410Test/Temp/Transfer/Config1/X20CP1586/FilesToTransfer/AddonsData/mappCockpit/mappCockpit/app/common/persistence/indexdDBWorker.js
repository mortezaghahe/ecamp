"use strict";
//import { IndexedDBCommand } from "./interfaces/indexeddbCommandInterface.js";
// TODO: change to "import type" in ts version 3.8+
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import type {IndexedDBCommand} from "./interfaces/indexeddbCommandInterface.js"
var IndexedDBCommandMessage;
(function (IndexedDBCommandMessage) {
    IndexedDBCommandMessage["clear"] = "clear";
    IndexedDBCommandMessage["init"] = "init";
    IndexedDBCommandMessage["store"] = "store";
    IndexedDBCommandMessage["load"] = "load";
    IndexedDBCommandMessage["success"] = "success";
    IndexedDBCommandMessage["error"] = "error";
})(IndexedDBCommandMessage || (IndexedDBCommandMessage = {}));
;
class IndexedDBCommand {
    constructor(message, data) {
        this.message = message;
        this.data = data;
    }
}
;
var database;
let objectStore;
let _location;
let _store;
/**
 * initialize database
 *
 * @param {*} data
 */
function initDatabase(data, resolve, reject, version = 1) {
    _location = data.location + "_" + data.version;
    _store = "data_" + data.version;
    let request = indexedDB.open(_location, version);
    request.onupgradeneeded = function (e) {
        database = e.target.result;
        objectStore = database.createObjectStore(_store);
    };
    request.onsuccess = function (e) {
        database = request.result;
        let dbCommand = new IndexedDBCommand(IndexedDBCommandMessage.success, { message: "database initialized" });
        self.postMessage(dbCommand);
    };
    request.onerror = function (e) {
        let dbCommand = new IndexedDBCommand(IndexedDBCommandMessage.error, { message: "error while init database" });
        self.postMessage(dbCommand);
    };
}
/**
 * store data in the database for a specific key
 *
 * @param {*} data : {key : string, data: any}
 */
function storeData(data) {
    if (database == undefined) {
        console.error("IndexedDb not initialized! Storing data not possible.");
        return;
    }
    let transaction = database.transaction(_store, 'readwrite');
    let store = transaction.objectStore(_store);
    let request;
    if (data.key != undefined) {
        if (data.data != undefined) {
            request = store.put(data.data, data.key);
        }
        else {
            request = store.delete(data.key);
        }
        request.onsuccess = () => {
            self.postMessage(new IndexedDBCommand(IndexedDBCommandMessage.store, { message: "stored element for key: " + data.key }));
        };
        request.onerror = function (event) {
            self.postMessage(new IndexedDBCommand(IndexedDBCommandMessage.error, { message: "error storeing element for key: " + data.key }));
        };
    }
    else {
        console.log("idbworker error: no key provide to store data");
    }
}
/**
 * load all data from database and post result to main thread
 *
 *
 */
function loadData() {
    return __awaiter(this, void 0, void 0, function* () {
        if (database == undefined) {
            console.error("IndexedDb not initialized! Loading data not possible.");
            return;
        }
        let transaction = database.transaction(_store, 'readonly');
        let store = transaction.objectStore(_store);
        let storedata = {};
        let request = store.openCursor();
        request.onerror = function (event) {
            self.postMessage(new IndexedDBCommand(IndexedDBCommandMessage.error, { message: "error loading data" }));
        };
        request.onsuccess = function (event) {
            if (event != null) {
                let cursor = event.target.result;
                if (cursor) {
                    let key = cursor.primaryKey;
                    let value = cursor.value;
                    storedata[key] = value;
                    cursor.continue();
                }
                else {
                    self.postMessage(new IndexedDBCommand(IndexedDBCommandMessage.load, { message: "loaded all data from database", data: storedata }));
                }
            }
        };
    });
}
/**
 * remove all data from the database
 *
 */
function clear(data) {
    return __awaiter(this, void 0, void 0, function* () {
        /* delete all databases will come later
        // @ts-ignore
        let databases = await indexedDB.databases()
    
        console.log(databases);
    
        for(let i = 0; i < databases.length; i++){
            console.log(databases[i].name);
            indexedDB.deleteDatabase(databases[i].name)
        }
    
        */
        _location = data.location + "_" + data.version;
        indexedDB.deleteDatabase(_location);
    });
}
/**
 * handle command recieved from main thread
 *
 *
 */
onmessage = function onmessage(event) {
    let command = event.data;
    switch (command.message) {
        case IndexedDBCommandMessage.init:
            {
                initDatabase(command.data);
                break;
            }
        case IndexedDBCommandMessage.store:
            {
                storeData(command.data);
                break;
            }
        case IndexedDBCommandMessage.load:
            {
                loadData();
                break;
            }
        case IndexedDBCommandMessage.clear:
            {
                clear(command.data);
                break;
            }
    }
};
