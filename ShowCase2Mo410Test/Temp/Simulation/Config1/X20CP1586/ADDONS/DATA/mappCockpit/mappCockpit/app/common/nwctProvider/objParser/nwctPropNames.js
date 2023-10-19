var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctPropNames = void 0;
    /**
     *  Contains all the names of the properties defined in the kaitai parser configuration
     *  This information might differ for different mapp Motion versions in the future
     */
    let NwctPropNames = class NwctPropNames {
    };
    NwctPropNames.configEntries = "configRecords";
    NwctPropNames.configRecordId = "configurationRecordId";
    NwctPropNames.configNetworkType = "networkType";
    NwctPropNames.configNetworkInterfaceIndex = "networkInterfaceIndex";
    NwctPropNames.configNodeNo = "nodeNumberOfDrive";
    NwctPropNames.configDatagramType = "datagramType";
    NwctPropNames.configDatagramEncodingId = "datagramEncodingId";
    NwctPropNames.dataEntries = "dataRecords";
    NwctPropNames.dataConfigEntryId = "configRecordId";
    NwctPropNames.dataChannelIndex = "channelIndexOneBased";
    NwctPropNames.ncObjectType = "ncObjectType";
    NwctPropNames.dataNo = "index";
    NwctPropNames.dataGeneralInfo = "isGeneralInfo";
    NwctPropNames.dataTime = "timeInSeconds";
    NwctPropNames.dataAcopos = "acoposParameterData";
    NwctPropNames.dataParId = "parId";
    //public static readonly    dataCmd = "parCmd";
    NwctPropNames.dataCnt = "parCnt";
    NwctPropNames.dataPayload = "payload";
    NwctPropNames = __decorate([
        mco.role()
    ], NwctPropNames);
    exports.NwctPropNames = NwctPropNames;
});
