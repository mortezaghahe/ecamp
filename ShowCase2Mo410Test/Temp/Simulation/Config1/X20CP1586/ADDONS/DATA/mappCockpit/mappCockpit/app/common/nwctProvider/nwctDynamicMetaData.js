var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctDynamicMetaData = void 0;
    let NwctDynamicMetaData = class NwctDynamicMetaData {
        /**
         * Creates an instance of NwctDynamicMetaData
         * @param {*} mappMotionArConfigObject
         * @memberof NwctDynamicMetaData
         */
        constructor(mappMotionArConfigObject) {
            let data = mappMotionArConfigObject.mappMotionArConfig;
            if (data != undefined) {
                this.networkInterfaces = data.networkInterfaces;
                this.mappMotionObjects = data.mappMotionObjects;
                this.mappMotionObjectTypes = data.mappMotionObjectTypes;
            }
            else {
                console.error("mappMotionArConfigObject data not available!");
                this.networkInterfaces = new Array();
                this.mappMotionObjects = new Array();
                this.mappMotionObjectTypes = new Array();
            }
        }
    };
    NwctDynamicMetaData = __decorate([
        mco.role()
    ], NwctDynamicMetaData);
    exports.NwctDynamicMetaData = NwctDynamicMetaData;
});
