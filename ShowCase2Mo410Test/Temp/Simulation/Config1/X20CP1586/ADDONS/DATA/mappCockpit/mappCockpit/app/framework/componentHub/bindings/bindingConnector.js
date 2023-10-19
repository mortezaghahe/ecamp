var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./binding", "../../../common/utilities/dataBox", "../../events", "../../store", "./bindingType"], function (require, exports, binding_1, dataBox_1, events_1, store_1, bindingType_1) {
    "use strict";
    var BindingConnector_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BindingConnector = void 0;
    /**
     * Implements an interface for binding/wiring components. A binding connector supports connecting components and exchanging data without any
     * direct dependencies.
     *
     * @export
     * @class BindingConnector
     */
    let BindingConnector = BindingConnector_1 = class BindingConnector {
        /**
         * Gets the store with the bindable properties
         *
         * @readonly
         * @static
         * @type {Store}
         * @memberof BindingConnector
         */
        static get sharedProperties() {
            return this._sharedProperties;
        }
        /**
         * Creates a binding according to the binding declaration
         *
         * @static
         * @param {Binding} bindingDeclaration
         * @returns {BindingConnector}
         * @memberof BindingConnector
         */
        static bind(bindingDeclaration) {
            const bindingDescriptor = bindingDeclaration.descriptor;
            if (bindingDeclaration.sourceKey) {
                this.bindSource(bindingDeclaration.component, bindingDescriptor);
            }
            if (bindingDeclaration.targetKey) {
                this.bindTarget(bindingDeclaration.component, bindingDescriptor);
            }
            // release component dependency
            bindingDeclaration.component = null;
        }
        /**
         *
         *
         * @param {Binding} bindingDeclaration
         * @memberof BindingConnector
         */
        static bindSource(component, bindingDescriptor) {
            // check if the component contains the source key
            if (bindingDescriptor.sourceKey in component) {
                if (component[bindingDescriptor.sourceKey] instanceof events_1.TypedEvent) {
                    this.bindSourceEvent(component, bindingDescriptor);
                }
                else if (typeof component[bindingDescriptor.sourceKey] === 'function') {
                    this.bindSourceMethod(component, bindingDescriptor);
                }
            }
            else {
                console.error("The binding key %o is not contained in %o! ", bindingDescriptor.sourceKey, component);
            }
        }
        /**
         * Binds the components source method ....
         *
         * @private
         * @param {Binding} bindingDescriptor
         * @param {*} sourceMember
         * @memberof BindingConnector
         */
        static bindSourceMethod(component, bindingDescriptor) {
            const originalSourceMethod = component[bindingDescriptor.sourceKey];
            // capture respectively intercept the source member call
            component[bindingDescriptor.sourceKey] = methodBindingInterceptor;
            let sourceMethodBinding = {
                "object": component,
                "originalSourceMethod": originalSourceMethod,
                "methodName": bindingDescriptor.sourceKey,
            };
            // register sourcebindings
            this._sourceBindings.push(sourceMethodBinding);
            // declares the method interceptor necessary for capturing the sender.
            function methodBindingInterceptor(methodArgs) {
                // capture the caller
                const caller = this;
                // call original method
                originalSourceMethod.call(caller, methodArgs);
                // forward the call to the binding logic
                BindingConnector_1.updateBindingValue(caller, bindingDescriptor, methodArgs);
            }
        }
        /**
         * Updates the bound value when the components intercepted (bound) method has been called
         *
         * @private
         * @param {Binding} bindingInfo
         * @param {*} args
         * @memberof BindingConnector
         */
        static updateBindingValue(caller, bindingDescriptor, args) {
            // pass the data within a reference box if required. This keeps the data and its members unmodified respectively passed without copying.
            let bindingArgs = bindingDescriptor.passByValue ? args : dataBox_1.DataBox.Box(args);
            // get the data type 
            const dataType = bindingDescriptor.dataType;
            // get the binding id for the target object
            const bindingId = bindingDescriptor.fullId;
            // temporal variable containing the computed value for forceUpdate
            let computedForceUpdateValue = false;
            // in case of a command or command response we need to pass a null object if no command args are provided. also forceUpdate needs to be true 
            // to force the command execution by a simulated value change!
            if (bindingDescriptor.type === bindingType_1.BindingType.COMMAND || bindingDescriptor.type === bindingType_1.BindingType.COMMAND_RESPONSE) {
                const nullObject = {};
                bindingArgs = bindingArgs ? bindingArgs : nullObject;
                computedForceUpdateValue = true;
            }
            else { // if the value is passed by reference, we force updating to avoid the comparision of complex objects with references 
                computedForceUpdateValue = !bindingDescriptor.passByValue;
            }
            // set previously computed value for forceUpdate to const variable
            const forceUpdate = computedForceUpdateValue;
            // update the corresponding binding value
            this.sharedProperties.update(caller, dataType, bindingArgs, bindingId, forceUpdate);
        }
        /**
         * Binds ac omponent event
         *
         * @private
         * @param {Binding} bindingDeclaration
         * @memberof BindingConnector
         */
        static bindSourceEvent(component, bindingDescriptor) {
            const sourceEvent = component[bindingDescriptor.sourceKey];
            sourceEvent.attach((sender, args) => this.onSourceEventRaised(bindingDescriptor, sender, args));
        }
        /**
         * Called when the components observed (bound) event has been raised
         *
         * @private
         * @param {Binding} bindingInfo
         * @param {*} sender
         * @param {*} eventArgs
         * @memberof BindingConnector
         */
        static onSourceEventRaised(bindingDescriptor, sender, eventArgs) {
            this.updateBindingValue(sender, bindingDescriptor, eventArgs);
        }
        /**
         * Binds a components property to a bindable value
         *
         * @param {Binding} bindingDeclaration
         * @memberof BindingConnector
         */
        static bindTarget(component, bindingDescriptor) {
            // check if the component contains the target key
            if (bindingDescriptor.targetKey in component) {
                // get the target instance 
                const connectionTarget = component;
                // get the data type 
                const dataType = bindingDescriptor.dataType;
                // get the binding id for the target object
                const bindingId = bindingDescriptor.fullId;
                // check if the endpoint is a function
                const endPointIsMethod = this.endPointIsFunction(connectionTarget, bindingDescriptor.targetKey);
                // check if the endpoint is a property
                const endPointIsProperty = this.endPointIsProperty(connectionTarget, bindingDescriptor.targetKey);
                // bind the target endpoint according to the handler type
                if (endPointIsMethod) {
                    // get the target handler
                    const targetBindingChangedHandler = connectionTarget[bindingDescriptor.targetKey];
                    // bind the method handler
                    this.bindTargetMethod(connectionTarget, targetBindingChangedHandler, dataType, bindingId);
                }
                else {
                    // bind the property handler
                    this.bindTargetProperty(connectionTarget, bindingDescriptor.targetKey, dataType, bindingId);
                }
            }
            else {
                console.error("ComponentBinding: The binding key %o is not contained in %o! ", bindingDescriptor.targetKey, component);
            }
        }
        /**
         * Binds a target method to a bindable value
         *
         * @private
         * @param {object} connectionTarget
         * @param {TBindableChangedHandler} targetBindingValueChangedHandler
         * @param {TConnectionDataType} dataType
         * @param {string} [bindingId=""]
         * @memberof BindingConnector
         */
        static bindTargetMethod(connectionTarget, targetBindingValueChangedHandler, dataType, bindingId = "") {
            // create the data changed handler for an update method call
            const bindingValueChangedHandler = (newValue, oldValue) => this.invokeTargetMethod(newValue, oldValue, connectionTarget, targetBindingValueChangedHandler, dataType);
            // observe the state change and forward the notification to the target handler
            this.sharedProperties.observe(connectionTarget, dataType, bindingValueChangedHandler, bindingId);
        }
        /**
         * Invokes the components target method when a bindable value has been changed.
         *
         * @private
         * @param {*} newValue
         * @param {*} oldValue
         * @param {object} connectionTarget
         * @param {TBindableChangedHandler} targetBindingValueChangedHandler
         * @param {TConnectionDataType} dataType
         * @memberof BindingConnector
         */
        static invokeTargetMethod(newValue, oldValue, connectionTarget, targetBindingValueChangedHandler, dataType) {
            const modifiedType = newValue ? typeof newValue === "object" ? newValue.constructor.name : typeof newValue : undefined;
            const targetDataType = dataType ? typeof dataType === "string" ? dataType : dataType.name : undefined;
            if (!dataType || (modifiedType === targetDataType)) {
                targetBindingValueChangedHandler.bind(connectionTarget)(newValue, oldValue);
            }
            else {
                console.error("ComponentBinding: could not invoke %o because data types do not match!", connectionTarget);
            }
        }
        /**
         * Binds a component property to a bindable value.
         *
         * @private
         * @param {object} bindingTarget
         * @param {string} targetMemberName
         * @param {TConnectionDataType} dataType
         * @param {string} bindingId
         * @memberof BindingConnector
         */
        static bindTargetProperty(bindingTarget, targetMemberName, dataType, bindingId) {
            // create the data changed handler for a property update
            const bindingValueChangedHandler = (newValue) => this.updateTargetProperty(bindingTarget, newValue, targetMemberName, dataType);
            // observe the data change and forward the notification to the property changed handler 
            this.sharedProperties.observe(bindingTarget, dataType, bindingValueChangedHandler, bindingId);
        }
        /**
         * Updates the components property when a bindable value has been changed.
         *
         * @private
         * @param {object} bindingTarget
         * @param {*} newValue
         * @param {string} targetMemberName
         * @param {TConnectionDataType} dataType
         * @memberof BindingConnector
         */
        static updateTargetProperty(bindingTarget, newValue, targetMemberName, dataType) {
            const modifiedType = newValue ? typeof newValue === "object" ? newValue.constructor.name : typeof newValue : undefined;
            const targetDataType = dataType ? typeof dataType === "string" ? dataType : dataType.name : undefined;
            //TODO: make sure that the modified type and binding type are matching
            // if (!dataType || (modifiedType === targetDataType)) {
            for (const key in bindingTarget) {
                if (key === targetMemberName) {
                    bindingTarget[targetMemberName] = newValue;
                }
            }
        }
        /**
         * Determines if the end point is a function
         *
         * @private
         * @static
         * @param {object} connectionTarget
         * @returns
         * @memberof BindingConnector
         */
        static endPointIsFunction(connectionTarget, targetMemberName) {
            // get the target handler
            const connectionPointHandler = connectionTarget[targetMemberName];
            // check if the endpoint is a function
            const endPointIsFunction = connectionPointHandler instanceof Function;
            return endPointIsFunction;
        }
        /**
         * Determines if the end point is a property
         *
         * @private
         * @static
         * @param {object} connectionTarget
         * @returns
         * @memberof BindingConnector
         */
        static endPointIsProperty(connectionTarget, targetMemberName) {
            // check if the endpoint is a property
            const targetBaseOwnsProperty = connectionTarget.constructor.prototype.hasOwnProperty(targetMemberName);
            const targetOwnsProperty = connectionTarget.constructor.prototype.hasOwnProperty(targetMemberName);
            const endPointIsProperty = targetOwnsProperty && !this.endPointIsFunction(connectionTarget, targetMemberName);
            return endPointIsProperty;
        }
        /**
         * Unbinds a whole component or the binding specified by the binding declaration
         *
         * @static
         * @param {(object | Binding)} bindingObject
         * @memberof BindingConnector
         */
        static unbind(bindingObject) {
            if (bindingObject instanceof binding_1.Binding) {
                this.unbindBinding(bindingObject);
            }
            else {
                this.unbindComponent(bindingObject);
            }
        }
        /**
         * Unbinds a specific binding
         *
         * @private
         * @static
         * @param {Binding} bindingDeclaration
         * @memberof BindingConnector
         */
        static unbindBinding(bindingDeclaration) {
            throw new Error("Method not implemented.");
        }
        /**
         * Unbinds all bindings related to the bound object
         *
         * @private
         * @static
         * @param {object} boundObject
         * @memberof BindingConnector
         */
        static unbindComponent(boundObject) {
            // detach the bound object from all shared properties
            this.sharedProperties.detach(boundObject);
            //// unconnect and restore intercepted methods.
            // get all objects source bindings
            const objectSourceBindings = this._sourceBindings.filter((sourceBinding) => { return sourceBinding.object === boundObject; });
            if (objectSourceBindings.length > 0) {
                this.unbindSourceMethods(objectSourceBindings);
            }
        }
        /**
         * Unbinds the intercepted methods and restores the original method
         *
         * @static
         * @param {SourceMethodBinding[]} objectSourceBindings
         * @memberof BindingConnector
         */
        static unbindSourceMethods(objectSourceBindings) {
            let deleted = [];
            objectSourceBindings.forEach((objectSourceBinding) => {
                // restore original method
                let interceptedObject = objectSourceBinding.object;
                interceptedObject[objectSourceBinding.methodName] = objectSourceBinding.originalSourceMethod;
                // delete registered method source binding
                const iDelete = this._sourceBindings.indexOf(objectSourceBinding);
                if (iDelete >= 0) {
                    deleted = deleted.concat(this._sourceBindings.splice(iDelete, 1));
                }
            });
            return deleted;
        }
        /**
         * Updates a shared data item specified by scope and id
         *
         * @static
         * @template TDataType
         * @param {object} caller
         * @param {TDataType} value
         * @param {string} sharedDataScope
         * @param {string} sharedDataId
         * @param {(import("../componentDataService").SharedDataType | undefined)} sharedDataType
         * @memberof BindingConnector
         */
        static updateSharedData(caller, value, sharedDataScope, sharedDataId, sharedDataType) {
            // get the full id
            const sharedId = sharedDataScope + '.' + sharedDataId;
            // update the corresponding binding value
            this.sharedProperties.update(caller, sharedDataType, value, sharedId, false);
        }
        /**
         * Reads a shared data item specified by scope and id
         *
         * @static
         * @template TDataType
         * @param {object} caller
         * @param {string} sharedDataScope
         * @param {string} sharedDataId
         * @param {TStoreItemConstructor} sharedDataType
         * @returns {TDataType}
         * @memberof BindingConnector
         */
        static readSharedData(caller, sharedDataScope, sharedDataId, sharedDataType) {
            // get the full id
            const sharedId = sharedDataScope + '.' + sharedDataId;
            // read and return the requested item from the store
            return this.sharedProperties.read(sharedDataType, sharedId);
        }
    };
    // holds the binding properties to be shared between source and target binding points as property objects in a store.
    BindingConnector._sharedProperties = new store_1.Store();
    BindingConnector._sourceBindings = new Array();
    BindingConnector = BindingConnector_1 = __decorate([
        mco.role()
    ], BindingConnector);
    exports.BindingConnector = BindingConnector;
});
