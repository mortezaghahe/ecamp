var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../models/diagnostics/trace/traceConfig/traceConfigValueConverter"], function (require, exports, traceConfigValueConverter_1) {
    "use strict";
    var TriggerDescriptionProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TriggerDescriptionProvider = void 0;
    let TriggerDescriptionProvider = TriggerDescriptionProvider_1 = class TriggerDescriptionProvider {
        /**
         * Returns an html string with the trigger condition description
         *
         * @static
         * @param {number} triggerConditionId
         * @returns {string}
         * @memberof TriggerDescriptionProvider
         */
        static getHtmlDescription(triggerConditionId) {
            /* tslint:disable:max-func-body-length */ // disabled due to switch case
            let triggerConditionImagePath = TriggerDescriptionProvider_1.getTriggerConditionImagePath(triggerConditionId);
            let htmlData = "";
            switch (triggerConditionId) {
                case traceConfigValueConverter_1.ConditionIds.InWindow:
                    htmlData = `<b>IN_WINDOW</b></br></br>The trigger event occurs if the value of the data point meets the following conditions:</br></br>&quot;Value 
			    &le; Threshold + Window&quot; and</br>&quot;Value &ge; Threshold - Window&quot;</br></br><img
                src="` + triggerConditionImagePath + `">`;
                    break;
                case traceConfigValueConverter_1.ConditionIds.OutOfWindow:
                    htmlData = `<b>OUT_OF_WINDOW</b></br></br>The trigger event occurs if the value of the data point meets the following conditions:</br></br>&quot;Value 
                &gt; Threshold + Window&quot; or</br>&quot;Value &lt; Threshold - Window&quot;</br></br><img
                src="` + triggerConditionImagePath + `">`;
                    break;
                case traceConfigValueConverter_1.ConditionIds.AboveThreshold:
                    htmlData = `<b>ABOVE_THRESHOLD</b></br></br>The trigger event occurs if the value of the data point meets the following condition:</br></br>&quot;Value 
                &gt; Threshold + Window&quot;</br></br><img src="` + triggerConditionImagePath + `">`;
                    break;
                case traceConfigValueConverter_1.ConditionIds.BelowThreshold:
                    htmlData = `<b>BELOW_THRESHOLD</b></br></br>The trigger event occurs if the value of the data point meets the following condition:</br></br>&quot;Value 
                &lt; Threshold - Window&quot;</br></br><img src="` + triggerConditionImagePath + `">`;
                    break;
                case traceConfigValueConverter_1.ConditionIds.EnterWindow:
                    htmlData = `<b>ENTER_WINDOW</b></br></br>The trigger event occurs if the value for the data point</br>goes below the upper window 
                limit &quot;Threshold + Window&quot; or</br>goes above the lower window limit &quot;Threshold 
                - Window&quot;</br>(after being outside the window before) and is then within the 
                window. If the value of the data point is already within the window when the 
                trace is enabled, then the trace is not yet started.</br></br><img src="` + triggerConditionImagePath + `">`;
                    break;
                case traceConfigValueConverter_1.ConditionIds.LeaveWindow:
                    htmlData = `<b>LEAVE_WINDOW</b></br></br>The trigger event occurs if the value for the data point</br>goes above the upper window 
                limit &quot;Threshold + Window&quot; or</br>goes below the lower window limit &quot;Threshold 
                - Window&quot;</br>(after being inside the window before) and is then outside the 
                window. If the value of the data point is already outside the window when the trace is enabled, then 
                the trace is not yet started.</br></br><img src="` + triggerConditionImagePath + `">`;
                    break;
                case traceConfigValueConverter_1.ConditionIds.GoesAboveWindow:
                    htmlData = `<b>GOES_ABOVE_WINDOW</b></br></br>The trigger event occurs if the value of the data point goes goes above the upper window 
                limit &quot;Threshold + Window&quot;.</br>If the value of 
                the trigger parameter is already above the window while the trace is being enabled, then the trace is not yet started.</br></br><img
                src="` + triggerConditionImagePath + `">`;
                    break;
                case traceConfigValueConverter_1.ConditionIds.GoesBelowWindow:
                    htmlData = `<b>GOES_BELOW_WINDOW</b></br></br>The trigger event occurs if the value of the data point goes below the lower window 
                limit &quot;Threshold - Window&quot;.</br>If the value of 
                the trigger parameter is already below the window while the trace is being enabled, then the trace is not yet started.</br></br><img
                src="` + triggerConditionImagePath + `">`;
                    break;
                default:
                    htmlData = "";
                    break;
            }
            return htmlData;
            /* tslint:enable:max-func-body-length */
        }
        /**
         * Returns the trigger condition image path for the given trigger condition id
         *
         * @private
         * @static
         * @param {number} triggerConditionId
         * @returns {string}
         * @memberof TriggerDescriptionProvider
         */
        static getTriggerConditionImagePath(triggerConditionId) {
            /* tslint:disable:max-func-body-length */ // disabled due to switch case
            let triggerConditionImagePath = "widgets/traceConfigTriggerWidget/resources/images/";
            switch (triggerConditionId) {
                case traceConfigValueConverter_1.ConditionIds.InWindow:
                    triggerConditionImagePath += "IN_WINDOW.svg";
                    break;
                case traceConfigValueConverter_1.ConditionIds.OutOfWindow:
                    triggerConditionImagePath += "OUT_WINDOW.svg";
                    break;
                case traceConfigValueConverter_1.ConditionIds.AboveThreshold:
                    triggerConditionImagePath += "ABOVE_WINDOW.svg";
                    break;
                case traceConfigValueConverter_1.ConditionIds.BelowThreshold:
                    triggerConditionImagePath += "BELOW_WINDOW.svg";
                    break;
                case traceConfigValueConverter_1.ConditionIds.EnterWindow:
                    triggerConditionImagePath += "IN_WINDOW_ENTRY.svg";
                    break;
                case traceConfigValueConverter_1.ConditionIds.LeaveWindow:
                    triggerConditionImagePath += "OUT_WINDOW_ENTRY.svg";
                    break;
                case traceConfigValueConverter_1.ConditionIds.GoesAboveWindow:
                    triggerConditionImagePath += "ABOVE_WINDOW_ENTRY.svg";
                    break;
                case traceConfigValueConverter_1.ConditionIds.GoesBelowWindow:
                    triggerConditionImagePath += "BELOW_WINDOW_ENTRY.svg";
                    break;
                default:
                    triggerConditionImagePath = "";
                    break;
            }
            return triggerConditionImagePath;
            /* tslint:enable:max-func-body-length */
        }
    };
    TriggerDescriptionProvider = TriggerDescriptionProvider_1 = __decorate([
        mco.role()
    ], TriggerDescriptionProvider);
    exports.TriggerDescriptionProvider = TriggerDescriptionProvider;
});
