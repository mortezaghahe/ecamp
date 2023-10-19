var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./objectCompare"], function (require, exports, objectCompare_1) {
    "use strict";
    var ObjectX_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ObjectX = void 0;
    let ObjectX = ObjectX_1 = class ObjectX {
        static copy(targetObject, sourceObject) {
            // shallow copy the source properties to the target instance
            return Object.assign(targetObject, sourceObject);
        }
        static clone(typeConstructor, sourceObject) {
            let newInstance;
            // copy the source objects properties to the new instance
            try {
                newInstance = ObjectX_1.deepCopy(sourceObject, typeConstructor);
            }
            catch (error) {
                console.error(error);
            }
            return newInstance;
        }
        /**
         * create a deep copy of the source object
         *
         * @static
         * @memberof ObjectX
         */
        static deepCopy(sourceObject, ctor = null) {
            // we return the source object as default when it is a primitive value.
            let copiedObject = sourceObject;
            if (sourceObject !== null) {
                // copy based on type
                if (sourceObject instanceof Array) {
                    // copy array
                    copiedObject = ObjectX_1.deepCopyArray(sourceObject);
                }
                else if (typeof sourceObject === 'object') {
                    // copy object
                    let targetObject = ctor ? new ctor() : {};
                    copiedObject = objectCompare_1.ObjectCompare.deepCopy(targetObject, sourceObject);
                }
            }
            return copiedObject;
        }
        /**
         * create a deep copy of an array
         *
         * @static
         * @param {any[]} sourceArray
         * @returns {any[]}
         * @memberof ObjectX
         */
        static deepCopyArray(sourceArray) {
            // create a new arrray 
            let copiedArray = [];
            // copy array items
            sourceArray.forEach((arrayItem) => { copiedArray.push(arrayItem); });
            // copy array item values
            let copy = copiedArray.map((arrayItem) => ObjectX_1.deepCopy(arrayItem));
            return copy;
        }
        /**
         * compares two objects on content equality
         *
         * @static
         * @param {*} sourceObject
         * @param {*} targetObject
         * @returns {boolean}
         * @memberof ObjectX
         */
        static deepEquals(sourceObject, targetObject) {
            return objectCompare_1.ObjectCompare.isEqual(targetObject, sourceObject);
        }
    };
    ObjectX = ObjectX_1 = __decorate([
        mco.role()
    ], ObjectX);
    exports.ObjectX = ObjectX;
});
