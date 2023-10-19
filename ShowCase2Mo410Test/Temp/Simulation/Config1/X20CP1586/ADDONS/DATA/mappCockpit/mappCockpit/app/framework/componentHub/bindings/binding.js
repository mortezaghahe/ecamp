var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./bindingType"], function (require, exports, bindingType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Binding = exports.BindingDescriptor = void 0;
    /**
     * Implements a binding descriptor
     *
     * @export
     * @class BindingDescriptor
     */
    let BindingDescriptor = class BindingDescriptor {
        constructor() {
            this.type = bindingType_1.BindingType.UNDEFINED;
            /**
             * The scope specifies which components can be connected with the the binding id's
             *
             * @type {(string|object)}
             * @memberof BindingDescriptor
             */
            this.scope = "";
            /**
             * Specifies the binding id for matching binding points.
             *
             * @type {string}
             * @memberof BindingDescriptor
             */
            this.id = "";
            /**
             * The target key specifies the name of a method or property to receive the bound data.
             *
             * @type {string}
             * @memberof BindingDescriptor
             */
            this.targetKey = "";
            /**
             *  The source key specifies the name of a method to be obeserved as triggers for modifications to be forwarded to bound components.
             *
             * @type {string}
             * @memberof BindingDescriptor
             */
            this.sourceKey = "";
            /**
             * The data type specifies the effective type to be exchanged between components.
             *
             * @type {TConnectionDataType}
             * @memberof BindingDescriptor
             */
            this.dataType = "";
            /**
             *  Binding values are passed by value as default. The parameter specifies that the value is passed and transported as copy only. This way references get lost respectively invalid. When the data contains references the
             *  parameter needs to be set to false. Beware that in this case the receivers are able to access and modify the original instances.
             *
             * @type {boolean}
             * @memberof BindingDescriptor
             */
            this.passByValue = true;
        }
        /**
         * Gets the id consisting of scope and id
         *
         * @readonly
         * @type {string}
         * @memberof BindingDescriptor
         */
        get fullId() {
            return this.scope + '.' + this.id;
        }
    };
    BindingDescriptor = __decorate([
        mco.role()
    ], BindingDescriptor);
    exports.BindingDescriptor = BindingDescriptor;
    /**
     * Implements a binding declaration
     *
     * @export
     * @class Binding
     */
    let Binding = class Binding extends BindingDescriptor {
        constructor() {
            super(...arguments);
            this.type = bindingType_1.BindingType.UNDEFINED;
        }
        get descriptor() {
            const copiedBindingDescriptor = new BindingDescriptor();
            copiedBindingDescriptor.type = this.type;
            copiedBindingDescriptor.scope = this.scope;
            copiedBindingDescriptor.id = this.id;
            copiedBindingDescriptor.dataType = this.dataType;
            copiedBindingDescriptor.sourceKey = this.sourceKey;
            copiedBindingDescriptor.targetKey = this.targetKey;
            copiedBindingDescriptor.passByValue = this.passByValue;
            return copiedBindingDescriptor;
        }
    };
    Binding = __decorate([
        mco.role()
    ], Binding);
    exports.Binding = Binding;
});
