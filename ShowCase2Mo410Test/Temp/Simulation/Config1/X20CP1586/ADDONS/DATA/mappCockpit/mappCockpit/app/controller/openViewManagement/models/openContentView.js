var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OpenContentView = void 0;
    /**
     * DataType that describes an open content view
     * A content view is a view that is shown in the main area (not navigation)
     *
     * @export
     * @class OpenContentView
     */
    let OpenContentView = class OpenContentView {
        constructor(componentID, name, viewType, groupTags) {
            this._viewID = componentID + viewType.toString();
            this._componentID = componentID;
            this._viewName = name;
            this._viewType = viewType;
            this._groupTags = groupTags;
            this._isActive = false;
        }
        get viewID() {
            return this._viewID;
        }
        set viewID(value) {
            this._viewID = value;
        }
        get componentID() {
            return this._componentID;
        }
        set componentID(value) {
            this._componentID = value;
        }
        get viewName() {
            return this._viewName;
        }
        set viewName(value) {
            this._viewName = value;
        }
        get viewType() {
            return this._viewType;
        }
        set viewType(value) {
            this._viewType = value;
        }
        get groupTags() {
            return this._groupTags;
        }
        set groupTags(value) {
            this._groupTags = value;
        }
        get isActive() {
            return this._isActive;
        }
        set isActive(value) {
            this._isActive = value;
        }
    };
    OpenContentView = __decorate([
        mco.role()
    ], OpenContentView);
    exports.OpenContentView = OpenContentView;
});
