var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Version = void 0;
    let Version = class Version {
        /**
         * Creates an instance of Version. Format is major.minor.path.build eg. 5.18.1.123 (5.18 can also be used, for patch and build 0 is used therefore)
         * @param {string} version
         * @memberof Version
         */
        constructor(version) {
            this.major = 0;
            this.minor = 0;
            this.patch = 0;
            this.build = 0;
            this.version = version;
            let versionNumbers = version.split(".");
            if (versionNumbers.length > 0) {
                this.major = Number(versionNumbers[0]);
            }
            if (versionNumbers.length > 1) {
                this.minor = Number(versionNumbers[1]);
            }
            if (versionNumbers.length > 2) {
                this.patch = Number(versionNumbers[2]);
            }
            if (versionNumbers.length > 3) {
                this.build = Number(versionNumbers[3]);
            }
        }
    };
    Version = __decorate([
        mco.role()
    ], Version);
    exports.Version = Version;
});
