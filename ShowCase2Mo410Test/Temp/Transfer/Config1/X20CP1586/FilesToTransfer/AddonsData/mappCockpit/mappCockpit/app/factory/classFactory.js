var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./classInfo"], function (require, exports, classInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClassFactory = void 0;
    /**
     * Implements a factory for loading classes at runtime and creating instances dynamically *
     * @export
     * @class ClassFactory
     */
    let ClassFactory = class ClassFactory {
        /**
         * Loads the specified class module
         *
         * @static
         * @param {string} className
         * @memberof ClassFactory
         */
        static loadClass(className) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // get the class path
                    const classPath = classInfo_1.ClassInfo[className].path;
                    // import the class module 
                    let classModule = yield new Promise((resolve_1, reject_1) => { require([classPath], resolve_1, reject_1); });
                    // return the loaded class module
                    return classModule;
                }
                catch (error) {
                    console.error("ClassFactory: Could not load class %o %o! ", className, error);
                }
            });
        }
        /**
         * Registers a type (class) by its class name
         *
         * @static
         * @param {string} className
         * @param {TConstructor} classType
         * @memberof ClassFactory
         */
        static registerDynamicClass(className, classType) {
            this._classMap.set(className, classType);
        }
        /**
         * Creates an instance of the specified class
         *
         * @static
         * @template TYPE
         * @param {string} typeName
         * @param {string} [instanceId=""]
         * @returns {(TYPE|null)}
         * @memberof ClassFactory
         */
        static createInstance(typeName, instanceId = "") {
            let instance = undefined;
            if (this._classMap.has(typeName)) {
                // get the class constructor
                let typeConstructor = this._classMap.get(typeName);
                // a type constructor is needed for creating an instance
                if (typeConstructor) {
                    // if a named instance is requested ....
                    if (instanceId !== "") {
                        // if an instance for this id already exists ..
                        if (this._instanceMap.has(instanceId)) {
                            // .. we just get the existing instance.
                            instance = this._instanceMap.get(instanceId);
                        }
                        else {
                            // otherwise we create a new instance ...
                            instance = new typeConstructor();
                            // ... and save it under the specified id
                            this._instanceMap.set(instanceId, instance);
                        }
                    }
                    else {
                        // otherwise we jsut create a new instance
                        instance = new typeConstructor();
                    }
                }
            }
            return instance;
        }
        /**
         * verifies if the class factory contains the requestd type and instance
         *
         * @static
         * @template TYPE
         * @param {string} className
         * @param {string} [instanceId=""]
         * @returns {boolean}
         * @memberof ClassFactory
         */
        static contains(className, instanceId = "") {
            return instanceId !== "" ? this._classMap.has(className) && this._instanceMap.has(instanceId) : this._classMap.has(className);
        }
    };
    // holds a type name to class constructor map
    ClassFactory._classMap = new Map();
    // holds a id to instance map
    ClassFactory._instanceMap = new Map();
    ClassFactory = __decorate([
        mco.role()
    ], ClassFactory);
    exports.ClassFactory = ClassFactory;
});
