var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TreeGridColumnDefinition = void 0;
    let TreeGridColumnDefinition = class TreeGridColumnDefinition {
        constructor(id, width, isVisible) {
            this.id = id;
            this.width = width;
            this.isVisible = isVisible;
        }
    };
    TreeGridColumnDefinition = __decorate([
        mco.role()
    ], TreeGridColumnDefinition);
    exports.TreeGridColumnDefinition = TreeGridColumnDefinition;
});
