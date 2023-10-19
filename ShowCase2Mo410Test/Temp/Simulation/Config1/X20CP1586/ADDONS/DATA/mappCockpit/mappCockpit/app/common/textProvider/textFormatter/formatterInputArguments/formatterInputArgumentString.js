var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./formatterInputArgument", "../../interface/formatterInputArgumentInterface"], function (require, exports, formatterInputArgument_1, formatterInputArgumentInterface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatterInputArgumentString = void 0;
    /**
     * Takes a string as input argument
     *
     * @export
     * @class FormatterInputArgumentString
     * @extends {FormatterInputArgument}
     */
    let FormatterInputArgumentString = class FormatterInputArgumentString extends formatterInputArgument_1.FormatterInputArgument {
        constructor(argument) {
            super(argument, formatterInputArgumentInterface_1.FormatterArgumentTypes.String);
        }
    };
    FormatterInputArgumentString = __decorate([
        mco.role()
    ], FormatterInputArgumentString);
    exports.FormatterInputArgumentString = FormatterInputArgumentString;
});
