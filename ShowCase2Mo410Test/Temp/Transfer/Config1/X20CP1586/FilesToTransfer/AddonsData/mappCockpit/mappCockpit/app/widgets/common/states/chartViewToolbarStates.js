var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../framework/state", "../../chartViewWidget/chartViewWidget", "../../../framework/reflection/decorators/metaClassPropertyDecorator", "../../../framework/componentHub/common/commonTypes"], function (require, exports, state_1, chartViewWidget_1, Reflection, commonTypes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartViewZoomDirectionState = exports.ChartViewToolState = exports.ChartViewToolStateEnum = void 0;
    var ChartViewToolStateEnum;
    (function (ChartViewToolStateEnum) {
        ChartViewToolStateEnum[ChartViewToolStateEnum["CURSORS"] = 0] = "CURSORS";
        ChartViewToolStateEnum[ChartViewToolStateEnum["PANNING"] = 1] = "PANNING";
        ChartViewToolStateEnum[ChartViewToolStateEnum["BOXZOOM"] = 2] = "BOXZOOM";
    })(ChartViewToolStateEnum = exports.ChartViewToolStateEnum || (exports.ChartViewToolStateEnum = {}));
    /**
     *
     * @singleton
     * @export
     * @class ChartViewToolState
     */
    let ChartViewToolState = class ChartViewToolState extends state_1.State {
        constructor() {
            super(...arguments);
            this.selectedTool = ChartViewToolStateEnum.CURSORS;
        }
    };
    ChartViewToolState = __decorate([
        Reflection.metaClassProperty(Reflection.MetaClassProperty.transferType, commonTypes_1.DataTransferType.byValue),
        Reflection.metaClassProperty(Reflection.MetaClassProperty.className, "ChartViewToolState"),
        mco.role()
    ], ChartViewToolState);
    exports.ChartViewToolState = ChartViewToolState;
    let ChartViewZoomDirectionState = class ChartViewZoomDirectionState extends state_1.State {
        constructor() {
            super(...arguments);
            this.zoomDirection = chartViewWidget_1.ZoomDirection.XY;
        }
    };
    ChartViewZoomDirectionState = __decorate([
        Reflection.metaClassProperty(Reflection.MetaClassProperty.transferType, commonTypes_1.DataTransferType.byValue),
        Reflection.metaClassProperty(Reflection.MetaClassProperty.className, "ChartViewZoomDirectionState"),
        mco.role()
    ], ChartViewZoomDirectionState);
    exports.ChartViewZoomDirectionState = ChartViewZoomDirectionState;
});
