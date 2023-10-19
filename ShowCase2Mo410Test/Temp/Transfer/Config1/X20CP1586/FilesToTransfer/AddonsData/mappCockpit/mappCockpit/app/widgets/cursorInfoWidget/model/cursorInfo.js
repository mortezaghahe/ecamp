var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./cursorSignal"], function (require, exports, cursorSignal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorInfo = exports.CursorDependency = void 0;
    var CursorDependency;
    (function (CursorDependency) {
        CursorDependency[CursorDependency["Cursor1"] = 0] = "Cursor1";
        CursorDependency[CursorDependency["Cursor2"] = 1] = "Cursor2";
        CursorDependency[CursorDependency["BothCursors"] = 2] = "BothCursors";
    })(CursorDependency = exports.CursorDependency || (exports.CursorDependency = {}));
    let CursorInfo = class CursorInfo {
        get cursorDependency() {
            return this._cursorDependency;
        }
        constructor(id, name, description, parent, visible, cursorDependency) {
            this._name = "";
            this._id = "";
            this._visible = "true";
            this._description = "";
            this.value = "";
            this._id = id;
            this._name = name;
            this._description = description;
            this._parent = parent;
            this._visible = visible;
            this._cursorDependency = cursorDependency;
        }
        get name() {
            return this._name;
        }
        get id() {
            return this._id;
        }
        get visible() {
            return this._visible;
        }
        set visible(visible) {
            this._visible = visible;
        }
        get description() {
            return this._description;
        }
        /**
         * Returns the icon representation for this node for the tree grid
         *
         * @readonly
         * @type {string}
         * @memberof CursorInfo
         */
        get iconDefinition() {
            let leftMargin = 6; // Default will be used for cursor info selection view (no indent needed)
            // Return only place holder for icon to move the following text in the cell a little bit to the right
            if (this._parent instanceof cursorSignal_1.CursorSignal) {
                leftMargin = 14;
            }
            let cursorLine = "";
            if (this._cursorDependency == CursorDependency.Cursor1) {
                cursorLine = "border-left: 2px solid var(--main-cursor1-active-color);";
            }
            else if (this._cursorDependency == CursorDependency.Cursor2) {
                cursorLine = "border-left: 2px solid var(--main-cursor2-active-color);";
            }
            else if (this._cursorDependency == CursorDependency.BothCursors) {
                cursorLine = "border-left: 2px solid var(--main-cursor1-active-color); border-right: 2px solid var(--main-cursor2-active-color);";
            }
            return `<div class='e-doc' style='position: relative;height:16px;width:14px;margin:auto;float:left;margin-left:` + leftMargin + `px;margin-top:2px'>
        <div style='width: 5px; height: 16px; position: absolute; ` + cursorLine + `'></div></div>`;
        }
    };
    CursorInfo = __decorate([
        mco.role()
    ], CursorInfo);
    exports.CursorInfo = CursorInfo;
});
