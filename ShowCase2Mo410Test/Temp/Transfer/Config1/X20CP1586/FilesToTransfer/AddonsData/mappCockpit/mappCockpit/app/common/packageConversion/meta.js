var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./enum/dataTypeEnum"], function (require, exports, dataTypeEnum_1) {
    "use strict";
    var Meta_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Meta = void 0;
    /**
     * Meta data for a Package object.
     *
     * @export
     * @class Meta
     * @implements {IMeta}
     */
    let Meta = Meta_1 = class Meta {
        /**
         * Creates an ID for a Package.
         *
         * @static
         * @returns {number}
         * @memberof Meta
         */
        static createID() {
            return Meta_1.idCounter++;
        }
        /**
         * Creates an instance of Meta.
         * A data type must be provided, with the option to provide any amount of additional key value pairs.
         *
         * @param {DataType} dataType
         * @param {Array<KeyValue>} [additionalMetaData=[]]
         * @memberof Meta
         */
        constructor(dataType, additionalMetaData = []) {
            this.dataType = dataType;
            additionalMetaData.forEach(metaData => { this[metaData.key] = metaData.value; });
        }
        /**
         * Creates invalid IMeta data (null object pattern).
         *
         * @static
         * @returns {IMeta}
         * @memberof Meta
         */
        static createInvalid() {
            return new Meta_1(dataTypeEnum_1.DataType.INVALID);
        }
        /**
         * Checks if the given IMeta data is invalid (null object pattern).
         *
         * @static
         * @param {IMeta} meta
         * @returns {boolean}
         * @memberof Meta
         */
        static isInvalid(meta) {
            return meta.dataType === dataTypeEnum_1.DataType.INVALID;
        }
    };
    /**
     * The counter used to generate IDs for packages
     *
     * @private
     * @static
     * @type {number}
     * @memberof Meta
     */
    Meta.idCounter = 0;
    Meta = Meta_1 = __decorate([
        mco.role()
    ], Meta);
    exports.Meta = Meta;
});
