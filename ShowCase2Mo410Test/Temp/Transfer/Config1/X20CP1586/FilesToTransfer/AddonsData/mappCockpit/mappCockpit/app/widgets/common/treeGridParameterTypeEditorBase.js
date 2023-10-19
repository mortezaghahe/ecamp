var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../framework/events"], function (require, exports, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TreeGridParameterTypeEditorBase = void 0;
    let EventSelectionChanged = class EventSelectionChanged extends events_1.TypedEvent {
    };
    EventSelectionChanged = __decorate([
        mco.role()
    ], EventSelectionChanged);
    ;
    /**
     * implements a type editor base class for parameters to be used within tree grid cells.
     *
     * @class TreeGridParameterTypeEditorBase
     */
    let TreeGridParameterTypeEditorBase = class TreeGridParameterTypeEditorBase {
        constructor() {
            this.eventSelectionChanged = new EventSelectionChanged();
        }
        /**
         * gets a html fragment for specifying the input template
         *
         * @returns {*}
         * @memberof TreeGridParameterTypeEditorBase
         */
        getEditInputTemplate() {
            return "<input>";
        }
        /**
         * Returns the cell value after editing (depending on parameter data type)
         *
         * @param {*} editingParameter
         * @param {*} args
         * @returns
         * @memberof TreeGridParameterTypeEditorBase
         */
        endCellEdit(args) {
            if (args[0].classList.contains("e-dropdownlist")) {
                args.ejDropDownList("hidePopup"); // BUGFIX to hide dropdownlist after setting new value with keys(instead of simple mouse click)
                var value = args.ejDropDownList("getValue");
            }
            else if (args[0].classList.contains("e-combobox")) {
                args.ejComboBox("hidePopup"); // BUGFIX to avoid the jumping of the combobox to the top left corner in case of mouse wheel scroll
                var value = args.ejComboBox("value");
            }
            else if (args[0].classList.contains("e-maskedit")) {
                var value = args.ejMaskEdit("get_StrippedValue");
            }
            else if (args[0].classList.contains("e-colorpicker")) {
                var value = args.ejColorPicker("getValue");
            }
            else if (args[0].classList.contains("e-numerictextbox")) {
                var value = args.ejNumericTextbox("getValue");
            }
            if (value == undefined) {
                value = "";
            }
            return value;
        }
        /**
         * Shows the needed edit cell when in edit mode (depending on parameter data type, e.g. numeric text box, color picker, dropdown, ...)
         *
         * @param {*} args
         * @memberof TreeGridParameterTypeEditorBase
         */
        beginCellEdit(args, currentValue, cellInfo) {
            var { editCellWidth, editCellHeight } = this.getEditCellSize(args);
            if (cellInfo.values != undefined) {
                if (cellInfo.onlyValuesFromListAreAllowed == false) {
                    this.initComboBox(args, currentValue, cellInfo.values, editCellWidth, editCellHeight);
                }
                else {
                    this.initDropDownList(args, currentValue, cellInfo.values, editCellWidth, editCellHeight);
                }
            }
            else if (cellInfo.dataTypeName != undefined) {
                if (this.isColorDataType(cellInfo.dataTypeName) == true) {
                    this.initColorPicker(args, currentValue);
                }
                else if (this.isStringDataType(cellInfo.dataTypeName) == true) {
                    if (args.rowdata.calculationData != undefined && args.rowdata.calculationData.valueConverter != undefined) {
                        currentValue = args.rowdata.getRawValue();
                    }
                    this.initTextBox(args, editCellWidth, editCellHeight, currentValue);
                }
                else {
                    this.initNumericBox(args, currentValue, editCellWidth, editCellHeight, cellInfo.dataTypeName, cellInfo.minValue, cellInfo.maxValue);
                }
            }
            else {
                // Default show text input
                this.initTextBox(args, editCellWidth, editCellHeight, currentValue);
            }
        }
        /**
         * Is color datatype (e.g. color)
         *
         * @private
         * @param {string} dataTypeName
         * @returns {boolean}
         * @memberof TreeGridParameterTypeEditorBase
         */
        isColorDataType(dataTypeName) {
            if (dataTypeName == "Color") {
                return true;
            }
            return false;
        }
        /**
         * Is string datatype (e.g. String)
         *
         * @private
         * @param {string} dataTypeName
         * @returns {boolean}
         * @memberof TreeGridParameterTypeEditorBase
         */
        isStringDataType(dataTypeName) {
            if (dataTypeName == "String") {
                return true;
            }
            return false;
        }
        /**
         * Is integer datatype (e.g. Int16, UInt32, ...)
         *
         * @private
         * @param {string} dataTypeName
         * @returns {boolean}
         * @memberof TreeGridParameterTypeEditorBase
         */
        isIntegerDataType(dataTypeName) {
            if (dataTypeName == "Int16" || dataTypeName == "UInt16" ||
                dataTypeName == "Int32" || dataTypeName == "UInt32" ||
                dataTypeName == "Int64" || dataTypeName == "UInt64") {
                return true;
            }
            return false;
        }
        /**
         * Is unsigned integer datatype (e.g. UInt16, UInt32, ...)
         *
         * @private
         * @param {string} dataTypeName
         * @returns {boolean}
         * @memberof TreeGridParameterTypeEditorBase
         */
        isUnsignedIntegerDataType(dataTypeName) {
            if (dataTypeName == "UInt16" ||
                dataTypeName == "UInt32" ||
                dataTypeName == "UInt64") {
                return true;
            }
            return false;
        }
        /**
         * Create ComboBox with edit support
         *
         * @private
         * @param {*} args
         * @param {string} currentValue
         * @param {*} values
         * @param {*} cellWidth
         * @param {*} cellHeight
         * @memberof TreeGridParameterTypeEditorBase
         */
        initComboBox(args, currentValue, values, cellWidth, cellHeight) {
            args.element.ejComboBox({
                dataSource: values,
                text: currentValue,
                width: cellWidth,
                height: cellHeight,
                fields: { text: "displayValue", value: "value" },
                select: (args) => {
                    this.eventSelectionChanged.raise(null, args);
                }
            });
        }
        /**
         * Create DropDownList (no edit support)
         *
         * @private
         * @param {*} args
         * @param {string} currentValue
         * @param {*} values
         * @param {*} cellWidth
         * @param {*} cellHeight
         * @memberof TreeGridParameterTypeEditorBase
         */
        initDropDownList(args, currentValue, values, cellWidth, cellHeight) {
            args.element.ejDropDownList({
                dataSource: values,
                text: currentValue,
                width: cellWidth,
                height: cellHeight,
                popupHeight: "50%",
                fields: { text: "displayValue", value: "value" },
                select: (args) => {
                    this.eventSelectionChanged.raise(null, args);
                }
            });
        }
        /**
         * Create TextBox
         *
         * @private
         * @param {*} args
         * @param {*} cellWidth
         * @param {*} cellHeight
         * @param {*} cellValue
         * @memberof TreeGridParameterTypeEditorBase
         */
        initTextBox(args, cellWidth, cellHeight, cellValue) {
            args.element.ejMaskEdit({
                width: cellWidth,
                height: cellHeight,
                value: cellValue,
            });
        }
        /**
         * Create ColorPiccker
         *
         * @private
         * @param {*} args
         * @param {string} currentValue
         * @memberof TreeGridParameterTypeEditorBase
         */
        initColorPicker(args, currentValue) {
            args.element.ejColorPicker({
                value: currentValue,
                modelType: "palette",
            });
        }
        /**
         * Create NumericTextbox
         *
         * @private
         * @param {*} args
         * @param {string} currentValue
         * @param {*} cellWidth
         * @param {*} cellHeight
         * @param {boolean} [decimalSupport=false]
         * @memberof TreeGridParameterTypeEditorBase
         */
        initNumericBox(args, currentValue, cellWidth, cellHeight, dataTypeName, minValue = undefined, maxValue = undefined) {
            let decimalSupport = !this.isIntegerDataType(dataTypeName);
            let isUnsignedType = this.isUnsignedIntegerDataType(dataTypeName);
            let decimalPlaces = 0;
            if (decimalSupport == true) {
                decimalPlaces = -1;
            }
            let minVal = minValue;
            if (minValue == undefined) {
                if (isUnsignedType == true) {
                    minVal = 0; // Limit to 0 if unsigned datatype
                }
                else {
                    minVal = -(Number.MAX_VALUE);
                }
            }
            let maxVal = maxValue;
            if (maxValue == undefined) {
                maxVal = Number.MAX_VALUE;
            }
            args.element.ejNumericTextbox({
                value: currentValue,
                width: cellWidth,
                height: cellHeight,
                showRoundedCorner: true,
                showSpinButton: false,
                decimalPlaces: decimalPlaces,
                minValue: minVal,
                maxValue: maxVal,
            });
        }
        /**
         * determines the edit cell size
         *
         * @param {*} args
         * @returns
         * @memberof TreeGridParameterTypeEditorBase
         */
        getEditCellSize(args) {
            var editCellWidth = args.column.width - 6;
            var editCellHeight = 23; // default cell height
            var otherElement = args.element[0].parentElement.parentElement;
            if (otherElement != undefined) {
                // set cell height from parent element if found
                editCellHeight = otherElement.clientHeight - 4;
            }
            return { editCellWidth, editCellHeight };
        }
    };
    TreeGridParameterTypeEditorBase = __decorate([
        mco.role()
    ], TreeGridParameterTypeEditorBase);
    exports.TreeGridParameterTypeEditorBase = TreeGridParameterTypeEditorBase;
});
