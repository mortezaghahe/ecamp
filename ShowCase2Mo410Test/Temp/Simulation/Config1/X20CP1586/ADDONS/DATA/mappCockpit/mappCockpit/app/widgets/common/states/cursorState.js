var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorState = void 0;
    /**
     * holds and manages the state of a single cursor
     *
     * @class CursorState
     */
    let CursorState = class CursorState {
        /**
         * Creates an instance of CursorState.
         * @memberof CursorState
         */
        constructor(type) {
            // initialize states
            this.selected = false;
            this.active = false;
            this.hovered = false;
            this.position = undefined;
            this.type = type;
        }
    };
    CursorState = __decorate([
        mco.role()
    ], CursorState);
    exports.CursorState = CursorState;
});
