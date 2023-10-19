var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/packageConversion/basePackageConverter", "../../../common/packageConversion/enum/objectTypeEnum", "../../../common/packageConversion/arrayConversion", "../../../common/persistence/settings", "../../../common/packageConversion/stringConversion", "../../../common/packageConversion/numberOrStringToStringConversion"], function (require, exports, basePackageConverter_1, objectTypeEnum_1, arrayConversion_1, settings_1, stringConversion_1, numberOrStringToStringConversion_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CalculationDataPackageConverter = void 0;
    /**
     * The package converter handling calculation data info setting.
     *
     * @class CalculationDataPackageConverter
     * @extends {BasePackageConverter}
     */
    let CalculationDataPackageConverter = class CalculationDataPackageConverter extends basePackageConverter_1.BasePackageConverter {
        /**
         * Creates an instance of CalculationDataPackageConverter.
         *
         * @memberof CalculationDataPackageConverter
         */
        constructor() {
            super(objectTypeEnum_1.ObjectType.CALCULATION, "CalculationDataInfo");
            this.conversionInfoContainer.addConversion("1.0", 1, [
                new stringConversion_1.StringConversion(["uniqueId", "type"], ["uniqueId", "type"]),
                new arrayConversion_1.ArrayConversion(["inputDataValues"], ["inputDataValues"], new numberOrStringToStringConversion_1.NumberOrStringToStringConversion([], []))
            ]);
            this.conversionInfoContainer.addConversion("2.0", 2, [
                new arrayConversion_1.ArrayConversion(["inputDataIds", "inputDataValues"], ["inputDataIds", "inputDataValues"], new numberOrStringToStringConversion_1.NumberOrStringToStringConversion([], [])),
                new stringConversion_1.StringConversion(["type", "uniqueId"], ["type", "uniqueId"])
            ]);
            this.settingsUpgradeMap.set(1, this.upgradeV1Setting.bind(this));
        }
        /**
         * Creates and returns the substitution map for matching calculator display string to calculator type.
         *
         * @private
         * @returns {Map<string, string>}
         * @memberof CalculationDataPackageConverter
         */
        getDisplayStringToCalculationTypeMapV1() {
            let v1SubstitutionMap = new Map();
            v1SubstitutionMap.set("Absolute value |a|", "absolute value");
            v1SubstitutionMap.set("Addition a+b", "add");
            v1SubstitutionMap.set("Bitwise AND", "bitwise and");
            v1SubstitutionMap.set("Atan2(a)", "atan2");
            v1SubstitutionMap.set("Cos(a)", "cos");
            v1SubstitutionMap.set("Differentiate dy/dt", "differentiate");
            v1SubstitutionMap.set("Division a/b", "division");
            v1SubstitutionMap.set("Equal to a = b", "equal to");
            v1SubstitutionMap.set("Exponential a" + "\u207F", "exponentiation");
            v1SubstitutionMap.set("FFT", "fft bilstein");
            v1SubstitutionMap.set("Greater than a > b", "greater than");
            v1SubstitutionMap.set("Less than a < b", "less than");
            v1SubstitutionMap.set("Limit", "max min");
            v1SubstitutionMap.set("LP Bessel", "lp bessel");
            v1SubstitutionMap.set("LP Butterworth", "lp butterworth");
            v1SubstitutionMap.set("Max (a,b)", "max");
            v1SubstitutionMap.set("Min (a,b)", "min");
            v1SubstitutionMap.set("Modulo", "modulo");
            v1SubstitutionMap.set("Multiplication a*b", "multiplication");
            v1SubstitutionMap.set("Bitwise NOT", "bitwise not");
            v1SubstitutionMap.set("Bitwise OR", "bitwise or");
            v1SubstitutionMap.set("Shift time axis", "shift time axis");
            v1SubstitutionMap.set("Sin(a)", "sin");
            v1SubstitutionMap.set("Square root √a", "square root ");
            v1SubstitutionMap.set("Math expression", "stringmathjs");
            v1SubstitutionMap.set("Subtraction a-b", "sub");
            v1SubstitutionMap.set("Time stamp synchronization", "timeStampSync");
            v1SubstitutionMap.set("Vector length √(a\u00B2 + b\u00B2)", "vector ");
            v1SubstitutionMap.set("XY", "xy");
            return v1SubstitutionMap;
        }
        /**
         * Returns the input data ids based on the calculator display string.
         *
         * @private
         * @param {string} calculationType The calculator type for which the inputDataIds are requested
         * @returns {Array<string>}
         * @memberof CalculationDataPackageConverter
         *
         * Review Lukas Obersamer:
         * The cyclomatic complexity of this function is too high, but that does not reflect the complexity for humans to understand it.
         * The complexity of understing this method is in fact super simple. Therefore the method may remain in this form.
         * Furthermore, this is a part that covers to update of one format to another. Changing to a new format will not require to touch this code. Therefore the expected rate of change is minimal.
         * In the future, similar topics should be solvel using different solutions, such as a map.
         */
        getInputDataIdsForTypeV1(calculationType) {
            let inputDataIds = new Array();
            switch (calculationType) {
                case "absolute value":
                    inputDataIds.push("InputSignalA");
                    break;
                case "add":
                    inputDataIds.push("SummandA");
                    inputDataIds.push("SummandB");
                    break;
                case "bitwise and":
                    inputDataIds.push("InputSignalOrConstantA");
                    inputDataIds.push("InputSignalOrConstantB");
                    break;
                case "atan2":
                    inputDataIds.push("InputSignalA");
                    break;
                case "cos":
                    inputDataIds.push("InputSignalA");
                    break;
                case "differentiate":
                    inputDataIds.push("InputSignal");
                    break;
                case "division":
                    inputDataIds.push("DividendA");
                    inputDataIds.push("DivisorB");
                    inputDataIds.push("DivisionByZero");
                    break;
                case "equal to":
                    inputDataIds.push("InputSignalOrConstantA");
                    inputDataIds.push("InputSignalOrConstantB");
                    break;
                case "exponentiation":
                    inputDataIds.push("InputSignalA");
                    inputDataIds.push("ConstantValueN");
                    break;
                case "fft bilstein":
                    inputDataIds.push("InputSignal");
                    break;
                case "greater than":
                    inputDataIds.push("InputSignalOrConstantA");
                    inputDataIds.push("InputSignalOrConstantB");
                    break;
                case "less than":
                    inputDataIds.push("InputSignalOrConstantA");
                    inputDataIds.push("InputSignalOrConstantB");
                    break;
                case "max min":
                    inputDataIds.push("UpperLimit");
                    inputDataIds.push("LowerLimit");
                    inputDataIds.push("InputSignal");
                    break;
                case "lp bessel":
                    inputDataIds.push("Order");
                    inputDataIds.push("CutoffFrequency");
                    inputDataIds.push("InputSignal");
                    break;
                case "lp butterworth":
                    inputDataIds.push("Order");
                    inputDataIds.push("CutoffFrequency");
                    inputDataIds.push("InputSignal");
                    break;
                case "max":
                    inputDataIds.push("InputSignalOrConstantA");
                    inputDataIds.push("InputSignalOrConstantB");
                    break;
                case "min":
                    inputDataIds.push("InputSignalOrConstantA");
                    inputDataIds.push("InputSignalOrConstantB");
                    break;
                case "modulo":
                    inputDataIds.push("DividendA");
                    inputDataIds.push("DivisorB");
                    inputDataIds.push("DivisionByZero");
                    break;
                case "multiplication":
                    inputDataIds.push("MultiplicandA");
                    inputDataIds.push("MultiplierB");
                    break;
                case "bitwise not":
                    inputDataIds.push("InputSignal");
                    break;
                case "bitwise or":
                    inputDataIds.push("InputSignalOrConstantA");
                    inputDataIds.push("InputSignalOrConstantB");
                    break;
                case "shift time axis":
                    inputDataIds.push("InputSignalA");
                    inputDataIds.push("DelayTimeB");
                    break;
                case "sin":
                    inputDataIds.push("InputSignalA");
                    break;
                case "square root ":
                    inputDataIds.push("InputSignalA");
                    break;
                case "stringmathjs":
                    inputDataIds.push("CalculatingValues");
                    inputDataIds.push("CalculatingTime");
                    inputDataIds.push("InputSignalOrNumberA");
                    inputDataIds.push("InputSignalOrNumberB");
                    inputDataIds.push("InputSignalOrNumberC");
                    inputDataIds.push("InputSignalOrNumberD");
                    inputDataIds.push("InputSignalOrNumberE");
                    break;
                case "sub":
                    inputDataIds.push("MinuendA");
                    inputDataIds.push("SubtrahendB");
                    break;
                case "timeStampSync":
                    inputDataIds.push("InputSignalAToSynchronizeTimeStamps");
                    inputDataIds.push("InputSignalBWithReferenceTimeStamps");
                    break;
                case "vector ":
                    inputDataIds.push("InputSignalA");
                    inputDataIds.push("InputSignalB");
                    break;
                case "xy":
                    inputDataIds.push("XSignal");
                    inputDataIds.push("YSignal");
                    break;
            }
            return inputDataIds;
        }
        /**
         * Upgrades the CalculationDataInfo Setting from version 1.0 to version 2.0
         *
         * @private
         * @param {ISettings} settingData
         * @returns {ISettings}
         * @memberof CalculationDataPackageConverter
         */
        upgradeV1Setting(settingData) {
            let setting = settings_1.Settings.create(settingData);
            let upgradedSetting = new settings_1.Settings(this.settingsType, "2.0");
            // set uniqueId field to updated setting without changes
            let uniqueId = setting.getValue("uniqueId");
            upgradedSetting.setValue("uniqueId", uniqueId);
            // set inputDataValues field to updated setting without changes
            let inputDataValues = setting.getValue("inputDataValues");
            upgradedSetting.setValue("inputDataValues", inputDataValues);
            // set type field to updated setting and replace the old value displaystring with the new value calculator type
            let type = setting.getValue("type");
            let substitutionMap = this.getDisplayStringToCalculationTypeMapV1();
            type = substitutionMap.get(type);
            if (type !== undefined) {
                upgradedSetting.setValue("type", type);
            }
            else {
                throw new Error("no calculation type for calculation display string found");
            }
            // set inputDataIds field to updated setting and generate its values based on the calculator type
            // fiels didnt exist on old settings version
            let inputDataIds = this.getInputDataIdsForTypeV1(type);
            if (inputDataIds.length > 0) {
                upgradedSetting.setValue("inputDataIds", inputDataIds);
            }
            else {
                throw new Error("no input data ids for calculation type found");
            }
            return upgradedSetting;
        }
    };
    CalculationDataPackageConverter = __decorate([
        mco.role()
    ], CalculationDataPackageConverter);
    exports.CalculationDataPackageConverter = CalculationDataPackageConverter;
});
