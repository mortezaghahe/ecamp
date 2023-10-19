var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./bindingType", "./bindingDeclaration", "../../../common/componentBase/contextIds/contextIdsComponent"], function (require, exports, bindingType_1, bindingDeclaration_1, contextIdsComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Components = exports.BindingScope = void 0;
    // Defines all scopes for components
    let BindingScope = class BindingScope {
    };
    BindingScope.Component = "app::component";
    BindingScope.ComponentsProvider = "app::components provider";
    BindingScope = __decorate([
        mco.role()
    ], BindingScope);
    exports.BindingScope = BindingScope;
    // Defines all binding declarations for components
    var Components;
    (function (Components) {
        class UserComponentIds extends bindingDeclaration_1.BindingDeclaration {
        }
        UserComponentIds.scope = BindingScope.ComponentsProvider;
        UserComponentIds.id = "user component ids";
        UserComponentIds.bindingType = bindingType_1.BindingType.DATA;
        UserComponentIds.dataType = "";
        Components.UserComponentIds = UserComponentIds;
        let Component;
        (function (Component) {
            let componentIdPlaceHolder = "<%" + contextIdsComponent_1.ContextIdsComponent.ComponentId + "%>";
            class Connect extends bindingDeclaration_1.BindingDeclaration {
            }
            Connect.scope = BindingScope.Component;
            Connect.id = "connect";
            Connect.bindingType = bindingType_1.BindingType.COMMAND;
            Connect.dataType = "";
            Component.Connect = Connect;
            class Disconnect extends bindingDeclaration_1.BindingDeclaration {
            }
            Disconnect.scope = BindingScope.Component;
            Disconnect.id = "disconnect";
            Disconnect.bindingType = bindingType_1.BindingType.COMMAND;
            Disconnect.dataType = "";
            Component.Disconnect = Disconnect;
            class Messages extends bindingDeclaration_1.BindingDeclaration {
            }
            Messages.scope = BindingScope.Component;
            Messages.id = componentIdPlaceHolder + "message parameters";
            Messages.bindingType = bindingType_1.BindingType.DATA;
            Messages.dataType = "";
            Component.Messages = Messages;
            class Watchables extends bindingDeclaration_1.BindingDeclaration {
            }
            Watchables.scope = BindingScope.Component;
            Watchables.id = componentIdPlaceHolder + "watchable parameters";
            Watchables.bindingType = bindingType_1.BindingType.DATA;
            Watchables.dataType = "";
            Component.Watchables = Watchables;
            class WatchableStates extends bindingDeclaration_1.BindingDeclaration {
            }
            WatchableStates.scope = BindingScope.Component;
            WatchableStates.id = componentIdPlaceHolder + "watchable state parameters";
            WatchableStates.bindingType = bindingType_1.BindingType.DATA;
            WatchableStates.dataType = "";
            Component.WatchableStates = WatchableStates;
            class Configuration extends bindingDeclaration_1.BindingDeclaration {
            }
            Configuration.scope = BindingScope.Component;
            Configuration.id = componentIdPlaceHolder + "configuration parameters";
            Configuration.bindingType = bindingType_1.BindingType.DATA;
            Configuration.dataType = "";
            Component.Configuration = Configuration;
            class QuickCommands extends bindingDeclaration_1.BindingDeclaration {
            }
            QuickCommands.scope = BindingScope.Component;
            QuickCommands.id = componentIdPlaceHolder + "quick commands";
            QuickCommands.bindingType = bindingType_1.BindingType.DATA;
            QuickCommands.dataType = "";
            Component.QuickCommands = QuickCommands;
            class UserMethods extends bindingDeclaration_1.BindingDeclaration {
            }
            UserMethods.scope = BindingScope.Component;
            UserMethods.id = componentIdPlaceHolder + "user methods";
            UserMethods.bindingType = bindingType_1.BindingType.DATA;
            UserMethods.dataType = "";
            Component.UserMethods = UserMethods;
            class AllMethods extends bindingDeclaration_1.BindingDeclaration {
            }
            AllMethods.scope = BindingScope.Component;
            AllMethods.id = componentIdPlaceHolder + "all methods";
            AllMethods.bindingType = bindingType_1.BindingType.DATA;
            AllMethods.dataType = "";
            Component.AllMethods = AllMethods;
        })(Component = Components.Component || (Components.Component = {}));
    })(Components = exports.Components || (exports.Components = {}));
});
