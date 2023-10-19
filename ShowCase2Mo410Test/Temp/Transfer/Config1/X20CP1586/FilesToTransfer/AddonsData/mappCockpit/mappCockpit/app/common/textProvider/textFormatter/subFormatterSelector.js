var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../interface/formatterInputArgumentInterface", "../errorHandling/textSystemErrorHandler", "../errorHandling/textSystemErrorTypes", "./formatter/floatSubFormatter", "./formatter/intSubFormatter", "./formatter/stringSubFormatter", "../errorHandling/textSystemErrorItem"], function (require, exports, formatterInputArgumentInterface_1, textSystemErrorHandler_1, textSystemErrorTypes_1, floatSubFormatter_1, intSubFormatter_1, stringSubFormatter_1, textSystemErrorItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SubFormatterSelector = void 0;
    /**
     * This class selects the right formatter to process a single format item
     *
     * @export
     * @static
     * @class SubFormatterSelector
     */
    let SubFormatterSelector = class SubFormatterSelector {
        /**
         * Constructor set to private SubFormatterSelector class should only provide static functions.
         * Creates an instance of SubFormatterSelector.
         * @memberof SubFormatterSelector
         */
        constructor() { }
        ;
        /**
         * Get the formatted string of the argument data source.
         * Selects the right formatter for the passed input argument
         *
         * @static
         * @param {IInputArgument} argumentItem
         * @param {(string | undefined)} [formatSpecification=undefined]
         * @return {string}
         * @memberof SubFormatterSelector
         */
        static formatArgumentItem(argumentItem, formatSpecification) {
            let formattedItem = "";
            // get the formatter for the given input argument
            let subformatter = this._subFormatterMap.get(argumentItem.inputType);
            if (subformatter !== undefined) {
                formattedItem = subformatter.format(argumentItem.argument, formatSpecification, argumentItem.engineeringUnit);
            }
            else {
                textSystemErrorHandler_1.TextSystemErrorHandler.throwFormatterErrors(textSystemErrorHandler_1.TextSystemErrorHandler.defaultErrorMessage, new textSystemErrorItem_1.TextSystemErrorItem(textSystemErrorTypes_1.TextSystemErrorTypes.NoFormatterForInputArgumentFound));
            }
            return formattedItem;
        }
    };
    // Map used for getting the right subformatter
    SubFormatterSelector._subFormatterMap = new Map([
        [formatterInputArgumentInterface_1.FormatterArgumentTypes.Integer, new intSubFormatter_1.IntSubFormatter()],
        [formatterInputArgumentInterface_1.FormatterArgumentTypes.Float, new floatSubFormatter_1.FloatSubFormatter()],
        [formatterInputArgumentInterface_1.FormatterArgumentTypes.String, new stringSubFormatter_1.StringSubFormatter()]
    ]);
    SubFormatterSelector = __decorate([
        mco.role()
    ], SubFormatterSelector);
    exports.SubFormatterSelector = SubFormatterSelector;
});
