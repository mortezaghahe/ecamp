var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContextIdsComponent = void 0;
    /**
     * Defines the available context ids for components
     *
     * @export
     * @class ContextIdsComponent
     */
    let ContextIdsComponent = class ContextIdsComponent {
    };
    /**
     * Id of the component which should be used(e.g. "gAxis1")
     *
     * @static
     * @memberof CtxComponent
     */
    ContextIdsComponent.ComponentId = "ComponentId";
    /**
     * Which component is used for the given component => class name (e.g. "TraceViewWidget")
     *
     * @static
     * @memberof CtxComponent
     */
    ContextIdsComponent.ViewComponentTypeId = "ViewTypeId";
    ContextIdsComponent = __decorate([
        mco.role()
    ], ContextIdsComponent);
    exports.ContextIdsComponent = ContextIdsComponent;
});
