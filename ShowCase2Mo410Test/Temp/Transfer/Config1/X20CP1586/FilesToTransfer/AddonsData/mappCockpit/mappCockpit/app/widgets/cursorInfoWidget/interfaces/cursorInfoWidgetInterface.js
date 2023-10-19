define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorMovement = void 0;
    var CursorMovement;
    (function (CursorMovement) {
        CursorMovement[CursorMovement["Left"] = -1] = "Left";
        CursorMovement[CursorMovement["LeftExtended"] = -10] = "LeftExtended";
        CursorMovement[CursorMovement["Right"] = 1] = "Right";
        CursorMovement[CursorMovement["RightExtended"] = 10] = "RightExtended";
    })(CursorMovement || (CursorMovement = {}));
    exports.CursorMovement = CursorMovement;
});
