var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./cursorInfo", "./dynamicCursorSignalTemplate", "./cursorSignalDescriptor"], function (require, exports, cursorInfo_1, dynamicCursorSignalTemplate_1, cursorSignalDescriptor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XYCursorSignalDescriptor = void 0;
    let XYCursorSignalDescriptor = class XYCursorSignalDescriptor extends cursorSignalDescriptor_1.CursorSignalDescriptor {
        /**
         * Creates an instance of XYCursorSignalDescriptor
         * @memberof XYCursorSignalDescriptor
         */
        constructor(cursorInfo) {
            super(cursorInfo);
        }
        initializeCursorSignalInfos() {
            this._cursorInfoIds = [
                new dynamicCursorSignalTemplate_1.CursorDisplayInfoClass("y1", "y cursor 1", "The y position of cursor 1", cursorInfo_1.CursorDependency.Cursor1),
                new dynamicCursorSignalTemplate_1.CursorDisplayInfoClass("x1", "x cursor 1", "The x position of cursor 1", cursorInfo_1.CursorDependency.Cursor1),
                new dynamicCursorSignalTemplate_1.CursorDisplayInfoClass("t1", "t cursor 1", "The time of cursor 1", cursorInfo_1.CursorDependency.Cursor1),
                new dynamicCursorSignalTemplate_1.CursorDisplayInfoClass("y2", "y cursor 2", "The y position of cursor 2", cursorInfo_1.CursorDependency.Cursor2),
                new dynamicCursorSignalTemplate_1.CursorDisplayInfoClass("x2", "x cursor 2", "The x position of cursor 2", cursorInfo_1.CursorDependency.Cursor2),
                new dynamicCursorSignalTemplate_1.CursorDisplayInfoClass("t2", "t cursor 2", "The time of cursor 2", cursorInfo_1.CursorDependency.Cursor2),
                new dynamicCursorSignalTemplate_1.CursorDisplayInfoClass("yDiff", "y diff (y2-y1)", "The y difference between cursor 1 and cursor 2", cursorInfo_1.CursorDependency.BothCursors),
                new dynamicCursorSignalTemplate_1.CursorDisplayInfoClass("xDiff", "x diff (x2-x1)", "The x difference between cursor 1 and cursor 2", cursorInfo_1.CursorDependency.BothCursors),
                new dynamicCursorSignalTemplate_1.CursorDisplayInfoClass("tDiff", "t diff (t2-t1)", "The time difference between cursor 1 and cursor 2", cursorInfo_1.CursorDependency.BothCursors),
                new dynamicCursorSignalTemplate_1.CursorDisplayInfoClass("eucDist", "Euclidean Distance", "The euclidean distance between two points", cursorInfo_1.CursorDependency.BothCursors)
            ];
            this.visibleInfoIds = ['y1', 'y2', 'x1', 'x2'];
        }
        get cursorInfos() {
            return this._cursorInfos;
        }
        /**
         * This method is used by the DynamicCursorSignalTemplate to get hold
         * of all available cursor information available to the XYChart
         *
         * @returns {Array<CursorDisplayInfoClass>}
         * @memberof XYCursorSignalDescriptor
         */
        getAllCursorInfo() {
            return this._cursorInfoIds;
        }
    };
    XYCursorSignalDescriptor = __decorate([
        mco.role()
    ], XYCursorSignalDescriptor);
    exports.XYCursorSignalDescriptor = XYCursorSignalDescriptor;
});
