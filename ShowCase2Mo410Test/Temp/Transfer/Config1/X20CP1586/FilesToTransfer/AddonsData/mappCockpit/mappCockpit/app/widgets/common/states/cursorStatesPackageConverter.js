var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/packageConversion/cursorStateConversion", "../../../common/packageConversion/basePackageConverter", "../../../common/packageConversion/enum/objectTypeEnum"], function (require, exports, cursorStateConversion_1, basePackageConverter_1, objectTypeEnum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorStatesPackageConverter = void 0;
    /**
     * The package converter handling the cursor states setting.
     *
     * @class CursorStatesPackageConverter
     * @extends {BasePackageConverter}
     */
    let CursorStatesPackageConverter = class CursorStatesPackageConverter extends basePackageConverter_1.BasePackageConverter {
        /**
         * Creates an instance of CursorStatesPackageConverter.
         *
         * @memberof CursorStatesPackageConverter
         */
        constructor() {
            super(objectTypeEnum_1.ObjectType.CURSORSTATES, "CursorStates");
            this.conversionInfoContainer.addConversion("1.0", 1, [
                new cursorStateConversion_1.CursorStateConversion()
            ]);
        }
    };
    CursorStatesPackageConverter = __decorate([
        mco.role()
    ], CursorStatesPackageConverter);
    exports.CursorStatesPackageConverter = CursorStatesPackageConverter;
});
