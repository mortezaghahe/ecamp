var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./formatterInputArgument", "../../interface/formatterInputArgumentInterface"], function (require, exports, formatterInputArgument_1, formatterInputArgumentInterface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatterInputArgumentFloat = void 0;
    /**
     * Takes floating numbers as input argument with the possibility to declare an enginieering unit
     *
     * @export
     * @class FormatterInputArgumentFloat
     * @extends {FormatterInputArgument}
     */
    let FormatterInputArgumentFloat = class FormatterInputArgumentFloat extends formatterInputArgument_1.FormatterInputArgument {
        constructor(argument, engineeringUnit) {
            super(argument, formatterInputArgumentInterface_1.FormatterArgumentTypes.Float, engineeringUnit);
        }
    };
    FormatterInputArgumentFloat = __decorate([
        mco.role()
    ], FormatterInputArgumentFloat);
    exports.FormatterInputArgumentFloat = FormatterInputArgumentFloat;
});
