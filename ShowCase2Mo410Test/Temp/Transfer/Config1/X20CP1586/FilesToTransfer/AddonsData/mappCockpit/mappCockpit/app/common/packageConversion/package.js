var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./enum/dataTypeEnum", "./meta"], function (require, exports, dataTypeEnum_1, meta_1) {
    "use strict";
    var Package_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Package = void 0;
    /**
     * The Package object as used within the ExportContainer.
     *
     * @export
     * @class Package
     * @implements {IPackage}
     */
    let Package = Package_1 = class Package {
        /**
         * Creates an instance of Package.
         * The meta data and data must be provided.
         *
         * @param {IMeta} meta
         * @param {*} data
         * @memberof Package
         */
        constructor(meta, data = {}) {
            this.meta = meta;
            this.data = data;
        }
        /**
         * The reviver function to be used, when parsing a Package from JSON.
         *
         * @static
         * @param {IPackage} this
         * @param {*} key
         * @param {*} value
         * @returns {*}
         * @memberof Package
         */
        static reviver(key, value) {
            let newValue = value;
            if (key === "data") {
                if (this.meta !== undefined && this.meta.dataType == dataTypeEnum_1.DataType.DATE) {
                    newValue = new Date(value);
                }
            }
            return newValue;
        }
        /**
         * The replacer function to be used, when stringifying a Package to JSON.
         *
         * @static
         * @param {IPackage} this
         * @param {*} key
         * @param {*} value
         * @returns
         * @memberof Package
         */
        static replacer(key, value) {
            let newValue = value;
            if (key === "data") {
                if (this.meta.dataType == dataTypeEnum_1.DataType.DATE) {
                    newValue = (new Date(value)).toISOString();
                }
            }
            return newValue;
        }
        /**
         * Set a given key with the given IPackage data of the given IPackage data.
         *
         * @static
         * @param {IPackage} packet
         * @param {string} key
         * @param {IPackage} value
         * @returns {IPackage}
         * @memberof Package
         */
        static setPackageKey(packet, key, value) {
            packet.data[key] = value;
            return packet;
        }
        /**
         *  Accesses the data of the given key of the given IPackage data.
         *
         * @static
         * @template T
         * @param {IPackage} packet
         * @param {string} key
         * @returns {(T | undefined)}
         * @memberof Package
         */
        static getPackageKeyData(packet, key) {
            let retVal = undefined;
            if (packet.data[key] !== undefined) {
                retVal = packet.data[key].data;
            }
            return retVal;
        }
        /**
         * Accesses the meta data of the given key of the given IPackage data.
         *
         * @static
         * @param {IPackage} packet
         * @param {string} key
         * @returns {IMeta}
         * @memberof Package
         */
        static getPackageKeyMeta(packet, key) {
            let retVal = meta_1.Meta.createInvalid();
            if (packet.data[key] !== undefined) {
                retVal = packet.data[key].meta;
            }
            return retVal;
        }
        /**
         * Creates invalid IPackage data (null object pattern).
         *
         * @static
         * @returns {IPackage}
         * @memberof Package
         */
        static createInvalid() {
            return new Package_1(meta_1.Meta.createInvalid());
        }
        /**
         * Checks if the given IPackage data is invalid (null object pattern).
         *
         * @static
         * @param {IPackage} packet
         * @returns {boolean}
         * @memberof Package
         */
        static isInvalid(packet) {
            return meta_1.Meta.isInvalid(packet.meta);
        }
    };
    Package = Package_1 = __decorate([
        mco.role()
    ], Package);
    exports.Package = Package;
});
