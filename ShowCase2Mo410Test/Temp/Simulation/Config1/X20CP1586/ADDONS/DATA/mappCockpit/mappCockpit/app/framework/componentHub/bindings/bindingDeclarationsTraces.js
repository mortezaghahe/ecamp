var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./bindingType", "./bindingDeclaration"], function (require, exports, bindingType_1, bindingDeclaration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Traces = exports.BindingScope = void 0;
    // Defines all scopes for traces
    let BindingScope = class BindingScope {
    };
    BindingScope.TraceComponentsProvider = "app::trace components provider";
    BindingScope.TraceConfig = "app::trace configuration";
    BindingScope.TraceState = "app::trace state";
    BindingScope.TraceControl = "app::trace control";
    BindingScope.TraceDataControl = "app::trace data control";
    BindingScope = __decorate([
        mco.role()
    ], BindingScope);
    exports.BindingScope = BindingScope;
    // Defines all binding declarations for traces
    var Traces;
    (function (Traces) {
        class ComponentIds extends bindingDeclaration_1.BindingDeclaration {
        }
        ComponentIds.scope = BindingScope.TraceComponentsProvider;
        ComponentIds.id = "component ids";
        ComponentIds.bindingType = bindingType_1.BindingType.DATA;
        ComponentIds.dataType = "";
        Traces.ComponentIds = ComponentIds;
        class State extends bindingDeclaration_1.BindingDeclaration {
        }
        State.scope = BindingScope.TraceState;
        State.id = "state";
        State.bindingType = bindingType_1.BindingType.DATA;
        State.dataType = "";
        Traces.State = State;
        class ControlInterface extends bindingDeclaration_1.BindingDeclaration {
        }
        ControlInterface.scope = BindingScope.TraceControl;
        ControlInterface.id = "control interface";
        ControlInterface.bindingType = bindingType_1.BindingType.INTERFACE;
        ControlInterface.dataType = "";
        Traces.ControlInterface = ControlInterface;
        class AvailableDataPoints extends bindingDeclaration_1.BindingDeclaration {
        }
        AvailableDataPoints.scope = BindingScope.TraceConfig; // TODO: Trace or TraceConfig ???
        AvailableDataPoints.id = "availableDataPoints";
        AvailableDataPoints.bindingType = bindingType_1.BindingType.DATA;
        AvailableDataPoints.dataType = "";
        Traces.AvailableDataPoints = AvailableDataPoints;
        let TraceData;
        (function (TraceData) {
            class Load extends bindingDeclaration_1.BindingDeclaration {
            }
            Load.scope = BindingScope.TraceDataControl;
            Load.id = "load";
            Load.bindingType = bindingType_1.BindingType.COMMAND;
            Load.dataType = "";
            TraceData.Load = Load;
            class Loaded extends bindingDeclaration_1.BindingDeclaration {
            }
            Loaded.scope = BindingScope.TraceDataControl;
            Loaded.id = "loaded";
            Loaded.bindingType = bindingType_1.BindingType.COMMAND_RESPONSE;
            Loaded.dataType = "";
            TraceData.Loaded = Loaded;
            class LoadingError extends bindingDeclaration_1.BindingDeclaration {
            }
            LoadingError.scope = BindingScope.TraceDataControl;
            LoadingError.id = "loading error";
            LoadingError.bindingType = bindingType_1.BindingType.COMMAND_RESPONSE;
            LoadingError.dataType = "";
            TraceData.LoadingError = LoadingError;
            class DataAvailable extends bindingDeclaration_1.BindingDeclaration {
            }
            DataAvailable.scope = BindingScope.TraceDataControl;
            DataAvailable.id = "data available";
            DataAvailable.bindingType = bindingType_1.BindingType.DATA;
            DataAvailable.dataType = "";
            TraceData.DataAvailable = DataAvailable;
        })(TraceData = Traces.TraceData || (Traces.TraceData = {}));
        let Configuration;
        (function (Configuration) {
            class DataPoints extends bindingDeclaration_1.BindingDeclaration {
            }
            DataPoints.scope = BindingScope.TraceConfig;
            DataPoints.id = "data points";
            DataPoints.bindingType = bindingType_1.BindingType.DATA;
            DataPoints.dataType = "";
            Configuration.DataPoints = DataPoints;
            class TimingInfos extends bindingDeclaration_1.BindingDeclaration {
            }
            TimingInfos.scope = BindingScope.TraceConfig;
            TimingInfos.id = "timing parameters";
            TimingInfos.bindingType = bindingType_1.BindingType.DATA;
            TimingInfos.dataType = "";
            Configuration.TimingInfos = TimingInfos;
            class StartTriggerInfos extends bindingDeclaration_1.BindingDeclaration {
            }
            StartTriggerInfos.scope = BindingScope.TraceConfig;
            StartTriggerInfos.id = "start trigger info";
            StartTriggerInfos.bindingType = bindingType_1.BindingType.DATA;
            StartTriggerInfos.dataType = "";
            Configuration.StartTriggerInfos = StartTriggerInfos;
        })(Configuration = Traces.Configuration || (Traces.Configuration = {}));
    })(Traces = exports.Traces || (exports.Traces = {}));
});
