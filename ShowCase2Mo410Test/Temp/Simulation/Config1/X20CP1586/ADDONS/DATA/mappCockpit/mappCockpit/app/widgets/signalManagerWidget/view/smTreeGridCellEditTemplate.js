var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/treeGridParameterTypeEditorBase", "../signalManagerWidget"], function (require, exports, treeGridParameterTypeEditorBase_1, signalManagerWidget_1) {
    "use strict";
    var SmTreeGridCellEditTemplate_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SmTreeGridCellEditTemplate = void 0;
    let SmTreeGridCellEditTemplate = SmTreeGridCellEditTemplate_1 = class SmTreeGridCellEditTemplate extends treeGridParameterTypeEditorBase_1.TreeGridParameterTypeEditorBase {
        constructor() {
            super(...arguments);
            /**
             * handle creating the cell edit template
             *
             * @returns
             * @memberof SmTreeGridCellEditTemplate
             */
            this.create = () => { return this.getEditInputTemplate(); };
            /**
             * handles reading parameter values
             *
             * @param {*} args
             * @memberof SmTreeGridCellEditTemplate
             */
            this.read = (args) => { return this.endCellEdit(args); };
            /**
             * handles writing parameter values
             *
             * @param {*} args
             * @memberof SmTreeGridCellEditTemplate
             */
            this.write = (args) => {
                if (args.column.field == signalManagerWidget_1.SignalManagerWidget.colorColumnId) {
                    let cellInfo = { dataTypeName: "Color", values: undefined, onlyValuesFromListAreAllowed: true };
                    return this.beginCellEdit(args, args.rowdata.color, cellInfo);
                }
                else {
                    let dataTypeName = "String";
                    if (args.rowdata.dataTypeName != undefined) {
                        dataTypeName = args.rowdata.dataTypeName;
                    }
                    let cellInfo = { dataTypeName: dataTypeName, values: args.rowdata.values, onlyValuesFromListAreAllowed: args.rowdata.onlyValuesFromListAreAllowed };
                    if (args.rowdata.calculationData != undefined) {
                        let displayInfo = args.rowdata.calculationData.displayInfo;
                        if (displayInfo != undefined) {
                            if (displayInfo.minValue != undefined) {
                                cellInfo.minValue = displayInfo.minValue;
                            }
                            if (displayInfo.maxValue != undefined) {
                                cellInfo.maxValue = displayInfo.maxValue;
                            }
                        }
                    }
                    return this.beginCellEdit(args, args.rowdata.value, cellInfo);
                }
            };
        }
        /**
         * creates an instance
         *
         * @static
         * @returns {*}
         * @memberof SmTreeGridCellEditTemplate
         */
        static createInstance() {
            return new SmTreeGridCellEditTemplate_1();
        }
    };
    SmTreeGridCellEditTemplate = SmTreeGridCellEditTemplate_1 = __decorate([
        mco.role()
    ], SmTreeGridCellEditTemplate);
    exports.SmTreeGridCellEditTemplate = SmTreeGridCellEditTemplate;
});
