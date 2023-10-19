var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./metaClassProperties"], function (require, exports, metaClassProperties_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetaClassReflectionInfo = void 0;
    /**
     * Provides setting and retrieving descriptive and informational capabilities of reflected types and atributes for classes.
     *
     * @export
     * @class MetaClassReflectionInfo
     */
    let MetaClassReflectionInfo = class MetaClassReflectionInfo {
        /**
         * Specifies one or more class properties.
         *
         * @static
         * @param {string} classType
         * @param {{}} newClassProperties
         * @memberof MetaClassReflectionData
         */
        static registerProperty(classType, propertyName, propertyValue) {
            // Registering a class name qualifies for beeing a valid meta info owner !
            let metaClassInfo = propertyName === metaClassProperties_1.MetaClassProperty.className ? this.createMetaClassInfo(classType) : this.getMetaClassInfo(classType);
            if (metaClassInfo && classType instanceof Function) {
                // set the meta property and value.
                metaClassInfo[propertyName] = propertyValue;
            }
        }
        /**
         * Creates a meta info property for a given class
         *
         * @private
         * @static
         * @param {Function} classType
         * @returns {(object | undefined)}
         * @memberof MetaClassReflectionInfo
         */
        static createMetaClassInfo(classType) {
            // the meta property owner needs to be a constructor method
            if ((classType instanceof Function) && classType !== undefined && classType.prototype !== undefined) {
                // create the meta info property
                classType.prototype.__$$classMetaInfo = {};
            }
            return classType.prototype.__$$classMetaInfo;
        }
        /**
         * Retrieves the class meta info for a given class
         *
         * @private
         * @param {TConstructor} classType
         * @returns {(object |undefined)}
         * @memberof MetaClassReflectionInfo
         */
        static getMetaClassInfo(classType) {
            let classMetaInfo = undefined;
            // the meta property owner needs to be a constructor method
            if ((classType instanceof Function) && classType !== undefined && classType.prototype !== undefined) {
                // get the meta properties from the class type
                classMetaInfo = classType.prototype.__$$classMetaInfo;
            }
            return classMetaInfo;
        }
        /**
         * Determines if the class has the specified property.
         *
         * @static
         * @param {string} className
         * @param {string} propertyName
         * @returns {boolean}
         * @memberof MetaClassReflectionInfo
         */
        static classHasMetaProperty(classType, propertyName) {
            let classHasProperty = false;
            // get meta data for the requested class.
            let metaClassInfo = this.getMetaClassInfo(classType);
            if (metaClassInfo) {
                // check for existing property 
                classHasProperty = metaClassInfo.hasOwnProperty(propertyName);
            }
            return classHasProperty;
        }
        /**
         * Reads the value of the specified propety
         *
         * @static
         * @param {string} className
         * @param {string} propertyName
         * @returns {*}
         * @memberof MetaClassReflectionInfo
         */
        static getClassMetaPropertyValue(classType, propertyName) {
            let propertyValue = undefined;
            // get meta data for the requested class.
            let metaClassInfo = this.getMetaClassInfo(classType);
            if (metaClassInfo && this.classHasMetaProperty(classType, propertyName)) {
                // get the property value
                propertyValue = metaClassInfo[propertyName];
            }
            return propertyValue;
        }
    };
    MetaClassReflectionInfo = __decorate([
        mco.role()
    ], MetaClassReflectionInfo);
    exports.MetaClassReflectionInfo = MetaClassReflectionInfo;
});
