var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var TraceConfigValueConverter_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigValueConverter = exports.ConditionIds = void 0;
    /**
     * Defines the trigger condition values which will be used in the trace configurations export/import format (e.g. coTRACE_IN_WINDOW_EVENT, ...)
     *
     * @class ConditionValueNames
     */
    let ConditionValueNames = class ConditionValueNames {
    };
    ConditionValueNames.InWindow = "coTRACE_IN_WINDOW_EVENT";
    ConditionValueNames.OutOfWindow = "coTRACE_OUT_OF_WINDOW_EVENT";
    ConditionValueNames.AboveThreshold = "coTRACE_ABOVE_THRESHOLD_EVENT";
    ConditionValueNames.BelowThreshold = "coTRACE_BELOW_THRESHOLD_EVENT";
    ConditionValueNames.EnterWindow = "coTRACE_ENTER_WINDOW_EVENT";
    ConditionValueNames.LeaveWindow = "coTRACE_LEAVE_WINDOW_EVENT";
    ConditionValueNames.GoesAboveWindow = "coTRACE_GOES_ABOVE_WINDOW_EVENT";
    ConditionValueNames.GoesBelowWindow = "coTRACE_GOES_BELOW_WINDOW_EVENT";
    ConditionValueNames = __decorate([
        mco.role()
    ], ConditionValueNames);
    /**
     * Defines the trigger condition values which will be used in mappCockpit/opc ua server (e.g. 20, 30, ...)
     *
     * @class ConditionIds
     */
    let ConditionIds = class ConditionIds {
    };
    ConditionIds.InWindow = 20;
    ConditionIds.OutOfWindow = 30;
    ConditionIds.AboveThreshold = 40;
    ConditionIds.BelowThreshold = 50;
    ConditionIds.EnterWindow = 24;
    ConditionIds.LeaveWindow = 34;
    ConditionIds.GoesAboveWindow = 44;
    ConditionIds.GoesBelowWindow = 54;
    ConditionIds = __decorate([
        mco.role()
    ], ConditionIds);
    exports.ConditionIds = ConditionIds;
    let TraceConfigValueConverter = TraceConfigValueConverter_1 = class TraceConfigValueConverter {
        /**
         * Returns the condition id for the given export/import format condition define (e.g. coTRACE_IN_WINDOW_EVENT => 20)
         *
         * @static
         * @param {string} conditionDefine
         * @returns {number}
         * @memberof TraceConfigValueConverter
         */
        static getConditionId(conditionDefine) {
            switch (conditionDefine) {
                case ConditionValueNames.InWindow: return ConditionIds.InWindow;
                case ConditionValueNames.OutOfWindow: return ConditionIds.OutOfWindow;
                case ConditionValueNames.AboveThreshold: return ConditionIds.AboveThreshold;
                case ConditionValueNames.BelowThreshold: return ConditionIds.BelowThreshold;
                case ConditionValueNames.EnterWindow: return ConditionIds.EnterWindow;
                case ConditionValueNames.LeaveWindow: return ConditionIds.LeaveWindow;
                case ConditionValueNames.GoesAboveWindow: return ConditionIds.GoesAboveWindow;
                case ConditionValueNames.GoesBelowWindow: return ConditionIds.GoesBelowWindow;
            }
            return 0;
        }
        /**
         * Returns the export/import format condition define for the given condition id (e.g. 20 => coTRACE_IN_WINDOW_EVENT)
         *
         * @static
         * @param {string} conditionId
         * @returns {string}
         * @memberof TraceConfigValueConverter
         */
        static getConditionDefine(conditionId) {
            let conditionIdNumber = parseInt(conditionId, 10);
            switch (conditionIdNumber) {
                case ConditionIds.InWindow: return ConditionValueNames.InWindow;
                case ConditionIds.OutOfWindow: return ConditionValueNames.OutOfWindow;
                case ConditionIds.AboveThreshold: return ConditionValueNames.AboveThreshold;
                case ConditionIds.BelowThreshold: return ConditionValueNames.BelowThreshold;
                case ConditionIds.EnterWindow: return ConditionValueNames.EnterWindow;
                case ConditionIds.LeaveWindow: return ConditionValueNames.LeaveWindow;
                case ConditionIds.GoesAboveWindow: return ConditionValueNames.GoesAboveWindow;
                case ConditionIds.GoesBelowWindow: return ConditionValueNames.GoesBelowWindow;
            }
            return "";
        }
        /**
         * Returns the condition display name for the given condition id (e.g. 20 => IN_WINDOW)
         *
         * @static
         * @param {string} conditionId
         * @returns {string}
         * @memberof TraceConfigValueConverter
         */
        static getTriggerConditionDisplayName(conditionId) {
            let conditionIdNumber = parseInt(conditionId, 10);
            switch (conditionIdNumber) {
                case ConditionIds.InWindow: return "IN_WINDOW";
                case ConditionIds.OutOfWindow: return "OUT_OF_WINDOW";
                case ConditionIds.AboveThreshold: return "ABOVE_THRESHOLD";
                case ConditionIds.BelowThreshold: return "BELOW_THRESHOLD";
                case ConditionIds.EnterWindow: return "ENTER_WINDOW";
                case ConditionIds.LeaveWindow: return "LEAVE_WINDOW";
                case ConditionIds.GoesAboveWindow: return "GOES_ABOVE_WINDOW";
                case ConditionIds.GoesBelowWindow: return "GOES_BELOW_WINDOW";
            }
            return "";
        }
        /**
         * Returns the task class number for the given export/import format task class define(e.g. TrcCyclic_1 => 1)
         *
         * @static
         * @param {string} taskClassDefine
         * @returns {string}
         * @memberof TraceConfigValueConverter
         */
        static getPvTaskClassNumber(taskClassDefine) {
            return taskClassDefine.replace(TraceConfigValueConverter_1._taskClassCyclePrefix, "");
        }
        /**
         * Returns the export/import format define for task class number (e.g. 1 => TrcCyclic_1)
         *
         * @static
         * @param {string} taskClassNumber
         * @returns {string}
         * @memberof TraceConfigValueConverter
         */
        static getPvTaskClassDefine(taskClassNumber) {
            return TraceConfigValueConverter_1._taskClassCyclePrefix + taskClassNumber;
        }
    };
    /**
     * Prefix definition for taskclass cycle define => "TrcCyclic_"
     *
     * @private
     * @static
     * @memberof TraceConfigValueConverter
     */
    TraceConfigValueConverter._taskClassCyclePrefix = "TrcCyclic_";
    TraceConfigValueConverter = TraceConfigValueConverter_1 = __decorate([
        mco.role()
    ], TraceConfigValueConverter);
    exports.TraceConfigValueConverter = TraceConfigValueConverter;
});
