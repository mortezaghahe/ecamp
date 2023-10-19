var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./treeGridToolbarBase"], function (require, exports, treeGridToolbarBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ToolbarButton = void 0;
    let ToolbarButton = class ToolbarButton {
        constructor(id, tooltip, icon, align = treeGridToolbarBase_1.ToolbarButtonAlignment.Left) {
            this.id = id;
            this.tooltip = tooltip;
            this.icon = icon;
            this.disabled = false;
            this.align = align;
        }
    };
    ToolbarButton = __decorate([
        mco.role()
    ], ToolbarButton);
    exports.ToolbarButton = ToolbarButton;
});
