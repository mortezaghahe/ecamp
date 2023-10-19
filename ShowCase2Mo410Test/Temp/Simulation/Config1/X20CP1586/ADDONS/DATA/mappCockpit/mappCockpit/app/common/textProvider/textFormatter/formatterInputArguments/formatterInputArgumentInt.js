var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./formatterInputArgument", "../../interface/formatterInputArgumentInterface"], function (require, exports, formatterInputArgument_1, formatterInputArgumentInterface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatterInputArgumentInt = void 0;
    /**
     * Takes integer numbers as input argument with the possibility to declare an enginieering unit
     * If the passed integer is no safe Integer NaN gets stored instead
     *
     * @export
     * @class FormatterInputArgumentInt
     * @extends {FormatterInputArgument}
     */
    let FormatterInputArgumentInt = class FormatterInputArgumentInt extends formatterInputArgument_1.FormatterInputArgument {
        constructor(argument, engineeringUnit) {
            if (!Number.isSafeInteger(argument)) {
                argument = NaN;
            }
            super(argument, formatterInputArgumentInterface_1.FormatterArgumentTypes.Integer, engineeringUnit);
        }
    };
    FormatterInputArgumentInt = __decorate([
        mco.role()
    ], FormatterInputArgumentInt);
    exports.FormatterInputArgumentInt = FormatterInputArgumentInt;
});
