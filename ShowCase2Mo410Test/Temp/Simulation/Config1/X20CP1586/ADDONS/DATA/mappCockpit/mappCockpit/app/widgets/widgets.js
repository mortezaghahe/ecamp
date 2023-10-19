var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./mappCockpitWidget/mappCockpitWidget", "./watchablesWidget/watchablesWidget", "./methodsWidget/methodsWidget", "./messagesWidget/messagesWidget", "./configManagerWidget/configManagerWidget", "./signalManagerWidget/signalManagerWidget", "./chartManagerWidget/chartManagerWidget", "./traceViewWidget/traceViewWidget", "./chartViewWidget/chartViewWidget", "./splitterWidget/splitterWidget", "./componentViewWidget/componentViewWidget", "./methodListWidget/methodListWidget", "./methodParameterListWidget/methodParameterListWidget", "./dummyWidget/dummyWidget", "./loggerWidget/loggerWidget", "./mainNavigationWidget/mainNavigationWidget", "./sideBarWidget/sideBarWidget", "./topBarWidget/topBarWidget", "./startPageWidget/startPageWidget", "./componentOverviewWidget/componentOverviewWidget", "./traceOverviewWidget/traceOverviewWidget", "./traceConfigurationViewWidget/traceConfigurationViewWidget", "./traceControlWidget/traceControlWidget", "./traceConfigurationWidget/traceConfigurationWidget", "./traceConfigTimingWidget/traceConfigTimingWidget", "./traceConfigTriggerWidget/traceConfigTriggerWidget", "./traceConfigDatapointsWidget/traceConfigDatapointsWidget", "./loginWidget/loginWidget", "./toolsOverviewWidget/toolsOverviewWidget", "./cursorInfoWidget/cursorInfoWidget", "./chartViewWidget/toolbar/chartViewToolbar", "./mainContentWidget/mainContentWidget"], function (require, exports, mappCockpitWidget_1, watchablesWidget_1, methodsWidget_1, messagesWidget_1, configManagerWidget_1, signalManagerWidget_1, chartManagerWidget_1, traceViewWidget_1, chartViewWidget_1, splitterWidget_1, componentViewWidget_1, methodListWidget_1, methodParameterListWidget_1, dummyWidget_1, loggerWidget_1, mainNavigationWidget_1, sideBarWidget_1, topBarWidget_1, startPageWidget_1, componentOverviewWidget_1, traceOverviewWidget_1, traceConfigurationViewWidget_1, traceControlWidget_1, traceConfigurationWidget_1, traceConfigTimingWidget_1, traceConfigTriggerWidget_1, traceConfigDatapointsWidget_1, loginWidget_1, toolsOverviewWidget_1, cursorInfoWidget_1, chartViewToolbar_1, mainContentWidget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MainContentWidget = exports.ChartViewToolbar = exports.ToolsOverviewWidget = exports.CursorInfoWidget = exports.LoginWidget = exports.MainNavigationWidget = exports.TraceConfigDatapointsWidget = exports.TraceConfigTriggerWidget = exports.TraceConfigTimingWidget = exports.TraceConfigurationWidget = exports.TraceControlWidget = exports.TraceConfigurationViewWidget = exports.TraceOverviewWidget = exports.ComponentOverviewWidget = exports.StartPageWidget = exports.TopBarWidget = exports.SideBarWidget = exports.LoggerWidget = exports.DummyWidget = exports.MethodParameterListWidget = exports.MethodListWidget = exports.ComponentViewWidget = exports.SplitterWidget = exports.MessagesWidget = exports.ChartViewWidget = exports.TraceViewWidget = exports.ChartManagerWidget = exports.SignalManagerWidget = exports.ConfigManagerWidget = exports.MethodsWidget = exports.WatchablesWidget = exports.MappCockpitWidget = void 0;
    let MappCockpitWidget = class MappCockpitWidget {
        static create() { return new mappCockpitWidget_1.MappCockpitWidget(); }
        ;
    };
    MappCockpitWidget = __decorate([
        mco.role()
    ], MappCockpitWidget);
    exports.MappCockpitWidget = MappCockpitWidget;
    let WatchablesWidget = class WatchablesWidget {
        static create() { return new watchablesWidget_1.WatchablesWidget(); }
        ;
    };
    WatchablesWidget = __decorate([
        mco.role()
    ], WatchablesWidget);
    exports.WatchablesWidget = WatchablesWidget;
    let MethodsWidget = class MethodsWidget {
        static create() { return new methodsWidget_1.MethodsWidget(); }
        ;
    };
    MethodsWidget = __decorate([
        mco.role()
    ], MethodsWidget);
    exports.MethodsWidget = MethodsWidget;
    let MessagesWidget = class MessagesWidget {
        static create() { return new messagesWidget_1.MessagesWidget(); }
        ;
    };
    MessagesWidget = __decorate([
        mco.role()
    ], MessagesWidget);
    exports.MessagesWidget = MessagesWidget;
    let ConfigManagerWidget = class ConfigManagerWidget {
        static create() { return new configManagerWidget_1.ConfigManagerWidget(); }
        ;
    };
    ConfigManagerWidget = __decorate([
        mco.role()
    ], ConfigManagerWidget);
    exports.ConfigManagerWidget = ConfigManagerWidget;
    let SignalManagerWidget = class SignalManagerWidget {
        static create() { return new signalManagerWidget_1.SignalManagerWidget(); }
        ;
    };
    SignalManagerWidget = __decorate([
        mco.role()
    ], SignalManagerWidget);
    exports.SignalManagerWidget = SignalManagerWidget;
    let ChartManagerWidget = class ChartManagerWidget {
        static create() { return new chartManagerWidget_1.ChartManagerWidget(); }
        ;
    };
    ChartManagerWidget = __decorate([
        mco.role()
    ], ChartManagerWidget);
    exports.ChartManagerWidget = ChartManagerWidget;
    let TraceViewWidget = class TraceViewWidget {
        static create() { return new traceViewWidget_1.TraceViewWidget(); }
        ;
    };
    TraceViewWidget = __decorate([
        mco.role()
    ], TraceViewWidget);
    exports.TraceViewWidget = TraceViewWidget;
    let ChartViewWidget = class ChartViewWidget {
        static create() { return new chartViewWidget_1.ChartViewWidget(); }
        ;
    };
    ChartViewWidget = __decorate([
        mco.role()
    ], ChartViewWidget);
    exports.ChartViewWidget = ChartViewWidget;
    let SplitterWidget = class SplitterWidget {
        static create() { return new splitterWidget_1.SplitterWidget(); }
        ;
    };
    SplitterWidget = __decorate([
        mco.role()
    ], SplitterWidget);
    exports.SplitterWidget = SplitterWidget;
    let ComponentViewWidget = class ComponentViewWidget {
        static create() { return new componentViewWidget_1.ComponentViewWidget(); }
        ;
    };
    ComponentViewWidget = __decorate([
        mco.role()
    ], ComponentViewWidget);
    exports.ComponentViewWidget = ComponentViewWidget;
    let MethodListWidget = class MethodListWidget {
        static create() { return new methodListWidget_1.MethodListWidget(); }
        ;
    };
    MethodListWidget = __decorate([
        mco.role()
    ], MethodListWidget);
    exports.MethodListWidget = MethodListWidget;
    let MethodParameterListWidget = class MethodParameterListWidget {
        static create() { return new methodParameterListWidget_1.MethodParameterListWidget(); }
        ;
    };
    MethodParameterListWidget = __decorate([
        mco.role()
    ], MethodParameterListWidget);
    exports.MethodParameterListWidget = MethodParameterListWidget;
    let DummyWidget = class DummyWidget {
        static create() { return new dummyWidget_1.DummyWidget(); }
        ;
    };
    DummyWidget = __decorate([
        mco.role()
    ], DummyWidget);
    exports.DummyWidget = DummyWidget;
    let LoggerWidget = class LoggerWidget {
        static create() { return new loggerWidget_1.LoggerWidget(); }
        ;
    };
    LoggerWidget = __decorate([
        mco.role()
    ], LoggerWidget);
    exports.LoggerWidget = LoggerWidget;
    let MainNavigationWidget = class MainNavigationWidget {
        static create() { return new mainNavigationWidget_1.MainNavigationWidget(); }
        ;
    };
    MainNavigationWidget = __decorate([
        mco.role()
    ], MainNavigationWidget);
    exports.MainNavigationWidget = MainNavigationWidget;
    let SideBarWidget = class SideBarWidget {
        static create() { return new sideBarWidget_1.SideBarWidget(); }
        ;
    };
    SideBarWidget = __decorate([
        mco.role()
    ], SideBarWidget);
    exports.SideBarWidget = SideBarWidget;
    let TopBarWidget = class TopBarWidget {
        static create() { return new topBarWidget_1.TopBarWidget(); }
        ;
    };
    TopBarWidget = __decorate([
        mco.role()
    ], TopBarWidget);
    exports.TopBarWidget = TopBarWidget;
    let StartPageWidget = class StartPageWidget {
        static create() { return new startPageWidget_1.StartPageWidget(); }
        ;
    };
    StartPageWidget = __decorate([
        mco.role()
    ], StartPageWidget);
    exports.StartPageWidget = StartPageWidget;
    let ComponentOverviewWidget = class ComponentOverviewWidget {
        static create() { return new componentOverviewWidget_1.ComponentOverviewWidget(); }
        ;
    };
    ComponentOverviewWidget = __decorate([
        mco.role()
    ], ComponentOverviewWidget);
    exports.ComponentOverviewWidget = ComponentOverviewWidget;
    let TraceOverviewWidget = class TraceOverviewWidget {
        static create() { return new traceOverviewWidget_1.TraceOverviewWidget(); }
        ;
    };
    TraceOverviewWidget = __decorate([
        mco.role()
    ], TraceOverviewWidget);
    exports.TraceOverviewWidget = TraceOverviewWidget;
    let TraceConfigurationViewWidget = class TraceConfigurationViewWidget {
        static create() { return new traceConfigurationViewWidget_1.TraceConfigurationViewWidget(); }
        ;
    };
    TraceConfigurationViewWidget = __decorate([
        mco.role()
    ], TraceConfigurationViewWidget);
    exports.TraceConfigurationViewWidget = TraceConfigurationViewWidget;
    let TraceControlWidget = class TraceControlWidget {
        static create() { return new traceControlWidget_1.TraceControlWidget(); }
        ;
    };
    TraceControlWidget = __decorate([
        mco.role()
    ], TraceControlWidget);
    exports.TraceControlWidget = TraceControlWidget;
    let TraceConfigurationWidget = class TraceConfigurationWidget {
        static create() { return new traceConfigurationWidget_1.TraceConfigurationWidget(); }
        ;
    };
    TraceConfigurationWidget = __decorate([
        mco.role()
    ], TraceConfigurationWidget);
    exports.TraceConfigurationWidget = TraceConfigurationWidget;
    let TraceConfigTimingWidget = class TraceConfigTimingWidget {
        static create() { return new traceConfigTimingWidget_1.TraceConfigTimingWidget(); }
        ;
    };
    TraceConfigTimingWidget = __decorate([
        mco.role()
    ], TraceConfigTimingWidget);
    exports.TraceConfigTimingWidget = TraceConfigTimingWidget;
    let TraceConfigTriggerWidget = class TraceConfigTriggerWidget {
        static create() { return new traceConfigTriggerWidget_1.TraceConfigTriggerWidget(); }
        ;
    };
    TraceConfigTriggerWidget = __decorate([
        mco.role()
    ], TraceConfigTriggerWidget);
    exports.TraceConfigTriggerWidget = TraceConfigTriggerWidget;
    let TraceConfigDatapointsWidget = class TraceConfigDatapointsWidget {
        static create() { return new traceConfigDatapointsWidget_1.TraceConfigDatapointsWidget(); }
        ;
    };
    TraceConfigDatapointsWidget = __decorate([
        mco.role()
    ], TraceConfigDatapointsWidget);
    exports.TraceConfigDatapointsWidget = TraceConfigDatapointsWidget;
    let LoginWidget = class LoginWidget {
        static create() { return new loginWidget_1.LoginWidget(); }
        ;
    };
    LoginWidget = __decorate([
        mco.role()
    ], LoginWidget);
    exports.LoginWidget = LoginWidget;
    let ToolsOverviewWidget = class ToolsOverviewWidget {
        static create() { return new toolsOverviewWidget_1.ToolsOverviewWidget(); }
        ;
    };
    ToolsOverviewWidget = __decorate([
        mco.role()
    ], ToolsOverviewWidget);
    exports.ToolsOverviewWidget = ToolsOverviewWidget;
    let CursorInfoWidget = class CursorInfoWidget {
        static create() { return new cursorInfoWidget_1.CursorInfoWidget(); }
        ;
    };
    CursorInfoWidget = __decorate([
        mco.role()
    ], CursorInfoWidget);
    exports.CursorInfoWidget = CursorInfoWidget;
    let ChartViewToolbar = class ChartViewToolbar {
        static create() { return new chartViewToolbar_1.ChartViewToolbar; }
    };
    ChartViewToolbar = __decorate([
        mco.role()
    ], ChartViewToolbar);
    exports.ChartViewToolbar = ChartViewToolbar;
    let MainContentWidget = class MainContentWidget {
        static create() { return new mainContentWidget_1.MainContentWidget(); }
        ;
    };
    MainContentWidget = __decorate([
        mco.role()
    ], MainContentWidget);
    exports.MainContentWidget = MainContentWidget;
});
