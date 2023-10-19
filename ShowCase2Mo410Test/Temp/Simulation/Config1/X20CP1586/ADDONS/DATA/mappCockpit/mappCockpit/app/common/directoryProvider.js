var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var DirectoryProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DirectoryProvider = void 0;
    let DirectoryProvider = DirectoryProvider_1 = class DirectoryProvider {
        static getAppDirectory() {
            return "mappCockpit/app/";
        }
        static getWidgetsDirectory() {
            return DirectoryProvider_1.getAppDirectory() + "widgets/";
        }
    };
    DirectoryProvider = DirectoryProvider_1 = __decorate([
        mco.role()
    ], DirectoryProvider);
    exports.DirectoryProvider = DirectoryProvider;
});
