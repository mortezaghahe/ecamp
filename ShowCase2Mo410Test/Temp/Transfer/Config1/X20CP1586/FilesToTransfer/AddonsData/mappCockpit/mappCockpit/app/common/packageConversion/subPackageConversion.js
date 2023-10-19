var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./anyConversion", "./enum/dataTypeEnum", "./package", "./meta", "./packageConversionController", "../persistence/settings"], function (require, exports, anyConversion_1, dataTypeEnum_1, package_1, meta_1, packageConversionController_1, settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SubPackageConversion = void 0;
    /**
     * This conversion handles packages.
     * It is used for subpackages referenced by a link id and nested settings.
     *
     * @class SubPackageConversion
     * @extends {AnyConversion}
     */
    let SubPackageConversion = class SubPackageConversion extends anyConversion_1.AnyConversion {
        /**
         * Creates an instance of SubPackageConversion.
         *
         * @param {Array<string>} settingKey The keys to be addressed in the settings data by this conversion.
         * @param {Array<string>} packageKey The keys to be addressed in the package data by this conversion.
         * @memberof SubPackageConversion
         */
        constructor(settingKey, packageKey) {
            super(settingKey, packageKey);
            this.dataType = dataTypeEnum_1.DataType.LINK;
        }
        /**
         * Checks if the data type is of type number.
         *
         * @param {Array<any>} data
         * @returns {boolean}
         * @memberof SubPackageConversion
         */
        checkDataTypes(data) {
            return data.every((item) => { return typeof item === "number"; });
        }
        /**
         * Retrieves the referenced subpackage from the package conversion controller and performs its conversion from package to settings format.
         *
         * @param {Array<any>} data
         * @returns {Array<any>}
         * @memberof SubPackageConversion
         */
        convertDataFrom(data) {
            let controller = packageConversionController_1.PackageConversionController.getInstance();
            let packets = new Array();
            data.forEach((item) => {
                //retrieve package by given link id
                let result = controller.getPackageById(item);
                //if package is valid, add it to the packages to be convertes
                if (!package_1.Package.isInvalid(result)) {
                    packets.push(result);
                }
            });
            let settings = new Array();
            packets.forEach((packet) => {
                // convert package to setting
                let setting = controller.convertFrom(packet);
                //add converted setting to return value
                settings.push(settings_1.Settings.create(setting));
            });
            return settings;
        }
        /**
         * Performs the conversion of a nested setting from setting to package format, adds the converted subpackage to the package conversion controller and references it in the current package.
         *
         * @param {Array<any>} data
         * @returns {Array<IPackage>}
         * @memberof SubPackageConversion
         */
        convertDataTo(data) {
            let controller = packageConversionController_1.PackageConversionController.getInstance();
            let packets = new Array();
            data.forEach((setting) => {
                //convert setting to package
                let packet = controller.convertTo(settings_1.Settings.create(setting));
                //generate link package for converted package
                let link = new package_1.Package(new meta_1.Meta(this.dataType), packet.meta.id);
                //add converted package to controller
                controller.addPackage(packet);
                // add link package to return value
                packets.push(link);
            });
            return packets;
        }
    };
    SubPackageConversion = __decorate([
        mco.role()
    ], SubPackageConversion);
    exports.SubPackageConversion = SubPackageConversion;
});
