var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var UniqueIdGenerator_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UniqueIdGenerator = void 0;
    let UniqueIdGenerator = UniqueIdGenerator_1 = class UniqueIdGenerator {
        static getInstance() {
            if (!UniqueIdGenerator_1.instance) {
                UniqueIdGenerator_1.instance = new UniqueIdGenerator_1();
                // ... any one time initialization goes here ...
            }
            return UniqueIdGenerator_1.instance;
        }
        getUniqueIdFromString(string) {
            var hash = 0;
            if (string.length == 0) {
                return string + hash.toString();
            }
            for (var i = 0; i < string.length; i++) {
                var char = string.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            if (hash < 0) {
                hash = hash * -1;
            }
            let id = string.toString().replace(/[&\/\\#,+( )$~%.'":*?<>{}]/g, '_') + hash;
            return id;
        }
    };
    UniqueIdGenerator = UniqueIdGenerator_1 = __decorate([
        mco.role()
    ], UniqueIdGenerator);
    exports.UniqueIdGenerator = UniqueIdGenerator;
});
