var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./bindingConnector", "./binding", "../../../common/componentBase/contextIds/contextIdsComponent"], function (require, exports, bindingConnector_1, binding_1, contextIdsComponent_1) {
    "use strict";
    var Bindings_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bindings = void 0;
    /**
     * The class provides creation and management of bindings
     *
     * @export
     * @class Bindings
     */
    let Bindings = Bindings_1 = class Bindings {
        /**
         * Binds an instance (binding source) to the specified binding target (external binding reference).
         *
         * @static
         * @param {Binding} bindingObject
         * @memberof Bindings
         */
        static bind(bindingObject) {
            bindingConnector_1.BindingConnector.bind(bindingObject);
        }
        /**
         * Unbinds a whole component or the binding specified by the binding declaration
         *
         * @static
         * @param {(object | Binding)} bindingObject
         * @memberof Bindings
         */
        static unbind(bindingObject) {
            bindingConnector_1.BindingConnector.unbind(bindingObject);
        }
        /**
         * Creates a binding with the given data and binds it
         *
         * @static
         * @param {IBindingDeclaration} bindingDeclaration
         * @param {*} component
         * @param {string} targetKey
         * @param {string} sourceKey
         * @param {boolean} [passByValue=true]
         * @param {(ComponentContext|undefined)} [context=undefined]
         * @memberof Bindings
         */
        static createByDecl(bindingDeclaration, component, targetKey, sourceKey, passByValue = true, context = undefined) {
            this.create(bindingDeclaration.bindingType, bindingDeclaration.dataType, component, bindingDeclaration.scope, bindingDeclaration.id, targetKey, sourceKey, passByValue, context);
        }
        /**
         * Creates a binding with the given data and binds it
         *
         * @static
         * @param {BindingType} type
         * @param {TConnectionDataType} dataType
         * @param {*} component
         * @param {(string | object)} scope
         * @param {string} id
         * @param {string} targetKey
         * @param {string} sourceKey
         * @param {boolean} [passByValue=true]
         * @param {(ComponentContext|undefined)} [context=undefined]
         * @memberof Bindings
         */
        static create(type, dataType, component, scope, id, targetKey, sourceKey, passByValue = true, context = undefined) {
            const binding = new binding_1.Binding();
            binding.type = type;
            binding.dataType = dataType;
            binding.component = component;
            binding.scope = scope;
            binding.id = this.replacePlaceHolders(id, context);
            binding.targetKey = targetKey;
            binding.sourceKey = sourceKey;
            binding.passByValue = passByValue;
            Bindings_1.bind(binding);
        }
        /**
         * Replaces placeholders in the binding id with the context data (currently only for ComponentId)
         *
         * @private
         * @static
         * @param {string} id
         * @param {(ComponentContext|undefined)} context
         * @returns {string}
         * @memberof Bindings
         */
        static replacePlaceHolders(id, context) {
            if (context == undefined) {
                return id;
            }
            let componentId = context.getContext(contextIdsComponent_1.ContextIdsComponent.ComponentId);
            if (componentId == undefined) {
                return id;
            }
            let componentIdPlaceHolder = "<%" + contextIdsComponent_1.ContextIdsComponent.ComponentId + "%>";
            return id.replace(componentIdPlaceHolder, componentId);
        }
    };
    Bindings = Bindings_1 = __decorate([
        mco.role()
    ], Bindings);
    exports.Bindings = Bindings;
});
