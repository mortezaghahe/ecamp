var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatterInputArgument = void 0;
    /**
     * The basic input argument for the formatter,
     * which need to be extended by the specific input arguments
     *
     * @export
     * @class FormatterInputArgument
     * @implements {IFormatterInputArgument}
     */
    let FormatterInputArgument = class FormatterInputArgument {
        constructor(argument, inputType, engineeringUnit) {
            this.argument = argument;
            this.inputType = inputType;
            if (engineeringUnit !== undefined) {
                this.engineeringUnit = " " + engineeringUnit;
            }
            else {
                this.engineeringUnit = "";
            }
        }
    };
    FormatterInputArgument = __decorate([
        mco.role()
    ], FormatterInputArgument);
    exports.FormatterInputArgument = FormatterInputArgument;
});
