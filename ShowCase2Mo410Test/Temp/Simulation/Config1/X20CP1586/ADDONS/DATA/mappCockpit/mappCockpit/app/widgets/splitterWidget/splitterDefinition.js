var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SplitterDefinition = void 0;
    let SplitterDefinition = class SplitterDefinition {
        constructor(orientation, responsive = true) {
            this.orientation = orientation;
            this.responsive = responsive;
            this.paneDefinitions = new Array();
        }
    };
    SplitterDefinition.orientationVertical = "vertical";
    SplitterDefinition.orientationHorizontal = "horizontal";
    SplitterDefinition.splitterDefinitionId = "splitterDefinition";
    SplitterDefinition = __decorate([
        mco.role()
    ], SplitterDefinition);
    exports.SplitterDefinition = SplitterDefinition;
});
