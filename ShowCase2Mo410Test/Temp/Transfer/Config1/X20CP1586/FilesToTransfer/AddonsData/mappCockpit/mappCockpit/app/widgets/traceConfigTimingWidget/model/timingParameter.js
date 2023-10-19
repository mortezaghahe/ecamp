var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimingParameter = void 0;
    let TimingParameter = class TimingParameter {
        constructor(displayName, engineeringunit, componentParameter) {
            let value = componentParameter.displayValue;
            this.displayName = displayName;
            this.value = value;
            this.displayValue = value;
            this.engineeringunit = engineeringunit;
            this.componentParameter = componentParameter;
        }
    };
    TimingParameter = __decorate([
        mco.role()
    ], TimingParameter);
    exports.TimingParameter = TimingParameter;
});
