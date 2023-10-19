var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./bindingType", "./bindingDeclaration"], function (require, exports, bindingType_1, bindingDeclaration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tools = exports.BindingScope = void 0;
    // Defines allscopes for tools
    let BindingScope = class BindingScope {
    };
    BindingScope.ToolsProvider = "app::tools provider";
    BindingScope = __decorate([
        mco.role()
    ], BindingScope);
    exports.BindingScope = BindingScope;
    // Defines all binding declarations for tools
    var Tools;
    (function (Tools) {
        class ToolsIds extends bindingDeclaration_1.BindingDeclaration {
        }
        ToolsIds.scope = BindingScope.ToolsProvider;
        ToolsIds.id = "tools ids";
        ToolsIds.bindingType = bindingType_1.BindingType.DATA;
        ToolsIds.dataType = "";
        Tools.ToolsIds = ToolsIds;
    })(Tools = exports.Tools || (exports.Tools = {}));
});
