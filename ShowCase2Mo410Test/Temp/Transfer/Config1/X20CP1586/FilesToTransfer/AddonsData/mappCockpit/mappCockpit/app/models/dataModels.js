var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./mappCockpitDataModel/mappCockpitDataModel", "./configManagerDataModel/configManagerDataModel", "./signalManagerDataModel/signalManagerDataModel", "./chartManagerDataModel/chartManagerDataModel"], function (require, exports, mappCockpitDataModel_1, configManagerDataModel_1, signalManagerDataModel_1, chartManagerDataModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartManagerDataModel = exports.SignalManagerDataModel = exports.ConfigManagerDataModel = exports.MappCockpitDataModel = void 0;
    let MappCockpitDataModel = class MappCockpitDataModel {
        static create() { return new mappCockpitDataModel_1.MappCockpitDataModel(); }
        ;
    };
    MappCockpitDataModel = __decorate([
        mco.role()
    ], MappCockpitDataModel);
    exports.MappCockpitDataModel = MappCockpitDataModel;
    let ConfigManagerDataModel = class ConfigManagerDataModel {
        static create() { return new configManagerDataModel_1.ConfigManagerDataModel(); }
        ;
    };
    ConfigManagerDataModel = __decorate([
        mco.role()
    ], ConfigManagerDataModel);
    exports.ConfigManagerDataModel = ConfigManagerDataModel;
    let SignalManagerDataModel = class SignalManagerDataModel {
        static create() { return new signalManagerDataModel_1.SignalManagerDataModel(); }
        ;
    };
    SignalManagerDataModel = __decorate([
        mco.role()
    ], SignalManagerDataModel);
    exports.SignalManagerDataModel = SignalManagerDataModel;
    let ChartManagerDataModel = class ChartManagerDataModel {
        static create() { return new chartManagerDataModel_1.ChartManagerDataModel(); }
        ;
    };
    ChartManagerDataModel = __decorate([
        mco.role()
    ], ChartManagerDataModel);
    exports.ChartManagerDataModel = ChartManagerDataModel;
});
