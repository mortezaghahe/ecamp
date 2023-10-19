var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../objParser/nwctTypeEnums"], function (require, exports, nwctTypeEnums_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctDataEntryWrapper = void 0;
    let NwctDataEntryWrapper = class NwctDataEntryWrapper {
        constructor(dataEntry) {
            this.wConfigEntry = undefined;
            this.response = undefined;
            this.request = undefined;
            this._dataEntry = dataEntry;
        }
        get dataEntry() {
            return this._dataEntry;
        }
        get isRequest() {
            // first check if there is a config entry at all
            if (this.wConfigEntry === undefined ||
                !this.wConfigEntry.configEntry.datagramType.valid) {
                return false;
            }
            let datagramType = this.wConfigEntry.configEntry.datagramType.value;
            // check if this is a read request, read response, write request or write response
            return datagramType === nwctTypeEnums_1.NwctDatagramType.READ_REQUEST ||
                datagramType === nwctTypeEnums_1.NwctDatagramType.WRITE_REQUEST;
        }
    };
    NwctDataEntryWrapper = __decorate([
        mco.role()
    ], NwctDataEntryWrapper);
    exports.NwctDataEntryWrapper = NwctDataEntryWrapper;
});
