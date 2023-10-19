var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./bindingType"], function (require, exports, bindingType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BindingDeclaration = void 0;
    /**
     * Binding Declaration base class => IBindingDeclaration interface must be changed if this class is changed!!!
     *
     * @export
     * @class BindingDeclaration
     */
    let BindingDeclaration = class BindingDeclaration {
    };
    BindingDeclaration.scope = "";
    BindingDeclaration.id = "";
    BindingDeclaration.bindingType = bindingType_1.BindingType.UNDEFINED;
    BindingDeclaration.dataType = "";
    BindingDeclaration.passByValue = true;
    BindingDeclaration = __decorate([
        mco.role()
    ], BindingDeclaration);
    exports.BindingDeclaration = BindingDeclaration;
});
