var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var TraceDataPointInfo_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceDataPointInfo = void 0;
    /**
     * Provides data for describing a trace data point info
     *
     * @class TraceDataPointInfo
     */
    let TraceDataPointInfo = TraceDataPointInfo_1 = class TraceDataPointInfo {
        constructor(componentName, address, namespace, reference) {
            if (reference != undefined) {
                this._name = reference.DataPoint.Name;
            }
            else {
                this._name = "";
            }
            this._address = address;
            this._namespace = namespace;
            this._dataPointReference = reference;
            this._componentName = componentName;
            this._fullname = this.getFullname();
        }
        static create(componentName, deviceAddress, namespace, dataPointRef) {
            return new TraceDataPointInfo_1(componentName, deviceAddress, namespace, dataPointRef);
        }
        get componentName() {
            return this._componentName;
        }
        get name() {
            return this._name;
        }
        get fullname() {
            return this._fullname;
        }
        get address() {
            return this._address;
        }
        get namespace() {
            if (this._namespace == undefined) {
                return "";
            }
            return this._namespace.Namespace;
        }
        get description() {
            if (this._dataPointReference == undefined) {
                return "";
            }
            return this._dataPointReference.DataPoint.Description;
        }
        getFullname() {
            if (this._namespace == undefined) {
                return "";
            }
            let syntax = this._namespace.Data.Syntax[0];
            let temp1 = syntax.replace("%Namespace%", this._namespace.Namespace);
            let temp2 = temp1.replace("%ComponentName%", this._componentName);
            if (this._address != undefined) {
                var temp3 = temp2.replace("%DeviceAddress%", this._address);
            }
            else {
                var temp3 = temp2;
            }
            let temp4 = temp3.replace("%DataPoint.Name%", this._dataPointReference.DataPoint.Name);
            if (this._dataPointReference.DataPoint.Id != undefined) {
                var temp5 = temp4.replace("%DataPoint.Id%", this._dataPointReference.DataPoint.Id);
            }
            else {
                var temp5 = temp4;
            }
            let dataPointName = temp5;
            return dataPointName;
        }
    };
    TraceDataPointInfo = TraceDataPointInfo_1 = __decorate([
        mco.role()
    ], TraceDataPointInfo);
    exports.TraceDataPointInfo = TraceDataPointInfo;
});
