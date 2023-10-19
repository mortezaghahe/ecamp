var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../persistence/settings", "../../models/chartManagerDataModel/chartPackageConverter", "../../models/common/calculatorProvider/calculationDataPackageConverter", "../../models/signalManagerDataModel/categoryPackageConverter", "../../models/chartManagerDataModel/chartManagerDataModelPackageConverter", "../../widgets/common/states/cursorStatesPackageConverter", "../../models/chartManagerDataModel/scalePackageConverter", "../../models/signalManagerDataModel/serieGroupPackageConverter", "../../models/common/seriesProvider/seriesProviderPackageConverter", "../../models/signalManagerDataModel/signalManagerDataModelPackageConverter", "../../models/common/signal/signalPackageConverter", "../../models/common/series/ytSeriesPackageConverter", "../../models/common/series/xySeriesPackageConverter", "../../models/common/series/fftSeriesPackageConverter", "./package", "./enum/additionalMetaKeys"], function (require, exports, settings_1, chartPackageConverter_1, calculationDataPackageConverter_1, categoryPackageConverter_1, chartManagerDataModelPackageConverter_1, cursorStatesPackageConverter_1, scalePackageConverter_1, serieGroupPackageConverter_1, seriesProviderPackageConverter_1, signalManagerDataModelPackageConverter_1, signalPackageConverter_1, ytSeriesPackageConverter_1, xySeriesPackageConverter_1, fftSeriesPackageConverter_1, package_1, additionalMetaKeys_1) {
    "use strict";
    var PackageConversionController_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PackageConversionController = void 0;
    /**
     * The Controller to handle the conversion from settings format to package format and vice versa.
     *
     * @class PackageConversionController
     */
    let PackageConversionController = PackageConversionController_1 = class PackageConversionController {
        /**
         * Creates an instance of PackageConversionController.
         * The constructor is set to private to ensure only one instance of the PackageConversionController exists at a time (Singleton).
         *
         * @memberof PackageConversionController
         */
        constructor() {
            this.converterPool = [
                new calculationDataPackageConverter_1.CalculationDataPackageConverter(),
                new categoryPackageConverter_1.CategoryPackageConverter(),
                new chartPackageConverter_1.ChartPackageConverter(),
                new chartManagerDataModelPackageConverter_1.ChartManagerDataModelPackageConverter(),
                new cursorStatesPackageConverter_1.CursorStatesPackageConverter(),
                new scalePackageConverter_1.ScalePackageConverter(),
                new serieGroupPackageConverter_1.SerieGroupPackageConverter(),
                new seriesProviderPackageConverter_1.SeriesProviderPackageConverter(),
                new signalManagerDataModelPackageConverter_1.SignalManagerDataModelPackageConverter(),
                new signalPackageConverter_1.SignalPackageConverter(),
                new ytSeriesPackageConverter_1.YTSeriesPackageConverter(),
                new xySeriesPackageConverter_1.XYSeriesPackageConverter(),
                new fftSeriesPackageConverter_1.FFTSeriesPackageConverter()
            ];
            this.packageArray = new Array();
            this.settingsMap = new Map();
        }
        /**
         * Returns the current Instance of the PackageConversionController.
         * If no instance exists, it is created.
         *
         * @static
         * @returns {PackageConversionController}
         * @memberof PackageConversionController
         */
        static getInstance() {
            if (this.instance == null) {
                this.instance = new PackageConversionController_1();
                this.idCounter = 0;
            }
            return this.instance;
        }
        /**
         * Resets the instance of the PackageConversionController.
         *
         * @static
         * @memberof PackageConversionController
         */
        static resetInstance() {
            this.instance = null;
            this.idCounter = 0;
        }
        /**
         * Returns the current available id and increments the counter it is taken from.
         *
         * @static
         * @returns {number}
         * @memberof PackageConversionController
         */
        static getId() {
            return this.idCounter++;
        }
        /**
         * Schedules a setting for conversion.
         * If a conversion for this key is already sheduled, it will be overwritten.
         *
         * @static
         * @param {string} key
         * @param {Settings} setting
         * @memberof PackageConversionController
         */
        static scheduleConversionTo(key, setting) {
            let instance = PackageConversionController_1.getInstance();
            if (instance.settingsMap.has(key)) {
                instance.settingsMap.delete(key);
            }
            instance.settingsMap.set(key, settings_1.Settings.create(setting));
        }
        /**
         * Schedules an array of packages for conversion.
         * Invalid packages will be removed before sheduling for conversion.
         * If a conversion is already scheduled for any array of packages, it will be overwritten.
         *
         * @static
         * @param {Array<IPackage>} packets
         * @memberof PackageConversionController
         */
        static scheduleConversionFrom(packets) {
            let instance = PackageConversionController_1.getInstance();
            instance.packageArray = packets.filter((packet) => { return !package_1.Package.isInvalid(packet); });
        }
        /**
         * Triggers the conversion from settings format to package format and returns the result.
         *
         * @static
         * @returns {Array<IPackage>}
         * @memberof PackageConversionController
         */
        static runConversionTo() {
            let packageArray = new Array();
            let instance = PackageConversionController_1.getInstance();
            try {
                instance.settingsMap.forEach((setting, key) => {
                    let packet = instance.convertTo(setting, key);
                    instance.packageArray.push(packet);
                });
                packageArray = instance.packageArray;
            }
            catch (e) {
                console.error("PackageConversion failed: " + e);
            }
            PackageConversionController_1.resetInstance();
            return packageArray;
        }
        /**
         * Triggers the conversion from package format to settings format and returns the result.
         *
         * @static
         * @returns {Map<string, Settings>}
         * @memberof PackageConversionController
         */
        static runConversionFrom() {
            let settingsMap = new Map();
            let instance = PackageConversionController_1.getInstance();
            try {
                let packageKeys = instance.collectPackageKeys();
                packageKeys.forEach((key) => {
                    let packet = instance.getPackageByKey(key);
                    if (!package_1.Package.isInvalid(packet)) {
                        let setting = instance.convertFrom(packet);
                        instance.settingsMap.set(key, settings_1.Settings.create(setting));
                    }
                });
                settingsMap = instance.settingsMap;
            }
            catch (e) {
                console.error("PackageConversion failed: " + e);
            }
            PackageConversionController_1.resetInstance();
            return settingsMap;
        }
        /**
         * Returns a suitable instance of a converter specified by the provided settings type.
         * If no suitable converter is found, undefined will be returned.
         *
         * @private
         * @param {string} type
         * @returns {(IPackageConverter | undefined)}
         * @memberof PackageConversionController
         */
        pickConverterBySettingType(type) {
            return this.converterPool.find((converter) => {
                return converter.getSettingsType() === type;
            });
        }
        /**
         * Returns a suitable instance of a converter specified by the provided package type.
         * If no suitable converter is found, undefined will be returned.
         *
         * @private
         * @param {string} type
         * @returns {IPackageConverter}
         * @memberof PackageConversionController
         */
        pickConverterByPackageType(type) {
            return this.converterPool.find((converter) => {
                return converter.getObjectType() === type;
            });
        }
        /**
         * Searches the internal package array for keys of packages and returns the found keys.
         *
         * @private
         * @returns {Array<string>}
         * @memberof PackageConversionController
         */
        collectPackageKeys() {
            let packageKeys = new Array();
            this.packageArray.forEach((elem) => {
                if (elem.meta[additionalMetaKeys_1.AdditionalMetaKeys.KEY] !== undefined) {
                    packageKeys.push(elem.meta[additionalMetaKeys_1.AdditionalMetaKeys.KEY]);
                }
            });
            return packageKeys;
        }
        /**
         * Returns a package specified by the provided id from the internal package array.
         * If no package with this id can be found, an invalid package will be returned.
         *
         * @param {number} id
         * @returns {(IPackage | undefined)}
         * @memberof PackageConversionController
         */
        getPackageById(id) {
            let packet = package_1.Package.createInvalid();
            let finding = this.packageArray.find((packet) => {
                return packet.meta[additionalMetaKeys_1.AdditionalMetaKeys.ID] === id;
            });
            if (finding !== undefined) {
                packet = finding;
            }
            return packet;
        }
        /**
         * Returns a package specified by the provided key from the internal packageArray.
         * If no package with this key can be found, an invalid package will be returned.
         *
         * @param {string} key
         * @returns {(IPackage | undefined)}
         * @memberof PackageConversionController
         */
        getPackageByKey(key) {
            let packet = package_1.Package.createInvalid();
            let finding = this.packageArray.find((packet) => {
                return packet.meta.key === key;
            });
            if (finding !== undefined) {
                packet = finding;
            }
            return packet;
        }
        /**
         * Adds a single package to the internal package storage.
         *
         * @param {IPackage} packet
         * @memberof PackageConversionController
         */
        addPackage(packet) {
            if (!package_1.Package.isInvalid(packet)) {
                this.packageArray.push(packet);
            }
        }
        /**
         * Handles the conversion from ISettings to IPackage format.
         *
         * @param {Settings} setting
         * @param {string} [key]
         * @returns {IPackage}
         * @memberof PackageConversionController
         */
        convertTo(setting, key) {
            let converter = this.pickConverterBySettingType(setting.type);
            if (converter !== undefined) {
                let packet = converter.convertTo(setting, PackageConversionController_1.getId(), key);
                return packet;
            }
            else {
                throw new Error("No converter for this type of setting found");
            }
        }
        /**
         * Handles the conversion from IPackage to ISettings format.
         *
         * @param {IPackage} packet
         * @returns {ISettings}
         * @memberof PackageConversionController
         */
        convertFrom(packet) {
            let converter = this.pickConverterByPackageType(packet.meta[additionalMetaKeys_1.AdditionalMetaKeys.OBJECTTYPE]);
            if (converter !== undefined) {
                let setting = converter.convertFrom(packet);
                return setting;
            }
            else {
                throw new Error("No converter for this type of package found");
            }
        }
    };
    PackageConversionController.instance = null;
    PackageConversionController.idCounter = 0;
    PackageConversionController = PackageConversionController_1 = __decorate([
        mco.role()
    ], PackageConversionController);
    exports.PackageConversionController = PackageConversionController;
});
