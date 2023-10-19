var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./traceConfigValueConverter", "./traceConfigDefines"], function (require, exports, traceConfigValueConverter_1, traceConfigDefines_1) {
    "use strict";
    var TraceConfigExport_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigExport = void 0;
    let TraceConfigExport = TraceConfigExport_1 = class TraceConfigExport {
        /**
         * Creates an instance of TraceConfigExport.
         * @memberof TraceConfigExport
         */
        constructor() {
        }
        /**
         * Returns an xml string with the trace configuration data
         *
         * @param {TraceConfigurationData} traceConfigurationData
         * @returns {string}
         * @memberof TraceConfigExport
         */
        getXmlDataFromTraceConfig(traceConfigurationData) {
            // init xml document
            this._xmlDoc = document.implementation.createDocument("", "", null);
            // add body data to xml document
            let configuration = this._xmlDoc.createElement(traceConfigDefines_1.XmlNodeTypes.Configuration);
            this._xmlDoc.appendChild(configuration);
            let element = this.createNode(traceConfigDefines_1.XmlNodeTypes.Element, "NewTraceConfig");
            element.setAttribute("Type", "tracecfg");
            configuration.appendChild(element);
            let property = this.createNode(traceConfigDefines_1.XmlNodeTypes.Property, "mappCockpitTypeID", "TraceCfg");
            element.appendChild(property);
            // add traceconfig data to xml document
            this.addTraceConfigData(element, traceConfigurationData);
            // format xml document data (e.g. add carriage return line feed)
            this._xmlDoc = TraceConfigExport_1.transformXML(this._xmlDoc);
            // set xml version and encoding
            let xmlString = '<?xml version="1.0" encoding="utf-8"?>\r\n';
            // add xml data from xml document
            let serializer = new XMLSerializer();
            xmlString += serializer.serializeToString(this._xmlDoc);
            return xmlString;
        }
        /**
         * Makes a transformation of the xml document to get carriage return line feeds in serialized xml string
         *
         * @private
         * @static
         * @param {*} xmlDoc
         * @returns {Document}
         * @memberof TraceConfigExport
         */
        static transformXML(xmlDoc) {
            var xsltDoc = new DOMParser().parseFromString([
                // describes how we want to modify the XML - indent everything
                '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
                '  <xsl:strip-space elements="*"/>',
                '  <xsl:template match="para[content-style][not(text())]">',
                '    <xsl:value-of select="normalize-space(.)"/>',
                '  </xsl:template>',
                '  <xsl:template match="node()|@*">',
                '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
                '  </xsl:template>',
                '  <xsl:output indent="yes"/>',
                '</xsl:stylesheet>',
            ].join('\n'), 'application/xml');
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xsltDoc);
            return xsltProcessor.transformToDocument(xmlDoc);
        }
        /**
         * Adds all trace configuration data to the element
         *
         * @private
         * @param {HTMLElement} element
         * @param {*} traceConfigurationData
         * @memberof TraceConfigExport
         */
        addTraceConfigData(element, traceConfigurationData) {
            // add datapoints
            let groupDataPoints = this.createNode(traceConfigDefines_1.XmlNodeTypes.Group, traceConfigDefines_1.TraceConfigFileGroupIds.DataPointList);
            this.addDataPoints(groupDataPoints, traceConfigurationData.dataPoints);
            element.appendChild(groupDataPoints);
            // add TimingSettings
            let groupTimings = this.createNode(traceConfigDefines_1.XmlNodeTypes.Group, traceConfigDefines_1.TraceConfigFileGroupIds.TimingSettings);
            this.addTimingSettings(groupTimings, traceConfigurationData.timingParameters);
            element.appendChild(element.appendChild(groupTimings));
            // add TriggerSettings
            let groupTriggers = this.createNode(traceConfigDefines_1.XmlNodeTypes.Group, traceConfigDefines_1.TraceConfigFileGroupIds.TriggerSettings);
            this.addStartTriggers(groupTriggers, traceConfigurationData.startTriggers);
            element.appendChild(groupTriggers);
        }
        /**
         * Adds all datapoints to the groupDataPoints element
         *
         * @private
         * @param {HTMLElement} groupDataPoints
         * @param {TraceDataPoint[]} traceConfigurationDataPoints
         * @memberof TraceConfigExport
         */
        addDataPoints(groupDataPoints, traceConfigurationDataPoints) {
            for (let i = 0; i < traceConfigurationDataPoints.length; i++) {
                let dataPointPropertyId = traceConfigDefines_1.TraceConfigFilePropertyIds.DataPoint + "[" + (i + 1) + "]";
                let datapointProperty = this.createNode(traceConfigDefines_1.XmlNodeTypes.Property, dataPointPropertyId, traceConfigurationDataPoints[i].dataPointName);
                groupDataPoints.appendChild(datapointProperty);
            }
        }
        /**
         * Adds all timing settings to the groupTimings element
         *
         * @private
         * @param {HTMLElement} groupTimings
         * @param {MappCockpitComponentParameter[]} timingParameters
         * @memberof TraceConfigExport
         */
        addTimingSettings(groupTimings, timingParameters) {
            // Add timing settings parameter in the following order
            this.addTimingNode(groupTimings, traceConfigDefines_1.TraceConfigBrowseNameIds.TotalRecordingTime, timingParameters);
            this.addTimingNode(groupTimings, traceConfigDefines_1.TraceConfigBrowseNameIds.TriggerOffsetTime, timingParameters);
            this.addTimingNode(groupTimings, traceConfigDefines_1.TraceConfigBrowseNameIds.PlcTaskClass, timingParameters);
            this.addTimingNode(groupTimings, traceConfigDefines_1.TraceConfigBrowseNameIds.AcoposSamplingTime, timingParameters);
        }
        /**
         * Adds a timing node with the given information to the given group node
         *
         * @private
         * @param {HTMLElement} groupTimings
         * @param {string} parameterBrowseName
         * @param {MappCockpitComponentParameter[]} timingParameters
         * @memberof TraceConfigExport
         */
        addTimingNode(groupTimings, parameterBrowseName, timingParameters) {
            let timingNode = this.createTimingNode(parameterBrowseName, timingParameters);
            if (timingNode != undefined) {
                groupTimings.appendChild(timingNode);
            }
        }
        /**
         * Adds all start triggers to the groupTriggers element
         *
         * @private
         * @param {HTMLElement} groupTriggers
         * @param {TraceStartTrigger[]} startTriggers
         * @memberof TraceConfigExport
         */
        addStartTriggers(groupTriggers, startTriggers) {
            for (let i = 0; i < startTriggers.length; i++) {
                // add start trigger group
                let triggerGroup = this._xmlDoc.createElement(traceConfigDefines_1.XmlNodeTypes.Group);
                triggerGroup.setAttribute(traceConfigDefines_1.XmlAttributes.Id, traceConfigDefines_1.TraceConfigFilePropertyIds.TriggerCondition + "[" + (i + 1) + "]");
                groupTriggers.appendChild(triggerGroup);
                // add start trigger datapointname
                let triggerDataPointNameProperty = this.createNode(traceConfigDefines_1.XmlNodeTypes.Property, traceConfigDefines_1.TraceConfigFilePropertyIds.TriggerDataPoint, startTriggers[i].dataPointName);
                triggerGroup.appendChild(triggerDataPointNameProperty);
                // add start trigger condition selector ...
                let triggerConditionDisplayName = traceConfigValueConverter_1.TraceConfigValueConverter.getConditionDefine(startTriggers[i].condition);
                let triggerConditonSelector = this.createNode(traceConfigDefines_1.XmlNodeTypes.Selector, traceConfigDefines_1.TraceConfigFilePropertyIds.TriggerConditionSelection, triggerConditionDisplayName);
                triggerGroup.appendChild(triggerConditonSelector);
                // ... and add the sub properties to the trigger condition selector (e.g. threshold, window)
                let triggerThresholdProperty = this.createNode(traceConfigDefines_1.XmlNodeTypes.Property, traceConfigDefines_1.TraceConfigFilePropertyIds.TriggerThreshold, startTriggers[i].threshold);
                let triggerWindowProperty = this.createNode(traceConfigDefines_1.XmlNodeTypes.Property, traceConfigDefines_1.TraceConfigFilePropertyIds.TriggerWindow, startTriggers[i].window);
                triggerConditonSelector.appendChild(triggerThresholdProperty);
                triggerConditonSelector.appendChild(triggerWindowProperty);
            }
        }
        /**
         * Creates an xml element with the given type, id and value if defined
         *
         * @private
         * @param {string} type
         * @param {string} id
         * @param {(string|undefined)} value
         * @returns {HTMLElement}
         * @memberof TraceConfigExport
         */
        createNode(type, id, value = undefined) {
            // create xml element
            let node = this._xmlDoc.createElement(type);
            // add id attribute
            node.setAttribute(traceConfigDefines_1.XmlAttributes.Id, id);
            // add value attribute if available
            if (value != undefined) {
                node.setAttribute(traceConfigDefines_1.XmlAttributes.Value, value);
            }
            return node;
        }
        /**
         * Creates an xml node with timing parameter information for the given timing parameter browsename
         * Adds some xml sub nodes if needed for a timing parameter
         *
         * @private
         * @param {string} parameterBrowseName
         * @param {MappCockpitComponentParameter[]} timingParameters
         * @returns {HTMLElement}
         * @memberof TraceConfigExport
         */
        createTimingNode(parameterBrowseName, timingParameters) {
            // get timing parameter for the given browsename
            let timingParameter = timingParameters.filter((traceParameter) => { return traceParameter.browseName === parameterBrowseName; })[0];
            if (timingParameter == undefined) {
                return undefined;
            }
            // get id for import/export format
            let timingParameterId = TraceConfigExport_1.getTimingParamId(timingParameter.browseName);
            let timingParameterValue = timingParameter.value;
            let timingParameterType = traceConfigDefines_1.XmlNodeTypes.Property;
            let pvTaskClassSubNode = undefined;
            if (timingParameterId == traceConfigDefines_1.TraceConfigFilePropertyIds.PvTaskClass) {
                // create Selector instead of Property for PvTaskClass
                timingParameterType = traceConfigDefines_1.XmlNodeTypes.Selector;
                // convert task class number to export/import format define
                timingParameterValue = traceConfigValueConverter_1.TraceConfigValueConverter.getPvTaskClassDefine(timingParameterValue);
                // create PvTaskClass sub node (e.g. PlcSampleTime)
                pvTaskClassSubNode = this.createTimingNode(traceConfigDefines_1.TraceConfigBrowseNameIds.PlcSampleTime, timingParameters);
            }
            let node = this.createNode(timingParameterType, timingParameterId, timingParameterValue);
            if (pvTaskClassSubNode != undefined) {
                node.appendChild(pvTaskClassSubNode);
            }
            return node;
        }
        /**
         * Returns the id of a timing parameter which will be used in the export/import file format of the trace configuration for the given browsename
         *
         * @static
         * @param {string} browseName
         * @returns {string}
         * @memberof TraceConfigExport
         */
        static getTimingParamId(browseName) {
            if (browseName == traceConfigDefines_1.TraceConfigBrowseNameIds.AcoposSamplingTime) {
                return traceConfigDefines_1.TraceConfigFilePropertyIds.AcoposSamplingTime;
            }
            if (browseName == traceConfigDefines_1.TraceConfigBrowseNameIds.PlcTaskClass) {
                return traceConfigDefines_1.TraceConfigFilePropertyIds.PvTaskClass;
            }
            if (browseName == traceConfigDefines_1.TraceConfigBrowseNameIds.TotalRecordingTime) {
                return traceConfigDefines_1.TraceConfigFilePropertyIds.TotalRecordingTime;
            }
            if (browseName == traceConfigDefines_1.TraceConfigBrowseNameIds.TriggerOffsetTime) {
                return traceConfigDefines_1.TraceConfigFilePropertyIds.TriggerOffsetTime;
            }
            if (browseName == traceConfigDefines_1.TraceConfigBrowseNameIds.PlcSampleTime) {
                return traceConfigDefines_1.TraceConfigFilePropertyIds.PlcSampleTime;
            }
            return "";
        }
    };
    TraceConfigExport = TraceConfigExport_1 = __decorate([
        mco.role()
    ], TraceConfigExport);
    exports.TraceConfigExport = TraceConfigExport;
});
