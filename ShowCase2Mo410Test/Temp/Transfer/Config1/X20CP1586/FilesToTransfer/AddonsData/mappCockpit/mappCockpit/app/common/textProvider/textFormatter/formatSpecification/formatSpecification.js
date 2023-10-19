var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./formatSpecificationType"], function (require, exports, formatSpecificationType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatSpecification = void 0;
    /**
     * This class holds the information of the format specification
     *
     * @export
     * @class FormatSpecification
     * @implements {IFormatSpecification}
     */
    let FormatSpecification = class FormatSpecification {
        //set default values
        constructor() {
            this._flags = new Array();
            this._width = 0;
            this._precision = NaN;
            this._type = formatSpecificationType_1.FormatSpecificationTypes.noType;
        }
        get flags() {
            return this._flags;
        }
        set flags(flags) {
            this._flags = flags;
        }
        get width() {
            return this._width;
        }
        set width(width) {
            this._width = width;
        }
        get precision() {
            return this._precision;
        }
        set precision(precision) {
            this._precision = precision;
        }
        get type() {
            return this._type;
        }
        set type(type) {
            this._type = type;
        }
    };
    FormatSpecification = __decorate([
        mco.role()
    ], FormatSpecification);
    exports.FormatSpecification = FormatSpecification;
});
