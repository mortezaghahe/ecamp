var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../framework/componentHub/bindings/bindingType", "../../framework/componentHub/bindings/bindingDeclaration", "../../widgets/common/states/cursorStates", "../common/states/chartViewToolbarStates"], function (require, exports, bindingType_1, bindingDeclaration_1, CursorStatesClass, chartViewToolbarStates_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceViewBinding = exports.BindingScope = void 0;
    // Defines binding scopes for trace view
    let BindingScope = class BindingScope {
    };
    BindingScope.TraceViewChartStates = "app::trace view chart states";
    BindingScope = __decorate([
        mco.role()
    ], BindingScope);
    exports.BindingScope = BindingScope;
    // Defines all binding declarations for trace view
    var TraceViewBinding;
    (function (TraceViewBinding) {
        class CursorStates extends bindingDeclaration_1.BindingDeclaration {
        }
        CursorStates.scope = BindingScope.TraceViewChartStates;
        CursorStates.id = "cursor states";
        CursorStates.bindingType = bindingType_1.BindingType.STATE;
        CursorStates.dataType = CursorStatesClass.CursorStates;
        CursorStates.passByValue = true;
        TraceViewBinding.CursorStates = CursorStates;
        class ToolState extends bindingDeclaration_1.BindingDeclaration {
        }
        ToolState.scope = BindingScope.TraceViewChartStates;
        ToolState.id = "tool state";
        ToolState.bindingType = bindingType_1.BindingType.STATE;
        ToolState.dataType = chartViewToolbarStates_1.ChartViewToolState;
        ToolState.passByValue = true;
        TraceViewBinding.ToolState = ToolState;
        class ZoomDirectionState extends bindingDeclaration_1.BindingDeclaration {
        }
        ZoomDirectionState.scope = BindingScope.TraceViewChartStates;
        ZoomDirectionState.id = "zoom direction state";
        ZoomDirectionState.bindingType = bindingType_1.BindingType.STATE;
        ZoomDirectionState.dataType = chartViewToolbarStates_1.ChartViewZoomDirectionState;
        ZoomDirectionState.passByValue = true;
        TraceViewBinding.ZoomDirectionState = ZoomDirectionState;
    })(TraceViewBinding = exports.TraceViewBinding || (exports.TraceViewBinding = {}));
});
