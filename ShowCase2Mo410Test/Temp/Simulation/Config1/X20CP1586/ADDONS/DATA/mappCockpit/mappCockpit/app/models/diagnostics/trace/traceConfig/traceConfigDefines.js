var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceStateIds = exports.XmlAttributes = exports.XmlNodeTypes = exports.TraceConfigFileGroupIds = exports.TraceConfigFilePropertyIds = exports.TraceConfigBrowseNameIds = void 0;
    /**
     * Defines the ids of some trace configuration data on opc ua server(browsenames)
     *
     * @export
     * @class TraceConfigBrowseNameIds
     */
    let TraceConfigBrowseNameIds = class TraceConfigBrowseNameIds {
    };
    TraceConfigBrowseNameIds.AcoposSamplingTime = "Timing_AcoposSampleTime";
    TraceConfigBrowseNameIds.PlcTaskClass = "Timing_PlcTaskClass";
    TraceConfigBrowseNameIds.TotalRecordingTime = "Timing_TotalRecordingTime";
    TraceConfigBrowseNameIds.TriggerOffsetTime = "Timing_TriggerOffsetTime";
    TraceConfigBrowseNameIds.PlcSampleTime = "Timing_PlcSampleTime";
    TraceConfigBrowseNameIds = __decorate([
        mco.role()
    ], TraceConfigBrowseNameIds);
    exports.TraceConfigBrowseNameIds = TraceConfigBrowseNameIds;
    /**
     * Defines the ids of some trace configuration properties which will be used in the export/import trace configuration file format
     *
     * @export
     * @class TraceConfigFilePropertyIds
     */
    let TraceConfigFilePropertyIds = class TraceConfigFilePropertyIds {
    };
    // Timing Ids
    TraceConfigFilePropertyIds.AcoposSamplingTime = "TrcACOPOSSampleTime";
    TraceConfigFilePropertyIds.PvTaskClass = "TrcPVTaskClass";
    TraceConfigFilePropertyIds.TotalRecordingTime = "TrcTotalRecordingTime";
    TraceConfigFilePropertyIds.TriggerOffsetTime = "TrcTriggerOffsetTime";
    TraceConfigFilePropertyIds.PlcSampleTime = "TrcPLCSampleTime";
    // Start Trigger Ids
    TraceConfigFilePropertyIds.TriggerCondition = "TrcTriggerCondition";
    TraceConfigFilePropertyIds.TriggerDataPoint = "TrcTriggerDataPoint";
    TraceConfigFilePropertyIds.TriggerConditionSelection = "TrcTriggerConditionSelection";
    TraceConfigFilePropertyIds.TriggerThreshold = "TrcThreshold";
    TraceConfigFilePropertyIds.TriggerWindow = "TrcWindow";
    // DataPoint Ids
    TraceConfigFilePropertyIds.DataPoint = "TrcDataPoint";
    TraceConfigFilePropertyIds = __decorate([
        mco.role()
    ], TraceConfigFilePropertyIds);
    exports.TraceConfigFilePropertyIds = TraceConfigFilePropertyIds;
    /**
     * Defines the trace configuration group ids(e.g. categories like datapoints, starttriggers, ..) in the export/import trace configuration file format
     *
     * @export
     * @class TraceConfigFileGroupIds
     */
    let TraceConfigFileGroupIds = class TraceConfigFileGroupIds {
    };
    TraceConfigFileGroupIds.DataPointList = "TrcDataPointList";
    TraceConfigFileGroupIds.TimingSettings = "TrcTimingSettings";
    TraceConfigFileGroupIds.TriggerSettings = "TrcTriggerSettings";
    TraceConfigFileGroupIds = __decorate([
        mco.role()
    ], TraceConfigFileGroupIds);
    exports.TraceConfigFileGroupIds = TraceConfigFileGroupIds;
    /**
     * Defines the xml types which will be used in the trace configuration export/import format (e.g. group, selector, property, ...)
     *
     * @export
     * @class XmlNodeTypes
     */
    let XmlNodeTypes = class XmlNodeTypes {
    };
    XmlNodeTypes.Configuration = "Configuration";
    XmlNodeTypes.Element = "Element";
    XmlNodeTypes.Group = "Group";
    XmlNodeTypes.Selector = "Selector";
    XmlNodeTypes.Property = "Property";
    XmlNodeTypes = __decorate([
        mco.role()
    ], XmlNodeTypes);
    exports.XmlNodeTypes = XmlNodeTypes;
    /**
     * Defines the xml attribute ids which will be used in the trace configuration export/import format (e.g. ID, Value, ...)
     *
     * @export
     * @class XmlAttributes
     */
    let XmlAttributes = class XmlAttributes {
    };
    XmlAttributes.Id = "ID";
    XmlAttributes.Value = "Value";
    XmlAttributes = __decorate([
        mco.role()
    ], XmlAttributes);
    exports.XmlAttributes = XmlAttributes;
    /**
     * Defines the trace state ids
     *
     * @export
     * @class TraceStateIds
     */
    let TraceStateIds = class TraceStateIds {
    };
    TraceStateIds.Undefined = "";
    TraceStateIds.Disabled = "1";
    TraceStateIds.Config_processing = "10";
    TraceStateIds.Config_applied = "11";
    TraceStateIds.Wait_start_trigger = "20";
    TraceStateIds.Wait_stop_event = "21";
    TraceStateIds.Data_available = "23";
    TraceStateIds.Record_failure = "82";
    TraceStateIds = __decorate([
        mco.role()
    ], TraceStateIds);
    exports.TraceStateIds = TraceStateIds;
});
