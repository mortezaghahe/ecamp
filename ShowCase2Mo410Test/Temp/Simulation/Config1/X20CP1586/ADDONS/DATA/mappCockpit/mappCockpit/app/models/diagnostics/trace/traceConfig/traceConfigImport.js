var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../traceDataPoint", "../traceStartTrigger", "./traceConfigValueConverter", "./traceConfigDefines", "./traceConfigImportData"], function (require, exports, traceDataPoint_1, traceStartTrigger_1, traceConfigValueConverter_1, traceConfigDefines_1, traceConfigImportData_1) {
    "use strict";
    var TraceConfigImport_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigImport = void 0;
    let TraceConfigImport = TraceConfigImport_1 = class TraceConfigImport {
        /**
         * Returns the trace configuration informations for the given trace configuration xml string(import/export format)
         *
         * @static
         * @param {string} fileData
         * @returns {TraceConfigurationImportData}
         * @memberof TraceConfigImport
         */
        static getTraceConfigDataFromXml(xmlData) {
            let traceConfigurationImportData;
            let traceConfigElement = TraceConfigImport_1.getTraceConfigElement(xmlData);
            if (traceConfigElement != undefined) {
                traceConfigurationImportData = TraceConfigImport_1.getTraceConfigurationImportData(traceConfigElement);
            }
            else {
                console.error("No trace configuration found!");
            }
            return traceConfigurationImportData;
        }
        /**
         * Returns the first trace configuration element from the xml trace configuration data, else undefined
         *
         * @private
         * @param {string} xmlData
         * @returns {Element}
         * @memberof TraceConfigImport
         */
        static getTraceConfigElement(xmlData) {
            let domParser = new DOMParser();
            try {
                let xmlDoc = domParser.parseFromString(xmlData, "text/xml");
                if (xmlDoc.documentElement != null) {
                    if (xmlDoc.documentElement.nodeName == traceConfigDefines_1.XmlNodeTypes.Configuration) {
                        if (xmlDoc.documentElement.children[0].nodeName == traceConfigDefines_1.XmlNodeTypes.Element) {
                            return xmlDoc.documentElement.children[0];
                        }
                    }
                }
            }
            catch (e) {
                console.error("Error while parsing trace configuration xml data!");
                console.error(e);
            }
            return undefined;
        }
        /**
         * Returns the trace configuration informations or undefined from the given trace config element
         *
         * @private
         * @static
         * @param {Element} traceConfigElement
         * @returns {TraceConfigurationImportData}
         * @memberof TraceConfigImport
         */
        static getTraceConfigurationImportData(traceConfigElement) {
            let importedDatapoints = new Array();
            let importedTimingParameters = {};
            let importedStartTriggers = new Array();
            for (let i = 0; i < traceConfigElement.children.length; i++) {
                let child = traceConfigElement.children[i];
                if (child.nodeName == traceConfigDefines_1.XmlNodeTypes.Group) {
                    if (child.attributes[traceConfigDefines_1.XmlAttributes.Id].value == traceConfigDefines_1.TraceConfigFileGroupIds.DataPointList) {
                        importedDatapoints = TraceConfigImport_1.getTraceDataPoints(child);
                    }
                    else if (child.attributes[traceConfigDefines_1.XmlAttributes.Id].value == traceConfigDefines_1.TraceConfigFileGroupIds.TimingSettings) {
                        importedTimingParameters = TraceConfigImport_1.getTimingParameters(child);
                    }
                    else if (child.attributes[traceConfigDefines_1.XmlAttributes.Id].value == traceConfigDefines_1.TraceConfigFileGroupIds.TriggerSettings) {
                        importedStartTriggers = TraceConfigImport_1.getStartTriggers(child);
                    }
                }
            }
            return new traceConfigImportData_1.TraceConfigurationImportData(importedDatapoints, importedTimingParameters, importedStartTriggers);
        }
        /**
         * Returns a list with tracedatapoint for the given tracedatapoint element
         *
         * @private
         * @static
         * @param {Element} traceDataPointXmlElement
         * @returns {Array<TraceDataPoint>}
         * @memberof TraceConfigImport
         */
        static getTraceDataPoints(traceDataPointXmlElement) {
            let traceDataPoints = new Array();
            for (let datapointCounter = 0; datapointCounter < traceDataPointXmlElement.children.length; datapointCounter++) {
                let datapointProperty = traceDataPointXmlElement.children[datapointCounter];
                if (datapointProperty.nodeName == traceConfigDefines_1.XmlNodeTypes.Property) {
                    let dataPointValue = datapointProperty.attributes[traceConfigDefines_1.XmlAttributes.Value];
                    if (dataPointValue != undefined) {
                        if (dataPointValue.value != "") { // Add only datapoints with value(datapoint name)
                            traceDataPoints.push(traceDataPoint_1.TraceDataPoint.createSimpleDataPoint(dataPointValue.value));
                        }
                    }
                }
            }
            return traceDataPoints;
        }
        /**
         * Returns a key value pair list with the timing parameters for the given timing element
         *
         * @private
         * @static
         * @param {Element} timingXmlElement
         * @returns {{[key: string]: string}}
         * @memberof TraceConfigImport
         */
        static getTimingParameters(timingXmlElement) {
            var timingParameters = {};
            for (let timingParamCounter = 0; timingParamCounter < timingXmlElement.children.length; timingParamCounter++) {
                let timingProperty = timingXmlElement.children[timingParamCounter];
                if (timingProperty.nodeName == traceConfigDefines_1.XmlNodeTypes.Property) {
                    timingParameters[timingProperty.attributes[traceConfigDefines_1.XmlAttributes.Id].value] = timingProperty.attributes[traceConfigDefines_1.XmlAttributes.Value].value;
                }
                if (timingProperty.nodeName == traceConfigDefines_1.XmlNodeTypes.Selector) {
                    let selectorId = timingProperty.attributes[traceConfigDefines_1.XmlAttributes.Id].value;
                    let selectorValue = timingProperty.attributes[traceConfigDefines_1.XmlAttributes.Value].value;
                    if (selectorId == traceConfigDefines_1.TraceConfigFilePropertyIds.PvTaskClass) {
                        selectorValue = traceConfigValueConverter_1.TraceConfigValueConverter.getPvTaskClassNumber(selectorValue);
                    }
                    timingParameters[selectorId] = selectorValue;
                    // Add sub properties (e.g. TrcPLCSampleTime)
                    for (let subParamCounter = 0; subParamCounter < timingProperty.children.length; subParamCounter++) {
                        let subTimingProperty = timingProperty.children[subParamCounter];
                        if (subTimingProperty.nodeName == traceConfigDefines_1.XmlNodeTypes.Property) {
                            timingParameters[subTimingProperty.attributes[traceConfigDefines_1.XmlAttributes.Id].value] = subTimingProperty.attributes[traceConfigDefines_1.XmlAttributes.Value].value;
                        }
                    }
                }
            }
            return timingParameters;
        }
        /**
         * Returns a list with tracestarttriggers the given starttrigger element
         *
         * @private
         * @static
         * @param {Element} startTriggerXmlElement
         * @returns {Array<TraceStartTrigger>}
         * @memberof TraceConfigImport
         */
        static getStartTriggers(startTriggerXmlElement) {
            let startTriggers = new Array();
            for (let triggerCounter = 0; triggerCounter < startTriggerXmlElement.children.length; triggerCounter++) {
                let triggerGroup = startTriggerXmlElement.children[triggerCounter];
                if (triggerGroup.nodeName == traceConfigDefines_1.XmlNodeTypes.Group) {
                    let startTrigger = this.getStartTrigger(triggerGroup);
                    if (startTrigger != undefined) {
                        startTriggers.push(startTrigger);
                    }
                }
            }
            return startTriggers;
        }
        /**
         * Returns one starttrigger or undefined for the given starttrigger group element
         *
         * @private
         * @static
         * @param {Element} triggerGroup
         * @returns {TraceStartTrigger|undefined}
         * @memberof TraceConfigImport
         */
        static getStartTrigger(triggerGroup) {
            let condition = "";
            let dataPointName = "";
            let threshold = "";
            let window = "";
            for (let i = 0; i < triggerGroup.children.length; i++) {
                let child = triggerGroup.children[i];
                if (child.nodeName == traceConfigDefines_1.XmlNodeTypes.Property) {
                    if (child.attributes[traceConfigDefines_1.XmlAttributes.Id].value == traceConfigDefines_1.TraceConfigFilePropertyIds.TriggerDataPoint) {
                        if (child.attributes[traceConfigDefines_1.XmlAttributes.Value] != undefined) {
                            dataPointName = child.attributes[traceConfigDefines_1.XmlAttributes.Value].value;
                        }
                    }
                }
                else if (child.nodeName == traceConfigDefines_1.XmlNodeTypes.Selector) {
                    if (child.attributes[traceConfigDefines_1.XmlAttributes.Id].value == traceConfigDefines_1.TraceConfigFilePropertyIds.TriggerConditionSelection) {
                        condition = traceConfigValueConverter_1.TraceConfigValueConverter.getConditionId(child.attributes[traceConfigDefines_1.XmlAttributes.Value].value).toString();
                        for (let j = 0; j < child.children.length; j++) {
                            let conditionChild = child.children[j];
                            if (conditionChild.nodeName == traceConfigDefines_1.XmlNodeTypes.Property) {
                                let conditionChildId = conditionChild.attributes[traceConfigDefines_1.XmlAttributes.Id].value;
                                if (conditionChildId == traceConfigDefines_1.TraceConfigFilePropertyIds.TriggerThreshold) {
                                    threshold = conditionChild.attributes[traceConfigDefines_1.XmlAttributes.Value].value;
                                }
                                else if (conditionChildId == traceConfigDefines_1.TraceConfigFilePropertyIds.TriggerWindow) {
                                    window = conditionChild.attributes[traceConfigDefines_1.XmlAttributes.Value].value;
                                }
                            }
                        }
                    }
                }
            }
            // Don't add start triggers without datapointname
            if (dataPointName == "") {
                return undefined;
            }
            return new traceStartTrigger_1.TraceStartTrigger(condition, dataPointName, threshold, window);
        }
    };
    TraceConfigImport = TraceConfigImport_1 = __decorate([
        mco.role()
    ], TraceConfigImport);
    exports.TraceConfigImport = TraceConfigImport;
});
