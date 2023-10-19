var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/treeGridParameterTypeEditorBase", "../../models/online/mappCockpitComponent"], function (require, exports, treeGridParameterTypeEditorBase_1, mappCockpitComponent_1) {
    "use strict";
    var MappCockpitParameterTypeEditor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitParameterTypeEditor = void 0;
    /**
     * implements a type editor for parameters to be used within grid cells.
     *
     * @class MappCockpitParameterTypeEditor
     */
    let MappCockpitParameterTypeEditor = MappCockpitParameterTypeEditor_1 = class MappCockpitParameterTypeEditor extends treeGridParameterTypeEditorBase_1.TreeGridParameterTypeEditorBase {
        constructor() {
            super(...arguments);
            /**
             * handle creating the cell edit template
             *
             * @returns
             * @memberof MappCockpitParameterTypeEditor
             */
            this.create = () => { return this.getEditInputTemplate(); };
            /**
             * handles reading parameter values
             *
             * @memberof MappCockpitParameterTypeEditor
             */
            this.read = (args) => { return this.endCellEdit(args); };
            /**
             * handles writing parameter values
             *
             * @memberof MappCockpitParameterTypeEditor
             */
            this.write = (args) => {
                let methodParameter = args.rowdata;
                if (methodParameter != undefined && methodParameter instanceof mappCockpitComponent_1.MappCockpitMethodParameter) {
                    let values = undefined;
                    if (methodParameter.enumType != undefined && methodParameter.enumType.values != undefined) {
                        values = methodParameter.enumType.values.map(value => value);
                    }
                    let cellInfo = { values: values, dataTypeName: methodParameter.dataType.name, onlyValuesFromListAreAllowed: true };
                    return this.beginCellEdit(args, methodParameter.displayValue, cellInfo);
                }
            };
        }
        /**
         * creates an instance
         *
         * @static
         * @returns {*}
         * @memberof MappCockpitParameterTypeEditor
         */
        static createInstance() {
            return new MappCockpitParameterTypeEditor_1();
        }
    };
    MappCockpitParameterTypeEditor = MappCockpitParameterTypeEditor_1 = __decorate([
        mco.role()
    ], MappCockpitParameterTypeEditor);
    exports.MappCockpitParameterTypeEditor = MappCockpitParameterTypeEditor;
});
