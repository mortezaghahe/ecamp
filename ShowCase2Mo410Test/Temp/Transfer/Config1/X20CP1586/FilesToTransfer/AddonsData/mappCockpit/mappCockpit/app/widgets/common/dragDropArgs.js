var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DragDropArgs = void 0;
    let DragDropArgs = class DragDropArgs {
        get currentTarget() {
            return this._currentTarget;
        }
        get data() {
            return this._data;
        }
        get dragDropRepresentation() {
            return this._dragDropRepresentation;
        }
        set dragDropRepresentation(value) {
            this._dragDropRepresentation = value;
        }
        constructor(currentTraget, data, dragDropRepresentation = undefined) {
            this._currentTarget = currentTraget;
            this._data = data;
            this._dragDropRepresentation = dragDropRepresentation;
        }
    };
    DragDropArgs = __decorate([
        mco.role()
    ], DragDropArgs);
    exports.DragDropArgs = DragDropArgs;
});
