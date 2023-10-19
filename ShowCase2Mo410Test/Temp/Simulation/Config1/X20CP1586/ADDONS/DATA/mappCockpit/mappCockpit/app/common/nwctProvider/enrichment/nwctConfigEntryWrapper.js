var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./nwctDataEntriesWrapper"], function (require, exports, nwctDataEntriesWrapper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctConfigEntryWrapper = void 0;
    let NwctConfigEntryWrapper = class NwctConfigEntryWrapper {
        constructor(configEntry) {
            this._relevantDataEntries = new nwctDataEntriesWrapper_1.NwctDataEntriesWrapper();
            this._configEntry = configEntry;
        }
        get configEntry() {
            return this._configEntry;
        }
        addDataEntryRef(wDataEntry) {
            this._relevantDataEntries.addDataEntry(wDataEntry);
        }
        getReferencedDataEntries() {
            return this._relevantDataEntries;
        }
        get wDataEntries() {
            return this._relevantDataEntries;
        }
    };
    NwctConfigEntryWrapper = __decorate([
        mco.role()
    ], NwctConfigEntryWrapper);
    exports.NwctConfigEntryWrapper = NwctConfigEntryWrapper;
});
